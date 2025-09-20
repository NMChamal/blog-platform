
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from './logger';

dotenv.config();

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  logger.error('MONGO_URI is not defined in .env file');
  process.exit(1);
}

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    logger.info('MongoDB connected');
  } catch (err) {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  }
};
