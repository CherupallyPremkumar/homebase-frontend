import type { StateEntity, ActivityLog } from './common';

export interface Review extends StateEntity {
  productId: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
  rating: number;
  title?: string;
  body: string;
  images: ReviewImage[];
  isVerifiedPurchase: boolean;
  verifiedPurchase?: boolean | string;
  customerId?: string;
  createdAt?: string;
  helpfulCount: number;
  reportCount: number;
  activities: ActivityLog[];
}

export interface ReviewImage {
  id: string;
  url: string;
  altText?: string;
}

export interface ReviewSummary {
  productId: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
}

export interface ReviewVote {
  reviewId: string;
  userId: string;
  helpful: boolean;
}
