'use client';

import Link from 'next/link';
import { Skeleton } from '@homebase/ui';

import { useDashboardPaymentMix } from '../hooks/use-dashboard';
import { StackedBar } from './stacked-bar';

const TEXT = {
  title: 'Payment Mix',
  viewPayments: 'View Payments',
  successRate: 'Payment Success Rate',
  failedToday: 'Failed Transactions Today',
} as const;

const LEGEND_COLORS: Record<string, string> = {
  UPI: 'bg-violet-500',
  Cards: 'bg-blue-500',
  COD: 'bg-amber-500',
  Wallet: 'bg-emerald-500',
  NetBanking: 'bg-gray-400',
};

export function PaymentMixSkeleton() {
  return <Skeleton className="h-[400px] w-full rounded-xl" />;
}

export function PaymentMixPanel() {
  const { data, isLoading } = useDashboardPaymentMix();

  if (isLoading || !data) return <PaymentMixSkeleton />;

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">{TEXT.title}</h2>
        <Link href="/finance" className="text-xs font-medium text-brand-500 transition hover:text-brand-600">
          {TEXT.viewPayments}
        </Link>
      </div>
      <div className="px-6 py-5">
        {/* Stacked Bar */}
        <StackedBar
          segments={data.methods.map((m) => ({ label: m.name, percentage: m.percentage, color: m.color }))}
          height="h-8"
        />

        {/* Legend */}
        <div className="mb-5 mt-5 grid grid-cols-5 gap-2">
          {data.methods.map((m) => (
            <div key={m.name} className="flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-sm ${LEGEND_COLORS[m.name] ?? 'bg-gray-400'}`} />
              <span className="text-[10px] text-gray-600">{m.name}</span>
            </div>
          ))}
        </div>

        {/* Payment Health */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-green-100 bg-green-50 p-3 text-center">
            <p className="text-lg font-bold text-green-700">{data.overallSuccessRate}</p>
            <p className="text-[10px] text-green-600">{TEXT.successRate}</p>
          </div>
          <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-center">
            <p className="text-lg font-bold text-red-700">{data.failedTransactions}</p>
            <p className="text-[10px] text-red-600">{TEXT.failedToday}</p>
          </div>
        </div>

        {/* Method Breakdown */}
        <div className="space-y-2.5">
          {data.methods.slice(0, 3).map((m) => (
            <div key={m.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${LEGEND_COLORS[m.name] ?? 'bg-gray-400'}`} />
                <span className="text-sm text-gray-700">{m.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-900">{m.revenue}</span>
                <span className={`text-[10px] font-medium ${m.successRate.includes('RTO') ? 'text-amber-600' : 'text-green-600'}`}>
                  {m.successRate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
