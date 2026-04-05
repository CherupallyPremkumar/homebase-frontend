'use client';

import { useState } from 'react';
import { ArrowLeft, Package, Truck, CreditCard, MapPin, Printer, MessageCircle, CheckCircle, XCircle, RefreshCw, Copy, Ban } from 'lucide-react';
import { StatusBadge } from '@homebase/ui';
import Link from 'next/link';

interface SellerOrderDetailProps {
  orderId: string;
}

const mockOrder = {
  id: '#HB-78234',
  customer: { name: 'Ankit Kumar', email: 'ankit.kumar@email.com', phone: '+91 98765 43210' },
  status: 'Pending' as const,
  date: '27 Mar 2026, 2:34 PM',
  payment: { method: 'UPI (Google Pay)', transactionId: 'TXN-4829173650', status: 'Paid' },
  shipping: { carrier: 'Delhivery Express', tracking: 'DLV-9284710563', method: 'Standard Delivery', estimatedDelivery: '30 Mar 2026' },
  address: { name: 'Ankit Kumar', line1: 'Flat 402, Tower B, Prestige Lakeside', line2: 'Whitefield Road, Mahadevapura', city: 'Bangalore', state: 'Karnataka', pin: '560048', phone: '+91 98765 43210' },
  items: [
    { name: 'Wireless Bluetooth Speaker', sku: 'HB-EL-4521', qty: 1, price: 2999, image: '🔊' },
    { name: 'USB-C Charging Cable (2m)', sku: 'HB-AC-8823', qty: 2, price: 250, image: '🔌' },
  ],
  subtotal: 3499,
  shipping_cost: 0,
  discount: 0,
  gst: 530,
  total: 4029,
  timeline: [
    { step: 'Order Placed', date: '27 Mar, 2:34 PM', done: true },
    { step: 'Confirmed', date: '', done: false },
    { step: 'Shipped', date: '', done: false },
    { step: 'Out for Delivery', date: '', done: false },
    { step: 'Delivered', date: '', done: false },
  ],
};

export function SellerOrderDetail({ orderId }: SellerOrderDetailProps) {
  const [order, setOrder] = useState({ ...mockOrder, id: `#${orderId}` });
  const [showShipModal, setShowShipModal] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrierName, setCarrierName] = useState('Delhivery Express');

  const handleStatusUpdate = (newStatus: string) => {
    const statusMap: Record<string, typeof order.status> = {
      confirm: 'Processing',
      ship: 'Shipped',
      deliver: 'Delivered',
      cancel: 'Cancelled',
    };
    const updated = statusMap[newStatus];
    if (updated) {
      setOrder(prev => ({
        ...prev,
        status: updated as any,
        timeline: prev.timeline.map((s, i) => {
          if (updated === 'Processing' && i <= 1) return { ...s, done: true, date: s.date || 'Just now' };
          if (updated === 'Shipped' && i <= 2) return { ...s, done: true, date: s.date || 'Just now' };
          if (updated === 'Delivered') return { ...s, done: true, date: s.date || 'Just now' };
          return s;
        }),
      }));
    }
  };

  const getActionButtons = () => {
    switch (order.status) {
      case 'Pending':
        return (
          <>
            <button onClick={() => handleStatusUpdate('confirm')} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
              <CheckCircle className="h-4 w-4" /> Confirm Order
            </button>
            <button onClick={() => { if (confirm('Cancel this order?')) handleStatusUpdate('cancel'); }} className="flex items-center gap-2 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50">
              <XCircle className="h-4 w-4" /> Cancel Order
            </button>
          </>
        );
      case 'Processing':
        return (
          <>
            <button onClick={() => setShowShipModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
              <Truck className="h-4 w-4" /> Mark as Shipped
            </button>
            <button onClick={() => { if (confirm('Cancel this order?')) handleStatusUpdate('cancel'); }} className="flex items-center gap-2 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50">
              <XCircle className="h-4 w-4" /> Cancel
            </button>
          </>
        );
      case 'Shipped':
        return (
          <>
            <button onClick={() => alert(`Tracking: ${order.shipping.tracking}`)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
              <Truck className="h-4 w-4" /> Track Shipment
            </button>
            <button onClick={() => alert('Update tracking number')} className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
              <RefreshCw className="h-4 w-4" /> Update Tracking
            </button>
          </>
        );
      case 'Delivered':
        return null; // No primary actions needed
      case 'Cancelled':
        return (
          <button onClick={() => alert('Order duplicated')} className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
            <Copy className="h-4 w-4" /> Duplicate Order
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Ship Modal */}
      {showShipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold mb-4">Mark as Shipped</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Carrier</label>
                <select value={carrierName} onChange={e => setCarrierName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                  <option>Delhivery Express</option>
                  <option>BlueDart</option>
                  <option>DTDC</option>
                  <option>India Post</option>
                  <option>Ecom Express</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Tracking Number *</label>
                <input type="text" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} placeholder="Enter tracking number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-200 outline-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowShipModal(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={() => { if (!trackingNumber) { alert('Enter tracking number'); return; } handleStatusUpdate('ship'); setShowShipModal(false); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                Confirm Shipment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back + Title */}
      <div className="mb-6">
        <Link href="/orders" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-500 mb-3">
          <ArrowLeft className="h-4 w-4" /> Back to Orders
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Order {order.id}</h1>
            <StatusBadge status={order.status} />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => alert('Contact customer')} className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50" title="Contact Customer">
              <MessageCircle className="h-4 w-4" />
            </button>
            <button onClick={() => window.print()} className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50" title="Print Invoice">
              <Printer className="h-4 w-4" />
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-1">Placed on {order.date}</p>

        {/* Action Bar */}
        {getActionButtons() && (
          <div className="mt-4 flex items-center gap-3">
            {getActionButtons()}
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between">
          {order.timeline.map((step, i) => (
            <div key={step.step} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${step.done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                {step.done ? '✓' : i + 1}
              </div>
              <div className="min-w-0">
                <p className={`text-xs font-medium ${step.done ? 'text-gray-900' : 'text-gray-400'}`}>{step.step}</p>
                {step.done && <p className="text-[10px] text-gray-400">{step.date}</p>}
              </div>
              {i < order.timeline.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${step.done ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Items + Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Package className="h-4 w-4 text-gray-400" /> Order Items
            </h3>
            {order.items.map(item => (
              <div key={item.sku} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                <div className="w-14 h-14 bg-gray-50 rounded-lg flex items-center justify-center text-2xl">{item.image}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-400">SKU: {item.sku} · Qty: {item.qty}</p>
                </div>
                <p className="text-sm font-semibold">₹{item.price.toLocaleString('en-IN')}</p>
              </div>
            ))}
            {/* Summary */}
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>₹{order.subtotal.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between text-gray-500"><span>Shipping</span><span className="text-green-600 font-medium">FREE</span></div>
              {order.discount > 0 && <div className="flex justify-between text-gray-500"><span>Discount</span><span className="text-red-500">-₹{order.discount}</span></div>}
              <div className="flex justify-between text-gray-500"><span>GST (18%)</span><span>₹{order.gst}</span></div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100"><span>Total</span><span>₹{order.total.toLocaleString('en-IN')}</span></div>
            </div>
          </div>
        </div>

        {/* Right — Customer, Shipping, Payment */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Customer</h3>
            <p className="text-sm font-medium">{order.customer.name}</p>
            <p className="text-xs text-gray-500 mt-1">{order.customer.email}</p>
            <p className="text-xs text-gray-500">{order.customer.phone}</p>
            <button className="mt-3 text-xs text-brand-500 font-medium flex items-center gap-1 hover:underline">
              <MessageCircle className="h-3 w-3" /> Contact Customer
            </button>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-gray-400" /> Shipping Address
            </h3>
            <p className="text-sm">{order.address.name}</p>
            <p className="text-xs text-gray-500 mt-1">{order.address.line1}</p>
            <p className="text-xs text-gray-500">{order.address.line2}</p>
            <p className="text-xs text-gray-500">{order.address.city}, {order.address.state} — {order.address.pin}</p>
            <p className="text-xs text-gray-500 mt-1">{order.address.phone}</p>
          </div>

          {/* Delivery Info */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2 mb-3">
              <Truck className="h-4 w-4 text-gray-400" /> Delivery Info
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Carrier</span><span>{order.shipping.carrier}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Tracking</span><span className="font-mono text-brand-600">{order.shipping.tracking}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Method</span><span>{order.shipping.method}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Est. Delivery</span><span>{order.shipping.estimatedDelivery}</span></div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2 mb-3">
              <CreditCard className="h-4 w-4 text-gray-400" /> Payment
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Method</span><span>{order.payment.method}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Transaction</span><span className="font-mono text-xs">{order.payment.transactionId}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="text-green-600 font-medium">{order.payment.status}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
