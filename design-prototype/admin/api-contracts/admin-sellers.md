# Admin Sellers — API Contract

## Page: admin-sellers.html

**Note:** Sellers table uses Chenile's `SearchRequest/SearchResponse` pattern via POST. Retrieve uses GET with `StateEntityServiceResponse`. Moderation actions use PATCH STM events. Stats use REST GET.

---

## Section 1: Page Header

**Data needed:** None
**API:** No API call needed — static content with Export and Add New Seller buttons

---

## Section 2: Stats Cards (5 cards)

**API:** `GET /api/admin/sellers/stats`

**Response:**
```json
{
  "totalSellers": {
    "value": 284,
    "trend": 12.4,
    "trendDirection": "up"
  },
  "active": {
    "value": 234,
    "percentOfTotal": 82.4
  },
  "pendingApproval": {
    "value": 18,
    "needsAttention": true
  },
  "suspended": {
    "value": 12,
    "trend": -2,
    "trendDirection": "down"
  },
  "inactive": {
    "value": 20,
    "trend": 0,
    "trendDirection": "flat"
  }
}
```

---

## Section 3: Sellers Table (paginated, filterable)

**API:** `POST /api/query/admin-sellers`
**Fetch/XHR name:** `admin-sellers`

**Request (SearchRequest):**
```json
{
  "queryName": "AdminSeller.allSellers",
  "pageNum": 1,
  "numRowsInPage": 8,
  "sortCriteria": [{ "name": "createdTime", "ascendingOrder": false }],
  "filters": { "stateId": "", "search": "" }
}
```

**Response:**
```json
{
  "list": [
    {
      "row": {
        "id": "seller-001",
        "storeName": "Rajesh Store",
        "ownerName": "Rajesh Kumar",
        "email": "rajesh@store.com",
        "phone": "+91-9876543210",
        "products": 342,
        "orders": 1245,
        "revenue": 3820000,
        "rating": 4.8,
        "totalReviews": 892,
        "stateId": "ACTIVE",
        "tier": "Premium",
        "joinedDate": "2025-06-15T00:00:00Z",
        "lastActive": "2026-03-28T09:30:00Z"
      }
    }
  ],
  "totalCount": 284,
  "numRowsInPage": 8
}
```

**Note:** Uses Chenile SearchRequest format. Response follows `GenericResponse<Seller>` wrapper.

---

## Section 4: Seller Actions (Admin management)

### Approve Seller (STM Event)
**API:** `PATCH /api/seller/{id}/approve`
**Fetch/XHR name:** `seller/{id}/approve`

**Request:**
```json
{
  "reason": "All documents verified",
  "tier": "Standard"
}
```

**Response:**
```json
{
  "id": "seller-020",
  "stateId": "ACTIVE",
  "tier": "Standard",
  "updatedTime": "2026-03-28T10:30:00Z",
  "approvedBy": "admin-001"
}
```

### Suspend Seller (STM Event)
**API:** `PATCH /api/seller/{id}/suspend`
**Fetch/XHR name:** `seller/{id}/suspend`

**Request:**
```json
{
  "reason": "Multiple customer complaints about product quality",
  "duration": "INDEFINITE",
  "notifySeller": true
}
```

**Response:**
```json
{
  "id": "seller-005",
  "stateId": "SUSPENDED",
  "suspendedUntil": null,
  "updatedTime": "2026-03-28T10:35:00Z",
  "suspendedBy": "admin-001"
}
```

### Reactivate Seller (STM Event)
**API:** `PATCH /api/seller/{id}/reactivate`
**Fetch/XHR name:** `seller/{id}/reactivate`

**Request:**
```json
{
  "reason": "Issues resolved, seller compliant"
}
```

**Response:**
```json
{
  "id": "seller-005",
  "stateId": "ACTIVE",
  "updatedTime": "2026-03-28T10:40:00Z",
  "reactivatedBy": "admin-001"
}
```

### Reject Seller Application (STM Event)
**API:** `PATCH /api/seller/{id}/reject`
**Fetch/XHR name:** `seller/{id}/reject`

**Request:**
```json
{
  "reason": "Incomplete business documentation",
  "notifySeller": true
}
```

**Response:**
```json
{
  "id": "seller-022",
  "stateId": "REJECTED",
  "updatedTime": "2026-03-28T10:45:00Z",
  "rejectedBy": "admin-001"
}
```

### View Seller Detail (Command Retrieve)
**API:** `GET /api/seller/{id}`
**Fetch/XHR name:** `seller/{id}`

**Response:**
```json
{
  "id": "seller-001",
  "storeName": "Rajesh Store",
  "ownerName": "Rajesh Kumar",
  "email": "rajesh@store.com",
  "phone": "+91-9876543210",
  "gstin": "27AAACR5055K1Z5",
  "panNumber": "AAACR5055K",
  "bankVerified": true,
  "products": 342,
  "orders": 1245,
  "revenue": 3820000,
  "rating": 4.8,
  "tier": "Premium",
  "stateId": "ACTIVE",
  "joinedDate": "2025-06-15T00:00:00Z",
  "documents": {
    "gst": "VERIFIED",
    "pan": "VERIFIED",
    "bank": "VERIFIED",
    "address": "VERIFIED"
  }
}
```

---

## Summary

| # | Section | API Endpoint | Method | Cache |
|---|---------|-------------|--------|-------|
| 1 | Page Header | None (static) | — | — |
| 2 | Stats Cards | `/api/admin/sellers/stats` | GET | 30s |
| 3 | Sellers Table | `/api/query/admin-sellers` | POST (Chenile Query) | 30s |
| 4a | Approve Seller | `/api/seller/{id}/approve` | PATCH (STM Event) | — |
| 4b | Suspend Seller | `/api/seller/{id}/suspend` | PATCH (STM Event) | — |
| 4c | Reactivate Seller | `/api/seller/{id}/reactivate` | PATCH (STM Event) | — |
| 4d | Reject Seller | `/api/seller/{id}/reject` | PATCH (STM Event) | — |
| 5 | Seller Detail | `/api/seller/{id}` | GET (Command Retrieve) | 30s |

**Total API calls on page load: 2 (parallel)**
**Total admin action endpoints: 4**

---

## Frontend Integration Pattern

```typescript
export default async function AdminSellers() {
  const [stats, sellers] = await Promise.allSettled([
    adminApi.sellerStats(),
    adminApi.sellers({ pageSize: 8, sortBy: 'createdTime', sortOrder: 'desc' }),
  ]);

  return (
    <>
      <PageHeader />
      <StatsCards data={stats} />
      <FiltersBar />
      <SellersTable data={sellers} />
    </>
  );
}
```

---

## New Endpoints Needed

1. `GET /api/admin/sellers/stats` — seller onboarding and status stats
2. `POST /api/query/admin-sellers` — paginated seller listing (Chenile query)
3. `GET /api/seller/{id}` — single seller detail (Command Retrieve)
4. `PATCH /api/seller/{id}/approve` — approve pending seller (STM event)
5. `PATCH /api/seller/{id}/suspend` — suspend seller (STM event)
6. `PATCH /api/seller/{id}/reactivate` — reactivate suspended seller (STM event)
7. `PATCH /api/seller/{id}/reject` — reject seller application (STM event)

---

## Allowed Actions -> UI Mapping

The backend returns `allowedActions` per row based on the entity's current state (STM).
The frontend reads these and renders only the allowed buttons.

**STM Source:** `supplier-states.xml` (supplier-flow)
**Admin ACL filter:** Events with `ADMIN` in `meta-acls`.

### State -> Allowed Actions -> UI Buttons

| State | allowedActions (admin-visible) | UI Button | Icon | Color | Event ID |
|-------|------------------------------|-----------|------|-------|----------|
| APPLIED | reviewSupplier | Review Application | ClipboardCheck | blue | reviewSupplier |
| UNDER_REVIEW | approveSupplier | Approve | CheckCircle | green | approveSupplier |
| UNDER_REVIEW | rejectSupplier | Reject | XCircle | red | rejectSupplier |
| APPROVED | activateSupplier | Activate | Power | green | activateSupplier |
| REJECTED | -- | (read-only, seller can resubmit) | -- | -- | -- |
| ACTIVE | suspendSupplier | Suspend | PauseCircle | red | suspendSupplier |
| ACTIVE | putOnProbation | Put on Probation | AlertTriangle | amber | putOnProbation |
| ACTIVE | terminateSupplier | Terminate | UserX | red | terminateSupplier |
| ON_PROBATION | resolveFromProbation | Resolve Probation | CheckCircle | green | resolveFromProbation |
| ON_PROBATION | suspendSupplier | Suspend | PauseCircle | red | suspendSupplier |
| ON_PROBATION | terminateSupplier | Terminate | UserX | red | terminateSupplier |
| SUSPENDED | reactivateSupplier | Reactivate | PlayCircle | green | reactivateSupplier |
| SUSPENDED | terminateSupplier | Terminate | UserX | red | terminateSupplier |
| TERMINATED | -- | (read-only, terminal) | -- | -- | -- |

### Frontend Pattern

```typescript
const ADMIN_SELLER_ACTION_CONFIG: Record<string, ActionButtonConfig> = {
  reviewSupplier: { label: 'Review Application', icon: 'ClipboardCheck', color: 'blue' },
  approveSupplier: { label: 'Approve', icon: 'CheckCircle', color: 'green' },
  rejectSupplier: { label: 'Reject', icon: 'XCircle', color: 'red' },
  activateSupplier: { label: 'Activate', icon: 'Power', color: 'green' },
  suspendSupplier: { label: 'Suspend', icon: 'PauseCircle', color: 'red' },
  putOnProbation: { label: 'Put on Probation', icon: 'AlertTriangle', color: 'amber' },
  terminateSupplier: { label: 'Terminate', icon: 'UserX', color: 'red' },
  reactivateSupplier: { label: 'Reactivate', icon: 'PlayCircle', color: 'green' },
  resolveFromProbation: { label: 'Resolve Probation', icon: 'CheckCircle', color: 'green' },
};

// Render only allowed actions
{allowedActions.map(a => {
  const config = ADMIN_SELLER_ACTION_CONFIG[a.allowedAction];
  return config ? <ActionButton {...config} onClick={() => triggerEvent(id, a.allowedAction)} /> : null;
})}
```
