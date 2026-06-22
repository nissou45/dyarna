import mongoose from 'mongoose';
import { QuizSession, IQuizSession } from './quizSession.model';
import { LeaderboardEntry } from './leaderboard.model';
import { generateQuestionSet } from './utils/questionGenerator';
import { calculateScore } from './utils/scoring';
import { AppError } from '../../utils/AppError';
import { getCityById } from '../culture/cities.data';

const RATE_LIMIT_MS = 10_000;

export interface CurrentQuestionResponse {
  questionIndex: number;
  totalQuestions: number;
  type: 'photo' | 'culture_fact' | 'climate_fact';
  clue: string;
  choices: { id: string; name: string }[];
  score: number;
}

export interface AnswerResultResponse {
  isCorrect: boolean;
  correctCityId: string;
  correctCityName: string;
  pointsGained: number;
  totalScore: number;
  questionIndex: number;
  totalQuestions: number;
  isLastQuestion: boolean;
}

export interface SessionResultResponse {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  averageTimeMs: number;
  isNewBestScore: boolean;
}

export interface LeaderboardEntryResponse {
  rank: number;
  userId: string;
  displayName: string;
  bestScore: number;
  gamesPlayed: number;
}

export interface UserRankResponse {
  rank: number;
  score: number;
  totalPlayers: number;
}

export class QuizService {
  async startQuiz(
    userId?: string,
    guestId?: string,
  ): Promise<{ sessionId: string; currentQuestion: CurrentQuestionResponse }> {
    const filter: Record<string, unknown> = { status: 'in_progress' };
    if (userId) filter.userId = new mongoose.Types.ObjectId(userId);
    else if (guestId) filter.guestId = guestId;

    const existing = await QuizSession.findOne(filter);
    if (existing) {
      const elapsed = Date.now() - existing.startedAt.getTime();
      if (elapsed < RATE_LIMIT_MS) {
        throw new AppError(
          'Veuillez attendre avant de démarrer une nouvelle partie.',
          429,
        );
      }

      existing.status = 'completed';
      existing.completedAt = new Date();
      await existing.save();
    }

    const { questions: rawQuestions, internalQuestions } =
      await generateQuestionSet(10);

    const questions = internalQuestions.map((q) => ({
      cityId: q.cityId,
      type: q.type,
      sentAt: new Date(),
    }));

    const generatedQuestions = rawQuestions.map((rq) => ({
      cityId: rq.cityId,
      type: rq.type,
      clue: rq.clue,
      choices: rq.choices,
    }));

    const session = await QuizSession.create({
      userId: userId ? new mongoose.Types.ObjectId(userId) : undefined,
      guestId,
      questions,
      generatedQuestions,
      currentQuestionIndex: 0,
      score: 0,
      status: 'in_progress',
      startedAt: new Date(),
    });

    const firstQ = rawQuestions[0];

    return {
      sessionId: session._id.toString(),
      currentQuestion: {
        questionIndex: 0,
        totalQuestions: rawQuestions.length,
        type: firstQ.type,
        clue: firstQ.clue,
        choices: firstQ.choices,
        score: 0,
      },
    };
  }

  async getCurrentQuestion(
    sessionId: string,
  ): Promise<CurrentQuestionResponse | null> {
    const session = await QuizSession.findById(sessionId);
    if (!session) {
      throw new AppError('Session introuvable.', 404);
    }

    if (session.status === 'completed') {
      return null;
    }

    const qIdx = session.currentQuestionIndex;
    const genQ = session.generatedQuestions[qIdx];
    if (!genQ) {
      throw new AppError('Question introuvable.', 404);
    }

    return {
      questionIndex: qIdx,
      totalQuestions: session.questions.length,
      type: genQ.type,
      clue: genQ.clue,
      choices: genQ.choices,
      score: session.score,
    };
  }

  async submitAnswer(
    sessionId: string,
    cityId: string,
  ): Promise<AnswerResultResponse> {
    const session = await QuizSession.findById(sessionId);
    if (!session) {
      throw new AppError('Session introuvable.', 404);
    }

    if (session.status === 'completed') {
      throw new AppError('Cette session est déjà terminée.', 400);
    }

    const qIdx = session.currentQuestionIndex;
    const question = session.questions[qIdx];
    if (!question) {
      throw new AppError('Question introuvable.', 404);
    }

    if (question.answeredCityId !== undefined) {
      throw new AppError('Cette question a déjà reçu une réponse.', 400);
    }

    const answerTimeMs = Date.now() - question.sentAt.getTime();
    const isCorrect = question.cityId === cityId;
    const scoreResult = calculateScore(isCorrect, answerTimeMs);

    question.answeredCityId = cityId;
    question.isCorrect = isCorrect;
    question.answerTimeMs = answerTimeMs;
    session.score += scoreResult.total;

    const isLastQuestion = qIdx >= session.questions.length - 1;

    if (isLastQuestion) {
      session.status = 'completed';
      session.completedAt = new Date();
    } else {
      session.currentQuestionIndex += 1;
      const nextQ = session.questions[session.currentQuestionIndex];
      if (nextQ) {
        nextQ.sentAt = new Date();
      }
    }

    await session.save();

    const cityInfo = getCityById(question.cityId);

    if (session.status === 'completed' && session.userId) {
      await this.updateLeaderboard(
        session.userId.toString(),
        session.score,
      );
    }

    return {
      isCorrect,
      correctCityId: question.cityId,
      correctCityName: cityInfo?.name || question.cityId,
      pointsGained: scoreResult.total,
      totalScore: session.score,
      questionIndex: qIdx,
      totalQuestions: session.questions.length,
      isLastQuestion,
    };
  }

  async getResult(
    sessionId: string,
  ): Promise<SessionResultResponse> {
    const session = await QuizSession.findById(sessionId);
    if (!session) {
      throw new AppError('Session introuvable.', 404);
    }

    if (session.status !== 'completed') {
      throw new AppError('La partie n\'est pas encore terminée.', 400);
    }

    const answered = session.questions.filter((q) => q.answeredCityId !== undefined);
    const correctAnswers = answered.filter((q) => q.isCorrect).length;
    const times = answered
      .map((q) => q.answerTimeMs ?? 0)
      .filter((t) => t > 0);
    const averageTimeMs =
      times.length > 0
        ? Math.round(times.reduce((s, t) => s + t, 0) / times.length)
        : 0;

    let isNewBestScore = false;
    if (session.userId) {
      const entry = await LeaderboardEntry.findOne({
        userId: session.userId,
      });
      isNewBestScore = !entry || session.score > entry.bestScore;
    }

    return {
      score: session.score,
      totalQuestions: session.questions.length,
      correctAnswers,
      averageTimeMs,
      isNewBestScore,
    };
  }

  async getLeaderboard(
    limit: number = 10,
  ): Promise<LeaderboardEntryResponse[]> {
    const entries = await LeaderboardEntry.find()
      .sort({ bestScore: -1 })
      .limit(limit)
      .lean();

    return entries.map((entry, index) => ({
      rank: index + 1,
      userId: entry.userId.toString(),
      displayName: entry.displayName,
      bestScore: entry.bestScore,
      gamesPlayed: entry.gamesPlayed,
    }));
  }

  async getUserRank(
    userId: string,
  ): Promise<UserRankResponse> {
    const entry = await LeaderboardEntry.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    const score = entry?.bestScore ?? 0;
    const playersAhead = await LeaderboardEntry.countDocuments({
      bestScore: { $gt: score },
    });
    const totalPlayers = await LeaderboardEntry.countDocuments();

    return {
      rank: playersAhead + 1,
      score,
      totalPlayers,
    };
  }

  private async updateLeaderboard(
    userId: string,
    sessionScore: number,
  ): Promise<void> {
    const user = await mongoose.model('User').findById(userId).lean();
    if (!user) return;

    const displayName = (user as any).displayName || 'Anonyme';

    await LeaderboardEntry.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      {
        $set: { displayName },
        $inc: { gamesPlayed: 1 },
        $max: { bestScore: sessionScore },
      },
      { upsert: true },
    );
  }
}

export const quizService = new QuizService();
