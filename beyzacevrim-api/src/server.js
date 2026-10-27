import config, { assertConfig, isMailConfigured } from './config/env.js';
import logger from './utils/logger.js';

try {
  assertConfig();
} catch (err) {
  logger.error(err.message);
  process.exit(1);
}

const { default: app } = await import('./app.js');

// Express 5 passes listen errors (e.g. EADDRINUSE) to this callback.
const server = app.listen(config.port, (err) => {
  if (err) {
    logger.error('HTTP server failed to start', { error: err.message });
    process.exit(1);
  }
  logger.info('API listening', { port: config.port, env: config.nodeEnv });
  // The server still starts so the site works; only contact submissions return 503.
  if (!isMailConfigured()) logger.warn('RESEND_API_KEY or CONTACT_TO_EMAIL missing; contact form disabled');
});

const shutdown = (signal) => {
  logger.info('Shutting down', { signal });
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000).unref();
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection', { error: String(reason) });
});
