import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  LogOut, 
  ExternalLink, 
  Users, 
  Trophy, 
  CreditCard, 
  Settings, 
  Download, 
  Search, 
  CheckCircle, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw,
  Eye,
  FileCode2,
  X,
  Mail,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Edit2,
  Check,
  CalendarRange,
  Bot
} from 'lucide-react';
import { useHackathon } from '../../context/HackathonContext';
import { CyberButton } from '../common/CyberButton';
import { EmailSettingsTab } from './EmailSettingsTab';
import { EventManagementTab } from './EventManagementTab';
import { FaqManagementTab } from './FaqManagementTab';
import { exportRegistrationsToCSV } from '../../services/api';
import { generateConfirmationEmailHTML } from '../../services/emailService';
import { ProblemStatement, RegistrationSubmission } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { 
    config, 
    events,
    activeEvent,
    updateConfig, 
    prizes, 
    updatePrizes, 
    registrations, 
    updateRegistrationStatus, 
    updateRegistrationSlot,
    resendTeamEmail,
    emailTemplate,
    problems, 
    addProblem, 
    deleteProblem, 
    domains, 
    adminLogout, 
    resetToDefaults 
  } = useHackathon();

  const [activeTab, setActiveTab] = useState<'registrations' | 'events' | 'email-settings' | 'faqs' | 'general' | 'prizes' | 'payment' | 'problems'>('registrations');
  const [saveNotification, setSaveNotification] = useState<{ text: string; isError?: boolean } | null>(null);

  // Editable General Settings Local Form
  const [generalForm, setGeneralForm] = useState({ ...config });

  // Filter States
  const [selectedEventFilter, setSelectedEventFilter] = useState('');

  // Editable Prizes Local Form
  const [prizesForm, setPrizesForm] = useState([...prizes]);

  // Registrations Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('');
  const [selectedEmailStatusFilter, setSelectedEmailStatusFilter] = useState('');

  // Modals & Active Actions
  const [viewReceiptModal, setViewReceiptModal] = useState<RegistrationSubmission | null>(null);
  const [viewEmailModal, setViewEmailModal] = useState<RegistrationSubmission | null>(null);
  const [emailModalTab, setEmailModalTab] = useState<'status' | 'preview'>('status');
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [newSlotValue, setNewSlotValue] = useState('');

  // New Problem Form
  const [newProbCode, setNewProbCode] = useState('');
  const [newProbTitle, setNewProbTitle] = useState('');
  const [newProbDomainId, setNewProbDomainId] = useState(domains[0]?.id || 'ai-ml');
  const [newProbDifficulty, setNewProbDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [newProbDesc, setNewProbDesc] = useState('');

  const triggerNotification = (text: string, isError = false) => {
    setSaveNotification({ text, isError });
    setTimeout(() => setSaveNotification(null), 4000);
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(generalForm);
    triggerNotification('General hackathon settings updated successfully!');
  };

  const handleSavePrizes = (e: React.FormEvent) => {
    e.preventDefault();
    updatePrizes(prizesForm);
    updateConfig({ prizePool: generalForm.prizePool });
    triggerNotification('Prizes & rewards updated successfully!');
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig({
      registrationFeePerMember: Number(generalForm.registrationFeePerMember),
      upiId: generalForm.upiId,
      upiPayeeName: generalForm.upiPayeeName,
    });
    triggerNotification('Payment details & fees updated successfully!');
  };

  const handleAddProblem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProbCode || !newProbTitle || !newProbDesc) return;
    const dom = domains.find(d => d.id === newProbDomainId);
    const newProb: ProblemStatement = {
      id: `prob-${Date.now()}`,
      code: newProbCode,
      domainId: newProbDomainId,
      domainName: dom ? dom.title : 'General',
      title: newProbTitle,
      shortDesc: newProbDesc.slice(0, 100) + '...',
      fullDesc: newProbDesc,
      difficulty: newProbDifficulty,
      expectedDeliverables: ['Functional code repository', 'Pitch deck', 'Architecture overview']
    };
    addProblem(newProb);
    setNewProbCode('');
    setNewProbTitle('');
    setNewProbDesc('');
    triggerNotification('New problem statement added!');
  };

  // Status Change with Automatic Email Trigger & safe error handling
  const handleStatusChange = async (id: string, newStatus: 'Pending' | 'Verified' | 'Rejected') => {
    const result = await updateRegistrationStatus(id, newStatus);
    if (result.emailSent) {
      triggerNotification(`Registration verified! Official confirmation email dispatched to team.`);
    } else if (result.emailError) {
      triggerNotification(`Status updated to Verified, but email delivery failed: ${result.emailError}`, true);
    } else {
      triggerNotification(`Registration status changed to ${newStatus}`);
    }
  };

  // Resend confirmation email handler
  const handleResendConfirmation = async (reg: RegistrationSubmission) => {
    setResendingId(reg.id);
    const result = await resendTeamEmail(reg.id);
    setResendingId(null);

    if (result.success) {
      triggerNotification(`Confirmation email resent to ${reg.email} (${reg.teamName})`);
      if (viewEmailModal && viewEmailModal.id === reg.id) {
        const refreshed = registrations.find(r => r.id === reg.id);
        if (refreshed) setViewEmailModal(refreshed);
      }
    } else {
      triggerNotification(`Resend failed: ${result.error || 'Delivery failure'}`, true);
    }
  };

  // Slot update save
  const handleSaveSlot = (id: string) => {
    if (newSlotValue.trim()) {
      updateRegistrationSlot(id, newSlotValue.trim().toUpperCase());
      triggerNotification(`Workstation slot updated to ${newSlotValue.trim().toUpperCase()}`);
    }
    setEditingSlotId(null);
  };

  // Filtered Registrations
  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch = 
      reg.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.leaderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.slotNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.transactionId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDomain = !selectedDomainFilter || reg.domainId === selectedDomainFilter;
    const matchesStatus = !selectedStatusFilter || reg.status === selectedStatusFilter;
    const matchesEmailStatus = !selectedEmailStatusFilter || reg.emailStatus === selectedEmailStatusFilter;
    const matchesEvent = !selectedEventFilter || (reg.eventId || activeEvent.id) === selectedEventFilter;

    return matchesSearch && matchesDomain && matchesStatus && matchesEmailStatus && matchesEvent;
  });

  // Analytics (scoped to selected event filter or overall)
  const scopedRegistrations = selectedEventFilter 
    ? registrations.filter(r => (r.eventId || activeEvent.id) === selectedEventFilter)
    : registrations;
  const totalTeams = scopedRegistrations.length;
  const totalParticipants = scopedRegistrations.reduce((acc, r) => acc + r.teamSize, 0);
  const totalRevenue = scopedRegistrations.reduce((acc, r) => acc + r.totalFee, 0);
  const pendingCount = scopedRegistrations.filter(r => r.status === 'Pending').length;
  const emailsSentCount = scopedRegistrations.filter(r => r.emailStatus === 'Sent' || r.emailStatus === 'Resent').length;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 z-10 relative max-w-7xl mx-auto">
      {/* Top Admin Header Bar */}
      <div className="p-6 rounded-2xl bg-[#060b17] border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,217,255,0.4)]">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-display font-black text-white uppercase tracking-wide">
                Admin Control Suite
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Logged in as: <strong className="text-cyan-300">Pcas</strong> // {config.collegeName}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/" target="_blank" rel="noopener noreferrer">
            <CyberButton variant="secondary" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
              Live Site
            </CyberButton>
          </Link>

          <CyberButton
            variant="ghost"
            size="sm"
            onClick={adminLogout}
            leftIcon={<LogOut className="w-3.5 h-3.5" />}
          >
            Logout
          </CyberButton>
        </div>
      </div>

      {/* Notification Banner */}
      {saveNotification && (
        <div className={`p-3.5 rounded-xl text-xs font-mono mb-6 flex items-center gap-2 animate-in fade-in ${
          saveNotification.isError 
            ? 'bg-red-950/80 border border-red-500/50 text-red-300' 
            : 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
        }`}>
          {saveNotification.isError ? (
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          ) : (
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{saveNotification.text}</span>
        </div>
      )}

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1">TOTAL TEAMS</span>
          <div className="text-3xl font-display font-black text-white">{totalTeams}</div>
          <span className="text-[10px] text-cyan-400 font-mono mt-1 block">Registered squads</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1">PARTICIPANTS</span>
          <div className="text-3xl font-display font-black text-cyan-400">{totalParticipants}</div>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">Student hackers</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1">FEES COLLECTED</span>
          <div className="text-3xl font-display font-black text-emerald-400">₹{totalRevenue}</div>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">Phase 1 total</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1">PENDING VERIFICATION</span>
          <div className="text-3xl font-display font-black text-amber-400">{pendingCount}</div>
          <span className="text-[10px] text-amber-400/80 font-mono mt-1 block">Awaiting fee review</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 col-span-2 lg:col-span-1">
          <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1">CONFIRMATION EMAILS</span>
          <div className="text-3xl font-display font-black text-purple-400">{emailsSentCount}</div>
          <span className="text-[10px] text-purple-400/80 font-mono mt-1 block">Passes dispatched</span>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4 mb-8">
        {[
          { id: 'registrations', label: 'Registrations', icon: Users },
          { id: 'events', label: 'Event Hub', icon: CalendarRange, highlight: true },
          { id: 'faqs', label: 'AI FAQs & Knowledge', icon: Bot, highlight: true },
          { id: 'email-settings', label: 'Email Settings', icon: Mail },
          { id: 'general', label: 'General & Event Info', icon: Settings },
          { id: 'prizes', label: 'Prizes & Awards', icon: Trophy },
          { id: 'payment', label: 'Payment Settings', icon: CreditCard },
          { id: 'problems', label: 'Problem Statements', icon: FileCode2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(0,217,255,0.4)]'
                  : tab.highlight
                  ? 'bg-cyan-950/40 text-cyan-300 hover:text-white hover:bg-cyan-900/40 border border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.highlight && !isActive && (
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: REGISTRATIONS MANAGEMENT */}
      {activeTab === 'registrations' && (
        <div className="space-y-6">
          {/* Controls Bar: Search, Filters, CSV Export */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search team, slot, leader, email, or tx ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              {/* Event Filter */}
              <select
                value={selectedEventFilter}
                onChange={(e) => setSelectedEventFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-cyan-300 focus:outline-none focus:border-cyan-400 font-mono"
              >
                <option value="">All Events ({events.length})</option>
                {events.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.name} {evt.status === 'ACTIVE' ? '★ (Active)' : `(${evt.status})`}
                  </option>
                ))}
              </select>

              <select
                value={selectedDomainFilter}
                onChange={(e) => setSelectedDomainFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
              >
                <option value="">All Domains</option>
                {domains.map((d) => (
                  <option key={d.id} value={d.id}>{d.title}</option>
                ))}
              </select>

              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
              >
                <option value="">All Statuses</option>
                <option value="Verified">Verified</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>

              <select
                value={selectedEmailStatusFilter}
                onChange={(e) => setSelectedEmailStatusFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 font-mono"
              >
                <option value="">All Email States</option>
                <option value="Sent">Sent</option>
                <option value="Resent">Resent</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            <CyberButton
              variant="primary"
              size="sm"
              onClick={() => exportRegistrationsToCSV(registrations)}
              leftIcon={<Download className="w-3.5 h-3.5" />}
              className="text-xs shrink-0"
            >
              Export CSV ({registrations.length})
            </CyberButton>
          </div>

          {/* Registrations Data Table */}
          <div className="rounded-2xl bg-[#060b17] border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Reg ID & Slot</th>
                    <th className="py-3.5 px-4">Team</th>
                    <th className="py-3.5 px-4">Leader / Contact</th>
                    <th className="py-3.5 px-4">Fee & Tx</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Email Confirmation</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500 font-mono">
                        No team registrations found matching filters.
                      </td>
                    </tr>
                  ) : (
                    filteredRegistrations.map((reg) => {
                      const isResending = resendingId === reg.id;
                      const isEditingSlot = editingSlotId === reg.id;

                      return (
                        <tr key={reg.id} className="hover:bg-slate-900/50 transition-colors">
                          {/* Reg ID & Slot */}
                          <td className="py-4 px-4 space-y-1">
                            <div className="font-bold text-cyan-400">{reg.id}</div>
                            
                            {/* Confirmed Slot Number Badge with edit */}
                            {isEditingSlot ? (
                              <div className="flex items-center gap-1 mt-1">
                                <input
                                  type="text"
                                  value={newSlotValue}
                                  onChange={(e) => setNewSlotValue(e.target.value)}
                                  className="w-20 px-1.5 py-0.5 rounded bg-slate-950 border border-cyan-500 text-[10px] text-white"
                                  autoFocus
                                />
                                <button
                                  type="button"
                                  onClick={() => handleSaveSlot(reg.id)}
                                  className="p-1 rounded bg-emerald-950 text-emerald-400 hover:bg-emerald-900"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingSlotId(null)}
                                  className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                                  {reg.slotNumber || 'Unassigned'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingSlotId(reg.id);
                                    setNewSlotValue(reg.slotNumber || '');
                                  }}
                                  className="text-slate-500 hover:text-cyan-400 p-0.5"
                                  title="Edit workstation slot number"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </td>

                          {/* Team & Domain */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-display font-bold text-white text-sm">{reg.teamName}</span>
                              {(() => {
                                const regEvent = events.find(e => e.id === (reg.eventId || activeEvent.id));
                                return regEvent ? (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                                    {regEvent.name}
                                  </span>
                                ) : null;
                              })()}
                            </div>
                            <div className="text-[11px] text-purple-300">{reg.domainName}</div>
                            <div className="text-[10px] text-slate-500 line-clamp-1 max-w-[220px]">
                              {reg.problemStatementTitle}
                            </div>
                          </td>

                          {/* Leader & Contact */}
                          <td className="py-4 px-4">
                            <div className="text-slate-200 font-semibold">{reg.leaderName}</div>
                            <div className="text-[10px] text-slate-400">{reg.phone}</div>
                            <div className="text-[10px] text-slate-500 truncate max-w-[140px] font-mono" title={reg.email}>
                              {reg.email}
                            </div>
                          </td>

                          {/* Fee & Proof */}
                          <td className="py-4 px-4 space-y-1">
                            <div className="font-bold text-emerald-400">
                              ₹{reg.totalFee} <span className="text-[10px] text-slate-500">({reg.teamSize}p)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setViewReceiptModal(reg)}
                                className="inline-flex items-center gap-0.5 text-[10px] text-cyan-400 hover:text-cyan-300 underline"
                              >
                                <Eye className="w-2.5 h-2.5" />
                                Tx Proof
                              </button>
                              {reg.googleDriveLink && (
                                <a
                                  href={reg.googleDriveLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-0.5 text-[10px] text-purple-400 hover:text-purple-300 underline"
                                >
                                  <ExternalLink className="w-2.5 h-2.5" />
                                  Drive
                                </a>
                              )}
                            </div>
                          </td>

                          {/* Registration Status */}
                          <td className="py-4 px-4">
                            <select
                              value={reg.status}
                              onChange={(e) => handleStatusChange(reg.id, e.target.value as any)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border focus:outline-none cursor-pointer ${
                                reg.status === 'Verified'
                                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                                  : reg.status === 'Pending'
                                  ? 'bg-amber-950/80 text-amber-400 border-amber-500/40'
                                  : 'bg-red-950/80 text-red-400 border-red-500/40'
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Verified">Verified</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </td>

                          {/* Email Confirmation Status */}
                          <td className="py-4 px-4 space-y-1">
                            <div>
                              {reg.emailStatus === 'Sent' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  Sent
                                </span>
                              ) : reg.emailStatus === 'Resent' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-500/40">
                                  <RefreshCw className="w-3 h-3 text-purple-400" />
                                  Resent {reg.resendHistory?.length ? `(${reg.resendHistory.length})` : ''}
                                </span>
                              ) : reg.emailStatus === 'Failed' ? (
                                <span 
                                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-950 text-red-300 border border-red-500/40 cursor-help"
                                  title={reg.emailError || 'Email delivery failed'}
                                >
                                  <AlertTriangle className="w-3 h-3 text-red-400" />
                                  Failed
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-amber-400 border border-amber-500/30">
                                  <Clock className="w-3 h-3" />
                                  Pending Conf.
                                </span>
                              )}
                            </div>

                            {reg.emailSentAt && (
                              <div className="text-[9px] text-slate-500">
                                {new Date(reg.emailSentAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </div>
                            )}

                            {reg.emailError && reg.emailStatus === 'Failed' && (
                              <div className="text-[9px] text-red-400 truncate max-w-[130px]" title={reg.emailError}>
                                {reg.emailError}
                              </div>
                            )}
                          </td>

                          {/* Actions: Resend & Email History */}
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleResendConfirmation(reg)}
                                disabled={isResending}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white border border-slate-800 text-[11px] font-mono flex items-center gap-1 transition-colors disabled:opacity-50 cursor-pointer"
                                title="Resend confirmation pass email"
                              >
                                <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin text-cyan-400' : ''}`} />
                                <span className="hidden sm:inline">Resend</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setViewEmailModal(reg);
                                  setEmailModalTab('status');
                                }}
                                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                                title="View Email Pass & Resend History"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: EVENT MANAGEMENT */}
      {activeTab === 'events' && (
        <EventManagementTab />
      )}

      {/* TAB: FAQ & AI KNOWLEDGE BASE */}
      {activeTab === 'faqs' && (
        <FaqManagementTab />
      )}

      {/* TAB: EMAIL SETTINGS */}
      {activeTab === 'email-settings' && (
        <EmailSettingsTab />
      )}

      {/* TAB 2: GENERAL & HACKATHON SETTINGS */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="max-w-3xl space-y-6">
          <div className="p-6 rounded-2xl bg-[#060b17] border border-slate-800 space-y-5">
            <h3 className="text-base font-display font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800">
              Basic Hackathon Identity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                  Hackathon Name
                </label>
                <input
                  type="text"
                  value={generalForm.name}
                  onChange={(e) => setGeneralForm({ ...generalForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                  Edition
                </label>
                <input
                  type="text"
                  value={generalForm.edition}
                  onChange={(e) => setGeneralForm({ ...generalForm, edition: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                Main Tagline
              </label>
              <input
                type="text"
                value={generalForm.tagline}
                onChange={(e) => setGeneralForm({ ...generalForm, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                Subtitle Description
              </label>
              <textarea
                rows={2}
                value={generalForm.subtitle}
                onChange={(e) => setGeneralForm({ ...generalForm, subtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <CyberButton type="submit" variant="primary" size="md" leftIcon={<Save className="w-4 h-4" />}>
              Save Identity Changes
            </CyberButton>
          </div>
        </form>
      )}

      {/* TAB 3: PRIZES & AWARDS */}
      {activeTab === 'prizes' && (
        <form onSubmit={handleSavePrizes} className="max-w-4xl space-y-6">
          <div className="p-6 rounded-2xl bg-[#060b17] border border-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-display font-bold text-white uppercase tracking-wider">
                Prize Tiers & Perks
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Total Pool:</span>
                <input
                  type="text"
                  value={generalForm.prizePool}
                  onChange={(e) => setGeneralForm({ ...generalForm, prizePool: e.target.value })}
                  className="w-28 px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-bold font-mono text-center"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {prizesForm.map((prize, idx) => (
                <div key={prize.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400">
                      {prize.rank} Place
                    </span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={prize.title}
                      onChange={(e) => {
                        const updated = [...prizesForm];
                        updated[idx].title = e.target.value;
                        setPrizesForm(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                      Cash Amount
                    </label>
                    <input
                      type="text"
                      value={prize.amount}
                      onChange={(e) => {
                        const updated = [...prizesForm];
                        updated[idx].amount = e.target.value;
                        setPrizesForm(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-emerald-400 font-bold"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <CyberButton type="submit" variant="primary" size="md" leftIcon={<Save className="w-4 h-4" />}>
              Save Prize Structure
            </CyberButton>
          </div>
        </form>
      )}

      {/* TAB 4: PAYMENT SETTINGS */}
      {activeTab === 'payment' && (
        <form onSubmit={handleSavePayment} className="max-w-2xl space-y-6">
          <div className="p-6 rounded-2xl bg-[#060b17] border border-slate-800 space-y-5">
            <h3 className="text-base font-display font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800">
              Payment & Fee Collection Controls
            </h3>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                Registration Fee Per Member (INR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono">₹</span>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={generalForm.registrationFeePerMember}
                  onChange={(e) => setGeneralForm({ ...generalForm, registrationFeePerMember: Number(e.target.value) })}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                UPI ID for Registrations
              </label>
              <input
                type="text"
                value={generalForm.upiId}
                onChange={(e) => setGeneralForm({ ...generalForm, upiId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                UPI Beneficiary Payee Name
              </label>
              <input
                type="text"
                value={generalForm.upiPayeeName}
                onChange={(e) => setGeneralForm({ ...generalForm, upiPayeeName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <CyberButton type="submit" variant="primary" size="md" leftIcon={<Save className="w-4 h-4" />}>
              Save Payment Settings
            </CyberButton>
          </div>
        </form>
      )}

      {/* TAB 5: PROBLEM STATEMENTS */}
      {activeTab === 'problems' && (
        <div className="space-y-6">
          {/* Add Problem Statement Form */}
          <form onSubmit={handleAddProblem} className="p-6 rounded-2xl bg-[#060b17] border border-slate-800 space-y-4">
            <h3 className="text-base font-display font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800">
              Publish New Problem Statement
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                  Track Code (e.g. AI-04)
                </label>
                <input
                  type="text"
                  value={newProbCode}
                  onChange={(e) => setNewProbCode(e.target.value)}
                  placeholder="AI-04"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                  Innovation Domain
                </label>
                <select
                  value={newProbDomainId}
                  onChange={(e) => setNewProbDomainId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300"
                >
                  {domains.map((d) => (
                    <option key={d.id} value={d.id}>{d.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                  Difficulty Level
                </label>
                <select
                  value={newProbDifficulty}
                  onChange={(e) => setNewProbDifficulty(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                Challenge Title
              </label>
              <input
                type="text"
                value={newProbTitle}
                onChange={(e) => setNewProbTitle(e.target.value)}
                placeholder="Autonomous Drone Delivery Route Optimizer"
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                Detailed Description
              </label>
              <textarea
                rows={3}
                value={newProbDesc}
                onChange={(e) => setNewProbDesc(e.target.value)}
                placeholder="Explain the background, constraints, and target goal..."
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>

            <CyberButton type="submit" variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Add Problem Statement
            </CyberButton>
          </form>

          {/* List of Existing Problems */}
          <div className="space-y-3">
            <h3 className="text-sm font-mono text-slate-400 uppercase tracking-wider">
              Current Problem Statements ({problems.length})
            </h3>

            {problems.map((prob) => (
              <div
                key={prob.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                      {prob.code}
                    </span>
                    <span className="text-xs font-mono text-purple-400 uppercase">
                      {prob.domainName}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      • {prob.difficulty}
                    </span>
                  </div>
                  <h4 className="text-sm font-display font-bold text-white">
                    {prob.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    {prob.shortDesc}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => deleteProblem(prob.id)}
                  className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors shrink-0"
                  title="Delete Problem"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reset Data Option */}
      <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
        <span>Need to revert changes to original defaults?</span>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Are you sure you want to reset all data back to factory defaults?')) {
              resetToDefaults();
              window.location.reload();
            }
          }}
          className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Data to Defaults</span>
        </button>
      </div>

      {/* MODAL 1: Payment Verification Receipt */}
      {viewReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-lg w-full rounded-2xl bg-slate-950 border border-cyan-500/50 p-6">
            <button
              onClick={() => setViewReceiptModal(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-display font-black text-white uppercase mb-4">
              Payment Verification Details
            </h3>

            <div className="space-y-3 text-xs font-mono mb-6">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Team:</span>
                <span className="text-white font-bold">{viewReceiptModal.teamName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Confirmed Slot:</span>
                <span className="text-cyan-400 font-bold">{viewReceiptModal.slotNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Leader:</span>
                <span className="text-white">{viewReceiptModal.leaderName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Transaction ID:</span>
                <span className="text-cyan-400 font-bold">{viewReceiptModal.transactionId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Transaction Date:</span>
                <span className="text-white">{viewReceiptModal.transactionDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Amount:</span>
                <span className="text-emerald-400 font-bold">₹{viewReceiptModal.totalFee}</span>
              </div>
            </div>

            {viewReceiptModal.paymentScreenshotData ? (
              <div className="rounded-xl overflow-hidden border border-slate-800 max-h-60 bg-black flex items-center justify-center mb-4">
                <img
                  src={viewReceiptModal.paymentScreenshotData}
                  alt="Payment Receipt"
                  className="max-h-56 object-contain"
                />
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-900 text-center text-xs text-slate-400 mb-4 font-mono">
                {viewReceiptModal.paymentScreenshotName || 'Payment receipt screenshot file logged'}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setViewReceiptModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Team Email Status, Resend & Pass Preview */}
      {viewEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-2xl w-full rounded-2xl bg-slate-950 border border-cyan-500/50 p-6 max-h-[90vh] flex flex-col">
            <button
              onClick={() => setViewEmailModal(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <Mail className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-display font-black text-white uppercase">
                Email Confirmation Pass: {viewEmailModal.teamName}
              </h3>
            </div>

            {/* Sub-tabs inside modal */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
              <button
                type="button"
                onClick={() => setEmailModalTab('status')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-colors ${
                  emailModalTab === 'status' 
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Delivery & Resend History
              </button>
              <button
                type="button"
                onClick={() => setEmailModalTab('preview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-colors ${
                  emailModalTab === 'preview' 
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Personalized Pass Preview
              </button>
            </div>

            {/* Tab: Delivery & Resend History */}
            {emailModalTab === 'status' && (
              <div className="space-y-4 overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Recipient Email</span>
                    <strong className="text-white">{viewEmailModal.email}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Confirmed Slot</span>
                    <strong className="text-cyan-400">{viewEmailModal.slotNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Email Status</span>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-0.5 ${
                      viewEmailModal.emailStatus === 'Sent'
                        ? 'bg-emerald-950 text-emerald-300'
                        : viewEmailModal.emailStatus === 'Resent'
                        ? 'bg-purple-950 text-purple-300'
                        : viewEmailModal.emailStatus === 'Failed'
                        ? 'bg-red-950 text-red-300'
                        : 'bg-amber-950 text-amber-300'
                    }`}>
                      {viewEmailModal.emailStatus}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Last Sent Timestamp</span>
                    <strong className="text-slate-300">
                      {viewEmailModal.emailSentAt ? new Date(viewEmailModal.emailSentAt).toLocaleString() : 'Not sent yet'}
                    </strong>
                  </div>
                </div>

                {viewEmailModal.emailError && (
                  <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs font-mono flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold uppercase text-[10px]">Delivery Error Message</div>
                      <div>{viewEmailModal.emailError}</div>
                    </div>
                  </div>
                )}

                {/* Resend History Table */}
                <div>
                  <h4 className="text-xs font-mono uppercase text-slate-400 font-bold mb-2">
                    Resend Audit History ({viewEmailModal.resendHistory?.length || 0})
                  </h4>
                  {(!viewEmailModal.resendHistory || viewEmailModal.resendHistory.length === 0) ? (
                    <div className="p-4 rounded-xl bg-slate-900/40 text-center text-xs text-slate-500 font-mono">
                      No explicit resend transactions recorded for this team yet.
                    </div>
                  ) : (
                    <div className="rounded-xl border border-slate-800 overflow-hidden">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase">
                          <tr>
                            <th className="py-2 px-3">Sent At</th>
                            <th className="py-2 px-3">Recipient</th>
                            <th className="py-2 px-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {viewEmailModal.resendHistory.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-900/50">
                              <td className="py-2.5 px-3 text-slate-300">
                                {new Date(item.sentAt).toLocaleString()}
                              </td>
                              <td className="py-2.5 px-3 text-slate-400">
                                {item.recipientEmail}
                              </td>
                              <td className="py-2.5 px-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  item.status === 'Sent' ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                                }`}>
                                  {item.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Personalized Pass Preview */}
            {emailModalTab === 'preview' && (
              <div className="flex-1 overflow-y-auto rounded-xl border border-slate-800 bg-[#030712] min-h-[400px]">
                <iframe
                  title="Team Pass Preview"
                  srcDoc={generateConfirmationEmailHTML(viewEmailModal, emailTemplate)}
                  className="w-full h-[520px] border-0"
                  sandbox="allow-same-origin"
                />
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <CyberButton
                variant="primary"
                size="sm"
                isLoading={resendingId === viewEmailModal.id}
                onClick={() => handleResendConfirmation(viewEmailModal)}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Resend Confirmation Email Now
              </CyberButton>

              <button
                type="button"
                onClick={() => setViewEmailModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
