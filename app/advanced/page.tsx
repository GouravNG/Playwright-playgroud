"use client";
import { useState, useEffect } from "react";

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

export default function AdvancedBankingPage() {
  const [authSession, setAuthSession] = useState<{ user: string; role: string } | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [liveRate, setLiveRate] = useState(1.0825);
  const [copied, setCopied] = useState(false);
  const [geoCoords, setGeoCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [draggedList, setDraggedList] = useState(["Checking Account (...4012)", "High-Yield Savings (...9921)", "Investment Portfolio"]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Restore session from localStorage if present (for storageState simulation)
  useEffect(() => {
    const saved = localStorage.getItem("bank_session");
    if (saved) {
      try {
        setAuthSession(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  // Live stock/rate ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveRate((prev) => +(prev + (Math.random() * 0.002 - 0.001)).toFixed(4));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      const sess = { user: username, role: "Premier Client" };
      setAuthSession(sess);
      localStorage.setItem("bank_session", JSON.stringify(sess));
      console.log(`[BankAuth] User ${username} authenticated successfully.`);
    }
  };

  const handleLogout = () => {
    setAuthSession(null);
    localStorage.removeItem("bank_session");
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setGeoCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.error("Geolocation error:", err)
      );
    }
  };

  const handleCopyIBAN = () => {
    navigator.clipboard.writeText("US98BANK00012345678901");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🏦</span>
              <h2 className="font-bold text-lg text-emerald-400">Apex Global Bank — Automation Lab</h2>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Advanced Playwright architectural patterns: <strong>Authentication State reuse</strong>, <strong>Page Object Model (POM)</strong>, <strong>Fixtures</strong>, <strong>Device Emulation</strong>, <strong>Clipboard permissions</strong>, and <strong>Geolocation</strong>.
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-mono block">EUR/USD Exchange Feed</span>
            <span data-testid="live-rate-ticker" className="font-mono text-emerald-400 font-bold text-sm">
              {liveRate.toFixed(4)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Auth State & Session Reuse */}
        <WidgetCard title="1. Authentication State Reuse (storageState)" testId="widget-auth-state"
          hint={`// 1. Authenticate once in setup project and save state:\nawait page.context().storageState({ path: 'playwright/.auth/user.json' });\n\n// 2. Reuse state across all tests without repeating login flow:\n// in playwright.config.ts:\nuse: { storageState: 'playwright/.auth/user.json' }`}>
          <div className="space-y-3">
            {authSession ? (
              <div data-testid="bank-auth-logged-in" className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold">Authenticated: {authSession.user}</span>
                  <span className="text-[10px] bg-emerald-200 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-full">{authSession.role}</span>
                </div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400">Session saved to localStorage (mimics storageState session cookie/storage token).</p>
                <button
                  onClick={handleLogout}
                  data-testid="btn-bank-logout"
                  className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Logout
                </button>
              </div>
            ) : (
              <form onSubmit={handleLogin} data-testid="bank-login-form" className="space-y-2.5">
                <div>
                  <label htmlFor="bank-username" className="text-xs text-gray-600 dark:text-slate-400 font-medium block">Username / Account ID</label>
                  <input
                    id="bank-username"
                    type="text"
                    data-testid="input-bank-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="client_john"
                    className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 rounded px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="bank-password" className="text-xs text-gray-600 dark:text-slate-400 font-medium block">PIN / Password</label>
                  <input
                    id="bank-password"
                    type="password"
                    data-testid="input-bank-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 rounded px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  data-testid="btn-bank-login"
                  className="bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white text-xs px-3.5 py-1.5 rounded font-medium"
                >
                  Sign In to Banking Portal
                </button>
              </form>
            )}
          </div>
        </WidgetCard>

        {/* Page Object Model (POM) Blueprint */}
        <WidgetCard title="2. Page Object Model (POM) Structure" testId="widget-pom-demo"
          hint={`// BankPortalPage.ts\nexport class BankPortalPage {\n  constructor(private page: Page) {}\n  readonly usernameInput = this.page.getByTestId('input-bank-username');\n  readonly passwordInput = this.page.getByTestId('input-bank-password');\n  readonly loginButton = this.page.getByTestId('btn-bank-login');\n\n  async login(user: string, pass: string) {\n    await this.usernameInput.fill(user);\n    await this.passwordInput.fill(pass);\n    await this.loginButton.click();\n  }\n}`}>
          <div className="space-y-2 text-xs text-gray-600 dark:text-slate-400">
            <p>
              Structured Page Objects group page locators and operational workflows into clean reusable classes.
            </p>
            <div className="bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-2.5 rounded font-mono text-[11px] text-gray-800 dark:text-slate-200">
              const bank = new BankPortalPage(page);
              <br />
              await bank.login(&apos;john&apos;, &apos;secret&apos;);
            </div>
          </div>
        </WidgetCard>

        {/* Clipboard Permissions & Copy Action */}
        <WidgetCard title="3. Clipboard API & Browser Permissions" testId="widget-clipboard-action"
          hint={`// Grant clipboard read permission in browser context\nawait context.grantPermissions(['clipboard-read', 'clipboard-write']);\nawait page.getByTestId('btn-copy-iban').click();\nconst text = await page.evaluate(() => navigator.clipboard.readText());\nexpect(text).toBe('US98BANK00012345678901');`}>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg">
              <div>
                <span className="text-[10px] text-gray-400 dark:text-slate-500 block font-mono">IBAN / Wire Account Number</span>
                <span data-testid="text-iban-val" className="font-mono text-xs font-bold text-gray-800 dark:text-slate-100">
                  US98BANK00012345678901
                </span>
              </div>
              <button
                onClick={handleCopyIBAN}
                data-testid="btn-copy-iban"
                className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded transition-colors"
              >
                {copied ? "Copied! ✓" : "Copy IBAN"}
              </button>
            </div>
          </div>
        </WidgetCard>

        {/* Geolocation Mocking */}
        <WidgetCard title="4. Geolocation Override & Branch Locator" testId="widget-geolocation-mock"
          hint={`// Override coordinates & permissions\nawait context.setGeolocation({ latitude: 40.7128, longitude: -74.0060 });\nawait context.grantPermissions(['geolocation']);\nawait page.getByTestId('btn-find-branch').click();\nawait expect(page.getByTestId('geo-display')).toContainText('40.7128');`}>
          <div className="space-y-3">
            <button
              onClick={handleGetLocation}
              data-testid="btn-find-branch"
              className="text-xs bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white px-3 py-1.5 rounded font-medium"
            >
              Locate Nearest Apex Branch (Geolocation)
            </button>
            {geoCoords && (
              <div data-testid="geo-display" className="text-xs p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded border border-emerald-200 dark:border-emerald-800 font-mono">
                Lat: {geoCoords.lat.toFixed(4)}, Lng: {geoCoords.lng.toFixed(4)} (Branch: Financial District Hub)
              </div>
            )}
          </div>
        </WidgetCard>

        {/* Drag and Drop */}
        <WidgetCard title="5. Drag and Drop Account Watchlist" testId="widget-drag-drop"
          hint={`// Native dragTo helper\nawait page.locator('[data-testid=\"drag-item-0\"]').dragTo(page.locator('[data-testid=\"drag-item-2\"]'));`}>
          <div className="space-y-2">
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Drag items to rearrange preferred dashboard priority:</p>
            <div className="space-y-1.5">
              {draggedList.map((item, idx) => (
                <div
                  key={item}
                  data-testid={`drag-item-${idx}`}
                  draggable
                  onDragStart={() => setDraggedIndex(idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggedIndex !== null && draggedIndex !== idx) {
                      const updated = [...draggedList];
                      const [removed] = updated.splice(draggedIndex, 1);
                      updated.splice(idx, 0, removed);
                      setDraggedList(updated);
                      setDraggedIndex(null);
                    }
                  }}
                  className="p-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded text-xs text-gray-700 dark:text-slate-200 flex items-center justify-between cursor-move hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40"
                >
                  <span>☰ {item}</span>
                  <span className="text-[10px] text-gray-400 dark:text-slate-500 font-mono">Rank #{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </WidgetCard>

        {/* Mobile Device Emulation */}
        <WidgetCard title="6. Mobile Device Emulation" testId="widget-mobile-emulation"
          hint={`// Emulate mobile viewport & user agent in tests:\nimport { devices } from '@playwright/test';\ntest.use({ ...devices['iPhone 14 Pro'] });`}>
          <div className="space-y-2 text-xs text-gray-600 dark:text-slate-400">
            <p>
              Test responsive banking UI layouts automatically configured for iPhone, Pixel, or iPad devices with touch event emulation:
            </p>
            <div className="bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-2.5 rounded font-mono text-[11px] text-gray-800 dark:text-slate-200">
              npx playwright test --project=Mobile-Chrome
            </div>
          </div>
        </WidgetCard>
      </div>
    </div>
  );
}
