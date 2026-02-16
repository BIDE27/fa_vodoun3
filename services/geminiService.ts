
import { GoogleGenAI } from "@google/genai";

// Persistent caching to save quota (persists across refreshes)
const getCachedValue = (key: string): string | null => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const cached = localStorage.getItem(`gemini_cache_${key}`);
    if (cached) {
      const { date, value } = JSON.parse(cached);
      if (date === today) return value;
    }
  } catch (e) {
    console.warn("Cache read error", e);
  }
  return null;
};

const setCachedValue = (key: string, value: string) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`gemini_cache_${key}`, JSON.stringify({ date: today, value }));
  } catch (e) {
    console.warn("Cache write error", e);
  }
};

const FALLBACK_WISDOMS = [
  "La paix intérieure est la clé de l'harmonie universelle.",
  "Connectez-vous à la nature pour retrouver votre chemin intérieur.",
  "Le Fa est un miroir qui révèle la vérité de l'âme.",
  "La patience est le pont entre l'obscurité et la lumière.",
  "Honorez vos racines pour que vos branches touchent le ciel."
];

const FALLBACK_NEWS = [
  "Célébration annuelle des divinités de l'eau ce weekend à Grand-Popo.",
  "Nouvelle exposition sur les masques Guelede au musée d'Abomey.",
  "Rencontre des sages Bokonons pour la paix et la prospérité du pays.",
  "Restauration d'un temple ancestral dans la région de Ouidah."
];

/**
 * Helper to call Gemini with exponential backoff for 429 errors
 */
const callGeminiWithRetry = async (prompt: string, modelName: string = 'gemini-3-flash-preview', retries: number = 2): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
      });
      return response.text || null;
    } catch (error: any) {
      const isRateLimit = error?.message?.includes('429') || error?.status === 429;
      
      if (isRateLimit && i < retries) {
        // Longer delays: 2s, then 5s
        const delay = (i === 0 ? 2000 : 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // Handle the error silently in the production-like view to avoid breaking UI
      console.warn(`Gemini API busy or quota reached (Attempt ${i + 1}). Using fallback.`);
      break;
    }
  }
  return null;
};

export const generateDailyWisdom = async (): Promise<string> => {
  const cached = getCachedValue('daily_wisdom');
  if (cached) return cached;

  const prompt = 'Génère une courte pensée philosophique ou spirituelle basée sur la sagesse du Fa ou du Vodoun. Maximum 2 phrases.';
  const result = await callGeminiWithRetry(prompt);
  
  if (result) {
    setCachedValue('daily_wisdom', result);
    return result;
  }

  return FALLBACK_WISDOMS[Math.floor(Math.random() * FALLBACK_WISDOMS.length)];
};

export const generateNewsSummary = async (): Promise<string> => {
  const cached = getCachedValue('news_summary');
  if (cached) return cached;

  const prompt = 'Génère un titre accrocheur et un court paragraphe (30 mots) pour une actualité fictive sur une célébration culturelle Vodoun au Bénin.';
  const result = await callGeminiWithRetry(prompt);
  
  if (result) {
    setCachedValue('news_summary', result);
    return result;
  }

  return FALLBACK_NEWS[Math.floor(Math.random() * FALLBACK_NEWS.length)];
};

export const askSpiritualAssistant = async (question: string): Promise<string> => {
  const prompt = `Tu es un guide spirituel expert en Fa et Vodoun. Réponds avec sagesse, empathie et précision.
  
Directives de réponse :
1. Pour une demande sur le **Kpoli** (signe du Fa) : Explique que c'est une révélation via la cérémonie du **Fa Tite** par un **Bokonon**. Termine par : [ACTION_CONSULTATION]
2. Pour les prénoms de naissance ou traditions liées aux enfants : 
   - Si l'utilisateur n'a pas précisé le jour de naissance ou l'ethnie/langue, pose-lui la question avec douceur.
   - Si les informations sont là, explique l'importance du nom selon le jour du Fèzan et propose de voir les suggestions avec la balise : [ACTION_AGENDA:YYYY-MM-DD] (remplace par la date fournie ou 2026-01-01 par défaut).
3. Si l'utilisateur demande des informations sur un évènement (ex: Vodoun Days, Guelede) : Utilise la balise [ACTION_EVENT:ID] avec un ID : 'e1' (Vodoun Days), 'e2' (Guelede), 'e3' (Fête de l'Eau), 'e4' (Egungun).
4. Si tu recommandes d'approfondir par une formation : Utilise la balise [ACTION_COURSE:ID] (IDs: 'c1', 'c2', 'c3').
5. Si tu recommandes un objet rituel : Utilise la balise [ACTION_STORE:ID] (IDs: '1', '2', '3').
6. Utilise un langage respectueux : "Mon enfant", "Cher chercheur". Formate en gras (**terme**).
7. Réponds en maximum 120 mots.

Question de l'utilisateur : ${question}`;

  const result = await callGeminiWithRetry(prompt, 'gemini-3-pro-preview', 1);
  
  return result || "Les ancêtres sont silencieux pour le moment. Consultez le Fa physiquement pour une guidance plus profonde. [ACTION_CONSULTATION]";
};
