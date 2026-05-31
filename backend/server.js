// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const aiRoutes = require('./routes/ai');
const healthRoutes = require('./routes/health');
const rateLimit = require('./middleware/rateLimit');
const logger = require('./utils/logger');

const app = express();

app.use(express.json({ limit: '1mb' }));

// CORS ouvert pour le dev
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Répond aux preflight OPTIONS
app.options('*', cors());

app.use(rateLimit);

app.use('/api/ai', aiRoutes);
app.use('/api/health', healthRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});