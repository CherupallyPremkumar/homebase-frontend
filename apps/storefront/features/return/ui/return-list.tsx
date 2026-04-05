'use client';

import { useState } from 'react';
import {
  RefreshCw,
  CheckCircle2,
  Clock,
  DollarSign,
  Plus,
  ChevronDown,
  Package,
  ShoppingBag,
  Check,
} from 'lucide-react';
import { AccountSidebar } from '@homebase/ui';

// ---------------------------------------------------------------------------
// FAQ Accordion sub-component
// ---------------------------------------------------------------------------
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition"
      >
        <span className="text-sm font-medium text-navy-900">{question}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-4">
          <p className="text-sm text-gray-500 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Timeline step for return cards
// ---------------------------------------------------------------------------
interface ReturnStep {
  label: string;
  date: string;
  completed: boolean;
  current?: boolean;
}

function ReturnTimeline({ steps }: { steps: ReturnStep[] }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between relative">
        {/* Background line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200" />
        {/* Filled progress */}
        {(() => {
          const lastCompleted = steps.reduce((acc, s, i) => (s.completed || s.current ? i : acc), 0);
          const pct = steps.length > 1 ? (lastCompleted / (steps.length - 1)) * 100 : 0;
          return (
            <div
              className="absolute top-4 left-0 h-0.5 bg-blue-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          );
        })()}

        {steps.map((step, idx) => (
          <div key={idx} className="relative flex flex-col items-center z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step.completed
                ? 'bg-blue-500'
                : step.current
                  ? 'bg-blue-500 ring-4 ring-blue-100'
                  : 'bg-gray-200'
            }`}>
              {step.completed ? (
                <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
              ) : step.current ? (
                <Clock className="w-4 h-4 text-white" />
              ) : (
                <span className="w-2.5 h-2.5 rounded-full bg-gray-400" />
              )}
            </div>
            <span className={`text-[10px] font-semibold mt-1.5 ${
              step.completed || step.current ? 'text-blue-600' : 'text-gray-400'
            }`}>
              {step.label}
            </span>
            <span className={`text-[9px] ${step.completed || step.current ? 'text-gray-400' : 'text-gray-300'}`}>
              {step.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ReturnList
// ---------------------------------------------------------------------------
export function ReturnList() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="hidden lg:block">
          <AccountSidebar
            userName="Premkumar"
            userEmail="premkumar@email.com"
            activePage="returns"
          />
        </div>

        {/* Main */}
        <main className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-navy-900">Returns & Refunds</h1>
              <p className="text-sm text-gray-500 mt-1">Manage your return requests and track refund status</p>
            </div>
            <button className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-all hover:-translate-y-px hover:shadow-md">
              <Plus className="w-4 h-4" />
              Request New Return
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <RefreshCw className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Active Returns</p>
                <p className="text-xl font-bold text-navy-900">1</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Completed Returns</p>
                <p className="text-xl font-bold text-navy-900">1</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5 text-brand-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Refunded</p>
                <p className="text-xl font-bold text-navy-900">{'\u20B9'}3,698</p>
              </div>
            </div>
          </div>

          {/* Returns */}
          <h2 className="text-lg font-bold text-navy-900 mb-4">Your Returns</h2>

          {/* Return Card 1 - Active */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200">
                  <Package className="w-8 h-8 text-gray-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-navy-900 bg-gray-100 px-2 py-0.5 rounded">RET-001</span>
                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      <Clock className="w-3 h-3" />
                      Pickup Scheduled
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-navy-900">boAt Rockerz 450 Bluetooth Headphones - Lush Red</h3>
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-400">
                    <span>Order: <span className="text-gray-600 font-medium">#ORD-2024-7845</span></span>
                    <span>Requested: <span className="text-gray-600 font-medium">22 Mar 2026</span></span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">Reason:</span>
                    <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">Defective</span>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-gray-400">Refund Amount</p>
                <p className="text-lg font-bold text-navy-900">{'\u20B9'}1,299</p>
              </div>
            </div>

            <ReturnTimeline
              steps={[
                { label: 'Requested', date: '22 Mar', completed: true },
                { label: 'Approved', date: '23 Mar', completed: true },
                { label: 'Pickup Scheduled', date: '25 Mar', completed: false, current: true },
                { label: 'Received', date: 'Pending', completed: false },
                { label: 'Refunded', date: 'Pending', completed: false },
              ]}
            />

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Pickup scheduled for <span className="text-gray-600 font-medium">25 Mar 2026, 10:00 AM - 1:00 PM</span>
              </p>
              <div className="flex items-center gap-3">
                <button className="text-xs text-gray-500 font-medium hover:text-red-500 transition">Cancel Return</button>
                <button className="text-xs text-white bg-navy-900 hover:bg-navy-800 font-medium px-4 py-1.5 rounded-lg transition">Track Pickup</button>
              </div>
            </div>
          </div>

          {/* Return Card 2 - Completed */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200">
                  <ShoppingBag className="w-8 h-8 text-gray-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-navy-900 bg-gray-100 px-2 py-0.5 rounded">RET-002</span>
                    <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      Refund Processed
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-navy-900">Nike Air Max 270 Running Shoes - Black/White (Size 9)</h3>
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-400">
                    <span>Order: <span className="text-gray-600 font-medium">#ORD-2024-6532</span></span>
                    <span>Requested: <span className="text-gray-600 font-medium">10 Mar 2026</span></span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">Reason:</span>
                    <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Wrong Size</span>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-gray-400">Refund Amount</p>
                <p className="text-lg font-bold text-green-600">{'\u20B9'}2,399</p>
                <span className="inline-flex items-center gap-1 text-[10px] text-green-600 font-medium mt-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                  Refunded to UPI
                </span>
              </div>
            </div>

            <ReturnTimeline
              steps={[
                { label: 'Requested', date: '10 Mar', completed: true },
                { label: 'Approved', date: '11 Mar', completed: true },
                { label: 'Picked Up', date: '13 Mar', completed: true },
                { label: 'Received', date: '15 Mar', completed: true },
                { label: 'Refunded', date: '16 Mar', completed: true },
              ]}
            />

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Refund of <span className="text-green-600 font-medium">{'\u20B9'}2,399</span> processed to <span className="text-gray-600 font-medium">premkumar@okicici (UPI)</span> on 16 Mar 2026
              </p>
              <button className="text-xs text-brand-500 font-medium hover:underline">Buy Again</button>
            </div>
          </div>

          {/* Return Policy */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-bold text-navy-900 mb-4">Return Policy</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: '30-Day Returns',
                  desc: 'Return most items within 30 days of delivery for a full refund.',
                  bgColor: 'bg-brand-50',
                  iconColor: 'text-brand-500',
                  icon: RefreshCw,
                },
                {
                  title: 'Free Pickup',
                  desc: 'We will arrange free pickup from your doorstep for eligible returns.',
                  bgColor: 'bg-blue-50',
                  iconColor: 'text-blue-500',
                  icon: Package,
                },
                {
                  title: 'Quick Refunds',
                  desc: 'Refunds are processed within 5-7 business days to original payment method.',
                  bgColor: 'bg-green-50',
                  iconColor: 'text-green-500',
                  icon: DollarSign,
                },
              ].map((policy) => {
                const Icon = policy.icon;
                return (
                  <div key={policy.title} className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl ${policy.bgColor} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-5 h-5 ${policy.iconColor}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy-900">{policy.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{policy.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-navy-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-2">
              <FaqItem
                question="How do I initiate a return?"
                answer="Go to your order details and click the 'Return' button. Select the items you want to return, choose a reason, and submit your request. We will review it within 24 hours."
              />
              <FaqItem
                question="When will I receive my refund?"
                answer="Refunds are typically processed within 5-7 business days after we receive the returned item. The amount will be credited to your original payment method."
              />
              <FaqItem
                question="Can I exchange an item instead of returning it?"
                answer="Yes, you can request an exchange for a different size or color of the same product. Select 'Exchange' when initiating the return process."
              />
              <FaqItem
                question="What items are not eligible for return?"
                answer="Perishable goods, intimate apparel, personalized items, and items marked as 'non-returnable' on the product page cannot be returned."
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
