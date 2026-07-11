import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Content collections are structured so a git-based CMS (Sveltia / Decap) can
// be dropped in later with no refactor: flat Markdown files + a folder each,
// string/enum/date fields only, and image paths as plain strings.

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    // Optional: video posts link straight out to YouTube, so they carry no
    // article description/body.
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    // When set, the article card links out to this video (opens externally)
    // instead of the internal article page. YouTube URLs get an auto-derived
    // thumbnail; see src/lib/youtube.ts.
    videoUrl: z.string().url().optional(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).optional(),
  }),
});

const products = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/products" }),
  schema: z.object({
    name: z.string(),
    category: z.enum(["Load Cells", "Grips & Fixtures", "Load Frames"]),
    summary: z.string(),
    image: z.string().optional(),
    order: z.number().default(0),
  }),
});

// Scaffolded for future use — NOT surfaced on the homepage (which shows
// customers, per the brief). Schema + directory kept in place for a CMS.
const industries = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/industries" }),
  schema: z.object({
    name: z.string(),
    summary: z.string(),
    logo: z.string().optional(),
    order: z.number().default(0),
  }),
});

export const collections = { posts, products, industries };
