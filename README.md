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

### Catalog Components

The product catalog uses a unified `Product` type (`src/types/product.ts`) with `priceCents` as the canonical price representation. Key UI components:

- `CategoryNav` (`src/components/CategoryNav.tsx`): Horizontal scrollable navigation with active highlighting. Appears on the main products listing and category pages. Client-side uses `usePathname` for active state.
- `ProductGallery` (`src/components/ProductGallery.tsx`): Accessible image gallery featuring:
  - Keyboard navigation (Left/Right arrows) within thumbnail list.
  - `aria-live` polite region announcing current image index.
  - Focus-visible outline for accessibility.
- `AddToCartButton` + `useCart` (`src/hooks/useCart.ts`): Cart state stored in `localStorage` under `uco.cart`, using `priceCents` for arithmetic precision.

### Structured Data (SEO)

`/products/[slug]` injects a JSON-LD `<script type="application/ld+json">` describing the product (`Product` + nested `Offer`). This helps search engines better understand pricing & availability.

Adjust the canonical domain inside the JSON-LD (currently `https://ucocustomcalls.com`) if deploying under a different base URL.

### Future Enhancements

- Add breadcrumb structured data.
- Expand gallery for zoom / swipe gestures.
- Integrate real inventory + pricing source of truth (CMS or headless commerce).
