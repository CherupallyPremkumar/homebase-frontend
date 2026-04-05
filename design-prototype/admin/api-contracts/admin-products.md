# Admin Products — API Contract

## Page: admin-products.html

**Note:** Products table uses Chenile's `SearchRequest/SearchResponse` pattern via POST. Moderation actions (approve/flag/remove/reject) use PATCH STM events. Stats use REST GET.

---

## Section 1: Page Header

**Data needed:** None
**API:** No API call needed — static content with Export button

---

## Section 2: Stats Cards (4 cards)

**API:** `GET /api/admin/products/stats`

**Response:**
```json
{
  "totalProducts": {
    "value": 8920,
    "weeklyChange": 124
  },
  "pendingReview": {
    "value": 45,
    "needsAttention": true
  },
  "flagged": {
    "value": 12,
    "dailyChange": 3
  },
  "removed": {
    "value": 8,
    "weeklyChange": 0
  }
}
```

---

## Section 3: Products Table (paginated, filterable)

**API:** `POST /api/query/admin-products`
**Fetch/XHR name:** `admin-products`

**Request (SearchRequest):**
```json
{
  "queryName": "AdminProduct.allProducts",
  "pageNum": 1,
  "numRowsInPage": 8,
  "sortCriteria": [{ "name": "createdTime", "ascendingOrder": false }],
  "filters": { "status": "", "search": "" }
}
```

**Response:**
```json
{
  "list": [
    {
      "row": {
        "id": "prod-001",
        "name": "Modern Velvet Sofa",
        "sku": "HB-FUR-00142",
        "sellerName": "LuxeLiving Co.",
        "sellerId": "seller-010",
        "category": "Furniture",
        "price": 129900,
        "currency": "INR",
        "stateId": "ACTIVE",
        "createdTime": "2026-03-15T00:00:00Z",
        "image": "/images/products/sofa.jpg"
      }
    },
    {
      "row": {
        "id": "prod-002",
        "name": "Cordless Power Drill Set",
        "sku": "HB-TLS-00587",
        "sellerName": "ToolMaster Pro",
        "sellerId": "seller-015",
        "category": "Tools",
        "price": 18999,
        "currency": "INR",
        "stateId": "PENDING",
        "createdTime": "2026-03-27T00:00:00Z",
        "image": "/images/products/drill.jpg"
      }
    }
  ],
  "totalCount": 8920,
  "numRowsInPage": 8
}
```

**Note:** Uses Chenile SearchRequest format. Response follows `GenericResponse<Product>` wrapper.

---

## Section 4: Product Actions (Admin moderation)

### Approve Product (STM Event)
**API:** `PATCH /api/product/{id}/approve`
**Fetch/XHR name:** `product/{id}/approve`

**Request:**
```json
{
  "reason": "Product meets listing guidelines"
}
```

**Response:**
```json
{
  "id": "prod-002",
  "stateId": "ACTIVE",
  "updatedTime": "2026-03-28T10:30:00Z",
  "approvedBy": "admin-001"
}
```

### Flag Product (STM Event)
**API:** `PATCH /api/product/{id}/flag`
**Fetch/XHR name:** `product/{id}/flag`

**Request:**
```json
{
  "reason": "Misleading product description",
  "flagType": "MISLEADING_DESCRIPTION"
}
```

**Response:**
```json
{
  "id": "prod-001",
  "stateId": "FLAGGED",
  "updatedTime": "2026-03-28T10:31:00Z",
  "flaggedBy": "admin-001"
}
```

### Remove Product (STM Event)
**API:** `PATCH /api/product/{id}/remove`
**Fetch/XHR name:** `product/{id}/remove`

**Request:**
```json
{
  "reason": "Violates marketplace policy",
  "notifySeller": true
}
```

**Response:**
```json
{
  "id": "prod-003",
  "stateId": "REMOVED",
  "updatedTime": "2026-03-28T10:32:00Z",
  "removedBy": "admin-001"
}
```

### Reject Product (STM Event)
**API:** `PATCH /api/product/{id}/reject`
**Fetch/XHR name:** `product/{id}/reject`

**Request:**
```json
{
  "reason": "Incomplete product information"
}
```

**Response:**
```json
{
  "id": "prod-002",
  "stateId": "REJECTED",
  "updatedTime": "2026-03-28T10:33:00Z",
  "rejectedBy": "admin-001"
}
```

---

## Summary

| # | Section | API Endpoint | Method | Cache |
|---|---------|-------------|--------|-------|
| 1 | Page Header | None (static) | — | — |
| 2 | Stats Cards | `/api/admin/products/stats` | GET | 30s |
| 3 | Products Table | `/api/query/admin-products` | POST (Chenile Query) | 30s |
| 4a | Approve Product | `/api/product/{id}/approve` | PATCH (STM Event) | — |
| 4b | Flag Product | `/api/product/{id}/flag` | PATCH (STM Event) | — |
| 4c | Remove Product | `/api/product/{id}/remove` | PATCH (STM Event) | — |
| 4d | Reject Product | `/api/product/{id}/reject` | PATCH (STM Event) | — |

**Total API calls on page load: 2 (parallel)**
**Total admin action endpoints: 4**

---

## Frontend Integration Pattern

```typescript
export default async function AdminProducts() {
  const [stats, products] = await Promise.allSettled([
    adminApi.productStats(),
    adminApi.products({ pageSize: 8, sortBy: 'createdTime', sortOrder: 'desc' }),
  ]);

  return (
    <>
      <PageHeader />
      <StatsCards data={stats} />
      <ProductsTable data={products} />
    </>
  );
}
```

---

## New Endpoints Needed

1. `GET /api/admin/products/stats` — product moderation stats
2. `POST /api/query/admin-products` — paginated product listing (Chenile query)
3. `PATCH /api/product/{id}/approve` — approve pending product (STM event)
4. `PATCH /api/product/{id}/flag` — flag product for review (STM event)
5. `PATCH /api/product/{id}/remove` — remove product from marketplace (STM event)
6. `PATCH /api/product/{id}/reject` — reject pending product (STM event)

---

## Allowed Actions -> UI Mapping

The backend returns `allowedActions` per row based on the entity's current state (STM).
The frontend reads these and renders only the allowed buttons.

**STM Source:** `product-states.xml` (product-flow)
**Admin ACL filter:** Events with `ADMIN` in `meta-acls`. Admins can approve, reject, disable, archive, recall, and discontinue products.

### State -> Allowed Actions -> UI Buttons

| State | allowedActions (admin-visible) | UI Button | Icon | Color | Event ID |
|-------|------------------------------|-----------|------|-------|----------|
| DRAFT | deleteProduct | Delete | Trash2 | red | deleteProduct |
| UNDER_REVIEW | approveProduct | Approve | CheckCircle | green | approveProduct |
| UNDER_REVIEW | rejectProduct | Reject | XCircle | red | rejectProduct |
| PUBLISHED | disableProduct | Disable | EyeOff | amber | disableProduct |
| PUBLISHED | archiveProduct | Archive | Archive | gray | archiveProduct |
| PUBLISHED | recallProduct | Recall | AlertOctagon | red | recallProduct |
| PUBLISHED | discontinueProduct | Discontinue | XCircle | red | discontinueProduct |
| PENDING_UPDATE | approveUpdate | Approve Update | CheckCircle | green | approveUpdate |
| PENDING_UPDATE | rejectUpdate | Reject Update | XCircle | red | rejectUpdate |
| DISABLED | enableProduct | Enable | Eye | green | enableProduct |
| DISABLED | archiveProduct | Archive | Archive | gray | archiveProduct |
| DISABLED | recallProduct | Recall | AlertOctagon | red | recallProduct |
| DISABLED | discontinueProduct | Discontinue | XCircle | red | discontinueProduct |
| ARCHIVED | unarchiveProduct | Unarchive | ArchiveRestore | blue | unarchiveProduct |
| ARCHIVED | recallProduct | Recall | AlertOctagon | red | recallProduct |
| ARCHIVED | discontinueProduct | Discontinue | XCircle | red | discontinueProduct |
| RECALLED | resolveRecall | Resolve Recall | CheckCircle | green | resolveRecall |
| DISCONTINUED | -- | (read-only, terminal) | -- | -- | -- |

### Frontend Pattern

```typescript
const ADMIN_PRODUCT_ACTION_CONFIG: Record<string, ActionButtonConfig> = {
  approveProduct: { label: 'Approve', icon: 'CheckCircle', color: 'green' },
  rejectProduct: { label: 'Reject', icon: 'XCircle', color: 'red' },
  disableProduct: { label: 'Disable', icon: 'EyeOff', color: 'amber' },
  enableProduct: { label: 'Enable', icon: 'Eye', color: 'green' },
  archiveProduct: { label: 'Archive', icon: 'Archive', color: 'gray' },
  unarchiveProduct: { label: 'Unarchive', icon: 'ArchiveRestore', color: 'blue' },
  recallProduct: { label: 'Recall', icon: 'AlertOctagon', color: 'red' },
  discontinueProduct: { label: 'Discontinue', icon: 'XCircle', color: 'red' },
  deleteProduct: { label: 'Delete', icon: 'Trash2', color: 'red' },
  approveUpdate: { label: 'Approve Update', icon: 'CheckCircle', color: 'green' },
  rejectUpdate: { label: 'Reject Update', icon: 'XCircle', color: 'red' },
  resolveRecall: { label: 'Resolve Recall', icon: 'CheckCircle', color: 'green' },
};

// Render only allowed actions
{allowedActions.map(a => {
  const config = ADMIN_PRODUCT_ACTION_CONFIG[a.allowedAction];
  return config ? <ActionButton {...config} onClick={() => triggerEvent(id, a.allowedAction)} /> : null;
})}
```
