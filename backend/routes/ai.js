// routes/ai.js
const express = require('express');
const aiProvider = require('../services/aiProvider');
const logger = require('../utils/logger');

const router = express.Router();

router.post('/chat', async (req, res) => {
  try {
    const { message, aiProvider: provider, pageContent, conversationHistory } = req.body;

    if (!message || !provider) {
      return res.status(400).json({ error: 'Message et aiProvider obligatoires' });
    }

    // Construit le contexte
    const systemPrompt = `Tu es un assistant IA utile. L'utilisateur te pose une question sur une page web.
Voici le contenu de la page :
---
${pageContent}
---
Réponds de manière concise et précise. Si la question concerne le contenu de la page, base-toi sur celui-ci.`;

    // Prépare l'historique
    const history = conversationHistory || [];

    // Appelle le fournisseur IA
    const response = await aiProvider.generateResponse(
      provider,
      message,
      systemPrompt,
      history
    );

    res.json({ response });
  } catch (error) {
    logger.error(`AI error: ${error.message}`);
    res.status(500).json({ error: error.message || 'Erreur IA' });
  }
});

module.exports = router;