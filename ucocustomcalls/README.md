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
