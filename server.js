const express = require('express');
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
