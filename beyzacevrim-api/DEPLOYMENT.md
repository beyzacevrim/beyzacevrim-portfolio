# Deployment

The portfolio runs on Vercel as two projects from the same GitHub repository:

| Project | Root Directory | Address |
| ------- | -------------- | ------- |
| Site    | `beyzacevrim-client` | `https://beyzacevrim.vercel.app` |
| API     | `beyzacevrim-api`    | e.g. `https://beyzacevrim-api.vercel.app` |

Contact form messages are emailed through [Resend](https://resend.com). Nothing is stored.

## 1. Resend

1. Sign up at resend.com with the address that should receive the messages.
2. **API Keys → Create API Key**, permission "Sending access". Copy the key (`re_...`); it is shown once.

Without a verified domain, Resend sends from `onboarding@resend.dev` and only delivers to the account's own address. That is enough here, because every message goes to the site owner. With an own domain later, verify it in Resend and set `CONTACT_FROM_EMAIL`.

## 2. API project on Vercel

**Add New → Project**, import the repository, set **Root Directory** to `beyzacevrim-api`, and add these **Environment Variables** before deploying:

```dotenv
NODE_ENV=production
CORS_ORIGINS=https://beyzacevrim.vercel.app
TRUST_PROXY=true
RESEND_API_KEY=re_...
CONTACT_TO_EMAIL=<the Resend account's email>
```

`api/index.js` exports the Express app and `vercel.json` routes `/api/*` to it. After deploying, `https://<api-address>/api/health` should return `"mail": "configured"`.

## 3. Site project

In the site project: **Settings → Environment Variables** → `VITE_API_URL=https://<api-address>` (no trailing slash), then **Deployments → ⋯ → Redeploy**. Vite reads the variable at build time, so a redeploy is required.

## Notes

- Changing an environment variable needs a redeploy of that project.
- Rate limiting is kept in memory per running instance. On Vercel it is a soft limit, not a guarantee.
- Preview deployments of the site have different addresses; the form works there only if that address is added to `CORS_ORIGINS`.

## Own server (alternative)

The API also runs as a normal Node process: `npm ci --omit=dev`, fill `.env`, then `pm2 start ecosystem.config.cjs --env production`. [deploy/nginx.conf.example](deploy/nginx.conf.example) serves the built client and proxies `/api` on one domain; in that setup `VITE_API_URL` stays empty and `CORS_ORIGINS` is the site's own address.
