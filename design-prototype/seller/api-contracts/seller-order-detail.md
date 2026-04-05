# Seller Order Detail — API Contract

## Page: seller-order-detail.html

**Note:** Retrieve uses GET with `StateEntityServiceResponse`. State transitions (confirm, pack, ship, cancel) use PATCH STM events. Notes use standard REST.

---

## Section 1: Order Retrieve

**Description:** Full order details including items, customer info, shipping, payment, timeline
**API:** `GET /api/seller/orders/{orderId}`
**Fetch/XHR name:** `order-detail`

**Response (GenericResponse<StateEntityServiceResponse>):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "entity": {
      "id": "HB-78234",
      "orderNumber": "HB-78234",
      "stateId": "PENDING",
      "customer": {
        "id": "cust-101",
        "name": "Ankit Kumar",
        "email": "ankit.k@email.com",
        "phone": "+91-98765-43210"
      },
      "shippingAddress": {
        "line1": "42, MG Road, Indiranagar",
        "line2": "Near Metro Station",
        "city": "Bangalore",
        "state": "Karnataka",
        "pincode": "560038",
        "country": "India"
      },
      "items": [
        {
          "id": "item-001",
          "productId": "prod-001",
          "productName": "Wireless Bluetooth Speaker",
          "sku": "WBS-BLK-001",
          "image": "/images/products/speaker.jpg",
          "quantity": 1,
          "unitPrice": 3499,
          "discount": 0,
          "total": 3499,
          "variant": "Black"
        },
        {
          "id": "item-002",
          "productId": "prod-015",
          "productName": "USB-C Charging Cable (2m)",
          "sku": "UCC-WHT-2M",
          "image": "/images/products/cable.jpg",
          "quantity": 1,
          "unitPrice": 499,
          "discount": 0,
          "total": 499,
          "variant": "White"
        }
      ],
      "pricing": {
        "subtotal": 3998,
        "discount": 0,
        "couponCode": null,
        "couponDiscount": 0,
        "shippingCharge": 49,
        "tax": 252,
        "total": 4299,
        "currency": "INR"
      },
      "payment": {
        "method": "UPI",
        "status": "Paid",
        "transactionId": "UPI-TXN-98765",
        "paidAt": "2026-03-28T10:42:30Z"
      },
      "shipping": {
        "carrier": null,
        "trackingNumber": null,
        "estimatedDelivery": "2026-04-01",
        "shippedAt": null,
        "deliveredAt": null
      },
      "timeline": [
        {
          "event": "Order Placed",
          "timestamp": "2026-03-28T10:42:00Z",
          "description": "Customer placed the order",
          "actor": "customer"
        },
        {
          "event": "Payment Confirmed",
          "timestamp": "2026-03-28T10:42:30Z",
          "description": "UPI payment of Rs.4,299 confirmed",
          "actor": "system"
        }
      ],
      "sellerNotes": [],
      "createdTime": "2026-03-28T10:42:00Z",
      "updatedTime": "2026-03-28T10:42:30Z"
    },
    "allowedActions": [
      { "allowedAction": "confirm", "mainPath": "/orders/HB-78234/confirm" },
      { "allowedAction": "cancel", "mainPath": "/orders/HB-78234/cancel" },
      { "allowedAction": "addNote", "mainPath": "/orders/HB-78234/notes" }
    ]
  }
}
```

**Note:** Returns `StateEntityServiceResponse` — the `allowedActions` are determined by the STM based on the current `stateId`. This is how the UI knows which action buttons to show.

---

## Section 2: Confirm Order (STM State Transition)

**Description:** Seller confirms a pending order and begins processing
**API:** `PATCH /api/seller/orders/{orderId}`
**Fetch/XHR name:** `confirm-order`

**Request (STM Event):**
```json
{
  "stateId": "PENDING",
  "event": "confirm"
}
```

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "id": "HB-78234",
    "stateId": "PROCESSING",
    "updatedTime": "2026-03-28T11:00:00Z",
    "allowedActions": [
      { "allowedAction": "pack", "mainPath": "/orders/HB-78234/pack" },
      { "allowedAction": "cancel", "mainPath": "/orders/HB-78234/cancel" },
      { "allowedAction": "addNote", "mainPath": "/orders/HB-78234/notes" }
    ]
  }
}
```

---

## Section 3: Pack Order (STM State Transition)

**Description:** Mark order as packed and ready for shipment
**API:** `PATCH /api/seller/orders/{orderId}`
**Fetch/XHR name:** `pack-order`

**Request (STM Event):**
```json
{
  "stateId": "PROCESSING",
  "event": "pack"
}
```

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "id": "HB-78234",
    "stateId": "PACKED",
    "updatedTime": "2026-03-28T12:30:00Z",
    "allowedActions": [
      { "allowedAction": "ship", "mainPath": "/orders/HB-78234/ship" },
      { "allowedAction": "cancel", "mainPath": "/orders/HB-78234/cancel" },
      { "allowedAction": "addNote", "mainPath": "/orders/HB-78234/notes" }
    ]
  }
}
```

---

## Section 4: Ship Order (STM State Transition)

**Description:** Mark order as shipped with carrier and tracking details
**API:** `PATCH /api/seller/orders/{orderId}`
**Fetch/XHR name:** `ship-order`

**Request (STM Event with metadata):**
```json
{
  "stateId": "PACKED",
  "event": "ship",
  "metadata": {
    "carrier": "Delhivery",
    "trackingNumber": "DLV-987654321",
    "estimatedDelivery": "2026-04-01"
  }
}
```

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "id": "HB-78234",
    "stateId": "SHIPPED",
    "shipping": {
      "carrier": "Delhivery",
      "trackingNumber": "DLV-987654321",
      "estimatedDelivery": "2026-04-01",
      "shippedAt": "2026-03-28T14:00:00Z"
    },
    "updatedTime": "2026-03-28T14:00:00Z",
    "allowedActions": [
      { "allowedAction": "addNote", "mainPath": "/orders/HB-78234/notes" }
    ]
  }
}
```

**Validation rules:**
- `carrier` — required, string
- `trackingNumber` — required, string
- `estimatedDelivery` — optional, ISO date, must be >= today

---

## Section 5: Cancel Order (STM State Transition)

**Description:** Seller cancels order (allowed only before SHIPPED state)
**API:** `PATCH /api/seller/orders/{orderId}`
**Fetch/XHR name:** `cancel-order`

**Request (STM Event with reason):**
```json
{
  "stateId": "PENDING",
  "event": "cancel",
  "metadata": {
    "reason": "OUT_OF_STOCK",
    "reasonText": "Product is out of stock due to supplier delay"
  }
}
```

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "id": "HB-78234",
    "stateId": "CANCELLED",
    "cancellation": {
      "reason": "OUT_OF_STOCK",
      "reasonText": "Product is out of stock due to supplier delay",
      "cancelledBy": "seller",
      "cancelledAt": "2026-03-28T11:30:00Z",
      "refundStatus": "INITIATED"
    },
    "updatedTime": "2026-03-28T11:30:00Z",
    "allowedActions": [
      { "allowedAction": "addNote", "mainPath": "/orders/HB-78234/notes" }
    ]
  }
}
```

**Cancel reasons (enum):**
- `OUT_OF_STOCK` — Product out of stock
- `PRICING_ERROR` — Pricing error
- `CUSTOMER_REQUEST` — Customer requested cancellation
- `CANNOT_SHIP` — Cannot ship to address
- `FRAUD_SUSPECTED` — Suspected fraudulent order
- `OTHER` — Other (requires reasonText)

---

## Section 6: Add Seller Note

**Description:** Seller adds an internal note to the order
**API:** `POST /api/seller/orders/{orderId}/notes`
**Fetch/XHR name:** `add-note`

**Request:**
```json
{
  "text": "Customer called to confirm delivery address. Verified correct.",
  "isInternal": true
}
```

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 201,
  "payload": {
    "id": "note-001",
    "orderId": "HB-78234",
    "text": "Customer called to confirm delivery address. Verified correct.",
    "isInternal": true,
    "createdBy": "seller-042",
    "createdTime": "2026-03-28T15:00:00Z"
  }
}
```

---

## Section 7: Get Seller Notes

**Description:** Retrieve all seller notes for an order
**API:** `GET /api/seller/orders/{orderId}/notes`
**Fetch/XHR name:** `order-notes`

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": [
    {
      "id": "note-001",
      "text": "Customer called to confirm delivery address. Verified correct.",
      "isInternal": true,
      "createdBy": "seller-042",
      "createdTime": "2026-03-28T15:00:00Z"
    },
    {
      "id": "note-002",
      "text": "Packed with extra bubble wrap per customer request.",
      "isInternal": true,
      "createdBy": "seller-042",
      "createdTime": "2026-03-28T13:00:00Z"
    }
  ]
}
```

---

## Section 8: Delete Seller Note

**Description:** Delete a seller note from the order
**API:** `DELETE /api/seller/orders/{orderId}/notes/{noteId}`
**Fetch/XHR name:** `delete-note`

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "id": "note-001",
    "deleted": true
  }
}
```

---

## Summary

| # | Section | API Endpoint | Method | Fetch/XHR Name | Type | Cache |
|---|---------|-------------|--------|----------------|------|-------|
| 1 | Order Detail | `/api/seller/orders/{id}` | GET | `order-detail` | REST (STM) | 15s |
| 2 | Confirm | `/api/seller/orders/{id}` | PATCH | `confirm-order` | STM | — |
| 3 | Pack | `/api/seller/orders/{id}` | PATCH | `pack-order` | STM | — |
| 4 | Ship | `/api/seller/orders/{id}` | PATCH | `ship-order` | STM | — |
| 5 | Cancel | `/api/seller/orders/{id}` | PATCH | `cancel-order` | STM | — |
| 6 | Add Note | `/api/seller/orders/{id}/notes` | POST | `add-note` | REST | — |
| 7 | Get Notes | `/api/seller/orders/{id}/notes` | GET | `order-notes` | REST | 15s |
| 8 | Delete Note | `/api/seller/orders/{id}/notes/{noteId}` | DELETE | `delete-note` | REST | — |

**Total API calls on page load: 2 (order detail + notes, parallel)**

---

## STM State Diagram

```
                confirm              pack               ship
  PENDING ──────────────> PROCESSING ──────> PACKED ──────────> SHIPPED ──────> DELIVERED
    |                        |                 |                                    |
    | cancel                 | cancel          | cancel                            |
    v                        v                 v                                   v
  CANCELLED              CANCELLED          CANCELLED                         RETURN_REQUESTED
                                                                                   |
                                                                                   v
                                                                              RETURNED

System events:
  SHIPPED -> DELIVERED (carrier webhook)
  DELIVERED -> RETURN_REQUESTED (customer action)
  RETURN_REQUESTED -> RETURNED (after pickup)
```

**Allowed actions by state:**

| Current State | Allowed Events | Allowed Actions in UI |
|---------------|---------------|----------------------|
| `PENDING` | confirm, cancel | Confirm Order, Cancel Order, Add Note |
| `PROCESSING` | pack, cancel | Pack Order, Cancel Order, Add Note |
| `PACKED` | ship, cancel | Ship Order, Cancel Order, Add Note |
| `SHIPPED` | — | Add Note (tracking is view-only) |
| `DELIVERED` | — | Add Note |
| `CANCELLED` | — | Add Note |

---

## Request Flow

```
Browser -> Next.js /api/proxy/[...path] -> injects JWT -> Backend

For order retrieve:
  GET /api/proxy/seller/orders/HB-78234
    -> Next.js adds Authorization header
    -> Backend order service returns StateEntityServiceResponse
    -> STM enriches with allowedActions based on current stateId
    -> Returns GenericResponse<StateEntityServiceResponse>

For STM transitions:
  PATCH /api/proxy/seller/orders/HB-78234
    -> Next.js adds Authorization header
    -> Backend receives { stateId, event, metadata }
    -> STM validates current state matches stateId
    -> STM validates event is allowed from current state
    -> Executes transition handler (e.g., send email, update inventory)
    -> Returns GenericResponse with new stateId + updated allowedActions
```

---

## Frontend Integration

```typescript
// Server component — page load
import { getApiClient } from '@homebase/api-client';

export default async function SellerOrderDetail({ params }: { params: { orderId: string } }) {
  const api = getApiClient();

  const [order, notes] = await Promise.allSettled([
    api.get(`/seller/orders/${params.orderId}`),
    api.get(`/seller/orders/${params.orderId}/notes`),
  ]);

  return (
    <>
      <OrderHeader order={unwrap(order)} />
      <OrderItems items={unwrap(order).entity.items} />
      <OrderPricing pricing={unwrap(order).entity.pricing} />
      <CustomerInfo customer={unwrap(order).entity.customer} address={unwrap(order).entity.shippingAddress} />
      <PaymentInfo payment={unwrap(order).entity.payment} />
      <ShippingInfo shipping={unwrap(order).entity.shipping} />
      <OrderTimeline timeline={unwrap(order).entity.timeline} />
      <OrderActions allowedActions={unwrap(order).allowedActions} orderId={params.orderId} />
      <SellerNotes notes={unwrap(notes)} orderId={params.orderId} />
    </>
  );
}

// Client component — STM actions
async function confirmOrder(orderId: string) {
  return api.patch(`/seller/orders/${orderId}`, {
    stateId: 'PENDING',
    event: 'confirm',
  });
}

async function packOrder(orderId: string) {
  return api.patch(`/seller/orders/${orderId}`, {
    stateId: 'PROCESSING',
    event: 'pack',
  });
}

async function shipOrder(orderId: string, carrier: string, trackingNumber: string, estimatedDelivery?: string) {
  return api.patch(`/seller/orders/${orderId}`, {
    stateId: 'PACKED',
    event: 'ship',
    metadata: { carrier, trackingNumber, estimatedDelivery },
  });
}

async function cancelOrder(orderId: string, currentState: string, reason: string, reasonText?: string) {
  return api.patch(`/seller/orders/${orderId}`, {
    stateId: currentState,
    event: 'cancel',
    metadata: { reason, reasonText },
  });
}

async function addNote(orderId: string, text: string) {
  return api.post(`/seller/orders/${orderId}/notes`, { text, isInternal: true });
}
```

---

## Backend Endpoints

| Endpoint | Exists? | Backend Module |
|----------|---------|---------------|
| `GET /seller/orders/{id}` | Exists | order service (retrieve with STM) |
| `PATCH /seller/orders/{id}` | Exists | order service (STM transitions) |
| `POST /seller/orders/{id}/notes` | New | order-notes service |
| `GET /seller/orders/{id}/notes` | New | order-notes service |
| `DELETE /seller/orders/{id}/notes/{noteId}` | New | order-notes service |

**STM definition:**
- `seller-order-stm.json` — state machine for seller order lifecycle
- States: PENDING, PROCESSING, PACKED, SHIPPED, DELIVERED, CANCELLED, RETURN_REQUESTED, RETURNED
- Events: confirm, pack, ship, cancel, deliver (system), requestReturn (customer), completeReturn (system)
