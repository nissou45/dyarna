import { Router } from 'express';
import { citiesController } from './cities.controller';

const router = Router();

router.get('/', citiesController.getAll);

export default router;
