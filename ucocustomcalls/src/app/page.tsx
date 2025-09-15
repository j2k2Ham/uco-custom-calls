import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { PRODUCTS } from "@/lib/products";

export default function HomePage() {
  const featured = PRODUCTS.slice(0, 6);
  return (
    <>
      <Hero />
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-2xl font-semibold mb-4">Featured</h2>
        <ProductGrid products={featured} />
      </section>
    </>
  );
}
