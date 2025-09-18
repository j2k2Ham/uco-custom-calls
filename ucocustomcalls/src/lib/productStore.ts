import { PRODUCTS } from './products';
import type { Product } from '@/types/product';

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export interface ProductSearchResult extends Product { score: number }

export function searchProducts(query: string, limit = 20): ProductSearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  const results: ProductSearchResult[] = [];
  for (const p of PRODUCTS) {
    const haystack = [p.title, p.description, p.category, ...(p.badges||[]), ...(p.features||[])].join(' ').toLowerCase();
    let score = 0;
    for (const t of terms) {
      if (haystack.includes(t)) score += 1;
      if (p.title.toLowerCase().includes(t)) score += 2; // boost title hits
      if (p.category === t) score += 1;
    }
    if (score > 0) results.push({ ...p, score });
  }
  return results.sort((a,b) => b.score - a.score).slice(0, limit);
}
