# Beyza Çevrim — Portfolio

Personal portfolio site in English, Turkish, Spanish and German.

- [`beyzacevrim-client/`](beyzacevrim-client) — React + Vite + Tailwind site
- [`beyzacevrim-api/`](beyzacevrim-api) — Express + MongoDB API for the contact form

## Local development

```bash
cd beyzacevrim-api && npm install && cp .env.example .env && npm run dev
cd beyzacevrim-client && npm install && npm run dev
```

## Deploying the site on Vercel

Import this repository on Vercel and set **Root Directory** to `beyzacevrim-client`.
Vercel detects Vite automatically (`npm run build`, output `dist`).
Set `VITE_API_URL` to the public API address once the API is deployed.
