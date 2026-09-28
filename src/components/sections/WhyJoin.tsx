import React from 'react';
import { 
  Code, 
  Users, 
  Cpu, 
  Trophy, 
  Award, 
  Compass, 
  Zap, 
  Target 
} from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';
import { GlassCard } from '../common/GlassCard';

export const WhyJoin: React.FC = () => {
  const reasons = [
    {
      title: 'Build Real Projects',
      desc: 'Move beyond textbook theory and deploy actual software or hardware prototypes that address verified problems.',
      icon: Code,
    },
    {
      title: 'Meet Developers',
      desc: 'Form lifelong connections with high-caliber coders, designers, and innovators from top universities.',
      icon: Users,
    },
    {
      title: 'Learn New Technologies',
      desc: 'Experiment with cutting-edge AI models, cloud infrastructures, and developer tools in a fast-paced environment.',
      icon: Cpu,
    },
    {
      title: 'Win Exciting Prizes',
      desc: 'Compete for ₹1,00,000+ in total rewards, championship trophies, hardware grants, and fast-track interview passes.',
      icon: Trophy,
    },
    {
      title: 'Get Certificates',
      desc: 'Receive an official verified Certificate of Participation and digital credential badge to elevate your career profile.',
      icon: Award,
    },
    {
      title: 'Network With Industry Experts',
      desc: 'Get direct 1-on-1 feedback, mentorship, and architectural advice from veteran engineering leaders.',
      icon: Compass,
    },
    {
      title: 'Showcase Your Skills',
      desc: 'Present your live working demo directly before senior tech executives, recruiters, and jury specialists.',
      icon: Zap,
    },
    {
      title: 'Solve Real Problems',
      desc: 'Tackle pressing real-world challenges spanning AI, public welfare, sustainability, and healthcare.',
      icon: Target,
    },
  ];

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 z-10 bg-slate-950/40">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="// PARTICIPANT VALUE"
          title="WHY JOIN THE HACKATHON?"
          subtitle="Everything you need to level up your engineering skills, expand your technical network, and launch impactful products."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <GlassCard
                key={item.title}
                glow="cyan"
                interactive
                className="p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(0,217,255,0.4)] transition-all">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-base font-display font-bold text-white uppercase tracking-wide mb-2 group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>BENEFIT</span>
                  <span>#{String(idx + 1).padStart(2, '0')}</span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};
