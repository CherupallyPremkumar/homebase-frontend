import Link from 'next/link';
import { getServerUser } from '@homebase/auth/server';
import { redirect } from 'next/navigation';
import {
  ShoppingCart,
  Landmark,
  Warehouse,
  LogOut,
  ChevronRight,
  Package,
  Truck,
  RotateCcw,
  CreditCard,
  ArrowLeftRight,
  ScanBarcode,
  ClipboardList,
} from 'lucide-react';

const ALL_SECTIONS = [
  {
    href: '/oms',
    label: 'Operations',
    description: 'Manage orders end-to-end',
    icon: ShoppingCart,
    gradient: 'from-blue-600 to-blue-400',
    lightBg: 'bg-blue-50',
    border: 'border-blue-100',
    hoverBorder: 'hover:border-blue-300',
    textAccent: 'text-blue-600',
    links: [
      { label: 'Orders', icon: ShoppingCart, href: '/oms/orders' },
      { label: 'Shipments', icon: Truck, href: '/oms/shipments' },
      { label: 'Fulfillment', icon: Package, href: '/oms/fulfillment' },
      { label: 'Returns', icon: RotateCcw, href: '/oms/returns' },
    ],
    roles: ['ADMIN', 'AGENT'],
  },
  {
    href: '/finance',
    label: 'Finance',
    description: 'Settlements, payments & compliance',
    icon: Landmark,
    gradient: 'from-emerald-600 to-emerald-400',
    lightBg: 'bg-emerald-50',
    border: 'border-emerald-100',
    hoverBorder: 'hover:border-emerald-300',
    textAccent: 'text-emerald-600',
    links: [
      { label: 'Settlements', icon: Landmark, href: '/finance/settlements' },
      { label: 'Payments', icon: CreditCard, href: '/finance/payments' },
      { label: 'Reconciliation', icon: ArrowLeftRight, href: '/finance/reconciliation' },
      { label: 'GST Reports', icon: ClipboardList, href: '/finance/gst' },
    ],
    roles: ['ADMIN'],
  },
  {
    href: '/warehouse',
    label: 'Warehouse',
    description: 'Floor operations & inventory',
    icon: Warehouse,
    gradient: 'from-orange-500 to-amber-400',
    lightBg: 'bg-orange-50',
    border: 'border-orange-100',
    hoverBorder: 'hover:border-orange-300',
    textAccent: 'text-orange-600',
    links: [
      { label: 'Receiving', icon: Package, href: '/warehouse/receiving' },
      { label: 'Picking', icon: ClipboardList, href: '/warehouse/picking' },
      { label: 'Packing', icon: ScanBarcode, href: '/warehouse/packing' },
      { label: 'Cycle Count', icon: RotateCcw, href: '/warehouse/cycle-count' },
    ],
    roles: ['ADMIN', 'WAREHOUSE'],
  },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default async function Dashboard() {
  const user = await getServerUser();
  if (!user) redirect('/login');

  const sections = ALL_SECTIONS.filter((s) =>
    s.roles.some((r) => user.roles.includes(r))
  );

  const firstName = user.name?.split(' ')[0] || 'there';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Warehouse className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">HomeBase</span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">Backoffice</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {firstName[0].toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user.name || 'User'}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>
            <Link
              href="/api/auth/logout"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-8 pt-14 pb-10">
        <p className="text-sm font-medium text-primary">{getGreeting()}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
          {firstName} — where would you like to work?
        </h1>
        <p className="mt-2 text-gray-500">
          {sections.length === 1
            ? 'Your workspace is ready.'
            : `You have access to ${sections.length} sections.`}
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-8 pb-16">
        <div className={`grid gap-6 ${
          sections.length === 1 ? 'max-w-sm grid-cols-1' :
          sections.length === 2 ? 'max-w-3xl grid-cols-1 md:grid-cols-2' :
          'grid-cols-1 md:grid-cols-3'
        }`}>
          {sections.map(({ href, label, description, icon: Icon, gradient, lightBg, border, hoverBorder, textAccent, links }) => (
            <div
              key={href}
              className={`group relative overflow-hidden rounded-2xl border-2 bg-white transition-all duration-200 hover:shadow-lg ${border} ${hoverBorder}`}
            >
              <Link href={href} className="block p-6">
                <div className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-br p-3 ${gradient}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="mt-4 flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{label}</h2>
                    <p className="mt-0.5 text-sm text-gray-500">{description}</p>
                  </div>
                  <ChevronRight className={`mt-1 h-5 w-5 transition-transform group-hover:translate-x-1 ${textAccent}`} />
                </div>
              </Link>

              <div className={`border-t px-6 py-4 ${lightBg}`}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Quick access</p>
                <div className="grid grid-cols-2 gap-1">
                  {links.map(({ label: lLabel, icon: LIcon, href: lHref }) => (
                    <Link
                      key={lHref}
                      href={lHref}
                      className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-white hover:${textAccent}`}
                    >
                      <LIcon className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                      {lLabel}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
