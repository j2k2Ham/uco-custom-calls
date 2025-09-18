import { ImageResponse } from 'next/og';
import { strongEtag } from '../../lib/etag';

export const runtime = 'edge';
export const alt = 'UCO Custom Calls';
export const contentType = 'image/png';

const hits: Record<string, { count: number; ts: number }> = {};
const WINDOW_MS = 60_000;
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
      if (process.env.NEXT_PUBLIC_LOG_RATE_LIMIT === '1') {
        console.warn(`[og] rate limit exceeded ip=${ip} count=${rec.count}`);
      }
      return new Response('Rate limit exceeded', { status: 429 });
    }
  }
  const title = (searchParams.get('title') || 'UCO Custom Calls').slice(0, 80);
  const etag = await strongEtag('og:' + title);
  const ifNoneMatch = req.headers.get('if-none-match');
  if (ifNoneMatch === etag) {
    return new Response(null, { status: 304, headers: { ETag: etag } });
  }
  const image = new ImageResponse(
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
  return new Response(image.body, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      'ETag': etag
    }
  });
}
