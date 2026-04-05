'use client';

import { useState } from 'react';
import {
  Truck, PackageCheck, Clock, AlertTriangle, Search,
  Download, Plus, ExternalLink, Star, TrendingUp, Calendar,
} from 'lucide-react';
import { StatCard, StatusBadge } from '@homebase/ui';

/* ------------------------------------------------------------------ */
/*  Mock data matching the warehouse-shipments HTML prototype          */
/* ------------------------------------------------------------------ */

const shipmentStats = [
  { title: 'Total Shipments', value: '89', icon: <Truck className="h-5 w-5 text-blue-600" />, trend: 15, trendDirection: 'up' as const },
  { title: 'In Transit', value: '34', icon: <PackageCheck className="h-5 w-5 text-purple-600" />, subtitle: 'On the way' },
  { title: 'Delivered Today', value: '42', icon: <Clock className="h-5 w-5 text-green-600" />, trend: 8, trendDirection: 'up' as const },
  { title: 'Delayed', value: '3', icon: <AlertTriangle className="h-5 w-5 text-red-500" />, subtitle: 'Needs attention' },
];

type ShipmentStatus = 'In Transit' | 'Delivered' | 'Out for Delivery' | 'Delayed' | 'Dispatched' | 'Picked Up' | 'Pending Pickup' | 'Label Created';

interface Shipment {
  id: string;
  orderId: string;
  customer: string;
  carrier: string;
  carrierLogo: string;
  carrierColor: string;
  trackingNo: string;
  items: number;
  status: ShipmentStatus;
  dispatchedAt: string;
  eta: string;
  destination: string;
}

const shipStatusVariant: Record<ShipmentStatus, 'info' | 'success' | 'warning' | 'error' | 'purple' | 'neutral'> = {
  'In Transit': 'info',
  'Delivered': 'success',
  'Out for Delivery': 'purple',
  'Delayed': 'error',
  'Dispatched': 'info',
  'Picked Up': 'info',
  'Pending Pickup': 'warning',
  'Label Created': 'neutral',
};

const shipments: Shipment[] = [
  { id: 'SHP-20260328-001', orderId: '#HB-78045', customer: 'Priya Patel', carrier: 'BlueDart', carrierLogo: 'BD', carrierColor: 'bg-blue-100 text-blue-700', trackingNo: 'BD28376451IN', items: 1, status: 'In Transit', dispatchedAt: '09:10 AM', eta: '30 Mar', destination: 'Mumbai, MH' },
  { id: 'SHP-20260328-002', orderId: '#HB-77998', customer: 'Ravi Shankar', carrier: 'Delhivery', carrierLogo: 'DL', carrierColor: 'bg-red-100 text-red-700', trackingNo: 'DL99281734IN', items: 3, status: 'Delivered', dispatchedAt: '07:30 AM', eta: '28 Mar', destination: 'Pune, MH' },
  { id: 'SHP-20260328-003', orderId: '#HB-78012', customer: 'Lakshmi Rao', carrier: 'DTDC', carrierLogo: 'DT', carrierColor: 'bg-amber-100 text-amber-700', trackingNo: 'DT44829103IN', items: 2, status: 'Out for Delivery', dispatchedAt: '08:15 AM', eta: '28 Mar', destination: 'Bangalore, KA' },
  { id: 'SHP-20260328-004', orderId: '#HB-77956', customer: 'Arun Nair', carrier: 'Ecom Express', carrierLogo: 'EE', carrierColor: 'bg-green-100 text-green-700', trackingNo: 'EE55012847IN', items: 1, status: 'Delayed', dispatchedAt: '26 Mar', eta: 'Overdue', destination: 'Chennai, TN' },
  { id: 'SHP-20260328-005', orderId: '#HB-78067', customer: 'Sneha Jain', carrier: 'BlueDart', carrierLogo: 'BD', carrierColor: 'bg-blue-100 text-blue-700', trackingNo: 'BD28376489IN', items: 2, status: 'Dispatched', dispatchedAt: '10:00 AM', eta: '31 Mar', destination: 'Delhi, DL' },
  { id: 'SHP-20260328-006', orderId: '#HB-78078', customer: 'Karthik Reddy', carrier: 'Delhivery', carrierLogo: 'DL', carrierColor: 'bg-red-100 text-red-700', trackingNo: 'DL99281790IN', items: 4, status: 'Picked Up', dispatchedAt: '11:20 AM', eta: '01 Apr', destination: 'Hyderabad, TS' },
  { id: 'SHP-20260328-007', orderId: '#HB-78082', customer: 'Anjali Das', carrier: 'DTDC', carrierLogo: 'DT', carrierColor: 'bg-amber-100 text-amber-700', trackingNo: 'DT44829167IN', items: 1, status: 'Pending Pickup', dispatchedAt: '--', eta: '01 Apr', destination: 'Kolkata, WB' },
  { id: 'SHP-20260328-008', orderId: '#HB-78090', customer: 'Manish Kumar', carrier: 'Ecom Express', carrierLogo: 'EE', carrierColor: 'bg-green-100 text-green-700', trackingNo: 'EE55012901IN', items: 2, status: 'Label Created', dispatchedAt: '--', eta: '02 Apr', destination: 'Jaipur, RJ' },
];

const carriers = [
  { name: 'BlueDart', deliveries: 312, onTime: 96, avgDays: 2.1, rating: 4.5, color: 'bg-blue-500' },
  { name: 'Delhivery', deliveries: 287, onTime: 92, avgDays: 2.8, rating: 4.2, color: 'bg-red-500' },
  { name: 'DTDC', deliveries: 198, onTime: 88, avgDays: 3.2, rating: 3.9, color: 'bg-amber-500' },
  { name: 'Ecom Express', deliveries: 156, onTime: 94, avgDays: 2.5, rating: 4.3, color: 'bg-green-500' },
];

const pickupSchedule = [
  { carrier: 'BlueDart', time: '2:00 PM', packages: 12, status: 'Confirmed' },
  { carrier: 'Delhivery', time: '3:30 PM', packages: 8, status: 'Confirmed' },
  { carrier: 'DTDC', time: '4:00 PM', packages: 5, status: 'Pending' },
  { carrier: 'Ecom Express', time: '5:00 PM', packages: 3, status: 'Scheduled' },
];

const tabs = ['All Shipments', 'In Transit', 'Delivered', 'Delayed', 'Pending'];

export function ShipmentsList() {
  const [activeTab, setActiveTab] = useState('All Shipments');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shipments</h1>
          <p className="mt-1 text-sm text-gray-500">Track outbound shipments, carrier performance, and delivery schedules</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600">
            <Plus className="h-4 w-4" />
            Create Shipment
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-6">
        {shipmentStats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      {/* Filter Tabs + Shipments Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-gray-100 px-6 pt-4">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-3 text-sm font-medium transition ${activeTab === t ? 'border-b-2 border-brand-500 font-semibold text-brand-500' : 'text-gray-500 hover:text-brand-500'}`}
            >
              {t}
            </button>
          ))}
          <div className="flex-1" />
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search shipments..." className="w-52 rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-9 pr-4 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Shipment ID', 'Order', 'Customer', 'Carrier', 'Tracking No.', 'Items', 'Status', 'Dispatched', 'ETA', 'Destination', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {shipments.map((s) => (
                <tr key={s.id} className={`transition hover:bg-brand-50 ${s.status === 'Delayed' ? 'bg-red-50 hover:bg-red-100' : ''}`}>
                  <td className="px-5 py-4"><span className="text-sm font-semibold text-brand-600">{s.id}</span></td>
                  <td className="px-5 py-4 text-sm text-gray-700">{s.orderId}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">{s.customer}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${s.carrierColor}`}>{s.carrierLogo}</div>
                      <span className="text-sm text-gray-700">{s.carrier}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs text-gray-600">{s.trackingNo}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700">{s.items}</td>
                  <td className="px-5 py-4"><StatusBadge status={s.status} variant={shipStatusVariant[s.status]} /></td>
                  <td className="px-5 py-4 text-sm text-gray-600">{s.dispatchedAt}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{s.eta}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{s.destination}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-200">Track</button>
                      <button className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Row: Carrier Performance + Pickup Schedule */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Carrier Performance Cards */}
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Carrier Performance</h2>
            <span className="text-xs text-gray-400">Last 30 days</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {carriers.map((c) => (
              <div key={c.name} className="rounded-xl border border-gray-100 p-4 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${c.color}`} />
                    <span className="text-sm font-semibold text-gray-900">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-medium text-gray-600">{c.rating}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Deliveries</span>
                    <span className="font-semibold text-gray-700">{c.deliveries}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">On-Time %</span>
                    <span className={`font-semibold ${c.onTime >= 95 ? 'text-green-600' : c.onTime >= 90 ? 'text-amber-600' : 'text-red-600'}`}>{c.onTime}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.onTime}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Avg Days</span>
                    <span className="font-semibold text-gray-700">{c.avgDays}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pickup Schedule */}
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Today&apos;s Pickup Schedule</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Calendar className="h-3.5 w-3.5" />
              28 Mar 2026
            </div>
          </div>
          <div className="space-y-3">
            {pickupSchedule.map((p) => (
              <div key={p.carrier} className="flex items-center gap-4 rounded-xl border border-gray-100 p-4 transition hover:shadow-sm">
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-gray-50">
                  <span className="text-sm font-bold text-gray-800">{p.time.split(' ')[0]}</span>
                  <span className="text-[10px] text-gray-400">{p.time.split(' ')[1]}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900">{p.carrier}</p>
                  <p className="text-xs text-gray-500">{p.packages} packages ready for pickup</p>
                </div>
                <StatusBadge
                  status={p.status}
                  variant={p.status === 'Confirmed' ? 'success' : p.status === 'Pending' ? 'warning' : 'info'}
                />
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-brand-50 p-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-brand-600" />
              <p className="text-xs font-medium text-brand-700">Total: 28 packages scheduled for pickup today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
