import express from 'express';
import { faqStore } from '../services/faqStore.js';
import { generateAnswer } from '../services/aiService.js';
import { chatRateLimiter, requireAdminAuth } from '../middleware/security.js';

const router = express.Router();

/**
 * POST /api/chat
 * Natural language Q&A against the hackathon FAQ knowledge base
 */
router.post('/chat', chatRateLimiter, async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'A non-empty string "message" field is required.',
      });
    }

    const cleanMessage = message.trim();
    if (cleanMessage.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message cannot be empty or whitespace only.',
      });
    }

    if (cleanMessage.length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Message length exceeds 1,000 characters limit.',
      });
    }

    const result = await generateAnswer(cleanMessage, Array.isArray(history) ? history : []);

    return res.json({
      success: true,
      message: cleanMessage,
      reply: result.reply,
      sources: result.sources || [],
      confidence: result.confidence ?? 1.0,
      mode: result.mode,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[API /api/chat ERROR]', error);
    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred while processing your question.',
      details: error.message,
    });
  }
});

/**
 * GET /api/faqs
 * Retrieve all FAQs with optional search and category filters
 */
router.get('/faqs', async (req, res) => {
  try {
    const { search = '', category = '' } = req.query;
    const faqs = await faqStore.getAll({ search, category });
    return res.json({
      success: true,
      count: faqs.length,
      faqs,
    });
  } catch (error) {
    console.error('[API /api/faqs ERROR]', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve FAQs.',
      details: error.message,
    });
  }
});

/**
 * GET /api/faqs/:id
 * Retrieve a single FAQ item by ID
 */
router.get('/faqs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await faqStore.getById(id);
    if (!faq) {
      return res.status(404).json({
        success: false,
        error: `FAQ item with ID "${id}" was not found.`,
      });
    }
    return res.json({
      success: true,
      faq,
    });
  } catch (error) {
    console.error(`[API /api/faqs/${req.params.id} ERROR]`, error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve FAQ item.',
      details: error.message,
    });
  }
});

/**
 * POST /api/faqs
 * Create a new FAQ (Admin Protected)
 */
router.post('/faqs', requireAdminAuth, async (req, res) => {
  try {
    const { question, answer, category, source, keywords } = req.body;

    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Question is required and must be a non-empty string.',
      });
    }

    if (!answer || typeof answer !== 'string' || !answer.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Answer is required and must be a non-empty string.',
      });
    }

    const created = await faqStore.create({
      question,
      answer,
      category: category || 'General',
      source: source || 'Patrician Hackathon 2026 Admin Portal',
      keywords: keywords || [],
    });

    return res.status(201).json({
      success: true,
      message: 'FAQ item created successfully.',
      faq: created,
    });
  } catch (error) {
    console.error('[API POST /api/faqs ERROR]', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create FAQ item.',
      details: error.message,
    });
  }
});

/**
 * PUT /api/faqs/:id
 * Update an existing FAQ item (Admin Protected)
 */
router.put('/faqs/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await faqStore.getById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: `FAQ item with ID "${id}" not found.`,
      });
    }

    const { question, answer, category, source, keywords } = req.body;
    const updates = {};

    if (question !== undefined) {
      if (typeof question !== 'string' || !question.trim()) {
        return res.status(400).json({ success: false, error: 'Question cannot be empty.' });
      }
      updates.question = question.trim();
    }

    if (answer !== undefined) {
      if (typeof answer !== 'string' || !answer.trim()) {
        return res.status(400).json({ success: false, error: 'Answer cannot be empty.' });
      }
      updates.answer = answer.trim();
    }

    if (category !== undefined) updates.category = String(category).trim();
    if (source !== undefined) updates.source = String(source).trim();
    if (keywords !== undefined) {
      updates.keywords = Array.isArray(keywords)
        ? keywords
        : String(keywords).split(',').map(s => s.trim()).filter(Boolean);
    }

    const updated = await faqStore.update(id, updates);

    return res.json({
      success: true,
      message: 'FAQ item updated successfully.',
      faq: updated,
    });
  } catch (error) {
    console.error(`[API PUT /api/faqs/${req.params.id} ERROR]`, error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update FAQ item.',
      details: error.message,
    });
  }
});

/**
 * DELETE /api/faqs/:id
 * Delete an FAQ item (Admin Protected)
 */
router.delete('/faqs/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await faqStore.getById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: `FAQ item with ID "${id}" not found.`,
      });
    }

    const deleted = await faqStore.delete(id);
    return res.json({
      success: true,
      message: `FAQ item "${id}" deleted successfully.`,
      deleted,
    });
  } catch (error) {
    console.error(`[API DELETE /api/faqs/${req.params.id} ERROR]`, error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete FAQ item.',
      details: error.message,
    });
  }
});

export default router;
