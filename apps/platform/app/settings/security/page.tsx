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

export default function SecuritySettingsPage() {
  /* --- form state with mock defaults --- */
  const [minPasswordLength, setMinPasswordLength] = useState(8);
  const [requireUppercase, setRequireUppercase] = useState(true);
  const [requireNumber, setRequireNumber] = useState(true);
  const [requireSpecialChar, setRequireSpecialChar] = useState(true);
  const [twoFAAdmins, setTwoFAAdmins] = useState(true);
  const [twoFASellers, setTwoFASellers] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(5);
  const [lockoutDuration, setLockoutDuration] = useState(15);
  const [ipWhitelist, setIpWhitelist] = useState('');

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
          <h1 className="text-2xl font-bold text-gray-900">Security</h1>
          <p className="mt-1 text-sm text-gray-500">
            Password policies, session management, and access controls
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
          {/* Min Password Length */}
          <div className="grid grid-cols-3 gap-4 px-6 py-5 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">Min Password Length</label>
            <div className="col-span-2">
              <div className="flex items-center gap-2 max-w-md">
                <input
                  type="number"
                  min={4}
                  value={minPasswordLength}
                  onChange={(e) => setMinPasswordLength(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                />
                <span className="whitespace-nowrap text-sm text-gray-500">characters</span>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Minimum number of characters required for passwords
              </p>
            </div>
          </div>

          {/* Require Uppercase */}
          <div className="grid grid-cols-3 gap-4 px-6 py-5 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">Require Uppercase</label>
            <div className="col-span-2 flex items-center gap-3">
              <Toggle enabled={requireUppercase} onChange={setRequireUppercase} />
              <span className="text-sm text-gray-500">
                At least one uppercase letter required
              </span>
            </div>
          </div>

          {/* Require Number */}
          <div className="grid grid-cols-3 gap-4 px-6 py-5 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">Require Number</label>
            <div className="col-span-2 flex items-center gap-3">
              <Toggle enabled={requireNumber} onChange={setRequireNumber} />
              <span className="text-sm text-gray-500">
                At least one numeric digit required
              </span>
            </div>
          </div>

          {/* Require Special Character */}
          <div className="grid grid-cols-3 gap-4 px-6 py-5 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">
              Require Special Character
            </label>
            <div className="col-span-2 flex items-center gap-3">
              <Toggle enabled={requireSpecialChar} onChange={setRequireSpecialChar} />
              <span className="text-sm text-gray-500">
                At least one special character (e.g. !@#$%) required
              </span>
            </div>
          </div>

          {/* 2FA for Admins */}
          <div className="grid grid-cols-3 gap-4 px-6 py-5 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">2FA for Admins</label>
            <div className="col-span-2 flex items-center gap-3">
              <Toggle enabled={twoFAAdmins} onChange={setTwoFAAdmins} />
              <span className="text-sm text-gray-500">
                Require two-factor authentication for all admin accounts
              </span>
            </div>
          </div>

          {/* 2FA for Sellers */}
          <div className="grid grid-cols-3 gap-4 px-6 py-5 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">2FA for Sellers</label>
            <div className="col-span-2 flex items-center gap-3">
              <Toggle enabled={twoFASellers} onChange={setTwoFASellers} />
              <span className="text-sm text-gray-500">
                Require two-factor authentication for seller accounts
              </span>
            </div>
          </div>

          {/* Session Timeout */}
          <div className="grid grid-cols-3 gap-4 px-6 py-5 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">Session Timeout</label>
            <div className="col-span-2">
              <div className="flex items-center gap-2 max-w-md">
                <input
                  type="number"
                  min={1}
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                />
                <span className="whitespace-nowrap text-sm text-gray-500">minutes</span>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Inactive sessions are automatically terminated
              </p>
            </div>
          </div>

          {/* Max Login Attempts */}
          <div className="grid grid-cols-3 gap-4 px-6 py-5 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">Max Login Attempts</label>
            <div className="col-span-2">
              <input
                type="number"
                min={1}
                value={maxLoginAttempts}
                onChange={(e) => setMaxLoginAttempts(Number(e.target.value))}
                className="w-full max-w-md rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
              />
              <p className="mt-1 text-xs text-gray-400">
                Account is locked after this many failed attempts
              </p>
            </div>
          </div>

          {/* Lockout Duration */}
          <div className="grid grid-cols-3 gap-4 px-6 py-5 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">Lockout Duration</label>
            <div className="col-span-2">
              <div className="flex items-center gap-2 max-w-md">
                <input
                  type="number"
                  min={1}
                  value={lockoutDuration}
                  onChange={(e) => setLockoutDuration(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                />
                <span className="whitespace-nowrap text-sm text-gray-500">minutes</span>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Duration the account stays locked after max failed attempts
              </p>
            </div>
          </div>

          {/* IP Whitelist */}
          <div className="grid grid-cols-3 gap-4 px-6 py-5 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">IP Whitelist</label>
            <div className="col-span-2">
              <textarea
                rows={4}
                value={ipWhitelist}
                onChange={(e) => setIpWhitelist(e.target.value)}
                placeholder={'Enter one IP per line\ne.g. 203.0.113.50\n192.168.1.0/24'}
                className="w-full max-w-md rounded-lg border border-gray-200 px-4 py-2.5 font-mono text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
              />
              <p className="mt-1 text-xs text-gray-400">
                Restrict admin access to specific IP addresses (one per line). Leave empty to allow
                all.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
