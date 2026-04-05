import { CheckCircle } from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';
import type { ComplianceCheckItem } from '../types';
import { mockComplianceChecklist } from '../services/product-detail-state-mock';

const TEXT = {
  title: 'Pre-Flight Compliance Checklist',
} as const;

const STATUS_DOT: Record<string, string> = {
  ready: 'bg-green-500',
  partial: 'bg-amber-500',
  missing: 'bg-red-500',
};

const STATUS_LABEL: Record<string, { text: string; color: string }> = {
  ready: { text: 'Ready', color: 'text-green-600' },
  partial: { text: 'Partial', color: 'text-amber-600' },
  missing: { text: 'Missing', color: 'text-red-600' },
};

export function DraftComplianceChecklist() {
  const items = mockComplianceChecklist;
  const ready = items.filter((i) => i.status === 'ready').length;
  const partial = items.filter((i) => i.status === 'partial').length;
  const missing = items.filter((i) => i.status === 'missing').length;

  return (
    <section className="rounded-xl border border-gray-100 bg-white p-6">
      <div className="mb-4 flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-brand-500" />
        <h3 className="font-semibold text-gray-900">{TEXT.title}</h3>
      </div>
      <p className="mb-4 text-xs text-gray-500">
        <span className="font-semibold text-green-600">{ready} Ready</span>,{' '}
        <span className="font-semibold text-amber-600">{partial} Partial</span>,{' '}
        <span className="font-semibold text-red-600">{missing} Missing</span>
      </p>
      <div className="space-y-3">
        {items.map((item) => {
          const label = STATUS_LABEL[item.status];
          return (
            <div key={item.label} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className={cn('h-2.5 w-2.5 rounded-full', STATUS_DOT[item.status])} />
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">{item.detail}</span>
                <span className={cn('text-xs font-semibold', label.color)}>{label.text}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
