"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function NavigationPage() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleDelayedRedirect = () => {
    setIsRedirecting(true);
    setTimeout(() => {
      router.push("/navigation/checkout");
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
        <h2 className="font-bold text-sky-800 mb-1">🔀 Navigation & Routing</h2>
        <p className="text-sm text-sky-700">
          Practice browser navigation methods: <code>page.goto()</code>, <code>page.goBack()</code>, <code>page.goForward()</code>, <code>page.reload()</code>, <code>page.waitForURL()</code>, URL hash anchors, and new window handling.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Multi-page store navigation */}
        <WidgetCard title="1. Link Navigation & URL Assertion" testId="widget-link-nav"
          hint={`// Click navigation link and assert URL change\nawait page.getByTestId('link-view-products').click();\nawait expect(page).toHaveURL(/.*\\/navigation\\/products/);\nawait expect(page.getByRole('heading', { name: 'Store Products' })).toBeVisible();`}>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Navigate to our store sub-catalogue:</p>
            <Link
              href="/navigation/products"
              data-testid="link-view-products"
              className="inline-block bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium"
            >
              Browse Products Catalogue →
            </Link>
          </div>
        </WidgetCard>

        {/* Back / Forward / Reload */}
        <WidgetCard title="2. History & Reload (goBack, goForward, reload)" testId="widget-browser-history"
          hint={`// History manipulation\nawait page.goto('/navigation/products');\nawait page.goBack();\nawait expect(page).toHaveURL(/.*\\/navigation/);\nawait page.goForward();\nawait expect(page).toHaveURL(/.*\\/navigation\\/products/);\nawait page.reload();`}>
          <div className="space-y-2">
            <div className="flex gap-2">
              <button
                onClick={() => router.back()}
                data-testid="btn-history-back"
                className="text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 px-3 py-1.5 rounded-lg text-gray-700"
              >
                ← Browser Back
              </button>
              <button
                onClick={() => router.forward()}
                data-testid="btn-history-forward"
                className="text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 px-3 py-1.5 rounded-lg text-gray-700"
              >
                Browser Forward →
              </button>
              <button
                onClick={() => window.location.reload()}
                data-testid="btn-history-reload"
                className="text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 px-3 py-1.5 rounded-lg text-gray-700"
              >
                🔄 Reload Page
              </button>
            </div>
            <p className="text-xs text-gray-400">Can be triggered via buttons or native Playwright page APIs.</p>
          </div>
        </WidgetCard>

        {/* Async Redirect / waitForURL */}
        <WidgetCard title="3. Delayed Redirect & waitForURL()" testId="widget-redirect"
          hint={`// Wait for async client-side redirect\nawait page.getByTestId('btn-start-checkout-redirect').click();\nawait page.waitForURL('**/navigation/checkout', { timeout: 5000 });\nawait expect(page.getByTestId('checkout-header')).toBeVisible();`}>
          <div className="space-y-3">
            <button
              onClick={handleDelayedRedirect}
              disabled={isRedirecting}
              data-testid="btn-start-checkout-redirect"
              className="bg-emerald-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 font-medium"
            >
              {isRedirecting ? "Redirecting in 2s..." : "Proceed to Checkout (Delayed) 🛒"}
            </button>
            {isRedirecting && (
              <p data-testid="redirect-indicator" className="text-xs text-emerald-600 font-medium animate-pulse">
                ⏳ Processing payment token and redirecting...
              </p>
            )}
          </div>
        </WidgetCard>

        {/* Hash / Anchor Navigation */}
        <WidgetCard title="4. Anchor / Hash Links (#faq, #specs)" testId="widget-hash-links"
          hint={`// Anchor jump & hash assertion\nawait page.getByTestId('link-hash-faq').click();\nawait expect(page).toHaveURL(/.*#faq/);\nawait expect(page.locator('#faq')).toBeInViewport();`}>
          <div className="space-y-2">
            <div className="flex gap-2">
              <a
                href="#specs"
                data-testid="link-hash-specs"
                className="text-xs text-indigo-600 hover:underline border border-indigo-200 bg-indigo-50 px-2.5 py-1 rounded"
              >
                Jump to #specs
              </a>
              <a
                href="#faq"
                data-testid="link-hash-faq"
                className="text-xs text-indigo-600 hover:underline border border-indigo-200 bg-indigo-50 px-2.5 py-1 rounded"
              >
                Jump to #faq
              </a>
            </div>
            <div className="h-28 overflow-y-auto border border-gray-200 rounded p-2 text-xs space-y-4">
              <div id="specs" className="p-2 bg-gray-50 rounded">
                <strong>#specs:</strong> 64GB RAM, Quad-Core Processor, 10Gbps Network interface.
              </div>
              <div id="faq" className="p-2 bg-gray-50 rounded">
                <strong>#faq:</strong> Q: Does it support Playwright? A: Yes, 100% test coverage ready!
              </div>
            </div>
          </div>
        </WidgetCard>

        {/* 404 Error Page Handling */}
        <WidgetCard title="5. 404 Route Detection" testId="widget-404-handling"
          hint={`// Testing 404 status and custom error layout\nconst response = await page.goto('/invalid-non-existent-product-page');\nexpect(response?.status()).toBe(404);\nawait expect(page.getByText('Page Not Found')).toBeVisible();`}>
          <div className="space-y-2">
            <Link
              href="/non-existent-page-xyz"
              data-testid="link-trigger-404"
              className="text-xs text-red-600 underline font-medium"
            >
              Visit Broken Route (/non-existent-page-xyz)
            </Link>
            <p className="text-xs text-gray-500">Test how your automation script asserts 404 HTTP status or 404 UI fallbacks.</p>
          </div>
        </WidgetCard>

        {/* Target Blank New Window */}
        <WidgetCard title="6. Target _blank & waitForEvent('page')" testId="widget-target-blank"
          hint={`// Catching newly spawned browser tab/window\nconst pagePromise = context.waitForEvent('page');\nawait page.getByTestId('link-new-window').click();\nconst newPage = await pagePromise;\nawait newPage.waitForLoadState();\nawait expect(newPage).toHaveURL(/.*terms/);`}>
          <div className="space-y-2">
            <a
              href="/terms"
              target="_blank"
              rel="noreferrer"
              data-testid="link-new-window"
              className="inline-block text-xs bg-gray-800 text-white px-3 py-2 rounded hover:bg-gray-900"
            >
              Open Terms & Privacy in New Tab ↗
            </a>
            <p className="text-xs text-gray-400">Use <code>context.waitForEvent(&apos;page&apos;)</code> to switch automation context.</p>
          </div>
        </WidgetCard>
      </div>
    </div>
  );
}
