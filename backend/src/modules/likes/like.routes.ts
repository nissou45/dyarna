import { Router } from 'express';
import { likeController } from './like.controller';
import { requireAuth } from '../../middlewares/requireAuth';

const router = Router();

router.get('/batch', requireAuth, likeController.batchCheck);
router.post('/', requireAuth, likeController.like);
router.delete('/:targetId', requireAuth, likeController.unlike);
router.get('/check/:targetId', requireAuth, likeController.check);
router.get('/count/:targetId', likeController.count);

export default router;
