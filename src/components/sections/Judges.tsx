import React from 'react';
import { initialJudges } from '../../data/judges';
import { SectionHeader } from '../common/SectionHeader';
import { GlassCard } from '../common/GlassCard';
import { Linkedin } from 'lucide-react';

export const Judges: React.FC = () => {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="// JURY & MENTORS"
          title="MEET THE MINDS"
          subtitle="Learn from and showcase your prototype before veteran tech architects, startup founders, and distinguished research mentors."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {initialJudges.map((judge) => (
            <GlassCard key={judge.id} glow="purple" interactive className="p-6 text-center">
              <div className="relative w-28 h-28 mx-auto mb-4 rounded-2xl overflow-hidden border-2 border-purple-500/30 group-hover:border-cyan-400 transition-colors shadow-lg">
                <img
                  src={judge.image}
                  alt={judge.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <h3 className="text-lg font-display font-bold text-white uppercase tracking-wide">
                {judge.name}
              </h3>

              <div className="text-xs font-mono font-semibold text-cyan-400 mt-0.5">
                {judge.role}
              </div>

              <div className="text-xs text-slate-400 mt-0.5">
                {judge.company}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-slate-400 truncate max-w-[170px]">
                  {judge.expertise}
                </span>

                <a
                  href={judge.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-slate-800/80 text-cyan-400 hover:text-white hover:bg-cyan-600 transition-colors"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};
