'use client';

import { useState } from 'react';
import { Button } from '@homebase/ui';
import type { AllowedAction } from '@homebase/types';
import { ConfirmDialog } from './confirm-dialog';

/**
 * Default set of event IDs that are treated as destructive (require confirmation).
 * Matches the DANGEROUS_EVENTS set in @homebase/ui action-utils for consistency.
 */
const DEFAULT_DESTRUCTIVE_EVENTS = new Set([
  'CANCEL', 'DELETE', 'REJECT', 'SUSPEND', 'DEACTIVATE',
  'TERMINATE', 'CLOSE', 'DISCARD', 'BLOCK', 'DEPRECATE',
  'FORCE_CANCEL', 'REVOKE', 'BAN', 'DISABLE', 'ARCHIVE', 'ABANDON',
]);

/**
 * Keywords that, when found in a lowercased event ID, indicate a destructive action.
 * Covers compound events like REJECT_RETURN, CANCEL_ORDER, etc.
 */
const DESTRUCTIVE_KEYWORDS = [
  'cancel', 'delete', 'reject', 'suspend', 'deactivate',
  'terminate', 'discard', 'disable', 'archive', 'abandon',
  'revoke', 'ban', 'block',
];

/** System-only events that should never appear in the UI. */
const SYSTEM_ACLS = new Set(['SYSTEM']);

/**
 * Converts an event ID (SCREAMING_SNAKE_CASE) into a human-readable label.
 * e.g. "APPROVE_ORDER" -> "Approve Order"
 */
function defaultFormatLabel(eventId: string): string {
  return eventId
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}

function isDestructive(eventId: string, extraDestructive?: Set<string>): boolean {
  if (extraDestructive?.has(eventId)) return true;
  if (DEFAULT_DESTRUCTIVE_EVENTS.has(eventId)) return true;
  const lower = eventId.toLowerCase();
  return DESTRUCTIVE_KEYWORDS.some((kw) => lower.includes(kw));
}

function isSystemOnly(action: AllowedAction): boolean {
  if (action.acls) {
    const aclSet = action.acls.split(',').map((a) => a.trim());
    if (aclSet.length === 1 && SYSTEM_ACLS.has(aclSet[0]!)) return true;
  }
  if (action.allowedAction.startsWith('CHECK_')) return true;
  return false;
}

export interface StmActionBarProps {
  allowedActions: AllowedAction[];
  onAction: (eventId: string, bodyType?: string) => void;
  isLoading?: boolean;
  /** @deprecated Use isLoading instead */
  loading?: boolean;
  destructiveActions?: string[];
  actionLabels?: Record<string, string>;
  actionVariants?: Record<string, 'default' | 'destructive' | 'outline' | 'secondary'>;
  className?: string;
}

export function StmActionBar({
  allowedActions,
  onAction,
  isLoading,
  loading,
  destructiveActions,
  actionLabels,
  actionVariants,
  className,
}: StmActionBarProps) {
  const [confirmAction, setConfirmAction] = useState<AllowedAction | null>(null);
  const isBusy = isLoading ?? loading ?? false;
  const extraDestructive = destructiveActions ? new Set(destructiveActions) : undefined;

  // Filter out system-only actions
  const visibleActions = allowedActions.filter((a) => !isSystemOnly(a));

  if (!visibleActions.length) return null;

  const getLabel = (eventId: string): string => {
    if (actionLabels?.[eventId]) return actionLabels[eventId];
    return defaultFormatLabel(eventId);
  };

  const getVariant = (action: AllowedAction): 'default' | 'destructive' | 'outline' | 'secondary' => {
    if (actionVariants?.[action.allowedAction]) return actionVariants[action.allowedAction];
    if (isDestructive(action.allowedAction, extraDestructive)) return 'destructive';
    return 'default';
  };

  const handleAction = (action: AllowedAction) => {
    if (isDestructive(action.allowedAction, extraDestructive)) {
      setConfirmAction(action);
    } else {
      onAction(action.allowedAction, action.bodyType);
    }
  };

  return (
    <>
      <div className={`flex flex-wrap gap-2 ${className ?? ''}`}>
        {visibleActions.map((action) => (
          <Button
            key={action.allowedAction}
            variant={getVariant(action)}
            size="sm"
            onClick={() => handleAction(action)}
            disabled={isBusy}
          >
            {getLabel(action.allowedAction)}
          </Button>
        ))}
      </div>

      {confirmAction && (
        <ConfirmDialog
          open={!!confirmAction}
          onOpenChange={(open) => !open && setConfirmAction(null)}
          title={`Confirm ${getLabel(confirmAction.allowedAction)}`}
          description={`Are you sure you want to ${getLabel(confirmAction.allowedAction).toLowerCase()}? This action may not be reversible.`}
          confirmLabel={getLabel(confirmAction.allowedAction)}
          variant="destructive"
          onConfirm={() => {
            onAction(confirmAction.allowedAction, confirmAction.bodyType);
            setConfirmAction(null);
          }}
          loading={isBusy}
        />
      )}
    </>
  );
}
