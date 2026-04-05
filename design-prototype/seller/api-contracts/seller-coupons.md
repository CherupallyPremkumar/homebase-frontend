# Seller Coupons — API Contract

## Page: seller-coupons.html

**Note:** All table/list endpoints use Chenile's `SearchRequest/SearchResponse` pattern via POST. CRUD operations use standard REST. State transitions (activate/deactivate) use PATCH STM events.

---

## Section 1: Coupon Stats Cards (4 cards)

**Description:** Active coupons, total redemptions, revenue impact, avg discount
**API:** `GET /api/seller/coupons/stats`
**Fetch/XHR name:** `stats`

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "activeCoupons": 8,
    "totalCoupons": 24,
    "totalRedemptions": 1456,
    "revenueImpact": {
      "totalDiscount": 89500,
      "ordersWithCoupon": 1456,
      "avgOrderValueWithCoupon": 2850,
      "avgOrderValueWithout": 2100,
      "currency": "INR"
    },
    "avgDiscountPercent": 12.5
  }
}
```

**Note:** Custom aggregation endpoint, NOT a Chenile query.

---

## Section 2: Coupons Table (search, filter, paginate — Chenile Query)

**Description:** Paginated coupons list with status filter tabs, search, sort
**API:** `POST /api/query/seller-coupons`
**Fetch/XHR name:** `seller-coupons`

**Request (SearchRequest):**
```json
{
  "queryName": "SellerCoupon.allCoupons",
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
          "id": "coupon-001",
          "code": "SUMMER25",
          "description": "25% off on all electronics",
          "discountType": "PERCENTAGE",
          "discountValue": 25,
          "minOrderValue": 1000,
          "maxDiscount": 500,
          "usageLimit": 100,
          "usedCount": 67,
          "startDate": "2026-03-01",
          "endDate": "2026-03-31",
          "stateId": "ACTIVE",
          "applicableCategories": ["Electronics", "Accessories"],
          "applicableProducts": [],
          "createdTime": "2026-02-28T10:00:00Z"
        },
        "allowedActions": [
          { "allowedAction": "deactivate", "mainPath": "/coupons/coupon-001/deactivate" },
          { "allowedAction": "edit", "mainPath": "/coupons/coupon-001" },
          { "allowedAction": "viewStats", "mainPath": "/coupons/coupon-001/stats" }
        ]
      },
      {
        "row": {
          "id": "coupon-002",
          "code": "FLAT200",
          "description": "Flat Rs.200 off on orders above Rs.1500",
          "discountType": "FLAT",
          "discountValue": 200,
          "minOrderValue": 1500,
          "maxDiscount": 200,
          "usageLimit": 500,
          "usedCount": 234,
          "startDate": "2026-03-10",
          "endDate": "2026-04-10",
          "stateId": "ACTIVE",
          "applicableCategories": [],
          "applicableProducts": [],
          "createdTime": "2026-03-09T15:30:00Z"
        },
        "allowedActions": [
          { "allowedAction": "deactivate", "mainPath": "/coupons/coupon-002/deactivate" },
          { "allowedAction": "edit", "mainPath": "/coupons/coupon-002" }
        ]
      }
    ],
    "currentPage": 1,
    "maxPages": 3,
    "maxRows": 24,
    "numRowsInPage": 10,
    "numRowsReturned": 10,
    "startRow": 1,
    "endRow": 10,
    "columnMetadata": {
      "code": { "name": "Coupon Code", "columnType": "Text", "filterable": true, "sortable": true, "display": true },
      "description": { "name": "Description", "columnType": "Text", "filterable": true, "sortable": false, "display": true },
      "discountType": { "name": "Type", "columnType": "Text", "filterable": true, "sortable": true, "display": true },
      "discountValue": { "name": "Discount", "columnType": "Number", "filterable": true, "sortable": true, "display": true },
      "usedCount": { "name": "Used", "columnType": "Number", "filterable": false, "sortable": true, "display": true },
      "usageLimit": { "name": "Limit", "columnType": "Number", "filterable": false, "sortable": true, "display": true },
      "endDate": { "name": "Expires", "columnType": "Date", "filterable": true, "sortable": true, "display": true },
      "stateId": { "name": "Status", "columnType": "Text", "filterable": true, "sortable": true, "display": true }
    },
    "hiddenColumns": ["id", "minOrderValue", "maxDiscount", "startDate", "applicableCategories", "applicableProducts"],
    "availableCannedReports": [
      { "name": "allCoupons", "description": "All coupons" },
      { "name": "activeCoupons", "description": "Active coupons only" },
      { "name": "expiredCoupons", "description": "Expired coupons" }
    ]
  }
}
```

**Note:** Uses Chenile SearchRequest format. The `queryName` maps to MyBatis mapper ID `SellerCoupon.allCoupons`. Backend applies `CustomerFilterInterceptor` to filter by logged-in seller's ID.

---

## Section 3: Create Coupon

**Description:** Form to create a new coupon
**API:** `POST /api/seller/coupons`
**Fetch/XHR name:** `create-coupon`

**Request:**
```json
{
  "code": "MONSOON30",
  "description": "30% off on monsoon collection",
  "discountType": "PERCENTAGE",
  "discountValue": 30,
  "minOrderValue": 800,
  "maxDiscount": 600,
  "usageLimit": 200,
  "startDate": "2026-04-01",
  "endDate": "2026-04-30",
  "applicableCategories": ["Fashion"],
  "applicableProducts": []
}
```

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 201,
  "payload": {
    "id": "coupon-025",
    "code": "MONSOON30",
    "stateId": "DRAFT",
    "createdTime": "2026-03-28T14:00:00Z"
  }
}
```

**Validation rules:**
- `code` — required, 4-20 chars, uppercase alphanumeric + underscore, unique per seller
- `discountType` — required, one of `PERCENTAGE`, `FLAT`
- `discountValue` — required, > 0. If PERCENTAGE, max 80
- `minOrderValue` — optional, >= 0
- `maxDiscount` — required when discountType=PERCENTAGE
- `usageLimit` — required, >= 1
- `startDate` — required, >= today
- `endDate` — required, > startDate

---

## Section 4: Edit Coupon

**Description:** Update an existing coupon (only DRAFT or ACTIVE coupons can be edited)
**API:** `PUT /api/seller/coupons/{couponId}`
**Fetch/XHR name:** `update-coupon`

**Request:** Same fields as create (partial update allowed)

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "id": "coupon-001",
    "code": "SUMMER25",
    "stateId": "ACTIVE",
    "updatedTime": "2026-03-28T15:00:00Z"
  }
}
```

---

## Section 5: Activate Coupon (STM State Transition)

**Description:** Activate a DRAFT coupon
**API:** `PATCH /api/seller/coupons/{couponId}`
**Fetch/XHR name:** `activate-coupon`

**Request (STM Event):**
```json
{
  "stateId": "DRAFT",
  "event": "activate"
}
```

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "id": "coupon-025",
    "stateId": "ACTIVE",
    "updatedTime": "2026-03-28T14:05:00Z"
  }
}
```

**STM States:** `DRAFT` -> `ACTIVE` -> `INACTIVE` (can reactivate: `INACTIVE` -> `ACTIVE`)
**STM Events:** `activate`, `deactivate`, `reactivate`, `expire` (system), `delete`

---

## Section 6: Deactivate Coupon (STM State Transition)

**Description:** Deactivate an ACTIVE coupon
**API:** `PATCH /api/seller/coupons/{couponId}`
**Fetch/XHR name:** `deactivate-coupon`

**Request (STM Event):**
```json
{
  "stateId": "ACTIVE",
  "event": "deactivate"
}
```

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "id": "coupon-001",
    "stateId": "INACTIVE",
    "updatedTime": "2026-03-28T16:00:00Z"
  }
}
```

---

## Section 7: Coupon Redemption Stats

**Description:** Detailed redemption analytics for a specific coupon
**API:** `GET /api/seller/coupons/{couponId}/stats`
**Fetch/XHR name:** `coupon-stats`

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "couponId": "coupon-001",
    "code": "SUMMER25",
    "totalRedemptions": 67,
    "uniqueCustomers": 58,
    "totalDiscountGiven": 28500,
    "revenueGenerated": 185600,
    "avgOrderValue": 2770,
    "redemptionsByDay": [
      { "date": "2026-03-27", "count": 5, "discount": 2100 },
      { "date": "2026-03-26", "count": 8, "discount": 3400 }
    ],
    "topProducts": [
      { "name": "Wireless Bluetooth Speaker", "redemptions": 15 },
      { "name": "USB-C Hub", "redemptions": 12 }
    ],
    "currency": "INR"
  }
}
```

---

## Section 8: Delete Coupon (STM State Transition)

**Description:** Delete a DRAFT or INACTIVE coupon
**API:** `PATCH /api/seller/coupons/{couponId}`
**Fetch/XHR name:** `delete-coupon`

**Request (STM Event):**
```json
{
  "stateId": "INACTIVE",
  "event": "delete"
}
```

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "id": "coupon-001",
    "stateId": "DELETED"
  }
}
```

---

## Summary

| # | Section | API Endpoint | Method | Fetch/XHR Name | Type | Cache |
|---|---------|-------------|--------|----------------|------|-------|
| 1 | Coupon Stats | `/api/seller/coupons/stats` | GET | `stats` | REST | 30s |
| 2 | Coupons Table | `/api/query/seller-coupons` | POST | `seller-coupons` | Chenile Query | 30s |
| 3 | Create Coupon | `/api/seller/coupons` | POST | `create-coupon` | REST | — |
| 4 | Edit Coupon | `/api/seller/coupons/{id}` | PUT | `update-coupon` | REST | — |
| 5 | Activate | `/api/seller/coupons/{id}` | PATCH | `activate-coupon` | STM | — |
| 6 | Deactivate | `/api/seller/coupons/{id}` | PATCH | `deactivate-coupon` | STM | — |
| 7 | Redemption Stats | `/api/seller/coupons/{id}/stats` | GET | `coupon-stats` | REST | 60s |
| 8 | Delete | `/api/seller/coupons/{id}` | PATCH | `delete-coupon` | STM | — |

**Total API calls on page load: 2 (stats + table, parallel)**

---

## STM State Diagram

```
            activate
  DRAFT ──────────────> ACTIVE
    |                    |   ^
    | delete             |   | reactivate
    v           deactivate   |
  DELETED <──── INACTIVE ────┘
                   |
                   | delete
                   v
                DELETED

System event: ACTIVE -> EXPIRED (when endDate passes)
```

---

## Request Flow

```
Browser -> Next.js /api/proxy/[...path] -> injects JWT -> Backend

For Chenile queries:
  POST /api/proxy/query/seller-coupons
    -> Next.js adds Authorization header
    -> Backend query controller receives SearchRequest
    -> CustomerFilterInterceptor adds seller ID filter
    -> MyBatis executes SellerCoupon.allCoupons query
    -> STM enriches with allowedActions
    -> Returns GenericResponse<SearchResponse>

For STM transitions:
  PATCH /api/proxy/seller/coupons/coupon-001
    -> Next.js adds Authorization header
    -> Backend receives { stateId, event }
    -> STM validates current state + event
    -> Executes transition handler
    -> Returns GenericResponse with new stateId
```

---

## Frontend Integration

```typescript
// Server component — page load
import { getApiClient } from '@homebase/api-client';

export default async function SellerCoupons() {
  const api = getApiClient();

  const [stats, coupons] = await Promise.allSettled([
    api.get('/seller/coupons/stats'),
    api.post('/query/seller-coupons', {
      queryName: 'SellerCoupon.allCoupons',
      pageNum: 1,
      numRowsInPage: 10,
      sortCriteria: [{ name: 'createdTime', ascendingOrder: false }],
      filters: { status: 'ALL' },
    }),
  ]);

  return (
    <>
      <CouponStatsCards data={unwrap(stats)} />
      <CouponsTable data={unwrap(coupons)} />
    </>
  );
}

// Client component — actions
async function createCoupon(formData: CouponFormData) {
  return api.post('/seller/coupons', formData);
}

async function activateCoupon(couponId: string) {
  return api.patch(`/seller/coupons/${couponId}`, {
    stateId: 'DRAFT',
    event: 'activate',
  });
}

async function deactivateCoupon(couponId: string) {
  return api.patch(`/seller/coupons/${couponId}`, {
    stateId: 'ACTIVE',
    event: 'deactivate',
  });
}
```

---

## Backend Endpoints

| Endpoint | Exists? | Backend Module |
|----------|---------|---------------|
| `GET /seller/coupons/stats` | New | coupon service (aggregation) |
| `POST /query/seller-coupons` | New | coupon-query module (MyBatis) |
| `POST /seller/coupons` | New | coupon service (create) |
| `PUT /seller/coupons/{id}` | New | coupon service (update) |
| `PATCH /seller/coupons/{id}` | New | coupon service (STM transitions) |
| `GET /seller/coupons/{id}/stats` | New | coupon-analytics service |

**MyBatis mappers needed:**
- `SellerCoupon.allCoupons` — in `coupon-query/mapper/seller-coupon.xml`
- `SellerCoupon.allCoupons-count` — count query
- `SellerCoupon.activeCoupons` — canned report
- `SellerCoupon.expiredCoupons` — canned report

**JSON definitions needed:**
- `seller-coupon.json` — query metadata for SellerCoupon queries

**STM definition needed:**
- `coupon-stm.json` — state machine: DRAFT, ACTIVE, INACTIVE, EXPIRED, DELETED
