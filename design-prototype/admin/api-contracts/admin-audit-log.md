# Admin Audit Log — API Contract

## Page: admin-audit-log.html

**Note:** Audit log uses Chenile `SearchRequest/SearchResponse` via POST for the log table with rich filtering. Stats use GET. Each log entry includes before/after snapshots for change tracking. Critical actions are flagged for review.

---

## Section 1: Audit Stats Cards (3 cards)

**API:** `GET /api/admin/audit/stats?date={date}`
**Fetch/XHR name:** `audit-stats`

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "totalActionsToday": 89,
    "activeAdmins": 3,
    "criticalActions": 5
  }
}
```

---

## Section 2: Audit Log Table

**API:** `POST /api/query/admin-audit-log`
**Fetch/XHR name:** `admin-audit-log`

**Request (SearchRequest):**
```json
{
  "queryName": "AdminAuditLog.list",
  "pageNum": 1,
  "numRowsInPage": 12,
  "sortCriteria": [{ "name": "timestamp", "ascendingOrder": false }],
  "filters": {
    "dateFrom": "2026-03-28",
    "dateTo": "2026-03-28",
    "adminUser": "all",
    "action": "all",
    "entityType": "all",
    "search": ""
  }
}
```

**Filter values:**
- `adminUser`: `all | Super Admin | Ravi Krishnan | Deepa Menon`
- `action`: `all | Create | Update | Delete | Approve | Suspend | Override`
- `entityType`: `all | Order | Product | Seller | User | Settings`

**Response (SearchResponse):**
```json
{
  "list": [
    {
      "row": {
        "id": "AUD-001",
        "timestamp": "2026-03-28T11:45:00Z",
        "adminUser": { "id": "ADM-001", "name": "Super Admin", "initials": "SA" },
        "action": "Suspended",
        "entityType": "User",
        "entityId": "USR-4521",
        "details": "Suspended user account - Fraud detected",
        "ipAddress": "192.168.1.42",
        "isCritical": true,
        "before": { "status": "Active", "accountType": "Customer" },
        "after": { "status": "Suspended", "reason": "Multiple fraudulent payment attempts" }
      }
    }
  ],
  "totalCount": 89,
  "numRowsInPage": 12
}
```

---

## Section 3: Export Audit Log

**API:** `POST /api/admin/audit/export`
**Fetch/XHR name:** `audit-export`

**Request:**
```json
{
  "dateFrom": "2026-03-28",
  "dateTo": "2026-03-28",
  "adminUser": "all",
  "action": "all",
  "entityType": "all",
  "format": "csv"
}
```

**Response:**
```json
{
  "success": true,
  "payload": { "downloadUrl": "/api/admin/downloads/audit-log-20260328.csv", "expiresAt": "2026-03-29T10:30:00Z" }
}
```

---

## Summary

| # | Section | API Endpoint | Method | Fetch/XHR Name | Date Filtered |
|---|---------|-------------|--------|----------------|---------------|
| 1 | Stats Cards | `/api/admin/audit/stats` | GET | `audit-stats` | **Yes** |
| 2 | Audit Log | `POST /api/query/admin-audit-log` | POST (Chenile) | `admin-audit-log` | **Yes** (via filters) |
| 3 | Export | `POST /api/admin/audit/export` | POST | `audit-export` | **Yes** |

**Total API calls on page load: 2 (stats + log in parallel)**
