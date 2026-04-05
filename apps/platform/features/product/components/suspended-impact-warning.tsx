import { AlertTriangle } from 'lucide-react';
import { mockAccountImpact } from '../services/product-detail-state-mock';

const TEXT = {
  title: 'Account Impact',
  activeSuspensions: 'Active suspensions',
  max: 'max',
} as const;

export function SuspendedImpactWarning() {
  const impact = mockAccountImpact;
  const percent = (impact.activeSuspensions / impact.maxSuspensions) * 100;

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-5">
      <div className="mb-3 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-red-600" />
        <h4 className="text-sm font-semibold text-red-800">{TEXT.title}</h4>
      </div>
      <p className="text-sm text-red-700">
        {TEXT.activeSuspensions}: <span className="font-bold">{impact.activeSuspensions}</span> of {impact.maxSuspensions} {TEXT.max}
      </p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-red-200">
        <div className="h-full rounded-full bg-red-500" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-2 text-xs font-medium text-red-600">{impact.warning}</p>
    </div>
  );
}
