const express = require('express');
<<<<<<< HEAD
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Підключення до MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/coffee-order-system');
        console.log('✅ MongoDB connected');
    } catch (error) {
        console.log('❌ MongoDB error:', error.message);
        process.exit(1);
    }
};

connectDB();

// Middleware
app.use(express.json());

// Імпортуємо моделі
const MenuItem = require('./models/MenuItem');
const User = require('./models/User');

// Routes
app.get('/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
    });
});

// Menu routes
app.get('/api/v1/menu', async (req, res) => {
    try {
        const items = await MenuItem.find({ available: true });
        res.json({
            success: true,
            data: { items }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Помилка при отриманні меню'
        });
    }
});

app.get('/api/v1/menu/:id', async (req, res) => {
    try {
        const item = await MenuItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Товар не знайдено'
            });
        }
        res.json({
            success: true,
            data: { item }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Помилка при отриманні товару'
        });
    }
});

// Auth routes
app.post('/api/v1/auth/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone } = req.body;
        
        // Перевіряємо чи існує користувач
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Користувач з таким email вже існує'
            });
        }
        
        // Створюємо нового користувача
        const user = new User({
            firstName,
            lastName,
            email,
            password,
            phone
        });
        
        await user.save();
        
        res.status(201).json({
            success: true,
            message: 'Користувач успішно зареєстрований',
            data: {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Помилка при реєстрації'
        });
    }
});

app.post('/api/v1/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                success: false,
                message: 'Невірний email або пароль'
            });
        }
        
        res.json({
            success: true,
            message: 'Успішний вхід',
            data: {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Помилка при вході'
        });
    }
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found: ' + req.originalUrl
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});

app.listen(PORT, () => {
    console.log('🚀 Server running on port ' + PORT);
    console.log('📡 Health check: http://localhost:' + PORT + '/health');
    console.log('☕ Menu API: http://localhost:' + PORT + '/api/v1/menu');
});
=======
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mock API routes
app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    user: { id: 1, email: req.body.email, name: 'Користувач' },
    token: 'mock-jwt-token'
  });
});

app.post('/api/auth/register', (req, res) => {
  res.json({
    success: true,
    user: { id: 1, email: req.body.email, name: req.body.name },
    token: 'mock-jwt-token'
  });
});

app.get('/api/menu', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'Капучино',
      price: 65,
      category: 'coffee',
      emoji: '☕',
      description: 'Ароматна кава з молочною піною'
    },
    {
      id: 2,
      name: 'Лате',
      price: 70,
      category: 'coffee',
      emoji: '🥛',
      description: 'Ніжна кава з молоком'
    },
    {
      id: 3,
      name: 'Американо',
      price: 50,
      category: 'coffee',
      emoji: '⚫',
      description: 'Класична чорна кава'
    },
    {
      id: 4,
      name: 'Чай зелений',
      price: 45,
      category: 'tea',
      emoji: '🍵',
      description: 'Освіжаючий зелений чай'
    },
    {
      id: 5,
      name: 'Тірамісу',
      price: 85,
      category: 'dessert',
      emoji: '🍰',
      description: 'Італійський десерт'
    }
  ]);
});

app.get('/api/orders/my', (req, res) => {
  res.json([]);
});

app.post('/api/orders', (req, res) => {
  res.json({
    success: true,
    orderId: Math.floor(Math.random() * 1000),
    message: 'Замовлення успішно створено'
  });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log('Сервер запущено на порту ' + PORT);
});
>>>>>>> 6f6d0e7ae3e157b26d1a5d2a1d76d3e05409956d
