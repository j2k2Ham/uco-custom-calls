# uco-custom-calls
Website for UCO Custom Calls

## Development

Install dependencies and start the dev server (Turbopack):

```bash
cd ucocustomcalls
npm install
npm run dev
```

If you encounter odd build artifacts or need a guaranteed clean rebuild, use the clean script which removes the `.next` output directory first:

```bash
npm run dev:clean
```

### Lockfile Consolidation

The repository previously had a root `package-lock.json` plus the app lockfile. The root lockfile was removed so Next.js no longer emits a multi-lockfile workspace warning. All dependency operations should be executed from within `ucocustomcalls/` now.

### Coverage Badge & Tests

Run tests with coverage:

```bash
npm run test:coverage
npm run coverage:badge
```

The coverage badge is published at `public/badges/coverage.svg` and automatically updated on pushes to `main` via CI.

### Accessibility & Benchmarks

Basic a11y smoke tests (axe) are included. Micro-benchmarks for utility functions can be executed with:

```bash
npm run test:bench
```

### Profiler

Set `NEXT_PUBLIC_PROFILE=1` before running dev to wrap the App in a React Profiler for render timing diagnostics.
