# Instru-Met Website — Full Redesign (Agent Brief)

## 1. Objective
Redesign the Instru-Met website **from scratch** as a static, multi-page marketing site. Rebuild the information architecture and visuals; do not port the old markup.

## 2. Content sourcing rules (read first)
- The source of truth for all copy, product names, services, and facts is the existing site: **https://instru-met.com**. Crawl it and reuse real information.
- **Do not invent information.** No fabricated stats, quotes, client names, dates, or product specs.
- When real content is genuinely missing and something is needed to complete a layout, insert a clearly marked placeholder in the format `[PLACEHOLDER: description]` (for text) so it is trivially greppable. Never disguise a placeholder as real content.
- Inspiration references live at `/_assets/inspirations/` in this repo (`pill-tabs.png`, `logo-array.png`, `articles.png`). Treat these as **layout/visual references only**, not content. If any referenced file is missing, note it and approximate the described layout.
- **Naming:** the wordmark text and company name is **`Instru-Met`** (no hyphen); let it and other things like external links be changed through a js config file.

## 3. Tech stack
- **Astro** (latest), configured as a **static multi-page site**.
- **Tailwind CSS** via the official Astro integration.
- **shadcn/ui** components, adapted for Astro. React island integration via `@astrojs/react`.
- Astro **built-in View Transitions** for page-to-page transitions.
- **Light mode only** for launch (see design tokens for dark-mode readiness).
- **Content collections** for `posts`, `products`, and `industries` using Markdown/MDX with **Zod schemas**. No CMS wired up yet, but structure content directories and frontmatter so a **git-based CMS (Sveltia or Decap)** can be dropped in later with no refactor.
- **Deploy target: Netlify.** Include a working `netlify.toml`.

### TypeScript policy
Keep TypeScript to a minimum. Use it **only where it is effectively required**:
- content-collection schema definitions (Zod)
- interactive React island components (shadcn/ui ships as `.tsx`)
- `astro.config.*` if the template requires it

Everywhere else, **prefer plain `.astro` and avoid TypeScript**: no hand-authored complex generics/utility types, no TS-heavy abstractions where markup or config suffices. Strict mode is **not** required. The goal is a codebase that's easy to hand-edit.

## 4. Design tokens & visual rules
- **Background:** white.
- **Accent color:** royal blue, exposed as a CSS variable (e.g. `--color-accent`). Use `#4169E1`.
- **Dark mode:** not enabled now, but define **all** colors as CSS variables so dark mode is a variable swap later — no hardcoded color literals in components.
- **Border radius:** use rounding **sparingly** — pick a small, consistent set of places (e.g. buttons).
- **Eyebrow/kicker text:** styled but **not fully uppercase**.
- **Images:** **do not generate placeholder images.** Where an image is required by a layout but none exists, render a labeled placeholder element (a `div` with fixed dimensions, a subtle border/fill, and centered text like `Image: product photo`). Real images from the existing site may be reused.

## 5. Navbar

**Upper tier**
- Logo (`/_assets/logo.svg`) alongside the wordmark **`InstruMet`**
- Tagline: **50 years of service**
- Contact

**Lower tier (nav links)**
- **Products**
  - Load Cells
  - Grips & Fixtures
  - Load Frames
- **Services**
  - Calibration/Verification *(merge the old "Tensile Tester Service & Calibration" into this)*
  - Repair
- **Articles**
- **About**

### Mega-menu behavior (follow closely)
- Clicking a nav item **with a dropdown** opens a wide mega-menu panel below the header. Clicking the **same** item again closes it. Clicking a **different** item switches to that item's panel.
- Clicking **outside** the panel closes it. Pressing **Escape** closes it.
- **Never open on hover.** Click only.
- Panel spans the **full viewport width**, anchored to the header, generous padding.
- Panel layout: **left column** = category links in a vertical stack; **right area** = **two featured content cards side by side**. Each card = image on top, heading, short description, and an arrow link (e.g. "Learn More", "Start Now").
- The active nav item shows a visual indicator (underline or accent bar) while its panel is open.
- **Only one panel open at a time.**
- On open, move focus **into** the panel; on close, return focus to the trigger. **Trap focus** within the panel while open.
- Implement as a **React island** (interactive state + keyboard handling). Use shadcn's Popover **or** a custom disclosure — pick whichever gives cleaner keyboard behavior, and note which you chose.
- **Mobile:** collapse to a standard hamburger menu with the same categories as an accordion or stacked list. The mega-menu layout is **desktop only**.

## 6. Pages
- **Home** (see §8)
- **Products** (+ the three product subpages/sections)
- **Services** (Calibration/Verification, Repair)
- **Articles** — index of the `posts` collection
- **About**
- **Contact**
  - Phone: **(908) 851-0700**
  - Email: **sales@instrumet.com**
  - Fax: **908-686-1688**
  - Service Manager: **Paul Metzger** — **paulmetzger@instrumet.com**
  - Production Manager: **Ward Ruoff** — **wardruoff@instrumet.com**

### Content-split task (important)
The current homepage mixes true articles with descriptions of Instru-Met services. During the redesign, **split** them:
- Genuine blog posts / news → `posts` collection, surfaced on **Articles**.
- Service descriptions → homepage service content (the pill-tabs section, see §8), **not** blog posts.
Use `/_assets/inspirations/pill-tabs.png` as the reference for the service presentation.

## 7. Content collections (frontmatter)
Define Zod schemas and directory structure that a git-based CMS can adopt directly. Suggested minimum fields (extend as the real content requires, but keep them CMS-friendly):

- **posts** (`src/content/posts/`): `title`, `description`, `pubDate`, `updatedDate?`, `heroImage?`, `draft` (default false), `tags?`
- **products** (`src/content/products/`): `name`, `category` (enum: Load Cells | Grips & Fixtures | Load Frames), `summary`, `image?`, `order?`
- **industries** (`src/content/industries/`): `name`, `summary`, `logo?`, `order?`
  - *Note: the `industries` collection is scaffolded for future use and is **not** surfaced on the homepage (the homepage shows customers, per §8). Keep the schema and directory in place.*

## 8. Home page sections/components
1. **Accreditations/certifications** — vertical array (similar to a logo grid but vertical). **A2LA certified is the most important**, feature it prominently.
2. **Customers served** — a grid of customer logos (NASA, Lockheed Martin, Gorilla Glue, Polo, Intuitive). Reference: `/_assets/inspirations/logo-array.png`. Some existing logos are in /_assets/logos/.
3. **Services with pill tabs** — pill tabs switch the content shown below them. Reference: `/_assets/inspirations/pill-tabs.png`. Content comes from the service descriptions split out in §6.
4. **Articles section** — styled per `/_assets/inspirations/articles.png`, pulling from the `posts` collection.

## 9. Footer
- Copyright
- Address
- Phone
- Email
- Some useful links
- **No** link to terms of service
- **Follow us:**
  - YouTube — https://www.youtube.com/@instrumetcorporation
  - Facebook — https://www.facebook.com/p/Instru-Met-Corporation-100063479472507/

## 10. Definition of done (acceptance criteria)
- The production build completes with **no errors**.
- All pages in §6 exist and are reachable from the nav/footer.
- Mega-menu passes every behavior in §5: toggle-same-to-close, switch panels, outside-click close, Escape close, no hover-open, focus moves in/out, focus trapped, single panel at a time, active indicator shown.
- Mobile hamburger works; mega-menu layout does not appear on mobile.
- View Transitions animate page-to-page navigation.
- All colors are CSS variables; no hardcoded color literals; dark mode would be a variable swap.
- TypeScript surface is minimal per §3.
- No generated placeholder images; missing images are labeled placeholder blocks.
- No invented content; every placeholder is marked `[PLACEHOLDER: ...]` and greppable.
- `netlify.toml` present and correct for a static Astro build.
- Content collections build from Zod-validated Markdown/MDX and are structured for a drop-in git CMS.
- A short `README` (or `NOTES`) lists any decisions made (e.g. Popover vs. custom disclosure) and any assumed defaults (e.g. accent hex if the brand blue couldn't be extracted).
