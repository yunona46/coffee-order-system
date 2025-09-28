Write-Host "☕ ТЕСТУВАННЯ COFFEE ORDER API" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

function Test-API {
    param($Name, $Url, $Method, $Body)
    
    Write-Host "`n🔹 $Name" -ForegroundColor Yellow
    Write-Host "   URL: $Url" -ForegroundColor Gray
    
    try {
        if ($Body) {
            $jsonBody = $Body | ConvertTo-Json
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Body $jsonBody -ContentType "application/json"
        } else {
            $response = Invoke-RestMethod -Uri $Url -Method $Method
        }
        
        Write-Host "   ✅ УСПІХ" -ForegroundColor Green
        if ($response.message) {
            Write-Host "   💬 $($response.message)" -ForegroundColor White
        }
        return $response
    } catch {
        Write-Host "   ❌ ПОМИЛКА: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Тест 1: Статус API
Test-API -Name "Статус API" -Url "http://localhost:3001/api/v1" -Method "GET"

# Тест 2: Реєстрація користувача
$user = @{
    firstName = "Олена"
    lastName = "Шевченко"
    email = "olena.shevchenko@example.com"
    password = "securepass123"
    phone = "+380501112233"
}
Test-API -Name "Реєстрація" -Url "http://localhost:3001/api/v1/auth/register" -Method "POST" -Body $user

# Тест 3: Помилка валідації
$badUser = @{
    firstName = "Тест"
    email = "test@example.com"
}
Test-API -Name "Валідація (без пароля)" -Url "http://localhost:3001/api/v1/auth/register" -Method "POST" -Body $badUser

Write-Host "`n🎉 ТЕСТУВАННЯ ЗАВЕРШЕНО!" -ForegroundColor Cyan
