'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FileUploadZone,
  StatusBadge,
} from '@homebase/ui';
import {
  Info,
  Image as ImageIcon,
  IndianRupee,
  Package,
  Layers,
  Globe,
  Save,
  Upload,
  ChevronRight,
  Plus,
  X,
  Trash2,
  GripVertical,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Mock Variant Data                                                  */
/* ------------------------------------------------------------------ */

const initialVariants = [
  { id: 1, name: 'Black / 64GB', sku: 'WBH-001-BLK-64', price: 3499, stock: 25 },
  { id: 2, name: 'White / 64GB', sku: 'WBH-001-WHT-64', price: 3499, stock: 18 },
  { id: 3, name: 'Black / 128GB', sku: 'WBH-001-BLK-128', price: 4499, stock: 12 },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function SellerProductCreate() {
  const [variants, setVariants] = useState(initialVariants);
  const [mrp, setMrp] = useState('1999');
  const [sellingPrice, setSellingPrice] = useState('1299');
  const [tags, setTags] = useState(['wireless', 'bluetooth', 'headphones']);
  const [tagInput, setTagInput] = useState('');

  const discount = mrp && sellingPrice
    ? Math.round(((Number(mrp) - Number(sellingPrice)) / Number(mrp)) * 100)
    : 0;

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const removeVariant = (id: number) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const addVariant = () => {
    const nextId = Math.max(0, ...variants.map((v) => v.id)) + 1;
    setVariants([...variants, { id: nextId, name: '', sku: '', price: 0, stock: 0 }]);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm">
        <Link href="/products" className="text-gray-400 transition hover:text-brand-500">Products</Link>
        <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
        <span className="font-medium text-gray-700">Add New Product</span>
      </nav>

      {/* Page Title Row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="mt-1 text-sm text-gray-400">Fill in the details below to list a new product on your store</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50">
            <Save className="h-4 w-4" />
            Save as Draft
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600">
            <Upload className="h-4 w-4" />
            Publish
          </button>
        </div>
      </div>

      {/* Form Content (Two-column layout) */}
      <div className="flex gap-6">
        {/* LEFT COLUMN */}
        <div className="min-w-0 flex-1 space-y-6">

          {/* Basic Information */}
          <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50">
                  <Info className="h-4 w-4 text-brand-500" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Basic Information</h2>
                  <p className="mt-0.5 text-xs text-gray-400">Product name, brand, category, and descriptions</p>
                </div>
              </div>
            </div>
            <div className="space-y-5 px-6 py-5">
              {/* Product Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Product Name <span className="ml-0.5 text-red-600">*</span>
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  placeholder="e.g., Sony WH-1000XM5 Wireless Noise Cancelling Headphones"
                />
                <p className="mt-1.5 text-xs text-gray-400">Use a clear, descriptive name that customers would search for</p>
              </div>

              {/* Brand + Category Row */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Brand <span className="ml-0.5 text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                    placeholder="e.g., Sony, Samsung, Nike"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Category <span className="ml-0.5 text-red-600">*</span>
                  </label>
                  <select className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 pr-10 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100">
                    <option value="">Select category</option>
                    <optgroup label="Electronics">
                      <option value="headphones">Electronics &gt; Headphones</option>
                      <option value="speakers">Electronics &gt; Speakers</option>
                      <option value="mobiles">Electronics &gt; Mobile Phones</option>
                    </optgroup>
                    <optgroup label="Fashion">
                      <option value="men-clothing">Fashion &gt; Men&apos;s Clothing</option>
                      <option value="women-clothing">Fashion &gt; Women&apos;s Clothing</option>
                    </optgroup>
                    <optgroup label="Home & Kitchen">
                      <option value="kitchen">Home &gt; Kitchen</option>
                      <option value="decor">Home &gt; Decor</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Short Description <span className="ml-0.5 text-red-600">*</span>
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  placeholder="Brief product description for search results and listings..."
                />
                <p className="mt-1.5 text-xs text-gray-400">Max 200 characters. Shown in search results.</p>
              </div>

              {/* Detailed Description */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Detailed Description</label>
                <textarea
                  rows={5}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  placeholder="Detailed product description with features, specifications, and benefits..."
                />
              </div>
            </div>
          </section>

          {/* Media Upload */}
          <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                  <ImageIcon className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Product Media</h2>
                  <p className="mt-0.5 text-xs text-gray-400">Upload product images. First image will be the main display image.</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-5">
              <FileUploadZone
                accept="image/*"
                maxSize="Max 5MB per image, up to 8 images"
              />
              <p className="mt-3 text-xs text-gray-400">
                Recommended: 1000x1000px, JPEG or PNG. White background preferred.
              </p>
            </div>
          </section>

          {/* Pricing */}
          <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
                  <IndianRupee className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Pricing</h2>
                  <p className="mt-0.5 text-xs text-gray-400">Set your product pricing and offers</p>
                </div>
              </div>
            </div>
            <div className="space-y-5 px-6 py-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    MRP <span className="ml-0.5 text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">{'\u20B9'}</span>
                    <input
                      type="number"
                      value={mrp}
                      onChange={(e) => setMrp(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-8 pr-3.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                      placeholder="1999"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Selling Price <span className="ml-0.5 text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">{'\u20B9'}</span>
                    <input
                      type="number"
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-8 pr-3.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                      placeholder="1299"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Discount</label>
                  <div className="flex h-[42px] items-center rounded-lg border border-gray-200 bg-gray-50 px-3.5">
                    <span className="text-sm font-semibold text-green-600">{discount}% off</span>
                  </div>
                  <p className="mt-1.5 text-xs text-gray-400">Auto-calculated from MRP &amp; selling price</p>
                </div>
              </div>

              {/* HSN Code */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">HSN Code</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                    placeholder="e.g., 8518"
                  />
                  <p className="mt-1.5 text-xs text-gray-400">Required for GST compliance</p>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">GST Rate</label>
                  <select className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100">
                    <option>Select GST rate</option>
                    <option>0% (Exempt)</option>
                    <option>5%</option>
                    <option>12%</option>
                    <option value="18" selected>18%</option>
                    <option>28%</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Inventory */}
          <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50">
                  <Package className="h-4 w-4 text-purple-500" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Inventory</h2>
                  <p className="mt-0.5 text-xs text-gray-400">Stock, SKU, weight and dimensions</p>
                </div>
              </div>
            </div>
            <div className="space-y-5 px-6 py-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    SKU <span className="ml-0.5 text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                    placeholder="e.g., WBH-001"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Stock Quantity <span className="ml-0.5 text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Weight (g)</label>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                    placeholder="250"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Length (cm)</label>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                    placeholder="20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Width (cm)</label>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                    placeholder="15"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Height (cm)</label>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                    placeholder="8"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Variants */}
          <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50">
                    <Layers className="h-4 w-4 text-orange-500" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">Variants</h2>
                    <p className="mt-0.5 text-xs text-gray-400">Add different sizes, colors, or configurations</p>
                  </div>
                </div>
                <button
                  onClick={addVariant}
                  className="flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-600 transition hover:bg-brand-100"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Variant
                </button>
              </div>
            </div>
            <div className="px-6 py-5">
              {variants.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="pb-2 pr-4 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Variant Name</th>
                        <th className="pb-2 pr-4 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">SKU</th>
                        <th className="pb-2 pr-4 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500">Price</th>
                        <th className="pb-2 pr-4 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500">Stock</th>
                        <th className="pb-2 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {variants.map((variant) => (
                        <tr key={variant.id}>
                          <td className="py-3 pr-4">
                            <input
                              type="text"
                              defaultValue={variant.name}
                              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-400 focus:ring-1 focus:ring-brand-100"
                              placeholder="e.g., Black / 64GB"
                            />
                          </td>
                          <td className="py-3 pr-4">
                            <input
                              type="text"
                              defaultValue={variant.sku}
                              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 font-mono text-sm outline-none transition focus:border-brand-400 focus:ring-1 focus:ring-brand-100"
                              placeholder="e.g., WBH-001-BLK"
                            />
                          </td>
                          <td className="py-3 pr-4">
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">{'\u20B9'}</span>
                              <input
                                type="number"
                                defaultValue={variant.price}
                                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-7 pr-3 text-right text-sm outline-none transition focus:border-brand-400 focus:ring-1 focus:ring-brand-100"
                              />
                            </div>
                          </td>
                          <td className="py-3 pr-4">
                            <input
                              type="number"
                              defaultValue={variant.stock}
                              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-right text-sm outline-none transition focus:border-brand-400 focus:ring-1 focus:ring-brand-100"
                            />
                          </td>
                          <td className="py-3 text-center">
                            <button
                              onClick={() => removeVariant(variant.id)}
                              className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="py-4 text-center text-sm text-gray-400">
                  No variants added. Click &quot;Add Variant&quot; to create size/color options.
                </p>
              )}
            </div>
          </section>

          {/* SEO */}
          <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50">
                  <Globe className="h-4 w-4 text-teal-500" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">SEO</h2>
                  <p className="mt-0.5 text-xs text-gray-400">Optimize for search engines</p>
                </div>
              </div>
            </div>
            <div className="space-y-5 px-6 py-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">SEO Title</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  placeholder="Page title for search engines (max 60 characters)"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Meta Description</label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  placeholder="Meta description for search results (max 160 characters)"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Tags</label>
                <div className="flex flex-wrap gap-2 rounded-lg border border-gray-200 bg-white p-2.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700"
                    >
                      {tag}
                      <button onClick={() => removeTag(tag)} className="text-brand-400 hover:text-brand-600">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                    className="min-w-[100px] flex-1 border-none bg-transparent text-sm outline-none placeholder:text-gray-400"
                    placeholder="Add a tag..."
                  />
                </div>
                <p className="mt-1.5 text-xs text-gray-400">Press Enter to add a tag</p>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN - Sidebar Summary */}
        <div className="hidden w-80 shrink-0 lg:block">
          <div className="sticky top-6 space-y-5">
            {/* Product Status */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-gray-900">Product Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Visibility</span>
                  <StatusBadge status="Draft" variant="neutral" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Publish Date</span>
                  <span className="font-medium text-gray-700">Immediate</span>
                </div>
              </div>
            </div>

            {/* Product Organization */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-gray-900">Organization</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-500">Product Type</label>
                  <select className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-brand-400 focus:ring-1 focus:ring-brand-100">
                    <option>Physical Product</option>
                    <option>Digital Product</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-500">Vendor</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-brand-400 focus:ring-1 focus:ring-brand-100"
                    placeholder="Rajesh Store"
                    defaultValue="Rajesh Store"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-500">Collections</label>
                  <select className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-brand-400 focus:ring-1 focus:ring-brand-100">
                    <option>Select collection</option>
                    <option>New Arrivals</option>
                    <option>Best Sellers</option>
                    <option>Summer Collection</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-gray-900">Listing Checklist</h3>
              <div className="space-y-2.5">
                {[
                  { label: 'Product name', done: false },
                  { label: 'At least 3 images', done: false },
                  { label: 'Pricing set', done: true },
                  { label: 'SKU & inventory', done: false },
                  { label: 'Category selected', done: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5 text-sm">
                    <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                      item.done ? 'bg-green-100 text-green-600' : 'border border-gray-300 text-transparent'
                    }`}>
                      {item.done && (
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={item.done ? 'text-gray-500 line-through' : 'text-gray-700'}>{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full rounded-full bg-brand-500" style={{ width: '20%' }} />
              </div>
              <p className="mt-2 text-xs text-gray-400">1 of 5 completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar (mobile-friendly) */}
      <div className="fixed bottom-0 left-60 right-0 z-30 border-t border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/products" className="text-sm font-medium text-gray-500 transition hover:text-gray-700">
            Cancel
          </Link>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50">
              <Save className="h-4 w-4" />
              Save Draft
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600">
              <Upload className="h-4 w-4" />
              Publish Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
