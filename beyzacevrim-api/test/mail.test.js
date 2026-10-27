import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { after, before, beforeEach, describe, it } from 'node:test';
import { setTestEnv, startServer, validMessage } from './helpers.js';

// A stand-in for the Resend API that records what it receives.
const received = [];
let providerStatus = 200;
const provider = createServer((req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  req.on('end', () => {
    received.push({ headers: req.headers, body: JSON.parse(body) });
    res.writeHead(providerStatus, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(providerStatus === 200 ? { id: 'email_123' } : { message: 'rejected' }));
  });
});
await new Promise((resolve) => provider.listen(0, resolve));

setTestEnv({
  RESEND_API_KEY: 're_test_key',
  RESEND_API_URL: `http://127.0.0.1:${provider.address().port}/emails`,
  CONTACT_TO_EMAIL: 'owner@example.com',
});
const { default: app } = await import('../src/app.js');

describe('contact messages by email', () => {
  let server;
  before(async () => {
    server = await startServer(app);
  });
  after(async () => {
    await server.close();
    provider.close();
  });
  beforeEach(() => {
    received.length = 0;
    providerStatus = 200;
  });

  it('reports mail as configured', async () => {
    const { json } = await server.request('/api/health');
    assert.equal(json.data.mail, 'configured');
  });

  it('emails a valid message as plain text with the visitor as reply-to', async () => {
    const { status, json } = await server.request('/api/contact', {
      method: 'POST',
      body: { ...validMessage, phone: '+90 555 123 45 67', message: '<b>Hello</b>, I need a website.', locale: 'tr' },
    });
    assert.equal(status, 201);
    assert.deepEqual(json, { success: true, data: { received: true } });

    assert.equal(received.length, 1);
    const [{ headers, body }] = received;
    assert.equal(headers.authorization, 'Bearer re_test_key');
    assert.deepEqual(body.to, ['owner@example.com']);
    assert.equal(body.reply_to, 'test@example.com');
    assert.equal(body.subject, 'Portfolio: Hello — Test Person');
    assert.equal(body.html, undefined);
    assert.match(body.text, /Site language: Turkish/);
    assert.match(body.text, /Phone: \+90 555 123 45 67/);
    assert.match(body.text, /<b>Hello<\/b>, I need a website\.$/);
  });

  it('uses a default subject when none is given', async () => {
    const { subject, ...withoutSubject } = validMessage;
    assert.ok(subject);
    await server.request('/api/contact', { method: 'POST', body: withoutSubject });
    assert.equal(received[0].body.subject, 'Portfolio: New message — Test Person');
    assert.doesNotMatch(received[0].body.text, /Phone:/);
  });

  it('returns 503 without leaking details when the provider fails', async () => {
    providerStatus = 500;
    const originalError = console.error;
    console.error = () => {};
    try {
      const { status, json } = await server.request('/api/contact', { method: 'POST', body: validMessage });
      assert.equal(status, 503);
      assert.equal(json.error.code, 'SERVICE_UNAVAILABLE');
      assert.doesNotMatch(JSON.stringify(json), /rejected/);
    } finally {
      console.error = originalError;
    }
  });

  it('sends nothing when the honeypot is filled', async () => {
    const { status } = await server.request('/api/contact', {
      method: 'POST',
      body: { ...validMessage, website: 'https://spam.example' },
    });
    assert.equal(status, 201);
    assert.equal(received.length, 0);
  });
});
