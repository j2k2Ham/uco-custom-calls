"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import type { Product } from "@/types/product";

export function ProductGallery({ product }: { product: Product }) {
  const [index, setIndex] = useState(0);
  const liveRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (liveRef.current) {
      liveRef.current.textContent = `Showing image ${index + 1} of ${product.images.length}`;
    }
  }, [index, product.images.length]);

  function select(i: number) {
    setIndex(i);
  }

  return (
    <div>
      <div className="relative aspect-square rounded-lg overflow-hidden border border-camo-light">
        <Image
          key={product.images[index].src}
          src={product.images[index].src}
          alt={product.images[index].alt}
          fill
          className="object-cover"
          priority={index === 0}
        />
      </div>
      <div aria-live="polite" aria-atomic="true" className="sr-only" ref={liveRef} />
      {product.images.length > 1 && (
        <ul className="mt-3 grid grid-cols-5 gap-2" role="listbox" aria-label="Product Images">
          {product.images.map((img, i) => {
            const active = i === index;
            return (
              <li key={img.src}>
                <button
                  type="button"
                  onClick={() => select(i)}
                  onKeyDown={e => {
                    if (e.key === 'ArrowRight') select((i + 1) % product.images.length);
                    if (e.key === 'ArrowLeft') select((i - 1 + product.images.length) % product.images.length);
                  }}
                  aria-selected={active}
                  role="option"
                  className={[
                    "relative aspect-square border rounded overflow-hidden focus:outline-none focus:ring-2 focus:ring-brass",
                    active ? "border-brass" : "border-camo-light hover:border-brass/60"
                  ].join(" ")}
                >
                  <Image src={img.src} alt="" fill className="object-cover" />
                  <span className="sr-only">Select image {i + 1}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}