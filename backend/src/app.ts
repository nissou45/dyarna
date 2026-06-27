import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import { env } from './config/env';
import './config/passport';
import { connectDatabase } from './config/database';

if (process.env.VERCEL) {
  connectDatabase().catch((err) => {
    console.error('MongoDB connection failed:', err.message);
  });
}

app.use((_req, _res, next) => {
  if (mongoose.connection.readyState === 1) return next();
  if (mongoose.connection.readyState === 2) {
    mongoose.connection.once('open', () => next());
    return;
  }
  _res.status(503).json({ error: 'Base de données non connectée. Réessayez dans quelques secondes.' });
});
import authRoutes from './modules/auth/auth.routes';
import favoriteRoutes from './modules/favorites/favorite.routes';
import reviewRoutes from './modules/reviews/review.routes';
import cultureRoutes from './modules/culture/culture.routes';
import weatherRoutes from './modules/weather/weather.routes';
import galleryRoutes from './modules/gallery/photo.routes';
import itineraryRoutes from './modules/itinerary/itinerary.routes';
import quizRoutes from './modules/quiz/quiz.routes';
import likeRoutes from './modules/likes/like.routes';
import citiesRoutes from './modules/cities/cities.routes';
import { initCloudinary } from './modules/gallery/providers/cloudinary.provider';
import { requireAuth } from './middlewares/requireAuth';
import { errorHandler } from './middlewares/errorHandler';
import { globalLimiter } from './middlewares/rateLimiter';

const app = express();

app.set('trust proxy', 1);
app.use(helmet());
const corsOrigins = [env.FRONTEND_URL];
if (env.CORS_ORIGINS) {
  corsOrigins.push(...env.CORS_ORIGINS.split(',').map(s => s.trim()));
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || corsOrigins.some(o => origin.startsWith(o))) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(globalLimiter);

if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
  initCloudinary({
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
  });
}

app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/culture', cultureRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/itineraries', itineraryRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/cities', citiesRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

export default app;
