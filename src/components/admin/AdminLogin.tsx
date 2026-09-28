import React, { useState } from 'react';
import { Shield, KeyRound, UserCheck, AlertCircle, Terminal, ArrowRight } from 'lucide-react';
import { useHackathon } from '../../context/HackathonContext';
import { CyberButton } from '../common/CyberButton';
import { GlassCard } from '../common/GlassCard';

export const AdminLogin: React.FC = () => {
  const { adminLogin, config } = useHackathon();
  const [username, setUsername] = useState('Pcas');
  const [password, setPassword] = useState('Pcas@2026');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const success = adminLogin(username, password);
      setIsLoading(false);
      if (!success) {
        setError('Invalid username or password. Default is: Pcas / Pcas@2026');
      }
    }, 400);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 z-10 relative">
      <div className="max-w-md w-full">
        <GlassCard glow="cyan" className="p-8 sm:p-10 border-cyan-500/40 relative">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(0,217,255,0.3)]">
              <Shield className="w-7 h-7 text-cyan-400" />
            </div>

            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
              ADMIN CONTROL ACCESS
            </span>

            <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight mt-1">
              {config.name}
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              Sign in to manage hackathon settings, edit prizes, and export registrations.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-mono flex items-center gap-2 mb-6">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                USERNAME
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"
              />
            </div>

            <CyberButton
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full text-sm py-3.5"
            >
              Sign In as Admin
            </CyberButton>
          </form>

          {/* Hint Credentials Box */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-400">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Default: </span>
              <strong className="text-white">Pcas</strong> / <strong className="text-white">Pcas@2026</strong>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
