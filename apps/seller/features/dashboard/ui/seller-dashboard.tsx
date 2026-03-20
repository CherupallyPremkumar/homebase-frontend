'use client';

import { EntityDashboard, StateBadge, formatPrice } from '@homebase/ui';
import { Package, ShoppingCart, DollarSign, Star } from 'lucide-react';
import { useTopProducts, useRecentSellerOrders } from '../api/queries';
import { getApiClient } from '@homebase/api-client';
import dynamic from 'next/dynamic';

const SalesChart = dynamic(() => import('./sales-chart'), { ssr: false });

// Seller dashboard stat fetcher
async function fetchSellerStats() {
  return getApiClient().get<{
    activeProducts: number;
    totalOrders: number;
    totalRevenue: number;
    averageRating: number;
    productsChange: number;
    ordersChange: number;
    revenueChange: number;
  }>('/api/v1/seller/dashboard/stats');
}

export function SellerDashboard() {
  const { data: topProducts } = useTopProducts();
  const { data: recentOrders } = useRecentSellerOrders();

  return (
    <EntityDashboard
      title="Dashboard"
      subtitle="Welcome back! Here's your business overview."
      stats={[
        {
          label: 'Active Products',
          queryKey: 'seller-stat-products',
          queryFn: async () => {
            const s = await fetchSellerStats();
            return { value: s.activeProducts, change: s.productsChange };
          },
          icon: <Package className="h-5 w-5" />,
        },
        {
          label: 'Orders',
          queryKey: 'seller-stat-orders',
          queryFn: async () => {
            const s = await fetchSellerStats();
            return { value: s.totalOrders, change: s.ordersChange };
          },
          icon: <ShoppingCart className="h-5 w-5" />,
        },
        {
          label: 'Revenue',
          queryKey: 'seller-stat-revenue',
          queryFn: async () => {
            const s = await fetchSellerStats();
            return { value: s.totalRevenue, change: s.revenueChange };
          },
          icon: <DollarSign className="h-5 w-5" />,
          format: 'price',
        },
        {
          label: 'Rating',
          queryKey: 'seller-stat-rating',
          queryFn: async () => {
            const s = await fetchSellerStats();
            return { value: s.averageRating };
          },
          icon: <Star className="h-5 w-5" />,
          format: 'rating',
        },
      ]}
      charts={[
        {
          title: 'Sales (30 days)',
          content: <SalesChart />,
          span: 2,
        },
      ]}
      sections={[
        {
          title: 'Top Products',
          content: topProducts?.length ? (
            <div className="space-y-3">
              {topProducts.slice(0, 5).map((p, i) => (
                <div key={p.productId} className="flex items-center gap-3 text-sm">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500">{i + 1}</span>
                  <div className="flex-1">
                    <p className="font-medium">{p.productName}</p>
                    <p className="text-xs text-gray-400">{p.unitsSold} sold</p>
                  </div>
                  <span className="font-medium">{formatPrice(p.revenue)}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-gray-400">No sales data</p>,
        },
        {
          title: 'Recent Orders',
          content: recentOrders?.length ? (
            <div className="space-y-3">
              {recentOrders.slice(0, 5).map((o) => (
                <div key={o.orderId} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">#{o.orderNumber}</p>
                    <p className="text-xs text-gray-400">{o.productName} x {o.quantity}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{formatPrice(o.amount)}</span>
                    <StateBadge state={o.state} />
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-gray-400">No orders yet</p>,
        },
      ]}
    />
  );
}
