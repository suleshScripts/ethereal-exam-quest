import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m';
const REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '30d';

export interface TokenPayload {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
  sessionId?: string; // Added for single-session validation
}

export function generateAccessToken(userId: string, email: string, sessionId: string): string {
  const payload = { userId, email, sessionId, type: 'access' as const };
  // @ts-ignore
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXPIRY });
}

export function generateRefreshToken(userId: string, email: string, sessionId: string): string {
  const payload = { userId, email, sessionId, type: 'refresh' as const };
  // @ts-ignore
  return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_EXPIRY });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
