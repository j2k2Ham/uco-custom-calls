import tailwind from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";

// Tailwind v4 PostCSS plugin chain with autoprefixer
const config = {
  plugins: [tailwind(), autoprefixer()]
};

export default config;
