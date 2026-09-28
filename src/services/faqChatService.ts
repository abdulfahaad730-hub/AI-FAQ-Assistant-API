import { initialFAQs } from '../data/faqs';

export interface ChatSource {
  id: string;
  question: string;
  category?: string;
  score?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: ChatSource[];
  isError?: boolean;
  mode?: string;
}

export interface FAQItemData {
  id: string;
  question: string;
  answer: string;
  category?: string;
  source?: string;
  keywords?: string[];
  createdAt?: string;
  updatedAt?: string;
}

const API_BASE = '/api';

// Local clientside fallback matching in case server is unreachable
const fallbackLocalAnswer = (query: string) => {
  const q = query.toLowerCase().trim();
  
  if (['hi', 'hello', 'hey', 'help'].some(g => q === g || q.startsWith(`${g} `))) {
    return {
      reply: `Hello! 👋 I am the **Patrician Hackathon 2026 AI Assistant**.\n\nAsk me anything about registration, team requirements, fees, tech stacks, or prizes!`,
      sources: [],
      confidence: 1.0,
      mode: 'fallback-greeting'
    };
  }

  const matched = initialFAQs.find(f => 
    f.question.toLowerCase().includes(q) || 
    f.answer.toLowerCase().includes(q) ||
    (q.includes('fee') && f.id === 'faq-3') ||
    (q.includes('prize') && f.id === 'faq-10') ||
    (q.includes('team') && f.id === 'faq-2') ||
    (q.includes('eligible') && f.id === 'faq-1') ||
    (q.includes('tech') && f.id === 'faq-5')
  );

  if (matched) {
    return {
      reply: matched.answer,
      sources: [{ id: matched.id, question: matched.question, category: 'General', score: 0.9 }],
      confidence: 0.9,
      mode: 'client-fallback'
    };
  }

  return {
    reply: `I could not find information regarding **"${query}"** in the official Patrician Hackathon guidelines.\n\nPlease check our [Rules section](#rules) or contact the organizing committee at **contact@patriciancollege.ac.in**.`,
    sources: [],
    confidence: 0,
    mode: 'client-fallback-unknown'
  };
};

/**
 * Send natural language question to /api/chat
 */
export const sendChatMessage = async (
  message: string, 
  history: Array<{ sender: 'user' | 'assistant'; text: string }> = []
): Promise<{ reply: string; sources: ChatSource[]; confidence: number; mode?: string }> => {
  try {
    const formattedHistory = history.map(h => ({
      role: h.sender === 'user' ? 'user' : 'model',
      content: h.text
    }));

    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        history: formattedHistory
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with status ${response.status}`);
    }

    const data = await response.json();
    return {
      reply: data.reply,
      sources: data.sources || [],
      confidence: data.confidence ?? 1.0,
      mode: data.mode
    };
  } catch (err: any) {
    console.warn('[FAQ CHAT] Backend API unreachable, utilizing resilient local fallback:', err.message);
    return fallbackLocalAnswer(message);
  }
};

/**
 * Fetch all FAQs from /api/faqs
 */
export const fetchFaqs = async (search = '', category = ''): Promise<FAQItemData[]> => {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category && category !== 'ALL') params.append('category', category);

    const res = await fetch(`${API_BASE}/faqs?${params.toString()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.faqs || [];
  } catch (err) {
    console.warn('[FAQ FETCH] Could not fetch from backend, returning initial FAQs:', err);
    return initialFAQs.map(f => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
      category: 'General',
      source: 'Patrician Hackathon Official Guide',
      keywords: []
    }));
  }
};

/**
 * Create a new FAQ item (Admin)
 */
export const createFaq = async (
  faqData: { question: string; answer: string; category?: string; source?: string; keywords?: string[] },
  adminToken = 'Pcas@2026'
): Promise<FAQItemData> => {
  const res = await fetch(`${API_BASE}/faqs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': adminToken,
    },
    body: JSON.stringify(faqData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to create FAQ: HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.faq;
};

/**
 * Update an existing FAQ item (Admin)
 */
export const updateFaq = async (
  id: string,
  updates: Partial<FAQItemData>,
  adminToken = 'Pcas@2026'
): Promise<FAQItemData> => {
  const res = await fetch(`${API_BASE}/faqs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': adminToken,
    },
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to update FAQ: HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.faq;
};

/**
 * Delete an FAQ item (Admin)
 */
export const deleteFaq = async (id: string, adminToken = 'Pcas@2026'): Promise<boolean> => {
  const res = await fetch(`${API_BASE}/faqs/${id}`, {
    method: 'DELETE',
    headers: {
      'x-admin-token': adminToken,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to delete FAQ: HTTP ${res.status}`);
  }

  return true;
};
