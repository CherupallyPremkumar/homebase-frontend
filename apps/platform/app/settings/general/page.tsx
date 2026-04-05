'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, FileText, Home } from 'lucide-react';

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
export default function GeneralSettingsPage() {
  const [platformName, setPlatformName] = useState('HomeBase');
  const [supportEmail, setSupportEmail] = useState('support@homebase.in');
  const [currency, setCurrency] = useState('INR - Indian Rupee');
  const [timezone, setTimezone] = useState(
    'IST - India Standard Time (UTC+5:30)',
  );
  const [maintenanceMode, setMaintenanceMode] = useState(false);

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
            General Settings
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Basic platform configuration
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
          {/* Platform Name */}
          <div className="grid grid-cols-3 gap-4 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">
              Platform Name
            </label>
            <div className="col-span-2">
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full max-w-md border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition"
              />
              <p className="text-xs text-gray-400 mt-1">
                Displayed across the platform and in emails
              </p>
            </div>
          </div>

          {/* Platform Logo */}
          <div className="grid grid-cols-3 gap-4 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">
              Platform Logo
            </label>
            <div className="col-span-2">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-brand-500">
                  <Home className="h-8 w-8 text-white" />
                </div>
                <button
                  type="button"
                  onClick={() => alert('File picker opened')}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <Upload className="h-4 w-4" />
                  Upload New Logo
                </button>
              </div>
            </div>
          </div>

          {/* Support Email */}
          <div className="grid grid-cols-3 gap-4 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">
              Support Email
            </label>
            <div className="col-span-2">
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full max-w-md border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition"
              />
            </div>
          </div>

          {/* Default Currency */}
          <div className="grid grid-cols-3 gap-4 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">
              Default Currency
            </label>
            <div className="col-span-2">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full max-w-md border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition bg-white"
              >
                <option>INR - Indian Rupee</option>
                <option>USD - US Dollar</option>
                <option>EUR - Euro</option>
                <option>GBP - British Pound</option>
              </select>
            </div>
          </div>

          {/* Timezone */}
          <div className="grid grid-cols-3 gap-4 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">
              Timezone
            </label>
            <div className="col-span-2">
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full max-w-md border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition bg-white"
              >
                <option>IST - India Standard Time (UTC+5:30)</option>
                <option>UTC - Coordinated Universal Time</option>
                <option>EST - Eastern Standard Time (UTC-5)</option>
                <option>PST - Pacific Standard Time (UTC-8)</option>
              </select>
            </div>
          </div>

          {/* Maintenance Mode */}
          <div className="grid grid-cols-3 gap-4 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">
              Maintenance Mode
            </label>
            <div className="col-span-2 flex items-center gap-3">
              <Toggle
                checked={maintenanceMode}
                onChange={setMaintenanceMode}
              />
              <span className="text-sm text-gray-500">
                Temporarily disable the platform for maintenance
              </span>
            </div>
          </div>

          {/* Legal Policies */}
          <div className="grid grid-cols-3 gap-4 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">
              Legal Policies
            </label>
            <div className="col-span-2">
              <Link
                href="/cms/policies"
                className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700 transition"
              >
                <FileText className="h-4 w-4" />
                Manage Policies &rarr;
              </Link>
              <p className="text-xs text-gray-400 mt-1">
                Terms &amp; Conditions, Privacy Policy, Return Policy, and more
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
