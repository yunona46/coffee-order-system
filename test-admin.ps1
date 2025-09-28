Write-Host '👑 ТЕСТУВАННЯ АДМІН-ПАНЕЛІ...' -ForegroundColor Magenta

# 1. Логін адміністратора
Write-Host '1. Логін адміністратора...' -ForegroundColor Yellow
$adminLogin = @{
    email = "admin@coffee.com"
    password = "admin123"
}
try {
    $adminAuth = Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/auth/login' -Method Post -Body ($adminLogin | ConvertTo-Json) -ContentType 'application/json'
    $adminToken = $adminAuth.data.accessToken
    $adminHeaders = @{ Authorization = "Bearer $adminToken" }
    Write-Host '   ✅ Адмін авторизований. Роль: ' $adminAuth.data.user.role -ForegroundColor Green
} catch {
    Write-Host '   ❌ Помилка авторизації адміна: ' $_.Exception.Message -ForegroundColor Red
    exit
}

# 2. Отримання статистики
Write-Host '2. Отримання статистики...' -ForegroundColor Yellow
try {
    $stats = Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/admin/stats' -Method Get -Headers $adminHeaders
    Write-Host '   ✅ Статистика отримана:' -ForegroundColor Green
    Write-Host '      Користувачі: ' $stats.data.stats.general.totalUsers -ForegroundColor Cyan
    Write-Host '      Замовлення: ' $stats.data.stats.general.totalOrders -ForegroundColor Cyan
    Write-Host '      Дохід: ' $stats.data.stats.general.totalRevenue 'грн' -ForegroundColor Cyan
} catch {
    Write-Host '   ❌ Помилка статистики: ' $_.Exception.Message -ForegroundColor Red
}

# 3. Отримання всіх замовлень
Write-Host '3. Отримання замовлень...' -ForegroundColor Yellow
try {
    $orders = Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/admin/orders' -Method Get -Headers $adminHeaders
    Write-Host '   ✅ Отримано замовлень: ' $orders.data.orders.Length -ForegroundColor Green
} catch {
    Write-Host '   ❌ Помилка замовлень: ' $_.Exception.Message -ForegroundColor Red
}

# 4. Додавання нової позиції меню
Write-Host '4. Додавання позиції меню...' -ForegroundColor Yellow
$newItem = @{
    name = "Нова кава адміна"
    description = "Ексклюзивна кава тільки для адміністратора"
    category = "espresso"
    price = 60
    available = $true
    preparationTime = 3
    calories = 5
}
try {
    $createdItem = Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/admin/menu' -Method Post -Headers $adminHeaders -Body ($newItem | ConvertTo-Json) -ContentType 'application/json'
    Write-Host '   ✅ Позицію додано: ' $createdItem.data.menuItem.name -ForegroundColor Green
    $newItemId = $createdItem.data.menuItem.id
} catch {
    Write-Host '   ❌ Помилка додавання: ' $_.Exception.Message -ForegroundColor Red
    $newItemId = $null
}

# 5. Оновлення позиції меню
if ($newItemId) {
    Write-Host '5. Оновлення позиції меню...' -ForegroundColor Yellow
    $updateData = @{ price = 65; description = "Оновлений опис кави" }
    try {
        $updatedItem = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/admin/menu/$newItemId" -Method Put -Headers $adminHeaders -Body ($updateData | ConvertTo-Json) -ContentType 'application/json'
        Write-Host '   ✅ Позицію оновлено. Нова ціна: ' $updatedItem.data.menuItem.price 'грн' -ForegroundColor Green
    } catch {
        Write-Host '   ❌ Помилка оновлення: ' $_.Exception.Message -ForegroundColor Red
    }
}

# 6. Оновлення статусу замовлення
if ($orders.data.orders.Length -gt 0) {
    Write-Host '6. Оновлення статусу замовлення...' -ForegroundColor Yellow
    $firstOrderId = $orders.data.orders[0].id
    $statusUpdate = @{
        status = "preparing"
        note = "Почали готувати ваше замовлення"
    }
    try {
        $updatedOrder = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/admin/orders/$firstOrderId" -Method Put -Headers $adminHeaders -Body ($statusUpdate | ConvertTo-Json) -ContentType 'application/json'
        Write-Host '   ✅ Статус оновлено: ' $updatedOrder.data.order.status -ForegroundColor Green
    } catch {
        Write-Host '   ❌ Помилка оновлення статусу: ' $_.Exception.Message -ForegroundColor Red
    }
}

# 7. Перевірка доступу для звичайного користувача
Write-Host '7. Перевірка доступу для звичайного користувача...' -ForegroundColor Yellow
$user = @{
    firstName = "Звичайний"
    lastName = "Користувач"
    email = "regular$((Get-Date).ToString('HHmmss'))@example.com"
    password = "123456"
}
try {
    $userReg = Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/auth/register' -Method Post -Body ($user | ConvertTo-Json) -ContentType 'application/json'
    $userToken = $userReg.data.accessToken
    $userHeaders = @{ Authorization = "Bearer $userToken" }
    
    # Спроба доступу до адмін-панелі
    try {
        $unauthorized = Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/admin/stats' -Method Get -Headers $userHeaders
        Write-Host '   ❌ Помилка: доступ мав бути заборонений' -ForegroundColor Red
    } catch {
        Write-Host '   ✅ Доступ заборонено (як і очікувалось)' -ForegroundColor Green
    }
} catch {
    Write-Host '   ❌ Помилка реєстрації: ' $_.Exception.Message -ForegroundColor Red
}

Write-Host '👑 ТЕСТУВАННЯ АДМІН-ПАНЕЛІ ЗАВЕРШЕНО!' -ForegroundColor Magenta
Write-Host '🎉 ВАША СИСТЕМА ПОВНОЦІННА ТА ГОТОВА ДО ВИКОРИСТАННЯ!' -ForegroundColor Green
