"use client";

import { notFound } from "next/navigation";
import { PRODUCTS } from "@/lib/products";
import Image from "next/image";
import { AddToCartButton } from "@/components/AddToCartButton";
import { AudioPlayer } from "@/components/AudioPlayer";
import { Price } from "@/components/Price";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = PRODUCTS.find(p => p.slug === params.slug);
  if (!product) return notFound();

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 lg:grid lg:grid-cols-2 lg:gap-10">
      <div>
        <div className="relative aspect-square rounded-lg overflow-hidden border border-camo-light">
          <Image src={product.images[0].src} alt={product.images[0].alt} fill className="object-cover" />
        </div>
        {product.images.slice(1).length > 0 && (
          <ul className="mt-3 grid grid-cols-4 gap-2">
            {product.images.slice(1).map((img, i) => (
              <li key={i} className="relative aspect-square border border-camo-light rounded">
                <Image src={img.src} alt={img.alt} fill className="object-cover" />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8 lg:mt-0">
        <h1 className="text-3xl font-semibold">{product.title}</h1>
        <p className="mt-1 text-brass text-xl"><Price cents={product.price} /></p>
        <p className="mt-4 text-sky">{product.description}</p>

        {product.audio && product.audio.length > 0 && (
          <div className="mt-6">
            <h2 className="font-semibold mb-2">Sound Files</h2>
            <ul className="space-y-3">
              {product.audio.map(a => (
                <li key={a.src}><AudioPlayer src={a.src} label={a.label} /></li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6">
          <AddToCartButton product={product} />
        </div>

        <div className="mt-8 text-sm text-sky/80">
          <p>Free returns within 30 days. Built to perform wet or dry, cold or warm.</p>
        </div>
      </div>
    </section>
  );
}
