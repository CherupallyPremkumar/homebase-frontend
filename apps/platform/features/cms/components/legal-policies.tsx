'use client';

import { useCallback, useState } from 'react';
import {
  FileText,
  Shield,
  RotateCcw,
  Truck,
  Handshake,
  Globe,
  RefreshCw,
  AlertCircle,
  Inbox,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  Table,
  X,
  ArrowRightLeft,
  FileSearch,
} from 'lucide-react';
import { Skeleton } from '@homebase/ui';
import { cn } from '@homebase/ui/src/lib/utils';

import { useLegalPolicies } from '../hooks/use-legal-policies';
import type { LegalPolicy, LegalPolicyType } from '../services/legal-policies-mock';

// ----------------------------------------------------------------
// Text Constants
// ----------------------------------------------------------------

const TEXT = {
  pageTitle: 'Legal Policies',
  pageDescription: 'Manage platform terms, policies, and legal agreements',
  lastPublished: 'Last published: 28 Mar 2026',
  loadingLabel: 'Loading legal policies',
  loadingScreen: 'Loading policy data...',
  errorTitle: 'Failed to load legal policies',
  errorDescription: 'Please check your connection and try again.',
  errorRetry: 'Retry',
  emptyTitle: 'No legal policies found',
  emptyDescription: 'Policies will appear here once created.',
  editorPrefix: 'Editing:',
  editorLastSaved: 'Last saved 2 minutes ago',
  cancelButton: 'Cancel',
  saveDraftButton: 'Save Draft',
  previewButton: 'Preview',
  publishButton: 'Publish',
  versionHistoryTitle: 'Version History',
  restoreButton: 'Restore',
  toolbarParagraph: 'Paragraph',
  toolbarHeading1: 'Heading 1',
  toolbarHeading2: 'Heading 2',
  toolbarHeading3: 'Heading 3',
  toolbarBulletList: 'Bullet List',
  toolbarNumberedList: 'Numbered List',
  toolbarLink: 'Link',
  toolbarTable: 'Table',
  editorPlaceholder: 'Start writing your policy...',
  published: 'Published',
  draft: 'Draft',
  diffHintTitle: 'Recent Policy Change',
  diffHintBody: 'Version 3.2 \u2192 3.3:',
  diffHintWordsChanged: '12 words changed',
  diffHintSection: 'in Section 4 (Returns Policy)',
  diffHintChangedBy: 'Changed by Super Admin on 28 Mar 2026 at 2:15 PM',
  diffHintButtonLabel: 'View Diff',
  diffHintPolicyName: 'Terms & Conditions',
  translationTitle: 'Multi-Language Translation Status',
  translationSubtitle: 'Across all 6 policies',
  analyticsTitle: 'Policy Effectiveness Analytics',
  analyticsTimeRange: 'Last 30 days',
  analyticsMostRead:
    'Most read policy: Return & Refund Policy (3,420 views) \u00b7 Least read: Cookie Policy (240 views)',
} as const;

// ----------------------------------------------------------------
// Icon Registry (per policy type)
// ----------------------------------------------------------------

interface PolicyIconConfig {
  icon: typeof FileText;
  bgColor: string;
  textColor: string;
}

const POLICY_ICON_REGISTRY: Record<LegalPolicyType, PolicyIconConfig> = {
  terms: { icon: FileText, bgColor: 'bg-blue-50', textColor: 'text-blue-500' },
  privacy: { icon: Shield, bgColor: 'bg-purple-50', textColor: 'text-purple-500' },
  returns: { icon: RotateCcw, bgColor: 'bg-orange-50', textColor: 'text-orange-500' },
  shipping: { icon: Truck, bgColor: 'bg-green-50', textColor: 'text-green-500' },
  'seller-agreement': { icon: Handshake, bgColor: 'bg-yellow-50', textColor: 'text-yellow-600' },
  cookies: { icon: Globe, bgColor: 'bg-gray-100', textColor: 'text-gray-500' },
};

// ----------------------------------------------------------------
// Mock Data: Translation Status
// ----------------------------------------------------------------

interface TranslationLanguage {
  name: string;
  status: 'Published' | 'Draft' | 'Not Started';
  completed: number;
  total: number;
}

const TRANSLATION_LANGUAGES: TranslationLanguage[] = [
  { name: 'English', status: 'Published', completed: 6, total: 6 },
  { name: 'Hindi', status: 'Draft', completed: 4, total: 6 },
  { name: 'Tamil', status: 'Not Started', completed: 0, total: 6 },
  { name: 'Marathi', status: 'Not Started', completed: 0, total: 6 },
];

// ----------------------------------------------------------------
// Mock Data: Analytics
// ----------------------------------------------------------------

interface AnalyticMetric {
  value: string;
  label: string;
  subtext: string;
  bgColor: string;
  valueColor: string;
  labelColor: string;
  subtextColor: string;
}

const ANALYTICS_METRICS: AnalyticMetric[] = [
  {
    value: '2m 15s',
    label: 'Avg Time on Page',
    subtext: 'Industry avg: 1m 45s',
    bgColor: 'bg-purple-50',
    valueColor: 'text-purple-700',
    labelColor: 'text-purple-600',
    subtextColor: 'text-purple-400',
  },
  {
    value: '34%',
    label: 'Bounce Rate',
    subtext: 'Down from 42% last month',
    bgColor: 'bg-orange-50',
    valueColor: 'text-orange-700',
    labelColor: 'text-orange-600',
    subtextColor: 'text-orange-400',
  },
  {
    value: '67%',
    label: 'Read Completion',
    subtext: 'Up from 58% last month',
    bgColor: 'bg-green-50',
    valueColor: 'text-green-700',
    labelColor: 'text-green-600',
    subtextColor: 'text-green-400',
  },
];

// ----------------------------------------------------------------
// Format helpers
// ----------------------------------------------------------------

function formatWordCount(count: number): string {
  return count.toLocaleString('en-IN');
}

function translationStatusStyle(status: TranslationLanguage['status']) {
  switch (status) {
    case 'Published':
      return {
        border: 'border-green-200',
        bg: 'bg-green-50',
        badgeBg: 'bg-green-100',
        badgeText: 'text-green-700',
        barTrack: 'bg-green-200',
        barFill: 'bg-green-600',
        countText: 'text-green-700',
      };
    case 'Draft':
      return {
        border: 'border-yellow-200',
        bg: 'bg-yellow-50',
        badgeBg: 'bg-yellow-100',
        badgeText: 'text-yellow-700',
        barTrack: 'bg-yellow-200',
        barFill: 'bg-yellow-500',
        countText: 'text-yellow-700',
      };
    case 'Not Started':
    default:
      return {
        border: 'border-gray-200',
        bg: 'bg-gray-50',
        badgeBg: 'bg-gray-200',
        badgeText: 'text-gray-600',
        barTrack: 'bg-gray-200',
        barFill: 'bg-gray-400',
        countText: 'text-gray-500',
      };
  }
}

// ----------------------------------------------------------------
// Sub-components: Loading / Error / Empty states
// ----------------------------------------------------------------

function PoliciesSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300" role="status" aria-label={TEXT.loadingLabel}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-8 w-48 rounded-lg" />
      </div>

      {/* Diff hint skeleton */}
      <Skeleton className="h-32 w-full rounded-xl" />

      {/* Translation status skeleton */}
      <div className="rounded-xl border border-gray-100 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-5 w-56" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Analytics skeleton */}
      <div className="rounded-xl border border-gray-100 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-7 w-28 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Policy cards skeleton */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-100 bg-white p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-11 w-11 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-52" />
                </div>
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-4">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">{TEXT.loadingScreen}</span>
    </div>
  );
}

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
        {TEXT.errorRetry}
      </button>
    </section>
  );
}

function EmptyState() {
  return (
    <section className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-12">
      <Inbox className="mb-4 h-12 w-12 text-gray-300" aria-hidden="true" />
      <h2 className="text-lg font-semibold text-gray-900">{TEXT.emptyTitle}</h2>
      <p className="mt-1 text-sm text-gray-500">{TEXT.emptyDescription}</p>
    </section>
  );
}

// ----------------------------------------------------------------
// Policy Version Diff Hint
// ----------------------------------------------------------------

function PolicyDiffHint() {
  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
          <ArrowRightLeft className="h-5 w-5 text-blue-600" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-blue-900">{TEXT.diffHintTitle}</h3>
          <p className="mt-1 text-sm text-blue-700">
            <span className="font-bold">{TEXT.diffHintPolicyName}</span>{' '}
            {TEXT.diffHintBody}{' '}
            <span className="font-semibold">{TEXT.diffHintWordsChanged}</span>{' '}
            {TEXT.diffHintSection}
          </p>
          <p className="mt-1 text-xs text-blue-500">{TEXT.diffHintChangedBy}</p>
          <button
            type="button"
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <FileSearch className="h-4 w-4" aria-hidden="true" />
            {TEXT.diffHintButtonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Multi-Language Translation Status
// ----------------------------------------------------------------

function TranslationStatus() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">{TEXT.translationTitle}</h3>
        <span className="text-xs text-gray-400">{TEXT.translationSubtitle}</span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TRANSLATION_LANGUAGES.map((lang) => {
          const style = translationStatusStyle(lang.status);
          const pct = lang.total > 0 ? Math.round((lang.completed / lang.total) * 100) : 0;
          return (
            <div key={lang.name} className={cn('rounded-lg border p-4', style.border, style.bg)}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">{lang.name}</span>
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium',
                    style.badgeBg,
                    style.badgeText,
                  )}
                >
                  {lang.status}
                </span>
              </div>
              <div className={cn('mb-1.5 h-1.5 w-full rounded-full', style.barTrack)}>
                <div
                  className={cn('h-1.5 rounded-full', style.barFill)}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className={cn('text-xs font-medium', style.countText)}>
                {lang.completed}/{lang.total} policies {lang.completed === lang.total ? 'complete' : 'translated'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Policy Effectiveness Analytics
// ----------------------------------------------------------------

function PolicyAnalytics() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">{TEXT.analyticsTitle}</h3>
        <select className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-600 outline-none focus:border-orange-400">
          <option>Last 30 days</option>
          <option>Last 7 days</option>
          <option>Last 90 days</option>
        </select>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {ANALYTICS_METRICS.map((metric) => (
          <div key={metric.label} className={cn('rounded-lg p-4 text-center', metric.bgColor)}>
            <p className={cn('text-2xl font-bold', metric.valueColor)}>{metric.value}</p>
            <p className={cn('mt-0.5 text-xs font-medium', metric.labelColor)}>{metric.label}</p>
            <p className={cn('mt-1 text-[10px]', metric.subtextColor)}>{metric.subtext}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-gray-400">{TEXT.analyticsMostRead}</p>
    </div>
  );
}

// ----------------------------------------------------------------
// Policy Card
// ----------------------------------------------------------------

interface PolicyCardProps {
  policy: LegalPolicy;
  isSelected: boolean;
  onSelect: (policy: LegalPolicy) => void;
}

function PolicyCard({ policy, isSelected, onSelect }: PolicyCardProps) {
  const iconConfig = POLICY_ICON_REGISTRY[policy.policyType];
  const Icon = iconConfig.icon;
  const isDraft = policy.status === 'Draft';

  return (
    <article
      className={cn(
        'rounded-xl border bg-white p-6 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg',
        isDraft ? 'border-yellow-200' : 'border-gray-100',
        isSelected && 'ring-2 ring-orange-400',
      )}
      onClick={() => onSelect(policy)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(policy);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Edit ${policy.title}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={cn('flex h-11 w-11 items-center justify-center rounded-lg', iconConfig.bgColor)}>
            <Icon className={cn('h-5 w-5', iconConfig.textColor)} aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{policy.title}</h3>
            <p className="mt-0.5 text-xs text-gray-400">{policy.description}</p>
          </div>
        </div>
        <span
          className={cn(
            'rounded-full px-2 py-1 text-[10px] font-medium',
            isDraft ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700',
          )}
        >
          {isDraft ? TEXT.draft : TEXT.published}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-4 text-xs text-gray-400">
        <span>
          Version {policy.version} &middot; {formatWordCount(policy.wordCount)} words
        </span>
        <span>Updated: {policy.lastUpdated}</span>
      </div>
    </article>
  );
}

// ----------------------------------------------------------------
// Policy Editor
// ----------------------------------------------------------------

interface PolicyEditorProps {
  policy: LegalPolicy;
  onClose: () => void;
}

function PolicyEditor({ policy, onClose }: PolicyEditorProps) {
  const [content, setContent] = useState(policy.content);

  return (
    <section
      className="rounded-xl border border-gray-100 bg-white shadow-sm"
      aria-label={`${TEXT.editorPrefix} ${policy.title}`}
    >
      {/* Editor Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            {TEXT.editorPrefix} {policy.title}
          </h2>
          <p className="mt-0.5 text-xs text-gray-400">
            Version {policy.version} &middot; {TEXT.editorLastSaved}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            {TEXT.cancelButton}
          </button>
          <button
            type="button"
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            aria-label={`Save draft of ${policy.title}`}
          >
            {TEXT.saveDraftButton}
          </button>
          <button
            type="button"
            className="rounded-lg border border-orange-200 px-4 py-2 text-sm font-medium text-orange-600 transition hover:bg-orange-50"
            aria-label={`Preview ${policy.title}`}
          >
            {TEXT.previewButton}
          </button>
          <button
            type="button"
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
            aria-label={`Publish ${policy.title}`}
          >
            {TEXT.publishButton}
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b border-gray-100 bg-gray-50 px-6 py-2">
        <button
          type="button"
          className="rounded p-2 text-sm font-bold text-gray-600 transition hover:bg-white hover:shadow-sm"
          title="Bold"
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="rounded p-2 text-sm italic text-gray-600 transition hover:bg-white hover:shadow-sm"
          title="Italic"
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="rounded p-2 text-sm text-gray-600 underline transition hover:bg-white hover:shadow-sm"
          title="Underline"
          aria-label="Underline"
        >
          <Underline className="h-4 w-4" aria-hidden="true" />
        </button>
        <span className="mx-1 h-5 w-px bg-gray-300" aria-hidden="true" />
        <select
          className="rounded border border-gray-200 bg-white px-2 py-1 text-sm"
          aria-label="Text format"
          defaultValue="paragraph"
        >
          <option value="paragraph">{TEXT.toolbarParagraph}</option>
          <option value="h1">{TEXT.toolbarHeading1}</option>
          <option value="h2">{TEXT.toolbarHeading2}</option>
          <option value="h3">{TEXT.toolbarHeading3}</option>
        </select>
        <span className="mx-1 h-5 w-px bg-gray-300" aria-hidden="true" />
        <button
          type="button"
          className="rounded p-2 text-xs text-gray-600 transition hover:bg-white hover:shadow-sm"
          title={TEXT.toolbarBulletList}
          aria-label={TEXT.toolbarBulletList}
        >
          <List className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="rounded p-2 text-xs text-gray-600 transition hover:bg-white hover:shadow-sm"
          title={TEXT.toolbarNumberedList}
          aria-label={TEXT.toolbarNumberedList}
        >
          <ListOrdered className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="rounded p-2 text-xs text-gray-600 transition hover:bg-white hover:shadow-sm"
          title={TEXT.toolbarLink}
          aria-label={TEXT.toolbarLink}
        >
          <Link2 className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="rounded p-2 text-xs text-gray-600 transition hover:bg-white hover:shadow-sm"
          title={TEXT.toolbarTable}
          aria-label={TEXT.toolbarTable}
        >
          <Table className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* Content Area */}
      <div className="p-6">
        <textarea
          className="w-full min-h-[400px] rounded-lg border border-gray-200 p-4 text-sm leading-relaxed outline-none transition focus:border-orange-400 focus:ring-1 focus:ring-orange-200 resize-y"
          placeholder={TEXT.editorPlaceholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          aria-label={`Content editor for ${policy.title}`}
        />
      </div>

      {/* Version History */}
      <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
        <h4 className="mb-3 text-sm font-semibold text-gray-700">{TEXT.versionHistoryTitle}</h4>
        <div className="space-y-2">
          {policy.versionHistory.map((entry) => (
            <div key={entry.version} className="flex items-center justify-between text-xs">
              <span className="text-gray-600">
                {entry.version} &mdash; {entry.date}
              </span>
              <span className="text-gray-400">By {entry.author}</span>
              <button
                type="button"
                className="text-orange-500 transition hover:underline"
                aria-label={`Restore version ${entry.version}`}
              >
                {TEXT.restoreButton}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------

export function LegalPolicies() {
  const [selectedPolicy, setSelectedPolicy] = useState<LegalPolicy | null>(null);

  const policiesQuery = useLegalPolicies();

  const handleRetry = useCallback(() => {
    policiesQuery.refetch();
  }, [policiesQuery]);

  const handleSelectPolicy = useCallback((policy: LegalPolicy) => {
    setSelectedPolicy(policy);
    setTimeout(() => {
      document.getElementById('policy-editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }, []);

  const handleCloseEditor = useCallback(() => {
    setSelectedPolicy(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // ---- Loading ----
  if (policiesQuery.isLoading) return <PoliciesSkeleton />;

  // ---- Error ----
  if (policiesQuery.isError) {
    return <ErrorBanner message={TEXT.errorTitle} onRetry={handleRetry} />;
  }

  // ---- Empty ----
  const policies = policiesQuery.data;
  if (!policies || policies.length === 0) return <EmptyState />;

  // ---- Success ----
  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{TEXT.pageTitle}</h1>
          <p className="mt-1 text-sm text-gray-500">{TEXT.pageDescription}</p>
        </div>
        <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs text-gray-400">
          {TEXT.lastPublished}
        </span>
      </header>

      {/* Policy Version Diff Hint */}
      <PolicyDiffHint />

      {/* Multi-Language Translation Status */}
      <TranslationStatus />

      {/* Policy Effectiveness Analytics */}
      <PolicyAnalytics />

      {/* Policy Cards Grid */}
      <section aria-label="Policy cards">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2" role="list">
          {policies.map((policy) => (
            <div key={policy.id} role="listitem">
              <PolicyCard
                policy={policy}
                isSelected={selectedPolicy?.id === policy.id}
                onSelect={handleSelectPolicy}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Inline Editor (shown when a policy is selected) */}
      {selectedPolicy && (
        <div id="policy-editor">
          <PolicyEditor policy={selectedPolicy} onClose={handleCloseEditor} />
        </div>
      )}
    </div>
  );
}
