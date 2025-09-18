import { describe, it, expect } from 'vitest';
import { searchProducts } from './productStore';

describe('productStore.searchProducts', () => {
  it('returns empty array for blank query', () => {
    expect(searchProducts('')).toEqual([]);
  });
  it('finds product by title term', () => {
    const r = searchProducts('Pintail');
    expect(r.some(p => /pintail/i.test(p.title))).toBe(true);
  });
  it('ranks title matches higher', () => {
    const r = searchProducts('Pintail open water');
    expect(r[0].title.toLowerCase()).toContain('pintail');
  });
});
