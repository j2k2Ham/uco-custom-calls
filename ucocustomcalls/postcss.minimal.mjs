import tailwind from "@tailwindcss/postcss";

// Minimal PostCSS config used to isolate Turbopack crashes.
// Usage: temporarily rename this file to postcss.config.mjs (after backing up original) and restart dev/build.
const config = { plugins: [tailwind()] };

export default config;
