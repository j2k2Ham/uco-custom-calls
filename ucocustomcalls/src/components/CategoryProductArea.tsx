"use client";
import { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import { ProductGrid } from '@/components/ProductGrid';

export function CategoryProductArea({ products, emptyMessage }: { products: readonly Product[]; emptyMessage?: string }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, [products]);

  if (!ready) {
    // Skeleton grid (3 columns max) with consistent card height
    return (
      <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-stretch list-none p-0 m-0 animate-pulse" aria-hidden="true">
        {Array.from({ length: Math.min(Math.max(products.length, 3), 6) }).map((_, i) => (
          <li key={i} className="rounded-lg border border-camo-light/60 bg-camo-light/30 h-[320px]" />
        ))}
      </ul>
    );
  }

  if (products.length === 0) {
    return <p className="text-sm text-sky/70 min-h-[160px] flex items-center">{emptyMessage || 'No items available in this category yet.'}</p>;
  }
  return <ProductGrid products={products} />;
}
