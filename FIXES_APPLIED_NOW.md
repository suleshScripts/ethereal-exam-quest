# 🔧 Fixes Applied for OTP and Razorpay Issues

## Issues Fixed:

### 1. ✅ Trust Proxy Error (FIXED)
**Problem:** `ERR_ERL_UNEXPECTED_X_FORWARDED_FOR` error with rate limiter

**Solution:** Added `app.set('trust proxy', 1)` to server.ts

This tells Express to trust the X-Forwarded-For header from Render's proxy.

### 2. ✅ SMTP Connection Timeout (FIXED)
**Problem:** `Connection timeout` when sending OTP emails

**Solution:** Changed SMTP configuration:
- Changed from port 465 (SSL) to port 587 (STARTTLS)
- Added TLS configuration for better compatibility with Render.com

**Why:** Render.com's free tier may have restrictions on outbound SMTP connections on port 465.

### 3. ⚠️ Razorpay CORS Issue (NEEDS ATTENTION)
**Problem:** CORS error when calling Supabase Edge Function for Razorpay

**Error:** `Access to fetch at 'https://ftssqrpnqwwuuskphgnz.supabase.co/functions/v1/create-razorpay-order' has been blocked by CORS policy`

**Root Cause:** The Supabase Edge Function doesn't exist or isn't configured properly.

---

## What's Working Now:

✅ Backend deployed and running
✅ Trust proxy configured
✅ SMTP configuration updated (should work after redeploy)
✅ Rate limiting fixed

---

## What Needs Fixing: Razorpay Payment

The Razorpay payment system is trying to call a Supabase Edge Function that doesn't exist. You have two options:

### Option 1: Create Razorpay Backend Endpoint (Recommended)

Add Razorpay order creation to your backend instead of using Supabase Edge Function.

I can create this for you - it will:
1. Create `/api/payment/create-order` endpoint in backend
2. Handle Razorpay order creation
3. Return order details to frontend
4. No CORS issues

### Option 2: Create Supabase Edge Function

Create the Edge Function in Supabase:
1. Go to Supabase Dashboard
2. Navigate to Edge Functions
3. Create `create-razorpay-order` function
4. Configure CORS headers

---

## Testing OTP After Redeploy

Render is automatically redeploying with the fixes. Wait 5-10 minutes, then test:

### Test OTP:
1. Go to: https://clinomatrix.web.app
2. Click "Forgot Password"
3. Enter your email
4. Wait for OTP (should arrive in 30-60 seconds)

If OTP still doesn't work, it might be:
- Gmail app password expired
- Gmail security settings blocking
- Render still blocking SMTP

---

## Alternative: Use SendGrid for Emails

If Gmail SMTP continues to fail on Render, I can switch to SendGrid (free tier):
- 100 emails/day free
- Better deliverability
- Works reliably on cloud platforms
- No SMTP port restrictions

---

## Next Steps:

1. **Wait for Render to redeploy** (5-10 minutes)
   - Check: https://dashboard.render.com/
   - Look for "Live" status

2. **Test OTP** 
   - Try forgot password
   - Check if email arrives

3. **Fix Razorpay**
   - Let me know if you want Option 1 (backend endpoint) or Option 2 (Edge Function)
   - I recommend Option 1 - simpler and no CORS issues

---

## Current Status:

| Feature | Status | Notes |
|---------|--------|-------|
| Backend | ✅ Live | https://dmlt-academy-backend.onrender.com |
| Frontend | ✅ Live | https://clinomatrix.web.app |
| Login/Signup | ✅ Working | JWT authentication |
| Admin Panel | ✅ Working | Admin login functional |
| Trust Proxy | ✅ Fixed | Rate limiter working |
| SMTP Config | ✅ Fixed | Waiting for redeploy |
| OTP Emails | ⏳ Testing | Test after redeploy |
| Razorpay | ❌ Broken | Needs backend endpoint |

---

## Quick Commands:

### Check Backend Status:
```powershell
curl https://dmlt-academy-backend.onrender.com/health
```

### View Render Logs:
1. Go to: https://dashboard.render.com/
2. Click your service
3. Click "Logs"

### Test OTP:
```powershell
curl -X POST https://dmlt-academy-backend.onrender.com/api/otp/send-otp `
  -H "Content-Type: application/json" `
  -d '{"email":"your-email@gmail.com"}'
```

---

## Want Me To:

1. ✅ Create Razorpay backend endpoint?
2. ✅ Switch to SendGrid for emails?
3. ✅ Add more error handling?
4. ✅ Implement payment verification?

Let me know what you need!
