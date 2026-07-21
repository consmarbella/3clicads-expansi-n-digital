import { useState, useEffect } from "react";
import Papa from "papaparse";
import { Upload, Settings, Play, CheckCircle2, Download, AlertCircle, Loader2 } from "lucide-react";

type Step = "UPLOAD" | "MAPPING" | "PROCESSING" | "DONE";

export default function BulkGenerator() {
  const [step, setStep] = useState<Step>("UPLOAD");
  
  // Data State
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  
  // Global Context State
  const [globalConfig, setGlobalConfig] = useState({
    business_name: "",
    base_url: "",
    exclusiones: "",
    ubicacion: ""
  });

  // Mapping State
  const [mapping, setMapping] = useState({
    producto: "",
    rubro: "",
    url_final: ""
  });
  
  // Job State
  const [jobId, setJobId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [jobStatusText, setJobStatusText] = useState("El backend de FastAPI está procesando tu archivo usando BackgroundTasks. Estamos haciendo polling cada 3 segundos.");
  const [jobResults, setJobResults] = useState<any[]>([]);
  const [previewModalItem, setPreviewModalItem] = useState<any>(null);

  // 1. UPLOAD CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data.length > 0) {
          setCsvHeaders(Object.keys(results.data[0] as object));
          setCsvData(results.data);
          setStep("MAPPING");
        }
      }
    });
  };

  // 2. START BACKGROUND PROCESSING
  const startProcessing = async () => {
    if (!mapping.producto) {
      alert("Por favor mapea al menos la columna 'Producto'.");
      return;
    }

    setStep("PROCESSING");
    
    // Prepare rows based on mapping
    const rows = csvData.map(row => ({
      producto: row[mapping.producto] || "",
      rubro: mapping.rubro ? row[mapping.rubro] : (globalConfig.business_name || ""),
      atributos: "Envío gratis, descuento", 
      exclusiones: globalConfig.exclusiones || "Barato, usado",
      ubicacion: globalConfig.ubicacion || "Nacional",
      objetivo: "Ventas",
      url_final: mapping.url_final && row[mapping.url_final] ? row[mapping.url_final] : (globalConfig.base_url || "https://tusitio.com")
    }));

    try {
      const res = await fetch("http://127.0.0.1:8000/api/bulk/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows })
      });
      
      const data = await res.json();
      if (data.job_id) {
        setJobId(data.job_id);
        setTotal(rows.length);
      }
    } catch (error) {
      console.error(error);
      alert("Error iniciando el trabajo masivo.");
      setStep("MAPPING");
    }
  };

  // 3. POLLING (Check job status every 3 seconds)
  useEffect(() => {
    let interval: number;
    
    if (step === "PROCESSING" && jobId) {
      interval = window.setInterval(async () => {
        try {
          const res = await fetch(`http://127.0.0.1:8000/api/bulk/status/${jobId}`);
          const data = await res.json();
          
          if (data.status === "completed") {
            setJobResults(data.results);
            setStep("DONE");
            clearInterval(interval);
          } else {
            setProgress(data.progress);
            setTotal(data.total);
            
            if (data.status === "strategizing") {
              setJobStatusText("🧠 Analizando Catálogo y Estrategia Global (Fase 1)...");
            } else {
              setJobStatusText("El backend de FastAPI está generando los copys (Fase 2)...");
            }
          }
        } catch (e) {
          console.error("Error al consultar el estado", e);
        }
      }, 3000); // Polling every 3 seconds
    }
    
    return () => clearInterval(interval);
  }, [step, jobId]);

  // 4. EXPORT (Strict Zero-Warning Ads Editor Format)
  const handleExport = () => {
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
    
    const campName = `SRC - ${globalConfig.business_name || 'Bulk Campaign'}`.replace(/,/g, '');
    const budget = "10";
    const bidStrategy = "Maximize conversions";
    const campType = "Search";
    const campStatus = "Paused"; // Create paused by default
    const adgStatus = "Enabled";

    // 1. Export Campaign Level Negatives
    let negatives = ["gratis", "barato", "usado", "segunda mano", "que es", "como hacer", "youtube", "pdf", "descargar"];
    if (globalConfig.exclusiones) {
      const extraNegs = globalConfig.exclusiones.split(",").map(s => s.trim()).filter(s => s);
      negatives = [...negatives, ...extraNegs];
    }
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
        const url = req.url_final || globalConfig.base_url || 'https://www.tusitio.com';

        // 2. Export Keywords (Strict exact format, no brackets if Criterion Type specified)
        if (res.keywords && res.keywords.length > 0) {
          res.keywords.forEach((kwObj: any) => {
            const rawKw = (kwObj.texto || '').replace(/,/g, '');
            const typeKw = kwObj.tipo === "Phrase" ? "Phrase" : "Exact";
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
    link.href = blobUrl;
    link.download = `google_ads_editor_bulk_${globalConfig.business_name.replace(/\s+/g, '_') || 'campaign'}.csv`;
    link.click();
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold text-slate-900">Bulk E-Commerce PRO</h1>
        <p className="text-slate-500 mt-2">Arquitectura asíncrona para procesar miles de SKUs sin bloqueos.</p>
      </div>

      {/* STEP 1: UPLOAD */}
      {step === "UPLOAD" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <Upload className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Sube tu CSV con el inventario</h2>
          <p className="text-slate-700 mb-8 max-w-md mx-auto">Papaparse limpiará dinámicamente las codificaciones y caracteres extraños de tu CSV de e-commerce.</p>
          <label className="bg-indigo-600 text-white px-8 py-4 rounded-xl cursor-pointer hover:bg-indigo-700 transition font-medium shadow-md">
            Seleccionar Archivo .CSV
            <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      )}

      {/* STEP 2: CONFIGURATION & MAPPING */}
      {step === "MAPPING" && (
        <div className="space-y-6">
          
          {/* Global Config Block */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <Settings className="w-6 h-6 text-indigo-500" />
              <h2 className="text-xl font-bold text-slate-900">1. Contexto Global de Campaña</h2>
            </div>
            <p className="text-sm text-slate-500 mb-6">Esta información se aplicará a todas las filas del archivo para darle contexto al IA sobre tu marca.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nombre de la Empresa</label>
                <input 
                  type="text" 
                  placeholder="Ej: Clínica Dental Madrid"
                  className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={globalConfig.business_name}
                  onChange={(e) => setGlobalConfig({...globalConfig, business_name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">URL Base (Opcional)</label>
                <input 
                  type="text" 
                  placeholder="https://www.tu-sitio.com"
                  className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={globalConfig.base_url}
                  onChange={(e) => setGlobalConfig({...globalConfig, base_url: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Competencia / Palabras Negativas</label>
                <input 
                  type="text" 
                  placeholder="Ej: amazon, falabella, usado"
                  className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={globalConfig.exclusiones}
                  onChange={(e) => setGlobalConfig({...globalConfig, exclusiones: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Ubicación Geográfica</label>
                <input 
                  type="text" 
                  placeholder="Ej: Madrid, España"
                  className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={globalConfig.ubicacion}
                  onChange={(e) => setGlobalConfig({...globalConfig, ubicacion: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Mapping Block */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <Settings className="w-6 h-6 text-indigo-500" />
              <h2 className="text-xl font-bold text-slate-900">2. Mapeo de Columnas (Smart Mapping)</h2>
            </div>
            
            <div className="bg-blue-100 text-blue-900 p-4 rounded-xl text-sm mb-6 flex gap-3 font-medium border border-blue-200">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>Hemos detectado {csvHeaders.length} columnas en tu archivo con {csvData.length} productos. Por favor indícanos qué columna del CSV corresponde a nuestras variables.</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="grid grid-cols-2 gap-4 items-center">
                <span className="font-medium text-slate-700">Variable: Nombre del Producto <span className="text-red-500">*</span></span>
                <select 
                  className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50"
                  value={mapping.producto}
                  onChange={e => setMapping({...mapping, producto: e.target.value})}
                >
                  <option value="">-- Selecciona Columna --</option>
                  {csvHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4 items-center">
                <span className="font-medium text-slate-700">Variable: Categoría / Rubro</span>
                <select 
                  className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50"
                  value={mapping.rubro}
                  onChange={e => setMapping({...mapping, rubro: e.target.value})}
                >
                  <option value="">-- Ignorar --</option>
                  {csvHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4 items-center">
                <span className="font-medium text-slate-700">Variable: URL de Destino Especifica</span>
                <select 
                  className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50"
                  value={mapping.url_final}
                  onChange={e => setMapping({...mapping, url_final: e.target.value})}
                >
                  <option value="">-- Usar URL Base Global --</option>
                  {csvHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
              <button onClick={() => setStep("UPLOAD")} className="px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition">
                Atrás
              </button>
              <button onClick={startProcessing} className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition flex items-center gap-2 shadow-md">
                <Play className="w-4 h-4" /> Enviar a Background Queue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: PROCESSING */}
      {step === "PROCESSING" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <Loader2 className="w-16 h-16 text-indigo-500 mx-auto mb-6 animate-spin" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Procesamiento en Segundo Plano</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto font-medium">
            {jobStatusText}
          </p>
          
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-slate-700">Progreso Asíncrono</span>
              <span className="text-indigo-600">{progress} / {total} SKUs</span>
            </div>
            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${total > 0 ? (progress / total) * 100 : 0}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-400 mt-4 text-left">
              Job ID: <span className="font-mono text-slate-500">{jobId}</span>
            </p>
          </div>
        </div>
      )}

      {/* STEP 4: DONE */}
      {step === "DONE" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm relative overflow-hidden max-w-5xl mx-auto">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-[100px] z-0"></div>
          
          <div className="relative z-10 text-center mb-10">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">¡Procesamiento Completado!</h2>
            <p className="text-slate-600 mb-8 max-w-md mx-auto font-medium">
              Se han generado {jobResults.filter(r => r.status === 'success').length} campañas optimizadas con inteligencia artificial anti-canibalización.
            </p>

            {/* PREVIEW GRID */}
            <div className="border-t border-slate-200 pt-8 mb-10 relative z-10 text-left">
              <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">Vista Previa de Anuncios Generados</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobResults.filter(r => r.status === 'success').slice(0, 6).map((item, idx) => {
                  const req = item.req;
                  const res = item.resultado;
                  const headlines = res.headlines || [];
                  const descriptions = res.descriptions || [];
                  const mainKeyword = res.main_keyword || req.producto;
                  const topHeadlines = headlines.slice(0, 3).join(" | ");
                  const topDescriptions = descriptions.slice(0, 2).join(" ");
                  
                  return (
                    <div 
                      key={idx} 
                      onClick={() => setPreviewModalItem(item)}
                      className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition cursor-pointer relative"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-2 py-1 rounded">Grupo: {req.producto}</span>
                        <div className="flex flex-wrap justify-end gap-1 flex-1 ml-2">
                          {res.keywords && res.keywords.map((kwObj: any, i: number) => (
                            <span key={i} className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${kwObj.tipo === 'Exact' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {kwObj.texto} ({kwObj.tipo})
                            </span>
                          ))}
                          {!res.keywords && res.main_keyword && (
                            <span className="text-[10px] font-bold bg-green-100 text-green-800 px-1.5 py-0.5 rounded flex items-center gap-1">
                              {res.main_keyword} (Exact)
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-xs text-slate-700 font-bold mb-1 flex items-center gap-1">
                          <span className="bg-slate-800 text-white text-[10px] px-1.5 rounded-sm">Patrocinado</span>
                          {req.url_final || 'https://www.tusitio.com'}
                        </p>
                        <h4 className="text-blue-700 text-lg font-medium hover:underline cursor-pointer leading-tight mb-1">
                          {topHeadlines}
                        </h4>
                        <p className="text-slate-600 text-sm leading-snug">
                          {topDescriptions}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {jobResults.length > 6 && (
                <p className="text-center text-slate-500 text-sm mt-6 font-medium">
                  ... y {jobResults.length - 6} campañas más incluidas en el archivo CSV.
                </p>
              )}
            </div>

            <button onClick={handleExport} className="px-8 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition flex items-center justify-center gap-2 w-full max-w-sm mx-auto shadow-lg shadow-green-600/20">
              <Download className="w-5 h-5" /> Descargar CSV (Ads Editor Formatted)
            </button>
            
            <button onClick={() => {setStep("UPLOAD"); setJobId(null); setProgress(0);}} className="mt-4 text-slate-500 hover:text-slate-700 font-medium text-sm">
              Procesar otro archivo
            </button>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewModalItem && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center z-10">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Vista Previa Completa</h3>
                <p className="text-sm text-slate-500">Ad Group: {previewModalItem.req.producto}</p>
              </div>
              <button 
                onClick={() => setPreviewModalItem(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="font-bold text-slate-900 mb-2">Palabras Clave (Long-Tail)</h4>
                <div className="flex flex-wrap gap-2">
                  {previewModalItem.resultado.keywords?.map((kwObj: any, i: number) => (
                    <span key={i} className={`text-xs font-bold px-2 py-1 rounded border ${kwObj.tipo === 'Exact' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                      {kwObj.tipo === 'Exact' ? `[${kwObj.texto}]` : `"${kwObj.texto}"`}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-slate-900 mb-3">Títulos (15 generados)</h4>
                  <ul className="space-y-2">
                    {previewModalItem.resultado.headlines?.map((h: string, i: number) => (
                      <li key={i} className="text-sm bg-slate-50 p-2 rounded border border-slate-100 flex items-start gap-2">
                        <span className="text-blue-500 font-bold shrink-0">{i+1}.</span>
                        <span className="text-slate-700">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-3">Descripciones (4 generadas)</h4>
                  <ul className="space-y-2">
                    {previewModalItem.resultado.descriptions?.map((d: string, i: number) => (
                      <li key={i} className="text-sm bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-start gap-2">
                        <span className="text-blue-600 font-bold shrink-0">{i+1}.</span>
                        <span className="text-slate-800 leading-snug">{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
