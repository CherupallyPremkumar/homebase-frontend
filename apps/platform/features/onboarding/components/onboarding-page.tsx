'use client';

import { useState, useCallback } from 'react';
import {
  ArrowRight,
  Search,
  Download,
  Upload,
  FileText,
  FolderOpen,
  ShieldCheck,
  GraduationCap,
  CheckCircle2,
  Clock,
  Bell,
  BadgeCheck,
  ChevronDown,
  X,
  RefreshCw,
  AlertCircle,
  Inbox,
} from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';
import { Skeleton } from '@homebase/ui';

import {
  useOnboardingPipeline,
  useOnboardingStats,
  useOnboardingApplications,
  useApplicantPreview,
  useAutoApprovalRules,
  useTrainingSellers,
  useSlaTimers,
  useDocumentChecklist,
} from '../hooks/use-onboarding';
import type {
  PipelineStage,
  PipelineCount,
  SlaStatus,
  OnboardingApplication,
} from '../types';

// ----------------------------------------------------------------
// TEXT CONSTANTS
// ----------------------------------------------------------------

const TEXT = {
  PAGE_TITLE: 'Seller Onboarding',
  PAGE_SUBTITLE: 'Manage seller applications and onboarding pipeline',
  IMPORT: 'Import',
  EXPORT_REPORT: 'Export Report',
  TOP_APPLICANT_PREVIEW: 'Top Applicant Preview',
  BUSINESS_INFORMATION: 'Business Information',
  DOCUMENT_STATUS: 'Document Status',
  KYC_RISK_ASSESSMENT: 'KYC & Risk Assessment',
  KYC_SCORE: 'KYC Score',
  RISK_ASSESSMENT: 'Risk Assessment',
  KYC_SCORE_NOTE: 'Score will increase as documents are uploaded and verified',
  SEND_REMINDER: 'Send Reminder',
  FAST_TRACK: 'Fast-Track',
  AUTO_APPROVAL_RULES: 'Auto-Approval Rules',
  AUTO_APPROVAL_SUBTITLE: 'Automatically approve sellers meeting all criteria',
  AUTO_APPROVAL_HEADING: 'Auto-approve when ALL conditions are met:',
  AUTO_APPROVAL_FOOTER:
    'When enabled, sellers meeting all checked criteria will skip manual review and proceed directly to Training. Currently disabled -- all applications require manual approval.',
  TRAINING_PROGRESS: 'Seller Training Progress',
  TRAINING_SUBTITLE: '3 sellers currently in training (8 modules required)',
  REMIND_ALL: 'Remind All',
  SLA_TIMERS: 'SLA Timers',
  SLA_SUBTITLE: 'Applications approaching or exceeding SLA deadlines',
  SLA_BREACHED_BADGE: '1 BREACHED',
  ALL_APPLICATIONS: 'All Applications',
  ALL_STAGES: 'All Stages',
  SEARCH_PLACEHOLDER: 'Search sellers...',
  APPROVE: 'Approve',
  REJECT: 'Reject',
  ACTIVATE: 'Activate',
  ESCALATE: 'Escalate',
  DETAILS: 'Details',
  PAGINATION_TEXT: 'Showing 1-11 of 13 applications',
  PREVIOUS: 'Previous',
  NEXT: 'Next',
  DOC_CHECKLIST_TITLE: 'Document Checklist',
  AVG_DAYS: 'Avg Days',
  TOTAL_APPLICATIONS: 'Total Applications',
  THIS_WEEK: 'This Week',
  APPROVAL_RATE: 'Approval Rate',
  AVG_ONBOARDING_TIME: 'Avg Onboarding Time',
  LOADING: 'Loading onboarding data...',
  ERROR_TITLE: 'Failed to load onboarding data',
  ERROR_SUBTITLE: 'Please check your connection and try again.',
  RETRY: 'Retry',
  EMPTY_TITLE: 'No onboarding data available',
  EMPTY_SUBTITLE: 'Data will appear here once applications are submitted.',
  NO_APPLICATIONS: 'No applications found',
  SELLER_NAME: 'Seller Name',
  BUSINESS_TYPE: 'Business Type',
  APPLIED_DATE: 'Applied Date',
  CURRENT_STAGE: 'Current Stage',
  DOCUMENTS: 'Documents',
  SLA_STATUS_LABEL: 'SLA Status',
  TRAINING: 'Training',
  ACTIONS: 'Actions',
  MIN_SCORE: 'Min score:',
} as const;

// ----------------------------------------------------------------
// PIPELINE ICONS — maps stage to Lucide icon
// ----------------------------------------------------------------

const PIPELINE_ICONS: Record<PipelineStage, React.ReactNode> = {
  Applied: <FileText className="h-[18px] w-[18px]" />,
  Documents: <FolderOpen className="h-[18px] w-[18px]" />,
  Verification: <ShieldCheck className="h-[18px] w-[18px]" />,
  Training: <GraduationCap className="h-[18px] w-[18px]" />,
  Active: <CheckCircle2 className="h-[18px] w-[18px]" />,
};

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

function getStageBadgeStyle(stage: PipelineStage): string {
  switch (stage) {
    case 'Applied':
      return 'bg-blue-100 text-blue-700';
    case 'Documents':
      return 'bg-yellow-100 text-yellow-700';
    case 'Verification':
      return 'bg-purple-100 text-purple-700';
    case 'Training':
      return 'bg-orange-100 text-orange-700';
    case 'Active':
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

function getSlaIndicator(status: SlaStatus) {
  switch (status) {
    case 'green':
      return { dotColor: 'bg-green-500', textColor: 'text-green-600', animate: false };
    case 'yellow':
      return { dotColor: 'bg-yellow-500', textColor: 'text-yellow-600', animate: true };
    case 'red':
      return { dotColor: 'bg-red-500', textColor: 'text-red-600', animate: true };
  }
}

function getTrainingBarColor(progress: number, total: number): string {
  const pct = (progress / total) * 100;
  if (pct >= 80) return 'bg-green-500';
  if (pct >= 50) return 'bg-orange-500';
  return 'bg-yellow-500';
}

// ----------------------------------------------------------------
// Sub-components: Loading / Error / Empty
// ----------------------------------------------------------------

function OnboardingSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300" role="status" aria-label={TEXT.LOADING}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-40 flex-1 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-[200px] w-full rounded-xl" />
      <Skeleton className="h-[200px] w-full rounded-xl" />
      <Skeleton className="h-[200px] w-full rounded-xl" />
      <Skeleton className="h-[200px] w-full rounded-xl" />
      <Skeleton className="h-[400px] w-full rounded-xl" />
      <span className="sr-only">{TEXT.LOADING}</span>
    </div>
  );
}

function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <section
      className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-12"
      role="alert"
      aria-live="assertive"
    >
      <AlertCircle className="mb-4 h-12 w-12 text-red-400" aria-hidden="true" />
      <h2 className="text-lg font-semibold text-gray-900">{message}</h2>
      <p className="mt-1 text-sm text-gray-500">{TEXT.ERROR_SUBTITLE}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
      >
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        {TEXT.RETRY}
      </button>
    </section>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <section className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-12">
      <Inbox className="mb-4 h-12 w-12 text-gray-300" aria-hidden="true" />
      <h2 className="text-lg font-semibold text-gray-900">{message}</h2>
      <p className="mt-1 text-sm text-gray-500">{TEXT.EMPTY_SUBTITLE}</p>
    </section>
  );
}

// ----------------------------------------------------------------
// Pipeline Stage Card
// ----------------------------------------------------------------

function PipelineStageCard({
  stage,
  isActive,
  onClick,
}: {
  stage: PipelineCount;
  isActive: boolean;
  onClick: () => void;
}) {
  const isActiveStage = stage.stage === 'Active';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex-1 min-w-[180px] rounded-xl border-2 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg',
        stage.borderColor,
        isActive && 'ring-2 ring-orange-500'
      )}
      aria-label={`Filter by ${stage.stage}: ${stage.count} sellers`}
    >
      <div className="flex items-center justify-between mb-2">
        <div
          className={cn('flex h-9 w-9 items-center justify-center rounded-full', stage.iconBg)}
          aria-hidden="true"
        >
          <span className={stage.iconColor}>{PIPELINE_ICONS[stage.stage]}</span>
        </div>
        <span
          className={cn(
            'px-2 py-0.5 text-[10px] font-bold rounded-full',
            stage.slaBadgeStyle
          )}
        >
          {stage.slaHealth === 'AT RISK' ? `1 ${stage.slaHealth}` : stage.slaHealth}
        </span>
      </div>
      <p className={cn('text-2xl font-bold', stage.color)}>{stage.count}</p>
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mt-0.5">
        {stage.stage}
      </p>
      <div
        className={cn(
          'mt-3 pt-3 border-t grid grid-cols-2 gap-2',
          stage.stage === 'Applied' && 'border-blue-100',
          stage.stage === 'Documents' && 'border-yellow-100',
          stage.stage === 'Verification' && 'border-purple-100',
          stage.stage === 'Training' && 'border-orange-100',
          stage.stage === 'Active' && 'border-green-100'
        )}
      >
        {isActiveStage ? (
          <>
            <div>
              <p className="text-[10px] text-gray-400 uppercase">{stage.bottomLeftLabel}</p>
              <p className={cn('text-sm font-bold', stage.bottomLeftColor)}>{stage.bottomLeftValue}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase">{stage.bottomRightLabel}</p>
              <p className="text-sm font-bold text-gray-700">{stage.bottomRightValue}</p>
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="text-[10px] text-gray-400 uppercase">{TEXT.AVG_DAYS}</p>
              <p className="text-sm font-bold text-gray-700">{stage.avgDays}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase">{stage.slaLabel}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="flex-1 rounded-full bg-gray-200 h-1.5">
                  <div
                    className={cn('h-1.5 rounded-full transition-all', stage.slaBarColor)}
                    style={{ width: `${stage.slaPercent}%` }}
                  />
                </div>
                <span className={cn('text-[10px] font-bold', stage.slaPercentColor)}>
                  {stage.slaPercent}%
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </button>
  );
}

// ----------------------------------------------------------------
// Applications Table Row
// ----------------------------------------------------------------

function ApplicationRow({ app }: { app: OnboardingApplication }) {
  const sla = getSlaIndicator(app.slaStatus);
  const isTraining = app.currentStage === 'Training';
  const actionLabel = isTraining ? TEXT.ACTIVATE : TEXT.APPROVE;

  return (
    <tr className="transition-colors hover:bg-orange-50/40">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
              app.avatarColor
            )}
            aria-hidden="true"
          >
            {app.initials}
          </div>
          <span className="font-medium text-gray-900">{app.sellerName}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-600">{app.businessType}</td>
      <td className="px-6 py-4 text-xs text-gray-500">{app.appliedDate}</td>
      <td className="px-6 py-4">
        <span
          className={cn(
            'rounded-full px-2.5 py-1 text-xs font-semibold',
            getStageBadgeStyle(app.currentStage)
          )}
        >
          {app.currentStage}
        </span>
      </td>
      <td className="px-6 py-4">
        <button
          type="button"
          className="text-xs font-medium text-orange-500 hover:text-orange-600"
        >
          {app.documentsProgress}
        </button>
      </td>
      <td className="px-6 py-4">
        <span
          className={cn(
            'flex items-center gap-1 text-xs font-medium',
            sla.textColor,
            app.slaStatus === 'red' && 'font-bold'
          )}
        >
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              sla.dotColor,
              sla.animate && 'animate-pulse'
            )}
          />
          {app.slaText}
        </span>
      </td>
      <td className="px-6 py-4">
        {app.trainingProgress != null && app.trainingTotal != null ? (
          <div className="flex items-center gap-2">
            <div className="w-20 rounded-full bg-gray-200 h-2">
              <div
                className={cn(
                  'h-2 rounded-full transition-all',
                  getTrainingBarColor(app.trainingProgress, app.trainingTotal)
                )}
                style={{
                  width: `${(app.trainingProgress / app.trainingTotal) * 100}%`,
                }}
              />
            </div>
            <span className="text-xs font-medium text-gray-600">{app.trainingStatus}</span>
          </div>
        ) : (
          <span className="text-xs text-gray-400">{app.trainingStatus}</span>
        )}
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-lg bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 transition hover:bg-green-100"
            aria-label={`${actionLabel} ${app.sellerName}`}
          >
            {actionLabel}
          </button>
          <button
            type="button"
            className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 transition hover:bg-red-100"
            aria-label={`Reject ${app.sellerName}`}
          >
            {TEXT.REJECT}
          </button>
        </div>
      </td>
    </tr>
  );
}

// ----------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------

export function OnboardingPage() {
  const pipelineQuery = useOnboardingPipeline();
  const statsQuery = useOnboardingStats();
  const applicationsQuery = useOnboardingApplications();
  const previewQuery = useApplicantPreview();
  const autoApprovalQuery = useAutoApprovalRules();
  const trainingQuery = useTrainingSellers();
  const slaQuery = useSlaTimers();
  const checklistQuery = useDocumentChecklist();

  const [activePipelineStage, setActivePipelineStage] = useState<PipelineStage | null>(null);
  const [detailExpanded, setDetailExpanded] = useState(false);
  const [autoApprovalEnabled, setAutoApprovalEnabled] = useState(false);
  const [stageFilter, setStageFilter] = useState('all');
  const [docModalOpen, setDocModalOpen] = useState(false);

  const handleRetry = useCallback(() => {
    pipelineQuery.refetch();
    statsQuery.refetch();
    applicationsQuery.refetch();
    previewQuery.refetch();
    autoApprovalQuery.refetch();
    trainingQuery.refetch();
    slaQuery.refetch();
    checklistQuery.refetch();
  }, [pipelineQuery, statsQuery, applicationsQuery, previewQuery, autoApprovalQuery, trainingQuery, slaQuery, checklistQuery]);

  // ---- Loading ----
  const isLoading = pipelineQuery.isLoading && applicationsQuery.isLoading;
  if (isLoading) return <OnboardingSkeleton />;

  // ---- Error ----
  const isError = pipelineQuery.isError && applicationsQuery.isError;
  if (isError) return <ErrorBanner message={TEXT.ERROR_TITLE} onRetry={handleRetry} />;

  // ---- Empty ----
  if (!pipelineQuery.data && !applicationsQuery.data) {
    return <EmptyState message={TEXT.EMPTY_TITLE} />;
  }

  const pipeline = pipelineQuery.data ?? [];
  const stats = statsQuery.data;
  const applications = applicationsQuery.data ?? [];
  const preview = previewQuery.data;
  const autoApprovalRules = autoApprovalQuery.data ?? [];
  const trainingSellers = trainingQuery.data ?? [];
  const slaTimers = slaQuery.data ?? [];
  const checklist = checklistQuery.data ?? [];

  // Filter applications by stage
  const filteredApplications =
    stageFilter === 'all'
      ? applications
      : applications.filter(
          (a) => a.currentStage.toLowerCase() === stageFilter.toLowerCase()
        );

  return (
    <div className="space-y-6">
      {/* ================================================================
          Page Header
          ================================================================ */}
      <section className="flex items-center justify-between">
        <header>
          <h1 className="text-2xl font-bold text-gray-900">{TEXT.PAGE_TITLE}</h1>
          <p className="mt-1 text-sm text-gray-500">{TEXT.PAGE_SUBTITLE}</p>
        </header>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <Upload className="h-4 w-4" aria-hidden="true" />
            {TEXT.IMPORT}
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            {TEXT.EXPORT_REPORT}
          </button>
        </div>
      </section>

      {/* ================================================================
          Pipeline Kanban View
          ================================================================ */}
      <section aria-label="Onboarding pipeline">
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {pipeline.map((stage, idx) => (
            <div key={stage.stage} className="flex items-center gap-3">
              <PipelineStageCard
                stage={stage}
                isActive={activePipelineStage === stage.stage}
                onClick={() =>
                  setActivePipelineStage(
                    activePipelineStage === stage.stage ? null : stage.stage
                  )
                }
              />
              {idx < pipeline.length - 1 && (
                <div className="shrink-0 text-gray-300" aria-hidden="true">
                  <ArrowRight className="h-6 w-6" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================
          Stats Row
          ================================================================ */}
      <section aria-label="Onboarding statistics">
        {statsQuery.isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            {/* Total Applications */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {TEXT.TOTAL_APPLICATIONS}
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
              <p className="mt-1 text-xs text-gray-400">{stats.totalSubtext}</p>
            </div>
            {/* This Week */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {TEXT.THIS_WEEK}
              </p>
              <p className="mt-1 text-2xl font-bold text-blue-600">{stats.thisWeek}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
                <svg
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
                {stats.thisWeekChange}
              </p>
            </div>
            {/* Approval Rate */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {TEXT.APPROVAL_RATE}
              </p>
              <p className="mt-1 text-2xl font-bold text-green-600">{stats.approvalRate}%</p>
              <p className="mt-1 text-xs text-gray-400">{stats.approvalSubtext}</p>
            </div>
            {/* Avg Onboarding Time */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {TEXT.AVG_ONBOARDING_TIME}
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {stats.avgTimeDays}{' '}
                <span className="text-sm font-normal text-gray-500">days</span>
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
                <svg
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25" />
                </svg>
                {stats.avgTimeChange}
              </p>
            </div>
          </div>
        ) : null}
      </section>

      {/* ================================================================
          Applicant Detail Preview (Expandable)
          ================================================================ */}
      {preview && (
        <section aria-label="Top applicant preview">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setDetailExpanded(!detailExpanded)}
              className="flex w-full items-center justify-between px-6 py-4 border-b border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold',
                    preview.avatarColor
                  )}
                >
                  {preview.initials}
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-bold text-gray-900">{TEXT.TOP_APPLICANT_PREVIEW}</h3>
                  <p className="text-xs text-gray-500">
                    {preview.sellerName} - {preview.appliedDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'rounded-full px-2.5 py-1 text-xs font-semibold',
                    getStageBadgeStyle(preview.stage)
                  )}
                >
                  {preview.stage}
                </span>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 text-gray-400 transition-transform',
                    detailExpanded && 'rotate-180'
                  )}
                />
              </div>
            </button>

            <div
              className={cn(
                'overflow-hidden transition-all duration-300',
                detailExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
              )}
            >
              <div className="p-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  {/* Business Info */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      {TEXT.BUSINESS_INFORMATION}
                    </h4>
                    <div className="space-y-3">
                      {[
                        ['Business Name', preview.business.name],
                        ['Category', preview.business.category],
                        ['Business Type', preview.business.type],
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{label}</span>
                          <span className="text-sm font-semibold text-gray-900">{value}</span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">GSTIN</span>
                        <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs font-medium text-gray-900">
                          {preview.business.gstin}
                        </span>
                      </div>
                      {[
                        ['Location', preview.business.location],
                        ['Est. Revenue', preview.business.estRevenue],
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{label}</span>
                          <span className="text-sm font-medium text-gray-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Document Status */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        {TEXT.DOCUMENT_STATUS}
                      </h4>
                      <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-bold text-yellow-700">
                        {preview.documentsUploaded}/{preview.documentsTotal} Uploaded
                      </span>
                    </div>
                    <div className="space-y-2.5">
                      {preview.documents.map((doc) => (
                        <div key={doc.name} className="flex items-center justify-between py-1.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                'flex h-5 w-5 items-center justify-center rounded-full text-[10px]',
                                doc.status === 'Uploaded'
                                  ? 'bg-green-100 text-green-600'
                                  : 'bg-gray-100 text-gray-400'
                              )}
                            >
                              {doc.status === 'Uploaded' ? '\u2713' : '\u2212'}
                            </span>
                            <span className="text-sm text-gray-700">{doc.name}</span>
                          </div>
                          <span
                            className={cn(
                              'text-xs font-medium',
                              doc.status === 'Uploaded' ? 'text-green-600' : 'text-gray-400'
                            )}
                          >
                            {doc.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* KYC & Risk */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      {TEXT.KYC_RISK_ASSESSMENT}
                    </h4>
                    <div className="space-y-4">
                      {/* KYC Score */}
                      <div className="rounded-xl bg-gray-50 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            {TEXT.KYC_SCORE}
                          </span>
                          <span className="text-lg font-bold text-orange-600">
                            {preview.kycScore}/{preview.kycMax}
                          </span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-gray-200">
                          <div
                            className="h-2.5 rounded-full bg-orange-500 transition-all"
                            style={{ width: `${preview.kycScore}%` }}
                          />
                        </div>
                        <p className="mt-2 text-xs text-gray-400">{TEXT.KYC_SCORE_NOTE}</p>
                      </div>
                      {/* Risk Assessment */}
                      <div className="rounded-xl bg-gray-50 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            {TEXT.RISK_ASSESSMENT}
                          </span>
                          <span
                            className={cn(
                              'rounded-full px-2.5 py-1 text-xs font-bold',
                              preview.riskBadgeStyle
                            )}
                          >
                            {preview.riskLevel}
                          </span>
                        </div>
                        <div className="space-y-2 text-xs">
                          {preview.riskFactors.map((factor) => (
                            <div key={factor.text} className="flex items-center gap-2">
                              <span
                                className={cn('h-1.5 w-1.5 rounded-full', factor.color)}
                              />
                              <span className="text-gray-600">{factor.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Quick Actions */}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="flex-1 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-center text-xs font-medium text-orange-700 transition hover:bg-orange-100"
                        >
                          {TEXT.SEND_REMINDER}
                        </button>
                        <button
                          type="button"
                          className="flex-1 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-center text-xs font-medium text-green-700 transition hover:bg-green-100"
                        >
                          {TEXT.FAST_TRACK}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================================================================
          Auto-Approval Rules
          ================================================================ */}
      <section aria-label="Auto-approval rules">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100">
                <BadgeCheck className="h-[18px] w-[18px] text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">{TEXT.AUTO_APPROVAL_RULES}</h3>
                <p className="text-xs text-gray-500">{TEXT.AUTO_APPROVAL_SUBTITLE}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAutoApprovalEnabled(!autoApprovalEnabled)}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                autoApprovalEnabled ? 'bg-green-500' : 'bg-gray-200'
              )}
              role="switch"
              aria-checked={autoApprovalEnabled}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 rounded-full bg-white shadow transition-transform',
                  autoApprovalEnabled ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
          </div>
          <div className="p-6">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
              <p className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                {TEXT.AUTO_APPROVAL_HEADING}
              </p>
              <div className="space-y-3">
                {autoApprovalRules.map((rule) => (
                  <div key={rule.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      defaultChecked={rule.checked}
                      className="h-4 w-4 rounded border-gray-300 text-green-500 focus:ring-green-500"
                    />
                    <div className="flex flex-1 items-center justify-between">
                      <span className="text-sm text-gray-700">{rule.label}</span>
                      {rule.hasInput ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">{TEXT.MIN_SCORE}</span>
                          <input
                            type="number"
                            defaultValue={rule.inputValue}
                            className="w-16 rounded border border-gray-200 px-2 py-1 text-center text-xs outline-none focus:border-orange-400"
                          />
                        </div>
                      ) : (
                        <span
                          className={cn(
                            'rounded px-2 py-0.5 text-[10px] font-bold',
                            rule.badgeStyle
                          )}
                        >
                          {rule.badgeText}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-gray-200 pt-4">
                <p className="text-xs text-gray-500">
                  {TEXT.AUTO_APPROVAL_FOOTER.replace(
                    'disabled',
                    autoApprovalEnabled ? 'enabled' : 'disabled'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          Training Progress
          ================================================================ */}
      <section aria-label="Training progress">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100">
                <GraduationCap className="h-[18px] w-[18px] text-orange-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">{TEXT.TRAINING_PROGRESS}</h3>
                <p className="text-xs text-gray-500">{TEXT.TRAINING_SUBTITLE}</p>
              </div>
            </div>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg bg-orange-50 px-4 py-2 text-xs font-medium text-orange-600 transition hover:bg-orange-100"
            >
              <Bell className="h-3.5 w-3.5" />
              {TEXT.REMIND_ALL}
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {trainingSellers.map((seller) => {
              const pct = (seller.modulesCompleted / seller.modulesTotal) * 100;
              return (
                <div key={seller.id} className="flex items-center gap-4 px-6 py-4">
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                      seller.avatarColor
                    )}
                  >
                    {seller.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">
                        {seller.sellerName}
                      </span>
                      <span className="text-xs font-bold text-orange-600">
                        {seller.modulesCompleted}/{seller.modulesTotal} modules
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-gray-200">
                      <div
                        className={cn('h-2.5 rounded-full transition-all', seller.barColor)}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-[11px] text-gray-400">{seller.remaining}</span>
                      <span className={cn('text-[11px] font-medium', seller.statusColor)}>
                        {seller.statusText}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="shrink-0 rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-700 transition hover:bg-orange-100"
                  >
                    {TEXT.SEND_REMINDER}
                  </button>
                </div>
              );
            })}
          </div>
          <div className="rounded-b-xl border-t border-gray-100 bg-gray-50 px-6 py-3">
            <p className="text-[11px] text-gray-500">
              <span className="font-semibold text-gray-600">8 Modules:</span> Platform Intro,
              Account Setup, Product Listing, Pricing &amp; Offers, Order Management, Return
              Handling, Shipping Labels, Seller Dashboard Walkthrough
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================
          SLA Timers
          ================================================================ */}
      <section aria-label="SLA timers">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100">
                <Clock className="h-[18px] w-[18px] text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">{TEXT.SLA_TIMERS}</h3>
                <p className="text-xs text-gray-500">{TEXT.SLA_SUBTITLE}</p>
              </div>
            </div>
            <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700">
              {TEXT.SLA_BREACHED_BADGE}
            </span>
          </div>
          <div className="divide-y divide-gray-100">
            {slaTimers.map((entry) => (
              <div
                key={entry.id}
                className={cn(
                  'flex items-center gap-4 px-6 py-3.5',
                  entry.isBreached && 'bg-red-50/40'
                )}
              >
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                    entry.avatarColor
                  )}
                >
                  {entry.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {entry.sellerName}
                    </span>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[10px] font-bold',
                        entry.stageBadgeStyle
                      )}
                    >
                      {entry.stage}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {entry.daysInStage} days in {entry.stage} stage (SLA: {entry.slaDays} days)
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <div className="text-right">
                    <p
                      className={cn(
                        'flex items-center gap-1 text-xs font-bold',
                        entry.slaTextColor
                      )}
                    >
                      <span
                        className={cn(
                          'h-2 w-2 rounded-full',
                          entry.slaBarColor,
                          (entry.slaStatus === 'yellow' || entry.slaStatus === 'red') &&
                            'animate-pulse'
                        )}
                      />
                      {entry.slaText}
                    </p>
                    <div className="mt-1 h-1.5 w-24 rounded-full bg-gray-200">
                      <div
                        className={cn('h-1.5 rounded-full transition-all', entry.slaBarColor)}
                        style={{ width: `${entry.slaBarPercent}%` }}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className={cn(
                      'rounded-lg border px-3 py-1.5 text-xs font-medium transition',
                      entry.isBreached
                        ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                        : entry.slaStatus === 'yellow'
                          ? 'border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                          : 'border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100'
                    )}
                  >
                    {entry.slaStatus === 'green' ? TEXT.DETAILS : TEXT.ESCALATE}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          All Applications Table
          ================================================================ */}
      <section aria-label="All onboarding applications">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-bold text-gray-900">{TEXT.ALL_APPLICATIONS}</h2>
            <div className="flex items-center gap-3">
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-orange-400"
              >
                <option value="all">{TEXT.ALL_STAGES}</option>
                <option value="applied">Applied</option>
                <option value="documents">Documents</option>
                <option value="verification">Verification</option>
                <option value="training">Training</option>
              </select>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  placeholder={TEXT.SEARCH_PLACEHOLDER}
                  aria-label="Search onboarding applications"
                  className="w-64 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>
          </div>
          {applicationsQuery.isLoading ? (
            <div className="space-y-3 p-6">
              <Skeleton className="h-10 w-full" />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : filteredApplications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {TEXT.SELLER_NAME}
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {TEXT.BUSINESS_TYPE}
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {TEXT.APPLIED_DATE}
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {TEXT.CURRENT_STAGE}
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {TEXT.DOCUMENTS}
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {TEXT.SLA_STATUS_LABEL}
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {TEXT.TRAINING}
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {TEXT.ACTIONS}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredApplications.map((app) => (
                    <ApplicationRow key={app.id} app={app} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-8 text-center text-sm text-gray-400">
              {TEXT.NO_APPLICATIONS}
            </div>
          )}
          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
            <p className="text-xs text-gray-500">{TEXT.PAGINATION_TEXT}</p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="cursor-not-allowed rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-400"
                disabled
              >
                {TEXT.PREVIOUS}
              </button>
              <button
                type="button"
                className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-medium text-white"
              >
                1
              </button>
              <button
                type="button"
                className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-200"
              >
                2
              </button>
              <button
                type="button"
                className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-200"
              >
                {TEXT.NEXT}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          Document Checklist Modal
          ================================================================ */}
      {docModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative mx-4 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900">{TEXT.DOC_CHECKLIST_TITLE}</h3>
              <button
                type="button"
                onClick={() => setDocModalOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3 px-6 py-5">
              {checklist.map((doc) => {
                const isGood = doc.status === 'Verified' || doc.status === 'Uploaded';
                const isPending = doc.status === 'Pending';
                return (
                  <div key={doc.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          'flex h-6 w-6 items-center justify-center rounded-full text-xs',
                          isGood && 'bg-green-100 text-green-600',
                          isPending && 'bg-yellow-100 text-yellow-600',
                          doc.status === 'Missing' && 'bg-red-100 text-red-600',
                          doc.status === 'Rejected' && 'bg-red-100 text-red-600'
                        )}
                      >
                        {isGood ? '\u2713' : isPending ? '\u23F3' : '\u2717'}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                    </div>
                    <span
                      className={cn(
                        'text-xs font-medium',
                        isGood && 'text-green-600',
                        isPending && 'text-yellow-600',
                        (doc.status === 'Missing' || doc.status === 'Rejected') && 'text-red-600'
                      )}
                    >
                      {doc.status}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end gap-2 border-t border-gray-100 bg-gray-50 px-6 py-4">
              <button
                type="button"
                className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700 transition hover:bg-orange-100"
              >
                {TEXT.SEND_REMINDER}
              </button>
              <button
                type="button"
                onClick={() => setDocModalOpen(false)}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
