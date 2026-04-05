'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import {
  Image,
  FileText,
  Megaphone,
  Plus,
  ChevronDown,
  Eye,
  Pencil,
  Trash2,
  Calendar,
  Clock,
  Power,
  RotateCw,
  RefreshCw,
  AlertCircle,
  Inbox,
  MapPin,
  Info,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  Mail,
  ShieldCheck,
  Newspaper,
  HelpCircle,
  Truck,
} from 'lucide-react';
import { cn, Skeleton } from '@homebase/ui';

import { useCmsData } from '../hooks/use-cms';
import type { Banner, StaticPage, Announcement, CmsData } from '../types';
import type { BannerStatus, AnnouncementType, AnnouncementStatus, PageStatus } from '../types';

// ----------------------------------------------------------------
// TEXT Constants
// ----------------------------------------------------------------

const PAGE_TITLE = 'Content Management';
const PAGE_SUBTITLE = 'Manage banners, static pages, and announcements across the storefront';
const CREATE_NEW = 'Create New';

const TAB_BANNERS = 'Banners';
const TAB_PAGES = 'Pages';
const TAB_ANNOUNCEMENTS = 'Announcements';

const BANNERS_HEADING = 'Promotional Banners';
const BANNERS_SUBTITLE = 'Manage hero banners, category banners, and sidebar promotions';
const ADD_BANNER = 'Add New Banner';

const PAGES_HEADING = 'Static Pages';
const PAGES_SUBTITLE = 'Manage informational and policy pages on your storefront';
const ADD_PAGE = 'Add New Page';

const ANNOUNCEMENTS_HEADING = 'Announcements';
const ANNOUNCEMENTS_SUBTITLE = 'Manage site-wide notification bars, popups, and promotional alerts';
const ADD_ANNOUNCEMENT = 'Add New Announcement';

const STAT_BANNERS_LABEL = 'Total Banners';
const STAT_PAGES_LABEL = 'Static Pages';
const STAT_ANNOUNCEMENTS_LABEL = 'Announcements';
const STAT_VIEWS_LABEL = 'Content Views (30d)';

const ERROR_TITLE = 'Failed to load content';
const ERROR_SUBTITLE = 'Please check your connection and try again.';
const RETRY = 'Retry';

const EMPTY_TITLE = 'No content available';
const EMPTY_SUBTITLE = 'Content will appear here once created.';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

type CmsTab = 'banners' | 'pages' | 'announcements';

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

function getBannerStatusStyle(status: BannerStatus) {
  switch (status) {
    case 'Active':
      return 'bg-green-50 text-green-600';
    case 'Scheduled':
      return 'bg-blue-50 text-blue-600';
    case 'Expired':
      return 'bg-red-50 text-red-600';
  }
}

function getPageStatusStyle(status: PageStatus) {
  switch (status) {
    case 'Published':
      return 'bg-green-50 text-green-600';
    case 'Draft':
      return 'bg-yellow-50 text-yellow-500';
  }
}

function getAnnouncementTypeConfig(type: AnnouncementType) {
  switch (type) {
    case 'Info':
      return { icon: Info, bg: 'bg-blue-50', text: 'text-blue-600' };
    case 'Warning':
      return { icon: AlertTriangle, bg: 'bg-yellow-50', text: 'text-yellow-600' };
    case 'Promotion':
      return { icon: Sparkles, bg: 'bg-orange-50', text: 'text-orange-600' };
  }
}

function getAnnouncementStatusStyle(status: AnnouncementStatus) {
  switch (status) {
    case 'Active':
      return 'bg-green-50 text-green-600';
    case 'Scheduled':
      return 'bg-blue-50 text-blue-600';
  }
}

function getPageIcon(title: string) {
  switch (title) {
    case 'About Us':
      return FileText;
    case 'Contact Us':
      return Mail;
    case 'Privacy Policy':
      return ShieldCheck;
    case 'Terms & Conditions':
      return Newspaper;
    case 'FAQ':
      return HelpCircle;
    case 'Shipping Information':
      return Truck;
    default:
      return FileText;
  }
}

// ----------------------------------------------------------------
// Loading State
// ----------------------------------------------------------------

function CmsSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300" role="status" aria-label="Loading content management">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-8 w-12" />
            <Skeleton className="mt-1 h-3 w-24" />
          </div>
        ))}
      </div>

      {/* Tab content skeleton */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex gap-6 border-b border-gray-200 px-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-28" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-5 p-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
              <Skeleton className="h-40 w-full" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">Loading content data...</span>
    </div>
  );
}

// ----------------------------------------------------------------
// Error State
// ----------------------------------------------------------------

function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <section
      className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-12"
      role="alert"
      aria-live="assertive"
    >
      <AlertCircle className="mb-4 h-12 w-12 text-red-400" aria-hidden="true" />
      <h2 className="text-lg font-semibold text-gray-900">{message}</h2>
      <p className="mt-1 text-sm text-gray-500">{ERROR_SUBTITLE}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
      >
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        {RETRY}
      </button>
    </section>
  );
}

// ----------------------------------------------------------------
// Empty State
// ----------------------------------------------------------------

function EmptyState() {
  return (
    <section className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-12">
      <Inbox className="mb-4 h-12 w-12 text-gray-300" aria-hidden="true" />
      <h2 className="text-lg font-semibold text-gray-900">{EMPTY_TITLE}</h2>
      <p className="mt-1 text-sm text-gray-500">{EMPTY_SUBTITLE}</p>
    </section>
  );
}

// ----------------------------------------------------------------
// Stats Cards
// ----------------------------------------------------------------

function StatsCards({ data }: { data: CmsData }) {
  const { stats } = data;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Banners */}
      <div className="group rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
            <Image className="h-5 w-5 text-orange-500" aria-hidden="true" />
          </div>
          <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-bold text-green-600">
            {stats.activeBanners} Active
          </span>
        </div>
        <p className="text-2xl font-bold text-gray-900">{stats.totalBanners}</p>
        <p className="mt-1 text-xs text-gray-500">{STAT_BANNERS_LABEL}</p>
      </div>

      {/* Static Pages */}
      <div className="group rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
            <FileText className="h-5 w-5 text-blue-500" aria-hidden="true" />
          </div>
          <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-bold text-green-600">
            {stats.publishedPages} Published
          </span>
        </div>
        <p className="text-2xl font-bold text-gray-900">{stats.totalPages}</p>
        <p className="mt-1 text-xs text-gray-500">{STAT_PAGES_LABEL}</p>
      </div>

      {/* Announcements */}
      <div className="group rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
            <Megaphone className="h-5 w-5 text-purple-500" aria-hidden="true" />
          </div>
          <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-bold text-green-600">
            {stats.activeAnnouncements} Active
          </span>
        </div>
        <p className="text-2xl font-bold text-gray-900">{stats.totalAnnouncements}</p>
        <p className="mt-1 text-xs text-gray-500">{STAT_ANNOUNCEMENTS_LABEL}</p>
      </div>

      {/* Content Views */}
      <div className="group rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
            <Eye className="h-5 w-5 text-green-500" aria-hidden="true" />
          </div>
          <span className="flex items-center gap-1 rounded-full bg-orange-50 px-2 py-1 text-[10px] font-medium text-orange-500">
            <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            {stats.contentViewsChange}
          </span>
        </div>
        <p className="text-2xl font-bold text-gray-900">{stats.contentViews}</p>
        <p className="mt-1 text-xs text-gray-500">{STAT_VIEWS_LABEL}</p>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Banner Card
// ----------------------------------------------------------------

function BannerCard({ banner }: { banner: Banner }) {
  const isActive = banner.status === 'Active';
  const isExpired = banner.status === 'Expired';
  const isScheduled = banner.status === 'Scheduled';

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
      {/* Gradient preview */}
      <div className={cn('relative flex h-40 items-center justify-center', banner.gradient)}>
        <div className="text-center text-white">
          <Image className="mx-auto mb-2 h-10 w-10 opacity-60" strokeWidth={1} aria-hidden="true" />
          <p className="text-sm font-medium opacity-80">{banner.dimensions}</p>
        </div>
        <span className="absolute right-3 top-3 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
          {banner.position}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900">{banner.title}</h3>
            <p className="mt-1 text-xs text-gray-500">Position: {banner.position}</p>
          </div>
          <span className={cn('shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold', getBannerStatusStyle(banner.status))}>
            {banner.status}
          </span>
        </div>

        {/* Meta info */}
        <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            {banner.dateRange}
          </span>
          {banner.scheduledLabel ? (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {banner.scheduledLabel}
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
              {banner.views}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-orange-50 hover:text-orange-500"
            aria-label={`Edit ${banner.title}`}
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            Edit
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-600"
            aria-label={`Delete ${banner.title}`}
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            Delete
          </button>
          {isActive && (
            <button
              type="button"
              className="ml-auto flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-600 transition hover:bg-yellow-50 hover:text-yellow-500"
              aria-label={`Deactivate ${banner.title}`}
            >
              <Power className="h-3.5 w-3.5" aria-hidden="true" />
              Deactivate
            </button>
          )}
          {isScheduled && (
            <button
              type="button"
              className="ml-auto flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-500 transition hover:bg-green-50 hover:text-green-600"
              aria-label={`Activate ${banner.title}`}
            >
              <Power className="h-3.5 w-3.5" aria-hidden="true" />
              Activate
            </button>
          )}
          {isExpired && (
            <button
              type="button"
              className="ml-auto flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-500 transition hover:bg-green-50 hover:text-green-600"
              aria-label={`Reactivate ${banner.title}`}
            >
              <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
              Reactivate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Banners Tab
// ----------------------------------------------------------------

function BannersTab({ banners }: { banners: Banner[] }) {
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{BANNERS_HEADING}</h2>
          <p className="mt-0.5 text-xs text-gray-500">{BANNERS_SUBTITLE}</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium transition hover:border-orange-300 hover:text-orange-500"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {ADD_BANNER}
        </button>
      </div>

      {banners.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {banners.map((b) => (
            <BannerCard key={b.id} banner={b} />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-sm text-gray-400">No banners found</div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------
// Page Row
// ----------------------------------------------------------------

function PageRow({ page }: { page: StaticPage }) {
  const Icon = getPageIcon(page.title);

  return (
    <tr className="border-b border-gray-50 transition-colors hover:bg-orange-50/40">
      <td className="py-4 pl-4">
        <div className="flex items-center gap-3">
          <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', page.iconBg)}>
            <Icon className={cn('h-4 w-4', page.iconColor)} aria-hidden="true" />
          </div>
          <span className="text-sm font-semibold text-gray-900">{page.title}</span>
        </div>
      </td>
      <td className="py-4">
        <code className="rounded bg-gray-50 px-2 py-1 font-mono text-xs text-gray-600">{page.slug}</code>
      </td>
      <td className="py-4">
        <span className={cn('rounded-full px-2.5 py-1 text-[10px] font-bold', getPageStatusStyle(page.status))}>
          {page.status}
        </span>
      </td>
      <td className="py-4 text-sm text-gray-500">{page.lastModified}</td>
      <td className="py-4 pr-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-orange-50 hover:text-orange-500"
            title="Edit"
            aria-label={`Edit ${page.title}`}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-blue-50 hover:text-blue-500"
            title="Preview"
            aria-label={`Preview ${page.title}`}
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
            title="Delete"
            aria-label={`Delete ${page.title}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ----------------------------------------------------------------
// Pages Tab
// ----------------------------------------------------------------

function PagesTab({ pages }: { pages: StaticPage[] }) {
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{PAGES_HEADING}</h2>
          <p className="mt-0.5 text-xs text-gray-500">{PAGES_SUBTITLE}</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium transition hover:border-orange-300 hover:text-orange-500"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {ADD_PAGE}
        </button>
      </div>

      {pages.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-3 pl-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400">Page Title</th>
                <th className="pb-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400">URL Slug</th>
                <th className="pb-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400">Status</th>
                <th className="pb-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400">Last Modified</th>
                <th className="pb-3 pr-4 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => (
                <PageRow key={p.id} page={p} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-8 text-center text-sm text-gray-400">No pages found</div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------
// Announcement Card
// ----------------------------------------------------------------

function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const typeConfig = getAnnouncementTypeConfig(announcement.type);
  const TypeIcon = typeConfig.icon;
  const isActive = announcement.status === 'Active';

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
      {/* Colored top bar */}
      <div className={cn('h-2', announcement.barColor)} />

      <div className="p-5">
        {/* Type + Status badges */}
        <div className="mb-3 flex items-start justify-between">
          <span className={cn('flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold', typeConfig.bg, typeConfig.text)}>
            <TypeIcon className="h-3 w-3" aria-hidden="true" />
            {announcement.type}
          </span>
          <span className={cn('rounded-full px-2.5 py-1 text-[10px] font-bold', getAnnouncementStatusStyle(announcement.status))}>
            {announcement.status}
          </span>
        </div>

        {/* Title + description */}
        <h3 className="mb-1.5 text-sm font-bold text-gray-900">{announcement.title}</h3>
        <p className="mb-4 text-xs leading-relaxed text-gray-500">{announcement.description}</p>

        {/* Meta info */}
        <div className="mb-4 space-y-2 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Display: {announcement.display}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{announcement.dateRange}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-orange-50 hover:text-orange-500"
            aria-label={`Edit ${announcement.title}`}
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            Edit
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-600"
            aria-label={`Delete ${announcement.title}`}
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            Delete
          </button>
          {isActive ? (
            <button
              type="button"
              className="ml-auto flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-600 transition hover:bg-yellow-50 hover:text-yellow-500"
              aria-label={`Deactivate ${announcement.title}`}
            >
              <Power className="h-3.5 w-3.5" aria-hidden="true" />
              Deactivate
            </button>
          ) : (
            <button
              type="button"
              className="ml-auto flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-500 transition hover:bg-green-50 hover:text-green-600"
              aria-label={`Activate ${announcement.title}`}
            >
              <Power className="h-3.5 w-3.5" aria-hidden="true" />
              Activate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Announcements Tab
// ----------------------------------------------------------------

function AnnouncementsTab({ announcements }: { announcements: Announcement[] }) {
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{ANNOUNCEMENTS_HEADING}</h2>
          <p className="mt-0.5 text-xs text-gray-500">{ANNOUNCEMENTS_SUBTITLE}</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium transition hover:border-orange-300 hover:text-orange-500"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {ADD_ANNOUNCEMENT}
        </button>
      </div>

      {announcements.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {announcements.map((a) => (
            <AnnouncementCard key={a.id} announcement={a} />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-sm text-gray-400">No announcements found</div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------

export function PageList() {
  const [activeTab, setActiveTab] = useState<CmsTab>('banners');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const cmsQuery = useCmsData();

  const handleRetry = useCallback(() => {
    cmsQuery.refetch();
  }, [cmsQuery]);

  // ---- Loading ----
  if (cmsQuery.isLoading) return <CmsSkeleton />;

  // ---- Error ----
  if (cmsQuery.isError) return <ErrorBanner message={ERROR_TITLE} onRetry={handleRetry} />;

  // ---- Empty ----
  if (!cmsQuery.data) return <EmptyState />;

  const { banners, pages, announcements, stats } = cmsQuery.data;

  const tabConfig: { key: CmsTab; label: string; count: number }[] = [
    { key: 'banners', label: TAB_BANNERS, count: banners.length },
    { key: 'pages', label: TAB_PAGES, count: pages.length },
    { key: 'announcements', label: TAB_ANNOUNCEMENTS, count: announcements.length },
  ];

  return (
    <div className="space-y-8">
      {/* ================================================================
          Page Header
          ================================================================ */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{PAGE_TITLE}</h1>
          <p className="mt-1 text-sm text-gray-500">{PAGE_SUBTITLE}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Create New Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
              className="flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              {CREATE_NEW}
              <ChevronDown className="ml-1 h-3.5 w-3.5" aria-hidden="true" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-xl border border-gray-100 bg-white py-2 shadow-lg">
                <button type="button" className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <Image className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  Banner
                </button>
                <button type="button" className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <FileText className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  Page
                </button>
                <button type="button" className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <Megaphone className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  Announcement
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================================================================
          Related Navigation
          ================================================================ */}
      <nav className="flex items-center gap-2" aria-label="Related pages">
        <span className="text-xs text-gray-400">Related:</span>
        <Link
          href="/cms/policies"
          className="rounded-full bg-orange-50 px-3 py-1 text-xs text-orange-500 transition hover:bg-orange-100"
        >
          Policies
        </Link>
      </nav>

      {/* ================================================================
          Stats Cards
          ================================================================ */}
      <StatsCards data={cmsQuery.data} />

      {/* ================================================================
          Tabbed Content Panel
          ================================================================ */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* Tab bar */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex items-center gap-6">
            {tabConfig.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveTab(t.key)}
                className={cn(
                  '-mb-px border-b-2 py-4 text-sm font-semibold transition',
                  activeTab === t.key
                    ? 'border-orange-500 text-orange-500'
                    : 'border-transparent text-gray-400 hover:text-gray-600',
                )}
                aria-current={activeTab === t.key ? 'page' : undefined}
              >
                {t.label}
                <span
                  className={cn(
                    'ml-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold',
                    activeTab === t.key
                      ? 'bg-orange-50 text-orange-500'
                      : 'bg-gray-100 text-gray-500',
                  )}
                >
                  {t.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        {activeTab === 'banners' && <BannersTab banners={banners} />}
        {activeTab === 'pages' && <PagesTab pages={pages} />}
        {activeTab === 'announcements' && <AnnouncementsTab announcements={announcements} />}
      </div>
    </div>
  );
}
