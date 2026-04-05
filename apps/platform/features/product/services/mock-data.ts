/**
 * Mock data for the Product Management list page.
 *
 * Each export matches the shape returned by the real API contract.
 * When backend endpoints are ready, swap the mock imports in
 * queries.ts for real fetch calls -- no component changes needed.
 */

import type { Product, ProductStats, ProductTab, ProductListResponse } from '../types';

export type {
  ProductStatus,
  Product,
  ProductStats,
  ProductTab,
  ProductListResponse,
} from '../types';

// ----------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------

export const mockProductStats: ProductStats = {
  totalProducts: { value: '8,920', subtitle: '+124 this week' },
  pendingReview: { value: '45', subtitle: 'Needs attention' },
  flagged: { value: '12', subtitle: '+3 from yesterday' },
  removed: { value: '8', subtitle: 'No change this week' },
};

export const mockProductTabs: ProductTab[] = [
  { key: 'all', label: 'All', count: '8,920' },
  { key: 'pending', label: 'Pending Review', count: '45', badgeClass: 'bg-amber-100 text-amber-700' },
  { key: 'active', label: 'Active', count: '8,855', badgeClass: 'bg-green-100 text-green-700' },
  { key: 'flagged', label: 'Flagged', count: '12', badgeClass: 'bg-orange-100 text-orange-700' },
  { key: 'removed', label: 'Removed', count: '8', badgeClass: 'bg-red-100 text-red-700' },
];

export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Modern Velvet Sofa',
    sku: 'HB-FUR-00142',
    emoji: '\uD83D\uDECB\uFE0F',
    emojiBg: 'bg-blue-50',
    seller: 'LuxeLiving Co.',
    category: 'Furniture',
    price: '$1,299.00',
    stock: 24,
    status: 'Active',
    date: 'Mar 15, 2026',
  },
  {
    id: 2,
    name: 'Cordless Power Drill Set',
    sku: 'HB-TLS-00587',
    emoji: '\uD83D\uDD28',
    emojiBg: 'bg-amber-50',
    seller: 'ToolMaster Pro',
    category: 'Tools',
    price: '$189.99',
    stock: 156,
    status: 'Pending',
    date: 'Mar 27, 2026',
  },
  {
    id: 3,
    name: 'Premium LED Panel 60W',
    sku: 'HB-LGT-01203',
    emoji: '\uD83D\uDCA1',
    emojiBg: 'bg-yellow-50',
    seller: 'BrightLite Solutions',
    category: 'Lighting',
    price: '$89.50',
    stock: 312,
    status: 'Flagged',
    date: 'Mar 22, 2026',
  },
  {
    id: 4,
    name: 'Organic Garden Soil 25kg',
    sku: 'HB-GRD-00891',
    emoji: '\uD83C\uDF31',
    emojiBg: 'bg-green-50',
    seller: 'GreenEarth India',
    category: 'Garden',
    price: '$24.99',
    stock: 890,
    status: 'Active',
    date: 'Mar 20, 2026',
  },
  {
    id: 5,
    name: 'Smart Door Lock WiFi',
    sku: 'HB-SEC-00334',
    emoji: '\uD83D\uDD12',
    emojiBg: 'bg-slate-50',
    seller: 'SecureHome Tech',
    category: 'Security',
    price: '$249.00',
    stock: 67,
    status: 'Pending',
    date: 'Mar 26, 2026',
  },
  {
    id: 6,
    name: 'Ceramic Floor Tiles 2x2',
    sku: 'HB-FLR-01567',
    emoji: '\uD83E\uDDF1',
    emojiBg: 'bg-orange-50',
    seller: 'TileWorld India',
    category: 'Flooring',
    price: '$45.00',
    stock: 2340,
    status: 'Active',
    date: 'Mar 18, 2026',
  },
  {
    id: 7,
    name: 'Industrial Paint Sprayer',
    sku: 'HB-PNT-00445',
    emoji: '\uD83C\uDFA8',
    emojiBg: 'bg-purple-50',
    seller: 'ColorPro Tools',
    category: 'Paint',
    price: '$599.00',
    stock: 0,
    status: 'Removed',
    date: 'Mar 10, 2026',
  },
  {
    id: 8,
    name: 'Modular Kitchen Cabinet Set',
    sku: 'HB-KIT-00778',
    emoji: '\uD83C\uDF73',
    emojiBg: 'bg-rose-50',
    seller: 'ModKitchen Hub',
    category: 'Kitchen',
    price: '$2,450.00',
    stock: 12,
    status: 'Active',
    date: 'Mar 14, 2026',
  },
];

export const mockProductListResponse: ProductListResponse = {
  products: mockProducts,
  total: 8_920,
  page: 1,
  pageSize: 8,
  totalPages: 1115,
};
