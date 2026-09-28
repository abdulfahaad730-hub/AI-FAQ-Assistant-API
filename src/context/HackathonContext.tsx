import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  HackathonConfig, 
  HackathonEvent,
  Domain, 
  ProblemStatement, 
  PrizeTier, 
  SpecialAward, 
  RegistrationSubmission,
  EmailTemplateConfig,
  EmailLog,
  EmailResendRecord
} from '../types';
import { initialConfig } from '../data/initialConfig';
import { initialEvents } from '../data/initialEvents';
import { 
  defaultEmailTemplate, 
  sendConfirmationEmail, 
  sendTestEmail as serviceSendTestEmail,
  generateBroadcastEmailHTML, 
  saveEmailLog, 
  getEmailLogs, 
  clearEmailLogs as clearServiceEmailLogs 
} from '../services/emailService';

/**
 * Validate Hackathon Event Dates:
 * - Registration closing time must be before event start time.
 * - Event end time must be after event start time.
 */
export const validateEventDates = (
  regClose: string, 
  eventStart: string, 
  eventEnd: string
): { valid: boolean; error?: string } => {
  if (!regClose || !eventStart || !eventEnd) {
    return { valid: false, error: 'Registration closing date, event start date, and event end date are all required.' };
  }
  const tClose = new Date(regClose).getTime();
  const tStart = new Date(eventStart).getTime();
  const tEnd = new Date(eventEnd).getTime();

  if (isNaN(tClose) || isNaN(tStart) || isNaN(tEnd)) {
    return { valid: false, error: 'Invalid date/time format. Please provide valid timestamps.' };
  }
  if (tClose >= tStart) {
    return { 
      valid: false, 
      error: 'Registration closing time must be strictly before the event start time.' 
    };
  }
  if (tEnd <= tStart) {
    return { 
      valid: false, 
      error: 'Event end time must be strictly after the event start time.' 
    };
  }
  return { valid: true };
};

/**
 * Helper to generate human-readable date range string from ISO dates
 */
const formatDateRangeDisplay = (startDateStr: string, endDateStr: string): string => {
  try {
    const s = new Date(startDateStr);
    const e = new Date(endDateStr);
    const sMonth = s.toLocaleString('en-US', { month: 'short' });
    const eMonth = e.toLocaleString('en-US', { month: 'short' });
    const sDay = s.getDate();
    const eDay = e.getDate();
    const sYear = s.getFullYear();

    if (sMonth === eMonth && sYear === e.getFullYear()) {
      return `${sMonth} ${sDay} - ${eDay}, ${sYear}`;
    }
    return `${sMonth} ${sDay} - ${eMonth} ${eDay}, ${sYear}`;
  } catch {
    return 'Event Schedule TBA';
  }
};

interface HackathonContextType {
  config: HackathonConfig;
  events: HackathonEvent[];
  activeEvent: HackathonEvent;
  domains: Domain[];
  problems: ProblemStatement[];
  prizes: PrizeTier[];
  specialAwards: SpecialAward[];
  registrations: RegistrationSubmission[];
  isAdminLoggedIn: boolean;
  emailTemplate: EmailTemplateConfig;
  emailLogs: EmailLog[];

  // Event Management Operations
  createEvent: (eventData: Omit<HackathonEvent, 'id' | 'createdAt' | 'updatedAt'>) => Promise<{ success: boolean; event?: HackathonEvent; error?: string }>;
  updateEvent: (id: string, updates: Partial<HackathonEvent>) => Promise<{ success: boolean; error?: string }>;
  activateEvent: (id: string) => Promise<{ success: boolean; error?: string }>;
  archiveEvent: (id: string) => void;
  deleteEvent: (id: string) => { success: boolean; error?: string };
  duplicateEvent: (id: string) => HackathonEvent;

  updateConfig: (newConfig: Partial<HackathonConfig>) => void;
  updatePrizes: (newPrizes: PrizeTier[]) => void;
  updateSpecialAwards: (newAwards: SpecialAward[]) => void;
  addProblem: (problem: ProblemStatement) => void;
  updateProblem: (id: string, updated: Partial<ProblemStatement>) => void;
  deleteProblem: (id: string) => void;
  addRegistration: (submission: Omit<RegistrationSubmission, 'id' | 'createdAt' | 'status' | 'slotNumber' | 'emailStatus' | 'resendHistory'>) => Promise<RegistrationSubmission>;
  updateRegistrationStatus: (id: string, status: 'Pending' | 'Verified' | 'Rejected') => Promise<{ emailSent?: boolean; emailError?: string }>;
  updateRegistrationSlot: (id: string, newSlotNumber: string) => void;
  adminLogin: (username: string, password: string) => boolean;
  adminLogout: () => void;
  resetToDefaults: () => void;
  updateEmailTemplate: (newTemplate: EmailTemplateConfig) => void;
  resendTeamEmail: (registrationId: string) => Promise<{ success: boolean; error?: string }>;
  sendAdminTestEmail: (recipientEmail: string, templateOverride?: EmailTemplateConfig) => Promise<{ success: boolean; error?: string }>;
  sendBroadcastEmail: (subject: string, message: string, targetStatus?: string) => Promise<{ sentCount: number }>;
  clearEmailLogs: () => void;
}

const HackathonContext = createContext<HackathonContextType | undefined>(undefined);

// Initial sample registrations with eventId migration applied
const initialSampleRegistrations: RegistrationSubmission[] = [
  {
    id: 'PCAS-2026-8491',
    eventId: 'event-innovaters-2026',
    slotNumber: 'SLOT-001',
    teamName: 'CyberTitans',
    domainId: 'ai-ml',
    domainName: 'AI & Machine Learning',
    problemStatementId: 'prob-ai-01',
    problemStatementTitle: 'Autonomous Campus Safety & Emergency Response Agent',
    leaderName: 'Aravind Kumar',
    teamSize: 3,
    members: ['Sneha Raman', 'Karthik Raja'],
    phone: '9840192834',
    email: 'aravind.titans@gmail.com',
    totalFee: 300,
    transactionId: 'UPI/409283749102/CR',
    transactionDate: '2026-09-12',
    paymentScreenshotName: 'upi_payment_receipt_8491.png',
    googleDriveLink: 'https://drive.google.com/drive/folders/sample-cybertitans-deck',
    status: 'Verified',
    emailStatus: 'Sent',
    emailSent: true,
    emailSentAt: '2026-09-12T14:32:15Z',
    resendHistory: [],
    createdAt: '2026-09-12T14:32:10Z'
  },
  {
    id: 'PCAS-2026-9214',
    eventId: 'event-innovaters-2026',
    slotNumber: 'SLOT-002',
    teamName: 'NeuralNinjas',
    domainId: 'web-dev',
    domainName: 'Web Development',
    problemStatementId: 'prob-web-01',
    problemStatementTitle: 'Real-Time Collaborative Code & Architecture Sandbox',
    leaderName: 'Priya Dharshini',
    teamSize: 4,
    members: ['Dinesh Babu', 'Meera Nair', 'Rohan Joseph'],
    phone: '9443210987',
    email: 'priya.ninjas@university.edu',
    totalFee: 400,
    transactionId: 'UPI/409384729103/CR',
    transactionDate: '2026-09-13',
    paymentScreenshotName: 'payment_screenshot_9214.jpg',
    googleDriveLink: 'https://drive.google.com/drive/folders/neural-ninjas-collab-deck',
    status: 'Pending',
    emailStatus: 'Pending',
    emailSent: false,
    resendHistory: [],
    createdAt: '2026-09-13T10:15:44Z'
  }
];

export const HackathonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Events collection state
  const [events, setEvents] = useState<HackathonEvent[]>(() => {
    const saved = localStorage.getItem('pcas_hackathon_events');
    if (saved) {
      try {
        const parsed: HackathonEvent[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.warn('Failed parsing saved events, reverting to defaults:', e);
      }
    }
    return initialEvents;
  });

  // Determine active event (fallback to first event if none active)
  const activeEvent: HackathonEvent = useMemo(() => {
    const active = events.find(e => e.status === 'ACTIVE');
    return active || events[0] || initialEvents[0];
  }, [events]);

  // 2. Registrations with eventId migration
  const [registrations, setRegistrations] = useState<RegistrationSubmission[]>(() => {
    const saved = localStorage.getItem('pcas_hackathon_registrations');
    if (saved) {
      try {
        const parsed: RegistrationSubmission[] = JSON.parse(saved);
        // Ensure legacy registrations are tagged with the first eventId
        return parsed.map((r, idx) => ({
          ...r,
          eventId: r.eventId || 'event-innovaters-2026',
          slotNumber: r.slotNumber || `SLOT-${String(idx + 1).padStart(3, '0')}`,
          emailStatus: r.emailStatus || (r.status === 'Verified' ? 'Sent' : 'Pending'),
          emailSent: r.emailSent !== undefined ? r.emailSent : (r.status === 'Verified'),
          resendHistory: r.resendHistory || [],
        }));
      } catch {
        return initialSampleRegistrations;
      }
    }
    return initialSampleRegistrations;
  });

  // 3. Sync HackathonConfig dynamically from activeEvent
  const config: HackathonConfig = useMemo(() => {
    const now = Date.now();
    const regStart = new Date(activeEvent.registrationStartDate).getTime();
    const regEnd = new Date(activeEvent.registrationEndDate).getTime();
    const isRegOpen = (!isNaN(regStart) && !isNaN(regEnd)) ? (now >= regStart && now <= regEnd) : true;

    return {
      name: activeEvent.name,
      edition: activeEvent.edition,
      collegeName: initialConfig.collegeName,
      collegeLocation: initialConfig.collegeLocation,
      tagline: activeEvent.tagline,
      subtitle: activeEvent.description,
      eventDate: activeEvent.eventStartDate,
      eventDateDisplay: formatDateRangeDisplay(activeEvent.eventStartDate, activeEvent.eventEndDate),
      duration: activeEvent.durationDisplay,
      prizePool: activeEvent.prizes?.length ? activeEvent.prizes[0]?.amount || '₹1,00,000+' : '₹1,00,000+',
      expectedParticipants: `${activeEvent.maxSlots * activeEvent.maxTeamSize}+`,
      contactEmail: activeEvent.contactEmail,
      contactPhone: activeEvent.contactPhone,
      registrationStatus: isRegOpen ? 'OPEN' : 'CLOSED',
      registrationFeePerMember: activeEvent.registrationFeePerMember,
      minTeamSize: activeEvent.minTeamSize,
      maxTeamSize: activeEvent.maxTeamSize,
      maxSlots: activeEvent.maxSlots,
      upiId: activeEvent.upiId,
      upiPayeeName: activeEvent.upiPayeeName,
      eventType: activeEvent.eventType,
      venueType: activeEvent.venueType,
      venueAddress: activeEvent.venueAddress,
      onlineJoinLink: activeEvent.onlineJoinLink,
      eligibility: activeEvent.eligibility,
      registrationStartDate: activeEvent.registrationStartDate,
      registrationEndDate: activeEvent.registrationEndDate,
      eventStartDate: activeEvent.eventStartDate,
      eventEndDate: activeEvent.eventEndDate,
      checkInTime: activeEvent.checkInTime,
    };
  }, [activeEvent]);

  // Derived domains, problems, prizes, special awards, email template from activeEvent
  const domains = activeEvent.domains || initialEvents[0].domains;
  const problems = activeEvent.problems || initialEvents[0].problems;
  const prizes = activeEvent.prizes || initialEvents[0].prizes;
  const specialAwards = activeEvent.specialAwards || initialEvents[0].specialAwards;
  const emailTemplate = activeEvent.emailTemplate || defaultEmailTemplate;

  // 4. Email Logs & Admin Authentication
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>(() => getEmailLogs());
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('pcas_admin_auth') === 'true';
  });

  // Local storage synchronization
  useEffect(() => {
    localStorage.setItem('pcas_hackathon_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('pcas_hackathon_registrations', JSON.stringify(registrations));
  }, [registrations]);

  // ================= EVENT MANAGEMENT OPERATIONS =================

  /**
   * Create a new Hackathon Event with date validation
   */
  const createEvent = async (
    eventData: Omit<HackathonEvent, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<{ success: boolean; event?: HackathonEvent; error?: string }> => {
    // Validate dates
    const dateCheck = validateEventDates(
      eventData.registrationEndDate,
      eventData.eventStartDate,
      eventData.eventEndDate
    );
    if (!dateCheck.valid) {
      return { success: false, error: dateCheck.error };
    }

    if (!eventData.name?.trim()) {
      return { success: false, error: 'Hackathon name is required.' };
    }

    const newId = `event-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString();

    const newEvent: HackathonEvent = {
      ...eventData,
      id: newId,
      createdAt: now,
      updatedAt: now,
    };

    setEvents(prev => {
      // If newly created event is set to ACTIVE, set all other events to DRAFT/ARCHIVED
      if (newEvent.status === 'ACTIVE') {
        return [
          newEvent,
          ...prev.map(e => e.status === 'ACTIVE' ? { ...e, status: 'DRAFT' as const } : e)
        ];
      }
      return [newEvent, ...prev];
    });

    return { success: true, event: newEvent };
  };

  /**
   * Update an existing Hackathon Event
   */
  const updateEvent = async (
    id: string, 
    updates: Partial<HackathonEvent>
  ): Promise<{ success: boolean; error?: string }> => {
    const existing = events.find(e => e.id === id);
    if (!existing) return { success: false, error: 'Event not found.' };

    const merged = { ...existing, ...updates };

    // Validate dates
    const dateCheck = validateEventDates(
      merged.registrationEndDate,
      merged.eventStartDate,
      merged.eventEndDate
    );
    if (!dateCheck.valid) {
      return { success: false, error: dateCheck.error };
    }

    setEvents(prev => {
      return prev.map(e => {
        if (e.id === id) {
          return {
            ...e,
            ...updates,
            updatedAt: new Date().toISOString()
          };
        }
        // If this event was activated, demote others
        if (updates.status === 'ACTIVE' && e.id !== id && e.status === 'ACTIVE') {
          return { ...e, status: 'DRAFT' };
        }
        return e;
      });
    });

    return { success: true };
  };

  /**
   * Set an event as the active event for registration and site display
   */
  const activateEvent = async (id: string): Promise<{ success: boolean; error?: string }> => {
    const target = events.find(e => e.id === id);
    if (!target) return { success: false, error: 'Event not found.' };

    setEvents(prev =>
      prev.map(e => ({
        ...e,
        status: e.id === id ? ('ACTIVE' as const) : (e.status === 'ACTIVE' ? ('DRAFT' as const) : e.status),
        updatedAt: new Date().toISOString()
      }))
    );

    return { success: true };
  };

  /**
   * Archive an event
   */
  const archiveEvent = (id: string) => {
    setEvents(prev =>
      prev.map(e => (e.id === id ? { ...e, status: 'ARCHIVED' as const, updatedAt: new Date().toISOString() } : e))
    );
  };

  /**
   * Delete an event
   */
  const deleteEvent = (id: string): { success: boolean; error?: string } => {
    const target = events.find(e => e.id === id);
    if (!target) return { success: false, error: 'Event not found.' };
    if (target.status === 'ACTIVE' && events.length > 1) {
      return { success: false, error: 'Cannot delete the currently active event. Activate another event first.' };
    }
    if (events.length <= 1) {
      return { success: false, error: 'At least one hackathon event must exist in the system.' };
    }

    setEvents(prev => prev.filter(e => e.id !== id));
    return { success: true };
  };

  /**
   * Duplicate an existing event as a new draft
   */
  const duplicateEvent = (id: string): HackathonEvent => {
    const target = events.find(e => e.id === id) || activeEvent;
    const now = new Date().toISOString();
    const cloned: HackathonEvent = {
      ...target,
      id: `event-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: `${target.name} (Copy)`,
      status: 'DRAFT',
      createdAt: now,
      updatedAt: now
    };
    setEvents(prev => [cloned, ...prev]);
    return cloned;
  };

  // ================= GENERAL SETTINGS (UPDATES ACTIVE EVENT) =================

  const updateConfig = (newConfig: Partial<HackathonConfig>) => {
    updateEvent(activeEvent.id, {
      name: newConfig.name ?? activeEvent.name,
      edition: newConfig.edition ?? activeEvent.edition,
      tagline: newConfig.tagline ?? activeEvent.tagline,
      description: newConfig.subtitle ?? activeEvent.description,
      durationDisplay: newConfig.duration ?? activeEvent.durationDisplay,
      minTeamSize: newConfig.minTeamSize ?? activeEvent.minTeamSize,
      maxTeamSize: newConfig.maxTeamSize ?? activeEvent.maxTeamSize,
      maxSlots: newConfig.maxSlots ?? activeEvent.maxSlots,
      registrationFeePerMember: newConfig.registrationFeePerMember ?? activeEvent.registrationFeePerMember,
      upiId: newConfig.upiId ?? activeEvent.upiId,
      upiPayeeName: newConfig.upiPayeeName ?? activeEvent.upiPayeeName,
      contactEmail: newConfig.contactEmail ?? activeEvent.contactEmail,
      contactPhone: newConfig.contactPhone ?? activeEvent.contactPhone,
    });
  };

  const updatePrizes = (newPrizes: PrizeTier[]) => {
    updateEvent(activeEvent.id, { prizes: newPrizes });
  };

  const updateSpecialAwards = (newAwards: SpecialAward[]) => {
    updateEvent(activeEvent.id, { specialAwards: newAwards });
  };

  const addProblem = (newProblem: ProblemStatement) => {
    updateEvent(activeEvent.id, { problems: [newProblem, ...(activeEvent.problems || [])] });
  };

  const updateProblem = (id: string, updated: Partial<ProblemStatement>) => {
    const updatedList = (activeEvent.problems || []).map(p => p.id === id ? { ...p, ...updated } : p);
    updateEvent(activeEvent.id, { problems: updatedList });
  };

  const deleteProblem = (id: string) => {
    const filteredList = (activeEvent.problems || []).filter(p => p.id !== id);
    updateEvent(activeEvent.id, { problems: filteredList });
  };

  const updateEmailTemplate = (newTemplate: EmailTemplateConfig) => {
    updateEvent(activeEvent.id, { emailTemplate: newTemplate });
  };

  // ================= REGISTRATIONS & WORKFLOW =================

  /**
   * Submit registration for the active event.
   * Enforces slot limits, team size limits, and associates with activeEvent.id.
   */
  const addRegistration = async (
    submissionData: Omit<RegistrationSubmission, 'id' | 'createdAt' | 'status' | 'slotNumber' | 'emailStatus' | 'resendHistory'>
  ): Promise<RegistrationSubmission> => {
    // Check max slots constraint for this event
    const eventRegistrations = registrations.filter(r => (r.eventId || activeEvent.id) === activeEvent.id);
    if (activeEvent.maxSlots && eventRegistrations.length >= activeEvent.maxSlots) {
      throw new Error(`Registration is full. Maximum limit of ${activeEvent.maxSlots} teams has been reached for ${activeEvent.name}.`);
    }

    // Allocate consecutive slot number for this event
    const slotCount = eventRegistrations.length + 1;
    const slotNumber = `SLOT-${String(slotCount).padStart(3, '0')}`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    
    const newSubmission: RegistrationSubmission = {
      ...submissionData,
      id: `PCAS-2026-${randomSuffix}`,
      eventId: activeEvent.id,
      slotNumber,
      status: 'Pending',
      emailStatus: 'Pending',
      emailSent: false,
      resendHistory: [],
      createdAt: new Date().toISOString()
    };

    setRegistrations(prev => [newSubmission, ...prev]);
    return newSubmission;
  };

  /**
   * Update Registration Verification Status
   * Automatically dispatches confirmation pass using the event's specific email template.
   */
  const updateRegistrationStatus = async (
    id: string, 
    status: 'Pending' | 'Verified' | 'Rejected'
  ): Promise<{ emailSent?: boolean; emailError?: string }> => {
    const target = registrations.find(r => r.id === id);
    if (!target) return {};

    // Lookup the event linked to this registration
    const targetEvent = events.find(e => e.id === target.eventId) || activeEvent;
    const targetEmailTemplate = targetEvent.emailTemplate || defaultEmailTemplate;

    const shouldAutoSendEmail = 
      status === 'Verified' && 
      target.id && 
      target.slotNumber && 
      target.emailStatus !== 'Sent' && 
      target.emailStatus !== 'Resent';

    if (shouldAutoSendEmail) {
      const candidate: RegistrationSubmission = {
        ...target,
        status: 'Verified',
      };

      const result = await sendConfirmationEmail(candidate, targetEmailTemplate, false);
      setEmailLogs(getEmailLogs());

      if (result.success) {
        setRegistrations(prev =>
          prev.map(r =>
            r.id === id
              ? {
                  ...r,
                  status: 'Verified',
                  emailStatus: 'Sent',
                  emailSent: true,
                  emailSentAt: new Date().toISOString(),
                  emailError: undefined,
                }
              : r
          )
        );
        return { emailSent: true };
      } else {
        const errMsg = result.error || 'Failed to dispatch confirmation email';
        setRegistrations(prev =>
          prev.map(r =>
            r.id === id
              ? {
                  ...r,
                  status: 'Verified',
                  emailStatus: 'Failed',
                  emailError: errMsg,
                }
              : r
          )
        );
        return { emailSent: false, emailError: errMsg };
      }
    } else {
      setRegistrations(prev => prev.map(r => (r.id === id ? { ...r, status } : r)));
      return {};
    }
  };

  const updateRegistrationSlot = (id: string, newSlotNumber: string) => {
    setRegistrations(prev =>
      prev.map(r => (r.id === id ? { ...r, slotNumber: newSlotNumber } : r))
    );
  };

  /**
   * Explicitly resend confirmation email for a registered team using their original event template
   */
  const resendTeamEmail = async (registrationId: string): Promise<{ success: boolean; error?: string }> => {
    const reg = registrations.find(r => r.id === registrationId);
    if (!reg) return { success: false, error: 'Registration record not found' };

    const targetEvent = events.find(e => e.id === reg.eventId) || activeEvent;
    const targetEmailTemplate = targetEvent.emailTemplate || defaultEmailTemplate;

    const result = await sendConfirmationEmail(reg, targetEmailTemplate, true);
    const now = new Date().toISOString();

    const historyRecord: EmailResendRecord = {
      id: `resend-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      sentAt: now,
      recipientEmail: reg.email,
      status: result.success ? 'Sent' : 'Failed',
      errorMessage: result.error,
      triggeredBy: 'Admin Resend Control',
    };

    if (result.success) {
      setRegistrations(prev =>
        prev.map(r =>
          r.id === registrationId
            ? {
                ...r,
                emailStatus: 'Resent',
                emailSent: true,
                emailSentAt: now,
                emailError: undefined,
                resendHistory: [historyRecord, ...(r.resendHistory || [])],
              }
            : r
        )
      );
    } else {
      setRegistrations(prev =>
        prev.map(r =>
          r.id === registrationId
            ? {
                ...r,
                emailStatus: 'Failed',
                emailError: result.error || 'Resend delivery failed',
                resendHistory: [historyRecord, ...(r.resendHistory || [])],
              }
            : r
        )
      );
    }

    setEmailLogs(getEmailLogs());
    return { success: result.success, error: result.error };
  };

  const sendAdminTestEmail = async (
    recipientEmail: string, 
    templateOverride?: EmailTemplateConfig
  ): Promise<{ success: boolean; error?: string }> => {
    const templateToUse = templateOverride || activeEvent.emailTemplate || defaultEmailTemplate;
    const result = await serviceSendTestEmail(recipientEmail, templateToUse);
    setEmailLogs(getEmailLogs());
    return { success: result.success, error: result.error };
  };

  const sendBroadcastEmail = async (
    subject: string,
    message: string,
    targetStatus?: string
  ): Promise<{ sentCount: number }> => {
    const targetTeams = registrations.filter(
      r => !targetStatus || targetStatus === 'ALL' || r.status === targetStatus
    );

    let sentCount = 0;
    for (const team of targetTeams) {
      const targetEvent = events.find(e => e.id === team.eventId) || activeEvent;
      const htmlBody = generateBroadcastEmailHTML(team, subject, message, targetEvent.emailTemplate || defaultEmailTemplate);
      const emailLog: EmailLog = {
        id: `email-bc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        recipientEmail: team.email,
        recipientName: team.leaderName,
        teamName: team.teamName,
        slotNumber: team.slotNumber || 'SLOT-001',
        registrationId: team.id,
        subject,
        type: 'BROADCAST',
        status: 'SIMULATED',
        sentAt: new Date().toISOString(),
        htmlBody,
      };
      saveEmailLog(emailLog);
      sentCount++;
    }

    setEmailLogs(getEmailLogs());
    return { sentCount };
  };

  const clearEmailLogs = () => {
    clearServiceEmailLogs();
    setEmailLogs([]);
  };

  const adminLogin = (user: string, pass: string): boolean => {
    if (user === 'Pcas' && pass === 'Pcas@2026') {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('pcas_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('pcas_admin_auth');
  };

  const resetToDefaults = () => {
    setEvents(initialEvents);
    setRegistrations(initialSampleRegistrations);
    clearServiceEmailLogs();
    setEmailLogs([]);
    localStorage.removeItem('pcas_hackathon_events');
    localStorage.removeItem('pcas_hackathon_registrations');
    localStorage.removeItem('pcas_email_logs');
  };

  return (
    <HackathonContext.Provider
      value={{
        config,
        events,
        activeEvent,
        domains,
        problems,
        prizes,
        specialAwards,
        registrations,
        isAdminLoggedIn,
        emailTemplate,
        emailLogs,
        createEvent,
        updateEvent,
        activateEvent,
        archiveEvent,
        deleteEvent,
        duplicateEvent,
        updateConfig,
        updatePrizes,
        updateSpecialAwards,
        addProblem,
        updateProblem,
        deleteProblem,
        addRegistration,
        updateRegistrationStatus,
        updateRegistrationSlot,
        adminLogin,
        adminLogout,
        resetToDefaults,
        updateEmailTemplate,
        resendTeamEmail,
        sendAdminTestEmail,
        sendBroadcastEmail,
        clearEmailLogs
      }}
    >
      {children}
    </HackathonContext.Provider>
  );
};

export const useHackathon = () => {
  const context = useContext(HackathonContext);
  if (!context) {
    throw new Error('useHackathon must be used within a HackathonProvider');
  }
  return context;
};
