import { Router } from 'express';
import { reviewController } from './review.controller';
import { requireAuth } from '../../middlewares/requireAuth';
import { requireRole } from '../../middlewares/requireRole';
import { authLimiter } from '../../middlewares/rateLimiter';

const router = Router();

router.get('/city/:cityId', reviewController.getByCity);
router.get('/city/:cityId/summary', reviewController.getSummary);

router.get('/me', requireAuth, reviewController.getMyReviews);
router.post('/:cityId', requireAuth, authLimiter, reviewController.create);
router.patch('/:cityId', requireAuth, reviewController.update);
router.delete('/:cityId', requireAuth, reviewController.delete);

router.patch('/:id/moderate', requireAuth, requireRole('admin'), reviewController.moderate);
router.get('/pending', requireAuth, requireRole('admin'), reviewController.getPending);

export default router;
