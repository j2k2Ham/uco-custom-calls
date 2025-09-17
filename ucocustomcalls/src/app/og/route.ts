import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'UCO Custom Calls';
export const contentType = 'image/png';

// /og?title=Custom+Title
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title')?.slice(0, 80) || 'UCO Custom Calls';
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
          fontSize: 64,
          color: 'white',
          padding: '80px',
          fontFamily: 'system-ui, Arial'
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.7, marginBottom: 20 }}>UCO Custom Calls</div>
        <div style={{ fontWeight: 600, lineHeight: 1.1 }}>{title}</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
