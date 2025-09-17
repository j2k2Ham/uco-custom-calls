import { test, expect } from '@playwright/test';

test.describe('Crawler endpoints', () => {
  test('sitemap lists product + category urls', async ({ page }) => {
    const res = await page.request.get('/sitemap.xml');
    expect(res.ok()).toBeTruthy();
    const xml = await res.text();
    expect(xml).toContain('<urlset');
    expect(xml).toContain('/products/pintail-acrylic-whiskey-river');
    expect(xml).toContain('/category/duck');
  });

  test('robots contains sitemap reference', async ({ page }) => {
    const res = await page.request.get('/robots.txt');
    expect(res.ok()).toBeTruthy();
    const txt = await res.text();
    expect(txt.toLowerCase()).toContain('sitemap:');
    expect(txt).toContain('https://www.ucocustomcalls.com/sitemap.xml');
  });
});
