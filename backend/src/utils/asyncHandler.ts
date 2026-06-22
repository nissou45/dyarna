import { Request, Response, NextFunction } from 'express';
import { AppError } from './AppError';

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export function asyncHandler(fn: AsyncHandler) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
