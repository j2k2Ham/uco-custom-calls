import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, verifyPassword, toPayload } from '@/lib/serverUsers';
import { setAuthCookieServer } from '@/lib/authCookie';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body || {};
    if (!email || !password) return NextResponse.json({ error: 'Email & password required' }, { status: 400 });
    const user = findUserByEmail(email);
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    if (!verifyPassword(user, password)) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    const res = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
    await setAuthCookieServer(res, toPayload(user));
    return res;
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
