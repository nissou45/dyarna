import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
    });
    return;
  }

  logger.error(err, 'Unhandled error');
  res.status(500).json({
    error: env.NODE_ENV === 'production' ? 'Erreur interne du serveur.' : err.message,
  });
}
