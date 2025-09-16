#!/usr/bin/env node
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

// Basic health checks after a Webpack (classic) build.
// Exits non-zero if critical build outputs are missing.

const root = process.cwd();
const nextDir = join(root, '.next');
const checks = [
  { name: 'next dir', path: nextDir, required: true },
  { name: 'pages manifest (app build)', path: join(nextDir, 'app-build-manifest.json'), required: true },
];

let failed = false;
for (const c of checks) {
  if (!existsSync(c.path)) {
    console.error(`[verify-build] MISSING: ${c.name} at ${c.path}`);
    if (c.required) failed = true;
  } else {
    try {
      const size = statSync(c.path).size;
      console.log(`[verify-build] OK: ${c.name} (${size} bytes)`);
    } catch (e) {
      console.error(`[verify-build] ERROR reading ${c.path}:`, e.message);
      failed = true;
    }
  }
}

// Detect absent server/app tree (Turbopack bug scenario) but do not fail for classic build.
const serverAppPath = join(nextDir, 'server', 'app');
if (!existsSync(serverAppPath)) {
  console.warn('[verify-build] WARN: `.next/server/app` missing (expected if using classic Webpack with only client components).');
}

if (failed) {
  console.error('[verify-build] Build verification FAILED');
  process.exit(1);
} else {
  console.log('[verify-build] Build verification PASSED');
}
