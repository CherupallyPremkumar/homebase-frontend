export interface CmsPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  mobileImageUrl?: string;
  linkUrl?: string;
  altText?: string;
  sortOrder: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}
