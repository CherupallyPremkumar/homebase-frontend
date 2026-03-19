'use client';

import { Badge } from '@homebase/ui';
import { getStateColor } from '../lib/state-colors';
import { cn } from '@homebase/ui/src/lib/utils';

interface StateBadgeProps {
  state: string;
  className?: string;
}

export function StateBadge({ state, className }: StateBadgeProps) {
  const color = getStateColor(state);
  return (
    <Badge
      variant="outline"
      className={cn(color.bg, color.text, 'border-0 font-medium', className)}
    >
      <span className={cn('mr-1.5 h-1.5 w-1.5 rounded-full', color.dot)} />
      {state.replace(/_/g, ' ')}
    </Badge>
  );
}
