# Admin Settlement Management — API Contract

## Page: admin-settlements.html

**Note:** Settlements use Chenile `SearchRequest/SearchResponse` for the table. Stats use GET. Settlement state transitions use PATCH with STM event IDs. Settlement states: `PENDING -> PROCESSING -> COMPLETED | FAILED | DISPUTED`.

---

## Section 1: Settlement Stats (4 cards)

**API:** `GET /api/admin/settlements/stats?from={from}&to={to}`
**Fetch/XHR name:** `settlement-stats`

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "totalPending": 4580000,
    "processedThisWeek": 12450000,
    "activeSellers": 234,
    "avgSettlementDays": 3.2
  }
}
```

---

## Section 2: Settlements Table

**API:** `POST /api/query/admin-settlements`
**Fetch/XHR name:** `admin-settlements`

**Request (SearchRequest):**
```json
{
  "queryName": "AdminSettlement.list",
  "pageNum": 1,
  "numRowsInPage": 20,
  "sortCriteria": [{ "name": "period", "ascendingOrder": false }],
  "filters": {
    "status": "all",
    "seller": "all",
    "dateFrom": "2026-03-01",
    "dateTo": "2026-03-28",
    "search": ""
  }
}
```

**Filter `status` values:** `all | pending | processing | completed | failed | disputed`

**Response (SearchResponse):**
```json
{
  "list": [
    {
      "row": {
        "id": "STL-20260328-001",
        "sellerName": "Rajesh Store",
        "sellerInitials": "RS",
        "period": "Mar 15 - 21",
        "grossAmount": 845200,
        "platformFee": 42260,
        "gst": 7605,
        "netPayout": 795335,
        "status": "Pending",
        "payoutDate": null
      },
      "allowedActions": ["process", "view"]
    },
    {
      "row": {
        "id": "STL-20260327-002",
        "sellerName": "TechWorld India",
        "sellerInitials": "TW",
        "period": "Mar 15 - 21",
        "grossAmount": 1572800,
        "platformFee": 78640,
        "gst": 14155,
        "netPayout": 1480005,
        "status": "Processing",
        "payoutDate": null
      },
      "allowedActions": ["view"]
    }
  ],
  "totalCount": 48,
  "numRowsInPage": 20
}
```

---

## Command: Process Single Settlement (STM Action)

**API:** `PATCH /api/admin/settlements/{settlementId}/process`
**Fetch/XHR name:** `process-settlement`

**Request:** `{}`

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": { "id": "STL-20260328-001", "status": "Processing", "allowedActions": ["view"] }
}
```

---

## Command: Process Batch Settlement

**API:** `POST /api/admin/settlements/processBatch`
**Fetch/XHR name:** `process-batch`

**Request:**
```json
{
  "settlementIds": ["STL-20260328-001", "STL-20260328-003", "STL-20260328-005"],
  "note": "Weekly settlement batch"
}
```

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "batchId": "BTH-20260328-001",
    "processed": 3,
    "totalAmount": 2150000,
    "status": "Processing"
  }
}
```

---

## Command: Dispute Settlement (STM Action)

**API:** `PATCH /api/admin/settlements/{settlementId}/dispute`
**Fetch/XHR name:** `dispute-settlement`

**Request:**
```json
{ "reason": "Seller disputes commission calculation", "sellerNote": "Commission should be 5% not 8% for this category" }
```

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": { "id": "STL-20260325-004", "status": "Disputed", "allowedActions": ["resolve", "view"] }
}
```

---

## Command: Resolve Settlement Dispute (STM Action)

**API:** `PATCH /api/admin/settlements/{settlementId}/resolveDispute`
**Fetch/XHR name:** `resolve-settlement-dispute`

**Request:**
```json
{ "resolution": "Adjusted commission to 5%. Difference added to next settlement.", "adjustedAmount": 795335 }
```

---

## Allowed Actions Mapping (STM)

| Current State | Allowed Actions | Buttons |
|---------------|----------------|---------|
| `PENDING` | `process`, `view` | Process, View |
| `PROCESSING` | `view` | View |
| `COMPLETED` | `view` | View |
| `FAILED` | `retry`, `view` | Retry, View |
| `DISPUTED` | `resolveDispute`, `view` | Resolve, View |

---

## Summary

| # | Section | API Endpoint | Method | Fetch/XHR Name | Date Filtered |
|---|---------|-------------|--------|----------------|---------------|
| 1 | Stats | `/api/admin/settlements/stats` | GET | `settlement-stats` | **Yes** |
| 2 | List | `POST /api/query/admin-settlements` | POST (Chenile) | `admin-settlements` | **Yes** (via filters) |
| 3 | Process | `PATCH /api/admin/settlements/{id}/process` | PATCH (STM) | `process-settlement` | No |
| 4 | Batch Process | `POST /api/admin/settlements/processBatch` | POST | `process-batch` | No |
| 5 | Dispute | `PATCH /api/admin/settlements/{id}/dispute` | PATCH (STM) | `dispute-settlement` | No |
| 6 | Resolve Dispute | `PATCH /api/admin/settlements/{id}/resolveDispute` | PATCH (STM) | `resolve-settlement-dispute` | No |
| 7 | Export | `POST /api/admin/settlements/export` | POST | `settlement-export` | **Yes** |

**Total API calls on page load: 2 (stats + list in parallel)**
