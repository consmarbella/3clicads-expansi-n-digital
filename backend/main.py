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

# In-memory job storage (for simplicity, use Redis/DB in production)
jobs_db: Dict[str, Any] = {}

def process_campaign_job(job_id: str, request: CampaignRequest):
    results = []
    total = len(request.skus)
    
    # Optional: We could run scrape once and pass it down, but for now we'll let LangGraph handle it.
    
    for i, sku in enumerate(request.skus):
        jobs_db[job_id]["progress"] = i
        jobs_db[job_id]["status_text"] = f"Nodo 1 & 2: Analizando y redactando SKU {i+1}/{total}: {sku.producto}"
        
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
            # Run the graph (this is synchronous, takes 5-15 seconds per SKU)
            final_state = agency_graph.invoke(initial_state)
            
            # TODO: Nodo 4 - Real Google Ads API Validation would go here
            # For now, we assume the graph output is validated syntax-wise.
            
            results.append({
                "row": sku.dict(),
                "rsa": final_state["generated_rsa"]
            })
        except Exception as e:
             results.append({
                "row": sku.dict(),
                "rsa": {"error": str(e)}
            })
            
    jobs_db[job_id]["status"] = "completed"
    jobs_db[job_id]["progress"] = total
    jobs_db[job_id]["results"] = results

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
async def generate_campaign(request: CampaignRequest, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())
    jobs_db[job_id] = {
        "status": "processing",
        "progress": 0,
        "total": len(request.skus),
        "status_text": "Iniciando orquestación Multi-Agente...",
        "results": []
    }
    
    background_tasks.add_task(process_campaign_job, job_id, request)
    return {"job_id": job_id}

@app.get("/api/bulk/status/{job_id}")
async def get_job_status(job_id: str):
    if job_id not in jobs_db:
        return {"status": "error", "error": "Job not found"}
    return jobs_db[job_id]

# Endpoint to test basic connectivity
@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "True AI Agency OS Backend running"}
