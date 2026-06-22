import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { weatherService } from './weather.service';

export const weatherController = {
  getCurrent: asyncHandler(async (req: Request, res: Response) => {
    const cityId = req.params.cityId as string;
    const result = await weatherService.getCurrentWeather(cityId);
    res.json(result);
  }),

  getBestSeason: asyncHandler(async (req: Request, res: Response) => {
    const cityId = req.params.cityId as string;
    const result = await weatherService.getBestSeason(cityId);
    res.json(result);
  }),

  getFull: asyncHandler(async (req: Request, res: Response) => {
    const cityId = req.params.cityId as string;
    const result = await weatherService.getFullWeatherInfo(cityId);
    res.json(result);
  }),
};
