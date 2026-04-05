/**
 * Types for the Product Attributes feature.
 *
 * Each attribute type (size, color, material, brand) has its own
 * interface with shared base fields plus type-specific extras.
 */

// ----------------------------------------------------------------
// Shared
// ----------------------------------------------------------------

export type AttributeStatus = 'Active' | 'Inactive' | 'Limited';

export type AttributeTabKey = 'sizes' | 'colors' | 'materials' | 'brands';

export interface AttributeStats {
  totalAttributes: number;
  activeAttributes: number;
}

// ----------------------------------------------------------------
// Size
// ----------------------------------------------------------------

export interface SizeAttribute {
  id: string;
  name: string;
  displayName: string;
  sortOrder: number;
  status: AttributeStatus;
  productsUsing: number;
  category: string;
}

// ----------------------------------------------------------------
// Color
// ----------------------------------------------------------------

export interface ColorAttribute {
  id: string;
  name: string;
  displayName: string;
  hexCode: string;
  sortOrder: number;
  status: AttributeStatus;
  productsUsing: number;
}

// ----------------------------------------------------------------
// Material
// ----------------------------------------------------------------

export interface MaterialAttribute {
  id: string;
  name: string;
  displayName: string;
  sortOrder: number;
  status: AttributeStatus;
  productsUsing: number;
  category: string;
}

// ----------------------------------------------------------------
// Brand
// ----------------------------------------------------------------

export type BrandStatus = 'Approved' | 'Pending' | 'Rejected';

export interface BrandAttribute {
  id: string;
  name: string;
  displayName: string;
  initials: string;
  badgeBg: string;
  badgeText: string;
  sortOrder: number;
  status: BrandStatus;
  productsUsing: number;
  category: string;
}

// ----------------------------------------------------------------
// Combined response
// ----------------------------------------------------------------

export interface ProductAttributesData {
  stats: AttributeStats;
  sizes: SizeAttribute[];
  colors: ColorAttribute[];
  materials: MaterialAttribute[];
  brands: BrandAttribute[];
}
