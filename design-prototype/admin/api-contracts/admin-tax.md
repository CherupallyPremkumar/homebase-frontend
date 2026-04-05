# Admin Tax & GST Management — API Contract

## Page: admin-tax.html

**Note:** Tax rules use Chenile `SearchRequest/SearchResponse` for the table. Stats and slab summary use GET. CRUD for tax rules uses REST. HSN code search is a typeahead GET endpoint. GST report generation is async.

---

## Section 1: Tax Stats Cards (3 cards)

**API:** `GET /api/admin/tax/stats`
**Fetch/XHR name:** `tax-stats`

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "taxRules": 24,
    "allActive": true,
    "hsnCodes": 156,
    "compliantSellers": { "compliant": 220, "total": 234, "needVerification": 14 }
  }
}
```

---

## Section 2: Tax Slab Summary

**API:** `GET /api/admin/tax/slabs`
**Fetch/XHR name:** `tax-slabs`

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": [
    { "rate": 0, "label": "Exempt", "productCount": 342 },
    { "rate": 5, "label": "Essential", "productCount": 1245 },
    { "rate": 12, "label": "Standard Low", "productCount": 2890 },
    { "rate": 18, "label": "Standard", "productCount": 3456 },
    { "rate": 28, "label": "Luxury", "productCount": 987 }
  ]
}
```

---

## Section 3: GST Rates Table

**API:** `POST /api/query/admin-tax-rules`
**Fetch/XHR name:** `admin-tax-rules`

**Request (SearchRequest):**
```json
{
  "queryName": "AdminTaxRule.list",
  "pageNum": 1,
  "numRowsInPage": 20,
  "sortCriteria": [{ "name": "category", "ascendingOrder": true }],
  "filters": {
    "status": "all",
    "search": ""
  }
}
```

**Filter `status` values:** `all | active | draft`

**Response (SearchResponse):**
```json
{
  "list": [
    {
      "row": {
        "id": "TAX-001",
        "category": "Fresh Fruits & Vegetables",
        "description": "Essential goods",
        "hsnCode": "0801",
        "cgst": 0.0,
        "sgst": 0.0,
        "igst": 0.0,
        "status": "Active"
      }
    },
    {
      "row": {
        "id": "TAX-002",
        "category": "Apparel (below Rs.1000)",
        "description": "Clothing & footwear",
        "hsnCode": "6109",
        "cgst": 2.5,
        "sgst": 2.5,
        "igst": 5.0,
        "status": "Active"
      }
    }
  ],
  "totalCount": 24,
  "numRowsInPage": 20
}
```

---

## Section 4: HSN Code Search (Typeahead)

**API:** `GET /api/admin/tax/hsn-search?q={query}`
**Fetch/XHR name:** `hsn-search`

**Response:**
```json
{
  "success": true,
  "payload": [
    { "code": "0801", "description": "Coconuts, Brazil nuts, cashew nuts", "rate": 0 },
    { "code": "0802", "description": "Other nuts, fresh or dried", "rate": 5 }
  ]
}
```

---

## Command: Create Tax Rule

**API:** `POST /api/admin/tax/rules`
**Fetch/XHR name:** `create-tax-rule`

**Request:**
```json
{
  "category": "Luxury Watches",
  "hsnCode": "9101",
  "cgst": 14.0,
  "sgst": 14.0,
  "igst": 28.0,
  "status": "Active"
}
```

**Response:**
```json
{ "success": true, "code": 201, "payload": { "id": "TAX-025", "category": "Luxury Watches", "status": "Active" } }
```

---

## Command: Update Tax Rule

**API:** `PUT /api/admin/tax/rules/{ruleId}`
**Fetch/XHR name:** `update-tax-rule`

**Request:**
```json
{ "cgst": 6.0, "sgst": 6.0, "igst": 12.0 }
```

**Response:**
```json
{ "success": true, "code": 200, "payload": { "id": "TAX-005", "category": "Electronics", "igst": 12.0 } }
```

---

## Command: Delete Tax Rule

**API:** `DELETE /api/admin/tax/rules/{ruleId}`
**Fetch/XHR name:** `delete-tax-rule`

**Response:**
```json
{ "success": true, "code": 200, "payload": { "message": "Tax rule deleted" } }
```

---

## Command: Generate GST Report

**API:** `POST /api/admin/tax/generate-report`
**Fetch/XHR name:** `generate-gst-report`

**Request:**
```json
{ "reportType": "GSTR-1", "period": "2026-03", "format": "xlsx" }
```

**Response:**
```json
{
  "success": true,
  "payload": { "jobId": "RPT-GST-001", "status": "Processing", "estimatedTime": 30 }
}
```

---

## Summary

| # | Section | API Endpoint | Method | Fetch/XHR Name |
|---|---------|-------------|--------|----------------|
| 1 | Stats | `/api/admin/tax/stats` | GET | `tax-stats` |
| 2 | Slab Summary | `/api/admin/tax/slabs` | GET | `tax-slabs` |
| 3 | Rules Table | `POST /api/query/admin-tax-rules` | POST (Chenile) | `admin-tax-rules` |
| 4 | HSN Search | `/api/admin/tax/hsn-search` | GET | `hsn-search` |
| 5 | Create Rule | `POST /api/admin/tax/rules` | POST | `create-tax-rule` |
| 6 | Update Rule | `PUT /api/admin/tax/rules/{id}` | PUT | `update-tax-rule` |
| 7 | Delete Rule | `DELETE /api/admin/tax/rules/{id}` | DELETE | `delete-tax-rule` |
| 8 | GST Report | `POST /api/admin/tax/generate-report` | POST | `generate-gst-report` |

**Total API calls on page load: 3 (stats + slabs + rules in parallel)**
