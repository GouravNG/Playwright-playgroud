"use client";
import { useState, useEffect } from "react";

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
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm" data-testid={testId}>
      <h3 className="font-semibold text-gray-700 text-sm mb-3 border-b pb-2">{title}</h3>
      {children}
      <HintPanel code={hint} />
    </div>
  );
}

export default function VisualTestingPage() {
  const [promoActive, setPromoActive] = useState(false);
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const [currentTime, setCurrentTime] = useState<string>("12:00:00 PM");
  const [stockPrice, setStockPrice] = useState<string>("142.85");

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString());
    setStockPrice((142.5 + Math.random() * 2).toFixed(2));
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
      setStockPrice((142.5 + Math.random() * 2).toFixed(2));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
        <h2 className="font-bold text-pink-800 mb-1">🎨 Visual Regression & Screenshot Testing</h2>
        <p className="text-sm text-pink-700">
          Practice visual comparisons using <code>expect(page).toHaveScreenshot()</code>, element screenshots (<code>locator.screenshot()</code>), masking dynamic timestamps/prices, and PDF document generation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Full-Page Screenshot */}
        <WidgetCard title="1. Full Page Visual Baseline" testId="widget-full-screenshot"
          hint={`// Compare full page against baseline image\nawait expect(page).toHaveScreenshot('visual-page-baseline.png', {\n  fullPage: true,\n  maxDiffPixelRatio: 0.05,\n});`}>
          <div className="space-y-2 text-xs text-gray-600">
            <p>
              Playwright captures the entire scrollable height and performs pixel-by-pixel diffing with automatically configured anti-aliasing tolerance.
            </p>
            <div className="p-2.5 bg-gray-100 rounded text-gray-700 font-mono text-[11px]">
              npx playwright test --update-snapshots
            </div>
          </div>
        </WidgetCard>

        {/* Component / Locator Screenshot */}
        <WidgetCard title="2. Component-Level Snapshot (Product Card)" testId="widget-component-screenshot"
          hint={`// Capture and compare just one component\nconst card = page.getByTestId('visual-product-card');\nawait expect(card).toHaveScreenshot('product-card-snapshot.png');`}>
          <div className="space-y-3">
            <div
              data-testid="visual-product-card"
              className={`p-4 rounded-xl border transition-all ${
                themeMode === "dark" ? "bg-slate-900 text-white border-slate-700" : "bg-gray-50 text-gray-800 border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-500">Premium Audio</span>
                  <h4 className="font-bold text-sm mt-0.5">Studio Hi-Fi Wireless</h4>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-100/50 px-2 py-0.5 rounded">NEW</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">Active Noise Cancellation & 40h battery life.</p>
              <div className="mt-3 flex justify-between items-center pt-2 border-t border-gray-200/50">
                <span className="text-sm font-bold">$249.00</span>
                <button className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">Add to Bag</button>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setThemeMode(themeMode === "light" ? "dark" : "light")}
                data-testid="btn-toggle-theme"
                className="text-xs bg-gray-200 hover:bg-gray-300 px-2.5 py-1 rounded text-gray-700"
              >
                Toggle Theme (Triggers Visual Diff)
              </button>
            </div>
          </div>
        </WidgetCard>

        {/* Masking Dynamic Elements */}
        <WidgetCard title="3. Masking Dynamic Timestamps & Prices" testId="widget-masking"
          hint={`// Mask dynamic element so it doesn't cause false positives\nawait expect(page.getByTestId('dynamic-ticker-box')).toHaveScreenshot('ticker-masked.png', {\n  mask: [page.getByTestId('masked-dynamic-time'), page.getByTestId('masked-stock-price')],\n});`}>
          <div className="space-y-3" data-testid="dynamic-ticker-box">
            <p className="text-xs text-gray-600">
              Without masking, real-time clocks or shifting stock prices always fail visual tests. Use <code>mask: [locator]</code> to paint a neutral overlay:
            </p>
            <div className="p-3 bg-slate-100 rounded-lg border text-xs space-y-2">
              <div className="flex justify-between">
                <span>Current Server UTC:</span>
                <span data-testid="masked-dynamic-time" className="font-mono font-bold text-indigo-600">
                  {currentTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Live Share Price:</span>
                <span data-testid="masked-stock-price" className="font-mono font-bold text-emerald-600">
                  ${stockPrice}
                </span>
              </div>
            </div>
          </div>
        </WidgetCard>

        {/* Intentional Visual Diff Trigger */}
        <WidgetCard title="4. Intentional UI Regression Demo" testId="widget-diff-toggle"
          hint={`// Toggle UI shift and assert mismatch tolerance or update\nawait page.getByTestId('btn-trigger-visual-change').click();\n// This will fail strict baseline unless tolerance is adjusted:`}>
          <div className="space-y-3">
            <div
              data-testid="banner-target-diff"
              className={`p-4 rounded-xl text-center text-xs font-semibold transition-all ${
                promoActive
                  ? "bg-gradient-to-r from-red-500 to-amber-500 text-white shadow-lg"
                  : "bg-indigo-50 text-indigo-700 border border-indigo-200"
              }`}
            >
              {promoActive ? "🔥 FLASH SALE! 50% OFF EVERYTHING CODE: FLASH50" : "Standard Promo: Free shipping on orders over $50"}
            </div>
            <button
              onClick={() => setPromoActive(!promoActive)}
              data-testid="btn-trigger-visual-change"
              className="text-xs bg-gray-800 text-white px-3 py-1.5 rounded hover:bg-gray-900"
            >
              Toggle Flash Sale Banner (Pixel Change)
            </button>
          </div>
        </WidgetCard>

        {/* PDF Printing */}
        <WidgetCard title="5. PDF Generation via page.pdf()" testId="widget-pdf-doc"
          hint={`// Note: page.pdf() works in headless Chromium\nawait page.pdf({\n  path: 'tests/artifacts/page-statement.pdf',\n  format: 'A4',\n  printBackground: true,\n});`}>
          <div className="space-y-2 text-xs text-gray-600">
            <p>
              Playwright can render print media layouts directly to PDF snapshots for invoices, contracts, or e-commerce receipts.
            </p>
            <div className="font-mono bg-gray-100 p-2 rounded text-[11px] text-gray-700">
              await page.emulateMedia({`{ media: 'print' }`});
            </div>
          </div>
        </WidgetCard>
      </div>
    </div>
  );
}
