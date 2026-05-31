// middleware/auth.js
module.exports = {
  validateApiKey: (req, res, next) => {
    // Optionnel : ajoute une clé API pour sécuriser le backend
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey || apiKey !== process.env.BACKEND_API_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    next();
  }
};