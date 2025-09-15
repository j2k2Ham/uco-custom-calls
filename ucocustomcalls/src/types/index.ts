export type CategoryHandle = "duck" | "goose" | "lanyards";

export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: CategoryHandle;
  price: number;            // in USD (cents optional)
  images: { src: string; alt: string }[];
  badges?: string[];        // e.g., ["Single Reed", "Acrylic"]
  options?: {
    reed?: ("single" | "double")[];
    color?: string[];
  };
  audio?: { src: string; label: string }[]; // sound files per product
  inStock: boolean;
};
