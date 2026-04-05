'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  StatCard,
  StatusBadge,
  BarChart,
  type BarChartDataPoint,
} from '@homebase/ui';
import {
  IndianRupee,
  ShoppingCart,
  Package,
  Star,
  Truck,
  AlertTriangle,
  MessageSquare,
  ChevronRight,
  Search,
  Filter,
  ArrowUpRight,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const revenueData: BarChartDataPoint[] = [
  { label: 'Jan', value: 200000 },
  { label: 'Feb', value: 275000 },
  { label: 'Mar', value: 325000 },
  { label: 'Apr', value: 250000 },
  { label: 'May', value: 360000 },
  { label: 'Jun', value: 300000 },
  { label: 'Jul', value: 390000 },
  { label: 'Aug', value: 340000 },
  { label: 'Sep', value: 425000 },
  { label: 'Oct', value: 450000 },
  { label: 'Nov', value: 400000 },
  { label: 'Dec', value: 475000 },
];

const recentOrders = [
  { id: '#HB-78234', customer: 'Ankit Kumar', initials: 'AK', color: 'bg-blue-100 text-blue-600', product: 'Wireless Bluetooth Speaker', amount: 3499, status: 'Delivered', date: '27 Mar 2026' },
  { id: '#HB-78233', customer: 'Priya Sharma', initials: 'PS', color: 'bg-purple-100 text-purple-600', product: 'Cotton Kurta Set', amount: 1899, status: 'Shipped', date: '27 Mar 2026' },
  { id: '#HB-78232', customer: 'Raj Patel', initials: 'RP', color: 'bg-green-100 text-green-600', product: 'Organic Face Cream', amount: 649, status: 'Processing', date: '26 Mar 2026' },
  { id: '#HB-78231', customer: 'Sneha Gupta', initials: 'SG', color: 'bg-pink-100 text-pink-600', product: 'Stainless Steel Bottle', amount: 799, status: 'Pending', date: '26 Mar 2026' },
  { id: '#HB-78230', customer: 'Vikram Singh', initials: 'VS', color: 'bg-orange-100 text-orange-600', product: 'Running Shoes Pro', amount: 4299, status: 'Delivered', date: '25 Mar 2026' },
  { id: '#HB-78229', customer: 'Meera Nair', initials: 'MN', color: 'bg-teal-100 text-teal-600', product: 'Yoga Mat Premium', amount: 1299, status: 'Cancelled', date: '25 Mar 2026' },
];

const topProducts = [
  { name: 'Wireless Bluetooth Speaker', image: '/placeholder.jpg', sales: 342, revenue: 1196658 },
  { name: 'Cotton Kurta Set', image: '/placeholder.jpg', sales: 289, revenue: 548811 },
  { name: 'Running Shoes Pro', image: '/placeholder.jpg', sales: 198, revenue: 851202 },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function SellerDashboard() {
  const [chartPeriod, setChartPeriod] = useState<'Weekly' | 'Monthly' | 'Yearly'>('Monthly');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 p-6">
        <div className="absolute -top-1/2 right-0 h-72 w-72 translate-x-1/4 rounded-full bg-white/5" />
        <div className="absolute bottom-0 right-32 h-48 w-48 translate-y-1/3 rounded-full bg-white/5" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-sm text-orange-200">Friday, 28 March 2026</p>
            <h1 className="mt-1 text-2xl font-bold text-white">Good Morning, Rajesh!</h1>
            <p className="mt-1.5 text-sm text-orange-100">Here&apos;s what&apos;s happening with your store today.</p>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <button className="rounded-lg border border-white/20 bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/25">
              Download Report
            </button>
            <button className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-brand-600 transition hover:bg-orange-50">
              View Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={'\u20B94,52,890'}
          icon={<IndianRupee className="h-5 w-5 text-brand-500" />}
          trend={12.5}
          trendDirection="up"
          progressBar={75}
          progressColor="bg-brand-500"
        />
        <StatCard
          title="Total Orders"
          value="1,234"
          icon={<ShoppingCart className="h-5 w-5 text-blue-500" />}
          trend={8.2}
          trendDirection="up"
          progressBar={62}
          progressColor="bg-blue-500"
        />
        <StatCard
          title="Products Listed"
          value="89"
          icon={<Package className="h-5 w-5 text-purple-500" />}
          subtitle="Products Listed"
          progressBar={45}
          progressColor="bg-purple-500"
        />
        <StatCard
          title="Customer Rating"
          value="4.6/5"
          icon={<Star className="h-5 w-5 text-yellow-500" />}
          subtitle="Customer Rating"
          progressBar={92}
          progressColor="bg-yellow-400"
        />
      </div>

      {/* Revenue Chart + Pending Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Revenue Overview</h3>
              <p className="mt-0.5 text-xs text-gray-400">Monthly revenue for the current year</p>
            </div>
            <div className="flex items-center gap-2">
              {(['Weekly', 'Monthly', 'Yearly'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setChartPeriod(period)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    chartPeriod === period
                      ? 'bg-brand-500 text-white'
                      : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <div className="p-5">
            <BarChart data={revenueData} height={260} />
          </div>
        </div>

        {/* Pending Actions */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5">
            <h3 className="text-base font-semibold text-gray-900">Pending Actions</h3>
            <p className="mt-0.5 text-xs text-gray-400">Items requiring your attention</p>
          </div>
          <div className="space-y-3 p-4">
            {/* Orders to Ship */}
            <div className="flex cursor-pointer items-center gap-3 rounded-xl border border-orange-100 bg-orange-50 p-3.5 transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500">
                <Truck className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900">3 Orders to Ship</p>
                <p className="mt-0.5 text-xs text-gray-500">Dispatch before end of day</p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
            </div>

            {/* Low Stock */}
            <div className="flex cursor-pointer items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-3.5 transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-600">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900">5 Products Low Stock</p>
                <p className="mt-0.5 text-xs text-gray-500">Restock to avoid order cancellations</p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
            </div>

            {/* Customer Queries */}
            <div className="flex cursor-pointer items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-3.5 transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900">2 Customer Queries</p>
                <p className="mt-0.5 text-xs text-gray-500">Respond within 24 hours</p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
            </div>

            {/* Quick Summary */}
            <div className="mt-4 border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Response Rate</span>
                <span className="font-semibold text-green-600">98.2%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full rounded-full bg-green-600" style={{ width: '98.2%' }} />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-gray-400">Dispatch SLA</span>
                <span className="font-semibold text-brand-500">96.5%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full rounded-full bg-brand-500" style={{ width: '96.5%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Recent Orders</h3>
            <p className="mt-0.5 text-xs text-gray-400">Latest orders from your store</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                className="w-40 rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-8 pr-3 text-xs outline-none transition focus:border-brand-400 focus:ring-1 focus:ring-brand-100"
              />
            </div>
            <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-500 transition hover:bg-gray-100">
              <Filter className="h-3.5 w-3.5" />
              Filter
            </button>
            <Link href="/orders" className="text-xs font-medium text-brand-500 hover:text-brand-600">
              View All
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Order ID</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Customer</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Product</th>
                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500">Amount</th>
                <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-brand-50/50">
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-sm font-medium text-brand-600">{order.id}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${order.color}`}>
                        {order.initials}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{order.customer}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-gray-600">{order.product}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="text-sm font-semibold text-gray-900">{'\u20B9'}{order.amount.toLocaleString('en-IN')}</span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="text-sm text-gray-500">{order.date}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Products */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Top Selling Products</h3>
          <Link href="/products" className="flex items-center gap-1 text-xs font-medium text-brand-500 hover:text-brand-600">
            View All <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {topProducts.map((product, i) => (
            <div
              key={product.name}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50">
                  <Package className="h-6 w-6 text-brand-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">{product.name}</p>
                  <p className="mt-0.5 text-xs text-gray-400">{product.sales} units sold</p>
                </div>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-600">
                  #{i + 1}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <div>
                  <p className="text-xs text-gray-400">Revenue</p>
                  <p className="text-sm font-bold text-gray-900">{'\u20B9'}{(product.revenue / 100000).toFixed(1)}L</p>
                </div>
                <div className="h-10 w-20 rounded-lg bg-gradient-to-t from-brand-100 to-brand-50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
