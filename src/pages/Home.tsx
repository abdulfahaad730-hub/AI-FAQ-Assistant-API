import React from 'react';
import { Hero } from '../components/sections/Hero';
import { Countdown } from '../components/sections/Countdown';
import { About } from '../components/sections/About';
import { ClubAbout } from '../components/sections/ClubAbout';
import { Leadership } from '../components/sections/Leadership';
import { Mission } from '../components/sections/Mission';
import { WhyJoin } from '../components/sections/WhyJoin';
import { Domains } from '../components/sections/Domains';
import { ProblemsPreview } from '../components/sections/ProblemsPreview';
import { TechTimeline } from '../components/sections/TechTimeline';
import { Prizes } from '../components/sections/Prizes';
import { RulesAndFees } from '../components/sections/RulesAndFees';
import { Judging } from '../components/sections/Judging';
import { Judges } from '../components/sections/Judges';
import { Sponsors } from '../components/sections/Sponsors';
import { Gallery } from '../components/sections/Gallery';
import { FAQ } from '../components/sections/FAQ';
import { CTA } from '../components/sections/CTA';
import { Contact } from '../components/sections/Contact';

export const Home: React.FC = () => {
  return (
    <div className="relative">
      {/* 1. Fullscreen Hero Section */}
      <Hero />

      {/* 2. Dynamic Countdown to Sprint */}
      <Countdown />

      {/* 3. About the Hackathon Core Pillars */}
      <About />

      {/* 4. Patrician Tech Forum & 24H Offline Format */}
      <ClubAbout />

      {/* 4.1 College Leadership & Department Advisory */}
      <Leadership />

      {/* 5. Mission: Problem-Solving Journey & Interactive vision.js Code Window */}
      <Mission />

      {/* 6. Why Join the Hackathon */}
      <WhyJoin />

      {/* 7. 12 Innovation Domains Grid */}
      <Domains />

      {/* 8. Problem Statements Highlights */}
      <ProblemsPreview />

      {/* 9. Advanced Scroll-Animated Tech Timeline */}
      <TechTimeline />

      {/* 10. Rewards for the Bold: 1st Place Podium & Category Honors */}
      <Prizes />

      {/* 11. Official Rules & Phase-wise Registration Fees */}
      <RulesAndFees />

      {/* 12. Evaluation Criteria Matrix */}
      <Judging />

      {/* 13. Industry Mentors & Judges */}
      <Judges />

      {/* 14. Sponsors & Community Partners */}
      <Sponsors />

      {/* 15. Campus & Hackathon Visual Gallery */}
      <Gallery />

      {/* 16. FAQ Accordion */}
      <FAQ />

      {/* 17. High-Energy Registration CTA Banner */}
      <CTA />

      {/* 18. Campus Location, Kotturpuram Address & Inquiries */}
      <Contact />
    </div>
  );
};
