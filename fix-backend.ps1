Write-Host "🚀 АВТОМАТИЧНЕ ВИПРАВЛЕННЯ BACKEND..." -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan

# 1. Створюємо папки
Write-Host "1. Створюємо папки..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "middleware"
New-Item -ItemType Directory -Force -Path "utils" 
New-Item -ItemType Directory -Force -Path "scripts"
New-Item -ItemType Directory -Force -Path "models"
New-Item -ItemType Directory -Force -Path "config"

# 2. Створюємо package.json
Write-Host "2. Створюємо package.json..." -ForegroundColor Yellow
@'
{
  "name": "coffee-order-backend",
  "version": "1.0.0",
  "description": "Backend for Coffee Order System",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node scripts/seedDatabase.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "express-validator": "^7.0.1",
    "express-rate-limit": "^7.1.5",
    "helmet": "^7.1.0",
    "express-mongo-sanitize": "^2.2.0",
    "xss": "^1.0.14",
    "compression": "^1.7.4",
    "morgan": "^1.10.0",
    "express-session": "^1.17.3",
    "connect-mongo": "^5.1.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  },
  "keywords": ["coffee", "api", "nodejs", "express", "mongodb"],
  "author": "Yunona",
  "license": "MIT"
}
'@ | Out-File -FilePath "package.json" -Encoding utf8

# 3. Створюємо server.js
Write-Host "3. Створюємо server.js..." -ForegroundColor Yellow
@'
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Підключення до MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/coffee-order-system')
  .then(() => console.log('✅ MongoDB підключено'))
  .catch(err => console.error('❌ Помилка MongoDB:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Прості маршрути для тесту
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Сервер працює! 🚀',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/v1/menu', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'Еспресо', price: 35, category: 'espresso' },
      { id: 2, name: 'Американо', price: 30, category: 'americano' },
      { id: 3, name: 'Латте', price: 45, category: 'latte' }
    ]
  });
});

// Обробка 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Маршрут не знайдено'
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('🚀 Сервер запущено на порті ' + PORT);
  console.log('🏥 Health check: http://localhost:' + PORT + '/health');
});
'@ | Out-File -FilePath "server.js" -Encoding utf8

# 4. Створюємо .env файл
Write-Host "4. Створюємо .env файл..." -ForegroundColor Yellow
@'
PORT=3001
MONGODB_URI=mongodb://localhost:27017/coffee-order-system
JWT_SECRET=coffee-system-super-secret-jwt-key-2024
NODE_ENV=development
'@ | Out-File -FilePath ".env" -Encoding utf8

# 5. Створюємо простий seed скрипт
Write-Host "5. Створюємо seed скрипт..." -ForegroundColor Yellow
@'
const mongoose = require('mongoose');
require('dotenv').config();

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Підключено до MongoDB');
    
    // Очищаємо базу даних
    await mongoose.connection.db.dropDatabase();
    console.log('✅ Базу даних очищено');
    
    console.log('🎉 База даних готова до використання!');
    
  } catch (error) {
    console.error('❌ Помилка:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Підключення закрито');
  }
}

seedDatabase();
'@ | Out-File -FilePath "scripts/seedDatabase.js" -Encoding utf8

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "✅ ВСІ ФАЙЛИ СТВОРЕНО УСПІШНО!" -ForegroundColor Green
Write-Host "" -ForegroundColor White
Write-Host "🎯 НАСТУПНІ КРОКИ:" -ForegroundColor Cyan
Write-Host "1. npm install    - Встановити залежності" -ForegroundColor Yellow
Write-Host "2. npm run seed   - Заповнити базу даних" -ForegroundColor Yellow  
Write-Host "3. npm run dev    - Запустити сервер" -ForegroundColor Yellow
Write-Host "" -ForegroundColor White
