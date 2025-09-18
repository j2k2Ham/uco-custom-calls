import Link from "next/link";
import Image from "next/image";
import { Product, formatPriceFromCents, getPriceCents } from "@/types/product";
import { Badge } from "./Badge";

export function ProductCard({ product }: { readonly product: Product }) {
  return (
    <li className="rounded-lg overflow-hidden border border-camo-light hover:border-brass/60 transition flex">
      <Link href={`/products/${product.slug}`} className="flex flex-col flex-1">
        <div className="relative aspect-square">
          <Image src={product.images[0].src} alt={product.images[0].alt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-medium flex-0">{product.title}</h3>
          <div className="mt-1 text-brass flex-0">{formatPriceFromCents(getPriceCents(product))}</div>
          <div className="mt-auto pt-2 flex gap-2 flex-wrap">
            {product.badges?.map(b => <Badge key={b} label={b} />)}
          </div>
        </div>
      </Link>
    </li>
  );
}
