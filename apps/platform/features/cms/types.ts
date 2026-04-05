/**
 * Types for the CMS (Content Management) feature.
 */

export type BannerStatus = 'Active' | 'Scheduled' | 'Expired';
export type PageStatus = 'Published' | 'Draft';
export type AnnouncementStatus = 'Active' | 'Scheduled';
export type AnnouncementType = 'Info' | 'Warning' | 'Promotion';

export interface Banner {
  id: string;
  title: string;
  position: string;
  status: BannerStatus;
  gradient: string;
  dimensions: string;
  dateRange: string;
  views?: string;
  /** For Scheduled banners, shown instead of views */
  scheduledLabel?: string;
}

export interface StaticPage {
  id: string;
  title: string;
  slug: string;
  status: PageStatus;
  lastModified: string;
  iconBg: string;
  iconColor: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  type: AnnouncementType;
  status: AnnouncementStatus;
  display: string;
  dateRange: string;
  barColor: string;
}

export interface CmsStats {
  totalBanners: number;
  activeBanners: number;
  totalPages: number;
  publishedPages: number;
  totalAnnouncements: number;
  activeAnnouncements: number;
  contentViews: string;
  contentViewsChange: string;
}

export interface CmsData {
  stats: CmsStats;
  banners: Banner[];
  pages: StaticPage[];
  announcements: Announcement[];
}
