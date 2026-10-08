# ITE SLS 2027 — Florida–Puerto Rico District

Vite + React + TypeScript landing for the Student Leadership Summit.

## UI source of truth

**This repo is the canonical app.** The Tesla redesign (showroom chapters, tokens, forms, interactions) lives in:

- `src/App.tsx` — full landing UI + interactions
- `src/index.css` — Tesla design tokens + component CSS
- `src/data.ts` / `src/galleryData.ts` / `src/types.ts` — content & types
- `src/assets/images/` — summit photography

Open Design prototypes were a visual lab only. Future UI work should be edited **here** (not only in the Open Design HTML dump).

## Run locally

```bash
npm install
npm run dev
```

App: http://localhost:3000

```bash
npm run lint    # tsc --noEmit
npm run build   # production build
```

## Stack

- Vite 6
- React 19
- TypeScript
- Tailwind 4 (available; Tesla styles are custom CSS tokens in `index.css`)
# ITE-SLS-FE
