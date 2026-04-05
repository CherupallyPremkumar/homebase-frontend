'use client';

import { useState } from 'react';
import {
  ClipboardList, Clock, PackageCheck, Truck, Search,
  ChevronDown, ChevronUp, Check, Package, MapPin,
} from 'lucide-react';
import { StatCard, StatusBadge } from '@homebase/ui';

/* ------------------------------------------------------------------ */
/*  Mock data matching the warehouse-orders HTML prototype             */
/* ------------------------------------------------------------------ */

const pickStats = [
  { title: 'Total Orders', value: '45', icon: <ClipboardList className="h-5 w-5 text-blue-600" />, trend: 8, trendDirection: 'up' as const },
  { title: 'Picking', value: '18', icon: <Clock className="h-5 w-5 text-amber-600" />, subtitle: 'In Progress' },
  { title: 'Packing', value: '12', icon: <PackageCheck className="h-5 w-5 text-purple-600" />, subtitle: 'At Stations' },
  { title: 'Ready to Ship', value: '15', icon: <Truck className="h-5 w-5 text-green-600" />, subtitle: 'Awaiting Pickup' },
];

type OrderStatus = 'Picking' | 'Queued' | 'Packing' | 'Ready' | 'Completed';
type Priority = 'Critical' | 'High' | 'Normal' | 'Low';

interface PickOrder {
  id: string;
  customer: string;
  items: number;
  priority: Priority;
  status: OrderStatus;
  assignedTo: string;
  zone: string;
  dueTime: string;
  pickItems?: PickItem[];
}

interface PickItem {
  sku: string;
  product: string;
  bin: string;
  qty: number;
  picked: boolean;
}

const priorityStyles: Record<Priority, string> = {
  Critical: 'bg-red-100 text-red-700',
  High: 'bg-amber-100 text-amber-700',
  Normal: 'bg-blue-100 text-blue-700',
  Low: 'bg-gray-100 text-gray-600',
};

const statusVariant: Record<OrderStatus, 'warning' | 'info' | 'purple' | 'success' | 'neutral'> = {
  Picking: 'warning',
  Queued: 'info',
  Packing: 'purple',
  Ready: 'success',
  Completed: 'success',
};

const orders: PickOrder[] = [
  {
    id: '#HB-78234', customer: 'Rahul Verma', items: 3, priority: 'Critical', status: 'Picking', assignedTo: 'Priya S.', zone: 'A, B', dueTime: '1:00 PM',
    pickItems: [
      { sku: 'HB-EL-4521', product: 'Samsung Galaxy S24', bin: 'A3-R2-S5', qty: 1, picked: true },
      { sku: 'HB-EL-4590', product: 'OnePlus Buds Pro 2', bin: 'A1-R3-S1', qty: 1, picked: true },
      { sku: 'HB-BT-7721', product: 'Lakme Moisturiser Set', bin: 'B4-R2-S6', qty: 1, picked: false },
    ],
  },
  { id: '#HB-78190', customer: 'Anita Desai', items: 1, priority: 'Critical', status: 'Packing', assignedTo: 'Sunita P.', zone: 'A', dueTime: '1:30 PM' },
  {
    id: '#HB-78156', customer: 'Vikram Joshi', items: 5, priority: 'High', status: 'Picking', assignedTo: 'Amit M.', zone: 'B, C', dueTime: '2:00 PM',
    pickItems: [
      { sku: 'HB-FA-2201', product: 'Allen Solly Formal Shirt', bin: 'B2-R1-S8', qty: 2, picked: true },
      { sku: 'HB-HK-3312', product: 'Prestige Induction Cooktop', bin: 'C1-R4-S2', qty: 1, picked: false },
      { sku: 'HB-HK-3350', product: 'Borosil Glass Set', bin: 'C3-R1-S4', qty: 1, picked: false },
      { sku: 'HB-BT-7721', product: 'Lakme Moisturiser Set', bin: 'B4-R2-S6', qty: 1, picked: false },
    ],
  },
  { id: '#HB-78101', customer: 'Meera Nair', items: 2, priority: 'High', status: 'Queued', assignedTo: 'Unassigned', zone: 'D', dueTime: '3:00 PM' },
  { id: '#HB-78088', customer: 'Suresh Iyer', items: 4, priority: 'Normal', status: 'Queued', assignedTo: 'Unassigned', zone: 'A, D', dueTime: '5:00 PM' },
  { id: '#HB-78045', customer: 'Priya Patel', items: 1, priority: 'Normal', status: 'Ready', assignedTo: 'Vikram R.', zone: 'C', dueTime: 'Completed' },
  { id: '#HB-78032', customer: 'Deepak Gupta', items: 3, priority: 'Normal', status: 'Packing', assignedTo: 'Sunita P.', zone: 'B', dueTime: '4:00 PM' },
  { id: '#HB-78019', customer: 'Neha Sharma', items: 2, priority: 'Low', status: 'Queued', assignedTo: 'Unassigned', zone: 'A', dueTime: '6:00 PM' },
];

const packingChecklist = [
  { id: 1, label: 'Items match pick list', checked: true },
  { id: 2, label: 'Quality check passed', checked: true },
  { id: 3, label: 'Correct box size selected', checked: false },
  { id: 4, label: 'Packing material added', checked: false },
  { id: 5, label: 'Invoice printed & inserted', checked: false },
  { id: 6, label: 'Shipping label attached', checked: false },
];

const tabs = ['All Orders', 'Picking', 'Packing', 'Ready to Ship', 'Completed'];

export function PickListQueue() {
  const [activeTab, setActiveTab] = useState('All Orders');
  const [expandedOrder, setExpandedOrder] = useState<string | null>('#HB-78234');
  const [packing, setPacking] = useState(packingChecklist);

  const togglePack = (id: number) => {
    setPacking((prev) => prev.map((c) => c.id === id ? { ...c, checked: !c.checked } : c));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders - Pick &amp; Pack</h1>
          <p className="mt-1 text-sm text-gray-500">Manage order fulfillment: picking, packing, and dispatch preparation</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            <ClipboardList className="h-4 w-4" />
            Batch Pick
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600">
            <Package className="h-4 w-4" />
            Assign Orders
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-6">
        {pickStats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      {/* Filter Tabs + Orders Table */}
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
            <input type="text" placeholder="Search orders..." className="w-52 rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-9 pr-4 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['', 'Order ID', 'Customer', 'Items', 'Priority', 'Status', 'Assigned To', 'Zone', 'Due Time', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((o) => (
                <>
                  <tr key={o.id} className="transition hover:bg-brand-50">
                    <td className="px-5 py-4">
                      {o.pickItems && (
                        <button onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)} className="rounded p-1 text-gray-400 transition hover:bg-gray-100">
                          {expandedOrder === o.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-4"><span className="text-sm font-semibold text-brand-600">{o.id}</span></td>
                    <td className="px-5 py-4 text-sm text-gray-700">{o.customer}</td>
                    <td className="px-5 py-4 text-sm text-gray-700">{o.items} items</td>
                    <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${priorityStyles[o.priority]}`}>{o.priority}</span></td>
                    <td className="px-5 py-4"><StatusBadge status={o.status} variant={statusVariant[o.status]} /></td>
                    <td className="px-5 py-4 text-sm text-gray-700">{o.assignedTo}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{o.zone}</td>
                    <td className="px-5 py-4 text-sm text-gray-700">{o.dueTime}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {o.status === 'Queued' && (
                          <button className="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-600">Assign</button>
                        )}
                        {o.status === 'Picking' && (
                          <button className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-600">Continue</button>
                        )}
                        {o.status === 'Packing' && (
                          <button className="rounded-lg bg-purple-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-purple-600">Pack</button>
                        )}
                        {o.status === 'Ready' && (
                          <button className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-green-700">Dispatch</button>
                        )}
                        <button className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-200">View</button>
                      </div>
                    </td>
                  </tr>
                  {/* Expandable Pick List */}
                  {expandedOrder === o.id && o.pickItems && (
                    <tr key={`${o.id}-expanded`}>
                      <td colSpan={10} className="bg-gray-50 px-8 py-4">
                        <div className="rounded-lg border border-gray-200 bg-white p-4">
                          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Pick List - {o.id}</p>
                          <div className="space-y-2">
                            {o.pickItems.map((pi) => (
                              <div key={pi.sku} className={`flex items-center gap-4 rounded-lg p-3 ${pi.picked ? 'bg-green-50' : 'bg-white border border-gray-100'}`}>
                                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded ${pi.picked ? 'bg-green-500 text-white' : 'border border-gray-300 bg-white'}`}>
                                  {pi.picked && <Check className="h-3.5 w-3.5" />}
                                </div>
                                <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-gray-600">{pi.sku}</span>
                                <span className={`flex-1 text-sm ${pi.picked ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{pi.product}</span>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <MapPin className="h-3 w-3" />
                                  {pi.bin}
                                </div>
                                <span className="text-xs font-medium text-gray-600">x{pi.qty}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <p className="text-xs text-gray-500">{o.pickItems.filter(p => p.picked).length}/{o.pickItems.length} items picked</p>
                            <button className="rounded-lg bg-brand-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-600">Mark All Picked</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Packing Checklist */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Packing Checklist - #HB-78190</h3>
            <p className="text-sm text-gray-500">Anita Desai - 1 item, Pack Station 2</p>
          </div>
          <StatusBadge status="Packing" variant="purple" />
        </div>
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
          <div className="space-y-2.5">
            {packing.map((item) => (
              <label key={item.id} className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition hover:bg-white">
                <button
                  onClick={() => togglePack(item.id)}
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${item.checked ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300 bg-white'}`}
                >
                  {item.checked && <Check className="h-3 w-3" />}
                </button>
                <span className={`text-sm ${item.checked ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{item.label}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">{packing.filter(c => c.checked).length}/{packing.length} steps completed</p>
          <button className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700">Complete Packing</button>
        </div>
      </div>
    </div>
  );
}
