import { notFound } from "next/navigation";
import { PRODUCTS, CATEGORIES } from "@/lib/products";
import { ProductGrid } from "@/components/ProductGrid";

export default function CategoryPage({ params }: { params: { handle: string } }) {
  const category = CATEGORIES.find(c => c.handle === params.handle);
  if (!category) return notFound();
  const products = PRODUCTS.filter(p => p.category === category.handle);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6">{category.name}</h1>
      <ProductGrid products={products} />
    </section>
  );
}
