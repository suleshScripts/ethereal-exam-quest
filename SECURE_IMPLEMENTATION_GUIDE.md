# 🔐 SECURE IMPLEMENTATION GUIDE

This guide provides step-by-step instructions to fix all critical and high-severity vulnerabilities.

---

## STEP 1: SECURE YOUR SECRETS (CRITICAL - DO FIRST)

### 1.1 Update .gitignore

```gitignore
# Add to .gitignore
.env
.env.local
.env.development
.env.production
.env.test
backend/.env
backend/.env.local
backend/.env.production
render.yaml
*.key
*.pem
```

### 1.2 Remove Secrets from Git History

```bash
# Install BFG Repo Cleaner
# Download from: https://rtyley.github.io/bfg-repo-cleaner/

# Remove sensitive files
bfg --delete-files backend/.env
bfg --delete-files render.yaml
bfg --delete-files .env.production

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push (WARNING: Coordinate with team)
git push origin --force --all
```

### 1.3 Generate New Secrets

```bash
# Generate JWT Secret (256-bit)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Output example: a1b2c3d4e5f6...
```

### 1.4 Update Render Environment Variables

1. Go to: https://dashboard.render.com/
2. Select your service
3. Go to "Environment" tab
4. Update these variables with NEW values:
   - `JWT_SECRET` - Use generated value above
   - `SUPABASE_SERVICE_ROLE_KEY` - Regenerate in Supabase
   - `EMAIL_PASS` - Regenerate Gmail app password
   - `RAZORPAY_KEY_SECRET` - Get from Razorpay dashboard

---

## STEP 2: IMPLEMENT SECURE AUTHENTICATION

### 2.1 Create Secure JWT Utility

```typescript
// backend/src/utils/jwt.ts
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m';
const REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '30d';

// Validate JWT secret on startup
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters. Generate with: openssl rand -hex 32');
}

export interface TokenPayload {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

export function generateAccessToken(userId: string, email: string): string {
  return jwt.sign(
    { userId, email, type: 'access' },
    JWT_SECRET,
    { 
      expiresIn: ACCESS_EXPIRY,
      issuer: 'dmlt-academy',
      audience: 'dmlt-academy-users',
    }
  );
}

export function generateRefreshToken(userId: string, email: string): string {
  return jwt.sign(
    { userId, email, type: 'refresh' },
    JWT_SECRET,
    { 
      expiresIn: REFRESH_EXPIRY,
      issuer: 'dmlt-academy',
      audience: 'dmlt-academy-users',
    }
  );
}

export function verifyToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'dmlt-academy',
      audience: 'dmlt-academy-users',
    }) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

// Generate secure session ID
export function generateSessionId(): string {
  return crypto.randomBytes(32).toString('hex');
}
```

### 2.2 Use HttpOnly Cookies

```typescript
// backend/src/routes/auth.ts
import cookieParser from 'cookie-parser';

// Add to server.ts
app.use(cookieParser());

// In login/signup routes
router.post('/login', async (req, res) => {
  // ... authentication logic ...

  const accessToken = generateAccessToken(student.id, student.email);
  const refreshToken = generateRefreshToken(student.id, student.email);

  // Set httpOnly cookies
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 minutes
    path: '/',
  });

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: '/',
  });

  // Don't send tokens in response body
  res.json({
    success: true,
    user: {
      id: student.id,
      email: student.email,
      username: student.username,
      name: student.name,
    },
  });
});
```

### 2.3 Update Auth Middleware

```typescript
// backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import logger from '../utils/logger';

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  try {
    // Try cookie first
    let token = req.cookies?.access_token;
    
    // Fallback to Authorization header (for API clients)
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'No token provided',
      });
      return;
    }

    const payload = verifyToken(token);

    if (payload.type !== 'access') {
      res.status(401).json({
        success: false,
        error: 'Invalid token type',
      });
      return;
    }

    req.user = {
      userId: payload.userId,
      email: payload.email,
    };

    next();
  } catch (error: any) {
    logger.error('[Auth Middleware] Error:', error.message);
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }
}
```

---

## STEP 3: IMPLEMENT PAYMENT SECURITY

### 3.1 Verify Payment Signature

```typescript
// backend/src/routes/payment.ts
router.post('/verify-payment', authenticate, async (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // Validate inputs
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing payment verification parameters',
      });
    }

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      logger.warn(`[Payment] Invalid signature for ${razorpay_payment_id}`);
      return res.status(400).json({
        success: false,
        error: 'Invalid payment signature',
      });
    }

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    // Verify payment status
    if (payment.status !== 'captured' && payment.status !== 'authorized') {
      return res.status(400).json({
        success: false,
        error: 'Payment not successful',
      });
    }

    // Verify amount matches order
    const order = await razorpay.orders.fetch(razorpay_order_id);
    if (payment.amount !== order.amount) {
      logger.error(`[Payment] Amount mismatch: ${payment.amount} vs ${order.amount}`);
      return res.status(400).json({
        success: false,
        error: 'Payment amount mismatch',
      });
    }

    logger.info(`[Payment] Verified: ${razorpay_payment_id} for user ${req.user?.email}`);

    res.json({
      success: true,
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      amount: payment.amount,
      status: payment.status,
    });
  } catch (error: any) {
    logger.error('[Payment] Verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Payment verification failed',
    });
  }
});
```

### 3.2 Update Frontend Payment Flow

```typescript
// src/components/payment/PaymentModal.tsx
handler: async function (response: any) {
  try {
    logger.info('Payment response received');

    // 1. VERIFY payment on backend FIRST
    const token = localStorage.getItem('access_token');
    const verifyResponse = await fetch(
      `${import.meta.env.VITE_API_URL}/api/payment/verify-payment`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include', // Send cookies
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        }),
      }
    );

    if (!verifyResponse.ok) {
      throw new Error('Payment verification failed');
    }

    const verifyResult = await verifyResponse.json();

    if (!verifyResult.success) {
      throw new Error(verifyResult.error || 'Payment verification failed');
    }

    // 2. ONLY AFTER verification, save to database
    await supabaseService.savePlanPurchase({
      student_phone: auth.user?.phone || '',
      student_name: auth.user?.name || '',
      plan_id: plan.id,
      plan_name: plan.name,
      price_paid: verifyResult.amount / 100, // Convert from paise
      payment_id: verifyResult.paymentId,
      order_id: verifyResult.orderId,
      payment_status: verifyResult.status,
      verified: true,
      verified_at: new Date().toISOString(),
    });

    toast({
      title: "Payment Successful! 🎉",
      description: `You have successfully purchased the ${plan.name}.`,
    });

    onSuccess();
    onClose();
  } catch (err: any) {
    logger.error('Payment verification failed:', err);
    toast({
      title: "Payment Verification Failed",
      description: err.message || "Please contact support.",
      variant: "destructive",
    });
  }
}
```

---

## STEP 4: IMPLEMENT INPUT SANITIZATION

### 4.1 Create Sanitization Utility

```typescript
// backend/src/utils/sanitize.ts
import validator from 'validator';
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeString(input: string): string {
  if (!input) return '';
  
  // Remove HTML tags
  let clean = DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
  
  // Trim whitespace
  clean = clean.trim();
  
  // Escape special characters
  clean = validator.escape(clean);
  
  return clean;
}

export function sanitizeEmail(email: string): string {
  if (!validator.isEmail(email)) {
    throw new Error('Invalid email format');
  }
  return validator.normalizeEmail(email) || email.toLowerCase();
}

export function sanitizePhone(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length < 10 || cleaned.length > 15) {
    throw new Error('Invalid phone number');
  }
  
  return cleaned;
}

export function sanitizeUsername(username: string): string {
  const clean = username.toLowerCase().trim();
  
  // Only allow alphanumeric and underscore
  if (!/^[a-z0-9_]{3,20}$/.test(clean)) {
    throw new Error('Username must be 3-20 characters (letters, numbers, underscore only)');
  }
  
  return clean;
}
```

### 4.2 Apply Sanitization in Routes

```typescript
// backend/src/routes/auth.ts
import { sanitizeString, sanitizeEmail, sanitizePhone, sanitizeUsername } from '../utils/sanitize';

router.post('/signup', async (req, res) => {
  try {
    // Sanitize all inputs
    const name = sanitizeString(req.body.name);
    const email = sanitizeEmail(req.body.email);
    const username = sanitizeUsername(req.body.username);
    const phone = sanitizePhone(req.body.phone);
    const password = req.body.password; // Don't sanitize password

    // Validate password strength
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) {
      throw new Error('Password must contain uppercase, lowercase, number, and special character');
    }

    // ... rest of signup logic ...
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});
```

---

## STEP 5: IMPLEMENT CSRF PROTECTION

### 5.1 Add CSRF Middleware

```typescript
// backend/src/server.ts
import csrf from 'csurf';
import cookieParser from 'cookie-parser';

app.use(cookieParser());

// CSRF protection
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  },
});

// CSRF token endpoint
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Apply to state-changing routes
app.use('/api/auth', csrfProtection);
app.use('/api/payment', csrfProtection);
app.use('/api/user', csrfProtection);
```

### 5.2 Update Frontend to Use CSRF

```typescript
// src/lib/apiService.ts
let csrfToken: string | null = null;

// Fetch CSRF token on app load
export async function initCSRF() {
  try {
    const response = await fetch(`${API_URL}/api/csrf-token`, {
      credentials: 'include',
    });
    const data = await response.json();
    csrfToken = data.csrfToken;
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
  }
}

// Include CSRF token in requests
export async function apiRequest(url: string, options: RequestInit = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (csrfToken && ['POST', 'PUT', 'DELETE'].includes(options.method || '')) {
    headers['X-CSRF-Token'] = csrfToken;
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });
}
```

---

## STEP 6: FIX CORS CONFIGURATION

```typescript
// backend/src/server.ts
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

app.use(cors({
  origin: (origin, callback) => {
    // In production, require origin
    if (!origin && process.env.NODE_ENV === 'production') {
      callback(new Error('Origin required in production'));
      return;
    }

    // Allow if no origin (same-origin) or in allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`[CORS] Blocked request from: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  exposedHeaders: ['X-CSRF-Token'],
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));
```

---

## STEP 7: ADD COMPREHENSIVE RATE LIMITING

```typescript
// backend/src/middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Strict limiter for sensitive operations
export const strictLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:strict:',
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Moderate limiter for general API
export const moderateLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:moderate:',
  }),
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests',
});

// Apply to routes
router.post('/login', strictLimiter, ...);
router.post('/signup', strictLimiter, ...);
router.post('/create-order', strictLimiter, ...);
router.get('/profile', moderateLimiter, ...);
```

---

## STEP 8: IMPLEMENT DUAL SUPABASE CLIENTS

```typescript
// backend/src/config/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Admin client - bypasses RLS (use sparingly!)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// User client - enforces RLS (use for all user operations)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Helper to get user-scoped client
export function getUserClient(userId: string) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        'X-User-Id': userId,
      },
    },
  });
}
```

---

## DEPLOYMENT CHECKLIST

```markdown
### Before Deployment
- [ ] All secrets removed from Git
- [ ] New secrets generated
- [ ] .gitignore updated
- [ ] Environment variables set in Render
- [ ] Dependencies updated (`npm audit fix`)

### After Deployment
- [ ] Test authentication flow
- [ ] Test payment flow with test mode
- [ ] Verify CSRF protection works
- [ ] Check rate limiting
- [ ] Monitor logs for errors
- [ ] Run security scan

### Ongoing
- [ ] Weekly dependency updates
- [ ] Monthly security audits
- [ ] Monitor failed login attempts
- [ ] Review payment logs
- [ ] Check for unusual API usage
```

---

**END OF SECURE IMPLEMENTATION GUIDE**
