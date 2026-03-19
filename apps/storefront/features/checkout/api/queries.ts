'use client';

import { useMutation } from '@tanstack/react-query';
import { checkoutApi } from '@homebase/api-client';
import type { CheckoutAddressPayload, CheckoutPaymentPayload } from '@homebase/types';

export function useCreateCheckout() {
  return useMutation({
    mutationFn: () => checkoutApi.create(),
  });
}

export function useSetCheckoutAddress() {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CheckoutAddressPayload }) =>
      checkoutApi.setAddress(id, payload),
  });
}

export function useSetCheckoutPayment() {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CheckoutPaymentPayload }) =>
      checkoutApi.setPayment(id, payload),
  });
}

export function usePlaceOrder() {
  return useMutation({
    mutationFn: ({ id }: { id: string }) => checkoutApi.placeOrder(id),
  });
}
