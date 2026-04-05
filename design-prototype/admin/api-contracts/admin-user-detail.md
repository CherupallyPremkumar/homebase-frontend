# Admin User Detail — API Contract

## Page: admin-user-detail.html

**Note:** User detail is a single entity retrieve page using GET with `StateEntityServiceResponse`. Includes personal info, order history, activity log, saved addresses, quick stats, and account status. Admin actions (suspend, reactivate) use PATCH with STM event IDs. User states: `ACTIVE | SUSPENDED | DEACTIVATED`.

---

## Section 1: User Retrieve

**API:** `GET /api/admin/users/{userId}`
**Fetch/XHR name:** `user-detail`

**Response (StateEntityServiceResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "id": "USR-05678",
    "name": "Ankit Kumar",
    "email": "ankit.kumar@email.com",
    "phone": "+91 99876 54321",
    "memberSince": "2024-02",
    "accountType": "Customer",
    "status": "Active",
    "stateLabel": "Active",
    "personalInfo": {
      "fullName": "Ankit Kumar",
      "email": "ankit.kumar@email.com",
      "phone": "+91 99876 54321",
      "dob": "1992-08-15",
      "gender": "Male",
      "languages": ["English", "Hindi"]
    },
    "quickStats": {
      "totalOrders": 23,
      "totalSpent": 284560,
      "avgOrderValue": 12372,
      "reviewsWritten": 8
    },
    "accountStatus": {
      "emailVerified": true,
      "phoneVerified": true,
      "walletBalance": 2500,
      "loyaltyPoints": 1840,
      "tier": "Gold"
    },
    "orderHistory": [
      { "orderId": "HB-10234", "items": "Modern Velvet Sofa + 1 more", "amount": 146429, "status": "Shipped", "date": "2026-03-25" },
      { "orderId": "HB-10198", "items": "Cotton Bed Sheet Set", "amount": 3490, "status": "Delivered", "date": "2026-03-18" },
      { "orderId": "HB-10145", "items": "Ceramic Dining Set (6-piece)", "amount": 8999, "status": "Delivered", "date": "2026-03-05" }
    ],
    "activityLog": [
      { "type": "login", "description": "Logged in from Chrome / macOS", "timestamp": "2026-03-28T09:15:00Z", "ip": "103.xx.xx.45" },
      { "type": "order", "description": "Placed order #HB-10234", "timestamp": "2026-03-25T10:30:00Z" },
      { "type": "review", "description": "Wrote review for \"Cotton Bed Sheet Set\" - 5 stars", "timestamp": "2026-03-20T16:45:00Z" },
      { "type": "return", "description": "Initiated return for order #HB-10098", "timestamp": "2026-03-15T11:00:00Z" }
    ],
    "savedAddresses": [
      { "label": "Home", "isDefault": true, "name": "Ankit Kumar", "address": "Flat 402, Prestige Towers, MG Road, Koramangala, Bangalore, Karnataka 560034", "phone": "+91 99876 54321" },
      { "label": "Office", "isDefault": false, "name": "Ankit Kumar", "address": "Floor 3, TechPark One, Whitefield Main Road, Bangalore, Karnataka 560066", "phone": "+91 99876 54321" }
    ],
    "allowedActions": ["suspend", "contact", "resetPassword"]
  }
}
```

---

## Command: Suspend User (STM Action)

**API:** `PATCH /api/admin/users/{userId}/suspend`
**Fetch/XHR name:** `suspend-user`

**Request:**
```json
{ "reason": "Multiple fraudulent payment attempts", "note": "Flagged by anti-fraud system" }
```

**Response:**
```json
{ "success": true, "payload": { "id": "USR-05678", "status": "Suspended", "allowedActions": ["reactivate", "contact"] } }
```

---

## Command: Reactivate User (STM Action)

**API:** `PATCH /api/admin/users/{userId}/reactivate`
**Fetch/XHR name:** `reactivate-user`

**Request:**
```json
{ "note": "Account reviewed, false positive from fraud detection" }
```

**Response:**
```json
{ "success": true, "payload": { "id": "USR-05678", "status": "Active", "allowedActions": ["suspend", "contact", "resetPassword"] } }
```

---

## Command: Contact User

**API:** `POST /api/admin/users/{userId}/contact`
**Fetch/XHR name:** `contact-user`

**Request:**
```json
{ "subject": "Account verification required", "message": "Please verify your identity...", "method": "email" }
```

---

## Command: Force Password Reset

**API:** `PATCH /api/admin/users/{userId}/resetPassword`
**Fetch/XHR name:** `reset-user-password`

**Request:** `{}`

**Response:**
```json
{ "success": true, "payload": { "message": "Password reset email sent to ankit.kumar@email.com" } }
```

---

## Allowed Actions Mapping (STM)

| Current State | Allowed Actions | Buttons |
|---------------|----------------|---------|
| `ACTIVE` | `suspend`, `contact`, `resetPassword` | Suspend, Contact |
| `SUSPENDED` | `reactivate`, `contact` | Reactivate, Contact |
| `DEACTIVATED` | `reactivate` | Reactivate |

---

## Summary

| # | Section | API Endpoint | Method | Fetch/XHR Name |
|---|---------|-------------|--------|----------------|
| 1 | Retrieve | `/api/admin/users/{id}` | GET | `user-detail` |
| 2 | Suspend | `PATCH /api/admin/users/{id}/suspend` | PATCH (STM) | `suspend-user` |
| 3 | Reactivate | `PATCH /api/admin/users/{id}/reactivate` | PATCH (STM) | `reactivate-user` |
| 4 | Contact | `POST /api/admin/users/{id}/contact` | POST | `contact-user` |
| 5 | Reset Password | `PATCH /api/admin/users/{id}/resetPassword` | PATCH | `reset-user-password` |

**Total API calls on page load: 1 (single user GET)**
