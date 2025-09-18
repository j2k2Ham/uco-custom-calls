"use client";
import { useState, useMemo } from 'react';
import { PRODUCTS, CATEGORIES } from '@/lib/products';
import { ProductGrid } from '@/components/ProductGrid';
import { CategoryButtons } from '@/components/CategoryButtons';

export function CategoryBrowser() {
  const defaultHandle = 'duck';
  const [handle, setHandle] = useState<string>(defaultHandle);

  const products = useMemo(() => PRODUCTS.filter(p => p.category === handle), [handle]);
  const category = CATEGORIES.find(c => c.handle === handle);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6">
        <div>
          <CategoryButtons activeHandle={handle} onSelect={setHandle} />
        </div>
        <div className="h-12 flex items-center">
          <h1 className="text-3xl font-semibold leading-tight">{category?.name}</h1>
        </div>
      </div>
      <div>
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <p className="text-sm text-sky/70">No items available in this category yet.</p>
        )}
      </div>
    </div>
  );
}
