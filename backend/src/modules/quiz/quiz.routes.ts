import { Router } from 'express';
import { quizController } from './quiz.controller';
import { requireAuth } from '../../middlewares/requireAuth';
import { authLimiter } from '../../middlewares/rateLimiter';

const router = Router();

router.post('/start', authLimiter, quizController.start);
router.get('/:sessionId/current-question', quizController.getCurrentQuestion);
router.post('/:sessionId/answer', quizController.submitAnswer);
router.get('/:sessionId/result', quizController.getResult);
router.get('/leaderboard/all', quizController.getLeaderboard);
router.get('/leaderboard/me', requireAuth, quizController.getUserRank);

export default router;
