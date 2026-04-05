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
  size = 'default',
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  size?: 'default' | 'small';
}) {
  const track =
    size === 'small'
      ? 'h-5 w-9'
      : 'h-6 w-11';
  const knob =
    size === 'small'
      ? 'h-3.5 w-3.5'
      : 'h-4 w-4';
  const translate =
    size === 'small'
      ? checked
        ? 'translate-x-4'
        : 'translate-x-0.5'
      : checked
        ? 'translate-x-6'
        : 'translate-x-1';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex shrink-0 items-center rounded-full transition-colors ${track} ${
        checked ? 'bg-green-500' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block rounded-full bg-white shadow transition-transform ${knob} ${translate}`}
      />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */
const commissionRows = [
  { category: 'Electronics', commission: 8, minFee: 25, effectiveDate: '01 Jan 2026' },
  { category: 'Fashion', commission: 15, minFee: 15, effectiveDate: '01 Jan 2026' },
  { category: 'Home & Kitchen', commission: 12, minFee: 20, effectiveDate: '15 Feb 2026' },
  { category: 'Books', commission: 5, minFee: 10, effectiveDate: '01 Jan 2026' },
  { category: 'Grocery', commission: 3, minFee: 5, effectiveDate: '01 Mar 2026' },
  { category: 'Health & Beauty', commission: 10, minFee: 15, effectiveDate: '01 Jan 2026' },
];

interface Gateway {
  name: string;
  abbr: string;
  bg: string;
  active: boolean;
  apiKeyLabel: string;
  apiKeyValue: string;
  secretLabel: string;
  secretValue: string;
}

const gateways: Gateway[] = [
  {
    name: 'Razorpay',
    abbr: 'Rz',
    bg: 'bg-blue-600',
    active: true,
    apiKeyLabel: 'API Key',
    apiKeyValue: 'rzp_live_****...****7kX9',
    secretLabel: 'Secret Key',
    secretValue: '****...****mN3p',
  },
  {
    name: 'PayU',
    abbr: 'PU',
    bg: 'bg-green-700',
    active: false,
    apiKeyLabel: 'Merchant Key',
    apiKeyValue: 'payu_****...****2xQ1',
    secretLabel: 'Salt Key',
    secretValue: '****...****dK7w',
  },
  {
    name: 'Cashfree',
    abbr: 'CF',
    bg: 'bg-purple-600',
    active: false,
    apiKeyLabel: 'App ID',
    apiKeyValue: 'cf_****...****9pR3',
    secretLabel: 'Secret Key',
    secretValue: '****...****hL5z',
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function PaymentsSettingsPage() {
  const [gatewayStates, setGatewayStates] = useState<Record<string, boolean>>(
    Object.fromEntries(gateways.map((g) => [g.name, g.active])),
  );
  const [testModes, setTestModes] = useState<Record<string, boolean>>(
    Object.fromEntries(gateways.map((g) => [g.name, false])),
  );
  const [codEnabled, setCodEnabled] = useState(true);
  const [codLimit, setCodLimit] = useState(10000);

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
            Payments &amp; Commission
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Commission rates, payment gateways, and COD settings
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

      {/* ---- Commission Rates Table ---- */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Commission Rates
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Category-wise commission structure
            </p>
          </div>
          <button
            type="button"
            onClick={() => alert('Add new commission rule')}
            className="px-4 py-2 text-sm font-medium text-brand-600 bg-brand-50 rounded-lg hover:bg-brand-100 transition"
          >
            + Add Rule
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Commission %
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Min Fee
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Effective Date
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {commissionRows.map((row) => (
                <tr
                  key={row.category}
                  className="transition-colors hover:bg-orange-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {row.category}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                      {row.commission}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    &#8377;{row.minFee}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {row.effectiveDate}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() =>
                        alert(`Edit commission for ${row.category}`)
                      }
                      className="text-brand-500 hover:text-brand-600 text-xs font-medium"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---- Payment Gateways ---- */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-gray-900">Payment Gateways</h3>

        {gateways.map((gw) => {
          const isActive = gatewayStates[gw.name];
          const isTest = testModes[gw.name];

          return (
            <div
              key={gw.name}
              className={`rounded-xl border border-gray-200 bg-white shadow-sm p-6 ${
                !isActive ? 'opacity-75' : ''
              }`}
            >
              {/* Gateway header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white ${gw.bg}`}
                  >
                    {gw.abbr}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-gray-900">
                      {gw.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isActive ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      />
                      <span
                        className={`text-xs font-medium ${
                          isActive ? 'text-green-600' : 'text-gray-500'
                        }`}
                      >
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                <Toggle
                  checked={isActive}
                  onChange={(v) =>
                    setGatewayStates((s) => ({ ...s, [gw.name]: v }))
                  }
                />
              </div>

              {/* Keys */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {gw.apiKeyLabel}
                  </label>
                  <input
                    type="text"
                    value={gw.apiKeyValue}
                    readOnly
                    className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {gw.secretLabel}
                  </label>
                  <input
                    type="text"
                    value={gw.secretValue}
                    readOnly
                    className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50"
                  />
                </div>
              </div>

              {/* Footer row */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Test Mode</span>
                  <Toggle
                    checked={isTest}
                    onChange={(v) =>
                      setTestModes((s) => ({ ...s, [gw.name]: v }))
                    }
                    size="small"
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    alert(`Configure ${gw.name} webhooks`)
                  }
                  className="text-sm text-brand-500 hover:text-brand-600 font-medium"
                >
                  Configure Webhooks
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---- COD Settings ---- */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">COD Settings</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Cash on Delivery configuration
          </p>
        </div>
        <div className="p-6 space-y-6">
          {/* Enable COD */}
          <div className="grid grid-cols-3 gap-4 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">
              Enable COD
            </label>
            <div className="col-span-2 flex items-center gap-3">
              <Toggle checked={codEnabled} onChange={setCodEnabled} />
              <span className="text-sm text-gray-500">
                Allow Cash on Delivery as a payment method
              </span>
            </div>
          </div>

          {/* COD Limit */}
          <div className="grid grid-cols-3 gap-4 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">
              COD Limit
            </label>
            <div className="col-span-2">
              <div className="flex items-center max-w-md">
                <span className="inline-flex items-center px-3 py-2.5 border border-r-0 border-gray-200 rounded-l-lg bg-gray-50 text-sm text-gray-500">
                  &#8377;
                </span>
                <input
                  type="number"
                  value={codLimit}
                  onChange={(e) => setCodLimit(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-r-lg px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Maximum order value eligible for Cash on Delivery
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
