# Admin Profile — API Contract

## Page: admin-profile.html

**Note:** Admin profile is a single-page view with personal info, security settings, role/permissions, and login history. All data loaded via a single GET call. Updates use PUT/PATCH for specific sections.

---

## Section 1: Full Profile (Page Load)

**API:** `GET /api/admin/profile`
**Fetch/XHR name:** `admin-profile`

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "personalInfo": {
      "fullName": "Super Admin",
      "email": "admin@homebase.com",
      "emailVerified": true,
      "phone": "+91 98765 43210",
      "phoneVerified": true,
      "location": "Mumbai, Maharashtra, India",
      "lastLogin": { "timestamp": "2026-03-28T08:00:00Z", "ip": "192.168.1.45" }
    },
    "security": {
      "passwordLastChanged": "2026-03-13",
      "twoFactorEnabled": true,
      "activeSessions": 1,
      "apiKeys": 2
    },
    "role": {
      "name": "Platform Admin",
      "accessLevel": "Full Access",
      "permissions": ["Manage Sellers", "Manage Products", "Manage Orders", "Manage Users", "View Analytics", "Manage CMS", "Process Refunds", "System Settings"]
    },
    "loginHistory": [
      { "browser": "Chrome on macOS", "ip": "192.168.1.45", "location": "Mumbai", "timestamp": "2026-03-28T08:00:00Z", "isCurrent": true },
      { "browser": "Chrome on macOS", "ip": "192.168.1.45", "location": "Mumbai", "timestamp": "2026-03-27T09:15:00Z", "isCurrent": false },
      { "browser": "Safari on iPhone", "ip": "103.45.67.89", "location": "Delhi", "timestamp": "2026-03-27T18:30:00Z", "isCurrent": false }
    ]
  }
}
```

---

## Command: Update Personal Info

**API:** `PUT /api/admin/profile/personal`
**Fetch/XHR name:** `update-profile-personal`

**Request:**
```json
{
  "fullName": "Super Admin",
  "email": "admin@homebase.com",
  "phone": "+91 98765 43210",
  "location": "Mumbai, Maharashtra, India"
}
```

---

## Command: Change Password

**API:** `PATCH /api/admin/profile/password`
**Fetch/XHR name:** `change-password`

**Request:**
```json
{ "currentPassword": "****", "newPassword": "****", "confirmPassword": "****" }
```

---

## Command: Toggle Two-Factor Auth

**API:** `PATCH /api/admin/profile/2fa`
**Fetch/XHR name:** `toggle-2fa`

**Request:**
```json
{ "enabled": true, "method": "totp" }
```

---

## Command: Revoke All Sessions

**API:** `POST /api/admin/profile/revoke-sessions`
**Fetch/XHR name:** `revoke-sessions`

**Request:** `{}`

**Response:**
```json
{ "success": true, "payload": { "revokedCount": 1, "message": "All other sessions revoked. Please re-login on other devices." } }
```

---

## Command: Manage API Keys

**API:** `GET /api/admin/profile/api-keys`
**Fetch/XHR name:** `api-keys`

**Response:**
```json
{
  "success": true,
  "payload": [
    { "id": "KEY-001", "name": "CI/CD Pipeline", "lastUsed": "2026-03-27", "createdAt": "2026-01-15", "maskedKey": "hb_****...****3xK9" },
    { "id": "KEY-002", "name": "Monitoring", "lastUsed": "2026-03-28", "createdAt": "2026-02-20", "maskedKey": "hb_****...****7mN2" }
  ]
}
```

---

## Summary

| # | Section | API Endpoint | Method | Fetch/XHR Name |
|---|---------|-------------|--------|----------------|
| 1 | Full Profile | `/api/admin/profile` | GET | `admin-profile` |
| 2 | Update Personal | `/api/admin/profile/personal` | PUT | `update-profile-personal` |
| 3 | Change Password | `/api/admin/profile/password` | PATCH | `change-password` |
| 4 | Toggle 2FA | `/api/admin/profile/2fa` | PATCH | `toggle-2fa` |
| 5 | Revoke Sessions | `/api/admin/profile/revoke-sessions` | POST | `revoke-sessions` |
| 6 | API Keys | `/api/admin/profile/api-keys` | GET | `api-keys` |

**Total API calls on page load: 1 (single profile GET)**
