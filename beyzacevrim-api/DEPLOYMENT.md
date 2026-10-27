# Deployment

Production setup for the whole portfolio on one Linux server (e.g. Ubuntu):

- **Nginx** serves the built client (`beyzacevrim-client/dist`) and forwards `/api/*` to the API.
- **PM2** keeps the API (`beyzacevrim-api`) running on `127.0.0.1:5050`.
- **MongoDB** stores contact form messages and listens on localhost only.

Client and API share one domain, so the browser calls `/api/...` on the same origin.

Replace `example.com` with the real domain throughout.

## 1. Server prerequisites

- Node.js 20 or newer, npm
- MongoDB (bound to `127.0.0.1`, ideally with authentication enabled)
- Nginx, Certbot
- PM2: `sudo npm install -g pm2`

## 2. API

```bash
cd /var/www/beyzacevrim-api
npm ci --omit=dev
cp .env.example .env
```

Edit `.env`:

```dotenv
NODE_ENV=production
PORT=5050
MONGODB_URI=mongodb://<user>:<password>@127.0.0.1:27017/beyzacevrim-portfolio?authSource=admin
CORS_ORIGINS=https://example.com,https://www.example.com
TRUST_PROXY=true
CONTACT_RATE_LIMIT_MAX=5
```

- `CORS_ORIGINS` must contain the site's own address. Browsers send an `Origin` header on form submissions even on the same domain.
- `TRUST_PROXY=true` lets rate limiting see real visitor IPs behind Nginx.

Start it and make it survive reboots:

```bash
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup        # run the command it prints
curl http://127.0.0.1:5050/api/health
```

## 3. Client

Build on the server (or locally, then upload `dist/`):

```bash
cd /var/www/beyzacevrim-client
npm ci
npm run build      # VITE_API_URL stays empty: the API is on the same domain
```

## 4. Nginx and HTTPS

Use [deploy/nginx.conf.example](deploy/nginx.conf.example). Its comments list the commands to enable the site and to add HTTPS with Certbot.

Check afterwards:

- `https://example.com` loads the site.
- `https://example.com/solutions/websites` loads directly (not a 404).
- `https://example.com/api/health` returns `"database": "connected"`.
- Sending the contact form shows the success message.

## Reading messages

```bash
cd /var/www/beyzacevrim-api
npm run messages                 # latest 20
npm run messages -- --limit 50 --full
```

## Updating

```bash
# API
git pull && npm ci --omit=dev && pm2 reload beyzacevrim-api
# Client
git pull && npm ci && npm run build
```

Logs: `pm2 logs beyzacevrim-api`. They are JSON lines and never contain message contents or credentials.
