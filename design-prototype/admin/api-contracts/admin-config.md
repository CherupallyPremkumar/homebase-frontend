# Admin Platform Configuration — API Contract

## Page: admin-config.html

**Note:** Configuration is organized into tabs: General, Commission, Payment Gateway, Email Templates, Feature Flags. Each tab reads its section via GET and saves via PUT. Commission rules table uses Chenile `SearchRequest/SearchResponse`.

---

## Section 1: General Settings (Tab 1)

**API (Read):** `GET /api/admin/config/general`
**Fetch/XHR name:** `config-general`

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "platformName": "HomeBase",
    "logoUrl": "/assets/logo.svg",
    "supportEmail": "support@homebase.in",
    "defaultCurrency": "INR",
    "timezone": "IST",
    "maintenanceMode": false
  }
}
```

**API (Save):** `PUT /api/admin/config/general`
**Fetch/XHR name:** `save-config-general`

**Request:**
```json
{
  "platformName": "HomeBase",
  "supportEmail": "support@homebase.in",
  "defaultCurrency": "INR",
  "timezone": "IST",
  "maintenanceMode": false
}
```

---

## Section 2: Commission Structure (Tab 2)

**API (Read):** `POST /api/query/admin-commission-rules`
**Fetch/XHR name:** `admin-commission-rules`

**Request (SearchRequest):**
```json
{
  "queryName": "AdminCommissionRule.list",
  "pageNum": 1,
  "numRowsInPage": 20,
  "sortCriteria": [{ "name": "category", "ascendingOrder": true }],
  "filters": {}
}
```

**Response (SearchResponse):**
```json
{
  "list": [
    {
      "row": {
        "id": "COMM-001",
        "category": "Electronics",
        "commissionPercent": 8.0,
        "minFee": 25,
        "effectiveDate": "2026-01-01"
      },
      "allowedActions": ["edit"]
    },
    {
      "row": {
        "id": "COMM-002",
        "category": "Fashion",
        "commissionPercent": 15.0,
        "minFee": 15,
        "effectiveDate": "2026-01-01"
      },
      "allowedActions": ["edit"]
    }
  ],
  "totalCount": 6,
  "numRowsInPage": 20
}
```

**API (Update Rule):** `PUT /api/admin/config/commission/{ruleId}`

**Request:**
```json
{ "commissionPercent": 10.0, "minFee": 30, "effectiveDate": "2026-04-01" }
```

**API (Add Rule):** `POST /api/admin/config/commission`

---

## Section 3: Payment Gateway (Tab 3)

**API (Read):** `GET /api/admin/config/payment-gateways`
**Fetch/XHR name:** `config-payment`

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": [
    {
      "id": "PG-001",
      "name": "Razorpay",
      "status": "Active",
      "apiKeyMasked": "rzp_live_****...****7kX9",
      "secretKeyMasked": "****...****mN3p",
      "testMode": false,
      "webhookConfigured": true
    },
    {
      "id": "PG-002",
      "name": "PayU",
      "status": "Inactive",
      "apiKeyMasked": "payu_****...****2xQ1",
      "secretKeyMasked": "****...****4rB8",
      "testMode": false,
      "webhookConfigured": false
    }
  ]
}
```

**API (Update):** `PUT /api/admin/config/payment-gateways/{gatewayId}`

**Request:**
```json
{ "status": "Active", "testMode": true }
```

---

## Section 4: Email Templates (Tab 4)

**API (Read):** `GET /api/admin/config/email-templates`
**Fetch/XHR name:** `config-email-templates`

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": [
    { "id": "TPL-001", "name": "Order Confirmation", "subject": "Your order #{orderId} is confirmed!", "lastModified": "2026-02-15" },
    { "id": "TPL-002", "name": "Shipping Update", "subject": "Your order #{orderId} has been shipped!", "lastModified": "2026-02-15" },
    { "id": "TPL-003", "name": "Welcome Email", "subject": "Welcome to HomeBase, {name}!", "lastModified": "2026-01-10" }
  ]
}
```

**API (Update):** `PUT /api/admin/config/email-templates/{templateId}`

---

## Section 5: Feature Flags (Tab 5)

**API (Read):** `GET /api/admin/config/feature-flags`
**Fetch/XHR name:** `config-feature-flags`

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": [
    { "id": "FF-001", "name": "Dark Mode", "key": "dark_mode", "enabled": true, "description": "Enable dark mode for all users" },
    { "id": "FF-002", "name": "AI Recommendations", "key": "ai_recommendations", "enabled": true, "description": "Show AI-powered product recommendations" },
    { "id": "FF-003", "name": "Wallet System", "key": "wallet_system", "enabled": false, "description": "Enable digital wallet for customers" },
    { "id": "FF-004", "name": "Multi-language Support", "key": "multi_language", "enabled": false, "description": "Enable multi-language UI" }
  ]
}
```

**API (Toggle):** `PATCH /api/admin/config/feature-flags/{flagId}/toggle`

**Request:**
```json
{ "enabled": true }
```

---

## Command: Save All Changes

**API:** `PUT /api/admin/config/save`
**Fetch/XHR name:** `save-config`

Batches all changes from the active tab into a single save operation.

---

## Summary

| # | Section | API Endpoint | Method | Fetch/XHR Name |
|---|---------|-------------|--------|----------------|
| 1 | General (Read) | `/api/admin/config/general` | GET | `config-general` |
| 2 | General (Save) | `/api/admin/config/general` | PUT | `save-config-general` |
| 3 | Commission (Read) | `POST /api/query/admin-commission-rules` | POST (Chenile) | `admin-commission-rules` |
| 4 | Commission (Update) | `/api/admin/config/commission/{id}` | PUT | `update-commission` |
| 5 | Payment (Read) | `/api/admin/config/payment-gateways` | GET | `config-payment` |
| 6 | Payment (Update) | `/api/admin/config/payment-gateways/{id}` | PUT | `update-gateway` |
| 7 | Email Templates (Read) | `/api/admin/config/email-templates` | GET | `config-email-templates` |
| 8 | Feature Flags (Read) | `/api/admin/config/feature-flags` | GET | `config-feature-flags` |
| 9 | Feature Flags (Toggle) | `PATCH /api/admin/config/feature-flags/{id}/toggle` | PATCH | `toggle-feature-flag` |

**Total API calls on page load: 1 (active tab only; lazy-load other tabs)**
