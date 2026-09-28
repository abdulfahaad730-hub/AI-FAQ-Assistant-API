import mongoose from 'mongoose';

const RegistrationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    eventId: { type: String, default: 'event-innovaters-2026' },
    slotNumber: { type: String, default: '' },
    teamName: { type: String, required: true },
    domainId: { type: String, required: true },
    domainName: { type: String, required: true },
    problemStatementId: { type: String, required: true },
    problemStatementTitle: { type: String, required: true },
    leaderName: { type: String, required: true },
    teamSize: { type: Number, required: true },
    members: [{ type: String }],
    phone: { type: String, required: true },
    email: { type: String, required: true },
    totalFee: { type: Number, required: true },
    transactionId: { type: String, required: true },
    transactionDate: { type: String, required: true },
    paymentScreenshotName: { type: String },
    paymentScreenshotData: { type: String },
    googleDriveLink: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['Pending', 'Verified', 'Rejected'], 
      default: 'Pending' 
    },
    emailStatus: {
      type: String,
      enum: ['Pending', 'Sent', 'Failed', 'Resent'],
      default: 'Pending'
    },
    emailSentAt: { type: Date },
    emailError: { type: String },
    resendHistory: [
      {
        sentAt: { type: Date, default: Date.now },
        recipientEmail: { type: String },
        status: { type: String, enum: ['Sent', 'Failed'] },
        errorMessage: { type: String }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('Registration', RegistrationSchema);
