require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Basic route
app.get('/', (req, res) => {
    res.json({ 
        message: '☕ Coffee Order System API is running!',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth'
        }
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'coffee-order-backend'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(\🚀 Server is running on port \\);
    console.log(\📊 API available at: http://localhost:\/api\);
    console.log(\🔗 Health check: http://localhost:\/api/health\);
});

module.exports = app;
