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
/*  Required documents checkbox list                                   */
/* ------------------------------------------------------------------ */

const ALL_DOCUMENTS = [
  'GST Certificate',
  'PAN Card',
  'Bank Account',
  'Address Proof',
  'Identity Proof',
] as const;

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function SellersSettingsPage() {
  /* --- form state with mock defaults --- */
  const [autoApproveSellers, setAutoApproveSellers] = useState(false);
  const [minPayoutThreshold, setMinPayoutThreshold] = useState(500);
  const [payoutFrequency, setPayoutFrequency] = useState('Weekly');
  const [payoutDay, setPayoutDay] = useState('Monday');
  const [requiredDocs, setRequiredDocs] = useState<string[]>([
    'GST Certificate',
    'PAN Card',
    'Bank Account',
    'Address Proof',
    'Identity Proof',
  ]);
  const [maxProducts, setMaxProducts] = useState(5000);
  const [supportEmail, setSupportEmail] = useState('seller-support@homebase.in');

  function toggleDoc(doc: string) {
    setRequiredDocs((prev) =>
      prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc],
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Seller Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Registration, verification, payout rules, and seller limits
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
          {/* Auto-Approve Sellers */}
          <div className="grid grid-cols-3 gap-4 px-6 py-5 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">Auto-Approve Sellers</label>
            <div className="col-span-2 flex items-center gap-3">
              <Toggle enabled={autoApproveSellers} onChange={setAutoApproveSellers} />
              <span className="text-sm text-gray-500">
                Automatically approve new seller registrations without manual review
              </span>
            </div>
          </div>

          {/* Min Payout Threshold */}
          <div className="grid grid-cols-3 gap-4 px-6 py-5 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">Min Payout Threshold</label>
            <div className="col-span-2">
              <div className="flex items-center max-w-md">
                <span className="inline-flex items-center rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500">
                  &#8377;
                </span>
                <input
                  type="number"
                  min={0}
                  value={minPayoutThreshold}
                  onChange={(e) => setMinPayoutThreshold(Number(e.target.value))}
                  className="w-full rounded-r-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Minimum earnings required before a payout is triggered
              </p>
            </div>
          </div>

          {/* Payout Frequency */}
          <div className="grid grid-cols-3 gap-4 px-6 py-5 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">Payout Frequency</label>
            <div className="col-span-2">
              <select
                value={payoutFrequency}
                onChange={(e) => setPayoutFrequency(e.target.value)}
                className="w-full max-w-md rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
              >
                <option value="Weekly">Weekly</option>
                <option value="Bi-weekly">Bi-weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>
          </div>

          {/* Payout Day */}
          <div className="grid grid-cols-3 gap-4 px-6 py-5 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">Payout Day</label>
            <div className="col-span-2">
              <select
                value={payoutDay}
                onChange={(e) => setPayoutDay(e.target.value)}
                className="w-full max-w-md rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
              >
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
              <p className="mt-1 text-xs text-gray-400">
                Day of the week when payouts are processed
              </p>
            </div>
          </div>

          {/* Required Documents */}
          <div className="grid grid-cols-3 gap-4 px-6 py-5 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">Required Documents</label>
            <div className="col-span-2">
              <div className="flex flex-col gap-3">
                {ALL_DOCUMENTS.map((doc) => (
                  <label key={doc} className="inline-flex items-center gap-2.5 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={requiredDocs.includes(doc)}
                      onChange={() => toggleDoc(doc)}
                      className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                    />
                    {doc}
                  </label>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-400">
                Documents sellers must upload during registration
              </p>
            </div>
          </div>

          {/* Max Products Per Seller */}
          <div className="grid grid-cols-3 gap-4 px-6 py-5 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">
              Max Products Per Seller
            </label>
            <div className="col-span-2">
              <input
                type="number"
                min={1}
                value={maxProducts}
                onChange={(e) => setMaxProducts(Number(e.target.value))}
                className="w-full max-w-md rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
              />
              <p className="mt-1 text-xs text-gray-400">
                Maximum number of product listings a single seller can create
              </p>
            </div>
          </div>

          {/* Seller Support Email */}
          <div className="grid grid-cols-3 gap-4 px-6 py-5 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">Seller Support Email</label>
            <div className="col-span-2">
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full max-w-md rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
              />
              <p className="mt-1 text-xs text-gray-400">
                Email address shown to sellers for support inquiries
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
