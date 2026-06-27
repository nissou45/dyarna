import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { likeService } from './like.service';

export const likeController = {
  like: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const { targetId, targetType } = req.body as { targetId: string; targetType: 'city' | 'dish' };

    if (!targetId || !['city', 'dish'].includes(targetType)) {
      res.status(400).json({ error: 'targetId et targetType (city|dish) requis.' });
      return;
    }

    const result = await likeService.like(userId, targetId, targetType);
    res.json(result);
  }),

  unlike: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const targetId = req.params.targetId as string;

    const result = await likeService.unlike(userId, targetId);
    res.json(result);
  }),

  check: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const targetId = req.params.targetId as string;

    const liked = await likeService.hasLiked(userId, targetId);
    res.json({ liked });
  }),

  count: asyncHandler(async (req: Request, res: Response) => {
    const targetId = req.params.targetId as string;

    const count = await likeService.getCount(targetId);
    res.json({ count });
  }),

  batchCheck: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const targetIds = (req.query.ids as string || '').split(',').filter(Boolean);

    const likes = await likeService.getUserLikes(userId, targetIds);
    res.json({ likes });
  }),
};
