import React from 'react';
import { 
  Cpu, 
  Globe, 
  Smartphone, 
  ShieldCheck, 
  BarChart3, 
  Cloud, 
  Coins, 
  HeartPulse, 
  GraduationCap, 
  Leaf, 
  Radio, 
  Sparkles 
} from 'lucide-react';
import { useHackathon } from '../../context/HackathonContext';
import { SectionHeader } from '../common/SectionHeader';
import { GlassCard } from '../common/GlassCard';

export const Domains: React.FC = () => {
  const { domains } = useHackathon();

  const getIcon = (iconName: string) => {
    const props = { className: 'w-6 h-6' };
    switch (iconName) {
      case 'Cpu': return <Cpu {...props} />;
      case 'Globe': return <Globe {...props} />;
      case 'Smartphone': return <Smartphone {...props} />;
      case 'ShieldCheck': return <ShieldCheck {...props} />;
      case 'BarChart3': return <BarChart3 {...props} />;
      case 'Cloud': return <Cloud {...props} />;
      case 'Coins': return <Coins {...props} />;
      case 'HeartPulse': return <HeartPulse {...props} />;
      case 'GraduationCap': return <GraduationCap {...props} />;
      case 'Leaf': return <Leaf {...props} />;
      case 'Radio': return <Radio {...props} />;
      default: return <Sparkles {...props} />;
    }
  };

  return (
    <section id="domains" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="// INNOVATION TRACKS"
          title="EXPLORE THE DOMAINS"
          subtitle="Choose your battleground. From deep autonomous AI to green tech and open innovation, build solutions that shape the future."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {domains.map((domain) => (
            <GlassCard
              key={domain.id}
              glow="cyan"
              interactive
              className="p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-2xl font-black text-slate-600 group-hover:text-cyan-400/80 transition-colors">
                    {domain.number}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(0,217,255,0.4)] transition-all">
                    {getIcon(domain.iconName)}
                  </div>
                </div>

                <h3 className="text-lg font-display font-bold text-white uppercase tracking-wide mb-2 group-hover:text-cyan-300 transition-colors">
                  {domain.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal mb-6">
                  {domain.description}
                </p>
              </div>

              {/* Domain Tags */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                {domain.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950/60 text-slate-300 border border-slate-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};
