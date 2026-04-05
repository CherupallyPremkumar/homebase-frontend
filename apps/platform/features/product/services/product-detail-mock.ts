/**
 * Mock data for Product Detail (admin) page.
 *
 * Mirrors the admin/products/detail.html prototype.
 */

import type { ProductDetailData } from '../types';

export type { ProductDetailData } from '../types';

// ----------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------

export const mockProductDetail: ProductDetailData = {
  id: 'PRD-00142',
  name: 'Modern Velvet Sofa',
  sku: 'HB-FUR-00142',
  emoji: '\uD83D\uDECB\uFE0F',
  status: 'Active',
  statusColor: 'green',
  category: 'Furniture',
  brand: 'LuxeLiving Co.',
  listedDate: 'Mar 15, 2026',
  description: 'Premium modern velvet sofa with solid wood frame. Features high-density foam cushioning for maximum comfort. The rich velvet upholstery adds a touch of luxury to any living space. Available in multiple colors. Includes a 2-year warranty.',
  features: [
    'Premium velvet upholstery',
    'Solid wood frame construction',
    'High-density foam cushioning',
    'Seats 3 comfortably',
    '2-year warranty included',
  ],

  mrp: 149900,
  sellingPrice: 129900,
  discountPercent: 13,
  stock: 45,

  avgRating: 4.5,
  reviewCount: 128,
  ratingBreakdown: [
    { stars: 5, percent: 65 },
    { stars: 4, percent: 20 },
    { stars: 3, percent: 8 },
    { stars: 2, percent: 4 },
    { stars: 1, percent: 3 },
  ],

  seller: {
    id: 'SEL-001',
    name: 'LuxeLiving Co.',
    initials: 'LL',
    avatarBg: 'bg-blue-100 text-blue-600',
    tier: 'Premium Seller',
    since: '2024',
    rating: 4.7,
    productCount: 156,
    orderCount: 2340,
  },

  productId: 'PRD-00142',
  createdDate: '15 Mar 2026',
  lastUpdated: '27 Mar 2026',
  views: 1245,
  orders: 89,
  returns: 3,
  returnRate: '3.4%',
  gstPercent: 18,
  hsnCode: '94016100',
  weight: '45 kg',
  dimensions: '200x85x80 cm',

  shippingWeight: '48 kg',
  freeShipping: true,
  estDelivery: '5-7 business days',
  returnable: 'Yes (30 days)',

  moderationHistory: [
    { event: 'Approved', actor: 'Super Admin', date: '15 Mar 2026, 10:30 AM', color: 'bg-green-500' },
    { event: 'Submitted for review', actor: 'LuxeLiving Co.', date: '14 Mar 2026, 3:45 PM', color: 'bg-blue-500' },
    { event: 'Draft created', actor: 'LuxeLiving Co.', date: '14 Mar 2026, 2:00 PM', color: 'bg-gray-300' },
  ],
};
