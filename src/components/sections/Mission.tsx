import React from 'react';
import { Target, Users, Zap, Terminal, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { useHackathon } from '../../context/HackathonContext';

export const Mission: React.FC = () => {
  const { config } = useHackathon();

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-6xl mx-auto">
        <GlassCard glow="cyan" className="p-6 sm:p-10 border-cyan-500/30">
          {/* Header */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-4">
            <Target className="w-3.5 h-3.5" />
            <span>MISSION</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-tight mb-3">
            Problem-Solving Journey
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed mb-8">
            From ideation to full-stack execution — tackle real-world problem statements across cutting-edge domains and defend your solution to an elite judging panel.
          </p>

          {/* Realistic Mac OS / VS Code Cyber Terminal Window */}
          <div className="rounded-2xl bg-[#060b17] border border-slate-800 shadow-2xl overflow-hidden mb-8 font-mono">
            {/* Terminal Header Bar */}
            <div className="px-4 py-3 bg-[#0a1020] border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-3 text-xs text-slate-400 font-mono flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  vision.js
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">UTF-8 // Node.js</span>
            </div>

            {/* Code Body */}
            <div className="p-5 sm:p-6 text-xs sm:text-sm leading-relaxed overflow-x-auto text-slate-300">
              <div className="flex gap-4">
                <div className="select-none text-slate-600 text-right pr-2 border-r border-slate-800 font-mono">
                  1<br />2<br />3<br />4<br />5<br />6<br />7
                </div>
                <div className="font-mono">
                  <div>
                    <span className="text-purple-400 font-semibold">async function </span>
                    <span className="text-cyan-300 font-bold">executeVision</span>
                    <span className="text-slate-400">(team) &#123;</span>
                  </div>
                  <div className="pl-6">
                    <span className="text-purple-400 font-semibold">const </span>
                    <span className="text-slate-100">solution</span>
                    <span className="text-cyan-400"> = </span>
                    <span className="text-purple-400 font-semibold">await </span>
                    <span className="text-sky-300 font-semibold">build</span>
                    <span className="text-slate-400">(team.idea);</span>
                  </div>
                  <div className="pl-6">
                    <span className="text-purple-400 font-semibold">if </span>
                    <span className="text-slate-400">(solution.</span>
                    <span className="text-emerald-400 font-semibold">isInnovative</span>
                    <span className="text-slate-400">()) &#123;</span>
                  </div>
                  <div className="pl-12">
                    <span className="text-sky-300 font-semibold">win</span>
                    <span className="text-slate-400">(</span>
                    <span className="text-emerald-300">"{config.name}"</span>
                    <span className="text-slate-400">);</span>
                  </div>
                  <div className="pl-6 text-slate-400">&#125;</div>
                  <div className="text-slate-400">&#125;</div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Feature Badges from Reference */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-display font-bold text-white uppercase">Team</h4>
                <p className="text-[11px] text-slate-400">3-5 Members per Team</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-display font-bold text-white uppercase">Multi-Domain</h4>
                <p className="text-[11px] text-slate-400">Diverse Problem Tracks</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 font-mono font-bold text-sm">
                &lt;/&gt;
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-display font-bold text-white uppercase">Any Stack</h4>
                <p className="text-[11px] text-slate-400">Language / Stack Agnostic</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-display font-bold text-white uppercase">Judged Live</h4>
                <p className="text-[11px] text-slate-400">Real-time Jury Panel</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};
