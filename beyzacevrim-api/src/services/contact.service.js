import config from '../config/env.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

const LANGUAGE_NAMES = { en: 'English', tr: 'Turkish', es: 'Spanish', de: 'German' };
const REQUEST_TIMEOUT_MS = 10000;

const unavailable = () =>
  ApiError.serviceUnavailable('Messages cannot be received right now. Please try again later.');

// Plain text only, so visitor input is never interpreted as HTML in the inbox.
export function buildEmail({ name, email, phone, subject, message, locale }) {
  return {
    from: config.mail.from,
    to: [config.mail.to],
    reply_to: email,
    subject: `Portfolio: ${subject || 'New message'} — ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      `Site language: ${LANGUAGE_NAMES[locale] || locale}`,
      subject ? `Subject: ${subject}` : null,
      '',
      message,
    ]
      .filter((line) => line !== null)
      .join('\n'),
  };
}

export async function sendContactEmail(payload) {
  if (!config.mail.apiKey || !config.mail.to) throw unavailable();

  let res;
  try {
    res = await fetch(config.mail.apiUrl, {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.mail.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(buildEmail(payload)),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (err) {
    logger.error('Mail request failed', { error: err.message });
    throw unavailable();
  }

  if (!res.ok) {
    // The provider's error body may echo the message, so only the status is logged.
    logger.error('Mail provider rejected the message', { status: res.status });
    throw unavailable();
  }

  const { id } = await res.json().catch(() => ({}));
  return { id };
}
