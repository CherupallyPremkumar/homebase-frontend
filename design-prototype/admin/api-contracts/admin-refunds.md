# Admin Refund Management — API Contract

## Page: admin-refunds.html

**Note:** Refund list uses Chenile `SearchRequest/SearchResponse` via POST. Stats use GET with `GenericResponse`. Refund state transitions use PATCH with STM event IDs. Refund states: `INITIATED -> APPROVED -> PROCESSING -> COMPLETED | FAILED`.

---

## Section 1: Refund Stats Cards (4 cards) + Summary

**API:** `GET /api/admin/refunds/stats?from={from}&to={to}`
**Fetch/XHR name:** `refund-stats`

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "totalRefunds": 234,
    "processing": 12,
    "completed": 215,
    "failed": 7,
    "totalRefundedAmount": 456800,
    "avgRefundTime": 2.4,
    "refundRate": 3.2
  }
}
```

---

## Section 2: Refund List Table

**API:** `POST /api/query/admin-refunds`
**Fetch/XHR name:** `admin-refunds`

**Request (SearchRequest):**
```json
{
  "queryName": "AdminRefund.list",
  "pageNum": 1,
  "numRowsInPage": 20,
  "sortCriteria": [{ "name": "initiatedDate", "ascendingOrder": false }],
  "filters": {
    "status": "all",
    "dateFrom": "2026-03-01",
    "dateTo": "2026-03-28"
  }
}
```

**Filter `status` values:** `all | initiated | processing | completed | failed`

**Response (SearchResponse):**
```json
{
  "list": [
    {
      "row": {
        "id": "RF-1001",
        "orderId": "HB-78234",
        "customer": "Rajesh Kumar",
        "amount": 12500,
        "reason": "Return",
        "method": "Original Payment",
        "status": "Completed",
        "initiatedDate": "2026-03-22",
        "completedDate": "2026-03-25"
      },
      "allowedActions": ["view"]
    },
    {
      "row": {
        "id": "RF-1004",
        "orderId": "HB-78301",
        "customer": "Sunita Reddy",
        "amount": 24900,
        "reason": "Damaged",
        "method": "Original Payment",
        "status": "Failed",
        "initiatedDate": "2026-03-20",
        "completedDate": null,
        "failureReason": "Bank rejected - Account number mismatch"
      },
      "allowedActions": ["retry", "view"]
    }
  ],
  "totalCount": 234,
  "numRowsInPage": 20
}
```

---

## Section 3: Refund Detail (Slide-over Modal)

**API:** `GET /api/admin/refunds/{refundId}`
**Fetch/XHR name:** `refund-detail`

**Response (StateEntityServiceResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "id": "RF-1001",
    "orderId": "HB-78234",
    "amount": 12500,
    "customer": "Rajesh Kumar",
    "refundMethod": "Original Payment (UPI)",
    "reason": "Return - Product not as described",
    "bankReference": "REF-RPY-78234-A1B2",
    "status": "Completed",
    "stateLabel": "Completed",
    "timeline": [
      { "state": "Initiated", "timestamp": "2026-03-22T14:15:00Z", "description": "Customer requested return refund" },
      { "state": "Approved", "timestamp": "2026-03-22T16:30:00Z", "description": "Auto-approved by system (return verified)" },
      { "state": "Processing", "timestamp": "2026-03-23T10:00:00Z", "description": "Sent to Razorpay for processing" },
      { "state": "Completed", "timestamp": "2026-03-25T11:45:00Z", "description": "Refund credited to customer UPI" }
    ],
    "allowedActions": ["view"]
  }
}
```

---

## Command: Approve Refund (STM Action)

**API:** `PATCH /api/admin/refunds/{refundId}/approve`
**Fetch/XHR name:** `approve-refund`

**Request:**
```json
{
  "adminNote": "Approved - valid return"
}
```

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": { "id": "RF-1006", "status": "Approved", "allowedActions": [] }
}
```

---

## Command: Retry Failed Refund (STM Action)

**API:** `PATCH /api/admin/refunds/{refundId}/retry`
**Fetch/XHR name:** `retry-refund`

**Request:** `{}`

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": { "id": "RF-1004", "status": "Processing", "allowedActions": ["view"] }
}
```

---

## Section 4: Export Refunds

**API:** `POST /api/admin/refunds/export`
**Fetch/XHR name:** `refund-export`

**Request:**
```json
{ "from": "2026-03-01", "to": "2026-03-28", "format": "csv", "status": "all" }
```

**Response:**
```json
{
  "success": true,
  "payload": { "downloadUrl": "/api/admin/downloads/refunds-20260328.csv", "expiresAt": "2026-03-29T10:30:00Z" }
}
```

---

## Allowed Actions Mapping (STM)

| Current State | Allowed Actions | Button Label |
|---------------|----------------|--------------|
| `INITIATED` | `approve` | Approve |
| `PROCESSING` | `view` | View |
| `COMPLETED` | `view` | View |
| `FAILED` | `retry`, `view` | Retry |

---

## Summary

| # | Section | API Endpoint | Method | Fetch/XHR Name | Date Filtered |
|---|---------|-------------|--------|----------------|---------------|
| 1 | Stats Cards | `/api/admin/refunds/stats` | GET | `refund-stats` | **Yes** |
| 2 | Refund List | `POST /api/query/admin-refunds` | POST (Chenile) | `admin-refunds` | **Yes** (via filters) |
| 3 | Refund Detail | `/api/admin/refunds/{id}` | GET | `refund-detail` | No |
| 4 | Approve | `PATCH /api/admin/refunds/{id}/approve` | PATCH (STM) | `approve-refund` | No |
| 5 | Retry Failed | `PATCH /api/admin/refunds/{id}/retry` | PATCH (STM) | `retry-refund` | No |
| 6 | Export | `POST /api/admin/refunds/export` | POST | `refund-export` | **Yes** |

**Total API calls on page load: 2 (stats + list in parallel)**
