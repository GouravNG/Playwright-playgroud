"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useProgress } from "@/context/ProgressContext";

export interface NavItem {
  href: string;
  label: string;
  badge: "Beginner" | "Intermediate" | "Advanced" | "Mastery" | "";
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: "Overview & Reference",
    items: [
      { href: "/", label: "🏠 Home", badge: "" },
      { href: "/cheatsheet", label: "📋 Cheat Sheet", badge: "" },
    ],
  },
  {
    title: "Beginner Fundamentals",
    items: [
      { href: "/locators", label: "📌 Locators Lab", badge: "Beginner" },
      { href: "/actions", label: "🖱️ Actions Arena", badge: "Beginner" },
      { href: "/assertions", label: "✅ Assertions Studio", badge: "Beginner" },
      { href: "/forms", label: "📝 Forms & Inputs", badge: "Beginner" },
    ],
  },
  {
    title: "Intermediate Workflows",
    items: [
      { href: "/tables", label: "📊 Tables & Grids", badge: "Intermediate" },
      { href: "/dialogs", label: "🪟 Dialogs & Popups", badge: "Intermediate" },
      { href: "/navigation", label: "🔀 Navigation & Tabs", badge: "Intermediate" },
      { href: "/network", label: "🌐 Network Mocking", badge: "Intermediate" },
      { href: "/files", label: "📂 File Operations", badge: "Intermediate" },
      { href: "/file-tree", label: "🗂️ File Tree Explorer", badge: "Intermediate" },
      { href: "/data-driven", label: "📊 Data-Driven (Excel/CSV)", badge: "Intermediate" },
      { href: "/kanban", label: "↕️ Kanban Board", badge: "Intermediate" },
    ],
  },
  {
    title: "Advanced Scenarios",
    items: [
      { href: "/frames", label: "🖼️ Frames & Iframes", badge: "Advanced" },
      { href: "/shadow-dom", label: "⏱️ Shadow DOM Studio", badge: "Advanced" },
      { href: "/visual", label: "🎨 Visual Testing", badge: "Advanced" },
      { href: "/i18n", label: "🌐 Multi-Language & RTL", badge: "Advanced" },
      { href: "/accessibility", label: "♿ Accessibility", badge: "Advanced" },
      { href: "/slow-loading", label: "⏳ Slow Loading & Async", badge: "Advanced" },
      { href: "/advanced", label: "⚡ Advanced Topics", badge: "Advanced" },
    ],
  },
  {
    title: "Mastery & Production",
    items: [
      { href: "/challenges", label: "🎯 Advanced Challenges", badge: "Mastery" },
      { href: "/captcha", label: "🤖 CAPTCHA & Security", badge: "Mastery" },
      { href: "/realtime-feed", label: "🔔 Real-Time & SSE Feed", badge: "Mastery" },
      { href: "/test-runner", label: "🧪 Test Runner & Hooks", badge: "Mastery" },
      { href: "/cli-codegen", label: "⚙️ Codegen & CLI Flags", badge: "Mastery" },
      { href: "/mastery", label: "🎓 Mastery & Edge Cases", badge: "Mastery" },
    ],
  },
];

const badgeColors: Record<string, string> = {
  Beginner: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  Intermediate: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  Advanced: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  Mastery: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
};

export default function Sidebar() {
  const pathname = usePathname();
  const { mobileMenuOpen, setMobileMenuOpen } = useTheme();
  const { isCompleted, getCompletionPercentage } = useProgress();

  const progress = getCompletionPercentage();

  return (
    <>
      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          data-testid="mobile-menu-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar container */}
      <aside
        data-testid="app-sidebar"
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-64 bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-white flex flex-col h-full overflow-y-auto shrink-0
          transition-transform duration-200 ease-in-out border-r border-gray-200 dark:border-slate-800
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎭</span>
            <div>
              <div className="font-bold text-sm leading-tight text-gray-900 dark:text-white">Playwright</div>
              <div className="text-xs text-indigo-600 dark:text-indigo-400">Practice & Reference</div>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            data-testid="btn-close-mobile-menu"
            className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-1"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Progress Bar Widget in Sidebar */}
        <div className="px-4 py-3 bg-gray-200/60 dark:bg-slate-950/60 border-b border-gray-200 dark:border-slate-800">
          <div className="flex justify-between items-center text-[11px] mb-1.5">
            <span className="text-gray-600 dark:text-gray-400 font-medium">Curriculum Progress</span>
            <span className="font-mono text-emerald-400 font-bold">{progress}%</span>
          </div>
          <div className="w-full bg-gray-300 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <nav className="flex-1 py-3 overflow-y-auto space-y-4">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="px-4 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {group.title}
              </div>
              <div>
                {group.items.map((s) => {
                  const active = pathname === s.href;
                  const completed = isCompleted(s.href);
                  return (
                    <Link
                      key={s.href}
                      href={s.href}
                      onClick={() => setMobileMenuOpen(false)}
                      data-testid={`nav-${s.href.replace("/", "") || "home"}`}
                      className={`flex items-center justify-between px-4 py-1.5 text-xs transition-colors ${
                        active
                          ? "bg-indigo-600 text-white font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {completed ? (
                          <span className="text-emerald-400 text-xs shrink-0">✓</span>
                        ) : (
                          <span className="w-2 h-2 rounded-full border border-gray-400 dark:border-gray-600 shrink-0" />
                        )}
                        <span className="truncate">{s.label}</span>
                      </div>
                      {s.badge && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium shrink-0 ${badgeColors[s.badge]}`}>
                          {s.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
