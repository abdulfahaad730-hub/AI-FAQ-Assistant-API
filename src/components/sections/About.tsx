import React from 'react';
import { Lightbulb, Users2, Code2, Rocket } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';
import { GlassCard } from '../common/GlassCard';
import { useHackathon } from '../../context/HackathonContext';

export const About: React.FC = () => {
  const { config } = useHackathon();

  const features = [
    {
      number: '01',
      title: 'INNOVATE',
      desc: 'Turn bold ideas into practical solutions that overcome technological barriers.',
      icon: Lightbulb,
      color: 'cyan',
    },
    {
      number: '02',
      title: 'COLLABORATE',
      desc: 'Work with talented developers, designers, and creators from diverse collegiate backgrounds.',
      icon: Users2,
      color: 'purple',
    },
    {
      number: '03',
      title: 'BUILD',
      desc: `Transform abstract concepts into fully working prototypes within the ${config.duration ? config.duration.toLowerCase() : 'hackathon'} sprint window.`,
      icon: Code2,
      color: 'cyan',
    },
    {
      number: '04',
      title: 'IMPACT',
      desc: 'Create scalable solutions that solve real-world industry and societal problems.',
      icon: Rocket,
      color: 'purple',
    },
  ];

  return (
    <section id="about" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="// ABOUT THE HACKATHON"
          title="WHERE IDEAS MEET INNOVATION"
          subtitle={`${config.collegeName} is bringing together ambitious students, developers, designers, innovators, and problem solvers to engineer meaningful technology solutions in the heart of Chennai.`}
        />

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item) => {
            const IconComponent = item.icon;
            const isCyan = item.color === 'cyan';
            return (
              <GlassCard
                key={item.number}
                glow={isCyan ? 'cyan' : 'purple'}
                interactive
                className="p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-display font-black text-slate-600 group-hover:text-cyan-400/60 transition-colors font-mono">
                      {item.number}
                    </span>
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                        isCyan
                          ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-400 group-hover:shadow-[0_0_15px_rgba(0,217,255,0.4)]'
                          : 'bg-purple-950/40 border-purple-500/30 text-purple-400 group-hover:shadow-[0_0_15px_rgba(124,58,237,0.4)]'
                      }`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-xl font-display font-black text-white tracking-wide uppercase mb-3">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>CORE PILLAR</span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};
