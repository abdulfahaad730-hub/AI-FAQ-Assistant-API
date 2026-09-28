import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import Registration from './models/Registration.js';
import faqRoutes from './routes/faqRoutes.js';
import { seedFaqsIfEmpty, faqStore } from './services/faqStore.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/patrician_hackathon';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check with AI & Knowledge Base Status
app.get('/api/health', async (req, res) => {
  const hasSmtp = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
  const hasGemini = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here');
  const mongoStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Decoupled / Local Store';
  
  let faqCount = 0;
  try {
    const faqs = await faqStore.getAll();
    faqCount = faqs.length;
  } catch (e) {
    faqCount = 0;
  }

  res.json({ 
    status: 'OK', 
    message: 'Patrician Hackathon API is online', 
    timestamp: new Date().toISOString(),
    database: mongoStatus,
    emailProvider: hasSmtp ? 'Configured SMTP' : 'Simulated / Standalone',
    aiAssistant: {
      status: 'Active',
      engine: hasGemini ? 'Google Gemini 1.5 Flash (Live LLM)' : 'Intelligent Grounded RAG & Semantic Matcher (Mock Mode)',
      faqKnowledgeBaseCount: faqCount,
    }
  });
});

// Mount FAQ & AI Chat API routes
app.use('/api', faqRoutes);

/**
 * Secure Server-side Email Dispatch
 * Uses environment variables for SMTP credentials.
 * Never leaks passwords or private tokens.
 */
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, html, registrationId, slotNumber, isResend, isTest } = req.body;

    if (!to || !to.includes('@')) {
      return res.status(400).json({ success: false, error: 'A valid recipient email address is required' });
    }

    if (!subject || !html) {
      return res.status(400).json({ success: false, error: 'Subject and HTML body are required' });
    }

    const hasSmtpConfig = Boolean(
      process.env.SMTP_HOST && 
      process.env.SMTP_USER && 
      process.env.SMTP_PASS
    );

    if (hasSmtpConfig) {
      // Create secure Nodemailer transporter
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const senderFrom = process.env.EMAIL_FROM || `"INNOVATERS 2026 Organizing Committee" <${process.env.SMTP_USER}>`;

      const mailOptions = {
        from: senderFrom,
        to,
        subject,
        html,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`[EMAIL DISPATCH] Real email sent to: ${to} (Message ID: ${info.messageId})`);

      // If database is connected and registrationId provided, update registration record
      if (registrationId && !isTest && mongoose.connection.readyState === 1) {
        try {
          const newStatus = isResend ? 'Resent' : 'Sent';
          await Registration.findOneAndUpdate(
            { id: registrationId },
            {
              emailStatus: newStatus,
              emailSentAt: new Date(),
              emailError: null,
              $push: {
                resendHistory: {
                  sentAt: new Date(),
                  recipientEmail: to,
                  status: 'Sent'
                }
              }
            }
          );
        } catch (dbErr) {
          console.warn('[DB WARNING] Could not update registration email state in Mongo:', dbErr.message);
        }
      }

      return res.json({ 
        success: true, 
        delivered: true, 
        messageId: info.messageId 
      });
    } else {
      // Safe simulated delivery mode for development
      console.log(`[EMAIL SIMULATED] To: ${to} | Subject: "${subject}" | Slot: ${slotNumber || 'N/A'}`);
      
      // Update registration record if Mongo is connected
      if (registrationId && !isTest && mongoose.connection.readyState === 1) {
        try {
          const newStatus = isResend ? 'Resent' : 'Sent';
          await Registration.findOneAndUpdate(
            { id: registrationId },
            {
              emailStatus: newStatus,
              emailSentAt: new Date(),
              emailError: null,
              $push: {
                resendHistory: {
                  sentAt: new Date(),
                  recipientEmail: to,
                  status: 'Sent'
                }
              }
            }
          );
        } catch (dbErr) {
          console.warn('[DB WARNING] Could not update registration email state in Mongo:', dbErr.message);
        }
      }

      return res.json({ 
        success: true, 
        simulated: true, 
        message: 'Simulated email delivery recorded (Configure SMTP_HOST, SMTP_USER, SMTP_PASS for live SMTP dispatch)' 
      });
    }
  } catch (error) {
    console.error('[EMAIL DISPATCH ERROR]', error.message);

    // If registrationId provided, record the failure in DB if connected
    if (req.body?.registrationId && mongoose.connection.readyState === 1) {
      try {
        await Registration.findOneAndUpdate(
          { id: req.body.registrationId },
          {
            emailStatus: 'Failed',
            emailError: error.message,
            $push: {
              resendHistory: {
                sentAt: new Date(),
                recipientEmail: req.body.to,
                status: 'Failed',
                errorMessage: error.message
              }
            }
          }
        );
      } catch (dbErr) {
        console.warn('[DB WARNING] Could not record email failure in Mongo:', dbErr.message);
      }
    }

    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to dispatch email via SMTP server' 
    });
  }
});

// Submit team registration
app.post('/api/register', async (req, res) => {
  try {
    const submissionData = req.body;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newReg = new Registration({
      ...submissionData,
      id: `PCAS-2026-${randomSuffix}`,
      emailStatus: 'Pending',
    });

    const saved = await newReg.save();
    res.status(201).json({ success: true, registration: saved });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Failed to record registration', error: error.message });
  }
});

// Fetch all registrations (Admin)
app.get('/api/registrations', async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 });
    res.json({ success: true, count: registrations.length, registrations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch registrations', error: error.message });
  }
});

// Update registration verification status
app.patch('/api/registrations/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await Registration.findOneAndUpdate({ id }, { status }, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }
    res.json({ success: true, registration: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update status', error: error.message });
  }
});

// Connect to MongoDB & launch server
const startServer = async () => {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 });
      console.log('Connected to MongoDB database');
    } catch (err) {
      console.warn('MongoDB connection unavailable, running in resilient decoupled mode:', err.message);
    }
  } else {
    console.log('Running in decoupled mode (Provide MONGODB_URI to persist to Mongo cloud)');
  }

  // Seed default knowledge base FAQs if not yet seeded
  try {
    await seedFaqsIfEmpty();
  } catch (seedErr) {
    console.warn('FAQ seed warning:', seedErr.message);
  }

  app.listen(PORT, () => {
    console.log(`Patrician Hackathon Backend running on port ${PORT}`);
    console.log(`AI FAQ Assistant ready at http://localhost:${PORT}/api/chat`);
  });
};

startServer();
