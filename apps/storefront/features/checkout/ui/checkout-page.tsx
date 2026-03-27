'use client';

import { useReducer, useEffect } from 'react';
import Link from 'next/link';
import { Separator, Button } from '@homebase/ui';
import {
  useCartStore,
  formatPriceRupees,
  FREE_SHIPPING_THRESHOLD,
  ErrorSection,
  SectionSkeleton,
  track,
  getErrorMessage,
} from '@homebase/shared';
import {
  checkoutReducer,
  initialCheckoutState,
  isEventAllowed,
} from '../model/checkout-machine';
import { useCreateCheckout, useSetCheckoutAddress, useSetCheckoutPayment, usePlaceOrder } from '../api/queries';
import { CheckoutProgress } from './checkout-progress';
import { AddressStep } from './address-step';
import { PaymentStep } from './payment-step';
import { ReviewStep } from './review-step';
import type { Address } from '@homebase/types';

export function CheckoutPage() {
  const [state, dispatch] = useReducer(checkoutReducer, initialCheckoutState);
  const { items, subtotal, clear: clearCart } = useCartStore();

  const createCheckout = useCreateCheckout();
  const setAddress = useSetCheckoutAddress();
  const setPayment = useSetCheckoutPayment();
  const placeOrder = usePlaceOrder();

  useEffect(() => {
    if (items.length === 0) return;

    createCheckout.mutate(undefined, {
      onSuccess: (data) => {
        dispatch({
          type: 'INIT_SUCCESS',
          checkoutId: data.mutatedEntity.id,
          checkout: data.mutatedEntity,
          allowedActions: data.allowedActionsAndMetadata,
        });
      },
      onError: (error) => {
        dispatch({ type: 'INIT_ERROR', error: getErrorMessage(error) });
      },
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddressSubmit = (address: Address) => {
    if (!state.checkoutId || !isEventAllowed(state.allowedActions, 'SET_ADDRESS')) return;

    setAddress.mutate(
      { id: state.checkoutId, payload: { shippingAddressId: address.id || 'new', billingAddressId: address.id } },
      {
        onSuccess: (data) => {
          dispatch({
            type: 'ADDRESS_SELECTED',
            address,
            checkout: data.mutatedEntity,
            allowedActions: data.allowedActionsAndMetadata,
          });
        },
        onError: (error) => {
          dispatch({ type: 'SUBMIT_ERROR', error: getErrorMessage(error) });
        },
      },
    );
  };

  const handlePaymentSubmit = (method: string) => {
    if (!state.checkoutId || !isEventAllowed(state.allowedActions, 'SET_PAYMENT')) return;

    setPayment.mutate(
      { id: state.checkoutId, payload: { paymentMethod: method } },
      {
        onSuccess: (data) => {
          dispatch({
            type: 'PAYMENT_SELECTED',
            method,
            checkout: data.mutatedEntity,
            allowedActions: data.allowedActionsAndMetadata,
          });
        },
        onError: (error) => {
          dispatch({ type: 'SUBMIT_ERROR', error: getErrorMessage(error) });
        },
      },
    );
  };

  const handlePlaceOrder = () => {
    if (!state.checkoutId || !isEventAllowed(state.allowedActions, 'PLACE_ORDER')) return;

    dispatch({ type: 'SUBMIT_START' });

    placeOrder.mutate(
      { id: state.checkoutId },
      {
        onSuccess: (data) => {
          const orderId = data.mutatedEntity.orderId || data.mutatedEntity.id;
          dispatch({ type: 'SUBMIT_SUCCESS', orderId });
          clearCart();
          track('purchase', { orderId, value: data.mutatedEntity.total });
        },
        onError: (error) => {
          dispatch({ type: 'SUBMIT_ERROR', error: getErrorMessage(error) });
        },
      },
    );
  };

  const handleBack = () => dispatch({ type: 'GO_BACK' });

  const sub = subtotal();
  const shipping = sub >= FREE_SHIPPING_THRESHOLD ? 0 : 49;
  const total = sub + shipping;

  if (items.length === 0 && state.step !== 'SUCCESS') {
    return (
      <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4">
        <p className="text-lg font-medium text-gray-900">Your cart is empty</p>
        <Link href="/products">
          <Button className="mt-4">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Checkout</h1>

      {state.step === 'LOADING' && <SectionSkeleton rows={4} />}

      {state.step === 'ERROR' && (
        <ErrorSection error={state.error} onRetry={() => dispatch({ type: 'RETRY' })} />
      )}

      {state.step === 'SUCCESS' && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <span className="text-3xl text-green-600">&#10003;</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Order Placed!</h2>
          <p className="mt-2 text-gray-500">Order ID: {state.orderId}</p>
          <div className="mt-6 flex gap-3">
            <Link href={`/orders/${state.orderId}`}>
              <Button>Track Order</Button>
            </Link>
            <Link href="/products">
              <Button variant="outline">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      )}

      {['ADDRESS', 'PAYMENT', 'REVIEW', 'SUBMITTING'].includes(state.step) && (
        <>
          <CheckoutProgress
            currentStep={state.step === 'SUBMITTING' ? 'REVIEW' : state.step}
            completedSteps={state.completedSteps}
          />

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {state.step === 'ADDRESS' && (
                <AddressStep
                  onSubmit={handleAddressSubmit}
                  loading={setAddress.isPending}
                />
              )}

              {state.step === 'PAYMENT' && (
                <PaymentStep
                  onSubmit={handlePaymentSubmit}
                  onBack={handleBack}
                  loading={setPayment.isPending}
                />
              )}

              {(state.step === 'REVIEW' || state.step === 'SUBMITTING') && state.checkout && (
                <ReviewStep
                  checkout={state.checkout}
                  selectedAddress={state.selectedAddress}
                  paymentMethod={state.paymentMethod}
                  onSubmit={handlePlaceOrder}
                  onBack={handleBack}
                  loading={state.step === 'SUBMITTING'}
                />
              )}
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="font-semibold">Order Summary</h3>
              <Separator className="my-3" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Items ({items.length})</span>
                  <span>{formatPriceRupees(sub)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : formatPriceRupees(shipping)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span>{formatPriceRupees(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
