'use client';

import { useState, useCallback } from 'react';
import {
  Settings, Package, Tag, TrendingUp,
  BarChart3, Plus, AlertTriangle, Inbox,
} from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';
import { Skeleton } from '@homebase/ui';

import {
  usePricingRuleStats,
  usePricingRules,
  usePriceChangeLog,
  useRuleConflict,
} from '../hooks/use-pricing-rules';
import type { PricingRuleType } from '../services/pricing-rules-mock';

// ----------------------------------------------------------------
// Constants (i18n-ready)
// ----------------------------------------------------------------

const TEXT = {
  pageTitle: 'Pricing Rules',
  pageDescription: 'Configure markup, discount, floor, and ceiling pricing rules for products',
  simulateImpact: 'Simulate Price Impact',
  createRule: 'Create Rule',
  conflictBadge: 'Action Required',
  resolveConflict: 'Resolve Conflict',
  sectionRulePerformance: 'Rule Performance',
  filterAll: 'All',
  filterMarkup: 'Markup',
  filterDiscount: 'Discount',
  filterFloor: 'Floor',
  filterCeiling: 'Ceiling',
  colRuleName: 'Rule Name',
  colType: 'Type',
  colProducts: 'Products',
  colConversions: 'Conversions',
  colRevenueImpact: 'Revenue Impact',
  colStatus: 'Status',
  colActions: 'Actions',
  actionEdit: 'Edit',
  sectionChangeLog: 'Recent Bulk Price Changes',
  emptyTitle: 'No pricing rules found',
  emptySubtitle: 'Create a pricing rule to get started with automated pricing.',
  errorTitle: 'Failed to load pricing rules',
  retry: 'Retry',
  tableLabel: 'Pricing rules list',
  changeLogLabel: 'Recent price change log',
} as const;

// ----------------------------------------------------------------
// Registries
// ----------------------------------------------------------------

const TYPE_BADGE_CONFIG: Record<PricingRuleType, { bg: string; text: string }> = {
  Markup: { bg: 'bg-blue-50', text: 'text-blue-600' },
  Discount: { bg: 'bg-green-50', text: 'text-green-600' },
  Floor: { bg: 'bg-orange-50', text: 'text-orange-600' },
  Ceiling: { bg: 'bg-red-50', text: 'text-red-600' },
};

const STAT_ICONS = [
  { icon: Settings, bg: 'bg-blue-50', color: 'text-blue-500' },
  { icon: Package, bg: 'bg-orange-50', color: 'text-orange-500' },
  { icon: Tag, bg: 'bg-green-50', color: 'text-green-500' },
  { icon: TrendingUp, bg: 'bg-emerald-50', color: 'text-emerald-500' },
] as const;

const TYPE_FILTERS: PricingRuleType[] = ['Markup', 'Discount', 'Floor', 'Ceiling'];

const REVENUE_IMPACT_COLORS = {
  emerald: 'text-emerald-600',
  red: 'text-red-500',
  muted: 'text-gray-500',
} as const;

const CONVERSIONS_COLORS = {
  active: 'text-green-600',
  neutral: 'text-gray-600',
  muted: 'text-gray-400',
} as const;

// ----------------------------------------------------------------
// Component
// ----------------------------------------------------------------

export function PricingRules() {
  const [typeFilter, setTypeFilter] = useState('All');

  const statsQuery = usePricingRuleStats();
  const rulesQuery = usePricingRules(typeFilter);
  const changeLogQuery = usePriceChangeLog();
  const conflictQuery = useRuleConflict();

  const handleFilterChange = useCallback((filter: string) => {
    setTypeFilter(filter);
  }, []);

  // ------ LOADING STATE ------
  if (statsQuery.isLoading || rulesQuery.isLoading) {
    return <PricingRulesSkeleton />;
  }

  // ------ ERROR STATE ------
  if (statsQuery.isError || rulesQuery.isError) {
    return (
      <section className="flex flex-col items-center justify-center py-32" role="alert">
        <AlertTriangle className="h-12 w-12 text-red-400" />
        <h2 className="mt-4 text-lg font-semibold text-gray-900">{TEXT.errorTitle}</h2>
        <p className="mt-1 text-sm text-gray-500">
          {(statsQuery.error ?? rulesQuery.error)?.message}
        </p>
        <button
          onClick={() => { statsQuery.refetch(); rulesQuery.refetch(); }}
          className="mt-6 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          {TEXT.retry}
        </button>
      </section>
    );
  }

  const stats = statsQuery.data;
  const rules = rulesQuery.data ?? [];
  const changeLog = changeLogQuery.data ?? [];
  const conflict = conflictQuery.data;
  const isEmpty = rules.length === 0;

  const statEntries = stats
    ? [stats.activeRules, stats.productsAffected, stats.avgDiscount, stats.revenueImpact]
    : [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{TEXT.pageTitle}</h1>
          <p className="mt-1 text-sm text-gray-500">{TEXT.pageDescription}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-gray-50">
            <BarChart3 className="h-4 w-4" />
            {TEXT.simulateImpact}
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600">
            <Plus className="h-4 w-4" />
            {TEXT.createRule}
          </button>
        </div>
      </div>

      {/* Stats */}
      <section
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Pricing rule statistics"
      >
        {statEntries.map((stat, idx) => {
          const iconCfg = STAT_ICONS[idx];
          const Icon = iconCfg.icon;
          const isRevenueImpact = idx === 3;

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-100 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {stat.label}
                </span>
                <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', iconCfg.bg)}>
                  <Icon className={cn('h-5 w-5', iconCfg.color)} />
                </div>
              </div>
              <p className={cn('text-2xl font-bold', isRevenueImpact ? 'text-emerald-600' : 'text-gray-900')}>
                {stat.value}
              </p>
              <p className={cn('mt-1 text-xs font-medium', stat.subtitleColor ?? 'text-gray-400')}>
                {stat.subtitle}
              </p>
            </div>
          );
        })}
      </section>

      {/* Rule Conflict Detection */}
      {conflict && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <h3 className="text-sm font-bold text-red-800">{conflict.title}</h3>
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase text-red-700">
                    {TEXT.conflictBadge}
                  </span>
                </div>
                <p className="text-sm text-red-700">
                  <strong>&ldquo;{conflict.ruleA}&rdquo;</strong> ({conflict.ruleADetail}) conflicts with{' '}
                  <strong>&ldquo;{conflict.ruleB}&rdquo;</strong> ({conflict.ruleBDetail}).
                </p>
                <p className="mt-1 text-sm text-red-700">
                  Result: {conflict.resultLine}<strong className="text-red-800">{conflict.resultHighlight}</strong>
                </p>
                <p className="mt-2 text-xs text-red-500">
                  <strong>{conflict.affectedLine}</strong>
                </p>
              </div>
            </div>
            <button className="ml-4 shrink-0 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700">
              {TEXT.resolveConflict}
            </button>
          </div>
        </div>
      )}

      {/* Rule Performance Table */}
      <section className="rounded-xl border border-gray-100 bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">{TEXT.sectionRulePerformance}</h2>
          <nav className="flex items-center gap-2" role="tablist" aria-label="Filter by rule type">
            <button
              role="tab"
              aria-selected={typeFilter === 'All'}
              onClick={() => handleFilterChange('All')}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-medium transition',
                typeFilter === 'All'
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-gray-500 hover:bg-gray-50',
              )}
            >
              {TEXT.filterAll}
            </button>
            {TYPE_FILTERS.map((filter) => (
              <button
                key={filter}
                role="tab"
                aria-selected={typeFilter === filter}
                onClick={() => handleFilterChange(filter)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-medium transition',
                  typeFilter === filter
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-500 hover:bg-gray-50',
                )}
              >
                {filter}
              </button>
            ))}
          </nav>
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Inbox className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-base font-semibold text-gray-900">{TEXT.emptyTitle}</h3>
            <p className="mt-1 text-sm text-gray-500">{TEXT.emptySubtitle}</p>
            <button
              onClick={() => handleFilterChange('All')}
              className="mt-6 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
            >
              Show All Rules
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label={TEXT.tableLabel}>
              <thead>
                <tr className="border-b border-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                  <th scope="col" className="px-6 py-3">{TEXT.colRuleName}</th>
                  <th scope="col" className="px-4 py-3">{TEXT.colType}</th>
                  <th scope="col" className="px-4 py-3">{TEXT.colProducts}</th>
                  <th scope="col" className="px-4 py-3">{TEXT.colConversions}</th>
                  <th scope="col" className="px-4 py-3">{TEXT.colRevenueImpact}</th>
                  <th scope="col" className="px-4 py-3">{TEXT.colStatus}</th>
                  <th scope="col" className="px-4 py-3">{TEXT.colActions}</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule, index) => {
                  const typeBadge = TYPE_BADGE_CONFIG[rule.type];
                  const isLast = index === rules.length - 1;
                  const conversionsColor = rule.conversions === '--'
                    ? CONVERSIONS_COLORS.muted
                    : parseFloat(rule.conversions) >= 12
                      ? CONVERSIONS_COLORS.active
                      : CONVERSIONS_COLORS.neutral;

                  return (
                    <tr
                      key={rule.id}
                      className={cn(
                        'transition-colors hover:bg-orange-50/40',
                        !isLast && 'border-b border-gray-50',
                      )}
                    >
                      <td className="px-6 py-3.5 font-medium">{rule.name}</td>
                      <td className="px-4 py-3.5">
                        <span className={cn('rounded px-2 py-1 text-xs font-semibold', typeBadge.bg, typeBadge.text)}>
                          {rule.typeLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">{rule.productsAffected.toLocaleString()}</td>
                      <td className="px-4 py-3.5">
                        <span className={cn('font-semibold', conversionsColor)}>
                          {rule.conversions}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={cn('font-semibold', REVENUE_IMPACT_COLORS[rule.revenueImpactColor])}>
                          {rule.revenueImpact}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <ToggleSwitch checked={rule.enabled} label={`Toggle ${rule.name}`} />
                      </td>
                      <td className="px-4 py-3.5">
                        <button className="text-xs font-medium text-orange-500 transition hover:text-orange-600">
                          {TEXT.actionEdit}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Recent Bulk Price Changes */}
      <section className="rounded-xl border border-gray-100 bg-white" aria-label={TEXT.changeLogLabel}>
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">{TEXT.sectionChangeLog}</h2>
        </div>
        {changeLogQuery.isLoading ? (
          <div className="animate-pulse space-y-4 p-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : changeLogQuery.isError ? (
          <div className="flex flex-col items-center justify-center py-12" role="alert">
            <AlertTriangle className="h-8 w-8 text-red-400" />
            <p className="mt-2 text-sm text-gray-500">{changeLogQuery.error?.message}</p>
            <button
              onClick={() => changeLogQuery.refetch()}
              className="mt-4 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
            >
              {TEXT.retry}
            </button>
          </div>
        ) : changeLog.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Inbox className="h-8 w-8 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">No recent price changes.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {changeLog.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">{entry.title}</p>
                  <p className="text-xs text-gray-500">{entry.description}</p>
                </div>
                <span className="shrink-0 text-xs text-gray-400">{entry.timeAgo}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ----------------------------------------------------------------
// Toggle Switch (matches prototype CSS toggle)
// ----------------------------------------------------------------

function ToggleSwitch({ checked, label }: { checked: boolean; label: string }) {
  const [on, setOn] = useState(checked);

  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => setOn(!on)}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors',
        on ? 'bg-green-600' : 'bg-gray-300',
      )}
    >
      <span
        className={cn(
          'pointer-events-none absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform',
          on && 'translate-x-4',
        )}
      />
    </button>
  );
}

// ----------------------------------------------------------------
// Loading skeleton
// ----------------------------------------------------------------

function PricingRulesSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-96" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-44" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      {/* Conflict banner */}
      <Skeleton className="h-28 rounded-xl" />
      {/* Table */}
      <Skeleton className="h-96 rounded-xl" />
      {/* Change log */}
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}
