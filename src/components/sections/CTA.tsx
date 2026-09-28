import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Terminal } from 'lucide-react';
import { CyberButton } from '../common/CyberButton';
import { useHackathon } from '../../context/HackathonContext';

export const CTA: React.FC = () => {
  const { config } = useHackathon();

  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 z-10 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="relative rounded-3xl p-1 bg-gradient-to-r from-cyan-400 via-sky-500 to-purple-600 shadow-[0_0_60px_rgba(0,217,255,0.3)] overflow-hidden">
          <div className="rounded-[22px] bg-[#050a18] px-6 py-16 sm:px-12 sm:py-20 text-center relative overflow-hidden">
            {/* Background cyber radial glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs uppercase tracking-widest mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>LIMITLESS POSSIBILITIES // 2026</span>
              </div>

              {/* Huge Heading */}
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-white tracking-tight uppercase leading-tight mb-4">
                READY TO BUILD THE UNTHINKABLE?
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-slate-300 mb-8 font-normal leading-relaxed">
                Your idea could be the next breakthrough solution. Assemble your squad of 3 to 5 developers, pick your domain challenge, and enter the arena.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register" className="w-full sm:w-auto">
                  <CyberButton
                    variant="primary"
                    size="xl"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                    className="w-full sm:w-auto px-10 py-5 text-lg shadow-[0_0_35px_rgba(0,217,255,0.5)]"
                  >
                    REGISTER NOW →
                  </CyberButton>
                </Link>

                <Link to="/problems" className="w-full sm:w-auto">
                  <CyberButton
                    variant="secondary"
                    size="xl"
                    className="w-full sm:w-auto px-8 py-5 text-base"
                  >
                    EXPLORE CHALLENGES
                  </CyberButton>
                </Link>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  {config.collegeName}
                </span>
                <span>•</span>
                <span>Kotturpuram, Chennai</span>
                <span>•</span>
                <span className="text-cyan-400 font-bold">{config.duration} SPRINT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
