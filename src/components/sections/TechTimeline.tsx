import React, { useEffect, useRef, useState } from 'react';
import { Flag, Calendar, Trophy, Rocket } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { useHackathon } from '../../context/HackathonContext';

interface Milestone {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  description: string;
  tags: Array<{ text: string; isLive?: boolean }>;
  icon: 'flag' | 'calendar' | 'trophy' | 'rocket';
}

export const TechTimeline: React.FC = () => {
  const { config } = useHackathon();
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visibleItems, setVisibleItems] = useState<Record<string, boolean>>({});

  const regOpenDate = config.registrationStartDate
    ? new Date(config.registrationStartDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase()
    : 'SEPT 08, 2026';

  const regCloseDate = config.registrationEndDate
    ? new Date(config.registrationEndDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase()
    : 'SEPT 16, 2026';

  const finaleDate = config.eventDateDisplay || (config.eventStartDate
    ? new Date(config.eventStartDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase()
    : 'SEPT 30 — OCT 01, 2026');

  const venueVenueText = config.venueType === 'online'
    ? 'online via official collaboration stream'
    : `at ${config.venueAddress || `${config.collegeName}, ${config.collegeLocation}`}`;

  const venueFormatSubtitle = config.venueType === 'online'
    ? 'Online Virtual Showdown'
    : config.venueType === 'hybrid'
    ? 'Hybrid Multi-Format Showdown'
    : 'In-Person Offline Showdown';

  const milestones: Milestone[] = [
    {
      id: 'm-1',
      date: regOpenDate,
      title: 'Registration Opens',
      subtitle: '& Template Release',
      description: 'Team registrations go live. Official pitch video template and problem statement guidelines are released for all prospective squads.',
      tags: [
        { text: 'PHASE 1 START' },
        { text: 'TEMPLATE RELEASED' },
        { text: config.registrationStatus === 'OPEN' ? 'LIVE NOW' : 'SCHEDULED', isLive: config.registrationStatus === 'OPEN' }
      ],
      icon: 'flag'
    },
    {
      id: 'm-2',
      date: regCloseDate,
      title: 'Registration Closes',
      subtitle: 'Phase 1 Deadline',
      description: 'Final deadline for all Idea Submissions & pitch video uploads. Late entries will not be accepted under any circumstances.',
      tags: [
        { text: 'IDEA SUBMISSION' },
        { text: 'PITCH VIDEO DUE' }
      ],
      icon: 'calendar'
    },
    {
      id: 'm-3',
      date: 'SEPT 23, 2026',
      title: 'Finalist Announcement',
      subtitle: 'Shortlist Published',
      description: 'Top selected squads are notified via registered email. Phase 2 offline confirmation window opens immediately.',
      tags: [
        { text: 'RESULTS PUBLISHED' },
        { text: 'PHASE 2 BEGINS' }
      ],
      icon: 'trophy'
    },
    {
      id: 'm-4',
      date: finaleDate,
      title: 'Grand Finale',
      subtitle: `${config.duration} ${venueFormatSubtitle}`,
      description: `Shortlisted teams converge ${venueVenueText} for the grueling ${config.duration} non-stop hackathon sprint.`,
      tags: [
        { text: (config.venueType || 'offline').toUpperCase() },
        { text: (config.duration || '24 HOURS').toUpperCase() },
        { text: (config.eventType || 'hackathon').toUpperCase() }
      ],
      icon: 'rocket'
    }
  ];

  // Advanced scroll-driven timeline illumination
  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress between 0 and 1
      const totalHeight = rect.height;
      const startY = windowHeight * 0.7; // activates when 30% from bottom
      const currentY = startY - rect.top;
      const progress = Math.min(Math.max(currentY / totalHeight, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection observer for progressive card reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-id');
            if (id) {
              setVisibleItems((prev) => ({ ...prev, [id]: true }));
            }
          }
        });
      },
      { threshold: 0.25 }
    );

    const elements = document.querySelectorAll('.timeline-item-trigger');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const renderIcon = (icon: Milestone['icon'], isHighlighted: boolean) => {
    const props = { className: 'w-4 h-4' };
    return (
      <div
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-500 z-20 ${
          isHighlighted
            ? 'bg-cyan-400 text-slate-950 shadow-[0_0_25px_#00D9FF] ring-4 ring-cyan-500/30 scale-110'
            : 'bg-[#060b17] border-2 border-slate-700 text-slate-400 shadow-md'
        }`}
      >
        {icon === 'flag' && <Flag {...props} />}
        {icon === 'calendar' && <Calendar {...props} />}
        {icon === 'trophy' && <Trophy {...props} />}
        {icon === 'rocket' && <Rocket {...props} />}
      </div>
    );
  };

  return (
    <section id="timeline" className="relative py-28 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/40 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-4">
            <Calendar className="w-3.5 h-3.5" />
            <span>EXECUTION TIMELINE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight uppercase mb-3">
            Sequence of Events — 2026
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-slate-400 max-w-xl mx-auto font-normal">
            Mark your calendar. Every milestone is a checkpoint in the race to the finale.
          </p>
        </div>

        {/* Vertical Timeline Container */}
        <div ref={timelineRef} className="relative pl-6 sm:pl-12 space-y-12 sm:space-y-16">
          {/* Base Background Rail */}
          <div className="absolute top-4 bottom-8 left-[17px] sm:left-[29px] w-[2px] bg-slate-800 pointer-events-none" />

          {/* Dynamic Laser Illuminated Beam that extends with scroll */}
          <div
            className="absolute top-4 left-[17px] sm:left-[29px] w-[2px] bg-gradient-to-b from-cyan-400 via-sky-300 to-purple-500 shadow-[0_0_12px_#00D9FF] pointer-events-none transition-all duration-150"
            style={{ height: `${scrollProgress * 92}%` }}
          >
            {/* Glowing Laser Head Bead */}
            <div className="absolute bottom-0 -left-[3px] w-2 h-2 rounded-full bg-white shadow-[0_0_15px_#00D9FF] animate-ping" />
          </div>

          {/* Milestone Items */}
          {milestones.map((item, index) => {
            const isVisible = visibleItems[item.id];
            const itemThreshold = index / (milestones.length - 1);
            const isHighlighted = scrollProgress >= itemThreshold * 0.85;

            return (
              <div
                key={item.id}
                data-id={item.id}
                className="timeline-item-trigger relative flex items-start gap-5 sm:gap-8 group"
              >
                {/* Node Icon on Rail */}
                <div className="absolute -left-[27px] sm:-left-[39px] top-4">
                  {renderIcon(item.icon, isHighlighted)}
                </div>

                {/* Content Card with Advanced Scroll Appearance */}
                <div
                  className={`w-full transition-all duration-700 transform ${
                    isVisible
                      ? 'opacity-100 translate-y-0 translate-x-0'
                      : 'opacity-0 translate-y-8 translate-x-4'
                  }`}
                >
                  <GlassCard
                    glow={isHighlighted ? 'cyan' : 'none'}
                    className={`p-6 sm:p-7 transition-all duration-300 ${
                      isHighlighted
                        ? 'border-cyan-500/40 shadow-[0_0_30px_rgba(0,217,255,0.12)]'
                        : 'border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    {/* Date Tag */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-xs font-bold text-cyan-400 tracking-wider">
                        {item.date}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight mb-1">
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <p className="text-xs sm:text-sm font-display text-slate-400 font-medium mb-3">
                        {item.subtitle}
                      </p>
                    )}

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5 font-normal">
                      {item.description}
                    </p>

                    {/* Badges / Status Pills */}
                    <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800/80">
                      {item.tags.map((tag) => (
                        <span
                          key={tag.text}
                          className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase transition-all ${
                            tag.isLive
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)] flex items-center gap-1.5'
                              : 'bg-slate-900 text-slate-300 border border-slate-800'
                          }`}
                        >
                          {tag.isLive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          )}
                          {tag.text}
                        </span>
                      ))}
                    </div>
                  </GlassCard>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
