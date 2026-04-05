# Admin Order Detail — API Contract

## Page: admin-order-detail.html

**Note:** Order detail is a single entity retrieve page using GET with `StateEntityServiceResponse`. Includes order timeline, items, financial breakdown (admin-only: platform fees, gateway fees, seller payout), customer/seller info, shipping, and payment. Admin override actions use PATCH with STM event IDs. Order states: `PLACED -> CONFIRMED -> SHIPPED -> DELIVERED | CANCELLED | RETURNED`.

---

## Section 1: Order Retrieve

**API:** `GET /api/admin/orders/{orderId}`
**Fetch/XHR name:** `order-detail`

**Response (StateEntityServiceResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "id": "HB-10234",
    "status": "Shipped",
    "stateLabel": "Shipped",
    "placedAt": "2026-03-25T10:30:00Z",
    "timeline": [
      { "state": "Placed", "timestamp": "2026-03-25T10:30:00Z", "completed": true },
      { "state": "Confirmed", "timestamp": "2026-03-25T11:00:00Z", "completed": true },
      { "state": "Shipped", "timestamp": "2026-03-26T14:15:00Z", "completed": true },
      { "state": "Delivered", "timestamp": null, "completed": false }
    ],
    "items": [
      { "name": "Modern Velvet Sofa", "sku": "HB-FUR-00142", "qty": 1, "variant": "Navy Blue", "price": 129900, "mrp": 149900 },
      { "name": "Brass Table Lamp", "sku": "HB-LIT-00089", "qty": 2, "variant": "Antique Brass", "price": 7980, "unitPrice": 3990 }
    ],
    "priceSummary": {
      "subtotal": 137880,
      "shipping": 0,
      "discount": { "amount": 13788, "coupon": "HOME10" },
      "gst": 22337,
      "total": 146429
    },
    "financialBreakdown": {
      "orderValue": 134999,
      "platformFee": { "amount": 6750, "rate": 5.0 },
      "gatewayFee": { "amount": 2700, "rate": 2.0 },
      "gstOnFees": { "amount": 1701, "rate": 18.0 },
      "sellerPayout": 123848
    },
    "customer": {
      "id": "USR-05678",
      "name": "Ankit Kumar",
      "email": "ankit.kumar@email.com",
      "phone": "+91 99876 54321",
      "totalOrders": 23
    },
    "seller": {
      "id": "SLR-00142",
      "name": "Rajesh Store",
      "tier": "Premium Seller",
      "rating": 4.6
    },
    "shippingAddress": {
      "name": "Ankit Kumar",
      "line1": "Flat 402, Prestige Towers",
      "line2": "MG Road, Koramangala",
      "city": "Bangalore",
      "state": "Karnataka",
      "pincode": "560034",
      "phone": "+91 99876 54321"
    },
    "payment": {
      "method": "UPI (Google Pay)",
      "transactionId": "TXN-98765432",
      "status": "Paid"
    },
    "delivery": {
      "carrier": "Delhivery Express",
      "trackingId": "DLV-7890123456",
      "estimatedDelivery": "2026-03-30"
    },
    "auditTrail": [
      { "action": "Order placed", "by": "Customer", "timestamp": "2026-03-25T10:30:00Z" },
      { "action": "Payment confirmed", "by": "System", "timestamp": "2026-03-25T10:31:00Z" },
      { "action": "Order confirmed", "by": "Seller", "timestamp": "2026-03-25T11:00:00Z" },
      { "action": "Shipped via Delhivery", "by": "Seller", "timestamp": "2026-03-26T14:15:00Z" }
    ],
    "allowedActions": ["overrideDelivered", "forceCancel", "forceRefund", "reassignSeller"]
  }
}
```

---

## Command: Override to Delivered (STM Action)

**API:** `PATCH /api/admin/orders/{orderId}/overrideDelivered`
**Fetch/XHR name:** `override-delivered`

**Request:**
```json
{ "reason": "Customer confirmed receipt via phone", "note": "Tracking shows delivered, customer confirmed" }
```

**Response:**
```json
{ "success": true, "payload": { "id": "HB-10234", "status": "Delivered", "allowedActions": ["forceRefund"] } }
```

---

## Command: Force Cancel (STM Action)

**API:** `PATCH /api/admin/orders/{orderId}/forceCancel`
**Fetch/XHR name:** `force-cancel`

**Request:**
```json
{ "reason": "Fraud detected", "initiateRefund": true }
```

---

## Command: Force Refund (STM Action)

**API:** `PATCH /api/admin/orders/{orderId}/forceRefund`
**Fetch/XHR name:** `force-refund`

**Request:**
```json
{ "amount": 146429, "reason": "Escalated dispute resolution", "deductFromSeller": true }
```

---

## Command: Reassign Seller

**API:** `PATCH /api/admin/orders/{orderId}/reassignSeller`
**Fetch/XHR name:** `reassign-seller`

**Request:**
```json
{ "newSellerId": "SLR-00200", "reason": "Original seller unable to fulfill" }
```

---

## Allowed Actions Mapping (STM)

| Current State | Allowed Actions | Buttons |
|---------------|----------------|---------|
| `PLACED` | `forceCancel`, `reassignSeller` | Force Cancel, Reassign |
| `CONFIRMED` | `forceCancel`, `reassignSeller` | Force Cancel, Reassign |
| `SHIPPED` | `overrideDelivered`, `forceCancel`, `forceRefund`, `reassignSeller` | Override Delivered, Force Cancel, Force Refund, Reassign |
| `DELIVERED` | `forceRefund` | Force Refund |
| `CANCELLED` | — | — |
| `RETURNED` | `forceRefund` | Force Refund |

---

## Summary

| # | Section | API Endpoint | Method | Fetch/XHR Name |
|---|---------|-------------|--------|----------------|
| 1 | Retrieve | `/api/admin/orders/{id}` | GET | `order-detail` |
| 2 | Override Delivered | `PATCH /api/admin/orders/{id}/overrideDelivered` | PATCH (STM) | `override-delivered` |
| 3 | Force Cancel | `PATCH /api/admin/orders/{id}/forceCancel` | PATCH (STM) | `force-cancel` |
| 4 | Force Refund | `PATCH /api/admin/orders/{id}/forceRefund` | PATCH (STM) | `force-refund` |
| 5 | Reassign Seller | `PATCH /api/admin/orders/{id}/reassignSeller` | PATCH (STM) | `reassign-seller` |

**Total API calls on page load: 1 (single order GET)**
