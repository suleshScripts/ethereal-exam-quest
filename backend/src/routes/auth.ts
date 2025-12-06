import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import { supabase } from '../config/supabase';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwt';
import logger from '../utils/logger';

const router = express.Router();

// In-memory verification store (shared with verification routes)
export const verificationStore: Record<string, {
  code_hash: string;
  expiresAt: number;
  used: boolean;
  attempts: number;
  createdAt: number;
}> = {};

// Create transporter for Gmail
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  message: 'Too many requests, please try again later',
});

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendVerificationEmail(email: string, name: string, code: string): Promise<boolean> {
  const mailOptions = {
    from: `"DMLT Academy" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your Verification Code - DMLT Academy',
    html: `
    <div style="margin:0;padding:0;background:#f4f5f7;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" 
        style="background:#f4f5f7;padding:40px 0;font-family:Arial,Helvetica,sans-serif;">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" 
              style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
              
              <tr>
                <td style="padding:0;margin:0;">
                  <div style="
                    background:url('https://i.ibb.co/yBXrWc3H/final-hero-bg.jpg');
                    background-size:cover;
                    background-position:center;
                    padding:40px 20px;
                    text-align:center;
                    color:white;">
                    
                    <img 
                      src="https://i.ibb.co/W4jLJpcz/dmlt-logo.jpg" 
                      alt="DMLT Academy" 
                      style="width:180px;margin-bottom:20px;border-radius:6px;"
                    />

                    <h1 style="margin:0;font-size:26px;letter-spacing:0.5px;font-weight:700;color:#063056;">
                      Verification Code
                    </h1>

                    <p style="margin-top:10px;font-size:15px;color:#063056;">
                      Welcome to DMLT Academy!
                    </p>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:30px 40px;color:#333333;">
                  <p style="font-size:16px;margin:0 0 20px 0;">
                    Hi <strong>${name}</strong>,
                  </p>

                  <p style="font-size:15px;line-height:1.6;margin:0 0 25px;">
                    Thank you for signing up! Your verification code for <strong>DMLT Academy</strong> is:
                  </p>

                  <div style="
                    background:#f1f5f9;
                    border:1px solid #dbe3eb;
                    border-radius:8px;
                    padding:18px;
                    text-align:center;
                    font-size:32px;
                    font-weight:700;
                    letter-spacing:4px;
                    color:#111827;">
                    ${code}
                  </div>

                  <p style="font-size:15px;line-height:1.6;margin:25px 0 20px;">
                    This code will expire in <strong>10 minutes</strong>.
                  </p>

                  <p style="font-size:14px;color:#6b7280;line-height:1.6;margin-bottom:30px;">
                    If you didn't request this code, simply ignore this email.
                  </p>

                  <p style="font-size:15px;margin:0;">
                    Best regards,<br/>
                    <strong>DMLT Academy Team</strong>
                  </p>
                </td>
              </tr>

              <tr>
                <td style="background:#f8fafc;padding:18px;text-align:center;color:#94a3b8;font-size:12px;">
                  © ${new Date().getFullYear()} DMLT Academy. All rights reserved.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>`,
  };

  try {
    await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Email send timeout')), 15000)
      )
    ]);
    logger.info(`[Verification] Sent code to ${email}`);
    return true;
  } catch (emailError: any) {
    logger.error('[Verification] Email failed:', emailError.message);
    logger.warn(`[Verification] Code for ${email}: ${code}`);
    return false;
  }
}

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

      // Check if phone already exists
      const { data: existingPhone } = await supabase
        .from('students')
        .select('phone')
        .eq('phone', phone)
        .maybeSingle();

      if (existingPhone) {
        return res.status(409).json({
          success: false,
          error: 'Phone number already registered',
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
        
        // Handle specific database errors
        if (insertError.code === '23505') {
          // Unique constraint violation
          if (insertError.message.includes('phone')) {
            return res.status(409).json({
              success: false,
              error: 'Phone number already registered',
            });
          }
          if (insertError.message.includes('email')) {
            return res.status(409).json({
              success: false,
              error: 'Email already registered',
            });
          }
          if (insertError.message.includes('username')) {
            return res.status(409).json({
              success: false,
              error: 'Username already taken',
            });
          }
        }
        
        return res.status(500).json({
          success: false,
          error: 'Failed to create account. Please try again.',
        });
      }

      logger.info(`[Signup] User created successfully: ${student.email}`);

      // Generate verification code
      const verificationCode = generateVerificationCode();
      const code_hash = await bcrypt.hash(verificationCode, 10);

      // Store verification code
      verificationStore[email.toLowerCase()] = {
        code_hash,
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
        used: false,
        attempts: 0,
        createdAt: Date.now(),
      };

      // Send verification email (don't block signup if email fails)
      sendVerificationEmail(email.toLowerCase(), name, verificationCode).catch(err => {
        logger.error('[Signup] Failed to send verification email:', err);
      });

      // Generate new session ID
      const sessionId = crypto.randomUUID();

      // Generate tokens with session ID
      const accessToken = generateAccessToken(student.id, student.email, sessionId);
      const refreshToken = generateRefreshToken(student.id, student.email, sessionId);

      // Create session
      const { error: sessionError } = await supabase.from('sessions').insert([
        {
          user_id: student.id,
          session_id: sessionId,
          refresh_token: refreshToken,
          user_agent: req.headers['user-agent'] || 'unknown',
          ip_address: req.ip || 'unknown',
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        },
      ]);

      if (sessionError) {
        logger.error(`[Signup] Failed to create session: ${sessionError.message}`);
        return res.status(500).json({
          success: false,
          error: 'Failed to create session',
        });
      }

      logger.info(`[Signup] Verification email sent to ${email}`);

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

      // SINGLE-SESSION LOGIC: Delete all existing sessions for this user
      const { error: deleteError } = await supabase
        .from('sessions')
        .delete()
        .eq('user_id', student.id);

      if (deleteError) {
        logger.warn(`[Login] Failed to delete old sessions: ${deleteError.message}`);
      } else {
        logger.info(`[Login] Invalidated all previous sessions for user: ${student.email}`);
      }

      // Generate new session ID
      const sessionId = crypto.randomUUID();

      // Generate tokens with session ID
      const accessToken = generateAccessToken(student.id, student.email, sessionId);
      const refreshToken = generateRefreshToken(student.id, student.email, sessionId);

      // Create new session (only ONE session per user due to unique constraint)
      const { error: insertError } = await supabase.from('sessions').insert([
        {
          user_id: student.id,
          session_id: sessionId,
          refresh_token: refreshToken,
          user_agent: req.headers['user-agent'] || 'unknown',
          ip_address: req.ip || 'unknown',
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        },
      ]);

      if (insertError) {
        logger.error(`[Login] Failed to create session: ${insertError.message}`);
        return res.status(500).json({
          success: false,
          error: 'Failed to create session',
        });
      }

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

    // CRITICAL: Verify session exists and matches
    if (!payload.sessionId) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token: missing session ID',
      });
    }

    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('*')
      .eq('refresh_token', refresh_token)
      .eq('user_id', payload.userId)
      .eq('session_id', payload.sessionId)
      .maybeSingle();

    // Session not found or doesn't match = user logged in elsewhere
    if (!session || sessionError) {
      logger.warn(`[Refresh] Session not found for user ${payload.userId}. User may have logged in elsewhere.`);
      return res.status(401).json({
        success: false,
        error: 'Session invalid. You may have logged in from another device.',
      });
    }

    // Check if session expired
    if (new Date(session.expires_at) < new Date()) {
      logger.warn(`[Refresh] Session expired for user ${payload.userId}`);
      await supabase.from('sessions').delete().eq('session_id', payload.sessionId);
      return res.status(401).json({
        success: false,
        error: 'Session expired. Please login again.',
      });
    }

    // Generate new access token with same session ID
    const accessToken = generateAccessToken(payload.userId, payload.email, payload.sessionId);

    // Update last_used_at
    await supabase
      .from('sessions')
      .update({ last_used_at: new Date().toISOString() })
      .eq('session_id', payload.sessionId);

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
      // Verify token to get session ID
      try {
        const payload = verifyToken(refresh_token);
        if (payload.sessionId) {
          // Delete session by session_id for better security
          await supabase.from('sessions').delete().eq('session_id', payload.sessionId);
          logger.info(`[Logout] Session deleted for user: ${payload.userId}`);
        }
      } catch (error) {
        // If token is invalid, try deleting by refresh_token as fallback
        await supabase.from('sessions').delete().eq('refresh_token', refresh_token);
      }
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
