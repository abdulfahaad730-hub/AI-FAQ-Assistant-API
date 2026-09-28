import React, { useState } from 'react';
import { 
  CalendarRange, 
  Plus, 
  Edit3, 
  Copy, 
  Archive, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Users, 
  AlertTriangle, 
  Check, 
  X, 
  Save, 
  Layers,
  Radio
} from 'lucide-react';
import { useHackathon, validateEventDates } from '../../context/HackathonContext';
import { CyberButton } from '../common/CyberButton';
import { HackathonEvent, HackathonEventType, VenueType, EventStatus } from '../../types';

export const EventManagementTab: React.FC = () => {
  const { 
    events, 
    activeEvent, 
    createEvent, 
    updateEvent, 
    activateEvent, 
    archiveEvent, 
    deleteEvent, 
    duplicateEvent,
    registrations 
  } = useHackathon();

  const [notification, setNotification] = useState<{ text: string; isError?: boolean } | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<HackathonEvent, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    edition: '2026',
    tagline: 'BUILD. INNOVATE. IMPACT.',
    description: '',
    bannerUrl: '',
    eventType: '24-hour',
    durationDisplay: '24 Hours',
    status: 'DRAFT',
    theme: 'Digital Innovation & AI Breakthroughs',
    registrationStartDate: new Date().toISOString().slice(0, 16),
    registrationEndDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 16),
    eventStartDate: new Date(Date.now() + 20 * 86400000).toISOString().slice(0, 16),
    eventEndDate: new Date(Date.now() + 21 * 86400000).toISOString().slice(0, 16),
    checkInTime: '08:00 AM IST (Reporting Desk)',
    venueType: 'offline',
    venueAddress: 'Patrician College of Arts and Science, Canal Bank Road, Gandhi Nagar, Kotturpuram, Chennai - 600085',
    onlineJoinLink: '',
    minTeamSize: 3,
    maxTeamSize: 5,
    maxSlots: 60,
    registrationFeePerMember: 100,
    upiId: 'QR919791272037-9989@unionbankofindia',
    upiPayeeName: 'PATRICIAN COLLEGE OF ARTS AND SCIENCE',
    eligibility: 'Open to all undergraduate and postgraduate college students across India.',
    rules: [
      'Carry physical College Student ID Cards for all registered team members.',
      'Bring your own laptops, chargers, surge protectors, and hardware kits.',
      'All code must be authored during the scheduled sprint window.',
      'Presentation pitch decks must be in standard 8-slide PPT/PDF format.'
    ],
    prizes: activeEvent.prizes || [],
    specialAwards: activeEvent.specialAwards || [],
    domains: activeEvent.domains || [],
    problems: activeEvent.problems || [],
    contactEmail: 'hackathon@patriciancollege.ac.in',
    contactPhone: '+91 98401 23456',
    emailTemplate: { ...activeEvent.emailTemplate }
  });

  const [dateValidationError, setDateValidationError] = useState<string | null>(null);

  const showNotification = (text: string, isError = false) => {
    setNotification({ text, isError });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      edition: '2026',
      tagline: 'INVENT. SCALE. DELIVER.',
      description: 'An intense hackathon uniting student innovators to engineer real-world digital breakthroughs.',
      bannerUrl: '',
      eventType: '36-hour',
      durationDisplay: '36 Hours',
      status: 'DRAFT',
      theme: 'Autonomous Systems & Smart Infrastructure',
      registrationStartDate: new Date().toISOString().slice(0, 16),
      registrationEndDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 16),
      eventStartDate: new Date(Date.now() + 20 * 86400000).toISOString().slice(0, 16),
      eventEndDate: new Date(Date.now() + 22 * 86400000).toISOString().slice(0, 16),
      checkInTime: '08:30 AM IST (Registration Check-in Desk)',
      venueType: 'hybrid',
      venueAddress: 'Patrician College Campus & Virtual Hackathon Discord Server',
      onlineJoinLink: 'https://discord.gg/patrician-hackathon',
      minTeamSize: 2,
      maxTeamSize: 4,
      maxSlots: 50,
      registrationFeePerMember: 100,
      upiId: activeEvent.upiId || 'QR919791272037-9989@unionbankofindia',
      upiPayeeName: activeEvent.upiPayeeName || 'PATRICIAN COLLEGE OF ARTS AND SCIENCE',
      eligibility: 'Open to all enrolled college students.',
      rules: [...activeEvent.rules],
      prizes: [...activeEvent.prizes],
      specialAwards: [...activeEvent.specialAwards],
      domains: [...activeEvent.domains],
      problems: [...activeEvent.problems],
      contactEmail: activeEvent.contactEmail,
      contactPhone: activeEvent.contactPhone,
      emailTemplate: {
        ...activeEvent.emailTemplate,
        subject: 'Slot Confirmed: {{teamName}} (Slot #{{slotNumber}})',
      }
    });
    setEditingEventId(null);
    setDateValidationError(null);
    setModalMode('create');
  };

  const handleOpenEdit = (event: HackathonEvent) => {
    setFormData({
      name: event.name,
      edition: event.edition,
      tagline: event.tagline,
      description: event.description,
      bannerUrl: event.bannerUrl || '',
      eventType: event.eventType,
      durationDisplay: event.durationDisplay,
      status: event.status,
      theme: event.theme,
      registrationStartDate: event.registrationStartDate?.slice(0, 16) || '',
      registrationEndDate: event.registrationEndDate?.slice(0, 16) || '',
      eventStartDate: event.eventStartDate?.slice(0, 16) || '',
      eventEndDate: event.eventEndDate?.slice(0, 16) || '',
      checkInTime: event.checkInTime,
      venueType: event.venueType,
      venueAddress: event.venueAddress,
      onlineJoinLink: event.onlineJoinLink || '',
      minTeamSize: event.minTeamSize,
      maxTeamSize: event.maxTeamSize,
      maxSlots: event.maxSlots,
      registrationFeePerMember: event.registrationFeePerMember,
      upiId: event.upiId,
      upiPayeeName: event.upiPayeeName,
      eligibility: event.eligibility,
      rules: [...(event.rules || [])],
      prizes: [...(event.prizes || [])],
      specialAwards: [...(event.specialAwards || [])],
      domains: [...(event.domains || [])],
      problems: [...(event.problems || [])],
      contactEmail: event.contactEmail,
      contactPhone: event.contactPhone,
      emailTemplate: { ...(event.emailTemplate || activeEvent.emailTemplate) }
    });
    setEditingEventId(event.id);
    setDateValidationError(null);
    setModalMode('edit');
  };

  // Inline check whenever dates change in form
  const handleDateChange = (field: 'registrationStartDate' | 'registrationEndDate' | 'eventStartDate' | 'eventEndDate', value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    const check = validateEventDates(
      updated.registrationEndDate,
      updated.eventStartDate,
      updated.eventEndDate
    );
    if (!check.valid) {
      setDateValidationError(check.error || null);
    } else {
      setDateValidationError(null);
    }
  };

  const handleEventTypeChange = (type: HackathonEventType) => {
    let autoDuration = '24 Hours';
    if (type === '12-hour') autoDuration = '12 Hours';
    else if (type === '24-hour') autoDuration = '24 Hours';
    else if (type === '36-hour') autoDuration = '36 Hours';
    else if (type === '48-hour') autoDuration = '48 Hours';
    else if (type === 'multi-day') autoDuration = '3 Days Sprint';
    else if (type === 'online') autoDuration = 'Online Sprint';
    else if (type === 'offline') autoDuration = 'In-Person Sprint';
    else if (type === 'hybrid') autoDuration = 'Hybrid Sprint';

    setFormData(prev => ({
      ...prev,
      eventType: type,
      durationDisplay: autoDuration
    }));
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check dates
    const check = validateEventDates(
      formData.registrationEndDate,
      formData.eventStartDate,
      formData.eventEndDate
    );
    if (!check.valid) {
      setDateValidationError(check.error || null);
      showNotification(check.error || 'Invalid event schedule dates', true);
      return;
    }

    if (!formData.name.trim()) {
      showNotification('Hackathon name is required', true);
      return;
    }

    if (modalMode === 'create') {
      const result = await createEvent(formData);
      if (result.success) {
        showNotification(`Hackathon event "${formData.name}" created successfully!`);
        setModalMode(null);
      } else {
        showNotification(result.error || 'Failed to create event', true);
      }
    } else if (modalMode === 'edit' && editingEventId) {
      const result = await updateEvent(editingEventId, formData);
      if (result.success) {
        showNotification(`Hackathon event "${formData.name}" updated successfully!`);
        setModalMode(null);
      } else {
        showNotification(result.error || 'Failed to update event', true);
      }
    }
  };

  const handleActivate = async (eventId: string, eventName: string) => {
    const result = await activateEvent(eventId);
    if (result.success) {
      showNotification(`"${eventName}" is now the ACTIVE event for site registrations!`);
    } else {
      showNotification(result.error || 'Failed to activate event', true);
    }
  };

  const handleDuplicate = (eventId: string) => {
    const cloned = duplicateEvent(eventId);
    showNotification(`Cloned "${cloned.name}" as draft!`);
  };

  const handleDelete = (eventId: string, eventName: string) => {
    if (window.confirm(`Are you sure you want to permanently delete event "${eventName}"?`)) {
      const result = deleteEvent(eventId);
      if (result.success) {
        showNotification(`Event "${eventName}" deleted.`);
      } else {
        showNotification(result.error || 'Cannot delete event', true);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="p-6 rounded-2xl bg-[#060b17] border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/40">
              <CalendarRange className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-display font-black text-white uppercase tracking-wide">
              Event Management Control Hub
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Create, configure, and switch between any hackathon format (12h, 24h, 36h, 48h, Multi-day, Online, Offline, Hybrid).
          </p>
        </div>

        <CyberButton
          variant="primary"
          size="sm"
          onClick={handleOpenCreate}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create New Event
        </CyberButton>
      </div>

      {/* Notifications */}
      {notification && (
        <div className={`p-4 rounded-xl text-xs font-mono flex items-center gap-2.5 animate-in fade-in ${
          notification.isError
            ? 'bg-red-950/80 border border-red-500/50 text-red-300'
            : 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
        }`}>
          {notification.isError ? (
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Active Event Showcase Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/30 via-slate-900 to-purple-950/30 border border-cyan-500/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/50">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                ACTIVE FOR REGISTRATION
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40 uppercase">
                {activeEvent.eventType}
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-500/40 uppercase">
                {activeEvent.durationDisplay}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
              {activeEvent.name} <span className="text-cyan-400 text-sm font-mono align-middle">({activeEvent.edition})</span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {activeEvent.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Starts: <strong className="text-white">{new Date(activeEvent.eventStartDate).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                <span className="truncate max-w-[280px]">{activeEvent.venueAddress}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>Squads: <strong className="text-white">{registrations.filter(r => (r.eventId || activeEvent.id) === activeEvent.id).length}</strong> / {activeEvent.maxSlots}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <CyberButton
              variant="secondary"
              size="sm"
              onClick={() => handleOpenEdit(activeEvent)}
              leftIcon={<Edit3 className="w-4 h-4" />}
            >
              Edit Active Event
            </CyberButton>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div>
        <h3 className="text-sm font-mono uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>All Configured Events ({events.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => {
            const isActive = evt.status === 'ACTIVE';
            const evtRegistrations = registrations.filter(r => (r.eventId || activeEvent.id) === evt.id);
            const slotPercentage = evt.maxSlots ? Math.min(100, Math.round((evtRegistrations.length / evt.maxSlots) * 100)) : 0;

            return (
              <div 
                key={evt.id}
                className={`rounded-2xl p-6 transition-all border flex flex-col justify-between ${
                  isActive 
                    ? 'bg-[#081026] border-cyan-500/60 shadow-[0_0_20px_rgba(0,217,255,0.15)]' 
                    : evt.status === 'ARCHIVED'
                    ? 'bg-slate-950/60 border-slate-800/80 opacity-75'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase ${
                      isActive 
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' 
                        : evt.status === 'ARCHIVED'
                        ? 'bg-slate-900 text-slate-400 border border-slate-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                    }`}>
                      {evt.status}
                    </span>

                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30 uppercase">
                      {evt.eventType}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h4 className="text-lg font-display font-black text-white uppercase">
                      {evt.name}
                    </h4>
                    <p className="text-xs text-cyan-400 font-mono line-clamp-1">
                      {evt.tagline}
                    </p>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {evt.description}
                  </p>

                  {/* Key Event Coordinates */}
                  <div className="space-y-1.5 text-xs font-mono text-slate-300 pt-2 border-t border-slate-800">
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-500">Duration:</span>
                      <strong className="text-white">{evt.durationDisplay}</strong>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-500">Event Start:</span>
                      <span>{new Date(evt.eventStartDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-500">Reg. Closes:</span>
                      <span>{new Date(evt.registrationEndDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-500">Team Size:</span>
                      <span>{evt.minTeamSize} - {evt.maxTeamSize} Members</span>
                    </div>
                  </div>

                  {/* Slot Utilization Bar */}
                  <div className="pt-2">
                    <div className="flex justify-between text-[11px] font-mono mb-1">
                      <span className="text-slate-400">Booked Slots:</span>
                      <strong className={slotPercentage >= 100 ? 'text-red-400' : 'text-cyan-400'}>
                        {evtRegistrations.length} / {evt.maxSlots} ({slotPercentage}%)
                      </strong>
                    </div>
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className={`h-full transition-all ${
                          slotPercentage >= 100 ? 'bg-red-500' : 'bg-gradient-to-r from-cyan-400 to-purple-500'
                        }`}
                        style={{ width: `${slotPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                  {!isActive ? (
                    <button
                      type="button"
                      onClick={() => handleActivate(evt.id, evt.name)}
                      className="px-3 py-1.5 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold transition-all cursor-pointer"
                    >
                      Set Active
                    </button>
                  ) : (
                    <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Live Active
                    </span>
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(evt)}
                      className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                      title="Edit Event"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDuplicate(evt.id)}
                      className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                      title="Duplicate as Draft"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {evt.status !== 'ARCHIVED' && !isActive && (
                      <button
                        type="button"
                        onClick={() => archiveEvent(evt.id)}
                        className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                        title="Archive Event"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {!isActive && events.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDelete(evt.id, evt.name)}
                        className="p-2 rounded-lg bg-slate-950 hover:bg-red-950 text-slate-400 hover:text-red-400 border border-slate-800 transition-colors"
                        title="Delete Event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CREATE / EDIT EVENT MODAL */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-4xl w-full rounded-2xl bg-slate-950 border border-cyan-500/50 p-6 sm:p-8 max-h-[92vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setModalMode(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-slate-800">
              <CalendarRange className="w-6 h-6 text-cyan-400" />
              <h3 className="text-xl font-display font-black text-white uppercase">
                {modalMode === 'create' ? 'Create New Hackathon Event' : `Edit Event: ${formData.name}`}
              </h3>
            </div>

            {/* Validation Banner */}
            {dateValidationError && (
              <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-mono flex items-center gap-2 mb-6">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{dateValidationError}</span>
              </div>
            )}

            <form onSubmit={handleSaveModal} className="space-y-6">
              {/* Basic Details */}
              <div className="p-5 rounded-xl bg-[#060b17] border border-slate-800 space-y-4">
                <span className="text-xs font-mono uppercase text-cyan-400 font-bold block">
                  1. Event Identity & Theme
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Hackathon Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="INNOVATERS 2026"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Edition
                    </label>
                    <input
                      type="text"
                      value={formData.edition}
                      onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                      placeholder="2026"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Main Tagline
                    </label>
                    <input
                      type="text"
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      placeholder="BUILD. INNOVATE. IMPACT."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Theme / Focus Area
                    </label>
                    <input
                      type="text"
                      value={formData.theme}
                      onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                      placeholder="Digital Transformation & GenAI"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                    Event Description / Subtitle
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide full description of the hackathon..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Event Format & Type */}
              <div className="p-5 rounded-xl bg-[#060b17] border border-slate-800 space-y-4">
                <span className="text-xs font-mono uppercase text-cyan-400 font-bold block">
                  2. Hackathon Format & Duration
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Hackathon Type *
                    </label>
                    <select
                      value={formData.eventType}
                      onChange={(e) => handleEventTypeChange(e.target.value as HackathonEventType)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="12-hour">12-Hour Hackathon</option>
                      <option value="24-hour">24-Hour Hackathon</option>
                      <option value="36-hour">36-Hour Hackathon</option>
                      <option value="48-hour">48-Hour Hackathon</option>
                      <option value="multi-day">Multi-Day Hackathon</option>
                      <option value="online">Online Hackathon</option>
                      <option value="offline">Offline / In-Person Hackathon</option>
                      <option value="hybrid">Hybrid Hackathon</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Duration Display Label *
                    </label>
                    <input
                      type="text"
                      value={formData.durationDisplay}
                      onChange={(e) => setFormData({ ...formData, durationDisplay: e.target.value })}
                      placeholder="e.g. 24 Hours, 36 Hours, 3 Days"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Event Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as EventStatus })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    >
                      <option value="DRAFT">Draft (Not Public)</option>
                      <option value="ACTIVE">Active (Live Registration)</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Schedule, Times & Validations */}
              <div className="p-5 rounded-xl bg-[#060b17] border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-cyan-400 font-bold">
                    3. Schedule & Critical Dates (With Validation)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Reg. Close &lt; Event Start &lt; Event End
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Registration Open Date/Time
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.registrationStartDate}
                      onChange={(e) => handleDateChange('registrationStartDate', e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1 text-amber-400">
                      Registration Closing Date/Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.registrationEndDate}
                      onChange={(e) => handleDateChange('registrationEndDate', e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1 text-cyan-400">
                      Event Sprint Start Date/Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.eventStartDate}
                      onChange={(e) => handleDateChange('eventStartDate', e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1 text-purple-400">
                      Event Sprint End Date/Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.eventEndDate}
                      onChange={(e) => handleDateChange('eventEndDate', e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                    Check-in / Reporting Time Description
                  </label>
                  <input
                    type="text"
                    value={formData.checkInTime}
                    onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                    placeholder="08:00 AM IST (ID Verification Desk)"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              {/* Venue & Location */}
              <div className="p-5 rounded-xl bg-[#060b17] border border-slate-800 space-y-4">
                <span className="text-xs font-mono uppercase text-cyan-400 font-bold block">
                  4. Venue Coordinates & Online Platform
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Delivery Mode
                    </label>
                    <select
                      value={formData.venueType}
                      onChange={(e) => setFormData({ ...formData, venueType: e.target.value as VenueType })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    >
                      <option value="offline">In-Person Only</option>
                      <option value="online">Online / Virtual Only</option>
                      <option value="hybrid">Hybrid (Both)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Physical Venue Address
                    </label>
                    <input
                      type="text"
                      value={formData.venueAddress}
                      onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
                      placeholder="Campus address..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                    Virtual Join Link (Optional for Online/Hybrid)
                  </label>
                  <input
                    type="url"
                    value={formData.onlineJoinLink || ''}
                    onChange={(e) => setFormData({ ...formData, onlineJoinLink: e.target.value })}
                    placeholder="https://meet.google.com/xyz or https://discord.gg/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              {/* Team Constraints & Slots */}
              <div className="p-5 rounded-xl bg-[#060b17] border border-slate-800 space-y-4">
                <span className="text-xs font-mono uppercase text-cyan-400 font-bold block">
                  5. Team Sizes & Maximum Slot Allocation
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Min Team Size
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={formData.maxTeamSize}
                      value={formData.minTeamSize}
                      onChange={(e) => setFormData({ ...formData, minTeamSize: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Max Team Size
                    </label>
                    <input
                      type="number"
                      min={formData.minTeamSize}
                      max="10"
                      value={formData.maxTeamSize}
                      onChange={(e) => setFormData({ ...formData, maxTeamSize: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Maximum Slots Limit
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="500"
                      value={formData.maxSlots}
                      onChange={(e) => setFormData({ ...formData, maxSlots: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-cyan-400 font-bold font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Fee & UPI */}
              <div className="p-5 rounded-xl bg-[#060b17] border border-slate-800 space-y-4">
                <span className="text-xs font-mono uppercase text-cyan-400 font-bold block">
                  6. Registration Fee & Payment Setup
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Fee Per Member (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="50"
                      value={formData.registrationFeePerMember}
                      onChange={(e) => setFormData({ ...formData, registrationFeePerMember: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-bold font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      value={formData.upiId}
                      onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      UPI Payee Name
                    </label>
                    <input
                      type="text"
                      value={formData.upiPayeeName}
                      onChange={(e) => setFormData({ ...formData, upiPayeeName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Eligibility & Rules */}
              <div className="p-5 rounded-xl bg-[#060b17] border border-slate-800 space-y-4">
                <span className="text-xs font-mono uppercase text-cyan-400 font-bold block">
                  7. Eligibility & Rules
                </span>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                    Eligibility Criteria
                  </label>
                  <textarea
                    rows={2}
                    value={formData.eligibility}
                    onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              {/* Contacts */}
              <div className="p-5 rounded-xl bg-[#060b17] border border-slate-800 space-y-4">
                <span className="text-xs font-mono uppercase text-cyan-400 font-bold block">
                  8. Support Contact Coordinates
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Support Email
                    </label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Support Phone / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <CyberButton
                  type="submit"
                  variant="primary"
                  size="md"
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  {modalMode === 'create' ? 'Create Event' : 'Save Event Changes'}
                </CyberButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
