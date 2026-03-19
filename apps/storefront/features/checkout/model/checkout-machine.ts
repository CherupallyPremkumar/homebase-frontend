import type { AllowedAction, Checkout, Address } from '@homebase/types';

// UI steps — these are frontend-only, NOT backend states
export type CheckoutUIStep = 'LOADING' | 'ADDRESS' | 'PAYMENT' | 'REVIEW' | 'SUBMITTING' | 'SUCCESS' | 'ERROR';

// The mapping: backend allowed events → UI step
const EVENT_TO_STEP: Record<string, CheckoutUIStep> = {
  SET_ADDRESS: 'ADDRESS',
  SET_PAYMENT: 'PAYMENT',
  PLACE_ORDER: 'REVIEW',
};

// State
export interface CheckoutState {
  step: CheckoutUIStep;
  checkoutId: string | null;
  checkout: Checkout | null;
  allowedActions: AllowedAction[];
  selectedAddress: Address | null;
  paymentMethod: string | null;
  orderId: string | null;
  error: string | null;
  completedSteps: Set<CheckoutUIStep>;
}

// Actions
export type CheckoutAction =
  | { type: 'INIT_SUCCESS'; checkoutId: string; checkout: Checkout; allowedActions: AllowedAction[] }
  | { type: 'INIT_ERROR'; error: string }
  | { type: 'ADDRESS_SELECTED'; address: Address; checkout: Checkout; allowedActions: AllowedAction[] }
  | { type: 'PAYMENT_SELECTED'; method: string; checkout: Checkout; allowedActions: AllowedAction[] }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS'; orderId: string }
  | { type: 'SUBMIT_ERROR'; error: string }
  | { type: 'GO_BACK' }
  | { type: 'RETRY' };

export const initialCheckoutState: CheckoutState = {
  step: 'LOADING',
  checkoutId: null,
  checkout: null,
  allowedActions: [],
  selectedAddress: null,
  paymentMethod: null,
  orderId: null,
  error: null,
  completedSteps: new Set(),
};

/**
 * Derives the current UI step from backend's allowedActions.
 * The backend is the source of truth — we just map its events to UI steps.
 */
export function deriveStepFromActions(allowedActions: AllowedAction[]): CheckoutUIStep {
  // Check allowed events in priority order
  for (const action of allowedActions) {
    const step = EVENT_TO_STEP[action.eventId];
    if (step) return step;
  }
  // If no recognized events, we're in an unknown state
  return 'REVIEW';
}

/**
 * Checks if a specific backend event is currently allowed.
 */
export function isEventAllowed(allowedActions: AllowedAction[], eventId: string): boolean {
  return allowedActions.some((a) => a.eventId === eventId);
}

/**
 * The reducer — pure function, all transitions are explicit.
 * No step can be skipped because the backend controls what's allowed.
 */
export function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
  switch (action.type) {
    case 'INIT_SUCCESS': {
      const step = deriveStepFromActions(action.allowedActions);
      return {
        ...state,
        step,
        checkoutId: action.checkoutId,
        checkout: action.checkout,
        allowedActions: action.allowedActions,
        error: null,
      };
    }

    case 'INIT_ERROR':
      return { ...state, step: 'ERROR', error: action.error };

    case 'ADDRESS_SELECTED': {
      const step = deriveStepFromActions(action.allowedActions);
      return {
        ...state,
        step,
        selectedAddress: action.address,
        checkout: action.checkout,
        allowedActions: action.allowedActions,
        completedSteps: new Set([...state.completedSteps, 'ADDRESS']),
        error: null,
      };
    }

    case 'PAYMENT_SELECTED': {
      const step = deriveStepFromActions(action.allowedActions);
      return {
        ...state,
        step,
        paymentMethod: action.method,
        checkout: action.checkout,
        allowedActions: action.allowedActions,
        completedSteps: new Set([...state.completedSteps, 'PAYMENT']),
        error: null,
      };
    }

    case 'SUBMIT_START':
      return { ...state, step: 'SUBMITTING', error: null };

    case 'SUBMIT_SUCCESS':
      return {
        ...state,
        step: 'SUCCESS',
        orderId: action.orderId,
        completedSteps: new Set([...state.completedSteps, 'REVIEW']),
      };

    case 'SUBMIT_ERROR':
      return { ...state, step: 'ERROR', error: action.error };

    case 'GO_BACK': {
      // Can only go back to a completed step
      const stepOrder: CheckoutUIStep[] = ['ADDRESS', 'PAYMENT', 'REVIEW'];
      const currentIndex = stepOrder.indexOf(state.step);
      if (currentIndex > 0) {
        return { ...state, step: stepOrder[currentIndex - 1]! };
      }
      return state;
    }

    case 'RETRY':
      // Go back to the last known good step
      if (state.checkout && state.allowedActions.length) {
        return {
          ...state,
          step: deriveStepFromActions(state.allowedActions),
          error: null,
        };
      }
      return { ...state, step: 'LOADING', error: null };

    default:
      return state;
  }
}

/**
 * Step metadata for progress bar rendering.
 */
export const STEP_META: { step: CheckoutUIStep; label: string; backendEvent: string }[] = [
  { step: 'ADDRESS', label: 'Address', backendEvent: 'SET_ADDRESS' },
  { step: 'PAYMENT', label: 'Payment', backendEvent: 'SET_PAYMENT' },
  { step: 'REVIEW', label: 'Review', backendEvent: 'PLACE_ORDER' },
];
