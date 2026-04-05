# Admin Orders — API Contract

## Page: admin-orders.html

**Note:** Orders table uses Chenile's `SearchRequest/SearchResponse` pattern via POST. Retrieve uses GET with `StateEntityServiceResponse`. Stats use REST GET.

---

## Section 1: Page Header

**Data needed:** None
**API:** No API call needed — static content with Export CSV and Create Order buttons

---

## Section 2: Stats Cards (6 cards)

**API:** `GET /api/admin/orders/stats`

**Response:**
```json
{
  "totalOrders": {
    "value": 12450,
    "trend": 12.5,
    "trendDirection": "up"
  },
  "pending": {
    "value": 234,
    "trend": 8.2,
    "trendDirection": "up"
  },
  "processing": {
    "value": 567,
    "trend": -3.1,
    "trendDirection": "down"
  },
  "shipped": {
    "value": 1890,
    "trend": 5.7,
    "trendDirection": "up"
  },
  "delivered": {
    "value": 9200,
    "trend": 15.3,
    "trendDirection": "up"
  },
  "cancelled": {
    "value": 559,
    "trend": 2.1,
    "trendDirection": "up"
  }
}
```

---

## Section 3: Orders Table (paginated, filterable)

**API:** `POST /api/query/admin-orders`
**Fetch/XHR name:** `admin-orders`

**Request (SearchRequest):**
```json
{
  "queryName": "AdminOrder.allOrders",
  "pageNum": 1,
  "numRowsInPage": 8,
  "sortCriteria": [{ "name": "createdTime", "ascendingOrder": false }],
  "filters": {
    "stateId": "",
    "search": "",
    "dateFrom": "",
    "dateTo": "",
    "sellerId": ""
  }
}
```

**Response:**
```json
{
  "list": [
    {
      "row": {
        "id": "order-001",
        "orderNumber": "#HB-10234",
        "customerName": "Arun Mehta",
        "customerEmail": "arun.mehta@email.com",
        "sellerName": "Rajesh Store",
        "sellerId": "seller-001",
        "productSummary": "iPhone 15 Pro Max",
        "itemCount": 1,
        "totalAmount": 134999,
        "currency": "INR",
        "paymentMethod": "Card",
        "paymentStatus": "Paid",
        "stateId": "DELIVERED",
        "createdTime": "2026-03-27T10:45:00Z"
      }
    }
  ],
  "totalCount": 12450,
  "numRowsInPage": 8
}
```

**Note:** Uses Chenile SearchRequest format. Response follows `GenericResponse<Order>` wrapper.

---

## Section 4: Order Actions

### View Order Details
**API:** `GET /api/admin/orders/{id}`

**Response:**
```json
{
  "id": "order-001",
  "orderNumber": "#HB-10234",
  "customerName": "Arun Mehta",
  "customerEmail": "arun.mehta@email.com",
  "customerPhone": "+91-9876543210",
  "sellerName": "Rajesh Store",
  "items": [
    {
      "productId": "prod-100",
      "name": "iPhone 15 Pro Max",
      "quantity": 1,
      "price": 134999,
      "image": "/images/products/iphone.jpg"
    }
  ],
  "totalAmount": 134999,
  "paymentMethod": "Card",
  "paymentStatus": "Paid",
  "shippingAddress": {
    "line1": "123 MG Road",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "stateId": "DELIVERED",
  "timeline": [
    { "state": "PLACED", "timestamp": "2026-03-25T10:00:00Z" },
    { "state": "PROCESSING", "timestamp": "2026-03-25T11:30:00Z" },
    { "state": "SHIPPED", "timestamp": "2026-03-26T08:00:00Z" },
    { "state": "DELIVERED", "timestamp": "2026-03-27T10:45:00Z" }
  ]
}
```

### Export Orders
**API:** `GET /api/admin/orders/export?format=csv`

**Query Params:**
- `format` — `csv`, `xlsx`
- `stateId` — optional status filter
- `dateFrom` — optional
- `dateTo` — optional
- `sellerId` — optional

**Response:** Binary file download

---

## Summary

| # | Section | API Endpoint | Method | Cache |
|---|---------|-------------|--------|-------|
| 1 | Page Header | None (static) | — | — |
| 2 | Stats Cards | `/api/admin/orders/stats` | GET | 30s |
| 3 | Orders Table | `/api/query/admin-orders` | POST (Chenile Query) | 30s |
| 4 | Order Details | `/api/order/{id}` | GET (Command Retrieve) | 30s |
| 5 | Export Orders | `/api/admin/orders/export` | GET | — |

**Total API calls on page load: 2 (parallel)**
**Total action endpoints: 2 (view detail, export)**

---

## Frontend Integration Pattern

```typescript
export default async function AdminOrders() {
  const [stats, orders] = await Promise.allSettled([
    adminApi.orderStats(),
    adminApi.orders({ pageSize: 8, sortBy: 'createdTime', sortOrder: 'desc' }),
  ]);

  return (
    <>
      <PageHeader />
      <StatsCards data={stats} />
      <FiltersBar />
      <OrdersTable data={orders} />
    </>
  );
}
```

---

## New Endpoints Needed

1. `GET /api/admin/orders/stats` — order status breakdown stats
2. `POST /api/query/admin-orders` — paginated order listing (Chenile query)
3. `GET /api/order/{id}` — single order detail (Command Retrieve)
4. `GET /api/admin/orders/export` — CSV/XLSX export

---

## Allowed Actions -> UI Mapping

The backend returns `allowedActions` per row based on the entity's current state (STM).
The frontend reads these and renders only the allowed buttons.

**STM Source:** `order-states.xml` (order-flow)
**Admin ACL filter:** Events with `ADMIN` in `meta-acls`. Admins have the broadest set of order actions.

### State -> Allowed Actions -> UI Buttons

| State | allowedActions (admin-visible) | UI Button | Icon | Color | Event ID |
|-------|------------------------------|-----------|------|-------|----------|
| CREATED | requestCancellation | Cancel Order | XCircle | red | requestCancellation |
| PAYMENT_PENDING | requestCancellation | Cancel Order | XCircle | red | requestCancellation |
| PAYMENT_FAILED | requestCancellation | Cancel Order | XCircle | red | requestCancellation |
| PAID | requestCancellation | Cancel Order | XCircle | red | requestCancellation |
| FRAUD_HOLD | clearFraud | Clear Fraud | ShieldCheck | green | clearFraud |
| FRAUD_HOLD | confirmFraud | Confirm Fraud | ShieldAlert | red | confirmFraud |
| PROCESSING | placeOnHold | Place on Hold | PauseCircle | amber | placeOnHold |
| PROCESSING | requestCancellation | Cancel Order | XCircle | red | requestCancellation |
| ON_HOLD | releaseHold | Release Hold | PlayCircle | green | releaseHold |
| ON_HOLD | requestCancellation | Cancel Order | XCircle | red | requestCancellation |
| SHIPPED | -- | (read-only, in transit) | -- | -- | -- |
| DELIVERY_FAILED | startProcessing | Reprocess | RefreshCw | blue | startProcessing |
| DELIVERY_FAILED | requestCancellation | Cancel Order | XCircle | red | requestCancellation |
| DELIVERY_FAILED | requestRefund | Issue Refund | CreditCard | red | requestRefund |
| DELIVERED | requestRefund | Issue Refund | CreditCard | red | requestRefund |
| COMPLETED | requestRefund | Issue Refund | CreditCard | red | requestRefund |
| CANCEL_REQUESTED | confirmCancellation | Confirm Cancellation | CheckCircle | red | confirmCancellation |
| CANCELLED | -- | (read-only, terminal) | -- | -- | -- |
| RETURN_REQUESTED | -- | (read-only) | -- | -- | -- |
| REFUND_REQUESTED | -- | (read-only, system processing) | -- | -- | -- |
| REFUNDED | -- | (read-only, terminal) | -- | -- | -- |

### Frontend Pattern

```typescript
const ADMIN_ORDER_ACTION_CONFIG: Record<string, ActionButtonConfig> = {
  clearFraud: { label: 'Clear Fraud', icon: 'ShieldCheck', color: 'green' },
  confirmFraud: { label: 'Confirm Fraud', icon: 'ShieldAlert', color: 'red' },
  placeOnHold: { label: 'Place on Hold', icon: 'PauseCircle', color: 'amber' },
  releaseHold: { label: 'Release Hold', icon: 'PlayCircle', color: 'green' },
  requestCancellation: { label: 'Cancel Order', icon: 'XCircle', color: 'red' },
  confirmCancellation: { label: 'Confirm Cancellation', icon: 'CheckCircle', color: 'red' },
  startProcessing: { label: 'Reprocess', icon: 'RefreshCw', color: 'blue' },
  requestRefund: { label: 'Issue Refund', icon: 'CreditCard', color: 'red' },
};

// Render only allowed actions
{allowedActions.map(a => {
  const config = ADMIN_ORDER_ACTION_CONFIG[a.allowedAction];
  return config ? <ActionButton {...config} onClick={() => triggerEvent(id, a.allowedAction)} /> : null;
})}
```
