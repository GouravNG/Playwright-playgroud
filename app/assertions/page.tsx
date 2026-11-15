"use client";
import { useState } from "react";

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

export default function AssertionsPage() {
  const [visible, setVisible] = useState(true);
  const [enabled, setEnabled] = useState(true);
  const [checked, setChecked] = useState(false);
  const [itemCount, setItemCount] = useState(2);
  const [inputVal, setInputVal] = useState("SAVE10");
  const [status, setStatus] = useState("Processing");

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <h2 className="font-bold text-green-800 mb-1">✅ Assertions Studio</h2>
        <p className="text-sm text-green-700">
          Every Playwright <code className="bg-green-100 px-1 rounded">expect()</code> matcher demonstrated live.
          Toggle the controls and write assertions against the resulting state.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* toBeVisible / toBeHidden */}
        <WidgetCard title="1. toBeVisible() / toBeHidden()" testId="widget-visibility"
          hint={`await expect(page.getByTestId('stock-badge')).toBeVisible();\nawait expect(page.getByTestId('stock-badge')).toBeHidden();\nawait expect(page.getByTestId('stock-badge')).not.toBeVisible();`}>
          <div className="space-y-3">
            <div className="flex gap-2">
              <button onClick={() => setVisible(true)} className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg">Show badge</button>
              <button onClick={() => setVisible(false)} className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg">Hide badge</button>
            </div>
            {visible && (
              <span data-testid="stock-badge"
                className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                ✅ In Stock
              </span>
            )}
            {!visible && <p className="text-xs text-gray-400 italic">(badge is hidden — use toBeHidden())</p>}
          </div>
        </WidgetCard>

        {/* toBeEnabled / toBeDisabled */}
        <WidgetCard title="2. toBeEnabled() / toBeDisabled()" testId="widget-enabled-disabled"
          hint={`await expect(page.getByRole('button', { name: 'Checkout' })).toBeEnabled();\nawait expect(page.getByRole('button', { name: 'Checkout' })).toBeDisabled();`}>
          <div className="space-y-3">
            <div className="flex gap-2">
              <button onClick={() => setEnabled(true)} className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg">Enable</button>
              <button onClick={() => setEnabled(false)} className="text-xs bg-gray-400 text-white px-3 py-1.5 rounded-lg">Disable</button>
            </div>
            <button disabled={!enabled}
              className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${
                enabled ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}>
              Checkout
            </button>
          </div>
        </WidgetCard>

        {/* toBeChecked */}
        <WidgetCard title="3. toBeChecked()" testId="widget-checked"
          hint={`await page.getByLabel('Subscribe to newsletter').check();\nawait expect(page.getByLabel('Subscribe to newsletter')).toBeChecked();\nawait page.getByLabel('Subscribe to newsletter').uncheck();\nawait expect(page.getByLabel('Subscribe to newsletter')).not.toBeChecked();`}>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="newsletter" checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded"
            />
            <label htmlFor="newsletter" className="text-sm text-gray-700">Subscribe to newsletter</label>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Currently: <strong>{checked ? "checked ✓" : "unchecked"}</strong>
          </p>
        </WidgetCard>

        {/* toHaveText / toContainText */}
        <WidgetCard title="4. toHaveText() / toContainText()" testId="widget-text-assertion"
          hint={`await expect(page.getByTestId('product-title')).toHaveText('Wireless Headphones');\nawait expect(page.getByTestId('product-price')).toContainText('79');\nawait expect(page.getByTestId('product-price')).toHaveText('$79.99');`}>
          <div className="space-y-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div data-testid="product-title" className="font-semibold text-gray-800">Wireless Headphones</div>
            <div data-testid="product-price" className="text-green-700 font-bold">$79.99</div>
            <div data-testid="product-category" className="text-xs text-gray-500">Category: Electronics</div>
          </div>
        </WidgetCard>

        {/* toHaveValue */}
        <WidgetCard title="5. toHaveValue() — Input value" testId="widget-have-value"
          hint={`await page.getByTestId('promo-input').fill('BLACKFRIDAY');\nawait expect(page.getByTestId('promo-input')).toHaveValue('BLACKFRIDAY');\nawait expect(page.getByTestId('promo-input')).not.toHaveValue('');`}>
          <div className="space-y-2">
            <label className="text-sm text-gray-600 font-medium block" htmlFor="promo-assert">Promo Code</label>
            <input id="promo-assert" data-testid="promo-input"
              type="text" value={inputVal} onChange={(e) => setInputVal(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <p className="text-xs text-gray-400">Current value: <code className="font-mono">&apos;{inputVal}&apos;</code></p>
          </div>
        </WidgetCard>

        {/* toHaveAttribute */}
        <WidgetCard title="6. toHaveAttribute() — Element attributes" testId="widget-have-attribute"
          hint={`await expect(page.getByTestId('order-status')).toHaveAttribute('data-status', 'Processing');\nawait expect(page.getByTestId('checkout-btn')).toHaveAttribute('aria-label', 'Proceed to checkout');`}>
          <div className="space-y-3">
            <div className="flex gap-2">
              {["Processing", "Shipped", "Delivered"].map((s) => (
                <button key={s} onClick={() => setStatus(s)}
                  className={`text-xs px-2 py-1 rounded border transition-colors ${
                    status === s ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-300 text-gray-600"
                  }`}>{s}</button>
              ))}
            </div>
            <div data-testid="order-status" data-status={status}
              className="text-sm font-medium px-3 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
              Order Status: <strong>{status}</strong>
            </div>
            <button data-testid="checkout-btn" aria-label="Proceed to checkout"
              className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg">
              Proceed to Checkout
            </button>
          </div>
        </WidgetCard>

        {/* toHaveCount */}
        <WidgetCard title="7. toHaveCount() — Element count" testId="widget-have-count"
          hint={`await expect(page.getByTestId('cart-item')).toHaveCount(2);\nawait page.getByTestId('add-item-btn').click();\nawait expect(page.getByTestId('cart-item')).toHaveCount(3);`}>
          <div className="space-y-3">
            <div className="flex gap-2">
              <button onClick={() => setItemCount((c) => c + 1)} data-testid="add-item-btn"
                className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg">+ Add Item</button>
              <button onClick={() => setItemCount((c) => Math.max(0, c - 1))}
                className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg">- Remove</button>
            </div>
            <div className="space-y-1">
              {Array.from({ length: itemCount }).map((_, i) => (
                <div key={i} data-testid="cart-item"
                  className="text-xs flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded border border-gray-200">
                  🛒 Cart Item {i + 1}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500">Count: <strong>{itemCount}</strong></p>
          </div>
        </WidgetCard>

        {/* toHaveURL / toHaveTitle */}
        <WidgetCard title="8. toHaveURL() / toHaveTitle()" testId="widget-url-title"
          hint={`await expect(page).toHaveURL('http://localhost:3000/assertions');\nawait expect(page).toHaveURL(/assertions/);\nawait expect(page).toHaveTitle(/Playwright Practice Site/);`}>
          <div className="space-y-2 text-xs bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
            <div><span className="text-gray-400">URL: </span><span className="text-blue-600">/assertions</span></div>
            <div><span className="text-gray-400">Title: </span><span className="text-indigo-600">🎭 Playwright Practice Site</span></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">The current page — write assertions against its URL and title.</p>
        </WidgetCard>

        {/* expect.soft */}
        <WidgetCard title="9. expect.soft() — Soft assertions" testId="widget-soft-assertions"
          hint={`// Soft assertions don't stop the test on failure\ntest('multiple checks', async ({ page }) => {\n  expect.soft(page.getByTestId('stock-badge')).toBeVisible();  // may fail\n  expect.soft(page.getByTestId('product-price')).toHaveText('$0'); // may fail\n  // Test continues even if above fail\n  await page.getByRole('button', { name: 'Checkout' }).click();\n}); // All failures reported at end`}>
          <div className="space-y-2">
            <div className="text-xs text-gray-600 mb-2">These two items deliberately have different states — both are checked with <code>expect.soft()</code>:</div>
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200">
              <span data-testid="soft-pass" className="text-xs text-green-700">✅ Stock badge (visible) — PASS</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-red-50 rounded border border-red-200">
              <span data-testid="soft-fail" className="text-xs text-red-600">❌ Price = $0 assertion — FAIL (but test continues)</span>
            </div>
          </div>
        </WidgetCard>

        {/* not. negation */}
        <WidgetCard title="10. .not. — Negative matchers" testId="widget-negation"
          hint={`await expect(page.getByTestId('out-of-stock-label')).not.toBeVisible();\nawait expect(page.getByRole('button', { name: 'Checkout' })).not.toBeDisabled();\nawait expect(page.getByTestId('promo-input')).not.toHaveValue('');`}>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200">
              <span>Out of Stock label</span>
              <span data-testid="out-of-stock-label" className="hidden">Out of Stock</span>
              <span className="text-gray-400 italic">(hidden — not.toBeVisible() ✓)</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200">
              <button className="bg-indigo-600 text-white px-2 py-1 rounded text-xs">Checkout</button>
              <span className="text-gray-400 italic">(enabled — not.toBeDisabled() ✓)</span>
            </div>
          </div>
        </WidgetCard>

      </div>
    </div>
  );
}
