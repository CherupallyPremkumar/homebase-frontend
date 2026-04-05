'use client';

import { Truck } from 'lucide-react';

interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  priceLabel: string;
  eta: string;
  badge?: string;
}

const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: 'standard',
    name: 'Standard Delivery',
    description: 'Estimated delivery: 5-7 business days',
    price: 0,
    priceLabel: 'FREE',
    eta: 'By Apr 2 - Apr 4',
  },
  {
    id: 'express',
    name: 'Express Delivery',
    description: 'Estimated delivery: 2-3 business days',
    price: 149,
    priceLabel: '\u20B9149',
    eta: 'By Mar 30 - Mar 31',
  },
  {
    id: 'sameday',
    name: 'Same Day Delivery',
    description: 'Order within 2 hrs for same-day delivery',
    price: 299,
    priceLabel: '\u20B9299',
    eta: 'Today, by 9 PM',
    badge: 'FASTEST',
  },
];

interface CheckoutShippingSectionProps {
  selectedMethod: string;
  onSelect: (method: string) => void;
}

export function CheckoutShippingSection({ selectedMethod, onSelect }: CheckoutShippingSectionProps) {
  return (
    <section className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50">
            <Truck className="h-4 w-4 text-brand-500" />
          </div>
          <h2 className="text-lg font-bold text-navy-900">Shipping Method</h2>
        </div>
      </div>

      <div className="space-y-3 p-6">
        {SHIPPING_OPTIONS.map((option) => {
          const isSelected = selectedMethod === option.id;
          return (
            <label
              key={option.id}
              className={`flex cursor-pointer items-center justify-between rounded-xl border-2 p-4 transition-all ${
                isSelected
                  ? 'border-brand-500 bg-brand-50/30'
                  : 'border-gray-200 hover:border-brand-300'
              }`}
              onClick={() => onSelect(option.id)}
            >
              <div className="flex items-center gap-4">
                {/* Radio indicator */}
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    isSelected ? 'border-brand-500' : 'border-gray-300'
                  }`}
                >
                  {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-brand-500" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-navy-900">{option.name}</p>
                    {option.badge && (
                      <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-600">
                        {option.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-gray-400">{option.description}</p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <span
                  className={`text-sm font-bold ${option.price === 0 ? 'text-green-600' : 'text-navy-900'}`}
                >
                  {option.priceLabel}
                </span>
                <p className="mt-0.5 text-[10px] text-gray-400">{option.eta}</p>
              </div>
              <input
                type="radio"
                name="shipping_method"
                value={option.id}
                checked={isSelected}
                onChange={() => onSelect(option.id)}
                className="sr-only"
              />
            </label>
          );
        })}
      </div>
    </section>
  );
}
