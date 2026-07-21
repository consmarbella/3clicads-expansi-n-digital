import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Clock, Zap, FileSpreadsheet, Sparkles, Activity } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-7xl mx-auto animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header Hero */}
        <div className="mb-12 relative">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Bienvenido a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">3ClicAds Agency OS</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
            El motor de Inteligencia Artificial de grado empresarial que automatiza, escala y reemplaza a tu agencia de marketing tradicional en segundos.
          </p>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
            <div className="relative">
              <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-4 border border-blue-500/20">
                <Zap className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-400">Campañas Generadas (Est.)</p>
              <p className="text-4xl font-bold text-white mt-1">1,402</p>
            </div>
          </div>
          
          <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
            <div className="relative">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mb-4 border border-emerald-500/20">
                <Clock className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-400">Horas Ahorradas</p>
              <p className="text-4xl font-bold text-white mt-1">350 hrs</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-indigo-500/30 shadow-xl relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-500/20 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
            <div className="relative">
              <div className="w-12 h-12 bg-indigo-500/30 text-indigo-300 rounded-xl flex items-center justify-center mb-4 border border-indigo-500/30">
                <TrendingUp className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-indigo-200">Ahorro en Agencias</p>
              <p className="text-4xl font-bold text-white mt-1">+$15,000</p>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl font-bold text-white">Herramientas de Generación</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/generador" className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-slate-700 shadow-lg hover:shadow-2xl transition-all group flex flex-col h-full cursor-pointer relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-slate-800 text-blue-400 rounded-2xl flex items-center justify-center mb-6 border border-slate-700 group-hover:bg-blue-900/50 transition-colors">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Generador Individual</h3>
              <p className="text-slate-400 flex-1 font-medium leading-relaxed mb-8">
                Ideal para servicios locales o un solo producto. Espía a la competencia local y redacta una campaña Google Ads perfecta con vista de Editor nativo.
              </p>
              <div className="mt-auto flex items-center text-blue-400 font-bold group-hover:text-blue-300 group-hover:gap-2 transition-all">
                Lanzar Campaña Individual <ArrowRight className="w-5 h-5 ml-1" />
              </div>
            </div>
          </Link>

          <Link to="/bulk" className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-slate-700 shadow-lg hover:shadow-2xl transition-all group flex flex-col h-full cursor-pointer relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl group-hover:bg-indigo-600/20 transition-colors"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-slate-800 text-indigo-400 rounded-2xl flex items-center justify-center mb-6 border border-slate-700 group-hover:bg-indigo-900/50 transition-colors">
                <FileSpreadsheet className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-3">
                Bulk E-Commerce <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded-full font-bold uppercase tracking-wider">Pro</span>
              </h3>
              <p className="text-slate-400 flex-1 font-medium leading-relaxed mb-8">
                Diseñado para escalar. Sube un CSV con cientos de SKUs, configura el contexto global y la IA generará miles de variaciones en piloto automático.
              </p>
              <div className="mt-auto flex items-center text-indigo-400 font-bold group-hover:text-indigo-300 group-hover:gap-2 transition-all">
                Abrir Procesador Masivo <ArrowRight className="w-5 h-5 ml-1" />
              </div>
            </div>
          </Link>
        </div>

        {/* System Status */}
        <div className="mt-12 flex items-center justify-center gap-3">
          <div className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </div>
          <span className="text-slate-500 text-sm font-medium">3ClicAds Cloud Infrastructure Online</span>
        </div>

      </div>
    </div>
  );
}
