import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { CITIES } from '../../data/cities';

export const citiesController = {
  getAll: asyncHandler(async (_req: Request, res: Response) => {
    const cities = Object.values(CITIES).map((c) => ({
      id: c.id,
      name: c.name,
      region: c.region,
      category: c.category,
      lat: c.lat,
      lng: c.lng,
    }));
    res.json({ cities });
  }),
};
