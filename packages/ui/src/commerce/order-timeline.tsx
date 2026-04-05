import { Check } from 'lucide-react';
import { cn } from '../lib/utils';

export type StepStatus = 'completed' | 'current' | 'pending';

export interface TimelineStep {
  title: string;
  description?: string;
  date?: string;
  time?: string;
  status: StepStatus;
}

export interface OrderTimelineProps {
  steps: TimelineStep[];
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

function StepCircle({ status }: { status: StepStatus }) {
  if (status === 'completed') {
    return (
      <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center shadow-sm shrink-0">
        <Check className="w-4 h-4 text-white" strokeWidth={3} />
      </div>
    );
  }

  if (status === 'current') {
    return (
      <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center shadow-md ring-4 ring-brand-100 shrink-0">
        <div className="w-2.5 h-2.5 rounded-full bg-white" />
      </div>
    );
  }

  return (
    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
      <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
    </div>
  );
}

function VerticalTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="space-y-0">
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;
        return (
          <div key={idx} className={cn('relative pl-12', !isLast && 'pb-8')}>
            {/* Connecting line */}
            {!isLast && (
              <div
                className={cn(
                  'absolute left-[17px] top-9 bottom-0 w-0.5',
                  step.status === 'completed' && 'bg-green-600',
                  step.status === 'current' &&
                    'bg-gradient-to-b from-brand-500 to-gray-200',
                  step.status === 'pending' && 'bg-gray-200'
                )}
              />
            )}

            {/* Circle */}
            <div className="absolute left-0 top-0">
              <StepCircle status={step.status} />
            </div>

            {/* Content */}
            <div className="flex items-start justify-between">
              <div>
                <h4
                  className={cn(
                    'text-sm font-semibold',
                    step.status === 'completed' && 'text-[#0F1B2D]',
                    step.status === 'current' && 'text-brand-600',
                    step.status === 'pending' && 'text-gray-400'
                  )}
                >
                  {step.title}
                </h4>
                {step.description && (
                  <p
                    className={cn(
                      'text-xs mt-0.5',
                      step.status === 'pending' ? 'text-gray-300' : 'text-gray-500'
                    )}
                  >
                    {step.description}
                  </p>
                )}
              </div>
              {(step.date || step.time) && (
                <div className="text-right shrink-0 ml-4">
                  {step.date && (
                    <p
                      className={cn(
                        'text-xs',
                        step.status === 'pending'
                          ? 'text-gray-300'
                          : 'font-medium text-[#0F1B2D]'
                      )}
                    >
                      {step.date}
                    </p>
                  )}
                  {step.time && (
                    <p
                      className={cn(
                        'text-[11px]',
                        step.status === 'pending' ? 'text-gray-300' : 'text-gray-400'
                      )}
                    >
                      {step.time}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function HorizontalTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="flex items-start w-full">
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;
        return (
          <div key={idx} className={cn('flex flex-col items-center', !isLast && 'flex-1')}>
            <div className="flex items-center w-full">
              <StepCircle status={step.status} />
              {!isLast && (
                <div
                  className={cn(
                    'flex-1 h-0.5',
                    step.status === 'completed' && 'bg-green-600',
                    step.status === 'current' &&
                      'bg-gradient-to-r from-brand-500 to-gray-200',
                    step.status === 'pending' && 'bg-gray-200'
                  )}
                />
              )}
            </div>
            <div className="mt-2 text-center max-w-[120px]">
              <h4
                className={cn(
                  'text-xs font-semibold',
                  step.status === 'completed' && 'text-[#0F1B2D]',
                  step.status === 'current' && 'text-brand-600',
                  step.status === 'pending' && 'text-gray-400'
                )}
              >
                {step.title}
              </h4>
              {step.date && (
                <p
                  className={cn(
                    'text-[10px] mt-0.5',
                    step.status === 'pending' ? 'text-gray-300' : 'text-gray-500'
                  )}
                >
                  {step.date}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function OrderTimeline({
  steps,
  direction = 'vertical',
  className,
}: OrderTimelineProps) {
  return (
    <div className={cn(className)}>
      {direction === 'vertical' ? (
        <VerticalTimeline steps={steps} />
      ) : (
        <HorizontalTimeline steps={steps} />
      )}
    </div>
  );
}
