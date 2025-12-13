const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize'); // ← ДОДАНО
require('dotenv').config();

const app = express();

// ========================================
// SECURITY: Helmet.js (SEC-001)
// ========================================
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
    }
  },
  crossOriginEmbedderPolicy: false,
}));

// ========================================
// SECURITY: Rate Limiting (SEC-002)
// ========================================
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Занадто багато запитів з цього IP. Спробуйте пізніше.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Занадто багато спроб входу. Спробуйте через 15 хвилин.'
  },
  skipSuccessfulRequests: true,
});

app.use(generalLimiter);

// ========================================
// SECURITY: NoSQL Injection Protection (SEC-004)
// ========================================
app.use(mongoSanitize({
  replaceWith: '_', // Замінює заборонені символи ($, .) на _
  onSanitize: ({ req, key }) => {
    console.warn(`⚠️ Виявлено спробу NoSQL ін'єкції в полі: ${key}`);
  }
}));

// Middleware
app.use(cors());
app.use(express.json());

// Підключення до MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/coffee-order-system')
    .then(() => console.log('✅ Підключено до MongoDB'))
    .catch(err => console.error('❌ Помилка підключення до MongoDB:', err));

// Імпорт маршрутів
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');

// Використання маршрутів
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/menu', menuRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/users', userRoutes);

// Обробка незнайдених маршрутів
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Маршрут не знайдено'
    });
});

// Обробка помилок
app.use((error, req, res, next) => {
    console.error('Помилка сервера:', error);
    res.status(500).json({
        success: false,
        message: 'Внутрішня помилка сервера'
    });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущено на порті ${PORT}`);
    console.log(`📚 API доступне за адресою: http://localhost:${PORT}/api/v1`);
});