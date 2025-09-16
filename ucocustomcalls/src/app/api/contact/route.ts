import { NextResponse } from "next/server";
import { sendInquiryMail } from '@/lib/mail';
import fs from 'node:fs';
import path from 'node:path';

interface InquiryPayload { name?: string; email?: string; message?: string; honey?: string }

// Simple in-memory rate limiter (scope per instance)
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_MAX = 5;
const hits: Record<string, number[]> = {};

function rateLimited(ip: string) {
  const now = Date.now();
  const arr = (hits[ip] ||= []);
  // prune
  while (arr.length && now - arr[0] > RATE_WINDOW_MS) arr.shift();
  if (arr.length >= RATE_MAX) return true;
  arr.push(now);
  return false;
}

export async function POST(req: Request) {
  let name: string | undefined;
  let email: string | undefined;
  let message: string | undefined;
  let honey: string | undefined;
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';

  const contentType = req.headers.get('content-type') || '';
  try {
    if (contentType.includes('application/json')) {
      const json = (await req.json()) as InquiryPayload;
      ({ name, email, message, honey } = json);
    } else {
      const form = await req.formData();
      name = form.get('name')?.toString();
      email = form.get('email')?.toString();
      message = form.get('message')?.toString();
      honey = form.get('honey')?.toString();
    }
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid-body' }, { status: 400 });
  }

  if (honey) {
    return NextResponse.json({ ok: false, error: 'spam-detected' }, { status: 400 });
  }
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: 'rate-limited' }, { status: 429 });
  }
  if (!name || !email || !message) {
    return NextResponse.json({ ok: false, error: 'missing-fields' }, { status: 400 });
  }

  const record = { ts: new Date().toISOString(), ip, name, email, message: message.slice(0, 2000) };
  try {
    const logDir = path.join(process.cwd(), 'data');
    const logFile = path.join(logDir, 'inquiries.log');
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
    fs.appendFileSync(logFile, JSON.stringify(record) + '\n', 'utf8');
  } catch (err) {
    console.error('Failed to persist inquiry log', err);
  }

  const mailResult = await sendInquiryMail({ name, email, message });
  if (!mailResult.ok) {
    return NextResponse.json({ ok: false, error: 'email-failed' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
