import { test, expect } from '@playwright/test';

const base = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

test.describe('Custom Inquiry Form', () => {
  test('submits successfully', async ({ page }) => {
    await page.goto(`${base}/custom`);
    await page.getByLabel(/name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/message/i).fill('I would like a custom solution.');
    await page.getByRole('button', { name: /send inquiry/i }).click();
    await expect(page.getByText(/inquiry sent/i)).toBeVisible();
  });

  test('honeypot blocks spam', async ({ page }) => {
    await page.goto(`${base}/custom`);
    // Honeypot field should be hidden but still in DOM
  // reference honeypot to ensure it exists
  await expect(page.locator('input[name="company"]').first()).toHaveCount(1);
    // Force fill via script to simulate bot
    await page.evaluate(() => {
      const el = document.querySelector('input[name="company"]') as HTMLInputElement | null;
      if (el) el.value = 'Bot Corp';
    });
    await page.getByLabel(/name/i).fill('Spam User');
    await page.getByLabel(/email/i).fill('spam@example.com');
    await page.getByLabel(/message/i).fill('Spam message');
    await page.getByRole('button', { name: /send inquiry/i }).click();
    await expect(page.getByText(/error/i)).toBeVisible();
  });
});
