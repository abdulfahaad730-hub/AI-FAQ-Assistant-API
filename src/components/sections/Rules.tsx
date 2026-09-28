import React, { useState } from 'react';
import { initialRules } from '../../data/rules';
import { SectionHeader } from '../common/SectionHeader';
import { GlassCard } from '../common/GlassCard';
import { ChevronDown, CheckCircle2 } from 'lucide-react';

export const Rules: React.FC = () => {
  const [openRuleId, setOpenRuleId] = useState<string | null>('rule-1');

  const toggleRule = (id: string) => {
    setOpenRuleId(openRuleId === id ? null : id);
  };

  return (
    <section id="rules" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          badge="// CODE OF BATTLE"
          title="RULES & GUIDELINES"
          subtitle="Clear, fair, and rigorous protocols to ensure academic integrity and equal competitive footing for all squads."
        />

        <div className="space-y-4">
          {initialRules.map((rule) => {
            const isOpen = openRuleId === rule.id;
            return (
              <GlassCard
                key={rule.id}
                glow={isOpen ? 'cyan' : 'none'}
                className="overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleRule(rule.id)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span className="font-mono text-lg sm:text-xl font-bold text-cyan-400">
                      {rule.number}
                    </span>
                    <div>
                      <h3 className="text-base sm:text-lg font-display font-bold text-white uppercase tracking-wide">
                        {rule.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-400 mt-1 line-clamp-1">
                        {rule.summary}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center shrink-0 text-cyan-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-cyan-950/60 border-cyan-500/40' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-800/80 animate-in fade-in duration-200">
                    <ul className="space-y-2.5 mt-2">
                      {rule.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};
