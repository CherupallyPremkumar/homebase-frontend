# Order Detail — API Contract

## Page: order-detail.html

**Note:** Order retrieve uses Chenile Command GET pattern with `GenericResponse<StateEntityServiceResponse<Order>>` wrapper. Cancel/return use PATCH STM events.

---

## Section 1: Order Header & Status

**Data needed:** Full order details including items, tracking, payment, shipping address
**API:** `GET /api/order/{orderId}`
**Fetch/XHR name:** `order/{orderId}`

**Path Params:**
- `orderId` — order ID, e.g. `HB-20260322-5103`

**Response:**
```json
{
  "id": "HB-20260322-5103",
  "orderNumber": "HB-20260322-5103",
  "stateId": "SHIPPED",
  "createdTime": "2026-03-22T14:34:00Z",
  "updatedTime": "2026-03-24T09:15:00Z",
  "items": [
    {
      "id": "oi-003",
      "productId": "prod-501",
      "productName": "iPhone 16 Pro Max",
      "productSlug": "iphone-16-pro-max",
      "image": "/images/products/iphone16.jpg",
      "sku": "APL-IP16PM-256-NT",
      "quantity": 1,
      "unitPrice": 144900,
      "subtotal": 144900,
      "variant": "256GB",
      "color": "Natural Titanium",
      "sellerId": "seller-hb",
      "sellerName": "HomeBase Marketplace"
    },
    {
      "id": "oi-004",
      "productId": "prod-502",
      "productName": "Apple Clear Case with MagSafe",
      "productSlug": "apple-clear-case-magsafe",
      "image": "/images/products/apple-case.jpg",
      "sku": "APL-CASE-CLR-16PM",
      "quantity": 1,
      "unitPrice": 4590,
      "subtotal": 4590,
      "variant": null,
      "color": "Clear",
      "sellerId": "seller-hb",
      "sellerName": "HomeBase Marketplace"
    }
  ],
  "pricing": {
    "subtotal": 149490,
    "shippingCost": 0,
    "shippingNote": "Free Shipping",
    "taxAmount": 0,
    "discount": 0,
    "couponCode": null,
    "total": 149490,
    "currency": "INR"
  },
  "payment": {
    "method": "UPI",
    "status": "PAID",
    "transactionId": "TXN826491053",
    "paidAt": "2026-03-22T14:35:00Z"
  },
  "shippingAddress": {
    "fullName": "Premkumar",
    "phone": "+91 98765 43210",
    "addressLine1": "Flat 402, Sunshine Towers",
    "addressLine2": "MG Road, Koramangala",
    "city": "Bengaluru",
    "state": "Karnataka",
    "postalCode": "560034",
    "country": "IN"
  },
  "shippingMethod": {
    "name": "Standard Delivery",
    "estimatedDelivery": { "from": "2026-03-28", "to": "2026-03-30" }
  },
  "tracking": {
    "carrier": "BlueDart Express",
    "trackingNumber": "BDE1234567890",
    "trackingUrl": "https://www.bluedart.com/tracking?awb=BDE1234567890",
    "timeline": [
      {
        "status": "PLACED",
        "label": "Order Placed",
        "description": "Your order has been placed successfully",
        "timestamp": "2026-03-22T14:34:00Z",
        "completed": true
      },
      {
        "status": "CONFIRMED",
        "label": "Order Confirmed",
        "description": "Payment confirmed and order is being processed",
        "timestamp": "2026-03-22T15:10:00Z",
        "completed": true
      },
      {
        "status": "SHIPPED",
        "label": "Shipped",
        "description": "Package dispatched via BlueDart Express",
        "timestamp": "2026-03-24T09:15:00Z",
        "completed": true,
        "isCurrent": true
      },
      {
        "status": "OUT_FOR_DELIVERY",
        "label": "Out for Delivery",
        "description": null,
        "timestamp": null,
        "completed": false
      },
      {
        "status": "DELIVERED",
        "label": "Delivered",
        "description": null,
        "timestamp": null,
        "completed": false
      }
    ]
  },
  "canCancel": false,
  "canReturn": false,
  "canReview": false
}
```

---

## Summary

| # | Section | API Endpoint | Method | Cache |
|---|---------|-------------|--------|-------|
| 1 | Order Details (all sections) | `/api/order/{orderId}` | GET (Command Retrieve) | No |

**Total API calls on page load: 1**

---

## User Actions

### Action: Print Invoice
**Trigger:** User clicks "Print Invoice" button
**API:** `GET /api/orders/{orderId}/invoice`
**Response:** PDF binary or HTML for print
**Note:** Can also be handled client-side with `window.print()`

### Action: Cancel Order (STM Event)
**Trigger:** User clicks "Cancel Order" (only for PLACED/CONFIRMED states)
**API:** `PATCH /api/order/{orderId}/cancel`
**Fetch/XHR name:** `order/{orderId}/cancel`
```json
{ "reason": "Changed my mind" }
```
**Response (GenericResponse<StateEntityServiceResponse<Order>>):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "mutatedEntity": { "id": "HB-20260322-5103", "stateId": "CANCELLED", "refundStatus": "INITIATED" },
    "allowedActionsAndMetadata": []
  }
```

### Action: Request Return (Command Create)
**Trigger:** User clicks "Return Item" (only for DELIVERED state within return window)
**API:** `POST /api/returnrequest`
```json
{
  "orderId": "HB-20260322-5103",
  "orderItemId": "oi-003",
  "reason": "Defective",
  "description": "Screen has a dead pixel",
  "images": ["/uploads/return-img-1.jpg"]
}
```
**Response:** `201 Created`
```json
{ "returnId": "RET-003", "status": "REQUESTED", "refundAmount": 144900 }
```

### Action: Track Shipment (External)
**Trigger:** User clicks "Track on Carrier Site"
**API:** No API call — opens `tracking.trackingUrl` in new tab

### Action: Write Review
**Trigger:** User clicks "Write Review" (only for DELIVERED orders)
**API:** `POST /api/catalog/products/{productId}/reviews`
```json
{ "rating": 5, "title": "Great product!", "body": "Exceeded expectations..." }
```

### Action: Buy Again
**API:** `POST /api/cart/items/bulk`
```json
{
  "items": [
    { "productId": "prod-501", "quantity": 1 },
    { "productId": "prod-502", "quantity": 1 }
  ]
}
```

---

## Frontend Integration Pattern

```typescript
// In Next.js page (server component)
export default async function OrderDetailPage({ params }) {
  const order = await ordersApi.get(params.orderId);

  return (
    <AccountLayout>
      <OrderHeader order={order} />
      <OrderTrackingTimeline timeline={order.tracking.timeline} />
      <OrderItems items={order.items} />
      <OrderPricing pricing={order.pricing} />
      <ShippingInfo address={order.shippingAddress} method={order.shippingMethod} />
      <PaymentInfo payment={order.payment} />
      <OrderActions order={order} />
    </AccountLayout>
  );
}
```

---

## Allowed Actions -> UI Mapping

The backend returns `allowedActions` on the order entity based on its current state (STM).
The frontend reads these and renders only the allowed action buttons in the `OrderActions` component.

**STM Source:** `order-states.xml` (order-flow)
**Customer ACL filter:** Only events with `CUSTOMER` in `meta-acls` are shown.

### State -> Allowed Actions -> UI Buttons

| State | allowedActions (customer-visible) | UI Button | Icon | Color | Event ID |
|-------|----------------------------------|-----------|------|-------|----------|
| CREATED | requestCancellation | Cancel Order | XCircle | red | requestCancellation |
| PAYMENT_PENDING | requestCancellation | Cancel Order | XCircle | red | requestCancellation |
| PAYMENT_FAILED | requestCancellation | Cancel Order | XCircle | red | requestCancellation |
| PAID | requestCancellation | Cancel Order | XCircle | red | requestCancellation |
| PROCESSING | requestCancellation | Cancel Order | XCircle | red | requestCancellation |
| SHIPPED | -- | (track shipment only) | -- | -- | -- |
| DELIVERED | confirmDelivery | Confirm Delivery | CheckCircle | green | confirmDelivery |
| DELIVERED | requestReturn | Request Return | RotateCcw | amber | requestReturn |
| DELIVERED | requestRefund | Request Refund | CreditCard | red | requestRefund |
| COMPLETED | requestReturn | Request Return | RotateCcw | amber | requestReturn |
| COMPLETED | requestRefund | Request Refund | CreditCard | red | requestRefund |
| DELIVERY_FAILED | requestCancellation | Cancel Order | XCircle | red | requestCancellation |
| DELIVERY_FAILED | requestRefund | Request Refund | CreditCard | red | requestRefund |
| CANCEL_REQUESTED | -- | (read-only) | -- | -- | -- |
| CANCELLED | -- | (read-only, terminal) | -- | -- | -- |
| RETURN_REQUESTED | -- | (read-only) | -- | -- | -- |
| REFUND_REQUESTED | -- | (read-only) | -- | -- | -- |
| REFUNDED | -- | (read-only, terminal) | -- | -- | -- |

### Frontend Pattern

```typescript
const ORDER_DETAIL_ACTION_CONFIG: Record<string, ActionButtonConfig> = {
  requestCancellation: { label: 'Cancel Order', icon: 'XCircle', color: 'red' },
  confirmDelivery: { label: 'Confirm Delivery', icon: 'CheckCircle', color: 'green' },
  requestReturn: { label: 'Request Return', icon: 'RotateCcw', color: 'amber' },
  requestRefund: { label: 'Request Refund', icon: 'CreditCard', color: 'red' },
};

// In OrderActions component
{allowedActions.map(a => {
  const config = ORDER_DETAIL_ACTION_CONFIG[a.allowedAction];
  return config ? <ActionButton {...config} onClick={() => triggerEvent(order.id, a.allowedAction)} /> : null;
})}
```
