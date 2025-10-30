import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { logger } from '../utils/logger.js';

dotenv.config();

mongoose.set('strictQuery', true);

export const connectDatabase = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable');
  }

  await mongoose.connect(uri, {
    autoIndex: true,
  });

  logger.info('Connected to MongoDB');
};
