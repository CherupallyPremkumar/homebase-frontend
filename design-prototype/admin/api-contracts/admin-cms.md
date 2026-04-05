# Admin CMS — API Contract

## Page: admin-cms.html

**Note:** CMS content lists use standard REST GET with `GenericResponse` wrapper (small datasets, not paginated with Chenile Query). CRUD operations use standard REST. Toggle status uses PATCH STM events.

---

## Section 1: Page Header

**Data needed:** None
**API:** No API call needed — static content with Create New dropdown (Banner, Page, Announcement)

---

## Section 2: Stats Cards (4 cards)

**API:** `GET /api/admin/cms/stats`

**Response:**
```json
{
  "totalBanners": {
    "value": 4,
    "active": 3
  },
  "staticPages": {
    "value": 6,
    "published": 5
  },
  "announcements": {
    "value": 3,
    "active": 2
  },
  "contentViews": {
    "value": 18500,
    "trend": 24.3,
    "trendDirection": "up",
    "period": "30d"
  }
}
```

---

## Section 3: Banners Tab

### List Banners
**API:** `GET /api/admin/cms/banners`

**Response:**
```json
{
  "list": [
    {
      "id": "banner-001",
      "title": "Summer Sale 2026 - Up to 60% Off",
      "position": "Home Hero",
      "imageUrl": "/uploads/banners/summer-sale.jpg",
      "linkUrl": "/sale/summer-2026",
      "dimensions": "1920x600",
      "stateId": "ACTIVE",
      "startDate": "2026-03-01T00:00:00Z",
      "endDate": "2026-04-30T23:59:59Z",
      "views": 8432,
      "clicks": 1245,
      "sortOrder": 1,
      "createdTime": "2026-02-28T00:00:00Z"
    },
    {
      "id": "banner-002",
      "title": "Electronics Category - New Arrivals",
      "position": "Category Banner",
      "imageUrl": "/uploads/banners/electronics.jpg",
      "linkUrl": "/category/electronics",
      "dimensions": "1920x600",
      "stateId": "ACTIVE",
      "startDate": "2026-03-15T00:00:00Z",
      "endDate": "2026-05-15T23:59:59Z",
      "views": 5218,
      "clicks": 892,
      "sortOrder": 2,
      "createdTime": "2026-03-14T00:00:00Z"
    }
  ],
  "totalCount": 4
}
```

### Create Banner
**API:** `POST /api/admin/cms/banners`

**Request (multipart/form-data):**
```json
{
  "title": "Diwali Mega Sale",
  "position": "Home Hero",
  "linkUrl": "/sale/diwali-2026",
  "startDate": "2026-10-15T00:00:00Z",
  "endDate": "2026-11-15T23:59:59Z",
  "stateId": "DRAFT",
  "sortOrder": 5,
  "image": "<file>"
}
```

**Response:**
```json
{
  "id": "banner-005",
  "title": "Diwali Mega Sale",
  "stateId": "DRAFT",
  "createdTime": "2026-03-28T10:30:00Z"
}
```

### Update Banner
**API:** `PUT /api/admin/cms/banners/{id}`

**Request:**
```json
{
  "title": "Summer Sale 2026 - Up to 70% Off",
  "endDate": "2026-05-31T23:59:59Z"
}
```

**Response:**
```json
{
  "id": "banner-001",
  "stateId": "ACTIVE",
  "updatedTime": "2026-03-28T10:35:00Z"
}
```

### Toggle Banner Status (STM Event)
**API:** `PATCH /api/cms/banner/{id}/toggle`
**Fetch/XHR name:** `cms/banner/{id}/toggle`

**Response:**
```json
{
  "id": "banner-001",
  "stateId": "INACTIVE",
  "updatedTime": "2026-03-28T10:40:00Z"
}
```

### Delete Banner
**API:** `DELETE /api/admin/cms/banners/{id}`

**Response:**
```json
{
  "id": "banner-003",
  "deleted": true,
  "deletedTime": "2026-03-28T10:45:00Z"
}
```

---

## Section 4: Pages Tab

### List Pages
**API:** `GET /api/admin/cms/pages`

**Response:**
```json
{
  "list": [
    {
      "id": "page-001",
      "title": "About Us",
      "slug": "about-us",
      "stateId": "PUBLISHED",
      "lastModified": "2026-03-10T00:00:00Z",
      "author": "Super Admin",
      "views": 4521
    },
    {
      "id": "page-002",
      "title": "Contact Us",
      "slug": "contact",
      "stateId": "PUBLISHED",
      "lastModified": "2026-03-05T00:00:00Z",
      "author": "Super Admin",
      "views": 3892
    },
    {
      "id": "page-003",
      "title": "Privacy Policy",
      "slug": "privacy-policy",
      "stateId": "PUBLISHED",
      "lastModified": "2026-02-20T00:00:00Z",
      "author": "Super Admin",
      "views": 2145
    },
    {
      "id": "page-004",
      "title": "Terms & Conditions",
      "slug": "terms-conditions",
      "stateId": "PUBLISHED",
      "lastModified": "2026-02-20T00:00:00Z",
      "author": "Super Admin",
      "views": 1890
    },
    {
      "id": "page-005",
      "title": "FAQ",
      "slug": "faq",
      "stateId": "PUBLISHED",
      "lastModified": "2026-03-18T00:00:00Z",
      "author": "Super Admin",
      "views": 5234
    },
    {
      "id": "page-006",
      "title": "Shipping Info",
      "slug": "shipping-info",
      "stateId": "DRAFT",
      "lastModified": "2026-03-25T00:00:00Z",
      "author": "Super Admin",
      "views": 0
    }
  ],
  "totalCount": 6
}
```

### Create Page
**API:** `POST /api/admin/cms/pages`

**Request:**
```json
{
  "title": "Return Policy",
  "slug": "return-policy",
  "content": "<h1>Return Policy</h1><p>Our return policy details...</p>",
  "metaTitle": "Return Policy - HomeBase",
  "metaDescription": "Learn about our return and refund policy",
  "stateId": "DRAFT"
}
```

**Response:**
```json
{
  "id": "page-007",
  "title": "Return Policy",
  "slug": "return-policy",
  "stateId": "DRAFT",
  "createdTime": "2026-03-28T10:30:00Z"
}
```

### Update Page
**API:** `PUT /api/admin/cms/pages/{id}`

**Request:**
```json
{
  "content": "<h1>Updated Return Policy</h1><p>Updated content...</p>",
  "stateId": "PUBLISHED"
}
```

**Response:**
```json
{
  "id": "page-007",
  "stateId": "PUBLISHED",
  "updatedTime": "2026-03-28T10:35:00Z"
}
```

### Delete Page
**API:** `DELETE /api/admin/cms/pages/{id}`

**Response:**
```json
{
  "id": "page-006",
  "deleted": true,
  "deletedTime": "2026-03-28T10:40:00Z"
}
```

---

## Section 5: Announcements Tab

### List Announcements
**API:** `GET /api/admin/cms/announcements`

**Response:**
```json
{
  "list": [
    {
      "id": "ann-001",
      "title": "Free shipping on orders above Rs 999",
      "message": "Enjoy free shipping on all orders above Rs 999. Valid till 31st March 2026.",
      "type": "INFO",
      "stateId": "ACTIVE",
      "displayPosition": "TOP_BAR",
      "startDate": "2026-03-01T00:00:00Z",
      "endDate": "2026-03-31T23:59:59Z",
      "dismissible": true,
      "linkUrl": "/shipping-info",
      "linkText": "Learn More",
      "createdTime": "2026-02-28T00:00:00Z"
    },
    {
      "id": "ann-002",
      "title": "Scheduled maintenance on April 2nd",
      "message": "Platform will be under maintenance from 2 AM to 4 AM IST on April 2nd, 2026.",
      "type": "WARNING",
      "stateId": "ACTIVE",
      "displayPosition": "TOP_BAR",
      "startDate": "2026-03-25T00:00:00Z",
      "endDate": "2026-04-02T04:00:00Z",
      "dismissible": true,
      "linkUrl": null,
      "linkText": null,
      "createdTime": "2026-03-24T00:00:00Z"
    },
    {
      "id": "ann-003",
      "title": "Summer Sale is LIVE!",
      "message": "Get up to 60% off on furniture, home decor, and more. Shop now!",
      "type": "PROMOTION",
      "stateId": "INACTIVE",
      "displayPosition": "BANNER",
      "startDate": "2026-03-01T00:00:00Z",
      "endDate": "2026-04-30T23:59:59Z",
      "dismissible": false,
      "linkUrl": "/sale/summer-2026",
      "linkText": "Shop Now",
      "createdTime": "2026-02-27T00:00:00Z"
    }
  ],
  "totalCount": 3
}
```

### Create Announcement
**API:** `POST /api/admin/cms/announcements`

**Request:**
```json
{
  "title": "New Feature: Wishlist Sharing",
  "message": "You can now share your wishlists with friends and family!",
  "type": "INFO",
  "displayPosition": "TOP_BAR",
  "startDate": "2026-04-01T00:00:00Z",
  "endDate": "2026-04-15T23:59:59Z",
  "dismissible": true,
  "linkUrl": "/wishlist",
  "linkText": "Try It"
}
```

**Response:**
```json
{
  "id": "ann-004",
  "title": "New Feature: Wishlist Sharing",
  "stateId": "ACTIVE",
  "createdTime": "2026-03-28T10:30:00Z"
}
```

### Update Announcement
**API:** `PUT /api/admin/cms/announcements/{id}`

**Request:**
```json
{
  "message": "Updated message content",
  "endDate": "2026-04-20T23:59:59Z"
}
```

**Response:**
```json
{
  "id": "ann-004",
  "stateId": "ACTIVE",
  "updatedTime": "2026-03-28T10:35:00Z"
}
```

### Toggle Announcement Status (STM Event)
**API:** `PATCH /api/cms/announcement/{id}/toggle`
**Fetch/XHR name:** `cms/announcement/{id}/toggle`

**Response:**
```json
{
  "id": "ann-003",
  "stateId": "ACTIVE",
  "updatedTime": "2026-03-28T10:40:00Z"
}
```

### Delete Announcement
**API:** `DELETE /api/admin/cms/announcements/{id}`

**Response:**
```json
{
  "id": "ann-003",
  "deleted": true,
  "deletedTime": "2026-03-28T10:45:00Z"
}
```

---

## Summary

| # | Section | API Endpoint | Method | Cache |
|---|---------|-------------|--------|-------|
| 1 | Page Header | None (static) | — | — |
| 2 | Stats Cards | `/api/admin/cms/stats` | GET | 30s |
| 3a | List Banners | `/api/admin/cms/banners` | GET | 30s |
| 3b | Create Banner | `/api/admin/cms/banners` | POST | — |
| 3c | Update Banner | `/api/admin/cms/banners/{id}` | PUT | — |
| 3d | Toggle Banner | `/api/admin/cms/banners/{id}/toggle` | PUT | — |
| 3e | Delete Banner | `/api/admin/cms/banners/{id}` | DELETE | — |
| 4a | List Pages | `/api/admin/cms/pages` | GET | 30s |
| 4b | Create Page | `/api/admin/cms/pages` | POST | — |
| 4c | Update Page | `/api/admin/cms/pages/{id}` | PUT | — |
| 4d | Delete Page | `/api/admin/cms/pages/{id}` | DELETE | — |
| 5a | List Announcements | `/api/admin/cms/announcements` | GET | 30s |
| 5b | Create Announcement | `/api/admin/cms/announcements` | POST | — |
| 5c | Update Announcement | `/api/admin/cms/announcements/{id}` | PUT | — |
| 5d | Toggle Announcement | `/api/admin/cms/announcements/{id}/toggle` | PUT | — |
| 5e | Delete Announcement | `/api/admin/cms/announcements/{id}` | DELETE | — |

**Total API calls on page load: 4 (parallel: stats + banners + pages + announcements)**
**Total admin action endpoints: 12 (CRUD for banners, pages, announcements)**

---

## Frontend Integration Pattern

```typescript
export default async function AdminCMS() {
  const [stats, banners, pages, announcements] = await Promise.allSettled([
    adminApi.cmsStats(),
    adminApi.cmsBanners(),
    adminApi.cmsPages(),
    adminApi.cmsAnnouncements(),
  ]);

  return (
    <>
      <PageHeader />
      <StatsCards data={stats} />
      <TabContainer>
        <BannersTab data={banners} />
        <PagesTab data={pages} />
        <AnnouncementsTab data={announcements} />
      </TabContainer>
    </>
  );
}
```

---

## New Endpoints Needed

1. `GET /api/admin/cms/stats` — content overview stats
2. `GET /api/admin/cms/banners` — list banners
3. `POST /api/admin/cms/banners` — create banner
4. `PUT /api/admin/cms/banners/{id}` — update banner
5. `PUT /api/admin/cms/banners/{id}/toggle` — activate/deactivate banner
6. `DELETE /api/admin/cms/banners/{id}` — delete banner
7. `GET /api/admin/cms/pages` — list static pages
8. `POST /api/admin/cms/pages` — create page
9. `PUT /api/admin/cms/pages/{id}` — update page
10. `DELETE /api/admin/cms/pages/{id}` — delete page
11. `GET /api/admin/cms/announcements` — list announcements
12. `POST /api/admin/cms/announcements` — create announcement
13. `PUT /api/admin/cms/announcements/{id}` — update announcement
14. `PUT /api/admin/cms/announcements/{id}/toggle` — activate/deactivate announcement
15. `DELETE /api/admin/cms/announcements/{id}` — delete announcement
