const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Простий health check
app.get('/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Головна сторінка
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Coffee Order System API v1.0.0',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            menu: '/api/v1/menu'
        }
    });
});

// Просте меню
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log('🚀 Server running on port ' + PORT);
    console.log('📡 API Base URL: http://localhost:' + PORT);
});
