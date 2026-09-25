# Bookmark Manager

**Live App:** https://bookmark-manager-eta-ashy.vercel.app/

A fast, minimal bookmark manager that lives entirely in your browser. Save links, mark favorites, search, sort, switch between dark/light mode, and pick a wallpaper — no account, no backend, no database. Everything is stored in `localStorage`.

## Screenshots

| Home | Bookmarks (dark) | Bookmarks (light + wallpaper) |
| --- | --- | --- |
| ![Home screen](docs/screenshots/home.png) | ![Dark mode grid](docs/screenshots/bookmarks-dark.png) | ![Light mode with wallpaper](docs/screenshots/bookmarks-light.png) |

| Add / edit bookmark | Wallpaper picker |
| --- | --- |
| ![Add bookmark modal](docs/screenshots/add-modal.png) | ![Wallpaper picker](docs/screenshots/wallpaper-menu.png) |

## Features

- **Add, edit, delete bookmarks** — name + URL, with the URL auto-prefixed with `https://` if the scheme is missing.
- **Favicons fetched automatically** via Google's favicon service — no manual icon upload.
- **Favorites** — pin bookmarks to a dedicated section at the top of the grid.
- **Search** — filter by name or URL as you type.
- **Sort** — by date added, A–Z, or Z–A.
- **Dark / light theme toggle**, persisted across sessions.
- **Wallpaper backgrounds** — pick from curated categories (nature, ocean, cars, wildlife); wallpapers only render in light mode.
- **No backend** — all data lives in the browser's `localStorage`, so it's private to your device.

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- TypeScript
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) for unit/component tests

## Getting started

```
git clone https://github.com/davidtiger3622/bookmark_manager.git
cd bookmark_manager
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the local dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run the test suite once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage, enforcing the thresholds in `vitest.config.mts` |
| `npm run build-wallpaper-manifest` | Regenerate `public/wallpapers/manifest.json` after adding/removing wallpaper images |

## Testing & coverage

The suite covers every component and lib module. Coverage thresholds are enforced in `vitest.config.mts` (currently ~100% lines/functions, ~98% statements, ~96% branches — the two SSR `typeof window === "undefined"` guards in `storage.ts`/`appearance.ts` are the only intentionally-uncovered branches). CI runs `npm run test:coverage` on every push and pull request to `main` and uploads the HTML report as a workflow artifact.

To view the report locally:

```
npm run test:coverage
open coverage/index.html
```

## Deploying to Vercel

This app is a standard Next.js project, so Vercel needs no extra configuration — a `vercel.json` is included for clarity, but Vercel auto-detects the framework, build command, and output.

**Option A — Git-based (recommended):**

1. Go to [vercel.com/new](https://vercel.com/new) and import `davidtiger3622/bookmark_manager`.
2. Vercel auto-detects Next.js — leave the defaults and click **Deploy**.
3. Every push to `main` redeploys automatically; every pull request gets its own preview URL.

**Option B — Vercel CLI:**

```
npm install -g vercel
vercel login
vercel        # deploy a preview
vercel --prod # deploy to production
```

No environment variables are required — the app has no server-side secrets or external API keys.

## Project structure

```
src/
  app/            # Next.js App Router pages (/, /bookmarks)
  components/     # UI components (grid, modal, menus, toggle)
  lib/            # storage.ts, favicon.ts, appearance.ts — all client-side logic
public/
  wallpapers/     # wallpaper images + generated manifest.json
scripts/
  rename-wallpapers.js  # regenerates the wallpaper manifest
```

## License

MIT — see [LICENSE](LICENSE).
