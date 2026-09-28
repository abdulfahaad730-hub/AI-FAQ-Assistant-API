import { HackathonEvent } from '../types';
import { initialDomains } from './domains';
import { initialProblems } from './problems';
import { initialPrizes, initialSpecialAwards } from './prizes';
import { defaultEmailTemplate } from '../services/emailService';

export const initialEvents: HackathonEvent[] = [
  {
    id: 'event-innovaters-2026',
    name: 'INNOVATERS 2026',
    edition: '2026',
    tagline: 'BUILD. INNOVATE. IMPACT.',
    description: 'A next-generation technology hackathon uniting student innovators, developers, and visionaries to engineer real-world digital breakthroughs.',
    bannerUrl: '',
    eventType: '24-hour',
    durationDisplay: '24 Hours',
    status: 'ACTIVE',
    theme: 'Digital Innovation & Sustainable Future',
    registrationStartDate: '2026-08-01T09:00:00+05:30',
    registrationEndDate: '2026-10-10T23:59:59+05:30',
    eventStartDate: '2026-10-16T09:00:00+05:30',
    eventEndDate: '2026-10-17T09:00:00+05:30',
    checkInTime: '08:00 AM IST (Reporting & ID Verification Desk)',
    venueType: 'offline',
    venueAddress: 'Patrician College of Arts and Science, Canal Bank Road, Gandhi Nagar, Kotturpuram, Chennai, Tamil Nadu - 600085',
    onlineJoinLink: '',
    minTeamSize: 3,
    maxTeamSize: 5,
    maxSlots: 60,
    registrationFeePerMember: 100,
    upiId: 'QR919791272037-9989@unionbankofindia',
    upiPayeeName: 'PATRICIAN COLLEGE OF ARTS AND SCIENCE',
    eligibility: 'Open to all enrolled undergraduate and postgraduate students. Valid college student ID card is mandatory for verification.',
    rules: [
      'Carry physical College Student ID Cards for all registered team members (mandatory for entry).',
      'Bring your own laptops, chargers, surge protectors, and hardware development kits if required.',
      'High-speed Wi-Fi, power outlets, meals, refreshments, and workspace facilities will be provided.',
      'Presentation pitch decks must be in standard 8-slide PPT/PDF format saved in your registered Google Drive folder.',
      'All prototype source code must be authored during the hackathon sprint. Pre-built codebases are strictly prohibited.',
      'Maintain decorum and follow institutional safety protocols throughout the event.'
    ],
    prizes: initialPrizes,
    specialAwards: initialSpecialAwards,
    domains: initialDomains,
    problems: initialProblems,
    contactEmail: 'hackathon@patriciancollege.ac.in',
    contactPhone: '+91 98401 23456 / +91 93424 65500',
    emailTemplate: defaultEmailTemplate,
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  }
];
