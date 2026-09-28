import { RegistrationSubmission } from '../types';

export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '';

export const exportRegistrationsToCSV = (registrations: RegistrationSubmission[]) => {
  if (!registrations || registrations.length === 0) {
    alert('No registrations available to export.');
    return;
  }

  const headers = [
    'Registration ID',
    'Team Name',
    'Domain',
    'Problem Statement',
    'Team Leader',
    'Team Size',
    'Members',
    'WhatsApp Phone',
    'Email',
    'Total Fee (INR)',
    'Transaction ID',
    'Transaction Date',
    'Google Drive Folder',
    'Status',
    'Submitted At'
  ];

  const rows = registrations.map(reg => [
    `"${reg.id}"`,
    `"${reg.teamName.replace(/"/g, '""')}"`,
    `"${reg.domainName.replace(/"/g, '""')}"`,
    `"${reg.problemStatementTitle.replace(/"/g, '""')}"`,
    `"${reg.leaderName.replace(/"/g, '""')}"`,
    reg.teamSize,
    `"${reg.members.join('; ').replace(/"/g, '""')}"`,
    `"${reg.phone}"`,
    `"${reg.email}"`,
    reg.totalFee,
    `"${reg.transactionId}"`,
    `"${reg.transactionDate}"`,
    `"${reg.googleDriveLink}"`,
    `"${reg.status}"`,
    `"${new Date(reg.createdAt).toLocaleString()}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `patrician_hackathon_registrations_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
