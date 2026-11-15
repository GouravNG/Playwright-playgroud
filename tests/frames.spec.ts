import { test, expect } from '@playwright/test';

test.describe('Frames & Shadow DOM Spec', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/frames');
  });

  test('interacts with elements inside iframe using frameLocator', async ({ page }) => {
    const paymentFrame = page.frameLocator('#payment-frame');
    await paymentFrame.getByTestId('input-frame-card').fill('4111 5555 6666 7777');
    await paymentFrame.getByTestId('input-frame-expiry').fill('10/28');
    await paymentFrame.getByTestId('input-frame-cvv').fill('123');

    await paymentFrame.getByTestId('btn-frame-submit-payment').click();
    await expect(paymentFrame.getByTestId('frame-payment-success')).toBeVisible();
  });

  test('pierces open Shadow DOM automatically', async ({ page }) => {
    const shadowBtn = page.getByTestId('btn-shadow-action');
    await expect(shadowBtn).toBeVisible();
    await shadowBtn.click();
    await expect(page.getByText('Shadow Button Clicked!')).toBeVisible();
  });
});
