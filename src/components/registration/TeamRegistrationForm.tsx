import React, { useState } from 'react';
import { 
  Users, 
  User, 
  Phone, 
  Mail, 
  CreditCard, 
  FolderGit2, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  ExternalLink, 
  UploadCloud, 
  AlertCircle,
  FileCheck2,
  CheckCircle,
  QrCode
} from 'lucide-react';
import { useHackathon } from '../../context/HackathonContext';
import { CyberButton } from '../common/CyberButton';
import { RegistrationSubmission } from '../../types';

interface TeamRegistrationFormProps {
  onSuccess: (submission: RegistrationSubmission) => void;
}

export const TeamRegistrationForm: React.FC<TeamRegistrationFormProps> = ({ onSuccess }) => {
  const { config, domains, problems, addRegistration, activeEvent, registrations } = useHackathon();

  // Dynamic limits from activeEvent / config
  const minSize = activeEvent?.minTeamSize ?? config.minTeamSize ?? 3;
  const maxSize = activeEvent?.maxTeamSize ?? config.maxTeamSize ?? 5;
  const requiredAdditional = Math.max(0, minSize - 1);
  const maxAdditional = Math.max(requiredAdditional, maxSize - 1);

  const eventRegistrations = registrations.filter(
    (r) => (r.eventId || 'event-innovaters-2026') === (activeEvent?.id || 'event-innovaters-2026')
  );
  const maxSlots = activeEvent?.maxSlots ?? config.maxSlots ?? 100;
  const isSlotsFull = eventRegistrations.length >= maxSlots;
  const isRegistrationClosed = config.registrationStatus === 'CLOSED' || (
    activeEvent?.registrationEndDate ? new Date() > new Date(activeEvent.registrationEndDate) : false
  );

  // Form State
  const [teamName, setTeamName] = useState('');
  const [domainId, setDomainId] = useState('');
  const [problemStatementId, setProblemStatementId] = useState('');
  
  // Team members: Leader is Member 1. MemberNames array holds additional members
  const [leaderName, setLeaderName] = useState('');
  const [memberNames, setMemberNames] = useState<string[]>(() => 
    Array.from({ length: Math.max(2, requiredAdditional) }, () => '')
  );

  // Contact
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Payment
  const [transactionId, setTransactionId] = useState('');
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().slice(0, 10));
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string>('');

  // Submission
  const [googleDriveLink, setGoogleDriveLink] = useState('');

  // UI States
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Calculations
  const totalMembers = 1 + memberNames.length;
  const totalFee = totalMembers * config.registrationFeePerMember;

  // Filtered problems based on selected domain
  const availableProblems = domainId
    ? problems.filter((p) => p.domainId === domainId)
    : [];

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(config.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleAddMember = () => {
    if (memberNames.length < maxAdditional) {
      setMemberNames([...memberNames, '']);
    }
  };

  const handleRemoveMember = (index: number) => {
    if (memberNames.length > requiredAdditional) {
      setMemberNames(memberNames.filter((_, i) => i !== index));
    }
  };

  const handleMemberChange = (index: number, value: string) => {
    const updated = [...memberNames];
    updated[index] = value;
    setMemberNames(updated);
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validations
    if (isRegistrationClosed) {
      setErrorMessage('Registration is currently closed for this event.');
      return;
    }
    if (isSlotsFull) {
      setErrorMessage(`All slots for this event have been filled (${eventRegistrations.length}/${maxSlots}).`);
      return;
    }
    if (!teamName.trim()) {
      setErrorMessage('Please enter your Team Name.');
      return;
    }
    if (!domainId) {
      setErrorMessage('Please select an Innovation Domain.');
      return;
    }
    if (!problemStatementId) {
      setErrorMessage('Please select a Problem Statement.');
      return;
    }
    if (!leaderName.trim()) {
      setErrorMessage('Please enter the Team Leader name.');
      return;
    }
    for (let i = 0; i < requiredAdditional; i++) {
      if (!memberNames[i]?.trim()) {
        setErrorMessage(`Member ${i + 2} name is required. Minimum team size is ${minSize}.`);
        return;
      }
    }
    if (totalMembers < minSize) {
      setErrorMessage(`Minimum team size is ${minSize} members.`);
      return;
    }
    if (totalMembers > maxSize) {
      setErrorMessage(`Maximum team size is ${maxSize} members.`);
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit WhatsApp phone number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!transactionId.trim()) {
      setErrorMessage('Please provide your UPI / Bank Transaction ID.');
      return;
    }
    if (!googleDriveLink.trim() || (!googleDriveLink.includes('drive.google.com') && !googleDriveLink.includes('drv.link'))) {
      setErrorMessage('Please provide a valid Google Drive folder link containing your pitch deck.');
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedDomain = domains.find((d) => d.id === domainId);
      const selectedProblem = problems.find((p) => p.id === problemStatementId);

      const submission = await addRegistration({
        teamName,
        domainId,
        domainName: selectedDomain ? selectedDomain.title : 'General Track',
        problemStatementId,
        problemStatementTitle: selectedProblem ? selectedProblem.title : 'Open Innovation',
        leaderName,
        teamSize: totalMembers,
        members: memberNames.filter((m) => m.trim() !== ''),
        phone,
        email,
        totalFee,
        transactionId,
        transactionDate,
        paymentScreenshotName: screenshotFile ? screenshotFile.name : 'screenshot_uploaded.png',
        paymentScreenshotData: screenshotPreview || undefined,
        googleDriveLink,
      });

      setIsSubmitting(false);
      onSuccess(submission);
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage('Failed to submit registration. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Title & Subtitle matching Screenshot 1 */}
      <div className="text-center pt-6 pb-2">
        <h1 className="text-4xl sm:text-5xl font-display font-black text-white tracking-tight uppercase mb-3">
          Team <span className="text-cyan-400 text-glow-cyan">Registration</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-normal leading-relaxed">
          Fill in your team details, choose your domain and problem statement, then complete payment to secure your spot.
        </p>
      </div>

      {/* Registration Status / Slot Indicator Banner */}
      {isRegistrationClosed ? (
        <div className="p-4 rounded-xl bg-amber-950/70 border border-amber-500/50 text-amber-200 text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="font-bold text-amber-300">REGISTRATION CLOSED</div>
              <div className="text-[11px] text-amber-400/80">Registration for {activeEvent?.name || config.name} is currently closed.</div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-amber-900/80 text-amber-300 font-bold text-[10px] border border-amber-600/40">CLOSED</span>
        </div>
      ) : isSlotsFull ? (
        <div className="p-4 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <div className="font-bold text-red-300">ALL SLOTS ALLOCATED</div>
              <div className="text-[11px] text-red-400/80">All {maxSlots} team slots have been claimed for this event.</div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-red-900/80 text-red-300 font-bold text-[10px] border border-red-600/40">CAP REACHED</span>
        </div>
      ) : (
        <div className="px-4 py-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs font-mono flex items-center justify-between text-slate-300">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active Event: <strong className="text-white">{activeEvent?.name || config.name}</strong></span>
          </span>
          <span className="text-cyan-400 font-mono text-xs">
            Slots Available: <strong className="text-white">{maxSlots - eventRegistrations.length}</strong> / {maxSlots}
          </span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs font-mono flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* SECTION 1: TEAM INFORMATION (Screenshot 1) */}
      <div className="rounded-2xl bg-[#060b17]/90 border border-cyan-500/25 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-2 pb-5 mb-6 border-b border-slate-800 text-cyan-400 font-mono text-xs uppercase font-bold tracking-widest">
          <Users className="w-4 h-4" />
          <span>TEAM INFORMATION</span>
        </div>

        <div className="space-y-5">
          {/* Team Name */}
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
              TEAM NAME <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. NeuralNinjas"
              required
              className="w-full px-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all font-mono"
            />
          </div>

          {/* Domain & Problem Statement Chained Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                DOMAIN <span className="text-cyan-400">*</span>
              </label>
              <select
                value={domainId}
                onChange={(e) => {
                  setDomainId(e.target.value);
                  setProblemStatementId(''); // reset problem on domain switch
                }}
                required
                className="w-full px-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all"
              >
                <option value="">Select Domain</option>
                {domains.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.number}. {d.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                PROBLEM STATEMENT <span className="text-cyan-400">*</span>
              </label>
              <select
                value={problemStatementId}
                onChange={(e) => setProblemStatementId(e.target.value)}
                disabled={!domainId}
                required
                className="w-full px-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {domainId ? 'Select Problem Statement' : 'Select a domain first'}
                </option>
                {availableProblems.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code} - {p.title}
                  </option>
                ))}
                {domainId && (
                  <option value="custom-open-challenge">
                    PS-CUSTOM - Self Proposed Innovation Idea
                  </option>
                )}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: TEAM MEMBERS (Screenshot 2) */}
      <div className="rounded-2xl bg-[#060b17]/90 border border-cyan-500/25 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between pb-5 mb-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-bold tracking-widest">
            <User className="w-4 h-4" />
            <span>TEAM MEMBERS</span>
          </div>

          {/* Team size indicator */}
          <div className="px-3.5 py-1 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs font-mono text-slate-300 flex items-center gap-2">
            <span className="font-bold text-cyan-400 text-sm">{totalMembers}</span>
            <span className="text-[11px] text-slate-400">members · min {minSize} / max {maxSize} (Leader + {minSize - 1}–{maxSize - 1} members)</span>
          </div>
        </div>

        <div className="space-y-5">
          {/* Team Leader (Member 1) */}
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
              TEAM LEADER NAME (MEMBER 1) <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              value={leaderName}
              onChange={(e) => setLeaderName(e.target.value)}
              placeholder="Full name of team leader"
              required
              className="w-full px-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all font-mono"
            />
          </div>

          {/* Additional Members Grid */}
          <div className="pt-2">
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-3">
              TEAM MEMBERS
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {memberNames.map((name, index) => {
                const memberNum = index + 2;
                const isRequired = index < requiredAdditional;

                return (
                  <div key={index} className="relative">
                    <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                      MEMBER {memberNum} {isRequired ? '(REQUIRED)' : '(OPTIONAL)'}{' '}
                      {isRequired && <span className="text-cyan-400">*</span>}
                    </label>

                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 font-mono text-xs text-cyan-400/70 select-none">
                        {String(memberNum).padStart(2, '0')}
                      </span>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => handleMemberChange(index, e.target.value)}
                        placeholder={`Member ${memberNum} full name`}
                        required={isRequired}
                        className="w-full pl-10 pr-10 py-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all font-mono"
                      />
                      {!isRequired && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(index)}
                          className="absolute right-3 p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-900 transition-colors"
                          title="Remove optional member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Member Button */}
          {totalMembers < maxSize && (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleAddMember}
                className="px-5 py-2.5 rounded-xl border border-dashed border-cyan-500/50 bg-cyan-950/20 text-cyan-300 hover:bg-cyan-950/40 hover:border-cyan-400 transition-all text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ ADD MEMBER ({totalMembers}/{maxSize})</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: CONTACT DETAILS (Screenshot 3) */}
      <div className="rounded-2xl bg-[#060b17]/90 border border-cyan-500/25 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-2 pb-5 mb-6 border-b border-slate-800 text-cyan-400 font-mono text-xs uppercase font-bold tracking-widest">
          <Phone className="w-4 h-4" />
          <span>CONTACT DETAILS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              PHONE NUMBER (WHATSAPP) <span className="text-cyan-400">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit WhatsApp number"
              required
              className="w-full px-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              EMAIL ID <span className="text-cyan-400">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="team@university.edu"
              required
              className="w-full px-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all font-mono"
            />
          </div>
        </div>
      </div>

      {/* SECTION 4: PAYMENT DETAILS (Screenshot 3 & 4) */}
      <div className="rounded-2xl bg-[#060b17]/90 border border-cyan-500/25 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-2 pb-5 mb-6 border-b border-slate-800 text-cyan-400 font-mono text-xs uppercase font-bold tracking-widest">
          <CreditCard className="w-4 h-4" />
          <span>PAYMENT DETAILS</span>
        </div>

        {/* Payment Container matching Screenshot 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
          {/* Left: White QR Code Card */}
          <div className="lg:col-span-5">
            <div className="bg-white text-slate-950 rounded-2xl p-5 shadow-2xl flex flex-col items-center text-center">
              {/* College & Union Bank Header */}
              <div className="flex items-center justify-center gap-2 mb-3 pb-2 border-b border-slate-200 w-full">
                <img
                  src="/college-logo.png"
                  alt="Patrician College Logo"
                  className="w-7 h-7 object-contain rounded-full"
                />
                <span className="font-display font-black text-xs tracking-tight text-slate-900 uppercase">
                  PATRICIAN COLLEGE OF ARTS & SCIENCE
                </span>
              </div>

              {/* Scannable QR Code */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-inner mb-3">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                    `upi://pay?pa=${config.upiId}&pn=${encodeURIComponent(config.upiPayeeName)}&am=${totalFee}&cu=INR`
                  )}`}
                  alt="UPI Payment QR"
                  className="w-40 h-40 object-contain mx-auto"
                />
              </div>

              {/* BHIM UPI Badge at bottom */}
              <div className="flex items-center gap-1.5 text-xs font-bold font-mono tracking-wider text-slate-800">
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>BHIM UPI // SECURE PAYMENT</span>
              </div>
            </div>
          </div>

          {/* Right: Fee Box, UPI ID, and Instructions */}
          <div className="lg:col-span-7 space-y-4">
            {/* Registration Fee Box */}
            <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase text-slate-400 block mb-0.5">
                  REGISTRATION FEE
                </span>
                <span className="text-xs font-mono text-slate-300">
                  ₹{config.registrationFeePerMember} × {totalMembers} members
                </span>
              </div>
              <div className="text-3xl font-display font-black text-cyan-400">
                ₹{totalFee}
              </div>
            </div>

            {/* Official UPI ID with 1-Click Copy */}
            <div className="p-5 rounded-xl bg-slate-950/80 border border-cyan-500/30 flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono uppercase text-cyan-400 block mb-1">
                  OFFICIAL UPI ID
                </span>
                <span className="font-mono text-xs sm:text-sm font-bold text-white break-all">
                  {config.upiId}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyUpi}
                className="px-3.5 py-2 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900 text-xs font-mono font-bold flex items-center gap-1.5 shrink-0 transition-colors"
              >
                {copiedUpi ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Pay via UPI App (Mobile Only) */}
            <a
              href={`upi://pay?pa=${config.upiId}&pn=${encodeURIComponent(config.upiPayeeName)}&am=${totalFee}&cu=INR`}
              className="w-full py-3.5 px-4 rounded-xl bg-cyan-400 text-slate-950 font-display font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-cyan-300 shadow-[0_0_20px_rgba(0,217,255,0.4)] transition-all"
            >
              <span>Pay ₹{totalFee} via UPI App (Mobile Only)</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
              Scan with <strong className="text-slate-200">Google Pay, PhonePe, Paytm, BHIM</strong>, or any UPI app. After payment, enter the Transaction ID and upload the screenshot below.
            </p>
          </div>
        </div>

        {/* Transaction ID & Screenshot Upload (Screenshot 4) */}
        <div className="pt-6 border-t border-slate-800 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                TRANSACTION ID <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="UPI / Bank Transaction ID"
                required
                className="w-full px-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                DATE OF TRANSACTION <span className="text-cyan-400">*</span>
              </label>
              <input
                type="date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all font-mono"
              />
            </div>
          </div>

          {/* Screenshot Upload Drag & Drop Area */}
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
              SCREENSHOT OF TRANSACTION <span className="text-cyan-400">*</span>
            </label>

            <label className="relative border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-950/40 hover:bg-slate-950/70 transition-all">
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleScreenshotUpload}
                className="sr-only"
              />

              {screenshotPreview ? (
                <div className="flex items-center gap-4">
                  <img
                    src={screenshotPreview}
                    alt="Receipt Preview"
                    className="w-16 h-16 object-cover rounded-xl border border-cyan-500/40 shadow-md"
                  />
                  <div className="text-left">
                    <p className="text-xs font-mono text-cyan-400 font-bold flex items-center gap-1.5">
                      <FileCheck2 className="w-4 h-4 text-emerald-400" />
                      {screenshotFile?.name || 'Screenshot Loaded'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Click to change uploaded receipt
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 text-cyan-400 mb-2" />
                  <p className="text-xs font-display font-bold text-slate-200">
                    Drag & drop your payment screenshot
                  </p>
                  <p className="text-[11px] font-mono text-slate-500 mt-1">
                    PNG / JPG / WEBP · Max 5 MB
                  </p>
                </>
              )}
            </label>
          </div>
        </div>
      </div>

      {/* SECTION 5: PROJECT SUBMISSION (GOOGLE DRIVE FOLDER) (Screenshot 4 & 5) */}
      <div className="rounded-2xl bg-[#060b17]/90 border border-cyan-500/25 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-2 pb-5 mb-6 border-b border-slate-800 text-cyan-400 font-mono text-xs uppercase font-bold tracking-widest">
          <FolderGit2 className="w-4 h-4" />
          <span>PROJECT SUBMISSION (GOOGLE DRIVE FOLDER)</span>
        </div>

        {/* Cyan Info Alert matching Screenshot 4 */}
        <div className="p-5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 mb-5 space-y-3">
          <div className="flex items-start gap-2.5 text-xs text-slate-200">
            <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Create a <strong>Google Drive folder</strong> for your team containing your files and paste the shareable folder link below:
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pl-6">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              PPT Pitch Deck: MANDATORY
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono text-slate-400 border border-slate-800 bg-slate-900/60">
              o Demo Video: OPTIONAL (Max 3 mins)
            </span>
          </div>

          <p className="pl-6 text-[11px] font-mono text-cyan-300/80">
            Important: Set the Google Drive folder access to <strong>"Anyone with the link can view"</strong> so the judges can evaluate your submission.
          </p>
        </div>

        {/* Drive Folder Link Input matching Screenshot 5 */}
        <div>
          <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
            GOOGLE DRIVE FOLDER LINK <span className="text-cyan-400">*</span>
          </label>
          <input
            type="url"
            value={googleDriveLink}
            onChange={(e) => setGoogleDriveLink(e.target.value)}
            placeholder="https://drive.google.com/drive/folders/... or drv.link/..."
            required
            className="w-full px-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all font-mono"
          />
          <p className="text-[11px] font-mono text-slate-500 mt-2">
            Accepted: drive.google.com links or drv.link short URLs (mobile clipboard). Set folder access to "Anyone with the link can view".
          </p>
        </div>
      </div>

      {/* SUBMIT BUTTON (Screenshot 5) */}
      <div className="pt-2 text-center space-y-4">
        <CyberButton
          type="submit"
          variant="primary"
          size="xl"
          isLoading={isSubmitting}
          disabled={isRegistrationClosed || isSlotsFull}
          leftIcon={<CheckCircle className="w-5 h-5" />}
          className="w-full text-base sm:text-lg py-5 shadow-[0_0_35px_rgba(0,217,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRegistrationClosed
            ? 'Registration Closed'
            : isSlotsFull
            ? 'Event Registration Full'
            : 'Submit Registration'}
        </CyberButton>

        <p className="text-xs font-mono text-slate-400">
          By submitting, you agree to the {config.name} rules and code of conduct.
        </p>
      </div>
    </form>
  );
};
