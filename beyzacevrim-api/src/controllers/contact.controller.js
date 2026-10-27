import { sendContactEmail } from '../services/contact.service.js';
import logger from '../utils/logger.js';
import { sendSuccess } from '../utils/response.js';

export async function submitMessage(req, res) {
  const { website, ...payload } = req.validated;

  // Honeypot: real visitors never see the "website" field, so a value means a bot.
  // Respond as if it succeeded so the bot gets no signal, but send nothing.
  if (website) {
    logger.warn('Contact honeypot triggered');
    return sendSuccess(res, { received: true }, 201);
  }

  const { id } = await sendContactEmail(payload);
  logger.info('Contact message emailed', { id });
  return sendSuccess(res, { received: true }, 201);
}
