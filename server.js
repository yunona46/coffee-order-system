const express = require('express');
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
