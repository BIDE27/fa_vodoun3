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
   - Dans les paramètres du projet, allez dans "Variables and Secrets"
   - Cliquez sur "+ Add" pour ajouter une nouvelle variable
   - **Nom** : `VITE_GEMINI_API_KEY` (recommandé) ou `GEMINI_API_KEY`
   - **Valeur** : Votre clé API Gemini
   - **Type** : Choisissez "Secret" (recommandé) ou "Plaintext"
   - ⚠️ **Important** : 
     * Assurez-vous que la variable est bien enregistrée et visible dans la liste
     * Après avoir ajouté/modifié la variable, **déclenchez un nouveau déploiement** (les variables sont injectées au moment du build)
     * Consultez les logs de build pour vérifier que la variable est détectée

4. Déployez :
   - Cloudflare Pages détectera automatiquement les nouveaux commits et déploiera votre application
   - Votre application sera accessible à l'URL fournie par Cloudflare Pages

### Dépannage - Le chat IA ne fonctionne pas

Si le chat IA ne répond pas ou affiche "Les ancêtres sont silencieux...", vérifiez :

1. **Variable d'environnement** :
   - Ouvrez la console du navigateur (F12)
   - Cherchez les messages d'erreur concernant `GEMINI_API_KEY`
   - Si vous voyez "❌ GEMINI_API_KEY is not defined", la variable n'est pas injectée

2. **Vérifiez dans Cloudflare Pages** :
   - Allez dans "Variables and Secrets"
   - Vérifiez que la variable existe (nom exact : `VITE_GEMINI_API_KEY` ou `GEMINI_API_KEY`)
   - **Important** : Après avoir ajouté/modifié une variable, vous devez **redéployer** manuellement

3. **Vérifiez les logs de build** :
   - Dans Cloudflare Pages, allez dans "Deployments"
   - Cliquez sur le dernier déploiement
   - Vérifiez les logs de build pour voir si la variable est détectée
   - Vous devriez voir : "✅ GEMINI_API_KEY trouvée au build: ..."

4. **Erreurs 429 (Rate Limit)** :
   - Si vous voyez des erreurs 429 dans la console, cela signifie que la clé API est valide mais le quota est dépassé
   - Vérifiez votre quota sur [Google AI Studio](https://aistudio.google.com/)

5. **Redéploiement manuel** :
   - Dans Cloudflare Pages, allez dans "Deployments"
   - Cliquez sur "Retry deployment" ou "Redeploy" pour forcer un nouveau build avec les variables mises à jour
