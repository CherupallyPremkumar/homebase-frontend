# Seller Performance Analytics — API Contract

## Page: seller-performance.html

**Note:** All analytics endpoints use standard REST GET with `GenericResponse` wrapper. These are aggregation endpoints, not Chenile queries. The top products section uses Chenile Query for table data.

---

## Section 1: Key Metrics Cards (4 cards)

**Description:** Performance KPIs — order fulfillment rate, average rating, response time, return rate
**API:** `GET /api/seller/performance/metrics`
**Fetch/XHR name:** `metrics`

**Query Params:**
- `period` — `7d`, `30d`, `90d`, `1y` (default `30d`)

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "orderFulfillmentRate": {
    "value": 96.5,
    "trend": 2.1,
    "trendDirection": "up"
  },
  "averageRating": {
    "value": 4.6,
    "totalReviews": 1238
  },
  "responseTime": {
    "value": 2.4,
    "unit": "hours"
  },
  "returnRate": {
    "value": 3.2,
    "trend": 0.8,
    "trendDirection": "down"
  }
}
```

---

## Section 2: Revenue Chart

**Description:** Monthly revenue bar chart for the current year, with weekly/monthly/yearly toggle
**API:** `GET /api/seller/performance/revenue`
**Fetch/XHR name:** `revenue`

**Query Params:**
- `granularity` — `weekly`, `monthly`, `yearly` (default `monthly`)
- `period` — `30d`, `90d`, `1y` (default `1y`)

**Response:**
```json
{
  "granularity": "monthly",
  "data": [
    { "label": "Apr", "revenue": 280000, "orders": 142 },
    { "label": "May", "revenue": 320000, "orders": 168 },
    { "label": "Jun", "revenue": 290000, "orders": 151 },
    { "label": "Jul", "revenue": 350000, "orders": 184 },
    { "label": "Aug", "revenue": 310000, "orders": 162 },
    { "label": "Sep", "revenue": 380000, "orders": 198 },
    { "label": "Oct", "revenue": 420000, "orders": 220 },
    { "label": "Nov", "revenue": 450000, "orders": 236 },
    { "label": "Dec", "revenue": 520000, "orders": 272 },
    { "label": "Jan", "revenue": 480000, "orders": 251 },
    { "label": "Feb", "revenue": 440000, "orders": 230 },
    { "label": "Mar", "revenue": 452890, "orders": 234 }
  ],
  "totalRevenue": 4692890,
  "totalOrders": 2448,
  "averageOrderValue": 1917,
  "currency": "INR"
}
```

---

## Section 3: Orders Trend Chart

**Description:** Line chart showing daily order count over selected period
**API:** `GET /api/seller/performance/orders-trend`
**Fetch/XHR name:** `orders-trend`

**Query Params:**
- `period` — `7d`, `30d`, `90d` (default `30d`)

**Response:**
```json
{
  "period": "30d",
  "data": [
    { "date": "2026-02-27", "orders": 8 },
    { "date": "2026-02-28", "orders": 12 },
    { "date": "2026-03-01", "orders": 10 },
    { "date": "2026-03-02", "orders": 15 }
  ],
  "totalOrders": 234,
  "averageDaily": 7.8
}
```

---

## Section 4: Top Products

**Description:** Best-selling products ranked by revenue
**API:** `GET /api/seller/performance/top-products`
**Fetch/XHR name:** `top-products`

**Query Params:**
- `period` — `7d`, `30d`, `90d`, `1y` (default `30d`)
- `limit` — number of products (default 5)

**Response:**
```json
{
  "products": [
    {
      "id": "prod-001",
      "name": "Pro Max Wireless Headphone",
      "sku": "HB-EL-0012",
      "image": "/images/products/headphone.jpg",
      "unitsSold": 456,
      "revenue": 2277544,
      "rating": 4.8,
      "trend": 12.3,
      "trendDirection": "up"
    },
    {
      "id": "prod-015",
      "name": "Cotton Kurta Set",
      "sku": "HB-FA-0042",
      "image": "/images/products/kurta.jpg",
      "unitsSold": 312,
      "revenue": 405288,
      "rating": 4.5,
      "trend": 8.7,
      "trendDirection": "up"
    }
  ]
}
```

---

## Section 5: Customer Satisfaction

**Description:** Customer satisfaction score and recent feedback summary
**API:** `GET /api/seller/performance/satisfaction`
**Fetch/XHR name:** `satisfaction`

**Query Params:**
- `period` — `7d`, `30d`, `90d` (default `30d`)

**Response:**
```json
{
  "overallScore": 92,
  "npsScore": 68,
  "positivePercent": 85,
  "neutralPercent": 10,
  "negativePercent": 5,
  "topPraises": ["Fast shipping", "Great quality", "Excellent packaging"],
  "topComplaints": ["Late delivery", "Damaged packaging"],
  "responseRate": 85,
  "averageResponseTime": 2.4
}
```

---

## Section 6: Category Performance

**Description:** Revenue and orders breakdown by product category
**API:** `GET /api/seller/performance/categories`
**Fetch/XHR name:** `categories`

**Query Params:**
- `period` — `30d`, `90d`, `1y` (default `30d`)

**Response:**
```json
{
  "categories": [
    { "name": "Electronics", "revenue": 285000, "revenuePercent": 63, "orders": 142, "avgOrderValue": 2007 },
    { "name": "Fashion", "revenue": 98000, "revenuePercent": 22, "orders": 89, "avgOrderValue": 1101 },
    { "name": "Home & Living", "revenue": 45000, "revenuePercent": 10, "orders": 38, "avgOrderValue": 1184 },
    { "name": "Health", "revenue": 24890, "revenuePercent": 5, "orders": 22, "avgOrderValue": 1131 }
  ]
}
```

---

## Section 7: AI Insights

**Description:** AI-generated performance insights and recommendations
**API:** `GET /api/seller/performance/insights`
**Fetch/XHR name:** `insights`

**Response:**
```json
{
  "insights": [
    {
      "type": "WARNING",
      "title": "Low Stock Alert",
      "description": "5 products are running low on inventory. Restocking your top sellers before they go out of stock could increase monthly revenue by an estimated 12%.",
      "actionUrl": "/seller/inventory?stockStatus=LOW_STOCK",
      "actionLabel": "View Low Stock Items"
    },
    {
      "type": "SUCCESS",
      "title": "Revenue Growth",
      "description": "Your revenue has grown 12.5% this month compared to last month. Keep up the great work!",
      "actionUrl": null,
      "actionLabel": null
    }
  ]
}
```

---

## Summary

| # | Section | API Endpoint | Method | Fetch/XHR Name | Type | Cache |
|---|---------|-------------|--------|----------------|------|-------|
| 1 | Key Metrics | `/api/seller/performance/metrics` | GET | `metrics` | REST | 60s |
| 2 | Revenue Chart | `/api/seller/performance/revenue` | GET | `revenue` | REST | 60s |
| 3 | Orders Trend | `/api/seller/performance/orders-trend` | GET | `orders-trend` | REST | 60s |
| 4 | Top Products | `/api/seller/performance/top-products` | GET | `top-products` | REST | 60s |
| 5 | Satisfaction | `/api/seller/performance/satisfaction` | GET | `satisfaction` | REST | 60s |
| 6 | Categories | `/api/seller/performance/categories` | GET | `categories` | REST | 60s |
| 7 | AI Insights | `/api/seller/performance/insights` | GET | `insights` | REST | 5min |

**Total API calls on page load: 7 (parallel)**

---

## Frontend Integration Pattern

```typescript
// In Next.js page (server component)
export default async function SellerPerformance({ searchParams }) {
  const period = searchParams.period || '30d';

  const [metrics, revenue, ordersTrend, topProducts, satisfaction, categories, insights] =
    await Promise.allSettled([
      sellerApi.performanceMetrics({ period }),
      sellerApi.performanceRevenue({ granularity: 'monthly', period: '1y' }),
      sellerApi.performanceOrdersTrend({ period }),
      sellerApi.performanceTopProducts({ period, limit: 5 }),
      sellerApi.performanceSatisfaction({ period }),
      sellerApi.performanceCategories({ period }),
      sellerApi.performanceInsights(),
    ]);

  return (
    <>
      <MetricsCards data={metrics} />
      <div className="grid grid-cols-3 gap-6">
        <RevenueChart data={revenue} className="col-span-2" />
        <OrdersTrend data={ordersTrend} />
      </div>
      <TopProducts data={topProducts} />
      <div className="grid grid-cols-2 gap-6">
        <CustomerSatisfaction data={satisfaction} />
        <CategoryPerformance data={categories} />
      </div>
      <AIInsights data={insights} />
    </>
  );
}
```

---

## Existing Backend Endpoints

These endpoints already exist in `packages/api-client/src/`:
- `analytics.ts` -> `analyticsApi.revenue()` — may provide base revenue data

**New endpoints needed:**
1. `GET /api/seller/performance/metrics` — KPI metrics
2. `GET /api/seller/performance/revenue` — revenue chart data
3. `GET /api/seller/performance/orders-trend` — orders trend line
4. `GET /api/seller/performance/top-products` — best sellers
5. `GET /api/seller/performance/satisfaction` — customer satisfaction
6. `GET /api/seller/performance/categories` — category breakdown
7. `GET /api/seller/performance/insights` — AI insights
