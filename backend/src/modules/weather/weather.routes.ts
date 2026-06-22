import { Router } from 'express';
import { weatherController } from './weather.controller';

const router = Router();

router.get('/:cityId/current', weatherController.getCurrent);
router.get('/:cityId/best-season', weatherController.getBestSeason);
router.get('/:cityId/full', weatherController.getFull);

export default router;
