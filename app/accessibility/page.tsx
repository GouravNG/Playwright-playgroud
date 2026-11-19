"use client";
import { useState } from "react";

function HintPanel({ code }: { code: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3">
      <button onClick={() => setOpen((v) => !v)} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
        {open ? "🙈 Hide hint" : "💡 Show Playwright code"}
      </button>
      {open && (
        <pre className="mt-2 p-3 bg-gray-900 text-green-300 text-xs rounded-lg overflow-x-auto font-mono leading-relaxed">{code}</pre>
      )}
    </div>
  );
}

function WidgetCard({ title, testId, children, hint }: {
  title: string; testId?: string; children: React.ReactNode; hint: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm" data-testid={testId}>
      <h3 className="font-semibold text-gray-700 dark:text-slate-200 text-sm mb-3 border-b dark:border-slate-700 pb-2">{title}</h3>
      {children}
      <HintPanel code={hint} />
    </div>
  );
}

export default function AccessibilityPage() {
  const [fixedContrast, setFixedContrast] = useState(false);
  const [keyboardCount, setKeyboardCount] = useState(0);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-xl p-4">
        <h2 className="font-bold text-teal-800 dark:text-teal-300 mb-1">♿ Accessibility (a11y) & WCAG Auditing</h2>
        <p className="text-sm text-teal-700 dark:text-teal-400">
          Combine Playwright with <code>@axe-core/playwright</code> for automated WCAG 2.1 compliance audits, test ARIA landmarks, and verify keyboard navigation flows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Axe-Core Automation Setup */}
        <WidgetCard title="1. Automated axe-core Full Scan" testId="widget-axe-audit"
          hint={`import AxeBuilder from '@axe-core/playwright';\n\ntest('a11y audit', async ({ page }) => {\n  await page.goto('/accessibility');\n  const results = await new AxeBuilder({ page })\n    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])\n    .analyze();\n  expect(results.violations).toEqual([]);\n});`}>
          <div className="space-y-2 text-xs text-gray-600 dark:text-slate-400">
            <p>
              Run comprehensive automated accessibility scans covering color contrast, missing form labels, alt tags, and landmark regions.
            </p>
            <div className="bg-gray-100 dark:bg-slate-800 p-2.5 rounded font-mono text-[11px] text-gray-800 dark:text-slate-200 border border-gray-200 dark:border-slate-700">
              npm i -D @axe-core/playwright
            </div>
          </div>
        </WidgetCard>

        {/* Color Contrast Violation & Resolution */}
        <WidgetCard title="2. Color Contrast (WCAG AA 4.5:1)" testId="widget-color-contrast"
          hint={`// Exclude intentional demo area or scan specific container\nconst results = await new AxeBuilder({ page })\n  .include('[data-testid=\"contrast-target-box\"]')\n  .analyze();\n// Violations detected when contrast is below threshold`}>
          <div className="space-y-3">
            <div
              data-testid="contrast-target-box"
              className={`p-3 rounded-lg border text-xs font-medium transition-colors ${
                fixedContrast ? "bg-indigo-900 text-white border-indigo-950" : "bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500 border-gray-200 dark:border-slate-700"
              }`}
            >
              {fixedContrast
                ? "✓ High Contrast (Ratio > 7:1) - Passes WCAG AAA"
                : "⚠️ Low Contrast Demo Text (Ratio < 2.5:1) - Fails WCAG AA"}
            </div>
            <button
              onClick={() => setFixedContrast(!fixedContrast)}
              data-testid="btn-fix-contrast"
              className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700"
            >
              {fixedContrast ? "Revert to Low Contrast (Trigger Violation)" : "Fix Contrast Ratio (Pass WCAG)"}
            </button>
          </div>
        </WidgetCard>

        {/* Keyboard Tab Navigation */}
        <WidgetCard title="3. Keyboard-Only Navigation Sequence" testId="widget-keyboard-tabbing"
          hint={`// Verify tab navigation order\nawait page.keyboard.press('Tab');\nawait expect(page.getByTestId('a11y-input-one')).toBeFocused();\nawait page.keyboard.press('Tab');\nawait expect(page.getByTestId('a11y-btn-increment')).toBeFocused();\nawait page.keyboard.press('Space');\nawait expect(page.getByTestId('key-counter')).toHaveText('1');`}>
          <div className="space-y-3">
            <p className="text-xs text-gray-600 dark:text-slate-400">Ensure every action can be invoked using keyboard alone (Tab, Space, Enter):</p>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                data-testid="a11y-input-one"
                placeholder="Press Tab from here"
                className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 rounded px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <div className="flex items-center gap-2">
                <button
                  data-testid="a11y-btn-increment"
                  onClick={() => setKeyboardCount((c) => c + 1)}
                  className="bg-teal-700 text-white text-xs px-3 py-1.5 rounded hover:bg-teal-800 focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  Increment (+1)
                </button>
                <span className="text-xs text-gray-600 dark:text-slate-400">
                  Counter: <strong data-testid="key-counter">{keyboardCount}</strong>
                </span>
              </div>
            </div>
          </div>
        </WidgetCard>

        {/* ARIA Landmarks & Accessible Names */}
        <WidgetCard title="4. ARIA Roles & Screen Reader Landmarks" testId="widget-aria-landmarks"
          hint={`// Playwright getByRole locators enforce accessible practices!\nawait expect(page.getByRole('region', { name: 'Billing Summary' })).toBeVisible();\nawait expect(page.getByRole('button', { name: 'Download Invoice' })).toHaveAccessibleName('Download Invoice');`}>
          <div className="space-y-3">
            <section
              aria-label="Billing Summary"
              role="region"
              className="p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-xs space-y-1"
            >
              <h4 className="font-semibold text-gray-700 dark:text-slate-200">Billing Summary Region</h4>
              <p className="text-gray-500 dark:text-slate-400">Accessible region landmark with aria-label.</p>
              <button
                aria-label="Download Invoice"
                className="mt-2 bg-gray-800 dark:bg-slate-700 text-white text-xs px-3 py-1 rounded hover:bg-gray-900 dark:hover:bg-slate-600"
              >
                Download PDF
              </button>
            </section>
          </div>
        </WidgetCard>
      </div>
    </div>
  );
}
