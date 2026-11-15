"use client";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

const titles: Record<string, string> = {
  "/": "Home — Playwright Practice Site",
  "/locators": "📌 Locators Lab",
  "/actions": "🖱️ Actions Arena",
  "/assertions": "✅ Assertions Studio",
  "/forms": "📝 Forms & Inputs",
  "/tables": "📊 Tables & Grids",
  "/dialogs": "🪟 Dialogs & Popups",
  "/navigation": "🔀 Navigation & Routing",
  "/network": "🌐 Network & API Mocking",
  "/files": "📂 File Operations",
  "/frames": "🖼️ Frames & Shadow DOM",
  "/visual": "🎨 Visual Testing",
  "/accessibility": "♿ Accessibility",
  "/advanced": "⚡ Advanced Topics",
  "/test-runner": "🧪 Test Runner & Hooks",
  "/cli-codegen": "⚙️ Codegen & CLI Flags",
  "/mastery": "🎓 Playwright Mastery",
  "/cheatsheet": "📋 Cheat Sheet",
};

export default function TopBar() {
  const pathname = usePathname();
  const title = titles[pathname] ?? "Playwright Practice Site";
  const { theme, toggleTheme, toggleMobileMenu } = useTheme();

  return (
    <header className="h-14 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center px-4 sm:px-6 gap-3 shrink-0 transition-colors">
      {/* Mobile Hamburger toggle */}
      <button
        onClick={toggleMobileMenu}
        data-testid="btn-hamburger-menu"
        className="md:hidden text-gray-600 dark:text-gray-300 hover:text-indigo-600 p-1 rounded focus:outline-none"
        aria-label="Toggle navigation menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <h1 className="font-semibold text-gray-800 dark:text-slate-100 text-xs sm:text-sm truncate max-w-[200px] sm:max-w-none">
        {title}
      </h1>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {/* Dark/Light mode switcher */}
        <button
          onClick={toggleTheme}
          data-testid="btn-toggle-dark-mode"
          aria-label="Toggle color theme"
          className="p-1.5 text-xs bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
          title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          <span>{theme === "light" ? "🌙" : "☀️"}</span>
          <span className="hidden sm:inline font-medium text-[11px] capitalize">{theme}</span>
        </button>

        <a
          href="https://playwright.dev/docs/intro"
          target="_blank"
          rel="noreferrer"
          data-testid="docs-link"
          className="hidden sm:inline-flex text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
        >
          Docs ↗
        </a>
        <span className="text-[10px] sm:text-xs bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded font-mono border border-indigo-200 dark:border-indigo-800 truncate">
          npx playwright test
        </span>
      </div>
    </header>
  );
}
