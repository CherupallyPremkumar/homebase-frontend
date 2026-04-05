# My Orders — API Contract

## Page: my-orders.html

**Note:** Orders list uses Chenile's `SearchRequest/SearchResponse` pattern via POST. Cancel order uses PATCH STM event. Reorder uses standard REST POST.

---

## Section 1: Orders List with Filters and Search

**Data needed:** User's orders with status filter tabs, search, and pagination
**API:** `POST /api/query/customer-orders`
**Fetch/XHR name:** `customer-orders`

**Request (SearchRequest):**
```json
{
  "queryName": "CustomerOrder.myOrders",
  "pageNum": 1,
  "numRowsInPage": 10,
  "sortCriteria": [
    { "name": "createdTime", "ascendingOrder": false }
  ],
  "filters": {
    "status": "all",
    "q": ""
  }
}
```

**Response (GenericResponse<SearchResponse>):**
```json
{
  "list": [
    {
      "row": {
        "id": "HB-20260315-4821",
        "orderNumber": "HB-20260315-4821",
        "stateId": "DELIVERED",
        "createdTime": "2026-03-15T10:22:00Z",
        "totalAmount": 27489,
        "currency": "INR",
        "itemCount": 2,
        "items": [
          {
            "id": "oi-001",
            "productId": "prod-201",
            "productName": "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
            "image": "/images/products/sony-xm5.jpg",
            "quantity": 1,
            "color": "Black",
            "price": 22490
          },
          {
            "id": "oi-002",
            "productId": "prod-401",
            "productName": "Logitech MX Keys Mini Wireless Keyboard",
            "image": "/images/products/logitech-keys.jpg",
            "quantity": 1,
            "color": "Graphite",
            "price": 4999
          }
        ],
        "deliveredAt": "2026-03-20T14:00:00Z"
      }
    },
    {
      "row": {
        "id": "HB-20260322-5103",
        "orderNumber": "HB-20260322-5103",
        "stateId": "SHIPPED",
        "createdTime": "2026-03-22T14:34:00Z",
        "totalAmount": 149490,
        "currency": "INR",
        "itemCount": 2,
        "items": [
          {
            "id": "oi-003",
            "productId": "prod-501",
            "productName": "iPhone 16 Pro Max",
            "image": "/images/products/iphone16.jpg",
            "quantity": 1,
            "color": "Natural Titanium",
            "price": 144900
          },
          {
            "id": "oi-004",
            "productId": "prod-502",
            "productName": "Apple Clear Case with MagSafe",
            "image": "/images/products/apple-case.jpg",
            "quantity": 1,
            "price": 4590
          }
        ],
        "estimatedDelivery": "2026-03-30T00:00:00Z",
        "trackingNumber": "BDE1234567890"
      }
    }
  ],
  "totalCount": 12,
  "numRowsInPage": 10,
  "currentPage": 1,
  "totalPages": 2,
  "statusCounts": {
    "all": 12,
    "processing": 1,
    "shipped": 2,
    "delivered": 6,
    "cancelled": 2,
    "returned": 1
  }
}
```

**Note:** Uses Chenile SearchRequest format. Response follows `GenericResponse<Order>` wrapper. The `statusCounts` field powers the filter tab badges.

---

## Summary

| # | Section | API Endpoint | Method | Cache |
|---|---------|-------------|--------|-------|
| 1 | Orders List + Filters | `/api/query/customer-orders` | POST (Chenile Query) | No |

**Total API calls on page load: 1**

---

## User Actions

### Action: Filter by Status
**Trigger:** User clicks a status tab (All, Processing, Shipped, etc.)
**API:** `GET /api/orders?status=shipped`

### Action: Search Orders
**Trigger:** User types in search box
**API:** `GET /api/orders?q=sony` (debounced)

### Action: View Order Detail
**Trigger:** User clicks "View Details" on an order card
**API:** No API call — navigates to `/orders/{orderId}` (order-detail page)

### Action: Track Order
**Trigger:** User clicks "Track" button on a shipped order
**API:** No API call — navigates to `/order-tracking?orderId={orderId}`

### Action: Reorder
**Trigger:** User clicks "Buy Again" on a delivered order
**API:** `POST /api/cart/items/bulk`
```json
{
  "items": [
    { "productId": "prod-201", "quantity": 1 },
    { "productId": "prod-401", "quantity": 1 }
  ]
}
```
**Response:** `201 Created` with updated cart

### Action: Cancel Order (STM Event)
**Trigger:** User clicks "Cancel Order" on a processing/pending order
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
    "mutatedEntity": {
      "id": "HB-20260325-5500",
      "stateId": "CANCELLED",
      "refundStatus": "INITIATED",
      "refundAmount": 12999
    },
    "allowedActionsAndMetadata": []
  }
```

### Action: Paginate
**Trigger:** User clicks next/prev page
**API:** `GET /api/orders?page=2`

---

## Frontend Integration Pattern

```typescript
// In Next.js page (client component for interactive filters)
'use client';
export default function MyOrdersPage() {
  const [status, setStatus] = useState('all');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const { data: orders } = useSWR(
    `/api/orders?status=${status}&q=${query}&page=${page}&pageSize=10`,
    ordersApi.search
  );

  return (
    <AccountLayout>
      <OrderSearch value={query} onChange={setQuery} />
      <StatusFilterTabs counts={orders?.statusCounts} active={status} onChange={setStatus} />
      <OrderList orders={orders?.list} />
      <Pagination current={page} total={orders?.totalPages} onChange={setPage} />
    </AccountLayout>
  );
}
```

---

## Allowed Actions -> UI Mapping

The backend returns `allowedActions` per row based on the entity's current state (STM).
The frontend reads these and renders only the allowed buttons.

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
| SHIPPED | -- | (track only) | -- | -- | -- |
| DELIVERED | confirmDelivery | Confirm Delivery | CheckCircle | green | confirmDelivery |
| DELIVERED | requestReturn | Request Return | RotateCcw | amber | requestReturn |
| DELIVERED | requestRefund | Request Refund | CreditCard | red | requestRefund |
| COMPLETED | requestReturn | Request Return | RotateCcw | amber | requestReturn |
| COMPLETED | requestRefund | Request Refund | CreditCard | red | requestRefund |
| DELIVERY_FAILED | requestCancellation | Cancel Order | XCircle | red | requestCancellation |
| DELIVERY_FAILED | requestRefund | Request Refund | CreditCard | red | requestRefund |
| CANCEL_REQUESTED | -- | (read-only, pending confirmation) | -- | -- | -- |
| CANCELLATION_DENIED | -- | (read-only) | -- | -- | -- |
| CANCELLED | -- | (read-only, terminal) | -- | -- | -- |
| RETURN_REQUESTED | -- | (read-only, processing) | -- | -- | -- |
| REFUND_REQUESTED | -- | (read-only, processing) | -- | -- | -- |
| REFUNDED | -- | (read-only, terminal) | -- | -- | -- |

### Frontend Pattern

```typescript
const CUSTOMER_ORDER_ACTION_CONFIG: Record<string, ActionButtonConfig> = {
  requestCancellation: { label: 'Cancel Order', icon: 'XCircle', color: 'red' },
  confirmDelivery: { label: 'Confirm Delivery', icon: 'CheckCircle', color: 'green' },
  requestReturn: { label: 'Request Return', icon: 'RotateCcw', color: 'amber' },
  requestRefund: { label: 'Request Refund', icon: 'CreditCard', color: 'red' },
};

// Render only allowed actions
{allowedActions.map(a => {
  const config = CUSTOMER_ORDER_ACTION_CONFIG[a.allowedAction];
  return config ? <ActionButton {...config} onClick={() => triggerEvent(id, a.allowedAction)} /> : null;
})}
```
