"use client";
import Link from "next/link";
import { useProgress } from "@/context/ProgressContext";

const sections = [
  {
    href: "/locators",
    icon: "📌",
    title: "Locators Lab",
    desc: "Practice all 10+ Playwright locator strategies on a real e-commerce product page.",
    badge: "Beginner",
    topics: ["getByRole", "getByText", "getByLabel", "getByTestId", "filter", "nth"],
    color: "border-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    badgeColor: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
  },
  {
    href: "/actions",
    icon: "🖱️",
    title: "Actions Arena",
    desc: "Click, hover, type, scroll and use keyboard shortcuts on interactive product widgets.",
    badge: "Beginner",
    topics: ["click", "hover", "fill", "keyboard", "scroll", "pressSequentially"],
    color: "border-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    badgeColor: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
  },
  {
    href: "/assertions",
    icon: "✅",
    title: "Assertions Studio",
    desc: "Every expect() matcher demonstrated live — visibility, text, value, count and more.",
    badge: "Beginner",
    topics: ["toBeVisible", "toHaveText", "toBeChecked", "toHaveCount", "expect.soft"],
    color: "border-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    badgeColor: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
  },
  {
    href: "/forms",
    icon: "📝",
    title: "Forms & Inputs",
    desc: "Complete checkout form with text, radio, checkbox, select, date picker and slider.",
    badge: "Beginner",
    topics: ["fill", "check", "selectOption", "setInputFiles", "date picker", "slider"],
    color: "border-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    badgeColor: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
  },
  {
    href: "/tables",
    icon: "📊",
    title: "Tables & Grids",
    desc: "Order history table with sort, pagination, filter, inline edit and row selection.",
    badge: "Intermediate",
    topics: ["locator chaining", "toHaveCount", "sort assertion", "pagination", "inline edit"],
    color: "border-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  },
  {
    href: "/dialogs",
    icon: "🪟",
    title: "Dialogs & Popups",
    desc: "JS alerts, confirms, prompts, modals, toasts, tooltips and new-tab links.",
    badge: "Intermediate",
    topics: ["page.on('dialog')", "modal", "toast", "tooltip", "waitForEvent('page')"],
    color: "border-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  },
  {
    href: "/navigation",
    icon: "🔀",
    title: "Navigation & Routing",
    desc: "Multi-page store navigation, back/forward, redirects, anchors and 404 pages.",
    badge: "Intermediate",
    topics: ["goto", "goBack", "waitForURL", "toHaveURL", "new tab"],
    color: "border-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  },
  {
    href: "/network",
    icon: "🌐",
    title: "Network & API Mocking",
    desc: "Intercept real API calls, mock responses, simulate errors and replay HAR files.",
    badge: "Intermediate",
    topics: ["page.route", "route.fulfill", "route.abort", "waitForResponse", "HAR"],
    color: "border-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  },
  {
    href: "/files",
    icon: "📂",
    title: "File Operations",
    desc: "Single & multi-file upload, drag-and-drop dropzone and file download handling.",
    badge: "Intermediate",
    topics: ["setInputFiles", "filechooser", "waitForEvent('download')"],
    color: "border-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  },
  {
    href: "/file-tree",
    icon: "🗂️",
    title: "Hierarchical File Tree",
    desc: "Multi-level directory tree: ARIA treeitem assertions, deep search filter, and recursive folder toggle.",
    badge: "Intermediate",
    topics: ["role='treeitem'", "aria-expanded", "deep search", "recursive expansion", "parent locators"],
    color: "border-emerald-500",
    bgColor: "bg-emerald-50/50 dark:bg-emerald-950/20",
    badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
  },
  {
    href: "/data-driven",
    icon: "📊",
    title: "Data-Driven (Excel & CSV)",
    desc: "Dual playground: import/parse external sheets into UI forms & extract live financial ledger data to downloadable CSVs.",
    badge: "Intermediate",
    topics: ["data parameterization", "CSV parsing", "waitForEvent('download')", "copy template", "staging table"],
    color: "border-teal-500",
    bgColor: "bg-teal-50/50 dark:bg-teal-950/20",
    badgeColor: "bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300",
  },
  {
    href: "/frames",
    icon: "🖼️",
    title: "Frames & Shadow DOM",
    desc: "Payment iframe, nested frames, and auto-piercing Shadow DOM custom elements.",
    badge: "Advanced",
    topics: ["frameLocator", "nested frames", "Shadow DOM", "web components"],
    color: "border-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  },
  {
    href: "/shadow-dom",
    icon: "⏱️",
    title: "Shadow DOM & Micro-Frontends",
    desc: "Open vs. closed shadow roots, web components, encapsulation boundaries, and embedded SVG vector targets.",
    badge: "Advanced",
    topics: ["auto-piercing", "closed shadow roots", "page.evaluate", "web components", "nested SVG"],
    color: "border-purple-500",
    bgColor: "bg-purple-50/50 dark:bg-purple-950/20",
    badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
  },
  {
    href: "/visual",
    icon: "🎨",
    title: "Visual Testing",
    desc: "Screenshot baselines, pixel diffs, masked regions and PDF generation.",
    badge: "Advanced",
    topics: ["toHaveScreenshot", "mask", "maxDiffPixelRatio", "page.pdf"],
    color: "border-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  },
  {
    href: "/i18n",
    icon: "🌐",
    title: "Multi-Language & RTL Layout",
    desc: "Global banking interface with bidirectional text, RTL mirroring (Arabic), and locale emulation.",
    badge: "Advanced",
    topics: ["dir='rtl'", "locale emulation", "i18n translation", "visual regression"],
    color: "border-cyan-500",
    bgColor: "bg-cyan-50/50 dark:bg-cyan-950/20",
    badgeColor: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300",
  },
  {
    href: "/accessibility",
    icon: "♿",
    title: "Accessibility",
    desc: "axe-core audit, keyboard navigation, WCAG compliance and ARIA role practice.",
    badge: "Advanced",
    topics: ["AxeBuilder", "keyboard nav", "WCAG", "getByRole audit"],
    color: "border-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  },
  {
    href: "/slow-loading",
    icon: "⏳",
    title: "Slow Loading & Async",
    desc: "Healthcare diagnostic portal: heavy API latency, skeleton loaders, polling progress and delayed elements.",
    badge: "Advanced",
    topics: ["waitForResponse", "auto-waiting", "timeout tuning", "polling", "delayed DOM"],
    color: "border-teal-400",
    bgColor: "bg-teal-50 dark:bg-teal-950/20",
    badgeColor: "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300",
  },
  {
    href: "/realtime-feed",
    icon: "🔔",
    title: "Real-Time Streaming & SSE",
    desc: "Live Server-Sent Events market book, continuous push streams, and asynchronous toast alert handling.",
    badge: "Mastery",
    topics: ["Server-Sent Events", "unsolicited push", "DOM stabilization", "auto-waiting"],
    color: "border-rose-500",
    bgColor: "bg-rose-50/50 dark:bg-rose-950/20",
    badgeColor: "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300",
  },
  {
    href: "/challenges",
    icon: "🎯",
    title: "Advanced Challenges Arena",
    desc: "Real-world edge cases: Canvas vector signing, cascading dropdowns, infinite scroll, 6-box OTP, multi-tab sync, flaky DOM race conditions and rich text editors.",
    badge: "Mastery",
    topics: ["canvas drawing", "cascading combobox", "infinite scroll", "OTP keyboard", "multi-tab broadcast", "flaky DOM", "contenteditable"],
    color: "border-fuchsia-500",
    bgColor: "bg-fuchsia-50/50 dark:bg-fuchsia-950/20",
    badgeColor: "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/50 dark:text-fuchsia-300",
  },
  {
    href: "/captcha",
    icon: "🤖",
    title: "Dynamic CAPTCHA Sandbox",
    desc: "Simulate anti-bot security challenges: regex arithmetic extraction, slider puzzle alignment, and image/tile matching grids.",
    badge: "Mastery",
    topics: ["regex evaluation", "dynamic math", "dragTo / mouse moves", "bounding box", "grid selection"],
    color: "border-rose-500",
    bgColor: "bg-rose-50/50 dark:bg-rose-950/20",
    badgeColor: "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300",
  },
  {
    href: "/kanban",
    icon: "↕️",
    title: "Interactive Kanban Board",
    desc: "Trello-style drag and drop board: card transfer across columns, dynamic counts, DOM re-attachment, and action logs.",
    badge: "Intermediate",
    topics: ["dragTo", "cross-container drop", "count assertions", "DOM re-attachment", "HTML5 drag"],
    color: "border-blue-500",
    bgColor: "bg-blue-50/50 dark:bg-blue-950/20",
    badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
  },
  {
    href: "/advanced",
    icon: "⚡",
    title: "Advanced Topics",
    desc: "Banking portal: auth state, POM, fixtures, mobile emulation, WebSockets and more.",
    badge: "Advanced",
    topics: ["storageState", "POM", "fixtures", "mobile", "WebSocket", "geolocation"],
    color: "border-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  },
  {
    href: "/test-runner",
    icon: "🧪",
    title: "Test Runner & Hooks",
    desc: "beforeAll, beforeEach, describe.serial, skip, fixme, tags (@smoke), and test.step().",
    badge: "Mastery",
    topics: ["beforeAll", "afterEach", "test.describe", "skip & fixme", "@tags", "test.step"],
    color: "border-emerald-500",
    bgColor: "bg-emerald-50/50 dark:bg-emerald-950/20",
    badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
  },
  {
    href: "/cli-codegen",
    icon: "⚙️",
    title: "Codegen & CLI Flags",
    desc: "playwright codegen, full playwright.config.ts breakdown, and all CLI execution flags.",
    badge: "Mastery",
    topics: ["codegen", "config options", "CLI flags", "sharding", "Trace Viewer", "--ui"],
    color: "border-cyan-500",
    bgColor: "bg-cyan-50/50 dark:bg-cyan-950/20",
    badgeColor: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300",
  },
  {
    href: "/mastery",
    icon: "🎓",
    title: "Mastery & Edge Cases",
    desc: "page.on('console'), page.on('pageerror'), Cookie/GDPR manipulation, and offline simulation.",
    badge: "Mastery",
    topics: ["console events", "pageerror", "cookies", "offline mode", "locale emulation"],
    color: "border-amber-500",
    bgColor: "bg-amber-50/50 dark:bg-amber-950/20",
    badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
  },
  {
    href: "/cheatsheet",
    icon: "📋",
    title: "Cheat Sheet",
    desc: "Quick reference for every Playwright API, CLI command and config option.",
    badge: "",
    topics: ["locators", "actions", "assertions", "config", "CLI", "Trace Viewer"],
    color: "border-gray-300 dark:border-gray-700",
    bgColor: "bg-gray-50 dark:bg-slate-900",
    badgeColor: "",
  },
];

export default function HomePage() {
  const { isCompleted, toggleSection, getCompletionPercentage, resetProgress } = useProgress();
  const percentage = getCompletionPercentage();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Hero Banner */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl text-white shadow-md">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold mb-1">🎭 Playwright Practice & Learning Sandbox</h1>
            <p className="text-indigo-100 text-xs sm:text-sm max-w-xl">
              Your self-contained automation playground with interactive widgets, mobile support, dark mode, official doc links, and real-time progress tracking.
            </p>
          </div>
          <div className="w-full md:w-auto bg-indigo-900/60 backdrop-blur-xs p-3 rounded-xl border border-indigo-400/20">
            <div className="flex items-center justify-between gap-4 mb-1.5">
              <span className="text-xs text-indigo-200">Curriculum Completion:</span>
              <span className="font-mono font-bold text-emerald-300 text-xs">{percentage}%</span>
            </div>
            <div className="w-full md:w-48 bg-indigo-950 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            {percentage > 0 && (
              <button
                onClick={resetProgress}
                className="text-[10px] text-indigo-300 hover:text-white underline mt-2 block"
              >
                Reset Progress
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((s) => {
          const completed = isCompleted(s.href);
          return (
            <div
              key={s.href}
              data-testid={`section-card-${s.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`}
              className={`group relative flex flex-col justify-between border-l-4 ${s.color} ${s.bgColor} rounded-xl p-4 hover:shadow-md transition-all hover:-translate-y-0.5 border border-gray-200/60 dark:border-slate-800`}
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-2xl">{s.icon}</span>
                  <div className="flex items-center gap-2">
                    {s.href !== "/cheatsheet" && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleSection(s.href);
                        }}
                        className={`text-[11px] px-2 py-0.5 rounded transition-colors ${
                          completed
                            ? "bg-emerald-600 text-white font-medium"
                            : "bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-emerald-100 hover:text-emerald-800"
                        }`}
                        title="Mark section completed"
                      >
                        {completed ? "✓ Done" : "Mark Done"}
                      </button>
                    )}
                    {s.badge && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.badgeColor}`}>
                        {s.badge}
                      </span>
                    )}
                  </div>
                </div>
                <Link href={s.href} className="block">
                  <h2 className="font-semibold text-gray-800 dark:text-slate-100 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-sm">
                    {s.title}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">{s.desc}</p>
                </Link>
              </div>

              <div className="flex flex-wrap gap-1 mt-auto pt-2 border-t border-gray-200/40 dark:border-slate-800/60">
                {s.topics.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] bg-white/80 dark:bg-slate-900 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded font-mono border border-gray-200 dark:border-slate-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
