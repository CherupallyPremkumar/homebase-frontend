# Seller Dashboard — API Contract

## Page: seller-dashboard.html

**Note:** All query endpoints use Chenile's `SearchRequest/SearchResponse` pattern via POST. Non-query endpoints (stats, actions) use standard REST GET.

---

## Section 1: Welcome Banner
**Data needed:** Seller name, current date
**API:** No API call needed — seller name from auth session (`getServerUser()`), date from `new Date()`
**Fetch/XHR:** None

---

## Section 2: Stats Cards (4 cards)

**API:** `GET /api/seller/dashboard/stats`
**Fetch/XHR name:** `stats`

**Response (wrapped in GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "revenue": {
      "value": 452890,
      "trend": 12.5,
      "trendDirection": "up",
      "currency": "INR"
    },
    "orders": {
      "value": 1234,
      "trend": 8.2,
      "trendDirection": "up"
    },
    "products": {
      "value": 89,
      "active": 72,
      "inactive": 12,
      "outOfStock": 5
    },
    "rating": {
      "value": 4.6,
      "totalReviews": 1238
    }
  }
}
```

**Note:** This is a custom aggregation endpoint, NOT a Chenile query. Returns GenericResponse but no SearchResponse wrapper.

---

## Section 3: Revenue Chart (12 months)

**API:** `GET /api/seller/analytics/revenue?period=12m`
**Fetch/XHR name:** `revenue?period=12m`

**Query Params:**
- `period` — `7d`, `30d`, `12m`, `1y`

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "period": "12m",
    "data": [
      { "label": "Apr", "value": 280000, "target": 300000 },
      { "label": "May", "value": 320000, "target": 300000 }
    ],
    "total": 4692890,
    "average": 391074
  }
}
```

---

## Section 4: Pending Actions

**API:** `GET /api/seller/dashboard/pending-actions`
**Fetch/XHR name:** `pending-actions`

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "ordersToShip": 3,
    "lowStockProducts": 5,
    "customerQueries": 2,
    "responseRate": 85,
    "dispatchSla": 92
  }
}
```

---

## Section 5: Recent Orders (Chenile Query)

**API:** `POST /api/query/seller-orders`
**Fetch/XHR name:** `seller-orders`

**Request (SearchRequest):**
```json
{
  "queryName": "SellerOrder.recentOrders",
  "pageNum": 1,
  "numRowsInPage": 6,
  "sortCriteria": [
    { "name": "createdTime", "ascendingOrder": false }
  ],
  "filters": {}
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
          "productSummary": "Wireless Bluetooth Speaker",
          "itemCount": 1,
          "totalAmount": 3499,
          "paymentStatus": "Paid",
          "stateId": "DELIVERED",
          "createdTime": "2026-03-27T14:34:00Z"
        },
        "allowedActions": [
          { "allowedAction": "viewOrder", "mainPath": "/orders/HB-78234" }
        ]
      }
    ],
    "currentPage": 1,
    "maxPages": 206,
    "maxRows": 1234,
    "numRowsInPage": 6,
    "numRowsReturned": 6,
    "startRow": 1,
    "endRow": 6,
    "columnMetadata": {
      "orderNumber": { "name": "Order ID", "columnType": "Text", "filterable": true, "sortable": true, "display": true },
      "customerName": { "name": "Customer", "columnType": "Text", "filterable": true, "sortable": true, "display": true },
      "totalAmount": { "name": "Amount", "columnType": "Number", "filterable": true, "sortable": true, "display": true },
      "stateId": { "name": "Status", "columnType": "Text", "filterable": true, "sortable": true, "display": true },
      "createdTime": { "name": "Date", "columnType": "Date", "filterable": true, "sortable": true, "display": true }
    },
    "hiddenColumns": ["id"],
    "availableCannedReports": [
      { "name": "recentOrders", "description": "Recent orders" },
      { "name": "pendingOrders", "description": "Pending orders" }
    ]
  }
}
```

**Note:** Uses Chenile SearchRequest format. The `queryName` maps to MyBatis mapper ID `SellerOrder.recentOrders`. Backend applies `CustomerFilterInterceptor` to filter by logged-in seller's ID.

---

## Section 6: Top Selling Products (Chenile Query)

**API:** `POST /api/query/seller-products`
**Fetch/XHR name:** `seller-products`

**Request (SearchRequest):**
```json
{
  "queryName": "SellerProduct.topSelling",
  "pageNum": 1,
  "numRowsInPage": 3,
  "sortCriteria": [
    { "name": "unitsSold", "ascendingOrder": false }
  ],
  "filters": {}
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
          "id": "prod-001",
          "name": "Wireless Bluetooth Speaker",
          "unitsSold": 456,
          "revenue": 1595544,
          "rating": 4.5,
          "image": "/images/products/speaker.jpg"
        },
        "allowedActions": [
          { "allowedAction": "editProduct", "mainPath": "/products/prod-001" }
        ]
      }
    ],
    "currentPage": 1,
    "maxPages": 30,
    "maxRows": 89,
    "numRowsInPage": 3,
    "numRowsReturned": 3,
    "startRow": 1,
    "endRow": 3,
    "columnMetadata": {}
  }
}
```

---

## Summary

| # | Section | API Endpoint | Method | Fetch/XHR Name | Type | Cache |
|---|---------|-------------|--------|----------------|------|-------|
| 1 | Welcome Banner | None (session) | — | — | — | — |
| 2 | Stats Cards | `/api/seller/dashboard/stats` | GET | `stats` | REST | 30s |
| 3 | Revenue Chart | `/api/seller/analytics/revenue?period=12m` | GET | `revenue?period=12m` | REST | 60s |
| 4 | Pending Actions | `/api/seller/dashboard/pending-actions` | GET | `pending-actions` | REST | 30s |
| 5 | Recent Orders | `/api/query/seller-orders` | POST | `seller-orders` | Chenile Query | 30s |
| 6 | Top Products | `/api/query/seller-products` | POST | `seller-products` | Chenile Query | 60s |

**Total API calls on page load: 5 (parallel)**

---

## Request Flow

```
Browser → Next.js /api/proxy/[...path] → injects JWT → Backend

For Chenile queries:
  POST /api/proxy/query/seller-orders
    → Next.js adds Authorization header
    → Backend query controller receives SearchRequest
    → CustomerFilterInterceptor adds seller ID filter
    → MyBatis executes SellerOrder.recentOrders query
    → STM enriches with allowedActions
    → Returns GenericResponse<SearchResponse>

For REST endpoints:
  GET /api/proxy/seller/dashboard/stats
    → Next.js adds Authorization header
    → Backend returns GenericResponse<DashboardStats>
```

---

## Frontend Integration

```typescript
// Server component
import { getApiClient } from '@homebase/api-client';

export default async function SellerDashboard() {
  const api = getApiClient();

  const [stats, revenue, actions, orders, products] = await Promise.allSettled([
    api.get('/seller/dashboard/stats'),
    api.get('/seller/analytics/revenue?period=12m'),
    api.get('/seller/dashboard/pending-actions'),
    api.post('/query/seller-orders', {
      queryName: 'SellerOrder.recentOrders',
      pageNum: 1,
      numRowsInPage: 6,
      sortCriteria: [{ name: 'createdTime', ascendingOrder: false }],
      filters: {},
    }),
    api.post('/query/seller-products', {
      queryName: 'SellerProduct.topSelling',
      pageNum: 1,
      numRowsInPage: 3,
      sortCriteria: [{ name: 'unitsSold', ascendingOrder: false }],
      filters: {},
    }),
  ]);

  return (
    <>
      <WelcomeBanner />
      <StatsCards data={unwrap(stats)} />
      <RevenueChart data={unwrap(revenue)} />
      <PendingActions data={unwrap(actions)} />
      <RecentOrders data={unwrap(orders)} />
      <TopProducts data={unwrap(products)} />
    </>
  );
}
```

---

## Backend Endpoints

| Endpoint | Exists? | Backend Module |
|----------|---------|---------------|
| `GET /seller/dashboard/stats` | ❌ New | seller service (aggregation) |
| `GET /seller/analytics/revenue` | ❌ New | analytics service |
| `GET /seller/dashboard/pending-actions` | ❌ New | seller service (aggregation) |
| `POST /query/seller-orders` | ✅ Exists | order-query module (MyBatis) |
| `POST /query/seller-products` | ✅ Exists | product-query module (MyBatis) |

**MyBatis mappers needed:**
- `SellerOrder.recentOrders` — in `order-query/mapper/seller-order.xml`
- `SellerOrder.recentOrders-count` — count query
- `SellerProduct.topSelling` — in `product-query/mapper/seller-product.xml`
- `SellerProduct.topSelling-count` — count query

**JSON definitions needed:**
- `seller-order.json` — query metadata for SellerOrder queries
- `seller-product.json` — query metadata for SellerProduct queries
