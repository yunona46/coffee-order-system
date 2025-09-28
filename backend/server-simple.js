const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Простий тестовий маршрут
app.get('/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Server is running (without MongoDB)',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/v1/menu', (req, res) => {
    res.json({
        success: true,
        data: {
            items: [
                { id: 1, name: 'Еспресо', price: 35, category: 'espresso' },
                { id: 2, name: 'Американо', price: 30, category: 'americano' },
                { id: 3, name: 'Латте', price: 45, category: 'latte' }
            ]
        }
    });
});

app.post('/api/v1/auth/register', (req, res) => {
    res.json({
        success: true,
        message: 'Користувач успішно зареєстрований (demo)',
        data: {
            user: {
                id: 1,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email
            }
        }
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log('🚀 Server running on port ' + PORT + ' (without DB)');
    console.log('📡 API Base URL: http://localhost:' + PORT);
});
