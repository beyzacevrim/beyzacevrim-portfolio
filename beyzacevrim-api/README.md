# beyzacevrim-api

REST API for the Beyza Çevrim portfolio. Node.js, Express 5, ES modules.

The portfolio content itself lives in the client (`beyzacevrim-client/src/data`). This API receives contact form messages, emails them to the site owner through [Resend](https://resend.com), and reports health. Nothing is stored.

## Setup

```bash
cp .env.example .env   # then adjust values
npm install
npm run dev            # node --watch, restarts on change
npm start              # plain node
npm test               # node:test, no network needed
```

The default port is **5050**, because macOS AirPlay Receiver occupies 5000.

Leave `RESEND_API_KEY` empty to run without sending mail; the contact form then returns 503.

## Endpoints

| Method | Path           | Description |
| ------ | -------------- | ----------- |
| GET    | `/api/health`  | API status and whether mail is configured |
| POST   | `/api/contact` | Email a contact message `{ name, email, subject?, message, locale? }` (`locale`: `en`, `tr`, `es` or `de`) |

Responses use `{ "success": true, "data": … }` or `{ "success": false, "error": { "code", "message", "details?" } }`.

`POST /api/contact` returns 201, 400 (malformed JSON), 422 (validation), 429 (rate limit: 5 per 15 min per IP by default) or 503 (mail not configured or the provider failed).

## Notes

- The email is plain text, and its reply-to is the visitor's address, so replying in the mail app answers them directly.
- Name and subject may not contain line breaks, because they go into the email subject line.
- CORS only allows the origins listed in `CORS_ORIGINS`.
- Logs never contain message contents or credentials.

## Production

See [DEPLOYMENT.md](DEPLOYMENT.md): Vercel and Resend setup, or an own server with PM2 and Nginx.
