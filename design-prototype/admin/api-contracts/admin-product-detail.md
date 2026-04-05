# Admin Product Detail — API Contract

## Page: admin-product-detail.html

**Note:** Product detail is a single entity retrieve page using GET with `StateEntityServiceResponse`. Admin moderation actions (approve, flag, remove) use PATCH with STM event IDs. Product states: `DRAFT -> PENDING_REVIEW -> ACTIVE | FLAGGED -> REMOVED`.

---

## Section 1: Product Retrieve

**API:** `GET /api/admin/products/{productId}`
**Fetch/XHR name:** `product-detail`

**Response (StateEntityServiceResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "id": "PRD-00142",
    "name": "Modern Velvet Sofa",
    "sku": "HB-FUR-00142",
    "category": "Furniture",
    "brand": "LuxeLiving Co.",
    "listedDate": "2026-03-15",
    "status": "Active",
    "stateLabel": "Active",
    "pricing": {
      "mrp": 149900,
      "sellingPrice": 129900,
      "discount": 13,
      "currency": "INR"
    },
    "stock": 45,
    "description": "Premium modern velvet sofa with solid wood frame...",
    "keyFeatures": [
      "Premium velvet upholstery",
      "Solid wood frame construction",
      "High-density foam cushioning",
      "Seats 3 comfortably",
      "2-year warranty included"
    ],
    "reviews": {
      "avgRating": 4.5,
      "totalReviews": 128,
      "distribution": { "5": 65, "4": 20, "3": 8, "2": 4, "1": 3 }
    },
    "seller": {
      "id": "SLR-00142",
      "name": "LuxeLiving Co.",
      "tier": "Premium Seller",
      "since": "2024",
      "rating": 4.7,
      "products": 156,
      "orders": 2340
    },
    "metadata": {
      "createdAt": "2026-03-15",
      "updatedAt": "2026-03-27",
      "views": 1245,
      "orders": 89,
      "returns": 3,
      "returnRate": 3.4,
      "gstRate": 18,
      "hsnCode": "94016100",
      "weight": "45 kg",
      "dimensions": "200x85x80 cm"
    },
    "shipping": {
      "shippingWeight": "48 kg",
      "freeShipping": true,
      "estDelivery": "5-7 business days",
      "returnable": true,
      "returnWindow": 30
    },
    "moderationHistory": [
      { "action": "Approved", "by": "Super Admin", "timestamp": "2026-03-15T10:30:00Z" },
      { "action": "Submitted for review", "by": "LuxeLiving Co.", "timestamp": "2026-03-14T15:45:00Z" },
      { "action": "Draft created", "by": "LuxeLiving Co.", "timestamp": "2026-03-14T14:00:00Z" }
    ],
    "allowedActions": ["flag", "remove"]
  }
}
```

---

## Command: Approve Product (STM Action)

**API:** `PATCH /api/admin/products/{productId}/approve`
**Fetch/XHR name:** `approve-product`

**Request:**
```json
{ "note": "Product meets all listing guidelines" }
```

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": { "id": "PRD-00142", "status": "Active", "allowedActions": ["flag", "remove"] }
}
```

---

## Command: Flag Product (STM Action)

**API:** `PATCH /api/admin/products/{productId}/flag`
**Fetch/XHR name:** `flag-product`

**Request:**
```json
{ "reason": "Misleading product images", "note": "Images do not match actual product dimensions" }
```

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": { "id": "PRD-00142", "status": "Flagged", "allowedActions": ["approve", "remove"] }
}
```

---

## Command: Remove Product (STM Action)

**API:** `PATCH /api/admin/products/{productId}/remove`
**Fetch/XHR name:** `remove-product`

**Request:**
```json
{ "reason": "Counterfeit product", "notifySeller": true }
```

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": { "id": "PRD-00142", "status": "Removed", "allowedActions": [] }
}
```

---

## Allowed Actions Mapping (STM)

| Current State | Allowed Actions | Buttons |
|---------------|----------------|---------|
| `PENDING_REVIEW` | `approve`, `flag`, `remove` | Approve, Flag, Remove |
| `ACTIVE` | `flag`, `remove` | Flag, Remove |
| `FLAGGED` | `approve`, `remove` | Approve, Remove |
| `REMOVED` | — | — |

---

## Summary

| # | Section | API Endpoint | Method | Fetch/XHR Name |
|---|---------|-------------|--------|----------------|
| 1 | Retrieve | `/api/admin/products/{id}` | GET | `product-detail` |
| 2 | Approve | `PATCH /api/admin/products/{id}/approve` | PATCH (STM) | `approve-product` |
| 3 | Flag | `PATCH /api/admin/products/{id}/flag` | PATCH (STM) | `flag-product` |
| 4 | Remove | `PATCH /api/admin/products/{id}/remove` | PATCH (STM) | `remove-product` |

**Total API calls on page load: 1 (single product GET)**
