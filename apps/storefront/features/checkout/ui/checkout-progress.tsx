'use client';

import { Check } from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';
import { STEP_META, type CheckoutUIStep } from '../model/checkout-machine';

interface CheckoutProgressProps {
  currentStep: CheckoutUIStep;
  completedSteps: Set<CheckoutUIStep>;
}

export function CheckoutProgress({ currentStep, completedSteps }: CheckoutProgressProps) {
  return (
    <div className="mb-8 flex items-center justify-center gap-4">
      {STEP_META.map((meta, i) => {
        const isCompleted = completedSteps.has(meta.step);
        const isCurrent = currentStep === meta.step;

        return (
          <div key={meta.step} className="flex items-center gap-2">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold',
                isCompleted
                  ? 'bg-green-500 text-white'
                  : isCurrent
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-500',
              )}
            >
              {isCompleted ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={cn('text-sm', isCurrent ? 'font-semibold' : 'text-gray-500')}>
              {meta.label}
            </span>
            {i < STEP_META.length - 1 && (
              <div className={cn('h-px w-8 sm:w-16', isCompleted ? 'bg-green-500' : 'bg-gray-300')} />
            )}
          </div>
        );
      })}
    </div>
  );
}
