@echo off
chcp 65001 >nul
echo ☕ Запуск Coffee Order System...
echo.

echo 📦 Перевірка залежностей...
cd backend
if not exist node_modules (
    echo Встановлення backend залежностей...
    npm install
)
cd ..

cd frontend  
if not exist node_modules (
    echo Встановлення frontend залежностей...
    npm install
)
cd ..

echo.
echo 🚀 Запуск сервера...
start "Backend Server" cmd /k "cd backend && npm run dev"

echo 🎨 Запуск клієнта...
timeout /t 5 /nobreak >nul
start "Frontend Client" cmd /k "cd frontend && npm start"

echo.
echo ✅ Система запускається...
echo 📊 Backend: http://localhost:5000
echo 🎨 Frontend: http://localhost:3000
echo 🔗 Health check: http://localhost:5000/api/health
echo.
echo ⏳ Зачекайте 10-15 секунд поки сервери повністю запустяться...
echo.
pause
