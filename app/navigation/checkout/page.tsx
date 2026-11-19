import Link from "next/link";

export default function NavigationCheckoutPage() {
  return (
    <div className="max-w-2xl mx-auto text-center py-12 space-y-4">
      <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-2xl mx-auto">
        🛒
      </div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100" data-testid="checkout-header">
        Checkout Terminal
      </h2>
      <p className="text-sm text-gray-600 dark:text-slate-400">
        You successfully navigated or redirected to the checkout gateway endpoint!
      </p>
      <div className="pt-4 flex justify-center gap-3">
        <Link
          href="/navigation"
          data-testid="link-return-nav"
          className="bg-indigo-600 text-white text-xs px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium"
        >
          Return to Navigation Lab
        </Link>
        <Link
          href="/navigation/products"
          className="border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-200 text-xs px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800"
        >
          Back to Catalogue
        </Link>
      </div>
    </div>
  );
}
