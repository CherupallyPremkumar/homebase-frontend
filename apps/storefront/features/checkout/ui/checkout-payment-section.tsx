'use client';

import { CreditCard, Building2, Banknote, AlertCircle } from 'lucide-react';

interface PaymentOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  badges?: string[];
  extra?: string;
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: 'upi',
    name: 'UPI',
    description: 'Google Pay, PhonePe, Paytm & more',
    icon: <span className="text-lg font-bold text-green-600">U</span>,
    iconBg: 'bg-green-50',
  },
  {
    id: 'card',
    name: 'Credit / Debit Card',
    description: 'Visa, Mastercard, RuPay & Amex',
    icon: <CreditCard className="h-5 w-5 text-blue-600" />,
    iconBg: 'bg-blue-50',
    badges: ['VISA', 'MC', 'RuPay'],
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    description: 'All major Indian banks',
    icon: <Building2 className="h-5 w-5 text-purple-600" />,
    iconBg: 'bg-purple-50',
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay when you receive your order',
    icon: <Banknote className="h-5 w-5 text-yellow-600" />,
    iconBg: 'bg-yellow-50',
    extra: '+\u20B929 fee',
  },
];

const BANKS = [
  'State Bank of India (SBI)', 'HDFC Bank', 'ICICI Bank', 'Axis Bank',
  'Kotak Mahindra Bank', 'Bank of Baroda', 'Punjab National Bank',
  'Yes Bank', 'IndusInd Bank', 'Canara Bank',
];

interface CheckoutPaymentSectionProps {
  selectedMethod: string;
  onSelect: (method: string) => void;
}

export function CheckoutPaymentSection({ selectedMethod, onSelect }: CheckoutPaymentSectionProps) {
  return (
    <section className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50">
            <CreditCard className="h-4 w-4 text-brand-500" />
          </div>
          <h2 className="text-lg font-bold text-navy-900">Payment Method</h2>
        </div>
      </div>

      <div className="space-y-3 p-6">
        {PAYMENT_OPTIONS.map((option) => {
          const isSelected = selectedMethod === option.id;
          return (
            <div
              key={option.id}
              className={`overflow-hidden rounded-xl border-2 ${
                isSelected ? 'border-brand-500' : 'border-gray-200'
              }`}
            >
              {/* Option header */}
              <label
                className="flex cursor-pointer items-center justify-between p-4"
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
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${option.iconBg}`}>
                      {option.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy-900">{option.name}</p>
                      <p className="text-xs text-gray-400">{option.description}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {option.badges?.map((badge) => (
                    <span
                      key={badge}
                      className="rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-500"
                    >
                      {badge}
                    </span>
                  ))}
                  {option.extra && (
                    <span className="rounded-full border border-yellow-200 bg-yellow-50 px-2 py-0.5 text-[10px] font-bold text-yellow-600">
                      {option.extra}
                    </span>
                  )}
                </div>
                <input
                  type="radio"
                  name="payment_method"
                  value={option.id}
                  checked={isSelected}
                  onChange={() => onSelect(option.id)}
                  className="sr-only"
                />
              </label>

              {/* Accordion content */}
              {isSelected && (
                <div className="px-4 pb-4">
                  {option.id === 'upi' && (
                    <div className="rounded-lg bg-gray-50 p-4">
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">UPI ID</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="yourname@upi"
                          className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200"
                        />
                        <button className="rounded-lg border border-brand-200 px-4 py-2.5 text-sm font-semibold text-brand-600 transition hover:bg-brand-50">
                          Verify
                        </button>
                      </div>
                      <p className="mt-2 text-xs text-gray-400">
                        You will receive a payment request on your UPI app
                      </p>
                    </div>
                  )}

                  {option.id === 'card' && (
                    <div className="space-y-4 rounded-lg bg-gray-50 p-4">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Card Number</label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-gray-700">Expiry Date</label>
                          <input
                            type="text"
                            placeholder="MM / YY"
                            maxLength={7}
                            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-gray-700">CVV</label>
                          <input
                            type="password"
                            placeholder="***"
                            maxLength={4}
                            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Name on Card</label>
                        <input
                          type="text"
                          placeholder="As printed on card"
                          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200"
                        />
                      </div>
                      <label className="flex cursor-pointer select-none items-center gap-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-400"
                        />
                        <span className="text-sm text-gray-600">Save this card for faster payments</span>
                      </label>
                    </div>
                  )}

                  {option.id === 'netbanking' && (
                    <div className="rounded-lg bg-gray-50 p-4">
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Select Your Bank</label>
                      <select className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200">
                        <option value="">Choose a bank</option>
                        {BANKS.map((bank) => (
                          <option key={bank}>{bank}</option>
                        ))}
                      </select>
                      <p className="mt-2 text-xs text-gray-400">
                        You will be redirected to your bank&apos;s website to complete the payment
                      </p>
                    </div>
                  )}

                  {option.id === 'cod' && (
                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600" />
                        <div>
                          <p className="text-sm font-medium text-yellow-800">COD Handling Fee: &#8377;29</p>
                          <p className="mt-0.5 text-xs text-yellow-600">
                            A nominal fee is applicable for Cash on Delivery orders. Please keep exact change ready at the time of delivery.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
