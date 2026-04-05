'use client';

import { useState } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Button, Input, Badge,
} from '@homebase/ui';
import { StatCard, StatusBadge } from '@homebase/ui';
import {
  Package, CheckCircle2, AlertTriangle, XCircle,
  Download, Upload, Search, Pencil, ArrowUpDown,
} from 'lucide-react';

const inventoryItems = [
  {
    name: 'Wireless Bluetooth Speaker', sku: 'SKU-BT-4521', category: 'Electronics',
    stock: 156, lowAlert: 20, binRef: 'WH-A3-R12', status: 'In Stock', updated: '28 Mar 2026',
  },
  {
    name: 'Cotton Kurta Set (M)', sku: 'SKU-KT-3198', category: 'Fashion',
    stock: 89, lowAlert: 15, binRef: 'WH-B1-R05', status: 'In Stock', updated: '28 Mar 2026',
  },
  {
    name: 'Stainless Steel Water Bottle', sku: 'SKU-WB-2074', category: 'Home & Kitchen',
    stock: 234, lowAlert: 30, binRef: 'WH-A1-R08', status: 'In Stock', updated: '27 Mar 2026',
  },
  {
    name: 'Organic Face Cream', sku: 'SKU-FC-6632', category: 'Beauty',
    stock: 12, lowAlert: 25, binRef: 'WH-C2-R03', status: 'Low Stock', updated: '27 Mar 2026',
  },
  {
    name: 'Running Shoes (42)', sku: 'SKU-RS-4410', category: 'Sports',
    stock: 8, lowAlert: 15, binRef: 'WH-D1-R11', status: 'Low Stock', updated: '26 Mar 2026',
  },
  {
    name: 'Silk Saree (Blue)', sku: 'SKU-SS-7751', category: 'Fashion',
    stock: 0, lowAlert: 5, binRef: 'WH-B2-R09', status: 'Out of Stock', updated: '25 Mar 2026',
  },
  {
    name: 'Smart Watch Pro', sku: 'SKU-SW-1198', category: 'Electronics',
    stock: 0, lowAlert: 10, binRef: 'WH-A2-R06', status: 'Out of Stock', updated: '24 Mar 2026',
  },
  {
    name: 'Ceramic Dinner Set', sku: 'SKU-CD-5520', category: 'Home & Kitchen',
    stock: 45, lowAlert: 10, binRef: 'WH-C1-R02', status: 'In Stock', updated: '28 Mar 2026',
  },
];

const stockMovements = [
  { date: '28 Mar', type: 'Restock', sku: 'SKU-BT-4521', qty: '+50', product: 'Wireless Bluetooth Speaker' },
  { date: '27 Mar', type: 'Sold', sku: 'SKU-KT-3198', qty: '-3', product: 'Cotton Kurta Set (M)' },
  { date: '27 Mar', type: 'Returned', sku: 'SKU-RS-4410', qty: '+1', product: 'Running Shoes (42)' },
  { date: '26 Mar', type: 'Sold', sku: 'SKU-WB-2074', qty: '-12', product: 'Stainless Steel Water Bottle' },
  { date: '25 Mar', type: 'Adjustment', sku: 'SKU-SS-7751', qty: '-2', product: 'Silk Saree (Blue)' },
];

function stockStatusVariant(status: string) {
  if (status === 'In Stock') return 'success' as const;
  if (status === 'Low Stock') return 'warning' as const;
  return 'error' as const;
}

export function SellerInventoryList() {
  const [search, setSearch] = useState('');
  const filtered = inventoryItems.filter(
    (i) => i.name.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-sm text-gray-400 mt-1">Track and manage stock levels across all your products</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-1.5">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-1.5 bg-orange-500 hover:bg-orange-600">
            <Upload className="h-4 w-4" />
            Bulk Update
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total SKUs" value={89}
          icon={<Package className="h-5 w-5 text-blue-500" />}
          progressBar={100} progressColor="bg-blue-500"
        />
        <StatCard
          title="In Stock" value={72}
          icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
          trend={81} trendDirection="up" trendIsPositive
          progressBar={81} progressColor="bg-green-500"
        />
        <StatCard
          title="Low Stock" value={12}
          icon={<AlertTriangle className="h-5 w-5 text-orange-500" />}
          progressBar={13} progressColor="bg-orange-500"
          className="border-orange-100"
        />
        <StatCard
          title="Out of Stock" value={5}
          icon={<XCircle className="h-5 w-5 text-red-500" />}
          progressBar={6} progressColor="bg-red-500"
          className="border-red-100"
        />
      </div>

      {/* Alert Banner */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-red-800">
              <span className="font-bold">5 products</span> are out of stock and <span className="font-bold">12 products</span> are running low
            </p>
            <p className="text-xs text-red-600 mt-0.5">Restock immediately to avoid order cancellations and lost revenue</p>
          </div>
        </div>
        <button className="flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700 transition shrink-0 ml-4">
          View All
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        </button>
      </div>

      {/* Search + Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by product name, SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
              />
            </div>
            <select className="bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 text-sm text-gray-600 outline-none min-w-[160px]">
              <option>All Categories</option>
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Home &amp; Kitchen</option>
              <option>Beauty</option>
              <option>Sports</option>
            </select>
            <select className="bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 text-sm text-gray-600 outline-none min-w-[150px]">
              <option>All Status</option>
              <option>In Stock</option>
              <option>Low Stock</option>
              <option>Out of Stock</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Inventory List</CardTitle>
              <p className="text-xs text-gray-400 mt-0.5">Showing {filtered.length} of 89 products</p>
            </div>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80">
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider">Product</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider">SKU</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider">Category</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-center">Current Stock</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-center">Low Stock Alert</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider">Bin Ref</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-center">Status</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider">Last Updated</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow
                  key={item.sku}
                  className={`transition-colors ${
                    item.status === 'Out of Stock'
                      ? 'bg-red-50/50 hover:bg-red-50'
                      : 'hover:bg-orange-50/50'
                  }`}
                >
                  <TableCell>
                    <span className="text-sm font-medium text-gray-800">{item.name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-mono text-gray-500">{item.sku}</span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{item.category}</TableCell>
                  <TableCell className="text-center">
                    <span className={`text-sm font-semibold ${
                      item.stock === 0 ? 'text-red-600' : item.stock <= item.lowAlert ? 'text-orange-600' : 'text-gray-900'
                    }`}>
                      {item.stock}
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-sm text-gray-500">{item.lowAlert}</TableCell>
                  <TableCell>
                    <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{item.binRef}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={item.status} variant={stockStatusVariant(item.status)} />
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">{item.updated}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="text-xs font-medium text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition border border-orange-100">
                        Restock
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Stock Movement History */}
      <Card>
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Stock Movement History</CardTitle>
              <p className="text-xs text-gray-400 mt-0.5">Recent stock changes across your inventory</p>
            </div>
            <button className="text-xs font-medium text-orange-600 hover:text-orange-700">View All</button>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80">
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider">Date</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider">Type</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider">SKU</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider">Product</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-right">Qty Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockMovements.map((m, i) => (
                <TableRow key={i} className="hover:bg-orange-50/50 transition-colors">
                  <TableCell className="text-sm text-gray-500">{m.date}</TableCell>
                  <TableCell>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      m.type === 'Restock' ? 'bg-green-50 text-green-700' :
                      m.type === 'Sold' ? 'bg-blue-50 text-blue-700' :
                      m.type === 'Returned' ? 'bg-purple-50 text-purple-700' :
                      'bg-gray-50 text-gray-700'
                    }`}>
                      {m.type}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-gray-500">{m.sku}</TableCell>
                  <TableCell className="text-sm text-gray-700">{m.product}</TableCell>
                  <TableCell className="text-right">
                    <span className={`text-sm font-semibold ${m.qty.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {m.qty}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
