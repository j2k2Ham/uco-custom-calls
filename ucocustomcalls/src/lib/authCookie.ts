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
      const devSecret = 'insecure-dev-secret-change-me';
      interface DevWarnFlag { __AUTH_COOKIE_DEV_WARNED?: boolean }
      const g = globalThis as DevWarnFlag;
      if (!g.__AUTH_COOKIE_DEV_WARNED) {
        console.warn('[authCookie] Using insecure dev fallback secret. Set AUTH_COOKIE_SECRET in .env.local to silence this warning.');
        g.__AUTH_COOKIE_DEV_WARNED = true;
      }
      return devSecret;
    }
    // In production build phase without secret, provide placeholder so build succeeds; runtime usage will throw.
    return 'PLACEHOLDER_PROD_SECRET';
  }
  return 'UNKNOWN_ENV_SECRET';
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
  if (SECRET === 'PLACEHOLDER_PROD_SECRET' && process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_COOKIE_SECRET must be set in production runtime (placeholder detected).');
  }
  const json = JSON.stringify(payload);
  const b64 = typeof btoa === 'function' ? btoa(json) : Buffer.from(json).toString('base64');
  const fullHash = await sha256(b64 + SECRET);
  const short = fullHash.slice(0, 24); // shorten for cookie size
  return `${b64}.${short}`;
}

export async function verifyAuthCookie(raw: string | undefined | null): Promise<AuthCookiePayload | null> {
  if (SECRET === 'PLACEHOLDER_PROD_SECRET' && process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_COOKIE_SECRET must be set in production runtime (placeholder detected).');
  }
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
type SetCookieValue = string | string[] | undefined;


function getExistingSetCookie(res: ServerResponseLike): SetCookieValue {
  if (res?.setHeader && res.getHeader) {
    return res.getHeader('Set-Cookie') as SetCookieValue;
  } else if (res?.headers) {
    if (res.headers instanceof Headers) {
      // Headers does not provide direct access to all Set-Cookie values, so return undefined
      return undefined;
    } else {
      const h = res.headers as { [k: string]: unknown };
      return h['Set-Cookie'] as SetCookieValue;
    }
  }
  return undefined;
}

function handleHeaders(headers: HeadersLike, cookie: string) {
  if (headers instanceof Headers) {
    headers.append('Set-Cookie', cookie);
  } else if (headers) {
    const h = headers as { [k: string]: unknown };
    if (Array.isArray(h['Set-Cookie'])) h['Set-Cookie'].push(cookie);
    else if (h['Set-Cookie']) h['Set-Cookie'] = [h['Set-Cookie'], cookie];
    else h['Set-Cookie'] = cookie;
  }
}

function setCookieOnResponse(res: ServerResponseLike, cookie: string) {
  if (res?.setHeader) {
    // Append or set
    const existing = getExistingSetCookie(res);
    if (existing) {
      const arr = Array.isArray(existing) ? existing.concat(cookie) : [existing, cookie];
      res.setHeader('Set-Cookie', arr);
    } else {
      res.setHeader('Set-Cookie', cookie);
    }
  } else if (res?.headers) {
    handleHeaders(res.headers, cookie);
  }
}

export function setAuthCookieServer(res: ServerResponseLike, payload: AuthCookiePayload) {
  return (async () => {
    const value = await signAuthCookie(payload);
    const cookie = `uco_auth=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7*24*60*60}`;
    setCookieOnResponse(res, cookie);
  })();
}

function appendSetCookie(res: ServerResponseLike, cookie: string) {
  if (res?.setHeader) {
    const existing = res.getHeader ? res.getHeader('Set-Cookie') : undefined;
    if (existing) {
      const arr = Array.isArray(existing) ? existing.concat(cookie) : [existing as string, cookie];
      res.setHeader('Set-Cookie', arr);
    } else {
      res.setHeader('Set-Cookie', cookie);
    }
  } else if (res?.headers) {
    handleHeaders(res.headers, cookie);
  }
}

export function clearAuthCookieServer(res: ServerResponseLike) {
  const cookie = 'uco_auth=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
  appendSetCookie(res, cookie);
}
