"use client";
import React, { useState, useEffect, useRef } from "react";
import { WidgetCard } from "@/components/common/WidgetCard";

interface TickerItem {
  type: string;
  symbol: string;
  price: number;
  change: number;
  volume: number;
  timestamp: string;
}

interface AlertToast {
  id: string;
  type: "CRITICAL" | "INFO" | "WARNING";
  message: string;
  time: string;
}

export default function RealtimeFeedPage() {
  // SSE Ticker State
  const [tickerList, setTickerList] = useState<TickerItem[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "live" | "paused">("live");
  const [eventCount, setEventCount] = useState(0);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Live Toast Notifications State
  const [toasts, setToasts] = useState<AlertToast[]>([]);
  const [alertActive, setAlertActive] = useState(true);

  // Connect / Disconnect SSE stream
  useEffect(() => {
    if (connectionStatus !== "live") {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      return;
    }

    const es = new EventSource("/api/realtime-feed");
    eventSourceRef.current = es;

    es.onopen = () => {
      setConnectionStatus("live");
    };

    es.onmessage = (event) => {
      try {
        const data: TickerItem = JSON.parse(event.data);
        if (data.type === "TICKER") {
          setTickerList((prev) => [data, ...prev.slice(0, 7)]);
          setEventCount((c) => c + 1);
        }
      } catch {
        // ignored
      }
    };

    es.onerror = () => {
      // Reconnect handled automatically by EventSource
    };

    return () => {
      es.close();
      eventSourceRef.current = null;
    };
  }, [connectionStatus]);

  // Background Push Alert Dispatcher
  useEffect(() => {
    if (!alertActive) return;

    const messages = [
      { type: "CRITICAL" as const, message: "Spike Detected: BTC-USD exceeded high volatility limits." },
      { type: "WARNING" as const, message: "Order Book Latency > 180ms on matching engine cluster." },
      { type: "INFO" as const, message: "Block 849,203 confirmed across all validators." },
      { type: "INFO" as const, message: "Liquidity pool rebalanced automatically." },
    ];

    const alertTimer = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const newToast: AlertToast = {
        id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type: randomMsg.type,
        message: randomMsg.message,
        time: new Date().toLocaleTimeString(),
      };

      setToasts((prev) => [newToast, ...prev.slice(0, 3)]);
    }, 3500);

    return () => clearInterval(alertTimer);
  }, [alertActive]);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  const triggerManualAlert = () => {
    const manualToast: AlertToast = {
      id: `toast-manual-${Date.now()}`,
      type: "CRITICAL",
      message: "Manual Circuit Breaker Tripped! Immediate assertion test.",
      time: new Date().toLocaleTimeString(),
    };
    setToasts((prev) => [manualToast, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🔔</span>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="page-title">
              Live Real-Time Streaming & Push Alert Feed
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
              Mastery
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Practice testing unsolicited Server-Sent Events (SSE), live WebSocket streams, unsolicited push notifications, and DOM stabilization.
          </p>
        </div>

        {/* Live Indicator Controls */}
        <div className="flex items-center gap-2">
          <span
            data-testid="connection-badge"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
              connectionStatus === "live"
                ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${connectionStatus === "live" ? "bg-emerald-500 animate-ping" : "bg-amber-500"}`} />
            {connectionStatus === "live" ? "STREAM LIVE" : "STREAM PAUSED"}
          </span>

          <button
            type="button"
            data-testid="btn-toggle-stream"
            onClick={() => setConnectionStatus((s) => (s === "live" ? "paused" : "live"))}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
          >
            {connectionStatus === "live" ? "⏸️ Pause Stream" : "▶️ Resume Stream"}
          </button>
        </div>
      </div>

      {/* Main Grid: Streaming Order Book & Live Toast Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Streaming Ticker Feed */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                Live Server-Sent Events (SSE) Market Book
              </h2>
              <p className="text-[11px] text-gray-500">
                Data pushes automatically every 1.2s without client polling.
              </p>
            </div>
            <span data-testid="stream-event-counter" className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold">
              {eventCount} Events Received
            </span>
          </div>

          {/* Ticker Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left" data-testid="ticker-table">
              <thead className="bg-gray-50 dark:bg-slate-800/60 text-gray-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Symbol</th>
                  <th className="py-2.5 px-3">Price</th>
                  <th className="py-2.5 px-3">Change</th>
                  <th className="py-2.5 px-3">Volume</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800 font-mono">
                {tickerList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">
                      Connecting to SSE stream /api/realtime-feed...
                    </td>
                  </tr>
                ) : (
                  tickerList.map((item, idx) => (
                    <tr
                      key={`${item.symbol}-${idx}-${item.timestamp}`}
                      data-testid={`ticker-row-${item.symbol}`}
                      className="hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors animate-fade-in"
                    >
                      <td className="py-2 px-3 font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        {item.symbol}
                      </td>
                      <td className="py-2 px-3 font-semibold text-gray-800 dark:text-gray-200">
                        ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className={`py-2 px-3 font-semibold ${item.change >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                        {item.change >= 0 ? `+${item.change}` : item.change}
                      </td>
                      <td className="py-2 px-3 text-gray-500">{item.volume} lots</td>
                      <td className="py-2 px-3 text-gray-400 text-[11px]">{item.timestamp}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Live Push Toast Alerts */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                Live Alert Feed
              </h2>
              <p className="text-[11px] text-gray-500">Unsolicited asynchronous alerts</p>
            </div>
            <button
              type="button"
              data-testid="btn-trigger-circuit-breaker"
              onClick={triggerManualAlert}
              className="text-[10px] font-bold px-2 py-1 rounded bg-rose-600 text-white hover:bg-rose-700 transition"
            >
              🚨 Force Alert
            </button>
          </div>

          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              data-testid="btn-toggle-alerts"
              onClick={() => setAlertActive((v) => !v)}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium text-xs"
            >
              {alertActive ? "Disable Background Alerts" : "Enable Background Alerts"}
            </button>
            {toasts.length > 0 && (
              <button
                type="button"
                data-testid="btn-clear-toasts"
                onClick={clearAllToasts}
                className="text-gray-400 hover:text-gray-600 text-xs"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Toast Container */}
          <div data-testid="push-toast-feed" className="space-y-2.5 min-h-[220px]">
            {toasts.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400 border border-dashed border-gray-200 dark:border-slate-800 rounded-lg">
                Waiting for background push events...
              </div>
            ) : (
              toasts.map((toast) => (
                <div
                  key={toast.id}
                  data-testid={`toast-item-${toast.type.toLowerCase()}`}
                  className={`p-3 rounded-lg border text-xs flex items-start justify-between gap-2 shadow-xs transition-all ${
                    toast.type === "CRITICAL"
                      ? "bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200"
                      : toast.type === "WARNING"
                      ? "bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200"
                      : "bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200"
                  }`}
                >
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center gap-1.5 font-bold uppercase text-[10px]">
                      <span>{toast.type === "CRITICAL" ? "🔴" : toast.type === "WARNING" ? "🟡" : "🔵"}</span>
                      <span>{toast.type}</span>
                      <span className="opacity-50 font-normal font-mono">{toast.time}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">{toast.message}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => dismissToast(toast.id)}
                    className="text-gray-400 hover:text-gray-700 dark:hover:text-white p-0.5"
                    data-testid="btn-dismiss-toast"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Code References */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WidgetCard
          title="Testing Server-Sent Events (SSE) & WebSocket Streams"
          testId="widget-sse-hint-1"
          docUrl="https://playwright.dev/docs/network"
          docTitle="Playwright SSE & Network Interception"
          hint={`// 1. Assert connection status
await expect(page.getByTestId('connection-badge')).toContainText('STREAM LIVE');

// 2. Wait for incoming streaming events to populate DOM
const tickerRow = page.getByTestId(/ticker-row-.+/).first();
await expect(tickerRow).toBeVisible({ timeout: 10000 });

// 3. Test pause stream toggling
await page.getByTestId('btn-toggle-stream').click();
await expect(page.getByTestId('connection-badge')).toContainText('STREAM PAUSED');`}
        >
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Playwright&apos;s auto-waiting locators reliably synchronize with continuous streaming updates without requiring artificial sleeps.
          </p>
        </WidgetCard>

        <WidgetCard
          title="Handling Unsolicited Push Toast Notifications"
          testId="widget-sse-hint-2"
          docUrl="https://playwright.dev/docs/actionability"
          docTitle="Playwright Actionability & Toast Handling"
          hint={`// Trigger immediate push notification
await page.getByTestId('btn-trigger-circuit-breaker').click();

// Target unsolicited toast notification
const toast = page.getByTestId('toast-item-critical').first();
await expect(toast).toBeVisible();
await expect(toast).toContainText('Circuit Breaker');

// Dismiss notification
await toast.getByTestId('btn-dismiss-toast').click();
await expect(toast).not.toBeVisible();`}
        >
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Learn to assert asynchronous toast notifications that arrive dynamically from background server events.
          </p>
        </WidgetCard>
      </div>
    </div>
  );
}
