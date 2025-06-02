import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

// JWT Secret - in production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'elite-replicas-jwt-secret-key-change-in-production';
const JWT_EXPIRES_IN = '24h';

// Cookie names
export const ADMIN_TOKEN_COOKIE = 'admin_token';
export const USER_TOKEN_COOKIE = 'user_token';

export interface JwtPayload {
  id: string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Generate a JWT token for authenticated users
 */
export function generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

/**
 * Extract token from authorization header
 */
export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.split(' ')[1];
}

/**
 * Extract token from request (either from cookies or authorization header)
 */
export function extractTokenFromRequest(request: NextRequest): string | null {
  // First check cookies (preferred method)
  const adminToken = request.cookies.get(ADMIN_TOKEN_COOKIE)?.value;
  if (adminToken) return adminToken;
  
  const userToken = request.cookies.get(USER_TOKEN_COOKIE)?.value;
  if (userToken) return userToken;
  
  // Then check authorization header as fallback
  const authHeader = request.headers.get('authorization');
  return extractTokenFromHeader(authHeader || undefined);
}
