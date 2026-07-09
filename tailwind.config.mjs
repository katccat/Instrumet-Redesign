/** @type {import('tailwindcss').Config} */
export default {
  // Light mode only. No `darkMode` strategy, no `dark:` variants anywhere.
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      // Colors are wired to the CSS custom properties declared in
      // src/styles/globals.css (the token layer). Changing a brand color is a
      // one-line edit there, not in this file.
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      // Square corners everywhere. The token is 0; these aliases exist only so
      // any shadcn component that references rounded-* still resolves to 0.
      borderRadius: {
        none: "0",
        sm: "var(--radius)",
        DEFAULT: "var(--radius)",
        md: "var(--radius)",
        lg: "var(--radius)",
        xl: "var(--radius)",
        "2xl": "var(--radius)",
        "3xl": "var(--radius)",
        full: "9999px",
      },
      fontFamily: {
        // Single family for display and body. Hierarchy = weight/size/spacing.
        sans: ["Inter Variable", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
      },
      maxWidth: {
        prose: "68ch",
      },
      keyframes: {
        // Hero Ken Burns: a very slow, low-amplitude zoom/pan. Plain CSS only.
        kenburns: {
          "0%": { transform: "scale(1) translate3d(0, 0, 0)" },
          "100%": { transform: "scale(1.08) translate3d(-1.5%, -1.5%, 0)" },
        },
      },
      animation: {
        kenburns: "kenburns 24s ease-out both",
      },
    },
  },
  plugins: [],
};
