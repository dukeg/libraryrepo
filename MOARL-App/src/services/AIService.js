// ═══════════════════════════════════════════════════════
// MOARL AI Service — Anthropic Claude API Integration
// ═══════════════════════════════════════════════════════

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

// ── Replace with your actual Claude API key ──
// In production, use expo-constants + EAS secrets
const API_KEY = process.env.ANTHROPIC_API_KEY || 'YOUR_CLAUDE_API_KEY_HERE';

export async function callClaude({ messages, system, maxTokens = 1000 }) {
  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // NOTE: In production, API calls should go through your backend
      // to protect the API key. This is for demo/prototype purposes.
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || '';
}

// ── Open Library API ──
export async function searchOpenLibrary(query, limit = 24) {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}&fields=key,title,author_name,first_publish_year,subject,ratings_average,cover_i,number_of_pages_median`;
  const response = await fetch(url);
  const data = await response.json();

  return {
    total: data.numFound || 0,
    books: (data.docs || []).map(doc => ({
      id: doc.key?.replace('/works/', '') || String(Math.random()),
      title: doc.title || 'Unknown Title',
      author: doc.author_name?.[0] || 'Unknown Author',
      year: doc.first_publish_year || null,
      pages: doc.number_of_pages_median || null,
      genre: doc.subject?.[0] || 'General',
      rating: doc.ratings_average ? Math.min(5, Math.round(doc.ratings_average)) : 4,
      coverId: doc.cover_i || null,
      language: 'English',
    })),
  };
}

export function getBookCoverUrl(coverId, size = 'M') {
  if (!coverId) return null;
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}

export async function fetchBookDescription(workId) {
  try {
    const response = await fetch(`https://openlibrary.org/works/${workId}.json`);
    const data = await response.json();
    const desc = data.description;
    return typeof desc === 'string' ? desc : desc?.value || null;
  } catch {
    return null;
  }
}

// ── DeepSeek AI Prompts ──
export const DEEPSEEK_PROMPTS = {
  bookDNA: (title, author) =>
    `Perform a Book DNA Analysis on "${title}" by ${author}. Break down: 1) Core Themes, 2) Narrative Structure, 3) Writing Style DNA, 4) Character Archetypes, 5) Cultural Context, 6) Literary Influences, 7) Legacy & Impact. Format clearly with emoji headers.`,

  summarize: (title, author) =>
    `Provide an intelligent summary of "${title}" by ${author} for a mobile reader. Include: TL;DR (2 sentences), Key Themes (3 bullets), Main Characters, Plot Arc (spoiler-free), Why It Matters, Who Should Read It. Use emojis.`,

  recommend: (genres, history) =>
    `Based on reading interests in ${genres} and having read ${history}, recommend 5 books available on MOARL's global library. For each: title, author, why they'll love it, reading difficulty, approximate length.`,

  researchAgent: (topic) =>
    `Act as an Academic Research Agent. Research the topic: "${topic}". Identify: 1) Top 5 foundational works, 2) Key academic journals, 3) Major scholars, 4) Recent developments (2020-2025), 5) Recommended reading path from beginner to expert. Cross-reference MOARL's 50M+ book database.`,

  literaryTimeMachine: (concept) =>
    `Use the Literary Time Machine to trace how "${concept}" has evolved across literary history. Show the journey from ancient texts through modern works, identifying key turning points. Include specific books from each era available on MOARL.`,

  authorIntelligence: (author) =>
    `Create a deep Author Intelligence profile for ${author}: Biography & influences, Complete works timeline, Writing style evolution, Thematic obsessions, Cultural impact, Connections to other authors, Best starting points for new readers.`,
};

export const LIBRARIAN_SYSTEM_PROMPT = `You are MOARL AI Librarian — the world's most sophisticated literary AI, powered by DeepSeek and Claude intelligence. You operate within MOARL (Mother of All Real-Time Libraries), a global digital library portal connecting 247 world-class libraries with 50M+ books, all completely free.

Personality: Deeply knowledgeable, warm, intellectually curious, enthusiastic about literature in all forms. You speak with the authority of a master librarian combined with the warmth of a reading companion.

Core capabilities:
- Recommend books by genre, mood, author, themes, or reading level with specific titles
- Provide detailed summaries and literary analysis
- Discuss literary history, movements, and cultural context
- Help users find rare manuscripts, academic papers, and obscure works
- Suggest personalized reading lists and plans
- Discuss authors' lives, influences, and literary connections
- Compare books and literary traditions across cultures
- Explain complex academic works in accessible language

Always reference MOARL's 50M+ collection and 247 library partners. Be enthusiastic, specific, and genuinely helpful. Format responses with emojis where appropriate for mobile readability. Keep responses concise but valuable — this is a mobile app.`;
