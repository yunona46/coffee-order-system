Write-Host '🛒 Тестування системи кошика...' -ForegroundColor Cyan

# 1. Реєстрація користувача
Write-Host '1. Реєстрація користувача...' -ForegroundColor Yellow
$user = @{
    firstName = "Тест"
    lastName = "Кошика"
    email = "cartuser$((Get-Date).ToString('HHmmss'))@example.com"
    password = "123456"
}
$reg = Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/auth/register' -Method Post -Body ($user | ConvertTo-Json) -ContentType 'application/json'
$token = $reg.data.accessToken
$headers = @{ Authorization = "Bearer $token" }
Write-Host '   ✅ Користувач зареєстрований' -ForegroundColor Green

# 2. Отримання порожнього кошика
Write-Host '2. Отримання кошика...' -ForegroundColor Yellow
$cart = Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/cart' -Method Get -Headers $headers
Write-Host '   ✅ Кошик отримано. Товарів: ' $cart.data.cart.totalItems -ForegroundColor Green

# 3. Додавання товару до кошика
Write-Host '3. Додавання товару до кошика...' -ForegroundColor Yellow
$itemToAdd = @{
    menuItemId = "item_2" # Латте
    quantity = 2
    size = "Середній"
    customizations = @(@{ name = "Овсяне молоко"; price = 10 })
    specialInstructions = "Без цукру, будь ласка"
}
$addResult = Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/cart/items' -Method Post -Headers $headers -Body ($itemToAdd | ConvertTo-Json) -ContentType 'application/json'
Write-Host '   ✅ Товар додано. Загальна сума: ' $addResult.data.cart.totalAmount 'грн' -ForegroundColor Green

# 4. Перевірка оновленого кошика
Write-Host '4. Перевірка оновленого кошика...' -ForegroundColor Yellow
$updatedCart = Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/cart' -Method Get -Headers $headers
Write-Host '   ✅ Товарів у кошику: ' $updatedCart.data.cart.totalItems -ForegroundColor Green
Write-Host '   ✅ Позицій: ' $updatedCart.data.cart.items.Length -ForegroundColor Green

# 5. Додавання ще одного товару
Write-Host '5. Додавання другого товару...' -ForegroundColor Yellow
$secondItem = @{
    menuItemId = "item_3" # Капучино
    quantity = 1
    size = "Великий"
}
$secondAdd = Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/cart/items' -Method Post -Headers $headers -Body ($secondItem | ConvertTo-Json) -ContentType 'application/json'
Write-Host '   ✅ Другий товар додано. Загальна сума: ' $secondAdd.data.cart.totalAmount 'грн' -ForegroundColor Green

# 6. Оновлення кількості товару
Write-Host '6. Оновлення кількості товару...' -ForegroundColor Yellow
$firstItemId = $updatedCart.data.cart.items[0].id
$updateData = @{ quantity = 3 }
$updateResult = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/cart/items/$firstItemId" -Method Put -Headers $headers -Body ($updateData | ConvertTo-Json) -ContentType 'application/json'
Write-Host '   ✅ Кількість оновлено. Нова сума: ' $updateResult.data.cart.totalAmount 'грн' -ForegroundColor Green

# 7. Видалення товару з кошика
Write-Host '7. Видалення товару з кошика...' -ForegroundColor Yellow
$itemToRemove = $secondAdd.data.cart.items[1].id
$removeResult = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/cart/items/$itemToRemove" -Method Delete -Headers $headers
Write-Host '   ✅ Товар видалено. Залишилось товарів: ' $removeResult.data.cart.totalItems -ForegroundColor Green

# 8. Очищення кошика
Write-Host '8. Очищення кошика...' -ForegroundColor Yellow
$clearResult = Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/cart' -Method Delete -Headers $headers
Write-Host '   ✅ Кошик очищено. Товарів: ' $clearResult.data.cart.totalItems -ForegroundColor Green

Write-Host '🛒 Тестування кошика завершено успішно!' -ForegroundColor Cyan
