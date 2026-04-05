import { CheckSquare, Info } from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';
import { mockRemediationSteps } from '../services/product-detail-state-mock';

const TEXT = {
  title: 'Remediation Checklist',
  description: 'Seller must complete all steps before product can be reactivated',
  estimatedReactivation: 'Estimated reactivation date if completed by Apr 5: Apr 7, 2026',
} as const;

export function SuspendedRemediation() {
  const steps = mockRemediationSteps;
  const done = steps.filter((s) => s.status === 'done').length;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5 text-gray-500" />
          <h4 className="text-sm font-semibold text-gray-900">{TEXT.title}</h4>
        </div>
        <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold', done === steps.length ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700')}>
          {done} of {steps.length} completed
        </span>
      </div>
      <p className="mb-4 text-xs text-gray-500">{TEXT.description}</p>

      <div className="space-y-3">
        {steps.map((step, i) => (
          <div key={i} className={cn('flex items-start gap-3 rounded-lg border p-3', step.status === 'done' ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50')}>
            <input type="checkbox" checked={step.status === 'done'} readOnly className="mt-0.5 accent-green-600" />
            <div>
              <p className={cn('text-sm font-medium', step.status === 'done' ? 'text-green-700 line-through' : 'text-amber-800')}>
                Step {i + 1}: {step.label}
              </p>
              <p className="mt-0.5 text-xs text-gray-500">{step.description}</p>
            </div>
            <span className={cn('ml-auto shrink-0 text-[10px] font-semibold', step.status === 'done' ? 'text-green-600' : 'text-amber-600')}>
              {step.status === 'done' ? 'Done' : 'Pending'}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-lg bg-blue-50 p-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
        <p className="text-xs text-blue-700">{TEXT.estimatedReactivation}</p>
      </div>
    </div>
  );
}
