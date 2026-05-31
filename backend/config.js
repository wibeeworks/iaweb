// config.js
module.exports = {
  apiKeys: {
    openai: process.env.OPENAI_API_KEY,
    anthropic: process.env.ANTHROPIC_API_KEY,
    mistral: process.env.MISTRAL_API_KEY,
    google: process.env.GOOGLE_API_KEY
  },
  models: {
    openai: 'gpt-4-turbo',
    anthropic: 'claude-3-opus-20240229',
    mistral: 'mistral-large-latest',
    google: 'gemini-pro'
  },
  rateLimit: {
    windowMs: 60 * 1000,
    maxRequests: 30
  }
};