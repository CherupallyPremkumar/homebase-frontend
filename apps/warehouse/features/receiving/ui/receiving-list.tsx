'use client';

import { useState } from 'react';
import {
  Truck, CheckCircle, Clock, Calendar, Download, QrCode,
  Package, Search, X, Check,
} from 'lucide-react';
import { StatCard, StatusBadge } from '@homebase/ui';

/* ------------------------------------------------------------------ */
/*  Mock data matching inbound prototype                               */
/* ------------------------------------------------------------------ */

const inboundStats = [
  { title: 'Total Inbound', value: '8', icon: <Truck className="h-5 w-5 text-blue-600" />, subtitle: 'Today' },
  { title: 'Arrived', value: '3', icon: <CheckCircle className="h-5 w-5 text-green-600" />, trend: 1, trendDirection: 'up' as const },
  { title: 'In Progress', value: '2', icon: <Clock className="h-5 w-5 text-amber-600" />, subtitle: 'Active' },
  { title: 'Scheduled', value: '3', icon: <Calendar className="h-5 w-5 text-purple-600" />, subtitle: 'Pending' },
];

type ShipmentStatus = 'Arrived' | 'Receiving' | 'Expected' | 'Delayed' | 'Completed';

interface InboundShipment {
  id: string;
  seller: string;
  sellerCode: string;
  sellerInitials: string;
  sellerColor: string;
  products: number;
  expectedDate: string;
  arrivedTime: string;
  status: ShipmentStatus;
  assignedTo: string;
}

const statusVariant: Record<ShipmentStatus, 'success' | 'warning' | 'info' | 'error' | 'purple'> = {
  Arrived: 'success',
  Receiving: 'warning',
  Expected: 'info',
  Delayed: 'error',
  Completed: 'success',
};

const shipments: InboundShipment[] = [
  { id: 'INB-20260328-001', seller: 'TechMart India', sellerCode: 'SLR-1042', sellerInitials: 'TM', sellerColor: 'bg-blue-100 text-blue-700', products: 12, expectedDate: '28 Mar 2026', arrivedTime: '09:15 AM', status: 'Arrived', assignedTo: 'Rajesh S.' },
  { id: 'INB-20260328-002', seller: 'GreenHome Essentials', sellerCode: 'SLR-1087', sellerInitials: 'GH', sellerColor: 'bg-emerald-100 text-emerald-700', products: 8, expectedDate: '28 Mar 2026', arrivedTime: '08:42 AM', status: 'Receiving', assignedTo: 'Priya K.' },
  { id: 'INB-20260328-003', seller: 'FashionHub India', sellerCode: 'SLR-1023', sellerInitials: 'FH', sellerColor: 'bg-pink-100 text-pink-700', products: 24, expectedDate: '28 Mar 2026', arrivedTime: '10:30 AM', status: 'Arrived', assignedTo: 'Unassigned' },
  { id: 'INB-20260328-004', seller: 'BookWorld Online', sellerCode: 'SLR-1156', sellerInitials: 'BW', sellerColor: 'bg-amber-100 text-amber-700', products: 50, expectedDate: '28 Mar 2026', arrivedTime: '--', status: 'Expected', assignedTo: '--' },
  { id: 'INB-20260328-005', seller: 'SportsZone Pro', sellerCode: 'SLR-1198', sellerInitials: 'SZ', sellerColor: 'bg-orange-100 text-orange-700', products: 15, expectedDate: '28 Mar 2026', arrivedTime: '--', status: 'Expected', assignedTo: '--' },
  { id: 'INB-20260328-006', seller: 'ElectroParts Hub', sellerCode: 'SLR-1205', sellerInitials: 'EP', sellerColor: 'bg-indigo-100 text-indigo-700', products: 30, expectedDate: '28 Mar 2026', arrivedTime: '07:20 AM', status: 'Receiving', assignedTo: 'Amit M.' },
  { id: 'INB-20260328-007', seller: 'BeautyGlow Store', sellerCode: 'SLR-1078', sellerInitials: 'BG', sellerColor: 'bg-rose-100 text-rose-700', products: 18, expectedDate: '27 Mar 2026', arrivedTime: '--', status: 'Delayed', assignedTo: '--' },
  { id: 'INB-20260328-008', seller: 'KitchenKraft India', sellerCode: 'SLR-1134', sellerInitials: 'KK', sellerColor: 'bg-teal-100 text-teal-700', products: 22, expectedDate: '28 Mar 2026', arrivedTime: '--', status: 'Expected', assignedTo: '--' },
];

const receivingChecklist = [
  { id: 1, label: 'Samsung Galaxy S24 Ultra (x4)', checked: true },
  { id: 2, label: 'OnePlus Buds Pro 2 (x6)', checked: true },
  { id: 3, label: 'Logitech MX Master 3S (x8)', checked: false },
  { id: 4, label: 'Apple AirPods Pro (x3)', checked: false },
  { id: 5, label: 'Sony WH-1000XM5 (x2)', checked: false },
];

const tabs = ['All', 'Expected Today', 'Arrived', 'In Progress', 'Completed'];

export function ReceivingList() {
  const [activeTab, setActiveTab] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [checklist, setChecklist] = useState(receivingChecklist);

  const toggleCheck = (id: number) => {
    setChecklist((prev) => prev.map((c) => c.id === id ? { ...c, checked: !c.checked } : c));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inbound Receiving</h1>
            <p className="mt-1 text-sm text-gray-500">Manage and process incoming seller shipments</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-600">
            <Calendar className="h-4 w-4" />
            Expected Today: 8 shipments
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600">
            <QrCode className="h-4 w-4" />
            Scan Barcode
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-6">
        {inboundStats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      {/* Filter Tabs + Table */}
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
                {['Shipment ID', 'Seller', 'Products', 'Expected Date', 'Arrived Time', 'Status', 'Assigned To', 'Actions'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {shipments.map((s) => (
                <tr key={s.id} className={`transition hover:bg-brand-50 ${s.status === 'Delayed' ? 'bg-red-50 hover:bg-red-100' : ''}`}>
                  <td className="px-6 py-4"><span className="text-sm font-semibold text-brand-600">{s.id}</span></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${s.sellerColor}`}>{s.sellerInitials}</div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{s.seller}</p>
                        <p className="text-xs text-gray-400">{s.sellerCode}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-sm text-gray-700">
                      <Package className="h-4 w-4 text-gray-400" />
                      {s.products} items
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{s.expectedDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{s.arrivedTime}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={s.status} variant={statusVariant[s.status]} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{s.assignedTo}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {(s.status === 'Arrived' || s.status === 'Receiving') && (
                        <button
                          onClick={() => setShowForm(true)}
                          className="inline-flex items-center gap-1 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-600"
                        >
                          Receive
                        </button>
                      )}
                      <button className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-200">View</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receiving Form Card */}
      {showForm && (
        <div className="animate-in slide-in-from-bottom-3 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Receiving: INB-20260328-001</h3>
              <p className="text-sm text-gray-500">TechMart India - 12 items expected</p>
            </div>
            <button onClick={() => setShowForm(false)} className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Product Checklist</p>
            <div className="space-y-2.5">
              {checklist.map((item) => (
                <label key={item.id} className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition hover:bg-white">
                  <button
                    onClick={() => toggleCheck(item.id)}
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${item.checked ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300 bg-white'}`}
                  >
                    {item.checked && <Check className="h-3 w-3" />}
                  </button>
                  <span className={`text-sm ${item.checked ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{checklist.filter(c => c.checked).length}/{checklist.length} items verified</p>
            <div className="flex gap-3">
              <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">Report Damage</button>
              <button className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700">Complete Receiving</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
