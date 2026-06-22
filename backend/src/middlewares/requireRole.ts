import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export function requireRole(...roles: string[]) {
  return (_req: Request, _res: Response, next: NextFunction): void => {
    const user = (_req as any).user;
    if (!user || !roles.includes(user.role)) {
      throw new AppError('Accès réservé aux administrateurs.', 403);
    }
    next();
  };
}
