import { ProblemStatement } from '../types';

export const initialProblems: ProblemStatement[] = [
  {
    id: 'prob-ai-01',
    code: 'PS-AI-01',
    domainId: 'ai-ml',
    domainName: 'AI & Machine Learning',
    title: 'Autonomous Campus Safety & Emergency Response Agent',
    shortDesc: 'AI system monitoring multimodal sensor data to predict incidents and dispatch emergency alerts in real time.',
    fullDesc: 'Design an intelligent edge AI pipeline that aggregates real-time video, acoustic signals, and emergency triggers across a college campus to detect anomalies (such as stampedes, fire hazards, or medical distress) and immediately coordinate with first responders.',
    difficulty: 'Advanced',
    expectedDeliverables: [
      'Functional anomaly detection model or prototype',
      'Real-time alert dashboard with geo-fenced campus mapping',
      'API documentation & architecture diagram'
    ]
  },
  {
    id: 'prob-ai-02',
    code: 'PS-AI-02',
    domainId: 'ai-ml',
    domainName: 'AI & Machine Learning',
    title: 'Multilingual Voice Assistant for Regional Public Services',
    shortDesc: 'Generative AI voice interface supporting Tamil and Indian regional languages for accessing welfare services.',
    fullDesc: 'Build a low-latency voice and conversational AI agent tailored for citizens in Tamil Nadu to discover, navigate, and apply for educational and government welfare schemes in spoken Tamil and English.',
    difficulty: 'Intermediate',
    expectedDeliverables: [
      'Speech-to-text and NLP conversational interface',
      'Integration with a sample scheme catalog database',
      'Audio playback & mobile-responsive citizen portal'
    ]
  },
  {
    id: 'prob-web-01',
    code: 'PS-WEB-01',
    domainId: 'web-dev',
    domainName: 'Web Development',
    title: 'Real-Time Collaborative Code & Architecture Sandbox',
    shortDesc: 'Zero-latency browser IDE supporting multiple remote developers, live debugging, and instant previews.',
    fullDesc: 'Develop a modern web platform providing a collaborative coding environment with operational transformation or CRDT-based synchronized editing, terminal execution preview, and integrated audio huddles.',
    difficulty: 'Advanced',
    expectedDeliverables: [
      'Web-based code editor with multi-cursor synchronization',
      'Live code execution environment or containerized preview',
      'Conflict-resolution engine'
    ]
  },
  {
    id: 'prob-web-02',
    code: 'PS-WEB-02',
    domainId: 'web-dev',
    domainName: 'Web Development',
    title: 'Decentralized Academic Credential Verification Portal',
    shortDesc: 'Cryptographically verifiable transcript and certificate verification platform for universities.',
    fullDesc: 'A tamper-proof web portal for higher education institutions to issue digital degree certificates and transcripts with verifiable cryptographic signatures, enabling instant employer verification without administrative overhead.',
    difficulty: 'Intermediate',
    expectedDeliverables: [
      'Institutional issuing portal',
      'Public QR/URL verification reader',
      'Cryptographic hash verification mechanism'
    ]
  },
  {
    id: 'prob-mob-01',
    code: 'PS-MOB-01',
    domainId: 'mobile-apps',
    domainName: 'Mobile Applications',
    title: 'Offline-First Smart Transit & Bus Tracking for Suburban Chennai',
    shortDesc: 'Crowdsourced, mesh-synced transit locator operating reliably even during poor network connectivity.',
    fullDesc: 'Build a mobile app that helps college students and commuters in Kotturpuram and Chennai navigate public transit, incorporating crowdsourced GPS beacons, estimated arrival times, and offline Bluetooth peer-to-peer schedule relay.',
    difficulty: 'Intermediate',
    expectedDeliverables: [
      'React Native / Flutter mobile app build or demo',
      'P2P or low-bandwidth offline sync protocol',
      'Transit route and ETA visualization interface'
    ]
  },
  {
    id: 'prob-sec-01',
    code: 'PS-SEC-01',
    domainId: 'cybersecurity',
    domainName: 'Cybersecurity',
    title: 'Automated Phishing & Social Engineering Shield for Students',
    shortDesc: 'Browser extension and backend intelligence inspecting suspicious URLs, fake fee portals, and emails.',
    fullDesc: 'Create an intelligent security shield that inspects deceptive university fee portals, malicious shortened URLs, and phishing attempts targeting college students, explaining threat vectors in plain language.',
    difficulty: 'Intermediate',
    expectedDeliverables: [
      'Browser extension or URL inspection tool',
      'Heuristic / ML detection engine for credential phishing',
      'Threat breakdown report UI'
    ]
  },
  {
    id: 'prob-fin-01',
    code: 'PS-FIN-01',
    domainId: 'fintech',
    domainName: 'FinTech',
    title: 'Micro-Savings & Smart Budgeting Engine for College Students',
    shortDesc: 'Automated micro-investment and financial wellness app tailored for Indian undergraduate budgets.',
    fullDesc: 'Build a financial literacy and micro-savings tool that analyzes daily UPI expenditures, provides visual budget breakdowns, rounds up spare change into low-risk emergency funds, and prevents overdrafts.',
    difficulty: 'Beginner',
    expectedDeliverables: [
      'Interactive financial dashboard',
      'Simulated round-up savings algorithm',
      'Goal tracker & expense categorization'
    ]
  },
  {
    id: 'prob-med-01',
    code: 'PS-MED-01',
    domainId: 'healthcare',
    domainName: 'Healthcare & MedTech',
    title: 'AI-Powered Early Mental Wellness & Stress Triage for Students',
    shortDesc: 'Privacy-focused biometric & sentiment analyzer offering anonymous student counseling referrals.',
    fullDesc: 'Develop a secure, confidential wellness application that evaluates self-reported student stress patterns, exam fatigue, and sleep habits, recommending proven CBT micro-interventions or connecting with campus counselors anonymously.',
    difficulty: 'Intermediate',
    expectedDeliverables: [
      'Zero-knowledge anonymized student portal',
      'Interactive wellness assessment flow',
      'Counselor appointment booking system'
    ]
  },
  {
    id: 'prob-sus-01',
    code: 'PS-SUS-01',
    domainId: 'sustainability',
    domainName: 'Sustainability & Green Tech',
    title: 'Smart Campus Energy & Carbon Footprint Optimizer',
    shortDesc: 'IoT telemetry dashboard visualizing classroom energy consumption and identifying waste.',
    fullDesc: 'Design an energy analytics platform that tracks electricity consumption across department laboratories and lecture halls, predicting peak demand spikes and suggesting automated power-down schedules.',
    difficulty: 'Intermediate',
    expectedDeliverables: [
      'Simulated sensor data pipeline',
      'Interactive energy heatmaps & carbon analytics',
      'Automated schedule optimization engine'
    ]
  },
  {
    id: 'prob-open-01',
    code: 'PS-OPEN-01',
    domainId: 'open-innovation',
    domainName: 'Open Innovation',
    title: 'Open Innovation: Any Futuristic Breakthrough Solution',
    shortDesc: 'Propose and build your own visionary product solving a pressing real-world issue.',
    fullDesc: 'Teams have full creative freedom to conceptualize, architect, and deliver an original technological breakthrough that creates substantial economic, environmental, or social value.',
    difficulty: 'Beginner',
    expectedDeliverables: [
      'Complete functional prototype or working code repository',
      'Pitch deck demonstrating problem-market fit',
      'Technical architecture specification'
    ]
  }
];
