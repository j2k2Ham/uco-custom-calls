import { describe, it, expect } from 'vitest';
import { contactPageJsonLD } from './structuredData';

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
