"use client";
import { useState, useRef, useEffect } from "react";
import { WidgetCard } from "@/components/common/WidgetCard";

// Cascading data for Widget 2
const carData: Record<string, { states: Record<string, string[]> }> = {
  USA: {
    states: {
      California: ["San Francisco Hub", "Los Angeles Center", "San Diego Bay"],
      Texas: ["Austin Gigafactory", "Dallas Delivery Hub", "Houston Port"],
      Washington: ["Seattle Tech Hub", "Bellevue Gallery"],
    },
  },
  Germany: {
    states: {
      Bavaria: ["Munich Headquarters", "Nuremberg Depot"],
      Berlin: ["Berlin City Center", "Brandenburg Hub"],
      Baden: ["Stuttgart Tech Port", "Karlsruhe Center"],
    },
  },
  Japan: {
    states: {
      Kanto: ["Tokyo Flagship", "Yokohama Terminal"],
      Kansai: ["Osaka Hub", "Kyoto Center"],
    },
  },
};

export default function ChallengesPage() {
  // 1. Canvas Signature Pad State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeColor, setStrokeColor] = useState("#4f46e5");
  const [signatureSubmitted, setSignatureSubmitted] = useState(false);

  // 2. Cascading Dropdowns State
  const [country, setCountry] = useState("");
  const [regionState, setRegionState] = useState("");
  const [dealership, setDealership] = useState("");
  const [orderFinalized, setOrderFinalized] = useState(false);

  // 3. Infinite Scroll Feed State
  const [feedItems, setFeedItems] = useState([
    { id: 1, title: "Order #1001", status: "Delivered", amount: "$89.50" },
    { id: 2, title: "Order #1002", status: "Processing", amount: "$142.00" },
    { id: 3, title: "Order #1003", status: "Shipped", amount: "$35.20" },
  ]);
  const [loadingFeed, setLoadingFeed] = useState(false);

  // 4. OTP 6-Box State
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [otpVerified, setOtpVerified] = useState(false);

  // 5. Multi-Tab Broadcaster State
  const [paymentSynced, setPaymentSynced] = useState(false);

  // 6. Flaky / Transient Element State
  const [transientVisible, setTransientVisible] = useState(false);
  const [staleKey, setStaleKey] = useState(0);
  const [debounceClicks, setDebounceClicks] = useState(0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 7. WYSIWYG Editor State
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [editorWordCount, setEditorWordCount] = useState(0);
  const [savedNote, setSavedNote] = useState<string | null>(null);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = 2.5;
      }
    }
  }, []);

  // Listen for multi-tab BroadcastChannel
  useEffect(() => {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const channel = new BroadcastChannel("payment_sync_channel");
      channel.onmessage = (event) => {
        if (event.data?.status === "SUCCESS") {
          setPaymentSynced(true);
        }
      };
      return () => channel.close();
    }
  }, []);

  // --- Canvas Drawing Handlers ---
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle = strokeColor;
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureSubmitted(false);
  };

  // --- Infinite Scroll Appender ---
  const loadMoreItems = () => {
    setLoadingFeed(true);
    setTimeout(() => {
      setFeedItems((prev) => [
        ...prev,
        { id: prev.length + 1, title: `Order #${1000 + prev.length + 1}`, status: "Shipped", amount: "$99.00" },
        { id: prev.length + 2, title: `Order #${1000 + prev.length + 2}`, status: "Processing", amount: "$210.40" },
      ]);
      setLoadingFeed(false);
    }, 600);
  };

  // --- OTP Handlers ---
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Paste full code
      const chars = value.slice(0, 6).split("");
      const newOtp = [...otp];
      chars.forEach((c, i) => {
        newOtp[i] = c;
      });
      setOtp(newOtp);
      otpInputsRef.current[Math.min(5, chars.length - 1)]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // --- Flaky Simulator Handlers ---
  const triggerTransientButton = () => {
    setTransientVisible(true);
    setTimeout(() => setTransientVisible(false), 2000);
  };

  const handleDebouncedClick = () => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      setDebounceClicks((c) => c + 1);
    }, 450);
  };

  // --- WYSIWYG Format ---
  const formatText = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const updateWordCount = () => {
    const text = editorRef.current?.innerText || "";
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setEditorWordCount(words);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-xl p-5 shadow-lg border border-purple-800/40">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎯</span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-lg text-purple-300">Advanced Automation Challenges Arena</h2>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-400/30 px-2 py-0.5 rounded-full font-mono uppercase">
                Enterprise & Real-World UI Patterns
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Master the trickiest UI automation edge cases: HTML5 Canvas vectors, cascading comboboxes, infinite scroll, 6-box auto-focus OTP, inter-tab communication, flaky transient DOM elements, and rich text editors.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Challenge 1: HTML5 Canvas Signature Pad */}
        <WidgetCard
          title="1. HTML5 Canvas Signature Pad (Mouse Vectoring)"
          testId="widget-canvas-signature"
          docUrl="https://playwright.dev/docs/input#mouse-click"
          docTitle="Playwright Mouse Vector API"
          hint={`// Draw a custom stroke on the Canvas using bounding box coordinates
const canvas = page.getByTestId('signature-canvas');
const box = await canvas.boundingBox();
if (box) {
  await page.mouse.move(box.x + 40, box.y + 40);
  await page.mouse.down();
  await page.mouse.move(box.x + 120, box.y + 60, { steps: 5 });
  await page.mouse.move(box.x + 180, box.y + 40, { steps: 5 });
  await page.mouse.up();
}
await page.getByTestId('btn-save-signature').click();
await expect(page.getByTestId('signature-saved-status')).toBeVisible();`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-slate-400">Sign with mouse/pen vector coordinates:</span>
              <div className="flex items-center gap-1.5">
                {["#4f46e5", "#059669", "#dc2626"].map((color) => (
                  <button
                    key={color}
                    onClick={() => setStrokeColor(color)}
                    style={{ backgroundColor: color }}
                    className={`w-4 h-4 rounded-full border ${strokeColor === color ? "ring-2 ring-indigo-400" : "opacity-70"}`}
                  />
                ))}
              </div>
            </div>

            <canvas
              ref={canvasRef}
              data-testid="signature-canvas"
              width={420}
              height={140}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg cursor-crosshair touch-none shadow-inner"
            />

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSignatureSubmitted(true)}
                data-testid="btn-save-signature"
                className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3.5 py-1.5 rounded-lg transition-colors"
              >
                Save Signature
              </button>
              <button
                onClick={clearCanvas}
                data-testid="btn-clear-signature"
                className="text-xs border border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 px-3 py-1.5 rounded-lg transition-colors"
              >
                Clear
              </button>
              {signatureSubmitted && (
                <span data-testid="signature-saved-status" className="text-xs text-emerald-600 dark:text-emerald-400 font-medium ml-auto">
                  ✓ Signature Encrypted & Stored
                </span>
              )}
            </div>
          </div>
        </WidgetCard>

        {/* Challenge 2: Cascading Dependent Comboboxes */}
        <WidgetCard
          title="2. Cascading Dependent Dropdowns (Auto-Population)"
          testId="widget-cascading-selects"
          docUrl="https://playwright.dev/docs/input#select-options"
          docTitle="Playwright selectOption Docs"
          hint={`// Step 1: Select Country
await page.getByTestId('select-country').selectOption('Germany');

// Step 2: Assert State enabled & populated
const stateSelect = page.getByTestId('select-state');
await expect(stateSelect).toBeEnabled();
await stateSelect.selectOption('Bavaria');

// Step 3: Select final dealership hub
await page.getByTestId('select-hub').selectOption('Munich Headquarters');
await page.getByTestId('btn-confirm-delivery-hub').click();
await expect(page.getByTestId('hub-confirmation-alert')).toContainText('Munich Headquarters');`}
        >
          <div className="space-y-3">
            <p className="text-xs text-gray-600 dark:text-slate-400">
              Each selection dynamically drives and enables the subsequent dropdown options:
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              {/* Country */}
              <div>
                <label className="text-[11px] text-gray-500 dark:text-slate-400 block mb-1">Country</label>
                <select
                  data-testid="select-country"
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    setRegionState("");
                    setDealership("");
                    setOrderFinalized(false);
                  }}
                  className="w-full text-xs border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 rounded px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="">Select Country...</option>
                  {Object.keys(carData).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* State */}
              <div>
                <label className="text-[11px] text-gray-500 dark:text-slate-400 block mb-1">State / Province</label>
                <select
                  data-testid="select-state"
                  disabled={!country}
                  value={regionState}
                  onChange={(e) => {
                    setRegionState(e.target.value);
                    setDealership("");
                    setOrderFinalized(false);
                  }}
                  className="w-full text-xs border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 rounded px-2.5 py-1.5 disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="">Select State...</option>
                  {country &&
                    Object.keys(carData[country].states).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                </select>
              </div>

              {/* Dealership */}
              <div>
                <label className="text-[11px] text-gray-500 dark:text-slate-400 block mb-1">Service & Delivery Hub</label>
                <select
                  data-testid="select-hub"
                  disabled={!regionState}
                  value={dealership}
                  onChange={(e) => {
                    setDealership(e.target.value);
                    setOrderFinalized(false);
                  }}
                  className="w-full text-xs border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 rounded px-2.5 py-1.5 disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="">Select Local Center...</option>
                  {country &&
                    regionState &&
                    carData[country].states[regionState]?.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                </select>
              </div>
            </div>

            <button
              disabled={!dealership}
              onClick={() => setOrderFinalized(true)}
              data-testid="btn-confirm-delivery-hub"
              className="text-xs bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-medium px-3.5 py-1.5 rounded-lg transition-colors"
            >
              Confirm Hub Allocation
            </button>

            {orderFinalized && (
              <div data-testid="hub-confirmation-alert" className="p-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded text-xs text-emerald-800 dark:text-emerald-300">
                ✓ Route Assigned: <strong>{dealership}</strong> ({regionState}, {country})
              </div>
            )}
          </div>
        </WidgetCard>

        {/* Challenge 3: Infinite Scroll Feed */}
        <WidgetCard
          title="3. Infinite Scroll Feed (Dynamic List Extension)"
          testId="widget-infinite-scroll"
          docUrl="https://playwright.dev/docs/api/class-locator#locator-scroll-into-view-if-needed"
          docTitle="Scrolling & Element Auto-Waiting"
          hint={`// Initial assertion: 3 orders
await expect(page.getByTestId('feed-item')).toHaveCount(3);

// Scroll down to the trigger element
await page.getByTestId('btn-load-more-feed').scrollIntoViewIfNeeded();
await page.getByTestId('btn-load-more-feed').click();

// Assert feed expanded to 5 orders
await expect(page.getByTestId('feed-item')).toHaveCount(5);`}
        >
          <div className="space-y-3">
            <p className="text-xs text-gray-600 dark:text-slate-400">
              Scroll and extend dynamically generated list rows:
            </p>

            <div
              data-testid="infinite-scroll-container"
              className="max-h-40 overflow-y-auto space-y-2 p-2 border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-900"
            >
              {feedItems.map((item) => (
                <div
                  key={item.id}
                  data-testid="feed-item"
                  className="p-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded text-xs flex justify-between items-center"
                >
                  <div>
                    <span className="font-semibold text-gray-800 dark:text-slate-200">{item.title}</span>
                    <span className="text-[10px] text-gray-400 block">{item.status}</span>
                  </div>
                  <span className="font-mono text-green-700 dark:text-green-400 font-bold">{item.amount}</span>
                </div>
              ))}

              <button
                onClick={loadMoreItems}
                disabled={loadingFeed}
                data-testid="btn-load-more-feed"
                className="w-full py-1 text-center text-xs text-indigo-600 dark:text-indigo-400 hover:underline border border-dashed border-indigo-300 dark:border-indigo-800 rounded bg-indigo-50/50 dark:bg-indigo-950/30"
              >
                {loadingFeed ? "Appending batch..." : "↓ Scroll / Click to Load More Orders"}
              </button>
            </div>
          </div>
        </WidgetCard>

        {/* Challenge 4: 6-Box OTP Auto-Focus Verification */}
        <WidgetCard
          title="4. OTP 6-Box Auto-Advancing Pin Code"
          testId="widget-otp-verification"
          docUrl="https://playwright.dev/docs/input#keys-and-shortcuts"
          docTitle="Playwright Press Sequences"
          hint={`// Method A: Type one by one (auto-advances focus)
const firstBox = page.getByTestId('otp-input-0');
await firstBox.click();
await page.keyboard.type('739201');

// Method B: Paste full string into first box
// await firstBox.fill('739201');

await page.getByTestId('btn-verify-otp').click();
await expect(page.getByTestId('otp-success-alert')).toBeVisible();`}
        >
          <div className="space-y-3">
            <p className="text-xs text-gray-600 dark:text-slate-400">
              Auto-jumps focus to next field on digit entry, supports Backspace navigation:
            </p>

            <div className="flex gap-2 justify-center py-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => { otpInputsRef.current[idx] = el; }}
                  data-testid={`otp-input-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-10 h-11 text-center font-mono font-bold text-base border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={otp.some((d) => !d)}
                onClick={() => setOtpVerified(true)}
                data-testid="btn-verify-otp"
                className="text-xs bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-medium px-4 py-1.5 rounded-lg transition-colors"
              >
                Verify Passcode
              </button>
              <button
                onClick={() => {
                  setOtp(["", "", "", "", "", ""]);
                  setOtpVerified(false);
                  otpInputsRef.current[0]?.focus();
                }}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-slate-400"
              >
                Clear
              </button>
            </div>

            {otpVerified && (
              <div data-testid="otp-success-alert" className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <span>🛡️ Two-Factor Authorization Succeeded!</span>
              </div>
            )}
          </div>
        </WidgetCard>

        {/* Challenge 5: Multi-Tab Inter-Window Sync */}
        <WidgetCard
          title="5. Multi-Tab Synchronization (BroadcastChannel)"
          testId="widget-multi-tab-sync"
          docUrl="https://playwright.dev/docs/pages#multiple-pages"
          docTitle="Multi-Page Event Listeners"
          hint={`// Listen for newly opened tab
const pagePromise = context.waitForEvent('page');
await page.getByTestId('btn-open-payment-gateway-tab').click();
const popup = await pagePromise;
await popup.waitForLoadState();

// Perform action in tab 2
await popup.getByTestId('btn-simulate-tab-auth').click();
await popup.close();

// Assert original page dynamically updated via broadcast
await expect(page.getByTestId('payment-sync-status')).toHaveText(/Payment Confirmed/);`}
        >
          <div className="space-y-3">
            <p className="text-xs text-gray-600 dark:text-slate-400">
              Click to launch an external payment window. Actions in that tab broadcast back to this master tab:
            </p>

            <button
              onClick={() => {
                const popup = window.open("", "_blank", "width=500,height=400");
                if (popup) {
                  popup.document.write(`
                    <html>
                      <head><title>Secure Gateway Portal</title></head>
                      <body style="font-family: sans-serif; padding: 24px; text-align: center; background: #0f172a; color: white;">
                        <h3>3D Secure Verification</h3>
                        <p style="font-size: 12px; color: #94a3b8;">Click below to authorize the transaction back to the parent page:</p>
                        <button id="btn-simulate-tab-auth" data-testid="btn-simulate-tab-auth" style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 13px;">
                          Authorize $250.00
                        </button>
                        <script>
                          const channel = new BroadcastChannel('payment_sync_channel');
                          document.getElementById('btn-simulate-tab-auth').onclick = () => {
                            channel.postMessage({ status: 'SUCCESS' });
                            document.body.innerHTML = '<h4>Payment Authorized! Window closing...</h4>';
                            setTimeout(() => window.close(), 1000);
                          };
                        </script>
                      </body>
                    </html>
                  `);
                }
              }}
              data-testid="btn-open-payment-gateway-tab"
              className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3.5 py-1.5 rounded-lg transition-colors"
            >
              Launch Gateway Window ↗
            </button>

            <div
              data-testid="payment-sync-status"
              className={`p-2.5 rounded-lg border text-xs font-medium ${
                paymentSynced
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                  : "bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-800"
              }`}
            >
              {paymentSynced ? "✓ Payment Confirmed via Inter-Tab Broadcast!" : "Waiting for authorization from secondary window..."}
            </div>
          </div>
        </WidgetCard>

        {/* Challenge 6: Flaky Simulator / Transient Race Conditions */}
        <WidgetCard
          title="6. Flaky Element Simulator (Race Condition Arena)"
          testId="widget-flaky-simulator"
          docUrl="https://playwright.dev/docs/actionability"
          docTitle="Playwright Actionability & Debounce"
          hint={`// Transient 2s button click
await page.getByTestId('btn-trigger-transient').click();
const ephemeralBtn = page.getByTestId('btn-ephemeral-claim');
await ephemeralBtn.click(); // Auto-waiting intercepts before 2s disappearance

// Debounced Rapid Click test
const rapidBtn = page.getByTestId('btn-debounced-target');
await rapidBtn.click({ clickCount: 3 });`}
        >
          <div className="space-y-3">
            <p className="text-xs text-gray-600 dark:text-slate-400">
              Practice handling short-lived DOM elements, re-mounting component trees, and debounced click events:
            </p>

            <div className="flex gap-2">
              <button
                onClick={triggerTransientButton}
                data-testid="btn-trigger-transient"
                className="text-xs bg-slate-800 dark:bg-slate-700 text-white px-3 py-1.5 rounded hover:bg-slate-900"
              >
                Spawn 2s Ephemeral Element
              </button>
              <button
                onClick={() => setStaleKey((k) => k + 1)}
                data-testid="btn-force-remount"
                className="text-xs border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 px-3 py-1.5 rounded"
              >
                Force DOM Re-mount
              </button>
            </div>

            {transientVisible && (
              <button
                data-testid="btn-ephemeral-claim"
                onClick={() => alert("Transient button clicked in time!")}
                className="block text-xs bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded font-bold animate-bounce"
              >
                ⚡ Claim Flash Voucher (Disappears in 2s)
              </button>
            )}

            {/* Re-mounting element */}
            <div key={staleKey} data-testid="stale-parent-box" className="p-2 border border-dashed rounded text-xs text-gray-500 dark:text-slate-400 font-mono">
              Component Render Cycle ID: #{staleKey}
            </div>

            {/* Debounce testing */}
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleDebouncedClick}
                data-testid="btn-debounced-target"
                className="text-xs bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded"
              >
                Debounced Target (450ms)
              </button>
              <span className="text-xs text-gray-600 dark:text-slate-400">
                Registered Clicks: <strong data-testid="count-debounced">{debounceClicks}</strong>
              </span>
            </div>
          </div>
        </WidgetCard>

        {/* Challenge 7: Rich Text / WYSIWYG contenteditable */}
        <WidgetCard
          title="7. Rich Text / WYSIWYG Editor (contenteditable)"
          testId="widget-wysiwyg-editor"
          docUrl="https://playwright.dev/docs/input#type-characters"
          docTitle="Typing in contenteditable Elements"
          hint={`// Click inside contenteditable div and type formatted text
const editor = page.getByTestId('rich-text-editor');
await editor.click();
await page.keyboard.type('Patient showed excellent recovery metrics.');

// Select text and trigger formatting shortcut Ctrl+B
await page.keyboard.press('Control+A');
await page.keyboard.press('Control+B');

await page.getByTestId('btn-save-rich-note').click();
await expect(page.getByTestId('saved-note-preview')).toContainText('recovery metrics');`}
        >
          <div className="space-y-3">
            <div className="flex gap-1 border-b border-gray-200 dark:border-slate-700 pb-2">
              <button
                type="button"
                onClick={() => formatText("bold")}
                data-testid="btn-format-bold"
                className="px-2 py-0.5 text-xs font-bold border rounded bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 text-gray-700 dark:text-slate-200"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => formatText("italic")}
                data-testid="btn-format-italic"
                className="px-2 py-0.5 text-xs italic border rounded bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 text-gray-700 dark:text-slate-200"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => formatText("insertUnorderedList")}
                data-testid="btn-format-list"
                className="px-2 py-0.5 text-xs border rounded bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 text-gray-700 dark:text-slate-200"
              >
                • List
              </button>
              <span className="text-[11px] text-gray-400 dark:text-slate-500 ml-auto self-center">
                Words: <strong data-testid="editor-word-count">{editorWordCount}</strong>
              </span>
            </div>

            <div
              ref={editorRef}
              data-testid="rich-text-editor"
              contentEditable
              onInput={updateWordCount}
              className="min-h-[90px] p-2.5 border border-gray-300 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              suppressContentEditableWarning
            >
              Write comprehensive clinical notes here...
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSavedNote(editorRef.current?.innerHTML || "")}
                data-testid="btn-save-rich-note"
                className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3.5 py-1.5 rounded-lg transition-colors"
              >
                Save Doctor Notes
              </button>
            </div>

            {savedNote && (
              <div
                data-testid="saved-note-preview"
                className="p-2.5 bg-gray-50 dark:bg-slate-900 rounded border border-gray-200 dark:border-slate-800 text-xs text-gray-800 dark:text-slate-200"
                dangerouslySetInnerHTML={{ __html: savedNote }}
              />
            )}
          </div>
        </WidgetCard>
      </div>
    </div>
  );
}
