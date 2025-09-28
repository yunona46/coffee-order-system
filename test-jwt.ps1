Write-Host '🧪 Тестування JWT автентифікації...' -ForegroundColor Cyan

# 1. Health check
Write-Host '1. Health check...' -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/health' -Method Get
    Write-Host '   ✅ Health: ' $health.message -ForegroundColor Green
} catch { Write-Host '   ❌ Health failed' -ForegroundColor Red }

# 2. Реєстрація
Write-Host '2. Тест реєстрації...' -ForegroundColor Yellow
$registerData = @{
    firstName = 'Тест'
    lastName = 'Користувач'
    email = 'test' + (Get-Date -Format 'HHmmss') + '@example.com'
    password = 'password123'
    phone = '+380501234567'
}

try {
    $register = Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/auth/register' -Method Post -Body ($registerData | ConvertTo-Json) -ContentType 'application/json'
    Write-Host '   ✅ Реєстрація: ' $register.message -ForegroundColor Green
    $email = $registerData.email
} catch { 
    Write-Host '   ❌ Реєстрація failed: ' $_.Exception.Message -ForegroundColor Red
    $email = 'test@example.com'
}

# 3. Логін
Write-Host '3. Тест логіну...' -ForegroundColor Yellow
$loginData = @{ email = $email; password = 'password123' }

try {
    $login = Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/auth/login' -Method Post -Body ($loginData | ConvertTo-Json) -ContentType 'application/json'
    Write-Host '   ✅ Логін: ' $login.message -ForegroundColor Green
    $token = $login.data.accessToken
} catch { 
    Write-Host '   ❌ Логін failed: ' $_.Exception.Message -ForegroundColor Red
    $token = $null
}

if ($token) {
    $headers = @{ Authorization = 'Bearer ' + $token }
    
    # 4. Профіль
    Write-Host '4. Тест профілю...' -ForegroundColor Yellow
    try {
        $profile = Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/auth/me' -Method Get -Headers $headers
        Write-Host '   ✅ Профіль: Отримано дані ' $profile.data.user.email -ForegroundColor Green
    } catch { Write-Host '   ❌ Профіль failed: ' $_.Exception.Message -ForegroundColor Red }
    
    # 5. Мої замовлення
    Write-Host '5. Тест моїх замовлень...' -ForegroundColor Yellow
    try {
        $orders = Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/orders/my' -Method Get -Headers $headers
        Write-Host '   ✅ Мої замовлення: ' $orders.data.orders.Count 'замовлень' -ForegroundColor Green
    } catch { Write-Host '   ❌ Замовлення failed: ' $_.Exception.Message -ForegroundColor Red }
    
    # 6. Логаут
    Write-Host '6. Тест логауту...' -ForegroundColor Yellow
    try {
        $logout = Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/auth/logout' -Method Post -Headers $headers
        Write-Host '   ✅ Логаут: ' $logout.message -ForegroundColor Green
    } catch { Write-Host '   ❌ Логаут failed: ' $_.Exception.Message -ForegroundColor Red }
}

Write-Host '🧪 Тестування завершено!' -ForegroundColor Cyan
