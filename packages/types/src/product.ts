import type { StateEntity, ActivityLog } from './common';

export interface Product extends StateEntity {
  name: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  brandId?: string;
  brandName?: string;
  categoryId?: string;
  categoryName?: string;
  supplierId: string;
  supplierName?: string;
  basePrice: number;
  sellingPrice: number;
  mrp: number;
  currency: string;
  hsnCode?: string;
  sku?: string;
  tags: string[];
  variants: ProductVariant[];
  media: ProductMedia[];
  specifications: ProductSpecification[];
  activities: ActivityLog[];
  averageRating?: number;
  reviewCount?: number;
  isFeatured?: boolean;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  price: number;
  mrp: number;
  stockQuantity: number;
  attributes: VariantAttribute[];
  media: ProductMedia[];
}

export interface VariantAttribute {
  name: string;
  value: string;
}

export interface ProductMedia {
  id: string;
  url: string;
  altText?: string;
  mediaType: 'IMAGE' | 'VIDEO';
  sortOrder: number;
  isPrimary?: boolean;
}

export interface ProductSpecification {
  key: string;
  value: string;
  group?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug?: string;
  logoUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  imageUrl?: string;
  description?: string;
  children?: Category[];
  level: number;
  sortOrder: number;
  productCount?: number;
}

export interface CategoryAttribute {
  id: string;
  name: string;
  type: 'TEXT' | 'NUMBER' | 'SELECT' | 'MULTI_SELECT';
  options?: string[];
  required: boolean;
}
