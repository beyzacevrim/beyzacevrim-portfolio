// Vercel entry point: the Express app runs as a serverless function.
// vercel.json routes every /api/* request here; locally, src/server.js is used instead.
import app from '../src/app.js';

export default app;
