import assert from 'node:assert/strict';
import { after, before, it } from 'node:test';
import { setTestEnv, startServer } from './helpers.js';

// Each test file runs in its own process, so this low limit does not affect other tests.
setTestEnv({ CONTACT_RATE_LIMIT_MAX: '2' });
const { default: app } = await import('../src/app.js');

let server;
before(async () => {
  server = await startServer(app);
});
after(() => server.close());

it('limits contact submissions per client', async () => {
  const statuses = [];
  for (let i = 0; i < 3; i += 1) {
    statuses.push((await server.request('/api/contact', { method: 'POST', body: {} })).status);
  }
  assert.deepEqual(statuses, [422, 422, 429]);
});
