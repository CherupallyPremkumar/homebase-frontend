# My Account — API Contract

## Page: my-account.html

**Note:** All account endpoints use standard REST GET/PUT/POST/DELETE with `GenericResponse` wrapper. Account settings are not Chenile query or STM entities.

---

## Section 1: Profile Information

**Data needed:** User profile details
**API:** `GET /api/account/profile`

**Response:**
```json
{
  "id": "user-001",
  "fullName": "Premkumar",
  "email": "premkumar@email.com",
  "phone": "+91 98765 43210",
  "avatar": "PK",
  "avatarUrl": null,
  "dateOfBirth": "1990-05-15",
  "gender": "Male",
  "memberSince": "2024-01-15T00:00:00Z",
  "emailVerified": true,
  "phoneVerified": true
}
```

---

## Section 2: Quick Stats (Order Summary Cards)

**Data needed:** Account dashboard stats
**API:** `GET /api/account/stats`

**Response:**
```json
{
  "totalOrders": 12,
  "pendingOrders": 2,
  "wishlistItems": 6,
  "rewardPoints": 2450,
  "totalSpent": 87650,
  "savedAddresses": 2,
  "savedPaymentMethods": 1
}
```

---

## Section 3: Saved Addresses

**Data needed:** User's delivery addresses
**API:** `GET /api/account/addresses`

**Response:**
```json
{
  "addresses": [
    {
      "id": "addr-001",
      "fullName": "Premkumar",
      "phone": "+91 98765 43210",
      "addressLine1": "Flat 402, Sunshine Towers",
      "addressLine2": "MG Road, Koramangala",
      "city": "Bengaluru",
      "state": "Karnataka",
      "postalCode": "560034",
      "country": "IN",
      "type": "Home",
      "isDefault": true
    },
    {
      "id": "addr-002",
      "fullName": "Premkumar",
      "phone": "+91 98765 43210",
      "addressLine1": "3rd Floor, WeWork Galaxy",
      "addressLine2": "Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "postalCode": "560025",
      "country": "IN",
      "type": "Office",
      "isDefault": false
    }
  ]
}
```

---

## Section 4: Saved Payment Methods

**Data needed:** User's saved cards/UPI
**API:** `GET /api/account/payment-methods`

**Response:**
```json
{
  "paymentMethods": [
    {
      "id": "pm-001",
      "type": "credit_card",
      "brand": "Visa",
      "last4": "4242",
      "expiryMonth": 12,
      "expiryYear": 2027,
      "holderName": "Premkumar",
      "isDefault": true
    },
    {
      "id": "pm-002",
      "type": "upi",
      "upiId": "premkumar@gpay",
      "isDefault": false
    }
  ]
}
```

---

## Section 5: Account Settings

**Data needed:** User preferences and notification settings
**API:** `GET /api/account/settings`

**Response:**
```json
{
  "notifications": {
    "orderUpdates": true,
    "promotions": true,
    "newsletter": false,
    "smsAlerts": true
  },
  "privacy": {
    "showProfile": true,
    "shareData": false
  },
  "language": "en",
  "currency": "INR"
}
```

---

## Summary

| # | Section | API Endpoint | Method | Cache |
|---|---------|-------------|--------|-------|
| 1 | Profile | `/api/account/profile` | GET | No |
| 2 | Quick Stats | `/api/account/stats` | GET | 30s |
| 3 | Addresses | `/api/account/addresses` | GET | No |
| 4 | Payment Methods | `/api/account/payment-methods` | GET | No |
| 5 | Settings | `/api/account/settings` | GET | No |

**Total API calls on page load: 5 (parallel)**

---

## User Actions

### Action: Update Profile
**Trigger:** User edits profile fields and clicks Save
**API:** `PUT /api/account/profile`
```json
{
  "fullName": "Premkumar K",
  "phone": "+91 98765 43210",
  "dateOfBirth": "1990-05-15",
  "gender": "Male"
}
```
**Response:** `200 OK` with updated profile

### Action: Change Password
**API:** `PUT /api/account/password`
```json
{
  "currentPassword": "OldP@ss123",
  "newPassword": "NewP@ss456"
}
```
**Response:** `200 OK`
```json
{ "success": true, "message": "Password updated successfully" }
```

### Action: Upload Avatar
**API:** `POST /api/account/avatar`
**Content-Type:** `multipart/form-data`
**Body:** Form data with `file` field
**Response:**
```json
{ "avatarUrl": "/uploads/avatars/user-001.jpg" }
```

### Action: Add Address
**API:** `POST /api/account/addresses`
```json
{
  "fullName": "Premkumar",
  "phone": "+91 98765 43210",
  "addressLine1": "New Address Line 1",
  "addressLine2": "New Address Line 2",
  "city": "Mumbai",
  "state": "Maharashtra",
  "postalCode": "400001",
  "country": "IN",
  "type": "Home"
}
```
**Response:** `201 Created`

### Action: Update Address
**API:** `PUT /api/account/addresses/{addressId}`
```json
{ "addressLine1": "Updated Address", "postalCode": "560035" }
```
**Response:** `200 OK`

### Action: Delete Address
**API:** `DELETE /api/account/addresses/{addressId}`
**Response:** `204 No Content`

### Action: Set Default Address
**API:** `PUT /api/account/addresses/{addressId}/default`
**Response:** `200 OK`

### Action: Add Payment Method
**API:** `POST /api/account/payment-methods`
```json
{
  "type": "credit_card",
  "cardNumber": "4242424242424242",
  "expiryMonth": 12,
  "expiryYear": 2028,
  "holderName": "Premkumar",
  "cvv": "***"
}
```
**Response:** `201 Created`
```json
{ "id": "pm-003", "type": "credit_card", "brand": "Visa", "last4": "4242" }
```

### Action: Delete Payment Method
**API:** `DELETE /api/account/payment-methods/{paymentMethodId}`
**Response:** `204 No Content`

### Action: Update Settings
**API:** `PUT /api/account/settings`
```json
{
  "notifications": { "orderUpdates": true, "promotions": false, "newsletter": false, "smsAlerts": true },
  "language": "en",
  "currency": "INR"
}
```
**Response:** `200 OK`

---

## Frontend Integration Pattern

```typescript
// In Next.js page (server + client hybrid)
export default async function MyAccountPage() {
  const [profile, stats, addresses, paymentMethods, settings] = await Promise.allSettled([
    accountApi.profile(),
    accountApi.stats(),
    accountApi.addresses(),
    accountApi.paymentMethods(),
    accountApi.settings(),
  ]);

  return (
    <AccountLayout sidebar={<AccountSidebar profile={profile} />}>
      <ProfileSection profile={profile} />
      <QuickStats stats={stats} />
      <AddressesSection addresses={addresses} />
      <PaymentMethodsSection methods={paymentMethods} />
      <SettingsSection settings={settings} />
    </AccountLayout>
  );
}
```
