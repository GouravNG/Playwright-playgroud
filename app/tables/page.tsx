"use client";
import { useState, useMemo } from "react";

function HintPanel({ code }: { code: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3">
      <button onClick={() => setOpen((v) => !v)} className="text-xs text-indigo-600 hover:underline font-medium">
        {open ? "🙈 Hide hint" : "💡 Show Playwright code"}
      </button>
      {open && (
        <pre className="mt-2 p-3 bg-gray-900 text-green-300 text-xs rounded-lg overflow-x-auto font-mono leading-relaxed">{code}</pre>
      )}
    </div>
  );
}

type Order = { id: string; product: string; amount: number; status: string; date: string; notes: string; };

const initialOrders: Order[] = [
  { id: "ORD-001", product: "Wireless Headphones", amount: 79.99, status: "Delivered", date: "2024-11-10", notes: "Left at door" },
  { id: "ORD-002", product: "Running Shoes", amount: 59.99, status: "Shipped", date: "2024-11-12", notes: "" },
  { id: "ORD-003", product: "Coffee Maker", amount: 129.99, status: "Processing", date: "2024-11-14", notes: "Gift wrap please" },
  { id: "ORD-004", product: "Yoga Mat", amount: 34.99, status: "Delivered", date: "2024-11-08", notes: "" },
  { id: "ORD-005", product: "Smart Watch", amount: 199.99, status: "Shipped", date: "2024-11-13", notes: "Fragile item" },
  { id: "ORD-006", product: "Bluetooth Speaker", amount: 89.99, status: "Cancelled", date: "2024-11-09", notes: "" },
  { id: "ORD-007", product: "Laptop Stand", amount: 44.99, status: "Processing", date: "2024-11-15", notes: "" },
  { id: "ORD-008", product: "Mechanical Keyboard", amount: 149.99, status: "Delivered", date: "2024-11-07", notes: "" },
];

const PAGE_SIZE = 4;

const statusColors: Record<string, string> = {
  Delivered: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
  Shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  Processing: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300",
  Cancelled: "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300",
};

export default function TablesPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof Order>("date");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [newOrder, setNewOrder] = useState({ product: "", amount: "", status: "Processing" });
  const [showAdd, setShowAdd] = useState(false);

  const filtered = useMemo(() =>
    orders.filter((o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.product.toLowerCase().includes(search.toLowerCase()) ||
      o.status.toLowerCase().includes(search.toLowerCase())
    ), [orders, search]);

  const sorted = useMemo(() => [...filtered].sort((a, b) => {
    const av = a[sortKey]; const bv = b[sortKey];
    if (typeof av === "number" && typeof bv === "number") return sortAsc ? av - bv : bv - av;
    return sortAsc ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
  }), [filtered, sortKey, sortAsc]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key: keyof Order) => {
    if (sortKey === key) setSortAsc((v) => !v);
    else { setSortKey(key); setSortAsc(true); }
    setPage(1);
  };

  const toggleSelect = (id: string) => setSelected((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const toggleAll = () => setSelected(selected.size === paged.length ? new Set() : new Set(paged.map((o) => o.id)));

  const saveNotes = (id: string) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, notes: editNotes } : o));
    setEditingId(null);
  };

  const deleteSelected = () => {
    setOrders((prev) => prev.filter((o) => !selected.has(o.id)));
    setSelected(new Set());
    setPage(1);
  };

  const addOrder = () => {
    if (!newOrder.product) return;
    const id = `ORD-${String(orders.length + 1).padStart(3, "0")}`;
    setOrders((prev) => [...prev, { id, product: newOrder.product, amount: parseFloat(newOrder.amount) || 0, status: newOrder.status, date: new Date().toISOString().split("T")[0], notes: "" }]);
    setNewOrder({ product: "", amount: "", status: "Processing" });
    setShowAdd(false);
  };

  const SortIcon = ({ col }: { col: keyof Order }) =>
    sortKey === col ? (sortAsc ? " ▲" : " ▼") : " ⇅";

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-xl p-4">
        <h2 className="font-bold text-teal-800 dark:text-teal-300 mb-1">📊 Tables & Grids</h2>
        <p className="text-sm text-teal-700 dark:text-teal-400">
          Order History table with sort, filter, pagination, inline edit and row operations.
          Practice row/cell locator chaining, <code>toHaveCount()</code>, and more.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <input data-testid="table-search"
          type="text" placeholder="Search orders…" value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-56"
        />
        {selected.size > 0 && (
          <button data-testid="btn-delete-selected" onClick={deleteSelected}
            className="bg-red-500 text-white text-xs px-3 py-2 rounded-lg hover:bg-red-600">
            🗑 Delete {selected.size} selected
          </button>
        )}
        <button data-testid="btn-add-order" onClick={() => setShowAdd(true)}
          className="ml-auto bg-indigo-600 text-white text-xs px-3 py-2 rounded-lg hover:bg-indigo-700">
          + Add Order
        </button>
      </div>

      <HintPanel code={`// Search and assert count\nawait page.getByTestId('table-search').fill('Shipped');\nawait expect(page.getByTestId('table-row')).toHaveCount(2);\n\n// Sort by Amount\nawait page.getByTestId('sort-amount').click();\nconst firstPrice = await page.getByTestId('table-row').first().locator('.cell-amount').textContent();\n\n// Inline edit a row's notes\nawait page.getByTestId('btn-edit-ORD-001').click();\nawait page.getByTestId('input-notes-ORD-001').fill('Updated note');\nawait page.getByTestId('btn-save-ORD-001').click();`} />

      {/* Add Order Modal */}
      {showAdd && (
        <div className="bg-indigo-50 dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
          <h4 className="font-semibold text-indigo-800 dark:text-indigo-300 text-sm">Add New Order</h4>
          <div className="flex flex-wrap gap-3">
            <input data-testid="input-new-product" placeholder="Product name"
              value={newOrder.product} onChange={(e) => setNewOrder((p) => ({ ...p, product: e.target.value }))}
              className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input data-testid="input-new-amount" placeholder="Amount" type="number"
              value={newOrder.amount} onChange={(e) => setNewOrder((p) => ({ ...p, amount: e.target.value }))}
              className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 rounded px-3 py-1.5 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <select data-testid="select-new-status" value={newOrder.status}
              onChange={(e) => setNewOrder((p) => ({ ...p, status: e.target.value }))}
              className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option>Processing</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option>
            </select>
            <button data-testid="btn-confirm-add" onClick={addOrder}
              className="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded hover:bg-indigo-700">Confirm</button>
            <button onClick={() => setShowAdd(false)} className="text-xs text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200">Cancel</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <table className="w-full text-sm" data-testid="orders-table">
          <thead className="bg-gray-50 dark:bg-slate-900/80 border-b border-gray-200 dark:border-slate-700">
            <tr>
              <th className="p-3 text-left w-10">
                <input type="checkbox" onChange={toggleAll}
                  checked={paged.length > 0 && selected.size === paged.length}
                  className="rounded"
                />
              </th>
              {[
                { key: "id", label: "Order ID" },
                { key: "product", label: "Product" },
                { key: "amount", label: "Amount" },
                { key: "status", label: "Status" },
                { key: "date", label: "Date" },
              ].map(({ key, label }) => (
                <th key={key}
                  data-testid={`sort-${key}`}
                  onClick={() => handleSort(key as keyof Order)}
                  className="p-3 text-left font-semibold text-gray-600 dark:text-slate-300 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 select-none whitespace-nowrap">
                  {label}<SortIcon col={key as keyof Order} />
                </th>
              ))}
              <th className="p-3 text-left font-semibold text-gray-600 dark:text-slate-300 text-xs">Notes</th>
              <th className="p-3 text-left font-semibold text-gray-600 dark:text-slate-300 text-xs">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-700/60">
            {paged.length === 0 ? (
              <tr><td colSpan={8} className="p-8 text-center text-gray-400 dark:text-slate-500 text-sm">No orders found</td></tr>
            ) : paged.map((order) => (
              <tr key={order.id} data-testid="table-row"
                className={`hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors ${selected.has(order.id) ? "bg-indigo-50 dark:bg-indigo-950/40" : ""}`}>
                <td className="p-3">
                  <input type="checkbox" checked={selected.has(order.id)} onChange={() => toggleSelect(order.id)} className="rounded" />
                </td>
                <td className="p-3 font-mono text-xs text-indigo-600 dark:text-indigo-400">{order.id}</td>
                <td className="p-3 text-gray-800 dark:text-slate-200">{order.product}</td>
                <td className="p-3 font-semibold text-green-700 dark:text-green-400 cell-amount">${order.amount.toFixed(2)}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[order.status] || "bg-gray-100 dark:bg-slate-700 dark:text-slate-200"}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-3 text-gray-500 dark:text-slate-400 text-xs">{order.date}</td>
                <td className="p-3 text-xs text-gray-500 dark:text-slate-400">
                  {editingId === order.id ? (
                    <input data-testid={`input-notes-${order.id}`}
                      value={editNotes} onChange={(e) => setEditNotes(e.target.value)}
                      className="border border-indigo-300 dark:border-indigo-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 rounded px-2 py-1 text-xs w-32 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                      autoFocus
                    />
                  ) : (
                    <span>{order.notes || <span className="italic text-gray-300 dark:text-slate-600">—</span>}</span>
                  )}
                </td>
                <td className="p-3">
                  {editingId === order.id ? (
                    <button data-testid={`btn-save-${order.id}`} onClick={() => saveNotes(order.id)}
                      className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">Save</button>
                  ) : (
                    <button data-testid={`btn-edit-${order.id}`}
                      onClick={() => { setEditingId(order.id); setEditNotes(order.notes); }}
                      className="text-xs text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 px-2 py-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-950/40">Edit</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/60">
          <div className="text-xs text-gray-500 dark:text-slate-400" data-testid="pagination-info">
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, sorted.length)}–{Math.min(page * PAGE_SIZE, sorted.length)} of <strong>{sorted.length}</strong> orders
          </div>
          <div className="flex gap-2">
            <button data-testid="btn-prev-page" disabled={page === 1} onClick={() => setPage((p) => p - 1)}
              className="text-xs px-3 py-1.5 rounded border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-slate-800">← Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} data-testid={`btn-page-${p}`} onClick={() => setPage(p)}
                className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                  page === p ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                }`}>{p}</button>
            ))}
            <button data-testid="btn-next-page" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}
              className="text-xs px-3 py-1.5 rounded border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-slate-800">Next →</button>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 dark:text-slate-500 text-center">
        Total orders: <strong data-testid="total-count">{orders.length}</strong> | Filtered: <strong>{filtered.length}</strong>
      </p>
    </div>
  );
}
