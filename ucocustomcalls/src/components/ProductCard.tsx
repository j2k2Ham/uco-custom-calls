import Link from "next/link";
import Image from "next/image";
import { Product, formatPriceFromCents, getPriceCents } from "@/types/product";
import { Badge } from "./Badge";

export function ProductCard({ product, priority }: { readonly product: Product; priority?: boolean }) {
  const firstImage = product.images[0];
  return (
    <li className="group rounded-lg overflow-hidden border border-camo-light hover:border-brass/60 transition-colors flex bg-camo-light/30 w-full">
      <Link href={`/products/${product.slug}`} className="flex flex-col flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass/60">
        <div className="relative aspect-square overflow-hidden">
          {firstImage && (
            <Image src={firstImage.src} alt={firstImage.alt} fill priority={priority} sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" aria-hidden="true" />
        </div>
        <div className="p-4 flex flex-col flex-1 min-h-[180px] bg-black text-camo-light transition-colors duration-300 group-hover:bg-black/90">
          <h3 className="font-medium flex-0 leading-snug text-camo-light group-hover:text-camo-light">{product.title}</h3>
          <div className="mt-1 text-brass flex-0">{formatPriceFromCents(getPriceCents(product))}</div>
          <div className="mt-auto pt-2 flex gap-2 flex-wrap min-h-[30px]">
            {product.badges?.map(b => <Badge key={b} label={b} />)}
          </div>
        </div>
      </Link>
    </li>
  );
}
