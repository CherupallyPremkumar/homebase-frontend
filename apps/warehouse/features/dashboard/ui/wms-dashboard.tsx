'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Package, ArrowDownToLine, ClipboardList, Box, Truck, Building2,
  Sun, Download, Plus, AlertTriangle, CheckCircle, RefreshCw,
} from 'lucide-react';
import { StatCard, StatusBadge } from '@homebase/ui';

/* ------------------------------------------------------------------ */
/*  Mock data matching the HTML prototype                              */
/* ------------------------------------------------------------------ */

const stats = [
  { title: 'Total Items', value: '24,560', icon: <Package className="h-5 w-5 text-blue-600" />, trend: 2.4, trendDirection: 'up' as const },
  { title: 'Pending Inbound', value: '8', icon: <ArrowDownToLine className="h-5 w-5 text-amber-600" />, subtitle: 'Pending' },
  { title: 'Orders to Pick', value: '45', icon: <ClipboardList className="h-5 w-5 text-brand-600" />, subtitle: 'Active' },
  { title: 'Orders Packing', value: '12', icon: <Box className="h-5 w-5 text-purple-600" />, subtitle: 'In Progress' },
  { title: 'Shipped Today', value: '89', icon: <Truck className="h-5 w-5 text-green-600" />, trend: 15, trendDirection: 'up' as const },
  { title: 'Capacity Used', value: '72%', icon: <Building2 className="h-5 w-5 text-teal-600" />, progressBar: 72, progressColor: 'bg-teal-500' },
];

const activityTimeline = [
  { id: 1, color: 'bg-green-100', iconColor: 'text-green-600', icon: ArrowDownToLine, title: 'Received shipment from TechWorld Pvt Ltd', desc: '450 items, 12 SKUs verified and shelved to Zone A', time: '06:15 AM' },
  { id: 2, color: 'bg-blue-100', iconColor: 'text-blue-600', icon: ClipboardList, title: 'Batch #B2026-0328 picked for 18 orders', desc: 'Assigned to Picker Team Alpha, Zone A & B', time: '07:30 AM' },
  { id: 3, color: 'bg-purple-100', iconColor: 'text-purple-600', icon: Box, title: '15 orders packed and labelled', desc: 'Packing Station 3, ready for dispatch', time: '08:45 AM' },
  { id: 4, color: 'bg-orange-100', iconColor: 'text-orange-600', icon: Truck, title: 'Dispatched 22 parcels via BlueDart', desc: 'AWB numbers generated, courier pickup completed', time: '09:10 AM' },
  { id: 5, color: 'bg-red-100', iconColor: 'text-red-600', icon: AlertTriangle, title: 'Damage report: 3 items from Inbound #IN-4521', desc: 'SKUs quarantined, seller notified for replacement', time: '09:45 AM' },
  { id: 6, color: 'bg-green-100', iconColor: 'text-green-600', icon: CheckCircle, title: 'Cycle count completed for Zone C', desc: 'Variance: 0.2%, within acceptable threshold', time: '10:30 AM' },
  { id: 7, color: 'bg-amber-100', iconColor: 'text-amber-600', icon: RefreshCw, title: 'Return processed: Order #HB-89234', desc: 'Item inspected, restocked to Zone B shelf B-14', time: '11:15 AM' },
  { id: 8, color: 'bg-green-100', iconColor: 'text-green-600', icon: ArrowDownToLine, title: 'Received shipment from FashionHub India', desc: '280 items, 8 SKUs, routed to Zone B intake', time: '12:00 PM' },
];

const urgentOrders = [
  { id: '#HB-78234', items: '3 items', priority: 'Critical', priorityColor: 'bg-red-100 text-red-700', dueTime: '1:00 PM', status: 'Picking', statusColor: 'text-amber-600', dotColor: 'bg-amber-500', action: 'Expedite' },
  { id: '#HB-78190', items: '1 item', priority: 'Critical', priorityColor: 'bg-red-100 text-red-700', dueTime: '1:30 PM', status: 'Packing', statusColor: 'text-purple-600', dotColor: 'bg-purple-500', action: 'Expedite' },
  { id: '#HB-78156', items: '5 items', priority: 'High', priorityColor: 'bg-amber-100 text-amber-700', dueTime: '2:00 PM', status: 'Picking', statusColor: 'text-amber-600', dotColor: 'bg-amber-500', action: 'Expedite' },
  { id: '#HB-78101', items: '2 items', priority: 'High', priorityColor: 'bg-amber-100 text-amber-700', dueTime: '3:00 PM', status: 'Queued', statusColor: 'text-blue-600', dotColor: 'bg-blue-500', action: 'Assign' },
  { id: '#HB-78088', items: '4 items', priority: 'Normal', priorityColor: 'bg-blue-100 text-blue-700', dueTime: '5:00 PM', status: 'Queued', statusColor: 'text-blue-600', dotColor: 'bg-blue-500', action: 'Assign' },
];

const zones = [
  { name: 'Zone A', type: 'Electronics & High Value', capacity: 85, bins: '240/280', bg: 'bg-blue-100', text: 'text-blue-700', bar: 'bg-blue-500' },
  { name: 'Zone B', type: 'Fashion & Apparel', capacity: 62, bins: '156/250', bg: 'bg-green-100', text: 'text-green-700', bar: 'bg-green-500' },
  { name: 'Zone C', type: 'Home & Kitchen', capacity: 78, bins: '195/250', bg: 'bg-purple-100', text: 'text-purple-700', bar: 'bg-purple-500' },
  { name: 'Zone D', type: 'Bulk & Oversize', capacity: 45, bins: '54/120', bg: 'bg-amber-100', text: 'text-amber-700', bar: 'bg-amber-500' },
];

const staff = [
  { initials: 'RK', name: 'Rajesh Kumar', role: 'Team Lead', task: 'Receiving Dock A', status: 'Active', color: 'bg-teal-600' },
  { initials: 'PS', name: 'Priya Singh', role: 'Picker', task: 'Zone A batch pick', status: 'Active', color: 'bg-blue-600' },
  { initials: 'AM', name: 'Amit Mehta', role: 'Picker', task: 'Zone B single pick', status: 'Active', color: 'bg-green-600' },
  { initials: 'SP', name: 'Sunita Patil', role: 'Packer', task: 'Pack Station 2', status: 'Active', color: 'bg-purple-600' },
  { initials: 'VR', name: 'Vikram Reddy', role: 'Packer', task: 'Pack Station 3', status: 'Active', color: 'bg-brand-500' },
  { initials: 'NK', name: 'Neha Kapoor', role: 'QC Inspector', task: 'Returns processing', status: 'Active', color: 'bg-pink-600' },
  { initials: 'DS', name: 'Deepak Sharma', role: 'Forklift Op.', task: 'Zone D restocking', status: 'On Break', color: 'bg-gray-500' },
];

export function WmsDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mumbai Warehouse Hub</h1>
          <div className="mt-1 flex items-center gap-3">
            <p className="text-sm text-gray-500">Friday, 28 March 2026</p>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-1.5">
              <Sun className="h-4 w-4 text-brand-500" />
              <span className="text-sm font-medium text-brand-600">Day Shift</span>
              <span className="text-xs text-gray-400">(06:00 - 14:00)</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            <Download className="h-4 w-4" />
            Export Report
          </button>
          <Link href="/receiving" className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600">
            <Plus className="h-4 w-4" />
            New Inbound
          </Link>
        </div>
      </div>

      {/* 6 Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <StatCard
            key={s.title}
            title={s.title}
            value={s.value}
            icon={s.icon}
            trend={s.trend}
            trendDirection={s.trendDirection}
            subtitle={s.subtitle}
            progressBar={s.progressBar}
            progressColor={s.progressColor}
          />
        ))}
      </div>

      {/* Two Column: Activity Timeline + Urgent Dispatch */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Activity Timeline */}
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Today&apos;s Activity</h2>
            <span className="text-xs text-gray-400">Live Feed</span>
          </div>
          <div className="space-y-0">
            {activityTimeline.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="flex gap-3 rounded-lg border-b border-gray-50 px-2 py-3 transition hover:bg-gray-50">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${item.color}`}>
                      <Icon className={`h-4 w-4 ${item.iconColor}`} />
                    </div>
                    {idx < activityTimeline.length - 1 && <div className="mt-1 h-full w-px bg-gray-100" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                    <span className="mt-1 inline-block text-[10px] text-gray-400">{item.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Urgent Dispatch Table */}
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-gray-900">Urgent: Due for Dispatch</h2>
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">5 orders</span>
            </div>
            <Link href="/picking" className="text-xs font-medium text-brand-500 hover:text-brand-600">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Order ID', 'Items', 'Priority', 'Due Time', 'Status', 'Action'].map((h) => (
                    <th key={h} className={`py-2 pr-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400 ${h === 'Action' ? 'text-right' : 'text-left'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {urgentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-gray-50 transition hover:bg-brand-50">
                    <td className="py-3 pr-3"><span className="text-sm font-semibold text-brand-600">{o.id}</span></td>
                    <td className="py-3 pr-3 text-sm text-gray-700">{o.items}</td>
                    <td className="py-3 pr-3"><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${o.priorityColor}`}>{o.priority}</span></td>
                    <td className="py-3 pr-3 text-sm text-gray-700">{o.dueTime}</td>
                    <td className="py-3 pr-3">
                      <span className={`flex items-center gap-1.5 text-xs font-medium ${o.statusColor}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${o.dotColor}`} />
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button className="rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-500 transition hover:text-brand-600">{o.action}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Row: Warehouse Zones + Staff on Duty */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Warehouse Zones (2 col) */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 xl:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Warehouse Zones Overview</h2>
            <Link href="/inventory" className="text-xs font-medium text-brand-500 hover:text-brand-600">Manage Zones</Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {zones.map((z) => (
              <div key={z.name} className="rounded-xl border border-gray-100 p-4 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${z.bg}`}>
                      <span className={`text-sm font-bold ${z.text}`}>{z.name.split(' ')[1]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{z.name}</p>
                      <p className="text-xs text-gray-500">{z.type}</p>
                    </div>
                  </div>
                  <span className={`text-lg font-bold ${z.capacity > 80 ? 'text-red-600' : z.capacity > 60 ? 'text-amber-600' : 'text-green-600'}`}>{z.capacity}%</span>
                </div>
                <div className="mb-2 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div className={`h-full rounded-full ${z.bar}`} style={{ width: `${z.capacity}%` }} />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{z.bins} bins occupied</span>
                  <span>{z.capacity > 80 ? 'Near Full' : z.capacity > 60 ? 'Moderate' : 'Available'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Staff on Duty */}
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Staff on Duty</h2>
            <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-600">{staff.filter(s => s.status === 'Active').length} active</span>
          </div>
          <div className="space-y-3">
            {staff.map((s) => (
              <div key={s.initials} className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-gray-50">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${s.color}`}>{s.initials}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">{s.name}</p>
                    <span className="text-[10px] text-gray-400">{s.role}</span>
                  </div>
                  <p className="text-xs text-gray-500">{s.task}</p>
                </div>
                <span className={`flex items-center gap-1 text-[10px] font-medium ${s.status === 'Active' ? 'text-green-600' : 'text-gray-400'}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${s.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
