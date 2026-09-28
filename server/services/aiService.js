import { faqStore } from './faqStore.js';

// Common English stopwords to ignore in lexical matching
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 
  'do', 'does', 'did', 'can', 'could', 'will', 'would', 'should', 'i', 'we', 
  'you', 'they', 'it', 'this', 'that', 'there', 'what', 'which', 'who', 'how', 
  'when', 'where', 'why', 'about', 'any', 'some', 'my', 'our', 'your', 'me'
]);

// Tokenize and clean text into searchable terms
const tokenize = (text) => {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOP_WORDS.has(token));
};

// Calculate token similarity score between query and target string
const calculateTokenScore = (queryTokens, targetText, weight = 1.0) => {
  if (!queryTokens.length || !targetText) return 0;
  const targetTokens = new Set(tokenize(targetText));
  if (!targetTokens.size) return 0;

  let matches = 0;
  for (const token of queryTokens) {
    if (targetTokens.has(token)) {
      matches += 1;
    } else {
      // Partial prefix matching for plurals/variations (e.g., student / students)
      for (const t of targetTokens) {
        if (t.startsWith(token) || token.startsWith(t)) {
          matches += 0.8;
          break;
        }
      }
    }
  }

  // Jaccard-like overlap
  return (matches / Math.max(queryTokens.length, 1)) * weight;
};

// Semantic Keyword & Hybrid Matcher for Retrieval
export const retrieveRelevantFaqs = async (userQuery, limit = 3) => {
  const faqs = await faqStore.getAll();
  const queryTokens = tokenize(userQuery);
  const rawQueryLower = userQuery.toLowerCase().trim();

  const scored = faqs.map(faq => {
    let score = 0;

    // Direct substring bonus
    if (faq.question.toLowerCase().includes(rawQueryLower)) {
      score += 0.8;
    }
    if (faq.answer.toLowerCase().includes(rawQueryLower)) {
      score += 0.5;
    }

    // Question match (highest weight)
    score += calculateTokenScore(queryTokens, faq.question, 1.2);

    // Answer match
    score += calculateTokenScore(queryTokens, faq.answer, 0.6);

    // Category match
    score += calculateTokenScore(queryTokens, faq.category, 0.5);

    // Keywords match
    if (faq.keywords && faq.keywords.length) {
      score += calculateTokenScore(queryTokens, faq.keywords.join(' '), 0.9);
    }

    // Specific domain/intent signals
    if (rawQueryLower.includes('fee') || rawQueryLower.includes('cost') || rawQueryLower.includes('price') || rawQueryLower.includes('money') || rawQueryLower.includes('pay')) {
      if (faq.id === 'faq-3') score += 1.5;
    }
    if (rawQueryLower.includes('prize') || rawQueryLower.includes('reward') || rawQueryLower.includes('cash') || rawQueryLower.includes('pool')) {
      if (faq.id === 'faq-10') score += 1.5;
    }
    if (rawQueryLower.includes('team') || rawQueryLower.includes('member') || rawQueryLower.includes('leader') || rawQueryLower.includes('how many')) {
      if (faq.id === 'faq-2') score += 1.5;
    }
    if (rawQueryLower.includes('who') || rawQueryLower.includes('eligible') || rawQueryLower.includes('eligibility') || rawQueryLower.includes('degree')) {
      if (faq.id === 'faq-1' || faq.id === 'faq-4') score += 1.2;
    }
    if (rawQueryLower.includes('tech') || rawQueryLower.includes('language') || rawQueryLower.includes('stack') || rawQueryLower.includes('python') || rawQueryLower.includes('react')) {
      if (faq.id === 'faq-5') score += 1.5;
    }
    if (rawQueryLower.includes('online') || rawQueryLower.includes('offline') || rawQueryLower.includes('venue') || rawQueryLower.includes('where') || rawQueryLower.includes('location')) {
      if (faq.id === 'faq-6') score += 1.5;
    }
    if (rawQueryLower.includes('submit') || rawQueryLower.includes('ppt') || rawQueryLower.includes('drive') || rawQueryLower.includes('github') || rawQueryLower.includes('video')) {
      if (faq.id === 'faq-7') score += 1.5;
    }
    if (rawQueryLower.includes('certificate') || rawQueryLower.includes('swag') || rawQueryLower.includes('trophy')) {
      if (faq.id === 'faq-8') score += 1.5;
    }
    if (rawQueryLower.includes('judge') || rawQueryLower.includes('judging') || rawQueryLower.includes('criteria') || rawQueryLower.includes('evaluat')) {
      if (faq.id === 'faq-9') score += 1.5;
    }

    return {
      faq,
      score: Math.min(score, 1.0)
    };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit);
};

// Check if query is a general greeting
const isGreeting = (query) => {
  const q = query.toLowerCase().trim();
  const greetings = ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'sup', 'yo', 'halo', 'who are you', 'what can you do', 'help', 'help me'];
  return greetings.some(g => q === g || q.startsWith(`${g} `) || q.startsWith(`${g}!`) || q.startsWith(`${g}?`));
};

// Generate AI Response (Using LLM API if key is present, otherwise intelligent Semantic RAG Mock)
export const generateAnswer = async (userQuery, conversationHistory = []) => {
  const trimmed = (userQuery || '').trim();
  if (!trimmed) {
    return {
      reply: 'Please provide a valid question so I can assist you with Patrician Hackathon 2026.',
      sources: [],
      confidence: 0,
      mode: 'fallback'
    };
  }

  // 1. Handle Greetings & Bot Purpose
  if (isGreeting(trimmed)) {
    return {
      reply: `Hello! 👋 I am the **Patrician Hackathon 2026 AI Assistant**.\n\nI can answer questions regarding:\n- **Eligibility & Team Size** (3–5 members, ₹100 fee/member)\n- **Tech Stack & Submission Guidelines**\n- **Prizes & Awards** (Over ₹1,00,000+ prize pool)\n- **Venue & Event Timeline** (Online PPT round & Campus Sprint)\n\nFeel free to ask a question below or choose from the suggested questions!`,
      sources: [],
      confidence: 1.0,
      mode: 'greeting'
    };
  }

  // 2. Retrieve grounded knowledge from FAQs
  const retrieved = await retrieveRelevantFaqs(trimmed, 3);
  const bestMatch = retrieved[0];
  const topScore = bestMatch ? bestMatch.score : 0;
  const SIMILARITY_THRESHOLD = 0.30;

  // 3. Check for Gemini API key
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (geminiApiKey && geminiApiKey !== 'your_gemini_api_key_here') {
    try {
      // Build grounding context from retrieved FAQs
      const contextText = retrieved
        .filter(r => r.score >= 0.25)
        .map((r, i) => `[Document ${i + 1} - ${r.faq.category}]: Question: ${r.faq.question}\nAnswer: ${r.faq.answer}`)
        .join('\n\n');

      const systemPrompt = `You are the official AI Assistant for "INNOVATERS 2026" - Patrician College of Arts and Science Hackathon.
Answer the user's question accurately and helpfully, strictly based on the provided hackathon context.
Rules:
1. Do not invent facts, dates, or contact details not supported by the context.
2. If the user asks something completely outside the context, politely state: "I couldn't find information about that in the official Patrician Hackathon guidelines. Please contact the organizing committee at contact@patriciancollege.ac.in."
3. Format your response cleanly with markdown bullet points or bold text where appropriate.
4. Keep the tone enthusiastic, professional, and helpful for student developers.

Provided Hackathon Knowledge Context:
${contextText || 'No direct FAQ documents matched.'}
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: systemPrompt },
                  { text: `User Question: ${trimmed}` }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 500,
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (generatedText) {
          const relevantSources = retrieved
            .filter(r => r.score >= SIMILARITY_THRESHOLD)
            .map(r => ({
              id: r.faq.id,
              question: r.faq.question,
              category: r.faq.category,
              score: Number(r.score.toFixed(2))
            }));

          return {
            reply: generatedText,
            sources: relevantSources,
            confidence: Number(topScore.toFixed(2)),
            mode: 'llm-gemini'
          };
        }
      }
    } catch (llmErr) {
      console.warn('[AI SERVICE] Gemini API call error, falling back to semantic RAG:', llmErr.message);
    }
  }

  // 4. Grounded Semantic RAG Mock Mode (Deterministic, accurate, hallucination-free)
  if (!bestMatch || topScore < SIMILARITY_THRESHOLD) {
    return {
      reply: `I could not find specific information regarding **"${trimmed}"** in the official Patrician Hackathon 2026 guidelines.\n\nTo ensure you receive accurate details, please check our [Event Rules](#rules) or contact the organizing committee:\n- 📧 **Email**: [contact@patriciancollege.ac.in](mailto:contact@patriciancollege.ac.in)\n- 📞 **Helpline**: +91 98401 92834\n- 📍 **Venue**: Patrician College of Arts & Science, Adyar, Chennai`,
      sources: [],
      confidence: Number(topScore.toFixed(2)),
      mode: 'fallback'
    };
  }

  // Synthesize answer based on top matching grounded FAQ(s)
  const primaryFaq = bestMatch.faq;
  const secondaryFaq = retrieved[1] && retrieved[1].score > 0.5 ? retrieved[1].faq : null;

  let answerText = primaryFaq.answer;
  if (secondaryFaq && secondaryFaq.id !== primaryFaq.id) {
    answerText += `\n\n**Related Information (${secondaryFaq.category}):**\n${secondaryFaq.answer}`;
  }

  // Add helpful navigation links based on context
  if (primaryFaq.id === 'faq-3' || primaryFaq.id === 'faq-2') {
    answerText += `\n\n👉 *Ready to submit your squad? You can register directly on our [Registration Page](/register).*`;
  } else if (primaryFaq.id === 'faq-5' || primaryFaq.id === 'faq-7') {
    answerText += `\n\n👉 *Explore challenge themes and problem statements on the [Problems Directory](/problems).*`;
  } else if (primaryFaq.id === 'faq-10') {
    answerText += `\n\n🏆 *View the complete prize hierarchy on our [Prizes Section](#prizes).*`;
  }

  const sources = retrieved
    .filter(r => r.score >= SIMILARITY_THRESHOLD)
    .map(r => ({
      id: r.faq.id,
      question: r.faq.question,
      category: r.faq.category,
      score: Number(r.score.toFixed(2))
    }));

  return {
    reply: answerText,
    sources,
    confidence: Number(topScore.toFixed(2)),
    mode: 'rag-semantic-mock'
  };
};
