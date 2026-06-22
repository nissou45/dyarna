import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { favoriteService } from './favorite.service';

export const favoriteController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const favorites = await favoriteService.getFavorites(userId);
    res.json({ favorites });
  }),

  add: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const cityId = req.params.cityId as string;
    const favorite = await favoriteService.addFavorite(userId, cityId);
    res.status(201).json({ favorite });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const cityId = req.params.cityId as string;
    await favoriteService.removeFavorite(userId, cityId);
    res.status(204).send();
  }),
};
