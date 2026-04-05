/**
 * Mock data for Order Detail page.
 *
 * Mirrors the admin/orders/detail.html prototype.
 * When backend is ready, swap mock imports in queries.ts.
 */

import type { OrderDetail } from '../types';

export type {
  OrderTimelineStepStatus,
  OrderTimelineStep,
  OrderItem,
  OrderCustomer,
  OrderSeller,
  OrderShippingAddress,
  OrderPayment,
  OrderDelivery,
  OrderPriceSummary,
  OrderFinancials,
  OrderAdminNote,
  OrderAuditEntry,
  OrderDetail,
} from '../types';

// ----------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------

export const mockOrderDetail: OrderDetail = {
  id: 'HB-10234',
  status: 'Shipped',
  statusColor: 'blue',
  placedAt: '25 Mar 2026, 10:30 AM',

  timeline: [
    { label: 'Placed', date: '25 Mar, 10:30 AM', status: 'completed' },
    { label: 'Confirmed', date: '25 Mar, 11:00 AM', status: 'completed' },
    { label: 'Shipped', date: '26 Mar, 2:15 PM', status: 'current' },
    { label: 'Out for Delivery', date: null, status: 'pending' },
    { label: 'Delivered', date: null, status: 'pending' },
  ],

  items: [
    {
      id: 'PRD-00142',
      name: 'Modern Velvet Sofa',
      sku: 'HB-FUR-00142',
      emoji: '\uD83D\uDECB',
      qty: 1,
      unitPrice: 129900,
      totalPrice: 129900,
      variants: [
        { label: 'Color', value: 'Navy Blue' },
        { label: 'Size', value: '3-Seater' },
      ],
    },
    {
      id: 'PRD-00089',
      name: 'Brass Table Lamp',
      sku: 'HB-LIT-00089',
      emoji: '\uD83D\uDCA1',
      qty: 2,
      unitPrice: 3990,
      totalPrice: 7980,
      variants: [
        { label: 'Finish', value: 'Antique Brass' },
      ],
    },
  ],

  priceSummary: {
    subtotal: 137880,
    itemCount: 3,
    shipping: 0,
    shippingLabel: 'Free',
    discountCode: 'HOME10',
    discount: 13788,
    gstPercent: 18,
    gst: 22337,
    total: 146429,
  },

  customer: {
    id: 'USR-001',
    name: 'Ankit Kumar',
    initials: 'AK',
    email: 'ankit.kumar@email.com',
    phone: '+91 99876 54321',
    totalOrders: 23,
    avatarBg: 'bg-purple-100 text-purple-600',
  },

  seller: {
    id: 'SEL-001',
    name: 'Rajesh Store',
    initials: 'RS',
    avatarBg: 'bg-blue-100 text-blue-600',
    tier: 'Premium',
    rating: 4.6,
  },

  shippingAddress: {
    name: 'Ankit Kumar',
    line1: 'Flat 402, Prestige Towers',
    line2: 'MG Road, Koramangala',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560034',
    phone: '+91 99876 54321',
  },

  payment: {
    method: 'UPI',
    provider: 'Google Pay',
    transactionId: 'TXN-98765432',
    status: 'Paid',
  },

  delivery: {
    carrier: 'Delhivery Express',
    trackingId: 'DLV-7890123456',
    estimatedDate: '30 Mar 2026',
  },

  financials: {
    orderValue: 134999,
    platformFeePercent: 5,
    platformFee: 6750,
    gatewayFeePercent: 2,
    gatewayFee: 2700,
    gstOnFees: 1701,
    sellerPayout: 123848,
    settlementRef: '#STL-20260328',
  },

  adminNotes: [
    {
      author: 'Super Admin',
      date: '28 Mar 2026, 10:30 AM',
      content: 'Customer called about delivery delay. Contacted seller \u2014 confirmed will ship by EOD.',
    },
  ],

  auditTrail: [
    { event: 'Status changed to Shipped', actor: 'Rajesh Store (Seller)', date: '26 Mar 2026, 2:15 PM', color: 'bg-blue-500' },
    { event: 'Order confirmed by seller', actor: 'Rajesh Store (Seller)', date: '25 Mar 2026, 11:00 AM', color: 'bg-green-500' },
    { event: 'Payment confirmed via UPI', actor: 'System', date: '25 Mar 2026, 10:35 AM', color: 'bg-green-500' },
    { event: 'Coupon HOME10 applied (10% off)', actor: 'Ankit Kumar (Customer)', date: '25 Mar 2026, 10:30 AM', color: 'bg-yellow-400' },
    { event: 'Order placed', actor: 'Ankit Kumar (Customer)', date: '25 Mar 2026, 10:30 AM', color: 'bg-gray-300' },
  ],
};
