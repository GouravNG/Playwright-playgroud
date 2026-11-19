"use client";
import React, { useEffect, useRef, useState } from "react";
import { WidgetCard } from "@/components/common/WidgetCard";

export default function ShadowDomPage() {
  const openShadowHostRef = useRef<HTMLDivElement | null>(null);
  const closedShadowHostRef = useRef<HTMLDivElement | null>(null);
  const svgShadowHostRef = useRef<HTMLDivElement | null>(null);

  const [openStatus, setOpenStatus] = useState<string>("Waiting for interaction...");
  const [closedStatus, setClosedStatus] = useState<string>("Waiting for interaction...");
  const [vectorClicked, setVectorClicked] = useState<string>("None");

  // 1. Mount Open Shadow DOM Custom Element
  useEffect(() => {
    const host = openShadowHostRef.current;
    if (!host || host.shadowRoot) return;

    const shadow = host.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>
        .open-container {
          padding: 16px;
          border-radius: 8px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          font-family: system-ui, sans-serif;
        }
        :host-context(.dark) .open-container {
          background: #0f172a;
          border-color: #334155;
          color: #f1f5f9;
        }
        .btn-open {
          padding: 8px 14px;
          background-color: #4f46e5;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .btn-open:hover {
          background-color: #4338ca;
        }
        .input-open {
          padding: 6px 10px;
          border-radius: 6px;
          border: 1px solid #cbd5e1;
          font-size: 12px;
          margin-right: 8px;
          outline: none;
        }
      </style>
      <div class="open-container" data-testid="open-shadow-container">
        <p style="font-size: 12px; margin-bottom: 8px; font-weight: 500;">
          🔓 <strong>Open Shadow Root</strong> (Auto-pierced by standard Playwright locators)
        </p>
        <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
          <input
            type="text"
            placeholder="Type inside shadow DOM..."
            class="input-open"
            data-testid="shadow-open-input"
            id="open-input"
          />
          <button type="button" class="btn-open" data-testid="btn-shadow-open-submit" id="open-btn">
            Submit Open
          </button>
        </div>
      </div>
    `;

    const btn = shadow.getElementById("open-btn");
    const input = shadow.getElementById("open-input") as HTMLInputElement;

    btn?.addEventListener("click", () => {
      const val = input?.value || "Empty string";
      setOpenStatus(`Open Shadow Submitted: "${val}"`);
    });
  }, []);

  // 2. Mount Closed Shadow DOM Custom Element
  useEffect(() => {
    const host = closedShadowHostRef.current;
    if (!host) return;

    // In React 19 strict mode or re-renders, avoid attaching twice
    if ((host as any).__hasClosedShadow) return;
    (host as any).__hasClosedShadow = true;

    try {
      const closedShadow = host.attachShadow({ mode: "closed" });
      closedShadow.innerHTML = `
        <style>
          .closed-container {
            padding: 16px;
            border-radius: 8px;
            background: #fff1f2;
            border: 1px solid #fecdd3;
            font-family: system-ui, sans-serif;
          }
          :host-context(.dark) .closed-container {
            background: #881337/30;
            border-color: #9f1239;
            color: #ffe4e6;
          }
          .btn-closed {
            padding: 8px 14px;
            background-color: #e11d48;
            color: #ffffff;
            border: none;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
          }
          .btn-closed:hover {
            background-color: #be123c;
          }
        </style>
        <div class="closed-container">
          <p style="font-size: 12px; margin-bottom: 8px; font-weight: 500;">
            🔒 <strong>Closed Shadow Root</strong> (Encapsulation Barrier - <code>element.shadowRoot === null</code>)
          </p>
          <button type="button" class="btn-closed" id="closed-secret-action" data-testid="btn-closed-secret">
            Trigger Closed Secret Action
          </button>
        </div>
      `;

      // Expose reference only on private custom property for test runner demonstration
      (host as any).__privateRoot = closedShadow;

      const btn = closedShadow.getElementById("closed-secret-action");
      btn?.addEventListener("click", () => {
        setClosedStatus("Closed Shadow Root action executed successfully!");
      });
    } catch {
      // Ignored if already attached
    }
  }, []);

  // 3. Mount Shadow DOM with SVG Vector Graphics
  useEffect(() => {
    const host = svgShadowHostRef.current;
    if (!host || host.shadowRoot) return;

    const svgShadow = host.attachShadow({ mode: "open" });
    svgShadow.innerHTML = `
      <style>
        .svg-container {
          padding: 16px;
          border-radius: 8px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          font-family: system-ui, sans-serif;
        }
        :host-context(.dark) .svg-container {
          background: #052e16/40;
          border-color: #14532d;
          color: #dcfce7;
        }
        .shape {
          cursor: pointer;
          transition: transform 0.2s, fill 0.2s;
        }
        .shape:hover {
          transform: scale(1.08);
          transform-origin: center;
        }
      </style>
      <div class="svg-container" data-testid="shadow-svg-container">
        <p style="font-size: 12px; margin-bottom: 10px; font-weight: 500;">
          🎨 <strong>Nested SVG Graphics inside Shadow Root</strong>
        </p>
        <svg width="280" height="90" viewBox="0 0 280 90" data-testid="shadow-svg-canvas">
          <!-- Circle -->
          <circle cx="50" cy="45" r="30" fill="#10b981" class="shape" id="svg-circle" data-testid="shadow-svg-circle" />
          <!-- Rect -->
          <rect x="110" y="20" width="55" height="50" rx="6" fill="#6366f1" class="shape" id="svg-rect" data-testid="shadow-svg-rect" />
          <!-- Triangle Star -->
          <polygon points="220,15 230,38 255,38 235,52 242,75 220,60 198,75 205,52 185,38 210,38" fill="#f59e0b" class="shape" id="svg-star" data-testid="shadow-svg-star" />
        </svg>
      </div>
    `;

    svgShadow.getElementById("svg-circle")?.addEventListener("click", () => setVectorClicked("Emerald Circle"));
    svgShadow.getElementById("svg-rect")?.addEventListener("click", () => setVectorClicked("Indigo Rectangle"));
    svgShadow.getElementById("svg-star")?.addEventListener("click", () => setVectorClicked("Amber Star"));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">⏱️</span>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="page-title">
            Shadow DOM & Web Components Studio
          </h1>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
            Advanced
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Simulate enterprise micro-frontends (Salesforce Lightning, Zendesk, Shopify apps). Master Playwright&apos;s automatic open-root piercing vs. closed-root encapsulation strategies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Widget 1: Open Shadow DOM */}
        <WidgetCard
          title="1. Open Shadow DOM (Auto-Pierced)"
          testId="widget-open-shadow"
          docUrl="https://playwright.dev/docs/locators#locate-in-shadow-dom"
          docTitle="Playwright Shadow DOM Auto-Piercing"
          hint={`// Playwright locators automatically pierce open shadow roots!
// You DO NOT need custom piercing functions:
const input = page.getByTestId('shadow-open-input');
await input.fill('Autonomous automation test');

const submitBtn = page.getByTestId('btn-shadow-open-submit');
await submitBtn.click();

await expect(page.getByTestId('status-open-shadow')).toContainText('Autonomous automation');`}
        >
          <div className="space-y-4">
            {/* Custom Element Host */}
            <div ref={openShadowHostRef} data-testid="host-open-shadow" id="host-open-shadow" />

            <div
              data-testid="status-open-shadow"
              className="p-2.5 rounded-lg text-xs font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-900/50"
            >
              <strong>Status:</strong> {openStatus}
            </div>
          </div>
        </WidgetCard>

        {/* Widget 2: Closed Shadow DOM */}
        <WidgetCard
          title="2. Closed Shadow DOM (Encapsulation)"
          testId="widget-closed-shadow"
          docUrl="https://playwright.dev/docs/evaluating"
          docTitle="Playwright JavaScript Evaluation"
          hint={`// In closed shadow roots, element.shadowRoot returns null to external scripts.
// In tests, pierce via page.evaluate or host private hooks:
await page.evaluate(() => {
  const host = document.getElementById('host-closed-shadow');
  // Accessing closed shadow root via internal reference
  const root = host.__privateRoot;
  const btn = root.getElementById('closed-secret-action');
  btn.click();
});

await expect(page.getByTestId('status-closed-shadow')).toContainText('executed successfully');`}
        >
          <div className="space-y-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Closed roots block external <code>element.shadowRoot</code> queries. Demonstrates why micro-frontends use closed roots for security and how to target them.
            </p>

            {/* Custom Element Host */}
            <div ref={closedShadowHostRef} data-testid="host-closed-shadow" id="host-closed-shadow" />

            <div
              data-testid="status-closed-shadow"
              className="p-2.5 rounded-lg text-xs font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-900/50"
            >
              <strong>Status:</strong> {closedStatus}
            </div>
          </div>
        </WidgetCard>

        {/* Widget 3: Shadow DOM with SVG Vector Elements */}
        <WidgetCard
          title="3. SVG Vectors within Shadow DOM"
          testId="widget-svg-shadow"
          docUrl="https://playwright.dev/docs/locators#locate-by-css-or-xpath"
          docTitle="Playwright Vector SVG Selection"
          hint={`// Auto-pierce and target SVG graphics inside shadow boundaries:
await page.getByTestId('shadow-svg-circle').click();
await expect(page.getByTestId('status-svg-shadow')).toContainText('Emerald Circle');

await page.getByTestId('shadow-svg-star').click();
await expect(page.getByTestId('status-svg-shadow')).toContainText('Amber Star');`}
        >
          <div className="space-y-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SVG vector nodes inside open shadow roots inherit both Playwright automatic tree piercing and vector click hit-testing.
            </p>

            {/* SVG Host */}
            <div ref={svgShadowHostRef} data-testid="host-svg-shadow" id="host-svg-shadow" />

            <div
              data-testid="status-svg-shadow"
              className="p-2.5 rounded-lg text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900/50"
            >
              <strong>Selected Graphic:</strong> {vectorClicked}
            </div>
          </div>
        </WidgetCard>
      </div>
    </div>
  );
}
