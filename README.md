# 🎭 Playwright Interactive Practice & Learning Site

A comprehensive, self-hosted, component-based automation playground designed specifically for hands-on learning and reference with **Microsoft Playwright**.

---

## 🚀 Quick Start

### 1. Launch the Application

```powershell
Set-Location "C:\Users\goura\Desktop\ui_auto\demo-site"
npm run dev
```

Visit the application dashboard at **[http://localhost:3000](http://localhost:3000)**.

### 2. Run Playwright Against the Playground

Install Playwright if not already configured in your test project:

```powershell
npm init playwright@latest
```

Execute tests using UI Mode or Headed browser:

```powershell
# Interactive visual test runner
npx playwright test --ui

# Auto-generate tests via recording
npx playwright codegen http://localhost:3000
```

---

## 🗺️ Curriculum & Practice Sections

| Route | Section | Core Topics Covered |
|---|---|---|
| `/locators` | 📌 **Locators Lab** | `getByRole`, `getByText`, `getByLabel`, `getByPlaceholder`, `getByTestId`, chaining, filtering, `.first()`, `.nth()` |
| `/actions` | 🖱️ **Actions Arena** | `click()`, `dblclick()`, right click, `hover()`, modifier keys, `pressSequentially()`, `scrollIntoViewIfNeeded()` |
| `/assertions` | ✅ **Assertions Studio** | `toBeVisible()`, `toBeEnabled()`, `toBeChecked()`, `toHaveText()`, `toHaveCount()`, `expect.soft()`, negative matchers |
| `/forms` | 📝 **Forms & Inputs** | Complete checkout flow, native select, custom autocomplete, range slider, date pickers |
| `/tables` | 📊 **Tables & Grids** | Dynamic tables, sorting, pagination, search filtering, row selection, inline editing |
| `/dialogs` | 🪟 **Dialogs & Popups** | Native alerts, confirms, prompts (`page.on('dialog')`), modals, drawers, auto-dismiss toasts |
| `/navigation` | 🔀 **Navigation & Routing** | Multi-page routing, browser history (`goBack`, `goForward`), async redirects, hash anchors, 404 |
| `/network` | 🌐 **Network Mocking** | `page.route()`, synthetic payload fulfillment, 500 error simulation, auth header injection, `route.abort()` |
| `/files` | 📂 **File Operations** | Single & multi-file upload (`setInputFiles`), dynamic file choosers, client download verification |
| `/frames` | 🖼️ **Frames & Shadow DOM** | Embedded payment iframe (`frameLocator`), nested frames, automatic Shadow DOM piercing |
| `/visual` | 🎨 **Visual Regression** | Full-page baseline comparison, element snapshots, dynamic element masking, PDF generation |
| `/test-runner` | 🧪 **Test Runner & Hooks** | `beforeAll`, `beforeEach`, `afterEach`, `describe.serial`, `skip`, `fixme`, tags (`@smoke`), `test.step()` |
| `/cli-codegen` | ⚙️ **Codegen & CLI Flags** | `playwright codegen` with device/auth emulation, comprehensive `playwright.config.ts` breakdown, all execution flags, sharding, UI Mode & Trace Viewer |
| `/mastery` | 🎓 **Mastery & Edge Cases** | `page.on('console')`, `page.on('pageerror')`, Cookie manipulation & GDPR bypass, offline mode (`context.setOffline`), locale & timezone emulation, custom fixtures |
| `/cheatsheet` | 📋 **Cheat Sheet** | Complete reference for all CLI commands, modern locators, assertions, and config templates |

---

## 🧪 Sample Spec Files Included

Sample tests are located in `tests/`:
- **Interactive Practice Widgets**: Every single concept has a live interactive exercise with pre-configured assertions.
- **Collapsible Code Hints**: Click **"💡 Show Playwright code"** on any widget to view the exact production Playwright test syntax.
- **Direct Official Documentation Links**: Every exercise links to the specific Microsoft Playwright API page.
- **Curriculum Progress Tracker**: Check off topics as you practice; progress is tracked persistently in your browser with real-time percentages.
- **Dark and Light Theme**: Toggle between clean light mode and dark theme (`🌙 / ☀️`).
- **Mobile Responsive Web Layout**: Complete slide-out navigation menu for seamless practice on phones and tablet viewports.
- **Sample Test Suite**: 5+ pre-written Playwright test specs ready to run against your local server.
