# Instru-Met — website

A static, multi-page marketing site for Instru-Met Corporation, built with Astro, tokened CSS, and shadcn/ui-style React islands. Light mode only for now, but dark mode could easily be implemented.

## Stack

- **Astro 5** — static multi-page output (default `output: 'static'`).
- **Hand-authored CSS** — tokens and shared styles live in
  `src/styles/` (`globals.css` plus one stylesheet per each concern).
- **React islands** (`@astrojs/react`) — only where interactivity is required:
  the nav mega-menu and the services pill-tabs.
- **View Transitions** — Astro’s `<ClientRouter />` animates page-to-page nav.
- **Content collections** — `posts` and `products` with Zod schemas
  (`src/content.config.ts`), authored as Markdown.
- **Deploy** — Netlify (`netlify.toml`, static build → `dist/`).

## Commands

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # serve the build locally
```

## How to contribute new content

- **Brand text, contact details, social links, and the nav structure** live in
  one place: [`src/config.js`](src/config.js). Nothing in the
  components hard-codes these.
- **Colors** are all CSS variables in
  [`src/styles/globals.css`](src/styles/globals.css).
- **Content** is Markdown under `src/content/{posts,products}/`. The frontmatter fields are flat, string/enum/date only, and each collection is one folder — so a git-based CMS (Sveltia / Decap) can be dropped in with no refactor.