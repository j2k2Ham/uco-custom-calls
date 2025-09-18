import { test, expect } from '@playwright/test';

test.describe('OG advanced behaviors', () => {
  test('ETag returns 304 on /og second request', async ({ request }) => {
    const first = await request.get('/og?title=CacheTest');
    expect(first.ok()).toBeTruthy();
    const etag = first.headers()['etag'];
    expect(etag).toBeTruthy();
    const second = await request.get('/og?title=CacheTest', { headers: { 'If-None-Match': etag! } });
    expect(second.status()).toBe(304);
  });

  test('product OG returns 404 for missing product', async ({ request }) => {
    const res = await request.get('/products/does-not-exist/opengraph-image');
    expect(res.status()).toBe(404);
  });

  test('product OG returns 304 on second request with ETag', async ({ request }) => {
    const first = await request.get('/products/pintail-acrylic-whiskey-river/opengraph-image');
    expect(first.ok()).toBeTruthy();
    const etag = first.headers()['etag'];
    expect(etag).toBeTruthy();
    const second = await request.get('/products/pintail-acrylic-whiskey-river/opengraph-image', { headers: { 'If-None-Match': etag! } });
    expect(second.status()).toBe(304);
  });

  test('rate limit triggers eventually (expect at least one 429)', async ({ request }) => {
    let success = 0;
    let limited = 0;
    for (let i = 0; i < 50; i++) {
      const r = await request.get('/og?title=RateLimit');
      if (r.status() === 429) { limited++; break; }
      if (r.ok()) success++;
    }
    expect(success).toBeGreaterThan(0);
    expect(limited).toBeGreaterThanOrEqual(1);
  });
});
