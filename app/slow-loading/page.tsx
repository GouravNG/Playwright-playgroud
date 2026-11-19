"use client";
import { useState } from "react";
import { WidgetCard } from "@/components/common/WidgetCard";

type HealthReport = {
  reportId: string;
  generatedAt: string;
  patient: {
    name: string;
    patientId: string;
    age: number;
    bloodType: string;
    status: string;
  };
  metrics: {
    restingHeartRate: string;
    bloodPressure: string;
    glucoseLevel: string;
    oxygenSaturation: string;
    cholesterolTotal: string;
  };
  diagnosis: string;
  verifiedBy: string;
  latencyMs: number;
};

export default function SlowLoadingPage() {
  // Widget 1: Slow API fetching state
  const [loadingReport, setLoadingReport] = useState(false);
  const [report, setReport] = useState<HealthReport | null>(null);
  const [delayInput, setDelayInput] = useState("3500");

  // Widget 2: Polling / Long-Running Task
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState<string | null>(null);

  // Widget 3: Delayed rendering element
  const [delayedTriggered, setDelayedTriggered] = useState(false);
  const [delayedRendered, setDelayedRendered] = useState(false);

  // Widget 4: Multi-Step Async Transaction
  const [claimStatus, setClaimStatus] = useState<"idle" | "validating" | "underwriting" | "approved">("idle");

  const fetchHealthRecords = async () => {
    setLoadingReport(true);
    setReport(null);
    try {
      const res = await fetch(`/api/healthcare/records?delay=${delayInput}`);
      const data = await res.json();
      setReport(data);
    } catch {
      // ignore
    } finally {
      setLoadingReport(false);
    }
  };

  const startMRIProcessing = () => {
    setScanning(true);
    setScanProgress(0);
    setScanStatus("Uploading high-res DICOM scans...");

    let p = 0;
    const interval = setInterval(() => {
      p += 20;
      setScanProgress(p);
      if (p === 40) setScanStatus("Analyzing brain parenchyma density...");
      if (p === 80) setScanStatus("Generating 3D volumetric reconstruction...");
      if (p >= 100) {
        clearInterval(interval);
        setScanning(false);
        setScanStatus("MRI Scan Analysis Complete: No anomalies detected.");
      }
    }, 800);
  };

  const triggerDelayedButton = () => {
    setDelayedTriggered(true);
    setDelayedRendered(false);
    setTimeout(() => {
      setDelayedRendered(true);
    }, 4000);
  };

  const processInsuranceClaim = () => {
    setClaimStatus("validating");
    setTimeout(() => {
      setClaimStatus("underwriting");
      setTimeout(() => {
        setClaimStatus("approved");
      }, 2500);
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-cyan-900 to-slate-900 text-white rounded-xl p-5 shadow-lg border border-teal-800/50">
        <div className="flex items-center gap-3">
          <span className="text-3xl">⏳</span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-lg text-teal-300">Async & Slow-Loading Lab</h2>
              <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-400/30 px-2 py-0.5 rounded-full font-mono uppercase">
                Healthcare & Diagnostic Cloud
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Practice handling real-world asynchronous operations: heavy server compute latency, skeleton loaders, slow API endpoints, polling progress bars, multi-stage state transitions, and element detachment with Playwright&apos;s <code>waitForSelector</code>, <code>expect().toBeVisible(&#123; timeout &#125;)</code>, and <code>waitForResponse()</code>.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Heavy API Latency with Skeleton */}
        <WidgetCard
          title="1. Slow Healthcare API & Skeleton Loader"
          testId="widget-slow-api"
          docUrl="https://playwright.dev/docs/actionability#auto-waiting"
          docTitle="Playwright Auto-Waiting & Timeouts"
          hint={`// Wait for API response promise alongside click
const responsePromise = page.waitForResponse(resp =>
  resp.url().includes('/api/healthcare/records') && resp.status() === 200
);
await page.getByTestId('btn-fetch-health-records').click();
await responsePromise;

// Or use expect with custom timeout
await expect(page.getByTestId('health-report-card')).toBeVisible({ timeout: 10000 });
await expect(page.getByTestId('patient-name')).toHaveText('Eleanor Vance');`}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <label htmlFor="delay-select" className="text-xs text-gray-600 dark:text-slate-400 font-medium">
                Simulated Latency:
              </label>
              <select
                id="delay-select"
                data-testid="select-latency-delay"
                value={delayInput}
                onChange={(e) => setDelayInput(e.target.value)}
                className="text-xs border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 rounded px-2 py-1 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="2000">2.0 seconds</option>
                <option value="3500">3.5 seconds (Default)</option>
                <option value="5000">5.0 seconds (Heavy)</option>
                <option value="7500">7.5 seconds (Stress)</option>
              </select>
              <button
                onClick={fetchHealthRecords}
                disabled={loadingReport}
                data-testid="btn-fetch-health-records"
                className="text-xs bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-medium px-3.5 py-1.5 rounded-lg transition-colors ml-auto shadow-xs"
              >
                {loadingReport ? "Fetching Record..." : "Fetch Patient Record"}
              </button>
            </div>

            {/* Skeleton Loading State */}
            {loadingReport && (
              <div data-testid="health-skeleton-loader" className="p-4 bg-gray-50 dark:bg-slate-900/60 rounded-xl border border-gray-200 dark:border-slate-800 space-y-3 animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-16"></div>
                </div>
                <div className="space-y-2 pt-2">
                  <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded w-4/5"></div>
                  <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded w-2/3"></div>
                </div>
                <div className="pt-2 flex gap-2">
                  <div className="h-6 bg-gray-200 dark:bg-slate-800 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 dark:bg-slate-800 rounded w-24"></div>
                </div>
              </div>
            )}

            {/* Loaded Data Card */}
            {report && (
              <div data-testid="health-report-card" className="p-4 bg-teal-50/50 dark:bg-slate-900 rounded-xl border border-teal-200 dark:border-teal-900/60 space-y-3">
                <div className="flex justify-between items-start border-b border-teal-100 dark:border-slate-800 pb-2">
                  <div>
                    <span className="text-[10px] font-mono text-teal-700 dark:text-teal-400 bg-teal-100 dark:bg-teal-950/60 px-1.5 py-0.5 rounded">
                      {report.reportId}
                    </span>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-slate-100 mt-1" data-testid="patient-name">
                      {report.patient.name}
                    </h4>
                    <span className="text-[11px] text-gray-500 dark:text-slate-400">
                      ID: {report.patient.patientId} • Age: {report.patient.age} • Blood: {report.patient.bloodType}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                    {report.patient.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-white dark:bg-slate-800 rounded border border-gray-200 dark:border-slate-700">
                    <span className="text-[10px] text-gray-400 dark:text-slate-500 block">Resting Heart Rate</span>
                    <strong className="text-gray-800 dark:text-slate-200 font-mono" data-testid="metric-heart-rate">{report.metrics.restingHeartRate}</strong>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-800 rounded border border-gray-200 dark:border-slate-700">
                    <span className="text-[10px] text-gray-400 dark:text-slate-500 block">Blood Pressure</span>
                    <strong className="text-gray-800 dark:text-slate-200 font-mono" data-testid="metric-blood-pressure">{report.metrics.bloodPressure}</strong>
                  </div>
                </div>

                <div className="text-xs text-gray-700 dark:text-slate-300 bg-white/70 dark:bg-slate-800/60 p-2.5 rounded border border-gray-200/60 dark:border-slate-700">
                  <span className="font-semibold text-teal-800 dark:text-teal-300">Diagnosis: </span>
                  {report.diagnosis}
                </div>
              </div>
            )}
          </div>
        </WidgetCard>

        {/* 2. Long-Running Processing / Progress Polling */}
        <WidgetCard
          title="2. Diagnostic Processing & Progress Polling"
          testId="widget-progress-polling"
          docUrl="https://playwright.dev/docs/test-assertions#locator-assertions-to-have-text"
          docTitle="Polling & State Assertions"
          hint={`// Poll until completion text appears with custom timeout
await page.getByTestId('btn-start-mri-scan').click();

// Assert progress starts
await expect(page.getByTestId('scan-progress-bar')).toBeVisible();

// Wait for final completion state (polls automatically)
await expect(page.getByTestId('scan-status-message')).toHaveText(
  /MRI Scan Analysis Complete/,
  { timeout: 10000 }
);`}
        >
          <div className="space-y-3">
            <p className="text-xs text-gray-600 dark:text-slate-400">
              Simulates a complex multi-second background image computation where elements progress through several intermediate stages before settling.
            </p>

            <button
              onClick={startMRIProcessing}
              disabled={scanning}
              data-testid="btn-start-mri-scan"
              className="text-xs bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium px-3.5 py-1.5 rounded-lg transition-colors"
            >
              {scanning ? "Processing Volumetric Scan..." : "Start 3D MRI Reconstruction"}
            </button>

            {scanStatus && (
              <div className="space-y-2 p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-gray-700 dark:text-slate-300" data-testid="scan-status-message">
                    {scanStatus}
                  </span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{scanProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    data-testid="scan-progress-bar"
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </WidgetCard>

        {/* 3. Delayed Element Appearance */}
        <WidgetCard
          title="3. Delayed DOM Insertion (waitForSelector)"
          testId="widget-delayed-insertion"
          docUrl="https://playwright.dev/docs/api/class-page#page-wait-for-selector"
          docTitle="waitForSelector vs toBeVisible"
          hint={`// Playwright automatically waits up to 5s default timeout
await page.getByTestId('btn-trigger-delayed-rx').click();

// Explicitly assert delayed action button appears
const rxBtn = page.getByTestId('btn-dispense-medication');
await expect(rxBtn).toBeVisible({ timeout: 6000 });
await rxBtn.click();
await expect(page.getByTestId('dispense-confirmed')).toBeVisible();`}
        >
          <div className="space-y-3">
            <p className="text-xs text-gray-600 dark:text-slate-400">
              Simulates asynchronous authorization check where an action button is absent from the DOM and injected after a 4-second delay.
            </p>

            <button
              onClick={triggerDelayedButton}
              disabled={delayedTriggered && !delayedRendered}
              data-testid="btn-trigger-delayed-rx"
              className="text-xs bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-medium px-3.5 py-1.5 rounded-lg transition-colors"
            >
              Verify Physician Digital Signature
            </button>

            {delayedTriggered && !delayedRendered && (
              <div data-testid="delayed-checking-spinner" className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200 dark:border-amber-800">
                <span className="animate-spin text-sm">⌛</span>
                <span>Contacting Medical Board Registry (4s delay)...</span>
              </div>
            )}

            {delayedRendered && (
              <div data-testid="delayed-rendered-container" className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-2">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 block">
                  ✓ Physician Signature Verified: Dr. Alistair Finch (Lic #88491)
                </span>
                <button
                  data-testid="btn-dispense-medication"
                  onClick={() => alert("Medication dispensed successfully!")}
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3 py-1.5 rounded shadow-xs"
                >
                  Authorize Medication Dispense 💊
                </button>
              </div>
            )}
          </div>
        </WidgetCard>

        {/* 4. Multi-Stage Asynchronous State Machine */}
        <WidgetCard
          title="4. Multi-Stage Async Workflow (Claims Gateway)"
          testId="widget-multi-stage-claims"
          docUrl="https://playwright.dev/docs/navigations#wait-for-navigation"
          docTitle="Multi-step State Assertions"
          hint={`// Test progression through each discrete asynchronous state
await page.getByTestId('btn-submit-claim').click();

// 1. Initial validation
await expect(page.getByTestId('claim-status-pill')).toHaveText('Validating Policy...');

// 2. Automated Underwriting
await expect(page.getByTestId('claim-status-pill')).toHaveText('Underwriting Review...', { timeout: 4000 });

// 3. Final Settlement
await expect(page.getByTestId('claim-status-pill')).toHaveText('Claim Approved ($1,450.00)', { timeout: 6000 });`}
        >
          <div className="space-y-3">
            <p className="text-xs text-gray-600 dark:text-slate-400">
              Healthcare Insurance Claims Gateway transitioning automatically through <code>Validating</code> ➔ <code>Underwriting</code> ➔ <code>Approved</code>.
            </p>

            <button
              onClick={processInsuranceClaim}
              disabled={claimStatus !== "idle" && claimStatus !== "approved"}
              data-testid="btn-submit-claim"
              className="text-xs bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-medium px-3.5 py-1.5 rounded-lg transition-colors"
            >
              {claimStatus === "approved" ? "Re-submit Another Claim" : "Submit Claim for $1,450.00"}
            </button>

            {claimStatus !== "idle" && (
              <div className="p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 dark:text-slate-400">Claim Pipeline State:</span>
                  <span
                    data-testid="claim-status-pill"
                    className={`font-semibold px-2.5 py-0.5 rounded-full text-[11px] ${
                      claimStatus === "validating"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        : claimStatus === "underwriting"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    }`}
                  >
                    {claimStatus === "validating" && "Validating Policy..."}
                    {claimStatus === "underwriting" && "Underwriting Review..."}
                    {claimStatus === "approved" && "Claim Approved ($1,450.00)"}
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 dark:text-slate-400">
                  {claimStatus === "validating" && "Stage 1/3: Checking deductible and policy active window."}
                  {claimStatus === "underwriting" && "Stage 2/3: Applying hospital fee schedule & copay calculation."}
                  {claimStatus === "approved" && "Stage 3/3: Electronic Funds Transfer (EFT) batch scheduled."}
                </div>
              </div>
            )}
          </div>
        </WidgetCard>
      </div>
    </div>
  );
}
