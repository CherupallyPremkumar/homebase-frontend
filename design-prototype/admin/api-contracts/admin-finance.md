# Admin Finance Dashboard — API Contract

## Page: admin-finance.html

**Note:** The finance dashboard uses GET endpoints with `GenericResponse` wrapper for stats/charts and Chenile's `SearchRequest/SearchResponse` for the transactions table. All endpoints accept date range params. Money values are in paise (INR smallest unit) internally but displayed as rupees.

---

## Date Range Filter (applies to all sections)

| Param | Type | Example | Description |
|-------|------|---------|-------------|
| `from` | ISO date | `2026-03-01` | Start date (inclusive) |
| `to` | ISO date | `2026-03-28` | End date (inclusive) |
| `period` | enum | `today\|7d\|30d\|90d\|1y` | Shortcut (overrides from/to) |

---

## Section 1: Finance Stats Cards (5 cards)

**API:** `GET /api/admin/finance/stats?from={from}&to={to}`
**Fetch/XHR name:** `finance-stats`

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "totalCollections": { "value": 24500000, "trend": 12.4, "trendDirection": "up", "currency": "INR" },
    "platformCommission": { "value": 1225000, "trend": 8.7, "trendDirection": "up", "commissionRate": 5.0 },
    "gatewayFees": { "value": 490000, "trend": 5.2, "trendDirection": "up", "feeRate": 2.0, "gateway": "Razorpay" },
    "gstCollected": { "value": 308700, "gstRate": 18.0, "nextFilingDate": "2026-04-20" },
    "netPlatformRevenue": { "value": 426300, "trend": 15.3, "trendDirection": "up" }
  }
}
```

---

## Section 2: Money Flow Breakdown

**API:** `GET /api/admin/finance/money-flow?from={from}&to={to}`
**Fetch/XHR name:** `money-flow`

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "customerPays": { "value": 24500000, "percentage": 100.0 },
    "platformCommission": { "value": 1225000, "percentage": 5.0 },
    "gatewayFee": { "value": 490000, "percentage": 2.0, "provider": "Razorpay" },
    "gstOnFees": { "value": 308700, "percentage": 1.26, "gstRate": 18.0 },
    "sellerPayouts": { "value": 22400000, "percentage": 91.4 },
    "platformKeeps": { "value": 426300 }
  }
}
```

---

## Section 3: Revenue Trend Chart

**API:** `GET /api/admin/finance/revenue-trend?from={from}&to={to}&granularity={daily|weekly}`
**Fetch/XHR name:** `revenue-trend`

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "granularity": "daily",
    "data": [
      { "label": "1", "commission": 45000, "gatewayFee": 18000 },
      { "label": "2", "commission": 38000, "gatewayFee": 15200 }
    ]
  }
}
```

---

## Section 4: Pending Settlements

**API:** `GET /api/admin/finance/pending-settlements`
**Fetch/XHR name:** `pending-settlements`

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "totalPending": 4580000,
    "totalSellers": 42,
    "dueToday": { "amount": 845000, "sellers": 7 },
    "dueThisWeek": { "amount": 2230000, "sellers": 18 },
    "overdue": { "amount": 1505000, "sellers": 17 }
  }
}
```

---

## Section 5: Gateway Balance

**API:** `GET /api/admin/finance/gateway-balance`
**Fetch/XHR name:** `gateway-balance`

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "gateway": "Razorpay",
    "availableForPayout": 1245000,
    "settledToday": 320000,
    "onHold": 185000,
    "inTransit": 740000
  }
}
```

---

## Section 6: Reconciliation Status

**API:** `GET /api/admin/finance/reconciliation?from={from}&to={to}`
**Fetch/XHR name:** `reconciliation`

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "matchedPercentage": 98.2,
    "totalTransactions": 1277,
    "matched": 1254,
    "mismatched": 23
  }
}
```

---

## Section 7: Recent Transactions Table

**API:** `POST /api/query/admin-transactions`
**Fetch/XHR name:** `admin-transactions`

**Request (SearchRequest):**
```json
{
  "queryName": "AdminTransaction.recentTransactions",
  "pageNum": 1,
  "numRowsInPage": 10,
  "sortCriteria": [{ "name": "date", "ascendingOrder": false }],
  "filters": {
    "dateFrom": "2026-03-01",
    "dateTo": "2026-03-28",
    "status": "all"
  }
}
```

**Response (SearchResponse):**
```json
{
  "list": [
    {
      "row": {
        "date": "2026-03-28",
        "orderId": "HB-78456",
        "customer": "Rajesh Kumar",
        "amount": 124500,
        "commission": 6225,
        "gatewayFee": 2490,
        "sellerPayout": 115785,
        "status": "Settled"
      }
    }
  ],
  "totalCount": 1277,
  "numRowsInPage": 10
}
```

---

## Section 8: Export Report

**API:** `POST /api/admin/finance/export`
**Fetch/XHR name:** `finance-export`

**Request:**
```json
{
  "from": "2026-03-01",
  "to": "2026-03-28",
  "format": "csv",
  "sections": ["transactions", "money-flow", "reconciliation"]
}
```

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "downloadUrl": "/api/admin/downloads/finance-report-20260328.csv",
    "expiresAt": "2026-03-29T10:30:00Z"
  }
}
```

---

## Command: Sync Gateway Balance

**API:** `PATCH /api/admin/finance/gateway/{gatewayId}/sync`
**Fetch/XHR name:** `sync-gateway`

**Request:** `{}` (empty body)

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "lastSynced": "2026-03-28T10:30:00Z",
    "availableForPayout": 1245000
  }
}
```

---

## Command: Process Batch Settlement

**API:** `PATCH /api/admin/finance/settlements/processBatch`
**Fetch/XHR name:** `process-batch-settlement`

**Request:**
```json
{
  "sellerIds": ["seller-001", "seller-002"],
  "dueCategory": "today"
}
```

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "batchId": "BTH-20260328-001",
    "sellersProcessed": 7,
    "totalAmount": 845000,
    "status": "Processing"
  }
}
```

---

## Summary

| # | Section | API Endpoint | Method | Fetch/XHR Name | Date Filtered | Cache |
|---|---------|-------------|--------|----------------|---------------|-------|
| 1 | Stats Cards | `/api/admin/finance/stats` | GET | `finance-stats` | **Yes** | 30s |
| 2 | Money Flow | `/api/admin/finance/money-flow` | GET | `money-flow` | **Yes** | 60s |
| 3 | Revenue Trend | `/api/admin/finance/revenue-trend` | GET | `revenue-trend` | **Yes** | 60s |
| 4 | Pending Settlements | `/api/admin/finance/pending-settlements` | GET | `pending-settlements` | No | 30s |
| 5 | Gateway Balance | `/api/admin/finance/gateway-balance` | GET | `gateway-balance` | No | 15s |
| 6 | Reconciliation | `/api/admin/finance/reconciliation` | GET | `reconciliation` | **Yes** | 60s |
| 7 | Transactions Table | `POST /api/query/admin-transactions` | POST (Chenile) | `admin-transactions` | **Yes** (via filters) | 30s |
| 8 | Export | `POST /api/admin/finance/export` | POST | `finance-export` | **Yes** | — |
| 9 | Sync Gateway | `PATCH /api/admin/finance/gateway/{id}/sync` | PATCH | `sync-gateway` | No | — |
| 10 | Batch Settlement | `PATCH /api/admin/finance/settlements/processBatch` | PATCH | `process-batch-settlement` | No | — |

**Total API calls on page load: 7 (parallel)**
