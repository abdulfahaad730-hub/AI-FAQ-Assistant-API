import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, ArrowRight } from 'lucide-react';
import { useHackathon } from '../../context/HackathonContext';
import { useCyberTheme } from '../../context/ThemeContext';
import { CyberButton } from '../common/CyberButton';

export const Navbar: React.FC = () => {
  const { config, isAdminLoggedIn } = useHackathon();
  const { theme, cycleTheme } = useCyberTheme();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);

      const sections = [
        'home',
        'about',
        'leadership',
        'domains',
        'problems',
        'timeline',
        'prizes',
        'guidelines',
        'sponsors',
        'gallery',
        'contact',
      ];
      const scrollPosition = window.scrollY + 160;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/#home' },
    { name: 'About', href: '/#about' },
    { name: 'Patrons', href: '/#leadership' },
    { name: 'Domains', href: '/#domains' },
    { name: 'Problems', href: '/#problems' },
    { name: 'Timeline', href: '/#timeline' },
    { name: 'Prizes', href: '/#prizes' },
    { name: 'Guidelines', href: '/#guidelines' },
    { name: 'Gallery', href: '/#gallery' },
    { name: 'Contact', href: '/#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (location.pathname === '/' && href.startsWith('/#')) {
      e.preventDefault();
      const targetId = href.replace('/#', '');
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
      setMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-8 lg:px-12 ${
        isScrolled
          ? 'py-3 bg-[#030712]/92 backdrop-blur-xl border-b border-cyan-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.8)]'
          : 'py-4 sm:py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* ======================================================== */}
        {/* LEFT: COLLEGE LOGO BADGE & HACKATHON NAME: INNOVATERS    */}
        {/* ======================================================== */}
        <Link to="/" className="flex items-center gap-3 sm:gap-3.5 shrink-0 group">
          {/* Animated Holographic White Circle Badge - LOGO ONLY */}
          <div className="relative group/logo flex items-center justify-center shrink-0">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-500 opacity-60 blur-xs group-hover/logo:opacity-100 transition-opacity duration-300 animate-pulse-slow pointer-events-none" />

            <div className="relative w-10 h-10 sm:w-11 sm:h-11 bg-white p-1 rounded-full flex items-center justify-center shadow-lg border border-slate-100 transition-transform duration-300 group-hover/logo:scale-105 shrink-0">
              <img
                src="/college-logo.png"
                alt="Patrician College Logo"
                className="w-full h-full object-contain rounded-full shrink-0"
              />
            </div>
          </div>

          {/* Hackathon Title: INNOVATERS '26 */}
          <div className="flex items-center gap-1.5 whitespace-nowrap shrink-0">
            <span className="font-display font-black text-lg sm:text-xl md:text-2xl tracking-wider text-white uppercase group-hover:text-cyan-300 transition-colors leading-none">
              INNOVATERS
            </span>
            <span
              className="px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-mono font-black border transition-all duration-300 leading-none"
              style={{
                color: theme.primary,
                borderColor: `${theme.primary}60`,
                backgroundColor: `${theme.primary}18`,
                boxShadow: `0 0 10px ${theme.glow}`,
              }}
            >
              '{config.edition.slice(-2)}
            </span>
          </div>
        </Link>

        {/* ======================================================== */}
        {/* CENTER: STANDALONE FLOATING CAPSULE MENU (THE ONLY PILL) */}
        {/* ======================================================== */}
        <nav className="hidden xl:flex items-center gap-1 bg-[#060b17]/85 border border-slate-800/90 px-4 py-1.5 rounded-full backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
          {navLinks.map((link) => {
            const sectionKey = link.href.replace('/#', '');
            const isActive = location.pathname === '/' && activeSection === sectionKey;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
                style={
                  isActive
                    ? {
                        color: theme.primary,
                        backgroundColor: `${theme.primary}18`,
                        boxShadow: `0 0 12px ${theme.glow}`,
                      }
                    : {}
                }
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* ======================================================== */}
        {/* RIGHT: STANDALONE REGISTER BUTTON (OUTSIDE ANY BARREL)   */}
        {/* ======================================================== */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Cyber Theme Cycle Button */}
          <button
            onClick={cycleTheme}
            title={`Active Cyber Theme: ${theme.name} (Click to switch)`}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all flex items-center gap-1.5 text-xs"
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor: theme.primary,
                boxShadow: `0 0 8px ${theme.primary}`,
              }}
            />
            <span className="hidden md:inline font-mono text-[10px] uppercase font-bold text-slate-400">
              {theme.name.split(' ')[0]}
            </span>
          </button>

          {/* Admin shortcut button */}
          <Link
            to="/admin"
            title={isAdminLoggedIn ? 'Admin Dashboard (Logged In)' : 'Admin Login (Default: Pcas / Pcas@2026)'}
            className="p-2 rounded-full text-slate-400 hover:text-cyan-400 hover:bg-slate-800/80 transition-all flex items-center gap-1 text-xs"
          >
            <Shield className={`w-4 h-4 ${isAdminLoggedIn ? 'text-cyan-400 animate-pulse' : ''}`} />
            <span className="hidden lg:inline font-mono text-[11px] font-bold">ADMIN</span>
          </Link>

          {/* Standalone Register Button: completely outside any container border */}
          <Link to="/register">
            <CyberButton
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="text-xs sm:text-sm px-5 sm:px-6 py-2.5 rounded-full font-black whitespace-nowrap transition-transform hover:scale-105"
              style={{
                boxShadow: `0 0 25px ${theme.glow}`,
              }}
            >
              Register Now
            </CyberButton>
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden mt-3 rounded-3xl bg-[#030712]/95 backdrop-blur-2xl border border-cyan-500/40 p-5 shadow-[0_15px_40px_rgba(0,0,0,0.9)] animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-3 py-2 rounded-xl text-xs font-mono font-semibold uppercase text-slate-300 hover:text-cyan-400 hover:bg-slate-900 border border-slate-800 transition-colors text-center"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2.5">
            <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
              <CyberButton variant="primary" size="md" className="w-full rounded-xl">
                Register Now →
              </CyberButton>
            </Link>

            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2 px-3 text-center text-xs font-mono text-slate-400 hover:text-cyan-400 rounded-xl border border-slate-800 flex items-center justify-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              Admin Portal {isAdminLoggedIn && '(Logged In)'}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
