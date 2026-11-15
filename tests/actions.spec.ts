import { test, expect } from '@playwright/test';

test.describe('Actions Arena Spec', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/actions');
  });

  test('performs single, double and right clicks', async ({ page }) => {
    await page.getByTestId('btn-add-to-cart').click();
    await expect(page.getByTestId('event-log')).toContainText('click()');

    await page.getByTestId('btn-dblclick').dblclick();
    await expect(page.getByTestId('event-log')).toContainText('dblclick()');

    await page.getByTestId('btn-rightclick').click({ button: 'right' });
    await expect(page.getByTestId('event-log')).toContainText('right-click');
  });

  test('handles mouse hover and revealed overlays', async ({ page }) => {
    await page.getByTestId('product-hover-target').hover();
    await expect(page.getByTestId('quick-view-panel')).toBeVisible();
  });

  test('executes keyboard sequences and slow typing', async ({ page }) => {
    const promo = page.getByLabel('Promo Code');
    await promo.pressSequentially('DISCOUNT20', { delay: 50 });
    await expect(promo).toHaveValue('DISCOUNT20');
  });
});
