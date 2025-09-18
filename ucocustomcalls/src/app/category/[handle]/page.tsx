import { notFound } from "next/navigation";
import type { Metadata } from 'next';
import { PRODUCTS, CATEGORIES } from "@/lib/products";
import { categoryUrl, productsListingUrl } from '@/lib/urls';
import { breadcrumbJsonLD } from '@/lib/structuredData';
import { ProductGrid } from "@/components/ProductGrid";
import { CategoryNav } from "@/components/CategoryNav";

type CategoryPageParams = { handle: string };
// Using any in signature to satisfy Next.js internal PageProps constraint; runtime validation below
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const resolved = await Promise.resolve(params as CategoryPageParams);
  const category = CATEGORIES.find(c => c.handle === resolved.handle);
  if (!category) return { title: 'Category Not Found' };
  const title = `${category.name} Calls | UCO Custom Calls`;
  const description = `Browse ${category.name.toLowerCase()} calls and accessories from UCO Custom Calls.`;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: categoryUrl(category.handle) },
    twitter: { card: 'summary', title, description },
    alternates: { canonical: `/category/${category.handle}` }
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function CategoryPage({ params }: any) {
  const resolved = await Promise.resolve(params as CategoryPageParams);
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
      <CategoryNav />
      <h1 className="text-3xl font-semibold mb-6">{category.name}</h1>
      <ProductGrid products={products} />
    </section>
  );
}
