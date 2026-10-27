// Test environment. Set before the app is imported, because config is read once at import time.
// dotenv never overrides variables that are already set, so a local .env does not leak in.
export function setTestEnv(overrides = {}) {
  Object.assign(process.env, {
    NODE_ENV: 'test',
    RESEND_API_KEY: '',
    CONTACT_TO_EMAIL: '',
    CORS_ORIGINS: 'http://localhost:5173',
    CONTACT_RATE_LIMIT_MAX: '1000',
    ...overrides,
  });
}

// Starts an Express app on a random port and returns a small fetch helper.
export async function startServer(app) {
  const server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  const base = `http://127.0.0.1:${server.address().port}`;

  const request = async (path, { method = 'GET', body, raw, headers = {} } = {}) => {
    const res = await fetch(base + path, {
      method,
      headers: body !== undefined || raw ? { 'Content-Type': 'application/json', ...headers } : headers,
      body: raw ?? (body !== undefined ? JSON.stringify(body) : undefined),
    });
    return { status: res.status, headers: res.headers, json: await res.json().catch(() => null) };
  };

  return { request, close: () => new Promise((resolve) => server.close(resolve)) };
}

export const validMessage = {
  name: 'Test Person',
  email: 'test@example.com',
  subject: 'Hello',
  message: 'I would like a website for my business.',
};
