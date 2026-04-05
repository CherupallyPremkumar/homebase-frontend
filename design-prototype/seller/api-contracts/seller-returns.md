# Seller Returns — API Contract

## Page: seller-returns.html

**Note:** All table/list endpoints use Chenile's `SearchRequest/SearchResponse` pattern via POST. Retrieve uses GET with `StateEntityServiceResponse`. State transitions (approve/reject) use PATCH STM events. Stats use standard REST GET.

---

## Section 1: Stats Cards (5 cards)

**Description:** Return counts by status — total, pending approval, pickup scheduled, refund processing, completed
**API:** `GET /api/seller/returns/stats`
**Fetch/XHR name:** `stats`

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "total": 8,
    "pendingApproval": 3,
    "pickupScheduled": 2,
    "refundProcessing": 2,
    "completed": 1
  }
}
```

**Note:** Custom aggregation endpoint, NOT a Chenile query.

---

## Section 2: Returns Table (filter tabs, paginate — Chenile Query)

**Description:** Returns list with status filter tabs
**API:** `POST /api/query/seller-returns`
**Fetch/XHR name:** `seller-returns`

**Request (SearchRequest):**
```json
{
  "queryName": "SellerReturn.allReturns",
  "pageNum": 1,
  "numRowsInPage": 10,
  "sortCriteria": [
    { "name": "createdTime", "ascendingOrder": false }
  ],
  "filters": {
    "q": "",
    "status": "ALL"
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
          "id": "RTN-4501",
          "orderId": "ORD-8821",
          "customerName": "Ananya Sharma",
          "customerEmail": "ananya@email.com",
          "productName": "Cotton Kurta Set",
          "reason": "Size mismatch",
          "refundAmount": 1299,
          "stateId": "PENDING",
          "createdTime": "2026-03-27T00:00:00Z"
        },
        "allowedActions": [
          { "allowedAction": "approve", "acls": "SELLER", "bodyType": "ApprovePayload" },
          { "allowedAction": "reject", "acls": "SELLER", "bodyType": "RejectPayload" }
        ]
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
      "orderId": { "name": "Order ID", "columnType": "Text", "filterable": true, "sortable": true, "display": true },
      "customerName": { "name": "Customer", "columnType": "Text", "filterable": true, "sortable": true, "display": true },
      "productName": { "name": "Product", "columnType": "Text", "filterable": true, "sortable": false, "display": true },
      "refundAmount": { "name": "Refund", "columnType": "Number", "filterable": false, "sortable": true, "display": true },
      "stateId": { "name": "Status", "columnType": "Text", "filterable": true, "sortable": true, "display": true },
      "createdTime": { "name": "Date", "columnType": "Date", "filterable": true, "sortable": true, "display": true }
    },
    "hiddenColumns": ["id"],
    "availableCannedReports": [
      { "name": "allReturns", "description": "All returns" },
      { "name": "pendingReturns", "description": "Pending approval" }
    ]
  }
}
```

---

## Section 3: View Return Detail (Slide-over — Command Retrieve)

**Description:** Full return detail when clicking a return row
**API:** `GET /api/returnrequest/{id}`
**Fetch/XHR name:** `returnrequest/{id}`

**Response (GenericResponse<StateEntityServiceResponse<ReturnRequest>>):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "mutatedEntity": {
      "id": "RTN-4501",
      "orderId": "ORD-8821",
      "customer": {
        "name": "Ananya Sharma",
        "email": "ananya@email.com",
        "phone": "+91 98765 12345"
      },
      "product": {
        "id": "prod-042",
        "name": "Cotton Kurta Set",
        "sku": "HB-FA-0042",
        "image": "/images/products/kurta.jpg",
        "quantity": 1,
        "price": 1299
      },
      "reason": "Size mismatch",
      "customerNotes": "Ordered size M but received size L",
      "images": [
        "/images/returns/rtn-4501-1.jpg",
        "/images/returns/rtn-4501-2.jpg"
      ],
      "refundAmount": 1299,
      "stateId": "PENDING",
      "timeline": [
        { "status": "Return Requested", "timestamp": "2026-03-27T10:00:00Z", "description": "Customer initiated return" }
      ],
      "createdTime": "2026-03-27T10:00:00Z",
      "updatedTime": "2026-03-27T10:00:00Z"
    },
    "allowedActionsAndMetadata": [
      { "allowedAction": "approve", "acls": "SELLER", "bodyType": "ApprovePayload" },
      { "allowedAction": "reject", "acls": "SELLER", "bodyType": "RejectPayload" }
    ]
  }
}
```

---

## Section 4: Approve Return (STM Event)

**Description:** Approve a pending return request
**API:** `PATCH /api/returnrequest/{id}/approve`
**Fetch/XHR name:** `returnrequest/{id}/approve`

**Request Body:**
```json
{
  "sellerNotes": "Return approved. Pickup will be scheduled."
}
```

**Response (GenericResponse<StateEntityServiceResponse<ReturnRequest>>):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "mutatedEntity": {
      "id": "RTN-4501",
      "stateId": "APPROVED"
    },
    "allowedActionsAndMetadata": [
      { "allowedAction": "schedulePickup", "acls": "SYSTEM" }
    ]
  }
}
```

---

## Section 5: Reject Return (STM Event)

**Description:** Reject a pending return request
**API:** `PATCH /api/returnrequest/{id}/reject`
**Fetch/XHR name:** `returnrequest/{id}/reject`

**Request Body:**
```json
{
  "sellerNotes": "Product was used and does not qualify for return"
}
```

**Response (GenericResponse<StateEntityServiceResponse<ReturnRequest>>):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "mutatedEntity": {
      "id": "RTN-4501",
      "stateId": "REJECTED"
    },
    "allowedActionsAndMetadata": []
  }
}
```

---

## Section 6: Export Returns

**Description:** Export returns to CSV
**API:** `GET /api/seller/returns/export`
**Fetch/XHR name:** `export`

**Query Params:**
- `format` — `csv` or `xlsx`
- `status` — optional filter

**Response:** Binary file download.

---

## Summary

| # | Section | API Endpoint | Method | Fetch/XHR Name | Type | Cache |
|---|---------|-------------|--------|----------------|------|-------|
| 1 | Stats Cards | `/api/seller/returns/stats` | GET | `stats` | REST | 30s |
| 2 | Returns Table | `/api/query/seller-returns` | POST | `seller-returns` | Chenile Query | 30s |
| 3 | Return Detail | `/api/returnrequest/{id}` | GET | `returnrequest/{id}` | Command Retrieve | 15s |
| 4 | Approve Return | `/api/returnrequest/{id}/approve` | PATCH | `returnrequest/{id}/approve` | STM Event | — |
| 5 | Reject Return | `/api/returnrequest/{id}/reject` | PATCH | `returnrequest/{id}/reject` | STM Event | — |
| 6 | Export Returns | `/api/seller/returns/export` | GET | `export` | REST | — |

**Total API calls on page load: 2 (parallel)**

---

## Frontend Integration Pattern

```typescript
// Server component
import { getApiClient } from '@homebase/api-client';

export default async function SellerReturns({ searchParams }) {
  const api = getApiClient();

  const [stats, returns] = await Promise.allSettled([
    api.get('/seller/returns/stats'),
    api.post('/query/seller-returns', {
      queryName: 'SellerReturn.allReturns',
      pageNum: Number(searchParams.page) || 1,
      numRowsInPage: 10,
      sortCriteria: [{ name: 'createdTime', ascendingOrder: false }],
      filters: { status: searchParams.status || 'ALL' },
    }),
  ]);

  return (
    <>
      <StatsCards data={unwrap(stats)} />
      <FilterTabs />
      <ReturnsTable data={unwrap(returns)} />
      <ReturnDetailSlideOver /> {/* Client component, loads on click */}
    </>
  );
}
```

---

## Backend Endpoints

| Endpoint | Exists? | Backend Module |
|----------|---------|---------------|
| `GET /seller/returns/stats` | New | seller service (aggregation) |
| `POST /query/seller-returns` | New | return-query module (MyBatis) |
| `GET /returnrequest/{id}` | Exists | return service (Command Retrieve) |
| `PATCH /returnrequest/{id}/{eventID}` | Exists | return service (STM) |
| `GET /seller/returns/export` | New | seller service |

**MyBatis mappers needed:**
- `SellerReturn.allReturns` — in `return-query/mapper/seller-return.xml`
- `SellerReturn.allReturns-count` — count query
- `SellerReturn.pendingReturns` — canned report

---

## Allowed Actions -> UI Mapping

The backend returns `allowedActions` per row based on the entity's current state (STM).
The frontend reads these and renders only the allowed buttons.

**STM Source:** `returnrequest-states.xml` (return-request-flow)
**Seller ACL filter:** Sellers see return requests for their products. Most transitions require `SUPPORT`/`ADMIN`/`WAREHOUSE` ACL. Sellers typically have read-only access with limited actions.

### State -> Allowed Actions -> UI Buttons

| State | allowedActions (seller-visible) | UI Button | Icon | Color | Event ID |
|-------|-------------------------------|-----------|------|-------|----------|
| REQUESTED | -- | (read-only, pending support review) | -- | -- | -- |
| UNDER_REVIEW | -- | (read-only, support reviewing) | -- | -- | -- |
| ESCALATED | -- | (read-only) | -- | -- | -- |
| APPROVED | -- | (read-only, awaiting item receipt) | -- | -- | -- |
| PARTIALLY_APPROVED | -- | (read-only) | -- | -- | -- |
| ITEM_RECEIVED | -- | (read-only, awaiting inspection) | -- | -- | -- |
| INSPECTED | -- | (read-only, refund pending) | -- | -- | -- |
| REFUND_INITIATED | -- | (read-only) | -- | -- | -- |
| COMPLETED | -- | (read-only, terminal) | -- | -- | -- |
| REJECTED | -- | (read-only, terminal) | -- | -- | -- |

> **Note:** Sellers see return request status for their products but cannot directly approve/reject. The support team handles return decisions. Sellers can view and track returns.

### Frontend Pattern

```typescript
// Seller returns are read-only -- no action buttons needed.
// The status badge and timeline provide full visibility.
// If future seller actions are added (e.g., sellerAcknowledge),
// add them to this config:
const SELLER_RETURN_ACTION_CONFIG: Record<string, ActionButtonConfig> = {
  // Currently empty -- seller view is read-only
};
```
