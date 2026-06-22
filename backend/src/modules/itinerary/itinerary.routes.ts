import { Router } from 'express';
import { itineraryController } from './itinerary.controller';
import { requireAuth } from '../../middlewares/requireAuth';

const router = Router();

router.get('/public/:token', itineraryController.getByShareToken);

router.use(requireAuth);

router.get('/mine', itineraryController.getMyItineraries);
router.post('/', itineraryController.create);
router.get('/:id', itineraryController.getById);
router.patch('/:id', itineraryController.update);
router.patch('/:id/reorder', itineraryController.reorder);
router.delete('/:id', itineraryController.delete);

router.get('/:id/suggestions', itineraryController.getSuggestions);
router.patch('/:id/share', itineraryController.share);
router.patch('/:id/unshare', itineraryController.unshare);
router.get('/:id/export-pdf', itineraryController.exportPdf);

export default router;
