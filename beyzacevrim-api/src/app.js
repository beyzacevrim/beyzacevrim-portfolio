import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import config from './config/env.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import requestLogger from './middleware/requestLogger.js';
import routes from './routes/index.js';

const app = express();

app.disable('x-powered-by');
if (config.trustProxy) app.set('trust proxy', 1);

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      // Requests without an Origin header (curl, health checks, same-origin) are allowed.
      if (!origin || config.corsOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    maxAge: 600,
  }),
);
app.use(express.json({ limit: '20kb' }));
app.use(requestLogger);

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
