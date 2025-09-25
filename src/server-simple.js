const express = require('express');

const PORT = 3000;
const HOST = '127.0.0.1';

const app = express();

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  next();
});

app.use(express.json());

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    message: '✅ Сервер працює!',
    timestamp: new Date().toISOString()
  });
});

// Меню
app.get('/api/v1/menu', (req, res) => {
  res.json({
    success: true,
    data: {
      items: [
        {
          id: "1",
          name: "Еспресо",
          description: "Класичний міцний еспресо",
          category: "espresso",
          price: 35,
          available: true
        },
        {
          id: "2",
          name: "Латте", 
          description: "Ніжний напій з еспресо та молоком",
          category: "latte",
          price: 45,
          available: true
        }
      ]
    }
  });
});

// Автентифікація - Реєстрація
app.post('/api/v1/auth/register', (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;
  
  const user = {
    id: Date.now(),
    firstName: firstName,
    lastName: lastName,
    email: email,
    role: 'customer'
  };
  
  res.json({
    success: true,
    message: 'Користувач зареєстрований!',
    data: {
      user: user,
      accessToken: 'temp-token-' + Date.now()
    }
  });
});

// Автентифікація - Логін
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = {
    id: 1,
    firstName: 'Анна',
    lastName: 'Іванова',
    email: email,
    role: 'customer'
  };
  
  res.json({
    success: true,
    message: 'Успішний вхід!',
    data: {
      user: user,
      accessToken: 'temp-token-' + Date.now()
    }
  });
});

// Створення замовлення
app.post('/api/v1/orders', (req, res) => {
  try {
    const { items, customerName, customerEmail, customerPhone, orderType, notes } = req.body;
    
    // Валідація
    if (!items || !customerName || !customerEmail) {
      return res.status(400).json({
        success: false,
        message: 'Заповніть обов\'язкові поля'
      });
    }
    
    // Розрахунок суми
    const totalAmount = items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    
    // Створення замовлення
    const order = {
      orderNumber: 'ORDER-' + Date.now(),
      customerName: customerName,
      customerEmail: customerEmail,
      customerPhone: customerPhone || '',
      items: items,
      totalAmount: totalAmount,
      orderType: orderType || 'pickup',
      status: 'pending',
      notes: notes || '',
      createdAt: new Date()
    };
    
    res.status(201).json({
      success: true,
      message: 'Замовлення створено!',
      data: { order: order }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Помилка сервера'
    });
  }
});

// Отримання замовлень
app.get('/api/v1/orders', (req, res) => {
  res.json({
    success: true,
    data: {
      orders: []
    }
  });
});

// 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Маршрут не знайдено'
  });
});

// Запуск сервера
app.listen(PORT, HOST, () => {
  console.log(`🚀 Сервер працює на http://${HOST}:${PORT}`);
  console.log('✅ API готове до використання!');
});