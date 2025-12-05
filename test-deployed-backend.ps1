# Test Deployed Backend Script
# Usage: .\test-deployed-backend.ps1 "https://your-backend-url.onrender.com"

param(
    [Parameter(Mandatory=$true)]
    [string]$BackendUrl
)

Write-Host "🧪 Testing Backend: $BackendUrl" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "1️⃣ Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$BackendUrl/health" -Method Get
    Write-Host "✅ Health check passed: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health check failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: OTP Send
Write-Host "2️⃣ Testing OTP Send..." -ForegroundColor Yellow
$testEmail = "test@example.com"
$otpBody = @{
    email = $testEmail
} | ConvertTo-Json

try {
    $otp = Invoke-RestMethod -Uri "$BackendUrl/api/otp/send-otp" -Method Post -Body $otpBody -ContentType "application/json"
    Write-Host "✅ OTP endpoint working: $($otp.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ OTP send failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Signup Endpoint
Write-Host "3️⃣ Testing Signup Endpoint..." -ForegroundColor Yellow
$signupBody = @{
    email = "testuser@example.com"
    password = "TestPassword123"
    username = "testuser"
    name = "Test User"
} | ConvertTo-Json

try {
    $signup = Invoke-RestMethod -Uri "$BackendUrl/api/auth/signup" -Method Post -Body $signupBody -ContentType "application/json"
    Write-Host "✅ Signup endpoint working" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "✅ Signup endpoint working (user already exists)" -ForegroundColor Green
    } else {
        Write-Host "❌ Signup failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host ""

# Summary
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📊 Test Summary" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend URL: $BackendUrl" -ForegroundColor White
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Update .env.production with this backend URL" -ForegroundColor White
Write-Host "2. Run: npm run build" -ForegroundColor White
Write-Host "3. Run: firebase deploy --only hosting" -ForegroundColor White
Write-Host "4. Test your live site: https://clinomatrix.web.app" -ForegroundColor White
Write-Host ""
Write-Host "Admin Login:" -ForegroundColor Yellow
Write-Host "URL: https://clinomatrix.web.app/admin/login" -ForegroundColor White
Write-Host "Email: suleshw143@gmail.com" -ForegroundColor White
Write-Host "Password: sulesh123456" -ForegroundColor White
