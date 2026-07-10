# Instru-Met — website

A static, multi-page marketing site for Instru-Met Corporation, built with Astro,
Tailwind CSS v4, and a few shadcn/ui-style React islands. Light mode only at
launch; token structure is dark-mode-ready.

## My Recommendations
For the sake of consistency proper indexing, the historic Intru-Met website from 2012 (hosted at intrumet.com) should exist as a subdomain (either archive or old), and the up-to-date Instru-Met website should be hosted at instrumet.com, with instru-met.com redirecting to it. This is because the corporate email is already @intrumet.com.

## Stack

- **Astro 5** — static multi-page output (default `output: 'static'`).
- **Tailwind CSS v4** — via the official `@tailwindcss/vite` plugin. Tokens are
  CSS-first (`src/styles/globals.css`).
- **React islands** (`@astrojs/react`) — only where interactivity is required:
  the nav mega-menu and the services pill-tabs.
- **View Transitions** — Astro’s `<ClientRouter />` animates page-to-page nav.
- **Content collections** — `posts`, `products`, `industries` with Zod schemas
  (`src/content.config.ts`), authored as Markdown.
- **Deploy** — Netlify (`netlify.toml`, static build → `dist/`).

## Commands

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # serve the build locally
```

## Where to edit things

- **Brand text, contact details, social links, and the nav structure** live in
  one place: [`src/config.js`](src/config.js). Nothing in the
  components hard-codes these.
- **Colors** are all CSS variables in
  [`src/styles/globals.css`](src/styles/globals.css). No component contains a
  color literal — dark mode is a variable swap under
  `:root[data-theme="dark"]` (a commented stub is in the file).
- **Content** is Markdown under `src/content/{posts,products,industries}/`. The
  frontmatter fields are flat, string/enum/date only, and each collection is one
  folder — so a git-based CMS (Sveltia / Decap) can be dropped in with no
  refactor.

## Decisions & assumptions

- **Mega-menu = custom disclosure, not shadcn Popover.** A single owner of
  `openIndex` state gives the cleanest control over the exact required behaviors
  (toggle-same-to-close, switch panels, one-open-at-a-time, outside-click /
  Escape close, focus-in on open, focus-return to trigger on close, and a focus
  trap while open). A Popover-per-item would fight us on “only one open” and on
  moving focus between panels. See
  [`src/components/nav/SiteNav.tsx`](src/components/nav/SiteNav.tsx).
- **Wordmark.** The brief’s naming note is internally contradictory
  (“`Instru-Met` (no hyphen)”). We use the real company brand **Instru-Met** as
  the wordmark, exposed as `site.wordmark` so it’s a one-line change.
- **Accent color.** Royal blue `#4169E1`, exactly as specified
  (`--accent`). The brand blue could not be reliably extracted from the existing
  WordPress theme, so the brief’s hex is authoritative.
- **Contact details.** Taken from the redesign brief (§6), which differs from the
  live site (e.g. `sales@instrumet.com` and the `instrumet.com`-style manager
  addresses vs. the live `instru-met.com`). The brief wins; all values are in
  `site.js` for easy correction.
- **Content split.** Genuine articles → `posts` collection (surfaced on
  Articles + homepage). Service/capability descriptions (calibration, repair,
  custom testers, no-end-of-life) → homepage pill-tabs section and the Services
  page — not blog posts.
- **Posts included.** Three articles that have a verifiable publish date on the
  live site (Cord Capstan Tensile Grip, End-of-Life Instron 5500, Calibration
  for Tensile Testing Equipment). Other write-ups whose dates could not be
  confirmed were kept as product/service content instead of inventing a date.
- **Images.** Real photos from the existing site are reused
  (`public/images/*`). Where a layout needs an image we don’t have (e.g. the
  capstan grip), a **labeled placeholder block** renders instead — see
  [`src/components/Media.astro`](src/components/Media.astro). No placeholder
  imagery is generated.
- **Customer logos.** Only NASA ships as a real asset (`public/logos/nasa.svg`).
  The other named customers render as plain grayscale wordmarks (names supplied
  by the brief), consistent with `logo-array.png`.
- **Industries collection** is scaffolded (schema + folder + sample entries) but
  intentionally **not** surfaced on the homepage — the homepage shows customers.
- **Rounding** is used sparingly: buttons, pills, and small form controls only
  (`--radius`). Cards, sections, and images are square-cornered.
- **Contact form** is wired for Netlify Forms (`data-netlify`), so it works on
  the target host without a backend. It degrades harmlessly elsewhere.

## Accessibility notes

- Skip-to-content link, focus-visible rings on interactive elements, `aria-*`
  wiring on the mega-menu and pill-tabs, focus trap + focus return in the
  mega-menu, and `prefers-reduced-motion` disabling View Transition animations.
