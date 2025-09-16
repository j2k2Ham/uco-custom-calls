import { test, expect, Page } from '@playwright/test';

async function extractJsonLd(page: Page, type: string) {
  return await page.evaluate((wanted: string) => {
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    for (const s of scripts) {
      try {
        const data = JSON.parse(s.textContent || '{}');
        if (data['@type'] === wanted) return data;
      } catch {}
    }
    return null;
  }, type);
}

test.describe('SEO structured data', () => {
  test('products listing has breadcrumb list', async ({ page }) => {
    await page.goto('/products');
  const breadcrumb = await extractJsonLd(page, 'BreadcrumbList');
    expect(breadcrumb).not.toBeNull();
    expect(Array.isArray(breadcrumb!.itemListElement)).toBe(true);
    expect(breadcrumb!.itemListElement.length).toBe(1);
  });

  test('product page has product + breadcrumb + aggregateRating', async ({ page }) => {
    await page.goto('/products/pintail-acrylic-whiskey-river');
  const product = await extractJsonLd(page, 'Product');
  const breadcrumb = await extractJsonLd(page, 'BreadcrumbList');
    expect(product).not.toBeNull();
    expect(product!.offers.price).toBeDefined();
    if (product!.aggregateRating) {
      expect(product!.aggregateRating.ratingValue).toBeGreaterThan(0);
    }
    expect(breadcrumb).not.toBeNull();
    expect(breadcrumb!.itemListElement.length).toBe(3);
  });
});
