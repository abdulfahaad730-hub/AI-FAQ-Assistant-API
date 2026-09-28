import React from 'react';
import { initialJudgingCriteria } from '../../data/judging';
import { SectionHeader } from '../common/SectionHeader';
import { GlassCard } from '../common/GlassCard';
import { Scale } from 'lucide-react';

export const Judging: React.FC = () => {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 z-10 bg-slate-950/30">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          badge="// EVALUATION CRITERIA"
          title="HOW YOU'LL BE JUDGED"
          subtitle="Our judging metrics are 100% transparent. Every project will be scored out of 100 points based on this weighted breakdown."
        />

        <GlassCard glow="cyan" className="p-8 sm:p-10 border-cyan-500/30">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-white uppercase">
                SCORING MATRIX (TOTAL: 100%)
              </h3>
              <p className="text-xs text-slate-400">
                Independent panel evaluation with standardized rubric scoring.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {initialJudgingCriteria.map((item) => (
              <div key={item.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-display font-bold text-white uppercase">
                      {item.title}
                    </span>
                  </div>
                  <span className="font-mono text-base font-bold text-cyan-400">
                    {item.weight}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5 mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,217,255,0.5)]"
                    style={{
                      width: `${item.weight}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>

                <p className="text-xs text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  );
};
