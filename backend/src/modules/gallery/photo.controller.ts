import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { galleryService } from './photo.service';

export const galleryController = {
  getByCity: asyncHandler(async (req: Request, res: Response) => {
    const cityId = req.params.cityId as string;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));

    const result = await galleryService.findByCity(cityId, page, limit);
    res.json(result);
  }),

  getPending: asyncHandler(async (_req: Request, res: Response) => {
    const photos = await galleryService.getPending();
    res.json({ photos });
  }),

  upload: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const cityId = req.params.cityId as string;
    const caption = req.body.caption as string | undefined;
    const buffer = req.file!.buffer;

    const photo = await galleryService.upload(userId, cityId, buffer, caption);
    res.status(201).json({ photo });
  }),

  moderate: asyncHandler(async (req: Request, res: Response) => {
    const photoId = req.params.id as string;
    const status = req.body.status as 'approved' | 'rejected';

    if (!['approved', 'rejected'].includes(status)) {
      res.status(400).json({ error: 'Le statut doit être "approved" ou "rejected".' });
      return;
    }

    const photo = await galleryService.moderate(photoId, status);
    res.json({ photo });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;
    const photoId = req.params.id as string;

    await galleryService.delete(userId, userRole, photoId);
    res.status(204).send();
  }),

  like: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const photoId = req.params.id as string;

    const result = await galleryService.like(userId, photoId);
    res.json(result);
  }),

  unlike: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const photoId = req.params.id as string;

    const result = await galleryService.unlike(userId, photoId);
    res.json(result);
  }),

  getUserLikes: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const photoIds = (req.query.ids as string || '').split(',').filter(Boolean);

    const likedSet = await galleryService.getUserLikes(userId, photoIds);
    const likes: Record<string, boolean> = {};
    for (const id of photoIds) {
      likes[id] = likedSet.has(id);
    }

    res.json({ likes });
  }),
};
