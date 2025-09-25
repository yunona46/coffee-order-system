// Coffee Order System - Full Backend
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Models
const User = require('./models/User');
const MenuItem = require('./models/MenuItem');

console.log('☕ Coffee Order System - Full Backend');
console.log('=====================================');

// Підключення до MongoDB
async function connectToDatabase() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected successfully!');
        console.log('📊 Database:', mongoose.connection.db.databaseName);
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
}

// Middleware для автентифікації
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// ==================== API ROUTES ====================

// Health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'System is healthy',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone } = req.body;

        // Перевірка чи користувач вже існує
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Хешування пароля
        const hashedPassword = await bcrypt.hash(password, 12);

        // Створення користувача
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone
        });

        await user.save();

        // Генерація JWT токена
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                },
                token
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Пошук користувача
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Перевірка пароля
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Генерація токена
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role
                },
                token
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Menu routes
app.get('/api/menu', async (req, res) => {
    try {
        const menuItems = await MenuItem.find({ available: true });
        
        res.json({
            success: true,
            data: menuItems,
            total: menuItems.length
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/menu', authenticateToken, async (req, res) => {
    try {
        const menuItem = new MenuItem(req.body);
        await menuItem.save();
        
        res.status(201).json({
            success: true,
            message: 'Menu item created',
            data: menuItem
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Users routes
app.get('/api/users/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Seed database with sample data
app.post('/api/seed', async (req, res) => {
    try {
        // Очищаємо колекції
        await User.deleteMany({});
        await MenuItem.deleteMany({});

        // Створюємо тестового адміна
        const adminPassword = await bcrypt.hash('admin123', 12);
        const adminUser = new User({
            firstName: 'Admin',
            lastName: 'System',
            email: 'admin@coffee.com',
            password: adminPassword,
            role: 'admin'
        });
        await adminUser.save();

        // Створюємо тестові позиції меню
        const menuItems = [
            {
                name: 'Espresso',
                description: 'Strong and aromatic Italian espresso',
                category: 'espresso',
                price: 35,
                preparationTime: 2
            },
            {
                name: 'Double Espresso',
                description: 'Double portion of strong espresso',
                category: 'espresso',
                price: 50,
                preparationTime: 3
            },
            {
                name: 'Americano',
                description: 'Espresso with hot water',
                category: 'americano',
                price: 30,
                preparationTime: 3
            },
            {
                name: 'Latte',
                description: 'Espresso with steamed milk',
                category: 'latte',
                price: 45,
                preparationTime: 4
            },
            {
                name: 'Cappuccino',
                description: 'Perfect coffee with milk foam',
                category: 'cappuccino',
                price: 40,
                preparationTime: 4
            },
            {
                name: 'Caramel Frappuccino',
                description: 'Iced coffee with caramel and cream',
                category: 'frappuccino',
                price: 65,
                preparationTime: 5
            }
        ];

        await MenuItem.insertMany(menuItems);

        res.json({
            success: true,
            message: 'Database seeded successfully',
            data: {
                users: 1,
                menuItems: menuItems.length
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
        availableEndpoints: [
            'POST /api/auth/register',
            'POST /api/auth/login',
            'GET  /api/menu',
            'POST /api/seed',
            'GET  /api/users/profile (auth required)'
        ]
    });
});

// Запуск сервера
async function startServer() {
    await connectToDatabase();
    
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log('🚀 Server started successfully!');
        console.log('📍 Port:', PORT);
        console.log('💾 Database:', mongoose.connection.db.databaseName);
        console.log('=====================================');
        console.log('🌐 API Endpoints:');
        console.log('   http://localhost:' + PORT + '/health');
        console.log('   http://localhost:' + PORT + '/api/menu');
        console.log('   http://localhost:' + PORT + '/api/auth/register');
        console.log('   http://localhost:' + PORT + '/api/auth/login');
        console.log('   http://localhost:' + PORT + '/api/seed');
        console.log('=====================================');
    });
}

startServer();
