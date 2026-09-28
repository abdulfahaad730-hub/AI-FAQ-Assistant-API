import { PrizeTier, SpecialAward } from '../types';

export const initialPrizes: PrizeTier[] = [
  {
    id: 'prize-1',
    rank: '1st',
    title: 'Grand Champion',
    amount: '₹50,000',
    description: 'The pinnacle award for the most groundbreaking, architecturally sound, and impactful project overall.',
    perks: [
      '₹50,000 Cash Prize',
      'Exclusive Champion Trophy & Gold Medals',
      'Incubation & Seed Funding Guidance',
      'Direct Fast-Track Interview Opportunities',
      'Winner Certificate & Premium Swag Pack'
    ],
    highlight: true
  },
  {
    id: 'prize-2',
    rank: '2nd',
    title: 'First Runner Up',
    amount: '₹30,000',
    description: 'Awarded to the team delivering stellar engineering rigor, market feasibility, and remarkable UI polish.',
    perks: [
      '₹30,000 Cash Prize',
      'Runner Up Trophy & Silver Medals',
      'Industry Mentorship Vouchers',
      'Certificate of Excellence'
    ]
  },
  {
    id: 'prize-3',
    rank: '3rd',
    title: 'Second Runner Up',
    amount: '₹20,000',
    description: 'Awarded to the team demonstrating outstanding creativity and robust execution of their prototype.',
    perks: [
      '₹20,000 Cash Prize',
      'Trophy & Bronze Medals',
      'Cloud Credit Grants',
      'Certificate of Excellence'
    ]
  }
];

export const initialSpecialAwards: SpecialAward[] = [
  {
    id: 'spec-ai',
    title: 'Best AI Solution',
    amount: '₹5,000',
    description: 'Most intelligent application of machine learning, LLM agents, or computer vision.',
    iconName: 'Brain'
  },
  {
    id: 'spec-ui',
    title: 'Best UI / UX Experience',
    amount: '₹5,000',
    description: 'Most intuitive, accessible, and visually captivating design architecture.',
    iconName: 'Palette'
  },
  {
    id: 'spec-innov',
    title: 'Most Innovative Concept',
    amount: '₹5,000',
    description: 'The most audacious, original, and out-of-the-box technological approach.',
    iconName: 'Zap'
  },
  {
    id: 'spec-begin',
    title: 'Best All-Beginner Team',
    amount: '₹5,000',
    description: 'Top-ranking squad composed entirely of first- or second-year undergraduate innovators.',
    iconName: 'Sparkles'
  },
  {
    id: 'spec-impact',
    title: 'Best Social Impact',
    amount: '₹5,000',
    description: 'Solution with the most tangible benefit to environmental, civic, or healthcare welfare.',
    iconName: 'Heart'
  }
];
