'use client';

import { Edit, Lock, AlertCircle, RefreshCw } from 'lucide-react';
import { Skeleton } from '@homebase/ui';

import { useCategoryRules, useCategoryAttributes } from '../hooks/use-categories';
import type { CategoryRule, CategoryAttribute } from '../types';

// ----------------------------------------------------------------
// Text constants
// ----------------------------------------------------------------

const TEXT = {
  sectionLabel: 'Category rules and configuration',
  title: 'Category Rules & Configuration',
  subtitle: 'Commission, tax, attributes, listing rules, restrictions, returns, and shipping per category',
  colCategory: 'Category',
  colCommission: 'Commission',
  colGst: 'GST Rate',
  colAttributes: 'Required Attributes',
  colListing: 'Listing Rules',
  colGated: 'Gated?',
  colReturn: 'Return Policy',
  colShipping: 'Shipping Rules',
  colActions: 'Actions',
  noData: 'No category rules found',
  noDataSubtitle: 'Rules will appear here once categories are configured.',
  errorTitle: 'Failed to load category rules',
  errorSubtitle: 'Please check your connection and try again.',
  retry: 'Retry',
  gated: 'Gated',
  restricted: 'Restricted',
  no: 'No',
  nonReturnable: 'Non-returnable',
  images: 'images',
  chars: 'chars',
  editRules: 'Edit Rules',
  days: 'days',
  kg: 'kg',
} as const;

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

function getRestrictionBadge(restrictionType: string, license: string) {
  if (!restrictionType || restrictionType === 'none' || restrictionType === 'None') {
    return (
      <span className="text-xs font-semibold text-gray-400">{TEXT.no}</span>
    );
  }
  const isRestricted = restrictionType.toLowerCase() === 'restricted';
  return (
    <div>
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
          isRestricted
            ? 'bg-red-50 text-red-700'
            : 'bg-amber-50 text-amber-700'
        }`}
      >
        <Lock className="h-3 w-3" aria-hidden="true" />
        {isRestricted ? TEXT.restricted : TEXT.gated}
      </span>
      {license && (
        <p className={`mt-1 text-[10px] ${isRestricted ? 'text-red-600' : 'text-amber-600'}`}>
          {license}
        </p>
      )}
    </div>
  );
}

function getReturnDisplay(rule: CategoryRule) {
  if (rule.returnDays <= 0 || rule.returnType.toLowerCase() === 'non-returnable') {
    return (
      <div>
        <p className="text-xs font-medium text-gray-700">{TEXT.nonReturnable}</p>
        <p className="text-[10px] text-gray-400">
          {rule.returnType === 'Non-returnable' ? 'Hygiene/safety policy' : rule.returnType}
        </p>
      </div>
    );
  }
  return (
    <div>
      <p className="text-xs font-medium text-gray-700">
        {rule.returnDays} {TEXT.days}
      </p>
      <p className="text-[10px] text-gray-400">{rule.returnType}</p>
    </div>
  );
}

function getShippingDisplay(rule: CategoryRule) {
  return (
    <div>
      <p className="text-xs text-gray-600">
        Max {rule.maxWeightKg} {TEXT.kg}
      </p>
      <p className="text-[10px] text-gray-400">{rule.shippingType}</p>
    </div>
  );
}

function getListingDisplay(rule: CategoryRule) {
  const lines: string[] = [];
  if (rule.minImages > 0) lines.push(`Min ${rule.minImages} ${TEXT.images}`);
  if (rule.minDescriptionLength > 0) lines.push(`Description ${rule.minDescriptionLength}+ ${TEXT.chars}`);
  if (rule.eanRequired) lines.push('EAN/UPC required');
  return lines;
}

// ----------------------------------------------------------------
// Attribute Tags
// ----------------------------------------------------------------

function AttributeTags({ attributes }: { attributes: CategoryAttribute[] }) {
  if (attributes.length === 0) {
    return <span className="text-xs text-gray-400">--</span>;
  }

  const sorted = [...attributes].sort((a, b) => {
    if (a.isRequired && !b.isRequired) return -1;
    if (!a.isRequired && b.isRequired) return 1;
    return a.sortOrder - b.sortOrder;
  });

  return (
    <div className="flex flex-wrap gap-1">
      {sorted.map((attr) => (
        <span
          key={attr.id}
          className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
            attr.isRequired
              ? 'bg-green-50 text-green-700'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {attr.attributeName}
          {attr.isRequired && '*'}
        </span>
      ))}
    </div>
  );
}

// ----------------------------------------------------------------
// Table Row
// ----------------------------------------------------------------

function RuleRow({
  rule,
  attributes,
}: {
  rule: CategoryRule;
  attributes: CategoryAttribute[];
}) {
  const listingRules = getListingDisplay(rule);

  return (
    <tr className="transition-colors hover:bg-orange-50/20">
      <td className="sticky left-0 bg-white px-5 py-4 font-semibold text-gray-900">
        {rule.categoryName}
      </td>
      <td className="px-4 py-4 text-center">
        <span className="font-bold text-orange-600">{rule.commissionRate}%</span>
      </td>
      <td className="px-4 py-4 text-center">
        <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
          {rule.gstRate}%
        </span>
      </td>
      <td className="px-4 py-4">
        <AttributeTags attributes={attributes} />
      </td>
      <td className="px-4 py-4">
        {listingRules.map((line, i) => (
          <p key={i} className="text-xs text-gray-600">
            {line}
          </p>
        ))}
      </td>
      <td className="px-4 py-4 text-center">
        {getRestrictionBadge(rule.restrictionType, rule.requiredLicense)}
      </td>
      <td className="px-4 py-4">
        {getReturnDisplay(rule)}
      </td>
      <td className="px-4 py-4">
        {getShippingDisplay(rule)}
      </td>
      <td className="px-4 py-4 text-center">
        <button
          type="button"
          className="rounded-md p-1.5 text-gray-400 transition hover:bg-orange-50 hover:text-orange-500"
          title={`${TEXT.editRules} - ${rule.categoryName}`}
          aria-label={`${TEXT.editRules} for ${rule.categoryName}`}
        >
          <Edit className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}

// ----------------------------------------------------------------
// Skeleton
// ----------------------------------------------------------------

export function RulesTableSkeleton() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-5">
        <Skeleton className="h-6 w-72" />
        <Skeleton className="mt-2 h-4 w-96" />
      </div>
      <div className="p-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="mb-3 h-16 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------

export function CategoryRulesTable() {
  const rulesQuery = useCategoryRules();
  const attributesQuery = useCategoryAttributes();

  // Loading
  if (rulesQuery.isLoading || attributesQuery.isLoading) {
    return <RulesTableSkeleton />;
  }

  // Error
  if (rulesQuery.isError) {
    return (
      <section
        className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-12"
        role="alert"
        aria-live="assertive"
      >
        <AlertCircle className="mb-4 h-12 w-12 text-red-400" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-gray-900">{TEXT.errorTitle}</h2>
        <p className="mt-1 text-sm text-gray-500">{TEXT.errorSubtitle}</p>
        <button
          type="button"
          onClick={() => rulesQuery.refetch()}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          {TEXT.retry}
        </button>
      </section>
    );
  }

  const rules = rulesQuery.data ?? [];
  const attributesByCategory = attributesQuery.data ?? new Map();

  // Empty
  if (rules.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-12">
        <h2 className="text-lg font-semibold text-gray-900">{TEXT.noData}</h2>
        <p className="mt-1 text-sm text-gray-500">{TEXT.noDataSubtitle}</p>
      </section>
    );
  }

  return (
    <section aria-label={TEXT.sectionLabel}>
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{TEXT.title}</h2>
            <p className="mt-0.5 text-sm text-gray-500">{TEXT.subtitle}</p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label={TEXT.sectionLabel}>
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th className="sticky left-0 bg-gray-50/80 px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  {TEXT.colCategory}
                </th>
                <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  {TEXT.colCommission}
                </th>
                <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  {TEXT.colGst}
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  {TEXT.colAttributes}
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  {TEXT.colListing}
                </th>
                <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  {TEXT.colGated}
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  {TEXT.colReturn}
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  {TEXT.colShipping}
                </th>
                <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  {TEXT.colActions}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rules.map((rule) => (
                <RuleRow
                  key={rule.categoryId}
                  rule={rule}
                  attributes={attributesByCategory.get(rule.categoryId) ?? []}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
