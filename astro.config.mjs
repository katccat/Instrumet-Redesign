// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Static multi-page marketing site (default output: 'static').
// Deployed to Netlify — see netlify.toml.
// Styling is hand-authored CSS (see src/styles/) — no Tailwind.
export default defineConfig({
  site: 'https://instru-met.com',
  integrations: [react()],
});
