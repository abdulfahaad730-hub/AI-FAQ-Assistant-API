import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Terminal, 
  MapPin, 
  Mail, 
  Phone, 
  Clock, 
  Shield, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useHackathon } from '../../context/HackathonContext';

export const Footer: React.FC = () => {
  const { config } = useHackathon();
  const [istTime, setIstTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format to Indian Standard Time (IST)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setIstTime(now.toLocaleTimeString('en-IN', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="relative bg-[#02050c] border-t border-slate-800/80 pt-16 pb-12 overflow-hidden z-10">
      {/* Glow highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Col 1 & 2: College & Hackathon Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_12px_rgba(0,217,255,0.3)]">
                <Terminal className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <span className="font-display font-black text-xl tracking-wider text-white uppercase">
                  {config.name}
                </span>
                <span className="ml-2 text-xs font-mono font-bold text-cyan-400">
                  EDITION {config.edition}
                </span>
              </div>
            </div>

            <p className="text-sm font-semibold text-slate-300">
              {config.collegeName}
            </p>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              A premier national-level technology hackathon organized by Patrician College of Arts and Science in Kotturpuram, Chennai. Fostering bold technological innovation, cross-disciplinary problem solving, and real-world student breakthroughs.
            </p>

            {/* Live IST Clock */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-cyan-500/30 text-xs font-mono text-cyan-300">
              <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
              <span>CHENNAI (IST):</span>
              <span className="font-bold text-white tracking-widest">{istTime || 'LOADING...'}</span>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 mb-4">
              // NAVIGATION
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { name: 'Home', href: '/#home' },
                { name: 'About Hackathon', href: '/#about' },
                { name: 'Domains & Tracks', href: '/#domains' },
                { name: 'Problem Statements', href: '/problems' },
                { name: 'Event Timeline', href: '/#timeline' },
                { name: 'Prize Breakdown', href: '/#prizes' },
                { name: 'Rules & Guidelines', href: '/#rules' },
                { name: 'FAQs', href: '/#faq' },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Portals */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400 mb-4">
              // PORTALS
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  to="/register"
                  className="text-slate-300 hover:text-cyan-400 font-semibold transition-colors flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  Team Registration Portal
                </Link>
              </li>
              <li>
                <Link
                  to="/problems"
                  className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  Problem Statements Catalog
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="text-slate-300 hover:text-purple-400 transition-colors flex items-center gap-1"
                >
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                  Admin Control Center
                </Link>
              </li>
            </ul>

            <div className="mt-6 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] font-mono text-slate-400 block mb-1">
                STATUS:
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                REGISTRATIONS OPEN
              </span>
            </div>
          </div>

          {/* Col 5: Contact Details */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 mb-4">
              // VENUE & CONTACT
            </h4>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="leading-snug text-slate-400">
                  {config.collegeLocation}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <a
                  href={`mailto:${config.contactEmail}`}
                  className="text-slate-400 hover:text-cyan-400 transition-colors truncate"
                >
                  {config.contactEmail}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <a
                  href={`tel:${config.contactPhone}`}
                  className="text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  {config.contactPhone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © 2026 {config.collegeName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Building tomorrow, today.</span>
            <span className="text-slate-600">|</span>
            <Link to="/admin" className="hover:text-cyan-400 transition-colors font-mono">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
