# Order Tracking — API Contract

## Page: order-tracking.html

**Note:** Order tracking uses standard REST GET with `GenericResponse` wrapper. Tracking lookup returns the shipping entity via `GET /api/shipping/{id}` pattern.

---

## Section 1: Tracking Search

**Data needed:** Lookup order by order ID or tracking number
**API:** `GET /api/shipping/track?q={orderIdOrTrackingNumber}`
**Fetch/XHR name:** `shipping/track`

**Query Params:**
- `q` — order ID (e.g. `HB-20260322-5103`) or carrier tracking number (e.g. `BDE1234567890`)

**Response:**
```json
{
  "orderId": "HB-20260322-5103",
  "orderNumber": "HB-20260322-5103",
  "stateId": "SHIPPED",
  "createdTime": "2026-03-22T14:34:00Z",
  "totalAmount": 27489,
  "currency": "INR",
  "estimatedDelivery": "2026-03-30T00:00:00Z",
  "progressPercent": 66,
  "progressSteps": { "completed": 4, "total": 6 },
  "tracking": {
    "carrier": "BlueDart Express",
    "carrierPhone": "1800-233-5400",
    "carrierWebsite": "https://www.bluedart.com",
    "trackingNumber": "BDE1234567890",
    "trackingUrl": "https://www.bluedart.com/tracking?awb=BDE1234567890",
    "currentLocation": "Mumbai Sorting Facility",
    "timeline": [
      {
        "status": "PLACED",
        "label": "Order Placed",
        "description": "Your order has been placed successfully and is being reviewed.",
        "timestamp": "2026-03-22T14:34:00Z",
        "completed": true,
        "isCurrent": false
      },
      {
        "status": "PAYMENT_CONFIRMED",
        "label": "Payment Confirmed",
        "description": "Payment of INR 27,489 received via UPI. Transaction ID: TXN826491053.",
        "timestamp": "2026-03-22T14:35:00Z",
        "completed": true,
        "isCurrent": false
      },
      {
        "status": "PROCESSING",
        "label": "Processing",
        "description": "Order has been picked and packed at our warehouse in Mumbai.",
        "timestamp": "2026-03-23T09:12:00Z",
        "completed": true,
        "isCurrent": false
      },
      {
        "status": "SHIPPED",
        "label": "Shipped",
        "description": "Package has been dispatched from Mumbai hub via BlueDart Express. Currently in transit to Limerick sorting facility.",
        "timestamp": "2026-03-25T11:45:00Z",
        "completed": true,
        "isCurrent": true
      },
      {
        "status": "OUT_FOR_DELIVERY",
        "label": "Out for Delivery",
        "description": "Package will be handed to the local delivery agent.",
        "timestamp": null,
        "completed": false,
        "estimatedDate": "2026-03-30T00:00:00Z"
      },
      {
        "status": "DELIVERED",
        "label": "Delivered",
        "description": "Package will be delivered to your doorstep.",
        "timestamp": null,
        "completed": false,
        "estimatedDate": "2026-03-30T00:00:00Z"
      }
    ]
  },
  "items": [
    {
      "id": "oi-003",
      "productName": "iPhone 16 Pro Max",
      "image": "/images/products/iphone16.jpg",
      "quantity": 1,
      "price": 144900
    },
    {
      "id": "oi-004",
      "productName": "Apple Clear Case with MagSafe",
      "image": "/images/products/apple-case.jpg",
      "quantity": 1,
      "price": 4590
    }
  ],
  "shippingAddress": {
    "fullName": "Premkumar",
    "city": "Bengaluru",
    "state": "Karnataka",
    "postalCode": "560034"
  },
  "deliveryInstructions": null
}
```

**Response (not found):**
```json
{
  "error": "ORDER_NOT_FOUND",
  "message": "No order found with the provided ID or tracking number"
}
```

---

## Section 2: Carrier Info Card

**Data needed:** Carrier contact and tracking link
**API:** No separate call — included in the tracking response above (`tracking.carrier`, `tracking.carrierPhone`, etc.)

---

## Section 3: Delivery Address & Map

**Data needed:** Delivery address summary
**API:** No separate call — included in tracking response (`shippingAddress`)

---

## Summary

| # | Section | API Endpoint | Method | Cache |
|---|---------|-------------|--------|-------|
| 1 | Tracking Search + Timeline | `/api/shipping/track?q={query}` | GET | 30s |
| 2 | Carrier Info | Included in tracking response | — | — |
| 3 | Delivery Address | Included in tracking response | — | — |

**Total API calls on page load: 1 (if order ID is in URL params) or 0 (if search form only)**

---

## User Actions

### Action: Search Tracking
**Trigger:** User enters order ID or tracking number and clicks "Track"
**API:** `GET /api/orders/track?q=HB-20260322-5103`

### Action: Track on Carrier Website
**Trigger:** User clicks "Track on BlueDart" link
**API:** No API call — opens `tracking.trackingUrl` in new tab

### Action: Contact Support
**Trigger:** User clicks "Need Help?" or support button
**API:** No API call — navigates to support page or opens chat widget

### Action: View Full Order Details
**Trigger:** User clicks "View Order Details" link
**API:** No API call — navigates to `/orders/{orderId}`

---

## Frontend Integration Pattern

```typescript
// In Next.js page (client component for search interaction)
'use client';
export default function OrderTrackingPage({ searchParams }) {
  const [query, setQuery] = useState(searchParams.orderId || '');
  const { data: tracking, error, isLoading } = useSWR(
    query ? `/api/orders/track?q=${query}` : null,
    ordersApi.track
  );

  return (
    <>
      <TrackingSearchForm value={query} onSubmit={setQuery} />
      {tracking && (
        <>
          <OrderSummaryCard order={tracking} />
          <TrackingTimeline timeline={tracking.tracking.timeline} />
          <CarrierInfoCard carrier={tracking.tracking} />
          <OrderItems items={tracking.items} />
          <DeliveryAddress address={tracking.shippingAddress} />
        </>
      )}
      {error && <TrackingNotFound />}
    </>
  );
}
```
