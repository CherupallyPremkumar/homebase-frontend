'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';

interface SavedAddress {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  type: 'HOME' | 'WORK' | 'OTHER';
  label?: string;
  isDefault?: boolean;
}

interface CheckoutAddressSectionProps {
  addresses: SavedAddress[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const STATES = [
  'Andhra Pradesh', 'Delhi', 'Gujarat', 'Karnataka', 'Kerala',
  'Maharashtra', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal',
];

export function CheckoutAddressSection({ addresses, selectedId, onSelect }: CheckoutAddressSectionProps) {
  const [showNewForm, setShowNewForm] = useState(false);

  return (
    <section className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50">
            <MapPin className="h-4 w-4 text-brand-500" />
          </div>
          <h2 className="text-lg font-bold text-navy-900">Shipping Address</h2>
        </div>
      </div>

      <div className="p-6">
        {/* Saved Addresses */}
        <div className="mb-6">
          <p className="mb-3 text-sm font-semibold text-gray-700">Saved Addresses</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {addresses.map((addr) => {
              const isSelected = selectedId === addr.id;
              return (
                <label
                  key={addr.id}
                  className={`relative block cursor-pointer rounded-xl border-2 p-4 transition-all ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50/30'
                      : 'border-gray-200 hover:border-brand-300'
                  }`}
                  onClick={() => onSelect(addr.id)}
                >
                  <input
                    type="radio"
                    name="saved_address"
                    value={addr.id}
                    checked={isSelected}
                    onChange={() => onSelect(addr.id)}
                    className="sr-only"
                  />
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-sm font-semibold text-navy-900">{addr.fullName}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                            addr.type === 'HOME'
                              ? 'bg-brand-50 text-brand-600'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {addr.label ?? addr.type}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-600">
                        {addr.addressLine1},
                        <br />
                        {addr.addressLine2 && <>{addr.addressLine2},<br /></>}
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">Phone: {addr.phone}</p>
                    </div>
                    {/* Radio indicator */}
                    <div
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                        isSelected ? 'border-brand-500' : 'border-gray-300'
                      }`}
                    >
                      {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-brand-500" />}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="mb-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs font-medium uppercase tracking-wider text-gray-400">or add new address</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* New Address Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter full name"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <span className="inline-flex items-center rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 px-3 text-sm text-gray-500">
                  +91
                </span>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  className="w-full rounded-r-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Address Line 1 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="House/Flat no., Building name, Street"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Address Line 2</label>
            <input
              type="text"
              placeholder="Area, Colony, Landmark (optional)"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="City"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                State <span className="text-red-500">*</span>
              </label>
              <select className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-500 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200">
                <option value="">Select State</option>
                {STATES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                PIN Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="6-digit PIN"
                maxLength={6}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200"
              />
            </div>
          </div>
          <label className="flex cursor-pointer select-none items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-400"
            />
            <span className="text-sm text-gray-600">Save this address for future orders</span>
          </label>
        </div>
      </div>
    </section>
  );
}
