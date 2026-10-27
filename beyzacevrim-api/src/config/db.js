import mongoose from 'mongoose';
import config from './env.js';
import logger, { redactUri } from '../utils/logger.js';

// Fail fast instead of queueing queries while the database is unreachable.
mongoose.set('bufferCommands', false);
mongoose.set('strictQuery', true);

const RETRY_DELAY_MS = 5000;
let retryTimer = null;
let stopping = false;

mongoose.connection.on('connected', () => logger.info('MongoDB connected'));
mongoose.connection.on('disconnected', () => {
  if (!stopping) logger.warn('MongoDB disconnected');
});
mongoose.connection.on('error', (err) => logger.error('MongoDB error', { error: err.message }));

export async function connectDatabase() {
  try {
    logger.info('Connecting to MongoDB', { uri: redactUri(config.mongoUri) });
    await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 5000 });
  } catch (err) {
    logger.error('MongoDB initial connection failed, retrying', {
      error: err.message,
      retryInMs: RETRY_DELAY_MS,
    });
    if (!stopping) retryTimer = setTimeout(connectDatabase, RETRY_DELAY_MS);
  }
}

export async function disconnectDatabase() {
  stopping = true;
  clearTimeout(retryTimer);
  await mongoose.disconnect();
}

export const isDatabaseConnected = () => mongoose.connection.readyState === 1;
