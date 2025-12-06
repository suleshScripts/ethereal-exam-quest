# 🚨 URGENT: Update Render Environment Variables

## The Problem
The 500 error is happening because **Render dashboard still has the old placeholder Razorpay secret**.

`render.yaml` doesn't automatically update environment variables - you must manually update them in the Render dashboard.

---

## Fix It Now (2 minutes)

### Step 1: Go to Render Dashboard
1. Open: https://dashboard.render.com/
2. Click on: **dmlt-academy-backend**
3. Click: **Environment** tab (left sidebar)

### Step 2: Update RAZORPAY_KEY_SECRET
1. Find the row: `RAZORPAY_KEY_SECRET`
2. Click the **Edit** button (pencil icon)
3. **Delete** the old value: `your_razorpay_secret_here`
4. **Paste** the new value: `axNRQm0pmgH90D8mHnIvyRHZ`
5. Click **Save**

### Step 3: Verify RAZORPAY_KEY_ID
1. Find the row: `RAZORPAY_KEY_ID`
2. Make sure it says: `rzp_live_Rlz1BRY2tHLFgm`
3. If different, click **Edit** and update it

### Step 4: Save and Deploy
1. Click **Save Changes** button at the bottom
2. Render will show "Deploying..."
3. **Wait 2-3 minutes** for deployment to complete
4. Watch the **Logs** tab to see progress

---

## How to Verify It's Fixed

### Check Render Logs
1. Go to **Logs** tab in Render dashboard
2. Look for: `✅ Razorpay initialized`
3. Should NOT see: `⚠️ Razorpay keys not configured`

### Test Payment
1. Go to: https://clinomatrix.web.app
2. Login
3. Try to purchase a plan
4. Should NOT get 500 error
5. Razorpay checkout should open

---

## Why This Happened

**render.yaml is NOT used for environment variables by default.**

Render uses render.yaml for:
- ✅ Service configuration (name, region, build commands)
- ❌ Environment variables (must be set in dashboard)

To use render.yaml for env vars, you need to:
1. Delete all env vars from dashboard
2. Redeploy from GitHub

But it's easier to just update them manually in the dashboard.

---

## Quick Checklist

- [ ] Opened Render dashboard
- [ ] Clicked on dmlt-academy-backend
- [ ] Went to Environment tab
- [ ] Updated RAZORPAY_KEY_SECRET to: `axNRQm0pmgH90D8mHnIvyRHZ`
- [ ] Verified RAZORPAY_KEY_ID is: `rzp_live_Rlz1BRY2tHLFgm`
- [ ] Clicked Save Changes
- [ ] Waited for deployment (2-3 min)
- [ ] Tested payment - no 500 error!

---

## Still Getting 500 Error?

If you still get 500 error after updating:

1. **Check Render Logs** for the actual error message
2. **Verify keys are correct** (no extra spaces)
3. **Check Razorpay dashboard** - make sure keys are active
4. **Try regenerating keys** in Razorpay dashboard

---

**Go update it now! Takes 2 minutes! 🚀**
