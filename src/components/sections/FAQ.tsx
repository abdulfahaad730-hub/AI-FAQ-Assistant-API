import React, { useState, useEffect } from 'react';
import { initialFAQs } from '../../data/faqs';
import { SectionHeader } from '../common/SectionHeader';
import { GlassCard } from '../common/GlassCard';
import { ChevronDown, HelpCircle, Bot, Sparkles } from 'lucide-react';
import { fetchFaqs } from '../../services/faqChatService';

export const FAQ: React.FC = () => {
  const [faqsList, setFaqsList] = useState<Array<{ id: string; question: string; answer: string }>>(initialFAQs);
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  useEffect(() => {
    fetchFaqs().then((data) => {
      if (data && data.length > 0) {
        setFaqsList(data);
      }
    }).catch(() => {
      // fallback to initialFAQs already set
    });
  }, []);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <section id="faq" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          badge="// PARTICIPANT INTEL"
          title="FREQUENTLY ASKED QUESTIONS"
          subtitle="Everything you need to know about registration, team eligibility, project submissions, judging, and prize disbursements."
        />

        <div className="space-y-4">
          {faqsList.map((item) => {
            const isOpen = openFaqId === item.id;
            return (
              <GlassCard
                key={item.id}
                glow={isOpen ? 'cyan' : 'none'}
                className="overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(item.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5">
                    <HelpCircle className="w-5 h-5 text-cyan-400 shrink-0" />
                    <h3 className="text-sm sm:text-base font-display font-bold text-white uppercase tracking-wide">
                      {item.question}
                    </h3>
                  </div>

                  <div
                    className={`w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 text-cyan-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-cyan-950/80 border border-cyan-500/40' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800 animate-in fade-in duration-200">
                    {item.answer}
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>

        {/* AI Assistant Callout Banner */}
        <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-cyan-950/40 to-slate-900/90 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-display font-bold text-white uppercase tracking-wide flex items-center gap-1.5 justify-center sm:justify-start">
                Have a different question?
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              </h4>
              <p className="text-xs font-mono text-slate-400">
                Ask our 24/7 AI FAQ Assistant in the bottom right corner for immediate answers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
