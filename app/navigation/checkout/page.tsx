import Link from "next/link";

export default function NavigationCheckoutPage() {
  return (
    <div className="max-w-2xl mx-auto text-center py-12 space-y-4">
      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl mx-auto">
        🛒
      </div>
      <h2 className="text-2xl font-bold text-gray-800" data-testid="checkout-header">
        Checkout Terminal
      </h2>
      <p className="text-sm text-gray-600">
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
          className="border border-gray-300 text-gray-700 text-xs px-4 py-2 rounded-lg hover:bg-gray-50"
        >
          Back to Catalogue
        </Link>
      </div>
    </div>
  );
}
