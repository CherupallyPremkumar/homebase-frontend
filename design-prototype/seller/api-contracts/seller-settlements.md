# Seller Settlements — API Contract

## Page: seller-settlements.html

**Note:** Settlement history table uses Chenile's `SearchRequest/SearchResponse` pattern via POST. Retrieve uses GET with `StateEntityServiceResponse`. Balance overview and payout request use standard REST.

---

## Section 1: Balance Overview Cards (3 cards)

**Description:** Financial summary — total earnings, pending settlement, last payout
**API:** `GET /api/seller/settlements/balance`
**Fetch/XHR name:** `balance`

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "totalEarnings": { "value": 1245680, "currency": "INR", "period": "All time" },
    "pendingSettlement": { "value": 114540, "currency": "INR", "nextPayoutDate": "2026-04-02" },
    "lastPayout": { "value": 145544, "currency": "INR", "date": "2026-03-28", "status": "Processing" }
  }
}
```

---

## Section 2: Payout Schedule Banner

**Description:** Next scheduled payout info
**API:** No separate API — derived from balance (Section 1)

---

## Section 3: Settlement History (table, paginate — Chenile Query)

**Description:** Paginated list of past and upcoming settlements
**API:** `POST /api/query/seller-settlements`
**Fetch/XHR name:** `seller-settlements`

**Request (SearchRequest):**
```json
{
  "queryName": "SellerSettlement.history",
  "pageNum": 1,
  "numRowsInPage": 8,
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
          "id": "STL-20260328",
          "period": "22 Mar - 28 Mar",
          "orderCount": 48,
          "grossAmount": 124500,
          "platformFee": 6225,
          "gst": 3735,
          "netAmount": 114540,
          "stateId": "PENDING",
          "payoutDate": "2026-04-02",
          "createdTime": "2026-03-28T00:00:00Z"
        },
        "allowedActions": [
          { "allowedAction": "requestEarlyPayout", "acls": "SELLER" }
        ]
      }
    ],
    "currentPage": 1,
    "maxPages": 3,
    "maxRows": 24,
    "numRowsInPage": 8,
    "numRowsReturned": 8,
    "startRow": 1,
    "endRow": 8,
    "columnMetadata": {
      "period": { "name": "Period", "columnType": "Text", "filterable": false, "sortable": false, "display": true },
      "netAmount": { "name": "Net Amount", "columnType": "Number", "filterable": false, "sortable": true, "display": true },
      "stateId": { "name": "Status", "columnType": "Text", "filterable": true, "sortable": true, "display": true },
      "createdTime": { "name": "Date", "columnType": "Date", "filterable": true, "sortable": true, "display": true }
    },
    "hiddenColumns": ["id"],
    "availableCannedReports": [
      { "name": "history", "description": "All settlements" },
      { "name": "pending", "description": "Pending settlements" }
    ]
  }
}
```

---

## Section 4: Settlement Detail (Slide-over — Command Retrieve)

**Description:** Detailed breakdown of a specific settlement
**API:** `GET /api/settlement/{id}`
**Fetch/XHR name:** `settlement/{id}`

**Response (GenericResponse<StateEntityServiceResponse<Settlement>>):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "mutatedEntity": {
      "id": "STL-20260328",
      "period": "22 Mar - 28 Mar",
      "orderCount": 48,
      "grossAmount": 124500,
      "breakdown": {
        "productRevenue": 118000,
        "shippingRevenue": 6500,
        "platformFee": 6225,
        "platformFeePercent": 5,
        "gst": 3735,
        "tds": 0,
        "otherDeductions": 0
      },
      "netAmount": 114540,
      "stateId": "PENDING",
      "payoutDate": "2026-04-02",
      "bankAccount": {
        "bankName": "State Bank of India",
        "accountNumberMasked": "XXXX XXXX 4523",
        "ifsc": "SBIN0001234"
      },
      "orders": [
        { "orderId": "HB-78234", "amount": 4299, "fee": 215, "net": 4084 },
        { "orderId": "HB-78220", "amount": 2899, "fee": 145, "net": 2754 }
      ],
      "createdTime": "2026-03-28T00:00:00Z"
    },
    "allowedActionsAndMetadata": [
      { "allowedAction": "requestEarlyPayout", "acls": "SELLER" }
    ]
  }
}
```

---

## Section 5: Request Early Payout

**Description:** Request an early settlement payout
**API:** `POST /api/seller/settlements/payout-request`
**Fetch/XHR name:** `payout-request`

**Request Body:**
```json
{
  "settlementId": "STL-20260328",
  "reason": "Urgent business expense"
}
```

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "requestId": "PR-001",
    "settlementId": "STL-20260328",
    "amount": 114540,
    "status": "SUBMITTED",
    "estimatedProcessingTime": "24-48 hours",
    "message": "Payout request submitted. Processing will take 24-48 hours."
  }
}
```

---

## Section 6: Bank Account Info

**Description:** Linked bank account for payouts (read-only on this page)
**API:** No separate API — included in settlement detail or from profile settings

---

## Summary

| # | Section | API Endpoint | Method | Fetch/XHR Name | Type | Cache |
|---|---------|-------------|--------|----------------|------|-------|
| 1 | Balance Overview | `/api/seller/settlements/balance` | GET | `balance` | REST | 30s |
| 2 | Payout Banner | Derived from balance | — | — | — | — |
| 3 | Settlement History | `/api/query/seller-settlements` | POST | `seller-settlements` | Chenile Query | 30s |
| 4 | Settlement Detail | `/api/settlement/{id}` | GET | `settlement/{id}` | Command Retrieve | 15s |
| 5 | Request Payout | `/api/seller/settlements/payout-request` | POST | `payout-request` | REST | — |
| 6 | Bank Account | Derived from settlement detail | — | — | — | — |

**Total API calls on page load: 2 (parallel)**

---

## Frontend Integration Pattern

```typescript
// Server component
import { getApiClient } from '@homebase/api-client';

export default async function SellerSettlements({ searchParams }) {
  const api = getApiClient();

  const [balance, settlements] = await Promise.allSettled([
    api.get('/seller/settlements/balance'),
    api.post('/query/seller-settlements', {
      queryName: 'SellerSettlement.history',
      pageNum: Number(searchParams.page) || 1,
      numRowsInPage: 8,
      sortCriteria: [{ name: 'createdTime', ascendingOrder: false }],
      filters: { status: searchParams.status || 'ALL' },
    }),
  ]);

  return (
    <>
      <BalanceCards data={unwrap(balance)} />
      <PayoutBanner data={unwrap(balance)} />
      <SettlementHistory data={unwrap(settlements)} />
      <SettlementDetailSlideOver /> {/* Client component, loads on click */}
    </>
  );
}
```

---

## Backend Endpoints

| Endpoint | Exists? | Backend Module |
|----------|---------|---------------|
| `GET /seller/settlements/balance` | New | seller service (aggregation) |
| `POST /query/seller-settlements` | New | settlement-query module (MyBatis) |
| `GET /settlement/{id}` | New | settlement service (Command Retrieve) |
| `POST /seller/settlements/payout-request` | New | seller service |

---

## Allowed Actions -> UI Mapping

The backend returns `allowedActions` per row based on the entity's current state (STM).
The frontend reads these and renders only the allowed buttons.

**STM Source:** `settlement-states.xml` (settlement-flow)
**Seller ACL filter:** Only events with `SUPPLIER` in `meta-acls` are shown. Sellers can dispute settlements.

### State -> Allowed Actions -> UI Buttons

| State | allowedActions (seller-visible) | UI Button | Icon | Color | Event ID |
|-------|-------------------------------|-----------|------|-------|----------|
| PENDING | -- | (read-only, awaiting calculation) | -- | -- | -- |
| CALCULATING | -- | (read-only) | -- | -- | -- |
| CALCULATED | -- | (read-only, awaiting approval) | -- | -- | -- |
| PENDING_APPROVAL | dispute | Dispute | AlertTriangle | red | dispute |
| APPROVED | dispute | Dispute | AlertTriangle | red | dispute |
| DISBURSED | dispute | Dispute | AlertTriangle | red | dispute |
| COMPLETED | -- | (read-only, terminal) | -- | -- | -- |
| DISPUTED | -- | (read-only, awaiting resolution) | -- | -- | -- |
| REJECTED | -- | (read-only) | -- | -- | -- |
| FAILED | -- | (read-only) | -- | -- | -- |

### Frontend Pattern

```typescript
const SELLER_SETTLEMENT_ACTION_CONFIG: Record<string, ActionButtonConfig> = {
  dispute: { label: 'Dispute', icon: 'AlertTriangle', color: 'red' },
};

// Render only allowed actions
{allowedActions.map(a => {
  const config = SELLER_SETTLEMENT_ACTION_CONFIG[a.allowedAction];
  return config ? <ActionButton {...config} onClick={() => triggerEvent(id, a.allowedAction)} /> : null;
})}
```
