import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/tokens';
import { AppError } from '../utils/AppError';

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw new AppError('Authentification requise.', 401);
  }

  const token = header.split(' ')[1];
  if (!token) {
    throw new AppError('Authentification requise.', 401);
  }

  try {
    const payload = verifyAccessToken(token);
    (req as any).user = payload;
    next();
  } catch {
    throw new AppError('Token invalide ou expiré.', 401);
  }
}
