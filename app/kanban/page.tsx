"use client";
import React, { useState } from "react";
import { WidgetCard } from "@/components/common/WidgetCard";

export interface KanbanCard {
  id: string;
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  tag: string;
  assignee: string;
}

export type ColumnId = "backlog" | "in-progress" | "done";

const INITIAL_CARDS: Record<ColumnId, KanbanCard[]> = {
  backlog: [
    {
      id: "card-1",
      title: "Design System Tokens",
      description: "Define color swatches and typography tokens for Tailwind v4.",
      priority: "High",
      tag: "Design",
      assignee: "Alice",
    },
    {
      id: "card-2",
      title: "Playwright Flaky Retry Logic",
      description: "Implement custom exponential backoff fixture for slow networks.",
      priority: "Medium",
      tag: "Testing",
      assignee: "Bob",
    },
    {
      id: "card-3",
      title: "Setup Sentry Alert Triggers",
      description: "Send alert notifications to Discord when unhandled errors occur.",
      priority: "Low",
      tag: "DevOps",
      assignee: "Charlie",
    },
  ],
  "in-progress": [
    {
      id: "card-4",
      title: "Shadow DOM Pierce Testing",
      description: "Create Web Component fixture testing open vs closed shadow boundaries.",
      priority: "High",
      tag: "Automation",
      assignee: "Diana",
    },
    {
      id: "card-5",
      title: "Multi-tab Broadcast Channel",
      description: "Test state synchronization across multiple isolated browser tabs.",
      priority: "Medium",
      tag: "Testing",
      assignee: "Evan",
    },
  ],
  done: [
    {
      id: "card-6",
      title: "Dynamic CAPTCHA Sandbox",
      description: "Arithmetic solver, slider vector drag, and image selection grids.",
      priority: "High",
      tag: "Features",
      assignee: "Fiona",
    },
  ],
};

const PRIORITY_BADGES = {
  High: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-900",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-900",
  Low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900",
};

export default function KanbanPage() {
  const [columns, setColumns] = useState<Record<ColumnId, KanbanCard[]>>(INITIAL_CARDS);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [draggedSourceCol, setDraggedSourceCol] = useState<ColumnId | null>(null);
  const [lastAction, setLastAction] = useState<string>("Ready for drag-and-drop actions.");

  // Native HTML5 Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, cardId: string, sourceCol: ColumnId) => {
    setDraggedCardId(cardId);
    setDraggedSourceCol(sourceCol);
    e.dataTransfer.setData("text/plain", JSON.stringify({ cardId, sourceCol }));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetCol: ColumnId) => {
    e.preventDefault();
    let cardId = draggedCardId;
    let sourceCol = draggedSourceCol;

    if (!cardId || !sourceCol) {
      try {
        const raw = e.dataTransfer.getData("text/plain");
        if (raw) {
          const parsed = JSON.parse(raw);
          cardId = parsed.cardId;
          sourceCol = parsed.sourceCol;
        }
      } catch {
        // fallback
      }
    }

    if (!cardId || !sourceCol || sourceCol === targetCol) {
      setDraggedCardId(null);
      setDraggedSourceCol(null);
      return;
    }

    const cardToMove = columns[sourceCol].find((c) => c.id === cardId);
    if (!cardToMove) return;

    setColumns((prev) => ({
      ...prev,
      [sourceCol]: prev[sourceCol].filter((c) => c.id !== cardId),
      [targetCol]: [cardToMove, ...prev[targetCol]],
    }));

    setLastAction(`Moved "${cardToMove.title}" from [${sourceCol}] to [${targetCol}].`);
    setDraggedCardId(null);
    setDraggedSourceCol(null);
  };

  // Programmatic Quick-Move Action Buttons (for automated or click-based moves)
  const moveCard = (cardId: string, current: ColumnId, target: ColumnId) => {
    const card = columns[current].find((c) => c.id === cardId);
    if (!card) return;
    setColumns((prev) => ({
      ...prev,
      [current]: prev[current].filter((c) => c.id !== cardId),
      [target]: [card, ...prev[target]],
    }));
    setLastAction(`Button moved "${card.title}" to [${target}].`);
  };

  const resetBoard = () => {
    setColumns(INITIAL_CARDS);
    setLastAction("Board reset to initial state.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">↕️</span>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="page-title">
              Interactive Kanban Board
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              Intermediate
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Practice modern Drag-and-Drop gestures with <code>locator.dragTo()</code>, cross-column list reordering, and live count badge assertions.
          </p>
        </div>
        <div>
          <button
            type="button"
            data-testid="btn-reset-board"
            onClick={resetBoard}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition shadow-xs"
          >
            🔄 Reset Board
          </button>
        </div>
      </div>

      {/* Real-time Event Log */}
      <div
        data-testid="kanban-action-log"
        className="px-4 py-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-200 flex items-center justify-between"
      >
        <span>
          <strong>Latest Event:</strong> {lastAction}
        </span>
        <span className="text-[11px] opacity-75 font-mono">HTML5 Drag & Drop</span>
      </div>

      {/* Main Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5" data-testid="kanban-board">
        {/* Column 1: Backlog */}
        <div
          data-testid="column-backlog"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "backlog")}
          className="flex flex-col bg-gray-100/80 dark:bg-slate-900/90 rounded-xl border border-gray-200 dark:border-slate-800 p-4 min-h-[480px]"
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
              <h2 className="font-semibold text-sm text-gray-800 dark:text-gray-200">Backlog</h2>
            </div>
            <span
              data-testid="count-backlog"
              className="text-xs px-2 py-0.5 rounded-full font-mono font-bold bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-gray-300"
            >
              {columns.backlog.length}
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {columns.backlog.length === 0 ? (
              <div className="h-32 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-lg flex items-center justify-center text-xs text-gray-400 dark:text-gray-600">
                Drop items here
              </div>
            ) : (
              columns.backlog.map((card) => (
                <div
                  key={card.id}
                  id={card.id}
                  data-testid={`card-${card.id}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, card.id, "backlog")}
                  className="bg-white dark:bg-slate-800/90 p-3.5 rounded-lg border border-gray-200 dark:border-slate-700/80 shadow-xs hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing select-none group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                      {card.tag}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        PRIORITY_BADGES[card.priority]
                      }`}
                    >
                      {card.priority}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    {card.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {card.description}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-700/60 text-[11px] text-gray-400">
                    <span>👤 {card.assignee}</span>
                    <button
                      type="button"
                      data-testid={`btn-move-progress-${card.id}`}
                      onClick={() => moveCard(card.id, "backlog", "in-progress")}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline opacity-80 group-hover:opacity-100"
                    >
                      Move &rarr;
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: In Progress */}
        <div
          data-testid="column-in-progress"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "in-progress")}
          className="flex flex-col bg-gray-100/80 dark:bg-slate-900/90 rounded-xl border border-gray-200 dark:border-slate-800 p-4 min-h-[480px]"
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
              <h2 className="font-semibold text-sm text-gray-800 dark:text-gray-200">In Progress</h2>
            </div>
            <span
              data-testid="count-in-progress"
              className="text-xs px-2 py-0.5 rounded-full font-mono font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
            >
              {columns["in-progress"].length}
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {columns["in-progress"].length === 0 ? (
              <div className="h-32 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-lg flex items-center justify-center text-xs text-gray-400 dark:text-gray-600">
                Drop items here
              </div>
            ) : (
              columns["in-progress"].map((card) => (
                <div
                  key={card.id}
                  id={card.id}
                  data-testid={`card-${card.id}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, card.id, "in-progress")}
                  className="bg-white dark:bg-slate-800/90 p-3.5 rounded-lg border border-gray-200 dark:border-slate-700/80 shadow-xs hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing select-none group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                      {card.tag}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        PRIORITY_BADGES[card.priority]
                      }`}
                    >
                      {card.priority}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    {card.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {card.description}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-700/60 text-[11px] text-gray-400">
                    <button
                      type="button"
                      data-testid={`btn-move-backlog-${card.id}`}
                      onClick={() => moveCard(card.id, "in-progress", "backlog")}
                      className="text-gray-500 hover:underline"
                    >
                      &larr; Backlog
                    </button>
                    <button
                      type="button"
                      data-testid={`btn-move-done-${card.id}`}
                      onClick={() => moveCard(card.id, "in-progress", "done")}
                      className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                    >
                      Done &rarr;
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Done */}
        <div
          data-testid="column-done"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "done")}
          className="flex flex-col bg-gray-100/80 dark:bg-slate-900/90 rounded-xl border border-gray-200 dark:border-slate-800 p-4 min-h-[480px]"
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h2 className="font-semibold text-sm text-gray-800 dark:text-gray-200">Done</h2>
            </div>
            <span
              data-testid="count-done"
              className="text-xs px-2 py-0.5 rounded-full font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
            >
              {columns.done.length}
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {columns.done.length === 0 ? (
              <div className="h-32 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-lg flex items-center justify-center text-xs text-gray-400 dark:text-gray-600">
                Drop items here
              </div>
            ) : (
              columns.done.map((card) => (
                <div
                  key={card.id}
                  id={card.id}
                  data-testid={`card-${card.id}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, card.id, "done")}
                  className="bg-white dark:bg-slate-800/90 p-3.5 rounded-lg border border-gray-200 dark:border-slate-700/80 shadow-xs hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing select-none group opacity-90 hover:opacity-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                      {card.tag}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      ✓ Completed
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-through mb-1">
                    {card.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {card.description}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-700/60 text-[11px] text-gray-400">
                    <span>👤 {card.assignee}</span>
                    <button
                      type="button"
                      data-testid={`btn-reopen-${card.id}`}
                      onClick={() => moveCard(card.id, "done", "in-progress")}
                      className="text-amber-600 dark:text-amber-400 hover:underline"
                    >
                      &larr; Reopen
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Playwright Code and Architecture Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WidgetCard
          title="Playwright Drag & Drop Automation Reference"
          testId="widget-kanban-hint-1"
          docUrl="https://playwright.dev/docs/input#drag-and-drop"
          docTitle="Playwright dragTo Documentation"
          hint={`// 1. Dragging card directly between column containers
const sourceCard = page.getByTestId('card-card-1');
const targetColumn = page.getByTestId('column-in-progress');

await sourceCard.dragTo(targetColumn);

// 2. Validate DOM detachment and count assertion
await expect(page.getByTestId('count-backlog')).toHaveText('2');
await expect(page.getByTestId('count-in-progress')).toHaveText('3');
await expect(targetColumn.getByTestId('card-card-1')).toBeVisible();`}
        >
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <code>locator.dragTo(targetLocator)</code> simulates the complete mousedown, mousemove across the viewport, dragenter/dragover dispatch, and mouseup sequences automatically.
          </p>
        </WidgetCard>

        <WidgetCard
          title="Alternative: Low-Level Mouse Action Dragging"
          testId="widget-kanban-hint-2"
          docUrl="https://playwright.dev/docs/input#mouse-move"
          docTitle="Playwright Mouse Vector Actions"
          hint={`// In cases where custom HTML5 drag events need explicit mouse coordinates:
const sourceBox = await page.getByTestId('card-card-2').boundingBox();
const targetBox = await page.getByTestId('column-done').boundingBox();

await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
await page.mouse.down();
await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, { steps: 10 });
await page.mouse.up();

await expect(page.getByTestId('count-done')).toHaveText('2');`}
        >
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Specifying <code>steps</code> ensures mousemove intervals fire and drag listeners in strict browsers catch every movement boundary.
          </p>
        </WidgetCard>
      </div>
    </div>
  );
}
