import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error(error, 'MongoDB connection error');
    process.exit(1);
  }

  mongoose.connection.on('error', (err) => {
    logger.error(err, 'MongoDB runtime error');
  });
}
