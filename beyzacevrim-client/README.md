# beyzacevrim-client

Portfolio frontend for Beyza Çevrim. React 19, Vite, Tailwind CSS 4, React Router, Lucide icons. JavaScript only.

## Setup

```bash
cp .env.example .env   # VITE_API_URL can stay empty (see the file)
npm install
npm run dev            # http://localhost:5173
npm run build          # production build in dist/
npm run lint
npm test               # node:test: locale completeness, content policy, formatting, terminal
```

## Structure

- `src/i18n/locales/{en,tr,es,de}.js`: all visible text, one file per language with identical keys. Edit wording here.
- `src/data/`: language-independent structure (solution types, themes, dates, links). Text for each entry lives in the locale files under the same id.
- The site lists **types of digital solutions** (`src/data/solutions.js`), never real client or company projects.
- Copy is written for non-technical visitors who want software built: plain, warm and inviting.
- The language is chosen from the switcher (or the terminal's `lang` command), remembered in localStorage, and on a first visit detected from the browser (English fallback).
- `src/sections/`: home page sections. `src/pages/`: routed pages (`/`, `/solutions/:slug`, 404).
- `src/components/`: reusable UI, including the interactive terminal and contact form.
- `src/utils/terminalCommands.js`: terminal command definitions.
- `src/services/`: API client (only the contact form talks to the API).

The site renders without the API. Only the contact form needs `beyzacevrim-api` and MongoDB.

## Deployment

See `beyzacevrim-api/DEPLOYMENT.md`. The built client is served by Nginx on the same domain as the API, so `VITE_API_URL` stays empty in production. `/solutions/:slug` uses client-side routing, so the server falls back to `index.html`; the Nginx template already does this.
