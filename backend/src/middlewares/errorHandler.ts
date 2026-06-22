import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
    });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({
    error: env.NODE_ENV === 'production' ? 'Erreur interne du serveur.' : err.message,
  });
}
