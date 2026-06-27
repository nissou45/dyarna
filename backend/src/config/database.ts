import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

let dbConnected = false;

export async function connectDatabase(): Promise<void> {
  if (dbConnected) return;
  try {
    await mongoose.connect(env.MONGODB_URI);
    dbConnected = true;
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error(error, 'MongoDB connection error');
    throw error;
  }

  mongoose.connection.on('error', (err) => {
    logger.error(err, 'MongoDB runtime error');
  });
}
