import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Explicitly set turbopack root to silence multi-lockfile inference warning
  turbopack: {
    root: __dirname
  }
};

export default nextConfig;
