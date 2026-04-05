# Seller Orders — API Contract

## Page: seller-orders.html

**Note:** All table/list endpoints use Chenile's `SearchRequest/SearchResponse` pattern via POST. Retrieve uses GET with `StateEntityServiceResponse`. State transitions use PATCH STM events. Stats use standard REST GET.

---

## Section 1: Stats Cards (6 cards)

**Description:** Order counts by status — total, pending, processing, shipped, delivered, cancelled
**API:** `GET /api/seller/orders/stats`
**Fetch/XHR name:** `stats`

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "total": 1234,
    "pending": 23,
    "processing": 45,
    "shipped": 156,
    "delivered": 980,
    "cancelled": 30
  }
}
```

**Note:** Custom aggregation endpoint, NOT a Chenile query.

---

## Section 2: Orders Table (search, filter by status, paginate — Chenile Query)

**Description:** Paginated orders list with status filter tabs, search, date range, and sort
**API:** `POST /api/query/seller-orders`
**Fetch/XHR name:** `seller-orders`

**Request (SearchRequest):**
```json
{
  "queryName": "SellerOrder.allOrders",
  "pageNum": 1,
  "numRowsInPage": 10,
  "sortCriteria": [
    { "name": "createdTime", "ascendingOrder": false }
  ],
  "filters": {
    "q": "Ankit",
    "status": "ALL",
    "dateFrom": "2026-03-01",
    "dateTo": "2026-03-28"
  }
}
```

**Response (GenericResponse<SearchResponse>):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "list": [
      {
        "row": {
          "id": "HB-78234",
          "orderNumber": "HB-78234",
          "customerName": "Ankit Kumar",
          "customerEmail": "ankit.k@email.com",
          "customerInitials": "AK",
          "productSummary": "Wireless Bluetooth Speaker",
          "extraItems": "+ 1 more item",
          "itemCount": 2,
          "totalAmount": 4299,
          "paymentMethod": "UPI",
          "paymentStatus": "Paid",
          "stateId": "DELIVERED",
          "createdTime": "2026-03-28T10:34:00Z"
        },
        "allowedActions": [
          { "allowedAction": "viewOrder", "mainPath": "/orders/HB-78234" }
        ]
      }
    ],
    "currentPage": 1,
    "maxPages": 124,
    "maxRows": 1234,
    "numRowsInPage": 10,
    "numRowsReturned": 10,
    "startRow": 1,
    "endRow": 10,
    "columnMetadata": {
      "orderNumber": { "name": "Order ID", "columnType": "Text", "filterable": true, "sortable": true, "display": true },
      "customerName": { "name": "Customer", "columnType": "Text", "filterable": true, "sortable": true, "display": true },
      "totalAmount": { "name": "Amount", "columnType": "Number", "filterable": true, "sortable": true, "display": true },
      "stateId": { "name": "Status", "columnType": "Text", "filterable": true, "sortable": true, "display": true },
      "createdTime": { "name": "Date", "columnType": "Date", "filterable": true, "sortable": true, "display": true }
    },
    "hiddenColumns": ["id"],
    "availableCannedReports": [
      { "name": "allOrders", "description": "All orders" },
      { "name": "pendingOrders", "description": "Pending orders" },
      { "name": "recentOrders", "description": "Recent orders" }
    ]
  }
}
```

**Note:** Uses Chenile SearchRequest format. The `queryName` maps to MyBatis mapper ID `SellerOrder.allOrders`. Backend applies `CustomerFilterInterceptor` to filter by logged-in seller's ID.

---

## Section 3: View Order Detail (Slide-over panel — Command Retrieve)

**Description:** Full order detail shown in side panel when clicking an order row
**API:** `GET /api/order/{id}`
**Fetch/XHR name:** `order/{id}`

**Response (GenericResponse<StateEntityServiceResponse<Order>>):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "mutatedEntity": {
      "id": "HB-78234",
      "orderNumber": "HB-78234",
      "stateId": "DELIVERED",
      "customer": {
        "name": "Ankit Kumar",
        "email": "ankit.k@email.com",
        "phone": "+91 98765 43210",
        "address": {
          "line1": "42 MG Road",
          "line2": "Near Central Mall",
          "city": "Bangalore",
          "state": "Karnataka",
          "pincode": "560001"
        }
      },
      "items": [
        {
          "id": "item-001",
          "productId": "prod-001",
          "productName": "Wireless Bluetooth Speaker",
          "sku": "HB-EL-0042",
          "quantity": 1,
          "price": 3499,
          "image": "/images/products/speaker.jpg"
        },
        {
          "id": "item-002",
          "productId": "prod-015",
          "productName": "USB-C Cable",
          "sku": "HB-EL-0088",
          "quantity": 1,
          "price": 800,
          "image": "/images/products/cable.jpg"
        }
      ],
      "subtotal": 4299,
      "shippingCharge": 0,
      "discount": 0,
      "tax": 774,
      "totalAmount": 4299,
      "paymentMethod": "UPI",
      "paymentStatus": "Paid",
      "timeline": [
        { "status": "Order Placed", "timestamp": "2026-03-25T14:34:00Z", "description": "Order confirmed by customer" },
        { "status": "Confirmed", "timestamp": "2026-03-25T15:10:00Z", "description": "Seller confirmed the order" },
        { "status": "Shipped", "timestamp": "2026-03-26T09:00:00Z", "description": "Picked up by delivery partner" },
        { "status": "Delivered", "timestamp": "2026-03-28T10:34:00Z", "description": "Delivered to customer" }
      ],
      "trackingNumber": "DL123456789IN",
      "courierPartner": "Delhivery",
      "createdTime": "2026-03-25T14:34:00Z",
      "updatedTime": "2026-03-28T10:34:00Z"
    },
    "allowedActionsAndMetadata": [
      { "allowedAction": "viewOrder", "mainPath": "/orders/HB-78234" }
    ]
  }
}
```

---

## Section 4: Update Order Status (STM Events)

**Description:** Advance order through states — confirm, ship, cancel
**API:** `PATCH /api/order/{id}/{eventID}`
**Fetch/XHR name:** `order/{id}/{eventID}`

### Confirm Order
**Endpoint:** `PATCH /api/order/HB-78234/confirm`
**Request Body:** `{}`

### Ship Order
**Endpoint:** `PATCH /api/order/HB-78234/ship`
**Request Body:**
```json
{
  "trackingNumber": "DL123456789IN",
  "courierPartner": "Delhivery"
}
```

### Cancel Order
**Endpoint:** `PATCH /api/order/HB-78234/cancel`
**Request Body:**
```json
{
  "reason": "Out of stock"
}
```

**Response (all events — GenericResponse<StateEntityServiceResponse<Order>>):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "mutatedEntity": {
      "id": "HB-78234",
      "orderNumber": "HB-78234",
      "stateId": "SHIPPED",
      "trackingNumber": "DL123456789IN",
      "courierPartner": "Delhivery"
    },
    "allowedActionsAndMetadata": [
      { "allowedAction": "deliver", "acls": "SYSTEM", "bodyType": "DeliverPayload" }
    ]
  }
}
```

**Note:** Uses Chenile STM state transitions. The `eventID` in the URL maps to an STM event. The response includes `allowedActionsAndMetadata` showing what transitions are valid from the new state.

---

## Section 5: Export Orders

**Description:** Export orders to CSV
**API:** `GET /api/seller/orders/export`
**Fetch/XHR name:** `export`

**Query Params:**
- `format` — `csv` or `xlsx`
- `status` — optional filter
- `dateFrom` — optional
- `dateTo` — optional

**Response:** Binary file download.

---

## Summary

| # | Section | API Endpoint | Method | Fetch/XHR Name | Type | Cache |
|---|---------|-------------|--------|----------------|------|-------|
| 1 | Stats Cards | `/api/seller/orders/stats` | GET | `stats` | REST | 30s |
| 2 | Orders Table | `/api/query/seller-orders` | POST | `seller-orders` | Chenile Query | 30s |
| 3 | Order Detail | `/api/order/{id}` | GET | `order/{id}` | Command Retrieve | 15s |
| 4a | Confirm Order | `/api/order/{id}/confirm` | PATCH | `order/{id}/confirm` | STM Event | — |
| 4b | Ship Order | `/api/order/{id}/ship` | PATCH | `order/{id}/ship` | STM Event | — |
| 4c | Cancel Order | `/api/order/{id}/cancel` | PATCH | `order/{id}/cancel` | STM Event | — |
| 5 | Export Orders | `/api/seller/orders/export` | GET | `export` | REST | — |

**Total API calls on page load: 2 (parallel)**

---

## Request Flow

```
Browser -> Next.js /api/proxy/[...path] -> injects JWT -> Backend

For Chenile queries:
  POST /api/proxy/query/seller-orders
    -> Next.js adds Authorization header
    -> Backend query controller receives SearchRequest
    -> CustomerFilterInterceptor adds seller ID filter
    -> MyBatis executes SellerOrder.allOrders query
    -> STM enriches with allowedActions per row
    -> Returns GenericResponse<SearchResponse>

For STM events:
  PATCH /api/proxy/order/{id}/ship
    -> Next.js adds Authorization header
    -> Backend OrderController.processById(id, "ship", payload)
    -> STM validates PROCESSING -> SHIPPED transition
    -> Returns GenericResponse<StateEntityServiceResponse<Order>>
```

---

## Frontend Integration Pattern

```typescript
// Server component
import { getApiClient } from '@homebase/api-client';

export default async function SellerOrders({ searchParams }) {
  const api = getApiClient();

  const [stats, orders] = await Promise.allSettled([
    api.get('/seller/orders/stats'),
    api.post('/query/seller-orders', {
      queryName: 'SellerOrder.allOrders',
      pageNum: Number(searchParams.page) || 1,
      numRowsInPage: 10,
      sortCriteria: [{ name: searchParams.sortBy || 'createdTime', ascendingOrder: false }],
      filters: {
        q: searchParams.q,
        status: searchParams.status || 'ALL',
        dateFrom: searchParams.dateFrom,
        dateTo: searchParams.dateTo,
      },
    }),
  ]);

  return (
    <>
      <StatsCards data={unwrap(stats)} />
      <OrdersTable data={unwrap(orders)} />
      <OrderDetailSlideOver /> {/* Client component, loads on click */}
    </>
  );
}
```

---

## Backend Endpoints

| Endpoint | Exists? | Backend Module |
|----------|---------|---------------|
| `GET /seller/orders/stats` | New | seller service (aggregation) |
| `POST /query/seller-orders` | Exists | order-query module (MyBatis) |
| `GET /order/{id}` | Exists | order service (Command Retrieve) |
| `PATCH /order/{id}/{eventID}` | Exists | order service (STM) |
| `GET /seller/orders/export` | New | seller service |

**MyBatis mappers needed:**
- `SellerOrder.allOrders` — in `order-query/mapper/seller-order.xml`
- `SellerOrder.allOrders-count` — count query
- `SellerOrder.pendingOrders` — canned report
- `SellerOrder.recentOrders` — canned report (used by dashboard)

**JSON definitions needed:**
- `seller-order.json` — query metadata for SellerOrder queries

---

## Allowed Actions -> UI Mapping

The backend returns `allowedActions` per row based on the entity's current state (STM).
The frontend reads these and renders only the allowed buttons.

**STM Source:** `order-states.xml` (order-flow)
**Seller ACL filter:** Only events with `SUPPLIER` or `WAREHOUSE` in `meta-acls` are visible to sellers. Most order transitions are `SYSTEM`/`ADMIN`/`WAREHOUSE` only. Sellers see a read-only view for most states.

### State -> Allowed Actions -> UI Buttons

| State | allowedActions (seller-visible) | UI Button | Icon | Color | Event ID |
|-------|-------------------------------|-----------|------|-------|----------|
| CREATED | -- | (read-only) | -- | -- | -- |
| PAYMENT_PENDING | -- | (read-only) | -- | -- | -- |
| PAYMENT_FAILED | -- | (read-only) | -- | -- | -- |
| PAID | -- | (read-only) | -- | -- | -- |
| PROCESSING | markShipped | Mark Shipped | Truck | blue | markShipped |
| PROCESSING | partialShip | Partial Ship | PackageCheck | amber | partialShip |
| ON_HOLD | -- | (read-only) | -- | -- | -- |
| PARTIALLY_SHIPPED | markShipped | Mark Shipped | Truck | blue | markShipped |
| PARTIALLY_SHIPPED | partialShip | Ship More Items | PackageCheck | amber | partialShip |
| SHIPPED | -- | (read-only) | -- | -- | -- |
| DELIVERED | -- | (read-only) | -- | -- | -- |
| COMPLETED | -- | (read-only) | -- | -- | -- |
| CANCEL_REQUESTED | -- | (read-only) | -- | -- | -- |
| CANCELLED | -- | (read-only) | -- | -- | -- |
| RETURN_REQUESTED | -- | (read-only) | -- | -- | -- |
| REFUND_REQUESTED | -- | (read-only) | -- | -- | -- |
| REFUNDED | -- | (read-only) | -- | -- | -- |

> **Note:** Sellers interact with orders primarily via the warehouse fulfillment flow. The `markShipped` and `partialShip` events require `WAREHOUSE` ACL, which sellers with warehouse access can trigger.

### Frontend Pattern

```typescript
const SELLER_ORDER_ACTION_CONFIG: Record<string, ActionButtonConfig> = {
  markShipped: { label: 'Mark Shipped', icon: 'Truck', color: 'blue' },
  partialShip: { label: 'Partial Ship', icon: 'PackageCheck', color: 'amber' },
};

// Render only allowed actions
{allowedActions.map(a => {
  const config = SELLER_ORDER_ACTION_CONFIG[a.allowedAction];
  return config ? <ActionButton {...config} onClick={() => triggerEvent(id, a.allowedAction)} /> : null;
})}
```
