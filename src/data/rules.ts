import { RuleItem } from '../types';

export const initialRules: RuleItem[] = [
  {
    id: 'rule-1',
    number: '01',
    title: 'Team Size & Composition',
    summary: 'Teams must consist of 3 to 5 active students, including 1 designated Team Leader.',
    details: [
      'Inter-departmental and inter-college cross-teams are permitted and encouraged.',
      'A student cannot register as a member of more than one team.',
      'All team members must carry their valid college ID cards for verification during offline rounds.'
    ]
  },
  {
    id: 'rule-2',
    number: '02',
    title: 'Eligibility Criteria',
    summary: 'Open to all currently enrolled undergraduate and postgraduate students from recognized colleges/universities.',
    details: [
      'Students from Arts, Science, Engineering, Computer Applications, and Management disciplines are eligible.',
      'Graduates who completed their degrees in earlier academic years are not eligible to participate as contestants.'
    ]
  },
  {
    id: 'rule-3',
    number: '03',
    title: 'Technology & Tooling',
    summary: 'No restrictions on programming languages, cloud stacks, or open-source libraries.',
    details: [
      'Teams are free to use any modern framework (React, Flutter, Python, Node, Go, Rust, etc.).',
      'Usage of public AI APIs (OpenAI, Gemini, HuggingFace) is allowed, but the custom business logic and integration code must be authored by the team.',
      'Hardware projects must bring their own development boards, sensors, and peripherals.'
    ]
  },
  {
    id: 'rule-4',
    number: '04',
    title: 'Originality & Academic Integrity',
    summary: 'All source code must be written during the hackathon period. Plagiarism results in immediate disqualification.',
    details: [
      'Pre-existing commercial apps or previously published projects cannot be submitted.',
      'Public open-source libraries, UI component libraries, and frameworks are allowed provided they are properly credited.',
      'Code repositories will be scanned for commits and authenticity during evaluation rounds.'
    ]
  },
  {
    id: 'rule-5',
    number: '05',
    title: 'Submission Guidelines',
    summary: 'Submissions must include a working code repository link, PPT pitch deck, and shareable demo.',
    details: [
      'Teams must push their code to GitHub or GitLab with an informative README.',
      'Google Drive folders containing pitch presentations must have sharing set to "Anyone with the link can view".',
      'Late submissions past the code-freeze deadline will not be evaluated.'
    ]
  },
  {
    id: 'rule-6',
    number: '06',
    title: 'Judging Protocol',
    summary: 'Evaluations are conducted objectively based on 5 predefined weighted criteria.',
    details: [
      'Each team receives 5 minutes for live pitch/demo + 3 minutes for Q&A with the jury.',
      'The decision of the judging panel and organizers will be final and binding on all matters.'
    ]
  },
  {
    id: 'rule-7',
    number: '07',
    title: 'Code of Conduct',
    summary: 'Patrician College fosters an inclusive, respectful, and safe collaborative environment.',
    details: [
      'Harassment, discrimination, offensive language, or disruptive behavior of any form will not be tolerated.',
      'Violations will lead to immediate expulsion from the premises and disqualification without fee refund.'
    ]
  },
  {
    id: 'rule-8',
    number: '08',
    title: 'Intellectual Property (IP)',
    summary: 'Teams retain 100% full ownership of all intellectual property, code, and inventions created during the event.',
    details: [
      'Neither Patrician College nor sponsors claim ownership over your software or prototypes.',
      'Participants grant organizers permission to mention project names and showcase photos/demos for non-commercial media.'
    ]
  }
];
