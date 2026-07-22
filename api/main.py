from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from agents import agency_graph
import uuid

app = FastAPI(title="3ClicAds Agency OS Backend")

# Allow CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SKUInput(BaseModel):
    producto: str
    rubro: str
    search_volume: str = "Unknown"
    cpc_estimate: str = "Unknown"
    competition: str = "Alta"
    ubicacion: str = ""
    url_final: str = ""

class CampaignRequest(BaseModel):
    business_name: str
    website_url: str
    skus: List[SKUInput]



@app.post("/api/extract-catalog")
async def extract_catalog(request: dict):
    # This replaces the fake hardcoded frontend logic with a real LLM extraction
    # In a fully integrated version, this would also hit Google Ads API to get real search volumes.
    # For now, it extracts the real entities from the business name/URL.
    from langchain_google_genai import ChatGoogleGenerativeAI
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0)
    
    prompt = f"""
    Eres un Estratega de Google Ads. Analiza este negocio: {request.get('business_name')} / {request.get('website_url')}.
    Extrae exactamente 3 a 5 SKUs (Categorías de Servicio o Producto) reales que este negocio ofrezca.
    IMPORTANTE: La clave 'producto' DEBE SER SOLO EL SUSTANTIVO (La Entidad de Presentación), NUNCA incluyas verbos como "Vender", "Comprar", "Cotizar". 
    Ejemplo correcto: "Cupo en Dólares", "Avance en Efectivo".
    Ejemplo INCORRECTO: "Vender cupo dolar".
    
    Devuelve un JSON estricto con esta estructura:
    {{
      "catalog": [
         {{"producto": "Nombre del sustantivo", "rubro": "Categoría", "search_volume": "Consultando API...", "cpc_estimate": "Consultando API...", "competition": "Media"}}
      ]
    }}
    """
    
    try:
        res = llm.invoke(prompt)
        import json, re
        match = re.search(r'\{.*\}', res.content, re.DOTALL)
        if match:
            data = json.loads(match.group(0))
            return data
        return {"catalog": []}
    except Exception as e:
        return {"catalog": []}

@app.post("/api/generate-campaign")
async def generate_campaign(request: CampaignRequest):
    results = []
    
    for i, sku in enumerate(request.skus):
        # Initialize graph state
        initial_state = {
            "business_url": request.website_url,
            "business_name": request.business_name,
            "target_sku": sku.dict(),
            "scraped_context": "",
            "generated_rsa": {},
            "validation_feedback": "",
            "is_valid": False,
            "retry_count": 0
        }
        
        try:
            # Run the graph synchronously
            final_state = agency_graph.invoke(initial_state)
            
            results.append({
                "row": sku.dict(),
                "rsa": final_state["generated_rsa"]
            })
        except Exception as e:
             results.append({
                "row": sku.dict(),
                "rsa": {"error": str(e)}
            })
            
    return {"status": "completed", "results": results}

# Endpoint to test basic connectivity
@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "True AI Agency OS Backend running"}
