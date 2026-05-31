# Page AI Assistant - Extension Chrome

Extension Chrome privacy-friendly pour discuter avec une IA sur le contenu des pages web.

## Caractéristiques

✅ **Privacy-first** : Tes clés API restent locales, le contenu n'est pas tracké.
✅ **Multi-IA** : OpenAI, Anthropic, Mistral, Google Gemini.
✅ **Actions rapides** : Résumer, expliquer, extraire, traduire.
✅ **Conversations persistantes** : Historique local.
✅ **Backend sécurisé** : Architecture client → backend → API.

## Installation

### 1. Clone et setup du backend

```bash
cd backend
npm install
cp .env.example .env
# Ajoute tes clés API dans .env
npm start
```

Le serveur tourne sur `http://localhost:3000`.

### 2. Charge l'extension dans Chrome

1. Va sur `chrome://extensions/`
2. Active "Mode développeur" (en haut à droite)
3. Clique "Charger l'extension non empaquetée"
4. Sélectionne le dossier `extension/`

### 3. Configure tes clés API

1. Clique sur l'icône de l'extension
2. Clique ⚙️ (Paramètres)
3. Ajoute tes clés API (optionnel si ton backend les a)
4. Enregistre

## Utilisation

1. Va sur n'importe quelle page web.
2. Clique sur l'icône de l'extension.
3. Sélectionne une IA dans le dropdown.
4. Clique sur une action rapide (Résumer, Expliquer, etc.) **OU** écris ta question.
5. Lis la réponse.

## Structure
browser-ai-extension/
├── extension/          # Code de l'extension Chrome
├── backend/            # Serveur Node.js
└── README.md

## Architecture
[Page Web]
↓
[Extension Chrome] (Popup + Content Script)
↓ HTTPS
[Node.js Backend] (Sécurisé)
↓
[OpenAI / Anthropic / Mistral / Google API]

## Configuration Backend

Fichier `.env` :

```env
PORT=3000
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
MISTRAL_API_KEY=...
GOOGLE_API_KEY=...
```

## Déploiement Backend

### Vercel (Recommandé pour commencer)

```bash
npm i -g vercel
vercel
```

### Render

Crée un service web, ajoute tes env vars, déploie.

### Fly.io

```bash
flyctl launch
```

## Privacy & Sécurité

- ✅ **Aucune clé API dans l'extension** : Elles restent sur ton serveur backend.
- ✅ **Stockage local uniquement** : Les conversations sont dans `chrome.storage.local`.
- ✅ **HTTPS obligatoire** : Le backend doit être en HTTPS en production.
- ✅ **Pas de tracking** : Aucun telemetry, aucun analytics.
- ⚠️ **Assure-toi que ton backend est sécurisé** : Rate limiting, authentification optionnelle.

## Roadmap

- [ ] Stockage dans le cloud (Supabase).
- [ ] Partage de conversations.
- [ ] Support de langues multiples.
- [ ] Support des PDFs et YouTube.
- [ ] Streaming des réponses.
- [ ] Offline mode.

## License

MIT

## Support

Pour les problèmes, ouvre une issue sur GitHub.

---

**Fait par WIBEE - Privacy first, AI-powered.**