import type { MockDashboardStats as DashboardStats } from '../types';
import { formatCurrency, INR_STRATEGY } from '../../../lib/formatters/currency';

// ----------------------------------------------------------------
// Adapter: Raw DashboardStats -> StatCard render props
// ----------------------------------------------------------------

export interface StatCardConfig {
  key: string;
  title: string;
  iconKey: string;
  iconColor: string;
  /** Link to navigate when card is clicked */
  href: string;
  /** Optional subtitle (replaces trend display) */
  subtitle?: string;
}

export interface AdaptedStatCard extends StatCardConfig {
  value: string;
}

export const STAT_CARDS_CONFIG: StatCardConfig[] = [
  {
    key: 'totalRevenue',
    title: 'Total Revenue',
    iconKey: 'indian-rupee',
    iconColor: 'text-orange-500',
    href: '/analytics',
  },
  {
    key: 'totalOrders',
    title: 'Total Orders',
    iconKey: 'shopping-bag',
    iconColor: 'text-blue-500',
    href: '/orders',
  },
  {
    key: 'activeSellers',
    title: 'Active Sellers',
    iconKey: 'store',
    iconColor: 'text-emerald-500',
    href: '/suppliers',
  },
  {
    key: 'activeUsers',
    title: 'Active Users',
    iconKey: 'users',
    iconColor: 'text-violet-500',
    href: '/users',
  },
  {
    key: 'productsListed',
    title: 'Products Listed',
    iconKey: 'package',
    iconColor: 'text-amber-500',
    href: '/products',
  },
  {
    key: 'pendingApprovals',
    title: 'Pending Approvals',
    iconKey: 'alert-triangle',
    iconColor: 'text-red-500',
    href: '/compliance',
    subtitle: 'Needs Action',
  },
];

export function adaptStats(
  stats: DashboardStats | undefined,
): AdaptedStatCard[] {
  return STAT_CARDS_CONFIG.map((config) => {
    const raw = stats?.[config.key as keyof DashboardStats];

    let value = '--';

    if (raw) {
      if ('currency' in raw || config.key === 'totalRevenue') {
        value = formatCurrency((raw as { value: number }).value, INR_STRATEGY);
      } else {
        value =
          typeof (raw as { value: number }).value === 'number'
            ? (raw as { value: number }).value.toLocaleString('en-IN')
            : String((raw as { value: number }).value);
      }
    }

    return { ...config, value };
  });
}
