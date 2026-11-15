"use client";
import { useState, useRef } from "react";

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

export default function ActionsPage() {
  const [log, setLog] = useState<string[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [hovered, setHovered] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const promoRef = useRef<HTMLInputElement>(null);
  const relatedRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 4)]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
        <h2 className="font-bold text-orange-800 mb-1">🖱️ Actions Arena</h2>
        <p className="text-sm text-orange-600">
          Practice every Playwright action. The <strong>Event Log</strong> below shows what triggered. Each widget focuses on one action type.
        </p>
      </div>

      {/* Event log */}
      <div data-testid="event-log" className="bg-gray-900 rounded-xl p-3 min-h-[70px]">
        <div className="text-xs text-gray-400 mb-1 font-mono">// Event Log</div>
        {log.length === 0 ? (
          <div className="text-gray-500 text-xs font-mono italic">Interact with a widget to see events…</div>
        ) : (
          log.map((l, i) => <div key={i} className="text-green-300 text-xs font-mono">{l}</div>)
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* click / dblclick / right-click */}
        <WidgetCard title="1. click() / dblclick() / right-click" testId="widget-clicks"
          hint={`await page.getByRole('button', { name: 'Add to Cart' }).click();\nawait page.getByTestId('product-image').dblclick();\nawait page.getByTestId('product-image').click({ button: 'right' });`}>
          <div className="flex flex-wrap gap-2">
            <button data-testid="btn-add-to-cart"
              onClick={() => addLog("click() → Add to Cart clicked")}
              className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700">
              Add to Cart
            </button>
            <button data-testid="btn-dblclick"
              onDoubleClick={() => addLog("dblclick() → Quick Edit triggered")}
              className="border border-gray-300 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
              Double-click to edit
            </button>
            <button data-testid="btn-rightclick"
              onContextMenu={(e) => { e.preventDefault(); addLog("right-click → context menu triggered"); }}
              className="border border-gray-300 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
              Right-click me
            </button>
          </div>
        </WidgetCard>

        {/* hover */}
        <WidgetCard title="2. hover() — Quick-view panel" testId="widget-hover"
          hint={`await page.getByTestId('product-hover-target').hover();\nawait expect(page.getByTestId('quick-view-panel')).toBeVisible();`}>
          <div className="relative inline-block"
            onMouseEnter={() => { setHovered(true); addLog("hover() → Quick View panel revealed"); }}
            onMouseLeave={() => setHovered(false)}>
            <div data-testid="product-hover-target"
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-sm text-gray-500 cursor-pointer hover:border-indigo-400 transition-colors">
              🎧 Hover over this product card
            </div>
            {hovered && (
              <div data-testid="quick-view-panel"
                className="absolute left-0 top-full mt-1 bg-white border border-indigo-200 rounded-lg shadow-lg p-3 z-10 w-full text-sm">
                <div className="font-medium text-indigo-700">Quick View</div>
                <div className="text-gray-600 text-xs mt-1">Wireless Headphones — $79.99</div>
                <button className="mt-2 text-xs bg-indigo-600 text-white px-2 py-1 rounded">Add to Cart</button>
              </div>
            )}
          </div>
        </WidgetCard>

        {/* Modifier keys */}
        <WidgetCard title="3. click({ modifiers }) — Ctrl+click" testId="widget-modifier-click"
          hint={`// Modifier-key clicks\nawait page.getByTestId('product-link').click({ modifiers: ['Control'] });\nawait page.getByTestId('select-item').click({ modifiers: ['Shift'] });`}>
          <div className="space-y-2">
            <button data-testid="product-link"
              onClick={(e) => {
                if (e.ctrlKey || e.metaKey) addLog("Ctrl+click() → opens in new tab (simulated)");
                else addLog("click() → normal navigation");
              }}
              className="text-sm text-indigo-600 underline cursor-pointer block">
              Open Product Detail (try Ctrl+Click)
            </button>
            <p className="text-xs text-gray-400">Hold Ctrl while clicking to simulate <code>modifiers: [&apos;Control&apos;]</code></p>
          </div>
        </WidgetCard>

        {/* keyboard.press */}
        <WidgetCard title="4. keyboard.press() — Shortcuts" testId="widget-keyboard-press"
          hint={`await page.getByTestId('search-input').focus();\nawait page.keyboard.press('Control+K'); // open search\nawait page.keyboard.press('Escape');     // close`}>
          <div className="space-y-2">
            <input data-testid="search-input"
              type="text"
              placeholder="Focus here, then press Ctrl+K"
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                  e.preventDefault();
                  addLog("keyboard.press('Control+K') → Search opened");
                }
                if (e.key === "Escape") addLog("keyboard.press('Escape') → Dismissed");
                if (e.key === "Enter") addLog("keyboard.press('Enter') → Submitted");
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <p className="text-xs text-gray-400">Try: Ctrl+K, Escape, Enter</p>
          </div>
        </WidgetCard>

        {/* pressSequentially */}
        <WidgetCard title="5. pressSequentially() — Realistic typing" testId="widget-press-sequentially"
          hint={`// Simulates real keystroke delays (good for autocomplete)\nawait page.getByLabel('Promo Code').pressSequentially('SAVE10', { delay: 80 });\nawait expect(page.getByLabel('Promo Code')).toHaveValue('SAVE10');`}>
          <div className="space-y-2">
            <label className="text-sm text-gray-600 font-medium block" htmlFor="promo-code">Promo Code</label>
            <div className="flex gap-2">
              <input id="promo-code" ref={promoRef}
                type="text" value={inputVal} onChange={(e) => setInputVal(e.target.value)}
                placeholder="Type a promo code…"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button onClick={() => {
                addLog(`pressSequentially() → typed '${inputVal || "SAVE10"}'`);
              }} className="text-xs bg-green-600 text-white px-3 py-2 rounded-lg">Apply</button>
            </div>
            <p className="text-xs text-gray-400">With <code>pressSequentially</code> each keystroke fires individually (80ms delay)</p>
          </div>
        </WidgetCard>

        {/* scrollIntoViewIfNeeded */}
        <WidgetCard title="6. scrollIntoViewIfNeeded() — Scroll to element" testId="widget-scroll"
          hint={`// Auto-scroll element into viewport\nawait page.getByTestId('related-products').scrollIntoViewIfNeeded();\n// Or use locator directly:\nawait page.getByRole('heading', { name: 'Related Products' }).scrollIntoViewIfNeeded();`}>
          <div className="space-y-2">
            <button onClick={() => {
              relatedRef.current?.scrollIntoView({ behavior: "smooth" });
              setScrolled(true);
              addLog("scrollIntoViewIfNeeded() → scrolled to Related Products");
            }} className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700">
              Scroll to Related Products ↓
            </button>
            <div className="max-h-20 overflow-y-auto border border-gray-200 rounded p-2">
              <div className="h-16 flex items-end">
                <div ref={relatedRef} data-testid="related-products"
                  className={`w-full text-xs text-center py-2 rounded transition-colors ${
                    scrolled ? "bg-green-100 text-green-700 border border-green-300" : "bg-gray-100 text-gray-500"
                  }`}>
                  📦 Related Products Section {scrolled ? "✓ Scrolled into view!" : ""}
                </div>
              </div>
            </div>
          </div>
        </WidgetCard>

        {/* focus / blur */}
        <WidgetCard title="7. focus() and blur() — Field focus" testId="widget-focus-blur"
          hint={`await page.getByTestId('email-field').focus();\nawait expect(page.getByTestId('email-field')).toBeFocused();\nawait page.getByTestId('email-field').blur();\nawait expect(page.getByTestId('focus-hint')).toBeVisible();`}>
          <div className="space-y-2">
            <input data-testid="email-field"
              type="email"
              placeholder="Email address"
              onFocus={() => addLog("focus() → Email field focused")}
              onBlur={() => addLog("blur() → Email field blurred")}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <p className="text-xs text-gray-400" data-testid="focus-hint">↑ Click in and out to trigger focus/blur events</p>
          </div>
        </WidgetCard>

        {/* keyboard.type */}
        <WidgetCard title="8. keyboard.type() — Type text" testId="widget-keyboard-type"
          hint={`// Type text at current cursor position\nawait page.getByTestId('review-input').click();\nawait page.keyboard.type('Great product! Fast delivery.');\nawait expect(page.getByTestId('review-input')).toHaveValue('Great product! Fast delivery.');`}>
          <div className="space-y-2">
            <label className="text-sm text-gray-600 font-medium block" htmlFor="review-input">Write a Review</label>
            <textarea id="review-input" data-testid="review-input"
              placeholder="Your review…"
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              onChange={(e) => { if (e.target.value) addLog(`keyboard.type() → typed ${e.target.value.length} chars`); }}
            />
          </div>
        </WidgetCard>

      </div>
    </div>
  );
}
