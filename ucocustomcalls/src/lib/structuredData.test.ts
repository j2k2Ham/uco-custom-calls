import { describe, it, expect } from 'vitest';
import { contactPageJsonLD, productJsonLD, breadcrumbJsonLD } from './structuredData';

describe('contactPageJsonLD', () => {
  it('creates valid contact page JSON-LD structure', () => {
    const json = contactPageJsonLD({ name: 'Contact', description: 'Desc', email: 'test@example.com' });
    expect(json['@context']).toBe('https://schema.org');
    expect(json['@type']).toBe('ContactPage');
    expect(json.name).toBe('Contact');
    expect(json.description).toBe('Desc');
    expect(Array.isArray(json.contactPoint)).toBe(true);
    expect(json.contactPoint[0].email).toBe('test@example.com');
  });
});

describe('productJsonLD', () => {
  it('builds product data with rating, brand, seller and multiple images', () => {
    const json = productJsonLD({
      name: 'Test Product',
      description: 'Desc',
      sku: 'sku1',
      image: ['/images/test.png','/images/test2.png'],
      priceCents: 1234,
      url: 'https://example.com/p/test',
      ratingValue: 4.5,
      ratingCount: 10,
      brandName: 'BrandX',
      sellerName: 'BrandX',
      priceValidUntil: '2030-01-01',
      category: 'duck',
      mpn: 'MPN-123',
      reviews: [
        { author: 'Alice', rating: 5, body: 'Great!', date: '2025-01-01' },
        { author: 'Bob', rating: 4, body: 'Good', date: '2025-02-01' }
      ]
    });
    expect(json['@type']).toBe('Product');
    expect(json.offers.price).toBe('12.34');
    expect(Array.isArray(json.image)).toBe(true);
    expect(json.image.length).toBe(2);
    expect(json.brand?.name).toBe('BrandX');
    expect(json.offers.seller?.name).toBe('BrandX');
    expect(json.offers.priceValidUntil).toBe('2030-01-01');
    expect(json.aggregateRating?.ratingValue).toBe(4.5);
    expect(json.aggregateRating?.reviewCount).toBe(10);
    interface ExtendedJson { mpn: string; review: { author: { name: string } }[] }
    const extended = json as unknown as ExtendedJson;
    expect(extended.mpn).toBe('MPN-123');
    expect(Array.isArray(extended.review)).toBe(true);
    expect(extended.review.length).toBe(2);
    expect(extended.review[0].author.name).toBe('Alice');
  });

  it('omits aggregateRating when missing data', () => {
    const json = productJsonLD({
      name: 'No Rating',
      description: 'Desc',
      image: '/img.png',
      priceCents: 500,
      url: 'https://example.com/p/nr'
    });
    expect(json.aggregateRating).toBeUndefined();
  });
});

describe('breadcrumbJsonLD', () => {
  it('assigns sequential positions', () => {
    const json = breadcrumbJsonLD([
      { name: 'Level1', url: 'https://example.com/1' },
      { name: 'Level2', url: 'https://example.com/2' }
    ]);
    expect(json.itemListElement[0].position).toBe(1);
    expect(json.itemListElement[1].position).toBe(2);
  });
});
