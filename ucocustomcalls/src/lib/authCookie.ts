// Dev-only signed cookie helper (NOT secure for production)
// Format: uco_auth=<b64Payload>.<hash>
// hash = simple SHA-256 of (b64Payload + secret) truncated for brevity.

// Secret resolution: prefer process.env.AUTH_COOKIE_SECRET (node / server), fallback to NEXT_PUBLIC, else throw error.
const SECRET = (() => {
  if (typeof process !== 'undefined') {
    if (process.env.AUTH_COOKIE_SECRET) return process.env.AUTH_COOKIE_SECRET;
    if (process.env.NEXT_PUBLIC_AUTH_COOKIE_SECRET) return process.env.NEXT_PUBLIC_AUTH_COOKIE_SECRET;
    if (process.env.NODE_ENV === 'test') return 'test-secret'; // safe deterministic secret for unit tests
  }
  throw new Error('AUTH_COOKIE_SECRET environment variable is required for authCookie. Refusing to use insecure default.');
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
