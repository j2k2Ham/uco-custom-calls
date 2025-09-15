"use client";
import type { Product } from "@/types";
import { useCart } from "@/hooks/useCart";

export function AddToCartButton({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <button
      onClick={() => add(product)}
      className="px-4 py-2 rounded-md bg-brass text-black hover:brightness-110"
    >
      Add to Cart
    </button>
  );
}
