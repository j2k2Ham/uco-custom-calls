# UCO Custom Calls

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Project Additions

This project has been extended beyond the default template with tooling and utilities focused on commerce-like cart functionality, testing, and code quality.

### Scripts

| Script | Purpose |
| ------ | ------- |
| `npm run dev` | Start development server (Turbopack – experimental) |
| `npm run dev:webpack` | Start development server (classic Webpack) |
| `npm run build` | Production build (classic Webpack default) |
| `npm run build:webpack` | Production build (explicit classic) |
| `npm run build:turbopack` | Production build (Turbopack – experimental) |
| `npm start` | Run production build (latest build flavor) |
| `npm run start:webpack` | Start classic Webpack production build |
| `npm run build:ci` | CI production build (classic) |
| `npm run diagnose:turbopack` | Attempt Turbopack build (non-blocking) |
| `npm run verify:build` | Post-build health checks |
| `npm run lint` | Run ESLint (Flat config + Next.js rules) |
| `npm run lint:css` | Run Stylelint over global and module CSS |
| `npm test` | Run Vitest once |
| `npm run test:watch` | Run Vitest in watch mode |

### Testing

The test stack uses Vitest + React Testing Library (`jsdom` environment). Current coverage focuses on the cart hook logic (`src/hooks/useCart.ts`).

Scenarios covered:

1. Add first item (count & total increment)
2. Add duplicate item (quantity accumulation)
3. Remove single item
4. Clear all items

Local storage is cleared (`beforeEach`) to ensure deterministic tests. If you add new persistence features, mirror that reset pattern.

### Cart Hook API (`useCart`)

Located at `src/hooks/useCart.ts`. Provides a context-backed shopping cart with SSR‑safe hydration.

State shape:

```ts
type CartItem = Product & { quantity: number };
interface CartState {
  items: CartItem[];
  count: number;   // total item quantity
  total: number;   // total price in cents
}
```

Exports:

```ts
function useCart(): CartState & {
  add(product: Product): void;
  remove(id: string): void;      // removes entire line
  clear(): void;                 // empties cart
};
```

Persistence: Serializes to `localStorage` under the key `cart`. Guarded so it is safe during SSR / static builds (access only in `useEffect`).

### Currency Utilities

`src/lib/currency.ts` centralizes formatting and arithmetic:

```ts
formatUSD(cents: number): string; // Intl.NumberFormat, USD
sumCents(values: number[]): number; // reduce helper
```

`Price` component (`src/components/Price.tsx`) uses `formatUSD` to keep pricing consistent.

### Pricing & Legacy Compatibility

All canonical product prices are stored as integer cents via the `priceCents` field. Earlier fixtures and some tests used a loose `price` field whose unit (dollars vs cents) was ambiguous. To bridge that gap we introduced `getPriceCents` (`src/types/product.ts`) with a deterministic heuristic:

Heuristic Rules:

1. If `priceCents` is present (number) -> return as-is (authoritative)
2. Else if `price` < 1 (e.g. `0.5`) -> treat as fractional dollars: multiply by 100 (=> 50¢)
3. Else if `price` is an integer >= 100 -> treat as cents already (1000 => $10.00)
4. Else if `price` is an integer 1..99 -> treat as whole dollars: multiply by 100 (15 => 1500)
5. Else if `price` has decimals (e.g. 19.99) -> treat as dollars with decimals: multiply by 100 (19.99 => 1999)
6. Fallback -> 0

Examples:

| Input Shape | Interpretation | Result (cents) | Reason |
|-------------|----------------|----------------|--------|
| `{ priceCents: 12999 }` | Already canonical | 12999 | Rule 1 |
| `{ price: 0.5 }` | 50¢ fractional dollars | 50 | Rule 2 |
| `{ price: 15 }` | $15 whole dollars | 1500 | Rule 4 |
| `{ price: 100 }` | 100¢ ($1.00) | 100 | Rule 3 |
| `{ price: 12999 }` | 12999¢ ($129.99) | 12999 | Rule 3 |
| `{ price: 19.99 }` | $19.99 | 1999 | Rule 5 |

Rationale: Most historic test data used mid-to-large integers (>=100) to mean cents (e.g. 1000 => $10.00) while small integers (like 15) were intended as dollars. This dual intent created inflated totals after the migration. The heuristic is stable, idempotent, and centralized so both cart hydration and display code share the same logic.

Migration Guidance:

1. Prefer adding / refactoring to use `priceCents` in new data.
2. When touching any remaining objects with `price`, convert them to `priceCents` explicitly (e.g. 1000 => `priceCents: 1000`).
3. Avoid persisting mixed objects (both `price` and `priceCents`). If both are present only `priceCents` is used.
4. If you import external feeds with ambiguous units, normalize them once at ingestion to `priceCents` and drop the original numeric field.

Testing: Dedicated unit tests in `src/types/product.test.ts` assert each rule above; extending the heuristic requires updating those tests to make intent explicit.

### Tailwind CSS v4 Notes

Tailwind v4 removes the standalone CLI in favor of the PostCSS plugin. This project configures Tailwind via `postcss.config.mjs`:

```js
import tailwind from '@tailwindcss/postcss';
export default { plugins: [tailwind()] };
```

Global styles (`src/app/globals.css`) include `@import "tailwindcss";` and an inline theme block (`@theme inline { ... }`) that defines semantic tokens (e.g. `--color-bg`).

### Linting

- ESLint (Flat config) covers TypeScript/React/Next core vitals.
- Stylelint validates CSS (standard config) and plays well with Tailwind utility layers.
- Run both with: `npm run lint && npm run lint:css`.

### SonarQube / Code Quality

`sonar-project.properties` is scoped so only `src/` under this package is analyzed. Adjust `sonar.sources` or exclusions as needed. Add coverage reporting later by integrating `vitest --coverage` and pointing Sonar to the LCOV file.

### Test Coverage & Performance

Coverage is generated with V8 instrumentation via Vitest.

Commands:

```bash
npm run test:coverage   # produces text + html + lcov
```

Output:

- HTML report: `coverage/html/index.html`
- LCOV file: `coverage/lcov.info`

Sonar integration:
`sonar.javascript.lcov.reportPaths=ucocustomcalls/coverage/lcov.info` (already added).

Threshold Strategy:

- Progressive tightening from low initial gates to near-complete coverage.
- Current enforced minimums (see `vitest.config.ts`): Lines 98%, Statements 98%, Functions 90%, Branches 85%.
- Suite presently achieves 100% lines/statements and >93% branches overall.
- Adjust only after sizable feature additions to avoid churn.

Performance Benchmarks:

Light micro-benchmarks (Vitest bench) exist for currency utilities.

Commands:

```bash
npm run test:bench   # run benchmarks in src/bench
```

Output provides ops/sec for formatting vs summation workloads. Bench files are excluded from coverage.

Coverage Badge:

After running coverage you can generate/update a static badge:

```bash
npm run test:coverage
npm run coverage:badge
```

Badge output: `public/badges/coverage.svg` (commit it to display via raw GitHub URL or embed in docs).

### Runtime Profiling

Lightweight React profiling can be enabled by setting an environment flag before starting dev or build. When enabled, a console log line prints commit durations for the root subtree.

```bash
NEXT_PUBLIC_PROFILE=1 npm run dev
```

Disable by omitting the env var. Profiler output lines are prefixed with `[Profiler]`.

### Accessibility Testing

Basic axe-core smoke tests ensure common components (Header, Hero, Footer) render without obvious violations.

Run:

```bash
npm test -- src/a11y
```

Add additional a11y tests under `src/a11y/*.a11y.test.tsx` as UI expands.

### Continuous Integration (CI)

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on pushes and PRs against `main`:

Steps:

1. Install dependencies (`npm ci` in `ucocustomcalls`)
2. ESLint + Stylelint
3. Tests + Coverage (`npm run test:ci` uses `--passWithNoTests` for config-only PRs)
4. Coverage artifacts uploaded (HTML + lcov)
5. Separate Sonar job re-runs coverage to ensure `lcov.info` then executes scan (requires `SONAR_TOKEN` secret)

Secrets Required:

- `SONAR_TOKEN`: SonarCloud project token

Scripts:

```bash
npm run test:ci       # CI-friendly run with coverage + passWithNoTests
npm run test:coverage # Local full coverage
```

Adjusting Thresholds:

- Update `thresholds` in `vitest.config.ts` as more components/pages gain tests.
- Keep incremental (e.g., +10% lines per milestone) to avoid blocking PRs.

### Accessibility Enhancements

Audio components include `<track>` elements for captions. A placeholder WebVTT file lives at `public/captions/blank.vtt` and can be replaced with real transcripts.

### Future Enhancements (Ideas)

- Quantity decrement vs full remove
- Line item price caching (derived vs stored)
- Coupon/discount abstraction
- Currency & locale switching (extend formatter)
- Test coverage for persistence rehydration

### Contributing

1. Install deps: `npm install`
2. Run lint & tests before pushing: `npm run lint && npm run lint:css && npm test`
3. Keep new utilities framework-agnostic and typed.

---

If you have questions about the structure or want to expand functionality (e.g., coupons, multi-currency), open an issue or start a discussion.

### Turbopack Fallback & CSS Crash Troubleshooting

On some Windows environments an internal Turbopack crash (`TurbopackInternalError` while processing `globals.css`) can surface as:

```text
ENOENT: no such file or directory, open .next/server/app/page/app-build-manifest.json
```

This is a secondary symptom: the CSS worker crashes before writing all expected app manifests.

#### Fallback Scripts

Classic (Webpack) equivalents have been added:

```bash
npm run dev:webpack        # Dev server without Turbopack
npm run build:webpack      # Production build without Turbopack
npm run start:webpack      # Start production build (classic)
```

#### Minimal PostCSS Isolation

A minimal config is provided at `postcss.minimal.mjs`:

```js
import tailwind from "@tailwindcss/postcss";
const config = { plugins: [tailwind()] };
export default config;
```

To test whether the crash is caused by an interaction with `autoprefixer` or additional CSS features:

1. Backup current `postcss.config.mjs`.
2. Replace its contents with the minimal config above (or temporarily rename files).
3. Clean build output:

  ```bash
  rimraf .next
  npm run dev -- --port=3000
  ```

1. If stable, reintroduce `autoprefixer()` and custom CSS blocks incrementally.

#### Tips

- Ensure only one dev server instance is running (port collision forces fallback port e.g. 3001 and can confuse manual testing).
- Run `npm run build:webpack` prior to filing an upstream issue to confirm it is Turbopack-specific.
- Include the panic log referenced in the console (`next-panic-*.log`) when reporting.

Once a patched Next.js release addresses the worker crash you can return to Turbopack by using the default `npm run dev` / `npm run build` commands.

### Build Health

After any production build you can run a lightweight integrity check that validates expected artifacts and surfaces common failure signatures (notably partial Turbopack output or missing manifests):

```bash
npm run build         # or any build variant
npm run verify:build  # run health checks
```

What it checks:

- Presence of `.next` directory
- Presence and non‑zero size of `.next/build-manifest.json`
- Presence of top-level `app-build-manifest.json` (Turbopack writes a flattened location early)
- Warns (does not fail) if `.next/server/app` is missing (often indicates an early Turbopack crash)

Exit Codes:

- `0` All required artifacts present
- `1` Any required artifact missing / empty

Integrating into CI (recommended): add a step immediately after the build step and before starting / deploying:

Example GitHub Actions snippet (within the existing job after `npm run build:ci`):

```yaml
  - name: Build (classic)
    run: npm run build:ci
    working-directory: ucocustomcalls

  - name: Verify build artifacts
    run: npm run verify:build
    working-directory: ucocustomcalls
```

If you later re-enable Turbopack as the default, keep the verify step; it will quickly catch regressions that manifest as silent 500s during first request.

### Troubleshooting

| Symptom | Likely Cause | Action |
| ------- | ------------ | ------ |
| `ENOENT ... app-build-manifest.json` | Turbopack CSS worker crash | Use `npm run dev:webpack`, capture panic log, file upstream issue |
| `Page OK in dev but prod 500` | Partial build / missing manifest | Run `npm run verify:build`; inspect `.next` completeness |
| Port auto-changes (3000→3001) | Previous dev server running | Terminate prior process; re-run desired dev script |
| Tailwind classes missing | PostCSS plugin misconfig | Ensure `postcss.config.mjs` exports Tailwind plugin array |
| High cold start time | Large, un-treeshaken dependency | Analyze with `next build --profile` (when Turbopack stable) or webpack analyze plugin |

General Recovery Steps:

1. Clean: `rimraf .next` (Windows) / `rm -rf .next` (Unix)
2. Re-run classic build: `npm run build:webpack`
3. Verify: `npm run verify:build`
4. Start: `npm run start:webpack`
5. If classic passes but Turbopack fails: run `npm run diagnose:turbopack` and attach logs to `TURBOPACK_ISSUE_REPORT.md` when filing upstream.

When Filing an Upstream Issue:

- Include OS, Node version (`node -v`), Next.js version, and the panic log file content.
- Note whether minimal PostCSS config (`postcss.minimal.mjs`) still reproduces.
- Provide the output of `npm run diagnose:turbopack` including the final exit code.

Security Note: Scrub any absolute local file system paths in logs if sensitive.

### Logo & Theming

The header branding uses a `Logo` component (`src/components/Logo.tsx`) supporting light/dark variants, responsive sizing, optional `<picture>` output, and an inline SVG fallback.

Props:

- `variant`: `auto | light | dark` (default `auto` uses Tailwind `dark:` classes)
- `height`: Display height in px (aspect ratio preserved via intrinsic dimensions 248x140)
- `sizes`: Override responsive sizes attribute (default `(max-width: 640px) 140px, (max-width: 1024px) 180px, 220px`)
- `inlineSvg`: Renders embedded SVG placeholder instead of raster assets
- `usePicture`: Uses `<picture>` + `<source media="(prefers-color-scheme: dark)">` for native dark mode switching
- `variant='auto'`: Renders both light & dark images with Tailwind dark utility toggling visibility

Example usages:

```tsx
// Standard auto variant
<Logo height={32} />

// Force light only
<Logo variant="light" height={40} />

// Custom responsive sizes
<Logo height={36} sizes="(max-width:800px) 160px, 240px" />

// Inline SVG fallback (no external images)
<Logo inlineSvg height={48} />

// Picture-based dark mode (prefers-color-scheme)
<Logo usePicture variant="auto" height={32} />
```

Assets:

- Light: `public/images/company-logo-green-2x.png`
- Dark (expected): `public/images/company-logo-green-2x-dark.png`

If the dark file is absent the dark image entry will still be requested (404). Provide a temporary copy of the light asset if necessary:

```bash
cp public/images/company-logo-green-2x.png public/images/company-logo-green-2x-dark.png
```

### Theme Toggle

`ThemeToggle` (`src/components/ThemeToggle.tsx`) switches the `dark` class on `<html>` and persists choice in `localStorage` (`theme=dark|light`). It is included in the `Header`.

Behavior:

1. On mount, reads stored preference; if `dark`, adds class immediately.
2. Button toggles class & updates storage.
3. Logo in `variant="auto"` reacts via Tailwind dark utilities or the `<picture>` media query path if `usePicture` is set.

To remove the toggle from production, delete it from `Header.tsx` or wrap in a feature flag.

### End-to-End (E2E) SEO Tests (Playwright)

Playwright is configured to validate critical SEO structured data (Product + Breadcrumb JSON-LD) and basic page reachability.

Config: `playwright.config.ts`

Key features:

- `webServer` auto-starts `npm run dev:webpack` before tests (reuses existing server locally)
- Single Chromium project (extend as needed)
- HTML report output: `e2e-report/` (serve with `npx playwright show-report e2e-report`)

Scripts:

```bash
npm run e2e       # headless run
npm run e2e:ui    # interactive UI mode
npm run e2e:report # open last HTML report
```

Test File: `e2e/seo.spec.ts`

- Verifies `/products` exposes a BreadcrumbList (1 level)
- Verifies a product detail page exposes Product + BreadcrumbList + (if present) AggregateRating

Adding More Tests:

1. Create new spec under `e2e/`
2. Use `page.locator` or JSON-LD extraction helper pattern
3. Keep tests fast (<5s) to avoid CI flakiness

CI Integration (Optional): Add a separate job or extend existing workflow after build:

```yaml
  - name: Install browsers
    run: npx playwright install --with-deps
    working-directory: ucocustomcalls
  - name: E2E tests
    run: npm run e2e
    working-directory: ucocustomcalls
```

If you add authentication or stateful flows, consider using Playwright fixtures and tracing (`trace: 'on-first-retry'` already enabled).

### Dynamic Route Params (Next.js 15)

The product detail route (`/products/[slug]`) accesses `params` as a promise to satisfy the synchronous dynamic params warning introduced in Next.js 15. Pattern used:

```ts
interface ProductPageProps { params: ProductPageParams | Promise<ProductPageParams> }
export async function generateMetadata({ params }: ProductPageProps) {
  const resolved = await params; /* ... */
}
export default async function Page({ params }: ProductPageProps) {
  const resolved = await params; /* ... */
}
```

### Image Placeholders

Sample product images reference existing assets in `public/images/` (e.g. `woodie.jpg`, `goose.jpg`). Replace with real catalog imagery as they become available. Avoid broken image requests to keep Playwright logs clean.

### Performance & Lighthouse

Modern image formats and deferred effects improve LCP and TTI:

- Hero splash uses `<picture>` with AVIF → WebP → JPEG fallback + `fetchPriority="high"`.
- Ambient decorative layers load dynamically after idle (`requestIdleCallback` fallback to timeout) and are skipped during tests.
- Shimmer + blur placeholder provide perceived performance while decoding.

Run ad‑hoc Lighthouse (dev server on :3000):

```bash
npm run lighthouse
```

CI JSON artifact:

```bash
npm run lighthouse:ci
```

Baseline workflow (mac/Linux):

```bash
npm run dev:webpack &
sleep 5
npm run lighthouse:ci
cat .lighthouse/report.json | jq '.categories | {performance,seo,accessibility}'
```

PowerShell equivalent:

```powershell
npm run dev:webpack
Start-Sleep -Seconds 5
npm run lighthouse:ci
Get-Content .lighthouse/report.json | jq '.categories | {performance,seo,accessibility}'
```

Future Optimizations:

- Add responsive width variants (srcSet) for ultra-wide screens.
- Preload hero image via `<link rel="preload" as="image">` if LCP persists >2.5s.
- Integrate Lighthouse CI thresholds (e.g. perf >= 0.85) in GitHub Actions.
- Inline minimal critical CSS if cumulative layout shift emerges.

Troubleshooting:

| Symptom | Cause | Mitigation |
|---------|-------|-----------|
| High LCP image time | Large asset | Recompress / add AVIF & WebP |
| Layout shift after ambient load | Late inserted elements | Reserve space; avoid height changes |
| Test act() warnings | Deferred state updates | Skipped ambient during tests (current solution) |

Ambient Layers & Tests:

`process.env.NODE_ENV === 'test'` guard prevents unnecessary dynamic animation work and noisy act warnings.

