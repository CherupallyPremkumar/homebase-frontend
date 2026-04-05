# Seller Reviews — API Contract

## Page: seller-reviews.html

**Note:** All table/list endpoints use Chenile's `SearchRequest/SearchResponse` pattern via POST. Reply is a standard POST (not STM since reviews are not state entities for sellers). Stats use REST GET.

---

## Section 1: Stats Cards (4 cards)

**Description:** Review summary — average rating, total reviews, this month count, response rate
**API:** `GET /api/seller/reviews/stats?period=30d`
**Fetch/XHR name:** `stats`

**Query Params:**
- `period` — `7d`, `30d`, `90d`, `1y` (default `30d`)

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "averageRating": 4.6,
    "totalReviews": 1238,
    "reviewsTrend": 14.2,
    "reviewsTrendDirection": "up",
    "thisMonth": 89,
    "thisMonthTrend": 7.3,
    "thisMonthTrendDirection": "up",
    "responseRate": 85
  }
}
```

---

## Section 2: Rating Breakdown

**Description:** Star-by-star breakdown with counts and percentages
**API:** `GET /api/seller/reviews/breakdown`
**Fetch/XHR name:** `breakdown`

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "breakdown": [
      { "stars": 5, "count": 768, "percent": 62 },
      { "stars": 4, "count": 260, "percent": 21 },
      { "stars": 3, "count": 111, "percent": 9 },
      { "stars": 2, "count": 62, "percent": 5 },
      { "stars": 1, "count": 37, "percent": 3 }
    ],
    "totalReviews": 1238
  }
}
```

---

## Section 3: Reviews List (filter, paginate — Chenile Query)

**Description:** Paginated reviews list with rating filter and sort
**API:** `POST /api/query/seller-reviews`
**Fetch/XHR name:** `seller-reviews`

**Request (SearchRequest):**
```json
{
  "queryName": "SellerReview.allReviews",
  "pageNum": 1,
  "numRowsInPage": 10,
  "sortCriteria": [
    { "name": "createdTime", "ascendingOrder": false }
  ],
  "filters": {
    "q": "",
    "rating": "ALL",
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
          "id": "rev-001",
          "customerName": "Priya Sharma",
          "customerInitials": "PS",
          "productName": "Pro Max Wireless Headphone",
          "productId": "prod-001",
          "rating": 5,
          "title": "Amazing sound quality!",
          "comment": "Best headphones I have ever used. The noise cancellation is top-notch.",
          "images": ["/images/reviews/rev-001-1.jpg"],
          "isVerifiedPurchase": true,
          "hasReply": true,
          "reply": {
            "text": "Thank you for the wonderful review, Priya! We are glad you love the headphones.",
            "repliedAt": "2026-03-26T10:00:00Z"
          },
          "createdTime": "2026-03-25T14:00:00Z"
        },
        "allowedActions": [
          { "allowedAction": "reply", "acls": "SELLER" }
        ]
      }
    ],
    "currentPage": 1,
    "maxPages": 124,
    "maxRows": 1238,
    "numRowsInPage": 10,
    "numRowsReturned": 10,
    "startRow": 1,
    "endRow": 10,
    "columnMetadata": {
      "customerName": { "name": "Customer", "columnType": "Text", "filterable": true, "sortable": true, "display": true },
      "rating": { "name": "Rating", "columnType": "Number", "filterable": true, "sortable": true, "display": true },
      "createdTime": { "name": "Date", "columnType": "Date", "filterable": true, "sortable": true, "display": true }
    },
    "hiddenColumns": ["id"],
    "availableCannedReports": [
      { "name": "allReviews", "description": "All reviews" },
      { "name": "unreplied", "description": "Unreplied reviews" }
    ]
  }
}
```

---

## Section 4: Reply to Review

**Description:** Post a seller reply to a customer review
**API:** `POST /api/review/{id}/reply`
**Fetch/XHR name:** `review/{id}/reply`

**Request Body:**
```json
{
  "text": "Thank you for your feedback! We are glad you love the product."
}
```

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "reviewId": "rev-001",
    "reply": {
      "text": "Thank you for your feedback! We are glad you love the product.",
      "repliedAt": "2026-03-28T15:30:00Z"
    }
  }
}
```

---

## Section 5: Update Reply

**Description:** Edit an existing reply
**API:** `PUT /api/review/{id}/reply`
**Fetch/XHR name:** `review/{id}/reply`

**Request Body:**
```json
{
  "text": "Updated reply text here."
}
```

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "reviewId": "rev-001",
    "reply": {
      "text": "Updated reply text here.",
      "repliedAt": "2026-03-28T16:00:00Z"
    }
  }
}
```

---

## Section 6: Export Reviews

**Description:** Export reviews to CSV
**API:** `GET /api/seller/reviews/export`
**Fetch/XHR name:** `export`

**Query Params:**
- `format` — `csv` or `xlsx`
- `rating` — optional filter
- `period` — optional filter

**Response:** Binary file download.

---

## Summary

| # | Section | API Endpoint | Method | Fetch/XHR Name | Type | Cache |
|---|---------|-------------|--------|----------------|------|-------|
| 1 | Stats Cards | `/api/seller/reviews/stats` | GET | `stats` | REST | 60s |
| 2 | Rating Breakdown | `/api/seller/reviews/breakdown` | GET | `breakdown` | REST | 60s |
| 3 | Reviews List | `/api/query/seller-reviews` | POST | `seller-reviews` | Chenile Query | 30s |
| 4 | Reply to Review | `/api/review/{id}/reply` | POST | `review/{id}/reply` | REST | — |
| 5 | Update Reply | `/api/review/{id}/reply` | PUT | `review/{id}/reply` | REST | — |
| 6 | Export Reviews | `/api/seller/reviews/export` | GET | `export` | REST | — |

**Total API calls on page load: 3 (parallel)**

---

## Frontend Integration Pattern

```typescript
// Server component
import { getApiClient } from '@homebase/api-client';

export default async function SellerReviews({ searchParams }) {
  const api = getApiClient();
  const period = searchParams.period || '30d';

  const [stats, breakdown, reviews] = await Promise.allSettled([
    api.get(`/seller/reviews/stats?period=${period}`),
    api.get('/seller/reviews/breakdown'),
    api.post('/query/seller-reviews', {
      queryName: 'SellerReview.allReviews',
      pageNum: Number(searchParams.page) || 1,
      numRowsInPage: 10,
      sortCriteria: [{ name: searchParams.sortBy || 'createdTime', ascendingOrder: false }],
      filters: {
        rating: searchParams.rating || 'ALL',
        status: searchParams.status || 'ALL',
      },
    }),
  ]);

  return (
    <>
      <StatsCards data={unwrap(stats)} />
      <RatingBreakdown data={unwrap(breakdown)} />
      <ReviewsList data={unwrap(reviews)} />
    </>
  );
}
```

---

## Backend Endpoints

| Endpoint | Exists? | Backend Module |
|----------|---------|---------------|
| `GET /seller/reviews/stats` | New | seller service (aggregation) |
| `GET /seller/reviews/breakdown` | New | seller service (aggregation) |
| `POST /query/seller-reviews` | New | review-query module (MyBatis) |
| `POST /review/{id}/reply` | New | review service |
| `PUT /review/{id}/reply` | New | review service |
| `GET /seller/reviews/export` | New | seller service |

---

## Allowed Actions -> UI Mapping

The backend returns `allowedActions` per row based on the entity's current state (STM).
The frontend reads these and renders only the allowed buttons.

**STM Source:** `review-states.xml` (review-flow)
**Seller ACL filter:** Sellers cannot moderate reviews (that requires `MODERATOR`/`ADMIN` ACL). Sellers can only reply to published reviews via a separate reply endpoint, not via STM events.

### State -> Allowed Actions -> UI Buttons

| State | allowedActions (seller-visible) | UI Button | Icon | Color | Event ID |
|-------|-------------------------------|-----------|------|-------|----------|
| SUBMITTED | -- | (read-only, pending moderation) | -- | -- | -- |
| UNDER_MODERATION | -- | (read-only) | -- | -- | -- |
| PUBLISHED | -- | Reply (via POST, not STM) | MessageSquare | blue | -- |
| FLAGGED | -- | (read-only) | -- | -- | -- |
| EDIT_REQUESTED | -- | (read-only) | -- | -- | -- |
| REJECTED | -- | (read-only, terminal) | -- | -- | -- |
| ARCHIVED | -- | (read-only, terminal) | -- | -- | -- |

> **Note:** Seller review replies use `POST /review/{id}/reply`, not STM events. The reply button is always shown for `PUBLISHED` reviews regardless of `allowedActions`.

### Frontend Pattern

```typescript
// Seller review actions are not STM-driven.
// The reply button is always available for PUBLISHED reviews.
const canReply = review.stateId === 'PUBLISHED';

{canReply && (
  <ActionButton label="Reply" icon="MessageSquare" color="blue"
    onClick={() => openReplyModal(review.id)} />
)}
```
