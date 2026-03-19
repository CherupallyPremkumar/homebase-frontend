'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi, ordersApi } from '@homebase/api-client';
import { StateBadge, SectionSkeleton, ErrorSection, formatPriceRupees, formatDate, formatNumber, CACHE_TIMES } from '@homebase/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@homebase/ui';
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const RevenueChart = dynamic(() => import('@/components/dashboard/revenue-chart'), { ssr: false });
const OrdersDonut = dynamic(() => import('@/components/dashboard/orders-donut'), { ssr: false });

export function DashboardClient() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.overviewStats(),
    ...CACHE_TIMES.dashboard,
    refetchInterval: 30_000,
  });

  const { data: recentOrders } = useQuery({
    queryKey: ['dashboard-recent-orders'],
    queryFn: () => dashboardApi.recentOrders(10),
    ...CACHE_TIMES.dashboard,
    refetchInterval: 30_000,
  });

  const { data: lowStock } = useQuery({
    queryKey: ['dashboard-low-stock'],
    queryFn: () => dashboardApi.lowStockAlerts(),
    ...CACHE_TIMES.dashboard,
  });

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
        <Card>
          <CardHeader><CardTitle>Recent Orders</CardTitle></CardHeader>
          <CardContent>
            {recentOrders?.length ? (
              <div className="space-y-3">
                {recentOrders.slice(0, 5).map((order) => (
                  <Link key={order.id} href={`/orders/${order.id}`} className="flex items-center justify-between rounded p-2 text-sm hover:bg-gray-50">
                    <div>
                      <p className="font-medium">#{order.orderNumber}</p>
                      <p className="text-xs text-gray-500">{formatDate(order.createdTime)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{formatPriceRupees(order.total)}</span>
                      <StateBadge state={order.stateId} />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No recent orders</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-yellow-500" />Low Stock Alerts</CardTitle></CardHeader>
          <CardContent>
            {lowStock?.length ? (
              <div className="space-y-3">
                {lowStock.slice(0, 5).map((item) => (
                  <div key={item.productId} className="flex items-center justify-between rounded p-2 text-sm">
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                    </div>
                    <span className={`font-bold ${item.currentStock === 0 ? 'text-red-600' : 'text-yellow-600'}`}>
                      {item.currentStock} left
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No low stock alerts</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon: Icon }: { title: string; value: string; change: number; icon: React.ElementType }) {
  const isPositive = change >= 0;
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
          <p className={`mt-1 flex items-center gap-1 text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {isPositive ? '+' : ''}{change}% vs last period
          </p>
        </div>
        <div className="rounded-full bg-primary/10 p-3">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </CardContent>
    </Card>
  );
}
