'use client';

import { useState, useCallback } from 'react';
import {
  Store,
  CheckCircle2,
  AlertTriangle,
  Ban,
  FileText,
  AlertCircle,
  RefreshCw,
  Inbox,
  CheckCircle,
  XCircle,
  Landmark,
  Contact,
} from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';
import { Skeleton } from '@homebase/ui';

import {
  useComplianceStats,
  useSellerCompliance,
  useDocumentQueue,
} from '../hooks/use-compliance';
import type {
  ComplianceTab,
  GstPanStatus,
  BankVerified,
  OverallComplianceStatus,
  DocIconColor,
  SellerCompliance,
} from '../types';

/* ------------------------------------------------------------------ */
/*  Text Constants                                                     */
/* ------------------------------------------------------------------ */

const TEXT = {
  pageTitle: 'Compliance & KYC',
  pageDescription: 'Monitor seller verification status, review documents, and manage compliance',
  generateReport: 'Generate Report',
  allSellers: 'All Sellers',
  registeredOnPlatform: 'Registered on platform',
  fullyCompliant: 'Fully Compliant',
  partiallyCompliant: 'Partially Compliant',
  nonCompliant: 'Non-Compliant',
  pendingReview: 'Pending Review',
  colSellerName: 'Seller Name',
  colStoreName: 'Store Name',
  colGstStatus: 'GST Status',
  colPanStatus: 'PAN Status',
  colBankVerified: 'Bank Verified',
  colDocuments: 'Documents',
  colOverallStatus: 'Overall Status',
  colActions: 'Actions',
  review: 'Review',
  approve: 'Approve',
  reject: 'Reject',
  showing: 'Showing',
  of: 'of',
  sellers: 'sellers',
  previous: 'Previous',
  next: 'Next',
  docQueueTitle: 'Document Review Queue',
  docQueueDescription: 'Pending documents requiring admin verification',
  pending: 'Pending',
  view: 'View',
  uploaded: 'Uploaded:',
  errorTitle: 'Failed to load compliance data',
  errorDescription: 'Please check your connection and try again.',
  retry: 'Retry',
  emptyTitle: 'No compliance data available',
  emptyDescription: 'Data will appear here once available.',
  loadingLabel: 'Loading compliance data',
} as const;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getGstPanBadge(status: GstPanStatus) {
  switch (status) {
    case 'Verified':
      return { bg: 'bg-green-100', text: 'text-green-700' };
    case 'Pending':
      return { bg: 'bg-yellow-100', text: 'text-yellow-700' };
    case 'Expired':
      return { bg: 'bg-red-100', text: 'text-red-700' };
  }
}

function getOverallStatusStyle(status: OverallComplianceStatus) {
  switch (status) {
    case 'Fully Compliant':
      return { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' };
    case 'Partially Compliant':
      return { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' };
    case 'Non-Compliant':
      return { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' };
  }
}

function getDocIconBg(color: DocIconColor) {
  switch (color) {
    case 'blue': return 'bg-blue-50';
    case 'purple': return 'bg-purple-50';
    case 'green': return 'bg-green-50';
    case 'orange': return 'bg-orange-50';
    case 'red': return 'bg-red-50';
  }
}

function getDocIconText(color: DocIconColor) {
  switch (color) {
    case 'blue': return 'text-blue-600';
    case 'purple': return 'text-purple-600';
    case 'green': return 'text-green-600';
    case 'orange': return 'text-orange-600';
    case 'red': return 'text-red-600';
  }
}

function getDocIcon(color: DocIconColor) {
  switch (color) {
    case 'blue': return FileText;
    case 'purple': return Contact;
    case 'green': return Landmark;
    case 'orange': return FileText;
    case 'red': return Contact;
  }
}

function filterSellers(sellers: SellerCompliance[], tab: ComplianceTab): SellerCompliance[] {
  switch (tab) {
    case 'fully-compliant':
      return sellers.filter((s) => s.overallStatus === 'Fully Compliant');
    case 'partially-compliant':
      return sellers.filter((s) => s.overallStatus === 'Partially Compliant');
    case 'non-compliant':
      return sellers.filter((s) => s.overallStatus === 'Non-Compliant');
    case 'pending-review':
      return [];
    default:
      return sellers;
  }
}

/* ------------------------------------------------------------------ */
/*  Loading State                                                      */
/* ------------------------------------------------------------------ */

function ComplianceSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300" role="status" aria-label={TEXT.loadingLabel}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-52" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-9 w-16" />
            <Skeleton className="mt-1 h-3 w-28" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6">
          <div className="flex items-center gap-1 py-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-32 rounded-t-lg" />
            ))}
          </div>
        </div>
        <div className="p-0">
          <Skeleton className="h-10 w-full" />
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      </div>

      {/* Document queue skeleton */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-5">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="mt-1 h-3 w-72" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between border-b border-gray-100 px-6 py-4 last:border-0">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-7 w-14 rounded-lg" />
              <Skeleton className="h-7 w-18 rounded-lg" />
              <Skeleton className="h-7 w-14 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      <span className="sr-only">Loading compliance data...</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Error State                                                        */
/* ------------------------------------------------------------------ */

interface ErrorBannerProps {
  message: string;
  onRetry: () => void;
}

function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <section
      className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-12"
      role="alert"
      aria-live="assertive"
    >
      <AlertCircle className="mb-4 h-12 w-12 text-red-400" aria-hidden="true" />
      <h2 className="text-lg font-semibold text-gray-900">{message}</h2>
      <p className="mt-1 text-sm text-gray-500">{TEXT.errorDescription}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
      >
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        {TEXT.retry}
      </button>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty State                                                        */
/* ------------------------------------------------------------------ */

function EmptyState() {
  return (
    <section className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-12">
      <Inbox className="mb-4 h-12 w-12 text-gray-300" aria-hidden="true" />
      <h2 className="text-lg font-semibold text-gray-900">{TEXT.emptyTitle}</h2>
      <p className="mt-1 text-sm text-gray-500">{TEXT.emptyDescription}</p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function PolicyList() {
  const statsQuery = useComplianceStats();
  const sellersQuery = useSellerCompliance();
  const queueQuery = useDocumentQueue();
  const [activeTab, setActiveTab] = useState<ComplianceTab>('all');

  const handleRetry = useCallback(() => {
    statsQuery.refetch();
    sellersQuery.refetch();
    queueQuery.refetch();
  }, [statsQuery, sellersQuery, queueQuery]);

  // ---- Loading ----
  const isLoading = statsQuery.isLoading && sellersQuery.isLoading;
  if (isLoading) return <ComplianceSkeleton />;

  // ---- Error ----
  const isError = statsQuery.isError && sellersQuery.isError;
  if (isError) return <ErrorBanner message={TEXT.errorTitle} onRetry={handleRetry} />;

  // ---- Empty ----
  if (!statsQuery.data && !sellersQuery.data) return <EmptyState />;

  const stats = statsQuery.data;
  const sellers = sellersQuery.data ?? [];
  const docQueue = queueQuery.data ?? [];
  const filteredSellers = filterSellers(sellers, activeTab);

  const tabs: { key: ComplianceTab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: stats?.totalSellers ?? sellers.length },
    { key: 'fully-compliant', label: TEXT.fullyCompliant, count: stats?.fullyCompliant ?? 0 },
    { key: 'partially-compliant', label: TEXT.partiallyCompliant, count: stats?.partiallyCompliant ?? 0 },
    { key: 'non-compliant', label: TEXT.nonCompliant, count: stats?.nonCompliant ?? 0 },
    { key: 'pending-review', label: TEXT.pendingReview, count: stats?.pendingReview ?? 0 },
  ];

  return (
    <div className="space-y-8">
      {/* ================================================================
          Page Header
          ================================================================ */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{TEXT.pageTitle}</h1>
          <p className="mt-1 text-sm text-gray-500">{TEXT.pageDescription}</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
        >
          <FileText className="h-4 w-4" aria-hidden="true" />
          {TEXT.generateReport}
        </button>
      </div>

      {/* ================================================================
          Stats Cards
          ================================================================ */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Sellers */}
        <div className="group rounded-xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Store className="h-5 w-5 text-blue-600" aria-hidden="true" />
            </div>
            <span className="text-xs font-medium text-gray-400">{TEXT.allSellers}</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.totalSellers ?? '--'}</p>
          <p className="mt-1 text-xs text-gray-500">{TEXT.registeredOnPlatform}</p>
        </div>

        {/* Fully Compliant */}
        <div className="group rounded-xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <CheckCircle2 className="h-5 w-5 text-green-600" aria-hidden="true" />
            </div>
            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
              {stats?.fullyCompliantPercent ?? '--'}
            </span>
          </div>
          <p className="text-3xl font-bold text-green-600">{stats?.fullyCompliant ?? '--'}</p>
          <p className="mt-1 text-xs text-gray-500">{TEXT.fullyCompliant}</p>
        </div>

        {/* Partially Compliant */}
        <div className="group rounded-xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-50">
              <AlertTriangle className="h-5 w-5 text-yellow-600" aria-hidden="true" />
            </div>
            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-700">
              {stats?.partiallyCompliantPercent ?? '--'}
            </span>
          </div>
          <p className="text-3xl font-bold text-yellow-600">{stats?.partiallyCompliant ?? '--'}</p>
          <p className="mt-1 text-xs text-gray-500">{TEXT.partiallyCompliant}</p>
        </div>

        {/* Non-Compliant */}
        <div className="group rounded-xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
              <Ban className="h-5 w-5 text-red-600" aria-hidden="true" />
            </div>
            <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
              {stats?.nonCompliantPercent ?? '--'}
            </span>
          </div>
          <p className="text-3xl font-bold text-red-600">{stats?.nonCompliant ?? '--'}</p>
          <p className="mt-1 text-xs text-gray-500">{TEXT.nonCompliant}</p>
        </div>
      </div>

      {/* ================================================================
          Filter Tabs + Compliance Table
          ================================================================ */}
      <div className="rounded-xl border border-gray-200 bg-white">
        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="-mb-px flex items-center gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'whitespace-nowrap rounded-t-lg border-b-2 px-4 py-3 text-sm font-medium transition-all',
                  activeTab === tab.key
                    ? 'border-orange-500 bg-orange-50 text-orange-500'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                )}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                <th className="px-6 py-3">{TEXT.colSellerName}</th>
                <th className="px-6 py-3">{TEXT.colStoreName}</th>
                <th className="px-6 py-3 text-center">{TEXT.colGstStatus}</th>
                <th className="px-6 py-3 text-center">{TEXT.colPanStatus}</th>
                <th className="px-6 py-3 text-center">{TEXT.colBankVerified}</th>
                <th className="px-6 py-3 text-center">{TEXT.colDocuments}</th>
                <th className="px-6 py-3 text-center">{TEXT.colOverallStatus}</th>
                <th className="px-6 py-3 text-center">{TEXT.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSellers.map((seller) => {
                const gstBadge = getGstPanBadge(seller.gstStatus);
                const panBadge = getGstPanBadge(seller.panStatus);
                const statusStyle = getOverallStatusStyle(seller.overallStatus);
                const docsColor = seller.docsCompleted < seller.docsTotal / 2 ? 'text-red-600' : 'text-gray-700';

                return (
                  <tr key={seller.id} className="transition-colors duration-150 hover:bg-orange-50/60">
                    {/* Seller Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                            seller.avatarBg,
                            seller.avatarText
                          )}
                          aria-hidden="true"
                        >
                          {seller.initials}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{seller.sellerName}</p>
                          <p className="text-xs text-gray-500">ID: {seller.sellerId}</p>
                        </div>
                      </div>
                    </td>

                    {/* Store Name */}
                    <td className="px-6 py-4 text-gray-700">{seller.storeName}</td>

                    {/* GST Status */}
                    <td className="px-6 py-4 text-center">
                      <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', gstBadge.bg, gstBadge.text)}>
                        {seller.gstStatus}
                      </span>
                    </td>

                    {/* PAN Status */}
                    <td className="px-6 py-4 text-center">
                      <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', panBadge.bg, panBadge.text)}>
                        {seller.panStatus}
                      </span>
                    </td>

                    {/* Bank Verified */}
                    <td className="px-6 py-4 text-center">
                      {seller.bankVerified === 'verified' && (
                        <CheckCircle className="mx-auto h-5 w-5 text-green-500" aria-label="Verified" />
                      )}
                      {seller.bankVerified === 'rejected' && (
                        <XCircle className="mx-auto h-5 w-5 text-red-400" aria-label="Rejected" />
                      )}
                      {seller.bankVerified === 'pending' && (
                        <AlertCircle className="mx-auto h-5 w-5 text-yellow-400" aria-label="Pending" />
                      )}
                    </td>

                    {/* Documents */}
                    <td className="px-6 py-4 text-center">
                      <span className={cn('font-medium', docsColor)}>
                        {seller.docsCompleted}/{seller.docsTotal}
                      </span>
                    </td>

                    {/* Overall Status */}
                    <td className="px-6 py-4 text-center">
                      <span className={cn('inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold', statusStyle.bg, statusStyle.text)}>
                        <span className={cn('h-1.5 w-1.5 rounded-full', statusStyle.dot)} />
                        {seller.overallStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {seller.actions.includes('Review') && (
                          <button
                            type="button"
                            className="rounded-lg border border-orange-200 px-3 py-1.5 text-xs font-semibold text-orange-500 transition hover:bg-orange-50 hover:text-orange-700"
                          >
                            {TEXT.review}
                          </button>
                        )}
                        {seller.actions.includes('Approve') && (
                          <button
                            type="button"
                            className="rounded-lg border border-green-200 px-3 py-1.5 text-xs font-semibold text-green-600 transition hover:bg-green-50 hover:text-green-800"
                          >
                            {TEXT.approve}
                          </button>
                        )}
                        {seller.actions.includes('Reject') && (
                          <button
                            type="button"
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 hover:text-red-800"
                          >
                            {TEXT.reject}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
          <p className="text-sm text-gray-500">
            {TEXT.showing}{' '}
            <span className="font-medium text-gray-700">1 - {filteredSellers.length}</span>
            {' '}{TEXT.of}{' '}
            <span className="font-medium text-gray-700">{stats?.totalSellers ?? sellers.length}</span>
            {' '}{TEXT.sellers}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-400"
            >
              {TEXT.previous}
            </button>
            <button
              type="button"
              className="rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-medium text-white"
            >
              1
            </button>
            <button
              type="button"
              className="rounded-lg px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-100"
            >
              2
            </button>
            <button
              type="button"
              className="rounded-lg px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-100"
            >
              3
            </button>
            <span className="px-2 text-gray-400">...</span>
            <button
              type="button"
              className="rounded-lg px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-100"
            >
              30
            </button>
            <button
              type="button"
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-100"
            >
              {TEXT.next}
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================
          Document Review Queue
          ================================================================ */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{TEXT.docQueueTitle}</h2>
            <p className="mt-0.5 text-sm text-gray-500">{TEXT.docQueueDescription}</p>
          </div>
          <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
            {docQueue.length} {TEXT.pending}
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {docQueue.map((doc) => {
            const IconComponent = getDocIcon(doc.iconColor);
            return (
              <div
                key={doc.id}
                className="flex items-center justify-between px-6 py-4 transition-shadow duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
              >
                <div className="flex items-center gap-4">
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', getDocIconBg(doc.iconColor))}>
                    <IconComponent className={cn('h-5 w-5', getDocIconText(doc.iconColor))} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{doc.documentName}</p>
                    <p className="text-xs text-gray-500">{doc.sellerInfo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <p className="text-xs text-gray-400">{TEXT.uploaded} {doc.uploadDate}</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-gray-800"
                    >
                      {TEXT.view}
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-green-200 px-3 py-1.5 text-xs font-semibold text-green-600 transition hover:bg-green-50 hover:text-green-800"
                    >
                      {TEXT.approve}
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 hover:text-red-800"
                    >
                      {TEXT.reject}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
