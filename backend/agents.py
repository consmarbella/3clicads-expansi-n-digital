import os
import requests
from bs4 import BeautifulSoup
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import StateGraph, START, END
from typing import Dict, Any, TypedDict
from models import AgentState, RSA, ValidationFeedback

# Setup Gemini Model (using the fast 1.5 Flash for generation and auditing)
os.environ["GOOGLE_API_KEY"] = "AIzaSyBuYWYikeDWoNlr8cIfd49Tw9vb1V-7woc"
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.2)
llm_structured_rsa = llm.with_structured_output(RSA)
llm_structured_val = llm.with_structured_output(ValidationFeedback)

# TypedDict for LangGraph State
class GraphState(TypedDict):
    business_url: str
    business_name: str
    target_sku: dict
    scraped_context: str
    generated_rsa: dict
    validation_feedback: str
    is_valid: bool
    retry_count: int

# Nodo 1: Scraper
def scrape_context_node(state: GraphState) -> GraphState:
    url = state.get("business_url")
    if not url or "http" not in url:
        state["scraped_context"] = "No URL provided or invalid URL."
        return state
    
    try:
        # User-agent to prevent basic blocks
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract text from paragraphs, headers, and list items
        texts = soup.find_all(['p', 'h1', 'h2', 'h3', 'li'])
        content = " ".join([t.get_text(strip=True) for t in texts])
        
        # Limit context to avoid token explosion
        state["scraped_context"] = content[:5000]
    except Exception as e:
        state["scraped_context"] = f"Error scraping {url}: {str(e)}"
        
    return state

# Nodo 2: Generación Dinámica con Separación de Entidades
def generate_rsa_node(state: GraphState) -> GraphState:
    sku = state["target_sku"]
    context = state["scraped_context"]
    feedback = state.get("validation_feedback", "")
    
    prompt = f"""
    Eres un Elite Media Buyer de Google Ads.
    
    TAREA CRÍTICA: SEPARACIÓN DE ENTIDADES
    El usuario introdujo este término de búsqueda o SKU: "{sku.get('producto')}".
    Debes aislar dos entidades distintas antes de redactar:
    1. ENTIDAD DE SUBASTA (Para Keywords): Mantén la intención exacta de búsqueda (ej. "vender cupo dolar", "como cambiar saldo paypal").
    2. ENTIDAD DE PRESENTACIÓN (Para Anuncios): Extrae SOLO el objeto de valor o sustantivo principal (Ej: "Cupo en Dólares", "Saldo PayPal"). NUNCA inyectes el verbo de búsqueda en el título.
    
    CONTEXTO REAL EXTRAIDO DEL SITIO WEB:
    {context}
    
    REQUISITOS ESTRICTOS:
    1. HEADLINES: Exactamente 15 títulos persuasivos (Máx 30 caracteres). Usa la ENTIDAD DE PRESENTACIÓN (el sustantivo, no el verbo de búsqueda repetido).
    2. DESCRIPTIONS: Exactamente 4 descripciones (Máx 90 caracteres).
    3. KEYWORDS: 12-15 palabras clave en concordancia Exact o Phrase. Aquí SÍ debes usar la ENTIDAD DE SUBASTA.
    4. NEGATIVE KEYWORDS: ATENCIÓN AL EMBÚDO DE NEGOCIO. Si este negocio COMPRA el saldo/cupo de tarjetas de crédito o bancos específicos (ej. Falabella, Mach, Tenpo), ¡NUNCA pongas esas marcas como negativas! Solo pon como negativas cosas que realmente traigan tráfico basura (tutoriales, gratis, estafas, reclamos, cómo hacer, plantillas, empleos). Genera al menos 30 palabras negativas reales basadas en el contexto.
    
    {f'ATENCIÓN! DEBES CORREGIR ESTO BASADO EN LA AUDITORÍA ANTERIOR: {feedback}' if feedback else ''}
    """
    
    result = llm_structured_rsa.invoke(prompt)
    state["generated_rsa"] = result.dict()
    state["retry_count"] = state.get("retry_count", 0) + 1
    return state

# Nodo 3: Auditoría Ciega
def validate_rsa_node(state: GraphState) -> GraphState:
    rsa = state["generated_rsa"]
    
    prompt = f"""
    Eres el "QA Compliance Director" de una agencia de élite. Tu trabajo es auditar despiadadamente esta generación de Google Ads.
    
    Criterios de falla automática:
    1. Si algún título supera los 30 caracteres (CUENTA CADA LETRA Y ESPACIO).
    2. Si alguna descripción supera los 90 caracteres.
    3. Si el texto tiene sintaxis rota o repetitiva (ej: "Vende tu vender cupo").
    4. Si las palabras negativas son genéricas y no están adaptadas al rubro.
    
    DATOS A AUDITAR:
    Títulos: {rsa.get('headlines')}
    Descripciones: {rsa.get('descriptions')}
    Negativas: {rsa.get('negative_keywords')}
    
    Determina si es válido. Si no lo es, explica exactamente qué falló.
    """
    
    result = llm_structured_val.invoke(prompt)
    
    # Check internal manual overrides just in case the LLM misses counting
    manual_valid = True
    manual_feedback = []
    
    for i, h in enumerate(rsa.get('headlines', [])):
        if len(h) > 30:
            manual_valid = False
            manual_feedback.append(f"Título '{h}' tiene {len(h)} chars (>30).")
            
    for i, d in enumerate(rsa.get('descriptions', [])):
        if len(d) > 90:
            manual_valid = False
            manual_feedback.append(f"Descripción '{d}' tiene {len(d)} chars (>90).")
            
    if not result.is_valid or not manual_valid:
        state["is_valid"] = False
        state["validation_feedback"] = result.feedback + " " + " ".join(manual_feedback)
    else:
        state["is_valid"] = True
        state["validation_feedback"] = "Aprobado."
        
    return state

# Conditional Edge
def route_validation(state: GraphState) -> str:
    if state["is_valid"]:
        return END
    if state["retry_count"] >= 3:
        # Fallback to END if we tried 3 times to avoid infinite loops
        return END
    return "generate"

# Build the Graph
builder = StateGraph(GraphState)
builder.add_node("scrape", scrape_context_node)
builder.add_node("generate", generate_rsa_node)
builder.add_node("validate", validate_rsa_node)

builder.add_edge(START, "scrape")
builder.add_edge("scrape", "generate")
builder.add_edge("generate", "validate")
builder.add_conditional_edges("validate", route_validation)

agency_graph = builder.compile()
