'use client';

import Link from 'next/link';
import {
  ArrowLeft, ChevronRight, Ban, Mail, ExternalLink, Download,
  CheckCircle, AlertCircle, AlertTriangle, Clock, Star, Store,
  TrendingUp, Phone, FileUp, SlidersHorizontal,
} from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';
import { SectionSkeleton, ErrorSection, formatPriceRupees, formatNumber } from '@homebase/shared';
import { useSellerAdminDetail, useSupplierMutation } from '../hooks/use-supplier';
import { getRevenueTrendMax, getDisputeBreakdown } from '../services/supplier-detail-adapter';
import type { SellerDetailData, SellerHealthMetric, SellerComplianceDocument, SellerRevenueTrend } from '../types';

// ----------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------

function StatusBadge({ label, color }: { label: string; color: string }) {
  const map: Record<string, string> = {
    green: 'bg-green-50 text-green-700',
    blue: 'bg-blue-50 text-blue-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    red: 'bg-red-50 text-red-700',
    gray: 'bg-gray-50 text-gray-600',
  };
  const dotMap: Record<string, string> = {
    green: 'bg-green-500', blue: 'bg-blue-500', yellow: 'bg-yellow-500', red: 'bg-red-500', gray: 'bg-gray-400',
  };
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium', map[color] ?? map.gray)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', dotMap[color] ?? dotMap.gray)} />
      {label}
    </span>
  );
}

function VerifiedBadge({ verified }: { verified: boolean }) {
  return verified ? (
    <span className="flex items-center gap-0.5 text-xs font-semibold text-green-600">
      <CheckCircle className="h-3.5 w-3.5" /> Verified
    </span>
  ) : (
    <span className="flex items-center gap-0.5 text-xs font-semibold text-yellow-600">
      <AlertCircle className="h-3.5 w-3.5" /> Pending
    </span>
  );
}

function HealthMetricCard({ metric }: { metric: SellerHealthMetric }) {
  const bgMap: Record<string, string> = { green: 'bg-green-50', yellow: 'bg-yellow-50', red: 'bg-red-50' };
  const dotMap: Record<string, string> = { green: 'bg-green-500', yellow: 'bg-yellow-500', red: 'bg-red-500' };
  const textMap: Record<string, string> = { green: 'text-green-700', yellow: 'text-yellow-700', red: 'text-red-700' };
  const trackMap: Record<string, string> = { green: 'bg-green-200', yellow: 'bg-yellow-200', red: 'bg-red-200' };
  const barMap: Record<string, string> = { green: 'bg-green-600', yellow: 'bg-yellow-600', red: 'bg-red-600' };

  return (
    <div className={cn('rounded-lg p-3.5', bgMap[metric.status])}>
      <div className="mb-1 flex items-center justify-between">
        <p className="text-xs font-medium text-gray-500">{metric.label}</p>
        <span className={cn('h-2 w-2 rounded-full', dotMap[metric.status])} title={`Status: ${metric.status}`} />
      </div>
      <p className={cn('text-xl font-bold', textMap[metric.status])}>{metric.value}</p>
      <div className={cn('mt-2 h-1 w-full rounded-full', trackMap[metric.status])}>
        <div className={cn('h-1 rounded-full', barMap[metric.status])} style={{ width: `${metric.progressPercent}%` }} />
      </div>
    </div>
  );
}

function ComplianceDocumentStatus({ doc }: { doc: SellerComplianceDocument }) {
  if (doc.status === 'verified') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
        <CheckCircle className="h-3.5 w-3.5" /> Verified
      </span>
    );
  }
  if (doc.status === 'pending') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-700">
        <AlertTriangle className="h-3.5 w-3.5" /> {doc.statusLabel}
      </span>
    );
  }
  // partial
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
      <Clock className="h-3.5 w-3.5" /> {doc.statusLabel}
    </span>
  );
}

function RevenueBar({ item, maxAmount }: { item: SellerRevenueTrend; maxAmount: number }) {
  const heightPct = (item.amount / maxAmount) * 100;
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-end">
      {item.isPeak ? (
        <div className="mb-1 flex items-center gap-1">
          <span className="text-xs font-bold text-orange-600">{'\u20B9'}{item.label}</span>
          <span className="rounded bg-orange-50 px-1.5 py-0.5 text-[9px] font-semibold text-orange-600">Peak</span>
        </div>
      ) : (
        <span className="mb-1 text-xs font-bold text-gray-700">{'\u20B9'}{item.label}</span>
      )}
      <div
        className={cn(
          'group relative w-full cursor-pointer rounded-t-md transition-[height] duration-400',
          item.isPeak ? 'bg-orange-500 ring-2 ring-orange-200' : 'bg-orange-400',
        )}
        style={{ height: `${heightPct}%` }}
      >
        <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-[10px] text-white opacity-0 transition group-hover:opacity-100">
          {'\u20B9'}{item.amount.toLocaleString('en-IN')}{item.isPeak ? ' (Festival)' : ''}
        </div>
      </div>
      <span className={cn('mt-2 text-xs font-medium', item.isPeak ? 'font-semibold text-orange-600' : 'text-gray-500')}>
        {item.month}
      </span>
    </div>
  );
}

// ----------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------

interface SupplierDetailProps {
  id: string;
}

export function SupplierDetail({ id }: SupplierDetailProps) {
  const { data: seller, isLoading, error, refetch } = useSellerAdminDetail(id);
  const mutation = useSupplierMutation();

  // -- 4 states --
  if (isLoading) {
    return (
      <div className="space-y-6" role="status" aria-label="Loading seller details">
        <SectionSkeleton rows={2} />
        <SectionSkeleton rows={6} />
      </div>
    );
  }

  if (error) {
    return <ErrorSection error={error} onRetry={() => refetch()} />;
  }

  if (!seller) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center" role="alert">
        <Store className="h-12 w-12 text-gray-300" />
        <p className="mt-4 text-lg font-semibold text-gray-600">Seller not found</p>
        <Link href="/suppliers" className="mt-4 text-sm font-medium text-orange-600 hover:text-orange-700">Back to Sellers</Link>
      </div>
    );
  }

  const handleAction = (action: string) => {
    mutation.mutate({ id, eventId: action });
  };

  const revenueTrendMax = getRevenueTrendMax(seller.revenueTrend);
  const disputeBreakdown = getDisputeBreakdown(
    seller.disputeHistory.totalDisputes,
    seller.disputeHistory.inFavor,
    seller.disputeHistory.against,
    seller.disputeHistory.open,
  );

  return (
    <article className="space-y-6" aria-label={`Seller: ${seller.storeName}`}>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
        <Link href="/suppliers" className="text-gray-400 hover:text-orange-500">Sellers</Link>
        <ChevronRight className="h-3.5 w-3.5 text-gray-300" aria-hidden="true" />
        <span className="font-medium text-gray-700">{seller.storeName}</span>
      </nav>

      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/suppliers" className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50" aria-label="Back to sellers">
            <ArrowLeft className="h-4 w-4 text-gray-500" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{seller.storeName}</h1>
          <StatusBadge label={seller.status} color={seller.statusColor} />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { if (confirm('Suspend this seller?')) handleAction('suspend'); }}
            disabled={mutation.isPending}
            className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            <Ban className="h-4 w-4" /> Suspend
          </button>
          <button
            onClick={() => handleAction('contact')}
            className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
          >
            <Mail className="h-4 w-4" /> Contact
          </button>
        </div>
      </div>

      {/* Seller Profile Header */}
      <section className="rounded-xl border border-gray-100 bg-white p-6" aria-label="Seller profile">
        <div className="flex items-center gap-5">
          <div className={cn('flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-bold', seller.avatarBg)}>
            {seller.initials}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900">{seller.storeName}</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
                <CheckCircle className="h-3 w-3" /> {seller.tier}
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-4 text-sm text-gray-500">
              <span>Member since {seller.memberSince}</span>
              <span className="h-1 w-1 rounded-full bg-gray-300" />
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-current text-yellow-500" /> {seller.rating} rating
              </span>
              <span className="h-1 w-1 rounded-full bg-gray-300" />
              <span>{seller.productCount} products</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Left 2/3 + Right 1/3 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ===== LEFT COLUMN (2/3) ===== */}
        <div className="space-y-6 lg:col-span-2">

          {/* Seller Health Dashboard */}
          <section className="rounded-xl border border-gray-100 bg-white p-6" aria-label="Seller health dashboard">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Seller Health Dashboard</h3>
              <span className="text-xs font-medium text-gray-400">Updated 2 hrs ago</span>
            </div>
            {/* Health Score Gauge */}
            <div className="mb-6">
              <div className="mb-2 flex items-end justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-400">Overall Health Score</p>
                  <p className="mt-1 text-3xl font-bold text-green-600">
                    {seller.healthScore} <span className="text-base font-medium text-gray-400">/ {seller.healthMaxScore}</span>
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> {seller.healthStanding}
                </span>
              </div>
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="absolute inset-0 rounded-full opacity-20"
                  style={{ background: 'linear-gradient(90deg, #DC2626 0%, #EAB308 40%, #16A34A 70%, #16A34A 100%)' }}
                />
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-green-500 transition-all duration-500"
                  style={{ width: `${(seller.healthScore / seller.healthMaxScore) * 100}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-gray-400">
                <span>0</span>
                <span>Poor &lt;400</span>
                <span>Fair 400-600</span>
                <span>Good 600-800</span>
                <span>{seller.healthMaxScore}</span>
              </div>
            </div>
            {/* Health Metric Cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {seller.healthMetrics.map((metric) => (
                <HealthMetricCard key={metric.label} metric={metric} />
              ))}
            </div>
          </section>

          {/* Store Information */}
          <section className="rounded-xl border border-gray-100 bg-white p-6" aria-label="Store information">
            <h3 className="mb-4 font-semibold text-gray-900">Store Information</h3>
            <dl className="grid grid-cols-2 gap-4">
              <div><dt className="text-xs font-semibold uppercase text-gray-400">Store Name</dt><dd className="mt-1 text-sm font-medium text-gray-900">{seller.storeName}</dd></div>
              <div><dt className="text-xs font-semibold uppercase text-gray-400">Category</dt><dd className="mt-1 text-sm font-medium text-gray-900">{seller.category}</dd></div>
              <div className="col-span-2"><dt className="text-xs font-semibold uppercase text-gray-400">Description</dt><dd className="mt-1 text-sm text-gray-600">{seller.description}</dd></div>
              <div><dt className="text-xs font-semibold uppercase text-gray-400">Contact Email</dt><dd className="mt-1 text-sm text-gray-900">{seller.contactEmail}</dd></div>
              <div><dt className="text-xs font-semibold uppercase text-gray-400">Phone</dt><dd className="mt-1 text-sm text-gray-900">{seller.phone}</dd></div>
              <div className="col-span-2"><dt className="text-xs font-semibold uppercase text-gray-400">Address</dt><dd className="mt-1 text-sm text-gray-900">{seller.address}</dd></div>
            </dl>
          </section>

          {/* Business Information */}
          <section className="rounded-xl border border-gray-100 bg-white p-6" aria-label="Business information">
            <h3 className="mb-4 font-semibold text-gray-900">Business Information</h3>
            <dl className="grid grid-cols-2 gap-4">
              <div><dt className="text-xs font-semibold uppercase text-gray-400">Business Name</dt><dd className="mt-1 text-sm font-medium text-gray-900">{seller.businessName}</dd></div>
              <div><dt className="text-xs font-semibold uppercase text-gray-400">Business Type</dt><dd className="mt-1 text-sm font-medium text-gray-900">{seller.businessType}</dd></div>
              <div>
                <dt className="text-xs font-semibold uppercase text-gray-400">GSTIN</dt>
                <dd className="mt-1 flex items-center gap-2">
                  <span className="rounded bg-gray-50 px-2 py-0.5 font-mono text-sm">{seller.gstin}</span>
                  <VerifiedBadge verified={seller.gstVerified} />
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase text-gray-400">PAN</dt>
                <dd className="mt-1 flex items-center gap-2">
                  <span className="rounded bg-gray-50 px-2 py-0.5 font-mono text-sm">{seller.pan}</span>
                  <VerifiedBadge verified={seller.panVerified} />
                </dd>
              </div>
              <div><dt className="text-xs font-semibold uppercase text-gray-400">Bank Account</dt><dd className="mt-1 text-sm text-gray-900">{seller.bankAccount}</dd></div>
            </dl>
          </section>

          {/* Compliance & Documents */}
          <section className="rounded-xl border border-gray-100 bg-white p-6" aria-label="Compliance and documents">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Compliance & Documents</h3>
              {seller.complianceActionsNeeded > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-semibold text-yellow-700">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {seller.complianceActionsNeeded} Action Needed
                </span>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs uppercase text-gray-400">
                    <th className="pb-3 font-semibold">Document</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {seller.complianceDocuments.map((doc, idx) => (
                    <tr
                      key={doc.name}
                      className={cn(
                        idx < seller.complianceDocuments.length - 1 ? 'border-b border-gray-50' : '',
                        doc.highlight ? 'bg-yellow-50/40' : '',
                      )}
                    >
                      <td className="py-3 font-medium text-gray-900">{doc.name}</td>
                      <td className="py-3"><ComplianceDocumentStatus doc={doc} /></td>
                      <td className={cn('py-3', doc.highlight ? 'font-medium text-yellow-700' : 'text-gray-500')}>{doc.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Products Summary */}
          <section className="rounded-xl border border-gray-100 bg-white p-6" aria-label="Products overview">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Products</h3>
              <Link href="/products" className="text-sm font-medium text-orange-500 hover:underline">View All Products &rarr;</Link>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{seller.totalProducts}</p>
                <p className="mt-1 text-xs text-gray-500">Total</p>
              </div>
              <div className="rounded-lg bg-green-50 p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{seller.activeProducts}</p>
                <p className="mt-1 text-xs text-gray-500">Active</p>
              </div>
              <div className="rounded-lg bg-yellow-50 p-4 text-center">
                <p className="text-2xl font-bold text-yellow-600">{seller.inactiveProducts}</p>
                <p className="mt-1 text-xs text-gray-500">Inactive</p>
              </div>
              <div className="rounded-lg bg-red-50 p-4 text-center">
                <p className="text-2xl font-bold text-red-600">{seller.outOfStock}</p>
                <p className="mt-1 text-xs text-gray-500">Out of Stock</p>
              </div>
            </div>
          </section>

          {/* Recent Orders */}
          <section className="rounded-xl border border-gray-100 bg-white p-6" aria-label="Recent orders">
            <h3 className="mb-4 font-semibold text-gray-900">Recent Orders</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs uppercase text-gray-400">
                    <th className="pb-3 font-semibold">Order ID</th>
                    <th className="pb-3 font-semibold">Customer</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {seller.recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 font-mono text-xs text-orange-600">
                        <Link href={`/orders/${order.id.replace('#', '')}`} className="hover:underline">{order.id}</Link>
                      </td>
                      <td className="py-3">{order.customer}</td>
                      <td className="py-3 font-medium">{formatPriceRupees(order.amount)}</td>
                      <td className="py-3"><StatusBadge label={order.status} color={order.statusColor} /></td>
                      <td className="py-3 text-gray-500">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Dispute & Return History */}
          <section className="rounded-xl border border-gray-100 bg-white p-6" aria-label="Dispute and return history">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Dispute & Return History</h3>
              <span className="rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-400">Last 90 Days</span>
            </div>
            <div className="mb-5 grid grid-cols-3 gap-4">
              {/* Total Disputes */}
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="mb-1 text-xs font-semibold uppercase text-gray-400">Total Disputes</p>
                <p className="text-2xl font-bold text-gray-900">{seller.disputeHistory.totalDisputes}</p>
                <div className="mt-2 flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-green-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> {seller.disputeHistory.inFavor} in favor
                  </span>
                  <span className="flex items-center gap-1 text-red-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> {seller.disputeHistory.against} against
                  </span>
                  <span className="flex items-center gap-1 text-yellow-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" /> {seller.disputeHistory.open} open
                  </span>
                </div>
              </div>
              {/* Returns Rate */}
              <div className="rounded-lg bg-green-50 p-4">
                <p className="mb-1 text-xs font-semibold uppercase text-gray-400">Returns Rate</p>
                <p className="text-2xl font-bold text-green-600">{seller.disputeHistory.returnRate}%</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                  <span className="text-xs font-medium text-green-600">Below {seller.disputeHistory.returnRateThreshold}% threshold</span>
                </div>
              </div>
              {/* Chargebacks */}
              <div className="rounded-lg bg-green-50 p-4">
                <p className="mb-1 text-xs font-semibold uppercase text-gray-400">Chargebacks</p>
                <p className="text-2xl font-bold text-green-600">{seller.disputeHistory.chargebacks}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                  <span className="text-xs font-medium text-green-600">No chargebacks</span>
                </div>
              </div>
            </div>
            {/* Dispute breakdown bar */}
            {seller.disputeHistory.totalDisputes > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-gray-400">Dispute Resolution Breakdown</p>
                <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full bg-green-500" style={{ width: `${disputeBreakdown.inFavorPct}%` }} title={`${seller.disputeHistory.inFavor} resolved in favor`} />
                  <div className="h-full bg-red-400" style={{ width: `${disputeBreakdown.againstPct}%` }} title={`${seller.disputeHistory.against} resolved against`} />
                  <div className="h-full bg-yellow-400" style={{ width: `${disputeBreakdown.openPct}%` }} title={`${seller.disputeHistory.open} open`} />
                </div>
                <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green-500" /> Resolved in favor ({disputeBreakdown.inFavorPct}%)</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-400" /> Resolved against ({disputeBreakdown.againstPct}%)</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-yellow-400" /> Open ({disputeBreakdown.openPct}%)</span>
                </div>
              </div>
            )}
          </section>

          {/* Performance Trend (Revenue Bar Chart) */}
          {seller.revenueTrend.length > 0 && (
            <section className="rounded-xl border border-gray-100 bg-white p-6" aria-label="Performance trend">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Performance Trend</h3>
                <span className="text-xs font-medium text-gray-400">Monthly Revenue (Last 6 Months)</span>
              </div>
              {/* Bar Chart */}
              <div className="flex items-end justify-between gap-3" style={{ height: 180 }}>
                {seller.revenueTrend.map((item) => (
                  <RevenueBar key={item.month} item={item} maxAmount={revenueTrendMax} />
                ))}
              </div>
              {/* Summary row */}
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-500">6-month total: <span className="font-bold text-gray-900">{'\u20B9'}{seller.revenueTrendTotal}</span></span>
                  <span className="h-1 w-1 rounded-full bg-gray-300" />
                  <span className="text-gray-500">Avg monthly: <span className="font-bold text-gray-900">{'\u20B9'}{seller.revenueTrendAvg}</span></span>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                  <TrendingUp className="h-3.5 w-3.5" />
                  {seller.revenueTrendGrowth} vs prev 6 months
                </span>
              </div>
            </section>
          )}

          {/* Performance Metrics */}
          <section className="rounded-xl border border-gray-100 bg-white p-6" aria-label="Performance metrics">
            <h3 className="mb-4 font-semibold text-gray-900">Performance Metrics</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{seller.fulfillmentRate}%</p>
                <p className="mt-1 text-xs text-gray-500">Fulfillment Rate</p>
                <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100">
                  <div className="h-1.5 rounded-full bg-green-500" style={{ width: `${seller.fulfillmentRate}%` }} />
                </div>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{seller.avgRating}</p>
                <p className="mt-1 text-xs text-gray-500">Avg Rating</p>
                <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100">
                  <div className="h-1.5 rounded-full bg-yellow-500" style={{ width: `${(seller.avgRating / 5) * 100}%` }} />
                </div>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{seller.responseTime}</p>
                <p className="mt-1 text-xs text-gray-500">Response Time</p>
                <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100">
                  <div className="h-1.5 rounded-full bg-blue-500" style={{ width: '85%' }} />
                </div>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{seller.returnRate}%</p>
                <p className="mt-1 text-xs text-gray-500">Return Rate</p>
                <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100">
                  <div className="h-1.5 rounded-full bg-orange-500" style={{ width: `${seller.returnRate * 10}%` }} />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ===== RIGHT COLUMN (1/3) ===== */}
        <div className="space-y-6">

          {/* Quick Stats */}
          <section className="rounded-xl border border-gray-100 bg-white p-5" aria-label="Quick stats">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Quick Stats</h3>
            <dl className="space-y-3">
              <div className="flex items-center justify-between"><dt className="text-sm text-gray-500">Revenue</dt><dd className="text-sm font-bold text-gray-900">{formatPriceRupees(seller.revenue)}</dd></div>
              <div className="flex items-center justify-between"><dt className="text-sm text-gray-500">Orders</dt><dd className="text-sm font-bold text-gray-900">{formatNumber(seller.totalOrders)}</dd></div>
              <div className="flex items-center justify-between"><dt className="text-sm text-gray-500">Products</dt><dd className="text-sm font-bold text-gray-900">{seller.productCount}</dd></div>
              <div className="flex items-center justify-between"><dt className="text-sm text-gray-500">Rating</dt><dd className="text-sm font-bold text-yellow-600">{seller.rating} {'\u2605'}</dd></div>
            </dl>
          </section>

          {/* Compliance */}
          <section className="rounded-xl border border-gray-100 bg-white p-5" aria-label="Compliance status">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Compliance</h3>
            <dl className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between"><dt className="text-gray-500">GST</dt><dd><VerifiedBadge verified={seller.compliance.gst} /></dd></div>
              <div className="flex items-center justify-between"><dt className="text-gray-500">PAN</dt><dd><VerifiedBadge verified={seller.compliance.pan} /></dd></div>
              <div className="flex items-center justify-between"><dt className="text-gray-500">Bank</dt><dd><VerifiedBadge verified={seller.compliance.bank} /></dd></div>
              <div className="flex items-center justify-between"><dt className="text-gray-500">Documents</dt><dd className="text-sm font-medium">{seller.compliance.documents}</dd></div>
              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                <dt className="font-semibold text-gray-700">Overall</dt>
                <dd>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> {seller.compliance.overall}
                  </span>
                </dd>
              </div>
            </dl>
          </section>

          {/* Moderation History */}
          <section className="rounded-xl border border-gray-100 bg-white p-5" aria-label="Moderation history">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Moderation History</h3>
            <div className="space-y-3" role="list">
              {seller.moderationHistory.map((entry, i) => (
                <div key={i} className="flex gap-3" role="listitem">
                  <div className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', entry.color)} aria-hidden="true" />
                  <div>
                    <p className="text-sm text-gray-900">{entry.event}</p>
                    <p className="text-xs text-gray-400">{entry.actor ? `By ${entry.actor} \u00B7 ` : ''}{entry.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Admin Actions (new from prototype) */}
          <section className="rounded-xl border border-gray-100 bg-white p-5" aria-label="Admin actions">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Admin Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleAction('compliance-notice')}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-2.5 text-sm font-medium text-yellow-700 transition hover:bg-yellow-100"
              >
                <AlertTriangle className="h-4 w-4" /> Send Compliance Notice
              </button>
              <button
                onClick={() => handleAction('request-documents')}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
              >
                <FileUp className="h-4 w-4" /> Request Documents
              </button>
              <button
                onClick={() => handleAction('schedule-call')}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-4 py-2.5 text-sm font-medium text-purple-700 transition hover:bg-purple-100"
              >
                <Phone className="h-4 w-4" /> Schedule Review Call
              </button>
              <button
                onClick={() => handleAction('adjust-commission')}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-medium text-orange-700 transition hover:bg-orange-100"
              >
                <SlidersHorizontal className="h-4 w-4" /> Adjust Commission Rate
              </button>
            </div>
          </section>

          {/* Actions */}
          <section className="rounded-xl border border-gray-100 bg-white p-5" aria-label="Seller actions">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleAction('view-storefront')}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                <ExternalLink className="h-4 w-4" /> View Storefront
              </button>
              <button
                onClick={() => handleAction('contact')}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-medium text-orange-700 transition hover:bg-orange-100"
              >
                <Mail className="h-4 w-4" /> Contact Seller
              </button>
              <button
                onClick={() => { if (confirm('Suspend this seller? This will hide all their products.')) handleAction('suspend'); }}
                disabled={mutation.isPending}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50"
              >
                <Ban className="h-4 w-4" /> Suspend Seller
              </button>
              <button
                onClick={() => handleAction('download-report')}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                <Download className="h-4 w-4" /> Download Report
              </button>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
