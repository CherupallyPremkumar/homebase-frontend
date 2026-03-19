'use client';

import { useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Separator, Input, Label, RadioGroup, RadioGroupItem } from '@homebase/ui';
import { useCartStore, formatPriceRupees, FREE_SHIPPING_THRESHOLD } from '@homebase/shared';
import { Check } from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';

const STEPS = ['Address', 'Payment', 'Review'];

export function CheckoutClient() {
  const [step, setStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const { items, subtotal } = useCartStore();

  const sub = subtotal();
  const shipping = sub >= FREE_SHIPPING_THRESHOLD ? 0 : 49;
  const total = sub + shipping;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Checkout</h1>

      {/* Progress */}
      <div className="mb-8 flex items-center justify-center gap-4">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold',
                i < step ? 'bg-green-500 text-white' : i === step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500',
              )}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={cn('text-sm', i === step ? 'font-semibold' : 'text-gray-500')}>{s}</span>
            {i < STEPS.length - 1 && <div className="h-px w-8 bg-gray-300 sm:w-16" />}
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Step 1: Address */}
          {step === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" placeholder="John Doe" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" placeholder="9876543210" className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address1">Address Line 1</Label>
                  <Input id="address1" placeholder="House/Flat No., Street" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="address2">Address Line 2</Label>
                  <Input id="address2" placeholder="Landmark (optional)" className="mt-1" />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input id="pincode" placeholder="560001" maxLength={6} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Bangalore" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input id="state" placeholder="Karnataka" className="mt-1" />
                  </div>
                </div>
                <Button onClick={() => setStep(1)} className="mt-4">
                  Continue to Payment
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Payment */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center gap-3 rounded border p-4">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <span className="font-medium">Cash on Delivery</span>
                      <p className="text-xs text-gray-500">Pay when you receive your order</p>
                    </Label>
                  </div>
                  <div className="flex items-center gap-3 rounded border p-4">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex-1 cursor-pointer">
                      <span className="font-medium">UPI</span>
                      <p className="text-xs text-gray-500">Pay via Google Pay, PhonePe, Paytm</p>
                    </Label>
                  </div>
                </RadioGroup>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
                  <Button onClick={() => setStep(2)}>Review Order</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Review */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Review Your Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-sm">
                    <div className="h-12 w-12 flex-shrink-0 rounded bg-gray-100">
                      {item.imageUrl && <img src={item.imageUrl} alt="" className="h-full w-full object-cover rounded" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium">{formatPriceRupees(item.totalPrice)}</span>
                  </div>
                ))}
                <Separator />
                <p className="text-sm"><span className="text-gray-500">Payment:</span> {paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI'}</p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button onClick={() => alert('Order placed! (Integration pending)')}>
                    Place Order — {formatPriceRupees(total)}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar: Order summary */}
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Order Summary</h3>
          <Separator className="my-3" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Items ({items.length})</span><span>{formatPriceRupees(sub)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{shipping === 0 ? 'FREE' : formatPriceRupees(shipping)}</span></div>
            <Separator />
            <div className="flex justify-between text-base font-bold"><span>Total</span><span>{formatPriceRupees(total)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
