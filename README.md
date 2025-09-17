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

#### Fast Test Runs (Disabling Axe)

You can disable axe analysis (useful for quick iteration) by setting an environment variable before running tests:

```bash
AXE_DISABLED=1 npm test
```

When disabled, a stub returns an empty result set. Keep at least one CI job with axe enabled to avoid regressions.

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

## Mock Authentication & User-Scoped Cart

This repository includes a lightweight client-only authentication simulation used for local development and UI flows.

### User Model

Stored user object (in `localStorage` under `uco.user`):

```ts
interface StoredUser {
  id: string;       // stable id (email hash or provider-based)
  name: string;     // display name (derived from email prefix or provider)
  provider?: 'password' | 'google' | 'facebook';
  email?: string;
}
```

### Providers

- Email + Password (validation: email must contain `@`, password length ≥ 6)
- Google / Facebook SSO buttons (stubs returning synthetic users with deterministic ids)

### Cart Segmentation

Cart storage keys:

| State | Key Pattern |
|-------|-------------|
| Guest (no user) | `uco.cart.guest` |
| Logged-in user  | `uco.cart.<userId>` |

Switching users does not wipe other carts; each user (and guest) maintains an isolated cart. Hydration only replaces in‑memory state when a stored value exists to prevent spurious clears.

### Auth Delay Bypass (Testing)

Authentication actions previously simulated network latency (300–400ms). Tests set `NODE_ENV==='test'` which triggers a `SKIP_DELAY` flag in `useUser` to make login/logout synchronous. You can also force zero delay in dev by setting `NEXT_PUBLIC_AUTH_DELAY=0`.

### Components

| Component | Responsibility |
|-----------|----------------|
| `UserProvider` (`src/hooks/useUser.tsx`) | Context with `user`, `login`, `loginWithProvider`, `logout`, persistence |
| `ProfileMenu` (`src/components/ProfileMenu.tsx`) | Header icon, conditional menu, opens login drawer |
| `LoginDrawer` (internal) | Form + SSO buttons, error states, accessible dialog |

### Testing Notes

`ProfileMenu.test.tsx` validates: password login flow, Google SSO, persistence across remount. Label associations (`htmlFor`/`id`) were added for accessible querying (`getByLabelText`). Artificial delays are skipped, keeping the longest profile test under ~200ms on a typical dev machine.

### Extending

- Replace stubs with real API calls: inject async functions via context props or environment based strategy pattern.
- Add refresh token handling: extend stored user with `token` + expiry and schedule silent renew.
- Harden validation: integrate `zod` or form library.

Until real backend integration, DO NOT treat this layer as secure—it's purely a UI convenience.

## Custom Inquiry System

The `/custom` page provides an AJAX form posting to `/api/contact`.

Features:

- Field validation (name, email, message required)
- Honeypot field (`company`) for basic bot trapping
- In-memory rate limiting: 5 submissions per IP per 10 minutes (HTTP 429 `rate-limited`)
- Persistence: JSON lines appended to `data/inquiries.log`
- Email dispatch via `nodemailer` using environment configuration

### Environment Variables

Define in `ucocustomcalls/.env.local`:

```bash
INQUIRY_DEST_EMAIL=owner@example.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=apikey-or-username
SMTP_PASS=secret-password
```

If SMTP vars are omitted, mail send will likely fail (500 `email-failed`).

### E2E Tests

Playwright tests include `e2e/inquiry.spec.ts` which verify:

- Successful submission flow
- Honeypot spam rejection

Run: `npm run test:e2e`

### Log File

All inquiries append to `data/inquiries.log` (one JSON object per line) with timestamp and IP (`x-forwarded-for`). Secure or rotate this file in production.
