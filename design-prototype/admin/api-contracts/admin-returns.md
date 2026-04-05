# Admin Returns — API Contract

## Page: admin-returns.html

**Note:** Returns table uses Chenile's `SearchRequest/SearchResponse` pattern via POST. Moderation actions (approve/reject/refund) use PATCH STM events. Stats use REST GET.

---

## Section 1: Page Header

**Data needed:** None
**API:** No API call needed — static content with Export button

---

## Section 2: Stats Cards (5 cards)

**API:** `GET /api/admin/returns/stats`

**Response:**
```json
{
  "totalReturns": {
    "value": 847,
    "trend": 5.2,
    "trendDirection": "up"
  },
  "pendingApproval": {
    "value": 47,
    "needsAttention": true
  },
  "pickupScheduled": {
    "value": 23,
    "trend": -2.1,
    "trendDirection": "down"
  },
  "refundProcessing": {
    "value": 18,
    "trend": 1.4,
    "trendDirection": "up"
  },
  "completed": {
    "value": 759,
    "trend": 8.6,
    "trendDirection": "up"
  }
}
```

---

## Section 3: Returns Table (paginated, filterable)

**API:** `POST /api/query/admin-returns`
**Fetch/XHR name:** `admin-returns`

**Request (SearchRequest):**
```json
{
  "queryName": "AdminReturn.allReturns",
  "pageNum": 1,
  "numRowsInPage": 8,
  "sortCriteria": [{ "name": "createdTime", "ascendingOrder": false }],
  "filters": { "stateId": "", "search": "", "dateFrom": "", "dateTo": "", "sellerId": "" }
}
```

**Response:**
```json
{
  "list": [
    {
      "row": {
        "id": "ret-001",
        "returnNumber": "RTN-4521",
        "orderNumber": "#HB-10198",
        "orderId": "order-198",
        "customerName": "Sanjay Patel",
        "customerId": "cust-042",
        "sellerName": "Rajesh Store",
        "sellerId": "seller-001",
        "productName": "Ceramic Table Lamp",
        "reason": "Product damaged on arrival",
        "refundAmount": 2499,
        "currency": "INR",
        "stateId": "PENDING",
        "createdTime": "2026-03-27T14:20:00Z"
      }
    }
  ],
  "totalCount": 847,
  "numRowsInPage": 8
}
```

**Note:** Uses Chenile SearchRequest format. Response follows `GenericResponse<Return>` wrapper.

---

## Section 4: Return Actions (Admin moderation)

### Approve Return (STM Event)
**API:** `PATCH /api/returnrequest/{id}/approve`
**Fetch/XHR name:** `returnrequest/{id}/approve`

**Request:**
```json
{
  "reason": "Return request is valid, product damaged",
  "schedulePickup": true,
  "pickupDate": "2026-03-30"
}
```

**Response:**
```json
{
  "id": "ret-001",
  "stateId": "APPROVED",
  "updatedTime": "2026-03-28T10:30:00Z",
  "approvedBy": "admin-001"
}
```

### Reject Return (STM Event)
**API:** `PATCH /api/returnrequest/{id}/reject`
**Fetch/XHR name:** `returnrequest/{id}/reject`

**Request:**
```json
{
  "reason": "Return window has expired",
  "notifyCustomer": true
}
```

**Response:**
```json
{
  "id": "ret-005",
  "stateId": "REJECTED",
  "updatedTime": "2026-03-28T10:35:00Z",
  "rejectedBy": "admin-001"
}
```

### Process Refund (STM Event)
**API:** `PATCH /api/returnrequest/{id}/processRefund`
**Fetch/XHR name:** `returnrequest/{id}/processRefund`

**Request:**
```json
{
  "refundAmount": 2499,
  "refundMethod": "ORIGINAL_PAYMENT",
  "notes": "Full refund processed"
}
```

**Response:**
```json
{
  "id": "ret-001",
  "stateId": "REFUND_PROCESSING",
  "refundId": "rfnd-001",
  "estimatedDate": "2026-03-31",
  "updatedTime": "2026-03-28T10:40:00Z"
}
```

---

## Summary

| # | Section | API Endpoint | Method | Cache |
|---|---------|-------------|--------|-------|
| 1 | Page Header | None (static) | — | — |
| 2 | Stats Cards | `/api/admin/returns/stats` | GET | 30s |
| 3 | Returns Table | `/api/query/admin-returns` | POST (Chenile Query) | 30s |
| 4a | Approve Return | `/api/returnrequest/{id}/approve` | PATCH (STM Event) | — |
| 4b | Reject Return | `/api/returnrequest/{id}/reject` | PATCH (STM Event) | — |
| 4c | Process Refund | `/api/returnrequest/{id}/processRefund` | PATCH (STM Event) | — |

**Total API calls on page load: 2 (parallel)**
**Total admin action endpoints: 3**

---

## Frontend Integration Pattern

```typescript
export default async function AdminReturns() {
  const [stats, returns] = await Promise.allSettled([
    adminApi.returnStats(),
    adminApi.returns({ pageSize: 8, sortBy: 'createdTime', sortOrder: 'desc' }),
  ]);

  return (
    <>
      <PageHeader />
      <StatsCards data={stats} />
      <FiltersBar />
      <ReturnsTable data={returns} />
    </>
  );
}
```

---

## New Endpoints Needed

1. `GET /api/admin/returns/stats` — return status breakdown stats
2. `POST /api/query/admin-returns` — paginated return listing (Chenile query)
3. `PATCH /api/returnrequest/{id}/approve` — approve return request (STM event)
4. `PATCH /api/returnrequest/{id}/reject` — reject return request (STM event)
5. `PATCH /api/returnrequest/{id}/processRefund` — process refund (STM event)

---

## Allowed Actions -> UI Mapping

The backend returns `allowedActions` per row based on the entity's current state (STM).
The frontend reads these and renders only the allowed buttons.

**STM Source:** `returnrequest-states.xml` (return-request-flow)
**Admin ACL filter:** Events with `ADMIN` or `SUPPORT` in `meta-acls`. Admins have full return management access.

### State -> Allowed Actions -> UI Buttons

| State | allowedActions (admin-visible) | UI Button | Icon | Color | Event ID |
|-------|------------------------------|-----------|------|-------|----------|
| REQUESTED | reviewReturn | Review Return | ClipboardCheck | blue | reviewReturn |
| UNDER_REVIEW | approveReturn | Approve | CheckCircle | green | approveReturn |
| UNDER_REVIEW | rejectReturn | Reject | XCircle | red | rejectReturn |
| UNDER_REVIEW | partialApprove | Partial Approve | CheckSquare | amber | partialApprove |
| UNDER_REVIEW | escalate | Escalate | ArrowUpCircle | red | escalate |
| ESCALATED | approveReturn | Approve | CheckCircle | green | approveReturn |
| ESCALATED | rejectReturn | Reject | XCircle | red | rejectReturn |
| APPROVED | -- | (read-only, awaiting warehouse) | -- | -- | -- |
| PARTIALLY_APPROVED | -- | (read-only, awaiting warehouse) | -- | -- | -- |
| ITEM_RECEIVED | -- | (read-only, warehouse inspecting) | -- | -- | -- |
| INSPECTED | initiateRefund | Initiate Refund | CreditCard | green | initiateRefund |
| REFUND_INITIATED | -- | (read-only, system processing) | -- | -- | -- |
| COMPLETED | -- | (read-only, terminal) | -- | -- | -- |
| REJECTED | -- | (read-only, terminal) | -- | -- | -- |

### Frontend Pattern

```typescript
const ADMIN_RETURN_ACTION_CONFIG: Record<string, ActionButtonConfig> = {
  reviewReturn: { label: 'Review Return', icon: 'ClipboardCheck', color: 'blue' },
  approveReturn: { label: 'Approve', icon: 'CheckCircle', color: 'green' },
  rejectReturn: { label: 'Reject', icon: 'XCircle', color: 'red' },
  partialApprove: { label: 'Partial Approve', icon: 'CheckSquare', color: 'amber' },
  escalate: { label: 'Escalate', icon: 'ArrowUpCircle', color: 'red' },
  initiateRefund: { label: 'Initiate Refund', icon: 'CreditCard', color: 'green' },
};

// Render only allowed actions
{allowedActions.map(a => {
  const config = ADMIN_RETURN_ACTION_CONFIG[a.allowedAction];
  return config ? <ActionButton {...config} onClick={() => triggerEvent(id, a.allowedAction)} /> : null;
})}
```
