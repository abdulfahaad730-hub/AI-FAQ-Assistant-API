import { TimelineEvent } from '../types';

export const initialTimeline: TimelineEvent[] = [
  {
    id: 'stage-1',
    stage: 1,
    title: 'Registration Opens',
    date: 'August 15, 2026',
    time: '09:00 AM IST',
    description: 'Portal opens for team registrations across all accredited colleges and universities.',
    completed: true,
    active: false
  },
  {
    id: 'stage-2',
    stage: 2,
    title: 'Idea PPT Submission Deadline',
    date: 'September 25, 2026',
    time: '11:59 PM IST',
    description: 'Teams submit their pitch deck and project concept folder link via the portal.',
    completed: false,
    active: true
  },
  {
    id: 'stage-3',
    stage: 3,
    title: 'Shortlisting & Results',
    date: 'October 02, 2026',
    time: '06:00 PM IST',
    description: 'Screening panel announces top qualified squads invited to the live hackathon finale sprint.',
    completed: false,
    active: false
  },
  {
    id: 'stage-4',
    stage: 4,
    title: 'Team Confirmation & RSVP',
    date: 'October 08, 2026',
    time: '05:00 PM IST',
    description: 'Final RSVP confirmation, mentor assignments, and participant pass generation.',
    completed: false,
    active: false
  },
  {
    id: 'stage-5',
    stage: 5,
    title: 'Hackathon Grand Kickoff',
    date: 'October 16, 2026',
    time: '09:00 AM IST',
    description: 'Inaugural ceremony at Patrician College campus, Kotturpuram. Hacking timer starts!',
    completed: false,
    active: false
  },
  {
    id: 'stage-6',
    stage: 6,
    title: 'Mentoring & Checkpoint 1',
    date: 'October 16, 2026',
    time: '03:00 PM IST',
    description: 'Industry technical mentors review codebases, APIs, and guide architecture adjustments.',
    completed: false,
    active: false
  },
  {
    id: 'stage-7',
    stage: 7,
    title: 'Midnight Evaluation & Review',
    date: 'October 16, 2026',
    time: '11:30 PM IST',
    description: 'Midway milestone review, stress test evaluations, midnight snacks & gaming breaks.',
    completed: false,
    active: false
  },
  {
    id: 'stage-8',
    stage: 8,
    title: 'Code Freeze & Grand Finals Pitch',
    date: 'October 17, 2026',
    time: '09:30 AM IST',
    description: 'Hacking concludes. Finalist squads present live 5-minute demos before the grand jury.',
    completed: false,
    active: false
  },
  {
    id: 'stage-9',
    stage: 9,
    title: 'Valedictory & Prize Distribution',
    date: 'October 17, 2026',
    time: '02:00 PM IST',
    description: 'Felicitation of winners, award handovers, and networking lunch.',
    completed: false,
    active: false
  }
];
