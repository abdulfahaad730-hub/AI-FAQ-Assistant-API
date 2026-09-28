import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import FAQ from '../models/FAQ.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'faqs.json');

// Default initial FAQs seeded from hackathon knowledge base
export const defaultInitialFAQs = [
  {
    id: 'faq-1',
    question: 'Who can participate in Patrician Hackathon 2026?',
    answer: 'Any currently enrolled undergraduate or postgraduate student with a valid student identification card from any recognized university or college across India can participate. Interdisciplinary teams are highly encouraged.',
    category: 'Eligibility',
    source: 'Patrician Hackathon Eligibility Guidelines',
    keywords: ['eligibility', 'participate', 'who', 'student', 'undergraduate', 'postgraduate', 'college', 'id card', 'degree']
  },
  {
    id: 'faq-2',
    question: 'How many members can be in a team?',
    answer: 'Teams must consist of 3 to 5 members (including 1 designated Team Leader). You can register with members from different academic departments or different colleges.',
    category: 'Team & Registration',
    source: 'Team Formation Rules',
    keywords: ['team size', 'members', 'limit', 'minimum', 'maximum', 'leader', 'departments', 'cross-college']
  },
  {
    id: 'faq-3',
    question: 'Is there a registration fee?',
    answer: 'Yes, a nominal registration fee of ₹100 per team member (e.g., ₹300 for 3 members, ₹400 for 4 members, ₹500 for 5 members) is applicable to confirm participation and cover hackathon kits, food, high-speed connectivity, and merchandise during the offline sprint.',
    category: 'Payment & Fees',
    source: 'Fee Structure & Inclusions',
    keywords: ['fee', 'registration fee', 'price', 'cost', 'money', '100', 'upi', 'payment', 'kit', 'food']
  },
  {
    id: 'faq-4',
    question: 'Can students from other colleges or outside Tamil Nadu participate?',
    answer: 'Yes! INNOVATERS 2026 is a nationwide technology hackathon open to students across Tamil Nadu and all other states of India.',
    category: 'Eligibility',
    source: 'Nationwide Participation Policy',
    keywords: ['other colleges', 'outside tamil nadu', 'states', 'india', 'inter-college', 'different colleges']
  },
  {
    id: 'faq-5',
    question: 'What technologies and programming languages can we use?',
    answer: 'You have full liberty to use any tech stack: React, Vue, Angular, Node.js, Python, Flutter, Go, Rust, Web3, or cloud platforms. All open-source frameworks and public APIs are permitted, as long as the original code is authored during the event.',
    category: 'Technical & Rules',
    source: 'Technical Specifications',
    keywords: ['tech stack', 'technologies', 'programming language', 'react', 'python', 'flutter', 'node', 'web3', 'apis']
  },
  {
    id: 'faq-6',
    question: 'Is the hackathon online or offline?',
    answer: 'Round 1 (Registration & Idea PPT Submission) is conducted online via our portal. Shortlisted squads are invited to the physical 24-hour prototype hackathon sprint on the Patrician College campus in Chennai.',
    category: 'Event Format & Venue',
    source: 'Event Roadmap & Logistics',
    keywords: ['online', 'offline', 'venue', 'format', 'location', 'campus', 'chennai', 'round 1', 'round 2']
  },
  {
    id: 'faq-7',
    question: 'What should we submit during registration?',
    answer: 'During registration, teams submit their team details, chosen domain/problem statement, transaction reference ID, and a public Google Drive folder containing their PPT Pitch Deck (mandatory) and an optional 3-minute demo video. During the physical hackathon, teams will submit their working GitHub repository link.',
    category: 'Submission',
    source: 'Submission Requirements',
    keywords: ['submit', 'submission', 'ppt', 'deck', 'google drive', 'github', 'pitch', 'requirements']
  },
  {
    id: 'faq-8',
    question: 'Will participation certificates and swag be provided?',
    answer: 'Yes, verified Certificates of Participation will be awarded to all registered attendees who participate in the hackathon, alongside exclusive swag, badges, and sponsor goodies. Finalists and winners receive physical trophies and Certificates of Merit.',
    category: 'Certificates & Swag',
    source: 'Certificates & Perks Guide',
    keywords: ['certificate', 'certificates', 'swag', 'merchandise', 'goodies', 'participation', 'trophy']
  },
  {
    id: 'faq-9',
    question: 'How will teams be judged and evaluated?',
    answer: 'Submissions are objectively evaluated based on 5 weighted criteria: Innovation & Originality (30%), Technical Implementation (25%), Real-World Impact (20%), UI/UX Polish (15%), and Presentation & Live Pitch (10%).',
    category: 'Judging',
    source: 'Judging Rubric',
    keywords: ['judging', 'evaluation', 'criteria', 'rubric', 'weights', 'scores', 'innovation', 'presentation']
  },
  {
    id: 'faq-10',
    question: 'What are the prize amounts and rewards?',
    answer: 'The total prize pool exceeds ₹1,00,000+ including ₹50,000 for 1st Place, ₹30,000 for 2nd Place, ₹20,000 for 3rd Place, and multiple ₹5,000 Special Category Awards (Best AI Solution, Best UI/UX, Best Innovation, Best Beginner Team, Best Social Impact).',
    category: 'Prizes & Awards',
    source: 'Prize Distribution Schedule',
    keywords: ['prizes', 'cash prize', 'rewards', '1st place', '2nd place', '3rd place', 'prize pool', '100000', 'awards']
  }
];

// Ensure data directory exists
const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
};

// Read local JSON fallback
const readLocalFaqs = () => {
  try {
    ensureDataDir();
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(defaultInitialFAQs, null, 2), 'utf-8');
      return defaultInitialFAQs;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultInitialFAQs;
  } catch (err) {
    console.error('[FAQ STORE] Error reading local FAQs:', err.message);
    return defaultInitialFAQs;
  }
};

// Write local JSON fallback
const writeLocalFaqs = (faqs) => {
  try {
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(faqs, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[FAQ STORE] Error writing local FAQs:', err.message);
    return false;
  }
};

// Check if MongoDB is connected and ready
const isMongoConnected = () => {
  return mongoose.connection && mongoose.connection.readyState === 1;
};

// Initialize seed data in Mongo if connected and collection is empty
export const seedFaqsIfEmpty = async () => {
  if (isMongoConnected()) {
    try {
      const count = await FAQ.countDocuments();
      if (count === 0) {
        console.log('[FAQ STORE] Seeding initial FAQs into MongoDB...');
        await FAQ.insertMany(defaultInitialFAQs);
        console.log('[FAQ STORE] MongoDB seeded successfully.');
      }
    } catch (err) {
      console.warn('[FAQ STORE] Could not seed MongoDB FAQs:', err.message);
    }
  } else {
    // Seed local file
    readLocalFaqs();
  }
};

export const faqStore = {
  // Get all FAQs with optional search and category filters
  async getAll({ search = '', category = '' } = {}) {
    if (isMongoConnected()) {
      try {
        const filter = {};
        if (category && category !== 'ALL') {
          filter.category = new RegExp(`^${category}$`, 'i');
        }
        if (search) {
          const s = search.trim();
          filter.$or = [
            { question: new RegExp(s, 'i') },
            { answer: new RegExp(s, 'i') },
            { category: new RegExp(s, 'i') },
            { keywords: new RegExp(s, 'i') },
          ];
        }
        const docs = await FAQ.find(filter).sort({ createdAt: 1 });
        return docs.map(d => ({
          id: d.id,
          question: d.question,
          answer: d.answer,
          category: d.category,
          source: d.source,
          keywords: d.keywords,
          createdAt: d.createdAt,
          updatedAt: d.updatedAt,
        }));
      } catch (err) {
        console.warn('[FAQ STORE] Mongo query failed, falling back to local file:', err.message);
      }
    }

    // Local file fallback
    let faqs = readLocalFaqs();
    if (category && category !== 'ALL') {
      const catLower = category.toLowerCase();
      faqs = faqs.filter(f => (f.category || '').toLowerCase() === catLower);
    }
    if (search) {
      const q = search.toLowerCase().trim();
      faqs = faqs.filter(f =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        (f.category && f.category.toLowerCase().includes(q)) ||
        (f.keywords && f.keywords.some(k => k.toLowerCase().includes(q)))
      );
    }
    return faqs;
  },

  // Get single FAQ by ID
  async getById(id) {
    if (isMongoConnected()) {
      try {
        const doc = await FAQ.findOne({ id });
        if (doc) {
          return {
            id: doc.id,
            question: doc.question,
            answer: doc.answer,
            category: doc.category,
            source: doc.source,
            keywords: doc.keywords,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
          };
        }
      } catch (err) {
        console.warn('[FAQ STORE] Mongo getById failed:', err.message);
      }
    }

    const faqs = readLocalFaqs();
    return faqs.find(f => f.id === id) || null;
  },

  // Create new FAQ
  async create(data) {
    const id = data.id || `faq-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();
    const newRecord = {
      id,
      question: data.question.trim(),
      answer: data.answer.trim(),
      category: (data.category || 'General').trim(),
      source: (data.source || 'Patrician Hackathon 2026 Official Guide').trim(),
      keywords: Array.isArray(data.keywords) ? data.keywords : (data.keywords ? [data.keywords] : []),
      createdAt: now,
      updatedAt: now,
    };

    if (isMongoConnected()) {
      try {
        const doc = new FAQ(newRecord);
        await doc.save();
      } catch (err) {
        console.warn('[FAQ STORE] Mongo save failed:', err.message);
      }
    }

    // Keep local file in sync
    const faqs = readLocalFaqs();
    faqs.push(newRecord);
    writeLocalFaqs(faqs);

    return newRecord;
  },

  // Update existing FAQ
  async update(id, updates) {
    const now = new Date().toISOString();
    let updatedRecord = null;

    if (isMongoConnected()) {
      try {
        const doc = await FAQ.findOneAndUpdate(
          { id },
          { ...updates, updatedAt: now },
          { new: true }
        );
        if (doc) {
          updatedRecord = {
            id: doc.id,
            question: doc.question,
            answer: doc.answer,
            category: doc.category,
            source: doc.source,
            keywords: doc.keywords,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
          };
        }
      } catch (err) {
        console.warn('[FAQ STORE] Mongo update failed:', err.message);
      }
    }

    // Update in local file
    const faqs = readLocalFaqs();
    const index = faqs.findIndex(f => f.id === id);
    if (index !== -1) {
      faqs[index] = {
        ...faqs[index],
        ...updates,
        updatedAt: now,
      };
      writeLocalFaqs(faqs);
      if (!updatedRecord) {
        updatedRecord = faqs[index];
      }
    }

    return updatedRecord;
  },

  // Delete FAQ
  async delete(id) {
    let deleted = false;
    if (isMongoConnected()) {
      try {
        const res = await FAQ.findOneAndDelete({ id });
        if (res) deleted = true;
      } catch (err) {
        console.warn('[FAQ STORE] Mongo delete failed:', err.message);
      }
    }

    const faqs = readLocalFaqs();
    const initialLen = faqs.length;
    const filtered = faqs.filter(f => f.id !== id);
    if (filtered.length !== initialLen) {
      writeLocalFaqs(filtered);
      deleted = true;
    }

    return deleted;
  }
};
