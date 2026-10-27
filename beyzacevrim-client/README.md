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

The site renders without the API. Only the contact form needs `beyzacevrim-api`, which emails the messages.

## Deployment

See `beyzacevrim-api/DEPLOYMENT.md`. On Vercel the site and the API are separate projects, so `VITE_API_URL` is set to the API's address. `/solutions/:slug` uses client-side routing; `vercel.json` falls back to `index.html`.
