import { NextResponse, type NextRequest } from 'next/server';

// Lightweight dev-only protection for /account. If no uco_auth cookie, redirect to home.
export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === '/account') {
    const auth = req.cookies.get('uco_auth');
    if (!auth) {
      const url = req.nextUrl.clone();
      url.pathname = '/';
      url.searchParams.set('from', 'account');
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/account'],
};
