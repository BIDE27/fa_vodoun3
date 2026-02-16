import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // Pour le développement local, charge depuis .env
    // Pour Cloudflare Pages, utilise process.env directement
    const env = loadEnv(mode, '.', '');
    // Support pour VITE_GEMINI_API_KEY (recommandé) et GEMINI_API_KEY (rétrocompatibilité)
    const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || '';
    
    // Log pour debug (seulement les premiers caractères pour la sécurité)
    if (apiKey) {
        console.log('✅ GEMINI_API_KEY trouvée au build:', apiKey.substring(0, 10) + '...');
    } else {
        console.warn('⚠️ GEMINI_API_KEY non trouvée au build. Vérifiez la configuration Cloudflare Pages.');
        console.warn('   Cherché: VITE_GEMINI_API_KEY ou GEMINI_API_KEY');
    }
    
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // Support pour import.meta.env (recommandé pour Vite)
        'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(apiKey),
        'import.meta.env.GEMINI_API_KEY': JSON.stringify(apiKey),
        // Rétrocompatibilité avec process.env
        'process.env.API_KEY': JSON.stringify(apiKey),
        'process.env.GEMINI_API_KEY': JSON.stringify(apiKey),
        'process.env.VITE_GEMINI_API_KEY': JSON.stringify(apiKey)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
