'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  StatCard,
  StatusBadge,
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
} from '@homebase/ui';
import {
  Package,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Star,
  ExternalLink,
  PowerOff,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const products = [
  { id: 1, name: 'Wireless Bluetooth Speaker', sku: 'WBS-001', category: 'Electronics', price: 3499, stock: 45, status: 'Active', rating: 4.5, image: '/placeholder.jpg' },
  { id: 2, name: 'Cotton Kurta Set - Blue', sku: 'CKS-042', category: 'Fashion', price: 1899, stock: 128, status: 'Active', rating: 4.3, image: '/placeholder.jpg' },
  { id: 3, name: 'Organic Face Cream 50ml', sku: 'OFC-015', category: 'Health & Beauty', price: 649, stock: 0, status: 'Out of Stock', rating: 4.7, image: '/placeholder.jpg' },
  { id: 4, name: 'Stainless Steel Water Bottle', sku: 'SSB-008', category: 'Home & Kitchen', price: 799, stock: 234, status: 'Active', rating: 4.2, image: '/placeholder.jpg' },
  { id: 5, name: 'Running Shoes Pro - Black', sku: 'RSP-023', category: 'Sports', price: 4299, stock: 67, status: 'Active', rating: 4.8, image: '/placeholder.jpg' },
  { id: 6, name: 'Yoga Mat Premium 6mm', sku: 'YMP-011', category: 'Sports', price: 1299, stock: 3, status: 'Active', rating: 4.4, image: '/placeholder.jpg' },
  { id: 7, name: 'LED Desk Lamp Adjustable', sku: 'LDL-007', category: 'Electronics', price: 1999, stock: 0, status: 'Out of Stock', rating: 4.1, image: '/placeholder.jpg' },
  { id: 8, name: 'Bamboo Cutting Board Set', sku: 'BCB-019', category: 'Home & Kitchen', price: 899, stock: 89, status: 'Inactive', rating: 4.0, image: '/placeholder.jpg' },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function SellerProductList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const [viewProduct, setViewProduct] = useState<typeof products[number] | null>(null);

  const allSelected = selectedRows.length === products.length;

  const toggleAll = () => {
    setSelectedRows(allSelected ? [] : products.map((p) => p.id));
  };

  const toggleRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-0.5 text-sm text-gray-400">Manage your product catalog</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50">
            <Upload className="h-4 w-4" />
            Import
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50">
            <Download className="h-4 w-4" />
            Export
          </button>
          <Link
            href="/products/new"
            className="flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-600"
          >
            <Plus className="h-4 w-4" />
            Add New Product
          </Link>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value="89"
          icon={<Package className="h-5 w-5 text-blue-500" />}
          progressBar={100}
          progressColor="bg-blue-500"
        />
        <StatCard
          title="Active Products"
          value="72"
          icon={<CheckCircle className="h-5 w-5 text-green-600" />}
          trend={80.9}
          trendDirection="up"
          progressBar={80.9}
          progressColor="bg-green-600"
        />
        <StatCard
          title="Inactive Products"
          value="12"
          icon={<XCircle className="h-5 w-5 text-gray-400" />}
          progressBar={13.5}
          progressColor="bg-gray-400"
        />
        <StatCard
          title="Out of Stock"
          value="5"
          icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
          progressBar={5.6}
          progressColor="bg-red-600"
        />
      </div>

      {/* Search & Filters Bar */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center gap-4 p-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name, SKU, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </div>
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="min-w-[140px] cursor-pointer appearance-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          >
            <option>All Categories</option>
            <option>Electronics</option>
            <option>Fashion</option>
            <option>Home & Kitchen</option>
            <option>Health & Beauty</option>
            <option>Sports</option>
          </select>
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="min-w-[130px] cursor-pointer appearance-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Out of Stock</option>
          </select>
          {/* Filter Button */}
          <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="px-5 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                  />
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Product</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">SKU</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Category</th>
                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500">Price</th>
                <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-500">Stock</th>
                <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-500">Rating</th>
                <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <tr key={product.id} className="transition-colors hover:bg-brand-50/50">
                  <td className="px-5 py-3.5">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(product.id)}
                      onChange={() => toggleRow(product.id)}
                      className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                    />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                        <Package className="h-5 w-5 text-gray-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-sm text-gray-500">{product.sku}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-gray-600">{product.category}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="text-sm font-semibold text-gray-900">{'\u20B9'}{product.price.toLocaleString('en-IN')}</span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`text-sm font-medium ${product.stock === 0 ? 'text-red-600' : product.stock < 10 ? 'text-orange-600' : 'text-gray-900'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <StatusBadge
                      status={product.status}
                      variant={product.status === 'Active' ? 'success' : product.status === 'Out of Stock' ? 'error' : 'neutral'}
                    />
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <div className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setViewProduct(product)} className="rounded-lg p-1.5 text-gray-400 transition hover:bg-brand-50 hover:text-brand-500" title="View">
                        <Eye className="h-4 w-4" />
                      </button>
                      <Link href={`/products/${product.id}`} className="rounded-lg p-1.5 text-gray-400 transition hover:bg-blue-50 hover:text-blue-500" title="Edit">
                        <Edit className="h-4 w-4" />
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600" title="More actions">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => alert(`Edit product: ${product.name}`)}>
                            <Edit className="mr-2 h-4 w-4 text-gray-400" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => alert(`Deactivate product: ${product.name}`)}>
                            <PowerOff className="mr-2 h-4 w-4 text-gray-400" /> Deactivate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => alert(`View on Store: ${product.name}`)}>
                            <ExternalLink className="mr-2 h-4 w-4 text-gray-400" /> View on Store
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => alert(`Delete product: ${product.name}`)} className="text-red-600 focus:text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
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

        {/* Bulk Actions Bar */}
        {selectedRows.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-100 bg-brand-50 px-5 py-3">
            <span className="text-sm font-medium text-brand-700">{selectedRows.length} product(s) selected</span>
            <div className="flex items-center gap-2">
              <button className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50">
                Set Active
              </button>
              <button className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50">
                Set Inactive
              </button>
              <button className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50">
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3.5">
          <p className="text-sm text-gray-500">Showing 1-8 of 89 products</p>
          <div className="flex items-center gap-1">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition hover:bg-gray-50">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-sm font-medium text-white">1</button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-sm font-medium text-gray-600 transition hover:bg-gray-50">2</button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-sm font-medium text-gray-600 transition hover:bg-gray-50">3</button>
            <span className="px-1 text-gray-400">...</span>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-sm font-medium text-gray-600 transition hover:bg-gray-50">12</button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition hover:bg-gray-50">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* View Product Details Dialog */}
      <Dialog open={!!viewProduct} onOpenChange={(open) => { if (!open) setViewProduct(null); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>Full details for {viewProduct?.name}</DialogDescription>
          </DialogHeader>
          {viewProduct && (
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="col-span-2 space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Product Name</p>
                <p className="text-sm font-medium text-gray-900">{viewProduct.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">SKU</p>
                <p className="inline-block rounded bg-gray-100 px-2 py-0.5 font-mono text-sm font-semibold text-gray-800">{viewProduct.sku}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Status</p>
                <StatusBadge
                  status={viewProduct.status}
                  variant={viewProduct.status === 'Active' ? 'success' : viewProduct.status === 'Out of Stock' ? 'error' : 'neutral'}
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Category</p>
                <p className="text-sm text-gray-700">{viewProduct.category}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Price</p>
                <p className="text-sm font-bold text-gray-900">{'\u20B9'}{viewProduct.price.toLocaleString('en-IN')}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Stock</p>
                <p className={`text-sm font-medium ${viewProduct.stock === 0 ? 'text-red-600' : viewProduct.stock < 10 ? 'text-orange-600' : 'text-gray-900'}`}>{viewProduct.stock} units</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Rating</p>
                <div className="inline-flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-700">{viewProduct.rating}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
