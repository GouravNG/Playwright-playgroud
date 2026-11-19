"use client";
import { useState } from "react";

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

export default function FilesPage() {
  const [singleFileName, setSingleFileName] = useState<string | null>(null);
  const [multiFiles, setMultiFiles] = useState<string[]>([]);
  const [dropzoneFile, setDropzoneFile] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleDownloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,ID,Product,Amount,Date\nORD-101,Headphones,79.99,2024-11-15\nORD-102,Running Shoes,59.99,2024-11-14";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "orders-export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <h2 className="font-bold text-amber-800 dark:text-amber-300 mb-1">📂 File Operations</h2>
        <p className="text-sm text-amber-700 dark:text-amber-400">
          Practice <code>locator.setInputFiles()</code> for single and multiple files, handle dynamic file choosers (<code>page.waitForEvent(&apos;filechooser&apos;)</code>), and verify file downloads with <code>page.waitForEvent(&apos;download&apos;)</code>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Single File Upload */}
        <WidgetCard title="1. Single File Upload (KYC ID Proof)" testId="widget-single-upload"
          hint={`// Set single file on input[type=file]\nawait page.getByTestId('input-kyc-doc').setInputFiles('tests/fixtures/sample-id.pdf');\nawait expect(page.getByTestId('uploaded-single-name')).toHaveText('sample-id.pdf');`}>
          <div className="space-y-3">
            <label className="text-xs font-medium text-gray-700 dark:text-slate-300 block">Upload ID Document (PDF / Image)</label>
            <input
              type="file"
              data-testid="input-kyc-doc"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setSingleFileName(file.name);
              }}
              className="text-xs text-gray-600 dark:text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-indigo-50 dark:file:bg-indigo-950/60 file:text-indigo-700 dark:file:text-indigo-300 hover:file:bg-indigo-100"
            />
            {singleFileName && (
              <div className="text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 p-2 rounded border border-emerald-200 dark:border-emerald-800">
                Uploaded: <strong data-testid="uploaded-single-name">{singleFileName}</strong>
              </div>
            )}
          </div>
        </WidgetCard>

        {/* Multi-File Upload */}
        <WidgetCard title="2. Multi-File Upload" testId="widget-multi-upload"
          hint={`// Set multiple files array\nawait page.getByTestId('input-multi-docs').setInputFiles([\n  'tests/fixtures/doc1.pdf',\n  'tests/fixtures/doc2.pdf'\n]);\nawait expect(page.getByTestId('uploaded-multi-list')).toContainText('doc1.pdf');`}>
          <div className="space-y-3">
            <label className="text-xs font-medium text-gray-700 dark:text-slate-300 block">Select Multiple Invoices / Reports</label>
            <input
              type="file"
              multiple
              data-testid="input-multi-docs"
              onChange={(e) => {
                if (e.target.files) {
                  setMultiFiles(Array.from(e.target.files).map((f) => f.name));
                }
              }}
              className="text-xs text-gray-600 dark:text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-indigo-50 dark:file:bg-indigo-950/60 file:text-indigo-700 dark:file:text-indigo-300 hover:file:bg-indigo-100"
            />
            {multiFiles.length > 0 && (
              <div data-testid="uploaded-multi-list" className="text-xs space-y-1 bg-gray-50 dark:bg-slate-900 p-2 rounded border border-gray-200 dark:border-slate-700">
                <span className="font-semibold text-gray-600 dark:text-slate-400">Selected {multiFiles.length} files:</span>
                {multiFiles.map((n, i) => (
                  <div key={i} className="text-indigo-600 dark:text-indigo-400 font-mono text-[11px]">📄 {n}</div>
                ))}
              </div>
            )}
          </div>
        </WidgetCard>

        {/* Dynamic File Chooser via Click */}
        <WidgetCard title="3. Dynamic File Chooser / Dropzone Area" testId="widget-filechooser-dropzone"
          hint={`// Handle custom buttons that spawn file chooser dialog\nconst fileChooserPromise = page.waitForEvent('filechooser');\nawait page.getByTestId('dropzone-click-area').click();\nconst fileChooser = await fileChooserPromise;\nawait fileChooser.setFiles('tests/fixtures/receipt.png');\nawait expect(page.getByTestId('dropzone-file-name')).toHaveText('receipt.png');`}>
          <div className="space-y-3">
            <input
              type="file"
              id="hidden-drop-input"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  setDropzoneFile(f.name);
                  if (f.type.startsWith("image/")) {
                    setImagePreview(URL.createObjectURL(f));
                  }
                }
              }}
            />
            <div
              data-testid="dropzone-click-area"
              onClick={() => document.getElementById("hidden-drop-input")?.click()}
              className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-5 text-center cursor-pointer hover:border-indigo-500 bg-gray-50/50 dark:bg-slate-900/50 hover:bg-indigo-50/20 transition-all"
            >
              <span className="text-2xl block mb-1">📤</span>
              <p className="text-xs text-gray-600 dark:text-slate-300 font-medium">Click here to open File Dialog or drop file</p>
              <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1">Accepts images & receipts</p>
            </div>
            {dropzoneFile && (
              <div className="text-xs bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 p-2 rounded border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
                <span>File: <strong data-testid="dropzone-file-name">{dropzoneFile}</strong></span>
              </div>
            )}
            {imagePreview && (
              <div className="p-2 border border-gray-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Uploaded receipt preview" data-testid="receipt-preview-img" className="max-h-24 rounded" />
              </div>
            )}
          </div>
        </WidgetCard>

        {/* File Download Verification */}
        <WidgetCard title="4. File Download & Verification" testId="widget-file-download"
          hint={`// Wait for browser download event and inspect saved file\nconst downloadPromise = page.waitForEvent('download');\nawait page.getByTestId('btn-download-csv').click();\nconst download = await downloadPromise;\nexpect(download.suggestedFilename()).toBe('orders-export.csv');\nconst path = await download.path();\nconsole.log('Saved to:', path);`}>
          <div className="space-y-3">
            <p className="text-xs text-gray-600 dark:text-slate-400">
              Trigger instant client-side file export for orders data:
            </p>
            <button
              onClick={handleDownloadCSV}
              data-testid="btn-download-csv"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
            >
              📥 Download Orders CSV (orders-export.csv)
            </button>
            <p className="text-[11px] text-gray-400 dark:text-slate-500">
              Playwright intercepts the download without needing OS native folder prompts.
            </p>
          </div>
        </WidgetCard>
      </div>
    </div>
  );
}
