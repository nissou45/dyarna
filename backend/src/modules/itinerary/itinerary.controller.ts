import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { itineraryService } from './itinerary.service';
import { createItinerarySchema, updateItinerarySchema, reorderSchema } from './itinerary.dto';

export const itineraryController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const dto = createItinerarySchema.parse(req.body);
    const itinerary = await itineraryService.create(userId, dto.title, dto.days);
    res.status(201).json({ itinerary });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const id = req.params.id as string;
    const itinerary = await itineraryService.getById(id, userId);
    const computed = itineraryService.getComputedData(itinerary.days);
    res.json({ itinerary, computed });
  }),

  getMyItineraries: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const itineraries = await itineraryService.getByUser(userId);
    res.json({ itineraries });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const id = req.params.id as string;
    const dto = updateItinerarySchema.parse(req.body);
    const itinerary = await itineraryService.update(id, userId, dto);
    const computed = itineraryService.getComputedData(itinerary.days);
    res.json({ itinerary, computed });
  }),

  reorder: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const id = req.params.id as string;
    const dto = reorderSchema.parse(req.body);
    const itinerary = await itineraryService.reorder(id, userId, dto.dayIds);
    const computed = itineraryService.getComputedData(itinerary.days);
    res.json({ itinerary, computed });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const id = req.params.id as string;
    await itineraryService.delete(id, userId);
    res.status(204).send();
  }),

  getSuggestions: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const id = req.params.id as string;
    const limit = Math.min(5, Math.max(1, parseInt(req.query.limit as string) || 3));
    const suggestions = await itineraryService.getSuggestions(id, userId, limit);
    res.json({ suggestions });
  }),

  share: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const id = req.params.id as string;
    const result = await itineraryService.share(id, userId);
    res.json(result);
  }),

  unshare: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const id = req.params.id as string;
    await itineraryService.unshare(id, userId);
    res.status(204).send();
  }),

  getByShareToken: asyncHandler(async (req: Request, res: Response) => {
    const shareToken = req.params.token as string;
    const itinerary = await itineraryService.getByShareToken(shareToken);
    const computed = itineraryService.getComputedData(itinerary.days);
    res.json({ itinerary, computed });
  }),

  exportPdf: asyncHandler(async (_req: Request, res: Response) => {
    res.status(501).json({
      error: 'L\'export PDF n\'est pas disponible sur la plateforme serverless. Utilisez l\'application en local ou sur un serveur dédié.',
    });
  }),
};
