import type {
  EnhancedProduct,
  EnhancedStatCard,
  EnhancedProductTab,
  LowStockAlert,
  FilterOptions,
  AdvancedFilters,
} from '../types';

// ----------------------------------------------------------------
// Stats Cards (7)
// ----------------------------------------------------------------

export const mockEnhancedStats: EnhancedStatCard[] = [
  { key: 'total', label: 'Total Products', value: '8,920', iconBgColor: 'bg-blue-50', iconColor: 'text-blue-600', iconKey: 'archive' },
  { key: 'published', label: 'Published', value: '8,412', iconBgColor: 'bg-green-50', iconColor: 'text-green-600', iconKey: 'check-circle' },
  { key: 'review', label: 'Under Review', value: '45', iconBgColor: 'bg-amber-50', iconColor: 'text-amber-600', iconKey: 'clock' },
  { key: 'suspended', label: 'Suspended', value: '12', iconBgColor: 'bg-orange-50', iconColor: 'text-orange-600', iconKey: 'alert-triangle' },
  { key: 'draft', label: 'Draft', value: '451', iconBgColor: 'bg-gray-100', iconColor: 'text-gray-500', iconKey: 'file-text' },
  { key: 'violations', label: 'Policy Violations', value: '23', subtitle: 'Requires immediate action', borderColor: 'border-red-100', valueColor: 'text-red-600', iconBgColor: 'bg-red-50', iconColor: 'text-red-600', iconKey: 'shield-alert' },
  { key: 'pending', label: 'Pending Approval', value: '45', subtitle: 'Avg wait: 2.3 days', borderColor: 'border-amber-100', valueColor: 'text-amber-600', iconBgColor: 'bg-amber-50', iconColor: 'text-amber-600', iconKey: 'clock' },
];

// ----------------------------------------------------------------
// Tabs (5)
// ----------------------------------------------------------------

export const mockEnhancedTabs: EnhancedProductTab[] = [
  { key: 'all', label: 'All', count: '8,920', badgeColor: 'bg-gray-100 text-gray-600' },
  { key: 'published', label: 'Published', count: '8,412', badgeColor: 'bg-green-100 text-green-700' },
  { key: 'under_review', label: 'Under Review', count: '45', badgeColor: 'bg-amber-100 text-amber-700' },
  { key: 'suspended', label: 'Suspended', count: '12', badgeColor: 'bg-orange-100 text-orange-700' },
  { key: 'draft', label: 'Draft', count: '451', badgeColor: 'bg-gray-200 text-gray-600' },
];

// ----------------------------------------------------------------
// Products (6 rows matching prototype)
// ----------------------------------------------------------------

export const mockEnhancedProducts: EnhancedProduct[] = [
  { id: 'p1', name: 'Bosch GSB 500W Impact Drill Kit', sku: 'BOS-GSB-500W', categoryBreadcrumb: 'Tools \u203A Power Tools \u203A Drills', sellerName: 'Anand Tools', sellerHref: '/suppliers/anand', sellerTier: 'GOLD', variantCount: 3, rating: 4.5, reviewCount: 128, price: '\u20B93,499', stock: 142, reservedStock: 12, violationCount: 0, status: 'Published' },
  { id: 'p2', name: 'Asian Paints Royale Luxury Emulsion 10L', sku: 'AP-ROY-10L', categoryBreadcrumb: 'Paints \u203A Interior \u203A Emulsion', sellerName: 'Krishna Home Decor', sellerHref: '/suppliers/krishna', sellerTier: 'SILVER', variantCount: 6, rating: null, reviewCount: 0, price: '\u20B93,850', stock: 5, reservedStock: 0, violationCount: 0, status: 'Under Review' },
  { id: 'p3', name: 'Havells 9W LED Bulb Pack of 10', sku: 'HAV-LED-9W-10', categoryBreadcrumb: 'Electrical \u203A Lighting \u203A LED Bulbs', sellerName: 'Patel Lighting', sellerHref: '/suppliers/patel', sellerTier: 'BRONZE', variantCount: 2, rating: 3.8, reviewCount: 42, price: '\u20B9890', stock: 0, reservedStock: 0, violationCount: 3, status: 'Suspended', suspensionReason: 'Misleading wattage claim reported by 3 buyers' },
  { id: 'p4', name: 'Crompton Super Silent Ceiling Fan 1200mm', sku: 'CRM-FAN-1200', categoryBreadcrumb: 'Electrical \u203A Fans \u203A Ceiling Fans', sellerName: 'Rajesh Store', sellerHref: '/suppliers/rajesh', sellerTier: 'PLATINUM', variantCount: 4, rating: 4.7, reviewCount: 312, price: '\u20B92,650', stock: 87, reservedStock: 24, violationCount: 0, status: 'Published' },
  { id: 'p5', name: 'Havells Reo 5L Water Heater', sku: 'HAV-REO-5L', categoryBreadcrumb: 'Bathroom \u203A Water Heaters \u203A Instant', sellerName: 'Rajesh Store', sellerHref: '/suppliers/rajesh', sellerTier: 'PLATINUM', variantCount: 2, rating: null, reviewCount: 0, price: '\u20B93,500', stock: 0, reservedStock: 0, violationCount: 0, status: 'Draft' },
  { id: 'p6', name: 'Jaquar Artize Rainfall Shower 200mm', sku: 'JAQ-ART-200', categoryBreadcrumb: 'Bathroom \u203A Fittings \u203A Showers', sellerName: 'Krishna Home Decor', sellerHref: '/suppliers/krishna', sellerTier: 'SILVER', variantCount: 5, rating: 4.9, reviewCount: 67, price: '\u20B98,450', stock: 34, reservedStock: 8, violationCount: 1, status: 'Published' },
];

// ----------------------------------------------------------------
// Alert
// ----------------------------------------------------------------

export const mockLowStockAlert: LowStockAlert = {
  count: 34,
  message: '34 products with less than 5 units remaining',
  description: 'Low stock items risk stockouts and lost sales. Review inventory levels now.',
};

// ----------------------------------------------------------------
// Filter Options
// ----------------------------------------------------------------

export const mockFilterOptions: FilterOptions = {
  categories: [
    { label: 'Tools & Power Tools', value: 'tools' },
    { label: 'Paints & Finishes', value: 'paints' },
    { label: 'Electrical & Lighting', value: 'electrical' },
    { label: 'Bathroom & Fittings', value: 'bathroom' },
    { label: 'Kitchen & Appliances', value: 'kitchen' },
    { label: 'Hardware & Fasteners', value: 'hardware' },
    { label: 'Flooring & Tiles', value: 'flooring' },
    { label: 'Garden & Outdoor', value: 'garden' },
  ],
  sellers: [
    { label: 'Anand Tools', value: 'anand' },
    { label: 'Krishna Home Decor', value: 'krishna' },
    { label: 'Patel Lighting', value: 'patel' },
    { label: 'Rajesh Store', value: 'rajesh' },
    { label: 'Sharma Electronics', value: 'sharma' },
  ],
};

// ----------------------------------------------------------------
// Default Advanced Filters
// ----------------------------------------------------------------

export const defaultAdvancedFilters: AdvancedFilters = {
  priceMin: 0,
  priceMax: 50000,
  minRating: 0,
  category: '',
  seller: '',
  stockStatus: '',
  hasReviews: '',
  dateFrom: '',
  dateTo: '',
};

// ----------------------------------------------------------------
// Saved Filter Presets
// ----------------------------------------------------------------

// ----------------------------------------------------------------
// Mock Product Detail Data (keyed by ID)
// ----------------------------------------------------------------

export const mockProductDetails: Record<string, import('../types').ProductDetailData> = {
  p1: { id: 'p1', name: 'Bosch GSB 500W Impact Drill Kit', sku: 'BOS-GSB-500W', emoji: '', status: 'PUBLISHED', statusColor: 'green', category: 'Tools \u203A Power Tools \u203A Drills', brand: 'Bosch', listedDate: '15 Jan 2026', description: 'Professional-grade impact drill kit with variable speed control, 500W motor, and complete accessory set for home and professional use.', features: ['500W powerful motor', '13mm keyless chuck', 'Variable speed 0-2800 RPM', 'Includes 100pc accessory kit'], mrp: 449900, sellingPrice: 349900, discountPercent: 22, stock: 142, avgRating: 4.5, reviewCount: 128, ratingBreakdown: [{ stars: 5, percent: 62 }, { stars: 4, percent: 24 }, { stars: 3, percent: 8 }, { stars: 2, percent: 4 }, { stars: 1, percent: 2 }], seller: { id: 'anand', name: 'Anand Tools & Hardware', initials: 'AT', avatarBg: 'bg-blue-100 text-blue-700', tier: 'Gold Seller', since: 'Aug 2024', rating: 4.6, productCount: 342, orderCount: 1245 }, productId: 'p1', createdDate: '15 Jan 2026', lastUpdated: '2 Apr 2026', views: 4520, orders: 312, returns: 8, returnRate: '2.6%', gstPercent: 18, hsnCode: '8467', weight: '2.4 kg', dimensions: '32 x 28 x 12 cm', shippingWeight: '3.1 kg', freeShipping: true, estDelivery: '2-4 days', returnable: '7 days', moderationHistory: [{ event: 'Product Published', actor: 'System', date: '15 Jan 2026', color: 'bg-green-500' }, { event: 'Listing Approved', actor: 'Priya Sharma', date: '14 Jan 2026', color: 'bg-blue-500' }] },
  p2: { id: 'p2', name: 'Asian Paints Royale Luxury Emulsion 10L', sku: 'AP-ROY-10L', emoji: '', status: 'UNDER_REVIEW', statusColor: 'yellow', category: 'Paints \u203A Interior \u203A Emulsion', brand: 'Asian Paints', listedDate: '28 Mar 2026', description: 'Premium interior emulsion paint with superior finish.', features: ['Washable', 'Low VOC', 'Anti-bacterial'], mrp: 485000, sellingPrice: 385000, discountPercent: 21, stock: 5, avgRating: 0, reviewCount: 0, ratingBreakdown: [], seller: { id: 'krishna', name: 'Krishna Home Decor', initials: 'KH', avatarBg: 'bg-emerald-100 text-emerald-700', tier: 'Silver Seller', since: 'Mar 2025', rating: 4.7, productCount: 218, orderCount: 987 }, productId: 'p2', createdDate: '28 Mar 2026', lastUpdated: '28 Mar 2026', views: 0, orders: 0, returns: 0, returnRate: '0%', gstPercent: 18, hsnCode: '3209', weight: '12.5 kg', dimensions: '28 x 28 x 35 cm', shippingWeight: '13.2 kg', freeShipping: false, estDelivery: '3-5 days', returnable: '7 days', moderationHistory: [{ event: 'Submitted for Review', actor: 'Krishna Home Decor', date: '28 Mar 2026', color: 'bg-amber-500' }] },
  p3: { id: 'p3', name: 'Havells 9W LED Bulb Pack of 10', sku: 'HAV-LED-9W-10', emoji: '', status: 'SUSPENDED', statusColor: 'red', category: 'Electrical \u203A Lighting \u203A LED Bulbs', brand: 'Havells', listedDate: '20 Nov 2025', description: 'Energy-efficient LED bulb pack with 9W output.', features: ['9W power', 'B22 base', '25000 hour life'], mrp: 119900, sellingPrice: 89000, discountPercent: 26, stock: 0, avgRating: 3.8, reviewCount: 42, ratingBreakdown: [{ stars: 5, percent: 30 }, { stars: 4, percent: 25 }, { stars: 3, percent: 20 }, { stars: 2, percent: 15 }, { stars: 1, percent: 10 }], seller: { id: 'patel', name: 'Patel Lighting Solutions', initials: 'PL', avatarBg: 'bg-violet-100 text-violet-700', tier: 'Bronze Seller', since: 'Jun 2025', rating: 4.1, productCount: 189, orderCount: 743 }, productId: 'p3', createdDate: '20 Nov 2025', lastUpdated: '15 Mar 2026', views: 2100, orders: 156, returns: 12, returnRate: '7.7%', gstPercent: 18, hsnCode: '9405', weight: '0.8 kg', dimensions: '18 x 12 x 12 cm', shippingWeight: '1.0 kg', freeShipping: false, estDelivery: '2-3 days', returnable: '15 days', moderationHistory: [{ event: 'Product Suspended', actor: 'System (Auto-flag)', date: '15 Mar 2026', color: 'bg-red-500' }, { event: '3 buyer complaints received', actor: 'System', date: '14 Mar 2026', color: 'bg-amber-500' }, { event: 'Product Published', actor: 'System', date: '20 Nov 2025', color: 'bg-green-500' }] },
  p4: { id: 'p4', name: 'Crompton Super Silent Ceiling Fan 1200mm', sku: 'CRM-FAN-1200', emoji: '', status: 'PUBLISHED', statusColor: 'green', category: 'Electrical \u203A Fans \u203A Ceiling Fans', brand: 'Crompton', listedDate: '10 Sep 2025', description: 'Ultra-quiet ceiling fan with aerodynamic blade design.', features: ['1200mm sweep', 'Super silent motor', '5-star energy rating', '50W power consumption'], mrp: 329900, sellingPrice: 265000, discountPercent: 20, stock: 87, avgRating: 4.7, reviewCount: 312, ratingBreakdown: [{ stars: 5, percent: 72 }, { stars: 4, percent: 18 }, { stars: 3, percent: 6 }, { stars: 2, percent: 3 }, { stars: 1, percent: 1 }], seller: { id: 'rajesh', name: 'Rajesh Store', initials: 'RS', avatarBg: 'bg-brand-100 text-brand-700', tier: 'Platinum Seller', since: 'Jan 2024', rating: 4.8, productCount: 456, orderCount: 2340 }, productId: 'p4', createdDate: '10 Sep 2025', lastUpdated: '1 Apr 2026', views: 8900, orders: 876, returns: 14, returnRate: '1.6%', gstPercent: 18, hsnCode: '8414', weight: '5.2 kg', dimensions: '125 x 125 x 35 cm', shippingWeight: '6.8 kg', freeShipping: true, estDelivery: '3-5 days', returnable: '10 days', moderationHistory: [{ event: 'Product Published', actor: 'System', date: '10 Sep 2025', color: 'bg-green-500' }] },
  p5: { id: 'p5', name: 'Havells Reo 5L Water Heater', sku: 'HAV-REO-5L', emoji: '', status: 'CREATED', statusColor: 'gray', category: 'Bathroom \u203A Water Heaters \u203A Instant', brand: 'Havells', listedDate: '30 Mar 2026', description: 'Instant water heater with 5L capacity.', features: ['5L capacity', 'ISI certified', 'Anti-siphon system'], mrp: 450000, sellingPrice: 350000, discountPercent: 22, stock: 0, avgRating: 0, reviewCount: 0, ratingBreakdown: [], seller: { id: 'rajesh', name: 'Rajesh Store', initials: 'RS', avatarBg: 'bg-brand-100 text-brand-700', tier: 'Platinum Seller', since: 'Jan 2024', rating: 4.8, productCount: 456, orderCount: 2340 }, productId: 'p5', createdDate: '30 Mar 2026', lastUpdated: '30 Mar 2026', views: 0, orders: 0, returns: 0, returnRate: '0%', gstPercent: 18, hsnCode: '8516', weight: '4.5 kg', dimensions: '38 x 28 x 22 cm', shippingWeight: '5.2 kg', freeShipping: false, estDelivery: '3-5 days', returnable: '15 days', moderationHistory: [{ event: 'Draft Created', actor: 'Rajesh Store', date: '30 Mar 2026', color: 'bg-gray-400' }] },
  p6: { id: 'p6', name: 'Jaquar Artize Rainfall Shower 200mm', sku: 'JAQ-ART-200', emoji: '', status: 'PUBLISHED', statusColor: 'green', category: 'Bathroom \u203A Fittings \u203A Showers', brand: 'Jaquar', listedDate: '5 Dec 2025', description: 'Premium rainfall shower head with 200mm diameter.', features: ['200mm diameter', 'Chrome finish', 'Easy clean nozzles', '360\u00B0 swivel'], mrp: 1099900, sellingPrice: 845000, discountPercent: 23, stock: 34, avgRating: 4.9, reviewCount: 67, ratingBreakdown: [{ stars: 5, percent: 82 }, { stars: 4, percent: 12 }, { stars: 3, percent: 4 }, { stars: 2, percent: 1 }, { stars: 1, percent: 1 }], seller: { id: 'krishna', name: 'Krishna Home Decor', initials: 'KH', avatarBg: 'bg-emerald-100 text-emerald-700', tier: 'Silver Seller', since: 'Mar 2025', rating: 4.7, productCount: 218, orderCount: 987 }, productId: 'p6', createdDate: '5 Dec 2025', lastUpdated: '28 Mar 2026', views: 3400, orders: 234, returns: 5, returnRate: '2.1%', gstPercent: 18, hsnCode: '8481', weight: '1.8 kg', dimensions: '22 x 22 x 8 cm', shippingWeight: '2.2 kg', freeShipping: true, estDelivery: '2-4 days', returnable: '7 days', moderationHistory: [{ event: 'Product Published', actor: 'System', date: '5 Dec 2025', color: 'bg-green-500' }] },
};

// ----------------------------------------------------------------
// Saved Filter Presets
// ----------------------------------------------------------------

export const savedFilterPresets = [
  { key: 'lowstock', label: 'Low Stock Alert', dotColor: 'bg-red-400' },
  { key: 'highvalue', label: 'High Value', dotColor: 'bg-blue-400' },
  { key: 'suspended', label: 'Suspended', dotColor: 'bg-orange-400' },
  { key: 'violations', label: 'Policy Violations', dotColor: 'bg-red-600' },
  { key: 'noreviews', label: 'No Reviews', dotColor: 'bg-gray-400' },
];
