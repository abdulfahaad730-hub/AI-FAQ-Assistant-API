export type HackathonEventType = 
  | '12-hour' 
  | '24-hour' 
  | '36-hour' 
  | '48-hour' 
  | 'multi-day' 
  | 'online' 
  | 'offline' 
  | 'hybrid';

export type VenueType = 'offline' | 'online' | 'hybrid';

export type EventStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

export interface HackathonConfig {
  name: string;
  edition: string;
  collegeName: string;
  collegeLocation: string;
  tagline: string;
  subtitle: string;
  eventDate: string; // ISO string for countdown calculation
  eventDateDisplay: string;
  duration: string;
  prizePool: string;
  expectedParticipants: string;
  contactEmail: string;
  contactPhone: string;
  registrationStatus: 'OPEN' | 'CLOSED';
  registrationFeePerMember: number;
  minTeamSize: number;
  maxTeamSize: number;
  maxSlots?: number;
  upiId: string;
  upiPayeeName: string;
  eventType?: HackathonEventType;
  venueType?: VenueType;
  venueAddress?: string;
  onlineJoinLink?: string;
  eligibility?: string;
  registrationStartDate?: string;
  registrationEndDate?: string;
  eventStartDate?: string;
  eventEndDate?: string;
  checkInTime?: string;
}

export interface PrizeTier {
  id: string;
  rank: '1st' | '2nd' | '3rd';
  title: string;
  amount: string;
  description: string;
  perks: string[];
  highlight?: boolean;
}

export interface SpecialAward {
  id: string;
  title: string;
  amount: string;
  description: string;
  iconName: string;
}

export interface Domain {
  id: string;
  number: string;
  title: string;
  description: string;
  iconName: string;
  tags: string[];
}

export interface ProblemStatement {
  id: string;
  code: string;
  domainId: string;
  domainName: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  expectedDeliverables: string[];
}

export interface TimelineEvent {
  id: string;
  stage: number;
  title: string;
  date: string;
  time: string;
  description: string;
  completed?: boolean;
  active?: boolean;
}

export interface RuleItem {
  id: string;
  number: string;
  title: string;
  summary: string;
  details: string[];
}

export interface JudgingCriterion {
  id: string;
  title: string;
  weight: number;
  description: string;
  color: string;
}

export interface Judge {
  id: string;
  name: string;
  role: string;
  company: string;
  expertise: string;
  image: string;
  linkedin: string;
}

export interface Sponsor {
  id: string;
  name: string;
  tier: 'TITLE' | 'GOLD' | 'SILVER' | 'COMMUNITY';
  placeholder: string;
  logoText: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'ALL' | 'EVENTS' | 'WORKSHOPS' | 'HACKATHONS' | 'CAMPUS';
  imageUrl: string;
  caption: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  college: string;
  role: string;
  year: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface EmailResendRecord {
  id: string;
  sentAt: string;
  recipientEmail: string;
  status: 'Sent' | 'Failed';
  errorMessage?: string;
  triggeredBy?: string;
}

export interface RegistrationSubmission {
  id: string;
  eventId?: string; // Identifier of the specific hackathon event
  slotNumber: string; // e.g. "SLOT-001"
  teamName: string;
  domainId: string;
  domainName: string;
  problemStatementId: string;
  problemStatementTitle: string;
  leaderName: string;
  teamSize: number;
  members: string[]; // Member 2, Member 3, Member 4, Member 5 names
  phone: string;
  email: string;
  totalFee: number;
  transactionId: string;
  transactionDate: string;
  paymentScreenshotName?: string;
  paymentScreenshotData?: string; // base64 data preview
  googleDriveLink: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  emailStatus: 'Pending' | 'Sent' | 'Failed' | 'Resent';
  emailSent?: boolean;
  emailSentAt?: string;
  emailError?: string;
  resendHistory?: EmailResendRecord[];
  createdAt: string;
}

export interface EmailTemplateConfig {
  subject: string;
  headerTitle: string;
  hackathonName: string;
  hackathonStartDate: string;
  hackathonEndDate: string;
  reportingTime: string;
  venue: string;
  customWelcomeMessage: string;
  guidelines: string[];
  contactEmail: string;
  contactPhone: string;
}

export interface EmailLog {
  id: string;
  recipientEmail: string;
  recipientName: string;
  teamName: string;
  slotNumber: string;
  registrationId: string;
  subject: string;
  type: 'CONFIRMATION' | 'BROADCAST' | 'CUSTOM' | 'TEST';
  status: 'DELIVERED' | 'SIMULATED' | 'FAILED';
  sentAt: string;
  htmlBody: string;
  errorMessage?: string;
}

export interface HackathonEvent {
  id: string;
  name: string;
  edition: string;
  tagline: string;
  description: string;
  bannerUrl?: string;
  logoUrl?: string;
  eventType: HackathonEventType;
  durationDisplay: string; // e.g. "24 Hours", "36 Hours", "48 Hours", "3 Days"
  status: EventStatus;
  theme: string;
  registrationStartDate: string; // ISO string
  registrationEndDate: string; // ISO string (Registration Closing Time)
  eventStartDate: string; // ISO string
  eventEndDate: string; // ISO string
  checkInTime: string; // e.g. "08:00 AM IST"
  venueType: VenueType;
  venueAddress: string;
  onlineJoinLink?: string;
  minTeamSize: number;
  maxTeamSize: number;
  maxSlots: number;
  registrationFeePerMember: number;
  upiId: string;
  upiPayeeName: string;
  eligibility: string;
  rules: string[];
  prizes: PrizeTier[];
  specialAwards: SpecialAward[];
  domains: Domain[];
  problems: ProblemStatement[];
  contactEmail: string;
  contactPhone: string;
  emailTemplate: EmailTemplateConfig;
  createdAt: string;
  updatedAt: string;
}
