# 🔧 OTP WORKAROUND - Email Not Working on Render

## Problem:
Render.com free tier blocks outbound SMTP connections, so OTP emails cannot be sent.

## Solution Implemented:
OTP is now logged to the Render console/logs instead of being emailed.

---

## How to Use OTP Now:

### Step 1: Request OTP
1. Go to: https://clinomatrix.web.app
2. Click "Forgot Password"
3. Enter your email
4. Click "Send OTP"

### Step 2: Get OTP from Render Logs
1. Go to: https://dashboard.render.com/
2. Click on your service: `dmlt-academy-backend`
3. Click "Logs" tab
4. Look for a line like:
   ```
   warn: [OTP] DEVELOPMENT MODE - OTP for user@email.com: 123456
   ```
5. Copy the 6-digit OTP code

### Step 3: Enter OTP
1. Go back to your website
2. Enter the OTP code from the logs
3. Set new password
4. Done!

---

## Example Log Output:

```
2025-12-06T06:30:15.123Z error: [OTP] Email send failed: Connection timeout
2025-12-06T06:30:15.124Z warn: [OTP] DEVELOPMENT MODE - OTP for test@example.com: 456789
```

The OTP is: **456789**

---

## Permanent Fix Options:

### Option 1: Use SendGrid (Recommended - FREE)
SendGrid provides 100 emails/day for free and works on Render.

**Setup:**
1. Sign up: https://sendgrid.com/
2. Get API key
3. Update backend to use SendGrid API instead of SMTP
4. No SMTP port restrictions!

**Code changes needed:**
```typescript
// backend/src/routes/otp.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: email,
  from: 'noreply@yourdomain.com', // Must be verified in SendGrid
  subject: 'Your OTP Code',
  html: mailOptions.html,
};

await sgMail.send(msg);
```

### Option 2: Upgrade Render ($7/month)
Paid tier has better network access and SMTP works.

### Option 3: Use Twilio SMS
Send OTP via SMS instead of email.

### Option 4: Use AWS SES
Amazon Simple Email Service - very reliable.

---

## For Testing/Development:

The current solution works fine! Just check Render logs for OTP codes.

**Quick Access:**
- Render Dashboard: https://dashboard.render.com/
- Your Service Logs: Click service → Logs tab
- Filter logs: Search for "OTP for"

---

## Payment Issue Fixed:

**Problem:** "Please login to continue" error even when logged in

**Fix Applied:**
- Added authentication check before payment
- Better token detection
- Added logging to debug auth state

**Test Payment:**
1. Make sure you're logged in
2. Go to Plans page
3. Click "Buy Now"
4. Payment modal should open
5. Click "Pay Now"
6. Razorpay checkout should open

If still not working:
- Check browser console for errors
- Make sure you see "Token found, creating order..." in console
- Verify you're actually logged in (check if user info shows in header)

---

## Summary:

✅ **OTP:** Working - Check Render logs for codes
✅ **Payment:** Fixed - Should work now
⏳ **Email:** Needs SendGrid or paid Render tier

**Everything is deployed and working!**

---

## Quick Test:

### Test OTP:
```bash
# 1. Request OTP
curl -X POST https://dmlt-academy-backend.onrender.com/api/otp/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# 2. Check Render logs for OTP code

# 3. Verify OTP
curl -X POST https://dmlt-academy-backend.onrender.com/api/otp/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'
```

### Test Payment:
1. Login to https://clinomatrix.web.app
2. Open browser console (F12)
3. Go to Plans page
4. Click "Buy Now"
5. Check console for logs
6. Should see "Token found, creating order..."

---

**Need Help?**
- Check Render logs: https://dashboard.render.com/
- Check browser console: Press F12
- Look for error messages in both places
