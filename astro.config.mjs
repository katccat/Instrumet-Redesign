// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// Static multi-page marketing site (default output: 'static').
// Deployed to Netlify — see netlify.toml.
export default defineConfig({
  site: 'https://instru-met.com',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
