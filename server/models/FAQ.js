import mongoose from 'mongoose';

const FAQSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    category: { type: String, default: 'General', trim: true },
    source: { type: String, default: 'Patrician Hackathon 2026 Official Guide' },
    keywords: [{ type: String }],
  },
  { timestamps: true }
);

// Add text index for fast keyword matching in MongoDB
FAQSchema.index({ question: 'text', answer: 'text', category: 'text', keywords: 'text' });

export default mongoose.models.FAQ || mongoose.model('FAQ', FAQSchema);
