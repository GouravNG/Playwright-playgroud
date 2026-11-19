"use client";
import { useState } from "react";
import { WidgetCard } from "@/components/common/WidgetCard";

const products = [
  { id: 1, name: "Wireless Headphones", price: "$79.99", category: "Electronics", inStock: true, testId: "product-card-1" },
  { id: 2, name: "Running Shoes", price: "$59.99", category: "Sports", inStock: true, testId: "product-card-2" },
  { id: 3, name: "Coffee Maker", price: "$129.99", category: "Kitchen", inStock: false, testId: "product-card-3" },
  { id: 4, name: "Yoga Mat", price: "$34.99", category: "Sports", inStock: true, testId: "product-card-4" },
];

export default function LocatorsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cartMsg, setCartMsg] = useState<string | null>(null);

  const filtered = products.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4">
        <h2 className="font-bold text-indigo-800 dark:text-indigo-300 mb-1">📌 Locators Lab</h2>
        <p className="text-sm text-indigo-600 dark:text-indigo-400">
          Practice all 10+ Playwright locator strategies. Each widget below targets a different locator type.
          Try writing the Playwright code yourself first, then click <strong>Show hint</strong>.
        </p>
      </div>

      {cartMsg && (
        <div data-testid="cart-message" role="alert"
          className="bg-green-50 dark:bg-green-950/40 border border-green-300 dark:border-green-800 text-green-700 dark:text-green-400 rounded-lg px-4 py-2 text-sm flex items-center gap-2">
          🛒 {cartMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* getByRole */}
        <WidgetCard
          title='1. getByRole — "Add to Cart" button'
          testId="widget-get-by-role"
          docUrl="https://playwright.dev/docs/locators#locate-by-role"
          docTitle="Playwright getByRole Docs"
          hint={`// Find button by its accessible role + name\nawait page.getByRole('button', { name: 'Add to Cart' }).click();\nawait page.getByRole('button', { name: 'Buy Now' }).click();`}
        >
          <div className="flex gap-2">
            <button
              role="button"
              aria-label="Add to Cart"
              onClick={() => setCartMsg("Wireless Headphones added to cart!")}
              className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Add to Cart
            </button>
            <button
              role="button"
              aria-label="Buy Now"
              className="border border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-500 text-sm px-4 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
            >
              Buy Now
            </button>
          </div>
        </WidgetCard>

        {/* getByText */}
        <WidgetCard
          title="2. getByText — Product name labels"
          testId="widget-get-by-text"
          docUrl="https://playwright.dev/docs/locators#locate-by-text"
          docTitle="Playwright getByText Docs"
          hint={`// Find element by its visible text content\nawait page.getByText('Wireless Headphones').click();\nawait expect(page.getByText('$79.99')).toBeVisible();`}
        >
          <div className="space-y-1">
            <div className="text-sm font-medium text-gray-800 dark:text-slate-100">Wireless Headphones</div>
            <div className="text-sm text-gray-500 dark:text-slate-400">$79.99</div>
            <div className="text-xs text-green-600 dark:text-green-400 font-medium">In Stock</div>
          </div>
        </WidgetCard>

        {/* getByLabel */}
        <WidgetCard
          title="3. getByLabel — Quantity input"
          testId="widget-get-by-label"
          docUrl="https://playwright.dev/docs/locators#locate-by-label"
          docTitle="Playwright getByLabel Docs"
          hint={`// Find input by its associated <label> text\nawait page.getByLabel('Quantity').fill('3');\nawait expect(page.getByLabel('Quantity')).toHaveValue('3');`}
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="qty-input" className="text-sm text-gray-600 dark:text-slate-400 font-medium">Quantity</label>
            <input
              id="qty-input"
              type="number"
              defaultValue={1}
              min={1}
              className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 rounded-lg px-3 py-2 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </WidgetCard>

        {/* getByPlaceholder */}
        <WidgetCard
          title='4. getByPlaceholder — Search bar'
          testId="widget-get-by-placeholder"
          docUrl="https://playwright.dev/docs/locators#locate-by-placeholder"
          docTitle="Playwright getByPlaceholder Docs"
          hint={`// Find input by placeholder text\nawait page.getByPlaceholder('Search products...').fill('Headphones');\nawait page.getByPlaceholder('Search products...').press('Enter');`}
        >
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </WidgetCard>

        {/* getByAltText */}
        <WidgetCard
          title="5. getByAltText — Product image"
          testId="widget-get-by-alt-text"
          docUrl="https://playwright.dev/docs/locators#locate-by-alt-text"
          docTitle="Playwright getByAltText Docs"
          hint={`// Find image by its alt attribute\nawait page.getByAltText('Wireless Headphones product image').click();\nawait expect(page.getByAltText('Wireless Headphones product image')).toBeVisible();`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://placehold.co/120x80?text=Headphones"
            alt="Wireless Headphones product image"
            className="rounded-lg border border-gray-200 dark:border-slate-700"
          />
        </WidgetCard>

        {/* getByTitle */}
        <WidgetCard title='6. getByTitle — Tooltip icon' testId="widget-get-by-title"
          hint={`// Find element by its title attribute\nawait page.getByTitle('Free Shipping on orders over $50').hover();\nawait expect(page.getByTitle('Free Shipping on orders over $50')).toBeVisible();`}>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-slate-300">Delivery info</span>
            <span
              title="Free Shipping on orders over $50"
              className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-bold cursor-help"
            >
              ℹ
            </span>
          </div>
        </WidgetCard>

        {/* getByTestId */}
        <WidgetCard
          title="7. getByTestId — data-testid attribute"
          testId="widget-get-by-test-id"
          docUrl="https://playwright.dev/docs/locators#locate-by-test-id"
          docTitle="Playwright getByTestId Docs"
          hint={`// Find element by data-testid attribute\nawait page.getByTestId('product-card-1').click();\nawait expect(page.getByTestId('add-to-wishlist')).toBeVisible();`}
        >
          <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-3" data-testid="product-card-1">
            <div className="text-sm font-medium text-gray-900 dark:text-slate-100">Wireless Headphones</div>
            <button data-testid="add-to-wishlist"
              className="mt-2 text-xs text-pink-600 dark:text-pink-400 border border-pink-300 dark:border-pink-700 px-2 py-1 rounded hover:bg-pink-50 dark:hover:bg-pink-950/40">
              ♡ Wishlist
            </button>
          </div>
        </WidgetCard>

        {/* CSS selector */}
        <WidgetCard title="8. page.locator(css) — CSS selector" testId="widget-css-selector"
          hint={`// Find by CSS selector (use sparingly)\nawait page.locator('.price-tag').first().textContent();\nawait page.locator('button[data-category="electronics"]').click();`}>
          <div className="space-y-1">
            <div className="price-tag text-sm font-bold text-green-700 dark:text-green-400">$79.99</div>
            <div className="price-tag text-sm font-bold text-green-700 dark:text-green-400">$59.99</div>
            <button data-category="electronics"
              className="mt-2 text-xs bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700">
              Electronics Filter
            </button>
          </div>
        </WidgetCard>

        {/* XPath */}
        <WidgetCard title="9. page.locator(xpath) — XPath selector" testId="widget-xpath-selector"
          hint={`// Find by XPath (last resort)\nawait page.locator("xpath=//span[@data-sku='SKU-001']").textContent();\nawait page.locator("xpath=//button[contains(text(),'Checkout')]").click();`}>
          <div className="space-y-2">
            <span data-sku="SKU-001" className="text-xs font-mono bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 px-2 py-1 rounded">SKU-001</span>
            <div>
              <button className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700">
                Checkout
              </button>
            </div>
          </div>
        </WidgetCard>

        {/* Chaining locators */}
        <WidgetCard title="10. Chained locators — card → price" testId="widget-chained-locators"
          hint={`// Narrow scope by chaining .locator()\nconst card = page.locator('[data-testid="product-card-2"]');\nawait expect(card.locator('.item-price')).toHaveText('$59.99');\nawait card.getByRole('button', { name: 'Add to Cart' }).click();`}>
          <div data-testid="product-card-2" className="border border-gray-200 dark:border-slate-700 rounded-lg p-3 space-y-1">
            <div className="text-sm font-medium text-gray-900 dark:text-slate-100">Running Shoes</div>
            <div className="item-price text-sm font-bold text-green-700 dark:text-green-400">$59.99</div>
            <button onClick={() => setCartMsg("Running Shoes added to cart!")}
              className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700">
              Add to Cart
            </button>
          </div>
        </WidgetCard>

        {/* filter + nth */}
        <WidgetCard title="11. .filter() and .nth() — Product list" testId="widget-filter-nth"
          hint={`// Filter locator collection by text or child\nconst sportItems = page.locator('[data-category]').filter({ hasText: 'Sports' });\nawait expect(sportItems).toHaveCount(2);\nawait sportItems.first().click();\nawait sportItems.nth(1).getByRole('button').click();`}>
          <div className="space-y-2">
            {["Electronics", "Sports", "Sports", "Kitchen"].map((cat, i) => (
              <div key={i} data-category={cat}
                className="flex items-center justify-between text-xs bg-gray-50 dark:bg-slate-800 px-3 py-2 rounded border border-gray-200 dark:border-slate-700">
                <span className="text-gray-800 dark:text-slate-200">Product {i + 1}</span>
                <span className="text-gray-400 dark:text-slate-500">{cat}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-500 mt-2">↑ Filter for 'Sports' items (should be 2)</p>
        </WidgetCard>

        {/* Category filter */}
        <WidgetCard title="12. Dynamic filter — Category buttons" testId="widget-category-filter"
          hint={`// Click filter, assert count changes\nawait page.getByRole('button', { name: 'Sports' }).click();\nawait expect(page.locator('[data-testid^="product-card"]')).toHaveCount(2);`}>
          <div className="flex gap-2 flex-wrap mb-3">
            {["All", "Electronics", "Sports", "Kitchen"].map((cat) => (
              <button key={cat}
                onClick={() => setCategory(cat)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  category === cat ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                }`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="space-y-1">
            {filtered.map((p) => (
              <div key={p.id} data-testid={p.testId}
                className="text-xs flex items-center justify-between bg-gray-50 dark:bg-slate-800 rounded px-2 py-1.5 border border-gray-200 dark:border-slate-700">
                <span className="text-gray-800 dark:text-slate-200">{p.name}</span>
                <span className={`font-medium ${p.inStock ? "text-green-600 dark:text-green-400" : "text-red-400 dark:text-red-400"}`}>
                  {p.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-xs text-gray-400 dark:text-slate-500 italic">No products found</p>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">Showing {filtered.length} of {products.length} products</p>
        </WidgetCard>

      </div>
    </div>
  );
}
