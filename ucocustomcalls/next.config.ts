import type { NextConfig } from "next";

// Using default Turbopack root inference. Previous explicit root override removed
// after it caused a missing app-build-manifest during dev (ENOENT). If multi-lockfile
// warnings reappear, address by ensuring only one package manager lockfile exists
// at the repo root rather than forcing a custom root.
const nextConfig: NextConfig = {};

export default nextConfig;
