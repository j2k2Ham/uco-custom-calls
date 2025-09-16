import { PRODUCTS } from '@/lib/products';
import { ProductGrid } from '@/components/ProductGrid';
import { CategoryNav } from '@/components/CategoryNav';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Products | UCO Custom Calls',
  description: 'Browse all handcrafted duck & goose calls, lanyards and accessories from UCO Custom Calls.' ,
  openGraph: {
    type: 'website',
    title: 'All Products | UCO Custom Calls',
    description: 'Browse all handcrafted duck & goose calls, lanyards and accessories from UCO Custom Calls.',
    url: 'https://ucocustomcalls.com/products'
  },
  alternates: { canonical: '/products' }
};

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-10">
      <header className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold">All Products</h1>
        <p className="text-sm text-gray-300 max-w-2xl">Explore handcrafted duck and goose calls along with premium paracord lanyards. All pricing and descriptions are placeholders pending final catalog curation.</p>
        <CategoryNav />
      </header>
      <ProductGrid products={PRODUCTS} />
    </div>
  );
}
