import { NextRequest } from 'next/server';

// Simple in-memory store (non-persistent) – acceptable for preview/dev.
const seen = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json().catch(() => ({}));
    const email = (data.email || '').toString().trim().toLowerCase();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return new Response('Invalid email', { status: 400 });
    }
    const duplicate = seen.has(email);
    if (!duplicate) seen.add(email);
    // Placeholder: In production, dispatch to queue / email service.
    return new Response(duplicate ? 'Already subscribed' : 'Subscribed', { status: 202 });
  } catch {
    return new Response('Server error', { status: 500 });
  }
}
