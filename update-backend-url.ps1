# Update Backend URL Script
# Usage: .\update-backend-url.ps1 "https://your-backend-url.onrender.com"

param(
    [Parameter(Mandatory=$true)]
    [string]$BackendUrl
)

Write-Host "Updating backend URL to: $BackendUrl" -ForegroundColor Cyan

# Update .env.production
$envContent = @"
# Production Environment Variables

# Backend API URL
VITE_API_URL=$BackendUrl

# Supabase Configuration
VITE_SUPABASE_URL=https://ftssqrpnqwwuuskphgnz.supabase.co/
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0c3NxcnBucXd3dXVza3BoZ256Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NDI3NzgsImV4cCI6MjA4MDUxODc3OH0.5IEakfRUWyVwpeWkYO5G7ZJwTg0z5kebgZr2IPVWFks

# EmailJS (Optional)
VITE_EMAILJS_SERVICE_ID=service_hh7zus2
VITE_EMAILJS_TEMPLATE_ID=template_ysktipo
VITE_EMAILJS_PUBLIC_KEY=VWXKirtutcv3zTtHo

# Razorpay (Public key only)
VITE_RAZORPAY_KEY_ID=rzp_live_Rlz1BRY2tHLFgm
"@

Set-Content -Path ".env.production" -Value $envContent
Write-Host "Updated .env.production" -ForegroundColor Green

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. npm run build" -ForegroundColor White
Write-Host "2. firebase deploy --only hosting" -ForegroundColor White
Write-Host ""
Write-Host "Your backend URL has been updated!" -ForegroundColor Green
Write-Host "After rebuilding and deploying, your app will be fully functional." -ForegroundColor Cyan
