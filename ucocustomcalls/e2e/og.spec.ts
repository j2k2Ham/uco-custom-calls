import { test, expect } from '@playwright/test';

// Basic smoke tests for dynamic Open Graph image endpoints

test.describe('OG image endpoints', () => {
  test('root /og endpoint returns png', async ({ request }) => {
    const res = await request.get('/og?title=Test+Image');
    expect(res.ok()).toBeTruthy();
    expect(res.headers()['content-type']).toContain('image/png');
    const buf = await res.body();
    expect(buf.byteLength).toBeGreaterThan(1000); // minimal size
  });

  test('product opengraph-image returns png', async ({ request }) => {
    const res = await request.get('/products/pintail-acrylic-whiskey-river/opengraph-image');
    expect(res.ok()).toBeTruthy();
    expect(res.headers()['content-type']).toContain('image/png');
    const buf = await res.body();
    expect(buf.byteLength).toBeGreaterThan(1000);
  });
});
