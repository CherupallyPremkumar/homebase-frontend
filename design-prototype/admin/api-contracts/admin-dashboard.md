# Admin Dashboard — API Contract

## Page: admin-dashboard.html

**Note:** Stats and analytics use standard REST GET with `GenericResponse` wrapper. Top sellers table uses Chenile's `SearchRequest/SearchResponse` pattern via POST. All dashboard endpoints accept date range params to filter data by period.

---

## Date Range Filter (applies to all sections)

All dashboard GET endpoints accept these query params:

| Param | Type | Example | Description |
|-------|------|---------|-------------|
| `from` | ISO date | `2026-03-01` | Start date (inclusive) |
| `to` | ISO date | `2026-03-28` | End date (inclusive) |
| `period` | enum | `today\|7d\|30d\|90d\|1y` | Shortcut (overrides from/to) |

**Preset periods resolve to:**
```
today → from=2026-03-28, to=2026-03-28
7d    → from=2026-03-21, to=2026-03-28
30d   → from=2026-02-26, to=2026-03-28 (default)
90d   → from=2025-12-28, to=2026-03-28
1y    → from=2025-03-28, to=2026-03-28
```

**Fetch/XHR example:** `stats?from=2026-03-01&to=2026-03-28` or `stats?period=30d`

**Frontend integration:**
```typescript
const [dateRange, setDateRange] = useState({ from: '2026-02-26', to: '2026-03-28' });
const params = new URLSearchParams({ from: dateRange.from, to: dateRange.to });

// All dashboard APIs use the same date range
const [stats, revenue, actions, activity, sellers] = await Promise.allSettled([
  api.get(`/admin/dashboard/stats?${params}`),
  api.get(`/admin/dashboard/revenue?${params}`),
  api.get(`/admin/dashboard/pending-actions?${params}`),
  api.get(`/admin/dashboard/activity?${params}`),
  api.post(`/query/admin-sellers`, { ...searchRequest }),  // Chenile query uses filters instead
]);
```

---

## Section 1: Welcome / Platform Overview

**Data needed:** Admin name, role, current date
**API:** No API call needed — admin name from auth session, date from browser
**Fetch/XHR name:** None

---

## Section 2: Stats Cards (6 cards)

**API:** `GET /api/admin/dashboard/stats?from={from}&to={to}`
**Fetch/XHR name:** `stats?from=2026-03-01&to=2026-03-28`

**Response:**
```json
{
  "totalRevenue": {
    "value": 24000000,
    "trend": 18.2,
    "trendDirection": "up",
    "currency": "INR"
  },
  "totalOrders": {
    "value": 12450,
    "trend": 12.5,
    "trendDirection": "up"
  },
  "activeSellers": {
    "value": 234,
    "trend": 8.3,
    "trendDirection": "up"
  },
  "activeUsers": {
    "value": 45890,
    "trend": 22.1,
    "trendDirection": "up"
  },
  "productsListed": {
    "value": 8920,
    "trend": 6.7,
    "trendDirection": "up"
  },
  "pendingApprovals": {
    "value": 18,
    "needsAction": true
  }
}
```

---

## Section 3: Revenue Chart

**API:** `GET /api/admin/analytics/revenue?from={from}&to={to}`
**Fetch/XHR name:** `revenue?from=2026-03-01&to=2026-03-28`

**Query Params:**
- `period` — `7d`, `30d`, `12m`, `1y`

**Response:**
```json
{
  "period": "12m",
  "data": [
    { "label": "Apr", "revenue": 1450000, "target": 1600000 },
    { "label": "May", "revenue": 1580000, "target": 1650000 },
    { "label": "Jun", "revenue": 1720000, "target": 1700000 },
    { "label": "Jul", "revenue": 1650000, "target": 1750000 },
    { "label": "Aug", "revenue": 1830000, "target": 1800000 },
    { "label": "Sep", "revenue": 2050000, "target": 1900000 },
    { "label": "Oct", "revenue": 2200000, "target": 2000000 },
    { "label": "Nov", "revenue": 2400000, "target": 2100000 },
    { "label": "Dec", "revenue": 2650000, "target": 2200000 },
    { "label": "Jan", "revenue": 2480000, "target": 2300000 },
    { "label": "Feb", "revenue": 2580000, "target": 2350000 },
    { "label": "Mar", "revenue": 2800000, "target": 2400000 }
  ],
  "total": 24000000,
  "average": 2000000
}
```

---

## Section 4: Recent Activity Feed (6 items)

**API:** `GET /api/admin/dashboard/activity?from={from}&to={to}&pageSize=6`
**Fetch/XHR name:** `activity?from=2026-03-01&to=2026-03-28&pageSize=6`

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `from` | ISO date | Start date |
| `to` | ISO date | End date |
| `pageSize` | int | Number of items (default 6) |
| `type` | enum (optional) | Filter by activity type |

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "list": [
      {
        "id": "act-001",
        "type": "NEW_SELLER",
        "title": "Sharma Electronics joined as a new seller",
        "subtitle": "Pending verification",
        "timestamp": "2026-03-28T10:22:00Z",
        "relativeTime": "8 minutes ago",
        "badge": { "label": "New", "color": "green" },
        "icon": { "type": "store", "bgColor": "green-100", "iconColor": "green-600" },
        "entity": {
          "type": "supplier",
          "id": "SUP-00234",
          "name": "Sharma Electronics"
        },
        "navigateTo": "/admin/sellers/SUP-00234",
        "actor": {
          "type": "system",
          "name": "System"
        }
      },
      {
        "id": "act-002",
        "type": "LARGE_ORDER",
        "title": "Bulk order #HB-78234 placed worth ₹1,24,500",
        "subtitle": "By Priya M.",
        "timestamp": "2026-03-28T10:08:00Z",
        "relativeTime": "22 minutes ago",
        "badge": { "label": "Order", "color": "blue" },
        "icon": { "type": "shopping-bag", "bgColor": "blue-100", "iconColor": "blue-600" },
        "entity": {
          "type": "order",
          "id": "HB-78234",
          "name": "Order #HB-78234"
        },
        "navigateTo": "/admin/orders/HB-78234",
        "actor": {
          "type": "customer",
          "id": "USR-05678",
          "name": "Priya M."
        }
      },
      {
        "id": "act-003",
        "type": "PRODUCT_FLAGGED",
        "title": "Product \"Premium LED Panel\" flagged for misleading description",
        "subtitle": "Reported by 3 users",
        "timestamp": "2026-03-28T09:45:00Z",
        "relativeTime": "45 minutes ago",
        "badge": { "label": "Flagged", "color": "red" },
        "icon": { "type": "flag", "bgColor": "red-100", "iconColor": "red-600" },
        "entity": {
          "type": "product",
          "id": "PRD-00893",
          "name": "Premium LED Panel"
        },
        "navigateTo": "/admin/products/PRD-00893",
        "actor": {
          "type": "system",
          "name": "Auto-moderation"
        }
      },
      {
        "id": "act-004",
        "type": "SELLER_VERIFIED",
        "title": "Krishna Home Decor seller verification completed",
        "subtitle": "Documents approved",
        "timestamp": "2026-03-28T09:30:00Z",
        "relativeTime": "1 hour ago",
        "badge": { "label": "Verified", "color": "emerald" },
        "icon": { "type": "badge-check", "bgColor": "emerald-100", "iconColor": "emerald-600" },
        "entity": {
          "type": "supplier",
          "id": "SUP-00189",
          "name": "Krishna Home Decor"
        },
        "navigateTo": "/admin/sellers/SUP-00189",
        "actor": {
          "type": "admin",
          "id": "ADM-001",
          "name": "Super Admin"
        }
      },
      {
        "id": "act-005",
        "type": "PAYMENT_PROCESSED",
        "title": "Settlement batch ₹8,45,200 processed for 42 sellers",
        "subtitle": "Batch #STL-2026-0328",
        "timestamp": "2026-03-28T08:30:00Z",
        "relativeTime": "2 hours ago",
        "badge": { "label": "Payment", "color": "violet" },
        "icon": { "type": "currency", "bgColor": "violet-100", "iconColor": "violet-600" },
        "entity": {
          "type": "settlement",
          "id": "STL-2026-0328",
          "name": "Batch #STL-2026-0328"
        },
        "navigateTo": "/admin/analytics",
        "actor": {
          "type": "system",
          "name": "Settlement Engine"
        }
      },
      {
        "id": "act-006",
        "type": "RETURN_ESCALATED",
        "title": "Return escalation for order #HB-77891 requires admin review",
        "subtitle": "Customer dispute",
        "timestamp": "2026-03-28T07:30:00Z",
        "relativeTime": "3 hours ago",
        "badge": { "label": "Escalated", "color": "amber" },
        "icon": { "type": "return", "bgColor": "amber-100", "iconColor": "amber-600" },
        "entity": {
          "type": "returnrequest",
          "id": "RET-00456",
          "name": "Return for #HB-77891"
        },
        "navigateTo": "/admin/returns/RET-00456",
        "actor": {
          "type": "customer",
          "id": "USR-03456",
          "name": "Vikram S."
        }
      }
    ],
    "totalCount": 142,
    "hasMore": true
  }
}
```

**Activity Types (enum):**

| Type | Icon | Badge Color | Navigates To | Description |
|------|------|-------------|-------------|-------------|
| `NEW_SELLER` | store | green | /admin/sellers/{id} | New seller registration |
| `SELLER_VERIFIED` | badge-check | emerald | /admin/sellers/{id} | Seller verification complete |
| `SELLER_SUSPENDED` | alert-triangle | red | /admin/sellers/{id} | Seller suspended |
| `LARGE_ORDER` | shopping-bag | blue | /admin/orders/{id} | Order above threshold |
| `ORDER_CANCELLED` | x-circle | red | /admin/orders/{id} | High-value order cancelled |
| `PRODUCT_FLAGGED` | flag | red | /admin/products/{id} | Product flagged/reported |
| `PRODUCT_APPROVED` | check-circle | green | /admin/products/{id} | Product approved |
| `PRODUCT_REMOVED` | trash | red | /admin/products/{id} | Product removed |
| `RETURN_ESCALATED` | return | amber | /admin/returns/{id} | Return needs admin review |
| `PAYMENT_PROCESSED` | currency | violet | /admin/analytics | Settlement batch processed |
| `COMPLIANCE_ALERT` | shield | orange | /admin/compliance | Compliance issue detected |
| `REVIEW_REPORTED` | star | yellow | /admin/reviews/{id} | Review reported as spam/fake |
| `USER_SUSPENDED` | user-x | red | /admin/users/{id} | User account suspended |
| `PROMO_EXPIRED` | sparkles | gray | /admin/promotions/{id} | Promotion ended |

**Frontend rendering:**
```typescript
// Each activity item is clickable → navigates to entity detail
{activity.list.map(item => (
  <Link href={item.navigateTo} key={item.id}
    className="activity-item flex items-start gap-3.5 px-6 py-4 cursor-pointer block">
    <div className={`w-9 h-9 rounded-full bg-${item.icon.bgColor} flex items-center justify-center`}>
      <Icon name={item.icon.type} className={`w-4 h-4 text-${item.icon.iconColor}`} />
    </div>
    <div className="flex-1">
      <p className="text-sm text-gray-800" dangerouslySetInnerHTML={{ __html: item.title }} />
      <p className="text-xs text-gray-400 mt-0.5">{item.subtitle} · {item.relativeTime}</p>
    </div>
    <span className={`text-[10px] font-medium text-${item.badge.color}-600 bg-${item.badge.color}-50 px-2 py-1 rounded-full`}>
      {item.badge.label}
    </span>
  </Link>
))}
```

**"View All" loads more:**
```
GET /api/admin/dashboard/activity?from={from}&to={to}&pageSize=20&page=2
→ Paginated, returns next batch
```
```

---

## Section 5: Top Sellers Table (5 rows)

**API:** `POST /api/query/admin-sellers`
**Fetch/XHR name:** `admin-sellers`

**Request (SearchRequest):**
```json
{
  "queryName": "AdminSeller.topSellers",
  "pageNum": 1,
  "numRowsInPage": 5,
  "sortCriteria": [{ "name": "revenue", "ascendingOrder": false }],
  "filters": {}
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
        "tier": "Premium Seller",
        "products": 342,
        "orders": 1245,
        "revenue": 3820000,
        "rating": 4.8
      }
    },
    {
      "row": {
        "id": "seller-002",
        "storeName": "Krishna Home Decor",
        "tier": "Verified Seller",
        "products": 218,
        "orders": 987,
        "revenue": 2960000,
        "rating": 4.7
      }
    }
  ],
  "totalCount": 234,
  "numRowsInPage": 5
}
```

**Note:** Uses Chenile SearchRequest format.

---

## Section 6: Platform Health (3 metrics)

**API:** `GET /api/admin/dashboard/health`

**Response:**
```json
{
  "serverUptime": {
    "value": 99.9,
    "unit": "percent",
    "status": "healthy",
    "lastDowntime": "2026-03-14T03:22:00Z",
    "lastDowntimeDuration": 138
  },
  "apiResponse": {
    "value": 142,
    "unit": "ms",
    "percentile": "p95",
    "target": 200,
    "status": "healthy"
  },
  "activeSessions": {
    "value": 1247,
    "capacity": 3000,
    "breakdown": {
      "buyers": 1089,
      "sellers": 142,
      "admin": 16
    }
  },
  "lastUpdated": "2026-03-28T10:28:00Z"
}
```

---

## Summary

| # | Section | API Endpoint | Method | Fetch/XHR Name | Date Filtered | Cache |
|---|---------|-------------|--------|----------------|---------------|-------|
| 1 | Welcome Banner | None (session) | — | — | No | — |
| 2 | Stats Cards | `/api/admin/dashboard/stats?from=&to=` | GET | `stats?from=...&to=...` | **Yes** | 30s |
| 3 | Revenue Chart | `/api/admin/analytics/revenue?from=&to=` | GET | `revenue?from=...&to=...` | **Yes** | 60s |
| 4 | Activity Feed | `/api/admin/dashboard/activity?from=&to=&pageSize=6` | GET | `activity?from=...` | **Yes** | 15s |
| 5 | Top Sellers | `POST /api/query/admin-sellers` | POST (Chenile) | `admin-sellers` | **Yes** (via filters) | 60s |
| 6 | Platform Health | `/api/admin/dashboard/health` | GET | `health` | No (real-time) | 10s |

**Total API calls on page load: 5 (parallel)**
**Date range: All data endpoints accept `from`/`to` or `period` params**

---

## Date Range Change Flow

```
User clicks "7D" button or picks custom dates
    ↓
Frontend updates dateRange state
    ↓
All 4 date-filtered APIs refetch in parallel:
  GET /admin/dashboard/stats?from=2026-03-21&to=2026-03-28
  GET /admin/analytics/revenue?from=2026-03-21&to=2026-03-28
  GET /admin/dashboard/activity?from=2026-03-21&to=2026-03-28&pageSize=6
  POST /query/admin-sellers (with date filter in SearchRequest.filters)
    ↓
UI updates all sections with new data
Platform Health does NOT refetch (always real-time)
```

---

## Frontend Integration Pattern

```typescript
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState({ from: '2026-02-26', to: '2026-03-28' });
  const params = new URLSearchParams(dateRange);

  // All queries depend on dateRange — auto-refetch when it changes
  const stats = useQuery({
    queryKey: ['dashboard-stats', dateRange],
    queryFn: () => api.get(`/admin/dashboard/stats?${params}`),
    staleTime: 30_000,
  });
  const revenue = useQuery({
    queryKey: ['dashboard-revenue', dateRange],
    queryFn: () => api.get(`/admin/analytics/revenue?${params}`),
    staleTime: 60_000,
  });
  const activity = useQuery({
    queryKey: ['dashboard-activity', dateRange],
    queryFn: () => api.get(`/admin/dashboard/activity?${params}&pageSize=6`),
    staleTime: 15_000,
  });
  const topSellers = useQuery({
    queryKey: ['dashboard-sellers', dateRange],
    queryFn: () => api.post('/query/admin-sellers', {
      queryName: 'AdminSeller.topSellers',
      pageNum: 1, numRowsInPage: 5,
      sortCriteria: [{ name: 'revenue', ascendingOrder: false }],
      filters: { dateFrom: dateRange.from, dateTo: dateRange.to },
    }),
    staleTime: 60_000,
  });
    adminApi.dashboardHealth(),
  ]);

  return (
    <>
      <WelcomeBanner />
      <StatsCards data={stats} />
      <RevenueChart data={revenue} />
      <ActivityFeed data={activity} />
      <TopSellers data={topSellers} />
      <PlatformHealth data={health} />
    </>
  );
}
```

---

## New Endpoints Needed

1. `GET /api/admin/dashboard/stats` — aggregated platform stats
2. `GET /api/admin/analytics/revenue` — monthly revenue chart data
3. `GET /api/admin/dashboard/activity` — recent activity feed
4. `GET /api/admin/dashboard/health` — infrastructure health metrics
