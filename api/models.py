from pydantic import BaseModel, Field
from typing import List

class Keyword(BaseModel):
    texto: str = Field(description="La palabra clave en si")
    tipo: str = Field(description="El tipo de concordancia: 'Exact' o 'Phrase'")

class RSA(BaseModel):
    headlines: List[str] = Field(
        description="Lista de exactamente 15 títulos persuasivos, cada uno con un máximo estricto de 30 caracteres."
    )
    descriptions: List[str] = Field(
        description="Lista de exactamente 4 descripciones persuasivas, cada una con un máximo estricto de 90 caracteres."
    )
    keywords: List[Keyword] = Field(
        description="Lista de 12 a 15 palabras clave hiper-específicas en concordancia Exact o Phrase."
    )
    negative_keywords: List[str] = Field(
        description="Lista de al menos 30 palabras clave negativas hiper-específicas, derivadas del análisis real de exclusiones y FAQs."
    )

class SKUInfo(BaseModel):
    producto: str
    rubro: str
    search_volume: str
    cpc_estimate: str
    competition: str

class AdGroupResult(BaseModel):
    row: SKUInfo
    rsa: RSA

class ValidationFeedback(BaseModel):
    is_valid: bool = Field(description="True si los RSAs y Negativas cumplen absolutamente todos los criterios estructurales, sintácticos y de límites de caracteres.")
    feedback: str = Field(description="Si is_valid es False, explicación técnica de por qué falló y qué debe reescribirse.")
    
class AgentState(BaseModel):
    business_url: str
    business_name: str
    scraped_context: str = ""
    target_sku: SKUInfo = None
    generated_rsa: RSA = None
    validation_feedback: str = ""
    is_valid: bool = False
