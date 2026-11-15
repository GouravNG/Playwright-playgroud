"use client";
import { useState } from "react";

export default function InnerPaymentFrame() {
  const [submitted, setSubmitted] = useState(false);
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (card && expiry && cvv) {
      setSubmitted(true);
    }
  };

  return (
    <div className="p-4 bg-slate-900 text-white min-h-screen font-sans">
      <div className="border border-slate-700 bg-slate-800/80 p-4 rounded-xl shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Secure Payment Gateway (iframe)</span>
          <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">256-bit SSL</span>
        </div>

        {submitted ? (
          <div data-testid="frame-payment-success" className="text-center py-4 space-y-1">
            <span className="text-2xl">✅</span>
            <h4 className="text-sm font-bold text-emerald-400">Payment Processed in Frame!</h4>
            <p className="text-[11px] text-slate-400">Card ending in {card.slice(-4)} was verified.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="card-number" className="block text-[11px] text-slate-300 font-medium mb-1">Card Number</label>
              <input
                id="card-number"
                data-testid="input-frame-card"
                type="text"
                value={card}
                onChange={(e) => setCard(e.target.value)}
                placeholder="4532 8901 2345 6789"
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="card-expiry" className="block text-[11px] text-slate-300 font-medium mb-1">Expires (MM/YY)</label>
                <input
                  id="card-expiry"
                  data-testid="input-frame-expiry"
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="12/28"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="card-cvv" className="block text-[11px] text-slate-300 font-medium mb-1">CVV</label>
                <input
                  id="card-cvv"
                  data-testid="input-frame-cvv"
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="888"
                  maxLength={4}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <button
              type="submit"
              data-testid="btn-frame-submit-payment"
              className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-1.5 rounded text-xs transition-colors"
            >
              Authorize $79.99 Inside Frame
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
