import React from 'react';
import { Building2 } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { SectionHeader } from '../common/SectionHeader';
import { useCyberTheme } from '../../context/ThemeContext';

export interface LeaderProfile {
  id: string;
  name: string;
  role: string;
  qualification?: string;
  designation: string;
  image: string;
  message: string;
  badge: string;
}

const leaders: LeaderProfile[] = [
  {
    id: 'brother-director',
    name: 'Rev. Bro. Vincent George',
    role: 'Director and Secretary',
    designation: 'Patrician College of Arts and Science',
    image: '/images/leadership/brother-director.png',
    message: 'Committed to inspiring holistic excellence, ethical technological innovation, and empowering students to realize their full potential.',
    badge: 'CHIEF PATRON & SECRETARY',
  },
  {
    id: 'academic-director',
    name: 'Dr. Fatima Vasanth',
    role: 'Academic Director',
    designation: 'Patrician College of Arts and Science',
    image: '/images/leadership/academic-director.png',
    message: 'Empowering students to transcend traditional boundaries through cutting-edge technology, innovation, and industry alignment.',
    badge: 'ACADEMIC PATRON',
  },
  {
    id: 'principal',
    name: 'Dr. Arokiamary Geetha Rufus',
    role: 'Principal',
    designation: 'Patrician College of Arts and Science',
    image: '/images/leadership/principal.png',
    message: 'Fostering academic excellence and hands-on digital engineering to build transformative solutions for national growth.',
    badge: 'INSTITUTIONAL HEAD',
  },
  {
    id: 'hod-bca',
    name: 'Dr. Sangeetha K',
    role: 'Head of the Department',
    qualification: 'M.C.A., M.Phil., Ph.D.',
    designation: 'Department of Computer Applications (BCA)',
    image: '/images/leadership/hod-bca.png',
    message: 'Proudly organizing INNOVATERS 2026. BCA fosters world-class computational problem solving, competitive coding, and incubation.',
    badge: 'CONVENOR & HOD - BCA',
  },
];

export const Leadership: React.FC = () => {
  const { theme } = useCyberTheme();

  return (
    <section id="leadership" className="relative py-20 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="// INSTITUTIONAL PATRONAGE"
          title="COLLEGE LEADERSHIP & ORGANIZING COUNCIL"
          subtitle="Under the visionary leadership of Patrician College of Arts and Science management and the Department of BCA."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {leaders.map((leader, index) => {
            const glowColor =
              index === 0
                ? theme.primary
                : index === 1
                ? theme.secondary
                : index === 2
                ? theme.tertiary
                : theme.primary;

            return (
              <GlassCard
                key={leader.id}
                glow="cyan"
                className="p-6 flex flex-col items-center text-center relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300 border-slate-800/80 hover:border-cyan-500/50"
              >
                {/* Top Cyber Badge */}
                <div
                  className="px-2.5 py-1 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase mb-5 border whitespace-nowrap"
                  style={{
                    color: glowColor,
                    borderColor: `${glowColor}50`,
                    backgroundColor: `${glowColor}15`,
                  }}
                >
                  {leader.badge}
                </div>

                {/* Portrait with Glowing Neon Holographic Ring */}
                <div className="relative mb-5">
                  <div
                    className="absolute -inset-2 rounded-full opacity-60 blur-md group-hover:opacity-100 transition-opacity duration-300 animate-pulse-slow pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                    }}
                  />

                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-[#060b17] border-2 border-slate-700 overflow-hidden shadow-2xl">
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-full h-full object-cover object-top rounded-full transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>

                {/* Leader Name */}
                <h3 className="text-lg sm:text-xl font-display font-black text-white tracking-tight uppercase group-hover:text-cyan-300 transition-colors">
                  {leader.name}
                </h3>

                {/* Qualification tag if available */}
                {leader.qualification && (
                  <span className="text-[10px] font-mono text-cyan-400/90 font-bold mt-0.5">
                    {leader.qualification}
                  </span>
                )}

                {/* Role Title */}
                <div
                  className="text-xs font-mono font-bold uppercase tracking-wider mt-2 mb-1"
                  style={{ color: glowColor }}
                >
                  {leader.role}
                </div>

                {/* Designation / Department */}
                <div className="text-[11px] font-mono text-slate-400 flex items-center justify-center gap-1.5 mb-4">
                  <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                  <span className="truncate max-w-[200px]">{leader.designation}</span>
                </div>

                {/* Inspiring Message Quote */}
                <div className="mt-auto pt-3 border-t border-slate-800/80 w-full">
                  <p className="text-[11px] text-slate-300 italic leading-relaxed font-normal">
                    "{leader.message}"
                  </p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};
