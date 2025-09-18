import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthCookie, setAuthCookieServer } from '@/lib/authCookie';
import { updateUserName, toPayload } from '@/lib/serverUsers';

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get('uco_auth')?.value;
  const payload = await verifyAuthCookie(cookie);
  if (!payload) return NextResponse.json({ user: null }, { status: 200 });
  return NextResponse.json({ user: payload });
}

export async function PATCH(req: NextRequest) {
  try {
    const cookie = req.cookies.get('uco_auth')?.value;
    const payload = await verifyAuthCookie(cookie);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json();
    const { firstName, lastName } = body || {};
    if (!firstName?.trim() || !lastName?.trim()) return NextResponse.json({ error: 'Name required' }, { status: 400 });
    const updated = updateUserName(payload.id, `${firstName.trim()} ${lastName.trim()}`);
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const res = NextResponse.json({ user: { id: updated.id, email: updated.email, name: updated.name } });
    await setAuthCookieServer(res, toPayload(updated));
    return res;
  } catch {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
