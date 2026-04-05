# Seller Settings — API Contract

## Page: seller-settings.html

**Note:** All settings endpoints use standard REST GET/PUT with `GenericResponse` wrapper. These are simple CRUD settings, not Chenile query or STM entities.

---

## Section 1: Store Settings

**Description:** Basic store configuration — store name, description, contact
**API (Read):** `GET /api/seller/settings/store`
**Fetch/XHR name:** `store`

**Response:**
```json
{
  "storeName": "Rajesh Store",
  "storeDescription": "Quality products at the best prices",
  "storeEmail": "rajesh@rajeshstore.com",
  "storePhone": "+91 98765 43210",
  "storeAddress": "Shop No. 42, Ground Floor, Lajpat Nagar Market, New Delhi - 110024",
  "storeUrl": "homebase.in/store/rajesh-store",
  "currency": "INR",
  "language": "en"
}
```

**API (Update):** `PUT /api/seller/settings/store`
**Fetch/XHR name:** `store`

**Request Body:**
```json
{
  "storeName": "Rajesh Store",
  "storeDescription": "Quality products at the best prices",
  "storeEmail": "rajesh@rajeshstore.com",
  "storePhone": "+91 98765 43210",
  "storeAddress": "Shop No. 42, Ground Floor, Lajpat Nagar Market, New Delhi - 110024"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Store settings updated successfully"
}
```

---

## Section 2: Notification Preferences

**Description:** Toggle notification settings for orders, payments, and channels (email, SMS, push)
**API (Read):** `GET /api/seller/settings/notifications`
**Fetch/XHR name:** `notifications`

**Response:**
```json
{
  "orderNotifications": {
    "newOrder": true,
    "orderShipped": true,
    "orderDelivered": false,
    "orderCancelled": true,
    "returnRequest": true
  },
  "paymentNotifications": {
    "paymentReceived": true,
    "settlementProcessed": true,
    "payoutCompleted": true
  },
  "channels": {
    "email": true,
    "sms": true,
    "push": false
  },
  "emailAddress": "rajesh@rajeshstore.com",
  "phoneNumber": "+91 98765 43210"
}
```

**API (Update):** `PUT /api/seller/settings/notifications`
**Fetch/XHR name:** `notifications`

**Request Body:** Same structure as read response.

**Response:**
```json
{
  "success": true,
  "message": "Notification preferences updated successfully"
}
```

---

## Section 3: Shipping Settings

**Description:** Default shipping method, free shipping threshold, shipping zones & rates
**API (Read):** `GET /api/seller/settings/shipping`
**Fetch/XHR name:** `shipping`

**Response:**
```json
{
  "defaultMethod": "STANDARD",
  "freeShippingThreshold": 999,
  "processingTime": "1-2 business days",
  "zones": [
    { "id": "zone-001", "name": "Metro Cities", "deliveryTime": "2-3 days", "rate": 49 },
    { "id": "zone-002", "name": "Tier 2 Cities", "deliveryTime": "3-5 days", "rate": 79 },
    { "id": "zone-003", "name": "Rest of India", "deliveryTime": "5-7 days", "rate": 99 },
    { "id": "zone-004", "name": "Northeast & Remote", "deliveryTime": "7-10 days", "rate": 149 }
  ]
}
```

**API (Update):** `PUT /api/seller/settings/shipping`
**Fetch/XHR name:** `shipping`

**Request Body:** Same structure as read response.

**Response:**
```json
{
  "success": true,
  "message": "Shipping settings updated successfully"
}
```

---

## Section 4: Tax Settings

**Description:** GST configuration — tax inclusive/exclusive, default tax rate, GSTIN
**API (Read):** `GET /api/seller/settings/tax`
**Fetch/XHR name:** `tax`

**Response:**
```json
{
  "taxInclusive": true,
  "defaultTaxRate": 18,
  "gstin": "22AAAAA0000A1Z5",
  "taxCategories": [
    { "name": "Standard Rate", "rate": 18 },
    { "name": "Reduced Rate", "rate": 12 },
    { "name": "Lower Rate", "rate": 5 },
    { "name": "Exempt", "rate": 0 }
  ]
}
```

**API (Update):** `PUT /api/seller/settings/tax`
**Fetch/XHR name:** `tax`

**Request Body:**
```json
{
  "taxInclusive": true,
  "defaultTaxRate": 18,
  "gstin": "22AAAAA0000A1Z5"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tax settings updated successfully"
}
```

---

## Section 5: Account Security

**Description:** Password change, two-factor authentication, active sessions
**API (Change Password):** `PUT /api/seller/settings/security/password`
**Fetch/XHR name:** `password`

**Request Body:**
```json
{
  "currentPassword": "********",
  "newPassword": "********",
  "confirmPassword": "********"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**API (2FA Status):** `GET /api/seller/settings/security/2fa`
**Fetch/XHR name:** `2fa`

**Response:**
```json
{
  "enabled": false,
  "method": null,
  "availableMethods": ["AUTHENTICATOR_APP", "SMS"]
}
```

**API (Enable 2FA):** `POST /api/seller/settings/security/2fa`
**Fetch/XHR name:** `2fa`

**Request Body:**
```json
{
  "method": "AUTHENTICATOR_APP"
}
```

**Response:**
```json
{
  "qrCodeUrl": "otpauth://totp/HomeBase:rajesh@rajeshstore.com?secret=JBSWY3DPEHPK3PXP&issuer=HomeBase",
  "secret": "JBSWY3DPEHPK3PXP",
  "message": "Scan the QR code with your authenticator app"
}
```

**API (Active Sessions):** `GET /api/seller/settings/security/sessions`
**Fetch/XHR name:** `sessions`

**Response:**
```json
{
  "sessions": [
    {
      "id": "sess-001",
      "device": "Chrome on MacOS",
      "ipAddress": "203.0.113.42",
      "location": "New Delhi, India",
      "lastActive": "2026-03-28T10:00:00Z",
      "isCurrent": true
    },
    {
      "id": "sess-002",
      "device": "Safari on iPhone",
      "ipAddress": "203.0.113.88",
      "location": "New Delhi, India",
      "lastActive": "2026-03-27T18:00:00Z",
      "isCurrent": false
    }
  ]
}
```

---

## Summary

| # | Section | API Endpoint | Method | Cache |
|---|---------|-------------|--------|-------|
| 1 | Store Settings (Read) | `/api/seller/settings/store` | GET | 60s |
| 1 | Store Settings (Update) | `/api/seller/settings/store` | PUT | — |
| 2 | Notifications (Read) | `/api/seller/settings/notifications` | GET | 60s |
| 2 | Notifications (Update) | `/api/seller/settings/notifications` | PUT | — |
| 3 | Shipping (Read) | `/api/seller/settings/shipping` | GET | 60s |
| 3 | Shipping (Update) | `/api/seller/settings/shipping` | PUT | — |
| 4 | Tax (Read) | `/api/seller/settings/tax` | GET | 60s |
| 4 | Tax (Update) | `/api/seller/settings/tax` | PUT | — |
| 5 | Change Password | `/api/seller/settings/security/password` | PUT | — |
| 5 | 2FA Status | `/api/seller/settings/security/2fa` | GET | 60s |
| 5 | Enable 2FA | `/api/seller/settings/security/2fa` | POST | — |
| 5 | Active Sessions | `/api/seller/settings/security/sessions` | GET | 30s |

**Total API calls on page load: 6 (parallel — store, notifications, shipping, tax, 2fa, sessions)**

---

## Frontend Integration Pattern

```typescript
// In Next.js page (server component)
export default async function SellerSettings() {
  const [store, notifications, shipping, tax, twoFa, sessions] = await Promise.allSettled([
    sellerApi.settingsStore(),
    sellerApi.settingsNotifications(),
    sellerApi.settingsShipping(),
    sellerApi.settingsTax(),
    sellerApi.settings2faStatus(),
    sellerApi.settingsSessions(),
  ]);

  return (
    <>
      <StoreSettingsSection data={store} />
      <NotificationsSection data={notifications} />
      <ShippingSection data={shipping} />
      <TaxSection data={tax} />
      <SecuritySection twoFa={twoFa} sessions={sessions} />
    </>
  );
}
```

---

## Existing Backend Endpoints

These endpoints already exist in `packages/api-client/src/`:
- None specific to seller settings

**New endpoints needed:**
1. `GET/PUT /api/seller/settings/store` — store settings CRUD
2. `GET/PUT /api/seller/settings/notifications` — notification preferences
3. `GET/PUT /api/seller/settings/shipping` — shipping config
4. `GET/PUT /api/seller/settings/tax` — tax config
5. `PUT /api/seller/settings/security/password` — change password
6. `GET/POST /api/seller/settings/security/2fa` — 2FA management
7. `GET /api/seller/settings/security/sessions` — active sessions
