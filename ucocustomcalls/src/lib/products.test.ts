import { PRODUCTS, CATEGORIES } from './products';

describe('products data', () => {
  it('has at least one product', () => {
    expect(PRODUCTS.length).toBeGreaterThan(0);
  });
  it('each product has required fields', () => {
    for (const p of PRODUCTS) {
      expect(typeof p.id).toBe('string');
      expect(typeof p.slug).toBe('string');
      expect(typeof p.title).toBe('string');
      expect(typeof p.description).toBe('string');
      expect(typeof p.category).toBe('string');
  expect(typeof p.priceCents).toBe('number');
      expect(Array.isArray(p.images)).toBe(true);
      expect(typeof p.inStock).toBe('boolean');
    }
  });
  it('categories cover all product category values', () => {
    const categoryHandles = new Set(CATEGORIES.map(c => c.handle));
    for (const p of PRODUCTS) {
      expect(categoryHandles.has(p.category)).toBe(true);
    }
  });
});
