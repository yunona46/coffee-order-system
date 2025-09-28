Write-Host '☕ Тестування розширеного меню...' -ForegroundColor Cyan

# 1. Отримання всього меню
Write-Host '1. Всі позиції меню:' -ForegroundColor Yellow
$allMenu = Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/menu' -Method Get
Write-Host '   ✅ Знайдено ' $allMenu.data.items.Length 'позицій з ' $allMenu.data.pagination.totalItems 'всього' -ForegroundColor Green

# 2. Фільтрація за категорією
Write-Host '2. Фільтр за категорією (latte):' -ForegroundColor Yellow
$latteMenu = Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/menu?category=latte' -Method Get
Write-Host '   ✅ Знайдено ' $latteMenu.data.items.Length 'позицій категорії latte' -ForegroundColor Green

# 3. Пагінація
Write-Host '3. Пагінація (сторінка 1, ліміт 3):' -ForegroundColor Yellow
$pagedMenu = Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/menu?page=1&limit=3' -Method Get
Write-Host '   ✅ Сторінка ' $pagedMenu.data.pagination.currentPage 'з ' $pagedMenu.data.pagination.totalPages -ForegroundColor Green
Write-Host '   ✅ На сторінці: ' $pagedMenu.data.items.Length 'позицій' -ForegroundColor Green

# 4. Сортування за ціною
Write-Host '4. Сортування за ціною (зростання):' -ForegroundColor Yellow
$sortedMenu = Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/menu?sortBy=price_asc&limit=5' -Method Get
Write-Host '   ✅ Відсортовано ' $sortedMenu.data.items.Length 'позицій' -ForegroundColor Green
if ($sortedMenu.data.items.Length -gt 1) {
    Write-Host '   ✅ Перша позиція: ' $sortedMenu.data.items[0].name ' - ' $sortedMenu.data.items[0].price 'грн' -ForegroundColor Green
}

# 5. Детальна інформація про позицію
Write-Host '5. Деталі позиції меню:' -ForegroundColor Yellow
$firstItemId = $allMenu.data.items[0].id
$itemDetails = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/menu/$firstItemId" -Method Get
Write-Host '   ✅ Деталі: ' $itemDetails.data.item.name -ForegroundColor Green
Write-Host '   ✅ Інгредієнти: ' ($itemDetails.data.item.ingredients -join ', ') -ForegroundColor Green

# 6. Фільтрація за ціною
Write-Host '6. Фільтр за ціною (40-60 грн):' -ForegroundColor Yellow
$priceMenu = Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/menu?minPrice=40&maxPrice=60' -Method Get
Write-Host '   ✅ Знайдено ' $priceMenu.data.items.Length 'позицій у діапазоні 40-60 грн' -ForegroundColor Green

# 7. Тільки доступні позиції
Write-Host '7. Тільки доступні позиції:' -ForegroundColor Yellow
$availableMenu = Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/menu?available=true' -Method Get
$unavailableMenu = Invoke-RestMethod -Uri 'http://localhost:3001/api/v1/menu?available=false' -Method Get
Write-Host '   ✅ Доступно: ' $availableMenu.data.items.Length 'позицій' -ForegroundColor Green
Write-Host '   ✅ Недоступно: ' $unavailableMenu.data.items.Length 'позицій' -ForegroundColor Yellow

Write-Host '☕ Тестування меню завершено!' -ForegroundColor Cyan
