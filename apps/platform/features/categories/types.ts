/**
 * Types for the Categories feature.
 *
 * CategoryNode  — tree hierarchy for the tree view
 * CategoryRule  — per-category business rules for the rules table
 * CategoryAttribute — required/optional attributes per category
 * CategoryStats — aggregate counts for stat cards
 */

export interface CategoryStats {
  totalCategories: number;
  rootCount: number;
  subCount: number;
  leafCount: number;
  activeCategories: number;
  activePercent: number;
  inactiveCategories: number;
}

export interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId: string;
  level: number;
  displayOrder: number;
  active: boolean;
  featured: boolean;
  icon: string;
  productCount: number;
  sellerCount: number;
  /** Commission rate for this category (e.g. 8 = 8%) */
  commissionRate: number;
  /** HSN/SAC code for GST classification */
  hsnCode: string;
  /** GST rate percentage */
  gstRate: number;
  children: CategoryNode[];
  /** Whether children have been fetched from the server */
  childrenLoaded: boolean;
  /** Whether this node has children in the DB (based on sub_count or level) */
  hasChildren: boolean;
}

export type CategoryFilter = 'all' | 'active' | 'inactive';

export interface CategoryRule {
  categoryId: string;
  categoryName: string;
  commissionRate: number;
  gstRate: number;
  hsnCode: string;
  returnDays: number;
  returnType: string;
  maxWeightKg: number;
  shippingType: string;
  restrictionType: string;
  requiredLicense: string;
  minImages: number;
  minDescriptionLength: number;
  eanRequired: boolean;
}

export interface CategoryAttribute {
  id: string;
  categoryId: string;
  categoryName: string;
  attributeName: string;
  attributeType: string;
  isRequired: boolean;
  allowedValues: string;
  sortOrder: number;
}
