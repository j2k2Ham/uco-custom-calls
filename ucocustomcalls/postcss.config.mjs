import tailwind from "@tailwindcss/postcss";

// Tailwind v4 PostCSS plugin: using reference directly avoids malformed config errors
const config = {
  plugins: [tailwind]
};

export default config;
