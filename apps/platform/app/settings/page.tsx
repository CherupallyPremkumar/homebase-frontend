'use client';

import Link from 'next/link';
import { cn } from '@homebase/ui/src/lib/utils';
import {
  Building2,
  CreditCard,
  Truck,
  Bell,
  ShieldCheck,
  KeyRound,
  Package,
  ShoppingCart,
  RotateCcw,
  Store,
  FileText,
  Calculator,
  Clock,
  Archive,
  Download,
  Upload,
} from 'lucide-react';

// ----------------------------------------------------------------
// TEXT CONSTANTS
// ----------------------------------------------------------------

const TEXT = {
  pageTitle: 'Settings',
  pageSubtitle: 'Manage your platform configuration, policies, and preferences',
  lastConfigTitle: 'Last Configuration Change',
  lastConfigMessage: 'Commission rate updated to',
  lastConfigValue: '5%',
  lastConfigAuthor: 'admin@homebase.com',
  lastConfigDate: '28 Mar 2026, 3:45 PM',
  lastConfigCta: 'View Full Change Log',
  backupTitle: 'Settings Backup',
  backupLastDate: '28 Mar 2026',
  backupSchedule: 'Auto-backup enabled (daily at 2:00 AM)',
  exportBtn: 'Export All Settings',
  importBtn: 'Import Settings',
} as const;

// ----------------------------------------------------------------
// STATUS INDICATOR TYPES
// ----------------------------------------------------------------

type StatusColor = 'green' | 'yellow';

interface StatusIndicator {
  label: string;
  color: StatusColor;
}

// ----------------------------------------------------------------
// SETTINGS CARD DATA (pixel-for-pixel match to prototype)
// ----------------------------------------------------------------

interface SettingCard {
  title: string;
  description: string;
  detail?: string;
  statuses?: StatusIndicator[];
  href: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

const SETTINGS_CARDS: SettingCard[] = [
  {
    title: 'General',
    description: 'Platform identity, business entity, locale',
    detail: 'Last updated: 28 Mar 2026',
    href: '/settings/general',
    icon: Building2,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
  },
  {
    title: 'Payment Infrastructure',
    description: 'Gateways, commission, settlements, refunds',
    statuses: [
      { label: 'Razorpay active', color: 'green' },
      { label: 'PayU standby', color: 'yellow' },
    ],
    href: '/settings/payments',
    icon: CreditCard,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-500',
  },
  {
    title: 'Shipping',
    description: 'Carriers, zones, rates, free shipping rules',
    detail: '3 carriers active \u00B7 Free above \u20B9999',
    href: '/management/shipping',
    icon: Truck,
    iconBg: 'bg-cyan-50',
    iconColor: 'text-cyan-500',
  },
  {
    title: 'Notifications',
    description: 'Email, SMS, push notification providers',
    statuses: [
      { label: 'SMTP active', color: 'green' },
      { label: 'MSG91 active', color: 'green' },
    ],
    href: '/settings/notifications',
    icon: Bell,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-500',
  },
  {
    title: 'Security',
    description: 'Password policy, 2FA, sessions, IP whitelist',
    statuses: [
      { label: '2FA enabled for admins', color: 'green' },
    ],
    href: '/settings/security',
    icon: ShieldCheck,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
  },
  {
    title: 'API Keys',
    description: 'API tokens, webhooks, third-party integrations',
    detail: '4 active keys \u00B7 2 webhooks configured',
    href: '/settings/security',
    icon: KeyRound,
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-500',
  },
  {
    title: 'Product Listings',
    description: 'Image rules, listing rules, mandatory fields',
    detail: 'Min 3 images \u00B7 800x800px required',
    href: '/settings/listings',
    icon: Package,
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-500',
  },
  {
    title: 'Orders & Checkout',
    description: 'Cart limits, checkout rules, auto-cancel',
    detail: 'COD limit: \u20B910,000 \u00B7 Auto-cancel: 48hrs',
    href: '/settings/orders',
    icon: ShoppingCart,
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-500',
  },
  {
    title: 'Returns & Refunds',
    description: 'Return window, refund rules, exchange',
    detail: '30-day window \u00B7 Auto-approve below \u20B91,000',
    href: '/settings/returns',
    icon: RotateCcw,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
  },
  {
    title: 'Seller Management',
    description: 'Registration, verification, payout rules',
    detail: 'Weekly payouts \u00B7 Min \u20B9500 threshold',
    href: '/settings/sellers',
    icon: Store,
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-500',
  },
  {
    title: 'Legal Policies',
    description: 'Terms, Privacy, Return Policy, Seller Agreement',
    detail: '6 policies \u00B7 1 draft pending',
    href: '/cms/policies',
    icon: FileText,
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-500',
  },
  {
    title: 'Tax Configuration',
    description: 'GST rates, HSN codes, tax exemptions',
    detail: 'GST: 5%, 12%, 18%, 28% slabs configured',
    href: '/management/tax',
    icon: Calculator,
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-500',
  },
];

// ----------------------------------------------------------------
// STATUS DOT COLOR MAP
// ----------------------------------------------------------------

const STATUS_DOT_COLORS: Record<StatusColor, string> = {
  green: 'bg-green-400',
  yellow: 'bg-yellow-400',
};

// ----------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <header>
        <h1 className="text-2xl font-bold text-gray-900">{TEXT.pageTitle}</h1>
        <p className="mt-1 text-sm text-gray-500">{TEXT.pageSubtitle}</p>
      </header>

      {/* Info Banners */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Last Configuration Change */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900">
                {TEXT.lastConfigTitle}
              </h3>
              <p className="mt-1 text-sm text-blue-700">
                {TEXT.lastConfigMessage}{' '}
                <span className="font-bold">{TEXT.lastConfigValue}</span> by{' '}
                <span className="font-semibold">{TEXT.lastConfigAuthor}</span>
              </p>
              <p className="mt-1 text-xs text-blue-500">{TEXT.lastConfigDate}</p>
              <button
                type="button"
                className="mt-2 text-xs font-medium text-blue-600 hover:underline"
              >
                {TEXT.lastConfigCta} &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Settings Backup */}
        <div className="rounded-xl border border-green-200 bg-green-50 p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100">
              <Archive className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-green-900">
                {TEXT.backupTitle}
              </h3>
              <p className="mt-1 text-sm text-green-700">
                Last backup: <span className="font-bold">{TEXT.backupLastDate}</span>
              </p>
              <p className="mt-1 text-xs text-green-500">{TEXT.backupSchedule}</p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-green-700"
                >
                  <Download className="h-3.5 w-3.5" />
                  {TEXT.exportBtn}
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-green-300 px-3 py-1.5 text-xs font-medium text-green-700 transition hover:bg-green-100"
                >
                  <Upload className="h-3.5 w-3.5" />
                  {TEXT.importBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Cards Grid */}
      <section aria-label="Settings categories">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SETTINGS_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className={cn(
                  'group block rounded-xl border border-gray-100 bg-white p-6',
                  'transition-all duration-200',
                  'hover:-translate-y-[3px] hover:border-orange-400',
                  'hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]'
                )}
              >
                <div className="mb-3 flex items-center gap-4">
                  <div
                    className={cn(
                      'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                      card.iconBg
                    )}
                    aria-hidden="true"
                  >
                    <Icon className={cn('h-5 w-5', card.iconColor)} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{card.title}</h3>
                    <p className="mt-0.5 text-xs text-gray-400">{card.description}</p>
                  </div>
                </div>

                {/* Status indicators or plain detail text */}
                {card.statuses ? (
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    {card.statuses.map((status, idx) => (
                      <span
                        key={status.label}
                        className={cn('flex items-center gap-1.5', idx > 0 && 'ml-2')}
                      >
                        <span
                          className={cn(
                            'h-1.5 w-1.5 shrink-0 rounded-full',
                            STATUS_DOT_COLORS[status.color]
                          )}
                          aria-hidden="true"
                        />
                        {status.label}
                      </span>
                    ))}
                  </div>
                ) : card.detail ? (
                  <div className="text-xs text-gray-400">{card.detail}</div>
                ) : null}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
