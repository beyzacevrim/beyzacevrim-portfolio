// Languages the portfolio is published in; included in the email so replies can use the sender's language.
export const SUPPORTED_LOCALES = Object.freeze(['en', 'tr', 'es', 'de']);

export const MESSAGE_LIMITS = Object.freeze({
  name: { min: 2, max: 100 },
  email: { max: 254 },
  subject: { max: 150 },
  message: { min: 10, max: 5000 },
});

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Name and subject end up in the email subject line, so line breaks are not allowed there.
const LINE_BREAK = /[\r\n]/;
const ALLOWED_FIELDS = ['name', 'email', 'subject', 'message', 'website', 'locale'];

const asTrimmedString = (value) => (typeof value === 'string' ? value.trim() : value);

/**
 * Validates a contact form payload.
 * Returns { value, errors } where errors maps field names to messages.
 */
export function validateContact(body) {
  const errors = {};

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { value: null, errors: { body: 'Request body must be a JSON object.' } };
  }

  const unknown = Object.keys(body).filter((key) => !ALLOWED_FIELDS.includes(key));
  if (unknown.length > 0) errors.body = `Unknown fields: ${unknown.join(', ')}.`;

  const name = asTrimmedString(body.name);
  const email = asTrimmedString(body.email);
  const subject = asTrimmedString(body.subject ?? '');
  const message = asTrimmedString(body.message);
  const website = asTrimmedString(body.website ?? '');
  const locale = body.locale ?? 'en';

  const { name: nameLimits, email: emailLimits, subject: subjectLimits, message: messageLimits } =
    MESSAGE_LIMITS;

  if (
    typeof name !== 'string' ||
    name.length < nameLimits.min ||
    name.length > nameLimits.max ||
    LINE_BREAK.test(name)
  ) {
    errors.name = `Name must be between ${nameLimits.min} and ${nameLimits.max} characters.`;
  }

  if (typeof email !== 'string' || email.length > emailLimits.max || !EMAIL_PATTERN.test(email)) {
    errors.email = 'Please provide a valid email address.';
  }

  if (typeof subject !== 'string' || subject.length > subjectLimits.max || LINE_BREAK.test(subject)) {
    errors.subject = `Subject must be at most ${subjectLimits.max} characters.`;
  }

  if (
    typeof message !== 'string' ||
    message.length < messageLimits.min ||
    message.length > messageLimits.max
  ) {
    errors.message = `Message must be between ${messageLimits.min} and ${messageLimits.max} characters.`;
  }

  if (typeof website !== 'string') errors.website = 'Invalid value.';

  if (!SUPPORTED_LOCALES.includes(locale)) {
    errors.locale = `Locale must be one of: ${SUPPORTED_LOCALES.join(', ')}.`;
  }

  return { value: { name, email, subject, message, website, locale }, errors };
}
