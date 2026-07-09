import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/*
  CONTENT COLLECTIONS

  Three git-backed collections: posts, products, industries. Each uses the
  Astro `glob` loader pointed at a flat folder of Markdown/MDX files, which is
  exactly the shape a git-based CMS (Sveltia or Decap) expects.

  CMS drop-in later (no refactor needed):
    - Point the CMS `folder` at src/content/<collection>.
    - Mirror these Zod fields as CMS `fields` (types line up 1:1).
    - Set the CMS media folder to public/images.
  Schemas are the contract; keep them and the CMS config in sync.
*/

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    // ISO date in frontmatter; coerced to a Date for formatting/sorting.
    date: z.coerce.date(),
    excerpt: z.string(),
    // Category tag shown on cards. Kept as free string so editors can add
    // new ones without a schema change.
    category: z.string(),
    tags: z.array(z.string()).default([]),
    author: z.string().default("Instru-Met"),
    // Public URL path under /images (matches the CMS media folder), so a
    // real photo swap and a CMS upload use the identical field shape.
    cover: z.string().optional(),
    coverAlt: z.string().default(""),
    draft: z.boolean().default(false),
  }),
});

const products = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/products" }),
  schema: z.object({
    title: z.string(),
    // One-line description used on the product-category cards.
    summary: z.string(),
    // Controls left-to-right ordering in the grid.
    order: z.number().default(0),
    icon: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().default(""),
    // Applicable test standards, e.g. "ASTM E4". Rendered as chips.
    standards: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const industries = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/industries" }),
  schema: z.object({
    title: z.string(),
    // Short label shown under the industry icon.
    label: z.string(),
    // Key of the inline SVG icon to render (see src/components/icons/Icon.astro).
    icon: z.string(),
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts, products, industries };
