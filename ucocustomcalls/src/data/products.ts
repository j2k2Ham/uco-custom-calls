// Placeholder product catalog for UCO Custom Calls rebuild.
// Replace placeholder names, descriptions, and pricing with real data.

export type ProductCategory = 'duck-calls' | 'goose-calls' | 'lanyards' | 'accessories';

export interface ProductImage {
  file: string; // relative to /public/images
  alt?: string;
  primary?: boolean;
}

export interface Product {
  id: string; // slug-friendly unique id
  name: string;
  category: ProductCategory;
  priceCents: number; // placeholder pricing
  shortDescription: string;
  longDescription: string;
  features: string[];
  images: ProductImage[];
  inStock: boolean;
}

// Helper for building product objects
function p(partial: Omit<Product, 'inStock' | 'features' | 'longDescription'> & { longDescription?: string; features?: string[]; inStock?: boolean }): Product {
  return {
    longDescription: partial.longDescription || 'Detailed description forthcoming. Replace with craftsmanship notes, materials, tone, and recommended use cases.',
    features: partial.features || ['Hand tuned', 'Acrylic barrel', 'Placeholder feature'],
    inStock: partial.inStock ?? true,
    ...partial,
  } as Product;
}

// Basic heuristic mapping of existing image filenames to categories.
const imagePool = {
  duck: ['woodie.jpg','ww.jpg','bd.jpg','wc.jpg','whh.jpg','gch.jpg','gt3.jpg'],
  goose: ['goose.jpg','obla2.jpg'],
  lanyard: [
    's529409883183282941_p352_i1_w2048.jpeg',
    's529409883183282941_p352_i1_w2048_1.jpeg',
    's529409883183282941_p352_i2_w3024.jpeg',
    's529409883183282941_p357_i1_w2048.jpeg',
    's529409883183282941_p357_i1_w2048_1.jpeg',
    's529409883183282941_p357_i2_w3024.jpeg'
  ],
  misc: [
    's529409883183282941_p371_i1_w2048.jpeg','s529409883183282941_p371_i1_w2048_1.jpeg','s529409883183282941_p371_i2_w3024.jpeg',
    's529409883183282941_p378_i1_w2048.jpeg','s529409883183282941_p378_i1_w2048_1.jpeg','s529409883183282941_p378_i2_w3024.jpeg',
    's529409883183282941_p381_i1_w2048.jpeg','s529409883183282941_p381_i1_w2048_1.jpeg','s529409883183282941_p381_i2_w3024.jpeg'
  ]
};

export const products: Product[] = [
  p({
    id: 'acrylic-single-reed-1',
    name: 'Acrylic Single Reed Call (Variant 1)',
    category: 'duck-calls',
    priceCents: 7999,
    shortDescription: 'Versatile single reed acrylic duck call.',
    images: imagePool.duck.slice(0,2).map((f,i) => ({ file: f, primary: i===0 }))
  }),
  p({
    id: 'acrylic-double-reed-1',
    name: 'Acrylic Double Reed Call (Variant 1)',
    category: 'duck-calls',
    priceCents: 8499,
    shortDescription: 'User-friendly double reed for raspy bottom end.',
    images: imagePool.duck.slice(2,4).map((f,i) => ({ file: f, primary: i===0 }))
  }),
  p({
    id: 'goose-short-reed-1',
    name: 'Short Reed Goose Call (Prototype)',
    category: 'goose-calls',
    priceCents: 8999,
    shortDescription: 'Responsive short reed goose call for clucks and moans.',
    images: imagePool.goose.slice(0,1).map((f,i) => ({ file: f, primary: i===0 }))
  }),
  p({
    id: 'goose-short-reed-2',
    name: 'Short Reed Goose Call (Alt Finish)',
    category: 'goose-calls',
    priceCents: 9299,
    shortDescription: 'Alternate finish variant of short reed goose call.',
    images: imagePool.goose.slice(1,2).map((f,i) => ({ file: f, primary: i===0 }))
  }),
  p({
    id: 'paracord-lanyard-1',
    name: 'Paracord Lanyard (6 Drop)',
    category: 'lanyards',
    priceCents: 4499,
    shortDescription: 'Durable hand-woven paracord lanyard with six drops.',
    images: imagePool.lanyard.slice(0,3).map((f,i) => ({ file: f, primary: i===0 }))
  }),
  p({
    id: 'paracord-lanyard-2',
    name: 'Paracord Lanyard (Deluxe 8 Drop)',
    category: 'lanyards',
    priceCents: 4999,
    shortDescription: 'Deluxe variant with eight reinforced drops.',
    images: imagePool.lanyard.slice(3,6).map((f,i) => ({ file: f, primary: i===0 }))
  }),
  p({
    id: 'accessory-gallery-pack',
    name: 'Accessory Gallery Pack (Placeholder)',
    category: 'accessories',
    priceCents: 1999,
    shortDescription: 'Assorted accessory images to be curated.',
    images: imagePool.misc.slice(0,4).map((f,i) => ({ file: f, primary: i===0 }))
  })
];

export function getProducts(category?: ProductCategory): Product[] {
  if (!category) return products;
  return products.filter(p => p.category === category);
}

export function getProduct(slug: string): Product | undefined {
  return products.find(p => p.id === slug);
}
