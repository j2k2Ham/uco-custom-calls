import { notFound } from "next/navigation";
import type { Metadata } from 'next';
import { PRODUCTS, CATEGORIES } from "@/lib/products";
import { categoryUrl, productsListingUrl } from '@/lib/urls';
import { breadcrumbJsonLD } from '@/lib/structuredData';
import { ProductGrid } from "@/components/ProductGrid";
import { CategoryNav } from "@/components/CategoryNav";

interface CategoryPageParams { handle: string }
interface CategoryPageProps { params: CategoryPageParams }

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = CATEGORIES.find(c => c.handle === params.handle);
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

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = CATEGORIES.find(c => c.handle === params.handle);
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
