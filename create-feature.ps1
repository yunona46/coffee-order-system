param(
    [string]$FeatureName = "new-feature"
)

Write-Host "Створення нової feature гілки..." -ForegroundColor Cyan

# Перевіряємо поточний стан
Write-Host "Поточна гілка: $(git branch --show-current)" -ForegroundColor Yellow

# Переходимо на dev
try {
    git checkout dev
    git pull origin dev
    Write-Host "Dev гілка оновлена" -ForegroundColor Green
} catch {
    Write-Host "Помилка оновлення dev гілки" -ForegroundColor Red
}

# Створюємо нову гілку
$branchName = "feature/$FeatureName"
git checkout -b $branchName
Write-Host "Створено гілку: $branchName" -ForegroundColor Green
Write-Host "Готово до розробки! 🚀" -ForegroundColor Cyan
