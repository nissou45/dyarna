import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { env } from './config/env';
import './config/passport';
import authRoutes from './modules/auth/auth.routes';
import favoriteRoutes from './modules/favorites/favorite.routes';
import { requireAuth } from './middlewares/requireAuth';
import { errorHandler } from './middlewares/errorHandler';
import { globalLimiter } from './middlewares/rateLimiter';

const app = express();

app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(globalLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

export default app;
