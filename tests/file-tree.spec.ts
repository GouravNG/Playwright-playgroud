import { test, expect } from '@playwright/test';

test.describe('Hierarchical File Tree & Accordion Explorer Spec', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/file-tree');
  });

  test('should display page title and tree container', async ({ page }) => {
    await expect(page.getByTestId('page-title')).toContainText('Hierarchical File Tree & Accordion Explorer');
    await expect(page.getByTestId('file-tree-container')).toBeVisible();
    await expect(page.getByTestId('empty-file-selection')).toBeVisible();
  });

  test('should expand and collapse folders with ARIA state assertions', async ({ page }) => {
    // Check initial state of root-src
    const rootSrcNode = page.locator('[role="treeitem"]').filter({ hasText: 'src' }).first();
    await expect(rootSrcNode).toHaveAttribute('aria-expanded', 'true');

    // Click folder toggle on folder-app to collapse
    const folderAppToggle = page.getByTestId('folder-toggle-folder-app');
    await folderAppToggle.click();

    // Verify app folder is now collapsed
    const appNode = page.locator('[role="treeitem"]').filter({ hasText: 'app' }).first();
    await expect(appNode).toHaveAttribute('aria-expanded', 'false');

    // Expand again
    await folderAppToggle.click();
    await expect(appNode).toHaveAttribute('aria-expanded', 'true');
  });

  test('should select a file and display metadata in details panel', async ({ page }) => {
    // Open auth folder
    await page.getByTestId('folder-toggle-folder-auth').click();

    // Click login.tsx
    const loginFile = page.getByTestId('tree-node-file-login');
    await loginFile.click();

    // Assert details inspector
    await expect(page.getByTestId('selected-file-card')).toBeVisible();
    await expect(page.getByTestId('selected-file-name')).toHaveText('login.tsx');
  });

  test('should auto-expand and filter deep matching paths via search', async ({ page }) => {
    // Search for "captcha"
    await page.getByTestId('file-search-input').fill('captcha');

    // Assert captcha.spec.ts node is displayed even if parent was collapsed
    const captchaNode = page.getByTestId('tree-node-file-captcha-spec');
    await expect(captchaNode).toBeVisible();

    // Clear search and confirm root files return
    await page.getByTestId('btn-clear-search').click();
    await expect(page.getByTestId('tree-node-file-readme')).toBeVisible();
  });
});
