import { test, expect } from '@playwright/test';

test.describe('Interactive Kanban Board Spec', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/kanban');
  });

  test('should display board with initial column counts and cards', async ({ page }) => {
    await expect(page.getByTestId('page-title')).toContainText('Interactive Kanban Board');
    await expect(page.getByTestId('count-backlog')).toHaveText('3');
    await expect(page.getByTestId('count-in-progress')).toHaveText('2');
    await expect(page.getByTestId('count-done')).toHaveText('1');

    await expect(page.getByTestId('card-card-1')).toBeVisible();
    await expect(page.getByTestId('card-card-6')).toBeVisible();
  });

  test('should drag card from Backlog to In-Progress using dragTo', async ({ page }) => {
    const card = page.getByTestId('card-card-1');
    const targetCol = page.getByTestId('column-in-progress');

    await card.dragTo(targetCol);

    // Verify counter changes
    await expect(page.getByTestId('count-backlog')).toHaveText('2');
    await expect(page.getByTestId('count-in-progress')).toHaveText('3');

    // Verify card is now inside target column
    await expect(targetCol.getByTestId('card-card-1')).toBeVisible();

    // Verify action log
    await expect(page.getByTestId('kanban-action-log')).toContainText('Moved "Design System Tokens"');
  });

  test('should move card with quick-action buttons and update state', async ({ page }) => {
    await page.getByTestId('btn-move-done-card-4').click();

    await expect(page.getByTestId('count-in-progress')).toHaveText('1');
    await expect(page.getByTestId('count-done')).toHaveText('2');
    await expect(page.getByTestId('column-done').getByTestId('card-card-4')).toBeVisible();
  });

  test('should reset board to initial card allocation', async ({ page }) => {
    await page.getByTestId('btn-move-done-card-4').click();
    await expect(page.getByTestId('count-done')).toHaveText('2');

    await page.getByTestId('btn-reset-board').click();
    await expect(page.getByTestId('count-done')).toHaveText('1');
    await expect(page.getByTestId('count-in-progress')).toHaveText('2');
    await expect(page.getByTestId('count-backlog')).toHaveText('3');
  });
});
