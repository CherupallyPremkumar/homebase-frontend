'use client';

import { SectionSkeleton, ErrorSection, formatPriceRupees, formatNumber } from '@homebase/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@homebase/ui';
import { DollarSign, ShoppingCart, Package, Users } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useDashboardStats } from '../api/queries';
import { StatCard } from './stat-card';
import { RecentOrders } from './recent-orders';
import { LowStockAlerts } from './low-stock-alerts';

const RevenueChart = dynamic(() => import('./revenue-chart'), { ssr: false });
const OrdersDonut = dynamic(() => import('./orders-donut'), { ssr: false });

export function DashboardPage() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats();

  if (statsError) return <ErrorSection error={statsError} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats row */}
      {statsLoading ? (
        <div className="grid gap-4 md:grid-cols-4"><SectionSkeleton rows={4} variant="card" /></div>
      ) : stats ? (
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard title="Total Orders" value={formatNumber(stats.totalOrders)} change={stats.ordersChange} icon={ShoppingCart} />
          <StatCard title="Revenue" value={formatPriceRupees(stats.totalRevenue)} change={stats.revenueChange} icon={DollarSign} />
          <StatCard title="Active Products" value={formatNumber(stats.activeProducts)} change={stats.productsChange} icon={Package} />
          <StatCard title="Active Users" value={formatNumber(stats.activeUsers)} change={stats.usersChange} icon={Users} />
        </div>
      ) : null}

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Revenue (30 days)</CardTitle></CardHeader>
          <CardContent className="h-72">
            <RevenueChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Orders by State</CardTitle></CardHeader>
          <CardContent className="h-72">
            <OrdersDonut />
          </CardContent>
        </Card>
      </div>

      {/* Recent orders + alerts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentOrders />
        <LowStockAlerts />
      </div>
    </div>
  );
}
