# Beyza Çevrim — Portfolio

Personal portfolio site in English, Turkish, Spanish and German.

- [`beyzacevrim-client/`](beyzacevrim-client) — React + Vite + Tailwind site
- [`beyzacevrim-api/`](beyzacevrim-api) — Express API that emails contact form messages (Resend)

## Local development

```bash
cd beyzacevrim-api && npm install && cp .env.example .env && npm run dev
cd beyzacevrim-client && npm install && npm run dev
```

## Deploying

Both parts run on Vercel as separate projects from this repository (Root Directory `beyzacevrim-client` and `beyzacevrim-api`).
Step by step: [beyzacevrim-api/DEPLOYMENT.md](beyzacevrim-api/DEPLOYMENT.md).
