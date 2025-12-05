import express from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { supabase } from '../config/supabase';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwt';
import logger from '../utils/logger';

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  message: 'Too many requests, please try again later',
});

// Signup endpoint
router.post(
  '/signup',
  authLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: errors.array()[0].msg,
        });
      }

      const { name, email, username, phone, password } = req.body;

      logger.info(`[Signup] Attempting signup for: ${email}`);

      // Check if email already exists
      const { data: existingEmail } = await supabase
        .from('students')
        .select('email')
        .eq('email', email.toLowerCase())
        .maybeSingle();

      if (existingEmail) {
        return res.status(409).json({
          success: false,
          error: 'Email already registered',
        });
      }

      // Check if username already exists
      const { data: existingUsername } = await supabase
        .from('students')
        .select('username')
        .eq('username', username.toLowerCase())
        .maybeSingle();

      if (existingUsername) {
        return res.status(409).json({
          success: false,
          error: 'Username already taken',
        });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create student record
      const { data: student, error: insertError } = await supabase
        .from('students')
        .insert([
          {
            name,
            email: email.toLowerCase(),
            username: username.toLowerCase(),
            phone,
            password_hash: passwordHash,
            email_verified: false,
            is_verified: false,
          },
        ])
        .select()
        .single();

      if (insertError) {
        logger.error('[Signup] Database error:', insertError);
        return res.status(500).json({
          success: false,
          error: 'Failed to create account',
        });
      }

      logger.info(`[Signup] User created successfully: ${student.email}`);

      // Generate tokens
      const accessToken = generateAccessToken(student.id, student.email);
      const refreshToken = generateRefreshToken(student.id, student.email);

      // Create session
      await supabase.from('sessions').insert([
        {
          user_id: student.id,
          refresh_token: refreshToken,
          user_agent: req.headers['user-agent'] || 'unknown',
          ip_address: req.ip || 'unknown',
        },
      ]);

      res.status(201).json({
        success: true,
        user: {
          id: student.id,
          email: student.email,
          username: student.username,
          name: student.name,
          phone: student.phone,
        },
        session: {
          access_token: accessToken,
          refresh_token: refreshToken,
        },
      });
    } catch (error: any) {
      logger.error('[Signup] Error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
);

// Login endpoint
router.post(
  '/login',
  authLimiter,
  [
    body('identifier').trim().notEmpty().withMessage('Email or username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: errors.array()[0].msg,
        });
      }

      const { identifier, password } = req.body;

      logger.info(`[Login] Attempting login for: ${identifier}`);

      // Check if identifier is email or username
      const isEmail = identifier.includes('@');
      const field = isEmail ? 'email' : 'username';

      // Find user
      const { data: student, error: findError } = await supabase
        .from('students')
        .select('*')
        .eq(field, identifier.toLowerCase())
        .maybeSingle();

      if (!student || findError) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, student.password_hash);

      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
        });
      }

      logger.info(`[Login] User authenticated: ${student.email}`);

      // Generate tokens
      const accessToken = generateAccessToken(student.id, student.email);
      const refreshToken = generateRefreshToken(student.id, student.email);

      // Create session
      await supabase.from('sessions').insert([
        {
          user_id: student.id,
          refresh_token: refreshToken,
          user_agent: req.headers['user-agent'] || 'unknown',
          ip_address: req.ip || 'unknown',
        },
      ]);

      res.json({
        success: true,
        user: {
          id: student.id,
          email: student.email,
          username: student.username,
          name: student.name,
          phone: student.phone,
        },
        session: {
          access_token: accessToken,
          refresh_token: refreshToken,
        },
      });
    } catch (error: any) {
      logger.error('[Login] Error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
);

// Refresh token endpoint
router.post('/refresh', async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token required',
      });
    }

    // Verify refresh token
    const payload = verifyToken(refresh_token);

    if (payload.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token type',
      });
    }

    // Check if session exists
    const { data: session } = await supabase
      .from('sessions')
      .select('*')
      .eq('refresh_token', refresh_token)
      .eq('user_id', payload.userId)
      .maybeSingle();

    if (!session) {
      return res.status(401).json({
        success: false,
        error: 'Invalid session',
      });
    }

    // Generate new access token
    const accessToken = generateAccessToken(payload.userId, payload.email);

    res.json({
      success: true,
      access_token: accessToken,
    });
  } catch (error: any) {
    logger.error('[Refresh] Error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid or expired refresh token',
    });
  }
});

// Logout endpoint
router.post('/logout', async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (refresh_token) {
      await supabase.from('sessions').delete().eq('refresh_token', refresh_token);
    }

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error: any) {
    logger.error('[Logout] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Reset password endpoint (after OTP verification)
router.post(
  '/reset-password',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: errors.array()[0].msg,
        });
      }

      const { email, password } = req.body;

      logger.info(`[Reset Password] Attempting password reset for: ${email}`);

      // Check if user exists
      const { data: student, error: findError } = await supabase
        .from('students')
        .select('id, email')
        .eq('email', email.toLowerCase())
        .maybeSingle();

      if (!student || findError) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      // Hash new password with bcrypt
      const passwordHash = await bcrypt.hash(password, 10);

      // Update password in database
      const { error: updateError } = await supabase
        .from('students')
        .update({ password_hash: passwordHash })
        .eq('email', email.toLowerCase());

      if (updateError) {
        logger.error('[Reset Password] Database error:', updateError);
        return res.status(500).json({
          success: false,
          error: 'Failed to reset password',
        });
      }

      logger.info(`[Reset Password] Password reset successful for: ${email}`);

      res.json({
        success: true,
        message: 'Password reset successfully',
      });
    } catch (error: any) {
      logger.error('[Reset Password] Error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
);

export default router;
