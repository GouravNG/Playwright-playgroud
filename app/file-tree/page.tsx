"use client";
import React, { useState, useMemo } from "react";
import { WidgetCard } from "@/components/common/WidgetCard";

export interface TreeNode {
  id: string;
  name: string;
  type: "folder" | "file";
  size?: string;
  updatedAt?: string;
  children?: TreeNode[];
}

const INITIAL_TREE_DATA: TreeNode[] = [
  {
    id: "root-src",
    name: "src",
    type: "folder",
    children: [
      {
        id: "folder-app",
        name: "app",
        type: "folder",
        children: [
          {
            id: "folder-auth",
            name: "auth",
            type: "folder",
            children: [
              { id: "file-login", name: "login.tsx", type: "file", size: "2.4 KB", updatedAt: "2026-11-01" },
              { id: "file-register", name: "register.tsx", type: "file", size: "3.1 KB", updatedAt: "2026-11-02" },
            ],
          },
          { id: "file-layout", name: "layout.tsx", type: "file", size: "1.8 KB", updatedAt: "2026-11-03" },
          { id: "file-page", name: "page.tsx", type: "file", size: "4.2 KB", updatedAt: "2026-11-04" },
        ],
      },
      {
        id: "folder-components",
        name: "components",
        type: "folder",
        children: [
          { id: "file-sidebar", name: "Sidebar.tsx", type: "file", size: "3.8 KB", updatedAt: "2026-11-05" },
          { id: "file-topbar", name: "TopBar.tsx", type: "file", size: "2.2 KB", updatedAt: "2026-11-06" },
          { id: "file-widget", name: "WidgetCard.tsx", type: "file", size: "1.9 KB", updatedAt: "2026-11-07" },
        ],
      },
      {
        id: "folder-lib",
        name: "lib",
        type: "folder",
        children: [
          { id: "file-utils", name: "utils.ts", type: "file", size: "850 B", updatedAt: "2026-11-08" },
        ],
      },
    ],
  },
  {
    id: "root-tests",
    name: "tests",
    type: "folder",
    children: [
      { id: "file-locators-spec", name: "locators.spec.ts", type: "file", size: "3.2 KB", updatedAt: "2026-11-10" },
      { id: "file-kanban-spec", name: "kanban.spec.ts", type: "file", size: "2.8 KB", updatedAt: "2026-11-11" },
      { id: "file-captcha-spec", name: "captcha.spec.ts", type: "file", size: "2.5 KB", updatedAt: "2026-11-12" },
    ],
  },
  {
    id: "file-package-json",
    name: "package.json",
    type: "file",
    size: "1.2 KB",
    updatedAt: "2026-11-15",
  },
  {
    id: "file-readme",
    name: "README.md",
    type: "file",
    size: "5.6 KB",
    updatedAt: "2026-11-16",
  },
];

// Helper to check if node matches query or contains matches in descendants
function filterTree(node: TreeNode, query: string): { matched: boolean; filteredNode?: TreeNode; matchedIds: string[] } {
  const queryLower = query.toLowerCase();
  const nameMatches = node.name.toLowerCase().includes(queryLower);
  let matchedIds: string[] = [];

  if (nameMatches) {
    matchedIds.push(node.id);
  }

  if (node.type === "file") {
    return {
      matched: nameMatches,
      filteredNode: nameMatches ? node : undefined,
      matchedIds,
    };
  }

  const filteredChildren: TreeNode[] = [];
  let anyChildMatched = false;

  for (const child of node.children || []) {
    const res = filterTree(child, query);
    if (res.matched && res.filteredNode) {
      anyChildMatched = true;
      filteredChildren.push(res.filteredNode);
      matchedIds.push(...res.matchedIds);
    }
  }

  if (nameMatches || anyChildMatched) {
    matchedIds.push(node.id);
    return {
      matched: true,
      filteredNode: { ...node, children: filteredChildren },
      matchedIds,
    };
  }

  return { matched: false, matchedIds: [] };
}

export default function FileTreePage() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(["root-src", "folder-app"]));
  const [selectedFile, setSelectedFile] = useState<TreeNode | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"tree" | "preview">("tree");

  // Toggle folder open/closed
  const toggleFolder = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    const allFolderIds = ["root-src", "folder-app", "folder-auth", "folder-components", "folder-lib", "root-tests"];
    setExpandedIds(new Set(allFolderIds));
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  // Filter tree data and compute auto-expanded node ids when user searches
  const { displayTree, matchingIds } = useMemo(() => {
    if (!searchQuery.trim()) {
      return { displayTree: INITIAL_TREE_DATA, matchingIds: new Set<string>() };
    }

    const matchedNodes: TreeNode[] = [];
    const allMatches = new Set<string>();

    for (const rootNode of INITIAL_TREE_DATA) {
      const res = filterTree(rootNode, searchQuery);
      if (res.matched && res.filteredNode) {
        matchedNodes.push(res.filteredNode);
        res.matchedIds.forEach((id) => allMatches.add(id));
      }
    }

    return { displayTree: matchedNodes, matchingIds: allMatches };
  }, [searchQuery]);

  // If searching, auto-expand parents of matches
  const effectiveExpanded = useMemo(() => {
    if (searchQuery.trim()) {
      return new Set([...Array.from(expandedIds), ...Array.from(matchingIds)]);
    }
    return expandedIds;
  }, [searchQuery, expandedIds, matchingIds]);

  const renderNode = (node: TreeNode, depth: number = 0) => {
    const isFolder = node.type === "folder";
    const isExpanded = effectiveExpanded.has(node.id);
    const isSelected = selectedFile?.id === node.id;
    const isMatch = searchQuery && node.name.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      <div key={node.id} role="treeitem" aria-expanded={isFolder ? isExpanded : undefined} className="select-none">
        <div
          data-testid={`tree-node-${node.id}`}
          onClick={() => {
            if (isFolder) toggleFolder(node.id);
            else setSelectedFile(node);
          }}
          style={{ paddingLeft: `${depth * 18 + 10}px` }}
          className={`flex items-center gap-2 py-1.5 pr-3 rounded-md text-xs cursor-pointer transition-colors ${
            isSelected
              ? "bg-indigo-100 dark:bg-indigo-950/70 text-indigo-900 dark:text-indigo-200 font-semibold"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
          } ${isMatch ? "ring-1 ring-amber-400 dark:ring-amber-500 bg-amber-50/60 dark:bg-amber-950/20" : ""}`}
        >
          {isFolder ? (
            <span
              data-testid={`folder-toggle-${node.id}`}
              className="w-4 h-4 flex items-center justify-center text-[10px] text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-transform"
            >
              {isExpanded ? "▼" : "▶"}
            </span>
          ) : (
            <span className="w-4" />
          )}

          <span className="text-sm">
            {isFolder ? (isExpanded ? "📂" : "📁") : node.name.endsWith(".json") ? "⚙️" : node.name.endsWith(".md") ? "📝" : "📄"}
          </span>

          <span className="truncate flex-1 font-mono text-[11px]">{node.name}</span>

          {node.size && (
            <span className="text-[10px] text-gray-400 font-mono hidden sm:inline">
              {node.size}
            </span>
          )}
        </div>

        {isFolder && isExpanded && node.children && (
          <div role="group" className="space-y-0.5">
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🗂️</span>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="page-title">
              Hierarchical File Tree & Accordion Explorer
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Intermediate
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Deeply nested directory structures (AWS S3 & VS Code explorer). Practice ARIA role traversal, recursive folder expansion, and live search filtering.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Explorer Pane */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xs flex flex-col overflow-hidden">
          {/* Search and Tree Controls */}
          <div className="p-3 border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/40 space-y-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files... (e.g. login, spec)"
                data-testid="file-search-input"
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="absolute left-2.5 top-2 text-gray-400 text-xs">🔍</span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  data-testid="btn-clear-search"
                  className="absolute right-2.5 top-1.5 text-gray-400 hover:text-gray-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-gray-500 font-medium uppercase tracking-wider text-[10px]">
                Explorer
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  data-testid="btn-expand-all"
                  onClick={expandAll}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Expand All
                </button>
                <span className="text-gray-300">|</span>
                <button
                  type="button"
                  data-testid="btn-collapse-all"
                  onClick={collapseAll}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Collapse All
                </button>
              </div>
            </div>
          </div>

          {/* Tree View Container */}
          <div
            role="tree"
            aria-label="Project File Tree"
            data-testid="file-tree-container"
            className="p-2 space-y-0.5 max-h-[460px] overflow-y-auto"
          >
            {displayTree.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400">
                No matching files found for &quot;{searchQuery}&quot;
              </div>
            ) : (
              displayTree.map((node) => renderNode(node, 0))
            )}
          </div>
        </div>

        {/* Right Column: File Details & Preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5 shadow-xs">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2 mb-4">
              File Details & Selection Inspector
            </h2>

            {selectedFile ? (
              <div className="space-y-4" data-testid="selected-file-card">
                <div className="flex items-center justify-between p-3 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📄</span>
                    <div>
                      <h3 data-testid="selected-file-name" className="text-sm font-mono font-bold text-indigo-900 dark:text-indigo-200">
                        {selectedFile.name}
                      </h3>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        Node ID: <code className="font-mono">{selectedFile.id}</code>
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-indigo-600 text-white font-mono font-semibold">
                    {selectedFile.size}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700">
                    <span className="text-gray-400 block mb-1">File Type</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200 font-mono">
                      {selectedFile.name.split(".").pop()?.toUpperCase()} Document
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700">
                    <span className="text-gray-400 block mb-1">Last Modified</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {selectedFile.updatedAt}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 text-emerald-400 rounded-lg font-mono text-xs border border-slate-800 overflow-x-auto">
                  <p className="text-slate-500 mb-1">// Selected file mock source</p>
                  <p>export default function {selectedFile.name.replace(/\.[^/.]+$/, "")}() &#123;</p>
                  <p className="pl-4">return &lt;div className=&quot;view-container&quot;&gt;Hello from {selectedFile.name}&lt;/div&gt;;</p>
                  <p>&#125;</p>
                </div>
              </div>
            ) : (
              <div data-testid="empty-file-selection" className="p-8 text-center border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-lg">
                <span className="text-3xl block mb-2">📂</span>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">No file selected</p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Click any file in the hierarchical tree to inspect its metadata and properties.
                </p>
              </div>
            )}
          </div>

          {/* Reference Playwright Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <WidgetCard
              title="ARIA Tree Traversal & Expansion"
              testId="widget-tree-hint-1"
              docUrl="https://playwright.dev/docs/locators#locate-by-role"
              docTitle="Playwright ARIA Tree Traversal"
              hint={`// 1. Locate folder by role and assert ARIA expansion state
const appFolder = page.locator('[role="treeitem"][aria-expanded]').filter({ hasText: 'app' });
await expect(appFolder).toHaveAttribute('aria-expanded', 'true');

// 2. Click folder toggle to collapse/expand
await page.getByTestId('folder-toggle-folder-auth').click();
await expect(page.getByTestId('tree-node-file-login')).toBeVisible();

// 3. Select file and assert details panel
await page.getByTestId('tree-node-file-login').click();
await expect(page.getByTestId('selected-file-name')).toHaveText('login.tsx');`}
            >
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Tree navigations use standard ARIA <code>role=&quot;treeitem&quot;</code> and <code>aria-expanded</code> flags for robust accessible assertions.
              </p>
            </WidgetCard>

            <WidgetCard
              title="Parent Traversals & Filtering"
              testId="widget-tree-hint-2"
              docUrl="https://playwright.dev/docs/locators#filter-by-text"
              docTitle="Parent Chaining & Filter"
              hint={`// Filter tree by search query
await page.getByTestId('file-search-input').fill('login');

// Matching paths automatically expand and display
const loginFile = page.getByTestId('tree-node-file-login');
await expect(loginFile).toBeVisible();

// Clear search
await page.getByTestId('btn-clear-search').click();
await expect(page.getByTestId('tree-node-root-tests')).toBeVisible();`}
            >
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Filter inputs auto-expand nested ancestors, testing dynamic search queries against hierarchical DOM layouts.
              </p>
            </WidgetCard>
          </div>
        </div>
      </div>
    </div>
  );
}
