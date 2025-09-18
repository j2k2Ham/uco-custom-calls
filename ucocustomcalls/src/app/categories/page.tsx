import type { Metadata } from 'next';
import { breadcrumbJsonLD } from '@/lib/structuredData';
import { productsListingUrl } from '@/lib/urls';
import { CategoryBrowser } from '@/components/CategoryBrowser';

export const metadata: Metadata = {
  title: 'Browse Categories | UCO Custom Calls',
  description: 'Duck, goose, paracord lanyards and gear — browse dynamically without page loads.',
  alternates: { canonical: '/categories' }
};

export default function CategoriesPage() {
  return (
    <div className="featured-bg category-bg-wrapper border-t border-camo-light/40 -mb-12 pb-12 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbJsonLD([
              { name: 'Products', url: productsListingUrl() },
              { name: 'Categories', url: '/categories' }
            ]))
          }}
        />
        <CategoryBrowser />
      </div>
    </div>
  );
}
