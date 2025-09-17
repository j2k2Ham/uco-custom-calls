import { Hero } from "@/components/Hero";
import { Highlights } from "@/components/Highlights";
import { ProductGrid } from "@/components/ProductGrid";
import { PRODUCTS } from "@/lib/products";

export default function HomePage() {
  const featured = PRODUCTS.slice(0, 6);
  return (
    <>
  <Hero />
  <Highlights />
      <section className="featured-bg border-t border-camo-light/40">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h2 className="text-2xl font-semibold mb-4">Featured</h2>
        <ProductGrid products={featured} />
        </div>
      </section>
    </>
  );
}
