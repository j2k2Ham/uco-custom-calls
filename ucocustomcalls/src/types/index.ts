export type CategoryHandle = "duck" | "goose" | "lanyards";

// Deprecated legacy Product shape retained for transitional compatibility.
// Prefer importing from "@/types/product" which defines authoritative Product.
export type LegacyProduct = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: CategoryHandle;
  price: number;
  images: { src: string; alt: string }[];
  badges?: string[];
  options?: {
    reed?: ("single" | "double")[];
    color?: string[];
  };
  audio?: { src: string; label: string }[];
  inStock: boolean;
};

export type { Product } from "./product";
