import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const NODE_ENV = process.env.NODE_ENV || 'development';

const parseOrigins = (value) =>
  (value || '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);

const config = Object.freeze({
  nodeEnv: NODE_ENV,
  isProduction: NODE_ENV === 'production',
  port: Number.parseInt(process.env.PORT, 10) || 5050,
  corsOrigins: parseOrigins(process.env.CORS_ORIGINS),
  trustProxy: process.env.TRUST_PROXY === 'true',
  contactRateLimit: {
    windowMs: 15 * 60 * 1000,
    max: Number.parseInt(process.env.CONTACT_RATE_LIMIT_MAX, 10) || 5,
  },
  mail: {
    apiKey: process.env.RESEND_API_KEY || '',
    apiUrl: process.env.RESEND_API_URL || 'https://api.resend.com/emails',
    to: process.env.CONTACT_TO_EMAIL || '',
    // resend.dev works without verifying a domain, but only delivers to the Resend account's own address.
    from: process.env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>',
  },
});

export const isMailConfigured = () => Boolean(config.mail.apiKey && config.mail.to);

export function assertConfig() {
  const missing = [];
  if (config.corsOrigins.length === 0) missing.push('CORS_ORIGINS');

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

export default config;
