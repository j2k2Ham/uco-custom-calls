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
  it('builds product data with rating', () => {
    const json = productJsonLD({
      name: 'Test Product',
      description: 'Desc',
      sku: 'sku1',
      image: '/images/test.png',
      priceCents: 1234,
      url: 'https://example.com/p/test',
      ratingValue: 4.5,
      ratingCount: 10
    });
    expect(json['@type']).toBe('Product');
    expect(json.offers.price).toBe('12.34');
    expect(json.aggregateRating?.ratingValue).toBe(4.5);
    expect(json.aggregateRating?.reviewCount).toBe(10);
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
