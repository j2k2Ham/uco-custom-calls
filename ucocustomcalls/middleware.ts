import { NextResponse, type NextRequest } from 'next/server';
import { verifyAuthCookie } from './src/lib/authCookie';

// Dev-only protection for /account.
// 1. If no cookie -> redirect home.
// 2. If cookie present but signature invalid or payload malformed -> clear cookie + redirect.
// 3. If valid -> allow request.
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
