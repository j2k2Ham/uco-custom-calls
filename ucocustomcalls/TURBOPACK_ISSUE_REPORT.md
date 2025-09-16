# Turbopack Crash / ENOENT Issue Report

## Summary

Turbopack fails to build the App Router project on Windows, resulting in missing `.next/server/app/**` output and runtime ENOENT:

```text
ENOENT: no such file or directory, open .next/server/app/page/app-build-manifest.json
```

A subsequent production build attempt crashes with a `TurbopackInternalError` while processing `globals.css`.

## Environment

- OS: Windows (fill exact version: e.g. Windows 11 23H2)
- Node: output of `node -v`
- npm: output of `npm -v`
- Next.js: 15.5.3 (original failing version)
- React: 19.1.x
- Tailwind: 4.1.x (`@tailwindcss/postcss` plugin)

## Reproduction Steps

1. Clone repository (or create minimal app using `create-next-app@latest` with App Router).
2. Add Tailwind v4 PostCSS plugin (`@tailwindcss/postcss`) and `@import "tailwindcss";` in `src/app/globals.css`.
3. Run `npm run dev` (Turbopack) in project root `ucocustomcalls/`.
4. Browser request to `http://localhost:3000/` returns 500 and console shows ENOENT for nested `app-build-manifest.json`.
5. Inspect `.next` – only top-level `app-build-manifest.json` (small placeholder) exists; no `.next/server/app` tree.
6. Run `npm run build` (Turbopack production) → crash with panic referencing PostCSS / CSS processing and socket closure (os error 10054).

## Observed Console / Panic (Redacted)

Paste contents of the panic log referenced (e.g. `%LOCALAPPDATA%/Temp/next-panic-*.log`).

```text
<Turbopack panic excerpt>
```

## Minimal PostCSS Isolation

Tried minimal PostCSS (Tailwind only) – issue persists; implies not tied to `autoprefixer()`.

```js
// postcss.config.mjs (isolation)
import tailwind from "@tailwindcss/postcss";
const config = { plugins: [tailwind()] };
export default config;
```

## Expected vs Actual

| Aspect | Expected | Actual |
|--------|----------|--------|
| Dev build | `.next/server/app/...` assets emitted | `.next/server/app` missing entirely |
| Page load | 200 rendered page | 500 ENOENT manifest error |
| Prod build | Succeeds, outputs `.next` | Crashes with TurbopackInternalError |

## Workaround

Using classic Webpack succeeds:

```bash
npm run dev:webpack
npm run build:webpack && npm run start:webpack
```

## Additional Notes

- No custom webpack / SWC config modifications.
- Nested repository structure: root contains parent folder plus the app folder (`ucocustomcalls/`).
- Removing root `package-lock.json` eliminates multi-lockfile warning but not the crash.
- Repro stable after multiple clean rebuilds.

## Requested Action

Investigate Turbopack worker crash on Windows leading to incomplete manifest emission in App Router builds with Tailwind v4.

---
(Feel free to trim fields not needed when filing upstream.)
