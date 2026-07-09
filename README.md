# Instru-Met Corporation

Company site for Instru-Met, a strength of materials test equipment company. Static, multi-page, built with Astro, Tailwind CSS, and a
small set of shadcn/ui React islands.

## Stack

- **Astro** (static output, TypeScript strict) with built-in View Transitions
- **Tailwind CSS** via the official `@astrojs/tailwind` integration
- **shadcn/ui** primitives (Button, Card, Input) adapted for Astro, rendered
  through `@astrojs/react`
- **Content Collections** for `posts`, `products`, and `industries`
  (Markdown/MDX + Zod schemas)
- **Netlify** deploy target (`netlify.toml`)

## Run locally

```bash
npm install
npm run dev      # http://localhost:4321
```

Other scripts:

```bash
npm run build    # astro check (typecheck) then astro build -> dist/
npm run preview  # serve the production build locally
```

Requires Node 20+ (Netlify is pinned to Node 22 in `netlify.toml`).

## Project structure

```
src/
  components/
    home/        # Home page sections (Hero, ProductCategories, ...)
    nav/         # SiteNav React island + navData
    ui/          # shadcn primitives (button, card, input), radius forced to 0
    icons/       # single inline-SVG Icon.astro, keyed by name
    Header.astro Footer.astro NewsletterForm.tsx
  content/       # Markdown content collections (see below)
  content.config.ts
  layouts/BaseLayout.astro   # header + footer + <ClientRouter/> transitions
  pages/         # index + products/ industries/ news/ + static pages
  styles/globals.css         # token layer (CSS variables) -> Tailwind theme
public/images/   # placeholder SVGs; swap for real photos, keep filenames
```

## Design tokens

All color, radius, and shadow values live as CSS custom properties in
[`src/styles/globals.css`](src/styles/globals.css) and are mapped to Tailwind
utilities in [`tailwind.config.mjs`](tailwind.config.mjs). To rebrand, edit the
`:root` block; do not hardcode colors in components. The single accent is a dark
navy (`--primary`). `--radius` is `0` (square corners everywhere).

## Content: adding entries

Content is plain Markdown under `src/content/<collection>/`. Frontmatter is
validated by the Zod schemas in
[`src/content.config.ts`](src/content.config.ts). Filenames become URL slugs
(the entry `id`).

### Add a post

Create `src/content/posts/my-post.md`:

```markdown
---
title: My Post Title
date: 2026-02-01
excerpt: One or two sentences shown on the card and in meta tags.
category: Calibration Services
tags: ["astm e4", "calibration"]
author: admin
cover: /images/post-calibration.svg
coverAlt: Description of the image
draft: false
---

Body copy in Markdown.
```

It appears automatically on `/news`, and (if among the three newest) on the home
page. Set `draft: true` to hide it from the build.

### Add a product

Create `src/content/products/my-product.md`:

```markdown
---
title: My Product
summary: One line shown on the product-category card.
order: 7
icon: frame            # key from src/components/icons/Icon.astro
image: /images/product-load-frames.svg
imageAlt: Description
standards: ["ASTM E4"]
featured: false
draft: false
---

Body copy in Markdown.
```

`order` controls grid position. `icon` must match a key in `Icon.astro`.

### Add an industry

Create `src/content/industries/my-industry.md`:

```markdown
---
title: My Industry
label: My Industry
icon: aerospace        # key from src/components/icons/Icon.astro
order: 9
draft: false
---

Optional body copy shown on the industry detail page.
```

### Images

Reference images by public path (`/images/...`). Placeholders in
`public/images/` are marked SVGs; replace a file with a real photo and keep the
filename so no content edits are needed. New uploads also go in `public/images`.

## Plugging in a git-based CMS later

The content structure is already CMS-shaped, so **Sveltia CMS** or **Decap CMS**
drops in without refactoring:

1. Add an admin entry (for example `public/admin/index.html`) that loads the CMS
   bundle, plus a `config.yml`.
2. In `config.yml`, set:
   - `media_folder: "public/images"` and `public_folder: "/images"` (this is why
     image fields store `/images/...` paths, not `import`ed assets).
   - one `collection` per folder: `folder: "src/content/posts"` (and `products`,
     `industries`).
   - `fields` mirroring the Zod schema in `src/content.config.ts` one-to-one
     (title, date, excerpt, category, tags, cover, draft, and so on).
3. Wire the backend (`git-gateway` for Netlify Identity, or `github`).

Keep `config.yml` fields and the Zod schemas in sync; the schema is the
contract.

## Deploy (Netlify)

`netlify.toml` sets `command = "npm run build"` and `publish = "dist"`. Connect
the repo in Netlify and it builds on push. No adapter is required for a fully
static site.