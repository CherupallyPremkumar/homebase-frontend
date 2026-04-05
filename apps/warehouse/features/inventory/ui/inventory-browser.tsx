'use client';

import { useState } from 'react';
import {
  LayoutGrid, Package, AlertTriangle, XCircle, Search,
  Filter, Shield, Download, ArrowDownToLine, ArrowUpFromLine,
  RefreshCw, MoreHorizontal, Eye, Edit, BarChart3,
  X, Check, ArrowLeftRight, SlidersHorizontal, Clock,
} from 'lucide-react';
import {
  StatCard, StatusBadge,
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
} from '@homebase/ui';

/* ------------------------------------------------------------------ */
/*  Mock data matching the warehouse-inventory HTML prototype          */
/* ------------------------------------------------------------------ */

const inventoryStats = [
  { title: 'Total SKUs', value: '2,450', icon: <LayoutGrid className="h-5 w-5 text-blue-600" />, trend: 12, trendDirection: 'up' as const, progressBar: 82, progressColor: 'bg-blue-500' },
  { title: 'Total Units', value: '24,560', icon: <Package className="h-5 w-5 text-brand-500" />, trend: 340, trendDirection: 'up' as const, progressBar: 68, progressColor: 'bg-brand-500' },
  { title: 'Low Stock', value: '34', icon: <AlertTriangle className="h-5 w-5 text-amber-500" />, trend: 5, trendDirection: 'up' as const, trendIsPositive: false, progressBar: 14, progressColor: 'bg-amber-400' },
  { title: 'Out of Stock', value: '8', icon: <XCircle className="h-5 w-5 text-red-500" />, trend: 2, trendDirection: 'up' as const, trendIsPositive: false, progressBar: 3, progressColor: 'bg-red-500' },
];

type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

interface InventoryItem {
  sku: string;
  product: string;
  category: string;
  seller: string;
  zone: string;
  zoneColor: string;
  bin: string;
  qty: number;
  reserved: number;
  available: number;
  status: StockStatus;
  lastMovement: string;
}

const stockVariant: Record<StockStatus, 'success' | 'warning' | 'error'> = {
  'In Stock': 'success',
  'Low Stock': 'warning',
  'Out of Stock': 'error',
};

const inventoryItems: InventoryItem[] = [
  { sku: 'HB-EL-4521', product: 'Samsung Galaxy S24', category: 'Electronics', seller: 'TechWorld India', zone: 'A', zoneColor: 'bg-blue-100 text-blue-700', bin: 'A3-R2-S5', qty: 120, reserved: 18, available: 102, status: 'In Stock', lastMovement: '2 hrs ago' },
  { sku: 'HB-HK-3312', product: 'Prestige Induction Cooktop', category: 'Home & Kitchen', seller: 'KitchenKraft', zone: 'C', zoneColor: 'bg-purple-100 text-purple-700', bin: 'C1-R4-S2', qty: 45, reserved: 12, available: 33, status: 'In Stock', lastMovement: '5 hrs ago' },
  { sku: 'HB-FA-2201', product: 'Allen Solly Formal Shirt', category: 'Clothing', seller: 'FashionHub India', zone: 'B', zoneColor: 'bg-green-100 text-green-700', bin: 'B2-R1-S8', qty: 8, reserved: 3, available: 5, status: 'Low Stock', lastMovement: '1 hr ago' },
  { sku: 'HB-EL-4590', product: 'OnePlus Buds Pro 2', category: 'Electronics', seller: 'TechMart India', zone: 'A', zoneColor: 'bg-blue-100 text-blue-700', bin: 'A1-R3-S1', qty: 250, reserved: 45, available: 205, status: 'In Stock', lastMovement: '30 min ago' },
  { sku: 'HB-SP-1105', product: 'Nike Air Max 270', category: 'Sports', seller: 'SportsZone Pro', zone: 'D', zoneColor: 'bg-amber-100 text-amber-700', bin: 'D2-R1-S3', qty: 0, reserved: 0, available: 0, status: 'Out of Stock', lastMovement: '2 days ago' },
  { sku: 'HB-BT-7721', product: 'Lakme Moisturiser Set', category: 'Beauty', seller: 'BeautyGlow Store', zone: 'B', zoneColor: 'bg-green-100 text-green-700', bin: 'B4-R2-S6', qty: 180, reserved: 22, available: 158, status: 'In Stock', lastMovement: '4 hrs ago' },
  { sku: 'HB-HK-3350', product: 'Borosil Glass Set', category: 'Home & Kitchen', seller: 'GreenHome Essentials', zone: 'C', zoneColor: 'bg-purple-100 text-purple-700', bin: 'C3-R1-S4', qty: 5, reserved: 5, available: 0, status: 'Low Stock', lastMovement: '6 hrs ago' },
  { sku: 'HB-BK-9901', product: 'Atomic Habits - James Clear', category: 'Books', seller: 'BookWorld Online', zone: 'D', zoneColor: 'bg-amber-100 text-amber-700', bin: 'D1-R3-S7', qty: 320, reserved: 56, available: 264, status: 'In Stock', lastMovement: '1 hr ago' },
];

const zones = [
  { name: 'Zone A', label: 'Electronics', capacity: 85, bins: 280, occupied: 240, color: 'bg-blue-500', bgLight: 'bg-blue-50', text: 'text-blue-700' },
  { name: 'Zone B', label: 'Fashion & Beauty', capacity: 62, bins: 250, occupied: 156, color: 'bg-green-500', bgLight: 'bg-green-50', text: 'text-green-700' },
  { name: 'Zone C', label: 'Home & Kitchen', capacity: 78, bins: 250, occupied: 195, color: 'bg-purple-500', bgLight: 'bg-purple-50', text: 'text-purple-700' },
  { name: 'Zone D', label: 'Bulk & Books', capacity: 45, bins: 120, occupied: 54, color: 'bg-amber-500', bgLight: 'bg-amber-50', text: 'text-amber-700' },
];

const recentMovements = [
  { id: 1, type: 'inbound', icon: ArrowDownToLine, color: 'bg-green-100 text-green-600', sku: 'HB-EL-4590', product: 'OnePlus Buds Pro 2', qty: '+50 units', from: 'Inbound INB-001', to: 'Zone A / A1-R3-S1', time: '30 min ago' },
  { id: 2, type: 'pick', icon: ArrowUpFromLine, color: 'bg-blue-100 text-blue-600', sku: 'HB-EL-4521', product: 'Samsung Galaxy S24', qty: '-5 units', from: 'Zone A / A3-R2-S5', to: 'Pick List PK-892', time: '2 hrs ago' },
  { id: 3, type: 'transfer', icon: RefreshCw, color: 'bg-amber-100 text-amber-600', sku: 'HB-FA-2201', product: 'Allen Solly Formal Shirt', qty: '12 units', from: 'Zone B / B2-R1-S8', to: 'Zone B / B3-R2-S1', time: '3 hrs ago' },
  { id: 4, type: 'inbound', icon: ArrowDownToLine, color: 'bg-green-100 text-green-600', sku: 'HB-BT-7721', product: 'Lakme Moisturiser Set', qty: '+30 units', from: 'Inbound INB-006', to: 'Zone B / B4-R2-S6', time: '4 hrs ago' },
  { id: 5, type: 'pick', icon: ArrowUpFromLine, color: 'bg-blue-100 text-blue-600', sku: 'HB-BK-9901', product: 'Atomic Habits', qty: '-8 units', from: 'Zone D / D1-R3-S7', to: 'Pick List PK-893', time: '5 hrs ago' },
];

export function InventoryBrowser() {
  const [zoneFilter, setZoneFilter] = useState('All Zones');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // View modal state
  const [viewItem, setViewItem] = useState<InventoryItem | null>(null);

  // Inline edit state
  const [editingSku, setEditingSku] = useState<string | null>(null);
  const [editQty, setEditQty] = useState(0);
  const [editReserved, setEditReserved] = useState(0);
  const [items, setItems] = useState(inventoryItems);

  function startEdit(item: InventoryItem) {
    setEditingSku(item.sku);
    setEditQty(item.qty);
    setEditReserved(item.reserved);
  }

  function saveEdit(sku: string) {
    setItems(prev => prev.map(it => {
      if (it.sku !== sku) return it;
      const newAvailable = Math.max(0, editQty - editReserved);
      const newStatus: StockStatus = editQty === 0 ? 'Out of Stock' : editQty <= 10 ? 'Low Stock' : 'In Stock';
      return { ...it, qty: editQty, reserved: editReserved, available: newAvailable, status: newStatus };
    }));
    setEditingSku(null);
  }

  function cancelEdit() {
    setEditingSku(null);
  }

  function handleMoreAction(action: string, item: InventoryItem) {
    alert(`${action} for ${item.sku} - ${item.product}`);
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Warehouse Inventory</h1>
          <p className="mt-1 text-sm text-gray-500">Track stock levels, locations, and movements across all warehouse zones.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            <Shield className="h-4 w-4 text-gray-500" />
            Stock Audit
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-600">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {inventoryStats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      {/* Search + Filter Bar */}
      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by SKU, product name, or bin location..." className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
          </div>
          <select value={zoneFilter} onChange={e => setZoneFilter(e.target.value)} className="min-w-[130px] rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100">
            <option>All Zones</option>
            <option>Zone A</option>
            <option>Zone B</option>
            <option>Zone C</option>
            <option>Zone D</option>
          </select>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="min-w-[150px] rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100">
            <option>All Categories</option>
            <option>Electronics</option>
            <option>Home &amp; Kitchen</option>
            <option>Clothing</option>
            <option>Beauty</option>
            <option>Sports</option>
            <option>Books</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="min-w-[150px] rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100">
            <option>All Status</option>
            <option>In Stock</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </select>
          <button className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['SKU', 'Product', 'Seller', 'Zone', 'Bin Location', 'Qty', 'Reserved', 'Available', 'Status', 'Last Movement', 'Actions'].map((h) => (
                  <th key={h} className={`px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-600 ${h === 'Qty' || h === 'Reserved' || h === 'Available' ? 'text-right' : h === 'Status' || h === 'Actions' ? 'text-center' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((item) =>
                editingSku === item.sku ? (
                  /* ---- Inline Edit Row ---- */
                  <tr key={item.sku} className="bg-blue-50">
                    <td className="px-5 py-4" colSpan={5}>
                      <div className="flex items-center gap-3">
                        <span className="rounded bg-gray-100 px-2 py-1 font-mono text-xs font-semibold text-gray-700">{item.sku}</span>
                        <span className="text-sm font-medium text-gray-900">{item.product}</span>
                        <span className="text-xs text-gray-400">Zone {item.zone} / {item.bin}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4" colSpan={3}>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <label className="text-xs font-semibold text-gray-500">Qty:</label>
                          <input type="number" value={editQty} min={0} onChange={e => setEditQty(Number(e.target.value))}
                            className="w-20 rounded-lg border border-gray-300 px-2.5 py-1.5 text-sm font-semibold text-gray-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <label className="text-xs font-semibold text-gray-500">Reserved:</label>
                          <input type="number" value={editReserved} min={0} onChange={e => setEditReserved(Number(e.target.value))}
                            className="w-20 rounded-lg border border-gray-300 px-2.5 py-1.5 text-sm text-gray-600 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right" colSpan={3}>
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => saveEdit(item.sku)} className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-green-700">
                          <Check className="h-3.5 w-3.5" /> Save
                        </button>
                        <button onClick={cancelEdit} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50">
                          <X className="h-3.5 w-3.5" /> Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  /* ---- Normal Row ---- */
                  <tr key={item.sku} className="transition hover:bg-brand-50">
                    <td className="px-5 py-4">
                      <span className="rounded bg-gray-100 px-2 py-1 font-mono text-xs font-semibold text-gray-700">{item.sku}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{item.product}</p>
                        <p className="text-xs text-gray-400">{item.category}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{item.seller}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold ${item.zoneColor}`}>{item.zone}</span>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-gray-700">{item.bin}</td>
                    <td className="px-5 py-4 text-right font-semibold text-gray-900">{item.qty}</td>
                    <td className="px-5 py-4 text-right text-gray-500">{item.reserved}</td>
                    <td className="px-5 py-4 text-right font-semibold text-gray-900">{item.available}</td>
                    <td className="px-5 py-4 text-center">
                      <StatusBadge status={item.status} variant={stockVariant[item.status]} />
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-500">{item.lastMovement}</td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {/* View button */}
                        <button onClick={() => setViewItem(item)} className="rounded-lg p-1.5 text-gray-400 transition hover:bg-brand-50 hover:text-brand-500" title="View Details">
                          <Eye className="h-4 w-4" />
                        </button>
                        {/* Edit button */}
                        <button onClick={() => startEdit(item)} className="rounded-lg p-1.5 text-gray-400 transition hover:bg-blue-50 hover:text-blue-500" title="Edit">
                          <Edit className="h-4 w-4" />
                        </button>
                        {/* More actions dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600" title="More actions">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleMoreAction('Transfer Stock', item)}>
                              <ArrowLeftRight className="mr-2 h-4 w-4 text-gray-400" /> Transfer Stock
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleMoreAction('Adjust Quantity', item)}>
                              <SlidersHorizontal className="mr-2 h-4 w-4 text-gray-400" /> Adjust Quantity
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleMoreAction('Mark Damaged', item)} className="text-red-600 focus:text-red-600">
                              <AlertTriangle className="mr-2 h-4 w-4" /> Mark Damaged
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleMoreAction('View History', item)}>
                              <Clock className="mr-2 h-4 w-4 text-gray-400" /> View History
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Column: Zone Map + Recent Movements */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Warehouse Zone Map */}
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Warehouse Zone Map</h2>
            <span className="text-xs text-gray-400">Capacity Overview</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {zones.map((z) => (
              <div key={z.name} className={`rounded-xl border border-gray-100 p-4 transition hover:shadow-md ${z.bgLight}`}>
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{z.name}</p>
                    <p className="text-xs text-gray-500">{z.label}</p>
                  </div>
                  <span className={`text-lg font-bold ${z.capacity > 80 ? 'text-red-600' : z.capacity > 60 ? 'text-amber-600' : 'text-green-600'}`}>{z.capacity}%</span>
                </div>
                <div className="mb-2 h-2 overflow-hidden rounded-full bg-white/70">
                  <div className={`h-full rounded-full ${z.color}`} style={{ width: `${z.capacity}%` }} />
                </div>
                <p className="text-xs text-gray-500">{z.occupied}/{z.bins} bins occupied</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Stock Movements */}
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Recent Stock Movements</h2>
            <button className="text-xs font-medium text-brand-500 hover:text-brand-600">View All</button>
          </div>
          <div className="space-y-0">
            {recentMovements.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.id} className="flex gap-3 rounded-lg border-b border-gray-50 px-2 py-3 transition hover:bg-gray-50">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${m.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-gray-600">{m.sku}</span>
                      <span className="text-sm font-medium text-gray-800">{m.product}</span>
                      <span className={`text-xs font-bold ${m.type === 'inbound' ? 'text-green-600' : m.type === 'pick' ? 'text-blue-600' : 'text-amber-600'}`}>{m.qty}</span>
                    </div>
                    <p className="text-xs text-gray-500">{m.from} &rarr; {m.to}</p>
                    <span className="mt-0.5 inline-block text-[10px] text-gray-400">{m.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---- View Item Details Dialog ---- */}
      <Dialog open={!!viewItem} onOpenChange={(open) => { if (!open) setViewItem(null); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Item Details</DialogTitle>
            <DialogDescription>Full inventory record for {viewItem?.sku}</DialogDescription>
          </DialogHeader>
          {viewItem && (
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">SKU</p>
                <p className="inline-block rounded bg-gray-100 px-2 py-0.5 font-mono text-sm font-semibold text-gray-800">{viewItem.sku}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Status</p>
                <StatusBadge status={viewItem.status} variant={stockVariant[viewItem.status]} />
              </div>
              <div className="col-span-2 space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Product Name</p>
                <p className="text-sm font-medium text-gray-900">{viewItem.product}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Category</p>
                <p className="text-sm text-gray-700">{viewItem.category}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Seller</p>
                <p className="text-sm text-gray-700">{viewItem.seller}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Zone</p>
                <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold ${viewItem.zoneColor}`}>Zone {viewItem.zone}</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Bin Location</p>
                <p className="font-mono text-sm text-gray-700">{viewItem.bin}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Qty</p>
                <p className="text-sm font-bold text-gray-900">{viewItem.qty}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Reserved</p>
                <p className="text-sm text-gray-600">{viewItem.reserved}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Available</p>
                <p className="text-sm font-bold text-gray-900">{viewItem.available}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Last Movement</p>
                <p className="text-sm text-gray-600">{viewItem.lastMovement}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
