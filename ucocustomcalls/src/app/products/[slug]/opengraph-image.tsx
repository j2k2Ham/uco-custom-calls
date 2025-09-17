import { ImageResponse } from 'next/og';
import { PRODUCTS } from '@/lib/products';

const hits: Record<string, { count: number; ts: number }> = {};
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 40;

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface ProductPageParams { params: { slug: string } }

export default async function Image({ params }: ProductPageParams) {
  const ip = 'anon';
  const now = Date.now();
  const rec = hits[ip];
  if (!rec || now - rec.ts > WINDOW_MS) {
    hits[ip] = { count: 1, ts: now };
  } else {
    rec.count++;
    if (rec.count > MAX_PER_WINDOW) {
      return new Response('Rate limit exceeded', { status: 429 }) as unknown as ImageResponse;
    }
  }
  const product = PRODUCTS.find(p => p.slug === params.slug);
  const title = product ? product.title : 'Product Not Found';
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'linear-gradient(120deg,#0a1a12,#143323)',
          fontSize: 62,
          color: 'white',
          padding: '70px',
          fontFamily: 'system-ui, Arial'
        }}
      >
        <div style={{ fontSize: 30, opacity: 0.7, marginBottom: 24 }}>UCO Custom Calls</div>
        <div style={{ fontWeight: 600, lineHeight: 1.05, maxWidth: 900 }}>{title}</div>
      </div>
    ),
    size
  );
}
