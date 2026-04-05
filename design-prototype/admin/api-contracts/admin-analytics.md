# Admin Analytics — API Contract

## Page: admin-analytics.html

**Note:** All analytics endpoints use standard REST GET with `GenericResponse` wrapper. These are aggregation endpoints, not Chenile queries or STM entities.

---

## Section 1: Page Header

**Data needed:** Date range, period selector
**API:** No API call needed — static content with date range picker and period toggle (7D/30D/90D/1Y)

---

## Section 2: Key Metrics Cards (4 cards)

**API:** `GET /api/admin/analytics/metrics?period=30d`

**Query Params:**
- `period` — `7d`, `30d`, `90d`, `1y`
- `dateFrom` — ISO date string (for custom range)
- `dateTo` — ISO date string (for custom range)

**Response:**
```json
{
  "period": "30d",
  "gmv": {
    "value": 24000000,
    "trend": 18.2,
    "trendDirection": "up",
    "currency": "INR"
  },
  "aov": {
    "value": 1920,
    "trend": 5.4,
    "trendDirection": "up",
    "currency": "INR"
  },
  "conversionRate": {
    "value": 3.2,
    "trend": 0.8,
    "trendDirection": "up",
    "unit": "percent"
  },
  "customerRetention": {
    "value": 68,
    "trend": -2.1,
    "trendDirection": "down",
    "unit": "percent"
  }
}
```

---

## Section 3: Monthly Revenue Chart (12 months)

**API:** `GET /api/admin/analytics/revenue?period=12m`

**Query Params:**
- `period` — `7d`, `30d`, `12m`, `1y`

**Response:**
```json
{
  "period": "12m",
  "data": [
    { "label": "Apr", "revenue": 1250000, "target": 1500000 },
    { "label": "May", "revenue": 1400000, "target": 1500000 },
    { "label": "Jun", "revenue": 1600000, "target": 1600000 },
    { "label": "Jul", "revenue": 1450000, "target": 1700000 },
    { "label": "Aug", "revenue": 1800000, "target": 1700000 },
    { "label": "Sep", "revenue": 1650000, "target": 1800000 },
    { "label": "Oct", "revenue": 2100000, "target": 1900000 },
    { "label": "Nov", "revenue": 2400000, "target": 2200000 },
    { "label": "Dec", "revenue": 2300000, "target": 2200000 },
    { "label": "Jan", "revenue": 1900000, "target": 2000000 },
    { "label": "Feb", "revenue": 2000000, "target": 2000000 },
    { "label": "Mar", "revenue": 2200000, "target": 2100000 }
  ],
  "totalRevenue": 24000000,
  "targetAchievement": 104.2,
  "bestMonth": "November"
}
```

---

## Section 4: Orders by Category (Horizontal bars)

**API:** `GET /api/admin/analytics/categories/distribution?period=30d`

**Response:**
```json
{
  "data": [
    { "category": "Furniture", "percentage": 35, "orders": 4380 },
    { "category": "Home Decor", "percentage": 25, "orders": 3128 },
    { "category": "Kitchen & Dining", "percentage": 18, "orders": 2252 },
    { "category": "Lighting", "percentage": 12, "orders": 1502 },
    { "category": "Bathroom", "percentage": 6, "orders": 751 },
    { "category": "Others", "percentage": 4, "orders": 501 }
  ],
  "totalOrders": 12514
}
```

---

## Section 5: Top Performing Categories Table

**API:** `GET /api/admin/analytics/categories/performance?pageSize=6&sortBy=revenue&sortOrder=desc`

**Response:**
```json
{
  "list": [
    {
      "row": {
        "id": "cat-001",
        "name": "Furniture",
        "products": 142,
        "revenue": 8400000,
        "orders": 4380,
        "avgOrderValue": 1918,
        "growth": 22.4,
        "growthDirection": "up",
        "trend": [40, 55, 45, 70, 65, 85, 100]
      }
    },
    {
      "row": {
        "id": "cat-002",
        "name": "Home Decor",
        "products": 98,
        "revenue": 5640000,
        "orders": 3128,
        "avgOrderValue": 1803,
        "growth": 18.7,
        "growthDirection": "up",
        "trend": [35, 40, 50, 55, 60, 70, 80]
      }
    }
  ],
  "totalCount": 6,
  "numRowsInPage": 6
}
```

---

## Section 6: Geographic Distribution (Top 5 Cities)

**API:** `GET /api/admin/analytics/geographic?limit=5`

**Response:**
```json
{
  "data": [
    { "city": "Mumbai", "state": "Maharashtra", "orders": 3125, "revenue": 6200000, "percentage": 25 },
    { "city": "Delhi", "state": "Delhi", "orders": 2500, "revenue": 4800000, "percentage": 20 },
    { "city": "Bangalore", "state": "Karnataka", "orders": 1875, "revenue": 3600000, "percentage": 15 },
    { "city": "Hyderabad", "state": "Telangana", "orders": 1250, "revenue": 2400000, "percentage": 10 },
    { "city": "Chennai", "state": "Tamil Nadu", "orders": 1000, "revenue": 1900000, "percentage": 8 }
  ],
  "totalCities": 156,
  "otherPercentage": 22
}
```

---

## Section 7: Payment Methods Distribution

**API:** `GET /api/admin/analytics/payments?period=30d`

**Response:**
```json
{
  "data": [
    { "method": "UPI", "percentage": 42, "transactions": 5229, "amount": 8400000 },
    { "method": "Credit Card", "percentage": 24, "transactions": 2988, "amount": 6200000 },
    { "method": "Debit Card", "percentage": 18, "transactions": 2241, "amount": 3800000 },
    { "method": "Net Banking", "percentage": 10, "transactions": 1245, "amount": 3200000 },
    { "method": "COD", "percentage": 4, "transactions": 498, "amount": 1400000 },
    { "method": "Wallet", "percentage": 2, "transactions": 249, "amount": 600000 }
  ],
  "totalTransactions": 12450,
  "totalAmount": 24000000
}
```

---

## Summary

| # | Section | API Endpoint | Method | Cache |
|---|---------|-------------|--------|-------|
| 1 | Page Header | None (static) | — | — |
| 2 | Key Metrics | `/api/admin/analytics/metrics?period=30d` | GET | 60s |
| 3 | Revenue Chart | `/api/admin/analytics/revenue?period=12m` | GET | 60s |
| 4 | Category Distribution | `/api/admin/analytics/categories/distribution` | GET | 60s |
| 5 | Category Performance | `/api/admin/analytics/categories/performance` | GET | 60s |
| 6 | Geographic Distribution | `/api/admin/analytics/geographic` | GET | 300s |
| 7 | Payment Methods | `/api/admin/analytics/payments` | GET | 60s |

**Total API calls on page load: 6 (parallel)**

---

## Frontend Integration Pattern

```typescript
export default async function AdminAnalytics() {
  const period = '30d';
  const [metrics, revenue, catDistribution, catPerformance, geographic, payments] =
    await Promise.allSettled([
      adminApi.analyticsMetrics({ period }),
      adminApi.revenueAnalytics({ period: '12m' }),
      adminApi.categoryDistribution({ period }),
      adminApi.categoryPerformance({ pageSize: 6, sortBy: 'revenue', sortOrder: 'desc' }),
      adminApi.geographicDistribution({ limit: 5 }),
      adminApi.paymentDistribution({ period }),
    ]);

  return (
    <>
      <PageHeader />
      <MetricsCards data={metrics} />
      <RevenueChart data={revenue} />
      <CategoryDistribution data={catDistribution} />
      <CategoryPerformanceTable data={catPerformance} />
      <GeographicDistribution data={geographic} />
      <PaymentMethods data={payments} />
    </>
  );
}
```

---

## New Endpoints Needed

1. `GET /api/admin/analytics/metrics` — key platform metrics (GMV, AOV, conversion, retention)
2. `GET /api/admin/analytics/revenue` — monthly revenue chart data
3. `GET /api/admin/analytics/categories/distribution` — orders by category breakdown
4. `GET /api/admin/analytics/categories/performance` — category performance table
5. `GET /api/admin/analytics/geographic` — top cities by orders/revenue
6. `GET /api/admin/analytics/payments` — payment method distribution
