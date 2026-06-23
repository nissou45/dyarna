export interface QuizChoice {
  id: string;
  name: string;
}

export interface CurrentQuestion {
  questionIndex: number;
  totalQuestions: number;
  type: 'photo' | 'culture_fact' | 'climate_fact';
  clue: string;
  choices: QuizChoice[];
  score: number;
}

export interface StartQuizResponse {
  sessionId: string;
  currentQuestion: CurrentQuestion;
}

export interface AnswerResult {
  isCorrect: boolean;
  correctCityId: string;
  correctCityName: string;
  pointsGained: number;
  totalScore: number;
  questionIndex: number;
  totalQuestions: number;
  isLastQuestion: boolean;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  averageTimeMs: number;
  isNewBestScore: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  bestScore: number;
  gamesPlayed: number;
}

export interface UserRank {
  rank: number;
  score: number;
  totalPlayers: number;
}
