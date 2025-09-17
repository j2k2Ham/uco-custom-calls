import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'UCO Custom Calls';
export const contentType = 'image/png';

// naive in-memory rate limit (per edge instance) – acceptable for low traffic preview
const hits: Record<string, { count: number; ts: number }> = {};
const WINDOW_MS = 60_000; // 1 minute
const MAX_PER_WINDOW = 30;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ip = (req.headers.get('x-forwarded-for') || 'anon').split(',')[0].trim();
  const now = Date.now();
  const rec = hits[ip];
  if (!rec || now - rec.ts > WINDOW_MS) {
    hits[ip] = { count: 1, ts: now };
  } else {
    rec.count++;
    if (rec.count > MAX_PER_WINDOW) {
      return new Response('Rate limit exceeded', { status: 429 });
    }
  }
  const title = (searchParams.get('title') || 'UCO Custom Calls').slice(0, 80);
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'linear-gradient(135deg,#0a1a12,#1d3b2b)',
          fontSize: 60,
          color: 'white',
          padding: '72px',
          fontFamily: 'system-ui, Arial'
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.7, marginBottom: 24 }}>UCO Custom Calls</div>
        <div style={{ fontWeight: 600, lineHeight: 1.1 }}>{title}</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
