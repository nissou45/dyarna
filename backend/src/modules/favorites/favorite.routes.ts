import { Router } from 'express';
import { favoriteController } from './favorite.controller';
import { requireAuth } from '../../middlewares/requireAuth';

const router = Router();

router.use(requireAuth);

router.get('/', favoriteController.getAll);
router.post('/:cityId', favoriteController.add);
router.delete('/:cityId', favoriteController.remove);

export default router;
