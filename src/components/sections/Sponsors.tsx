import React from 'react';
import { initialSponsors } from '../../data/sponsors';
import { SectionHeader } from '../common/SectionHeader';
import { GlassCard } from '../common/GlassCard';
import { CyberButton } from '../common/CyberButton';
import { Handshake } from 'lucide-react';
import { useHackathon } from '../../context/HackathonContext';

export const Sponsors: React.FC = () => {
  const { config } = useHackathon();

  const titleSponsors = initialSponsors.filter((s) => s.tier === 'TITLE');
  const goldSponsors = initialSponsors.filter((s) => s.tier === 'GOLD');
  const silverSponsors = initialSponsors.filter((s) => s.tier === 'SILVER');
  const communitySponsors = initialSponsors.filter((s) => s.tier === 'COMMUNITY');

  return (
    <section id="sponsors" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10 bg-slate-950/40">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="// INDUSTRY ALLIANCES"
          title="OUR SPONSORS & PARTNERS"
          subtitle="Empowered by visionary technology companies and organizations fueling student innovation and career growth."
        />

        {/* TITLE SPONSOR */}
        <div className="mb-12 text-center">
          <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase mb-4 inline-block">
            ★ TITLE SPONSOR
          </span>
          <div className="max-w-md mx-auto">
            {titleSponsors.map((sp) => (
              <GlassCard
                key={sp.id}
                glow="cyan"
                className="p-8 sm:p-10 border-cyan-500/40 hover:border-cyan-400 transition-all flex flex-col items-center justify-center min-h-[140px]"
              >
                <div className="text-xl sm:text-2xl font-display font-black tracking-wider text-slate-300 uppercase">
                  {sp.placeholder}
                </div>
                <span className="text-[10px] font-mono text-cyan-400 mt-2">
                  [SPONSOR LOGO PLACEHOLDER]
                </span>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* GOLD SPONSORS */}
        <div className="mb-12 text-center">
          <span className="text-xs font-mono font-bold tracking-widest text-yellow-400 uppercase mb-4 inline-block">
            ★ GOLD SPONSORS
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {goldSponsors.map((sp) => (
              <GlassCard
                key={sp.id}
                glow="purple"
                className="p-6 border-yellow-500/20 hover:border-yellow-400/40 transition-all flex flex-col items-center justify-center min-h-[110px]"
              >
                <div className="text-base font-display font-bold text-slate-300 uppercase">
                  {sp.placeholder}
                </div>
                <span className="text-[10px] font-mono text-yellow-400/80 mt-1">
                  [SPONSOR LOGO PLACEHOLDER]
                </span>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* SILVER & COMMUNITY SPONSORS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Silver */}
          <div className="text-center">
            <span className="text-xs font-mono font-bold tracking-widest text-slate-300 uppercase mb-4 inline-block">
              ★ SILVER SPONSORS
            </span>
            <div className="grid grid-cols-2 gap-4">
              {silverSponsors.map((sp) => (
                <GlassCard
                  key={sp.id}
                  glow="none"
                  className="p-4 flex flex-col items-center justify-center min-h-[90px]"
                >
                  <div className="text-xs font-display font-semibold text-slate-400 uppercase">
                    {sp.placeholder}
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 mt-1">
                    [LOGO]
                  </span>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Community Partners */}
          <div className="text-center">
            <span className="text-xs font-mono font-bold tracking-widest text-purple-400 uppercase mb-4 inline-block">
              ★ COMMUNITY & ECOSYSTEM
            </span>
            <div className="grid grid-cols-2 gap-4">
              {communitySponsors.map((sp) => (
                <GlassCard
                  key={sp.id}
                  glow="none"
                  className="p-4 flex flex-col items-center justify-center min-h-[90px]"
                >
                  <div className="text-xs font-display font-semibold text-slate-400 uppercase">
                    {sp.placeholder}
                  </div>
                  <span className="text-[9px] font-mono text-purple-400/80 mt-1">
                    [PARTNER]
                  </span>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>

        {/* Sponsor Us Callout */}
        <GlassCard glow="cyan" className="p-8 max-w-3xl mx-auto text-center border-cyan-500/30">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Handshake className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-display font-bold text-white uppercase mb-2">
            Interested in Sponsoring {config.name}?
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mb-6">
            Connect with 500+ top engineering minds, recruit premier student talent, and elevate your brand visibility across colleges in Tamil Nadu.
          </p>
          <a href={`mailto:${config.contactEmail}?subject=Sponsorship%20Inquiry%20-%20${encodeURIComponent(config.name)}`}>
            <CyberButton variant="secondary" size="md">
              Download Sponsorship Brochure / Contact Us →
            </CyberButton>
          </a>
        </GlassCard>
      </div>
    </section>
  );
};
