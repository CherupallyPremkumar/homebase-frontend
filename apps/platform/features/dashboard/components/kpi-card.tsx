import Link from 'next/link';
import {
  CircleDollarSign,
  IndianRupee,
  TrendingUp,
  ShoppingBag,
  Store,
  Users,
  ShoppingCart,
  Archive,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import type { KpiCard as KpiCardType } from '../types';
import { Sparkline } from './sparkline';

const ICON_MAP: Record<string, LucideIcon> = {
  currency: CircleDollarSign,
  rupee: IndianRupee,
  'trending-up': TrendingUp,
  'shopping-bag': ShoppingBag,
  store: Store,
  users: Users,
  cart: ShoppingCart,
  archive: Archive,
};

const SPARKLINE_GRADIENT: Record<string, string[]> = {
  'bg-brand': ['bg-brand-300', 'bg-brand-400', 'bg-brand-500'],
  'bg-emerald': ['bg-emerald-300', 'bg-emerald-400', 'bg-emerald-500'],
  'bg-blue': ['bg-blue-300', 'bg-blue-400', 'bg-blue-500'],
  'bg-violet': ['bg-violet-300', 'bg-violet-400', 'bg-violet-500'],
  'bg-sky': ['bg-sky-300', 'bg-sky-400', 'bg-sky-500'],
  'bg-amber': ['bg-amber-300', 'bg-amber-400', 'bg-amber-500'],
  'bg-rose': ['bg-rose-300', 'bg-rose-400', 'bg-rose-500'],
};

function GradientSparkline({ data, colorKey }: { data: number[]; colorKey: string }) {
  const max = Math.max(...data, 1);
  const colors = SPARKLINE_GRADIENT[colorKey] ?? ['bg-gray-300', 'bg-gray-400', 'bg-gray-500'];

  return (
    <div className="mt-2 inline-flex items-end gap-px" style={{ height: 20 }} aria-hidden="true">
      {data.map((value, i) => {
        const colorIdx = i < 2 ? 0 : i < 5 ? 1 : 2;
        return (
          <div
            key={i}
            className={`rounded-[1px] ${colors[colorIdx]}`}
            style={{ width: 3, height: Math.max(2, (value / max) * 20), transition: 'height 0.3s ease' }}
          />
        );
      })}
    </div>
  );
}

interface KpiCardProps {
  card: KpiCardType;
}

export function KpiCard({ card }: KpiCardProps) {
  const Icon = ICON_MAP[card.iconKey] ?? CircleDollarSign;

  return (
    <Link
      href={card.href}
      className="stat-card block cursor-pointer rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${card.iconBgColor}`}>
          <Icon className={`h-5 w-5 ${card.iconColor}`} />
        </div>
        <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-600">
          {card.trend}
        </span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{card.value}</p>
      <p className="mt-1 text-xs text-gray-500">{card.title}</p>
      <GradientSparkline data={card.sparklineData} colorKey={card.sparklineColor} />
    </Link>
  );
}
