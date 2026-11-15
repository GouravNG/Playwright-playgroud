"use client";
import { useState } from "react";
import { WidgetCard } from "@/components/common/WidgetCard";

export default function CliCodegenPage() {
  const [activeTab, setActiveTab] = useState<"codegen" | "config" | "flags" | "trace">("codegen");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copySnippet = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-slate-900 text-white rounded-xl p-5 shadow-lg border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚙️</span>
          <div>
            <h2 className="font-bold text-lg text-emerald-400">Playwright Codegen, Config & CLI Flags Reference Hub</h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Comprehensive reference guide for test generation via <code>playwright codegen</code>, full breakdown of every <code>playwright.config.ts</code> option, and all CLI execution flags.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        {[
          { id: "codegen", label: "🎥 Playwright Codegen Mastery" },
          { id: "config", label: "🛠️ playwright.config.ts Options" },
          { id: "flags", label: "🚩 All CLI Execution Flags" },
          { id: "trace", label: "📊 Trace Viewer & Debugging Flags" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`text-xs px-3.5 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white border text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {activeTab === "codegen" && (
          <>
            <WidgetCard
              title="1. Core Codegen Commands"
              testId="widget-codegen-basics"
              docUrl="https://playwright.dev/docs/codegen"
              docTitle="Playwright Codegen Guide"
              hint={`# Open browser and record tests into terminal\nnpx playwright codegen http://localhost:3000\n\n# Record directly into a target file\nnpx playwright codegen -o tests/recorded.spec.ts http://localhost:3000\n\n# Target specific language (javascript, python, csharp, java)\nnpx playwright codegen --target=javascript http://localhost:3000\nnpx playwright codegen --target=python http://localhost:3000`}
            >
              <div className="space-y-2 text-xs text-gray-600">
                <p>
                  Codegen launches an interactive browser alongside the Playwright Inspector to record your exact clicks, typing, and assertions directly into executable code.
                </p>
                <div className="bg-slate-900 text-emerald-400 p-2.5 rounded font-mono text-[11px]">
                  npx playwright codegen -o tests/cart.spec.ts http://localhost:3000/forms
                </div>
              </div>
            </WidgetCard>

            <WidgetCard
              title="2. Codegen with Emulation & Auth State"
              testId="widget-codegen-advanced"
              docUrl="https://playwright.dev/docs/codegen#emulate-devices"
              docTitle="Codegen Device & Auth Emulation"
              hint={`# 1. Emulate Mobile Devices (Pre-configured Viewport, User-Agent & Touch)
npx playwright codegen --device="iPhone 14 Pro" http://localhost:3000
npx playwright codegen --device="Pixel 7" http://localhost:3000
npx playwright codegen --device="iPad Pro 11" http://localhost:3000

# 2. Emulate Explicit Screen Dimensions & Mobile Viewport
npx playwright codegen --viewport-size="390,844" http://localhost:3000

# 3. Emulate Color Scheme (Dark / Light Theme Testing)
npx playwright codegen --color-scheme=dark http://localhost:3000
npx playwright codegen --color-scheme=light http://localhost:3000

# 4. Emulate Specific Geolocation, Locale & Timezone
npx playwright codegen --timezone="Europe/Rome" --geolocation="41.8902,12.4922" --lang="it-IT" http://localhost:3000

# 5. Save Authenticated Session to Reuse Later
npx playwright codegen --save-storage=auth.json http://localhost:3000/advanced

# 6. Load Saved Auth State to Record While Already Logged In
npx playwright codegen --load-storage=auth.json http://localhost:3000/advanced`}
            >
              <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                <p>
                  Codegen emulation flags let you record tests as a real mobile user with touch events, customized viewports, dark/light themes, and custom GPS coordinates:
                </p>
                <div className="bg-slate-900 text-emerald-400 p-2.5 rounded font-mono text-[11px] space-y-1">
                  <div># Record iPhone flow with dark mode enabled:</div>
                  <div className="text-sky-300">npx playwright codegen --device=&quot;iPhone 14 Pro&quot; --color-scheme=dark http://localhost:3000</div>
                </div>
              </div>
            </WidgetCard>
          </>
        )}

        {activeTab === "config" && (
          <>
            <WidgetCard
              title="1. Core Test Runner & WebServer Settings"
              testId="widget-config-core"
              docUrl="https://playwright.dev/docs/test-configuration"
              docTitle="Playwright Config API Reference"
              hint={`import { defineConfig } from '@playwright/test';\n\nexport default defineConfig({\n  testDir: './tests',\n  testMatch: /.*\\.spec\\.ts/,\n  timeout: 30000, // 30s per test\n  expect: { timeout: 5000 }, // 5s for expect() auto-retries\n  fullyParallel: true,\n  retries: process.env.CI ? 2 : 0, // Retry failed tests\n  workers: process.env.CI ? 1 : undefined,\n  reporter: [['html', { open: 'never' }], ['list']],\n\n  // Auto-boot web server before running tests\n  webServer: {\n    command: 'npm run dev',\n    url: 'http://localhost:3000',\n    reuseExistingServer: !process.env.CI,\n    timeout: 120000,\n  },\n});`}
            >
              <div className="space-y-2 text-xs text-gray-600">
                <p>
                  Controls parallel worker concurrency, test timeouts, assertion auto-wait thresholds, and auto-spawning local Next.js/dev servers.
                </p>
              </div>
            </WidgetCard>

            <WidgetCard
              title="2. Global use Options & Multi-Browser Projects"
              testId="widget-config-projects"
              docUrl="https://playwright.dev/docs/test-projects"
              docTitle="Playwright Multi-Project Configuration"
              hint={`export default defineConfig({\n  use: {\n    baseURL: 'http://localhost:3000',\n    trace: 'on-first-retry', // 'off' | 'on' | 'retain-on-failure'\n    screenshot: 'only-on-failure',\n    video: 'retain-on-failure',\n    viewport: { width: 1280, height: 720 },\n    ignoreHTTPSErrors: true,\n    actionTimeout: 10000,\n  },\n  projects: [\n    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },\n    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },\n    { name: 'webkit', use: { ...devices['Desktop Safari'] } },\n    { name: 'mobile', use: { ...devices['iPhone 14'] } },\n  ],\n});`}
            >
              <div className="space-y-2 text-xs text-gray-600">
                <p>
                  Configure artifacts (screenshots, traces, videos), default base URLs, action timeouts, and desktop/mobile multi-browser execution matrixes.
                </p>
              </div>
            </WidgetCard>
          </>
        )}

        {activeTab === "flags" && (
          <>
            <WidgetCard
              title="1. Filtering, Worker & Browser Flags"
              testId="widget-flags-filters"
              docUrl="https://playwright.dev/docs/test-cli"
              docTitle="Playwright CLI Reference"
              hint={`# Run tests matching regular expression or tag\nnpx playwright test -g "@smoke"\nnpx playwright test --grep "@smoke"\nnpx playwright test --grep-invert "@slow"\n\n# Run on specific browser project defined in config\nnpx playwright test --project=chromium\nnpx playwright test --project=mobile\n\n# Run headed with browser window visible\nnpx playwright test --headed\n\n# Set worker threads (1 for serial/deterministic debugging)\nnpx playwright test --workers=1\n\n# Max failures threshold before stopping test suite run\nnpx playwright test --max-failures=5`}
            >
              <div className="space-y-2 text-xs text-gray-600">
                <p>Control browser visibility, parallel workers, project matrices, and grep filters right from your terminal.</p>
              </div>
            </WidgetCard>

            <WidgetCard
              title="2. Retry, Reporter & Sharding Flags"
              testId="widget-flags-ci"
              docUrl="https://playwright.dev/docs/test-sharding"
              docTitle="CI/CD Sharding & Reports"
              hint={`# Set retries explicitly on CLI\nnpx playwright test --retries=2\n\n# Choose reporter format (html, list, dot, json, junit)\nnpx playwright test --reporter=list\nnpx playwright test --reporter=html\n\n# Split test execution across multiple CI machines (Sharding)\n# Machine 1 of 4:\nnpx playwright test --shard=1/4\n# Machine 2 of 4:\nnpx playwright test --shard=2/4\n\n# Run tests that failed during the previous run\nnpx playwright test --last-failed`}
            >
              <div className="space-y-2 text-xs text-gray-600">
                <p>
                  <strong><code>--shard=x/y</code></strong> splits large enterprise test suites across multiple parallel GitHub Actions or GitLab runners to drastically cut CI runtimes.
                </p>
              </div>
            </WidgetCard>
          </>
        )}

        {activeTab === "trace" && (
          <>
            <WidgetCard
              title="1. Interactive UI Mode & Debug Inspector"
              testId="widget-trace-ui-mode"
              docUrl="https://playwright.dev/docs/test-ui-mode"
              docTitle="Playwright UI Mode Guide"
              hint={`# Open modern interactive visual test runner\nnpx playwright test --ui\n\n# Step-by-step debug mode with Playwright Inspector & console\nnpx playwright test --debug\n\n# Debug only one test file\nnpx playwright test tests/forms.spec.ts --debug\n\n# Pause execution at any point inside test code:\n// await page.pause();`}
            >
              <div className="space-y-2 text-xs text-gray-600">
                <p>
                  <strong>UI Mode (<code>--ui</code>)</strong> provides time-travel debugging, network inspection, watch mode, and DOM inspection in a visual interface.
                </p>
                <p>
                  <strong><code>page.pause()</code></strong> suspends test execution and opens the Playwright Inspector.
                </p>
              </div>
            </WidgetCard>

            <WidgetCard
              title="2. Trace Viewer & Record on Failure"
              testId="widget-trace-viewer"
              docUrl="https://playwright.dev/docs/trace-viewer"
              docTitle="Trace Viewer Documentation"
              hint={`# Record full trace for all tests\nnpx playwright test --trace on\n\n# Record trace only when test fails (Recommended for CI)\nnpx playwright test --trace retain-on-failure\n\n# View saved zip trace locally\nnpx playwright show-trace trace.zip\n\n# View trace directly from remote URL or S3 artifact\nnpx playwright show-trace https://my-bucket.s3.amazonaws.com/trace.zip`}
            >
              <div className="space-y-2 text-xs text-gray-600">
                <p>
                  Playwright Trace files (<code>trace.zip</code>) contain DOM snapshots, video frames, network request waterfalls, and console logs at every microsecond of execution.
                </p>
              </div>
            </WidgetCard>
          </>
        )}
      </div>

      {/* Copy-Paste Ready Reference Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="font-semibold text-gray-800 text-sm">📋 Quick CLI Flags Reference Table</h3>
          <button
            onClick={() => copySnippet("flags-table", `npx playwright test --ui
npx playwright test --headed
npx playwright test --debug
npx playwright test -g "@smoke"
npx playwright test --project=chromium
npx playwright test --retries=2
npx playwright test --shard=1/4
npx playwright codegen http://localhost:3000`)}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {copiedId === "flags-table" ? "✓ Copied!" : "📋 Copy Common Flags"}
          </button>
        </div>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-600">
                <th className="p-2 font-semibold">Flag</th>
                <th className="p-2 font-semibold">Purpose</th>
                <th className="p-2 font-semibold">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700 font-mono text-[11px]">
              <tr>
                <td className="p-2 text-indigo-600 font-bold">--ui</td>
                <td className="p-2 font-sans">Opens visual interactive test runner</td>
                <td className="p-2">npx playwright test --ui</td>
              </tr>
              <tr>
                <td className="p-2 text-indigo-600 font-bold">--headed</td>
                <td className="p-2 font-sans">Shows real visible browser window</td>
                <td className="p-2">npx playwright test --headed</td>
              </tr>
              <tr>
                <td className="p-2 text-indigo-600 font-bold">--debug</td>
                <td className="p-2 font-sans">Step-by-step debugger & inspector</td>
                <td className="p-2">npx playwright test --debug</td>
              </tr>
              <tr>
                <td className="p-2 text-indigo-600 font-bold">-g, --grep</td>
                <td className="p-2 font-sans">Run tests matching tag or title regex</td>
                <td className="p-2">npx playwright test -g &quot;@smoke&quot;</td>
              </tr>
              <tr>
                <td className="p-2 text-indigo-600 font-bold">--project</td>
                <td className="p-2 font-sans">Target specific browser configuration</td>
                <td className="p-2">npx playwright test --project=firefox</td>
              </tr>
              <tr>
                <td className="p-2 text-indigo-600 font-bold">--workers</td>
                <td className="p-2 font-sans">Control parallel worker thread count</td>
                <td className="p-2">npx playwright test --workers=2</td>
              </tr>
              <tr>
                <td className="p-2 text-indigo-600 font-bold">--shard</td>
                <td className="p-2 font-sans">Split test suite across parallel machines</td>
                <td className="p-2">npx playwright test --shard=1/3</td>
              </tr>
              <tr>
                <td className="p-2 text-indigo-600 font-bold">--trace</td>
                <td className="p-2 font-sans">Control trace recording policy</td>
                <td className="p-2">npx playwright test --trace retain-on-failure</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
