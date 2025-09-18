import { NextResponse } from 'next/server';
import { clearAuthCookieServer } from '@/lib/authCookie';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  clearAuthCookieServer(res);
  return res;
}
