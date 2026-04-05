'use client';

import { useState } from 'react';
import {
  StatCard,
  StatusBadge,
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
} from '@homebase/ui';
import {
  ShoppingCart,
  Clock,
  RefreshCw,
  Truck,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  Calendar,
  Eye,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  FileText,
  RefreshCcw,
  MessageSquare,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types & Mock Data                                                  */
/* ------------------------------------------------------------------ */

type OrderTab = 'All' | 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

const tabs: { label: OrderTab; count: number; countBg: string; countText: string }[] = [
  { label: 'All', count: 1234, countBg: 'bg-brand-100', countText: 'text-brand-600' },
  { label: 'Pending', count: 23, countBg: 'bg-yellow-100', countText: 'text-yellow-700' },
  { label: 'Processing', count: 45, countBg: 'bg-orange-100', countText: 'text-orange-700' },
  { label: 'Shipped', count: 156, countBg: 'bg-blue-100', countText: 'text-blue-700' },
  { label: 'Delivered', count: 980, countBg: 'bg-green-100', countText: 'text-green-700' },
  { label: 'Cancelled', count: 30, countBg: 'bg-red-100', countText: 'text-red-700' },
];

const orders = [
  { id: '#HB-78234', customer: 'Ankit Kumar', initials: 'AK', color: 'bg-blue-100 text-blue-600', products: 'Wireless Bluetooth Speaker', items: 1, amount: 3499, payment: 'Paid', status: 'Delivered' as const, date: '27 Mar 2026' },
  { id: '#HB-78233', customer: 'Priya Sharma', initials: 'PS', color: 'bg-purple-100 text-purple-600', products: 'Cotton Kurta Set, Dupatta', items: 2, amount: 2598, payment: 'Paid', status: 'Shipped' as const, date: '27 Mar 2026' },
  { id: '#HB-78232', customer: 'Raj Patel', initials: 'RP', color: 'bg-green-100 text-green-600', products: 'Organic Face Cream, Lip Balm', items: 2, amount: 948, payment: 'COD', status: 'Processing' as const, date: '26 Mar 2026' },
  { id: '#HB-78231', customer: 'Sneha Gupta', initials: 'SG', color: 'bg-pink-100 text-pink-600', products: 'Stainless Steel Bottle', items: 1, amount: 799, payment: 'Paid', status: 'Pending' as const, date: '26 Mar 2026' },
  { id: '#HB-78230', customer: 'Vikram Singh', initials: 'VS', color: 'bg-orange-100 text-orange-600', products: 'Running Shoes Pro', items: 1, amount: 4299, payment: 'Paid', status: 'Delivered' as const, date: '25 Mar 2026' },
  { id: '#HB-78229', customer: 'Meera Nair', initials: 'MN', color: 'bg-teal-100 text-teal-600', products: 'Yoga Mat Premium', items: 1, amount: 1299, payment: 'Paid', status: 'Cancelled' as const, date: '25 Mar 2026' },
  { id: '#HB-78228', customer: 'Arjun Reddy', initials: 'AR', color: 'bg-indigo-100 text-indigo-600', products: 'LED Desk Lamp, USB Cable', items: 2, amount: 2298, payment: 'Paid', status: 'Shipped' as const, date: '24 Mar 2026' },
  { id: '#HB-78227', customer: 'Kavitha Iyer', initials: 'KI', color: 'bg-rose-100 text-rose-600', products: 'Bamboo Cutting Board Set', items: 1, amount: 899, payment: 'COD', status: 'Processing' as const, date: '24 Mar 2026' },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function SellerOrderList() {
  const [activeTab, setActiveTab] = useState<OrderTab>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewOrder, setViewOrder] = useState<typeof orders[number] | null>(null);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="mt-0.5 text-sm text-gray-400">Manage and track all your customer orders</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard
          title="Total Orders"
          value="1,234"
          icon={<ShoppingCart className="h-5 w-5 text-blue-500" />}
        />
        <StatCard
          title="Pending"
          value="23"
          icon={<Clock className="h-5 w-5 text-yellow-500" />}
        />
        <StatCard
          title="Processing"
          value="45"
          icon={<RefreshCw className="h-5 w-5 text-orange-500" />}
        />
        <StatCard
          title="Shipped"
          value="156"
          icon={<Truck className="h-5 w-5 text-blue-500" />}
        />
        <StatCard
          title="Delivered"
          value="980"
          icon={<CheckCircle className="h-5 w-5 text-green-500" />}
        />
        <StatCard
          title="Cancelled"
          value="30"
          icon={<XCircle className="h-5 w-5 text-red-500" />}
        />
      </div>

      {/* Orders Table Card */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* Filter Tabs */}
        <div className="border-b border-gray-100 px-5 pt-4">
          <div className="-mb-px flex items-center gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`whitespace-nowrap rounded-t-lg border-b-2 px-4 py-2.5 text-sm font-medium transition ${
                  activeTab === tab.label
                    ? 'border-brand-500 bg-brand-50 text-brand-500'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                {tab.label}
                <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                  activeTab === tab.label ? tab.countBg + ' ' + tab.countText : 'bg-gray-100 text-gray-500'
                }`}>
                  {tab.count.toLocaleString()}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search + Filters Row */}
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 p-5">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID, customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100">
            <Calendar className="h-4 w-4" />
            Date Range
          </button>
          <select className="min-w-[130px] cursor-pointer appearance-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100">
            <option>All Payment</option>
            <option>Paid</option>
            <option>COD</option>
            <option>Pending</option>
          </select>
          <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100">
            <Filter className="h-4 w-4" />
            More Filters
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="px-5 py-3 text-left">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500" />
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Order ID</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Customer</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Products</th>
                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500">Amount</th>
                <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-500">Payment</th>
                <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500">Date</th>
                <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-brand-50/50">
                  <td className="px-5 py-3.5">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500" />
                  </td>
                  <td className="px-5 py-3.5">
                    <a href={`/orders/${order.id.replace('#', '')}`} className="font-mono text-sm font-medium text-brand-600 hover:text-brand-700 hover:underline cursor-pointer">{order.id}</a>
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
                    <div>
                      <span className="text-sm text-gray-600">{order.products}</span>
                      {order.items > 1 && (
                        <span className="ml-1 text-xs text-gray-400">({order.items} items)</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="text-sm font-semibold text-gray-900">{'\u20B9'}{order.amount.toLocaleString('en-IN')}</span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      order.payment === 'Paid'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-yellow-50 text-yellow-700'
                    }`}>
                      {order.payment}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="text-sm text-gray-500">{order.date}</span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setViewOrder(order)} className="rounded-lg p-1.5 text-gray-400 transition hover:bg-brand-50 hover:text-brand-500" title="View Details">
                        <Eye className="h-4 w-4" />
                      </button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600" title="More Actions">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => setViewOrder(order)}>
                            <Eye className="mr-2 h-4 w-4 text-gray-400" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => alert(`Print Invoice for ${order.id}`)}>
                            <FileText className="mr-2 h-4 w-4 text-gray-400" /> Print Invoice
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => alert(`Update Status for ${order.id}`)}>
                            <RefreshCcw className="mr-2 h-4 w-4 text-gray-400" /> Update Status
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => alert(`Contact Customer: ${order.customer}`)}>
                            <MessageSquare className="mr-2 h-4 w-4 text-gray-400" /> Contact Customer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3.5">
          <p className="text-sm text-gray-500">Showing 1-8 of 1,234 orders</p>
          <div className="flex items-center gap-1">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition hover:bg-gray-50">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-sm font-medium text-white">1</button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-sm font-medium text-gray-600 transition hover:bg-gray-50">2</button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-sm font-medium text-gray-600 transition hover:bg-gray-50">3</button>
            <span className="px-1 text-gray-400">...</span>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-sm font-medium text-gray-600 transition hover:bg-gray-50">155</button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition hover:bg-gray-50">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* View Order Details Dialog */}
      <Dialog open={!!viewOrder} onOpenChange={(open) => { if (!open) setViewOrder(null); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>Full details for order {viewOrder?.id}</DialogDescription>
          </DialogHeader>
          {viewOrder && (
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Order ID</p>
                <p className="inline-block rounded bg-gray-100 px-2 py-0.5 font-mono text-sm font-semibold text-brand-600">{viewOrder.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Status</p>
                <StatusBadge status={viewOrder.status} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Customer</p>
                <p className="text-sm font-medium text-gray-900">{viewOrder.customer}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Date</p>
                <p className="text-sm text-gray-700">{viewOrder.date}</p>
              </div>
              <div className="col-span-2 space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Products</p>
                <p className="text-sm text-gray-700">{viewOrder.products}{viewOrder.items > 1 ? ` (${viewOrder.items} items)` : ''}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Amount</p>
                <p className="text-sm font-bold text-gray-900">{'\u20B9'}{viewOrder.amount.toLocaleString('en-IN')}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Payment</p>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  viewOrder.payment === 'Paid' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                }`}>{viewOrder.payment}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
