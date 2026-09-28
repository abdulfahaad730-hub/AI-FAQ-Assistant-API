import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    edition: { type: String, required: true },
    tagline: { type: String, default: '' },
    description: { type: String, default: '' },
    bannerUrl: { type: String },
    logoUrl: { type: String },
    eventType: { 
      type: String, 
      enum: ['12-hour', '24-hour', '36-hour', '48-hour', 'multi-day', 'online', 'offline', 'hybrid'],
      default: '24-hour'
    },
    durationDisplay: { type: String, default: '24 Hours' },
    status: { 
      type: String, 
      enum: ['DRAFT', 'ACTIVE', 'ARCHIVED'],
      default: 'DRAFT'
    },
    theme: { type: String, default: '' },
    registrationStartDate: { type: String, required: true },
    registrationEndDate: { type: String, required: true },
    eventStartDate: { type: String, required: true },
    eventEndDate: { type: String, required: true },
    checkInTime: { type: String, default: '08:00 AM IST' },
    venueType: { 
      type: String, 
      enum: ['offline', 'online', 'hybrid'],
      default: 'offline'
    },
    venueAddress: { type: String, default: '' },
    onlineJoinLink: { type: String },
    minTeamSize: { type: Number, default: 3 },
    maxTeamSize: { type: Number, default: 5 },
    maxSlots: { type: Number, default: 100 },
    registrationFeePerMember: { type: Number, default: 100 },
    upiId: { type: String, default: '' },
    upiPayeeName: { type: String, default: '' },
    eligibility: { type: String, default: '' },
    rules: [{ type: String }],
    prizes: [{ type: mongoose.Schema.Types.Mixed }],
    specialAwards: [{ type: mongoose.Schema.Types.Mixed }],
    domains: [{ type: mongoose.Schema.Types.Mixed }],
    problems: [{ type: mongoose.Schema.Types.Mixed }],
    contactEmail: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    emailTemplate: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.model('Event', EventSchema);
