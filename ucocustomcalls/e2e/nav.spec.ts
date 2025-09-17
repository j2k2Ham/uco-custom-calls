import { test, expect } from '@playwright/test';

const base = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

// Helper to emulate mobile viewport
const mobile = { width: 420, height: 820 };

test.describe('Navigation', () => {
  test('desktop Shop dropdown opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto(base + '/');
    const shopBtn = page.getByRole('button', { name: /shop/i });
    await shopBtn.click();
    await expect(page.getByRole('menu', { name: /shop/i })).toBeVisible();
    // Escape closes
    await page.keyboard.press('Escape');
    await expect(page.getByRole('menu', { name: /shop/i })).toHaveCount(0);
  });

  test('mobile shop accordion persistence only (menu not persisted)', async ({ page }) => {
    await page.setViewportSize(mobile);
    await page.goto(base + '/');
    const toggle = page.getByLabel(/open menu/i);
    await toggle.click();
    // open shop accordion
    const shopToggle = page.getByRole('button', { name: /shop/i });
    await shopToggle.click();
    await expect(page.getByText(/duck calls/i)).toBeVisible();
    await page.reload();
    // Menu closed after reload
    await expect(page.getByLabel(/open menu/i)).toBeVisible();
    // Open menu: shop accordion state should restore
    await page.getByLabel(/open menu/i).click();
    await expect(page.getByText(/duck calls/i)).toBeVisible();
  });

  test('desktop dropdown keyboard navigation', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(base + '/');
    const shopBtn = page.getByRole('button', { name: /shop/i });
    await shopBtn.press('Enter');
    const menu = page.getByRole('menu', { name: /shop/i });
    await expect(menu).toBeVisible();
    // focus should move to first item
    await expect(page.getByRole('menuitem', { name: /duck calls/i })).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('menuitem', { name: /goose calls/i })).toBeFocused();
    await page.keyboard.press('End');
    await expect(page.getByRole('menuitem', { name: /paracord lanyards/i })).toBeFocused();
    await page.keyboard.press('ArrowDown'); // wraps to first
    await expect(page.getByRole('menuitem', { name: /duck calls/i })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(menu).toHaveCount(0);
    await expect(shopBtn).toBeFocused();
  });
});
