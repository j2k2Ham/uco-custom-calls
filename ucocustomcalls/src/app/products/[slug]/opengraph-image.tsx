import { ImageResponse } from 'next/og';
import { headers } from 'next/headers';
import { PRODUCTS } from '@/lib/products';
import { strongEtag } from '../../../lib/etag';

const hits: Record<string, { count: number; ts: number }> = {};
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 40;

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface ProductPageParams { params: { slug: string } }

export default async function Image({ params }: ProductPageParams) {
  const hdrs = await headers();
  const forwarded = hdrs.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'anon';
  const now = Date.now();
  const rec = hits[ip];
  if (!rec || now - rec.ts > WINDOW_MS) {
    hits[ip] = { count: 1, ts: now };
  } else {
    rec.count++;
    if (rec.count > MAX_PER_WINDOW) {
      if (process.env.NEXT_PUBLIC_LOG_RATE_LIMIT === '1') {
        console.warn(`[product-og] rate limit exceeded ip=${ip} count=${rec.count}`);
      }
      return new Response('Rate limit exceeded', { status: 429 }) as unknown as ImageResponse;
    }
  }
  const product = PRODUCTS.find(p => p.slug === params.slug);
  if (!product) {
    return new Response('Not Found', { status: 404 }) as unknown as ImageResponse;
  }
  const title = product.title;
  const etag = await strongEtag('pog:' + title);
  const ifNoneMatch = hdrs.get('if-none-match');
  if (ifNoneMatch === etag) {
    return new Response(null, { status: 304, headers: { ETag: etag } }) as unknown as ImageResponse;
  }
  const primary = product?.images?.[0]?.src;
  const image = new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          background: 'linear-gradient(120deg,#0a1a12,#143323)',
          fontSize: 54,
          color: 'white',
          padding: '60px 70px',
          fontFamily: 'system-ui, Arial'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
          <div style={{ fontSize: 28, opacity: 0.7, marginBottom: 24 }}>UCO Custom Calls</div>
          <div style={{ fontWeight: 600, lineHeight: 1.05, maxWidth: 620 }}>{title}</div>
        </div>
        {primary && (
          <div style={{ width: 480, height: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 24, background: '#1e2d25', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={primary} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
      </div>
    ),
    size
  );
  return new Response(image.body, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=10800, stale-while-revalidate=86400'
      , 'ETag': etag
    }
  });
}
