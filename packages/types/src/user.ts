import type { StateEntity, Address, ActivityLog } from './common';

export interface User extends StateEntity {
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  avatarUrl?: string;
  addresses: Address[];
  activities: ActivityLog[];
  emailVerified?: boolean;
  phoneVerified?: boolean;
  kycStatus?: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  price: number;
  addedAt: string;
}

export interface RecentlyViewed {
  productId: string;
  productName: string;
  productImage?: string;
  price: number;
  viewedAt: string;
}
