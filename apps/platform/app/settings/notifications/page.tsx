'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Send, Check, X } from 'lucide-react';

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
/*  Notification templates data                                        */
/* ------------------------------------------------------------------ */

interface TemplateRow {
  name: string;
  email: boolean;
  sms: boolean;
  push: boolean;
}

const DEFAULT_TEMPLATES: TemplateRow[] = [
  { name: 'Order Confirmation', email: true, sms: true, push: true },
  { name: 'Shipment Update', email: true, sms: true, push: true },
  { name: 'Return Approved', email: true, sms: false, push: true },
  { name: 'Password Reset', email: true, sms: false, push: false },
  { name: 'Seller Payout', email: true, sms: true, push: false },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function NotificationsSettingsPage() {
  /* --- Email provider --- */
  const [smtpHost, setSmtpHost] = useState('smtp.homebase.in');
  const [smtpPort, setSmtpPort] = useState(587);
  const [smtpUsername, setSmtpUsername] = useState('noreply@homebase.in');
  const [fromName, setFromName] = useState('HomeBase');

  /* --- SMS provider --- */
  const [smsProvider, setSmsProvider] = useState('MSG91');
  const [smsApiKey, setSmsApiKey] = useState('••••••••••••••••');
  const [senderId, setSenderId] = useState('HMBASE');

  /* --- Push --- */
  const [pushEnabled, setPushEnabled] = useState(true);

  /* --- Templates --- */
  const [templates, setTemplates] = useState<TemplateRow[]>(DEFAULT_TEMPLATES);

  function toggleTemplate(idx: number, channel: 'email' | 'sms' | 'push') {
    setTemplates((prev) =>
      prev.map((t, i) => (i === idx ? { ...t, [channel]: !t[channel] } : t)),
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
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-1 text-sm text-gray-500">
            Email, SMS, and push notification providers and templates
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

      {/* ============ Email Provider Section ============ */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Email Provider</h2>
          <p className="text-xs text-gray-400 mt-0.5">SMTP configuration for outbound emails</p>
        </div>
        <div className="divide-y divide-gray-100">
          {/* SMTP Host */}
          <div className="grid grid-cols-3 gap-4 px-6 py-5 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">SMTP Host</label>
            <div className="col-span-2">
              <input
                type="text"
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
                className="w-full max-w-md rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
              />
            </div>
          </div>

          {/* SMTP Port */}
          <div className="grid grid-cols-3 gap-4 px-6 py-5 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">SMTP Port</label>
            <div className="col-span-2">
              <input
                type="number"
                value={smtpPort}
                onChange={(e) => setSmtpPort(Number(e.target.value))}
                className="w-full max-w-md rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
              />
            </div>
          </div>

          {/* Username */}
          <div className="grid grid-cols-3 gap-4 px-6 py-5 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">Username</label>
            <div className="col-span-2">
              <input
                type="text"
                value={smtpUsername}
                onChange={(e) => setSmtpUsername(e.target.value)}
                className="w-full max-w-md rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
              />
            </div>
          </div>

          {/* From Name */}
          <div className="grid grid-cols-3 gap-4 px-6 py-5 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">From Name</label>
            <div className="col-span-2">
              <input
                type="text"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                className="w-full max-w-md rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
              />
            </div>
          </div>

          {/* Test Connection */}
          <div className="grid grid-cols-3 gap-4 px-6 py-5 items-start">
            <span className="text-sm font-medium text-gray-700 pt-2">Test Connection</span>
            <div className="col-span-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                <Send className="h-4 w-4" />
                Send Test Email
              </button>
              <p className="mt-1 text-xs text-gray-400">
                Sends a test email to verify SMTP configuration
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============ SMS Provider Section ============ */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">SMS Provider</h2>
          <p className="text-xs text-gray-400 mt-0.5">Configure SMS gateway for transactional messages</p>
        </div>
        <div className="divide-y divide-gray-100">
          {/* Provider */}
          <div className="grid grid-cols-3 gap-4 px-6 py-5 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">Provider</label>
            <div className="col-span-2">
              <select
                value={smsProvider}
                onChange={(e) => setSmsProvider(e.target.value)}
                className="w-full max-w-md rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
              >
                <option value="MSG91">MSG91</option>
                <option value="Twilio">Twilio</option>
                <option value="AWS SNS">AWS SNS</option>
              </select>
            </div>
          </div>

          {/* API Key */}
          <div className="grid grid-cols-3 gap-4 px-6 py-5 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">API Key</label>
            <div className="col-span-2">
              <input
                type="password"
                value={smsApiKey}
                onChange={(e) => setSmsApiKey(e.target.value)}
                className="w-full max-w-md rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
              />
            </div>
          </div>

          {/* Sender ID */}
          <div className="grid grid-cols-3 gap-4 px-6 py-5 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">Sender ID</label>
            <div className="col-span-2">
              <input
                type="text"
                value={senderId}
                onChange={(e) => setSenderId(e.target.value)}
                className="w-full max-w-md rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
              />
              <p className="mt-1 text-xs text-gray-400">
                6-character alphanumeric sender ID for SMS messages
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============ Push Notifications Toggle ============ */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-3 gap-4 px-6 py-5 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">Push Notifications</label>
            <div className="col-span-2 flex items-center gap-3">
              <Toggle enabled={pushEnabled} onChange={setPushEnabled} />
              <span className="text-sm text-gray-500">
                Enable push notifications for mobile and web clients
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============ Notification Templates Table ============ */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Notification Templates</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Enable or disable channels per notification type
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="px-6 py-3 text-left font-medium text-gray-500">Template</th>
                <th className="px-6 py-3 text-center font-medium text-gray-500">Email</th>
                <th className="px-6 py-3 text-center font-medium text-gray-500">SMS</th>
                <th className="px-6 py-3 text-center font-medium text-gray-500">Push</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {templates.map((tpl, idx) => (
                <tr key={tpl.name} className="hover:bg-orange-50/40 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-700">{tpl.name}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => toggleTemplate(idx, 'email')}
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-full transition ${
                        tpl.email
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {tpl.email ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => toggleTemplate(idx, 'sms')}
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-full transition ${
                        tpl.sms
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {tpl.sms ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => toggleTemplate(idx, 'push')}
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-full transition ${
                        tpl.push
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {tpl.push ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
