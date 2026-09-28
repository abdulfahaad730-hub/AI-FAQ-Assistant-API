import React, { useState, useEffect } from 'react';
import { Clock, Radio } from 'lucide-react';
import { useHackathon } from '../../context/HackathonContext';
import { GlassCard } from '../common/GlassCard';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isLive: boolean;
}

export const Countdown: React.FC = () => {
  const { config } = useHackathon();

  const calculateTimeRemaining = (): TimeRemaining => {
    const targetDateStr = config.eventStartDate || config.eventDate;
    const target = new Date(targetDateStr).getTime();
    const now = new Date().getTime();
    const diff = target - now;

    if (isNaN(target) || diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isLive: false };
  };

  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(calculateTimeRemaining());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, [config.eventDate, config.eventStartDate]);

  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-5xl mx-auto">
        <GlassCard glow="cyan" className="p-8 sm:p-12 text-center relative overflow-hidden border-cyan-500/30">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Heading */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/40 text-cyan-400 border border-cyan-500/30 text-xs font-mono uppercase tracking-widest mb-4">
            <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} />
            <span>COUNTDOWN TO SPRINT ({config.duration || 'HACKATHON'})</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tight mb-2">
            THE CLOCK IS TICKING
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mb-8 font-mono">
            Schedule: {config.eventDateDisplay} // {config.venueAddress ? config.venueAddress.split(',')[0] : config.collegeName}
          </p>

          {/* Countdown Clock Grid */}
          {timeLeft.isLive ? (
            <div className="py-6 px-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 inline-flex items-center gap-3 text-emerald-400 font-display text-2xl sm:text-3xl font-black tracking-widest animate-pulse">
              <Radio className="w-6 h-6 animate-ping" />
              <span>HACKATHON LIVE NOW</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto">
              {[
                { label: 'DAYS', value: timeLeft.days },
                { label: 'HOURS', value: timeLeft.hours },
                { label: 'MINUTES', value: timeLeft.minutes },
                { label: 'SECONDS', value: timeLeft.seconds },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-4 sm:p-6 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-all shadow-inner group"
                >
                  <div className="text-3xl sm:text-4xl md:text-5xl font-mono font-black text-white group-hover:text-cyan-400 transition-colors">
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] sm:text-xs font-mono tracking-widest text-slate-400 uppercase mt-2">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </section>
  );
};
