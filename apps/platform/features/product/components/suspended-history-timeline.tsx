import { Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';
import { mockSuspensionHistory } from '../services/product-detail-state-mock';

const TEXT = {
  title: 'Suspension History for This Product',
  warning: 'Repeated violations may result in permanent removal from the marketplace.',
} as const;

export function SuspendedHistoryTimeline() {
  const entries = mockSuspensionHistory;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6">
      <div className="mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5 text-gray-500" />
        <h3 className="font-semibold text-gray-900">{TEXT.title}</h3>
      </div>

      <div className="space-y-4">
        {entries.map((entry) => (
          <div
            key={entry.number}
            className={cn(
              'rounded-xl border p-4',
              entry.status === 'active' ? 'border-red-200 bg-red-50/50' : 'border-gray-200 bg-gray-50',
            )}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={cn('h-2 w-2 rounded-full', entry.status === 'active' ? 'bg-red-500 animate-pulse' : 'bg-green-500')} />
                <span className="text-sm font-semibold text-gray-900">Suspension #{entry.number}</span>
              </div>
              <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold', entry.status === 'active' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700')}>
                {entry.status === 'active' ? 'Active' : 'Resolved'}
              </span>
            </div>
            <p className="text-xs text-gray-600">{entry.reason}</p>
            <p className="mt-1 text-[10px] text-gray-400">
              {entry.date}
              {entry.resolvedDate && ` — Resolved ${entry.resolvedDate}`}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 p-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <p className="text-xs text-amber-700">{TEXT.warning}</p>
      </div>
    </div>
  );
}
