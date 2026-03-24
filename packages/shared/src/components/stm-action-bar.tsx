'use client';

import { useState } from 'react';
import { Button } from '@homebase/ui';
import type { AllowedAction } from '@homebase/types';
import { ConfirmDialog } from './confirm-dialog';

const DANGEROUS_EVENTS = new Set([
  'CANCEL', 'DELETE', 'REJECT', 'SUSPEND', 'DEACTIVATE',
  'DEPRECATE', 'BLOCK', 'TERMINATE', 'CLOSE', 'DISCARD',
]);

interface StmActionBarProps {
  allowedActions: AllowedAction[];
  onAction: (eventId: string, payload?: unknown) => void;
  loading?: boolean;
  className?: string;
}

export function StmActionBar({
  allowedActions,
  onAction,
  loading = false,
  className,
}: StmActionBarProps) {
  const [confirmAction, setConfirmAction] = useState<AllowedAction | null>(null);

  if (!allowedActions.length) return null;

  const handleAction = (action: AllowedAction) => {
    if (DANGEROUS_EVENTS.has(action.allowedAction)) {
      setConfirmAction(action);
    } else {
      onAction(action.allowedAction);
    }
  };

  return (
    <>
      <div className={`flex flex-wrap gap-2 ${className ?? ''}`}>
        {allowedActions.map((action) => {
          const isDangerous = DANGEROUS_EVENTS.has(action.allowedAction);
          return (
            <Button
              key={action.allowedAction}
              variant={isDangerous ? 'destructive' : 'default'}
              size="sm"
              onClick={() => handleAction(action)}
              disabled={loading}
            >
              {action.allowedAction.replace(/_/g, ' ')}
            </Button>
          );
        })}
      </div>

      {confirmAction && (
        <ConfirmDialog
          open={!!confirmAction}
          onOpenChange={(open) => !open && setConfirmAction(null)}
          title={`Confirm ${confirmAction.allowedAction.replace(/_/g, ' ')}`}
          description={`Are you sure you want to ${confirmAction.allowedAction.toLowerCase().replace(/_/g, ' ')}? This action may not be reversible.`}
          confirmLabel={confirmAction.allowedAction.replace(/_/g, ' ')}
          variant="destructive"
          onConfirm={() => {
            onAction(confirmAction.allowedAction);
            setConfirmAction(null);
          }}
          loading={loading}
        />
      )}
    </>
  );
}
