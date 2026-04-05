'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Inline Toggle Switch                                               */
/* ------------------------------------------------------------------ */
function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? 'bg-green-500' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function OrdersSettingsPage() {
  const [maxCartItems, setMaxCartItems] = useState(25);
  const [minOrderValue, setMinOrderValue] = useState(99);
  const [codOrderLimit, setCodOrderLimit] = useState(10000);
  const [autoCancelEnabled, setAutoCancelEnabled] = useState(true);
  const [autoCancelHours, setAutoCancelHours] = useState(48);
  const [modificationWindow, setModificationWindow] = useState(2);
  const [guestCheckout, setGuestCheckout] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState(true);

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/settings"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-brand-600 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Settings
      </Link>

      {/* Header + Save */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Orders &amp; Checkout
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Cart limits, checkout rules, and auto-cancel configuration
          </p>
        </div>
        <button
          type="button"
          onClick={() => alert('Settings saved')}
          className="px-5 py-2.5 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition shadow-sm"
        >
          Save Changes
        </button>
      </div>

      {/* Form card */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="p-6 space-y-6">
          {/* Max Cart Items */}
          <div className="grid grid-cols-3 gap-4 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">
              Max Cart Items
            </label>
            <div className="col-span-2">
              <input
                type="number"
                value={maxCartItems}
                onChange={(e) => setMaxCartItems(Number(e.target.value))}
                className="w-full max-w-md border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition"
              />
              <p className="text-xs text-gray-400 mt-1">
                Maximum number of unique products in cart
              </p>
            </div>
          </div>

          {/* Min Order Value */}
          <div className="grid grid-cols-3 gap-4 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">
              Min Order Value
            </label>
            <div className="col-span-2">
              <div className="flex items-center max-w-md">
                <span className="inline-flex items-center px-3 py-2.5 border border-r-0 border-gray-200 rounded-l-lg bg-gray-50 text-sm text-gray-500">
                  &#8377;
                </span>
                <input
                  type="number"
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-r-lg px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Minimum order value required for checkout
              </p>
            </div>
          </div>

          {/* COD Order Limit */}
          <div className="grid grid-cols-3 gap-4 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">
              COD Order Limit
            </label>
            <div className="col-span-2">
              <div className="flex items-center max-w-md">
                <span className="inline-flex items-center px-3 py-2.5 border border-r-0 border-gray-200 rounded-l-lg bg-gray-50 text-sm text-gray-500">
                  &#8377;
                </span>
                <input
                  type="number"
                  value={codOrderLimit}
                  onChange={(e) => setCodOrderLimit(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-r-lg px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Maximum order value eligible for Cash on Delivery
              </p>
            </div>
          </div>

          {/* Auto-cancel Unpaid Orders */}
          <div className="grid grid-cols-3 gap-4 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">
              Auto-cancel Unpaid Orders
            </label>
            <div className="col-span-2">
              <div className="flex items-center gap-3">
                <Toggle
                  checked={autoCancelEnabled}
                  onChange={setAutoCancelEnabled}
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">after</span>
                  <input
                    type="number"
                    value={autoCancelHours}
                    onChange={(e) =>
                      setAutoCancelHours(Number(e.target.value))
                    }
                    disabled={!autoCancelEnabled}
                    className="w-20 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition disabled:opacity-50"
                  />
                  <span className="text-sm text-gray-500">hours</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Pending unpaid orders are auto-cancelled after this duration
              </p>
            </div>
          </div>

          {/* Order Modification Window */}
          <div className="grid grid-cols-3 gap-4 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">
              Order Modification Window
            </label>
            <div className="col-span-2">
              <div className="flex items-center gap-2 max-w-md">
                <input
                  type="number"
                  value={modificationWindow}
                  onChange={(e) =>
                    setModificationWindow(Number(e.target.value))
                  }
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition"
                />
                <span className="text-sm text-gray-500 whitespace-nowrap">
                  hours
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Time allowed for customer to modify an order after placing
              </p>
            </div>
          </div>

          {/* Allow Guest Checkout */}
          <div className="grid grid-cols-3 gap-4 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">
              Allow Guest Checkout
            </label>
            <div className="col-span-2 flex items-center gap-3">
              <Toggle checked={guestCheckout} onChange={setGuestCheckout} />
              <span className="text-sm text-gray-500">
                Allow customers to checkout without creating an account
              </span>
            </div>
          </div>

          {/* Order Confirmation Email */}
          <div className="grid grid-cols-3 gap-4 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">
              Order Confirmation Email
            </label>
            <div className="col-span-2 flex items-center gap-3">
              <Toggle
                checked={confirmationEmail}
                onChange={setConfirmationEmail}
              />
              <span className="text-sm text-gray-500">
                Send order confirmation email to customers after purchase
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
