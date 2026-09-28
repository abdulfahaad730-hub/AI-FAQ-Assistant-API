import { JudgingCriterion } from '../types';

export const initialJudgingCriteria: JudgingCriterion[] = [
  {
    id: 'crit-1',
    title: 'Innovation & Originality',
    weight: 30,
    description: 'Uniqueness of the concept, novelty of the technological solution, and degree of out-of-the-box thinking.',
    color: '#00D9FF'
  },
  {
    id: 'crit-2',
    title: 'Technical Implementation & Architecture',
    weight: 25,
    description: 'Code quality, system stability, engineering complexity, database design, API design, and error handling.',
    color: '#38BDF8'
  },
  {
    id: 'crit-3',
    title: 'Real-World Impact & Viability',
    weight: 20,
    description: 'Practical relevance, scalability potential, addressable societal or market need, and business sustainability.',
    color: '#A855F7'
  },
  {
    id: 'crit-4',
    title: 'UI / UX Design & Accessibility',
    weight: 15,
    description: 'Interface polish, ease of navigation, responsive design on mobile and desktop, and overall user delight.',
    color: '#C084FC'
  },
  {
    id: 'crit-5',
    title: 'Presentation & Live Demo Pitch',
    weight: 10,
    description: 'Clarity of communication, handling jury questions, adherence to demo time limits, and prototype showcase.',
    color: '#F472B6'
  }
];
