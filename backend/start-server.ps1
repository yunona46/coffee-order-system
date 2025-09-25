# Скрипт автоматичного запуску Backend
Write-Host "☕ COFFEE ORDER SYSTEM - BACKEND LAUNCHER" -ForegroundColor Magenta
Write-Host "=========================================" -ForegroundColor Cyan

# Перевірка .env файлу
if (Test-Path ".env") {
    \ = Get-Content ".env" -Raw
    if (\ -match "mongodb\\+srv://.*:.*@.*\\.mongodb\\.net/") {
        Write-Host "✅ MongoDB Atlas URI знайдено в .env" -ForegroundColor Green
    } else {
        Write-Host "❌ MongoDB Atlas URI не знайдено в .env" -ForegroundColor Red
        Write-Host "💡 Переконайтесь що ви виконали налаштування MongoDB Atlas" -ForegroundColor Yellow
        Write-Host "📖 Інструкція в файлі: ../MongoDB-Atlas-Setup.txt" -ForegroundColor White
        exit 1
    }
} else {
    Write-Host "❌ .env файл не знайдено" -ForegroundColor Red
    exit 1
}

# Перевірка node_modules
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Встановлення залежностей..." -ForegroundColor Yellow
    npm install
    if (\0 -ne 0) {
        Write-Host "❌ Помилка встановлення залежностей" -ForegroundColor Red
        exit 1
    }
}

Write-Host "
🚀 ЗАПУСК СЕРВЕРА РОЗРОБКИ..." -ForegroundColor Green
Write-Host "⏳ Сервер запускається..." -ForegroundColor Yellow
Write-Host "🌐 Після запуску перейдіть: http://localhost:3001/health" -ForegroundColor White
Write-Host "⏹️  Для зупинки сервера натисніть Ctrl+C" -ForegroundColor Gray

# Запуск сервера
npm run dev
