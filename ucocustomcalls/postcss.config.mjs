import tailwind from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";

// Restored full config (Tailwind + Autoprefixer) after isolation test
const config = { plugins: [tailwind(), autoprefixer()] };

export default config;
