// Lists the most recent contact form messages. Read-only.
// Usage: npm run messages            (latest 20)
//        npm run messages -- --limit 50
//        npm run messages -- --full  (show whole message bodies)
import { parseArgs } from 'node:util';
import mongoose from 'mongoose';
import config, { assertConfig } from '../src/config/env.js';
import Message from '../src/models/Message.js';

const { values } = parseArgs({
  options: {
    limit: { type: 'string', default: '20' },
    full: { type: 'boolean', default: false },
  },
});

const limit = Math.min(Math.max(Number.parseInt(values.limit, 10) || 20, 1), 500);
const PREVIEW = 160;

try {
  assertConfig();
  await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 5000 });

  const [messages, total] = await Promise.all([
    Message.find().sort({ createdAt: -1 }).limit(limit).lean(),
    Message.countDocuments(),
  ]);

  if (messages.length === 0) {
    console.log('No messages yet.');
  } else {
    console.log(`Showing ${messages.length} of ${total} message(s), newest first.\n`);
    for (const msg of messages) {
      const body = values.full || msg.message.length <= PREVIEW ? msg.message : `${msg.message.slice(0, PREVIEW)}…`;
      const date = new Date(msg.createdAt).toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' });
      console.log(`● ${date}  [${(msg.locale || 'en').toUpperCase()}]  ${msg.name} <${msg.email}>`);
      if (msg.subject) console.log(`  Subject: ${msg.subject}`);
      console.log(`  ${body.replace(/\n/g, '\n  ')}\n`);
    }
  }
} catch (err) {
  console.error(`Could not read messages: ${err.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
