import React, { useState, useEffect } from 'react';
import { Globe2 } from 'lucide-react';

interface GoogleAdPreviewProps {
  url: string;
  headlines: string[];
  descriptions: string[];
}

export function GoogleAdPreview({ url, headlines, descriptions }: GoogleAdPreviewProps) {
  const [activeHeadlines, setActiveHeadlines] = useState<string[]>([]);
  const [activeDescriptions, setActiveDescriptions] = useState<string[]>([]);

  const getRandomElements = (arr: string[], n: number) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  };

  useEffect(() => {
    const updatePreview = () => {
      // Un anuncio RSA típico muestra de 2 a 3 títulos y de 1 a 2 descripciones.
      const numHeadlines = Math.random() > 0.3 ? 3 : 2; 
      const numDescriptions = Math.random() > 0.5 ? 2 : 1;
      
      setActiveHeadlines(getRandomElements(headlines.filter(h => h && h.trim() !== ''), numHeadlines));
      setActiveDescriptions(getRandomElements(descriptions.filter(d => d && d.trim() !== ''), numDescriptions));
    };

    updatePreview();
    const interval = setInterval(updatePreview, 4000); // Rota cada 4 segundos

    return () => clearInterval(interval);
  }, [headlines, descriptions]);

  const displayUrl = url ? url.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'example.com';
  const displayUrlParts = displayUrl.split('/');

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm max-w-2xl text-left font-sans">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 overflow-hidden">
          <Globe2 className="w-4 h-4 text-slate-500" />
        </div>
        <div>
          <p className="text-sm text-slate-900 font-bold leading-tight flex items-center gap-1">Patrocinado</p>
          <p className="text-xs text-slate-700 leading-tight flex items-center gap-1 mt-0.5">
            <strong>{displayUrlParts[0]}</strong>
            {displayUrlParts.length > 1 && (
              <>
                <span className="text-slate-400 font-bold">›</span>
                <span className="text-slate-600">{displayUrlParts.slice(1).join('/')}</span>
              </>
            )}
          </p>
        </div>
      </div>
      
      <h3 className="text-[#1a0dab] text-xl font-normal hover:underline cursor-pointer leading-snug mb-1">
        {activeHeadlines.join(' | ')}
      </h3>
      
      <p className="text-[#4d5156] text-sm leading-relaxed">
        {activeDescriptions.join(' ')}
      </p>

      {/* Fake Sitelinks / Extensions for more realism */}
      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-x-4 gap-y-2 text-[#1a0dab] text-sm">
        <span className="hover:underline cursor-pointer">Cotiza Hoy Mismo</span>
        <span className="hover:underline cursor-pointer">Soporte 24/7</span>
      </div>
    </div>
  );
}
