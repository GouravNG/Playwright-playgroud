import { test, expect } from '@playwright/test';

test.describe('Multi-Language (i18n) & RTL Layout Spec', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/i18n');
  });

  test('should display page title and default LTR layout in English', async ({ page }) => {
    await expect(page.getByTestId('page-title')).toContainText('Multi-Language (i18n) & RTL Layout Studio');
    const viewport = page.getByTestId('i18n-viewport');
    await expect(viewport).toHaveAttribute('dir', 'ltr');
    await expect(page.getByTestId('i18n-heading')).toContainText('Welcome to Global Banking Portal');
    await expect(page.getByTestId('dir-indicator')).toHaveText('LTR');
  });

  test('should switch to Arabic (RTL) and verify mirrored layout', async ({ page }) => {
    await page.getByTestId('btn-locale-ar').click();

    const viewport = page.getByTestId('i18n-viewport');
    await expect(viewport).toHaveAttribute('dir', 'rtl');
    await expect(page.getByTestId('dir-indicator')).toHaveText('RTL');
    await expect(page.getByTestId('i18n-heading')).toContainText('مرحباً');
  });

  test('should switch to Japanese and submit transfer', async ({ page }) => {
    await page.getByTestId('btn-locale-ja').click();
    await expect(page.getByTestId('i18n-heading')).toContainText('グローバルバンキングポータルへようこそ');

    await page.getByTestId('input-recipient').fill('山田太郎');
    await page.getByTestId('input-amount').fill('50000');
    await page.getByTestId('btn-submit-transfer').click();

    await expect(page.getByTestId('transfer-success-banner')).toBeVisible();
    await expect(page.getByTestId('transfer-success-banner')).toContainText('送金が正常に完了しました');
  });
});
