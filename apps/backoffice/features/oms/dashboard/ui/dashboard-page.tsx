'use client';

import { SectionSkeleton, ErrorSection, formatNumber } from '@homebase/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@homebase/ui';
import { ShoppingCart, Truck, PackageOpen, Clock } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useDashboardStats } from '../api/queries';
import { StatCard } from './stat-card';
import { RecentOrders } from './recent-orders';
import { OpsAlerts } from './ops-alerts';

const OrdersDonut = dynamic(() => import('./orders-donut'), { ssr: false });

export function DashboardPage() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats();

  if (statsError) return <ErrorSection error={statsError} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Operations Dashboard</h1>

      {statsLoading ? (
        <div className="grid gap-4 md:grid-cols-4"><SectionSkeleton rows={4} variant="card" /></div>
      ) : stats ? (
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard title="Total Orders" value={formatNumber(stats.totalOrders ?? 0)} icon={ShoppingCart} />
          <StatCard title="Active Orders" value={formatNumber(stats.activeOrders ?? 0)} icon={Clock} accent="bg-yellow-500" />
          <StatCard title="Open Tickets" value={formatNumber(stats.openTickets ?? 0)} icon={Truck} accent="bg-blue-500" />
          <StatCard title="Active Suppliers" value={formatNumber(stats.activeSuppliers ?? 0)} icon={PackageOpen} accent="bg-green-500" />
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Orders by State</CardTitle></CardHeader>
          <CardContent className="h-72">
            <OrdersDonut />
          </CardContent>
        </Card>
        <OpsAlerts />
      </div>

      <RecentOrders />
    </div>
  );
}
