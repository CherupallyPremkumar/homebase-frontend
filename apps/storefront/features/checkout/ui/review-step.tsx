'use client';

import { Button, Card, CardContent, CardHeader, CardTitle, Separator } from '@homebase/ui';
import { formatPriceRupees } from '@homebase/shared';
import type { Checkout, Address } from '@homebase/types';

interface ReviewStepProps {
  checkout: Checkout;
  selectedAddress: Address | null;
  paymentMethod: string | null;
  onSubmit: () => void;
  onBack: () => void;
  loading: boolean;
}

const PAYMENT_LABELS: Record<string, string> = {
  cod: 'Cash on Delivery',
  upi: 'UPI',
  card: 'Credit/Debit Card',
};

export function ReviewStep({ checkout, selectedAddress, paymentMethod, onSubmit, onBack, loading }: ReviewStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Your Order</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items */}
        <div>
          <h4 className="mb-2 text-sm font-semibold text-gray-700">Items</h4>
          {checkout.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 py-2 text-sm">
              <div className="h-12 w-12 flex-shrink-0 rounded bg-gray-100">
                {item.imageUrl && <img src={item.imageUrl} alt="" className="h-full w-full rounded object-cover" />}
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.productName}</p>
                <p className="text-gray-500">Qty: {item.quantity}</p>
              </div>
              <span className="font-medium">{formatPriceRupees(item.totalPrice)}</span>
            </div>
          ))}
        </div>

        <Separator />

        {/* Address */}
        {selectedAddress && (
          <div>
            <h4 className="mb-1 text-sm font-semibold text-gray-700">Shipping Address</h4>
            <p className="text-sm text-gray-600">{selectedAddress.fullName}</p>
            <p className="text-sm text-gray-500">
              {selectedAddress.addressLine1}, {selectedAddress.city}, {selectedAddress.state} {selectedAddress.pincode}
            </p>
          </div>
        )}

        {/* Payment */}
        {paymentMethod && (
          <div>
            <h4 className="mb-1 text-sm font-semibold text-gray-700">Payment</h4>
            <p className="text-sm text-gray-600">{PAYMENT_LABELS[paymentMethod] ?? paymentMethod}</p>
          </div>
        )}

        <Separator />

        {/* Total */}
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Subtotal</span>
            <span>{formatPriceRupees(checkout.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Shipping</span>
            <span>{formatPriceRupees(checkout.shippingCost)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Tax</span>
            <span>{formatPriceRupees(checkout.taxAmount)}</span>
          </div>
          {checkout.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-{formatPriceRupees(checkout.discount)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{formatPriceRupees(checkout.total)}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack} disabled={loading}>
            Back
          </Button>
          <Button onClick={onSubmit} disabled={loading} className="flex-1">
            {loading ? 'Placing Order...' : `Place Order \u2014 ${formatPriceRupees(checkout.total)}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
