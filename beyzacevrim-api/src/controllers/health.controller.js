import { isMailConfigured } from '../config/env.js';
import { sendSuccess } from '../utils/response.js';

export function getHealth(req, res) {
  // The API is healthy even without mail settings; contact submissions report 503 separately.
  return sendSuccess(res, {
    status: 'ok',
    mail: isMailConfigured() ? 'configured' : 'not configured',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
}
