import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('mongoose', () => {
  // eslint-disable-next-line @typescript-eslint/no-extraneous-class
  class Schema {
    index = vi.fn();
    pre = vi.fn();
    methods: Record<string, unknown> = {};
    virtual = vi.fn();
    static Types = { ObjectId: vi.fn(() => 'mocked-id') };
  }

  const mockModel = vi.fn(() => 'User') as unknown as ReturnType<typeof vi.fn> & {
    findById: ReturnType<typeof vi.fn>;
    findOneAndUpdate: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    find: ReturnType<typeof vi.fn>;
    countDocuments: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
  };
  mockModel.findById = vi.fn();
  mockModel.findOneAndUpdate = vi.fn();
  mockModel.findOne = vi.fn();
  mockModel.find = vi.fn();
  mockModel.countDocuments = vi.fn();
  mockModel.create = vi.fn();

  return {
    default: {
      Types: { ObjectId: vi.fn(() => 'mocked-id') },
      model: mockModel,
    },
    Schema,
    model: mockModel,
    Types: { ObjectId: vi.fn(() => 'mocked-id') },
  };
});

vi.mock('../quizSession.model', () => ({
  QuizSession: {
    findOne: vi.fn(),
    create: vi.fn(),
    findById: vi.fn(),
  },
}));

vi.mock('../leaderboard.model', () => ({
  LeaderboardEntry: {
    findOne: vi.fn(),
    find: vi.fn(),
    countDocuments: vi.fn(),
    findOneAndUpdate: vi.fn(),
  },
}));

vi.mock('./utils/questionGenerator', () => ({
  generateQuestionSet: vi.fn().mockResolvedValue({
    questions: [
      { type: 'culture_fact', cityId: 'marrakech', clue: 'Test clue', choices: [{ id: 'marrakech', name: 'Marrakech' }] },
    ],
    internalQuestions: [{ cityId: 'marrakech', type: 'culture_fact' }],
  }),
}));

vi.mock('./utils/scoring', () => ({
  calculateScore: vi.fn(() => ({ total: 10 })),
}));

import { QuizService } from './quiz.service';

describe('QuizService', () => {
  let service: QuizService;

  beforeEach(() => {
    service = new QuizService();
  });

  it('should have a startQuiz method', () => {
    expect(typeof service.startQuiz).toBe('function');
  });

  it('should have a getCurrentQuestion method', () => {
    expect(typeof service.getCurrentQuestion).toBe('function');
  });

  it('should have a submitAnswer method', () => {
    expect(typeof service.submitAnswer).toBe('function');
  });

  it('should have a getResult method', () => {
    expect(typeof service.getResult).toBe('function');
  });

  it('should have a getLeaderboard method', () => {
    expect(typeof service.getLeaderboard).toBe('function');
  });
});
