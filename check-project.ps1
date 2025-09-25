# Проста перевірка проєкту
Write-Host "=== ПЕРЕВІРКА COFFEE ORDER SYSTEM ===" -ForegroundColor Cyan

# 1. Git статус
Write-Host "`n1. Git статус:" -ForegroundColor Yellow
git status

# 2. Гілки
Write-Host "`n2. Список гілок:" -ForegroundColor Yellow
git branch -a

# 3. Структура проєкту
Write-Host "`n3. Структура проєкту:" -ForegroundColor Yellow
Write-Host "Коренева папка:" -ForegroundColor Gray
Get-ChildItem -Depth 1 | Select-Object Name, Mode

# 4. Перевірка ключових папок
Write-Host "`n4. Перевірка папок:" -ForegroundColor Yellow
$folders = @("frontend", "backend", "frontend/src", "backend/routes")
foreach ($folder in $folders) {
    if (Test-Path $folder) {
        Write-Host "✅ $folder" -ForegroundColor Green
    } else {
        Write-Host "❌ $folder" -ForegroundColor Red
    }
}

Write-Host "`n=== ПЕРЕВІРКА ЗАВЕРШЕНА ===" -ForegroundColor Cyan
