# Script para Verificar Versión del Repositorio
# Landing Page - Job Platform

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  VERIFICACIÓN DE VERSIÓN - LANDING   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Repositorio
Write-Host "📦 REPOSITORIO:" -ForegroundColor Yellow
git remote -v
Write-Host ""

# Branch actual
Write-Host "🌿 BRANCH ACTUAL:" -ForegroundColor Yellow
$branch = git branch --show-current
Write-Host "Branch: $branch" -ForegroundColor Green
Write-Host ""

# Último commit local
Write-Host "📝 ÚLTIMO COMMIT LOCAL:" -ForegroundColor Yellow
git log -1 --format="SHA: %H%nAutor: %an%nFecha: %ad%nMensaje: %s" --date=format:"%Y-%m-%d %H:%M:%S"
Write-Host ""

# Estado del repositorio
Write-Host "📊 ESTADO DEL REPOSITORIO:" -ForegroundColor Yellow
git status --short
Write-Host ""

# Verificar si hay commits sin push
Write-Host "🔄 COMMITS SIN PUSH:" -ForegroundColor Yellow
try {
    git fetch origin 2>&1 | Out-Null
    $unpushed = git log origin/$branch..HEAD --oneline
    if ($unpushed) {
        Write-Host "⚠️  Hay commits locales sin push:" -ForegroundColor Red
        $unpushed
    } else {
        Write-Host "✅ Todo sincronizado con remoto" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  No se pudo verificar remoto" -ForegroundColor Yellow
}
Write-Host ""

# Verificar si hay cambios remotos sin pull
Write-Host "⬇️  CAMBIOS REMOTOS SIN PULL:" -ForegroundColor Yellow
try {
    $unpulled = git log HEAD..origin/$branch --oneline
    if ($unpulled) {
        Write-Host "⚠️  Hay cambios remotos que no tienes:" -ForegroundColor Red
        $unpulled
    } else {
        Write-Host "✅ Estás actualizado con remoto" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  No se pudo verificar remoto" -ForegroundColor Yellow
}
Write-Host ""

# URL del repositorio para verificar en GitHub
Write-Host "🔗 VERIFICAR EN GITHUB:" -ForegroundColor Yellow
$remoteUrl = (git remote get-url origin)
$githubUrl = $remoteUrl -replace '\.git$', '' -replace 'git@github\.com:', 'https://github.com/' -replace 'https://github\.com/', 'https://github.com/'
Write-Host "GitHub: $githubUrl" -ForegroundColor Cyan
Write-Host "Último commit: $githubUrl/commit/$(git rev-parse HEAD)" -ForegroundColor Cyan
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  VERIFICACIÓN COMPLETADA              " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

