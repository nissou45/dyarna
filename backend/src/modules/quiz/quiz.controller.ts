import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { quizService } from './quiz.service';

export const quizController = {
  start: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    const guestId = req.body.guestId as string | undefined;

    const result = await quizService.startQuiz(userId, guestId);
    res.status(201).json(result);
  }),

  getCurrentQuestion: asyncHandler(async (req: Request, res: Response) => {
    const sessionId = req.params.sessionId as string;

    const question = await quizService.getCurrentQuestion(sessionId);
    if (!question) {
      res.json({ status: 'completed' });
      return;
    }
    res.json(question);
  }),

  submitAnswer: asyncHandler(async (req: Request, res: Response) => {
    const sessionId = req.params.sessionId as string;
    const cityId = req.body.cityId as string;

    if (!cityId) {
      res.status(400).json({ error: 'cityId est requis.' });
      return;
    }

    const result = await quizService.submitAnswer(sessionId, cityId);
    res.json(result);
  }),

  getResult: asyncHandler(async (req: Request, res: Response) => {
    const sessionId = req.params.sessionId as string;

    const result = await quizService.getResult(sessionId);
    res.json(result);
  }),

  getLeaderboard: asyncHandler(async (req: Request, res: Response) => {
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));

    const entries = await quizService.getLeaderboard(limit);
    res.json({ leaderboard: entries });
  }),

  getUserRank: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Authentification requise.' });
      return;
    }

    const rank = await quizService.getUserRank(userId);
    res.json(rank);
  }),
};
