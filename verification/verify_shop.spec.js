const { test, expect } = require('@playwright/test');

test('shop page loads and shows products', async ({ page }) => {
  await page.goto('http://localhost:5173/shop');
  await expect(page.locator('h1')).toContainText('Architectural Maps');
  // Wait for products to load
  await page.waitForSelector('.bg-white.rounded-lg.shadow-md', { timeout: 10000 });
  const products = await page.locator('.bg-white.rounded-lg.shadow-md').count();
  console.log('Found ' + products + ' products');
  expect(products).toBeGreaterThan(0);
  await page.screenshot({ path: 'verification/shop_page.png', fullPage: true });
});

test('login page loads', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await expect(page.locator('h2')).toContainText('Sign in to your account');
  await page.screenshot({ path: 'verification/login_page.png' });
});
