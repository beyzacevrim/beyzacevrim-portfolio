import config, { assertConfig } from './config/env.js';
import logger from './utils/logger.js';

try {
  assertConfig();
} catch (err) {
  logger.error(err.message);
  process.exit(1);
}

const { default: app } = await import('./app.js');
const { connectDatabase, disconnectDatabase } = await import('./config/db.js');

// Express 5 passes listen errors (e.g. EADDRINUSE) to this callback.
const server = app.listen(config.port, (err) => {
  if (err) {
    logger.error('HTTP server failed to start', { error: err.message });
    process.exit(1);
  }
  logger.info('API listening', { port: config.port, env: config.nodeEnv });
});

// The HTTP server starts regardless; the database connects (and retries) in the background.
connectDatabase();

const shutdown = (signal) => {
  logger.info('Shutting down', { signal });
  server.close(async () => {
    await disconnectDatabase();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref();
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection', { error: String(reason) });
});
