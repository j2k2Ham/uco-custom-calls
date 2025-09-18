import { notFound } from "next/navigation";
import type { Metadata } from 'next';
import { PRODUCTS, CATEGORIES } from "@/lib/products";
import { categoryUrl, productsListingUrl } from '@/lib/urls';
import { breadcrumbJsonLD } from '@/lib/structuredData';
import { ProductGrid } from "@/components/ProductGrid";
import { CategoryButtons } from "@/components/CategoryButtons";
import { AccessoryContent } from "@/components/AccessoryContent";

type CategoryPageParams = { handle: string };

export async function generateMetadata({ params }: { params: CategoryPageParams }): Promise<Metadata> {
  const resolved = await Promise.resolve(params);
  const category = CATEGORIES.find(c => c.handle === resolved.handle);
  if (!category) return { title: 'Category Not Found' };
  const title = `${category.name} Calls | UCO Custom Calls`;
  const baseDesc = `Browse ${category.name.toLowerCase()} calls and accessories from UCO Custom Calls.`;
  const accessoriesDesc = 'Specialized waterfowl call accessories, maintenance tools, lanyard hardware and upcoming tuning kits to extend performance in harsh conditions.';
  const description = category.handle === 'accessories' ? accessoriesDesc : baseDesc;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: categoryUrl(category.handle) },
    twitter: { card: 'summary', title, description },
    alternates: { canonical: `/category/${category.handle}` }
  };
}

export default async function CategoryPage({ params }: { readonly params: CategoryPageParams }) {
  const resolved = await Promise.resolve(params);
  const category = CATEGORIES.find(c => c.handle === resolved.handle);
  if (!category) return notFound();
  const products = PRODUCTS.filter(p => p.category === category.handle);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLD([
            { name: 'Products', url: productsListingUrl() },
            { name: category.name, url: categoryUrl(category.handle) }
          ]))
        }}
      />
  <CategoryButtons className="mb-6" />
      <h1 className="text-3xl font-semibold mb-6">{category.name}</h1>
      {category.handle === 'accessories' && <AccessoryContent />}
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : category.handle !== 'accessories' ? (
        <p className="text-sm text-sky/70">No items available in this category yet.</p>
      ) : null}
    </section>
  );
}
