const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { notFound, errorHandler } = require('./middleware/error');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const adRoutes = require('./routes/ads');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');

function createApp() {
  const app = express();

  const origins = (process.env.CORS_ORIGIN || '*')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const corsOptions = origins.includes('*')
    ? { origin: true, credentials: false }
    : { origin: origins, credentials: true };
  app.use(cors(corsOptions));
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));

  const uploadsDir = path.join(__dirname, '..', 'uploads');
  app.use('/uploads', express.static(uploadsDir));

  app.get('/api/health', (_req, res) => {
    res.json({ success: true, status: 'ok' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/ads', adRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/payments', paymentRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };

