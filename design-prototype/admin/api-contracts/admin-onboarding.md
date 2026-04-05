# Admin Seller Onboarding — API Contract

## Page: admin-onboarding.html

**Note:** Onboarding pipeline uses GET for stats and Chenile `SearchRequest/SearchResponse` for the applications table. Pipeline stages are STM states: `APPLIED -> DOCUMENTS -> VERIFICATION -> TRAINING -> ACTIVE | REJECTED`. Stage transitions use PATCH with STM event IDs.

---

## Section 1: Pipeline Overview

**API:** `GET /api/admin/onboarding/pipeline`
**Fetch/XHR name:** `onboarding-pipeline`

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "stages": [
      { "stage": "Applied", "count": 5 },
      { "stage": "Documents", "count": 3 },
      { "stage": "Verification", "count": 2 },
      { "stage": "Training", "count": 1 },
      { "stage": "Active", "count": 198 }
    ],
    "stats": {
      "totalApplications": 11,
      "thisWeek": 3,
      "approvalRate": 92,
      "avgProcessingDays": 4.2
    }
  }
}
```

---

## Section 2: Applications Table

**API:** `POST /api/query/admin-onboarding`
**Fetch/XHR name:** `admin-onboarding`

**Request (SearchRequest):**
```json
{
  "queryName": "AdminOnboarding.list",
  "pageNum": 1,
  "numRowsInPage": 20,
  "sortCriteria": [{ "name": "appliedDate", "ascendingOrder": false }],
  "filters": {
    "stage": "all",
    "search": ""
  }
}
```

**Filter `stage` values:** `all | applied | documents | verification | training | active | rejected`

**Response (SearchResponse):**
```json
{
  "list": [
    {
      "row": {
        "id": "ONB-001",
        "sellerName": "Raj Sharma Textiles",
        "businessType": "Sole Proprietorship",
        "appliedDate": "2026-03-28",
        "currentStage": "Applied",
        "documentsSubmitted": "1/6",
        "trainingStatus": null
      },
      "allowedActions": ["approve", "reject", "viewDocuments"]
    },
    {
      "row": {
        "id": "ONB-003",
        "sellerName": "Sharma Electronics",
        "businessType": "Pvt Ltd",
        "appliedDate": "2026-03-25",
        "currentStage": "Documents",
        "documentsSubmitted": "3/6",
        "trainingStatus": null
      },
      "allowedActions": ["approve", "reject", "viewDocuments", "requestDocuments"]
    }
  ],
  "totalCount": 11,
  "numRowsInPage": 20
}
```

---

## Section 3: Seller Application Detail

**API:** `GET /api/admin/onboarding/{applicationId}`
**Fetch/XHR name:** `onboarding-detail`

**Response (StateEntityServiceResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "id": "ONB-001",
    "sellerName": "Raj Sharma Textiles",
    "businessType": "Sole Proprietorship",
    "contactEmail": "raj@sharmatextiles.in",
    "contactPhone": "+91 98765 12345",
    "address": "Mumbai, Maharashtra",
    "currentStage": "Applied",
    "appliedDate": "2026-03-28",
    "documents": [
      { "type": "PAN Card", "status": "Uploaded", "url": "/docs/pan.pdf" },
      { "type": "GST Certificate", "status": "Pending", "url": null },
      { "type": "Bank Statement", "status": "Pending", "url": null },
      { "type": "Business Registration", "status": "Pending", "url": null },
      { "type": "Address Proof", "status": "Pending", "url": null },
      { "type": "Cancelled Cheque", "status": "Pending", "url": null }
    ],
    "allowedActions": ["approve", "reject", "requestDocuments"]
  }
}
```

---

## Command: Approve Application (STM Action)

**API:** `PATCH /api/admin/onboarding/{applicationId}/approve`
**Fetch/XHR name:** `approve-onboarding`

**Request:**
```json
{ "note": "All documents verified. Moving to next stage." }
```

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": { "id": "ONB-001", "currentStage": "Documents", "allowedActions": ["approve", "reject", "requestDocuments"] }
}
```

---

## Command: Reject Application (STM Action)

**API:** `PATCH /api/admin/onboarding/{applicationId}/reject`
**Fetch/XHR name:** `reject-onboarding`

**Request:**
```json
{ "reason": "Incomplete business documentation. GSTIN verification failed." }
```

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": { "id": "ONB-001", "currentStage": "Rejected", "allowedActions": [] }
}
```

---

## Command: Request Missing Documents

**API:** `POST /api/admin/onboarding/{applicationId}/requestDocuments`
**Fetch/XHR name:** `request-documents`

**Request:**
```json
{ "documents": ["GST Certificate", "Bank Statement"], "message": "Please upload your GST certificate and recent bank statement." }
```

---

## Allowed Actions Mapping (STM)

| Current Stage | Allowed Actions | Buttons |
|---------------|----------------|---------|
| `APPLIED` | `approve`, `reject`, `viewDocuments` | Approve, Reject |
| `DOCUMENTS` | `approve`, `reject`, `viewDocuments`, `requestDocuments` | Approve, Reject |
| `VERIFICATION` | `approve`, `reject` | Approve, Reject |
| `TRAINING` | `approve`, `reject` | Activate, Reject |
| `ACTIVE` | `view` | View Profile |
| `REJECTED` | `reopen` | Reopen |

---

## Summary

| # | Section | API Endpoint | Method | Fetch/XHR Name |
|---|---------|-------------|--------|----------------|
| 1 | Pipeline | `/api/admin/onboarding/pipeline` | GET | `onboarding-pipeline` |
| 2 | Applications | `POST /api/query/admin-onboarding` | POST (Chenile) | `admin-onboarding` |
| 3 | Detail | `/api/admin/onboarding/{id}` | GET | `onboarding-detail` |
| 4 | Approve | `PATCH /api/admin/onboarding/{id}/approve` | PATCH (STM) | `approve-onboarding` |
| 5 | Reject | `PATCH /api/admin/onboarding/{id}/reject` | PATCH (STM) | `reject-onboarding` |
| 6 | Request Docs | `POST /api/admin/onboarding/{id}/requestDocuments` | POST | `request-documents` |

**Total API calls on page load: 2 (pipeline + applications in parallel)**
