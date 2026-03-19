import type { Category } from './product';

export interface CatalogItem {
  id: string;
  productId: string;
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  price: number;
  mrp: number;
  currency: string;
  categoryId?: string;
  categoryName?: string;
  brandName?: string;
  averageRating?: number;
  reviewCount?: number;
  inStock: boolean;
  discount: number;
  tags: string[];
}

export interface CategoryMenu {
  categories: Category[];
}

export interface SearchSuggestion {
  text: string;
  type: 'product' | 'category' | 'brand';
  id?: string;
}

export interface PriceRange {
  min: number;
  max: number;
  currency: string;
}

export interface ProductFilter {
  categories: Category[];
  brands: { id: string; name: string; count: number }[];
  priceRange: PriceRange;
  ratings: { rating: number; count: number }[];
}
