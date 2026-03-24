import type { AllowedAction } from '@homebase/types';

/**
 * Action category determines how an STM allowed action is rendered in the UI.
 *
 * - primary:   Prominent buttons visible in the header (Approve, Submit, Pay, etc.)
 * - secondary: Inside "More Actions" dropdown
 * - dangerous: Inside dropdown with red text + confirmation dialog (Cancel, Delete, etc.)
 * - edit:      Mapped to an edit/pencil icon or kebab menu
 * - hidden:    System-only events — never shown in UI
 */
export type ActionCategory = 'primary' | 'secondary' | 'dangerous' | 'edit' | 'hidden';

/** Events that are system-internal and must never appear in any user-facing UI. */
const SYSTEM_ONLY_PATTERNS = new Set([
  'CHECK_', // auto-state prefixes
]);

const SYSTEM_ACLS = new Set(['SYSTEM']);

/** Exact-match events that require confirmation and are rendered in red. */
const DANGEROUS_EVENTS = new Set([
  'CANCEL',
  'DELETE',
  'REJECT',
  'SUSPEND',
  'DEACTIVATE',
  'TERMINATE',
  'CLOSE',
  'DISCARD',
  'BLOCK',
  'DEPRECATE',
  'FORCE_CANCEL',
  'REVOKE',
  'BAN',
  'DISABLE',
  'ARCHIVE',
  'ABANDON',
]);

/**
 * Keywords that, when found anywhere in a lowercased event ID, indicate a dangerous action.
 * Covers camelCase events like cancelCheckout, rejectReturn, disableProducts, etc.
 */
const DANGEROUS_KEYWORDS = [
  'cancel',
  'delete',
  'reject',
  'suspend',
  'deactivate',
  'terminate',
  'discard',
  'disable',
  'archive',
  'abandon',
  'revoke',
  'ban',
  'block',
];

/** Events that map to an inline edit action. */
const EDIT_EVENTS = new Set([
  'EDIT',
  'UPDATE',
  'MODIFY',
]);

/** Events that are primary — high-visibility, positive-intent actions. */
const PRIMARY_EVENTS = new Set([
  'APPROVE',
  'SUBMIT',
  'PAY',
  'PROCESS',
  'CONFIRM',
  'COMPLETE',
  'PUBLISH',
  'ACTIVATE',
  'ACCEPT',
  'SHIP',
  'DISPATCH',
  'FULFILL',
  'RESOLVE',
  'VERIFY',
  'RELEASE',
  'START',
  'INITIATE',
  'ASSIGN',
  'REACTIVATE',
  'REFUND',
  'ESCALATE',
]);

/**
 * Categorizes a single STM allowed action for UI rendering.
 * Uses the action's metadata (ACLs, mainPath) and naming conventions.
 */
export function categorizeAction(action: AllowedAction): ActionCategory {
  const eventId = action.allowedAction;

  // System-only ACL → hidden
  if (action.acls) {
    const aclSet = action.acls.split(',').map((a) => a.trim());
    if (aclSet.length === 1 && SYSTEM_ACLS.has(aclSet[0]!)) {
      return 'hidden';
    }
  }

  // Auto-state check events → hidden
  for (const prefix of SYSTEM_ONLY_PATTERNS) {
    if (eventId.startsWith(prefix)) return 'hidden';
  }

  // Edit/Update events → edit
  if (EDIT_EVENTS.has(eventId)) return 'edit';

  // Dangerous events → dangerous (exact match or keyword match)
  if (DANGEROUS_EVENTS.has(eventId)) return 'dangerous';
  const lowerEvent = eventId.toLowerCase();
  if (DANGEROUS_KEYWORDS.some((kw) => lowerEvent.includes(kw))) return 'dangerous';

  // mainPath from STM metadata → primary
  if (action.mainPath === 'true') return 'primary';

  // Named primary events → primary
  if (PRIMARY_EVENTS.has(eventId)) return 'primary';

  // Everything else → secondary
  return 'secondary';
}

/** Result of categorizing all allowed actions for a given entity state. */
export interface CategorizedActions {
  primary: AllowedAction[];
  secondary: AllowedAction[];
  dangerous: AllowedAction[];
  edit: AllowedAction[];
}

/**
 * Categorizes an array of AllowedAction into groups for rendering.
 * Hidden actions are filtered out entirely.
 *
 * @param actions - The allowedActionsAndMetadata array from backend
 * @param overrideDangerous - Optional set of additional event IDs to treat as dangerous
 * @returns Categorized action groups
 */
export function categorizeActions(
  actions: AllowedAction[],
  overrideDangerous?: Set<string>,
): CategorizedActions {
  const result: CategorizedActions = {
    primary: [],
    secondary: [],
    dangerous: [],
    edit: [],
  };

  for (const action of actions) {
    // Check override dangerous set first
    if (overrideDangerous?.has(action.allowedAction)) {
      result.dangerous.push(action);
      continue;
    }

    const category = categorizeAction(action);
    if (category === 'hidden') continue;
    result[category].push(action);
  }

  return result;
}

/**
 * Formats an event ID for display.
 * Converts SCREAMING_SNAKE_CASE to Title Case.
 *
 * Examples:
 *   PAYMENT_SUCCEEDED → Payment Succeeded
 *   CANCEL → Cancel
 *   MARK_AS_DELIVERED → Mark As Delivered
 */
export function formatEventLabel(eventId: string): string {
  return eventId
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}

/** Returns true if the action has only one secondary/primary action (useful for row-level default action). */
export function getPrimaryRowAction(actions: AllowedAction[]): AllowedAction | null {
  const categorized = categorizeActions(actions);
  // First primary, then first secondary
  return categorized.primary[0] ?? categorized.secondary[0] ?? null;
}
