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

### Create Account Flow & User Registry

In addition to login + SSO stubs, a lightweight client-side account creation path is provided. When a user selects "Create account" in the profile drawer, the following occurs:

1. User enters first name, last name, email, password (password rule: minimum 6 characters; login-only path still allows >=4 for legacy test speed but new accounts require >=6).
2. Email is validated with a simple `user@host.tld` regex; password rule enforced (`length >= 6`).
3. A registry of locally created users is persisted in `localStorage` under the key `uco.users` (object map keyed by lower‑cased email).
4. Duplicate prevention: attempting to create an account with an email already present in the registry throws `Account already exists` and leaves the drawer open displaying the error.
5. On successful creation, the new user is automatically logged in and also stored as the active user (`uco.user`).

Registry Shape (simplified):

```jsonc
{
  "someone@example.com": {
    "id": "u_c29tZW9uZUBleGFtcGxlLmNvbQ==",
    "email": "someone@example.com",
    "name": "Jane Doe",
    "provider": "local"
  }
}
```

First name display & greeting: After login or account creation, the first token of `name` (split on space) is rendered inline next to the profile icon and the account dropdown now includes a lightweight greeting line (`Welcome, Jane`). If `name` is absent (e.g., SSO stub without enriched profile) the email remains in the aria-label and the greeting omits the comma/name.

### My Account Page

Path: `/account` – Displays a simple authenticated view of the current user (email, name if present, provider). If the visitor is not logged in a guidance message with a link back home is shown. Navigation occurs via the "My Account" item in the profile dropdown (rendered as a Next.js `Link`). This page is a starting point for future enhancements (profile editing, order history, password changes). Client-only context is used; server protection would require replacing the mock auth layer with a real session mechanism.

#### Development Auth Cookie (Signed) & Middleware Verification

To make local flows slightly more realistic, the dev cookie is now weakly signed.

Cookie: `uco_auth=<base64(json)>.<sig>` where:

- `json` = `{ id, email, name, provider }`
- `sig`   = first 24 hex chars of SHA-256(`base64(json)` + dev secret)

Implementation: `src/lib/authCookie.ts` exports `signAuthCookie` & `verifyAuthCookie`.

Lifecycle:

1. On login / account creation the cookie is (re)issued (7 day expiry).
2. On logout the cookie is cleared (Max-Age=0).
3. `middleware.ts` (matcher `/account`) now:
  - Redirects to `/` if cookie is missing.
  - Verifies the signature; invalid or malformed token ➜ clears cookie + redirect with `?from=account`.
4. A valid token simply allows the request (no server session created—still client trust only).

Limitations (Dev Only):

- Shared static secret (`dev-secret`) in source; rotate to env var for any staging.
- Not httpOnly, Secure, or SameSite tuned.
- No replay / rotation / expiry enforcement beyond cookie expiry.

Production Replacement: Use a real session (JWT w/ HS/RS signature stored httpOnly; or server session store + opaque token). Add CSRF protections for state-changing routes.

Testing: `src/lib/authCookie.test.ts` covers happy path, tampering, and malformed tokens.

#### Editing Profile (Name Only) & Password Change Stub

The Account page now includes an inline form to update first and last name:

1. Pre-filled from existing `user.name` (split into first token + remainder).
2. Submits via `updateProfile` exposed by `useUser` context.
3. Updates local state, persistent storage (`uco.user`), user registry (`uco.users`), dev cookie, and immediately refreshes the header first-name chip & greeting.
4. Shows transient “Saved” indicator and resets to idle state after 1.5s.

Validation: Both first and last names must be non-empty (trimmed). Future enhancements could add length / character set constraints.

Re-login name restoration: When logging in with email/password, if a matching entry exists in the registry, the previously stored `name` is restored even if the login form does not collect names (i.e. future flows could omit name fields).

Password Change (Stub): The Account page includes a non-persistent "Change Password" form calling `changePassword` in `useUser`. Validation only:

- Current password length ≥ 4
- New password length ≥ 6
- New matches confirmation
- New differs from current

Successful submission shows an `Updated` status badge then resets fields; no password is stored.

Testing Notes:

- `ProfileMenu.test.tsx` covers login flows, account creation, duplicate prevention, name restoration, navigation.
- `AccountPage.test.tsx` covers profile name editing plus password stub (success + validation errors).
- `authCookie.test.ts` validates signing/verification logic.
- Artificial delays skipped in test env via `SKIP_DELAY`.

Planned / Optional Enhancements:

- Additional password strength feedback (entropy / character mix) – current rule is minimal to keep UX friction low.
- Friendly greeting panel (e.g., "Welcome back, Jane") inside the drawer or menu.
- Edit profile support (rename), which would update both `uco.user` and the registry entry.

Security Reminder: This registry is entirely client-side and should NOT be used for anything beyond local prototyping. Replace with a real backend (and hashed passwords) before shipping.

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

## Toast & Notification System

An accessible, configurable toast system powers inline feedback (login/logout, profile updates, password change stub, errors). It is implemented in `src/components/ToastProvider.tsx` and exposed via the `useToast()` hook.

### Provider Usage

Wrap the app (already done in the test + root providers) with:

```tsx
<ToastProvider hoverMode="extend" maxVisible={4}>
  {children}
</ToastProvider>
```

Props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxVisible` | number | `4` | Max concurrently rendered toasts; excess queued. |
| `hoverMode` | `'extend' \| 'pause' \| 'none'` | `extend` | Behavior when hovering a toast. |
| `disableAutoDismissInTest` | boolean | `true` (skips interval) | In test env, when `false` re-enables timers so hover/timeout specs run. |

### Hover Modes

- `extend`: Each hover grants +15% of original timeout up to 2× the original duration (refreshing remaining time proportional to added total).
- `pause`: Freezes remaining time on `mouseenter`, resumes countdown on `mouseleave`.
- `none`: Ignores hover interaction—timers continue unabated.

### API

`const { push, dismissAll } = useToast();`

`push(message: string, opts?: { type?: 'info' | 'success' | 'error'; timeout?: number; action?: { label: string; onClick: () => void } })`

Duplicate suppression: Calls to `push` with same `message` + `type` update the existing toast’s timestamp, reset remaining time (respecting current hover mode), increment a visible multiplier badge (`×n`), and optionally replace its action.

`dismissAll()` triggers graceful exit animations for visible toasts and clears the queue.

### Keyboard Navigation

The toast region (`role="group" aria-label="Notifications"`) is focusable. When focused:

- ArrowDown / ArrowUp: Move focus among active toasts.
- Home / End: Jump to first / last toast.
- Delete: Dismiss the currently focused toast.
- Shift+Delete (UI hint optional): You can bind this globally to `dismissAll` (not wired by default—left to integrators).

### Accessibility

- Container: `role=group` + `aria-live="polite"` for non‑intrusive announcements.
- Each toast: `role=status` so screen readers announce message changes without stealing focus.
- Action buttons & dismiss buttons are standard focus targets; focused toast receives an outline for visual indication.
- Reduced motion: animations disabled under `prefers-reduced-motion: reduce` (CSS fallbacks defined in `globals.css`).

### Theming & CSS Variables

Core custom properties (see `globals.css`):

| Variable | Purpose |
|----------|---------|
| `--toast-bg` | Toast background color |
| `--toast-border` | Border color |
| `--toast-color-info` | Default/info text color |
| `--toast-color-success` | Success variant text color |
| `--toast-color-error` | Error variant text color |
| `--toast-fade-duration` | Enter/exit animation timing |

Utility classes applied:

- `.toast-base`, `.toast-success`, `.toast-error` for variant styling
- `.toast-fade-enter/active` & `.toast-fade-exit/active` for transition states

Override by redefining the CSS variables (e.g., within a theme wrapper) or by extending the utility classes.

### Queueing Logic

When `maxVisible` is reached, new toasts enqueue (FIFO). As visible toasts exit (timeout or dismissal) queued items promote into the viewport with staggered enter delays (capped at 300ms).

### Testing Strategy

- Core behaviors (enqueue, auto-dismiss, duplicate collapse, queue promotion, action button) in `ToastProvider.core.test.tsx`.
- Hover behaviors (extend, pause, none) in `ToastProvider.hover.test.tsx` (re-enable timers via `disableAutoDismissInTest={false}` prop override).
- Keyboard navigation in `ToastProvider.keyboard.test.tsx`.
- In test env the interval is skipped by default to avoid `act()` noise; explicit tests opt back in.

### Performance Notes

- State arrays kept minimal; duplicate detection O(n) for visible toasts (n ≤ 4 by default), trivial overhead.
- Timer interval 100ms—coarse enough to avoid excessive renders while keeping progress bar responsive.
- Context value memoized to prevent child rerenders (`useMemo`).

### Extension Ideas

- Add `aria-live="assertive"` variant for critical errors.
- Support persistent toasts (no timeout) and a visual pin icon.
- Global dismiss shortcut (e.g., bind `Escape` when region focused or app-level listener invoking `dismissAll`).

