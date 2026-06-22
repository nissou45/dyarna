import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { reviewService } from './review.service';
import { createReviewSchema, updateReviewSchema, moderateReviewSchema } from './review.dto';

export const reviewController = {
  getByCity: asyncHandler(async (req: Request, res: Response) => {
    const cityId = req.params.cityId as string;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
    const sort = (req.query.sort as 'recent' | 'highest' | 'lowest') || 'recent';

    const result = await reviewService.findByCity(cityId, page, limit, sort);
    res.json(result);
  }),

  getSummary: asyncHandler(async (req: Request, res: Response) => {
    const cityId = req.params.cityId as string;
    const summary = await reviewService.getSummary(cityId);
    res.json(summary);
  }),

  getMyReviews: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const reviews = await reviewService.getMyReviews(userId);
    res.json({ reviews });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const cityId = req.params.cityId as string;
    const dto = createReviewSchema.parse(req.body);
    const review = await reviewService.create(userId, cityId, dto.rating, dto.comment);
    res.status(201).json({ review });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const cityId = req.params.cityId as string;
    const dto = updateReviewSchema.parse(req.body);
    const review = await reviewService.update(userId, cityId, dto);
    res.json({ review });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const cityId = req.params.cityId as string;
    await reviewService.delete(userId, cityId);
    res.status(204).send();
  }),

  moderate: asyncHandler(async (req: Request, res: Response) => {
    const reviewId = req.params.id as string;
    const dto = moderateReviewSchema.parse(req.body);
    const review = await reviewService.moderate(reviewId, dto.status);
    res.json({ review });
  }),

  getPending: asyncHandler(async (_req: Request, res: Response) => {
    const reviews = await reviewService.getPending();
    res.json({ reviews });
  }),
};
