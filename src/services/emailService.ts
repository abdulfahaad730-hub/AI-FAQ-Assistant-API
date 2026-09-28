import { RegistrationSubmission, EmailTemplateConfig, EmailLog } from '../types';

export const defaultEmailTemplate: EmailTemplateConfig = {
  subject: 'Slot Confirmed: {{teamName}} (Slot #{{slotNumber}}) — {{hackathonName}}',
  headerTitle: 'OFFICIAL REGISTRATION CONFIRMATION & SLOT PASS',
  hackathonName: 'INNOVATERS 2026',
  hackathonStartDate: 'October 16, 2026 at 09:00 AM IST',
  hackathonEndDate: 'October 17, 2026 at 09:00 AM IST',
  reportingTime: '08:00 AM IST (Reporting & ID Verification Desk)',
  venue: 'Patrician College of Arts and Science, Canal Bank Road, Gandhi Nagar, Kotturpuram, Chennai, Tamil Nadu - 600085',
  customWelcomeMessage: 'We are thrilled to confirm your team workstation slot for {{hackathonName}}! Your team details and problem statement submission have been officially recorded in our institutional hackathon registry.',
  guidelines: [
    'Carry physical College Student ID Cards for all registered team members (mandatory for campus entry).',
    'Bring your own laptops, chargers, surge protectors, and hardware development kits if working on IoT/embedded tracks.',
    'High-speed campus Wi-Fi, power outlets, meals, energy snacks, and designated rest zones will be provided.',
    'Presentation pitch decks must be in standard 8-slide PPT/PDF format and saved in your registered Google Drive folder.',
    'All prototype code must be authored during the official hackathon sprint window. Pre-built codebases are strictly prohibited.',
    'Maintain decorum and follow event code of conduct and safety protocols throughout the event duration.'
  ],
  contactEmail: 'hackathon@patriciancollege.ac.in',
  contactPhone: '+91 98401 23456 / +91 93424 65500',
};

/**
 * Sample registration object used for realistic live preview in Admin Panel
 */
export const samplePreviewSubmission: RegistrationSubmission = {
  id: 'PCAS-2026-7842',
  slotNumber: 'SLOT-042',
  teamName: 'CyberVanguard',
  domainId: 'ai-ml',
  domainName: 'AI & Machine Learning',
  problemStatementId: 'prob-ai-01',
  problemStatementTitle: 'Autonomous Campus Safety & Emergency Response Agent',
  leaderName: 'Dr. Vikram Seth',
  teamSize: 4,
  members: ['Aarav Patel', 'Riya Sen', 'Aditya Verma'],
  phone: '+91 98401 23456',
  email: 'vikram.vanguard@example.com',
  totalFee: 400,
  transactionId: 'UPI/948271038592/CR',
  transactionDate: '2026-10-10',
  googleDriveLink: 'https://drive.google.com/drive/folders/sample-cybertitans-deck',
  status: 'Verified',
  emailStatus: 'Sent',
  emailSent: true,
  emailSentAt: new Date().toISOString(),
  createdAt: new Date().toISOString()
};

/**
 * Replace placeholders supporting both {{variable}} and {variable}
 */
export const replaceVariables = (text: string, vars: Record<string, string>): string => {
  if (!text) return '';
  let result = text;
  
  const lookup: Record<string, string> = { ...vars };

  if (vars.registrationNumber && !lookup.registrationId) lookup.registrationId = vars.registrationNumber;
  if (vars.registrationId && !lookup.registrationNumber) lookup.registrationNumber = vars.registrationId;
  if (vars.startDateTime && !lookup.startDate) lookup.startDate = vars.startDateTime;
  if (vars.startDate && !lookup.startDateTime) lookup.startDateTime = vars.startDate;
  if (vars.endDateTime && !lookup.endDate) lookup.endDate = vars.endDateTime;
  if (vars.endDate && !lookup.endDateTime) lookup.endDateTime = vars.endDate;
  if (vars.reportingTime && !lookup.checkInTime) lookup.checkInTime = vars.reportingTime;
  if (vars.checkInTime && !lookup.reportingTime) lookup.reportingTime = vars.checkInTime;

  for (const [key, val] of Object.entries(lookup)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'gi'), val || '');
    result = result.replace(new RegExp(`\\{${key}\\}`, 'gi'), val || '');
  }
  return result;
};

/**
 * Generate variable map from registration submission & email template
 */
export const buildVariableMap = (
  submission: RegistrationSubmission,
  template: EmailTemplateConfig
): Record<string, string> => {
  return {
    teamName: submission.teamName || 'Your Team',
    registrationNumber: submission.id || 'PCAS-2026-0000',
    registrationId: submission.id || 'PCAS-2026-0000',
    slotNumber: submission.slotNumber || 'SLOT-001',
    leaderName: submission.leaderName || 'Team Leader',
    domainName: submission.domainName || 'General Track',
    problemStatement: submission.problemStatementTitle || 'Open Challenge',
    hackathonName: template.hackathonName || 'INNOVATERS 2026',
    startDateTime: template.hackathonStartDate,
    startDate: template.hackathonStartDate,
    endDateTime: template.hackathonEndDate,
    endDate: template.hackathonEndDate,
    reportingTime: template.reportingTime,
    checkInTime: template.reportingTime,
    venue: template.venue,
    contactEmail: template.contactEmail,
    contactPhone: template.contactPhone,
    totalFee: submission.totalFee ? `₹${submission.totalFee}` : '₹0',
  };
};

/**
 * Generate responsive cyber HTML Email for Registration Confirmation
 */
export const generateConfirmationEmailHTML = (
  submission: RegistrationSubmission,
  template: EmailTemplateConfig = defaultEmailTemplate
): string => {
  const vars = buildVariableMap(submission, template);
  const subject = replaceVariables(template.subject, vars);
  const welcomeMsg = replaceVariables(template.customWelcomeMessage, vars);
  const headerTitle = replaceVariables(template.headerTitle, vars);
  const hackathonName = replaceVariables(template.hackathonName, vars);
  const venue = replaceVariables(template.venue, vars);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { margin:0; padding:0; background-color:#030712; font-family:'Segoe UI',Roboto,-apple-system,BlinkMacSystemFont,sans-serif; color:#f1f5f9; -webkit-font-smoothing:antialiased; }
    .wrapper { width:100%; background-color:#030712; padding:24px 12px; }
    .container { max-width:640px; margin:0 auto; background-color:#080e21; border:1px solid rgba(0,217,255,0.35); border-radius:20px; overflow:hidden; box-shadow:0 20px 50px rgba(0,0,0,0.85); }
    .header { background:linear-gradient(135deg, #030712 0%, #06182c 50%, #0c1836 100%); padding:32px 24px 22px; text-align:center; border-bottom:1px solid #1e293b; position:relative; }
    .badge-bar { display:inline-block; padding:6px 16px; border-radius:30px; background-color:rgba(0,217,255,0.12); border:1px solid rgba(0,217,255,0.5); color:#00f2fe; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:14px; }
    .title { font-size:26px; font-weight:900; color:#ffffff; margin:0 0 6px; letter-spacing:1px; text-transform:uppercase; }
    .subtitle { font-size:12px; color:#94a3b8; margin:0; }
    .slot-card { margin:24px 20px; padding:22px; background:linear-gradient(135deg, rgba(0,217,255,0.12) 0%, rgba(124,58,237,0.15) 100%); border:2px dashed #00d9ff; border-radius:16px; text-align:center; }
    .slot-label { font-size:11px; font-weight:700; color:#38bdf8; text-transform:uppercase; letter-spacing:2px; margin-bottom:6px; }
    .slot-number { font-size:38px; font-weight:900; color:#00f2fe; margin:0; letter-spacing:2px; text-shadow:0 0 25px rgba(0,217,255,0.6); }
    .slot-sub { font-size:12px; color:#cbd5e1; margin-top:8px; font-family:monospace; }
    .content { padding:12px 26px 32px; }
    .welcome-text { font-size:14px; line-height:1.7; color:#e2e8f0; margin-bottom:24px; }
    .section-title { font-size:12px; font-weight:800; color:#38bdf8; text-transform:uppercase; letter-spacing:1.5px; margin:24px 0 12px; border-bottom:1px solid #1e293b; padding-bottom:8px; display:flex; align-items:center; }
    .details-table { width:100%; border-collapse:collapse; margin-bottom:20px; font-size:13px; }
    .details-table td { padding:10px 12px; border-bottom:1px solid #141f38; }
    .details-table td.label { color:#94a3b8; width:38%; font-weight:600; font-size:12px; text-transform:uppercase; }
    .details-table td.val { color:#ffffff; font-weight:700; }
    .schedule-box { background-color:#040918; border:1px solid #1e293b; border-radius:14px; padding:18px 20px; margin-bottom:24px; }
    .schedule-row { margin-bottom:12px; font-size:13px; }
    .schedule-row:last-child { margin-bottom:0; }
    .schedule-tag { color:#00f2fe; font-weight:700; font-size:11px; text-transform:uppercase; letter-spacing:1px; margin-bottom:3px; }
    .schedule-desc { color:#e2e8f0; font-weight:600; line-height:1.5; }
    .guideline-item { font-size:12.5px; color:#cbd5e1; line-height:1.65; margin-bottom:10px; padding-left:20px; position:relative; }
    .guideline-item::before { content:'▸'; color:#00f2fe; font-weight:900; position:absolute; left:0; font-size:14px; }
    .support-box { background:rgba(6,15,35,0.8); border:1px solid rgba(0,217,255,0.2); border-radius:12px; padding:16px; margin-top:20px; }
    .footer { background-color:#030612; padding:24px 20px; text-align:center; border-top:1px solid #1e293b; font-size:11px; color:#64748b; line-height:1.7; }
    .footer a { color:#38bdf8; text-decoration:none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <div class="badge-bar">● ${headerTitle}</div>
        <div class="title">${hackathonName}</div>
        <div class="subtitle">Department of Computer Applications (BCA) • Patrician College of Arts and Science</div>
      </div>

      <!-- Highlighted Workstation Slot Banner -->
      <div class="slot-card">
        <div class="slot-label">CONFIRMED WORKSTATION SLOT</div>
        <div class="slot-number">${vars.slotNumber}</div>
        <div class="slot-sub">Registration ID: <strong style="color:#00f2fe;">${vars.registrationNumber}</strong></div>
      </div>

      <!-- Main Content -->
      <div class="content">
        <p class="welcome-text">
          Dear <strong>${submission.leaderName}</strong> and Team <strong>${submission.teamName}</strong>,<br><br>
          ${welcomeMsg}
        </p>

        <!-- Team Specifications -->
        <div class="section-title">TEAM & REGISTRATION SPECIFICATIONS</div>
        <table class="details-table">
          <tr>
            <td class="label">Team Name:</td>
            <td class="val">${submission.teamName}</td>
          </tr>
          <tr>
            <td class="label">Team Leader:</td>
            <td class="val">${submission.leaderName} (${submission.phone})</td>
          </tr>
          <tr>
            <td class="label">Squad Size:</td>
            <td class="val">${submission.teamSize} Members</td>
          </tr>
          <tr>
            <td class="label">Members:</td>
            <td class="val">${submission.members && submission.members.length > 0 ? submission.members.join(', ') : submission.leaderName}</td>
          </tr>
          <tr>
            <td class="label">Track / Domain:</td>
            <td class="val" style="color:#38bdf8;">${submission.domainName}</td>
          </tr>
          <tr>
            <td class="label">Problem Statement:</td>
            <td class="val">${submission.problemStatementTitle}</td>
          </tr>
          <tr>
            <td class="label">Registration Fee:</td>
            <td class="val" style="color:#4ade80;">₹${submission.totalFee} (Tx ID: ${submission.transactionId})</td>
          </tr>
        </table>

        <!-- Schedule & Venue -->
        <div class="section-title">EVENT SCHEDULE & VENUE DETAILS</div>
        <div class="schedule-box">
          <div class="schedule-row">
            <div class="schedule-tag">📅 Hackathon Sprint Window</div>
            <div class="schedule-desc">${template.hackathonStartDate} &nbsp;➜&nbsp; ${template.hackathonEndDate}</div>
          </div>
          <div class="schedule-row">
            <div class="schedule-tag">⏰ Mandatory Check-In / Reporting Time</div>
            <div class="schedule-desc" style="color:#00f2fe;">${template.reportingTime}</div>
          </div>
          <div class="schedule-row">
            <div class="schedule-tag">📍 Venue Address / Access Link</div>
            <div class="schedule-desc">${venue}</div>
          </div>
        </div>

        <!-- Rules & Checklist -->
        <div class="section-title">IMPORTANT RULES & CHECKLIST</div>
        <div>
          ${(template.guidelines || []).map(g => `<div class="guideline-item">${replaceVariables(g, vars)}</div>`).join('')}
        </div>

        <!-- Contact Support -->
        <div class="section-title">SUPPORT & INQUIRIES</div>
        <div class="support-box">
          <p style="font-size:12px; color:#94a3b8; margin:0; line-height:1.7;">
            Need assistance with directions, hardware kits, or slot queries?<br>
            📧 Email: <a href="mailto:${template.contactEmail}" style="color:#00f2fe; text-decoration:none;">${template.contactEmail}</a><br>
            📞 Phone / WhatsApp: <strong style="color:#ffffff;">${template.contactPhone}</strong>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <strong>Patrician College of Arts and Science</strong><br>
        Canal Bank Road, Gandhi Nagar, Kotturpuram, Chennai, Tamil Nadu - 600085<br>
        Accredited 'A+' Grade by NAAC • Affiliated with University of Madras<br>
        <span style="font-size:10px; color:#475569; display:block; margin-top:6px;">This is an official automated confirmation pass for ${hackathonName}. Please present this digital email or printed copy at the entrance desk.</span>
      </div>
    </div>
  </div>
</body>
</html>`;
};

/**
 * Send Confirmation Email and log transaction
 */
export const sendConfirmationEmail = async (
  submission: RegistrationSubmission,
  template: EmailTemplateConfig = defaultEmailTemplate,
  isResend = false
): Promise<{ success: boolean; log: EmailLog; error?: string }> => {
  const vars = buildVariableMap(submission, template);
  const subject = replaceVariables(template.subject, vars);
  const htmlBody = generateConfirmationEmailHTML(submission, template);

  let status: 'DELIVERED' | 'SIMULATED' | 'FAILED' = 'SIMULATED';
  let errorMessage: string | undefined = undefined;

  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: submission.email,
        subject,
        html: htmlBody,
        registrationId: submission.id,
        slotNumber: submission.slotNumber,
        isResend,
      }),
    }).catch(() => null);

    if (response) {
      const data = await response.json().catch(() => null);
      if (response.ok && data?.success) {
        status = data.simulated ? 'SIMULATED' : 'DELIVERED';
      } else {
        status = 'FAILED';
        errorMessage = data?.error || `Server responded with HTTP ${response.status}`;
      }
    } else {
      status = 'SIMULATED';
    }
  } catch (err: any) {
    status = 'FAILED';
    errorMessage = err?.message || 'Network error dispatching email';
  }

  const emailLog: EmailLog = {
    id: `email-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    recipientEmail: submission.email,
    recipientName: submission.leaderName,
    teamName: submission.teamName,
    slotNumber: submission.slotNumber || 'SLOT-001',
    registrationId: submission.id,
    subject,
    type: 'CONFIRMATION',
    status,
    sentAt: new Date().toISOString(),
    htmlBody,
    errorMessage,
  };

  saveEmailLog(emailLog);
  return { success: status !== 'FAILED', log: emailLog, error: errorMessage };
};

/**
 * Send Test Email with current template and custom recipient address
 */
export const sendTestEmail = async (
  recipientEmail: string,
  template: EmailTemplateConfig = defaultEmailTemplate
): Promise<{ success: boolean; log: EmailLog; error?: string }> => {
  const testSubmission: RegistrationSubmission = {
    ...samplePreviewSubmission,
    email: recipientEmail,
    teamName: 'CyberVanguard (Test Squad)',
    leaderName: 'Test Administrator',
  };

  const vars = buildVariableMap(testSubmission, template);
  const subject = `[TEST] ${replaceVariables(template.subject, vars)}`;
  const htmlBody = generateConfirmationEmailHTML(testSubmission, template);

  let status: 'DELIVERED' | 'SIMULATED' | 'FAILED' = 'SIMULATED';
  let errorMessage: string | undefined = undefined;

  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: recipientEmail,
        subject,
        html: htmlBody,
        registrationId: testSubmission.id,
        slotNumber: testSubmission.slotNumber,
        isTest: true,
      }),
    }).catch(() => null);

    if (response) {
      const data = await response.json().catch(() => null);
      if (response.ok && data?.success) {
        status = data.simulated ? 'SIMULATED' : 'DELIVERED';
      } else {
        status = 'FAILED';
        errorMessage = data?.error || `Server responded with HTTP ${response.status}`;
      }
    } else {
      status = 'SIMULATED';
    }
  } catch (err: any) {
    status = 'FAILED';
    errorMessage = err?.message || 'Error dispatching test email';
  }

  const emailLog: EmailLog = {
    id: `test-email-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    recipientEmail,
    recipientName: 'Test Administrator',
    teamName: testSubmission.teamName,
    slotNumber: testSubmission.slotNumber,
    registrationId: testSubmission.id,
    subject,
    type: 'TEST',
    status,
    sentAt: new Date().toISOString(),
    htmlBody,
    errorMessage,
  };

  saveEmailLog(emailLog);
  return { success: status !== 'FAILED', log: emailLog, error: errorMessage };
};

/**
 * Generate HTML for Broadcast Announcements
 */
export const generateBroadcastEmailHTML = (
  team: RegistrationSubmission,
  subject: string,
  message: string,
  template: EmailTemplateConfig = defaultEmailTemplate
): string => {
  const vars = buildVariableMap(team, template);
  const processedSubject = replaceVariables(subject, vars);
  const processedMessage = replaceVariables(message, vars).replace(/\n/g, '<br>');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${processedSubject}</title>
  <style>
    body { margin:0; padding:0; background-color:#030712; font-family:'Segoe UI',Roboto,sans-serif; color:#f1f5f9; }
    .container { max-width:620px; margin:20px auto; background-color:#0b1329; border:1px solid #7c3aed50; border-radius:18px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.8); }
    .header { background:linear-gradient(135deg, #030712 0%, #1e1035 100%); padding:25px; text-align:center; border-bottom:1px solid #1e293b; }
    .badge { display:inline-block; padding:4px 12px; border-radius:20px; background:#7c3aed20; border:1px solid #7c3aed60; color:#c084fc; font-size:11px; font-weight:bold; letter-spacing:1px; text-transform:uppercase; margin-bottom:8px; }
    .title { font-size:22px; font-weight:900; color:#ffffff; text-transform:uppercase; margin:0; }
    .content { padding:25px; font-size:14px; line-height:1.7; color:#e2e8f0; }
    .footer { background-color:#040816; padding:18px; text-align:center; font-size:11px; color:#64748b; border-top:1px solid #1e293b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">OFFICIAL ANNOUNCEMENT • ${template.hackathonName}</div>
      <div class="title">Patrician College of Arts and Science</div>
    </div>
    <div class="content">
      <p>Dear <strong>${team.leaderName}</strong> (Team <strong>${team.teamName}</strong> • Slot <strong>${team.slotNumber || 'Assigned'}</strong>),</p>
      <div style="background:#060f22; border-left:3px solid #00d9ff; padding:14px 16px; border-radius:8px; margin:20px 0;">
        ${processedMessage}
      </div>
      <p style="font-size:12px; color:#94a3b8; margin-top:24px;">
        For queries, reach out at <a href="mailto:${template.contactEmail}" style="color:#00d9ff;">${template.contactEmail}</a> or call ${template.contactPhone}.
      </p>
    </div>
    <div class="footer">
      Department of Computer Applications (BCA) • Patrician College, Chennai
    </div>
  </div>
</body>
</html>`;
};

/**
 * Save email log into localStorage
 */
export const saveEmailLog = (log: EmailLog) => {
  try {
    const existing = getEmailLogs();
    const updated = [log, ...existing].slice(0, 100);
    localStorage.setItem('pcas_email_logs', JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save email log', e);
  }
};

/**
 * Retrieve all email logs
 */
export const getEmailLogs = (): EmailLog[] => {
  try {
    const saved = localStorage.getItem('pcas_email_logs');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

/**
 * Clear all email logs
 */
export const clearEmailLogs = () => {
  localStorage.removeItem('pcas_email_logs');
};
