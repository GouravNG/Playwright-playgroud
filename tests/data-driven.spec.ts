import { test, expect } from '@playwright/test';

test.describe('External Data Sources (Excel & CSV) Studio Spec', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-driven');
  });

  test('should display page title and both playgrounds', async ({ page }) => {
    await expect(page.getByTestId('page-title')).toContainText('External Data Sources (Excel & CSV) Studio');
    await expect(page.getByTestId('template-reference-table')).toBeVisible();
    await expect(page.getByTestId('financial-ledger-table')).toBeVisible();
  });

  test('Playground 1: should copy template table format to clipboard', async ({ page }) => {
    const copyBtn = page.getByTestId('btn-copy-template-table');
    await expect(copyBtn).toBeVisible();
    await copyBtn.click();
    await expect(copyBtn).toContainText('Copied');
  });

  test('Playground 1: should inject row-by-row data into form and reflect in staging table', async ({ page }) => {
    // Fill manual employee record
    await page.getByTestId('input-emp-id').fill('EMP-999');
    await page.getByTestId('input-emp-name').fill('Sarah Connor');
    await page.getByTestId('input-emp-salary').fill('135000');
    await page.getByTestId('input-emp-email').fill('sarah.c@example.com');
    await page.getByTestId('btn-submit-employee-row').click();

    // Verify row added to staging table
    await expect(page.getByTestId('staged-row-EMP-999')).toBeVisible();
    await expect(page.getByTestId('staged-row-EMP-999')).toContainText('Sarah Connor');
  });

  test('Playground 1: should quick-load mock data into staging table', async ({ page }) => {
    await page.getByTestId('btn-load-sample-data').click();
    await expect(page.getByTestId('staged-row-EMP-101')).toBeVisible();
    await expect(page.getByTestId('staged-row-EMP-105')).toBeVisible();
  });

  test('Playground 2: should filter ledger categories and export CSV download', async ({ page }) => {
    // Filter by Vendor
    await page.getByTestId('select-filter-category').selectOption('Vendor');
    await expect(page.locator('[data-testid^="ledger-row-"]')).toHaveCount(2);

    // Intercept client-side download
    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('btn-export-csv').click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toContain('financial_ledger_');
    expect(download.suggestedFilename()).toContain('.csv');

    // Confirm export notification
    await expect(page.getByTestId('export-notification')).toBeVisible();
    await expect(page.getByTestId('export-notification')).toContainText('2 rows');
  });
});
