import { Router } from 'express';
import { galleryController } from './photo.controller';
import { requireAuth } from '../../middlewares/requireAuth';
import { requireRole } from '../../middlewares/requireRole';
import { authLimiter } from '../../middlewares/rateLimiter';
import { uploadMiddleware, validateImageBuffer } from './middlewares/uploadValidation';

const router = Router();

router.get('/city/:cityId', galleryController.getByCity);
router.get('/pending', requireAuth, requireRole('admin'), galleryController.getPending);

router.post(
  '/upload/:cityId',
  requireAuth,
  authLimiter,
  uploadMiddleware,
  validateImageBuffer,
  galleryController.upload,
);

router.patch('/:id/moderate', requireAuth, requireRole('admin'), galleryController.moderate);
router.delete('/:id', requireAuth, galleryController.delete);

router.post('/:id/like', requireAuth, galleryController.like);
router.delete('/:id/like', requireAuth, galleryController.unlike);
router.get('/likes/batch', requireAuth, galleryController.getUserLikes);

export default router;
