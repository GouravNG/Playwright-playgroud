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

export default function DialogsPage() {
  const [alertResult, setAlertResult] = useState<string | null>(null);
  const [confirmResult, setConfirmResult] = useState<string | null>(null);
  const [promptResult, setPromptResult] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
        <h2 className="font-bold text-purple-800 mb-1">🪟 Dialogs & Popups</h2>
        <p className="text-sm text-purple-700">
          Practice handling JS alerts, confirms, prompts, modals, toasts, tooltips, and new-tab links.
        </p>
      </div>

      {/* Toast */}
      {toast && (
        <div data-testid="toast-notification"
          className="fixed top-4 right-4 z-50 bg-gray-900 text-white text-sm px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-pulse">
          ✅ {toast}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* JS alert() */}
        <WidgetCard title="1. JS alert() — page.on('dialog')" testId="widget-js-alert"
          hint={`// Set up handler BEFORE triggering the alert\npage.on('dialog', async (dialog) => {\n  console.log(dialog.message()); // 'Item added to cart!'\n  await dialog.accept();\n});\nawait page.getByTestId('btn-trigger-alert').click();`}>
          <div className="space-y-3">
            <button data-testid="btn-trigger-alert"
              onClick={() => {
                const r = window.alert("🛒 Item added to cart!");
                setAlertResult("Alert accepted");
                return r;
              }}
              className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700">
              Trigger Alert
            </button>
            {alertResult && (
              <div data-testid="alert-result" className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded">
                ✓ {alertResult}
              </div>
            )}
          </div>
        </WidgetCard>

        {/* JS confirm() */}
        <WidgetCard title="2. JS confirm() — accept or dismiss" testId="widget-js-confirm"
          hint={`// Accept the confirm dialog\npage.once('dialog', dialog => dialog.accept());\nawait page.getByTestId('btn-confirm-delete').click();\nawait expect(page.getByTestId('confirm-result')).toHaveText('Confirmed: Item deleted');\n\n// Dismiss the confirm\npage.once('dialog', dialog => dialog.dismiss());\nawait page.getByTestId('btn-confirm-delete').click();\nawait expect(page.getByTestId('confirm-result')).toHaveText('Dismissed: Item kept');`}>
          <div className="space-y-3">
            <button data-testid="btn-confirm-delete"
              onClick={() => {
                const ok = window.confirm("Are you sure you want to delete this item?");
                setConfirmResult(ok ? "Confirmed: Item deleted" : "Dismissed: Item kept");
              }}
              className="bg-red-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-600">
              Delete Item
            </button>
            {confirmResult && (
              <div data-testid="confirm-result"
                className={`text-xs px-3 py-1 rounded ${confirmResult.startsWith("Confirmed") ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50"}`}>
                ✓ {confirmResult}
              </div>
            )}
          </div>
        </WidgetCard>

        {/* JS prompt() */}
        <WidgetCard title="3. JS prompt() — dialog.accept('text')" testId="widget-js-prompt"
          hint={`// Provide text input to the prompt\npage.once('dialog', dialog => dialog.accept('SAVE20'));\nawait page.getByTestId('btn-enter-promo').click();\nawait expect(page.getByTestId('prompt-result')).toContainText('SAVE20');`}>
          <div className="space-y-3">
            <button data-testid="btn-enter-promo"
              onClick={() => {
                const code = window.prompt("Enter your promo code:", "SAVE10");
                setPromptResult(code ? `Applied: ${code}` : "Cancelled");
              }}
              className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700">
              Enter Promo Code
            </button>
            {promptResult && (
              <div data-testid="prompt-result"
                className={`text-xs px-3 py-1 rounded ${promptResult.startsWith("Applied") ? "text-green-600 bg-green-50" : "text-gray-600 bg-gray-100"}`}>
                {promptResult}
              </div>
            )}
          </div>
        </WidgetCard>

        {/* Custom Modal */}
        <WidgetCard title="4. Custom Modal — open, assert, close" testId="widget-modal"
          hint={`// Open modal\nawait page.getByTestId('btn-open-modal').click();\nawait expect(page.getByTestId('review-modal')).toBeVisible();\nawait expect(page.getByTestId('modal-title')).toHaveText('Review Your Order');\n\n// Close modal\nawait page.getByTestId('btn-close-modal').click();\nawait expect(page.getByTestId('review-modal')).toBeHidden();`}>
          <div className="space-y-3">
            <button data-testid="btn-open-modal" onClick={() => setModalOpen(true)}
              className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700">
              Review Order
            </button>
          </div>
        </WidgetCard>

        {/* Drawer */}
        <WidgetCard title="5. Drawer / Side Panel" testId="widget-drawer"
          hint={`await page.getByTestId('btn-open-drawer').click();\nawait expect(page.getByTestId('filter-drawer')).toBeVisible();\nawait page.getByTestId('btn-close-drawer').click();\nawait expect(page.getByTestId('filter-drawer')).toBeHidden();`}>
          <div className="space-y-3">
            <button data-testid="btn-open-drawer" onClick={() => setDrawerOpen(true)}
              className="border border-indigo-600 text-indigo-600 text-sm px-4 py-2 rounded-lg hover:bg-indigo-50">
              Open Filter Drawer
            </button>
          </div>
        </WidgetCard>

        {/* Toast */}
        <WidgetCard title="6. Toast / Snackbar — auto-disappears" testId="widget-toast"
          hint={`// Click button that triggers a toast\nawait page.getByTestId('btn-trigger-toast').click();\nawait expect(page.getByTestId('toast-notification')).toBeVisible();\n// Toast auto-hides after 3 seconds\nawait expect(page.getByTestId('toast-notification')).toBeHidden({ timeout: 5000 });`}>
          <button data-testid="btn-trigger-toast"
            onClick={() => setToast("Item saved to wishlist!")}
            className="bg-gray-800 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-900">
            Save to Wishlist ♡
          </button>
          <p className="text-xs text-gray-400 mt-2">Toast appears top-right and auto-hides after 3s</p>
        </WidgetCard>

        {/* Tooltip */}
        <WidgetCard title="7. Tooltip — hover to reveal" testId="widget-tooltip"
          hint={`await page.getByTestId('shipping-info-icon').hover();\nawait expect(page.getByTestId('shipping-tooltip')).toBeVisible();\nawait expect(page.getByTestId('shipping-tooltip')).toContainText('Free shipping');\nawait page.mouse.move(0, 0); // move away\nawait expect(page.getByTestId('shipping-tooltip')).toBeHidden();`}>
          <div className="relative inline-flex items-center gap-2">
            <span className="text-sm text-gray-700">Shipping Info</span>
            <span data-testid="shipping-info-icon"
              onMouseEnter={() => setTooltipVisible(true)}
              onMouseLeave={() => setTooltipVisible(false)}
              className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold cursor-help">
              ℹ
            </span>
            {tooltipVisible && (
              <div data-testid="shipping-tooltip"
                className="absolute left-8 top-0 z-10 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
                Free shipping on orders over $50 🚚
              </div>
            )}
          </div>
        </WidgetCard>

        {/* New Tab */}
        <WidgetCard title="8. New Tab — context.waitForEvent('page')" testId="widget-new-tab"
          hint={`// Wait for new page/tab to open\nconst [newPage] = await Promise.all([\n  context.waitForEvent('page'),\n  page.getByTestId('btn-open-terms').click(),\n]);\nawait newPage.waitForLoadState();\nawait expect(newPage).toHaveURL(/terms/);\nawait expect(newPage.getByRole('heading')).toContainText('Terms');`}>
          <a data-testid="btn-open-terms"
            href="/terms" target="_blank" rel="noreferrer"
            className="inline-block bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-lg hover:bg-gray-200 border border-gray-300">
            Terms & Conditions ↗
          </a>
          <p className="text-xs text-gray-400 mt-2">Opens in a new tab — use <code>context.waitForEvent(&apos;page&apos;)</code></p>
        </WidgetCard>

      </div>

      {/* Modal overlay */}
      {modalOpen && (
        <div data-testid="modal-overlay"
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div data-testid="review-modal"
            className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 data-testid="modal-title" className="font-bold text-lg text-gray-800">Review Your Order</h3>
              <button data-testid="btn-close-modal" onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none">×</button>
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span>Wireless Headphones × 1</span>
                <strong>$79.99</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span>Running Shoes × 2</span>
                <strong>$119.98</strong>
              </div>
              <div className="flex justify-between pt-2 font-bold">
                <span>Total</span>
                <span className="text-green-700">$199.97</span>
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <button data-testid="btn-confirm-order"
                onClick={() => { setModalOpen(false); setToast("Order confirmed! 🎉"); }}
                className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl font-medium text-sm hover:bg-indigo-700">
                Confirm Order
              </button>
              <button data-testid="btn-cancel-modal" onClick={() => setModalOpen(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drawer overlay */}
      {drawerOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setDrawerOpen(false)} />
          <div data-testid="filter-drawer"
            className="fixed right-0 top-0 h-full w-72 bg-white shadow-2xl z-50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-800">Filter Orders</h3>
              <button data-testid="btn-close-drawer" onClick={() => setDrawerOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium text-gray-700 mb-2">Status</p>
                {["Delivered", "Shipped", "Processing", "Cancelled"].map((s) => (
                  <label key={s} className="flex items-center gap-2 py-1 cursor-pointer">
                    <input type="checkbox" className="rounded text-indigo-600" />
                    <span>{s}</span>
                  </label>
                ))}
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-2">Date Range</p>
                <input type="date" className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
            </div>
            <button className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-xl text-sm hover:bg-indigo-700" onClick={() => setDrawerOpen(false)}>
              Apply Filters
            </button>
          </div>
        </>
      )}
    </div>
  );
}
