# Admin Dispute Management — API Contract

## Page: admin-disputes.html

**Note:** Dispute list uses Chenile `SearchRequest/SearchResponse` via POST. Stats and SLA use GET. Dispute resolution uses PATCH with STM event IDs. Dispute states: `OPEN -> UNDER_REVIEW -> RESOLVED | ESCALATED`. Resolution outcomes: `REFUND_CUSTOMER`, `SIDE_WITH_SELLER`, `PARTIAL_REFUND`, `SPLIT_DECISION`.

---

## Section 1: Dispute Stats Cards (4 cards) + SLA Tracker

**API:** `GET /api/admin/disputes/stats?from={from}&to={to}`
**Fetch/XHR name:** `dispute-stats`

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "open": 8,
    "underReview": 5,
    "resolved": 45,
    "escalated": 2,
    "sla": {
      "avgResolutionDays": 3.2,
      "withinSlaPercentage": 92,
      "slaBreaches": 4,
      "targetDays": 5
    }
  }
}
```

---

## Section 2: Dispute List Table

**API:** `POST /api/query/admin-disputes`
**Fetch/XHR name:** `admin-disputes`

**Request (SearchRequest):**
```json
{
  "queryName": "AdminDispute.list",
  "pageNum": 1,
  "numRowsInPage": 20,
  "sortCriteria": [{ "name": "openedDate", "ascendingOrder": false }],
  "filters": {
    "status": "all",
    "dateFrom": "2026-03-01",
    "dateTo": "2026-03-28"
  }
}
```

**Filter `status` values:** `all | open | review | resolved | escalated`

**Response (SearchResponse):**
```json
{
  "list": [
    {
      "row": {
        "id": "DSP-2045",
        "orderId": "HB-78102",
        "customer": "Rajesh Kumar",
        "seller": "Sharma Electronics",
        "issueType": "Not Received",
        "amount": 45000,
        "status": "Escalated",
        "openedDate": "2026-03-15"
      },
      "allowedActions": ["review", "resolveRefundCustomer", "resolveSideWithSeller", "resolvePartialRefund", "resolveSplitDecision"]
    }
  ],
  "totalCount": 60,
  "numRowsInPage": 20
}
```

---

## Section 3: Dispute Detail (Slide-over Modal)

**API:** `GET /api/admin/disputes/{disputeId}`
**Fetch/XHR name:** `dispute-detail`

**Response (StateEntityServiceResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "id": "DSP-2050",
    "orderId": "HB-78390",
    "amount": 3200,
    "customer": { "name": "Priya Sharma", "id": "USR-05678" },
    "seller": { "name": "GreenLeaf Organics", "id": "SLR-0156" },
    "issueType": "Quality",
    "status": "Open",
    "openedDate": "2026-03-27",
    "customerComplaint": {
      "text": "I received the organic spice set but the turmeric powder has a very different color...",
      "photos": ["photo1.jpg", "photo2.jpg", "photo3.jpg"]
    },
    "sellerResponse": {
      "text": "Our turmeric is sourced directly from certified organic farms in Erode...",
      "documents": ["cert1.pdf", "cert2.pdf"]
    },
    "communicationThread": [
      { "author": "Priya Sharma", "role": "customer", "message": "The product quality is clearly not what was advertised.", "timestamp": "2026-03-27T10:30:00Z" },
      { "author": "GreenLeaf Organics", "role": "seller", "message": "We stand by our product quality...", "timestamp": "2026-03-27T14:15:00Z" }
    ],
    "similarCases": [
      { "id": "DSP-1985", "issueType": "Quality", "resolution": "Partial refund (50%)", "status": "Resolved" }
    ],
    "allowedActions": ["resolveRefundCustomer", "resolveSideWithSeller", "resolvePartialRefund", "resolveSplitDecision", "escalate", "addNote"]
  }
}
```

---

## Command: Resolve Dispute (STM Action)

**API:** `PATCH /api/admin/disputes/{disputeId}/resolve`
**Fetch/XHR name:** `resolve-dispute`

**Request:**
```json
{
  "resolution": "REFUND_CUSTOMER",
  "refundAmount": 3200,
  "adminNote": "Packaging damage evident in photos, siding with customer"
}
```

**Resolution enum:** `REFUND_CUSTOMER | SIDE_WITH_SELLER | PARTIAL_REFUND | SPLIT_DECISION`

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": { "id": "DSP-2050", "status": "Resolved", "resolution": "REFUND_CUSTOMER", "allowedActions": ["view"] }
}
```

---

## Command: Escalate Dispute (STM Action)

**API:** `PATCH /api/admin/disputes/{disputeId}/escalate`
**Fetch/XHR name:** `escalate-dispute`

**Request:**
```json
{ "reason": "Customer threatening legal action, requires senior review" }
```

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": { "id": "DSP-2050", "status": "Escalated", "allowedActions": ["resolveRefundCustomer", "resolveSideWithSeller", "resolvePartialRefund", "resolveSplitDecision"] }
}
```

---

## Command: Add Admin Note

**API:** `POST /api/admin/disputes/{disputeId}/notes`
**Fetch/XHR name:** `add-dispute-note`

**Request:**
```json
{ "note": "Reviewed seller certifications - appear legitimate" }
```

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": { "noteId": "NOTE-001", "timestamp": "2026-03-28T10:30:00Z" }
}
```

---

## Allowed Actions Mapping (STM)

| Current State | Allowed Actions | Buttons |
|---------------|----------------|---------|
| `OPEN` | `review`, `escalate`, `addNote` | Review |
| `UNDER_REVIEW` | `resolveRefundCustomer`, `resolveSideWithSeller`, `resolvePartialRefund`, `resolveSplitDecision`, `escalate`, `addNote` | Refund Customer, Side with Seller, Partial Refund, Split Decision |
| `ESCALATED` | `resolveRefundCustomer`, `resolveSideWithSeller`, `resolvePartialRefund`, `resolveSplitDecision`, `addNote` | Urgent + Resolution options |
| `RESOLVED` | `view` | View |

---

## Summary

| # | Section | API Endpoint | Method | Fetch/XHR Name | Date Filtered |
|---|---------|-------------|--------|----------------|---------------|
| 1 | Stats + SLA | `/api/admin/disputes/stats` | GET | `dispute-stats` | **Yes** |
| 2 | Dispute List | `POST /api/query/admin-disputes` | POST (Chenile) | `admin-disputes` | **Yes** (via filters) |
| 3 | Dispute Detail | `/api/admin/disputes/{id}` | GET | `dispute-detail` | No |
| 4 | Resolve | `PATCH /api/admin/disputes/{id}/resolve` | PATCH (STM) | `resolve-dispute` | No |
| 5 | Escalate | `PATCH /api/admin/disputes/{id}/escalate` | PATCH (STM) | `escalate-dispute` | No |
| 6 | Add Note | `POST /api/admin/disputes/{id}/notes` | POST | `add-dispute-note` | No |
| 7 | Export | `POST /api/admin/disputes/export` | POST | `dispute-export` | **Yes** |

**Total API calls on page load: 2 (stats + list in parallel)**
