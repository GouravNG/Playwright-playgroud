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

export default function MasteryPage() {
  const [cookieConsent, setCookieConsent] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [currencyDisplay, setCurrencyDisplay] = useState("$1,250.50");
  const [dateFormatDisplay, setDateFormatDisplay] = useState("11/15/2026");

  useEffect(() => {
    // Check initial cookie
    if (typeof document !== "undefined") {
      setCookieConsent(document.cookie.includes("gdpr_consent=true"));
      const tokenMatch = document.cookie.match(/session_token=([^;]+)/);
      if (tokenMatch) setSessionToken(tokenMatch[1]);
    }

    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Formatted currency & date based on browser locale
    try {
      const num = 1250.5;
      setCurrencyDisplay(new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(num));
      setDateFormatDisplay(new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date("2026-11-15T12:00:00Z")));
    } catch {
      // fallback
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const triggerConsoleLog = () => {
    console.log("[Playwright Lab] Standard informational log message emitted.");
  };

  const triggerConsoleWarn = () => {
    console.warn("[Playwright Lab] Warning: Deprecated payment algorithm requested.");
  };

  const triggerUncaughtError = () => {
    setTimeout(() => {
      throw new Error("CRITICAL_SIMULATED_EXCEPTION: Uncaught payment pipeline crash!");
    }, 50);
  };

  const setManualCookie = () => {
    document.cookie = "gdpr_consent=true; path=/; max-age=3600";
    setCookieConsent(true);
  };

  const clearManualCookie = () => {
    document.cookie = "gdpr_consent=; path=/; max-age=0";
    setCookieConsent(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-violet-900 to-indigo-900 text-white rounded-xl p-5 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎓</span>
          <div>
            <h2 className="font-bold text-lg text-emerald-400">Playwright Mastery & Edge Cases Lab</h2>
            <p className="text-xs text-indigo-200 mt-0.5">
              Advanced runtime observability: <code>page.on(&apos;console&apos;)</code>, <code>page.on(&apos;pageerror&apos;)</code>, Cookie manipulation, Offline simulation (<code>context.setOffline</code>), and Locale/Timezone emulation.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Console Observation */}
        <WidgetCard title="1. Console Events (page.on('console'))" testId="widget-console-events"
          hint={`// Catch all browser console messages\nconst messages: string[] = [];\npage.on('console', msg => messages.push(\`[\${msg.type()}] \${msg.text()}\`));\n\nawait page.getByTestId('btn-emit-log').click();\nawait page.getByTestId('btn-emit-warn').click();\n\nexpect(messages).toContain('[log] [Playwright Lab] Standard informational log message emitted.');\nexpect(messages).toContain('[warning] [Playwright Lab] Warning: Deprecated payment algorithm requested.');`}>
          <div className="space-y-3">
            <p className="text-xs text-gray-600">
              Trigger browser console messages to test your Playwright log listeners and warning detectors:
            </p>
            <div className="flex gap-2">
              <button
                onClick={triggerConsoleLog}
                data-testid="btn-emit-log"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1.5 rounded"
              >
                Emit console.log
              </button>
              <button
                onClick={triggerConsoleWarn}
                data-testid="btn-emit-warn"
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-3 py-1.5 rounded"
              >
                Emit console.warn
              </button>
            </div>
            <p className="text-[11px] text-gray-400">Inspect messages via <code>page.on(&apos;console&apos;, msg =&gt; ...)</code>.</p>
          </div>
        </WidgetCard>

        {/* Uncaught Page Errors */}
        <WidgetCard title="2. Uncaught JS Exceptions (page.on('pageerror'))" testId="widget-pageerror-events"
          hint={`// Listen for unhandled errors\nconst errorPromise = page.waitForEvent('pageerror');\nawait page.getByTestId('btn-throw-error').click();\nconst error = await errorPromise;\nexpect(error.message).toContain('CRITICAL_SIMULATED_EXCEPTION');`}>
          <div className="space-y-3">
            <p className="text-xs text-gray-600">
              Verify your test framework catches unhandled exceptions thrown anywhere in browser scripts:
            </p>
            <button
              onClick={triggerUncaughtError}
              data-testid="btn-throw-error"
              className="bg-red-600 hover:bg-red-700 text-white text-xs px-3.5 py-1.5 rounded font-medium"
            >
              Throw Uncaught window.error
            </button>
            <p className="text-[11px] text-gray-400">
              Playwright allows asserting that no uncaught errors happened during an entire user session.
            </p>
          </div>
        </WidgetCard>

        {/* Cookie & Storage Management */}
        <WidgetCard title="3. Cookie & GDPR Consent (context.cookies / addCookies)" testId="widget-cookie-management"
          hint={`// Set cookie before navigation to bypass banners\nawait context.addCookies([{\n  name: 'gdpr_consent',\n  value: 'true',\n  domain: 'localhost',\n  path: '/',\n}]);\nawait page.reload();\nawait expect(page.getByTestId('cookie-banner')).toBeHidden();\n\n// Read all active cookies\nconst cookies = await context.cookies();`}>
          <div className="space-y-3">
            {!cookieConsent ? (
              <div data-testid="cookie-banner" className="p-3 bg-amber-50 border border-amber-300 rounded-lg space-y-2">
                <span className="text-xs font-semibold text-amber-800">🍪 Cookie & GDPR Consent Required</span>
                <p className="text-[11px] text-amber-700">We use cookies to personalize banking sessions.</p>
                <button
                  onClick={setManualCookie}
                  data-testid="btn-accept-cookies"
                  className="bg-amber-600 hover:bg-amber-700 text-white text-[11px] px-3 py-1 rounded"
                >
                  Accept All Cookies
                </button>
              </div>
            ) : (
              <div data-testid="cookie-status-accepted" className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg flex justify-between items-center">
                <span className="text-xs font-medium text-emerald-700">✓ GDPR Cookie Set (Banner Bypassed)</span>
                <button
                  onClick={clearManualCookie}
                  data-testid="btn-clear-cookies"
                  className="text-xs text-red-600 hover:underline"
                >
                  Reset Cookie
                </button>
              </div>
            )}
            {sessionToken && (
              <div className="text-[11px] font-mono text-gray-500 bg-gray-50 p-1.5 rounded">
                session_token: {sessionToken}
              </div>
            )}
          </div>
        </WidgetCard>

        {/* Offline Mode & Network Throttling */}
        <WidgetCard title="4. Offline Simulation (context.setOffline)" testId="widget-offline-simulation"
          hint={`// Disconnect network\nawait context.setOffline(true);\nawait expect(page.getByTestId('network-status-indicator')).toHaveText('Offline');\n\n// Reconnect network\nawait context.setOffline(false);\nawait expect(page.getByTestId('network-status-indicator')).toHaveText('Online');`}>
          <div className="space-y-3">
            <p className="text-xs text-gray-600">
              Test progressive web apps or offline UI banners when connection is severed:
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-700">Connection State:</span>
              <span
                data-testid="network-status-indicator"
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  isOnline ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700 animate-pulse"
                }`}
              >
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
            {!isOnline && (
              <div data-testid="offline-alert" className="p-2 bg-red-50 text-red-600 text-xs rounded border border-red-200">
                ⚠️ Connection lost. Cached data is being served.
              </div>
            )}
          </div>
        </WidgetCard>

        {/* Locale & Currency Format */}
        <WidgetCard title="5. Locale & Timezone Emulation" testId="widget-locale-emulation"
          hint={`// In playwright.config.ts or test context:\ntest.use({\n  locale: 'de-DE',\n  timezoneId: 'Europe/Berlin',\n});\n// Format changes automatically to: '1.250,50 $' or German date conventions`}>
          <div className="space-y-2">
            <p className="text-xs text-gray-600">
              Internationalization formatting rendered according to browser context locale:
            </p>
            <div className="p-3 bg-gray-50 rounded-lg border text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-500">Local Currency Format:</span>
                <span data-testid="text-locale-currency" className="font-mono font-bold text-gray-800">
                  {currencyDisplay}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Local Date Format:</span>
                <span data-testid="text-locale-date" className="font-mono font-bold text-gray-800">
                  {dateFormatDisplay}
                </span>
              </div>
            </div>
          </div>
        </WidgetCard>

        {/* Custom Fixtures Architecture */}
        <WidgetCard title="6. Custom Fixtures Architecture" testId="widget-custom-fixtures"
          hint={`// test.extend allows creating reusable dependencies:\nimport { test as base } from '@playwright/test';\n\ntype MyFixtures = { authenticatedPage: Page };\nexport const test = base.extend<MyFixtures>({\n  authenticatedPage: async ({ page }, use) => {\n    await page.goto('/advanced');\n    await page.getByTestId('input-bank-username').fill('admin');\n    await page.getByTestId('input-bank-password').fill('pass');\n    await page.getByTestId('btn-bank-login').click();\n    await use(page); // Provide to test\n    // Teardown code runs here\n  },\n});`}>
          <div className="space-y-2 text-xs text-gray-600">
            <p>
              Custom fixtures wrap setup, data seeding, and teardown cleanly so individual tests stay minimal and focused.
            </p>
            <div className="p-2 bg-gray-100 rounded text-gray-700 font-mono text-[11px]">
              test(&apos;my test&apos;, async ({`{ authenticatedPage }`}) =&gt; {`{ ... }`});
            </div>
          </div>
        </WidgetCard>
      </div>
    </div>
  );
}
