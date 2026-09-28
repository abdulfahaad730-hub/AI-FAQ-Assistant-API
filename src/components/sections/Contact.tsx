import React from 'react';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Send, 
  Compass, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Github 
} from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';
import { GlassCard } from '../common/GlassCard';
import { useHackathon } from '../../context/HackathonContext';

export const Contact: React.FC = () => {
  const { config } = useHackathon();

  return (
    <section id="contact" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10 bg-slate-950/30">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="// COMMUNICATIONS & HQ"
          title="CAMPUS VENUE & CONTACT"
          subtitle={`Reach out to the organizing team or visit our landmark campus at ${config.collegeLocation}.`}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Contact Cards & Socials (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            <GlassCard glow="cyan" className="p-6 border-cyan-500/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-mono uppercase text-cyan-400 font-bold mb-1">
                    VENUE LOCATION
                  </h4>
                  <p className="text-base font-display font-bold text-white mb-1">
                    {config.collegeName}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Canal Bank Road, Gandhi Nagar, Kotturpuram, Chennai, Tamil Nadu - 600085, India.
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard glow="cyan" className="p-6 border-cyan-500/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-mono uppercase text-cyan-400 font-bold mb-1">
                    OFFICIAL EMAIL
                  </h4>
                  <a
                    href={`mailto:${config.contactEmail}`}
                    className="text-base font-display font-bold text-white hover:text-cyan-400 transition-colors block"
                  >
                    {config.contactEmail}
                  </a>
                  <p className="text-xs text-slate-400 mt-1">
                    For registration queries, sponsorship decks & faculty coordination.
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard glow="cyan" className="p-6 border-cyan-500/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-mono uppercase text-cyan-400 font-bold mb-1">
                    HELPLINE & WHATSAPP
                  </h4>
                  <a
                    href={`tel:${config.contactPhone}`}
                    className="text-base font-display font-bold text-white hover:text-cyan-400 transition-colors block"
                  >
                    {config.contactPhone}
                  </a>
                  <p className="text-xs text-slate-400 mt-1">
                    Available Mon-Sat: 09:00 AM - 06:00 PM IST
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* Social Network Channels */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-slate-400">
                FOLLOW UPDATES:
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-cyan-400 hover:bg-slate-700 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-cyan-400 hover:bg-slate-700 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-cyan-400 hover:bg-slate-700 transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-cyan-400 hover:bg-slate-700 transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Campus Map Card & Quick Message (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <GlassCard glow="cyan" className="p-7 border-cyan-500/30 overflow-hidden relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold">
                  <Compass className="w-4 h-4" />
                  <span>CAMPUS MAP // KOTTURPURAM, CHENNAI</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">
                  LAT: 13.0182° N, LNG: 80.2443° E
                </span>
              </div>

              {/* Styled Interactive Map Frame */}
              <div className="relative rounded-xl overflow-hidden aspect-[16/9] border border-slate-700 bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                <MapPin className="w-10 h-10 text-cyan-400 mb-2 animate-bounce" />
                <h4 className="text-lg font-display font-bold text-white uppercase">
                  {config.collegeName}
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4">
                  Kotturpuram, Chennai, Tamil Nadu — Accessible via Kotturpuram MRTS Railway Station and Anna Centenary Library bus stop.
                </p>

                <a
                  href="https://maps.google.com/?q=Patrician+College+of+Arts+and+Science+Kotturpuram+Chennai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold uppercase hover:bg-cyan-900 transition-all shadow-[0_0_15px_rgba(0,217,255,0.2)]"
                >
                  <span>Open in Google Maps →</span>
                </a>
              </div>

              {/* Transit hints */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-800 text-[11px] font-mono text-slate-400">
                <div>
                  <span className="text-slate-300 font-bold block">🚆 MRTS:</span>
                  Kotturpuram Station (500m)
                </div>
                <div>
                  <span className="text-slate-300 font-bold block">🚌 Bus Stop:</span>
                  Anna Centenary Library
                </div>
                <div>
                  <span className="text-slate-300 font-bold block">✈️ Airport:</span>
                  Chennai International (11km)
                </div>
              </div>
            </GlassCard>

            {/* Quick Contact Form */}
            <GlassCard glow="none" className="p-6 border-slate-800">
              <h4 className="text-sm font-display font-bold text-white uppercase mb-3 flex items-center gap-2">
                <Send className="w-4 h-4 text-cyan-400" />
                Have a Quick Inquiry?
              </h4>
              <p className="text-xs text-slate-400 mb-4">
                Send an instant message to our student organizers and we will reply within 24 hours.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Thank you! Your query has been logged. Our student team will contact you.');
                }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3"
              >
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  required
                  className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-cyan-400 text-slate-950 text-xs font-mono font-bold uppercase hover:bg-cyan-300 transition-colors shadow-[0_0_12px_rgba(0,217,255,0.3)]"
                >
                  Send Query →
                </button>
              </form>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
};
