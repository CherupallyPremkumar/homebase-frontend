'use client';

import { CheckCircle, X, AlertTriangle, Check } from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';
import { mockComplianceIssues } from '../services/product-detail-state-mock';

const TEXT = {
  title: 'Compliance Review',
  issuesFound: '2 issues found \u2014 review required',
  reject: 'Reject & Return to Seller',
  approveWarnings: 'Approve with Warnings',
  approvePublish: 'Approve & Publish',
  warningsInfo: 'Products approved with warnings will show a notice to the seller',
} as const;

const STATUS_STYLE = {
  fail: { bg: 'bg-red-50', border: 'border-red-200', icon: X, iconColor: 'text-red-500', textColor: 'text-red-800' },
  warn: { bg: 'bg-amber-50', border: 'border-amber-200', icon: AlertTriangle, iconColor: 'text-amber-500', textColor: 'text-amber-800' },
  pass: { bg: 'bg-green-50', border: 'border-green-200', icon: Check, iconColor: 'text-green-500', textColor: 'text-green-800' },
};

export function ReviewComplianceTab() {
  const issues = mockComplianceIssues;
  const failed = issues.filter((i) => i.status === 'fail');
  const passed = issues.filter((i) => i.status === 'pass');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-amber-500" />
        <p className="text-sm font-semibold text-gray-900">{TEXT.issuesFound}</p>
      </div>

      {/* Failed checks */}
      {failed.map((issue) => {
        const s = STATUS_STYLE[issue.status];
        const Icon = s.icon;
        return (
          <div key={issue.label} className={cn('flex items-start gap-3 rounded-xl border p-4', s.bg, s.border)}>
            <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', s.iconColor)} />
            <div className="flex-1">
              <p className={cn('text-sm font-semibold', s.textColor)}>{issue.label}</p>
              <p className="mt-0.5 text-xs text-gray-600">{issue.description}</p>
            </div>
            {issue.action && (
              <button className="shrink-0 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-brand-600 transition hover:bg-brand-50">
                {issue.action}
              </button>
            )}
          </div>
        );
      })}

      {/* Passed checks */}
      <div className="space-y-2">
        {passed.map((issue) => {
          const s = STATUS_STYLE[issue.status];
          const Icon = s.icon;
          return (
            <div key={issue.label} className={cn('flex items-center gap-3 rounded-lg border px-4 py-3', s.bg, s.border)}>
              <Icon className={cn('h-4 w-4', s.iconColor)} />
              <span className={cn('text-sm', s.textColor)}>{issue.label}</span>
              <span className="ml-auto text-xs text-gray-400">{issue.description}</span>
            </div>
          );
        })}
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-5 py-4">
        <p className="text-xs text-gray-500">{TEXT.warningsInfo}</p>
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50">
            {TEXT.reject}
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-amber-600">
            <AlertTriangle className="h-3.5 w-3.5" /> {TEXT.approveWarnings}
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-green-700">
            <Check className="h-3.5 w-3.5" /> {TEXT.approvePublish}
          </button>
        </div>
      </div>
    </div>
  );
}
