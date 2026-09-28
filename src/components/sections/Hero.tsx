import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Trophy, Users, Clock, Layers } from 'lucide-react';
import { useHackathon } from '../../context/HackathonContext';
import { useCyberTheme } from '../../context/ThemeContext';
import { CyberButton } from '../common/CyberButton';
import { CountUpNumber } from '../common/CountUpNumber';
import { CyberDecryptText } from '../common/CyberDecryptText';

export const Hero: React.FC = () => {
  const { config } = useHackathon();
  const { theme } = useCyberTheme();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Split name for dual-color hero styling (white + glowing theme accent)
  const getHeroTitleParts = () => {
    // Strip trailing year (e.g. "2026" or "'26") because '26 is rendered directly below
    const cleanName = (config.name || "INNOVATERS").replace(/\s*(20\d\d|'\d\d)\s*$/i, '').trim() || "INNOVATERS";
    
    // If the name has multiple words
    if (cleanName.includes(' ')) {
      const words = cleanName.split(' ');
      const lastWord = words.pop() || '';
      return {
        first: words.join(' '),
        second: lastWord,
        hasSpace: true,
      };
    }

    // If single word like "INNOVATERS"
    if (cleanName.length > 5) {
      const splitIdx = cleanName.length - 3;
      return {
        first: cleanName.slice(0, splitIdx),
        second: cleanName.slice(splitIdx),
        hasSpace: false,
      };
    }

    return {
      first: cleanName,
      second: '',
      hasSpace: false,
    };
  };

  const heroTitle = getHeroTitleParts();

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Decorative Cyber Rings & Ambient Orbits with Dynamic Theme Colors */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full border pointer-events-none animate-pulse-slow transition-colors duration-700"
        style={{ borderColor: `${theme.primary}25` }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border pointer-events-none transition-colors duration-700"
        style={{ borderColor: `${theme.secondary}20` }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1150px] h-[1150px] rounded-full border pointer-events-none transition-colors duration-700"
        style={{ borderColor: `${theme.tertiary}15` }}
      />

      <div className="relative max-w-5xl mx-auto text-center z-10">
        {/* Top Status Capsule matching Reference Screenshot with DEPARTMENT OF BCA */}
        <div
          className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-full backdrop-blur-md text-xs sm:text-sm font-mono tracking-wider mb-6 transition-all duration-500 shadow-lg"
          style={{
            backgroundColor: theme.badgeBg,
            borderColor: theme.badgeBorder,
            borderWidth: '1px',
            borderStyle: 'solid',
            boxShadow: `0 0 25px ${theme.glow}`,
          }}
        >
          <span
            className="w-2 h-2 rounded-full animate-ping shrink-0"
            style={{ backgroundColor: theme.primary }}
          />
          <span className="font-bold uppercase" style={{ color: theme.primary }}>
            REGISTRATIONS LIVE
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-white font-bold tracking-wide">DEPARTMENT OF BCA</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300 font-medium truncate max-w-[260px] sm:max-w-none">
            {config.collegeName}
          </span>
        </div>

        {/* Institution Subtext */}
        <div className="mb-2">
          <p
            className="text-[11px] sm:text-xs font-mono tracking-widest uppercase font-semibold transition-colors duration-500"
            style={{ color: `${theme.primary}E6` }}
          >
            {config.collegeLocation}
          </p>
        </div>

        {/* ======================================================== */}
        {/* MAIN MASSIVE HERO TITLE WITH CYBER DECRYPT SCRAMBLE      */}
        {/* ======================================================== */}
        <div className="my-2 sm:my-4 select-none group/title cursor-default">
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-black tracking-tight uppercase leading-none">
            <span className="text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.3)]">
              <CyberDecryptText text={heroTitle.first} triggerOnHover={true} />
            </span>
            {heroTitle.second && (
              <span
                className={`transition-all duration-500 ${heroTitle.hasSpace ? 'ml-2 sm:ml-4' : ''}`}
                style={{
                  color: theme.primary,
                  textShadow: `0 0 30px ${theme.glowHex}, 0 0 60px ${theme.glowHex}`,
                }}
              >
                <CyberDecryptText text={heroTitle.second} triggerOnHover={true} />
              </span>
            )}
          </h1>

          {/* Wireframe '26 Edition Sub-heading */}
          <div className="mt-1 sm:mt-2">
            <span
              className="text-3xl sm:text-5xl md:text-6xl font-display font-black tracking-widest text-transparent bg-clip-text transition-all duration-700"
              style={{
                backgroundImage: `linear-gradient(to right, ${theme.primary}, ${theme.secondary})`,
                filter: `drop-shadow(0 0 16px ${theme.primary}80)`,
              }}
            >
              '{config.edition.slice(-2)}
            </span>
          </div>
        </div>

        {/* Tagline / Subtitle 1 matching reference */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white tracking-wide mt-4 mb-3">
          {config.tagline || 'A National Level Tech Hackathon'}
        </h2>

        {/* Subtitle 2 narrative matching reference */}
        <p className="max-w-2xl mx-auto text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed mb-8 font-normal">
          {config.subtitle || `Hack hard. Build the unthinkable. An intense ${config.duration || 'hackathon sprint'} in a high-stakes environment designed to forge top-tier developers.`}
        </p>

        {/* Hero CTA Buttons matching Reference */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-14">
          <Link to="/register" className="w-full sm:w-auto">
            <CyberButton
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="w-full sm:w-auto text-sm sm:text-base px-8 py-4 rounded-full font-black shadow-lg hover:scale-105 transition-transform"
              style={{
                boxShadow: `0 0 35px ${theme.glow}`,
              }}
            >
              Register Now →
            </CyberButton>
          </Link>

          <CyberButton
            variant="secondary"
            size="lg"
            onClick={() => scrollToSection('about')}
            className="w-full sm:w-auto text-sm sm:text-base px-8 py-4 rounded-full hover:bg-slate-900/60"
            style={{
              borderColor: `${theme.primary}80`,
            }}
          >
            Explore Hackathon
          </CyberButton>
        </div>

        {/* Hero Statistics Bar with Animated Count-Up */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 max-w-4xl mx-auto">
          <div
            className="p-4 sm:p-5 rounded-2xl bg-[#060b17]/85 backdrop-blur-xl border transition-all duration-300 group shadow-lg hover:-translate-y-1"
            style={{ borderColor: `${theme.primary}35` }}
          >
            <Clock
              className="w-5 h-5 mx-auto mb-2 group-hover:scale-110 transition-transform"
              style={{ color: theme.primary }}
            />
            <div className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white tracking-tight">
              24H
            </div>
            <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-400 mt-1">
              HACKATHON DURATION
            </div>
          </div>

          <div
            className="p-4 sm:p-5 rounded-2xl bg-[#060b17]/85 backdrop-blur-xl border transition-all duration-300 group shadow-lg hover:-translate-y-1"
            style={{ borderColor: `${theme.primary}35` }}
          >
            <Users
              className="w-5 h-5 mx-auto mb-2 group-hover:scale-110 transition-transform"
              style={{ color: theme.primary }}
            />
            <div className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white tracking-tight">
              <CountUpNumber end={500} suffix="+" />
            </div>
            <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-400 mt-1">
              EXPECTED PARTICIPANTS
            </div>
          </div>

          <div
            className="p-4 sm:p-5 rounded-2xl bg-[#060b17]/85 backdrop-blur-xl border transition-all duration-300 group shadow-lg hover:-translate-y-1"
            style={{ borderColor: `${theme.secondary}45` }}
          >
            <Trophy
              className="w-5 h-5 mx-auto mb-2 group-hover:scale-110 transition-transform"
              style={{ color: theme.secondary }}
            />
            <div
              className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-transparent bg-clip-text"
              style={{
                backgroundImage: `linear-gradient(to right, ${theme.primary}, ${theme.secondary})`,
              }}
            >
              {config.prizePool}
            </div>
            <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-400 mt-1">
              PRIZE POOL (₹)
            </div>
          </div>

          <div
            className="p-4 sm:p-5 rounded-2xl bg-[#060b17]/85 backdrop-blur-xl border transition-all duration-300 group shadow-lg hover:-translate-y-1"
            style={{ borderColor: `${theme.tertiary}35` }}
          >
            <Layers
              className="w-5 h-5 mx-auto mb-2 group-hover:scale-110 transition-transform"
              style={{ color: theme.tertiary }}
            />
            <div className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white tracking-tight">
              <CountUpNumber end={12} suffix="+" />
            </div>
            <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-400 mt-1">
              DOMAINS & TRACKS
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-12 flex flex-col items-center justify-center animate-bounce opacity-70">
          <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
            SCROLL TO EXPLORE
          </span>
          <ChevronDown className="w-4 h-4 mt-1" style={{ color: theme.primary }} />
        </div>
      </div>
    </section>
  );
};
