import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, CheckCircle, ExternalLink, X } from 'lucide-react';
import { useHackathon } from '../../context/HackathonContext';
import { SectionHeader } from '../common/SectionHeader';
import { GlassCard } from '../common/GlassCard';
import { CyberButton } from '../common/CyberButton';
import { ProblemStatement } from '../../types';

export const ProblemsPreview: React.FC = () => {
  const { problems } = useHackathon();
  const [selectedProblem, setSelectedProblem] = useState<ProblemStatement | null>(null);

  // Show top 4 featured challenges on the homepage
  const featuredProblems = problems.slice(0, 4);

  return (
    <section id="problems" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10 bg-slate-950/30">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="// PROBLEM STATEMENTS"
          title="CHALLENGES AWAIT"
          subtitle="Tackle real-world scenarios curated by academic mentors and industry architects. Formulate your technical approach and build the ultimate solution."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {featuredProblems.map((prob) => (
            <GlassCard
              key={prob.id}
              glow="cyan"
              interactive
              className="p-7 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
                    {prob.code}
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold uppercase ${
                      prob.difficulty === 'Advanced'
                        ? 'bg-rose-950/50 text-rose-400 border border-rose-500/30'
                        : prob.difficulty === 'Intermediate'
                        ? 'bg-amber-950/50 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {prob.difficulty}
                  </span>
                </div>

                <span className="text-xs font-mono text-purple-400 uppercase tracking-wider block mb-1">
                  {prob.domainName}
                </span>

                <h3 className="text-xl font-display font-bold text-white mb-3 hover:text-cyan-300 transition-colors">
                  {prob.title}
                </h3>

                <p className="text-sm text-slate-400 leading-relaxed font-normal mb-6">
                  {prob.shortDesc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => setSelectedProblem(prob)}
                  className="text-xs font-mono font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group/btn"
                >
                  <span>VIEW DETAILS</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>

                <Link
                  to="/register"
                  className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <span>SOLVE THIS</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* View All Problems Button */}
        <div className="text-center">
          <Link to="/problems">
            <CyberButton
              variant="secondary"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              VIEW ALL {problems.length} PROBLEM STATEMENTS
            </CyberButton>
          </Link>
        </div>
      </div>

      {/* Problem Details Modal */}
      {selectedProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-2xl w-full rounded-2xl bg-[#070d1e] border border-cyan-500/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,217,255,0.2)] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProblem(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-cyan-950/80 text-cyan-400 border border-cyan-500/40">
                {selectedProblem.code}
              </span>
              <span className="text-xs font-mono text-purple-400 uppercase tracking-wide">
                {selectedProblem.domainName}
              </span>
            </div>

            <h3 className="text-2xl font-display font-black text-white mb-4">
              {selectedProblem.title}
            </h3>

            <div className="mb-6">
              <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-2">
                // PROBLEM DESCRIPTION
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {selectedProblem.fullDesc}
              </p>
            </div>

            <div className="mb-8">
              <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-3">
                // EXPECTED DELIVERABLES
              </h4>
              <ul className="space-y-2">
                {selectedProblem.expectedDeliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setSelectedProblem(null)}
                className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white rounded-lg"
              >
                Close
              </button>
              <Link to="/register">
                <CyberButton variant="primary" size="sm">
                  Register For This Problem →
                </CyberButton>
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
