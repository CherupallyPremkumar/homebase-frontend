/**
 * Mock data for the Content Management page.
 *
 * Values match the HTML prototype pixel-for-pixel.
 */

import type { Banner, StaticPage, Announcement, CmsStats, CmsData } from '../types';

export type {
  BannerStatus,
  PageStatus,
  AnnouncementStatus,
  AnnouncementType,
  Banner,
  StaticPage,
  Announcement,
  CmsStats,
  CmsData,
} from '../types';

// ----------------------------------------------------------------
// Stats
// ----------------------------------------------------------------

export const mockStats: CmsStats = {
  totalBanners: 4,
  activeBanners: 3,
  totalPages: 6,
  publishedPages: 5,
  totalAnnouncements: 3,
  activeAnnouncements: 2,
  contentViews: '18.5K',
  contentViewsChange: '24.3%',
};

// ----------------------------------------------------------------
// Banners
// ----------------------------------------------------------------

export const mockBanners: Banner[] = [
  {
    id: 'bnr-001',
    title: 'Summer Sale 2026 - Up to 60% Off',
    position: 'Home Hero',
    status: 'Active',
    gradient: 'bg-gradient-to-br from-orange-400 to-orange-600',
    dimensions: '1920 x 600 px',
    dateRange: '01 Mar - 30 Apr 2026',
    views: '8,432 views',
  },
  {
    id: 'bnr-002',
    title: 'Electronics Category - New Arrivals',
    position: 'Category',
    status: 'Active',
    gradient: 'bg-gradient-to-br from-blue-400 to-blue-600',
    dimensions: '1920 x 600 px',
    dateRange: '15 Mar - 15 May 2026',
    views: '5,218 views',
  },
  {
    id: 'bnr-003',
    title: 'Free Shipping on Orders Above Rs.999',
    position: 'Sidebar',
    status: 'Scheduled',
    gradient: 'bg-gradient-to-br from-purple-400 to-purple-600',
    dimensions: '300 x 600 px',
    dateRange: '01 Apr - 30 Jun 2026',
    scheduledLabel: 'Starts in 4 days',
  },
  {
    id: 'bnr-004',
    title: 'Republic Day Special - Flat 26% Off',
    position: 'Home Hero',
    status: 'Expired',
    gradient: 'bg-gradient-to-br from-gray-300 to-gray-500',
    dimensions: '1920 x 600 px',
    dateRange: '20 Jan - 28 Jan 2026',
    views: '12,890 views',
  },
];

// ----------------------------------------------------------------
// Pages
// ----------------------------------------------------------------

export const mockPages: StaticPage[] = [
  { id: 'pg-001', title: 'About Us', slug: '/about-us', status: 'Published', lastModified: '25 Mar 2026', iconBg: 'bg-blue-50', iconColor: 'text-blue-500' },
  { id: 'pg-002', title: 'Contact Us', slug: '/contact', status: 'Published', lastModified: '22 Mar 2026', iconBg: 'bg-green-50', iconColor: 'text-green-500' },
  { id: 'pg-003', title: 'Privacy Policy', slug: '/privacy-policy', status: 'Published', lastModified: '18 Mar 2026', iconBg: 'bg-purple-50', iconColor: 'text-purple-500' },
  { id: 'pg-004', title: 'Terms & Conditions', slug: '/terms', status: 'Published', lastModified: '15 Mar 2026', iconBg: 'bg-orange-50', iconColor: 'text-orange-500' },
  { id: 'pg-005', title: 'FAQ', slug: '/faq', status: 'Published', lastModified: '10 Mar 2026', iconBg: 'bg-yellow-50', iconColor: 'text-yellow-500' },
  { id: 'pg-006', title: 'Shipping Information', slug: '/shipping-info', status: 'Draft', lastModified: '28 Mar 2026', iconBg: 'bg-indigo-50', iconColor: 'text-indigo-500' },
];

// ----------------------------------------------------------------
// Announcements
// ----------------------------------------------------------------

export const mockAnnouncements: Announcement[] = [
  {
    id: 'ann-001',
    title: 'Platform Maintenance Notice',
    description: 'Scheduled maintenance on April 2nd from 2:00 AM to 4:00 AM IST. Some services may be temporarily unavailable during this window.',
    type: 'Info',
    status: 'Active',
    display: 'Top Banner Bar',
    dateRange: '28 Mar - 03 Apr 2026',
    barColor: 'bg-blue-500',
  },
  {
    id: 'ann-002',
    title: 'Delivery Delays in North India',
    description: 'Due to weather conditions, deliveries to Delhi NCR, Punjab, and Haryana may experience 2-3 day delays. We apologize for the inconvenience.',
    type: 'Warning',
    status: 'Active',
    display: 'Checkout Page + Cart',
    dateRange: '25 Mar - 05 Apr 2026',
    barColor: 'bg-yellow-400',
  },
  {
    id: 'ann-003',
    title: 'Holi Festival Special Sale',
    description: 'Celebrate Holi with exclusive deals! Use code HOLI2026 for extra 15% off on all categories. Limited time offer for registered users.',
    type: 'Promotion',
    status: 'Scheduled',
    display: 'Homepage Popup + All Pages',
    dateRange: '10 Apr - 20 Apr 2026',
    barColor: 'bg-orange-500',
  },
];

// ----------------------------------------------------------------
// Combined
// ----------------------------------------------------------------

export const mockCmsData: CmsData = {
  stats: mockStats,
  banners: mockBanners,
  pages: mockPages,
  announcements: mockAnnouncements,
};
