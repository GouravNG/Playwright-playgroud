"use client";
import { useState } from "react";

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

type FormData = {
  fullName: string; email: string; phone: string; password: string;
  address: string; city: string; country: string; zipCode: string;
  deliveryNotes: string; saveAddress: boolean; gender: string;
  interests: string[]; birthDate: string; deliverySlot: string;
  paymentMethod: string; promoCode: string; quantity: string;
};

export default function FormsPage() {
  const [form, setForm] = useState<FormData>({
    fullName: "", email: "", phone: "", password: "",
    address: "", city: "", country: "", zipCode: "",
    deliveryNotes: "", saveAddress: false, gender: "",
    interests: [], birthDate: "", deliverySlot: "",
    paymentMethod: "", promoCode: "", quantity: "50",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [cityOptions] = useState(["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune"]);
  const [cityInput, setCityInput] = useState("");
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  const setField = (key: keyof FormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.fullName) e.fullName = "Full name is required";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email is required";
    if (!form.gender) e.gender = "Please select a gender";
    if (!form.country) e.country = "Please select a country";
    if (!form.paymentMethod) e.paymentMethod = "Please select a payment method";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) setSubmitted(true);
  };

  const toggleInterest = (interest: string) => {
    setField("interests", form.interests.includes(interest)
      ? form.interests.filter((i) => i !== interest)
      : [...form.interests, interest]);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-xl font-bold text-green-700 mb-2" data-testid="success-message">Order Placed Successfully!</h2>
        <p className="text-gray-600 text-sm mb-6">Your order for <strong>{form.fullName}</strong> has been confirmed.</p>
        <button onClick={() => { setSubmitted(false); setForm({ fullName: "", email: "", phone: "", password: "", address: "", city: "", country: "", zipCode: "", deliveryNotes: "", saveAddress: false, gender: "", interests: [], birthDate: "", deliverySlot: "", paymentMethod: "", promoCode: "", quantity: "50" }); }}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-indigo-700">
          Place Another Order
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h2 className="font-bold text-blue-800 mb-1">📝 Forms & Inputs</h2>
        <p className="text-sm text-blue-700">
          A complete checkout form covering every Playwright form interaction.
          Try filling it out manually, then automate it with Playwright!
        </p>
      </div>

      <form onSubmit={handleSubmit} data-testid="checkout-form" className="space-y-6">

        {/* Personal Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-4 text-sm">👤 Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Text input */}
            <div>
              <label htmlFor="fullName" className="text-sm text-gray-600 font-medium block mb-1">Full Name *</label>
              <input id="fullName" data-testid="input-full-name" type="text"
                value={form.fullName} onChange={(e) => setField("fullName", e.target.value)}
                placeholder="John Doe"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {errors.fullName && <p data-testid="error-full-name" className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              <HintPanel code={`await page.getByLabel('Full Name *').fill('Jane Doe');\nawait expect(page.getByLabel('Full Name *')).toHaveValue('Jane Doe');`} />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="text-sm text-gray-600 font-medium block mb-1">Email *</label>
              <input id="email" data-testid="input-email" type="email"
                value={form.email} onChange={(e) => setField("email", e.target.value)}
                placeholder="john@example.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {errors.email && <p data-testid="error-email" className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="text-sm text-gray-600 font-medium block mb-1">Phone</label>
              <input id="phone" data-testid="input-phone" type="tel"
                value={form.phone} onChange={(e) => setField("phone", e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <HintPanel code={`await page.getByPlaceholder('+91 98765 43210').fill('+91 99999 00000');`} />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="text-sm text-gray-600 font-medium block mb-1">Password</label>
              <input id="password" data-testid="input-password" type="password"
                value={form.password} onChange={(e) => setField("password", e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          {/* Gender — Radio */}
          <div className="mt-4">
            <p className="text-sm text-gray-600 font-medium mb-2">Gender *</p>
            <div className="flex gap-4">
              {["Male", "Female", "Other"].map((g) => (
                <label key={g} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="gender" value={g}
                    checked={form.gender === g} onChange={() => setField("gender", g)}
                    className="text-indigo-600"
                  />
                  {g}
                </label>
              ))}
            </div>
            {errors.gender && <p data-testid="error-gender" className="text-red-500 text-xs mt-1">{errors.gender}</p>}
            <HintPanel code={`await page.getByLabel('Female').check();\nawait expect(page.getByLabel('Female')).toBeChecked();`} />
          </div>

          {/* Birth Date */}
          <div className="mt-4">
            <label htmlFor="birthDate" className="text-sm text-gray-600 font-medium block mb-1">Date of Birth</label>
            <input id="birthDate" data-testid="input-birth-date" type="date"
              value={form.birthDate} onChange={(e) => setField("birthDate", e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <HintPanel code={`// Fill native date input with ISO format\nawait page.getByLabel('Date of Birth').fill('1995-08-15');`} />
          </div>
        </div>

        {/* Delivery Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-4 text-sm">📦 Delivery Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label htmlFor="address" className="text-sm text-gray-600 font-medium block mb-1">Address</label>
              <input id="address" data-testid="input-address" type="text"
                value={form.address} onChange={(e) => setField("address", e.target.value)}
                placeholder="123 Main Street"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* Autocomplete city */}
            <div className="relative">
              <label htmlFor="city-input" className="text-sm text-gray-600 font-medium block mb-1">City</label>
              <input id="city-input" data-testid="input-city"
                type="text" value={cityInput}
                onChange={(e) => { setCityInput(e.target.value); setShowCitySuggestions(true); }}
                onFocus={() => setShowCitySuggestions(true)}
                onBlur={() => setTimeout(() => setShowCitySuggestions(false), 150)}
                placeholder="Start typing…"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {showCitySuggestions && cityInput && (
                <ul data-testid="city-suggestions" className="absolute z-10 left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  {cityOptions.filter((c) => c.toLowerCase().includes(cityInput.toLowerCase())).map((c) => (
                    <li key={c} role="option" onClick={() => { setCityInput(c); setField("city", c); setShowCitySuggestions(false); }}
                      className="px-3 py-2 text-sm hover:bg-indigo-50 cursor-pointer">{c}</li>
                  ))}
                </ul>
              )}
              <HintPanel code={`await page.getByTestId('input-city').fill('Ban');\nawait page.getByRole('option', { name: 'Bangalore' }).click();`} />
            </div>

            {/* Select country */}
            <div>
              <label htmlFor="country" className="text-sm text-gray-600 font-medium block mb-1">Country *</label>
              <select id="country" data-testid="select-country"
                value={form.country} onChange={(e) => setField("country", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                <option value="">Select country…</option>
                <option value="IN">India</option>
                <option value="US">United States</option>
                <option value="GB">United Kingdom</option>
                <option value="AU">Australia</option>
                <option value="CA">Canada</option>
              </select>
              {errors.country && <p data-testid="error-country" className="text-red-500 text-xs mt-1">{errors.country}</p>}
              <HintPanel code={`// Select by value, label, or index\nawait page.getByLabel('Country *').selectOption('IN'); // by value\nawait page.getByLabel('Country *').selectOption({ label: 'India' });\nawait page.getByLabel('Country *').selectOption({ index: 1 });`} />
            </div>

            <div>
              <label htmlFor="zipCode" className="text-sm text-gray-600 font-medium block mb-1">ZIP Code</label>
              <input id="zipCode" data-testid="input-zip" type="text"
                value={form.zipCode} onChange={(e) => setField("zipCode", e.target.value)}
                placeholder="400001"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          {/* Delivery slot */}
          <div className="mt-4">
            <label htmlFor="deliverySlot" className="text-sm text-gray-600 font-medium block mb-1">Preferred Delivery Slot</label>
            <select id="deliverySlot" data-testid="select-delivery-slot"
              value={form.deliverySlot} onChange={(e) => setField("deliverySlot", e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option value="">Choose a slot…</option>
              <option value="morning">Morning (9am–12pm)</option>
              <option value="afternoon">Afternoon (12pm–5pm)</option>
              <option value="evening">Evening (5pm–9pm)</option>
            </select>
          </div>

          {/* Delivery notes — textarea */}
          <div className="mt-4">
            <label htmlFor="deliveryNotes" className="text-sm text-gray-600 font-medium block mb-1">Delivery Instructions</label>
            <textarea id="deliveryNotes" data-testid="input-delivery-notes"
              value={form.deliveryNotes} onChange={(e) => setField("deliveryNotes", e.target.value)}
              rows={3} placeholder="Leave at the door, ring the bell…"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
            <HintPanel code={`await page.getByLabel('Delivery Instructions').fill('Leave at door, ring bell twice');`} />
          </div>

          {/* Save address checkbox */}
          <div className="mt-4 flex items-center gap-2">
            <input type="checkbox" id="saveAddress" data-testid="checkbox-save-address"
              checked={form.saveAddress} onChange={(e) => setField("saveAddress", e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded"
            />
            <label htmlFor="saveAddress" className="text-sm text-gray-700">Save this address for future orders</label>
          </div>
        </div>

        {/* Interests — multi-select checkboxes */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-4 text-sm">🎯 Your Interests (multi-select)</h3>
          <div className="flex flex-wrap gap-3">
            {["Electronics", "Sports", "Books", "Fashion", "Kitchen", "Travel"].map((interest) => (
              <label key={interest} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" data-testid={`checkbox-${interest.toLowerCase()}`}
                  checked={form.interests.includes(interest)}
                  onChange={() => toggleInterest(interest)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                {interest}
              </label>
            ))}
          </div>
          <HintPanel code={`// Check multiple checkboxes\nfor (const interest of ['Electronics', 'Sports', 'Books']) {\n  await page.getByLabel(interest).check();\n}\nawait expect(page.getByLabel('Electronics')).toBeChecked();`} />
        </div>

        {/* Payment */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-4 text-sm">💳 Payment</h3>

          {/* Payment method radio */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 font-medium mb-2">Payment Method *</p>
            <div className="flex flex-wrap gap-4">
              {["Credit Card", "Debit Card", "UPI", "Net Banking", "Cash on Delivery"].map((method) => (
                <label key={method} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="paymentMethod" value={method} data-testid={`radio-${method.toLowerCase().replace(/\s+/g, "-")}`}
                    checked={form.paymentMethod === method} onChange={() => setField("paymentMethod", method)}
                    className="text-indigo-600"
                  />
                  {method}
                </label>
              ))}
            </div>
            {errors.paymentMethod && <p data-testid="error-payment" className="text-red-500 text-xs mt-1">{errors.paymentMethod}</p>}
          </div>

          {/* Promo code */}
          <div className="mb-4">
            <label htmlFor="promoCode" className="text-sm text-gray-600 font-medium block mb-1">Promo Code</label>
            <div className="flex gap-2">
              <input id="promoCode" data-testid="input-promo-code" type="text"
                value={form.promoCode} onChange={(e) => setField("promoCode", e.target.value)}
                placeholder="Enter code…"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button type="button" data-testid="btn-apply-promo"
                className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700">
                Apply
              </button>
            </div>
          </div>

          {/* Range slider for quantity */}
          <div>
            <label htmlFor="quantity" className="text-sm text-gray-600 font-medium block mb-1">
              Order Quantity: <strong>{form.quantity}</strong>
            </label>
            <input id="quantity" data-testid="slider-quantity" type="range"
              min={1} max={100} value={form.quantity}
              onChange={(e) => setField("quantity", e.target.value)}
              className="w-full"
            />
            <HintPanel code={`// Slider — use mouse.move() relative to element bounds\nconst slider = page.getByTestId('slider-quantity');\nconst box = await slider.boundingBox();\nawait page.mouse.move(box.x + box.width * 0.75, box.y + box.height / 2);\nawait page.mouse.click(box.x + box.width * 0.75, box.y + box.height / 2);`} />
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button type="submit" data-testid="btn-place-order"
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors">
            Place Order 🛒
          </button>
          <button type="reset" data-testid="btn-reset-form"
            onClick={() => { setForm({ fullName: "", email: "", phone: "", password: "", address: "", city: "", country: "", zipCode: "", deliveryNotes: "", saveAddress: false, gender: "", interests: [], birthDate: "", deliverySlot: "", paymentMethod: "", promoCode: "", quantity: "50" }); setCityInput(""); setErrors({}); }}
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl text-sm hover:bg-gray-50">
            Reset
          </button>
        </div>

      </form>
    </div>
  );
}
