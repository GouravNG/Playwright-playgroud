"use client";
import React, { useState, useMemo } from "react";
import { WidgetCard } from "@/components/common/WidgetCard";

// Sample dataset provided as an interactive table that users can copy to clipboard or use directly
const SAMPLE_EMPLOYEES = [
  { id: "EMP-101", name: "Alice Morgan", dept: "Engineering", salary: "115000", tax: "28", email: "alice.m@example.com" },
  { id: "EMP-102", name: "Bob Chen", dept: "Product", salary: "102000", tax: "25", email: "bob.c@example.com" },
  { id: "EMP-103", name: "Clara Vance", dept: "Marketing", salary: "88000", tax: "22", email: "clara.v@example.com" },
  { id: "EMP-104", name: "David Kim", dept: "Design", salary: "94000", tax: "24", email: "david.k@example.com" },
  { id: "EMP-105", name: "Elena Rostova", dept: "Finance", salary: "128000", tax: "30", email: "elena.r@example.com" },
];

// Playground 2: Ledger Data
interface LedgerEntry {
  id: string;
  date: string;
  counterparty: string;
  category: "Payroll" | "Vendor" | "Dividend" | "Subscription";
  amount: number;
  status: "Settled" | "Pending" | "Flagged";
}

const INITIAL_LEDGER: LedgerEntry[] = [
  { id: "TX-901", date: "2026-11-18", counterparty: "AWS Cloud Infrastructure", category: "Vendor", amount: -4280.50, status: "Settled" },
  { id: "TX-902", date: "2026-11-17", counterparty: "Enterprise Licensing (Acme)", category: "Subscription", amount: 18500.00, status: "Settled" },
  { id: "TX-903", date: "2026-11-17", counterparty: "Global Health Insurance Hub", category: "Payroll", amount: -6120.00, status: "Settled" },
  { id: "TX-904", date: "2026-11-16", counterparty: "Overdue Wire Settlement", category: "Vendor", amount: -15200.00, status: "Flagged" },
  { id: "TX-905", date: "2026-11-15", counterparty: "Series B Dividend Distribution", category: "Dividend", amount: 45000.00, status: "Pending" },
  { id: "TX-906", date: "2026-11-14", counterparty: "Figma Team Seat Expansion", category: "Subscription", amount: -960.00, status: "Settled" },
];

export default function DataDrivenPage() {
  // --- Playground 1 State (Data Injection) ---
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [importedRecords, setImportedRecords] = useState<any[]>([]);
  const [manualForm, setManualForm] = useState({
    empId: "",
    fullName: "",
    department: "Engineering",
    salary: "",
    tax: "",
    email: "",
  });
  const [formSubmissionMsg, setFormSubmissionMsg] = useState<string | null>(null);

  // Generate tab-separated or comma-separated text to copy
  const tsvData = useMemo(() => {
    const headers = "Employee ID\tFull Name\tDepartment\tBase Salary\tTax Bracket (%)\tEmail Address";
    const rows = SAMPLE_EMPLOYEES.map(
      (e) => `${e.id}\t${e.name}\t${e.dept}\t${e.salary}\t${e.tax}\t${e.email}`
    );
    return [headers, ...rows].join("\n");
  }, []);

  const copyTableToClipboard = () => {
    navigator.clipboard.writeText(tsvData);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2500);
  };

  // Quick-load demo data button (simulating parsed sheet records)
  const loadSampleIntoImported = () => {
    setImportedRecords(SAMPLE_EMPLOYEES);
    setFormSubmissionMsg(`Successfully imported ${SAMPLE_EMPLOYEES.length} records!`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      // Simple CSV/TSV parser supporting comma or tab separation
      const lines = text.trim().split(/\r?\n/);
      if (lines.length <= 1) return;

      const delimiter = lines[0].includes("\t") ? "\t" : ",";
      const parsed = lines.slice(1).map((line, idx) => {
        const cols = line.split(delimiter).map((c) => c.trim().replace(/^["']|["']$/g, ""));
        return {
          id: cols[0] || `EMP-${200 + idx}`,
          name: cols[1] || "Unnamed",
          dept: cols[2] || "Operations",
          salary: cols[3] || "0",
          tax: cols[4] || "0",
          email: cols[5] || "user@example.com",
        };
      });

      setImportedRecords(parsed);
      setFormSubmissionMsg(`Parsed and loaded ${parsed.length} records from "${file.name}"!`);
    };
    reader.readAsText(file);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.empId || !manualForm.fullName) return;

    const newRecord = {
      id: manualForm.empId,
      name: manualForm.fullName,
      dept: manualForm.department,
      salary: manualForm.salary,
      tax: manualForm.tax,
      email: manualForm.email,
    };

    setImportedRecords((prev) => [newRecord, ...prev]);
    setFormSubmissionMsg(`Created record for "${manualForm.fullName}" (${manualForm.empId})`);
    setManualForm({
      empId: "",
      fullName: "",
      department: "Engineering",
      salary: "",
      tax: "",
      email: "",
    });
  };

  // --- Playground 2 State (Data Extraction) ---
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const filteredLedger = useMemo(() => {
    if (filterCategory === "ALL") return INITIAL_LEDGER;
    return INITIAL_LEDGER.filter((item) => item.category === filterCategory);
  }, [filterCategory]);

  const totalAmount = useMemo(() => {
    return filteredLedger.reduce((acc, curr) => acc + curr.amount, 0);
  }, [filteredLedger]);

  // Client-side CSV download trigger without external S3
  const exportToCSV = () => {
    const headers = "Transaction ID,Date,Counterparty,Category,Net Amount (USD),Status\n";
    const rows = filteredLedger
      .map(
        (r) =>
          `"${r.id}","${r.date}","${r.counterparty}","${r.category}",${r.amount},"${r.status}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const filename = `financial_ledger_${Date.now()}.csv`;
    link.href = url;
    link.setAttribute("download", filename);
    link.setAttribute("data-testid", "hidden-download-link");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportNotice(`Generated & exported "${filename}" (${filteredLedger.length} rows).`);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">📊</span>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="page-title">
            External Data Sources (Excel & CSV) Studio
          </h1>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            Intermediate
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Master data-driven automation. <strong>Playground 1</strong> guides injecting external spreadsheet rows into form workflows, while <strong>Playground 2</strong> extracts live web tables into CSV/Excel files for downstream validation.
        </p>
      </div>

      {/* ============================================================== */}
      {/* PLAYGROUND 1: DATA INJECTION (READ FROM SHEET -> USE IN SITE)  */}
      {/* ============================================================== */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">📥</span>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Playground 1: Data Injection & Batch Onboarding
              </h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Copy the expected table data below directly into your Excel/Google Sheet, or upload a <code>.csv</code> to batch populate the application.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              data-testid="btn-copy-template-table"
              onClick={copyTableToClipboard}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition flex items-center gap-1.5"
            >
              <span>📋</span>
              <span>{copyFeedback ? "Copied Table TSV!" : "Copy Table to Excel/Sheets"}</span>
            </button>
            <button
              type="button"
              data-testid="btn-load-sample-data"
              onClick={loadSampleIntoImported}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition"
            >
              ⚡ Quick-Load Mock Data
            </button>
          </div>
        </div>

        {/* Expected Template Reference Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300">
            <span>Expected Spreadsheet Format (Template):</span>
            <span className="text-[11px] text-gray-400">Select all rows to copy &amp; paste into Excel</span>
          </div>
          <div className="overflow-x-auto border border-gray-200 dark:border-slate-800 rounded-lg">
            <table className="w-full text-xs text-left" data-testid="template-reference-table">
              <thead className="bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2 px-3">Employee ID</th>
                  <th className="py-2 px-3">Full Name</th>
                  <th className="py-2 px-3">Department</th>
                  <th className="py-2 px-3">Base Salary</th>
                  <th className="py-2 px-3">Tax (%)</th>
                  <th className="py-2 px-3">Email Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800 font-mono text-[11px]">
                {SAMPLE_EMPLOYEES.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-2 px-3 font-bold text-indigo-600 dark:text-indigo-400">{emp.id}</td>
                    <td className="py-2 px-3 font-sans text-gray-800 dark:text-gray-200">{emp.name}</td>
                    <td className="py-2 px-3">{emp.dept}</td>
                    <td className="py-2 px-3">${Number(emp.salary).toLocaleString()}</td>
                    <td className="py-2 px-3">{emp.tax}%</td>
                    <td className="py-2 px-3 text-gray-400">{emp.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Controls: File Uploader or Row-by-Row Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Option A: CSV/TSV File Upload Dropzone */}
          <div className="space-y-3 p-4 rounded-xl bg-gray-50 dark:bg-slate-950/60 border border-gray-200 dark:border-slate-800">
            <h3 className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
              Option A: Upload Created Sheet (.csv / .tsv)
            </h3>
            <p className="text-[11px] text-gray-500">
              Save your sheet as CSV or TSV and drop it here to parse into the UI:
            </p>
            <input
              type="file"
              accept=".csv,.tsv,.txt"
              data-testid="file-upload-input"
              onChange={handleFileUpload}
              className="block w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
            />
          </div>

          {/* Option B: Manual Input Form */}
          <form onSubmit={handleManualSubmit} className="space-y-3 p-4 rounded-xl bg-gray-50 dark:bg-slate-950/60 border border-gray-200 dark:border-slate-800">
            <h3 className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
              Option B: Automated Row-by-Row Form Injection
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <input
                type="text"
                placeholder="ID (e.g. EMP-101)"
                data-testid="input-emp-id"
                value={manualForm.empId}
                onChange={(e) => setManualForm({ ...manualForm, empId: e.target.value })}
                className="px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white outline-none"
              />
              <input
                type="text"
                placeholder="Full Name"
                data-testid="input-emp-name"
                value={manualForm.fullName}
                onChange={(e) => setManualForm({ ...manualForm, fullName: e.target.value })}
                className="px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white outline-none"
              />
              <input
                type="number"
                placeholder="Salary ($)"
                data-testid="input-emp-salary"
                value={manualForm.salary}
                onChange={(e) => setManualForm({ ...manualForm, salary: e.target.value })}
                className="px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white outline-none font-mono"
              />
              <input
                type="email"
                placeholder="Email Address"
                data-testid="input-emp-email"
                value={manualForm.email}
                onChange={(e) => setManualForm({ ...manualForm, email: e.target.value })}
                className="px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white outline-none"
              />
            </div>
            <button
              type="submit"
              data-testid="btn-submit-employee-row"
              className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition"
            >
              Add Single Record
            </button>
          </form>
        </div>

        {/* Live Staging Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              Live Staging Table ({importedRecords.length} records parsed):
            </span>
            {formSubmissionMsg && (
              <span data-testid="staging-status-msg" className="text-emerald-600 dark:text-emerald-400 font-medium">
                ✅ {formSubmissionMsg}
              </span>
            )}
          </div>

          <div className="border border-gray-200 dark:border-slate-800 rounded-lg overflow-x-auto">
            <table className="w-full text-xs text-left" data-testid="staged-records-table">
              <thead className="bg-gray-100 dark:bg-slate-800 text-gray-500 uppercase text-[10px]">
                <tr>
                  <th className="py-2 px-3">ID</th>
                  <th className="py-2 px-3">Name</th>
                  <th className="py-2 px-3">Department</th>
                  <th className="py-2 px-3">Salary</th>
                  <th className="py-2 px-3">Email</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800 font-mono text-[11px]">
                {importedRecords.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-gray-400">
                      No records parsed yet. Upload a CSV file or click &quot;Quick-Load Mock Data&quot; to test.
                    </td>
                  </tr>
                ) : (
                  importedRecords.map((r, i) => (
                    <tr key={`${r.id}-${i}`} data-testid={`staged-row-${r.id}`}>
                      <td className="py-2 px-3 font-bold text-indigo-600">{r.id}</td>
                      <td className="py-2 px-3 font-sans font-medium text-gray-900 dark:text-white">{r.name}</td>
                      <td className="py-2 px-3">{r.dept}</td>
                      <td className="py-2 px-3">${Number(r.salary || 0).toLocaleString()}</td>
                      <td className="py-2 px-3 text-gray-400">{r.email}</td>
                      <td className="py-2 px-3">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
                          Verified
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* PLAYGROUND 2: DATA EXTRACTION (READ FROM SITE -> SAVE SPREADSHEET) */}
      {/* ============================================================== */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">📤</span>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Playground 2: Data Extraction & Export Validation
              </h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Extract real-time financial ledger data. Use Playwright to intercept the generated CSV file download and assert its records against the UI.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              data-testid="select-filter-category"
              className="text-xs px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200 outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="Vendor">Vendor</option>
              <option value="Subscription">Subscription</option>
              <option value="Payroll">Payroll</option>
              <option value="Dividend">Dividend</option>
            </select>

            <button
              type="button"
              data-testid="btn-export-csv"
              onClick={exportToCSV}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center gap-1.5 shadow-xs"
            >
              <span>📥</span>
              <span>Export CSV File</span>
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              Active Transactions ({filteredLedger.length} rows)
            </span>
            <span data-testid="ledger-net-total" className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
              Net Total: ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="border border-gray-200 dark:border-slate-800 rounded-lg overflow-x-auto">
            <table className="w-full text-xs text-left" data-testid="financial-ledger-table">
              <thead className="bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Transaction ID</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Counterparty</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Net Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800 font-mono text-[11px]">
                {filteredLedger.map((row) => (
                  <tr key={row.id} data-testid={`ledger-row-${row.id}`} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-bold text-gray-900 dark:text-white">{row.id}</td>
                    <td className="py-2.5 px-3 text-gray-500">{row.date}</td>
                    <td className="py-2.5 px-3 font-sans font-medium text-gray-800 dark:text-gray-200">{row.counterparty}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300">
                        {row.category}
                      </span>
                    </td>
                    <td className={`py-2.5 px-3 font-semibold ${row.amount >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                      {row.amount < 0 ? `-$${Math.abs(row.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : `+$${row.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        row.status === "Settled"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : row.status === "Pending"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {exportNotice && (
            <div data-testid="export-notification" className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 rounded-lg text-xs text-indigo-900 dark:text-indigo-200">
              📄 {exportNotice}
            </div>
          )}
        </div>
      </div>

      {/* Playwright Code Reference Hints */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WidgetCard
          title="Playwright: Reading Excel/CSV & Injecting Rows"
          testId="widget-data-hint-1"
          docUrl="https://playwright.dev/docs/test-parameterize"
          docTitle="Playwright Parameterized Testing"
          hint={`// 1. Reading CSV or Excel data in test
import fs from 'fs';
import { parse } from 'csv-parse/sync';

const fileContent = fs.readFileSync('test-data/employees.csv', 'utf-8');
const records = parse(fileContent, { columns: true, skip_empty_lines: true });

// 2. Parameterizing test execution
for (const record of records) {
  await page.getByTestId('input-emp-id').fill(record['Employee ID']);
  await page.getByTestId('input-emp-name').fill(record['Full Name']);
  await page.getByTestId('input-emp-salary').fill(record['Base Salary']);
  await page.getByTestId('btn-submit-employee-row').click();
  await expect(page.getByTestId(\`staged-row-\${record['Employee ID']}\`)).toBeVisible();
}`}
        >
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Read files in Node.js before or during tests, or use <code>setInputFiles</code> to upload full CSVs directly to the dropzone.
          </p>
        </WidgetCard>

        <WidgetCard
          title="Playwright: Intercepting & Asserting Downloads"
          testId="widget-data-hint-2"
          docUrl="https://playwright.dev/docs/downloads"
          docTitle="Playwright Downloads API"
          hint={`// 1. Start waiting for file download event before clicking
const downloadPromise = page.waitForEvent('download');
await page.getByTestId('btn-export-csv').click();
const download = await downloadPromise;

// 2. Save downloaded file and assert content
const path = await download.path();
const content = fs.readFileSync(path, 'utf-8');
expect(content).toContain('Transaction ID,Date,Counterparty');
expect(content).toContain('AWS Cloud Infrastructure');`}
        >
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <code>page.waitForEvent(&apos;download&apos;)</code> reliably captures client-generated blobs and server CSV attachments without flaky OS download prompts.
          </p>
        </WidgetCard>
      </div>
    </div>
  );
}
