'use client';

import { useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, RadioGroup, RadioGroupItem, Label } from '@homebase/ui';

interface PaymentStepProps {
  onSubmit: (method: string) => void;
  onBack: () => void;
  loading: boolean;
}

export function PaymentStep({ onSubmit, onBack, loading }: PaymentStepProps) {
  const [method, setMethod] = useState('cod');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup value={method} onValueChange={setMethod}>
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 hover:bg-gray-50">
            <RadioGroupItem value="cod" id="pay-cod" />
            <Label htmlFor="pay-cod" className="flex-1 cursor-pointer">
              <span className="font-medium">Cash on Delivery</span>
              <p className="text-xs text-gray-500">Pay when you receive your order</p>
            </Label>
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 hover:bg-gray-50">
            <RadioGroupItem value="upi" id="pay-upi" />
            <Label htmlFor="pay-upi" className="flex-1 cursor-pointer">
              <span className="font-medium">UPI</span>
              <p className="text-xs text-gray-500">Pay via Google Pay, PhonePe, Paytm</p>
            </Label>
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 hover:bg-gray-50">
            <RadioGroupItem value="card" id="pay-card" />
            <Label htmlFor="pay-card" className="flex-1 cursor-pointer">
              <span className="font-medium">Credit/Debit Card</span>
              <p className="text-xs text-gray-500">Visa, Mastercard, RuPay</p>
            </Label>
          </label>
        </RadioGroup>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack} disabled={loading}>
            Back
          </Button>
          <Button onClick={() => onSubmit(method)} disabled={loading}>
            {loading ? 'Processing...' : 'Review Order'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
