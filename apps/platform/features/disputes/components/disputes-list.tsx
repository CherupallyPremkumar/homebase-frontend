'use client';

import { useState } from 'react';
import {
  Inbox,
  Search as SearchIcon,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Shield,
  Download,
  ExternalLink,
  CreditCard,
  ArrowUpRight,
  Check,
  Image,
  Video,
  FileText,
  User,
  Store,
  ClipboardList,
} from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';

import type { Dispute, DisputeStatus, DisputeIssueType } from '../types';
import {
  mockDisputeStats,
  mockDisputeTabs,
  mockStepperSteps,
  mockCustomerEvidence,
  mockSellerEvidence,
  mockAdminNotes,
  mockChargebackData,
  mockRootCauses,
  mockSlaResolutions,
  mockDisputes,
} from '../services/mock-data';

/* ------------------------------------------------------------------ */
/*  Text Constants                                                     */
/* ------------------------------------------------------------------ */

const TEXT = {
  pageTitle: 'Dispute Management',
  pageDescription: 'Mediate customer-seller disputes, review evidence, and issue resolutions.',
  exportReport: 'Export Report',

  // Stats
  statOpenLabel: 'Open',
  statOpenSubtitle: 'Awaiting review',
  statReviewLabel: 'Under Review',
  statReviewSubtitle: 'Being investigated',
  statResolvedLabel: 'Resolved',
  statResolvedSubtitle: 'This month',
  statEscalatedLabel: 'Escalated',
  statEscalatedSubtitle: 'Urgent attention needed',

  // Resolution Workflow
  resolutionWorkflowTitle: 'Resolution Workflow',
  resolutionWorkflowSubtitle: 'DSP-2045 \u2014 Rajesh Kumar vs Sharma Electronics \u2014 \u20B945,000',

  // Evidence Viewer
  evidenceViewerTitle: 'Evidence Viewer',
  evidenceViewerSubtitle: 'DSP-2045 \u2014 Customer vs Seller evidence comparison',
  viewFullCase: 'View Full Case',
  customerEvidenceLabel: 'Customer Evidence',
  sellerResponseLabel: 'Seller Response',
  adminNotesLabel: 'Admin Notes',
  adminNotesInternal: 'Internal only',
  adminNotesPlaceholder: 'Add internal investigation notes for this dispute...',

  // Chargeback
  chargebackTitle: 'Chargeback Tracking',
  chargebackSubtitle: 'April 2026 overview',
  chargebacksThisMonth: 'Chargebacks This Month',
  winRate: 'Win Rate',
  totalDisputedAmount: 'Total Disputed Amount',
  wonLabel: 'Won',
  lostLabel: 'Lost',
  pendingLabel: 'Pending',
  viewChargebackDetails: 'View Chargeback Details',

  // Root Cause
  rootCauseTitle: 'Dispute Root Cause Analysis',
  rootCauseSubtitle: 'Last 30 days breakdown by category',
  rootCauseTotal: '60 total disputes',

  // SLA
  slaTitle: 'SLA Performance',
  slaSubtitle: 'Target: Resolve within 5 days',
  avgResolutionTime: 'Avg Resolution Time',
  avgResolutionValue: '3.2 days',
  withinSla: 'Within SLA',
  withinSlaValue: '92%',
  slaBreaches: 'SLA Breaches',
  slaBreachesValue: '4',

  // Bulk Actions
  disputesSelected: 'disputes selected',
  clearSelection: 'Clear selection',
  approveSelected: 'Approve Selected',
  rejectSelected: 'Reject Selected',
  escalateToLegal: 'Escalate to Legal',

  // Table
  colCheckbox: '',
  colCaseId: 'Case ID',
  colOrderId: 'Order ID',
  colCustomer: 'Customer',
  colSeller: 'Seller',
  colIssueType: 'Issue Type',
  colAmount: 'Amount',
  colStatus: 'Status',
  colOpened: 'Opened',
  colActions: 'Actions',

  // Pagination
  showingLabel: 'Showing 8 of 60 disputes',
  previous: 'Previous',
  next: 'Next',

  // States
  loadingLabel: 'Loading disputes',
  errorTitle: 'Failed to load disputes',
  errorDescription: 'Please try refreshing the page or contact support.',
  retry: 'Retry',
  emptyTitle: 'No disputes found',
  emptyDescription: 'Dispute records will appear here when customers file them.',
} as const;

/* ------------------------------------------------------------------ */
/*  Simulate loading state (set to true to test)                       */
/* ------------------------------------------------------------------ */

const SIMULATE_LOADING = false;
const SIMULATE_ERROR = false;
const SIMULATE_EMPTY = false;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function issueTypeClasses(type: DisputeIssueType): string {
  switch (type) {
    case 'Not Received': return 'bg-red-50 text-red-700';
    case 'Damaged': return 'bg-purple-50 text-purple-700';
    case 'Quality': return 'bg-yellow-50 text-yellow-700';
    case 'Wrong Item': return 'bg-blue-50 text-blue-700';
    case 'Delivery': return 'bg-gray-100 text-gray-700';
    case 'Refund Issue': return 'bg-orange-50 text-orange-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

function statusClasses(status: DisputeStatus): string {
  switch (status) {
    case 'Open': return 'bg-blue-50 text-blue-700';
    case 'Under Review': return 'bg-yellow-50 text-yellow-700';
    case 'Escalated': return 'bg-red-100 text-red-700';
    case 'Resolved': return 'bg-green-50 text-green-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

function actionForStatus(status: DisputeStatus): { label: string; color: string } {
  switch (status) {
    case 'Escalated': return { label: 'Urgent', color: 'text-red-500 hover:text-red-600' };
    case 'Resolved': return { label: 'View', color: 'text-orange-500 hover:text-orange-600' };
    default: return { label: 'Review', color: 'text-orange-500 hover:text-orange-600' };
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function DisputesList() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [adminNotes, setAdminNotes] = useState(mockAdminNotes);

  /* ---- Loading state ---- */
  if (SIMULATE_LOADING) {
    return (
      <div className="space-y-6" role="status" aria-label={TEXT.loadingLabel}>
        <div className="h-8 w-72 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-4 w-96 animate-pulse rounded bg-gray-200" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
        <div className="h-48 animate-pulse rounded-xl bg-gray-200" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 h-80 animate-pulse rounded-xl bg-gray-200" />
          <div className="h-80 animate-pulse rounded-xl bg-gray-200" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
          <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
        </div>
        <div className="h-96 animate-pulse rounded-xl bg-gray-200" />
      </div>
    );
  }

  /* ---- Error state ---- */
  if (SIMULATE_ERROR) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24" role="alert">
        <AlertTriangle className="h-12 w-12 text-red-400" />
        <h2 className="text-lg font-semibold text-gray-900">{TEXT.errorTitle}</h2>
        <p className="text-sm text-gray-500">{TEXT.errorDescription}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          {TEXT.retry}
        </button>
      </div>
    );
  }

  /* ---- Empty state ---- */
  if (SIMULATE_EMPTY) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <Inbox className="h-12 w-12 text-gray-300" />
        <h2 className="text-lg font-semibold text-gray-900">{TEXT.emptyTitle}</h2>
        <p className="text-sm text-gray-500">{TEXT.emptyDescription}</p>
      </div>
    );
  }

  /* ---- Data ---- */
  const stats = mockDisputeStats;
  const tabs = mockDisputeTabs;
  const disputes = mockDisputes;
  const steps = mockStepperSteps;
  const customerEvidence = mockCustomerEvidence;
  const sellerEvidence = mockSellerEvidence;
  const chargeback = mockChargebackData;
  const rootCauses = mockRootCauses;
  const slaResolutions = mockSlaResolutions;

  const selectAll = selectedIds.size === disputes.length && disputes.length > 0;

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectAll) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(disputes.map((d) => d.id)));
    }
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  /* ---- Success state ---- */
  return (
    <section className="space-y-6">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{TEXT.pageTitle}</h1>
          <p className="mt-1 text-sm text-gray-500">{TEXT.pageDescription}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
            <Download className="h-4 w-4" />
            {TEXT.exportReport}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Open */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{TEXT.statOpenLabel}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <Inbox className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.open}</p>
          <p className="mt-1 text-xs text-gray-500">{TEXT.statOpenSubtitle}</p>
        </div>

        {/* Under Review */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{TEXT.statReviewLabel}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-50">
              <SearchIcon className="h-4 w-4 text-yellow-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{stats.underReview}</p>
          <p className="mt-1 text-xs text-gray-500">{TEXT.statReviewSubtitle}</p>
        </div>

        {/* Resolved */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{TEXT.statResolvedLabel}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
          <p className="mt-1 text-xs text-gray-500">{TEXT.statResolvedSubtitle}</p>
        </div>

        {/* Escalated */}
        <div className="rounded-xl border border-red-200 bg-white p-5 ring-1 ring-red-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-red-600">{TEXT.statEscalatedLabel}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-red-600">{stats.escalated}</p>
          <p className="mt-1 text-xs text-gray-500">{TEXT.statEscalatedSubtitle}</p>
        </div>
      </div>

      {/* Resolution Workflow Stepper */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-900">{TEXT.resolutionWorkflowTitle}</h2>
            <p className="mt-0.5 text-xs text-gray-500">{TEXT.resolutionWorkflowSubtitle}</p>
          </div>
          <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">Escalated</span>
        </div>
        <div className="relative flex items-center justify-between">
          {/* Connecting line (background) */}
          <div className="absolute left-[12.5%] right-[12.5%] top-4 z-0 h-[3px] bg-gray-200" />
          {/* Connecting line (progress -- 50% covers steps 1-2 completed, step 3 active) */}
          <div className="absolute left-[12.5%] top-4 z-0 h-[3px] bg-green-500" style={{ width: '50%' }} />

          {steps.map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center" style={{ width: '25%' }}>
              {step.state === 'completed' ? (
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-green-500 bg-green-500">
                  <Check className="h-4 w-4 text-white" strokeWidth={2.5} />
                </div>
              ) : step.state === 'active' ? (
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-orange-500 bg-orange-500"
                  style={{ boxShadow: '0 0 0 4px rgba(249,115,22,0.2)' }}
                >
                  <span className="text-xs font-bold text-white">{i + 1}</span>
                </div>
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-gray-200">
                  <span className="text-xs font-bold text-gray-400">{i + 1}</span>
                </div>
              )}
              <p className={cn(
                'mt-2 text-xs font-semibold',
                step.state === 'completed' && 'text-green-500',
                step.state === 'active' && 'font-bold text-orange-500',
                step.state === 'pending' && 'text-gray-400',
              )}>
                {step.label}
              </p>
              <p className="mt-0.5 text-[10px] text-gray-400">{step.subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Evidence Viewer + Chargeback Tracking Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Evidence Viewer (spans 2 cols) */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <div>
              <h2 className="text-sm font-bold text-gray-900">{TEXT.evidenceViewerTitle}</h2>
              <p className="mt-0.5 text-xs text-gray-500">{TEXT.evidenceViewerSubtitle}</p>
            </div>
            <button className="text-xs font-semibold text-orange-600 hover:text-orange-700">{TEXT.viewFullCase}</button>
          </div>
          <div className="space-y-5 p-6">

            {/* Customer Evidence */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500">
                  <User className="h-3 w-3 text-white" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-900">{TEXT.customerEvidenceLabel}</h3>
                <span className="ml-1 text-[10px] text-gray-400">{customerEvidence.name}</span>
              </div>
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                <p className="mb-3 text-sm text-gray-700">{customerEvidence.statement}</p>
                <div className="flex gap-3">
                  {customerEvidence.thumbs.map((thumb, i) => (
                    <div
                      key={i}
                      className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg border border-blue-200 bg-blue-100 transition hover:scale-105 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                    >
                      {i === 2 ? (
                        <Video className="mb-1 h-5 w-5 text-blue-400" strokeWidth={1.5} />
                      ) : (
                        <Image className="mb-1 h-5 w-5 text-blue-400" strokeWidth={1.5} />
                      )}
                      <span className="text-[10px] font-medium text-blue-500">{thumb.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Seller Response */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                  <Store className="h-3 w-3 text-white" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-900">{TEXT.sellerResponseLabel}</h3>
                <span className="ml-1 text-[10px] text-gray-400">{sellerEvidence.name}</span>
              </div>
              <div className="rounded-lg border border-green-100 bg-green-50 p-4">
                <p className="mb-3 text-sm text-gray-700">{sellerEvidence.statement}</p>
                <div className="flex gap-3">
                  {sellerEvidence.thumbs.map((thumb, i) => (
                    <div
                      key={i}
                      className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg border border-green-200 bg-green-100 transition hover:scale-105 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                    >
                      {i === 0 ? (
                        <FileText className="mb-1 h-5 w-5 text-green-500" strokeWidth={1.5} />
                      ) : (
                        <Image className="mb-1 h-5 w-5 text-green-500" strokeWidth={1.5} />
                      )}
                      <span className="text-[10px] font-medium text-green-600">{thumb.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Admin Notes */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-700">
                  <ClipboardList className="h-3 w-3 text-white" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-900">{TEXT.adminNotesLabel}</h3>
                <span className="ml-1 text-[10px] text-gray-400">{TEXT.adminNotesInternal}</span>
              </div>
              <textarea
                rows={2}
                placeholder={TEXT.adminNotesPlaceholder}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </div>
        </div>

        {/* Chargeback Tracking */}
        <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-sm font-bold text-gray-900">{TEXT.chargebackTitle}</h2>
            <p className="mt-0.5 text-xs text-gray-500">{TEXT.chargebackSubtitle}</p>
          </div>
          <div className="flex flex-1 flex-col justify-between p-6">
            <div className="space-y-5">
              {/* Chargebacks This Month */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">{TEXT.chargebacksThisMonth}</p>
                  <p className="mt-0.5 text-2xl font-bold text-gray-900">{chargeback.thisMonth}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
                  <CreditCard className="h-5 w-5 text-red-500" />
                </div>
              </div>
              <div className="h-px bg-gray-100" />

              {/* Win Rate */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs text-gray-500">{TEXT.winRate}</p>
                  <p className="text-sm font-bold text-green-600">{chargeback.winRate}%</p>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-green-500" style={{ width: `${chargeback.winRate}%` }} />
                </div>
                <p className="mt-1 text-[10px] text-gray-400">{chargeback.winRateLabel}</p>
              </div>
              <div className="h-px bg-gray-100" />

              {/* Total Disputed */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">{TEXT.totalDisputedAmount}</p>
                  <p className="mt-0.5 text-xl font-bold text-gray-900">{chargeback.totalDisputedAmount}</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-red-500">
                  <ArrowUpRight className="h-3 w-3" />
                  {chargeback.trendLabel}
                </div>
              </div>
              <div className="h-px bg-gray-100" />

              {/* Breakdown */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-lg font-bold text-green-600">{chargeback.won}</p>
                  <p className="text-[10px] text-gray-500">{TEXT.wonLabel}</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-red-600">{chargeback.lost}</p>
                  <p className="text-[10px] text-gray-500">{TEXT.lostLabel}</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-yellow-600">{chargeback.pending}</p>
                  <p className="text-[10px] text-gray-500">{TEXT.pendingLabel}</p>
                </div>
              </div>
            </div>

            <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100">
              <ExternalLink className="h-4 w-4" />
              {TEXT.viewChargebackDetails}
            </button>
          </div>
        </div>
      </div>

      {/* Root Cause Analysis + SLA Tracker Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Root Cause Analysis */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-gray-900">{TEXT.rootCauseTitle}</h2>
              <p className="mt-0.5 text-xs text-gray-500">{TEXT.rootCauseSubtitle}</p>
            </div>
            <span className="text-xs font-medium text-gray-400">{TEXT.rootCauseTotal}</span>
          </div>
          <div className="space-y-4">
            {rootCauses.map((cause) => (
              <div key={cause.label}>
                <div className="mb-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn('h-2.5 w-2.5 rounded-full', cause.color)} />
                    <span className="text-sm font-medium text-gray-700">{cause.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">{cause.percentage}%</span>
                    <span className="text-xs text-gray-400">{cause.cases} cases</span>
                  </div>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={cn('h-full rounded-full transition-all duration-500', cause.color)}
                    style={{ width: `${cause.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SLA Tracker */}
        <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-white p-6">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">{TEXT.slaTitle}</p>
            <p className="mt-1 text-sm text-gray-500">{TEXT.slaSubtitle}</p>
          </div>
          <div className="mb-6 grid grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{TEXT.avgResolutionValue}</p>
              <p className="mt-1 text-xs text-gray-500">{TEXT.avgResolutionTime}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{TEXT.withinSlaValue}</p>
              <p className="mt-1 text-xs text-gray-500">{TEXT.withinSla}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{TEXT.slaBreachesValue}</p>
              <p className="mt-1 text-xs text-gray-500">{TEXT.slaBreaches}</p>
            </div>
          </div>
          <div className="space-y-3">
            {slaResolutions.map((res) => (
              <div key={res.label} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{res.label}</span>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-blue-100">
                    <div className={cn('h-full rounded-full', res.barColor)} style={{ width: `${res.barPercent}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">{res.days}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between rounded-xl bg-[#0F1E30] p-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-white">
              {selectedIds.size} {TEXT.disputesSelected}
            </span>
            <button onClick={clearSelection} className="text-xs text-gray-400 underline transition hover:text-white">
              {TEXT.clearSelection}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700">
              <CheckCircle className="h-4 w-4" />
              {TEXT.approveSelected}
            </button>
            <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700">
              <XCircle className="h-4 w-4" />
              {TEXT.rejectSelected}
            </button>
            <button className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700">
              <Shield className="h-4 w-4" />
              {TEXT.escalateToLegal}
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs + Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

        {/* Filter Tabs */}
        <div className="border-b border-gray-100 px-6 pt-4">
          <div className="flex gap-6">
            {tabs.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(i)}
                className={cn(
                  'border-b-2 pb-3 text-sm font-semibold transition',
                  activeTab === i
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-orange-500',
                )}
              >
                {tab.label}
                <span className={cn('ml-1 text-xs', tab.countColor ?? 'text-gray-400')}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <th className="w-10 px-6 py-3 font-semibold">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                  />
                </th>
                <th className="px-6 py-3 font-semibold">{TEXT.colCaseId}</th>
                <th className="px-6 py-3 font-semibold">{TEXT.colOrderId}</th>
                <th className="px-6 py-3 font-semibold">{TEXT.colCustomer}</th>
                <th className="px-6 py-3 font-semibold">{TEXT.colSeller}</th>
                <th className="px-6 py-3 font-semibold">{TEXT.colIssueType}</th>
                <th className="px-6 py-3 text-right font-semibold">{TEXT.colAmount}</th>
                <th className="px-6 py-3 text-center font-semibold">{TEXT.colStatus}</th>
                <th className="px-6 py-3 font-semibold">{TEXT.colOpened}</th>
                <th className="px-6 py-3 text-center font-semibold">{TEXT.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {disputes.map((d) => {
                const isEscalated = d.status === 'Escalated';
                const action = actionForStatus(d.status);
                return (
                  <tr
                    key={d.id}
                    className={cn(
                      'cursor-pointer transition-colors',
                      isEscalated
                        ? 'border-l-[3px] border-l-red-500 bg-red-50 hover:bg-red-100'
                        : 'hover:bg-orange-50/60',
                    )}
                  >
                    <td className="px-6 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(d.id)}
                        onChange={() => toggleSelect(d.id)}
                        className="h-4 w-4 cursor-pointer rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                      />
                    </td>
                    <td className={cn('px-6 py-3.5 font-medium', isEscalated ? 'text-red-600' : 'text-orange-600')}>
                      {d.id}
                    </td>
                    <td className="px-6 py-3.5 text-gray-700">{d.orderId}</td>
                    <td className="px-6 py-3.5">{d.customer}</td>
                    <td className="px-6 py-3.5">{d.seller}</td>
                    <td className="px-6 py-3.5">
                      <span className={cn('rounded px-2 py-0.5 text-xs font-medium', issueTypeClasses(d.issueType))}>
                        {d.issueType}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right font-medium">{d.amount}</td>
                    <td className="px-6 py-3.5 text-center">
                      <span className={cn('rounded-full px-2 py-1 text-xs font-semibold', statusClasses(d.status))}>
                        {d.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-xs text-gray-500">{d.opened}</td>
                    <td className="px-6 py-3.5 text-center">
                      <button className={cn('text-xs font-semibold', action.color)}>
                        {action.label}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3">
          <p className="text-xs text-gray-500">{TEXT.showingLabel}</p>
          <div className="flex items-center gap-1">
            <button disabled className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-500 transition hover:bg-gray-100">
              {TEXT.previous}
            </button>
            <button className="rounded-lg border border-orange-500 bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white">
              1
            </button>
            <button className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-500 transition hover:bg-gray-100">
              2
            </button>
            <button className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-500 transition hover:bg-gray-100">
              3
            </button>
            <span className="px-2 text-xs text-gray-400">...</span>
            <button className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-500 transition hover:bg-gray-100">
              8
            </button>
            <button className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-500 transition hover:bg-gray-100">
              {TEXT.next}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
