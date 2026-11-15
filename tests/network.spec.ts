import { test, expect } from '@playwright/test';

test.describe('Network Mocking Spec', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/network');
  });

  test('mocks GET /api/products response payload', async ({ page }) => {
    await page.route('**/api/products', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          source: 'synthetic-mock',
          data: [{ id: 999, name: 'Quantum VR Glasses', price: 1499.0, inStock: true }],
        }),
      });
    });

    await page.getByTestId('btn-fetch-products').click();
    await expect(page.getByText('Quantum VR Glasses')).toBeVisible();
    await expect(page.getByText('$1499')).toBeVisible();
  });

  test('handles 500 error simulation', async ({ page }) => {
    await page.route('**/api/products', async (route) => {
      await route.fulfill({ status: 500, body: 'Internal Server Error' });
    });

    await page.getByTestId('btn-fetch-products').click();
    await expect(page.getByTestId('fetch-status-banner')).toContainText('500');
  });
});
