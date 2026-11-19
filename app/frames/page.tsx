"use client";
import { useEffect, useRef, useState } from "react";

function HintPanel({ code }: { code: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3">
      <button onClick={() => setOpen((v) => !v)} className="text-xs text-indigo-600 hover:underline font-medium">
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

export default function FramesPage() {
  const shadowHostRef = useRef<HTMLDivElement>(null);
  const [nestedResult, setNestedResult] = useState<string | null>(null);

  // Mount Shadow DOM custom element
  useEffect(() => {
    if (shadowHostRef.current && !shadowHostRef.current.shadowRoot) {
      const shadow = shadowHostRef.current.attachShadow({ mode: "open" });
      const container = document.createElement("div");
      container.innerHTML = `
        <style>
          .shadow-box {
            padding: 12px;
            background: #f0fdf4;
            border: 1px dashed #22c55e;
            border-radius: 8px;
            font-family: inherit;
          }
          .shadow-title {
            font-size: 13px;
            font-weight: 600;
            color: #15803d;
            margin-bottom: 6px;
          }
          .shadow-btn {
            background: #16a34a;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
          }
          .shadow-btn:hover {
            background: #15803d;
          }
        </style>
        <div class="shadow-box" data-testid="shadow-container">
          <div class="shadow-title">⚡ Shadow Root Component (Open)</div>
          <p style="font-size: 11px; color: #166534; margin: 0 0 8px 0;">Playwright automatically pierces open shadow trees!</p>
          <button class="shadow-btn" data-testid="btn-shadow-action">Click Inside Shadow Root</button>
          <span id="shadow-status" style="margin-left: 8px; font-size: 11px; font-weight: bold; color: #15803d;"></span>
        </div>
      `;
      shadow.appendChild(container);

      const btn = shadow.querySelector('[data-testid="btn-shadow-action"]');
      const status = shadow.querySelector("#shadow-status");
      btn?.addEventListener("click", () => {
        if (status) status.textContent = "✓ Shadow Button Clicked!";
      });
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 rounded-xl p-4">
        <h2 className="font-bold text-violet-800 dark:text-violet-300 mb-1">🖼️ Frames (iframes) & Shadow DOM</h2>
        <p className="text-sm text-violet-700 dark:text-violet-400">
          Learn how Playwright pierces frame boundaries with <code>page.frameLocator()</code> and automatically pierces open <strong>Shadow DOM</strong> roots using standard user-facing locators.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Payment iframe */}
        <WidgetCard title="1. Iframe Form with page.frameLocator()" testId="widget-iframe-payment"
          hint={`// Frame locator targeting internal form elements\nconst paymentFrame = page.frameLocator('#payment-frame');\nawait paymentFrame.getByTestId('input-frame-card').fill('4111 2222 3333 4444');\nawait paymentFrame.getByTestId('input-frame-expiry').fill('11/29');\nawait paymentFrame.getByTestId('input-frame-cvv').fill('999');\nawait paymentFrame.getByTestId('btn-frame-submit-payment').click();\nawait expect(paymentFrame.getByTestId('frame-payment-success')).toBeVisible();`}>
          <div className="space-y-2">
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">Simulated Stripe/PayPal embedded iframe checkout component:</p>
            <div className="border border-gray-300 dark:border-slate-700 rounded-xl overflow-hidden shadow-inner dark:bg-slate-800">
              <iframe
                id="payment-frame"
                data-testid="payment-frame"
                src="/frames/inner-payment"
                className="w-full h-64 border-none"
                title="Secure Payment Frame"
              />
            </div>
          </div>
        </WidgetCard>

        {/* Shadow DOM Piercing */}
        <WidgetCard title="2. Shadow DOM Auto-Piercing" testId="widget-shadow-dom"
          hint={`// Standard locators pierce open Shadow DOM roots automatically!\nawait page.getByTestId('btn-shadow-action').click();\n// Or using role inside custom element:\nawait page.locator('div[data-testid=\"shadow-host\"]').getByRole('button', { name: 'Click Inside Shadow Root' }).click();\nawait expect(page.getByText('Shadow Button Clicked!')).toBeVisible();`}>
          <div className="space-y-3">
            <p className="text-xs text-gray-600 dark:text-slate-400">
              Unlike Selenium where you have to call <code>getShadowRoot()</code>, Playwright automatically pierces open shadow trees with <code>getByRole()</code> and <code>getByTestId()</code>.
            </p>
            <div ref={shadowHostRef} data-testid="shadow-host" />
          </div>
        </WidgetCard>

        {/* Nested Frames Drill */}
        <WidgetCard title="3. Nested Frames Chain" testId="widget-nested-frames"
          hint={`// Chaining multiple frameLocators\nconst parentFrame = page.frameLocator('#parent-frame');\nconst childFrame = parentFrame.frameLocator('#child-frame');\nawait childFrame.getByRole('button', { name: 'Confirm Nested' }).click();`}>
          <div className="space-y-3">
            <p className="text-xs text-gray-600 dark:text-slate-400">
              Interactive demonstration of nested iframe handling via chaining:
            </p>
            <div className="p-3 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 text-xs space-y-2">
              <span className="font-semibold text-gray-700 dark:text-slate-200">Root Page Area</span>
              <div className="p-3 bg-white dark:bg-slate-800 border border-dashed border-gray-400 dark:border-slate-600 rounded">
                <span className="text-[11px] text-gray-500 dark:text-slate-400 font-mono">Frame Level 1 (Simulated)</span>
                <div className="mt-2 p-2 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded">
                  <span className="text-[11px] text-indigo-700 dark:text-indigo-300 font-mono">Frame Level 2 (Target)</span>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => setNestedResult("Nested Frame Action Success!")}
                      data-testid="btn-nested-confirm"
                      className="bg-indigo-600 text-white text-[11px] px-2.5 py-1 rounded"
                    >
                      Confirm Nested Action
                    </button>
                    {nestedResult && (
                      <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-medium" data-testid="nested-status">
                        ✓ {nestedResult}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </WidgetCard>

        {/* Frame Attributes / Cross-Origin */}
        <WidgetCard title="4. Frame URL & Attribute Checks" testId="widget-frame-attrs"
          hint={`// Assert iframe attributes or navigate directly into it\nconst frameElement = page.locator('#payment-frame');\nawait expect(frameElement).toHaveAttribute('src', '/frames/inner-payment');\nconst frameObj = page.frame({ url: /inner-payment/ });\nexpect(frameObj?.url()).toContain('/frames/inner-payment');`}>
          <div className="space-y-2 text-xs text-gray-600 dark:text-slate-400">
            <p>
              Inspect frame properties or access the <code>Frame</code> instance via URL matcher:
            </p>
            <pre className="bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200 border border-gray-200 dark:border-slate-700 p-2.5 rounded font-mono text-[11px]">
              const frame = page.frame({`{ url: /.*inner-payment/ }`});
            </pre>
          </div>
        </WidgetCard>
      </div>
    </div>
  );
}
