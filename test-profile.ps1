Write-Host '👤 Тестування системи управління профілем...' -ForegroundColor Cyan

# 1. Реєстрація користувача
Write-Host '1. Реєстрація користувача...' -ForegroundColor Yellow
$user = @{
    firstName = "Іван"
    lastName = "Петренко"
    email = "profileuser$((Get-Date).ToString('HHmmss'))@example.com"
    password = "123456"
    phone = "+380501234567"
}
$reg = Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/auth/register' -Method Post -Body ($user | ConvertTo-Json) -ContentType 'application/json'
$token = $reg.data.accessToken
$headers = @{ Authorization = "Bearer $token" }
Write-Host '   ✅ Користувач зареєстрований' -ForegroundColor Green

# 2. Отримання профілю
Write-Host '2. Отримання профілю...' -ForegroundColor Yellow
$profile = Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/users/profile' -Method Get -Headers $headers
Write-Host '   ✅ Профіль отримано: ' $profile.data.user.firstName ' ' $profile.data.user.lastName -ForegroundColor Green

# 3. Оновлення профілю
Write-Host '3. Оновлення профілю...' -ForegroundColor Yellow
$updateData = @{
    firstName = "Іванко"
    phone = "+380991112233"
    preferences = @{
        notifications = @{
            email = $true
            sms = $true
            push = $false
        }
        language = "uk"
        theme = "dark"
    }
}
$updatedProfile = Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/users/profile' -Method Put -Headers $headers -Body ($updateData | ConvertTo-Json) -ContentType 'application/json'
Write-Host '   ✅ Профіль оновлено: ' $updatedProfile.data.user.phone -ForegroundColor Green

# 4. Додавання адреси
Write-Host '4. Додавання адреси...' -ForegroundColor Yellow
$address1 = @{
    name = "Дім"
    street = "вул. Хрещатик"
    building = "1"
    apartment = "15"
    floor = 3
    entrance = "А"
    intercom = "15"
    notes = "Біля головного входу"
    isDefault = $true
}
$addressResult1 = Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/users/addresses' -Method Post -Headers $headers -Body ($address1 | ConvertTo-Json) -ContentType 'application/json'
Write-Host '   ✅ Адресу додано. Всього адрес: ' $addressResult1.data.addresses.Length -ForegroundColor Green

# 5. Додавання другої адреси
Write-Host '5. Додавання другої адреси...' -ForegroundColor Yellow
$address2 = @{
    name = "Робота"
    street = "вул. Богдана Хмельницького"
    building = "25"
    apartment = "7"
    notes = "Офіс №7"
}
$addressResult2 = Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/users/addresses' -Method Post -Headers $headers -Body ($address2 | ConvertTo-Json) -ContentType 'application/json'
Write-Host '   ✅ Другу адресу додано. Всього адрес: ' $addressResult2.data.addresses.Length -ForegroundColor Green

# 6. Отримання списку адрес
Write-Host '6. Отримання списку адрес...' -ForegroundColor Yellow
$addresses = Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/users/addresses' -Method Get -Headers $headers
Write-Host '   ✅ Отримано адрес: ' $addresses.data.addresses.Length -ForegroundColor Green

# 7. Оновлення адреси
Write-Host '7. Оновлення адреси...' -ForegroundColor Yellow
$firstAddressId = $addresses.data.addresses[0].id
$updateAddress = @{
    name = "Головна адреса"
    notes = "Оновлені примітки"
}
$updatedAddress = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/users/addresses/$firstAddressId" -Method Put -Headers $headers -Body ($updateAddress | ConvertTo-Json) -ContentType 'application/json'
Write-Host '   ✅ Адресу оновлено' -ForegroundColor Green

# 8. Встановлення адреси за замовчуванням
Write-Host '8. Встановлення адреси за замовчуванням...' -ForegroundColor Yellow
$secondAddressId = $addresses.data.addresses[1].id
$defaultAddress = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/users/addresses/$secondAddressId/default" -Method Put -Headers $headers
Write-Host '   ✅ Адресу встановлено як типову' -ForegroundColor Green

# 9. Видалення адреси
Write-Host '9. Видалення адреси...' -ForegroundColor Yellow
$deleteResult = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/users/addresses/$firstAddressId" -Method Delete -Headers $headers
Write-Host '   ✅ Адресу видалено. Залишилось адрес: ' $deleteResult.data.addresses.Length -ForegroundColor Green

# 10. Фінальна перевірка профілю
Write-Host '10. Фінальна перевірка профілю...' -ForegroundColor Yellow
$finalProfile = Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/users/profile' -Method Get -Headers $headers
Write-Host '   ✅ Фінальний профіль: ' $finalProfile.data.user.firstName -ForegroundColor Green
Write-Host '   ✅ Адрес у профілі: ' $finalProfile.data.user.addresses.Length -ForegroundColor Green
Write-Host '   ✅ Налаштування: ' $finalProfile.data.user.preferences.theme -ForegroundColor Green

Write-Host '👤 Тестування профілів завершено успішно!' -ForegroundColor Cyan
