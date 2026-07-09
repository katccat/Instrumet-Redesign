// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

// Static multi-page site. View Transitions are opted-in per layout via
// <ClientRouter /> (see src/layouts/BaseLayout.astro), not globally forced.
export default defineConfig({
  site: "https://www.instru-met.com",
  output: "static",
  integrations: [
    react(),
    // applyBaseStyles:false keeps Tailwind's preflight out of the injected
    // stylesheet so we control the full base layer in src/styles/globals.css.
    tailwind({ applyBaseStyles: false }),
  ],
});
