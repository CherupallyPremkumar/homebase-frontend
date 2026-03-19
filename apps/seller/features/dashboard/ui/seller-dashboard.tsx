'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@homebase/ui';
import { SectionSkeleton, ErrorSection, formatPriceRupees, formatNumber, formatDate, StateBadge } from '@homebase/shared';
import { Package, ShoppingCart, DollarSign, TrendingUp, TrendingDown, Star, Undo2, Wallet } from 'lucide-react';
import { useSellerStats, useTopProducts, useRecentSellerOrders } from '../api/queries';
import dynamic from 'next/dynamic';

const SalesChart = dynamic(() => import('./sales-chart'), { ssr: false });

export function SellerDashboard() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useSellerStats();
  const { data: topProducts } = useTopProducts();
  const { data: recentOrders } = useRecentSellerOrders();

  if (statsError) return <ErrorSection error={statsError} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome back! Here's your business overview.</p>
      </div>

      {/* Stats cards */}
      {statsLoading ? (
        <SectionSkeleton variant="card" rows={4} />
      ) : stats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Active Products" value={formatNumber(stats.activeProducts)} subtext={`${stats.totalProducts} total`} change={stats.productsChange} icon={Package} />
          <StatCard title="Orders" value={formatNumber(stats.totalOrders)} subtext={`${stats.pendingOrders} pending`} change={stats.ordersChange} icon={ShoppingCart} />
          <StatCard title="Revenue" value={formatPriceRupees(stats.totalRevenue)} subtext={`${formatPriceRupees(stats.pendingSettlement)} pending`} change={stats.revenueChange} icon={DollarSign} />
          <StatCard title="Rating" value={`${stats.averageRating.toFixed(1)} ★`} subtext={`${stats.returnRate.toFixed(1)}% return rate`} icon={Star} />
        </div>
      ) : null}

      {/* Sales chart */}
      <Card>
        <CardHeader><CardTitle>Sales (30 days)</CardTitle></CardHeader>
        <CardContent className="h-72">
          <SalesChart />
        </CardContent>
      </Card>

      {/* Bottom row: top products + recent orders */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top products */}
        <Card>
          <CardHeader><CardTitle>Top Products</CardTitle></CardHeader>
          <CardContent>
            {topProducts?.length ? (
              <div className="space-y-3">
                {topProducts.map((p, i) => (
                  <div key={p.productId} className="flex items-center gap-3 text-sm">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium">{p.productName}</p>
                      <p className="text-xs text-gray-500">{p.unitsSold} units sold</p>
                    </div>
                    <span className="font-medium">{formatPriceRupees(p.revenue)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No sales data yet</p>
            )}
          </CardContent>
        </Card>

        {/* Recent orders */}
        <Card>
          <CardHeader><CardTitle>Recent Orders</CardTitle></CardHeader>
          <CardContent>
            {recentOrders?.length ? (
              <div className="space-y-3">
                {recentOrders.map((o) => (
                  <div key={o.orderId} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">#{o.orderNumber}</p>
                      <p className="text-xs text-gray-500">{o.productName} × {o.quantity}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{formatPriceRupees(o.amount)}</span>
                      <StateBadge state={o.state} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No orders yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtext, change, icon: Icon }: {
  title: string; value: string; subtext?: string; change?: number; icon: React.ElementType;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
          {subtext && <p className="mt-0.5 text-xs text-gray-400">{subtext}</p>}
          {change !== undefined && (
            <p className={`mt-1 flex items-center gap-1 text-xs ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {change >= 0 ? '+' : ''}{change}%
            </p>
          )}
        </div>
        <div className="rounded-full bg-primary/10 p-3">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </CardContent>
    </Card>
  );
}
