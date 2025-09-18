import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { readonly products: readonly Product[] }) {
  return (
    <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-stretch list-none p-0 m-0">
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </ul>
  );
}
