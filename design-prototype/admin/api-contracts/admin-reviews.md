# Admin Reviews — API Contract

## Page: admin-reviews.html

**Note:** Reviews table uses Chenile's `SearchRequest/SearchResponse` pattern via POST. Moderation actions (approve/remove/flag) use PATCH STM events. Stats use REST GET.

---

## Section 1: Page Header

**Data needed:** None
**API:** No API call needed — static content with Export button

---

## Section 2: Stats Cards (4 cards)

**API:** `GET /api/admin/reviews/stats`

**Response:**
```json
{
  "totalReviews": {
    "value": 12450,
    "trend": 8.4,
    "trendDirection": "up"
  },
  "pendingModeration": {
    "value": 34,
    "needsAttention": true
  },
  "flagged": {
    "value": 18,
    "trend": 3,
    "trendDirection": "up"
  },
  "removed": {
    "value": 56,
    "weeklyChange": 2
  }
}
```

---

## Section 3: Reviews Table (paginated, filterable)

**API:** `POST /api/query/admin-reviews`
**Fetch/XHR name:** `admin-reviews`

**Request (SearchRequest):**
```json
{
  "queryName": "AdminReview.allReviews",
  "pageNum": 1,
  "numRowsInPage": 8,
  "sortCriteria": [{ "name": "createdTime", "ascendingOrder": false }],
  "filters": { "stateId": "", "search": "", "rating": "" }
}
```

**Response:**
```json
{
  "list": [
    {
      "row": {
        "id": "rev-001",
        "productId": "prod-042",
        "productName": "Modern Velvet Sofa",
        "reviewerName": "Priya Sharma",
        "reviewerId": "user-120",
        "rating": 5,
        "title": "Excellent quality and comfort!",
        "body": "The sofa is extremely comfortable and looks exactly like the pictures. Delivery was quick too.",
        "stateId": "PUBLISHED",
        "reportCount": 0,
        "createdTime": "2026-03-27T14:30:00Z",
        "helpfulCount": 12,
        "sellerName": "LuxeLiving Co.",
        "sellerId": "seller-010"
      }
    },
    {
      "row": {
        "id": "rev-005",
        "productId": "prod-088",
        "productName": "LED Panel Light",
        "reviewerName": "Anonymous",
        "reviewerId": "user-342",
        "rating": 1,
        "title": "Terrible product!",
        "body": "This is a scam. The product stopped working after 2 days.",
        "stateId": "FLAGGED",
        "flagReason": "SPAM",
        "reportCount": 5,
        "createdTime": "2026-03-26T09:15:00Z",
        "helpfulCount": 0,
        "sellerName": "Quick Electronics",
        "sellerId": "seller-018"
      }
    }
  ],
  "totalCount": 12450,
  "numRowsInPage": 8
}
```

**Note:** Uses Chenile SearchRequest format. Response follows `GenericResponse<Review>` wrapper.

---

## Section 4: Flagged Reviews Section (expanded cards)

**API:** `POST /api/query/admin-reviews` (same endpoint with stateId=FLAGGED filter)
**Fetch/XHR name:** `admin-reviews`

**Request (SearchRequest):**
```json
{
  "queryName": "AdminReview.allReviews",
  "pageNum": 1,
  "numRowsInPage": 5,
  "sortCriteria": [{ "name": "reportCount", "ascendingOrder": false }],
  "filters": { "stateId": "FLAGGED" }
}
```

Uses the same Chenile query endpoint with `stateId=FLAGGED` filter. Response includes additional flag detail:

```json
{
  "list": [
    {
      "row": {
        "id": "rev-005",
        "productName": "LED Panel Light",
        "reviewerName": "Anonymous",
        "rating": 1,
        "title": "Terrible product!",
        "body": "This is a scam. The product stopped working after 2 days.",
        "stateId": "FLAGGED",
        "flagReason": "SPAM",
        "flagDetails": "Multiple similar reviews posted across products in 10 minutes",
        "reportCount": 5,
        "reportedBy": ["user-100", "user-101", "user-102", "user-103", "user-104"],
        "createdTime": "2026-03-26T09:15:00Z"
      }
    }
  ]
}
```

---

## Section 5: Review Actions (Admin moderation)

### Approve Review (STM Event)
**API:** `PATCH /api/review/{id}/approve`
**Fetch/XHR name:** `review/{id}/approve`

**Request:**
```json
{
  "notes": "Review is legitimate, removing flag"
}
```

**Response:**
```json
{
  "id": "rev-005",
  "stateId": "PUBLISHED",
  "updatedTime": "2026-03-28T10:30:00Z",
  "approvedBy": "admin-001"
}
```

### Remove Review (STM Event)
**API:** `PATCH /api/review/{id}/remove`
**Fetch/XHR name:** `review/{id}/remove`

**Request:**
```json
{
  "reason": "Spam content, reviewer posting fake reviews",
  "notifyReviewer": true,
  "flagReviewer": false
}
```

**Response:**
```json
{
  "id": "rev-005",
  "stateId": "REMOVED",
  "updatedTime": "2026-03-28T10:35:00Z",
  "removedBy": "admin-001"
}
```

### Flag Review (STM Event)
**API:** `PATCH /api/review/{id}/flag`
**Fetch/XHR name:** `review/{id}/flag`

**Request:**
```json
{
  "flagReason": "INAPPROPRIATE",
  "notes": "Contains offensive language"
}
```

**Response:**
```json
{
  "id": "rev-010",
  "stateId": "FLAGGED",
  "flagReason": "INAPPROPRIATE",
  "updatedTime": "2026-03-28T10:40:00Z",
  "flaggedBy": "admin-001"
}
```

---

## Summary

| # | Section | API Endpoint | Method | Cache |
|---|---------|-------------|--------|-------|
| 1 | Page Header | None (static) | — | — |
| 2 | Stats Cards | `/api/admin/reviews/stats` | GET | 30s |
| 3 | Reviews Table | `/api/query/admin-reviews` | POST (Chenile Query) | 30s |
| 4 | Flagged Reviews | `/api/query/admin-reviews` (with stateId=FLAGGED filter) | POST (Chenile Query) | 15s |
| 5a | Approve Review | `/api/review/{id}/approve` | PATCH (STM Event) | — |
| 5b | Remove Review | `/api/review/{id}/remove` | PATCH (STM Event) | — |
| 5c | Flag Review | `/api/review/{id}/flag` | PATCH (STM Event) | — |

**Total API calls on page load: 3 (parallel)**
**Total admin action endpoints: 3**

---

## Frontend Integration Pattern

```typescript
export default async function AdminReviews() {
  const [stats, reviews, flagged] = await Promise.allSettled([
    adminApi.reviewStats(),
    adminApi.reviews({ pageSize: 8, sortBy: 'createdTime', sortOrder: 'desc' }),
    adminApi.reviews({ stateId: 'FLAGGED', pageSize: 5, sortBy: 'reportCount', sortOrder: 'desc' }),
  ]);

  return (
    <>
      <PageHeader />
      <StatsCards data={stats} />
      <ReviewsTable data={reviews} />
      <FlaggedReviews data={flagged} />
    </>
  );
}
```

---

## New Endpoints Needed

1. `GET /api/admin/reviews/stats` — review moderation stats
2. `POST /api/query/admin-reviews` — paginated review listing (Chenile query)
3. `PATCH /api/review/{id}/approve` — approve/unflag review (STM event)
4. `PATCH /api/review/{id}/remove` — remove review (STM event)
5. `PATCH /api/review/{id}/flag` — flag review for moderation (STM event)

---

## Allowed Actions -> UI Mapping

The backend returns `allowedActions` per row based on the entity's current state (STM).
The frontend reads these and renders only the allowed buttons.

**STM Source:** `review-states.xml` (review-flow)
**Admin ACL filter:** Events with `ADMIN` or `MODERATOR` in `meta-acls`. Admins have full moderation access.

### State -> Allowed Actions -> UI Buttons

| State | allowedActions (admin-visible) | UI Button | Icon | Color | Event ID |
|-------|------------------------------|-----------|------|-------|----------|
| SUBMITTED | -- | (pending auto-routing) | -- | -- | -- |
| UNDER_MODERATION | publishReview | Publish | CheckCircle | green | publishReview |
| UNDER_MODERATION | rejectReview | Reject | XCircle | red | rejectReview |
| UNDER_MODERATION | requestEdit | Request Edit | Edit | amber | requestEdit |
| PUBLISHED | flagReview | Flag for Review | Flag | amber | flagReview |
| PUBLISHED | archiveReview | Archive | Archive | gray | archiveReview |
| FLAGGED | moderateReview | Send to Moderation | ClipboardCheck | blue | moderateReview |
| FLAGGED | publishReview | Republish | CheckCircle | green | publishReview |
| FLAGGED | rejectReview | Reject | XCircle | red | rejectReview |
| EDIT_REQUESTED | -- | (read-only, waiting on customer) | -- | -- | -- |
| REJECTED | -- | (read-only, terminal) | -- | -- | -- |
| ARCHIVED | -- | (read-only, terminal) | -- | -- | -- |

### Frontend Pattern

```typescript
const ADMIN_REVIEW_ACTION_CONFIG: Record<string, ActionButtonConfig> = {
  publishReview: { label: 'Publish', icon: 'CheckCircle', color: 'green' },
  rejectReview: { label: 'Reject', icon: 'XCircle', color: 'red' },
  requestEdit: { label: 'Request Edit', icon: 'Edit', color: 'amber' },
  flagReview: { label: 'Flag for Review', icon: 'Flag', color: 'amber' },
  archiveReview: { label: 'Archive', icon: 'Archive', color: 'gray' },
  moderateReview: { label: 'Send to Moderation', icon: 'ClipboardCheck', color: 'blue' },
};

// Render only allowed actions
{allowedActions.map(a => {
  const config = ADMIN_REVIEW_ACTION_CONFIG[a.allowedAction];
  return config ? <ActionButton {...config} onClick={() => triggerEvent(id, a.allowedAction)} /> : null;
})}
```
