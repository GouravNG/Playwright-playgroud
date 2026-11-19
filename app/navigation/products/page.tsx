import Link from "next/link";

const sampleProducts = [
  { id: "PROD-101", title: "Wireless Noise Cancelling Headphones", price: "$149.99", stock: "In Stock" },
  { id: "PROD-102", title: "Mechanical Ergonomic Keyboard", price: "$129.00", stock: "Low Stock" },
  { id: "PROD-103", title: "Ultra HD 4K 144Hz Monitor", price: "$389.50", stock: "In Stock" },
];

export default function NavigationProductsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100" data-testid="products-header">Store Products</h2>
          <p className="text-xs text-gray-500 dark:text-slate-400">Browse catalogue items or return to navigation lab</p>
        </div>
        <Link
          href="/navigation"
          data-testid="link-back-to-nav"
          className="text-xs bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-700"
        >
          ← Back to Navigation Lab
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sampleProducts.map((p) => (
          <div key={p.id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 shadow-sm" data-testid="product-item-card">
            <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-1.5 py-0.5 rounded">{p.id}</span>
            <h3 className="font-semibold text-gray-800 dark:text-slate-100 text-sm mt-2">{p.title}</h3>
            <div className="flex items-center justify-between mt-4">
              <span className="text-green-700 dark:text-green-400 font-bold text-sm">{p.price}</span>
              <span className="text-[11px] text-gray-500 dark:text-slate-400">{p.stock}</span>
            </div>
            <Link
              href="/navigation/checkout"
              data-testid={`btn-buy-${p.id}`}
              className="mt-3 block text-center text-xs bg-indigo-600 text-white py-1.5 rounded hover:bg-indigo-700 font-medium"
            >
              Fast Checkout
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
