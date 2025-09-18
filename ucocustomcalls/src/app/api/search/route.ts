import { NextResponse } from 'next/server';
import { searchProducts } from '@/lib/productStore';

export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const results = searchProducts(q).map(p => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description,
    category: p.category,
    priceCents: p.priceCents,
    image: p.images?.find(i => i.primary)?.src || p.images?.[0]?.src || ''
  }));
  return NextResponse.json({ query: q, count: results.length, results });
}
