"use client";
import { useEffect } from 'react';
import { Product } from '@/types/product';
import { ProductGrid } from '@/components/ProductGrid';

export function CategoryProductArea({ products, emptyMessage }: { products: readonly Product[]; emptyMessage?: string }) {
  // Side-effect placeholder (retain hook for potential analytics or focus management)
  useEffect(() => {}, [products]);

  if (products.length === 0) {
    return <p className="text-sm text-sky/70 min-h-[160px] flex items-center">{emptyMessage || 'No items available in this category yet.'}</p>;
  }
  return <ProductGrid products={products} />;
}
