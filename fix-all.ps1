Write-Host "🎯 АВТОМАТИЧНЕ ВИПРАВЛЕННЯ" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Cyan

# Перевіряємо де ми знаходимось
Write-Host "Поточна папка: C:\Users\Admin\OneDrive\Рабочий стол\coffee-order-system\backend" -ForegroundColor Yellow

# Видаляємо зайву папку backend якщо вона створилась
if (Test-Path "backend") {
    Write-Host "🗑️ Видаляємо зайву папку backend..." -ForegroundColor Yellow
    Remove-Item "backend" -Recurse -Force
    Write-Host "✅ Папку видалено" -ForegroundColor Green
}

# Створюємо простий server.js
Write-Host "📄 Створюємо server.js..." -ForegroundColor Yellow
@'
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ 
    success: true, 
    message: "Сервер працює! 🚀",
    timestamp: new Date().toISOString()
  });
});

// Меню
app.get("/api/v1/menu", (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: "Еспресо", price: 35, category: "espresso" },
      { id: 2, name: "Американо", price: 30, category: "americano" },
      { id: 3, name: "Латте", price: 45, category: "latte" }
    ]
  });
});

// Старт сервера
const PORT = 3001;
app.listen(PORT, () => {
  console.log("🚀 Сервер запущено на порті " + PORT);
  console.log("🏥 Health check: http://localhost:" + PORT + "/health");
});
'@ | Out-File -FilePath "server.js" -Encoding utf8

Write-Host "✅ server.js створено" -ForegroundColor Green

# Перевіряємо package.json
if (Test-Path "package.json") {
    Write-Host "✅ package.json існує" -ForegroundColor Green
} else {
    Write-Host "📦 Створюємо package.json..." -ForegroundColor Yellow
    @'
{
  "name": "coffee-backend",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}
'@ | Out-File -FilePath "package.json" -Encoding utf8
    Write-Host "✅ package.json створено" -ForegroundColor Green
}

Write-Host "🎉 ВИПРАВЛЕННЯ ЗАВЕРШЕНО!" -ForegroundColor Green
Write-Host "🚀 Запускайте: npm start" -ForegroundColor Cyan
