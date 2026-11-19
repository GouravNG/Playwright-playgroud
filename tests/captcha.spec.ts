import { test, expect } from '@playwright/test';

test.describe('Dynamic CAPTCHA & Security Sandbox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/captcha');
  });

  test('should display page title and widgets', async ({ page }) => {
    await expect(page.getByTestId('page-title')).toContainText('Dynamic CAPTCHA & Security Puzzles');
    await expect(page.getByTestId('widget-math-captcha')).toBeVisible();
    await expect(page.getByTestId('widget-slider-captcha')).toBeVisible();
    await expect(page.getByTestId('widget-grid-captcha')).toBeVisible();
  });

  test('Widget 1: should parse and solve dynamic math arithmetic challenge', async ({ page }) => {
    const questionText = await page.getByTestId('math-question').textContent();
    expect(questionText).toBeTruthy();

    // Regex extract digits and operator
    const match = questionText!.match(/(\d+)\s*([+\-*])\s*(\d+)/);
    expect(match).not.toBeNull();

    const [_, num1Str, op, num2Str] = match!;
    const num1 = parseInt(num1Str, 10);
    const num2 = parseInt(num2Str, 10);

    let expected = 0;
    if (op === '+') expected = num1 + num2;
    else if (op === '-') expected = num1 - num2;
    else if (op === '*') expected = num1 * num2;

    // Fill answer and verify
    await page.getByTestId('math-answer-input').fill(String(expected));
    await page.getByTestId('btn-verify-math').click();

    const statusMsg = page.getByTestId('math-status-msg');
    await expect(statusMsg).toBeVisible();
    await expect(statusMsg).toContainText('Verification Successful');
  });

  test('Widget 2: should slide puzzle piece to target offset and verify', async ({ page }) => {
    // Fill slider to target offset (180px)
    await page.getByTestId('slider-range-input').fill('180');
    await page.getByTestId('btn-verify-slider').click();

    const sliderMsg = page.getByTestId('slider-status-msg');
    await expect(sliderMsg).toBeVisible();
    await expect(sliderMsg).toContainText('Puzzle matched');
  });

  test('Widget 3: should select all tiles matching target category and verify', async ({ page }) => {
    const category = (await page.getByTestId('grid-target-category').textContent())?.trim().toLowerCase();
    expect(category).toBeTruthy();

    const matchingTiles = page.locator(`[data-category="${category}"]`);
    const count = await matchingTiles.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await matchingTiles.nth(i).click();
    }

    await page.getByTestId('btn-verify-grid').click();

    const gridMsg = page.getByTestId('grid-status-msg');
    await expect(gridMsg).toBeVisible();
    await expect(gridMsg).toContainText('correctly selected');
  });
});
