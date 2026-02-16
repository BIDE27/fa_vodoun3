
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
 * Utilise gemini-1.5-flash (gratuit) par défaut au lieu de gemini-3-flash-preview
 */
const callGeminiWithRetry = async (prompt: string, modelName: string = 'gemini-1.5-flash', retries: number = 2): Promise<string | null> => {
  // Essayer d'abord import.meta.env (méthode recommandée pour Vite)
  // Puis process.env (rétrocompatibilité)
  const apiKey = (import.meta.env?.VITE_GEMINI_API_KEY as string) || 
                 (process.env?.API_KEY as string) || 
                 (process.env?.GEMINI_API_KEY as string) ||
                 (process.env?.VITE_GEMINI_API_KEY as string);
  
  // Debug: Log API key status (without exposing the full key)
  if (!apiKey || apiKey.trim() === '') {
    console.error('❌ GEMINI_API_KEY is not defined or empty.');
    console.error('Please check:');
    console.error('1. Variable is set in Cloudflare Pages → Variables and Secrets');
    console.error('2. Variable name is exactly: GEMINI_API_KEY');
    console.error('3. After adding/changing the variable, trigger a new deployment');
    return null;
  }
  
  // Log partial key for debugging (first 10 chars only)
  console.log('✅ API Key found:', apiKey.substring(0, 10) + '...');
  
  const ai = new GoogleGenAI({ apiKey });
  
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
      });
      return response.text || null;
    } catch (error: any) {
      const isRateLimit = error?.message?.includes('429') || error?.status === 429;
      const isResourceExhausted = error?.message?.includes('RESOURCE_EXHAUSTED') || 
                                   error?.status === 'RESOURCE_EXHAUSTED' ||
                                   (error?.error?.status === 'RESOURCE_EXHAUSTED');
      const isAuthError = error?.message?.includes('401') || error?.message?.includes('403') || error?.status === 401 || error?.status === 403;
      
      // Log detailed error for debugging
      if (isAuthError) {
        console.error('❌ Gemini API Authentication Error:', error?.message || error);
        console.error('This usually means the API key is invalid or incorrect.');
        break;
      }
      
      // Gestion spécifique pour RESOURCE_EXHAUSTED (quota dépassé)
      if (isResourceExhausted) {
        console.error('❌ Gemini API Quota Exhausted (RESOURCE_EXHAUSTED)');
        console.error('Le modèle utilisé n\'est peut-être pas disponible dans le quota gratuit.');
        console.error('Modèle utilisé:', modelName);
        console.error('Vérifiez que vous utilisez gemini-1.5-flash ou gemini-1.5-pro (gratuits)');
        console.error('Les modèles gemini-3-* ne sont pas disponibles dans le quota gratuit.');
        break;
      }
      
      if (isRateLimit && i < retries) {
        // Longer delays: 2s, then 5s
        const delay = (i === 0 ? 2000 : 5000);
        console.warn(`⏳ Rate limit hit, retrying in ${delay/1000}s... (Attempt ${i + 1}/${retries + 1})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      if (isRateLimit) {
        console.warn(`⚠️ Gemini API rate limit/quota reached after ${retries + 1} attempts. Using fallback.`);
        console.warn('Error details:', error?.message || error);
      } else {
        console.warn(`⚠️ Gemini API error (Attempt ${i + 1}):`, error?.message || error);
      }
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

  // Utilise gemini-1.5-pro (gratuit) au lieu de gemini-3-pro-preview qui n'est pas disponible en gratuit
  const result = await callGeminiWithRetry(prompt, 'gemini-1.5-pro', 1);
  
  return result || "Les ancêtres sont silencieux pour le moment. Consultez le Fa physiquement pour une guidance plus profonde. [ACTION_CONSULTATION]";
};
