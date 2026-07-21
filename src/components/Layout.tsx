import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FilePlus2, Layers, Activity } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  const menu = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Generador Single", icon: FilePlus2, path: "/generador" },
    { name: "Bulk E-Commerce", icon: Layers, path: "/bulk" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex border-r border-slate-800 sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/20">3C</div>
          <span className="text-xl font-bold tracking-tight">3ClicAds</span>
        </div>
        
        <div className="px-4 py-2 flex-1 mt-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Workspace</p>
          <ul className="space-y-1">
            {menu.map((item) => {
              const active = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${active ? 'bg-blue-600 text-white font-medium shadow-md shadow-blue-900/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                  >
                    <item.icon className={`w-5 h-5 ${active ? 'text-blue-200' : 'text-slate-500'}`} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        
        <div className="p-6 border-t border-slate-800">
          <div className="bg-slate-800 rounded-xl p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-bl-full blur-xl"></div>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-green-400" />
              <span className="text-sm font-semibold text-slate-200">System Online</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">Gemini 2.5 Flash API is connected. Native Scraping is active.</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 md:hidden">
            <div className="font-bold text-slate-800">3ClicAds</div>
        </header>
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
