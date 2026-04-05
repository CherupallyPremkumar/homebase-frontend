'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Tag, Filter, Search, Layers, Grid3X3,
  Download, Plus, Edit, Trash2, Check, Minus,
} from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';
import { Skeleton } from '@homebase/ui';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

interface AttributeRow {
  code: string;
  label: string;
  inputType: string;
  inputTypeBadge: string;
  required: boolean;
  filterable: boolean;
  searchable: boolean;
  variations: boolean;
  products: number;
}

interface AttributeSet {
  name: string;
  basedOn: string;
  attributes: number;
  products: number;
  categories: string[];
}

interface CategoryMapping {
  category: string;
  required: string[];
  optional: string[];
  products: number;
}

// ----------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------

const mockAttributes: AttributeRow[] = [
  { code: 'color', label: 'Color', inputType: 'Color Swatch', inputTypeBadge: 'bg-orange-100 text-orange-700', required: true, filterable: true, searchable: true, variations: true, products: 892 },
  { code: 'size', label: 'Size', inputType: 'Dropdown', inputTypeBadge: 'bg-blue-100 text-blue-700', required: true, filterable: true, searchable: true, variations: true, products: 756 },
  { code: 'material', label: 'Material', inputType: 'Dropdown', inputTypeBadge: 'bg-blue-100 text-blue-700', required: false, filterable: true, searchable: true, variations: false, products: 634 },
  { code: 'brand', label: 'Brand', inputType: 'Dropdown', inputTypeBadge: 'bg-blue-100 text-blue-700', required: true, filterable: true, searchable: true, variations: false, products: 912 },
  { code: 'weight_kg', label: 'Weight (kg)', inputType: 'Number', inputTypeBadge: 'bg-purple-100 text-purple-700', required: true, filterable: false, searchable: false, variations: false, products: 890 },
  { code: 'wattage', label: 'Wattage', inputType: 'Number', inputTypeBadge: 'bg-purple-100 text-purple-700', required: false, filterable: true, searchable: true, variations: true, products: 312 },
  { code: 'voltage', label: 'Voltage', inputType: 'Dropdown', inputTypeBadge: 'bg-blue-100 text-blue-700', required: false, filterable: true, searchable: false, variations: true, products: 456 },
  { code: 'finish', label: 'Finish', inputType: 'Dropdown', inputTypeBadge: 'bg-blue-100 text-blue-700', required: false, filterable: true, searchable: false, variations: true, products: 345 },
  { code: 'warranty_years', label: 'Warranty (Years)', inputType: 'Number', inputTypeBadge: 'bg-purple-100 text-purple-700', required: false, filterable: false, searchable: false, variations: false, products: 678 },
  { code: 'pack_quantity', label: 'Pack Quantity', inputType: 'Number', inputTypeBadge: 'bg-purple-100 text-purple-700', required: false, filterable: true, searchable: false, variations: true, products: 234 },
  { code: 'is_returnable', label: 'Returnable', inputType: 'Boolean', inputTypeBadge: 'bg-green-100 text-green-700', required: true, filterable: false, searchable: false, variations: false, products: 912 },
  { code: 'country_origin', label: 'Country of Origin', inputType: 'Dropdown', inputTypeBadge: 'bg-blue-100 text-blue-700', required: true, filterable: true, searchable: false, variations: false, products: 912 },
  { code: 'capacity_litres', label: 'Capacity (L)', inputType: 'Number', inputTypeBadge: 'bg-purple-100 text-purple-700', required: false, filterable: true, searchable: false, variations: true, products: 123 },
  { code: 'energy_rating', label: 'Energy Rating', inputType: 'Dropdown', inputTypeBadge: 'bg-blue-100 text-blue-700', required: false, filterable: true, searchable: true, variations: false, products: 267 },
];

const mockSets: AttributeSet[] = [
  { name: 'Default', basedOn: '\u2014', attributes: 24, products: 5234, categories: ['All Categories'] },
  { name: 'Apparel', basedOn: 'Default', attributes: 32, products: 1890, categories: ['Clothing', 'Footwear', 'Accessories'] },
  { name: 'Electronics', basedOn: 'Default', attributes: 28, products: 2456, categories: ['Electronics', 'Gadgets'] },
  { name: 'Home & Kitchen', basedOn: 'Default', attributes: 26, products: 891, categories: ['Home', 'Kitchen', 'Furniture'] },
  { name: 'Power Tools', basedOn: 'Electronics', attributes: 30, products: 345, categories: ['Tools', 'Hardware'] },
  { name: 'Paints & Coatings', basedOn: 'Default', attributes: 22, products: 567, categories: ['Paints', 'Wall Care'] },
];

const mockMappings: CategoryMapping[] = [
  { category: 'Electronics', required: ['brand', 'voltage', 'wattage', 'weight_kg', 'country_origin'], optional: ['color', 'finish', 'warranty_years', 'energy_rating'], products: 2456 },
  { category: 'Apparel', required: ['brand', 'color', 'size', 'material', 'country_origin'], optional: ['finish', 'pack_quantity'], products: 1890 },
  { category: 'Home & Kitchen', required: ['brand', 'weight_kg', 'material', 'country_origin'], optional: ['color', 'finish', 'capacity_litres'], products: 891 },
  { category: 'Power Tools', required: ['brand', 'voltage', 'wattage', 'weight_kg', 'warranty_years'], optional: ['color', 'finish'], products: 345 },
  { category: 'Paints & Coatings', required: ['brand', 'finish', 'capacity_litres', 'country_origin'], optional: ['color', 'weight_kg'], products: 567 },
  { category: 'Grocery', required: ['brand', 'weight_kg', 'pack_quantity', 'country_origin'], optional: ['is_returnable'], products: 3210 },
];

// ----------------------------------------------------------------
// Text constants
// ----------------------------------------------------------------

const TEXT = {
  title: 'Product Attributes',
  subtitle: 'Define product properties for search, filters, and variations',
  export: 'Export',
  addAttribute: 'Add Attribute',
  createSet: 'Create Attribute Set',
} as const;

const TABS = [
  { key: 'attributes', label: 'Attributes', count: '48' },
  { key: 'sets', label: 'Attribute Sets', count: '6' },
  { key: 'mapping', label: 'Category Mapping', count: '6' },
] as const;

const STATS = [
  { label: 'Total Attributes', value: '48', subtitle: 'Defined across all categories', iconBg: 'bg-gray-50', iconColor: 'text-gray-500', icon: Tag },
  { label: 'Filterable', value: '12', subtitle: 'Available in storefront filters', iconBg: 'bg-blue-50', iconColor: 'text-blue-600', valueColor: 'text-blue-600', subtitleColor: 'text-blue-600', icon: Filter },
  { label: 'Searchable', value: '18', subtitle: 'Indexed for product search', iconBg: 'bg-green-50', iconColor: 'text-green-600', valueColor: 'text-green-600', subtitleColor: 'text-green-600', icon: Search },
  { label: 'Used in Variations', value: '8', subtitle: 'Create configurable products', iconBg: 'bg-purple-50', iconColor: 'text-purple-600', valueColor: 'text-purple-600', subtitleColor: 'text-purple-600', icon: Grid3X3 },
];

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

function BoolIcon({ value }: { value: boolean }) {
  return value
    ? <Check className="mx-auto h-5 w-5 text-green-500" />
    : <Minus className="mx-auto h-4 w-4 text-gray-300" />;
}

// ----------------------------------------------------------------
// Component
// ----------------------------------------------------------------

export function ProductAttributes() {
  const [activeTab, setActiveTab] = useState(0);
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredAttrs = mockAttributes.filter((a) => {
    if (typeFilter !== 'all' && a.inputType.toLowerCase().replace(/ /g, '-') !== typeFilter) return false;
    if (search && !a.label.toLowerCase().includes(search.toLowerCase()) && !a.code.includes(search.toLowerCase())) return false;
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
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50">
            <Download className="h-4 w-4" />{TEXT.export}
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-600">
            <Plus className="h-4 w-4" />{TEXT.addAttribute}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* Tabs Card */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="px-6 pt-5 pb-0">
          <nav className="-mb-px flex items-center gap-0 border-b border-gray-200">
            {TABS.map((tab, i) => (
              <button key={tab.key} onClick={() => setActiveTab(i)} className={cn('border-b-2 px-4 pb-3 text-sm font-medium transition', activeTab === i ? 'border-brand-500 font-semibold text-brand-500' : 'border-transparent text-gray-500 hover:text-gray-700')}>
                {tab.label} <span className="ml-1 rounded-full bg-gray-100 px-1.5 py-0.5 text-[11px] font-bold text-gray-600">{tab.count}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab: Attributes */}
        {activeTab === 0 && (
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 outline-none focus:border-brand-400">
                <option value="all">All Input Types</option>
                <option value="dropdown">Dropdown</option>
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="color-swatch">Color Swatch</option>
                <option value="boolean">Boolean</option>
                <option value="multi-select">Multi-select</option>
              </select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} type="search" placeholder="Search attributes..." className="w-56 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    {['Code', 'Label', 'Input Type', 'Required', 'Filterable', 'Searchable', 'Variations', 'Products', 'Actions'].map((h) => (
                      <th key={h} className={cn('px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500', ['Required', 'Filterable', 'Searchable', 'Variations'].includes(h) ? 'text-center' : h === 'Products' ? 'text-right' : '')}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAttrs.map((a) => (
                    <tr key={a.code} className="transition-colors hover:bg-brand-50/40">
                      <td className="px-6 py-4"><code className="rounded bg-gray-100 px-2 py-1 font-mono text-xs text-gray-700">{a.code}</code></td>
                      <td className="px-6 py-4 font-medium text-gray-900">{a.label}</td>
                      <td className="px-6 py-4"><span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', a.inputTypeBadge)}>{a.inputType}</span></td>
                      <td className="px-6 py-4 text-center"><BoolIcon value={a.required} /></td>
                      <td className="px-6 py-4 text-center"><BoolIcon value={a.filterable} /></td>
                      <td className="px-6 py-4 text-center"><BoolIcon value={a.searchable} /></td>
                      <td className="px-6 py-4 text-center"><BoolIcon value={a.variations} /></td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900">{a.products.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="rounded p-1 text-gray-400 transition hover:text-brand-500" title="Edit"><Edit className="h-4 w-4" /></button>
                          <button className="rounded p-1 text-gray-400 transition hover:text-red-500" title="Delete"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
              <p className="text-xs text-gray-400">Showing 1-{filteredAttrs.length} of {filteredAttrs.length} attributes</p>
              <div className="flex items-center gap-1">
                <button className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-400">Previous</button>
                <button className="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white">1</button>
                <button className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100">Next</button>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Attribute Sets */}
        {activeTab === 1 && (
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <p className="text-sm text-gray-500">Group attributes into sets assigned to product categories</p>
              <button className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-600">
                <Plus className="h-4 w-4" />{TEXT.createSet}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    {['Set Name', 'Based On', 'Attributes', 'Products', 'Categories', 'Actions'].map((h) => (
                      <th key={h} className={cn('px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500', ['Attributes', 'Products'].includes(h) ? 'text-right' : '')}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockSets.map((s) => (
                    <tr key={s.name} className="transition-colors hover:bg-brand-50/40">
                      <td className="px-6 py-4 font-medium text-gray-900">{s.name}</td>
                      <td className="px-6 py-4 text-gray-500">{s.basedOn}</td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900">{s.attributes}</td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900">{s.products.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {s.categories.map((c) => (
                            <span key={c} className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">{c}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button className="rounded p-1 text-gray-400 transition hover:text-brand-500" title="Edit"><Edit className="h-4 w-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
              <p className="text-xs text-gray-400">Showing 1-6 of 6 attribute sets</p>
              <div className="flex items-center gap-1">
                <button className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-400">Previous</button>
                <button className="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white">1</button>
                <button className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-400">Next</button>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Category Mapping */}
        {activeTab === 2 && (
          <div>
            <div className="border-b border-gray-100 px-6 py-4">
              <p className="text-sm text-gray-500">Map required and optional attributes to each product category</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    {['Category', 'Required Attributes', 'Optional Attributes', 'Products'].map((h) => (
                      <th key={h} className={cn('px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500', h === 'Products' ? 'text-right' : '')}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockMappings.map((m) => (
                    <tr key={m.category} className="transition-colors hover:bg-brand-50/40">
                      <td className="px-6 py-4 font-medium text-gray-900">{m.category}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {m.required.map((a) => (
                            <span key={a} className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-medium text-orange-700">{a}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {m.optional.map((a) => (
                            <span key={a} className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">{a}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900">{m.products.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
              <p className="text-xs text-gray-400">Showing 1-6 of 6 categories</p>
              <div className="flex items-center gap-1">
                <button className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-400">Previous</button>
                <button className="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white">1</button>
                <button className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-400">Next</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
