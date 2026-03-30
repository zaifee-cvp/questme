# FieldService Pro - Windows Setup Script
# Run this in PowerShell from the project folder: .\setup.ps1

Write-Host "FieldService Pro - Setup" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan

# Check Node version
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Node.js not found. Install from https://nodejs.org (v18 or higher)" -ForegroundColor Red
    exit 1
}
Write-Host "Node.js: $nodeVersion" -ForegroundColor Green

# Install dependencies
Write-Host "`nInstalling dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) { Write-Host "npm install failed" -ForegroundColor Red; exit 1 }
Write-Host "Dependencies installed!" -ForegroundColor Green

# Check .env.local
if (-not (Test-Path ".env.local")) {
    Write-Host "`nERROR: .env.local not found!" -ForegroundColor Red
    exit 1
}

$envContent = Get-Content ".env.local" -Raw
if ($envContent -match "YOUR_PROJECT_ID") {
    Write-Host "`nWARNING: .env.local still has placeholder values!" -ForegroundColor Yellow
    Write-Host "Edit .env.local and replace:" -ForegroundColor Yellow
    Write-Host "  YOUR_PROJECT_ID    -> your Supabase project ID" -ForegroundColor White
    Write-Host "  YOUR_ANON_KEY_HERE -> your Supabase anon key" -ForegroundColor White
    Write-Host "  YOUR_SERVICE_ROLE_KEY_HERE -> your Supabase service role key" -ForegroundColor White
    Write-Host "  YOUR_RESEND_KEY_HERE -> your Resend API key" -ForegroundColor White
    Write-Host "`nFind these at: https://supabase.com/dashboard -> Settings -> API" -ForegroundColor Cyan
    Write-Host "Resend key at: https://resend.com/api-keys" -ForegroundColor Cyan
} else {
    Write-Host "`n.env.local configured!" -ForegroundColor Green
    Write-Host "Starting development server..." -ForegroundColor Yellow
    npm run dev
}
