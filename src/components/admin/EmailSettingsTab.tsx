import React, { useState, useMemo } from 'react';
import { 
  Mail, 
  Send, 
  Eye, 
  RotateCcw, 
  Save, 
  Sparkles, 
  Copy, 
  Check, 
  Smartphone, 
  Monitor, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  History, 
  Info,
  Calendar,
  MapPin,
  FileText,
  Phone
} from 'lucide-react';
import { useHackathon } from '../../context/HackathonContext';
import { CyberButton } from '../common/CyberButton';
import { 
  defaultEmailTemplate, 
  generateConfirmationEmailHTML, 
  samplePreviewSubmission 
} from '../../services/emailService';
import { EmailTemplateConfig, RegistrationSubmission } from '../../types';

export const EmailSettingsTab: React.FC = () => {
  const { 
    emailTemplate, 
    updateEmailTemplate, 
    sendAdminTestEmail, 
    emailLogs, 
    clearEmailLogs,
    registrations 
  } = useHackathon();

  // Local form state for draft edits before saving
  const [form, setForm] = useState<EmailTemplateConfig>({ ...emailTemplate });
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [selectedTeamPreviewId, setSelectedTeamPreviewId] = useState<string>('sample');

  // Test Email state
  const [testEmailAddress, setTestEmailAddress] = useState('admin.hackathon@patriciancollege.ac.in');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testEmailFeedback, setTestEmailFeedback] = useState<{ success?: boolean; message?: string } | null>(null);

  // Notification banners
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Dynamic placeholders definition
  const dynamicPlaceholders = [
    { tag: '{{teamName}}', desc: 'Registered Team Name' },
    { tag: '{{registrationNumber}}', desc: 'Official Registration ID (e.g. PCAS-2026-8491)' },
    { tag: '{{slotNumber}}', desc: 'Confirmed Workstation Slot (e.g. SLOT-001)' },
    { tag: '{{hackathonName}}', desc: 'Name of the Hackathon' },
    { tag: '{{startDateTime}}', desc: 'Sprint Start Date & Time' },
    { tag: '{{endDateTime}}', desc: 'Sprint Finish Date & Time' },
    { tag: '{{reportingTime}}', desc: 'Check-in & ID Verification Time' },
    { tag: '{{venue}}', desc: 'Campus Venue Address or Online Link' },
    { tag: '{{leaderName}}', desc: 'Team Leader Name' },
    { tag: '{{domainName}}', desc: 'Selected Innovation Domain' },
    { tag: '{{contactEmail}}', desc: 'Support Contact Email' },
    { tag: '{{contactPhone}}', desc: 'Support Contact Phone' },
  ];

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCopyTag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 2000);
  };

  const handleAddGuideline = () => {
    setForm(prev => ({
      ...prev,
      guidelines: [...(prev.guidelines || []), '']
    }));
  };

  const handleUpdateGuideline = (idx: number, val: string) => {
    const updated = [...(form.guidelines || [])];
    updated[idx] = val;
    setForm(prev => ({ ...prev, guidelines: updated }));
  };

  const handleRemoveGuideline = (idx: number) => {
    setForm(prev => ({
      ...prev,
      guidelines: (prev.guidelines || []).filter((_, i) => i !== idx)
    }));
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    updateEmailTemplate(form);
    showNotification('success', 'Email confirmation template updated and saved successfully!');
  };

  const handleResetTemplate = () => {
    if (window.confirm('Reset email template to institutional defaults? Any unsaved edits will be discarded.')) {
      setForm({ ...defaultEmailTemplate });
      updateEmailTemplate(defaultEmailTemplate);
      showNotification('success', 'Email template restored to institutional default.');
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmailAddress.trim() || !testEmailAddress.includes('@')) {
      setTestEmailFeedback({ success: false, message: 'Please provide a valid recipient email address.' });
      return;
    }

    setIsSendingTest(true);
    setTestEmailFeedback(null);

    try {
      // Save current form first so the test email uses latest inputs
      updateEmailTemplate(form);
      const result = await sendAdminTestEmail(testEmailAddress.trim());
      setIsSendingTest(false);

      if (result.success) {
        setTestEmailFeedback({ 
          success: true, 
          message: `Test email dispatched successfully to ${testEmailAddress}. Check your inbox or simulated logs.` 
        });
      } else {
        setTestEmailFeedback({ 
          success: false, 
          message: result.error || 'Failed to dispatch test email. Check server email settings.' 
        });
      }
    } catch (err: any) {
      setIsSendingTest(false);
      setTestEmailFeedback({ success: false, message: err.message || 'Error occurred while sending test email.' });
    }
  };

  // Build the active registration object for live preview
  const activePreviewSubmission: RegistrationSubmission = useMemo(() => {
    if (selectedTeamPreviewId === 'sample') {
      return samplePreviewSubmission;
    }
    const found = registrations.find(r => r.id === selectedTeamPreviewId);
    return found || samplePreviewSubmission;
  }, [selectedTeamPreviewId, registrations]);

  // Generate live HTML string based on the active draft form & selected team
  const renderedHtmlPreview = useMemo(() => {
    return generateConfirmationEmailHTML(activePreviewSubmission, form);
  }, [activePreviewSubmission, form]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-[#0a1226] to-[#040817] border border-cyan-500/30 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/40">
              <Mail className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-display font-black text-white uppercase tracking-wide">
              Confirmation Email Control Hub
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Automated delivery triggers when registration is verified with a confirmed workstation slot.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetTemplate}
            className="px-3.5 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-red-400 hover:bg-slate-900 border border-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <CyberButton
            variant="primary"
            size="sm"
            onClick={handleSaveTemplate}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Template
          </CyberButton>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div className={`p-4 rounded-xl text-xs font-mono flex items-center gap-2.5 animate-in fade-in ${
          notification.type === 'success'
            ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
            : 'bg-red-950/80 border border-red-500/50 text-red-300'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Dynamic Placeholders Toolbar */}
      <div className="p-4 rounded-2xl bg-[#060b17] border border-slate-800">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Available Dynamic Variables (Click to Copy)</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            Use inside subject, message, venue, or guidelines
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {dynamicPlaceholders.map(({ tag, desc }) => {
            const isCopied = copiedTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => handleCopyTag(tag)}
                title={desc}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono border transition-all flex items-center gap-1.5 cursor-pointer ${
                  isCopied
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                    : 'bg-slate-950 hover:bg-slate-900 text-cyan-300 border-slate-800 hover:border-cyan-500/50'
                }`}
              >
                {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-500" />}
                <code>{tag}</code>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Form on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Template Form (7 Cols) */}
        <form onSubmit={handleSaveTemplate} className="lg:col-span-6 space-y-6">
          {/* Section 1: Subject & Banner */}
          <div className="p-6 rounded-2xl bg-[#060b17] border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-xs font-mono uppercase tracking-wider text-white font-bold">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Subject & Branding Header</span>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                Email Subject Line
              </label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                Supports {'{{teamName}}'}, {'{{slotNumber}}'}, {'{{hackathonName}}'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                  Header Pass Title
                </label>
                <input
                  type="text"
                  value={form.headerTitle}
                  onChange={(e) => setForm({ ...form, headerTitle: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                  Hackathon Name
                </label>
                <input
                  type="text"
                  value={form.hackathonName}
                  onChange={(e) => setForm({ ...form, hackathonName: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                Welcome / Opening Message
              </label>
              <textarea
                rows={3}
                value={form.customWelcomeMessage}
                onChange={(e) => setForm({ ...form, customWelcomeMessage: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          {/* Section 2: Dates, Times & Venue */}
          <div className="p-6 rounded-2xl bg-[#060b17] border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-xs font-mono uppercase tracking-wider text-white font-bold">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Sprint Schedule & Venue Coordinates</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                  Start Date & Time
                </label>
                <input
                  type="text"
                  value={form.hackathonStartDate}
                  onChange={(e) => setForm({ ...form, hackathonStartDate: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                  End Date & Time
                </label>
                <input
                  type="text"
                  value={form.hackathonEndDate}
                  onChange={(e) => setForm({ ...form, hackathonEndDate: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                Check-in & Reporting Time
              </label>
              <input
                type="text"
                value={form.reportingTime}
                onChange={(e) => setForm({ ...form, reportingTime: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                Highlighted as mandatory arrival time for badge issuance
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Venue Address / Access Link</span>
              </label>
              <textarea
                rows={2}
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          {/* Section 3: Guidelines & Items to Bring */}
          <div className="p-6 rounded-2xl bg-[#060b17] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white font-bold">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>Important Rules & Checklist Items</span>
              </div>
              <button
                type="button"
                onClick={handleAddGuideline}
                className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono flex items-center gap-1 hover:bg-cyan-900 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {(form.guidelines || []).map((rule, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-mono text-cyan-400 font-bold w-6 shrink-0 text-center">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={rule}
                    onChange={(e) => handleUpdateGuideline(idx, e.target.value)}
                    required
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveGuideline(idx)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-900 rounded-lg transition-colors shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Support Contact Info */}
          <div className="p-6 rounded-2xl bg-[#060b17] border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-xs font-mono uppercase tracking-wider text-white font-bold">
              <Phone className="w-4 h-4 text-cyan-400" />
              <span>Admin & Support Contact Details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                  Support Email Address
                </label>
                <input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                  Support Phone / WhatsApp
                </label>
                <input
                  type="text"
                  value={form.contactPhone}
                  onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <CyberButton
              type="submit"
              variant="primary"
              size="md"
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Template Changes
            </CyberButton>
          </div>
        </form>

        {/* Right Column: Live Email Preview & Send Test (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Send Test Email Card */}
          <div className="p-5 rounded-2xl bg-[#060b17] border border-cyan-500/30 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-cyan-400 font-bold">
                <Send className="w-4 h-4" />
                <span>Send Test Email</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Dispatches sample pass instantly
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <input
                type="email"
                placeholder="Enter recipient email..."
                value={testEmailAddress}
                onChange={(e) => setTestEmailAddress(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
              <CyberButton
                type="button"
                variant="secondary"
                size="sm"
                isLoading={isSendingTest}
                onClick={handleSendTestEmail}
                leftIcon={<Send className="w-3.5 h-3.5" />}
                className="shrink-0"
              >
                Send Test
              </CyberButton>
            </div>

            {testEmailFeedback && (
              <div className={`p-3 rounded-xl text-xs font-mono flex items-center gap-2 animate-in fade-in ${
                testEmailFeedback.success
                  ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
                  : 'bg-red-950/80 border border-red-500/50 text-red-300'
              }`}>
                {testEmailFeedback.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                )}
                <span>{testEmailFeedback.message}</span>
              </div>
            )}
          </div>

          {/* Live Preview Container */}
          <div className="rounded-2xl bg-[#060b17] border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
            {/* Preview Toolbar */}
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Live Email Preview
                </span>
              </div>

              {/* Sample Team Switcher & Device Toggle */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedTeamPreviewId}
                  onChange={(e) => setSelectedTeamPreviewId(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 focus:outline-none focus:border-cyan-400"
                >
                  <option value="sample">Demo: CyberVanguard (SLOT-042)</option>
                  {registrations.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.teamName} ({r.slotNumber})
                    </option>
                  ))}
                </select>

                <div className="flex items-center rounded-lg bg-slate-900 p-0.5 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-1.5 rounded-md transition-colors ${
                      previewDevice === 'desktop' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
                    }`}
                    title="Desktop view"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-1.5 rounded-md transition-colors ${
                      previewDevice === 'mobile' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
                    }`}
                    title="Mobile view"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Rendered HTML Sandbox Area */}
            <div className="p-4 bg-slate-950/60 overflow-x-auto flex justify-center min-h-[640px] max-h-[820px] overflow-y-auto">
              <div
                className={`transition-all duration-300 rounded-xl overflow-hidden border border-slate-800 shadow-xl bg-[#030712] ${
                  previewDevice === 'mobile' ? 'w-[360px]' : 'w-full max-w-[650px]'
                }`}
              >
                <iframe
                  title="Email Preview"
                  srcDoc={renderedHtmlPreview}
                  className="w-full min-h-[740px] border-0"
                  sandbox="allow-same-origin"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Audit Log Section */}
      <div className="p-6 rounded-2xl bg-[#060b17] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white font-bold">
            <History className="w-4 h-4 text-cyan-400" />
            <span>Email Activity & Delivery Audit Trail ({emailLogs.length})</span>
          </div>

          {emailLogs.length > 0 && (
            <button
              type="button"
              onClick={clearEmailLogs}
              className="text-[11px] font-mono text-slate-500 hover:text-red-400 transition-colors"
            >
              Clear Logs
            </button>
          )}
        </div>

        {emailLogs.length === 0 ? (
          <div className="py-8 text-center text-slate-500 font-mono text-xs">
            No email transactions logged yet. Send a test email or verify a registration to view logs here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Sent Time</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Recipient</th>
                  <th className="py-2.5 px-3">Team / Slot</th>
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {emailLogs.slice(0, 15).map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/40">
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                      {new Date(log.sentAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.type === 'TEST' 
                          ? 'bg-purple-950 text-purple-300 border border-purple-500/40' 
                          : log.type === 'BROADCAST'
                          ? 'bg-blue-950 text-blue-300 border border-blue-500/40'
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                      }`}>
                        {log.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-200">
                      <div>{log.recipientName}</div>
                      <div className="text-[10px] text-slate-400">{log.recipientEmail}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-white font-bold">{log.teamName}</div>
                      <div className="text-[10px] text-cyan-400">{log.slotNumber}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-300 truncate max-w-[200px]">
                      {log.subject}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 'DELIVERED'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : log.status === 'SIMULATED'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                          : 'bg-red-950 text-red-300 border border-red-500/40'
                      }`}>
                        {log.status}
                      </span>
                      {log.errorMessage && (
                        <div className="text-[10px] text-red-400 mt-0.5 truncate max-w-[150px]" title={log.errorMessage}>
                          {log.errorMessage}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
