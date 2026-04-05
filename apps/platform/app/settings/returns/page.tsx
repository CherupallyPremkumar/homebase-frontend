'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Toggle switch (inline, no external dependency)                     */
/* ------------------------------------------------------------------ */

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        enabled ? 'bg-orange-500' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ReturnsSettingsPage() {
  /* --- form state with mock defaults --- */
  const [returnWindow, setReturnWindow] = useState(30);
  const [exchangeWindow, setExchangeWindow] = useState(15);
  const [autoApproveBelow, setAutoApproveBelow] = useState(1000);
  const [returnShippingPaidBy, setReturnShippingPaidBy] = useState('Seller');
  const [restockingFee, setRestockingFee] = useState(0);
  const [allowPartialReturns, setAllowPartialReturns] = useState(false);
  const [requireReturnImages, setRequireReturnImages] = useState(true);

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/settings"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Settings
      </Link>

      {/* Header + Save */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Returns &amp; Refunds</h1>
          <p className="mt-1 text-sm text-gray-500">
            Return window, refund settings, and exchange policies
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition"
        >
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </div>

      {/* Form card */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="divide-y divide-gray-100">
          {/* Return Window */}
          <div className="grid grid-cols-3 gap-4 px-6 py-5 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">Return Window</label>
            <div className="col-span-2">
              <div className="flex items-center gap-2 max-w-md">
                <input
                  type="number"
                  min={0}
                  value={returnWindow}
                  onChange={(e) => setReturnWindow(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                />
                <span className="whitespace-nowrap text-sm text-gray-500">days</span>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Number of days after delivery a return can be initiated
              </p>
            </div>
          </div>

          {/* Exchange Window */}
          <div className="grid grid-cols-3 gap-4 px-6 py-5 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">Exchange Window</label>
            <div className="col-span-2">
              <div className="flex items-center gap-2 max-w-md">
                <input
                  type="number"
                  min={0}
                  value={exchangeWindow}
                  onChange={(e) => setExchangeWindow(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                />
                <span className="whitespace-nowrap text-sm text-gray-500">days</span>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Number of days after delivery an exchange can be requested
              </p>
            </div>
          </div>

          {/* Auto-Approve Returns Below */}
          <div className="grid grid-cols-3 gap-4 px-6 py-5 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">
              Auto-Approve Returns Below
            </label>
            <div className="col-span-2">
              <div className="flex items-center max-w-md">
                <span className="inline-flex items-center rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500">
                  &#8377;
                </span>
                <input
                  type="number"
                  min={0}
                  value={autoApproveBelow}
                  onChange={(e) => setAutoApproveBelow(Number(e.target.value))}
                  className="w-full rounded-r-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Returns below this amount are automatically approved
              </p>
            </div>
          </div>

          {/* Return Shipping Paid By */}
          <div className="grid grid-cols-3 gap-4 px-6 py-5 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">
              Return Shipping Paid By
            </label>
            <div className="col-span-2">
              <select
                value={returnShippingPaidBy}
                onChange={(e) => setReturnShippingPaidBy(e.target.value)}
                className="w-full max-w-md rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
              >
                <option value="Seller">Seller</option>
                <option value="Buyer">Buyer</option>
                <option value="Platform">Platform</option>
              </select>
            </div>
          </div>

          {/* Restocking Fee % */}
          <div className="grid grid-cols-3 gap-4 px-6 py-5 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">Restocking Fee %</label>
            <div className="col-span-2">
              <div className="flex items-center gap-2 max-w-md">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={restockingFee}
                  onChange={(e) => setRestockingFee(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                />
                <span className="whitespace-nowrap text-sm text-gray-500">%</span>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Percentage deducted from refund as a restocking fee (0 = no fee)
              </p>
            </div>
          </div>

          {/* Allow Partial Returns */}
          <div className="grid grid-cols-3 gap-4 px-6 py-5 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">Allow Partial Returns</label>
            <div className="col-span-2 flex items-center gap-3">
              <Toggle enabled={allowPartialReturns} onChange={setAllowPartialReturns} />
              <span className="text-sm text-gray-500">
                Allow returning individual items from a multi-item order
              </span>
            </div>
          </div>

          {/* Require Return Images */}
          <div className="grid grid-cols-3 gap-4 px-6 py-5 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">
              Require Return Images
            </label>
            <div className="col-span-2 flex items-center gap-3">
              <Toggle enabled={requireReturnImages} onChange={setRequireReturnImages} />
              <span className="text-sm text-gray-500">
                Require customers to upload product images when requesting a return
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
