# 🚀 Future Feature & Automation Ideas

This document outlines upcoming frontend scenarios and complex UI patterns planned for future expansion of the **Playwright Practice & Reference Site**.

---

## 1. 🤖 Dynamic CAPTCHA & Math Puzzle Sandbox (Completed ✅ - `/captcha`)
* **Concept:** Interactive security challenges often found in banking and e-commerce portals.
* **Frontend Components:**
  * Dynamic math questions (e.g., `What is 18 + 7?` generated randomly per session).
  * Horizontal slider puzzle piece that must be dragged into a target cutout.
  * Image / color matching selection grid.
* **Playwright Learning Objectives:**
  * Reading dynamic text using regular expressions (`page.getByTestId('captcha-question').textContent()`).
  * Evaluating arithmetic in test scripts and filling computed answers dynamically.
  * Drag-to-match slider mechanics using `page.mouse` vector actions and bounding boxes.

---

## 2. ↕️ Interactive Kanban Board (Trello-Style Drag-and-Drop) (Completed ✅ - `/kanban`)
* **Concept:** Multi-column project management board with draggable cards.
* **Frontend Components:**
  * Three status columns: `Backlog`, `In Progress`, and `Done`.
  * Draggable task cards with tags, priority flags, and assignees.
  * Column headers with dynamic counter badges.
* **Playwright Learning Objectives:**
  * Using `locator.dragTo()` to move items across container boundaries.
  * Validating DOM detachment from source list and re-attachment into target list.
  * Asserting column item count updates (`expect(locator).toHaveCount(n)`).

---

## 3. ⏱️ Micro-Frontend / Custom Shadow DOM Trees (Closed vs. Open) (Completed ✅ - `/shadow-dom`)
* **Concept:** Modern embedded widgets (similar to Salesforce Lightning, Shopify apps, or Zendesk chat embeds).
* **Frontend Components:**
  * Open Shadow Root custom element (standard auto-pierced).
  * Closed Shadow Root custom element demonstrating encapsulation limits.
  * Nested SVG / Canvas vector graphics inside shadow boundaries.
* **Playwright Learning Objectives:**
  * Understanding when Playwright auto-pierces open shadow roots vs. when JavaScript evaluation (`page.evaluate()`) is necessary for closed roots.
  * Interacting with scoped CSS and custom Web Components.

---

## 4. 🗂️ Hierarchical Accordions & Nested File Tree Explorer (Completed ✅ - `/file-tree`)
* **Concept:** Deeply nested directory structures (like AWS S3 browser or VS Code file explorer).
* **Frontend Components:**
  * Expandable / collapsible multi-level folder nodes.
  * ARIA-compliant attributes (`aria-expanded="true"`, `role="treeitem"`).
  * Search filter that auto-expands matching deep paths.
* **Playwright Learning Objectives:**
  * Relative locator chaining and parent traversals (`locator.locator('..')`).
  * Asserting accessibility state transitions (`toHaveAttribute('aria-expanded', 'true')`).
  * Testing deep path selection and recursive folder expansion.

---

## 5. 🔔 Live WebSocket / Server-Sent Events (SSE) Live Feed (Completed ✅ - `/realtime-feed`)
* **Concept:** Real-time stock exchange order book or emergency healthcare triage dispatch.
* **Frontend Components:**
  * Real-time streaming updates pushed without user interaction.
  * Live alert toasts triggered by background push streams.
* **Playwright Learning Objectives:**
  * Testing live WebSocket traffic with `page.on('websocket')`.
  * Waiting for unsolicited push notifications to stabilize before asserting UI state.

---

## 6. 🌐 Multi-Language / Internationalization (i18n) & RTL Layout (Completed ✅ - `/i18n`)
* **Concept:** Global multi-language selector with full Right-to-Left (RTL) mirroring (e.g., Arabic/Hebrew).
* **Frontend Components:**
  * Language toggle switching between English, German, Japanese, and Arabic (RTL).
  * Bidirectional layout mirroring (`dir="rtl"`).
* **Playwright Learning Objectives:**
  * Emulating locale and text directions in browser contexts.
  * Visual regression testing for mirrored layouts and text overflow.
