# Admin Reports — API Contract

## Page: admin-reports.html

**Note:** Report generation is async (returns a job ID). Scheduled reports and download history use Chenile `SearchRequest/SearchResponse`. Report types: Sales, Seller Performance, Tax (GSTR-1/3B), Inventory, Financial Reconciliation, Customer Analytics.

---

## Section 1: Available Report Types

**API:** `GET /api/admin/reports/types`
**Fetch/XHR name:** `report-types`

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": [
    { "id": "sales", "name": "Sales Report", "description": "Revenue, orders, GMV breakdown by period, category, and seller", "lastGenerated": "2026-03-25", "tag": "Popular" },
    { "id": "seller-performance", "name": "Seller Performance", "description": "Individual seller metrics: fulfillment, returns, ratings, SLA", "lastGenerated": "2026-03-22" },
    { "id": "tax", "name": "Tax Report (GSTR-1/3B)", "description": "GST-compliant tax reports for filing", "lastGenerated": "2026-03-20", "tag": "Compliance" },
    { "id": "inventory", "name": "Inventory Report", "description": "Stock levels, low inventory alerts, dead stock identification", "lastGenerated": "2026-03-18" },
    { "id": "financial-recon", "name": "Financial Reconciliation", "description": "Payment gateway reconciliation, settlement summaries, commission tracking", "lastGenerated": "2026-03-15", "tag": "Finance" },
    { "id": "customer-analytics", "name": "Customer Analytics", "description": "User acquisition, retention cohorts, LTV analysis, geographic distribution", "lastGenerated": "2026-03-24" }
  ]
}
```

---

## Section 2: Generate Report (Async)

**API:** `POST /api/admin/reports/generate`
**Fetch/XHR name:** `generate-report`

**Request:**
```json
{
  "reportType": "sales",
  "dateFrom": "2026-03-01",
  "dateTo": "2026-03-28",
  "format": "csv",
  "filters": {
    "category": "all",
    "seller": "all"
  }
}
```

**Response:**
```json
{
  "success": true,
  "code": 202,
  "payload": {
    "jobId": "RPT-20260328-001",
    "reportType": "sales",
    "status": "Processing",
    "estimatedSeconds": 45
  }
}
```

**Poll job status:** `GET /api/admin/reports/jobs/{jobId}`

**Job complete response:**
```json
{
  "success": true,
  "payload": {
    "jobId": "RPT-20260328-001",
    "status": "Completed",
    "downloadUrl": "/api/admin/downloads/sales-report-20260328.csv",
    "expiresAt": "2026-03-29T10:30:00Z",
    "fileSize": "2.4 MB"
  }
}
```

---

## Section 3: Scheduled Reports Table

**API:** `POST /api/query/admin-scheduled-reports`
**Fetch/XHR name:** `admin-scheduled-reports`

**Request (SearchRequest):**
```json
{
  "queryName": "AdminScheduledReport.list",
  "pageNum": 1,
  "numRowsInPage": 10,
  "sortCriteria": [{ "name": "nextRun", "ascendingOrder": true }],
  "filters": { "status": "all" }
}
```

**Response (SearchResponse):**
```json
{
  "list": [
    {
      "row": {
        "id": "SCHED-001",
        "name": "Weekly Sales Summary",
        "reportType": "Sales Report - CSV",
        "frequency": "Weekly (Monday)",
        "nextRun": "2026-03-31",
        "recipient": "admin@homebase.in",
        "status": "Active"
      },
      "allowedActions": ["edit", "pause", "delete"]
    }
  ],
  "totalCount": 4,
  "numRowsInPage": 10
}
```

---

## Command: Create Scheduled Report

**API:** `POST /api/admin/reports/schedules`
**Fetch/XHR name:** `create-schedule`

**Request:**
```json
{
  "name": "Monthly Tax Report",
  "reportType": "tax",
  "frequency": "monthly",
  "dayOfMonth": 1,
  "format": "xlsx",
  "recipients": ["admin@homebase.in", "finance@homebase.in"],
  "status": "Active"
}
```

**Response:**
```json
{ "success": true, "code": 201, "payload": { "id": "SCHED-005", "name": "Monthly Tax Report", "status": "Active" } }
```

---

## Command: Update Scheduled Report

**API:** `PUT /api/admin/reports/schedules/{scheduleId}`
**Fetch/XHR name:** `update-schedule`

---

## Command: Toggle Schedule (Pause/Resume — STM Action)

**API:** `PATCH /api/admin/reports/schedules/{scheduleId}/toggleStatus`
**Fetch/XHR name:** `toggle-schedule`

**Request:**
```json
{ "status": "Paused" }
```

---

## Command: Delete Schedule

**API:** `DELETE /api/admin/reports/schedules/{scheduleId}`
**Fetch/XHR name:** `delete-schedule`

---

## Section 4: Download History

**API:** `POST /api/query/admin-report-downloads`
**Fetch/XHR name:** `admin-report-downloads`

**Request (SearchRequest):**
```json
{
  "queryName": "AdminReportDownload.history",
  "pageNum": 1,
  "numRowsInPage": 10,
  "sortCriteria": [{ "name": "generatedAt", "ascendingOrder": false }],
  "filters": {}
}
```

**Response (SearchResponse):**
```json
{
  "list": [
    {
      "row": {
        "id": "DL-001",
        "reportName": "Sales Report - March 2026",
        "format": "CSV",
        "fileSize": "2.4 MB",
        "generatedAt": "2026-03-25T14:30:00Z",
        "generatedBy": "Super Admin",
        "downloadUrl": "/api/admin/downloads/sales-report-20260325.csv",
        "expiresAt": "2026-04-01T14:30:00Z"
      }
    }
  ],
  "totalCount": 24,
  "numRowsInPage": 10
}
```

---

## Summary

| # | Section | API Endpoint | Method | Fetch/XHR Name |
|---|---------|-------------|--------|----------------|
| 1 | Report Types | `/api/admin/reports/types` | GET | `report-types` |
| 2 | Generate | `POST /api/admin/reports/generate` | POST | `generate-report` |
| 3 | Poll Job | `/api/admin/reports/jobs/{id}` | GET | `report-job-status` |
| 4 | Scheduled Reports | `POST /api/query/admin-scheduled-reports` | POST (Chenile) | `admin-scheduled-reports` |
| 5 | Create Schedule | `POST /api/admin/reports/schedules` | POST | `create-schedule` |
| 6 | Toggle Schedule | `PATCH /api/admin/reports/schedules/{id}/toggleStatus` | PATCH (STM) | `toggle-schedule` |
| 7 | Delete Schedule | `DELETE /api/admin/reports/schedules/{id}` | DELETE | `delete-schedule` |
| 8 | Download History | `POST /api/query/admin-report-downloads` | POST (Chenile) | `admin-report-downloads` |

**Total API calls on page load: 3 (types + scheduled + downloads in parallel)**
