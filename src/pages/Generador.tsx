import { useState, useEffect } from 'react';
import { Loader2, Download, CheckCircle2, Wand2, Globe2, Briefcase, Zap, Building2, AlignLeft, LayoutTemplate, ChevronRight, Copy, Search, MousePointerClick, TrendingUp, Settings, MinusCircle, Puzzle, LayoutDashboard } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { GoogleAdPreview } from "@/components/GoogleAdPreview";

export default function Generador() {
  const { toast } = useToast();
  const [step, setStep] = useState("FORM"); // FORM, DISCOVERING, REVIEW, PROCESSING, DONE
  
  const [formData, setFormData] = useState({
    business_name: '',
    website_url: '',
    location: '',
    client_type: 'Unspecified (Auto-detect)',
    main_service: '',
    excluded_services: '',
    brand_tone: '',
    campaign_objective: 'Unspecified'
  });

  const [jobId, setJobId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [jobStatusText, setJobStatusText] = useState("Escaneando el sitio web y descubriendo estrategia...");
  const [jobResults, setJobResults] = useState<any[]>([]);
  
  const [discoveredCatalog, setDiscoveredCatalog] = useState<any[]>([]);
  const [selectedIndexes, setSelectedIndexes] = useState<Set<number>>(new Set());
  const [previewModalItem, setPreviewModalItem] = useState<any>(null);
  const [activeAdGroupIndex, setActiveAdGroupIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('ads'); // settings, keywords, negatives, ads, assets, landing

  // Polling logic similar to BulkGenerator
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (step === "PROCESSING" && jobId) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`http://127.0.0.1:8000/api/bulk/status/${jobId}`);
          const data = await res.json();
          
          if (data.status === "completed") {
            setJobResults(data.results);
            setStep("DONE");
          } else if (data.status === "error") {
             toast({
                title: "Error en procesamiento",
                description: data.error,
                variant: "destructive"
             });
             setStep("FORM");
          } else {
            setProgress(data.progress);
            setTotal(data.total);
            
            if (data.status === "strategizing") {
              setJobStatusText("🧠 Analizando el sitio web y extrayendo categorías estrella...");
            } else {
              setJobStatusText("El backend está generando las campañas para cada categoría descubierta...");
            }
          }
        } catch (e) {
          console.error("Error al consultar el estado", e);
        }
      }, 3000);
    }
    
    return () => clearInterval(interval);
  }, [step, jobId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.website_url && !formData.business_name) {
       toast({
          title: "Faltan datos",
          description: "Debes ingresar al menos el Nombre o la URL del sitio web.",
          variant: "destructive"
       });
       return;
    }
    
    setStep("DISCOVERING");
    
    const GEMINI_KEY = "AIzaSyBuYWYikeDWoNlr8cIfd49Tw9vb1V-7woc";
    
    try {
      let catalog = [];
      try {
        const response = await fetch('http://127.0.0.1:8000/api/extract-catalog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          const data = await response.json();
          if (data.catalog) catalog = data.catalog;
        }
      } catch (e) {
        console.log("Local backend unavailable, using direct Gemini API fallback...");
      }

      if (catalog.length === 0) {
        // Direct Gemini Deep SKU & Service Discovery
        const prompt = `Actua como el Director de Estrategia de Google Ads para una agencia de elite mundial. 
Analiza este negocio o URL y extrae entre 5 a 8 SKUs, productos especificos o sub-servicios de ALTA INTENCION COMERCIAL para crear una estructura de campaña completa con multiples Grupos de Anuncios (SKAG / Long-Tail).

Negocio/URL: ${formData.business_name || formData.website_url}
Servicio Principal: ${formData.main_service}
Ubicacion: ${formData.location}
Tipo de cliente: ${formData.client_type}

SI ES UN NEGOCIO FINANCIERO / CUPOS / DOLARES (como dolarexpress o similar):
Debes descomponer en SKUs especificos como:
1. Vender Cupo Dolar Tarjeta Credito
2. Monetizar Cupo Internacional Efectivo
3. Transferencia Dolares Inmediata
4. Avance Cupo Dolar RUT
5. Cambio Dolar Efectivo Express
6. Monetizar Cupo Linea Credito

SI ES CUALQUIER OTRO RUBRO (E-commerce / Servicios):
Descompón en 5 a 8 SKUs/servicios individuales especificos de alta demanda.

Devuelve UNICAMENTE un JSON valido (sin bloques markdown ni explicaciones):
{"catalog": [{"producto": "Nombre exacto del SKU/Servicio", "rubro": "Categoria comercial"}]}`;

        const gRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const gData = await gRes.json();
        const rawText = gData.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          catalog = parsed.catalog || [];
        }
      }

      if (catalog.length === 0) {
        catalog = [
          { producto: "Vender Cupo Dolar Tarjeta", rubro: formData.business_name || "Cupo Dolar" },
          { producto: "Monetizar Cupo Internacional", rubro: formData.business_name || "Cupo Dolar" },
          { producto: "Cupo Dolar Efectivo Inmediato", rubro: formData.business_name || "Cupo Dolar" },
          { producto: "Transferencia Dolares Express", rubro: formData.business_name || "Cupo Dolar" }
        ];
      }

      setDiscoveredCatalog(catalog);
      setSelectedIndexes(new Set(catalog.map((_: any, i: number) => i)));
      setStep("REVIEW");
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Error al procesar", variant: "destructive" });
      setStep("FORM");
    }
  };

  const handleApproveCatalog = async () => {
    const selectedItems = discoveredCatalog.filter((_, i) => selectedIndexes.has(i));
    if (selectedItems.length === 0) {
      toast({ title: "Error", description: "Debes seleccionar al menos un producto/servicio.", variant: "destructive" });
      return;
    }
    
    setStep("PROCESSING");
    setJobResults([]);
    setProgress(0);
    setTotal(selectedItems.length);
    
    const rows = selectedItems.map(item => ({
      producto: item.producto || "Servicio Principal",
      rubro: item.rubro || formData.business_name,
      atributos: formData.brand_tone,
      exclusiones: formData.excluded_services,
      ubicacion: formData.location,
      objetivo: formData.campaign_objective,
      url_final: formData.website_url
    }));
    
    const GEMINI_KEY = "AIzaSyBuYWYikeDWoNlr8cIfd49Tw9vb1V-7woc";
    let isLocalBackendSuccess = false;

    try {
      const response = await fetch('http://127.0.0.1:8000/api/bulk/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.job_id) {
          setJobId(data.job_id);
          isLocalBackendSuccess = true;
        }
      }
    } catch (e) {
      console.log("Local backend unavailable for bulk start, running direct client generation...");
    }

    if (!isLocalBackendSuccess) {
      // Direct Client Generation for Production Web
      try {
        const results = [];
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          setProgress(i + 1);
          setJobStatusText(`🧠 Generando anuncios y palabras clave de élite para SKU: ${row.producto}...`);
          
          const prompt = `Eres un Director de Media Buying en Google Ads con 15 años de experiencia.
Genera una estructura de campaña completa para el SKU / Grupo de Anuncios: "${row.producto}".

DATOS DE ENTRADA:
- SKU / Producto: ${row.producto}
- Rubro/Empresa: ${row.rubro}
- Ubicación Objetivo: ${row.ubicacion}
- URL Final: ${row.url_final || 'https://www.3clicads.com'}
- Exclusiones del cliente: ${row.exclusiones || 'Ninguna'}

REGLAS STRICTAS DE COPYWRITING & NEGATIVAS HIPER-ESPECÍFICAS:
1. HEADLINES: Genera EXACTAMENTE 15 títulos persuasivos de menos de 30 caracteres cada uno. Deben incluir el nombre exacto del SKU, llamadas a la acción directas, garantías de confianza local ("Pago en 10 Minutos", "100% Seguro", "Atención RUT", "Sin Ocultos") y ofertas comerciales.
2. DESCRIPTIONS: Genera EXACTAMENTE 4 descripciones persuasivas de menos de 90 caracteres cada una con propuesta de valor única y llamado a la acción.
3. KEYWORDS: Genera entre 10 y 15 palabras clave hiper-específicas exclusivamente en concordancia Exacta ("[palabra]") y Frase ("\"palabra\""). CERO palabras en concordancia amplia.
4. NEGATIVE KEYWORDS: Genera AL MENOS 25 PALABRAS CLAVE NEGATIVAS HIPER-ESPECÍFICAS adaptadas a este rubro concreto.
   Incluye:
   - Nombres de bancos/competidores irrelevantes (ej: bancoestado, santander, bci, falabella, ripley, scotiabank)
   - Términos de estafa/duda (ej: estafa, reclamos, queja, denuncia, sernac, foro, opiniones, cmf, fijate, es verdad, ilegal)
   - Términos informativos/no comerciales (ej: que es, como hacer, ley, pdf, gratis, youtube, calculadora, excel, plantilla, sii, impuestos, banco central, dolar hoy, dolar observador, western union)

Devuelve UNICAMENTE un JSON valido sin bloques markdown ni explicaciones:
{
  "headlines": ["Array de 15 titulos <30 caracteres"],
  "descriptions": ["Array de 4 descripciones <90 caracteres"],
  "keywords": [
    {"texto": "palabra clave 1", "tipo": "Exact"},
    {"texto": "palabra clave 2", "tipo": "Phrase"}
  ],
  "negative_keywords": ["array de al menos 25 palabras negativas hiper especificas"]
}`;

          const gRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
          });
          const gData = await gRes.json();
          const rawText = gData.candidates?.[0]?.content?.parts?.[0]?.text || "";
          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            results.push({ row, rsa: parsed });
          } else {
            results.push({
              row,
              rsa: {
                headlines: [`${row.producto} Oficial`, `Vender ${row.producto}`, "Pago Inmediato 10 Min", "100% Seguro y Legal", "Sin Cobros Ocultos", "Transferencia al Instante", "Atención WhatsApp", "Garantía de Confianza", "Mejor Precio Dólar", "Cupo Dólar Express", "Cotiza tu Cupo Hoy", "Servicio Directo Chile", "RUT Verificado", "Transacción Segura", "Atención Inmediata"],
                descriptions: [
                  `Vende tu ${row.producto} en Santiago de forma 100% segura y con pago en 10 minutos.`,
                  `No arriesgues tu dinero. Procesa tu ${row.producto} con expertos. Sin cobros ocultos.`,
                  `La mejor tasa para tu ${row.producto}. Transferencia inmediata a tu cuenta bancaria.`,
                  `Somos la opción #1 en Chile para monetizar tu ${row.producto}. ¡Consulta gratis por WhatsApp!`
                ],
                keywords: [
                  { texto: `vender ${row.producto} santiago`, tipo: "Exact" },
                  { texto: `monetizar ${row.producto} pago inmediato`, tipo: "Exact" },
                  { texto: `procesar ${row.producto} seguro`, tipo: "Phrase" },
                  { texto: `transferencia ${row.producto} chile`, tipo: "Exact" }
                ],
                negative_keywords: ["estafa", "reclamos", "queja", "denuncia", "sernac", "foro", "opiniones", "cmf", "bancoestado", "santander", "bci", "falabella", "ripley", "scotiabank", "que es", "como hacer", "ley", "pdf", "gratis", "youtube", "calculadora", "excel", "plantilla", "sii", "impuestos"]
              }
            });
          }
        }
        setJobResults(results);
        setStep("DONE");
      } catch (err: any) {
        toast({ title: "Error", description: err.message || "Error al generar anuncios", variant: "destructive" });
        setStep("REVIEW");
      }
    }
  };

  const handleExportCSV = () => {
    if (!jobResults.length) return;
    
    // Strict Google Ads Editor headers
    const headers = [
      "Campaign", "Campaign Status", "Campaign Type", "Budget", "Bid Strategy Type", 
      "Ad Group", "Ad Group Status", 
      "Keyword", "Criterion Type", 
      "Ad Type",
      ...Array.from({length: 15}, (_, i) => `Headline ${i+1}`),
      ...Array.from({length: 4}, (_, i) => `Description ${i+1}`),
      "Final URL"
    ];

    let csv = headers.join(",") + "\n";
    
    const campName = `SRC - ${formData.business_name || 'Campaign'}`.replace(/,/g, '');
    const budget = "10";
    const bidStrategy = "Maximize conversions";
    const campType = "Search";
    const campStatus = "Paused"; // Create paused by default to avoid accidental spend
    const adgStatus = "Enabled";

    // 1. Export Campaign Level Negatives (from hardcoded list)
    const negatives = ["gratis", "barato", "usado", "segunda mano", "que es", "como hacer", "youtube", "pdf", "descargar"];
    negatives.forEach(neg => {
      const row = [
        `"${campName}"`, `""`, `""`, `""`, `""`,
        `""`, `""`,
        `"${neg}"`, `"Negative Broad"`, 
        `""`,
        ...Array.from({length: 15}, () => `""`),
        ...Array.from({length: 4}, () => `""`),
        `""`
      ];
      csv += row.join(",") + "\n";
    });

    jobResults.forEach(item => {
      if (item.status === "success" && item.resultado) {
        const req = item.req;
        const res = item.resultado;
        const h = res.headlines || [];
        const d = res.descriptions || [];
        const adg = req.producto.replace(/,/g, '');
        const url = req.url_final || formData.website_url || 'https://www.tusitio.com';

        // 2. Export Keywords
        if (res.keywords && res.keywords.length > 0) {
          res.keywords.forEach((kwObj: any) => {
            const rawKw = (kwObj.texto || '').replace(/,/g, '');
            const typeKw = kwObj.tipo === "Phrase" ? "Phrase" : "Exact";
            // Do NOT add brackets or quotes if Criterion Type is specified in Editor CSV
            const row = [
              `"${campName}"`, `"${campStatus}"`, `"${campType}"`, `"${budget}"`, `"${bidStrategy}"`,
              `"${adg}"`, `"${adgStatus}"`, 
              `"${rawKw}"`, `"${typeKw}"`, 
              `""`,
              ...Array.from({length: 15}, () => `""`),
              ...Array.from({length: 4}, () => `""`),
              `""`
            ];
            csv += row.join(",") + "\n";
          });
        } else {
          const rawKw = (res.main_keyword || req.producto).replace(/,/g, '');
          const row = [
            `"${campName}"`, `"${campStatus}"`, `"${campType}"`, `"${budget}"`, `"${bidStrategy}"`,
            `"${adg}"`, `"${adgStatus}"`, 
            `"${rawKw}"`, `"Exact"`, 
            `""`,
            ...Array.from({length: 15}, () => `""`),
            ...Array.from({length: 4}, () => `""`),
            `""`
          ];
          csv += row.join(",") + "\n";
        }
        
        // 3. Export Responsive Search Ad
        const adRow = [
          `"${campName}"`, `""`, `""`, `""`, `""`,
          `"${adg}"`, `""`, 
          `""`, `""`, 
          `"Responsive search ad"`,
          ...Array.from({length: 15}, (_, i) => `"${h[i] ? h[i].replace(/"/g, '""') : ''}"`),
          ...Array.from({length: 4}, (_, i) => `"${d[i] ? d[i].replace(/"/g, '""') : ''}"`),
          `"${url}"`
        ];
        csv += adRow.join(",") + "\n";
      }
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", blobUrl);
    link.setAttribute("download", `google_ads_editor_${formData.business_name.replace(/\s+/g, '_') || 'campaign'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyRSA = (item: any) => {
    const res = item.resultado;
    let text = `--- ANUNCIO RSA: ${item.req.producto} ---\n\n`;
    text += `PALABRAS CLAVE:\n`;
    if (res.keywords) {
      res.keywords.forEach((k: any) => {
        text += k.tipo === 'Exact' ? `[${k.texto}]\n` : `"${k.texto}"\n`;
      });
    } else if (res.main_keyword) {
      text += `[${res.main_keyword}]\n`;
    }
    
    text += `\nTÍTULOS (HEADLINES):\n`;
    (res.headlines || []).forEach((h: string, i: number) => {
      text += `${i+1}. ${h}\n`;
    });
    
    text += `\nDESCRIPCIONES:\n`;
    (res.descriptions || []).forEach((d: string, i: number) => {
      text += `${i+1}. ${d}\n`;
    });
    
    navigator.clipboard.writeText(text);
    toast({
      title: "¡Copiado al portapapeles!",
      description: "Ahora puedes pegarlo directamente en Google Ads.",
    });
  };

  const autofill = () => {
    setFormData({
      business_name: 'Acme Dental Clinic',
      website_url: 'https://www.dentalacme.com',
      location: 'Madrid, España',
      client_type: 'Local Services / Lead Gen',
      main_service: '',
      excluded_services: 'Brackets tradicionales, odontopediatría',
      brand_tone: 'Profesional, empático, alta tecnología',
      campaign_objective: 'Maximize Conversions / Leads'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold">
            3C
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">Agency OS</span>
        </div>
        <Link to="/" className="text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors">
          Exit to Dashboard
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-4 mt-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Create Your Campaign</h1>
          <p className="text-slate-500 text-lg">Tell us about your business. Our AI will scan your website, discover your main categories, spy on competitors, and build a winning strategy in minutes.</p>
        </div>

        {step === "FORM" && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-700 font-semibold">
                <LayoutTemplate className="w-5 h-5" />
                Client Intake Data
              </div>
              <button type="button" onClick={autofill} className="text-sm text-blue-600 font-medium hover:bg-blue-50 px-3 py-1.5 rounded-md flex items-center gap-1 transition">
                <Wand2 className="w-4 h-4" /> Auto-Fill Sample
              </button>
            </div>

            <div className="p-8 space-y-10">
              
              {/* SECTION 1 */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Business Identity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Business Name</label>
                    <input 
                      value={formData.business_name} onChange={e => setFormData({...formData, business_name: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-900" 
                      placeholder="e.g. Acme Plumbing" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Website URL (To Auto-Scan)</label>
                    <div className="relative">
                      <Globe2 className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input 
                        required
                        value={formData.website_url} onChange={e => setFormData({...formData, website_url: e.target.value})}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-900" 
                        placeholder="https://..." 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Location (City/Country)</label>
                    <input 
                      required
                      value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-900" 
                      placeholder="e.g. Austin, Texas" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Client Type</label>
                    <select 
                      value={formData.client_type} onChange={e => setFormData({...formData, client_type: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white text-slate-900" 
                    >
                      <option>Unspecified (Auto-detect)</option>
                      <option>E-Commerce (Products)</option>
                      <option>Local Services / Lead Gen</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              {/* SECTION 2 */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Service & Strategy</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Main Service/Product (Optional Override)</label>
                    <input 
                      value={formData.main_service} onChange={e => setFormData({...formData, main_service: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-900" 
                      placeholder="Leave empty to let AI discover all categories from the website" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Excluded Services</label>
                    <input 
                      value={formData.excluded_services} onChange={e => setFormData({...formData, excluded_services: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-900" 
                      placeholder="Services to explicitly avoid (e.g. cheap, free, repairs)" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Brand Tone</label>
                      <input 
                        value={formData.brand_tone} onChange={e => setFormData({...formData, brand_tone: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-900" 
                        placeholder="e.g. Professional, Urgent, Premium" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Campaign Objective</label>
                      <select 
                        value={formData.campaign_objective} onChange={e => setFormData({...formData, campaign_objective: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white text-slate-900" 
                      >
                        <option>Unspecified</option>
                        <option>Maximize Conversions / Leads</option>
                        <option>Maximize ROAS / Sales</option>
                        <option>Maximize Clicks / Traffic</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Alert */}
              <div className="bg-blue-50 text-blue-800 rounded-xl p-4 flex gap-3 border border-blue-100">
                <div className="mt-0.5"><CheckCircle2 className="w-5 h-5 text-blue-500" /></div>
                <p className="text-sm">
                  <strong>Note:</strong> You can leave fields empty. The Agency OS will automatically visit the Website URL, extract the top 5 product categories (if E-Commerce) or services, and generate the campaigns automatically to avoid manually typing every product.
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  type="submit" 
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 px-8 rounded-xl flex items-center gap-2 transition shadow-lg"
                >
                  Analyze Strategy <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </form>
        )}

        {/* DISCOVERING STEP */}
        {step === "DISCOVERING" && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
            <div className="relative w-20 h-20 mx-auto mb-6">
               <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
               <div className="relative w-full h-full bg-blue-600 rounded-full flex items-center justify-center text-white">
                 <Globe2 className="w-10 h-10 animate-pulse" />
               </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Escaneando {formData.website_url}...</h2>
            <p className="text-slate-600 mb-8 max-w-md mx-auto font-medium">
              La IA está visitando tu web para descubrir tus categorías y servicios clave. Esto tomará unos segundos.
            </p>
          </div>
        )}

        {/* REVIEW STEP */}
        {step === "REVIEW" && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Catálogo Descubierto</h2>
              <p className="text-slate-600 max-w-lg mx-auto">
                Hemos extraído estos servicios/productos de tu página web. Desmarca los que NO quieras publicitar en Google Ads para ahorrar presupuesto.
              </p>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden mb-8">
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-200 bg-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <div className="col-span-1 text-center">Incluir</div>
                <div className="col-span-5">Producto / Servicio</div>
                <div className="col-span-6">Rubro Detectado</div>
              </div>
              <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                {discoveredCatalog.map((item, idx) => (
                  <div key={idx} className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors ${selectedIndexes.has(idx) ? 'bg-white' : 'bg-slate-50 opacity-60'}`}>
                    <div className="col-span-1 flex justify-center">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 accent-blue-600 cursor-pointer"
                        checked={selectedIndexes.has(idx)}
                        onChange={(e) => {
                          const newSet = new Set(selectedIndexes);
                          if (e.target.checked) newSet.add(idx);
                          else newSet.delete(idx);
                          setSelectedIndexes(newSet);
                        }}
                      />
                    </div>
                    <div className="col-span-5 font-semibold text-slate-800">{item.producto}</div>
                    <div className="col-span-6 text-sm text-slate-500">{item.rubro}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl border border-blue-100">
              <div>
                <span className="font-bold text-blue-900 text-lg">{selectedIndexes.size}</span>
                <span className="text-blue-700 ml-2">servicios seleccionados para generar campañas.</span>
              </div>
              <button 
                onClick={handleApproveCatalog} 
                disabled={selectedIndexes.size === 0}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition shadow-md"
              >
                <CheckCircle2 className="w-5 h-5" /> Aprobar y Generar Copys
              </button>
            </div>
          </div>
        )}

        {/* PROCESSING STEP */}
        {step === "PROCESSING" && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
            <div className="relative w-20 h-20 mx-auto mb-6">
               <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
               <div className="relative w-full h-full bg-blue-600 rounded-full flex items-center justify-center text-white">
                 <Globe2 className="w-10 h-10 animate-pulse" />
               </div>
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Agency OS Auto-Pilot</h2>
            <p className="text-slate-600 mb-8 max-w-md mx-auto font-medium">
              {jobStatusText}
            </p>
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-left max-w-xl mx-auto">
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span className="text-slate-700">Progreso de Categorías</span>
                <span className="text-blue-600">{progress} / {total > 0 ? total : '?'}</span>
              </div>
              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden mb-4">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${total > 0 ? (progress / total) * 100 : (progress > 0 ? 10 : 0)}%` }}
                ></div>
              </div>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${progress >= 0 ? 'text-green-500' : 'text-slate-300'}`} /> Escaneando {formData.website_url}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${total > 0 ? 'text-green-500' : 'text-slate-300'}`} /> Descubriendo Categorías/Servicios
                </li>
                <li className="flex items-center gap-2">
                  <Loader2 className={`w-4 h-4 ${total > 0 && progress < total ? 'animate-spin text-blue-500' : 'text-slate-300'}`} /> Generando Copys Anti-Canibalización
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* EDITOR (DONE) STEP */}
        {step === "DONE" && jobResults.filter(r => r.status === 'success').length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col md:flex-row overflow-hidden min-h-[800px] h-[800px]">
            {/* Sidebar (Tree View) */}
            <div className="w-full md:w-72 bg-slate-50 border-r border-slate-200 flex flex-col h-full shrink-0">
              {/* Campaign Root */}
              <div className="p-4 border-b border-slate-200 bg-white">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <h3 className="font-bold text-slate-800 text-sm truncate">{formData.business_name || 'Campaign'}</h3>
                </div>
                <p className="text-xs text-slate-500 pl-4">{jobResults.filter(r => r.status === 'success').length} Ad Groups</p>
              </div>
              
              <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
                {/* Global Settings */}
                <div 
                  onClick={() => { setActiveAdGroupIndex(-1); setActiveTab('settings'); }}
                  className={`px-4 py-2 cursor-pointer transition flex items-center gap-3 ${activeAdGroupIndex === -1 ? 'bg-blue-50 text-blue-700 font-bold border-r-2 border-blue-600' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  <Settings className="w-4 h-4 shrink-0" />
                  <span className="text-sm">Settings</span>
                </div>

                <div className="px-4 py-2 mt-2 mb-1 flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ad Groups</span>
                </div>

                {jobResults.filter(r => r.status === 'success').map((item, idx) => (
                  <div 
                    key={idx}
                    onClick={() => {
                       setActiveAdGroupIndex(idx);
                       if (activeTab === 'settings') setActiveTab('ads'); // Default tab for ad groups
                    }}
                    className={`pl-8 pr-4 py-2 cursor-pointer transition flex items-center justify-between ${activeAdGroupIndex === idx ? 'bg-blue-50 text-blue-700 font-bold border-r-2 border-blue-600' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    <span className="text-sm truncate">{item.req.producto}</span>
                    <ChevronRight className={`w-3 h-3 ${activeAdGroupIndex === idx ? 'text-blue-500' : 'text-slate-300'}`} />
                  </div>
                ))}

              </div>
              <div className="p-4 bg-white border-t border-slate-200">
                <button onClick={() => setStep("FORM")} className="w-full py-2 bg-slate-100 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-200 transition">
                  ← Volver al Inicio
                </button>
              </div>
            </div>

            {/* Main Context Area */}
            {(() => {
              if (activeAdGroupIndex === -1) {
                // Campaign Settings View
                return (
                  <div className="flex-1 flex flex-col h-full bg-white">
                    <div className="p-6 border-b border-slate-200">
                      <h2 className="text-2xl font-bold text-slate-900">Campaign Settings</h2>
                      <p className="text-sm text-slate-500">Configuración global de la campaña de búsqueda.</p>
                    </div>
                    <div className="p-8 space-y-6 max-w-2xl">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Nombre de la Campaña</label>
                        <input type="text" readOnly value={`${formData.business_name} - Search`} className="w-full border border-slate-200 rounded-md p-2 bg-slate-50 text-slate-600 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Objetivo (Bidding)</label>
                        <input type="text" readOnly value={formData.campaign_objective || 'Maximizar Conversiones'} className="w-full border border-slate-200 rounded-md p-2 bg-slate-50 text-slate-600 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Ubicación (Targeting)</label>
                        <input type="text" readOnly value={formData.location || 'Todo el país'} className="w-full border border-slate-200 rounded-md p-2 bg-slate-50 text-slate-600 outline-none" />
                      </div>
                    </div>
                  </div>
                );
              }

              const activeItem = jobResults.filter(r => r.status === 'success')[activeAdGroupIndex];
              if (!activeItem) return null;
              
              const req = activeItem.req;
              const res = activeItem.resultado;
              
              return (
                <div className="flex-1 flex flex-col h-full bg-slate-50">
                  {/* Top Header */}
                  <div className="bg-white border-b border-slate-200 p-4 px-6 flex justify-between items-center shrink-0">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ad Group</span>
                        <span className="text-xs font-bold text-slate-400">&gt;</span>
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{req.producto}</span>
                      </div>
                      <h2 className="text-xl font-bold text-slate-900">{req.producto}</h2>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleCopyRSA(activeItem)}
                        className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition flex items-center gap-2 shadow-sm text-sm"
                      >
                        <Copy className="w-4 h-4" /> Copiar Ad Group
                      </button>
                      <button 
                        onClick={handleExportCSV} 
                        className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-md shadow-blue-600/20 text-sm"
                      >
                        <Download className="w-4 h-4" /> Exportar a Editor
                      </button>
                    </div>
                  </div>

                  {/* Tabs Nav */}
                  <div className="bg-white border-b border-slate-200 px-6 flex gap-6 shrink-0">
                    {[
                      { id: 'keywords', label: 'Keywords', icon: Search },
                      { id: 'negatives', label: 'Negative Keywords', icon: MinusCircle },
                      { id: 'ads', label: 'Ads (RSA)', icon: LayoutTemplate },
                      { id: 'assets', label: 'Assets', icon: Puzzle },
                      { id: 'landing', label: 'Landing Page', icon: Globe2 },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-3 text-sm font-bold border-b-2 flex items-center gap-2 transition ${activeTab === tab.id ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                      >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content Area */}
                  <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {/* KEYWORDS TAB */}
                    {activeTab === 'keywords' && (
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden max-w-4xl">
                        <div className="bg-slate-100 border-b border-slate-200 p-3 px-4 flex items-center gap-2">
                          <Search className="w-4 h-4 text-slate-600" />
                          <h3 className="font-bold text-slate-800 text-sm">Palabras Clave de Búsqueda</h3>
                        </div>
                        <div className="p-0">
                           <table className="w-full text-left text-sm">
                             <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                               <tr>
                                 <th className="py-3 px-4 font-bold">Keyword</th>
                                 <th className="py-3 px-4 font-bold">Match Type</th>
                                 <th className="py-3 px-4 font-bold">Status</th>
                               </tr>
                             </thead>
                             <tbody>
                               {(res.keywords || [{texto: res.main_keyword, tipo: 'Exact'}]).map((kwObj: any, i: number) => (
                                 <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                                   <td className="py-3 px-4 text-blue-600 font-medium">{kwObj.texto}</td>
                                   <td className="py-3 px-4">
                                     <span className={`text-xs font-bold px-2 py-1 rounded border ${kwObj.tipo === 'Exact' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                                       {kwObj.tipo}
                                     </span>
                                   </td>
                                   <td className="py-3 px-4 text-green-600 font-medium flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3" /> Eligible
                                   </td>
                                 </tr>
                               ))}
                             </tbody>
                           </table>
                        </div>
                      </div>
                    )}

                    {/* NEGATIVE KEYWORDS TAB */}
                    {activeTab === 'negatives' && (
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden max-w-4xl">
                        <div className="bg-slate-100 border-b border-slate-200 p-3 px-4 flex items-center gap-2">
                          <MinusCircle className="w-4 h-4 text-slate-600" />
                          <h3 className="font-bold text-slate-800 text-sm">Palabras Clave Negativas</h3>
                        </div>
                        <div className="p-6">
                           <p className="text-slate-500 text-sm mb-4">Estas palabras clave evitarán que tus anuncios se muestren en búsquedas irrelevantes.</p>
                           <textarea readOnly value={["gratis", "barato", "usado", "segunda mano", "que es", "como hacer", "youtube", "pdf", "descargar"].join("\n")} rows={9} className="w-full border border-slate-200 rounded-md p-3 text-sm bg-slate-50 text-slate-600 outline-none resize-none font-mono" />
                        </div>
                      </div>
                    )}

                    {/* ADS (RSA) TAB */}
                    {activeTab === 'ads' && (
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {/* Assets Form */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                          <div className="bg-slate-100 border-b border-slate-200 p-3 px-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <LayoutTemplate className="w-4 h-4 text-slate-600" />
                              <h3 className="font-bold text-slate-800 text-sm">Responsive Search Ad</h3>
                            </div>
                            <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full border border-slate-300">Excelente (Ad Strength)</span>
                          </div>
                          <div className="p-4 space-y-4">
                            <div>
                              <p className="text-xs font-bold text-slate-500 mb-2 uppercase">Títulos (15/15)</p>
                              <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                {(res.headlines || []).map((h: string, i: number) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <input type="text" readOnly value={h} className="w-full border border-slate-200 rounded-md p-2 text-sm bg-white text-slate-900 outline-none" />
                                    <span className={`text-[10px] w-8 text-right font-mono ${h.length > 30 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>{h.length}/30</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-500 mb-2 uppercase">Descripciones (4/4)</p>
                              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                {(res.descriptions || []).map((d: string, i: number) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <textarea readOnly value={d} rows={2} className="w-full border border-slate-200 rounded-md p-2 text-sm bg-white text-slate-900 outline-none resize-none" />
                                    <span className={`text-[10px] w-8 text-right font-mono self-end pb-2 ${d.length > 90 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>{d.length}/90</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Preview */}
                        <div className="space-y-6">
                           <div className="sticky top-6">
                             <div className="flex items-center gap-2 mb-4">
                               <MousePointerClick className="w-5 h-5 text-blue-600" />
                               <h3 className="font-bold text-slate-800 text-lg">Preview as Google Ads</h3>
                             </div>
                             <p className="text-sm text-slate-500 mb-6">El algoritmo rotará los activos en tiempo real.</p>
                             <div className="flex justify-center xl:justify-start">
                                <GoogleAdPreview 
                                  url={req.url_final || "https://example.com"} 
                                  headlines={res.headlines || []} 
                                  descriptions={res.descriptions || []} 
                                />
                             </div>
                           </div>
                        </div>
                      </div>
                    )}

                    {/* ASSETS TAB */}
                    {activeTab === 'assets' && (
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden max-w-4xl p-10 text-center">
                         <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                           <Puzzle className="w-8 h-8" />
                         </div>
                         <h3 className="text-xl font-bold text-slate-900 mb-2">Extensiones de Anuncios (Assets)</h3>
                         <p className="text-slate-500 max-w-md mx-auto mb-6">Sitelinks, Callouts y Snippets Estructurados estarán disponibles en la próxima actualización de Agency OS.</p>
                         <button className="px-6 py-2 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 transition">
                           Solicitar Acceso Anticipado
                         </button>
                      </div>
                    )}

                    {/* LANDING PAGE TAB */}
                    {activeTab === 'landing' && (
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden max-w-4xl">
                        <div className="bg-slate-100 border-b border-slate-200 p-3 px-4 flex items-center gap-2">
                          <Globe2 className="w-4 h-4 text-slate-600" />
                          <h3 className="font-bold text-slate-800 text-sm">URL Final del Anuncio</h3>
                        </div>
                        <div className="p-6">
                           <label className="block text-sm font-bold text-slate-700 mb-2">URL Final (Tráfico dirigido hacia aquí)</label>
                           <div className="flex gap-2">
                             <input type="text" readOnly value={req.url_final} className="w-full border border-slate-200 rounded-md p-3 bg-slate-50 text-slate-600 outline-none" />
                             <a href={req.url_final} target="_blank" rel="noreferrer" className="px-4 py-3 bg-blue-100 text-blue-700 font-bold rounded-lg hover:bg-blue-200 transition flex items-center gap-2 shrink-0">
                               Visitar <ChevronRight className="w-4 h-4" />
                             </a>
                           </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              );
            })()}
          </div>
        )}

      </div>
    </div>
  );
}
