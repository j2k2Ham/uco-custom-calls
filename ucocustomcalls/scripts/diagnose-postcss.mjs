import path from 'node:path';
import fs from 'node:fs';

// Lightweight resolver: dynamically import the postcss config and display plugin identities.
(async () => {
  const cwd = process.cwd();
  const configPath = path.join(cwd, 'postcss.config.mjs');
  if (!fs.existsSync(configPath)) {
    console.error('[diagnose-postcss] No postcss.config.mjs found at project root');
    process.exit(1);
  }
  let config;
  try {
    config = (await import(path.toNamespacedPath(configPath))).default;
  } catch (e) {
    console.error('[diagnose-postcss] Failed to import config:', e);
    process.exit(1);
  }

  let plugins = [];
  if (Array.isArray(config?.plugins)) {
    plugins = config.plugins;
  } else if (config?.plugins && typeof config.plugins === 'object') {
    plugins = Object.entries(config.plugins).map(([name, opts]) => ({ name, options: opts }));
  }

  const normalized = plugins.map(p => {
    if (typeof p === 'function') {
      return { name: p().postcssPlugin || p.name || '(anonymous fn)', type: 'fn-call' };
    }
    if (p && typeof p === 'object' && p.postcssPlugin) {
      return { name: p.postcssPlugin, type: 'object' };
    }
    if (Array.isArray(p)) {
      return { name: p[0]?.postcssPlugin || '(array plugin)', type: 'array' };
    }
    return { name: '(unknown)', type: typeof p };
  });

  console.log('[diagnose-postcss] Raw config:', JSON.stringify(config, null, 2));
  console.log('[diagnose-postcss] Detected plugins:', normalized);
  console.log('[diagnose-postcss] Plugin count:', normalized.length);

  // Basic expectations for Tailwind v4 setup
  const hasTailwind = normalized.some(p => /tailwind/i.test(p.name));
  const hasAutoprefixer = normalized.some(p => /autoprefixer/i.test(p.name));

  if (!hasTailwind) {
    console.warn('[diagnose-postcss] WARNING: Tailwind plugin not detected.');
  }
  if (!hasAutoprefixer) {
    console.warn('[diagnose-postcss] NOTE: Autoprefixer not detected (optional but recommended).');
  }
})();
