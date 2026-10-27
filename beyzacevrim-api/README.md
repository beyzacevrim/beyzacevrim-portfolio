# beyzacevrim-api

REST API for the Beyza Çevrim portfolio. Node.js, Express 5, MongoDB with Mongoose, ES modules.

The portfolio content itself lives in the client (`beyzacevrim-client/src/data`). This API stores contact form messages and reports health.

## Setup

```bash
cp .env.example .env   # then adjust values
npm install
npm run dev            # node --watch, restarts on change
npm start              # plain node
npm test               # node:test, no database needed
npm run messages       # list the latest contact messages (-- --limit 50 --full)
```

The default port is **5050**, because macOS AirPlay Receiver occupies 5000.

## Endpoints

| Method | Path           | Description |
| ------ | -------------- | ----------- |
| GET    | `/api/health`  | API status and database connection state |
| POST   | `/api/contact` | Store a contact message `{ name, email, subject?, message, locale? }` (`locale`: `en`, `tr`, `es` or `de`) |

Responses use `{ "success": true, "data": … }` or `{ "success": false, "error": { "code", "message", "details?" } }`.

`POST /api/contact` returns 201, 400 (malformed JSON), 422 (validation), 429 (rate limit: 5 per 15 min per IP by default) or 503 (database unavailable).

## Notes

- The HTTP server starts even if MongoDB is unreachable. It retries the connection every 5 seconds, `/api/health` reports `"database": "disconnected"`, and contact submissions return 503.
- CORS only allows the origins listed in `CORS_ORIGINS`.
- Read stored messages with `npm run messages`.

## Production

See [DEPLOYMENT.md](DEPLOYMENT.md): PM2, Nginx (template in `deploy/`), HTTPS and environment values.
