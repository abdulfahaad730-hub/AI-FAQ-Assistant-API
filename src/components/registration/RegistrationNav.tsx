import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useHackathon } from '../../context/HackathonContext';

export const RegistrationNav: React.FC = () => {
  const { config } = useHackathon();

  return (
    <nav className="w-full bg-[#030712]/90 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-40 px-4 sm:px-8 py-3.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-300 hover:text-cyan-400 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        {/* Center: White College Emblem Badge - LOGO ONLY */}
        <div className="flex items-center gap-3">
          <div className="relative group/navlogo flex items-center justify-center">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 opacity-60 blur-xs animate-pulse-slow" />
            <div className="relative bg-white p-1 sm:p-1.5 rounded-full flex items-center justify-center shadow-lg border border-slate-100">
              <img
                src="/college-logo.png"
                alt="Patrician College Logo"
                className="w-7 h-7 sm:w-8 sm:h-8 object-contain rounded-full"
              />
            </div>
          </div>

          {/* Registrations Open Status Pill */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>REGISTRATIONS OPEN</span>
          </div>
        </div>

        {/* Right: Hackathon Badge */}
        <div className="flex items-center gap-1.5 font-display font-black text-sm sm:text-base tracking-wider uppercase">
          <span className="text-white">{config.name.replace(` '${config.edition.slice(-2)}`, '')}</span>
          <span className="text-cyan-400 font-mono text-xs">'{config.edition.slice(-2)}</span>
        </div>
      </div>
    </nav>
  );
};
