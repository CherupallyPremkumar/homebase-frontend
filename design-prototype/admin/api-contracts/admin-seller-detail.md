# Admin Seller Detail — API Contract

## Page: admin-seller-detail.html

**Note:** Seller detail is a single entity retrieve page using GET with `StateEntityServiceResponse`. Includes store info, business info, products, recent orders, performance metrics, compliance, and quick stats. Admin actions (suspend, contact) use PATCH with STM event IDs. Seller states: `PENDING -> ACTIVE | SUSPENDED | DEACTIVATED`.

---

## Section 1: Seller Retrieve (Full Profile)

**API:** `GET /api/admin/sellers/{sellerId}`
**Fetch/XHR name:** `seller-detail`

**Response (StateEntityServiceResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "id": "SLR-00142",
    "storeName": "Rajesh Store",
    "tier": "Premium Seller",
    "memberSince": "2024-01",
    "rating": 4.6,
    "totalProducts": 89,
    "status": "Active",
    "stateLabel": "Active",
    "storeInfo": {
      "category": "Home & Furniture",
      "description": "Premium home furnishings and decor items...",
      "contactEmail": "rajesh@rajeshstore.in",
      "phone": "+91 98765 43210",
      "address": "42, MG Road, Koramangala, Bangalore, Karnataka 560034"
    },
    "businessInfo": {
      "businessName": "Rajesh Home Furnishings Pvt. Ltd.",
      "businessType": "Private Limited Company",
      "gstin": "29ABCDE1234F1Z5",
      "gstVerified": true,
      "pan": "ABCDE1234F",
      "panVerified": true,
      "bankAccount": "HDFC Bank ****6789"
    },
    "products": { "total": 89, "active": 72, "inactive": 12, "outOfStock": 5 },
    "recentOrders": [
      { "orderId": "HB-10234", "customer": "Ankit Kumar", "amount": 12450, "status": "Delivered", "date": "2026-03-27" },
      { "orderId": "HB-10228", "customer": "Priya Sharma", "amount": 8990, "status": "Shipped", "date": "2026-03-26" }
    ],
    "performance": {
      "fulfillmentRate": 96.5,
      "avgRating": 4.6,
      "responseTimeHours": 2.4,
      "returnRate": 3.2
    },
    "quickStats": {
      "revenue": 452890,
      "orders": 1234,
      "products": 89,
      "rating": 4.6
    },
    "compliance": {
      "gst": { "status": "Verified", "value": "29ABCDE1234F1Z5" },
      "pan": { "status": "Verified", "value": "ABCDE1234F" },
      "bank": { "status": "Verified", "value": "HDFC ****6789" },
      "fssai": null,
      "trademarkDeclaration": { "status": "Signed", "date": "2024-01-15" }
    },
    "allowedActions": ["suspend", "contact", "editCommission"]
  }
}
```

---

## Command: Suspend Seller (STM Action)

**API:** `PATCH /api/admin/sellers/{sellerId}/suspend`
**Fetch/XHR name:** `suspend-seller`

**Request:**
```json
{ "reason": "Multiple counterfeit product complaints", "delistProducts": true }
```

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": { "id": "SLR-00142", "status": "Suspended", "allowedActions": ["reactivate", "contact"] }
}
```

---

## Command: Reactivate Seller (STM Action)

**API:** `PATCH /api/admin/sellers/{sellerId}/reactivate`
**Fetch/XHR name:** `reactivate-seller`

**Request:**
```json
{ "note": "Compliance issues resolved after review" }
```

---

## Command: Contact Seller

**API:** `POST /api/admin/sellers/{sellerId}/contact`
**Fetch/XHR name:** `contact-seller`

**Request:**
```json
{ "subject": "Compliance review required", "message": "Please update your GST certificate...", "method": "email" }
```

---

## Allowed Actions Mapping (STM)

| Current State | Allowed Actions | Buttons |
|---------------|----------------|---------|
| `ACTIVE` | `suspend`, `contact`, `editCommission` | Suspend, Contact |
| `SUSPENDED` | `reactivate`, `contact` | Reactivate, Contact |
| `PENDING` | `approve`, `reject`, `contact` | Approve, Reject |
| `DEACTIVATED` | `reactivate` | Reactivate |

---

## Summary

| # | Section | API Endpoint | Method | Fetch/XHR Name |
|---|---------|-------------|--------|----------------|
| 1 | Retrieve | `/api/admin/sellers/{id}` | GET | `seller-detail` |
| 2 | Suspend | `PATCH /api/admin/sellers/{id}/suspend` | PATCH (STM) | `suspend-seller` |
| 3 | Reactivate | `PATCH /api/admin/sellers/{id}/reactivate` | PATCH (STM) | `reactivate-seller` |
| 4 | Contact | `POST /api/admin/sellers/{id}/contact` | POST | `contact-seller` |

**Total API calls on page load: 1 (single seller GET)**
