import logger from '../utils/logger.js';

// Logs method, path, status and duration only. Bodies and headers are never logged.
const requestLogger = (req, res, next) => {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
    logger.info('request', {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: Math.round(durationMs),
    });
  });

  next();
};

export default requestLogger;
