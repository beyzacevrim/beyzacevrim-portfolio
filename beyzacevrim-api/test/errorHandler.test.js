import assert from 'node:assert/strict';
import { after, before, it } from 'node:test';
import express from 'express';
import { setTestEnv, startServer } from './helpers.js';

// Production mode: unexpected errors must not reveal their message or stack trace.
setTestEnv({ NODE_ENV: 'production' });
const { errorHandler } = await import('../src/middleware/errorHandler.js');

const app = express();
app.get('/boom', () => {
  throw new Error('secret database password is hunter2');
});
app.use(errorHandler);

let server;
before(async () => {
  server = await startServer(app);
});
after(() => server.close());

it('returns a generic 500 without internal details in production', async () => {
  const originalError = console.error;
  console.error = () => {}; // the handler logs the error; keep test output clean
  try {
    const { status, json } = await server.request('/boom');
    assert.equal(status, 500);
    assert.deepEqual(json, { success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred.' } });
  } finally {
    console.error = originalError;
  }
});
