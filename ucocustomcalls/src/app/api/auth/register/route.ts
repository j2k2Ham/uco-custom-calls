import { NextRequest, NextResponse } from 'next/server';
import { createUser, toPayload } from '@/lib/serverUsers';
import { setAuthCookieServer } from '@/lib/authCookie';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, firstName, lastName } = body || {};
    if (!email || !password) return NextResponse.json({ error: 'Email & password required' }, { status: 400 });
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    if (password.length < 6) return NextResponse.json({ error: 'Password too short' }, { status: 400 });
    const name = [firstName, lastName].filter(Boolean).join(' ').trim() || undefined;
    const user = createUser(email, name, password);
    const res = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
    await setAuthCookieServer(res, toPayload(user));
    return res;
  } catch (err: any) {
    const msg = err?.message || 'Registration failed';
    const code = msg.includes('exists') ? 409 : 500;
    return NextResponse.json({ error: msg }, { status: code });
  }
}
