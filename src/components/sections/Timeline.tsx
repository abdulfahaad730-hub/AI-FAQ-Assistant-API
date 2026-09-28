import React, { useState } from 'react';
import { initialTimeline } from '../../data/timeline';
import { SectionHeader } from '../common/SectionHeader';
import { GlassCard } from '../common/GlassCard';
import { Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { useHackathon } from '../../context/HackathonContext';

export const Timeline: React.FC = () => {
  const { config } = useHackathon();
  const [activeStage, setActiveStage] = useState<number>(2); // Default to Idea Submission

  return (
    <section id="timeline" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="// ROADMAP & SCHEDULE"
          title="EVENT TIMELINE"
          subtitle={`From initial registration and pitch shortlisting to the intense ${config.duration ? config.duration.toLowerCase() : 'hackathon'} sprint and final grand podium.`}
        />

        {/* Desktop Horizontal Interactive Timeline (>= lg screens) */}
        <div className="hidden lg:block mb-12">
          {/* Glowing Track Line */}
          <div className="relative flex items-center justify-between mb-8 px-4">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-500 shadow-[0_0_12px_rgba(0,217,255,0.6)] transition-all duration-500"
                style={{ width: `${(activeStage / initialTimeline.length) * 100}%` }}
              />
            </div>

            {initialTimeline.map((item) => {
              const isSelected = activeStage === item.stage;
              const isPassed = item.completed || item.stage < activeStage;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveStage(item.stage)}
                  className="relative z-10 flex flex-col items-center group focus:outline-none"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-cyan-400 text-slate-950 shadow-[0_0_20px_#00D9FF] scale-125 ring-4 ring-cyan-500/30'
                        : isPassed
                        ? 'bg-slate-900 border-2 border-cyan-400 text-cyan-400'
                        : 'bg-slate-900 border border-slate-700 text-slate-400 group-hover:border-slate-500'
                    }`}
                  >
                    {isPassed && !isSelected ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      item.stage
                    )}
                  </div>

                  <span
                    className={`mt-3 text-[11px] font-mono tracking-wider uppercase font-semibold max-w-[90px] text-center transition-colors ${
                      isSelected ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'
                    }`}
                  >
                    {item.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Stage Detailed Card */}
          {(() => {
            const currentItem = initialTimeline.find((t) => t.stage === activeStage) || initialTimeline[0];
            return (
              <GlassCard glow="cyan" className="p-8 max-w-2xl mx-auto border-cyan-500/40">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono px-3 py-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/40">
                    STAGE {currentItem.stage} OF {initialTimeline.length}
                  </span>
                  <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      {currentItem.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-purple-400" />
                      {currentItem.time}
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight mb-2">
                  {currentItem.title}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {currentItem.description}
                </p>
              </GlassCard>
            );
          })()}
        </div>

        {/* Mobile & Tablet Vertical Timeline (< lg screens) */}
        <div className="lg:hidden relative pl-6 sm:pl-8 border-l-2 border-cyan-500/30 space-y-8 ml-2 sm:ml-4">
          {initialTimeline.map((item) => (
            <div key={item.id} className="relative">
              {/* Connector Node */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center text-[10px] font-mono font-bold text-cyan-400 shadow-[0_0_10px_rgba(0,217,255,0.4)]">
                {item.stage}
              </div>

              <GlassCard glow="none" className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono text-cyan-400 font-bold">
                    STAGE {item.stage}
                  </span>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                    <span>{item.date}</span>
                    <span>•</span>
                    <span>{item.time}</span>
                  </div>
                </div>

                <h4 className="text-lg font-display font-bold text-white uppercase mb-1">
                  {item.title}
                </h4>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
