"use client";
import React, { useState } from "react";

interface PlaywrightDocLinkProps {
  url: string;
  title?: string;
}

export function PlaywrightDocLink({ url, title = "Official Playwright Documentation" }: PlaywrightDocLinkProps) {
  return (
    <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
      <span className="text-gray-400 dark:text-gray-500">Want deeper details?</span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium inline-flex items-center gap-1 hover:underline"
        data-testid="link-official-doc"
      >
        <span>📖 {title}</span>
        <span>↗</span>
      </a>
    </div>
  );
}

interface WidgetCardProps {
  title: string;
  testId?: string;
  children: React.ReactNode;
  hint: string;
  docUrl?: string;
  docTitle?: string;
}

export function WidgetCard({
  title,
  testId,
  children,
  hint,
  docUrl,
  docTitle,
}: WidgetCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex flex-col justify-between transition-colors duration-150"
      data-testid={testId}
    >
      <div>
        <h3 className="font-semibold text-gray-800 dark:text-slate-100 text-sm mb-3 border-b border-gray-100 dark:border-slate-800 pb-2">
          {title}
        </h3>
        {children}
        <div className="mt-3">
          <button
            onClick={() => setOpen((v) => !v)}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            data-testid="hint-toggle"
          >
            {open ? "🙈 Hide hint" : "💡 Show Playwright code"}
          </button>
          {open && (
            <pre className="mt-2 p-3 bg-slate-950 dark:bg-black text-green-400 dark:text-green-300 text-xs rounded-lg overflow-x-auto font-mono leading-relaxed border border-slate-800">
              {hint}
            </pre>
          )}
        </div>
      </div>
      {docUrl && <PlaywrightDocLink url={docUrl} title={docTitle} />}
    </div>
  );
}
