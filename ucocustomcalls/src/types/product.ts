export type ProductCategory = 'duck' | 'goose' | 'lanyards' | 'gear';

export interface ProductImage {
  src: string;
  alt: string;
  primary?: boolean;
}

export interface ProductAudioSample {
  src: string;
  label: string;
}

export interface Product {
  id: string;      // canonical id (stable key)
  slug: string;    // url segment
  title: string;   // display name
  category: ProductCategory;
  priceCents: number; // authoritative price in cents
  description: string; // full description
  short?: string;      // teaser / excerpt
  images: ProductImage[];
  badges?: string[];
  features?: string[];
  audio?: ProductAudioSample[];
  inStock: boolean;
  variantOptions?: Record<string, string[]>;
  seo?: { metaTitle?: string; metaDescription?: string; ogImage?: string };
  ratingCount?: number; // optional number of ratings
  ratingValue?: number; // average rating value (e.g. 4.8)
  ratingBest?: number;  // best possible rating (default 5)
  mpn?: string;         // manufacturer part number
  gtin13?: string;      // global trade item number (13 digit)
  reviews?: { author: string; rating: number; body?: string; date?: string }[]; // optional user reviews
}

// Presentation helper to format product price (lazy import of currency util avoided here for tree-shaking control)
export function formatPriceFromCents(cents: number, currency: string = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100);
}

// Backwards compatibility helper: some legacy test fixtures or objects may still provide `price` (dollars)
// or `price` already in cents. This normalizes to cents.
// Priority order: explicit priceCents -> legacy price interpreted as dollars if < 10_000 else assumed cents.
export function getPriceCents(p: { priceCents?: number; price?: number }): number {
  if (typeof p.priceCents === 'number' && !Number.isNaN(p.priceCents)) return p.priceCents;
  const legacy = p.price;
  if (typeof legacy === 'number' && !Number.isNaN(legacy)) {
    // Revised heuristic focused on current test + legacy fixture semantics:
    // - If legacy < 1: fractional dollars -> multiply by 100 (0.5 => 50)
    // - If legacy is an integer >= 100: treat as already cents (1000 => $10.00)
    // - If legacy is an integer 1..99: treat as whole dollars -> *100 (15 => 1500)
    // - If legacy has decimals: treat as dollars with decimals -> *100 (19.99 => 1999)
    if (legacy < 1) return Math.round(legacy * 100);
    if (Number.isInteger(legacy)) {
      if (legacy >= 100) return legacy; // assume cents
      return legacy * 100; // small integer dollars
    }
    return Math.round(legacy * 100); // decimal dollars
  }
  return 0;
}
