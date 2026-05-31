// middleware/rateLimit.js
const config = require('../config');

const store = new Map();

module.exports = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  
  if (!store.has(ip)) {
    store.set(ip, []);
  }

  const requests = store.get(ip).filter(time => now - time < config.rateLimit.windowMs);
  requests.push(now);
  store.set(ip, requests);

  if (requests.length > config.rateLimit.maxRequests) {
    return res.status(429).json({ error: 'Trop de requêtes. Attends un moment.' });
  }

  next();
};