import { NextResponse, type NextRequest } from 'next/server';
import { verifyAuthCookie } from './src/lib/authCookie';

// Auth protection for /account (dev + server mode).
// 1. If no cookie -> redirect home.
// 2. If present but invalid signature/malformed -> clear + redirect.
// 3. Valid cookie -> allow request (httpOnly when using server auth mode).
export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === '/account') {
    const cookie = req.cookies.get('uco_auth');
    if (!cookie) {
      const url = req.nextUrl.clone();
      url.pathname = '/';
      url.searchParams.set('from', 'account');
      return NextResponse.redirect(url);
    }
    const payload = await verifyAuthCookie(cookie.value);
    if (!payload) {
      const url = req.nextUrl.clone();
      url.pathname = '/';
      url.searchParams.set('from', 'account');
      const res = NextResponse.redirect(url);
      // Clear the invalid cookie
      res.cookies.set({ name: 'uco_auth', value: '', path: '/', maxAge: 0 });
      return res;
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/account'],
};
