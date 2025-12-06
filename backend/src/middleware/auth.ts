import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { supabase } from '../config/supabase';
import logger from '../utils/logger';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    sessionId: string;
  };
}

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'No token provided',
      });
      return;
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    if (payload.type !== 'access') {
      res.status(401).json({
        success: false,
        error: 'Invalid token type',
      });
      return;
    }

    // CRITICAL: Verify session exists and matches in database
    if (!payload.sessionId) {
      res.status(401).json({
        success: false,
        error: 'Invalid token: missing session ID',
      });
      return;
    }

    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('session_id, expires_at, user_id')
      .eq('user_id', payload.userId)
      .eq('session_id', payload.sessionId)
      .maybeSingle();

    // Session not found or doesn't match = user logged in elsewhere
    if (!session || sessionError) {
      logger.warn(`[Auth] Session not found for user ${payload.userId}. User may have logged in elsewhere.`);
      res.status(401).json({
        success: false,
        error: 'Session invalid. You may have logged in from another device.',
      });
      return;
    }

    // Check if session expired
    if (new Date(session.expires_at) < new Date()) {
      logger.warn(`[Auth] Session expired for user ${payload.userId}`);
      await supabase.from('sessions').delete().eq('session_id', payload.sessionId);
      res.status(401).json({
        success: false,
        error: 'Session expired. Please login again.',
      });
      return;
    }

    // Update last_used_at timestamp
    await supabase
      .from('sessions')
      .update({ last_used_at: new Date().toISOString() })
      .eq('session_id', payload.sessionId);

    (req as AuthRequest).user = {
      userId: payload.userId,
      email: payload.email,
      sessionId: payload.sessionId,
    };

    next();
  } catch (error: any) {
    logger.error('[Auth Middleware] Error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
    });
    return;
  }
}
