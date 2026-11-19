import { test, expect } from '@playwright/test';

test.describe('Shadow DOM & Web Components Studio Spec', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/shadow-dom');
  });

  test('should display page header and all shadow widgets', async ({ page }) => {
    await expect(page.getByTestId('page-title')).toContainText('Shadow DOM & Web Components Studio');
    await expect(page.getByTestId('widget-open-shadow')).toBeVisible();
    await expect(page.getByTestId('widget-closed-shadow')).toBeVisible();
    await expect(page.getByTestId('widget-svg-shadow')).toBeVisible();
  });

  test('Widget 1: should auto-pierce open shadow root directly', async ({ page }) => {
    // Playwright locators automatically pierce open shadow roots!
    const shadowInput = page.getByTestId('shadow-open-input');
    await expect(shadowInput).toBeVisible();

    await shadowInput.fill('Playwright Auto Piercing');
    await page.getByTestId('btn-shadow-open-submit').click();

    await expect(page.getByTestId('status-open-shadow')).toContainText('Playwright Auto Piercing');
  });

  test('Widget 2: should interact with closed shadow root via JS evaluation', async ({ page }) => {
    // Standard locators cannot pierce closed roots directly; evaluate page context
    await page.evaluate(() => {
      const host = document.getElementById('host-closed-shadow') as any;
      if (host && host.__privateRoot) {
        const btn = host.__privateRoot.getElementById('closed-secret-action');
        btn?.click();
      }
    });

    await expect(page.getByTestId('status-closed-shadow')).toContainText('action executed successfully');
  });

  test('Widget 3: should auto-pierce and click SVG vector elements in shadow DOM', async ({ page }) => {
    await page.getByTestId('shadow-svg-circle').click();
    await expect(page.getByTestId('status-svg-shadow')).toContainText('Emerald Circle');

    await page.getByTestId('shadow-svg-rect').click();
    await expect(page.getByTestId('status-svg-shadow')).toContainText('Indigo Rectangle');

    await page.getByTestId('shadow-svg-star').click();
    await expect(page.getByTestId('status-svg-shadow')).toContainText('Amber Star');
  });
});
