import { Clock, AlertTriangle } from 'lucide-react';
import { mockSlaInfo } from '../services/product-detail-state-mock';

const TEXT = {
  title: 'SLA Countdown',
  remaining: 'remaining',
  slaInfo: '48 hours from submission',
  submitted: 'Submitted',
  due: 'Due',
  warning: 'Warning: Approaching SLA deadline. Review must be completed within the next 18 hours.',
} as const;

export function ReviewSlaCountdown() {
  const sla = mockSlaInfo;
  const progress = ((sla.totalHours - sla.remainingHours) / sla.totalHours) * 100;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <div className="mb-3 flex items-center gap-2">
        <Clock className="h-5 w-5 text-amber-500" />
        <h4 className="text-sm font-semibold text-gray-900">{TEXT.title}</h4>
      </div>
      <p className="text-3xl font-bold text-amber-600">{sla.remainingHours}h <span className="text-sm font-medium text-gray-400">{TEXT.remaining}</span></p>
      <p className="mt-1 text-xs text-gray-400">{TEXT.slaInfo}</p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
        <div className="h-full rounded-full bg-gradient-to-r from-green-400 to-amber-400" style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-gray-400">
        <span>{TEXT.submitted}: {new Date(sla.submittedAt).toLocaleDateString('en-IN')}</span>
        <span>{TEXT.due}: {new Date(sla.dueAt).toLocaleDateString('en-IN')}</span>
      </div>
      {sla.isWarning && (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p className="text-xs text-amber-700">{TEXT.warning}</p>
        </div>
      )}
    </div>
  );
}
