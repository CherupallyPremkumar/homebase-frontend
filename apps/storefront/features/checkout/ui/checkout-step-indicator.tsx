'use client';

import { cn } from '@homebase/ui/src/lib/utils';

interface CheckoutStepIndicatorProps {
  activeStep: 1 | 2 | 3;
  mobile?: boolean;
  className?: string;
}

const STEPS = [
  { num: 1, label: 'Shipping' },
  { num: 2, label: 'Payment' },
  { num: 3, label: 'Review' },
];

export function CheckoutStepIndicator({ activeStep, mobile = false, className }: CheckoutStepIndicatorProps) {
  const circleSize = mobile ? 'h-7 w-7 text-xs' : 'h-8 w-8 text-sm';
  const labelSize = mobile ? 'text-xs' : 'text-sm';
  const connectorWidth = mobile ? 'w-8 mx-2' : 'w-16 mx-3';

  return (
    <div className={cn('flex items-center justify-center gap-0', className)}>
      {STEPS.map((step, i) => {
        const isActive = step.num === activeStep;
        const isCompleted = step.num < activeStep;

        return (
          <div key={step.num} className="flex items-center">
            <div className="flex items-center gap-1.5 md:gap-2">
              <div
                className={cn(
                  'flex items-center justify-center rounded-full font-bold',
                  circleSize,
                  isActive || isCompleted
                    ? 'bg-brand-500 text-white'
                    : 'bg-gray-200 text-gray-400',
                )}
              >
                {isCompleted ? (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.num
                )}
              </div>
              <span
                className={cn(
                  labelSize,
                  isActive ? 'font-semibold text-brand-600' : 'font-medium text-gray-400',
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn('h-0.5 rounded-full bg-gray-200', connectorWidth)}>
                {isCompleted && <div className="h-full w-full rounded-full bg-brand-500" />}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
