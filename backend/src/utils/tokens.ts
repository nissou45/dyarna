import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { env } from '../config/env';

export interface TokenPayload {
  userId: string;
  role: 'user' | 'admin';
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString('hex');
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
}

export function hashRefreshToken(token: string): string {
  return bcrypt.hashSync(token, 10);
}

export function compareRefreshToken(token: string, hash: string): boolean {
  return bcrypt.compareSync(token, hash);
}

export function setRefreshCookie(res: Response, token: string): void {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/auth',
  });
}
