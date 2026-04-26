import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import authRoutes from './routes/authRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

const app = express();

/* ✅ CORS (allow frontend) */
app.use(
  cors({
    origin: 'http://localhost:3000', // frontend URL
    credentials: true,
  })
);

/* ✅ Body parsers */
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

/* ✅ Health check */
app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'shahiposh-backend' });
});

/* ✅ API Routes */
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);

/* ❌ 404 Handler (important) */
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

/* ❌ Global Error Handler */
app.use((err, _req, res, _next) => {
  console.error('❌ ERROR:', err.message || err);
  res.status(500).json({ message: 'Internal server error' });
});

/* 🚀 Start server */
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`🚀 Backend running on http://localhost:${port}`);
});