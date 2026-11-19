"use client";
import { useState } from "react";

export default function CheatSheetPage() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📋</span>
          <div>
            <h2 className="font-bold text-lg text-indigo-400">Playwright Complete Command & API Cheat Sheet</h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Instant quick reference for all CLI commands, modern user-facing locators, actions, assertions, and configuration flags.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* CLI Reference */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700 pb-2">
            <h3 className="font-semibold text-gray-800 dark:text-slate-100 text-sm">⚡ CLI Commands & Debugging</h3>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">Terminal</span>
          </div>
          <pre className="text-xs bg-slate-950 text-emerald-400 p-3 rounded-lg font-mono overflow-x-auto leading-relaxed">
{`# Run all tests
npx playwright test

# Run tests in UI mode (Interactive visual runner)
npx playwright test --ui

# Run with headed browser window
npx playwright test --headed

# Run a specific test file
npx playwright test tests/locators.spec.ts

# Debug mode (Step-by-step inspector & console)
npx playwright test --debug

# Auto-generate tests & record user interactions
npx playwright codegen http://localhost:3000

# Open test HTML report
npx playwright show-report

# View recorded execution trace
npx playwright show-trace trace.zip`}
          </pre>
        </div>

        {/* User-Facing Locators */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700 pb-2">
            <h3 className="font-semibold text-gray-800 dark:text-slate-100 text-sm">🎯 Modern Locators (Best Practice)</h3>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-mono">Page API</span>
          </div>
          <pre className="text-xs bg-slate-950 text-sky-300 p-3 rounded-lg font-mono overflow-x-auto leading-relaxed">
{`// 1. Accessible Role (Most Recommended)
page.getByRole('button', { name: 'Submit' })
page.getByRole('textbox', { name: 'Email' })
page.getByRole('heading', { level: 1 })

// 2. Text matching
page.getByText('Welcome back')
page.getByText('Order #', { exact: false })

// 3. Form Label
page.getByLabel('Password')

// 4. Input Placeholder
page.getByPlaceholder('Search products...')

// 5. Image Alt Text & Title
page.getByAltText('Logo')
page.getByTitle('Close modal')

// 6. Test IDs (Resilient Fallback)
page.getByTestId('cart-item')

// 7. Filtering & Chaining
page.locator('tr').filter({ hasText: 'Shipped' })
page.getByRole('listitem').nth(0)`}
          </pre>
        </div>

        {/* Actions Arena */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700 pb-2">
            <h3 className="font-semibold text-gray-800 dark:text-slate-100 text-sm">🖱️ Interaction & Action Methods</h3>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-mono">Actions</span>
          </div>
          <pre className="text-xs bg-slate-950 text-amber-300 p-3 rounded-lg font-mono overflow-x-auto leading-relaxed">
{`// Clicks & Mouse
await locator.click()
await locator.dblclick()
await locator.click({ button: 'right' })
await locator.click({ modifiers: ['Shift'] })
await locator.hover()

// Form Inputs
await locator.fill('John Doe')
await locator.clear()
await locator.pressSequentially('Slow typing', { delay: 100 })
await locator.check() // checkbox / radio
await locator.uncheck()
await locator.selectOption('IN') // select tag

// Keyboard & File Upload
await page.keyboard.press('Control+K')
await locator.setInputFiles('doc.pdf')
await locator.scrollIntoViewIfNeeded()`}
          </pre>
        </div>

        {/* Web Assertions */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700 pb-2">
            <h3 className="font-semibold text-gray-800 dark:text-slate-100 text-sm">✅ Web-First Assertions (Auto-Retrying)</h3>
            <span className="text-[10px] bg-pink-50 text-pink-700 px-2 py-0.5 rounded font-mono">expect()</span>
          </div>
          <pre className="text-xs bg-slate-950 text-pink-300 p-3 rounded-lg font-mono overflow-x-auto leading-relaxed">
{`// Visibility & State
await expect(locator).toBeVisible()
await expect(locator).toBeHidden()
await expect(locator).toBeEnabled()
await expect(locator).toBeDisabled()
await expect(locator).toBeChecked()

// Content & Attributes
await expect(locator).toHaveText('Success')
await expect(locator).toContainText('Order')
await expect(locator).toHaveValue('user@domain.com')
await expect(locator).toHaveAttribute('data-status', 'Paid')
await expect(locator).toHaveCount(3)

// Page URL & Title
await expect(page).toHaveURL(/.*checkout/)
await expect(page).toHaveTitle(/Store/)

// Soft Assertion (Doesn't abort on fail)
expect.soft(locator).toBeVisible()`}
          </pre>
        </div>

        {/* Network & Mocking */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700 pb-2">
            <h3 className="font-semibold text-gray-800 dark:text-slate-100 text-sm">🌐 Network Routing & API Interception</h3>
            <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-mono">Routing</span>
          </div>
          <pre className="text-xs bg-slate-950 text-blue-300 p-3 rounded-lg font-mono overflow-x-auto leading-relaxed">
{`// Intercept and return synthetic JSON
await page.route('**/api/products', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ items: [] }),
  });
});

// Simulate 500 error or abort images
await page.route('**/*.png', route => route.abort());

// Inject auth header
await page.route('**/api/**', async (route) => {
  const headers = route.request().headers();
  headers['Authorization'] = 'Bearer token123';
  await route.continue({ headers });
});

// Wait for network response
await page.waitForResponse(r => r.url().includes('/orders'));`}
          </pre>
        </div>

        {/* Frames, Dialogs, Downloads */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700 pb-2">
            <h3 className="font-semibold text-gray-800 dark:text-slate-100 text-sm">🪟 Frames, Dialogs & Events</h3>
            <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-mono">Advanced</span>
          </div>
          <pre className="text-xs bg-slate-950 text-purple-300 p-3 rounded-lg font-mono overflow-x-auto leading-relaxed">
{`// Iframes
const frame = page.frameLocator('#payment-frame');
await frame.getByRole('button', { name: 'Pay' }).click();

// Browser Native Dialogs
page.on('dialog', dialog => dialog.accept('PromoCode'));

// New Tab / Window
const [newPage] = await Promise.all([
  context.waitForEvent('page'),
  page.getByTestId('external-link').click(),
]);

// Download handling
const downloadPromise = page.waitForEvent('download');
await page.getByTestId('export-btn').click();
const download = await downloadPromise;
await download.saveAs('/path/file.csv');`}
          </pre>
        </div>
      </div>

      {/* Starter Config */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700 pb-2">
          <h3 className="font-semibold text-gray-800 dark:text-slate-100 text-sm">⚙️ Standard Production playwright.config.ts</h3>
          <button
            onClick={() => copyCode("config", `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', use: { ...devices['iPhone 14'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});`)}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {copiedSection === "config" ? "✓ Copied!" : "📋 Copy Config"}
          </button>
        </div>
        <pre className="text-xs bg-slate-950 text-slate-200 p-4 rounded-lg font-mono overflow-x-auto leading-relaxed">
{`import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html'], ['list']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
    { name: 'mobile',   use: { ...devices['iPhone 14'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});`}
        </pre>
      </div>
    </div>
  );
}
