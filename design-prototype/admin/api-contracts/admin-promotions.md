# Admin Promotions — API Contract

## Page: admin-promotions.html

**Note:** Campaign and coupon tables use Chenile's `SearchRequest/SearchResponse` pattern via POST. Campaign creation uses Command POST. State transitions (activate/pause) use PATCH STM events. Stats use REST GET.

---

## Section 1: Page Header

**Data needed:** None
**API:** No API call needed — static content with Export and Create Campaign buttons

---

## Section 2: Stats Cards (4 cards)

**API:** `GET /api/admin/promotions/stats`

**Response:**
```json
{
  "activeCampaigns": {
    "value": 8,
    "weeklyChange": 2
  },
  "totalCoupons": {
    "value": 45,
    "active": 12,
    "expired": 33
  },
  "revenueFromPromos": {
    "value": 1250000,
    "trend": 18.2,
    "trendDirection": "up",
    "currency": "INR"
  },
  "redemptionRate": {
    "value": 23,
    "trend": 3.1,
    "trendDirection": "up",
    "unit": "percent"
  }
}
```

---

## Section 3: Campaigns Table (paginated, filterable)

**API:** `POST /api/query/admin-promotions`
**Fetch/XHR name:** `admin-promotions`

**Request (SearchRequest):**
```json
{
  "queryName": "AdminPromotion.allCampaigns",
  "pageNum": 1,
  "numRowsInPage": 8,
  "sortCriteria": [{ "name": "startDate", "ascendingOrder": false }],
  "filters": { "stateId": "", "search": "", "type": "" }
}
```

**Response:**
```json
{
  "list": [
    {
      "row": {
        "id": "promo-001",
        "name": "Summer Mega Sale",
        "description": "All categories",
        "type": "FLASH_SALE",
        "discountType": "PERCENTAGE",
        "discountValue": 40,
        "startDate": "2026-03-01T00:00:00Z",
        "endDate": "2026-03-31T23:59:59Z",
        "usageCount": 1440,
        "usageLimit": 2000,
        "stateId": "ACTIVE",
        "createdTime": "2026-02-25T00:00:00Z"
      }
    },
    {
      "row": {
        "id": "promo-002",
        "name": "New User Welcome",
        "description": "First-time buyers",
        "type": "COUPON",
        "discountType": "FIXED",
        "discountValue": 200,
        "couponCode": "WELCOME200",
        "startDate": "2026-01-15T00:00:00Z",
        "endDate": "2026-12-31T23:59:59Z",
        "usageCount": 8750,
        "usageLimit": null,
        "stateId": "ACTIVE",
        "createdTime": "2026-01-10T00:00:00Z"
      }
    }
  ],
  "totalCount": 8,
  "numRowsInPage": 8
}
```

**Note:** Uses Chenile SearchRequest format. Response follows `GenericResponse<Promotion>` wrapper.

---

## Section 4: Active Coupons Section

**API:** `GET /api/admin/promotions/coupons?stateId=ACTIVE&pageSize=5`

**Response:**
```json
{
  "list": [
    {
      "id": "coupon-001",
      "code": "WELCOME200",
      "description": "Flat Rs 200 off on first order",
      "discountType": "FIXED",
      "discountValue": 200,
      "minOrderValue": 999,
      "maxDiscount": 200,
      "usageCount": 8750,
      "usageLimit": null,
      "startDate": "2026-01-15T00:00:00Z",
      "endDate": "2026-12-31T23:59:59Z",
      "stateId": "ACTIVE",
      "applicableCategories": ["ALL"]
    },
    {
      "id": "coupon-002",
      "code": "SUMMER40",
      "description": "40% off on summer collection",
      "discountType": "PERCENTAGE",
      "discountValue": 40,
      "minOrderValue": 1499,
      "maxDiscount": 5000,
      "usageCount": 1440,
      "usageLimit": 2000,
      "startDate": "2026-03-01T00:00:00Z",
      "endDate": "2026-03-31T23:59:59Z",
      "stateId": "ACTIVE",
      "applicableCategories": ["Furniture", "Home Decor", "Lighting"]
    }
  ],
  "totalCount": 12,
  "numRowsInPage": 5
}
```

---

## Section 5: Campaign/Coupon CRUD Actions

### Create Campaign
**API:** `POST /api/admin/promotions`

**Request:**
```json
{
  "name": "Independence Day Offer",
  "description": "Celebrate with discounts on all categories",
  "type": "FLASH_SALE",
  "discountType": "PERCENTAGE",
  "discountValue": 25,
  "startDate": "2026-08-13T00:00:00Z",
  "endDate": "2026-08-16T23:59:59Z",
  "usageLimit": 5000,
  "minOrderValue": 999,
  "maxDiscount": 3000,
  "applicableCategories": ["ALL"],
  "stateId": "DRAFT"
}
```

**Response:**
```json
{
  "id": "promo-009",
  "name": "Independence Day Offer",
  "stateId": "DRAFT",
  "createdTime": "2026-03-28T10:30:00Z",
  "createdBy": "admin-001"
}
```

### Update Campaign
**API:** `PUT /api/admin/promotions/{id}`

**Request:**
```json
{
  "discountValue": 30,
  "endDate": "2026-08-17T23:59:59Z",
  "usageLimit": 7000
}
```

**Response:**
```json
{
  "id": "promo-009",
  "stateId": "DRAFT",
  "updatedTime": "2026-03-28T10:35:00Z",
  "updatedBy": "admin-001"
}
```

### Activate Campaign (STM Event)
**API:** `PATCH /api/promotion/{id}/activate`
**Fetch/XHR name:** `promotion/{id}/activate`

**Response:**
```json
{
  "id": "promo-009",
  "stateId": "ACTIVE",
  "updatedTime": "2026-03-28T10:40:00Z"
}
```

### Pause Campaign (STM Event)
**API:** `PATCH /api/promotion/{id}/pause`
**Fetch/XHR name:** `promotion/{id}/pause`

**Response:**
```json
{
  "id": "promo-001",
  "stateId": "PAUSED",
  "updatedTime": "2026-03-28T10:45:00Z"
}
```

### Delete Campaign
**API:** `DELETE /api/admin/promotions/{id}`

**Response:**
```json
{
  "id": "promo-009",
  "deleted": true,
  "deletedTime": "2026-03-28T10:50:00Z"
}
```

### Create Coupon
**API:** `POST /api/admin/promotions/coupons`

**Request:**
```json
{
  "code": "HOLI500",
  "description": "Flat Rs 500 off on Holi",
  "discountType": "FIXED",
  "discountValue": 500,
  "minOrderValue": 2499,
  "maxDiscount": 500,
  "usageLimit": 1000,
  "startDate": "2026-03-10T00:00:00Z",
  "endDate": "2026-03-15T23:59:59Z",
  "applicableCategories": ["ALL"]
}
```

**Response:**
```json
{
  "id": "coupon-010",
  "code": "HOLI500",
  "stateId": "ACTIVE",
  "createdTime": "2026-03-28T10:30:00Z"
}
```

---

## Summary

| # | Section | API Endpoint | Method | Cache |
|---|---------|-------------|--------|-------|
| 1 | Page Header | None (static) | — | — |
| 2 | Stats Cards | `/api/admin/promotions/stats` | GET | 30s |
| 3 | Campaigns Table | `/api/query/admin-promotions` | POST (Chenile Query) | 30s |
| 4 | Active Coupons | `/api/admin/promotions/coupons?stateId=ACTIVE` | GET | 30s |
| 5a | Create Campaign | `/api/admin/promotions` | POST | — |
| 5b | Update Campaign | `/api/admin/promotions/{id}` | PUT | — |
| 5c | Activate Campaign | `/api/promotion/{id}/activate` | PATCH (STM Event) | — |
| 5d | Pause Campaign | `/api/promotion/{id}/pause` | PATCH (STM Event) | — |
| 5e | Delete Campaign | `/api/admin/promotions/{id}` | DELETE | — |
| 5f | Create Coupon | `/api/admin/promotions/coupons` | POST | — |

**Total API calls on page load: 3 (parallel)**
**Total admin action endpoints: 6**

---

## Frontend Integration Pattern

```typescript
export default async function AdminPromotions() {
  const [stats, campaigns, coupons] = await Promise.allSettled([
    adminApi.promotionStats(),
    adminApi.promotions({ pageSize: 8, sortBy: 'startDate', sortOrder: 'desc' }),
    adminApi.coupons({ stateId: 'ACTIVE', pageSize: 5 }),
  ]);

  return (
    <>
      <PageHeader />
      <StatsCards data={stats} />
      <CampaignsTable data={campaigns} />
      <ActiveCoupons data={coupons} />
    </>
  );
}
```

---

## New Endpoints Needed

1. `GET /api/admin/promotions/stats` — campaign and coupon stats
2. `GET /api/admin/promotions` — paginated campaign listing
3. `GET /api/admin/promotions/coupons` — coupon listing
4. `POST /api/admin/promotions` — create campaign
5. `PUT /api/admin/promotions/{id}` — update campaign
6. `PUT /api/admin/promotions/{id}/activate` — activate campaign
7. `PUT /api/admin/promotions/{id}/pause` — pause campaign
8. `DELETE /api/admin/promotions/{id}` — delete campaign
9. `POST /api/admin/promotions/coupons` — create coupon

---

## Allowed Actions -> UI Mapping

The backend returns `allowedActions` per row based on the entity's current state (STM).
The frontend reads these and renders only the allowed buttons.

**STM Source:** `promo-states.xml` (promo-flow)
**Admin ACL filter:** Events with `ADMIN` or `MARKETING` in `meta-acls`.

### State -> Allowed Actions -> UI Buttons

| State | allowedActions (admin-visible) | UI Button | Icon | Color | Event ID |
|-------|------------------------------|-----------|------|-------|----------|
| DRAFT | schedule | Schedule | Calendar | blue | schedule |
| DRAFT | cancel | Cancel | XCircle | red | cancel |
| SCHEDULED | activate | Activate Now | Power | green | activate |
| SCHEDULED | cancel | Cancel | XCircle | red | cancel |
| ACTIVE | pause | Pause | PauseCircle | amber | pause |
| ACTIVE | cancel | Cancel | XCircle | red | cancel |
| PAUSED | resume | Resume | PlayCircle | green | resume |
| PAUSED | cancel | Cancel | XCircle | red | cancel |
| EXPIRED | archive | Archive | Archive | gray | archive |
| CANCELLED | archive | Archive | Archive | gray | archive |
| ARCHIVED | -- | (read-only, terminal) | -- | -- | -- |

### Frontend Pattern

```typescript
const ADMIN_PROMO_ACTION_CONFIG: Record<string, ActionButtonConfig> = {
  schedule: { label: 'Schedule', icon: 'Calendar', color: 'blue' },
  activate: { label: 'Activate Now', icon: 'Power', color: 'green' },
  pause: { label: 'Pause', icon: 'PauseCircle', color: 'amber' },
  resume: { label: 'Resume', icon: 'PlayCircle', color: 'green' },
  cancel: { label: 'Cancel', icon: 'XCircle', color: 'red' },
  archive: { label: 'Archive', icon: 'Archive', color: 'gray' },
};

// Render only allowed actions
{allowedActions.map(a => {
  const config = ADMIN_PROMO_ACTION_CONFIG[a.allowedAction];
  return config ? <ActionButton {...config} onClick={() => triggerEvent(id, a.allowedAction)} /> : null;
})}
```
