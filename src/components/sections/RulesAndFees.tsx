import React from 'react';
import { 
  ShieldCheck, 
  GraduationCap, 
  Users, 
  Clock, 
  Sparkles, 
  FolderLock, 
  CheckCircle2, 
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';
import { GlassCard } from '../common/GlassCard';
import { useHackathon } from '../../context/HackathonContext';

export const RulesAndFees: React.FC = () => {
  const { config } = useHackathon();

  const rulesList = [
    {
      num: '01',
      title: 'Student Eligibility',
      badge: 'All Universities',
      desc: 'Open to all currently enrolled undergraduate & postgraduate students from recognized colleges/universities. Valid student ID cards are mandatory for verification.',
      icon: GraduationCap,
    },
    {
      num: '02',
      title: 'Team Composition',
      badge: `${config.minTeamSize}-${config.maxTeamSize} Members`,
      desc: `Each team must consist of ${config.minTeamSize} to ${config.maxTeamSize} members. Inter-departmental and inter-college team members are allowed. Solo participation is not permitted.`,
      icon: Users,
    },
    {
      num: '03',
      title: 'Strict Submission Deadlines',
      badge: 'No Extensions',
      desc: 'Phase 1 registration & idea submissions must be completed before the specified deadline. Late or incomplete entries will not be evaluated.',
      icon: Clock,
    },
    {
      num: '04',
      title: 'Originality & Integrity',
      badge: 'Original Work',
      desc: 'All project ideas and code must be original work created by the team. Plagiarism, pre-existing commercial projects, or copyright violations lead to immediate disqualification.',
      icon: Sparkles,
    },
    {
      num: '05',
      title: 'Compulsory PPT Pitch Deck',
      badge: 'Drive Folder Link',
      desc: 'Teams must submit a shared Google Drive folder containing their mandatory PPT deck (using the official structure) and an optional demo video (max 3 min). Set folder access to "Anyone with the link can view".',
      icon: FolderLock,
    },
    {
      num: '06',
      title: 'Intellectual Property & Code of Conduct',
      badge: '100% Student IP',
      desc: 'Teams retain 100% ownership of their inventions and software. Harassment, discrimination, or disruptive conduct will lead to instant expulsion from premises.',
      icon: FileCheck,
    },
  ];

  return (
    <section id="guidelines" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10 bg-slate-950/40">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="// GUIDELINES & FEES"
          title="Rules & Registration Fees"
          subtitle="Please review the official hackathon regulations and stage-wise participation fees carefully before submitting."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: OFFICIAL RULES & REGULATIONS (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                OFFICIAL RULES & REGULATIONS
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                {rulesList.length} Key Requirements
              </span>
            </div>

            {rulesList.map((rule) => {
              const Icon = rule.icon;
              return (
                <GlassCard key={rule.num} glow="none" className="p-5 border-slate-800 hover:border-cyan-500/30 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <h4 className="text-sm sm:text-base font-display font-bold text-white uppercase">
                          {rule.num}. {rule.title}
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                          {rule.badge}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed">
                        {rule.desc}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          {/* RIGHT COLUMN: PARTICIPATION FEE STRUCTURE (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold tracking-widest text-purple-400 uppercase">
                PARTICIPATION FEE STRUCTURE
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Phase-wise Entry
              </span>
            </div>

            {/* PHASE 1 CARD */}
            <GlassCard glow="cyan" className="p-6 sm:p-7 border-cyan-500/30 relative">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded text-xs font-mono font-bold uppercase bg-purple-950/80 text-purple-300 border border-purple-500/30">
                  PHASE 1
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-display font-black text-white">
                    ₹{config.registrationFeePerMember}
                  </span>
                  <span className="text-xs font-mono text-slate-400">/ person</span>
                </div>
              </div>

              <h3 className="text-xl font-display font-black text-white uppercase mb-4">
                Idea Submission Entry
              </h3>

              <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Domain & Problem Statement Selection</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Pitch Deck Review by Expert Panel</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Official Participation E-Certificate</span>
                </li>
              </ul>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Fee is paid during online registration with payment screenshot.</span>
              </div>
            </GlassCard>

            {/* PHASE 2 CARD */}
            <GlassCard glow="purple" className="p-6 sm:p-7 border-purple-500/30 relative">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded text-xs font-mono font-bold uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                  PHASE 2
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-display font-black text-cyan-400">
                    ₹400
                  </span>
                  <span className="text-xs font-mono text-slate-400">/ person</span>
                </div>
              </div>

              <h3 className="text-xl font-display font-black text-white uppercase mb-4">
                Grand Finale Entry
              </h3>

              <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>{config.duration} {config.eventType ? config.eventType.replace('-', ' ') : 'hackathon'} sprint at {config.venueAddress ? config.venueAddress.split(',')[0] : config.collegeName}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Food, Refreshments & Hackathon Kit Included</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Mentorship & Live Jury Evaluation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Eligible for Cash Prize Pool & Trophies</span>
                </li>
              </ul>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>Applicable only for shortlisted teams selected for the offline round.</span>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
};
