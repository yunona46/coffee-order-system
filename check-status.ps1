Write-Host "🔍 Перевірка статусу Coffee Order System..." -ForegroundColor Cyan

# Функція для перевірки сервісу
function Test-Service {
    param([string], [string])
    
    try {
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec 3
        Write-Host "✅ $Name працює (статус: $($response.StatusCode))" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ $Name не відповідає: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

Write-Host "
🌐 Перевірка сервісів..." -ForegroundColor Yellow

$backendOk = Test-Service -Url "http://localhost:5000/api/health" -Name "Backend API"
$frontendOk = Test-Service -Url "http://localhost:3000" -Name "Frontend App"

if ($backendOk -and $frontendOk) {
    Write-Host "
🎉 Всі сервіси працюють коректно!" -ForegroundColor Green
    Write-Host "
📊 Доступні URL:" -ForegroundColor Cyan
    Write-Host "   Backend API:  http://localhost:5000" -ForegroundColor Blue
    Write-Host "   Frontend App: http://localhost:3000" -ForegroundColor Blue
    Write-Host "   Health Check: http://localhost:5000/api/health" -ForegroundColor Blue
    
    Write-Host "
🚀 Спробуйте відкрити у браузері:" -ForegroundColor Cyan
    Write-Host "   • Frontend: http://localhost:3000" -ForegroundColor Yellow
    Write-Host "   • Backend Health: http://localhost:5000/api/health" -ForegroundColor Yellow
} else {
    Write-Host "
⚠️ Деякі сервіси не працюють. Перевірте:" -ForegroundColor Yellow
    Write-Host "   1. Чи запущені сервери?" -ForegroundColor White
    Write-Host "   2. Чи встановлені залежності? (npm install)" -ForegroundColor White
    Write-Host "   3. Чи вільні порти 3000 та 5000?" -ForegroundColor White
}

# Перевіряємо процеси Node.js
Write-Host "
🔧 Запущені процеси Node.js:" -ForegroundColor Cyan
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | ForEach-Object {
        Write-Host "   • PID $($_.Id): $($_.Path)" -ForegroundColor Green
    }
} else {
    Write-Host "   ❌ Процеси Node.js не знайдені" -ForegroundColor Red
}

Write-Host "
💡 Для запуску системи використовуйте: .\start-system.bat" -ForegroundColor Magenta
