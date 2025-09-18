import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthCookie } from '@/lib/authCookie';
import { changeUserPassword } from '@/lib/serverUsers';

export async function POST(req: NextRequest) {
  try {
    const cookie = req.cookies.get('uco_auth')?.value;
    const payload = await verifyAuthCookie(cookie);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json();
    const { current, next, confirm } = body || {};
    if (!current || !next || !confirm) return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    if (next !== confirm) return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
    if (next.length < 6) return NextResponse.json({ error: 'New password too short' }, { status: 400 });
    if (current === next) return NextResponse.json({ error: 'New password must differ' }, { status: 400 });
    changeUserPassword(payload.id, current, next);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = (err && typeof err === 'object' && 'message' in err) ? String((err as { message?: unknown }).message) : '';
    const msg = message.includes('Current password invalid') ? 'Current password invalid' : 'Change failed';
    const status = msg === 'Current password invalid' ? 400 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
