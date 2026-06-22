import { Router } from 'express';
import { cultureController } from './culture.controller';
import { requireAuth } from '../../middlewares/requireAuth';
import { requireRole } from '../../middlewares/requireRole';

const router = Router();

router.get('/:cityId', cultureController.getByCityId);
router.post('/:cityId/refresh', requireAuth, requireRole('admin'), cultureController.refresh);
router.patch('/:cityId', requireAuth, requireRole('admin'), cultureController.updateManually);

export default router;
