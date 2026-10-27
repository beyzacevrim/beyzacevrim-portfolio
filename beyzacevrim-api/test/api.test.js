import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { setTestEnv, startServer, validMessage } from './helpers.js';

setTestEnv();
const { default: app } = await import('../src/app.js');

// Mail is intentionally not configured here, which also covers the
// "API up, contact form disabled" behaviour. Sending is tested in mail.test.js.
describe('API without mail settings', () => {
  let server;
  before(async () => {
    server = await startServer(app);
  });
  after(() => server.close());

  it('GET /api/health reports ok and unconfigured mail', async () => {
    const { status, json } = await server.request('/api/health');
    assert.equal(status, 200);
    assert.equal(json.success, true);
    assert.equal(json.data.status, 'ok');
    assert.equal(json.data.mail, 'not configured');
  });

  it('unknown routes return a JSON 404', async () => {
    const { status, json } = await server.request('/api/nope');
    assert.equal(status, 404);
    assert.deepEqual(json.error.code, 'NOT_FOUND');
  });

  it('malformed JSON returns 400', async () => {
    const { status, json } = await server.request('/api/contact', { method: 'POST', raw: '{bad' });
    assert.equal(status, 400);
    assert.equal(json.error.code, 'BAD_REQUEST');
  });

  it('invalid fields return 422 with details per field', async () => {
    const { status, json } = await server.request('/api/contact', {
      method: 'POST',
      body: { name: 'A', email: 'nope', message: 'short', locale: 'fr', extra: true },
    });
    assert.equal(status, 422);
    assert.equal(json.error.code, 'VALIDATION_ERROR');
    assert.deepEqual(Object.keys(json.error.details).sort(), ['body', 'email', 'locale', 'message', 'name']);
  });

  it('a valid message returns 503 while mail is not configured', async () => {
    const { status, json } = await server.request('/api/contact', { method: 'POST', body: { ...validMessage, locale: 'tr' } });
    assert.equal(status, 503);
    assert.equal(json.error.code, 'SERVICE_UNAVAILABLE');
  });

  it('allows the configured origin and rejects others', async () => {
    const allowed = await server.request('/api/health', { headers: { Origin: 'http://localhost:5173' } });
    assert.equal(allowed.headers.get('access-control-allow-origin'), 'http://localhost:5173');

    const rejected = await server.request('/api/health', { headers: { Origin: 'https://evil.example' } });
    assert.equal(rejected.status, 403);
    assert.equal(rejected.json.error.code, 'CORS_FORBIDDEN');
  });

  it('sends security headers and hides the framework', async () => {
    const { headers } = await server.request('/api/health');
    assert.equal(headers.get('x-powered-by'), null);
    assert.equal(headers.get('x-content-type-options'), 'nosniff');
  });
});
