/**
 * Mock data for the Product Attributes page.
 *
 * Matches the shape returned by the real API contract.
 * When the backend endpoints are ready, swap the mock imports in
 * the hook for real fetch calls -- no component changes needed.
 */

import type {
  AttributeStats,
  SizeAttribute,
  ColorAttribute,
  MaterialAttribute,
  BrandAttribute,
} from '../attribute-types';

// ----------------------------------------------------------------
// Stats
// ----------------------------------------------------------------

export const mockAttributeStats: AttributeStats = {
  totalAttributes: 34,
  activeAttributes: 28,
};

// ----------------------------------------------------------------
// Sizes
// ----------------------------------------------------------------

export const mockSizes: SizeAttribute[] = [
  { id: 'sz-01', name: 'XS', displayName: 'Extra Small', sortOrder: 1, status: 'Active', productsUsing: 124, category: 'Apparel' },
  { id: 'sz-02', name: 'S', displayName: 'Small', sortOrder: 2, status: 'Active', productsUsing: 312, category: 'Apparel' },
  { id: 'sz-03', name: 'M', displayName: 'Medium', sortOrder: 3, status: 'Active', productsUsing: 487, category: 'Apparel' },
  { id: 'sz-04', name: 'L', displayName: 'Large', sortOrder: 4, status: 'Active', productsUsing: 456, category: 'Apparel' },
  { id: 'sz-05', name: 'XL', displayName: 'Extra Large', sortOrder: 5, status: 'Active', productsUsing: 289, category: 'Apparel' },
  { id: 'sz-06', name: 'XXL', displayName: 'Double Extra Large', sortOrder: 6, status: 'Limited', productsUsing: 98, category: 'Apparel' },
  { id: 'sz-07', name: 'Free Size', displayName: 'Free Size', sortOrder: 7, status: 'Active', productsUsing: 167, category: 'Accessories' },
];

// ----------------------------------------------------------------
// Colors
// ----------------------------------------------------------------

export const mockColors: ColorAttribute[] = [
  { id: 'cl-01', name: 'Jet Black', displayName: 'Jet Black', hexCode: '#1A1A1A', sortOrder: 1, status: 'Active', productsUsing: 534 },
  { id: 'cl-02', name: 'Snow White', displayName: 'Snow White', hexCode: '#FFFFFF', sortOrder: 2, status: 'Active', productsUsing: 489 },
  { id: 'cl-03', name: 'Navy Blue', displayName: 'Navy Blue', hexCode: '#1E3A5F', sortOrder: 3, status: 'Active', productsUsing: 367 },
  { id: 'cl-04', name: 'Crimson Red', displayName: 'Crimson Red', hexCode: '#DC2626', sortOrder: 4, status: 'Active', productsUsing: 298 },
  { id: 'cl-05', name: 'Forest Green', displayName: 'Forest Green', hexCode: '#166534', sortOrder: 5, status: 'Active', productsUsing: 212 },
  { id: 'cl-06', name: 'Sunset Orange', displayName: 'Sunset Orange', hexCode: '#F97316', sortOrder: 6, status: 'Active', productsUsing: 178 },
  { id: 'cl-07', name: 'Royal Purple', displayName: 'Royal Purple', hexCode: '#7C3AED', sortOrder: 7, status: 'Active', productsUsing: 145 },
  { id: 'cl-08', name: 'Sky Blue', displayName: 'Sky Blue', hexCode: '#38BDF8', sortOrder: 8, status: 'Active', productsUsing: 189 },
  { id: 'cl-09', name: 'Blush Pink', displayName: 'Blush Pink', hexCode: '#F9A8D4', sortOrder: 9, status: 'Active', productsUsing: 112 },
  { id: 'cl-10', name: 'Warm Grey', displayName: 'Warm Grey', hexCode: '#9CA3AF', sortOrder: 10, status: 'Active', productsUsing: 267 },
  { id: 'cl-11', name: 'Golden Yellow', displayName: 'Golden Yellow', hexCode: '#EAB308', sortOrder: 11, status: 'Active', productsUsing: 134 },
  { id: 'cl-12', name: 'Teal', displayName: 'Teal', hexCode: '#14B8A6', sortOrder: 12, status: 'Active', productsUsing: 98 },
];

// ----------------------------------------------------------------
// Materials
// ----------------------------------------------------------------

export const mockMaterials: MaterialAttribute[] = [
  { id: 'mt-01', name: 'Cotton', displayName: 'Cotton', sortOrder: 1, status: 'Active', productsUsing: 1_245, category: 'Apparel' },
  { id: 'mt-02', name: 'Polyester', displayName: 'Polyester', sortOrder: 2, status: 'Active', productsUsing: 890, category: 'Apparel' },
  { id: 'mt-03', name: 'Stainless Steel', displayName: 'Stainless Steel', sortOrder: 3, status: 'Active', productsUsing: 567, category: 'Home & Kitchen' },
  { id: 'mt-04', name: 'Leather', displayName: 'Leather', sortOrder: 4, status: 'Active', productsUsing: 342, category: 'Accessories' },
  { id: 'mt-05', name: 'Wood', displayName: 'Wood', sortOrder: 5, status: 'Active', productsUsing: 210, category: 'Furniture' },
  { id: 'mt-06', name: 'Ceramic', displayName: 'Ceramic', sortOrder: 6, status: 'Active', productsUsing: 178, category: 'Home & Kitchen' },
  { id: 'mt-07', name: 'Silk', displayName: 'Silk', sortOrder: 7, status: 'Limited', productsUsing: 95, category: 'Apparel' },
  { id: 'mt-08', name: 'Glass', displayName: 'Glass', sortOrder: 8, status: 'Active', productsUsing: 134, category: 'Home & Kitchen' },
];

// ----------------------------------------------------------------
// Brands
// ----------------------------------------------------------------

export const mockBrands: BrandAttribute[] = [
  { id: 'br-01', name: 'TechCraft India', displayName: 'TechCraft India', initials: 'TC', badgeBg: 'bg-blue-100', badgeText: 'text-blue-700', sortOrder: 1, status: 'Approved', productsUsing: 342, category: 'Electronics' },
  { id: 'br-02', name: 'GreenLeaf Organics', displayName: 'GreenLeaf Organics', initials: 'GL', badgeBg: 'bg-green-100', badgeText: 'text-green-700', sortOrder: 2, status: 'Approved', productsUsing: 189, category: 'Grocery' },
  { id: 'br-03', name: 'Sharma Electronics', displayName: 'Sharma Electronics', initials: 'SE', badgeBg: 'bg-purple-100', badgeText: 'text-purple-700', sortOrder: 3, status: 'Pending', productsUsing: 78, category: 'Electronics' },
  { id: 'br-04', name: 'HomeWorks', displayName: 'HomeWorks', initials: 'HW', badgeBg: 'bg-orange-100', badgeText: 'text-orange-700', sortOrder: 4, status: 'Approved', productsUsing: 256, category: 'Furniture' },
  { id: 'br-05', name: 'Priya Enterprises', displayName: 'Priya Enterprises', initials: 'PE', badgeBg: 'bg-red-100', badgeText: 'text-red-700', sortOrder: 5, status: 'Approved', productsUsing: 415, category: 'Apparel' },
  { id: 'br-06', name: 'AromaKitchen', displayName: 'AromaKitchen', initials: 'AK', badgeBg: 'bg-teal-100', badgeText: 'text-teal-700', sortOrder: 6, status: 'Approved', productsUsing: 134, category: 'Home & Kitchen' },
  { id: 'br-07', name: 'NatureFit', displayName: 'NatureFit', initials: 'NF', badgeBg: 'bg-yellow-100', badgeText: 'text-yellow-700', sortOrder: 7, status: 'Pending', productsUsing: 67, category: 'Health' },
  { id: 'br-08', name: 'TechMart India', displayName: 'TechMart India', initials: 'TM', badgeBg: 'bg-indigo-100', badgeText: 'text-indigo-700', sortOrder: 8, status: 'Approved', productsUsing: 523, category: 'Electronics' },
];
