import { notFound } from "next/navigation";
import type { Metadata } from 'next';
import { PRODUCTS, CATEGORIES } from "@/lib/products";
import { categoryUrl, productsListingUrl } from '@/lib/urls';
import { breadcrumbJsonLD } from '@/lib/structuredData';
import { CategoryPageFrame } from "@/components/CategoryPageFrame";
import { CategoryProductArea } from "@/components/CategoryProductArea";

type CategoryPageParams = { handle: string };

export async function generateMetadata({ params }: { params: CategoryPageParams }): Promise<Metadata> {
  const resolved = await Promise.resolve(params);
  const category = CATEGORIES.find(c => c.handle === resolved.handle);
  if (!category) return { title: 'Category Not Found' };
  const title = category.handle === 'gear' ? `Gear | UCO Custom Calls` : `${category.name} Calls | UCO Custom Calls`;
  const baseDesc = `Browse ${category.name.toLowerCase()} calls and gear from UCO Custom Calls.`;
  const gearDesc = 'Specialized waterfowl gear: maintenance tools, lanyard hardware, apparel, and upcoming tuning kits built to extend performance in harsh wetland conditions.';
  const description = category.handle === 'gear' ? gearDesc : baseDesc;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: categoryUrl(category.handle) },
    twitter: { card: 'summary', title, description },
    alternates: { canonical: `/category/${category.handle}` },
    keywords: category.handle === 'gear' ? [
      'waterfowl gear','duck call tools','goose call maintenance','lanyard hardware','camo hat','uco gear','waterfowl tuning kits'
    ] : undefined
  };
}

export default async function CategoryPage({ params }: { readonly params: CategoryPageParams }) {
  const resolved = await Promise.resolve(params);
  const category = CATEGORIES.find(c => c.handle === resolved.handle);
  if (!category) return notFound();
  const products = PRODUCTS.filter(p => p.category === category.handle);
  return (
    <CategoryPageFrame title={category.name}>
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
      <CategoryProductArea products={products} emptyMessage={category.handle === 'gear' ? undefined : 'No items available in this category yet.'} />
    </CategoryPageFrame>
  );
}
