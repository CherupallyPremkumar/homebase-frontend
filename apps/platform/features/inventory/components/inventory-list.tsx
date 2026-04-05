'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Package, CheckCircle, AlertTriangle, XCircle, Lock,
  Bell, Download, Eye, Search,
} from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';
type StmState = 'IN_STOCK' | 'DEPLETED' | 'RESERVED' | 'DAMAGED_REPORTED' | 'STOCK_PENDING';
type MovementType = 'INBOUND' | 'OUTBOUND' | 'TRANSFER' | 'DAMAGED';

interface InventoryRow {
  product: string;
  sku: string;
  seller: string;
  warehouse: string;
  available: number;
  reserved: number;
  damaged: number;
  reorderLevel: number;
  status: StockStatus;
  stmState: StmState;
}

interface FulfillmentCenter {
  name: string;
  code: string;
  type: string;
  region: string;
  totalSkus: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  availability: number;
  health: 'Healthy' | 'Warning' | 'Critical';
}

interface StockMovement {
  type: MovementType;
  sku: string;
  product: string;
  quantity: number;
  warehouse: string;
  reason: string;
  time: string;
}

// ----------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------

const mockInventory: InventoryRow[] = [
  { product: 'Samsung Galaxy S24 Ultra', sku: 'SKU-ELEC-001', seller: 'TechZone India', warehouse: 'BOM-01', available: 0, reserved: 0, damaged: 0, reorderLevel: 50, status: 'Out of Stock', stmState: 'DEPLETED' },
  { product: 'Apple MacBook Air M3', sku: 'SKU-ELEC-045', seller: 'DigiMart', warehouse: 'BLR-01', available: 12, reserved: 8, damaged: 0, reorderLevel: 30, status: 'Low Stock', stmState: 'IN_STOCK' },
  { product: 'Banarasi Silk Saree', sku: 'SKU-FASH-112', seller: 'Varanasi Handlooms', warehouse: 'DEL-01', available: 340, reserved: 45, damaged: 2, reorderLevel: 50, status: 'In Stock', stmState: 'IN_STOCK' },
  { product: 'Sony WH-1000XM5', sku: 'SKU-ELEC-089', seller: 'AudioWorld', warehouse: 'BOM-01', available: 78, reserved: 34, damaged: 0, reorderLevel: 20, status: 'In Stock', stmState: 'RESERVED' },
  { product: 'Bosch Drill Machine 13mm', sku: 'SKU-TOOL-034', seller: 'ToolMaster', warehouse: 'BLR-01', available: 156, reserved: 12, damaged: 8, reorderLevel: 25, status: 'In Stock', stmState: 'DAMAGED_REPORTED' },
  { product: 'Organic Coconut Oil 1L', sku: 'SKU-GROC-220', seller: 'Kerala Naturals', warehouse: 'BOM-01', available: 890, reserved: 120, damaged: 0, reorderLevel: 200, status: 'In Stock', stmState: 'STOCK_PENDING' },
  { product: 'Nike Air Max 270 (Size 9)', sku: 'SKU-FASH-567', seller: 'SportsBazaar', warehouse: 'DEL-01', available: 0, reserved: 0, damaged: 0, reorderLevel: 40, status: 'Out of Stock', stmState: 'DEPLETED' },
  { product: 'Prestige Pressure Cooker 5L', sku: 'SKU-HOME-089', seller: 'KitchenWorld', warehouse: 'BOM-01', available: 234, reserved: 56, damaged: 1, reorderLevel: 40, status: 'In Stock', stmState: 'IN_STOCK' },
];

const mockFCs: FulfillmentCenter[] = [
  { name: 'Mumbai', code: 'BOM-01', type: 'Primary FC', region: 'Maharashtra', totalSkus: 5234, inStock: 4812, lowStock: 312, outOfStock: 110, availability: 92, health: 'Healthy' },
  { name: 'Bangalore', code: 'BLR-01', type: 'Secondary FC', region: 'Karnataka', totalSkus: 4156, inStock: 3542, lowStock: 430, outOfStock: 184, availability: 85, health: 'Warning' },
  { name: 'Delhi NCR', code: 'DEL-01', type: 'Regional FC', region: 'Delhi', totalSkus: 3457, inStock: 3104, lowStock: 303, outOfStock: 50, availability: 90, health: 'Healthy' },
];

const mockMovements: StockMovement[] = [
  { type: 'INBOUND', sku: 'SKU-FASH-112', product: 'Banarasi Silk Saree', quantity: 200, warehouse: 'DEL-01', reason: 'Purchase order PO-4521', time: '2 hours ago' },
  { type: 'OUTBOUND', sku: 'SKU-ELEC-089', product: 'Sony WH-1000XM5', quantity: -15, warehouse: 'BOM-01', reason: 'Order fulfillment', time: '3 hours ago' },
  { type: 'TRANSFER', sku: 'SKU-HOME-089', product: 'Prestige Pressure Cooker 5L', quantity: 50, warehouse: 'BLR-01 \u2192 BOM-01', reason: 'Stock rebalancing', time: '5 hours ago' },
  { type: 'DAMAGED', sku: 'SKU-TOOL-034', product: 'Bosch Drill Machine 13mm', quantity: -8, warehouse: 'BLR-01', reason: 'Packaging damage during transit', time: '6 hours ago' },
];

const TABS = [
  { key: 'all', label: 'All', count: '12,847', badge: 'bg-gray-100 text-gray-600' },
  { key: 'in-stock', label: 'In Stock', count: '11,458', badge: 'bg-green-100 text-green-700' },
  { key: 'low', label: 'Low Stock', count: '1,045', badge: 'bg-yellow-100 text-yellow-700' },
  { key: 'out', label: 'Out of Stock', count: '344', badge: 'bg-red-100 text-red-700' },
  { key: 'reserved', label: 'Reserved', count: '2,156', badge: 'bg-blue-100 text-blue-700' },
];

const STATS = [
  { label: 'Total SKUs', value: '12,847', subtitle: 'Across 342 sellers', icon: Package, iconBg: 'bg-gray-50', iconColor: 'text-gray-500' },
  { label: 'In Stock', value: '11,458', subtitle: '89.2% healthy', icon: CheckCircle, iconBg: 'bg-green-50', iconColor: 'text-green-600', valueColor: 'text-gray-900', subtitleColor: 'text-green-600' },
  { label: 'Low Stock', value: '1,045', subtitle: 'Below reorder threshold', icon: AlertTriangle, iconBg: 'bg-yellow-50', iconColor: 'text-yellow-600', valueColor: 'text-yellow-600', subtitleColor: 'text-yellow-600' },
  { label: 'Out of Stock', value: '344', subtitle: 'Immediate attention needed', icon: XCircle, iconBg: 'bg-red-50', iconColor: 'text-red-600', valueColor: 'text-red-600', subtitleColor: 'text-red-600' },
  { label: 'Reserved', value: '2,156', subtitle: 'Locked for active orders', icon: Lock, iconBg: 'bg-blue-50', iconColor: 'text-blue-600', valueColor: 'text-blue-600', subtitleColor: 'text-blue-600' },
];

const STM_BADGE: Record<StmState, string> = {
  IN_STOCK: 'bg-green-50 text-green-600',
  DEPLETED: 'bg-red-50 text-red-600',
  RESERVED: 'bg-blue-50 text-blue-600',
  DAMAGED_REPORTED: 'bg-orange-50 text-orange-600',
  STOCK_PENDING: 'bg-purple-50 text-purple-600',
};

const STATUS_BADGE: Record<StockStatus, string> = {
  'In Stock': 'bg-green-100 text-green-700',
  'Low Stock': 'bg-yellow-100 text-yellow-700',
  'Out of Stock': 'bg-red-100 text-red-700',
};

const MOVEMENT_BADGE: Record<MovementType, string> = {
  INBOUND: 'bg-green-100 text-green-700',
  OUTBOUND: 'bg-red-100 text-red-700',
  TRANSFER: 'bg-blue-100 text-blue-700',
  DAMAGED: 'bg-orange-100 text-orange-700',
};

const HEALTH_BADGE: Record<string, string> = {
  Healthy: 'bg-green-50 text-green-700',
  Warning: 'bg-yellow-50 text-yellow-700',
  Critical: 'bg-red-50 text-red-700',
};
const HEALTH_DOT: Record<string, string> = { Healthy: 'bg-green-500', Warning: 'bg-yellow-500', Critical: 'bg-red-500' };
const PROGRESS_COLOR: Record<string, string> = { Healthy: 'bg-green-500', Warning: 'bg-yellow-500', Critical: 'bg-red-500' };

const TEXT = {
  title: 'Inventory Management',
  subtitle: 'Monitor stock levels, movements, and fulfillment center health across all sellers',
  alerts: 'Alerts',
  export: 'Export',
  fcTitle: 'Fulfillment Center Stock Health',
  fcSubtitle: '3 active warehouses',
  movementsTitle: 'Recent Stock Movements',
  viewAll: 'View All',
  notifySeller: 'Notify Seller',
} as const;

// ----------------------------------------------------------------
// Component
// ----------------------------------------------------------------

export function InventoryList() {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('all');

  const filtered = mockInventory.filter((item) => {
    const tabKey = TABS[activeTab]?.key ?? 'all';
    if (tabKey === 'in-stock' && item.status !== 'In Stock') return false;
    if (tabKey === 'low' && item.status !== 'Low Stock') return false;
    if (tabKey === 'out' && item.status !== 'Out of Stock') return false;
    if (tabKey === 'reserved' && item.stmState !== 'RESERVED') return false;
    if (search && !item.product.toLowerCase().includes(search.toLowerCase()) && !item.sku.toLowerCase().includes(search.toLowerCase())) return false;
    if (warehouseFilter !== 'all' && item.warehouse !== warehouseFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{TEXT.title}</h1>
          <p className="mt-1 text-sm text-gray-500">{TEXT.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/inventory/alerts" className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50">
            <Bell className="h-4 w-4 text-red-500" />
            {TEXT.alerts} <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[11px] font-bold text-red-700">179</span>
          </Link>
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50">
            <Download className="h-4 w-4" />{TEXT.export}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {STATS.map((s) => (
          <div key={s.label} className="stat-card rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">{s.label}</p>
              <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', s.iconBg)}>
                <s.icon className={cn('h-5 w-5', s.iconColor)} />
              </div>
            </div>
            <p className={cn('text-2xl font-bold', s.valueColor ?? 'text-gray-900')}>{s.value}</p>
            <p className={cn('mt-1 text-xs', s.subtitleColor ?? 'text-gray-400')}>{s.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Fulfillment Center Breakdown */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">{TEXT.fcTitle}</h2>
          <span className="text-xs text-gray-400">{TEXT.fcSubtitle}</span>
        </div>
        <div className="grid grid-cols-1 divide-y md:grid-cols-3 md:divide-x md:divide-y-0 divide-gray-100">
          {mockFCs.map((fc) => (
            <div key={fc.code} className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{fc.name} ({fc.code})</p>
                  <p className="text-xs text-gray-400">{fc.type} &middot; {fc.region}</p>
                </div>
                <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold', HEALTH_BADGE[fc.health])}>
                  <span className={cn('h-1.5 w-1.5 rounded-full', HEALTH_DOT[fc.health])} />{fc.health}
                </span>
              </div>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-gray-500">Total SKUs</dt><dd className="font-medium">{fc.totalSkus.toLocaleString('en-IN')}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">In Stock</dt><dd className="font-medium text-green-600">{fc.inStock.toLocaleString('en-IN')}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Low Stock</dt><dd className="font-medium text-yellow-600">{fc.lowStock.toLocaleString('en-IN')}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Out of Stock</dt><dd className="font-medium text-red-600">{fc.outOfStock.toLocaleString('en-IN')}</dd></div>
              </dl>
              <div className="mt-3">
                <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                  <div className={cn('h-full rounded-full', PROGRESS_COLOR[fc.health])} style={{ width: `${fc.availability}%` }} />
                </div>
                <p className="mt-1 text-[11px] text-gray-400">{fc.availability}% stock availability</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 pb-0 pt-5">
          <nav className="-mb-px flex items-center gap-0 border-b border-gray-200">
            {TABS.map((tab, i) => (
              <button key={tab.key} onClick={() => setActiveTab(i)} className={cn('border-b-2 px-4 pb-3 text-sm font-medium transition', activeTab === i ? 'border-brand-500 font-semibold text-brand-500' : 'border-transparent text-gray-500 hover:text-gray-700')}>
                {tab.label} <span className={cn('ml-1 rounded-full px-1.5 py-0.5 text-[11px] font-bold', tab.badge)}>{tab.count}</span>
              </button>
            ))}
          </nav>
          <div className="mb-3 flex items-center gap-3">
            <select value={warehouseFilter} onChange={(e) => setWarehouseFilter(e.target.value)} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 outline-none focus:border-brand-400">
              <option value="all">All Warehouses</option>
              {mockFCs.map((fc) => <option key={fc.code} value={fc.code}>{fc.name} ({fc.code})</option>)}
            </select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} type="search" placeholder="Search SKU, product..." className="w-56 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                {['SKU / Product', 'Seller', 'Warehouse', 'Available', 'Reserved', 'Damaged', 'Reorder Level', 'Status', 'STM State', 'Actions'].map((h) => (
                  <th key={h} className={cn('px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500', ['Available', 'Reserved', 'Damaged', 'Reorder Level'].includes(h) ? 'text-right' : '')}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((item) => {
                const isCritical = item.status === 'Out of Stock';
                return (
                  <tr key={item.sku} className={cn('transition-colors', isCritical ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-brand-50/40')}>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{item.product}</p>
                      <p className="font-mono text-xs text-gray-400">{item.sku}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{item.seller}</td>
                    <td className="px-6 py-4 text-gray-600">{item.warehouse}</td>
                    <td className={cn('px-6 py-4 text-right font-bold', item.available === 0 ? 'text-red-600' : item.available < item.reorderLevel ? 'text-yellow-600' : 'text-gray-900')}>{item.available}</td>
                    <td className={cn('px-6 py-4 text-right', item.reserved > 20 ? 'font-bold text-blue-600' : 'text-gray-500')}>{item.reserved}</td>
                    <td className={cn('px-6 py-4 text-right', item.damaged > 0 ? 'font-bold text-orange-600' : 'text-gray-500')}>{item.damaged}</td>
                    <td className="px-6 py-4 text-right text-gray-500">{item.reorderLevel}</td>
                    <td className="px-6 py-4"><span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', STATUS_BADGE[item.status])}>{item.status}</span></td>
                    <td className="px-6 py-4"><span className={cn('inline-flex items-center rounded px-2 py-0.5 font-mono text-xs', STM_BADGE[item.stmState])}>{item.stmState}</span></td>
                    <td className="px-6 py-4">
                      {isCritical ? (
                        <button className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-600">{TEXT.notifySeller}</button>
                      ) : item.status === 'Low Stock' ? (
                        <button className="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-brand-600">{TEXT.notifySeller}</button>
                      ) : (
                        <button className="rounded p-1 text-gray-400 transition hover:text-brand-500" title="View details"><Eye className="h-4 w-4" /></button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
          <p className="text-xs text-gray-400">Showing 1-{filtered.length} of 12,847 items</p>
          <div className="flex items-center gap-1">
            <button className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-400">Previous</button>
            <button className="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white">1</button>
            <button className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100">2</button>
            <button className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100">3</button>
            <span className="px-2 text-gray-400">...</span>
            <button className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100">1,606</button>
            <button className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100">Next</button>
          </div>
        </div>
      </div>

      {/* Recent Stock Movements */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">{TEXT.movementsTitle}</h2>
          <button className="text-xs font-medium text-brand-500 hover:underline">{TEXT.viewAll}</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                {['Type', 'SKU', 'Product', 'Quantity', 'Warehouse', 'Reason', 'Time'].map((h) => (
                  <th key={h} className={cn('px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500', h === 'Quantity' ? 'text-right' : '')}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockMovements.map((m, i) => (
                <tr key={i} className="transition-colors hover:bg-brand-50/40">
                  <td className="px-6 py-3"><span className={cn('inline-flex items-center rounded px-2 py-0.5 text-xs font-medium', MOVEMENT_BADGE[m.type])}>{m.type}</span></td>
                  <td className="px-6 py-3 font-mono text-xs text-gray-500">{m.sku}</td>
                  <td className="px-6 py-3 text-gray-900">{m.product}</td>
                  <td className={cn('px-6 py-3 text-right font-medium', m.quantity > 0 ? 'text-green-600' : m.type === 'TRANSFER' ? 'text-blue-600' : 'text-red-600')}>
                    {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                  </td>
                  <td className="px-6 py-3 text-gray-500">{m.warehouse}</td>
                  <td className="px-6 py-3 text-gray-500">{m.reason}</td>
                  <td className="px-6 py-3 text-gray-400">{m.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
