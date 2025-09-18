import { PRODUCTS } from '@/lib/products';
import { productsListingUrl } from '@/lib/urls';
import { breadcrumbJsonLD } from '@/lib/structuredData';
import { ProductGrid } from '@/components/ProductGrid';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/products';
import type { Metadata } from 'next';

const title = 'All Products | UCO Custom Calls';
const description = 'Browse all handcrafted duck & goose calls, lanyards and accessories from UCO Custom Calls.';
export const metadata: Metadata = {
  title,
  description,
  openGraph: { type: 'website', title, description, url: 'https://ucocustomcalls.com/products' },
  twitter: { card: 'summary', title, description },
  alternates: { canonical: '/products' }
};

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-10">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLD([
            { name: 'Products', url: productsListingUrl() }
          ]))
        }}
      />
      <header className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold">All Products</h1>
        <p className="text-sm text-gray-300 max-w-2xl">Explore handcrafted duck and goose calls along with premium paracord lanyards. All pricing and descriptions are placeholders pending final catalog curation.</p>
        <div className="mt-4 flex flex-wrap gap-4">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.handle}
              href={`/category/${cat.handle}`}
              className={[
                'px-5 py-2.5 rounded-md font-medium shadow-sm shadow-black/40 transition-colors',
                cat.handle === 'duck'
                  ? 'bg-brass text-black hover:shadow-md'
                  : cat.handle === 'goose'
                    ? 'border border-brass hover:bg-brass/10'
                    : cat.handle === 'accessories'
                      ? 'border border-camo-light hover:bg-camo-light/60'
                      : 'border border-camo-light hover:bg-camo-light'
              ].join(' ')}
            >
              {cat.name.replace('Paracord ', '')}
            </Link>
          ))}
        </div>
      </header>
      <ProductGrid products={PRODUCTS} />
    </div>
  );
}
