import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  ArrowLeft, 
  CheckCircle, 
  ExternalLink, 
  X,
  Code2
} from 'lucide-react';
import { useHackathon } from '../context/HackathonContext';
import { GlassCard } from '../components/common/GlassCard';
import { CyberButton } from '../components/common/CyberButton';
import { ProblemStatement, Domain } from '../types';

export const Problems: React.FC = () => {
  const { problems, domains, config } = useHackathon();
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [activeModalProb, setActiveModalProb] = useState<ProblemStatement | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredProblems = problems.filter((p: ProblemStatement) => {
    const matchesSearch = 
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.shortDesc.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase());

    const matchesDomain = selectedDomain === 'ALL' || p.domainId === selectedDomain;
    const matchesDiff = selectedDifficulty === 'ALL' || p.difficulty === selectedDifficulty;

    return matchesSearch && matchesDomain && matchesDiff;
  });

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 z-10 relative">
      <div className="max-w-7xl mx-auto">
        {/* Top Breadcrumb & Title */}
        <div className="mb-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-cyan-400 transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Main Page</span>
          </Link>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/40 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-3">
                <Code2 className="w-3.5 h-3.5" />
                <span>CHALLENGE REPOSITORY</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
                Problem Statements
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Browse all verified real-world challenges curated for {config.name}. Select a track, build your solution, and pitch live to industry judges.
              </p>
            </div>

            <Link to="/register">
              <CyberButton variant="primary" size="md">
                Register Team Now →
              </CyberButton>
            </Link>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="p-6 rounded-2xl bg-[#060b17]/80 border border-slate-800 backdrop-blur-xl mb-10 space-y-5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keywords, problem code (e.g. PS-AI-01), or technology..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            {/* Domain Filter */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-mono text-slate-400 uppercase mr-1">
                Domain:
              </span>
              <button
                onClick={() => setSelectedDomain('ALL')}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                  selectedDomain === 'ALL'
                    ? 'bg-cyan-400 text-slate-950 font-bold shadow-[0_0_10px_rgba(0,217,255,0.4)]'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                All Domains
              </button>
              {domains.map((d: Domain) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDomain(d.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                    selectedDomain === d.id
                      ? 'bg-cyan-400 text-slate-950 font-bold shadow-[0_0_10px_rgba(0,217,255,0.4)]'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {d.title}
                </button>
              ))}
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono text-slate-400 uppercase mr-1">
                Level:
              </span>
              {['ALL', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-purple-500 text-white font-bold shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Showing {filteredProblems.length} Challenge Statements</span>
          {search && (
            <button
              onClick={() => { setSearch(''); setSelectedDomain('ALL'); setSelectedDifficulty('ALL'); }}
              className="text-cyan-400 hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Problem Statements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProblems.map((prob: ProblemStatement) => (
            <GlassCard
              key={prob.id}
              glow="cyan"
              interactive
              className="p-7 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-cyan-950/80 text-cyan-400 border border-cyan-500/40">
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

                <p className="text-sm text-slate-300 leading-relaxed font-normal mb-6">
                  {prob.shortDesc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setActiveModalProb(prob)}
                  className="text-xs font-mono font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>FULL SPECIFICATION</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold hover:bg-cyan-900 transition-colors"
                >
                  Apply with This →
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Full Modal Drawer */}
      {activeModalProb && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-2xl w-full rounded-2xl bg-[#060b17] border border-cyan-500/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,217,255,0.25)] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModalProb(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/40">
                {activeModalProb.code}
              </span>
              <span className="text-xs font-mono text-purple-400 uppercase tracking-wide">
                {activeModalProb.domainName}
              </span>
            </div>

            <h3 className="text-2xl font-display font-black text-white mb-4">
              {activeModalProb.title}
            </h3>

            <div className="mb-6">
              <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-2">
                // FULL PROBLEM STATEMENT
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {activeModalProb.fullDesc}
              </p>
            </div>

            <div className="mb-8">
              <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-3">
                // EXPECTED DELIVERABLES & EVALUATION CRITERIA
              </h4>
              <ul className="space-y-2">
                {activeModalProb.expectedDeliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setActiveModalProb(null)}
                className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                Close
              </button>
              <Link to="/register">
                <CyberButton variant="primary" size="sm">
                  Register For This Challenge →
                </CyberButton>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
