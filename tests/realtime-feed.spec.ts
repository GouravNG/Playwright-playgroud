import { test, expect } from '@playwright/test';

test.describe('Real-Time Streaming & SSE Live Feed Spec', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/realtime-feed');
  });

  test('should display page title and connect to SSE stream', async ({ page }) => {
    await expect(page.getByTestId('page-title')).toContainText('Live Real-Time Streaming & Push Alert Feed');
    await expect(page.getByTestId('connection-badge')).toContainText('STREAM LIVE');
  });

  test('should receive incoming streaming ticker events', async ({ page }) => {
    // Assert table contains ticker rows populated by SSE
    const firstRow = page.locator('[data-testid^="ticker-row-"]').first();
    await expect(firstRow).toBeVisible({ timeout: 10000 });
  });

  test('should toggle pause and resume stream', async ({ page }) => {
    const toggleBtn = page.getByTestId('btn-toggle-stream');
    await toggleBtn.click();
    await expect(page.getByTestId('connection-badge')).toContainText('STREAM PAUSED');

    await toggleBtn.click();
    await expect(page.getByTestId('connection-badge')).toContainText('STREAM LIVE');
  });

  test('should handle manual and background push alert toasts', async ({ page }) => {
    // Trigger immediate manual alert
    await page.getByTestId('btn-trigger-circuit-breaker').click();

    const criticalToast = page.getByTestId('toast-item-critical').first();
    await expect(criticalToast).toBeVisible();
    await expect(criticalToast).toContainText('Circuit Breaker');

    // Dismiss the toast
    await criticalToast.getByTestId('btn-dismiss-toast').click();
  });
});
