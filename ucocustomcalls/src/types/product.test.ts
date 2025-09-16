import { describe, it, expect } from 'vitest';
import { getPriceCents } from './product';

describe('getPriceCents heuristic', () => {
  it('returns priceCents when present', () => {
    expect(getPriceCents({ priceCents: 12999, price: 15 })).toBe(12999);
  });
  it('handles fractional dollars (<1)', () => {
    expect(getPriceCents({ price: 0.5 })).toBe(50);
  });
  it('treats small integer dollars 1..99 as dollars', () => {
    expect(getPriceCents({ price: 15 })).toBe(1500);
  });
  it('treats integer >=100 as cents', () => {
    expect(getPriceCents({ price: 100 })).toBe(100);
    expect(getPriceCents({ price: 1000 })).toBe(1000);
  });
  it('treats large cents value unchanged', () => {
    expect(getPriceCents({ price: 12999 })).toBe(12999);
  });
  it('treats decimal dollars as dollars', () => {
    expect(getPriceCents({ price: 19.99 })).toBe(1999);
  });
  it('falls back to 0 with no usable fields', () => {
    expect(getPriceCents({})).toBe(0);
  });
});
