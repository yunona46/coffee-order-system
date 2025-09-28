# test-api.ps1
Write-Host "🧪 ТЕСТУВАННЯ API" -ForegroundColor Green
Write-Host "=================" -ForegroundColor Cyan

$baseUrl = "http://localhost:3002"

function Test-ApiEndpoint {
    param($Name, $Url, $Method = "GET", $Body = $null)
    
    try {
        if ($Method -eq "POST" -and $Body) {
            $result = Invoke-RestMethod -Uri $Url -Method $Method -Body $Body -ContentType "application/json"
        } else {
            $result = Invoke-RestMethod -Uri $Url -Method $Method
        }
        Write-Host "✅ $Name" -ForegroundColor Green
        return $result
    } catch {
        Write-Host "❌ $Name" -ForegroundColor Red
        Write-Host "   Помилка: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

Write-Host "1. Основні endpoints:" -ForegroundColor Yellow
Test-ApiEndpoint -Name "Головна сторінка" -Url "$baseUrl/"
Test-ApiEndpoint -Name "Health check" -Url "$baseUrl/health"

Write-Host "2. Меню:" -ForegroundColor Yellow
Test-ApiEndpoint -Name "Всі категорії" -Url "$baseUrl/api/v1/categories"
Test-ApiEndpoint -Name "Все меню" -Url "$baseUrl/api/v1/menu"

Write-Host "3. Замовлення:" -ForegroundColor Yellow
$orderData = @{
    items = @(
        @{ id = 1; name = "Еспресо"; price = 35; quantity = 1 }
    )
    customerName = "Тестовий Користувач"
} | ConvertTo-Json

$orderResult = Test-ApiEndpoint -Name "Створення замовлення" -Url "$baseUrl/api/v1/orders" -Method "POST" -Body $orderData

if ($orderResult) {
    Test-ApiEndpoint -Name "Всі замовлення" -Url "$baseUrl/api/v1/orders"
}

Write-Host "4. Авторизація:" -ForegroundColor Yellow
$loginData = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

Test-ApiEndpoint -Name "Логін" -Url "$baseUrl/api/v1/auth/login" -Method "POST" -Body $loginData

Write-Host "🎉 ТЕСТУВАННЯ ЗАВЕРШЕНО!" -ForegroundColor Green
