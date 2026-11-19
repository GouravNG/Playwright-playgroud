"use client";
import { useState } from "react";
import { WidgetCard } from "@/components/common/WidgetCard";

export default function TestRunnerPage() {
  const [activeTab, setActiveTab] = useState<"lifecycle" | "annotations" | "tagging" | "steps">("lifecycle");

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-slate-900 text-white rounded-xl p-5 shadow-lg border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧪</span>
          <div>
            <h2 className="font-bold text-lg text-emerald-400">Playwright Test Runner: Lifecycle Hooks, Annotations & Steps</h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Master <code>test.describe</code>, <code>beforeAll</code>, <code>afterAll</code>, <code>beforeEach</code>, <code>afterEach</code>, test annotations (<code>skip</code>, <code>fixme</code>, <code>fail</code>, <code>slow</code>), custom tags (<code>@smoke</code>, <code>@regression</code>), and <code>test.step()</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-slate-800 pb-2">
        {[
          { id: "lifecycle", label: "⏳ Lifecycle Hooks & Scope" },
          { id: "annotations", label: "🏷️ Test Annotations (skip, fixme...)" },
          { id: "tagging", label: "🏷️ Tagging & Filtering (@smoke)" },
          { id: "steps", label: "👣 test.step() & Reporting" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`text-xs px-3.5 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {activeTab === "lifecycle" && (
          <>
            <WidgetCard
              title="1. test.beforeAll vs test.beforeEach"
              testId="widget-hooks-before"
              docUrl="https://playwright.dev/docs/api/class-test#test-before-all"
              docTitle="Playwright Lifecycle Hooks Guide"
              hint={`import { test, expect } from '@playwright/test';\n\ntest.describe('Shopping Cart Flow', () => {\n  // Runs ONCE before any test in this file/group runs\n  test.beforeAll(async () => {\n    console.log('Seeding database or launching shared server...');\n  });\n\n  // Runs before EVERY individual test\n  test.beforeEach(async ({ page }) => {\n    await page.goto('/forms');\n  });\n\n  test('adds item to cart', async ({ page }) => {\n    // Fresh page state!\n  });\n});`}
            >
              <div className="space-y-2 text-xs text-gray-600 dark:text-slate-400">
                <p>
                  <strong><code>beforeAll</code></strong> runs once per worker (e.g., database connection or global pre-warm).
                </p>
                <p>
                  <strong><code>beforeEach</code></strong> runs before every single test with a clean isolated <code>page</code> and <code>context</code>.
                </p>
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded font-mono text-[11px] text-indigo-800 dark:text-indigo-300">
                  test.beforeAll() ➔ test.beforeEach() ➔ test()
                </div>
              </div>
            </WidgetCard>

            <WidgetCard
              title="2. test.afterEach vs test.afterAll"
              testId="widget-hooks-after"
              docUrl="https://playwright.dev/docs/api/class-test#test-after-all"
              docTitle="Playwright Teardown Docs"
              hint={`test.describe('Order Lifecycle', () => {\n  // Runs after EVERY individual test completes\n  test.afterEach(async ({ page }, testInfo) => {\n    if (testInfo.status !== testInfo.expectedStatus) {\n      console.log(\`Test failed! Taking diagnostic dump: \${testInfo.title}\`);\n    }\n  });\n\n  // Runs ONCE after all tests finish\n  test.afterAll(async () => {\n    console.log('Cleaning up seeded test users...');\n  });\n});`}
            >
              <div className="space-y-2 text-xs text-gray-600 dark:text-slate-400">
                <p>
                  <strong><code>afterEach</code></strong> receives <code>testInfo</code> to inspect pass/fail statuses or attach custom artifacts.
                </p>
                <p>
                  <strong><code>afterAll</code></strong> is ideal for tearing down mock servers or database state.
                </p>
              </div>
            </WidgetCard>
          </>
        )}

        {activeTab === "annotations" && (
          <>
            <WidgetCard
              title="1. Conditional Skips & Known Bugs (skip, fixme)"
              testId="widget-annotations-skip"
              docUrl="https://playwright.dev/docs/test-annotations#skip-a-test"
              docTitle="Playwright Annotations Guide"
              hint={`// 1. Unconditionally skip\ntest.skip('payment gateway down', async ({ page }) => {\n  // Will not execute\n});\n\n// 2. Conditional skip based on browser or OS\ntest('safari biometric auth', async ({ page, browserName }) => {\n  test.skip(browserName !== 'webkit', 'This feature is only for WebKit');\n});\n\n// 3. Mark as fixme (failing test tracking an active bug)\ntest('broken promo calculation', async ({ page }) => {\n  test.fixme(true, 'Jira BUG-1049: Discount not rounded correctly');\n});`}
            >
              <div className="space-y-2 text-xs text-gray-600 dark:text-slate-400">
                <p>
                  <strong><code>test.skip()</code></strong> skips execution and marks the test as skipped in reports.
                </p>
                <p>
                  <strong><code>test.fixme()</code></strong> signifies that the test is expected to fail; Playwright won&apos;t run it until the bug is resolved.
                </p>
              </div>
            </WidgetCard>

            <WidgetCard
              title="2. Expected Failures & Custom Timeouts (fail, slow)"
              testId="widget-annotations-fail-slow"
              docUrl="https://playwright.dev/docs/test-annotations#slow-test"
              docTitle="Test Timeouts & Failures"
              hint={`// 1. test.fail() - asserts that the test DOES fail\ntest('unsupported credit card format', async ({ page }) => {\n  test.fail(); // Test passes only if it fails!\n});\n\n// 2. test.slow() - triples the default timeout (e.g. 30s -> 90s)\ntest('heavy data export and rendering', async ({ page }) => {\n  test.slow();\n  // long running operations...\n});\n\n// 3. test.setTimeout() - custom explicit duration\ntest('huge file upload', async ({ page }) => {\n  test.setTimeout(120000); // 2 minutes\n});`}
            >
              <div className="space-y-2 text-xs text-gray-600 dark:text-slate-400">
                <p>
                  <strong><code>test.slow()</code></strong> automatically triples default timeout without hardcoding millisecond values.
                </p>
                <p>
                  <strong><code>test.fail()</code></strong> is used when testing negative edge cases or verifying error throwing.
                </p>
              </div>
            </WidgetCard>
          </>
        )}

        {activeTab === "tagging" && (
          <>
            <WidgetCard
              title="1. Suite Tagging: @smoke, @regression, @fast"
              testId="widget-test-tags"
              docUrl="https://playwright.dev/docs/test-annotations#tag-tests"
              docTitle="Playwright Test Tagging Docs"
              hint={`// Tagging via test title syntax\ntest('critical login flow @smoke @auth', async ({ page }) => {\n  // Runs in smoke pipelines\n});\n\ntest('monthly transaction report @regression', async ({ page }) => {\n  // Runs in full nightly regression\n});\n\n// Tagging via object syntax (Playwright 1.42+)\ntest('checkout flow', { tag: ['@smoke', '@e2e'] }, async ({ page }) => {\n  // ...\n});`}
            >
              <div className="space-y-2 text-xs text-gray-600 dark:text-slate-400">
                <p>Filter tests from your terminal using the <code>--grep</code> or <code>--grep-invert</code> CLI flags:</p>
                <div className="bg-slate-900 text-emerald-400 p-2.5 rounded font-mono text-[11px] space-y-1">
                  <div># Run only smoke tests</div>
                  <div>npx playwright test --grep &quot;@smoke&quot;</div>
                  <div className="pt-1"># Run everything except slow tests</div>
                  <div>npx playwright test --grep-invert &quot;@slow&quot;</div>
                </div>
              </div>
            </WidgetCard>

            <WidgetCard
              title="2. Scoped Describe Blocks & Serial Execution"
              testId="widget-describe-serial"
              docUrl="https://playwright.dev/docs/api/class-test#test-describe-serial"
              docTitle="Test Grouping & Serial Mode"
              hint={`// Serial execution: stops running if any test in the group fails\ntest.describe.serial('Interdependent Order Sequence', () => {\n  test('create order draft', async ({ page }) => { ... });\n  test('apply coupon code', async ({ page }) => { ... });\n  test('submit payment', async ({ page }) => { ... });\n});\n\n// Parallel describe block (runs alongside other tests)\ntest.describe.parallel('Independent Tests', () => {\n  // ...\n});`}
            >
              <div className="space-y-2 text-xs text-gray-600 dark:text-slate-400">
                <p>
                  By default, Playwright isolates tests. Use <strong><code>test.describe.serial</code></strong> when tests must run sequentially and share dependent progression.
                </p>
              </div>
            </WidgetCard>
          </>
        )}

        {activeTab === "steps" && (
          <>
            <WidgetCard
              title="1. Structured Reporting with test.step()"
              testId="widget-test-steps"
              docUrl="https://playwright.dev/docs/api/class-test#test-step"
              docTitle="test.step() Documentation"
              hint={`test('complete checkout journey', async ({ page }) => {\n  await test.step('Step 1: Navigate to Catalogue', async () => {\n    await page.goto('/forms');\n  });\n\n  await test.step('Step 2: Fill Personal Information', async () => {\n    await page.getByLabel('Full Name *').fill('Alice');\n    await page.getByLabel('Email *').fill('alice@test.com');\n  });\n\n  await test.step('Step 3: Submit and Verify Confirmation', async () => {\n    await page.getByTestId('btn-place-order').click();\n    await expect(page.getByTestId('success-message')).toBeVisible();\n  });\n});`}
            >
              <div className="space-y-2 text-xs text-gray-600 dark:text-slate-400">
                <p>
                  <code>test.step()</code> divides long tests into clearly visualizable phases in Playwright HTML Reports and Trace Viewer with individual screenshots and timing.
                </p>
              </div>
            </WidgetCard>

            <WidgetCard
              title="2. Custom Metadata & testInfo.attach()"
              testId="widget-test-attach"
              docUrl="https://playwright.dev/docs/api/class-testinfo#test-info-attach"
              docTitle="testInfo Attachments Guide"
              hint={`test('export and attach invoice log', async ({ page }, testInfo) => {\n  const logData = 'Transaction ID: 9942, Status: Settled';\n  \n  // Attach text or screenshots directly to HTML report\n  await testInfo.attach('transaction-log.txt', {\n    body: logData,\n    contentType: 'text/plain',\n  });\n\n  // Attach dynamic JSON\n  await testInfo.attach('response-payload.json', {\n    body: JSON.stringify({ ok: true, id: 9942 }),\n    contentType: 'application/json',\n  });\n});`}
            >
              <div className="space-y-2 text-xs text-gray-600 dark:text-slate-400">
                <p>
                  Attach raw API payloads, server response logs, or intermediate screenshots directly to your Playwright HTML report using <code>testInfo.attach()</code>.
                </p>
              </div>
            </WidgetCard>
          </>
        )}
      </div>
    </div>
  );
}
