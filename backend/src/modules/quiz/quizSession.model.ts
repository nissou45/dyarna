import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion {
  cityId: string;
  type: 'photo' | 'culture_fact' | 'climate_fact';
  answeredCityId?: string;
  isCorrect?: boolean;
  answerTimeMs?: number;
  sentAt: Date;
}

export interface IGeneratedQuestion {
  cityId: string;
  type: 'photo' | 'culture_fact' | 'climate_fact';
  clue: string;
  choices: { id: string; name: string }[];
}

export interface IQuizSession extends Document {
  userId?: mongoose.Types.ObjectId;
  guestId?: string;
  questions: IQuestion[];
  generatedQuestions: IGeneratedQuestion[];
  currentQuestionIndex: number;
  score: number;
  status: 'in_progress' | 'completed';
  startedAt: Date;
  completedAt?: Date;
}

const questionSchema = new Schema<IQuestion>(
  {
    cityId: { type: String, required: true },
    type: {
      type: String,
      enum: ['photo', 'culture_fact', 'climate_fact'],
      required: true,
    },
    answeredCityId: { type: String },
    isCorrect: { type: Boolean },
    answerTimeMs: { type: Number },
    sentAt: { type: Date, required: true },
  },
  { _id: false },
);

const choiceSchema = new Schema<{ id: string; name: string }>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
  },
  { _id: false },
);

const generatedQuestionSchema = new Schema<IGeneratedQuestion>(
  {
    cityId: { type: String, required: true },
    type: {
      type: String,
      enum: ['photo', 'culture_fact', 'climate_fact'],
      required: true,
    },
    clue: { type: String, required: true },
    choices: { type: [choiceSchema], required: true },
  },
  { _id: false },
);

const quizSessionSchema = new Schema<IQuizSession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    guestId: { type: String, index: true },
    questions: { type: [questionSchema], required: true },
    generatedQuestions: { type: [generatedQuestionSchema], required: true },
    currentQuestionIndex: { type: Number, required: true, default: 0 },
    score: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ['in_progress', 'completed'],
      required: true,
      default: 'in_progress',
    },
    startedAt: { type: Date, required: true, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true },
);

quizSessionSchema.index({ userId: 1, status: 1 });
quizSessionSchema.index({ guestId: 1, status: 1 });

export const QuizSession = mongoose.model<IQuizSession>(
  'QuizSession',
  quizSessionSchema,
);
