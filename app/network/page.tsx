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

type ProductItem = { id: number; name: string; price: number; category: string; inStock: boolean };

export default function NetworkPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [statusText, setStatusText] = useState<string>("Not fetched yet");
  const [hasError, setHasError] = useState(false);
  const [postResult, setPostResult] = useState<string | null>(null);
  const [bankData, setBankData] = useState<Record<string, unknown> | null>(null);
  const [bankError, setBankError] = useState<string | null>(null);
  const [imageVisible, setImageVisible] = useState(false);

  // GET /api/products
  const fetchProducts = async () => {
    setStatusText("Fetching live API...");
    setHasError(false);
    try {
      const res = await fetch("/api/products");
      if (!res.ok) {
        throw new Error(`HTTP Error status: ${res.status}`);
      }
      const json = await res.json();
      setProducts(json.data || []);
      setStatusText(`Fetched ${json.data?.length || 0} products successfully (Source: ${json.source || "unknown"})`);
    } catch (err: unknown) {
      setHasError(true);
      setStatusText(err instanceof Error ? err.message : "Network failure");
      setProducts([]);
    }
  };

  // POST /api/orders
  const placeOrder = async () => {
    setPostResult("Sending order payload...");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item: "Wireless Headphones", quantity: 2, price: 159.98 }),
      });
      const data = await res.json();
      setPostResult(`Order Success! ID: ${data.orderId} - Status: ${data.status}`);
    } catch {
      setPostResult("Order placement failed.");
    }
  };

  // GET /api/transactions with or without auth header
  const fetchTransactions = async (withAuth: boolean) => {
    setBankError(null);
    setBankData(null);
    try {
      const res = await fetch("/api/transactions", {
        headers: withAuth ? { Authorization: "Bearer token_secret_demo_123" } : {},
      });
      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(`HTTP ${res.status}: ${errJson.error || "Forbidden"}`);
      }
      const data = await res.json();
      setBankData(data);
    } catch (err: unknown) {
      setBankError(err instanceof Error ? err.message : "Failed to load bank data");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
        <h2 className="font-bold text-emerald-800 mb-1">🌐 Network Interception & API Mocking</h2>
        <p className="text-sm text-emerald-700">
          Practice <code>page.route()</code>, fulfilling synthetic responses (<code>route.fulfill()</code>), simulating 500/401 errors, modifying request headers, and aborting assets (<code>route.abort()</code>).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Mock GET Response */}
        <WidgetCard title="1. Intercept & Mock GET /api/products" testId="widget-mock-get"
          hint={`// Fulfill custom mocked response\nawait page.route('**/api/products', async (route) => {\n  await route.fulfill({\n    status: 200,\n    contentType: 'application/json',\n    body: JSON.stringify({\n      source: 'mocked-by-playwright',\n      data: [{ id: 99, name: 'Cyberpunk Neon Specs', price: 999, inStock: true }]\n    }),\n  });\n});\nawait page.getByTestId('btn-fetch-products').click();\nawait expect(page.getByText('Cyberpunk Neon Specs')).toBeVisible();`}>
          <div className="space-y-3">
            <button
              onClick={fetchProducts}
              data-testid="btn-fetch-products"
              className="bg-indigo-600 text-white text-xs px-3.5 py-2 rounded-lg hover:bg-indigo-700 font-medium"
            >
              Execute GET /api/products
            </button>
            <div data-testid="fetch-status-banner" className={`text-xs p-2 rounded ${hasError ? "bg-red-50 text-red-600 border border-red-200" : "bg-gray-50 text-gray-700 border"}`}>
              {statusText}
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto" data-testid="product-results-list">
              {products.map((p) => (
                <div key={p.id} className="text-xs p-2 bg-white border rounded flex justify-between items-center" data-testid="product-item">
                  <span className="font-medium text-gray-800">{p.name}</span>
                  <span className="font-semibold text-green-700">${p.price}</span>
                </div>
              ))}
            </div>
          </div>
        </WidgetCard>

        {/* Simulate 500 Server Error */}
        <WidgetCard title="2. Simulate 500 / Network Failures" testId="widget-mock-500"
          hint={`// Mock 500 Internal Server Error\nawait page.route('**/api/products', route => {\n  route.fulfill({ status: 500, body: JSON.stringify({ error: 'Server crashed' }) });\n});\nawait page.getByTestId('btn-fetch-products').click();\nawait expect(page.getByTestId('fetch-status-banner')).toContainText('500');`}>
          <div className="space-y-2">
            <p className="text-xs text-gray-600">
              Trigger <code>fetchProducts()</code> while setting up a Playwright route that returns status 500 or aborts connection to assert robust UI error boundaries.
            </p>
            <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded">
              💡 Playwright: <code>await route.abort(&apos;failed&apos;);</code>
            </div>
          </div>
        </WidgetCard>

        {/* waitForResponse on POST */}
        <WidgetCard title="3. Assert POST /api/orders & waitForResponse()" testId="widget-wait-for-response"
          hint={`// Wait for API response promise\nconst responsePromise = page.waitForResponse(response =>\n  response.url().includes('/api/orders') && response.status() === 200\n);\nawait page.getByTestId('btn-place-order-api').click();\nconst response = await responsePromise;\nconst responseJson = await response.json();\nexpect(responseJson.success).toBe(true);`}>
          <div className="space-y-3">
            <button
              onClick={placeOrder}
              data-testid="btn-place-order-api"
              className="bg-emerald-600 text-white text-xs px-3.5 py-2 rounded-lg hover:bg-emerald-700 font-medium"
            >
              Trigger POST /api/orders
            </button>
            {postResult && (
              <div data-testid="post-order-result" className="text-xs p-2.5 bg-gray-900 text-emerald-400 font-mono rounded">
                {postResult}
              </div>
            )}
          </div>
        </WidgetCard>

        {/* Header Modification / 401 Auth */}
        <WidgetCard title="4. Headers Modification (401 vs 200)" testId="widget-headers-auth"
          hint={`// Inject auth token or continue with extra headers\nawait page.route('**/api/transactions', async (route) => {\n  const headers = route.request().headers();\n  headers['Authorization'] = 'Bearer injected_token_456';\n  await route.continue({ headers });\n});\nawait page.getByTestId('btn-fetch-tx-noauth').click();\nawait expect(page.getByTestId('bank-balance')).toBeVisible();`}>
          <div className="space-y-2">
            <div className="flex gap-2">
              <button
                onClick={() => fetchTransactions(false)}
                data-testid="btn-fetch-tx-noauth"
                className="text-xs bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 px-2.5 py-1.5 rounded"
              >
                Send without Auth (Expect 401)
              </button>
              <button
                onClick={() => fetchTransactions(true)}
                data-testid="btn-fetch-tx-auth"
                className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-2.5 py-1.5 rounded"
              >
                Send with Bearer Header
              </button>
            </div>
            {bankError && (
              <div data-testid="bank-error-box" className="text-xs p-2 bg-red-50 text-red-600 rounded border border-red-200">
                ⚠️ {bankError}
              </div>
            )}
            {bankData && (
              <pre data-testid="bank-balance" className="text-[11px] p-2 bg-gray-900 text-green-300 font-mono rounded overflow-x-auto">
                {JSON.stringify(bankData, null, 2)}
              </pre>
            )}
          </div>
        </WidgetCard>

        {/* Abort Resource (Images / Ad Trackers) */}
        <WidgetCard title="5. Aborting Heavy Assets (Images / route.abort)" testId="widget-abort-assets"
          hint={`// Block images to speed up page load & assert alt text\nawait page.route('**/*.{png,jpg,jpeg,svg}', route => route.abort());\nawait page.getByTestId('btn-load-promo-image').click();\nawait expect(page.getByTestId('promo-img')).toBeVisible();`}>
          <div className="space-y-3">
            <button
              onClick={() => setImageVisible(true)}
              data-testid="btn-load-promo-image"
              className="text-xs bg-gray-800 text-white px-3 py-1.5 rounded hover:bg-gray-900"
            >
              Load Heavy Promo Image
            </button>
            {imageVisible && (
              <div className="p-2 border rounded-lg bg-gray-50 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://placehold.co/400x120.png?text=Special+Promotion+Banner"
                  alt="Special Promotion Banner"
                  data-testid="promo-img"
                  className="rounded max-h-24"
                />
              </div>
            )}
          </div>
        </WidgetCard>

        {/* HAR Recording & Replay */}
        <WidgetCard title="6. HAR Replay Simulation" testId="widget-har-record"
          hint={`// Replay network traffic directly from recorded HAR\nawait page.routeFromHAR('tests/fixtures/network-dump.har', {\n  url: '**/api/**',\n  update: false,\n});`}>
          <div className="space-y-2 text-xs text-gray-600">
            <p>
              Playwright supports record-and-replay using HTTP Archive (HAR) files without needing a live backend running.
            </p>
            <div className="font-mono bg-gray-100 p-2 rounded text-[11px]">
              npx playwright open --save-har=network.har http://localhost:3000/network
            </div>
          </div>
        </WidgetCard>
      </div>
    </div>
  );
}
