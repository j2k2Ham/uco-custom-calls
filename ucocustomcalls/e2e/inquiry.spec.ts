import { test, expect } from '@playwright/test';

const base = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

test.describe('Custom Inquiry Form', () => {
  test('submits successfully', async ({ page }) => {
    await page.goto(`${base}/custom`);
    await page.getByLabel(/name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
  await page.getByLabel(/details/i).fill('I would like a custom solution.');
  await page.getByRole('button', { name: /send inquiry/i }).click();
  await page.waitForResponse(resp => resp.url().endsWith('/api/contact') && resp.status() < 600);
  // Debug: capture content for troubleshooting
  const bodyHTML = await page.innerHTML('body');
  console.log('BODY_HTML_LENGTH', bodyHTML.length);
  await expect(page.getByText(/message sent/i)).toBeVisible();
  });

  test('honeypot blocks spam', async ({ page }) => {
    await page.goto(`${base}/custom`);
    // Honeypot field should be hidden but still in DOM
  // reference honeypot to ensure it exists
  await expect(page.locator('input[name="honey"]').first()).toHaveCount(1);
    // Force fill via script to simulate bot
    await page.evaluate(() => {
  const el = document.querySelector('input[name="honey"]') as HTMLInputElement | null;
      if (el) el.value = 'Bot Corp';
    });
    await page.getByLabel(/name/i).fill('Spam User');
    await page.getByLabel(/email/i).fill('spam@example.com');
  await page.getByLabel(/details/i).fill('Spam message');
    await page.getByRole('button', { name: /send inquiry/i }).click();
  await expect(page.getByText(/spam-detected/i)).toBeVisible();
  });
});
