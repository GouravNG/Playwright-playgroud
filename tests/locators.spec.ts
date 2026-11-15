import { test, expect } from '@playwright/test';

test.describe('Locators Lab Spec', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/locators');
  });

  test('locates elements by user-facing role and text', async ({ page }) => {
    const addToCart = page.getByRole('button', { name: 'Add to Cart' });
    await expect(addToCart).toBeVisible();
    await addToCart.click();

    await expect(page.getByTestId('cart-message')).toBeVisible();
    await expect(page.getByText('Wireless Headphones')).toBeVisible();
  });

  test('locates by label, placeholder, and testId', async ({ page }) => {
    await page.getByLabel('Quantity').fill('5');
    await expect(page.getByLabel('Quantity')).toHaveValue('5');

    await page.getByPlaceholder('Search products...').fill('Shoes');
    await expect(page.getByTestId('product-card-2')).toBeVisible();
  });

  test('filters collections and uses nth locator', async ({ page }) => {
    const sportButtons = page.getByRole('button', { name: 'Sports' });
    await sportButtons.click();
    await expect(page.locator('[data-testid^="product-card"]')).toHaveCount(2);
  });
});
