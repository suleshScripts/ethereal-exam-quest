# 🚀 Backend API Endpoints

Base URL: `https://dmlt-academy-backend.onrender.com`

---

## 📊 Health Check

### GET `/health`
Check if the server is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-12-06T10:30:00.000Z"
}
```

**Test it:**
```bash
curl https://dmlt-academy-backend.onrender.com/health
```

---

## 🔐 Authentication Routes (`/api/auth`)

### POST `/api/auth/signup`
Create a new user account.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "phone": "9876543210",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "username": "johndoe",
    "name": "John Doe",
    "phone": "9876543210"
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "jwt_refresh_token"
  }
}
```

**Rate Limit:** 10 requests per 15 minutes

---

### POST `/api/auth/login`
Login with email/username and password.

**Body:**
```json
{
  "identifier": "john@example.com",  // or username
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "username": "johndoe",
    "name": "John Doe",
    "phone": "9876543210"
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "jwt_refresh_token"
  }
}
```

**Rate Limit:** 10 requests per 15 minutes

---

### POST `/api/auth/refresh`
Refresh access token using refresh token.

**Body:**
```json
{
  "refresh_token": "jwt_refresh_token"
}
```

**Response:**
```json
{
  "success": true,
  "access_token": "new_jwt_token"
}
```

---

### POST `/api/auth/logout`
Logout and invalidate refresh token.

**Body:**
```json
{
  "refresh_token": "jwt_refresh_token"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### POST `/api/auth/reset-password`
Reset password after OTP verification.

**Body:**
```json
{
  "email": "john@example.com",
  "password": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

## 📧 OTP Routes (`/api/otp`)

### POST `/api/otp/send-otp`
Send OTP to email for password reset.

**Body:**
```json
{
  "email": "john@example.com",
  "name": "John Doe"  // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to your email via SMTP."
}
```

**Rate Limit:** 5 requests per 15 minutes
**Cooldown:** 30 seconds between requests per email

---

### POST `/api/otp/verify-otp`
Verify OTP code.

**Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully."
}
```

**Security:**
- OTP expires in 5 minutes
- Maximum 3 verification attempts
- OTP is hashed in storage
- One-time use only

---

## 👤 User Routes (`/api/user`)
**All routes require authentication** (Bearer token in Authorization header)

### GET `/api/user/profile`
Get current user profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "username": "johndoe",
    "name": "John Doe",
    "phone": "9876543210",
    "avatar_url": null,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### PUT `/api/user/profile`
Update user profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Body:**
```json
{
  "name": "John Updated",
  "phone": "9999999999",
  "username": "johnupdated"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "username": "johnupdated",
    "name": "John Updated",
    "phone": "9999999999"
  }
}
```

---

### GET `/api/user/plans`
Get all purchased plans for current user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "plans": [
    {
      "id": "uuid",
      "student_phone": "9876543210",
      "plan_id": "plan_uuid",
      "plan_name": "Premium Plan",
      "price_paid": 999,
      "exam_ids": ["exam1", "exam2"],
      "is_active": true,
      "expires_at": "2025-01-01T00:00:00.000Z",
      "purchased_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### GET `/api/user/plans/active`
Get only active plans (not expired).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "plans": [
    {
      "id": "uuid",
      "plan_name": "Premium Plan",
      "is_active": true,
      "expires_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### GET `/api/user/exam-history`
Get exam results history.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "id": "uuid",
      "student_phone": "9876543210",
      "exam_id": "exam_uuid",
      "score": 85,
      "total_questions": 100,
      "time_taken": 3600,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### GET `/api/user/exam-progress/:examId`
Get progress for a specific exam.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "progress": {
    "id": "uuid",
    "student_phone": "9876543210",
    "exam_id": "exam_uuid",
    "completed_questions": 50,
    "total_questions": 100,
    "last_question_id": "question_uuid",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 💳 Payment Routes (`/api/payment`)
**All routes require authentication** (Bearer token in Authorization header)

### POST `/api/payment/create-order`
Create a Razorpay order for payment.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Body:**
```json
{
  "amount": 999,
  "currency": "INR",
  "planId": "plan_uuid",
  "planName": "Premium Plan"
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "order_xxxxx",
    "amount": 99900,
    "currency": "INR",
    "receipt": "order_1234567890"
  },
  "key": "rzp_live_xxxxx"
}
```

---

### POST `/api/payment/verify-payment`
Verify Razorpay payment signature.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Body:**
```json
{
  "razorpay_order_id": "order_xxxxx",
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_signature": "signature_xxxxx"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "paymentId": "pay_xxxxx",
  "orderId": "order_xxxxx"
}
```

---

### GET `/api/payment/payment/:paymentId`
Get payment details from Razorpay.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "payment": {
    "id": "pay_xxxxx",
    "amount": 99900,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "email": "john@example.com",
    "contact": "9876543210",
    "createdAt": 1234567890
  }
}
```

---

## 🔒 Authentication

Most endpoints require a JWT access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

**Token Expiry:**
- Access Token: 15 minutes
- Refresh Token: 30 days

**How to get tokens:**
1. Login or Signup → Get `access_token` and `refresh_token`
2. Use `access_token` for API requests
3. When `access_token` expires, use `/api/auth/refresh` with `refresh_token`

---

## 📝 Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/expired token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate email/username)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error
- `503` - Service Unavailable (Razorpay not configured)

---

## 🧪 Testing APIs

### Using cURL

**Health Check:**
```bash
curl https://dmlt-academy-backend.onrender.com/health
```

**Login:**
```bash
curl -X POST https://dmlt-academy-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"john@example.com","password":"password123"}'
```

**Get Profile (with token):**
```bash
curl https://dmlt-academy-backend.onrender.com/api/user/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Using Postman

1. Import collection with base URL: `https://dmlt-academy-backend.onrender.com`
2. Set Authorization type to "Bearer Token"
3. Add token from login response

---

## 🚨 Important Notes

1. **Rate Limiting:**
   - Auth endpoints: 10 requests per 15 minutes
   - OTP endpoints: 5 requests per 15 minutes
   - OTP cooldown: 30 seconds between requests

2. **Security:**
   - All passwords are hashed with bcrypt
   - OTPs are hashed before storage
   - JWT tokens are signed and verified
   - HTTPS enforced in production
   - CORS configured for allowed origins

3. **Render Free Tier:**
   - Service sleeps after 15 minutes of inactivity
   - First request after sleep takes 30-60 seconds
   - This is normal behavior

4. **Payment System:**
   - Requires valid Razorpay keys in environment variables
   - Test mode: Use `rzp_test_` keys
   - Live mode: Use `rzp_live_` keys

---

## 📚 Quick Reference

| Endpoint | Method | Auth Required | Rate Limited |
|----------|--------|---------------|--------------|
| `/health` | GET | ❌ | ❌ |
| `/api/auth/signup` | POST | ❌ | ✅ |
| `/api/auth/login` | POST | ❌ | ✅ |
| `/api/auth/refresh` | POST | ❌ | ❌ |
| `/api/auth/logout` | POST | ❌ | ❌ |
| `/api/auth/reset-password` | POST | ❌ | ❌ |
| `/api/otp/send-otp` | POST | ❌ | ✅ |
| `/api/otp/verify-otp` | POST | ❌ | ❌ |
| `/api/user/profile` | GET | ✅ | ❌ |
| `/api/user/profile` | PUT | ✅ | ❌ |
| `/api/user/plans` | GET | ✅ | ❌ |
| `/api/user/plans/active` | GET | ✅ | ❌ |
| `/api/user/exam-history` | GET | ✅ | ❌ |
| `/api/user/exam-progress/:examId` | GET | ✅ | ❌ |
| `/api/payment/create-order` | POST | ✅ | ❌ |
| `/api/payment/verify-payment` | POST | ✅ | ❌ |
| `/api/payment/payment/:paymentId` | GET | ✅ | ❌ |

---

**Total Endpoints: 17** (1 health check + 16 API endpoints)
