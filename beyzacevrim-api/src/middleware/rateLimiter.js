import rateLimit from 'express-rate-limit';
import config from '../config/env.js';

export const contactLimiter = rateLimit({
  windowMs: config.contactRateLimit.windowMs,
  limit: config.contactRateLimit.max,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (req, res) =>
    res.status(429).json({
      success: false,
      error: {
        code: 'TOO_MANY_REQUESTS',
        message: 'Too many messages sent. Please try again later.',
      },
    }),
});
