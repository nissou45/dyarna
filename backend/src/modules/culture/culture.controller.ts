import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { cultureService } from './culture.service';

export const cultureController = {
  getByCityId: asyncHandler(async (req: Request, res: Response) => {
    const cityId = req.params.cityId as string;
    const doc = await cultureService.getByCityId(cityId);

    if (!doc) {
      res.json({ status: 'unavailable', cityId });
      return;
    }

    res.json({
      status: 'ready',
      cityId: doc.cityId,
      history: doc.history,
      traditions: doc.traditions,
      legend: doc.legend,
      cuisine: doc.cuisine,
      sourceUrl: doc.sourceUrl,
      lastFetchedAt: doc.lastFetchedAt,
    });
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const cityId = req.params.cityId as string;
    const doc = await cultureService.refresh(cityId);

    res.json({
      status: 'ready',
      cityId: doc.cityId,
      history: doc.history,
      traditions: doc.traditions,
      legend: doc.legend,
      cuisine: doc.cuisine,
      sourceUrl: doc.sourceUrl,
      lastFetchedAt: doc.lastFetchedAt,
    });
  }),

  updateManually: asyncHandler(async (req: Request, res: Response) => {
    const cityId = req.params.cityId as string;
    const { history, traditions, legend, cuisine, sourceUrl } = req.body;

    const doc = await cultureService.updateManually(cityId, {
      history,
      traditions,
      legend,
      cuisine,
      sourceUrl,
    });

    res.json({
      status: 'ready',
      cityId: doc.cityId,
      history: doc.history,
      traditions: doc.traditions,
      legend: doc.legend,
      cuisine: doc.cuisine,
      sourceUrl: doc.sourceUrl,
      lastFetchedAt: doc.lastFetchedAt,
    });
  }),
};
