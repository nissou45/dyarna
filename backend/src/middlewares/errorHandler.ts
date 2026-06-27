import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
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

  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Données invalides.',
      details: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  if (err instanceof mongoose.Error) {
    res.status(503).json({
      error: 'Service temporairement indisponible. Veuillez réessayer.',
    });
    return;
  }

  logger.error(err, 'Unhandled error');
  res.status(500).json({
    error: env.NODE_ENV === 'production' ? 'Erreur interne du serveur.' : err.message,
  });
}
