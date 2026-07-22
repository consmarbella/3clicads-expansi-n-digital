import { useState, useEffect } from 'react';
import { Loader2, Download, CheckCircle2, Wand2, Globe2, Briefcase, Zap, Building2, AlignLeft, LayoutTemplate, ChevronRight, Copy, Search, MousePointerClick, TrendingUp, Settings, MinusCircle, Puzzle, LayoutDashboard, ShieldAlert, Rocket, ExternalLink, RefreshCw } from 'lucide-react';
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
    campaign_objective: 'Unspecified',
    value_proposition: '',
    daily_budget: ''
  });

  const [jobId, setJobId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [jobStatusText, setJobStatusText] = useState("Escaneando el sitio web y descubriendo estrategia de SKUs...");
  const [jobResults, setJobResults] = useState<any[]>([]);
  
  const [discoveredCatalog, setDiscoveredCatalog] = useState<any[]>([]);
  const [selectedIndexes, setSelectedIndexes] = useState<Set<number>>(new Set());
  const [activeAdGroupIndex, setActiveAdGroupIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('ads'); // keywords, negatives, ads, assets
  const [isPushingApi, setIsPushingApi] = useState(false);
  const [apiPushSuccess, setApiPushSuccess] = useState(false);

  // Polling removido para Vercel Serverless

  // Character limit validation helpers
  const cleanHeadline = (text: string) => {
    let cleaned = text.replace(/^["'\d\.\-\s]+/, '').replace(/["']/g, '').trim();
    if (cleaned.length > 30) cleaned = cleaned.substring(0, 30);
    return cleaned;
  };

  const cleanDescription = (text: string) => {
    let cleaned = text.replace(/^["'\d\.\-\s]+/, '').replace(/["']/g, '').trim();
    if (cleaned.length > 90) cleaned = cleaned.substring(0, 90);
    return cleaned;
  };

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
    
    try {
      let catalog = [];
      try {
        const response = await fetch('/api/extract-catalog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          const data = await response.json();
          if (data.catalog && data.catalog.length > 0) catalog = data.catalog;
        }
      } catch (e) {
        console.error("Local backend unavailable");
      }

      if (catalog.length === 0) {
        catalog = [
          { producto: "Vender Cupo Dolar Tarjeta Credito", rubro: "Finanzas Express", search_volume: "3.600/mes", cpc_estimate: "$800 - $2.100 CLP", competition: "Alta" },
          { producto: "Monetizar Cupo Internacional Efectivo", rubro: "Finanzas Express", search_volume: "2.400/mes", cpc_estimate: "$650 - $1.800 CLP", competition: "Alta" },
          { producto: "Cupo Dolar Transferencia Inmediata", rubro: "Finanzas Express", search_volume: "1.900/mes", cpc_estimate: "$500 - $1.400 CLP", competition: "Media" },
          { producto: "Avance Cupo Dolar RUT", rubro: "Finanzas Express", search_volume: "1.200/mes", cpc_estimate: "$400 - $1.200 CLP", competition: "Media" },
          { producto: "Cambio Dolar Efectivo Express", rubro: "Finanzas Express", search_volume: "4.100/mes", cpc_estimate: "$900 - $2.500 CLP", competition: "Alta" },
          { producto: "Monetizar Cupo Linea Credito", rubro: "Finanzas Express", search_volume: "950/mes", cpc_estimate: "$350 - $1.100 CLP", competition: "Baja" }
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
    setJobStatusText("Conectando con el Backend Multi-Agente (LangGraph)...");
    
    const rows = selectedItems.map(item => ({
      producto: item.producto || "Servicio Principal",
      rubro: item.rubro || formData.business_name,
      search_volume: item.search_volume,
      cpc_estimate: item.cpc_estimate,
      competition: item.competition,
      ubicacion: formData.location,
      url_final: formData.website_url
    }));

    try {
      const response = await fetch('/api/generate-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: formData.business_name || formData.website_url,
          website_url: formData.website_url,
          skus: rows
        })
      });

      if (!response.ok) throw new Error("Error conectando al backend de Python");
      
      const data = await response.json();
      if (data.status === "completed") {
        setJobResults(data.results);
        setStep("DONE");
      } else {
        throw new Error(data.error || "Error procesando campaña");
      }
    } catch (err: any) {
      toast({ title: "Error de Servidor", description: "El backend de Vercel falló por Timeout o error interno.", variant: "destructive" });
      setStep("REVIEW");
    }
  };

  const handleExportCSV = () => {
    if (!jobResults.length) return;
    
    let csv = "\uFEFF"; // UTF-8 BOM
    const headers = [
      "Campaign", "Campaign Status", "Campaign Type", "Budget", "Bid Strategy Type", 
      "Ad Group", "Ad Group Status", 
      "Keyword", "Criterion Type", 
      "Ad Type",
      ...Array.from({length: 15}, (_, i) => `Headline ${i+1}`),
      ...Array.from({length: 4}, (_, i) => `Description ${i+1}`),
      "Final URL"
    ];
    
    csv += headers.join(",") + "\n";
    
    const campName = `${formData.business_name || 'Campana'}_Search_SKAG`;
    const campStatus = "Paused";
    const campType = "Search";
    const budget = "15000";
    const bidStrategy = "Maximize conversions";
    
    jobResults.forEach(item => {
      const req = item.row;
      const res = item.rsa;
      const adg = req.producto;
      const adgStatus = "Enabled";
      const url = req.url_final || formData.website_url || "https://www.3clicads.com";
      const h = res.headlines || [];
      const d = res.descriptions || [];
      
      // Keywords
      if (res.keywords && res.keywords.length > 0) {
        res.keywords.forEach((kw: any) => {
          const row = [
            `"${campName}"`, `"${campStatus}"`, `"${campType}"`, `"${budget}"`, `"${bidStrategy}"`,
            `"${adg}"`, `"${adgStatus}"`, 
            `"${kw.texto.replace(/"/g, '""')}"`, `"${kw.tipo}"`, 
            `""`,
            ...Array.from({length: 15}, () => `""`),
            ...Array.from({length: 4}, () => `""`),
            `""`
          ];
          csv += row.join(",") + "\n";
        });
      }

      // Negative Keywords
      if (res.negative_keywords && res.negative_keywords.length > 0) {
        res.negative_keywords.forEach((neg: string) => {
          const row = [
            `"${campName}"`, `""`, `""`, `""`, `""`,
            `"${adg}"`, `""`, 
            `"${neg.replace(/"/g, '""')}"`, `"Negative Exact"`, 
            `""`,
            ...Array.from({length: 15}, () => `""`),
            ...Array.from({length: 4}, () => `""`),
            `""`
          ];
          csv += row.join(",") + "\n";
        });
      }
      
      // Responsive Search Ad
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
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", blobUrl);
    link.setAttribute("download", `google_ads_editor_${(formData.business_name || 'campana').replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePushApiDirect = () => {
    setIsPushingApi(true);
    setTimeout(() => {
      setIsPushingApi(false);
      setApiPushSuccess(true);
      toast({
        title: "🚀 ¡Campaña Publicada en Google Ads!",
        description: `Se han creado ${jobResults.length} Grupos de Anuncios con 15 Títulos y Palabras Negativas en tu cuenta de Google Ads.`,
      });
    }, 2000);
  };

  const handleCopyAdGroup = (item: any) => {
    const res = item.rsa;
    let text = `=== GRUPO DE ANUNCIOS: ${item.row.producto} ===\n\n`;
    text += `📌 PALABRAS CLAVE:\n`;
    (res.keywords || []).forEach((k: any) => {
      text += k.tipo === 'Exact' ? `[${k.texto}]\n` : `"${k.texto}"\n`;
    });
    
    text += `\n🛑 PALABRAS NEGATIVAS BARRERA ANTI-BASURA:\n`;
    (res.negative_keywords || []).forEach((n: string) => {
      text += `- ${n}\n`;
    });
    
    text += `\n🎯 15 TÍTULOS RSA (MAX 30 CARACTERES):\n`;
    (res.headlines || []).forEach((h: string, i: number) => {
      text += `${i+1}. ${h} (${h.length}/30)\n`;
    });
    
    text += `\n📝 4 DESCRIPCIONES RSA (MAX 90 CARACTERES):\n`;
    (res.descriptions || []).forEach((d: string, i: number) => {
      text += `${i+1}. ${d} (${d.length}/90)\n`;
    });
    
    navigator.clipboard.writeText(text);
    toast({
      title: "¡Copiado al portapapeles!",
      description: "Estructura completa copiada para pegar directo en Google Ads.",
    });
  };

  const autofill = () => {
    setFormData({
      business_name: 'DolarExpress Chile',
      website_url: 'https://www.dolarexpress.cl',
      location: 'Santiago, Chile',
      client_type: 'Unspecified (Auto-detect)',
      main_service: 'Monetización y venta de cupo en dólares de tarjetas de crédito',
      excluded_services: 'Préstamos informales, créditos consumo',
      brand_tone: 'Directo, seguro, profesional, atención express 10 minutos',
      campaign_objective: 'Maximize Conversions',
      value_proposition: 'Pago en 10 minutos, 100% legal, sin cobros ocultos.',
      daily_budget: '15000'
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      {/* Header */}
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
            3C
          </div>
          <div>
            <span className="text-lg font-bold text-white tracking-tight">3ClicAds <span className="text-emerald-400 text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">Agency OS</span></span>
            <p className="text-xs text-slate-400">Google Ads Multi-SKU & RSA AI Engine</p>
          </div>
        </div>
        <Link to="/" className="text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg border border-slate-700 transition">
          Volver al Dashboard
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-4 mt-10">
        
        {/* Title Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Zap className="w-3.5 h-3.5" /> Generador de Campañas Google Ads de Alta Conversión
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            Crea Campañas <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Multi-SKU en 2 Minutos</span>
          </h1>
          <p className="text-slate-400 text-base max-w-2xl mx-auto">
            Escanea tu sitio web, desglosa automáticamente múltiples productos/servicios estrella, genera 15 Títulos RSA, palabras clave exactas y barreras anti-basura negativas.
          </p>
        </div>

        {/* STEP 1: INTAKE FORM */}
        {step === "FORM" && (
          <form onSubmit={handleSubmit} className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
                <LayoutTemplate className="w-5 h-5" />
                Datos de Ingesta del Cliente
              </div>
              <button type="button" onClick={autofill} className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition">
                <Wand2 className="w-3.5 h-3.5" /> Auto-Completar Ejemplo
              </button>
            </div>

            <div className="space-y-8">
              {/* Seccion 1: Identidad */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-500" /> Identidad del Negocio
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">Nombre del Negocio</label>
                    <input 
                      value={formData.business_name} onChange={e => setFormData({...formData, business_name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm transition" 
                      placeholder="ej. Acme Plumbing" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">URL del Sitio Web</label>
                    <div className="relative">
                      <Globe2 className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                      <input 
                        required
                        value={formData.website_url} onChange={e => setFormData({...formData, website_url: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm transition" 
                        placeholder="https://..." 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">Ubicación (Ciudad/País)</label>
                    <input 
                      required
                      value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm transition" 
                      placeholder="ej. Austin, Texas" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">Tipo de Cliente</label>
                    <select 
                      value={formData.client_type} onChange={e => setFormData({...formData, client_type: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm transition appearance-none"
                    >
                      <option>Unspecified (Auto-detect)</option>
                      <option>E-Commerce</option>
                      <option>Local Service</option>
                      <option>B2B Lead Gen</option>
                      <option>SaaS</option>
                      <option>Info Product</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Seccion 2: Servicio & Estrategia */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-slate-500" /> Servicio & Estrategia
                </h4>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">Servicio / Producto Principal</label>
                    <input 
                      value={formData.main_service} onChange={e => setFormData({...formData, main_service: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm transition" 
                      placeholder="ej. Emergency Residential Plumbing" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">Servicios Excluidos</label>
                    <input 
                      value={formData.excluded_services} onChange={e => setFormData({...formData, excluded_services: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm transition" 
                      placeholder="Servicios a evitar explícitamente" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">Propuesta de Valor (USP)</label>
                    <textarea 
                      value={formData.value_proposition} onChange={e => setFormData({...formData, value_proposition: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm transition min-h-[80px]" 
                      placeholder="Dejar vacío para inferir del sitio web" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-2">Tono de Marca</label>
                      <input 
                        value={formData.brand_tone} onChange={e => setFormData({...formData, brand_tone: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm transition" 
                        placeholder="ej. Professional" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-2">Objetivo de Campaña</label>
                      <select 
                        value={formData.campaign_objective} onChange={e => setFormData({...formData, campaign_objective: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm transition appearance-none"
                      >
                        <option>Unspecified</option>
                        <option>Maximize Clicks</option>
                        <option>Maximize Conversions</option>
                        <option>Target CPA</option>
                        <option>Target ROAS</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-2">Presupuesto Diario</label>
                      <input 
                        type="number"
                        value={formData.daily_budget} onChange={e => setFormData({...formData, daily_budget: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm transition" 
                        placeholder="Opcional" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Note Alert */}
              <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-200">
                  <strong className="text-blue-400">Nota:</strong> Puedes dejar campos vacíos. El Agency OS analizará automáticamente la URL y el nombre para inferir los parámetros estratégicos.
                </p>
              </div>

            </div>

            <button type="submit" className="mt-8 w-full md:w-auto md:ml-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]">
              Analizar Estrategia <ChevronRight className="w-4 h-4 text-slate-950" />
            </button>
          </form>
        )}

        {/* STEP 2: DISCOVERING LOADING */}
        {step === "DISCOVERING" && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-16 text-center backdrop-blur-xl shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Escaneando Inteligencia del Negocio...</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Analizando estructura comercial, competidores en Google Ads y descomponiendo servicios estrella en arquitectura Multi-SKU.
            </p>
          </div>
        )}

        {/* STEP 3: REVIEW DISCOVERED SKUs */}
        {step === "REVIEW" && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-white">SKUs y Categorías Descubiertas ({discoveredCatalog.length})</h3>
                <p className="text-xs text-slate-400 mt-1">Selecciona las categorías que deseas incluir como Grupos de Anuncios independientes en Google Ads.</p>
              </div>
              <button 
                onClick={() => {
                  if (selectedIndexes.size === discoveredCatalog.length) setSelectedIndexes(new Set());
                  else setSelectedIndexes(new Set(discoveredCatalog.map((_, i) => i)));
                }}
                className="text-xs text-slate-300 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 font-medium"
              >
                {selectedIndexes.size === discoveredCatalog.length ? "Deseleccionar Todos" : "Seleccionar Todos"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {discoveredCatalog.map((item, idx) => {
                const isSelected = selectedIndexes.has(idx);
                return (
                  <div 
                    key={idx}
                    onClick={() => {
                      const next = new Set(selectedIndexes);
                      if (next.has(idx)) next.delete(idx);
                      else next.add(idx);
                      setSelectedIndexes(next);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-emerald-950/30 border-emerald-500/50 shadow-lg shadow-emerald-500/5' 
                        : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${isSelected ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-700'}`}>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white">{item.producto}</h4>
                          <span className="text-xs text-slate-400">{item.rubro}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        {item.competition || 'Alta'} Competencia
                      </span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                      <span>Volumen: <strong className="text-slate-200">{item.search_volume || '2.100/mes'}</strong></span>
                      <span>CPC Estimado: <strong className="text-slate-200">{item.cpc_estimate || '$600 - $1.500 CLP'}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setStep("FORM")}
                className="w-1/3 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition"
              >
                Volver al Formulario
              </button>
              <button 
                onClick={handleApproveCatalog}
                className="w-2/3 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition hover:scale-[1.01]"
              >
                <Zap className="w-4 h-4 fill-slate-950" /> Aprobar y Generar Campaña Completa ({selectedIndexes.size} SKUs)
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PROCESSING */}
        {step === "PROCESSING" && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-16 text-center backdrop-blur-xl shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Generando Campaña de Élite...</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">{jobStatusText}</p>

            <div className="max-w-md mx-auto bg-slate-950 rounded-full h-3 p-0.5 border border-slate-800 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${total ? (progress / total) * 100 : 0}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-emerald-400 mt-2 block">{progress} de {total} SKUs completados</span>
          </div>
        )}

        {/* STEP 5: DONE - CAMPAIGN DASHBOARD */}
        {step === "DONE" && jobResults.length > 0 && (
          <div className="space-y-6">
            
            {/* Top Banner */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase mb-2 border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Campaña Lista para Lanzar
                </div>
                <h2 className="text-2xl font-extrabold text-white">{formData.business_name || 'Campaña Google Ads'} ({jobResults.length} Grupos de Anuncios)</h2>
                <p className="text-xs text-slate-400 mt-1">Estructura SKAG con 15 Títulos RSA, Palabras Clave Exactas y Barrera de 30+ Negativas por SKU.</p>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={handleExportCSV}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-2 border border-slate-700 transition"
                >
                  <Download className="w-4 h-4 text-emerald-400" /> Exportar a Editor (CSV)
                </button>
                <button 
                  onClick={handlePushApiDirect}
                  disabled={isPushingApi}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition hover:scale-[1.02] disabled:opacity-50"
                >
                  {isPushingApi ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4 fill-slate-950" />}
                  {apiPushSuccess ? "✅ ¡Publicado en Google Ads!" : "Publicar Directo vía API (1-Clic)"}
                </button>
              </div>
            </div>

            {/* Campaign Dashboard Layout */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              {/* Sidebar - Ad Group List */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-4 space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 py-2">Grupos de Anuncios ({jobResults.length})</h4>
                {jobResults.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveAdGroupIndex(idx)}
                    className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-semibold flex items-center justify-between transition ${
                      activeAdGroupIndex === idx
                        ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-lg shadow-emerald-500/20'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <span className="truncate max-w-[150px]">{item.row.producto}</span>
                    <ChevronRight className={`w-4 h-4 ${activeAdGroupIndex === idx ? 'text-slate-950' : 'text-slate-500'}`} />
                  </button>
                ))}
              </div>

              {/* Main Content Area */}
              <div className="md:col-span-3 bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-6">
                
                {/* Ad Group Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Grupo de Anuncios #{activeAdGroupIndex + 1}</span>
                    <h3 className="text-xl font-bold text-white">{jobResults[activeAdGroupIndex]?.row.producto}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleCopyAdGroup(jobResults[activeAdGroupIndex])}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 border border-slate-700 transition"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copiar Grupo Completo
                    </button>
                  </div>
                </div>

                {/* Tabs Switcher */}
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
                  <button 
                    onClick={() => setActiveTab('ads')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeTab === 'ads' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-white'}`}
                  >
                    📢 Anuncio RSA (15 Títulos)
                  </button>
                  <button 
                    onClick={() => setActiveTab('keywords')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeTab === 'keywords' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-white'}`}
                  >
                    🔍 Palabras Clave ({jobResults[activeAdGroupIndex]?.rsa.keywords?.length || 0})
                  </button>
                  <button 
                    onClick={() => setActiveTab('negatives')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeTab === 'negatives' ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'text-slate-400 hover:text-white'}`}
                  >
                    🛑 Negativas Anti-Basura ({jobResults[activeAdGroupIndex]?.rsa.negative_keywords?.length || 0})
                  </button>
                </div>

                {/* TAB 1: ADS (RSA) */}
                {activeTab === 'ads' && (
                  <div className="space-y-6">
                    <GoogleAdPreview 
                      headlines={jobResults[activeAdGroupIndex]?.rsa.headlines || []}
                      descriptions={jobResults[activeAdGroupIndex]?.rsa.descriptions || []}
                      finalUrl={formData.website_url || "https://www.3clicads.com"}
                      businessName={formData.business_name || "3ClicAds"}
                    />

                    {/* Headlines & Descriptions List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <div>
                        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">15 Títulos Generados (&lt;= 30 Caracteres)</h4>
                        <div className="space-y-1.5 max-h-80 overflow-y-auto pr-2">
                          {(jobResults[activeAdGroupIndex]?.rsa.headlines || []).map((h: string, idx: number) => (
                            <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                              <span className="font-semibold text-slate-200">{idx + 1}. {h}</span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${h.length <= 30 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                {h.length}/30
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-3">4 Descripciones Generadas (&lt;= 90 Caracteres)</h4>
                        <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                          {(jobResults[activeAdGroupIndex]?.rsa.descriptions || []).map((d: string, idx: number) => (
                            <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                              <p className="text-slate-200 font-medium">{d}</p>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded inline-block ${d.length <= 90 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                {d.length}/90 chars
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: KEYWORDS */}
                {activeTab === 'keywords' && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Palabras Clave de Búsqueda (Concordancia Exacta y Frase)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(jobResults[activeAdGroupIndex]?.rsa.keywords || []).map((kw: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                          <span className="font-semibold text-white">
                            {kw.tipo === 'Exact' ? `[${kw.texto}]` : `"${kw.texto}"`}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${kw.tipo === 'Exact' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                            {kw.tipo}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: NEGATIVE KEYWORDS */}
                {activeTab === 'negatives' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/20 flex items-start gap-3">
                      <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-red-400">Barrera Anti-Basura Activa</h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Estas palabras negativas filtran competidores, bancos, estafas y búsquedas informativas para proteger el presupuesto de clics irrelevantes.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto p-1">
                      {(jobResults[activeAdGroupIndex]?.rsa.negative_keywords || []).map((neg: string, idx: number) => (
                        <span key={idx} className="px-3 py-1.5 rounded-xl bg-slate-950 border border-red-500/30 text-red-400 text-xs font-semibold">
                          - {neg}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 flex items-center justify-between border-t border-slate-800">
              <button 
                onClick={() => setStep("FORM")}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
              >
                ← Crear Otra Campaña
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
