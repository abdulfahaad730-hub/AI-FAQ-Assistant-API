import React, { useState } from 'react';
import { Palette, Sparkles, Check, ChevronUp } from 'lucide-react';
import { useCyberTheme, CyberThemeKey } from '../../context/ThemeContext';

export const CyberThemeHUD: React.FC = () => {
  const { themeKey, setThemeKey, theme, themesList } = useCyberTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none">
      {/* Expanded Theme Menu */}
      {isOpen && (
        <div className="mb-3 p-3 rounded-2xl bg-[#060b17]/95 border border-slate-700/80 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-bottom-2 duration-200 min-w-[240px]">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px] font-mono tracking-widest text-slate-400 uppercase">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              CYBER THEME MATRIX
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-500 font-bold">
              4 MODES
            </span>
          </div>

          <div className="space-y-1.5">
            {themesList.map((t) => {
              const isSelected = t.id === themeKey;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setThemeKey(t.id as CyberThemeKey);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all duration-200 group ${
                    isSelected
                      ? 'bg-slate-900 border border-slate-700 shadow-md'
                      : 'hover:bg-slate-900/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Glowing Color Dots Swatch */}
                    <div className="flex items-center -space-x-1">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm"
                        style={{ backgroundColor: t.primary, boxShadow: `0 0 8px ${t.primary}` }}
                      />
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/40"
                        style={{ backgroundColor: t.secondary }}
                      />
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/40"
                        style={{ backgroundColor: t.tertiary }}
                      />
                    </div>

                    <div>
                      <div className="text-xs font-display font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {t.name}
                      </div>
                      <div className="text-[9px] font-mono text-slate-400 truncate max-w-[130px]">
                        {t.tagline}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <Check
                      className="w-4 h-4 shrink-0"
                      style={{ color: t.primary }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Trigger Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#060b17]/90 hover:bg-[#0c1527] border border-slate-700/80 hover:border-cyan-400/50 backdrop-blur-xl shadow-[0_4px_25px_rgba(0,0,0,0.6)] transition-all duration-300 group"
        title="Change Cyber Theme & Animation Palette"
      >
        {/* Active Theme Glowing Orb */}
        <div className="relative flex items-center justify-center">
          <span
            className="w-2.5 h-2.5 rounded-full animate-ping absolute opacity-75"
            style={{ backgroundColor: theme.primary }}
          />
          <span
            className="w-2.5 h-2.5 rounded-full relative"
            style={{
              backgroundColor: theme.primary,
              boxShadow: `0 0 10px ${theme.primary}`,
            }}
          />
        </div>

        {/* Text */}
        <span className="text-xs font-mono font-bold text-slate-200 group-hover:text-white uppercase tracking-wider">
          {theme.name.split(' ')[0]}
        </span>

        {/* Chevron / Icon */}
        <div className="w-5 h-5 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400 group-hover:text-cyan-300 transition-colors">
          {isOpen ? <ChevronUp className="w-3 h-3" /> : <Palette className="w-3 h-3" />}
        </div>
      </button>
    </div>
  );
};
