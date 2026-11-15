import { test, expect } from '@playwright/test';

test.describe('Forms & Inputs Spec', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/forms');
  });

  test('completes end-to-end checkout submission flow', async ({ page }) => {
    await page.getByLabel('Full Name *').fill('Sarah Connor');
    await page.getByLabel('Email *').fill('sarah@cyberdyne.org');
    await page.getByLabel('Phone').fill('+1 555-0199');
    await page.getByLabel('Password').fill('T800Protected!');

    // Radio
    await page.getByLabel('Female').check();
    await expect(page.getByLabel('Female')).toBeChecked();

    // Select dropdown
    await page.getByLabel('Country *').selectOption('US');
    await expect(page.getByLabel('Country *')).toHaveValue('US');

    // Textarea
    await page.getByLabel('Delivery Instructions').fill('Leave package near backyard bunker.');

    // Checkboxes
    await page.getByLabel('Save this address for future orders').check();
    await page.getByLabel('Electronics').check();

    // Radio payment
    await page.getByTestId('radio-credit-card').check();

    // Submit
    await page.getByTestId('btn-place-order').click();

    // Verification
    await expect(page.getByTestId('success-message')).toBeVisible();
    await expect(page.getByText('Sarah Connor')).toBeVisible();
  });
});
