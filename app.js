const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

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
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/menu', menuRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/users', userRoutes);

// Обробка незнайдених маршрутів
app.use('*', (req, res) => {
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