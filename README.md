<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1c-ehtaj528RYEMXIuqlLH6jubEGY-Fsw

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Déploiement sur Cloudflare Pages

### Configuration requise

1. **Variables d'environnement** : Dans le tableau de bord Cloudflare Pages, ajoutez la variable d'environnement `GEMINI_API_KEY` avec votre clé API Gemini.

### Étapes de déploiement

1. Connectez votre dépôt GitHub à Cloudflare Pages :
   - Allez sur [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Sélectionnez "Pages" dans le menu
   - Cliquez sur "Create a project"
   - Connectez votre compte GitHub et sélectionnez le dépôt `fa_vodoun3`

2. Configurez le build :
   - **Framework preset** : Vite
   - **Build command** : `npm run build`
   - **Build output directory** : `dist`
   - **Node version** : 20

3. Ajoutez la variable d'environnement :
   - Dans les paramètres du projet, allez dans "Environment variables"
   - Ajoutez `GEMINI_API_KEY` avec votre clé API

4. Déployez :
   - Cloudflare Pages détectera automatiquement les nouveaux commits et déploiera votre application
   - Votre application sera accessible à l'URL fournie par Cloudflare Pages
