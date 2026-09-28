import React from 'react';
import { Sparkles, Clock, MapPin } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { useHackathon } from '../../context/HackathonContext';

export const ClubAbout: React.FC = () => {
  const { config } = useHackathon();

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-6xl mx-auto">
        <GlassCard glow="purple" className="p-6 sm:p-10 border-purple-500/30">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-400 font-mono text-xs uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ABOUT THE FORUM</span>
            </div>

            <span className="px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
              Department of Computer Applications & Science
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-tight mb-4">
            PATRICIAN TECH FORUM
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-4xl mb-8">
            The Patrician Technology Innovation Council is our dedicated platform for students to incubate and express their technical talents. It fosters entrepreneurship, open-source contribution, and deep-tech exploration, guiding students toward a successful and independent future in computer science and digital engineering.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard glow="cyan" className="p-6 border-cyan-500/20">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-2">
                <Clock className="w-4 h-4" />
                <span>DURATION</span>
              </div>
              <h3 className="text-2xl font-display font-black text-white uppercase mb-2">
                {config.duration || 'Hackathon Sprint'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                An unbroken {config.duration ? config.duration.toLowerCase() : 'hackathon'} sprint. Build, iterate, and ship a working product under intense pressure with round-the-clock mentorship and high-speed infrastructure.
              </p>
            </GlassCard>

            <GlassCard glow="purple" className="p-6 border-purple-500/20">
              <div className="flex items-center gap-2 text-purple-400 font-mono text-xs uppercase tracking-wider mb-2">
                <MapPin className="w-4 h-4" />
                <span>FORMAT</span>
              </div>
              <h3 className="text-2xl font-display font-black text-white uppercase mb-2">
                {config.eventType ? `${config.eventType.replace('-', ' ').toUpperCase()}` : 'GRAND FINALE'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {config.venueAddress ? `Hosted at ${config.venueAddress}` : `Conducted at ${config.collegeName}`} — putting your skills on the premier stage before an elite industry jury.
              </p>
            </GlassCard>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};
