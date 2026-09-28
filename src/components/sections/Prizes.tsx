import React from 'react';
import { Trophy, Medal, Award, Sparkles, CheckCircle2, Gift } from 'lucide-react';
import { useHackathon } from '../../context/HackathonContext';
import { SectionHeader } from '../common/SectionHeader';
import { GlassCard } from '../common/GlassCard';

export const Prizes: React.FC = () => {
  const { prizes, specialAwards, config } = useHackathon();

  // Find 1st, 2nd, and 3rd place prizes
  const firstPrize = prizes.find((p) => p.rank === '1st') || prizes[0];
  const secondPrize = prizes.find((p) => p.rank === '2nd') || prizes[1];
  const thirdPrize = prizes.find((p) => p.rank === '3rd') || prizes[2];

  return (
    <section id="prizes" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="// REWARDS FOR THE BOLD"
          title="PRIZE POOL & HONORS"
          subtitle={`A massive prize purse of ${config.prizePool} waiting for champions, runners-up, and top domain innovators.`}
        />

        {/* Podium Layout: 2nd, 1st (Dominant in center), 3rd */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-center mb-16">
          {/* 2nd Prize Card */}
          {secondPrize && (
            <div className="order-2 lg:order-1">
              <GlassCard glow="cyan" interactive className="p-7 text-center relative border-slate-700">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-slate-800/80 border border-slate-600 flex items-center justify-center text-slate-300 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                  <Medal className="w-7 h-7 text-slate-200" />
                </div>

                <span className="text-xs font-mono px-3 py-1 rounded bg-slate-800 text-slate-300 uppercase tracking-wider mb-2 inline-block">
                  🥈 2ND PLACE
                </span>

                <h3 className="text-xl font-display font-bold text-white uppercase mb-2">
                  {secondPrize.title}
                </h3>

                <div className="text-3xl sm:text-4xl font-display font-black text-slate-200 tracking-tight mb-4">
                  {secondPrize.amount}
                </div>

                <p className="text-xs text-slate-400 mb-6">
                  {secondPrize.description}
                </p>

                <ul className="text-left space-y-2 text-xs text-slate-300 pt-4 border-t border-slate-800">
                  {secondPrize.perks.map((perk, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>
          )}

          {/* 1st Prize Dominant Champion Card */}
          {firstPrize && (
            <div className="order-1 lg:order-2 lg:-translate-y-4">
              <div className="relative rounded-3xl p-1 bg-gradient-to-b from-cyan-400 via-sky-500 to-purple-600 shadow-[0_0_45px_rgba(0,217,255,0.4)]">
                <div className="rounded-[22px] bg-[#070e24] p-8 sm:p-10 text-center relative overflow-hidden">
                  {/* Top highlight ribbon */}
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/30 to-yellow-500/30 border border-yellow-400/50 text-yellow-300 font-mono text-xs font-bold uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>GRAND CHAMPION</span>
                  </div>

                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-[0_0_30px_rgba(0,217,255,0.5)]">
                    <Trophy className="w-10 h-10 text-yellow-400 animate-bounce" style={{ animationDuration: '3s' }} />
                  </div>

                  <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight mb-2">
                    {firstPrize.title}
                  </h3>

                  <div className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-yellow-400 tracking-tight mb-4 drop-shadow-[0_0_20px_rgba(0,217,255,0.5)]">
                    {firstPrize.amount}
                  </div>

                  <p className="text-sm text-slate-300 mb-6">
                    {firstPrize.description}
                  </p>

                  <ul className="text-left space-y-2.5 text-xs text-slate-200 pt-5 border-t border-cyan-500/20">
                    {firstPrize.perks.map((perk, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="font-medium">{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 3rd Prize Card */}
          {thirdPrize && (
            <div className="order-3">
              <GlassCard glow="purple" interactive className="p-7 text-center relative border-amber-900/40">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-950/60 border border-amber-700/60 flex items-center justify-center text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                  <Award className="w-7 h-7" />
                </div>

                <span className="text-xs font-mono px-3 py-1 rounded bg-amber-950/60 text-amber-400 uppercase tracking-wider mb-2 inline-block">
                  🥉 3RD PLACE
                </span>

                <h3 className="text-xl font-display font-bold text-white uppercase mb-2">
                  {thirdPrize.title}
                </h3>

                <div className="text-3xl sm:text-4xl font-display font-black text-amber-300 tracking-tight mb-4">
                  {thirdPrize.amount}
                </div>

                <p className="text-xs text-slate-400 mb-6">
                  {thirdPrize.description}
                </p>

                <ul className="text-left space-y-2 text-xs text-slate-300 pt-4 border-t border-slate-800">
                  {thirdPrize.perks.map((perk, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>
          )}
        </div>

        {/* Special Category Awards */}
        <div className="mb-14">
          <h3 className="text-xl font-display font-bold uppercase tracking-wider text-center text-white mb-8">
            // SPECIAL CATEGORY EXCELLENCE AWARDS
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {specialAwards.map((award) => (
              <GlassCard key={award.id} glow="purple" interactive className="p-5 text-center">
                <span className="text-xs font-mono font-bold text-purple-400 uppercase block mb-1">
                  CATEGORY AWARD
                </span>
                <h4 className="text-sm font-display font-bold text-white mb-2">
                  {award.title}
                </h4>
                <div className="text-xl font-mono font-black text-cyan-400 mb-2">
                  {award.amount}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {award.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* All Participants Perks Banner */}
        <GlassCard glow="cyan" className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-cyan-500/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-display font-bold text-white uppercase">
                FOR EVERY REGISTERED PARTICIPANT
              </h4>
              <p className="text-xs sm:text-sm text-slate-400">
                Official verified Certificates of Participation, Exclusive Hacker Swag Kits, Mentorship Sessions, Cloud Credits & Refreshments throughout the {config.duration ? config.duration.toLowerCase() : 'hackathon'} sprint.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};
