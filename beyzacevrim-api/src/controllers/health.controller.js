import { isDatabaseConnected } from '../config/db.js';
import { sendSuccess } from '../utils/response.js';

export function getHealth(req, res) {
  const database = isDatabaseConnected() ? 'connected' : 'disconnected';

  // The API process is healthy even without the database; contact submissions report 503 separately.
  return sendSuccess(res, {
    status: 'ok',
    database,
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
}
