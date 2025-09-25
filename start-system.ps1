Write-Host \"☕ Запуск Coffee Order System...\" -ForegroundColor Green

# Функція для перевірки портів
function Test-Port {
    param([int]$Port)
    try {
        $tcp = New-Object System.Net.Sockets.TcpClient
        $tcp.Connect(\"localhost\", $Port)
        $tcp.Close()
        return $true
    } catch {
        return $false
    }
}

# Перевірка залежностей
Write-Host \"📦 Перевірка залежностей...\" -ForegroundColor Cyan

if (-not (Test-Path \"backend/node_modules\")) {
    Write-Host \"Встановлення backend залежностей...\" -ForegroundColor Yellow
    Set-Location backend
    npm install
    Set-Location ..
}

if (-not (Test-Path \"frontend/node_modules\")) {
    Write-Host \"Встановлення frontend залежностей...\" -ForegroundColor Yellow
    Set-Location frontend
    npm install
    Set-Location ..
}

# Запуск серверів
Write-Host \"🚀 Запуск системи...\" -ForegroundColor Magenta

# Запускаємо backend в окремому процесі
$backendProcess = Start-Process -FilePath \"node\" -ArgumentList \"server.js\" -WorkingDirectory \"backend\" -PassThru -NoNewWindow

# Чекаємо, поки backend запуститься
Write-Host \"Очікування запуску backend...\" -ForegroundColor Yellow
$maxAttempts = 10
$attempt = 0

do {
    Start-Sleep -Seconds 2
    $attempt++
    Write-Host \"Спроба $attempt/$maxAttempts...\" -ForegroundColor Gray
} until ((Test-Port -Port 5000) -or ($attempt -ge $maxAttempts))

if (Test-Port -Port 5000) {
    Write-Host \"✅ Backend запущено!\" -ForegroundColor Green
    
    # Запускаємо frontend
    Write-Host \"🎨 Запуск frontend...\" -ForegroundColor Cyan
    $frontendProcess = Start-Process -FilePath \"npm\" -ArgumentList \"start\" -WorkingDirectory \"frontend\" -PassThru -NoNewWindow
    
    Write-Host \"✅ Система запущена!\" -ForegroundColor Green
    Write-Host \"📊 Backend API: http://localhost:5000\" -ForegroundColor Blue
    Write-Host \"🎨 Frontend: http://localhost:3000\" -ForegroundColor Blue
    Write-Host \"🔗 Health check: http://localhost:5000/api/health\" -ForegroundColor Blue
    Write-Host \"
Для зупинки системи закрийте ці вікна або натисніть Ctrl+C\" -ForegroundColor Yellow
    
    # Очікуємо, поки користувач не зупинить
    try {
        Wait-Event -Timeout 3600
    } finally {
        Write-Host \"
🛑 Зупинка системи...\" -ForegroundColor Red
        if ($backendProcess -and !$backendProcess.HasExited) {
            $backendProcess.Kill()
        }
        if ($frontendProcess -and !$frontendProcess.HasExited) {
            $frontendProcess.Kill()
        }
    }
} else {
    Write-Host \"❌ Backend не запустився. Перевірте помилки вище.\" -ForegroundColor Red
    if ($backendProcess -and !$backendProcess.HasExited) {
        $backendProcess.Kill()
    }
}
