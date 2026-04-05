# Seller Earnings — API Contract

## Page: seller-earnings.html

**Note:** All table/list endpoints use Chenile's `SearchRequest/SearchResponse` pattern via POST. Stats and aggregations use standard REST GET.

---

## Section 1: Earnings Summary Cards (4 cards)

**Description:** Total earnings, pending settlement, paid out, refunds/deductions
**API:** `GET /api/seller/earnings/summary`
**Fetch/XHR name:** `summary`

**Query Params:**
- `period` — `7d`, `30d`, `90d`, `12m`, `custom`
- `from` — ISO date (only when period=custom)
- `to` — ISO date (only when period=custom)

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "totalEarnings": {
      "value": 452890,
      "trend": 12.5,
      "trendDirection": "up",
      "currency": "INR"
    },
    "pendingSettlement": {
      "value": 34500,
      "nextSettlementDate": "2026-04-01"
    },
    "paidOut": {
      "value": 398390,
      "lastPaidDate": "2026-03-25"
    },
    "refundsDeductions": {
      "value": 20000,
      "refunds": 15000,
      "platformFees": 3500,
      "penalties": 1500
    }
  }
}
```

**Note:** Custom aggregation endpoint, NOT a Chenile query.

---

## Section 2: Earnings Chart (daily/weekly/monthly)

**Description:** Line/bar chart showing earnings over selected period
**API:** `GET /api/seller/earnings/chart`
**Fetch/XHR name:** `earnings-chart`

**Query Params:**
- `period` — `7d`, `30d`, `90d`, `12m`
- `granularity` — `daily`, `weekly`, `monthly` (auto-selected based on period)

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "period": "30d",
    "granularity": "daily",
    "data": [
      { "label": "1 Mar", "earnings": 18500, "orders": 42 },
      { "label": "2 Mar", "earnings": 22300, "orders": 51 }
    ],
    "total": 452890,
    "average": 15096
  }
}
```

---

## Section 3: Daily Earnings Breakdown (Chenile Query)

**Description:** Paginated daily breakdown table — date, orders, gross, fees, net
**API:** `POST /api/query/seller-earnings`
**Fetch/XHR name:** `seller-earnings`

**Request (SearchRequest):**
```json
{
  "queryName": "SellerEarning.dailyBreakdown",
  "pageNum": 1,
  "numRowsInPage": 10,
  "sortCriteria": [
    { "name": "date", "ascendingOrder": false }
  ],
  "filters": {
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
          "id": "earn-20260328",
          "date": "2026-03-28",
          "orderCount": 45,
          "grossEarnings": 22500,
          "platformFee": 1125,
          "shippingFee": 450,
          "taxDeducted": 675,
          "netEarnings": 20250,
          "settlementStatus": "PENDING",
          "currency": "INR"
        },
        "allowedActions": [
          { "allowedAction": "viewDetails", "mainPath": "/earnings/earn-20260328" }
        ]
      }
    ],
    "currentPage": 1,
    "maxPages": 9,
    "maxRows": 85,
    "numRowsInPage": 10,
    "numRowsReturned": 10,
    "startRow": 1,
    "endRow": 10,
    "columnMetadata": {
      "date": { "name": "Date", "columnType": "Date", "filterable": true, "sortable": true, "display": true },
      "orderCount": { "name": "Orders", "columnType": "Number", "filterable": false, "sortable": true, "display": true },
      "grossEarnings": { "name": "Gross", "columnType": "Number", "filterable": true, "sortable": true, "display": true },
      "platformFee": { "name": "Platform Fee", "columnType": "Number", "filterable": false, "sortable": true, "display": true },
      "netEarnings": { "name": "Net Earnings", "columnType": "Number", "filterable": true, "sortable": true, "display": true },
      "settlementStatus": { "name": "Status", "columnType": "Text", "filterable": true, "sortable": true, "display": true }
    },
    "hiddenColumns": ["id"],
    "availableCannedReports": [
      { "name": "dailyBreakdown", "description": "Daily earnings breakdown" },
      { "name": "weeklyBreakdown", "description": "Weekly earnings breakdown" }
    ]
  }
}
```

**Note:** Uses Chenile SearchRequest format. The `queryName` maps to MyBatis mapper ID `SellerEarning.dailyBreakdown`. Backend applies `CustomerFilterInterceptor` to filter by logged-in seller's ID.

---

## Section 4: Top Earning Products (Chenile Query)

**Description:** Table of top revenue-generating products for selected period
**API:** `POST /api/query/seller-product-earnings`
**Fetch/XHR name:** `seller-product-earnings`

**Request (SearchRequest):**
```json
{
  "queryName": "SellerProductEarning.topProducts",
  "pageNum": 1,
  "numRowsInPage": 5,
  "sortCriteria": [
    { "name": "revenue", "ascendingOrder": false }
  ],
  "filters": {
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
          "id": "prod-001",
          "productName": "Wireless Bluetooth Speaker",
          "sku": "WBS-BLK-001",
          "unitsSold": 156,
          "revenue": 545544,
          "platformFee": 27277,
          "netEarnings": 518267,
          "image": "/images/products/speaker.jpg",
          "category": "Electronics"
        },
        "allowedActions": [
          { "allowedAction": "viewProduct", "mainPath": "/products/prod-001" }
        ]
      }
    ],
    "currentPage": 1,
    "maxPages": 18,
    "maxRows": 89,
    "numRowsInPage": 5,
    "numRowsReturned": 5,
    "startRow": 1,
    "endRow": 5,
    "columnMetadata": {
      "productName": { "name": "Product", "columnType": "Text", "filterable": true, "sortable": true, "display": true },
      "unitsSold": { "name": "Units Sold", "columnType": "Number", "filterable": false, "sortable": true, "display": true },
      "revenue": { "name": "Revenue", "columnType": "Number", "filterable": true, "sortable": true, "display": true },
      "netEarnings": { "name": "Net Earnings", "columnType": "Number", "filterable": true, "sortable": true, "display": true },
      "category": { "name": "Category", "columnType": "Text", "filterable": true, "sortable": true, "display": true }
    },
    "hiddenColumns": ["id", "sku", "image"]
  }
}
```

---

## Section 5: Category-wise Earnings (Chenile Query)

**Description:** Earnings grouped by product category — pie chart + table
**API:** `POST /api/query/seller-category-earnings`
**Fetch/XHR name:** `seller-category-earnings`

**Request (SearchRequest):**
```json
{
  "queryName": "SellerCategoryEarning.byCategory",
  "pageNum": 1,
  "numRowsInPage": 10,
  "sortCriteria": [
    { "name": "revenue", "ascendingOrder": false }
  ],
  "filters": {
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
          "id": "cat-electronics",
          "categoryName": "Electronics",
          "productCount": 12,
          "unitsSold": 423,
          "revenue": 189500,
          "percentage": 41.8,
          "netEarnings": 170550,
          "currency": "INR"
        },
        "allowedActions": []
      }
    ],
    "currentPage": 1,
    "maxPages": 1,
    "maxRows": 8,
    "numRowsInPage": 10,
    "numRowsReturned": 8,
    "startRow": 1,
    "endRow": 8,
    "columnMetadata": {
      "categoryName": { "name": "Category", "columnType": "Text", "filterable": true, "sortable": true, "display": true },
      "productCount": { "name": "Products", "columnType": "Number", "filterable": false, "sortable": true, "display": true },
      "unitsSold": { "name": "Units Sold", "columnType": "Number", "filterable": false, "sortable": true, "display": true },
      "revenue": { "name": "Revenue", "columnType": "Number", "filterable": true, "sortable": true, "display": true },
      "percentage": { "name": "Share %", "columnType": "Number", "filterable": false, "sortable": true, "display": true },
      "netEarnings": { "name": "Net Earnings", "columnType": "Number", "filterable": true, "sortable": true, "display": true }
    },
    "hiddenColumns": ["id"]
  }
}
```

---

## Summary

| # | Section | API Endpoint | Method | Fetch/XHR Name | Type | Cache |
|---|---------|-------------|--------|----------------|------|-------|
| 1 | Earnings Summary | `/api/seller/earnings/summary` | GET | `summary` | REST | 30s |
| 2 | Earnings Chart | `/api/seller/earnings/chart` | GET | `earnings-chart` | REST | 60s |
| 3 | Daily Breakdown | `/api/query/seller-earnings` | POST | `seller-earnings` | Chenile Query | 30s |
| 4 | Top Products | `/api/query/seller-product-earnings` | POST | `seller-product-earnings` | Chenile Query | 60s |
| 5 | Category Earnings | `/api/query/seller-category-earnings` | POST | `seller-category-earnings` | Chenile Query | 60s |

**Total API calls on page load: 5 (parallel)**

---

## Request Flow

```
Browser -> Next.js /api/proxy/[...path] -> injects JWT -> Backend

For Chenile queries:
  POST /api/proxy/query/seller-earnings
    -> Next.js adds Authorization header
    -> Backend query controller receives SearchRequest
    -> CustomerFilterInterceptor adds seller ID filter
    -> MyBatis executes SellerEarning.dailyBreakdown query
    -> STM enriches with allowedActions
    -> Returns GenericResponse<SearchResponse>

For REST endpoints:
  GET /api/proxy/seller/earnings/summary?period=30d
    -> Next.js adds Authorization header
    -> Backend returns GenericResponse<EarningsSummary>
```

---

## Frontend Integration

```typescript
// Server component
import { getApiClient } from '@homebase/api-client';

export default async function SellerEarnings() {
  const api = getApiClient();

  const [summary, chart, daily, topProducts, categories] = await Promise.allSettled([
    api.get('/seller/earnings/summary?period=30d'),
    api.get('/seller/earnings/chart?period=30d'),
    api.post('/query/seller-earnings', {
      queryName: 'SellerEarning.dailyBreakdown',
      pageNum: 1,
      numRowsInPage: 10,
      sortCriteria: [{ name: 'date', ascendingOrder: false }],
      filters: { dateFrom: '2026-03-01', dateTo: '2026-03-28' },
    }),
    api.post('/query/seller-product-earnings', {
      queryName: 'SellerProductEarning.topProducts',
      pageNum: 1,
      numRowsInPage: 5,
      sortCriteria: [{ name: 'revenue', ascendingOrder: false }],
      filters: {},
    }),
    api.post('/query/seller-category-earnings', {
      queryName: 'SellerCategoryEarning.byCategory',
      pageNum: 1,
      numRowsInPage: 10,
      sortCriteria: [{ name: 'revenue', ascendingOrder: false }],
      filters: {},
    }),
  ]);

  return (
    <>
      <EarningsSummaryCards data={unwrap(summary)} />
      <EarningsChart data={unwrap(chart)} />
      <DailyBreakdownTable data={unwrap(daily)} />
      <TopEarningProducts data={unwrap(topProducts)} />
      <CategoryEarnings data={unwrap(categories)} />
    </>
  );
}
```

---

## Backend Endpoints

| Endpoint | Exists? | Backend Module |
|----------|---------|---------------|
| `GET /seller/earnings/summary` | New | seller-earnings service (aggregation) |
| `GET /seller/earnings/chart` | New | seller-analytics service |
| `POST /query/seller-earnings` | New | earnings-query module (MyBatis) |
| `POST /query/seller-product-earnings` | New | earnings-query module (MyBatis) |
| `POST /query/seller-category-earnings` | New | earnings-query module (MyBatis) |

**MyBatis mappers needed:**
- `SellerEarning.dailyBreakdown` — in `earnings-query/mapper/seller-earning.xml`
- `SellerEarning.dailyBreakdown-count` — count query
- `SellerProductEarning.topProducts` — in `earnings-query/mapper/seller-product-earning.xml`
- `SellerProductEarning.topProducts-count` — count query
- `SellerCategoryEarning.byCategory` — in `earnings-query/mapper/seller-category-earning.xml`
- `SellerCategoryEarning.byCategory-count` — count query

**JSON definitions needed:**
- `seller-earning.json` — query metadata for SellerEarning queries
- `seller-product-earning.json` — query metadata for SellerProductEarning queries
- `seller-category-earning.json` — query metadata for SellerCategoryEarning queries
