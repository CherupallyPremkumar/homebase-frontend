'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import { AccountSidebar, StatusBadge } from '@homebase/ui';

// ---------------------------------------------------------------------------
// Types & mock data
// ---------------------------------------------------------------------------

type OrderStatus = 'Delivered' | 'Shipped' | 'Processing' | 'Cancelled';

interface OrderItem {
  emoji: string;
  name: string;
  detail: string;
  price: string;
  cancelled?: boolean;
  cancelNote?: string;
}

interface MockOrder {
  id: string;
  orderNumber: string;
  date: string;
  total: string;
  status: OrderStatus;
  items: OrderItem[];
}

const MOCK_ORDERS: MockOrder[] = [
  {
    id: '1',
    orderNumber: '#HB-20260315-4821',
    date: 'March 15, 2026',
    total: '\u20B927,489',
    status: 'Delivered',
    items: [
      { emoji: '\uD83C\uDFA7', name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones', detail: 'Qty: 1 \u00B7 Color: Black', price: '\u20B922,490' },
      { emoji: '\u2328\uFE0F', name: 'Logitech MX Keys Mini Wireless Keyboard', detail: 'Qty: 1 \u00B7 Color: Graphite', price: '\u20B94,999' },
    ],
  },
  {
    id: '2',
    orderNumber: '#HB-20260322-5103',
    date: 'March 22, 2026',
    total: '\u20B91,44,900',
    status: 'Shipped',
    items: [
      { emoji: '\uD83D\uDCF1', name: 'iPhone 16 Pro Max 256GB Natural Titanium', detail: 'Qty: 1 \u00B7 Storage: 256GB', price: '\u20B91,44,900' },
    ],
  },
  {
    id: '3',
    orderNumber: '#HB-20260326-5287',
    date: 'March 26, 2026',
    total: '\u20B915,994',
    status: 'Processing',
    items: [
      { emoji: '\uD83D\uDC5F', name: 'Nike Air Max 270 React Running Shoes', detail: 'Qty: 1 \u00B7 Size: UK 10 \u00B7 Color: Black/White', price: '\u20B98,995' },
      { emoji: '\u231A', name: 'Fitness Tracker Band Pro', detail: 'Qty: 1 \u00B7 Color: Midnight Blue', price: '\u20B96,999' },
    ],
  },
  {
    id: '4',
    orderNumber: '#HB-20260310-4690',
    date: 'March 10, 2026',
    total: '\u20B989,900',
    status: 'Cancelled',
    items: [
      { emoji: '\u231A', name: 'Apple Watch Ultra 2 GPS + Cellular 49mm', detail: 'Qty: 1 \u00B7 Titanium Case', price: '\u20B989,900', cancelled: true, cancelNote: 'Cancelled by you on March 11, 2026 \u00B7 Refund processed' },
    ],
  },
  {
    id: '5',
    orderNumber: '#HB-20260228-4312',
    date: 'February 28, 2026',
    total: '\u20B93,498',
    status: 'Delivered',
    items: [
      { emoji: '\uD83C\uDFE0', name: 'Philips LED Smart Bulb 9W (Pack of 2)', detail: 'Qty: 2 \u00B7 Color: Warm White', price: '\u20B91,198' },
      { emoji: '\uD83D\uDDB1\uFE0F', name: 'Cosmic Byte Ares RGB Gaming Mouse', detail: 'Qty: 1 \u00B7 Color: Black', price: '\u20B9999' },
      { emoji: '\uD83D\uDD0C', name: 'USB-C Hub 7-in-1 Adapter', detail: 'Qty: 1 \u00B7 Color: Space Gray', price: '\u20B91,301' },
    ],
  },
];

const FILTER_TABS: { label: string; value: string }[] = [
  { label: 'All Orders', value: 'all' },
  { label: 'Processing', value: 'Processing' },
  { label: 'Shipped', value: 'Shipped' },
  { label: 'Delivered', value: 'Delivered' },
  { label: 'Cancelled', value: 'Cancelled' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function OrderList() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredOrders = MOCK_ORDERS.filter((order) => {
    if (filter !== 'all' && order.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(q) ||
        order.items.some((item) => item.name.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="hidden lg:block">
          <AccountSidebar
            userName="Premkumar"
            userEmail="premkumar@email.com"
            activePage="orders"
          />
        </div>

        {/* Main */}
        <main className="flex-1 min-w-0">
          {/* Header + Search */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl font-bold text-navy-900">My Orders</h1>
              <p className="text-sm text-gray-400 mt-0.5">View and manage all your orders</p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Order ID or product..."
                className="w-full border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm bg-white outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                  filter === tab.value
                    ? 'text-brand-600 bg-brand-50 font-semibold'
                    : 'text-gray-500 hover:text-brand-600 hover:bg-brand-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Order Cards */}
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 bg-gray-50/70 border-b border-gray-100 gap-2">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div>
                      <p className="text-xs text-gray-400 font-medium">Order ID</p>
                      <p className="text-sm font-semibold text-navy-900">{order.orderNumber}</p>
                    </div>
                    <div className="hidden sm:block w-px h-8 bg-gray-200" />
                    <div>
                      <p className="text-xs text-gray-400 font-medium">Order Date</p>
                      <p className="text-sm text-gray-700">{order.date}</p>
                    </div>
                    <div className="hidden sm:block w-px h-8 bg-gray-200" />
                    <div>
                      <p className="text-xs text-gray-400 font-medium">Total</p>
                      <p className="text-sm font-bold text-navy-900">{order.total}</p>
                    </div>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className={idx > 0 ? 'mt-3 pt-3 border-t border-gray-50' : ''}>
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center text-3xl shrink-0 ${item.cancelled ? 'opacity-50' : ''}`}>
                          {item.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${item.cancelled ? 'text-gray-400 line-through' : 'text-navy-900'}`}>
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{item.detail}</p>
                          <p className={`text-sm font-semibold mt-1 ${item.cancelled ? 'text-gray-400' : 'text-brand-600'}`}>
                            {item.price}
                          </p>
                          {item.cancelNote && (
                            <p className="text-xs text-red-500 mt-1">{item.cancelNote}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Actions */}
                <div className="flex items-center gap-3 px-6 py-3 bg-gray-50/50 border-t border-gray-100">
                  {order.status === 'Shipped' && (
                    <button className="text-xs font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-lg px-3.5 py-2 flex items-center gap-1.5 transition">
                      <Truck className="w-3.5 h-3.5" />
                      Track Order
                    </button>
                  )}
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-xs font-medium text-gray-500 border border-gray-200 rounded-lg px-3.5 py-2 hover:border-brand-400 hover:text-brand-600 transition bg-white"
                  >
                    View Details
                  </Link>
                  {(order.status === 'Delivered' || order.status === 'Cancelled') && (
                    <button className="text-xs font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-lg px-3.5 py-2 transition">
                      Buy Again
                    </button>
                  )}
                  {order.status === 'Delivered' && (
                    <button className="text-xs font-medium text-gray-500 border border-gray-200 rounded-lg px-3.5 py-2 hover:border-red-300 hover:text-red-500 transition bg-white">
                      Return
                    </button>
                  )}
                  {order.status === 'Processing' && (
                    <button className="text-xs font-medium text-red-500 border border-red-200 rounded-lg px-3.5 py-2 hover:bg-red-50 transition bg-white">
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))}

            {filteredOrders.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-400 text-sm">No orders found.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-8">
            <p className="text-sm text-gray-400">
              Showing <span className="font-medium text-gray-700">1-5</span> of <span className="font-medium text-gray-700">23</span> orders
            </p>
            <div className="flex items-center gap-1">
              <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 bg-white" disabled>
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold ${
                    n === 1
                      ? 'bg-brand-500 text-white'
                      : 'border border-gray-200 text-gray-600 hover:border-brand-400 hover:text-brand-600 bg-white'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 text-sm bg-white">
                ...
              </button>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-brand-400 hover:text-brand-600 text-sm bg-white">
                5
              </button>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-brand-400 hover:text-brand-600 bg-white">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
