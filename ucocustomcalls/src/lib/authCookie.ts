// Dev-only signed cookie helper (NOT secure for production)
// Format: uco_auth=<b64Payload>.<hash>
// hash = simple SHA-256 of (b64Payload + secret) truncated for brevity.

// Secret resolution order:
// 1. AUTH_COOKIE_SECRET (preferred, never exposed client-side)
// 2. NEXT_PUBLIC_AUTH_COOKIE_SECRET (fallback, still not recommended – kept for legacy local setups)
// 3. test-secret (only in test env for deterministic signatures)
// 4. In non-production (development / preview) generate or use a fixed insecure dev secret with a console warning.
// 5. In production: throw if nothing set.
const SECRET = (() => {
  if (typeof process !== 'undefined') {
    const explicit = process.env.AUTH_COOKIE_SECRET || process.env.NEXT_PUBLIC_AUTH_COOKIE_SECRET;
    if (explicit) return explicit;
    if (process.env.NODE_ENV === 'test') return 'test-secret';
    if (process.env.NODE_ENV !== 'production') {
      // Use a fixed (not random) secret so hot reloads do not invalidate cookies every save.
      const devSecret = 'insecure-dev-secret-change-me';
      // Only warn once per runtime.
      interface DevWarnFlag { __AUTH_COOKIE_DEV_WARNED?: boolean }
      const g = globalThis as DevWarnFlag;
      if (!g.__AUTH_COOKIE_DEV_WARNED) {
        console.warn('[authCookie] Using insecure dev fallback secret. Set AUTH_COOKIE_SECRET in .env.local to silence this warning.');
        g.__AUTH_COOKIE_DEV_WARNED = true;
      }
      return devSecret;
    }
  }
  throw new Error('AUTH_COOKIE_SECRET environment variable is required for authCookie in production.');
})();

export interface AuthCookiePayload {
  id: string; email: string; name?: string; provider?: string;
}

async function sha256(data: string): Promise<string> {
  if (typeof crypto !== 'undefined' && 'subtle' in crypto) {
    const enc = new TextEncoder().encode(data);
    const digest = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('');
  }
  // Fallback (node crypto) – dynamic import to avoid bundler complaints in edge if not needed
  const { createHash } = await import('crypto');
  return createHash('sha256').update(data).digest('hex');
}

export async function signAuthCookie(payload: AuthCookiePayload): Promise<string> {
  const json = JSON.stringify(payload);
  const b64 = typeof btoa === 'function' ? btoa(json) : Buffer.from(json).toString('base64');
  const fullHash = await sha256(b64 + SECRET);
  const short = fullHash.slice(0, 24); // shorten for cookie size
  return `${b64}.${short}`;
}

export async function verifyAuthCookie(raw: string | undefined | null): Promise<AuthCookiePayload | null> {
  if (!raw) return null;
  const parts = raw.split('.');
  if (parts.length !== 2) return null;
  const [b64, sig] = parts;
  try {
    const fullHash = await sha256(b64 + SECRET);
    if (!fullHash.startsWith(sig)) return null;
    const jsonStr = typeof atob === 'function' ? atob(b64) : Buffer.from(b64, 'base64').toString('utf8');
    const parsed = JSON.parse(jsonStr) as AuthCookiePayload;
    if (!parsed.id || !parsed.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

// Server-only helpers (no-op on client) for httpOnly cookie management.
type HeadersLike = Headers | { [key: string]: unknown } | undefined;
interface ServerResponseLike {
  headers?: HeadersLike;
  setHeader?: (k: string, v: string | string[]) => unknown;
  getHeader?: (k: string) => unknown;
  cookies?: unknown;
}
export function setAuthCookieServer(res: ServerResponseLike, payload: AuthCookiePayload) {
  // We still produce the same signed value; consumer (API route) can call this.
  return (async () => {
    const value = await signAuthCookie(payload);
    const cookie = `uco_auth=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7*24*60*60}`;
    if (res?.setHeader) {
      // Append or set
  const existing = res.getHeader ? res.getHeader('Set-Cookie') : undefined;
      if (existing) {
  const arr = Array.isArray(existing) ? existing.concat(cookie) : [existing as string, cookie];
        res.setHeader('Set-Cookie', arr);
      } else {
        res.setHeader('Set-Cookie', cookie);
      }
    } else if (res?.headers) {
      // If it's a real Headers instance use append
      if (res.headers instanceof Headers) {
        res.headers.append('Set-Cookie', cookie);
      } else {
        const h = res.headers as { [k: string]: unknown };
        if (Array.isArray(h['Set-Cookie'])) h['Set-Cookie'].push(cookie);
        else if (h['Set-Cookie']) h['Set-Cookie'] = [h['Set-Cookie'], cookie];
        else h['Set-Cookie'] = cookie;
      }
    }
  })();
}

export function clearAuthCookieServer(res: ServerResponseLike) {
  const cookie = 'uco_auth=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
  if (res?.setHeader) {
  const existing = res.getHeader ? res.getHeader('Set-Cookie') : undefined;
    if (existing) {
      const arr = Array.isArray(existing) ? existing.concat(cookie) : [existing as string, cookie];
      res.setHeader('Set-Cookie', arr);
    } else {
      res.setHeader('Set-Cookie', cookie);
    }
  } else if (res?.headers) {
    if (res.headers instanceof Headers) {
      res.headers.append('Set-Cookie', cookie);
    } else {
      const h = res.headers as { [k: string]: unknown };
      if (Array.isArray(h['Set-Cookie'])) h['Set-Cookie'].push(cookie);
      else if (h['Set-Cookie']) h['Set-Cookie'] = [h['Set-Cookie'], cookie];
      else h['Set-Cookie'] = cookie;
    }
  }
}
