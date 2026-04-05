# Admin Users — API Contract

## Page: admin-users.html

**Note:** Users table uses Chenile's `SearchRequest/SearchResponse` pattern via POST. Moderation actions (suspend/reactivate) use PATCH STM events. Stats use REST GET.

---

## Section 1: Page Header

**Data needed:** None
**API:** No API call needed — static content with Export and Add User buttons

---

## Section 2: Stats Cards (4 cards)

**API:** `GET /api/admin/users/stats`

**Response:**
```json
{
  "totalUsers": {
    "value": 45890,
    "trend": 22.1,
    "trendDirection": "up"
  },
  "activeUsers": {
    "value": 42350,
    "trend": 18.4,
    "trendDirection": "up"
  },
  "newThisMonth": {
    "value": 3240,
    "trend": 15.6,
    "trendDirection": "up"
  },
  "suspended": {
    "value": 156,
    "trend": -4.2,
    "trendDirection": "down"
  }
}
```

---

## Section 3: Users Table (paginated, filterable)

**API:** `POST /api/query/admin-users`
**Fetch/XHR name:** `admin-users`

**Request (SearchRequest):**
```json
{
  "queryName": "AdminUser.allUsers",
  "pageNum": 1,
  "numRowsInPage": 8,
  "sortCriteria": [{ "name": "createdTime", "ascendingOrder": false }],
  "filters": { "stateId": "", "search": "", "role": "" }
}
```

**Response:**
```json
{
  "list": [
    {
      "row": {
        "id": "user-001",
        "name": "Ankit Kumar",
        "email": "ankit.kumar@email.com",
        "phone": "+91-9876543210",
        "role": "CUSTOMER",
        "totalOrders": 23,
        "totalSpent": 145600,
        "currency": "INR",
        "stateId": "ACTIVE",
        "lastLogin": "2026-03-28T09:15:00Z",
        "createdTime": "2025-08-12T00:00:00Z",
        "avatar": null
      }
    }
  ],
  "totalCount": 45890,
  "numRowsInPage": 8
}
```

**Note:** Uses Chenile SearchRequest format. Response follows `GenericResponse<User>` wrapper.

---

## Section 4: User Actions (Admin management)

### Suspend User (STM Event)
**API:** `PATCH /api/user/{id}/suspend`
**Fetch/XHR name:** `user/{id}/suspend`

**Request:**
```json
{
  "reason": "Fraudulent activity detected",
  "duration": "30_DAYS",
  "notifyUser": true
}
```

**Response:**
```json
{
  "id": "user-042",
  "stateId": "SUSPENDED",
  "suspendedUntil": "2026-04-28T00:00:00Z",
  "updatedTime": "2026-03-28T10:30:00Z",
  "suspendedBy": "admin-001"
}
```

### Reactivate User (STM Event)
**API:** `PATCH /api/user/{id}/reactivate`
**Fetch/XHR name:** `user/{id}/reactivate`

**Request:**
```json
{
  "reason": "Account review completed, no violations found"
}
```

**Response:**
```json
{
  "id": "user-042",
  "stateId": "ACTIVE",
  "updatedTime": "2026-03-28T10:35:00Z",
  "reactivatedBy": "admin-001"
}
```

### View User Detail
**API:** `GET /api/admin/users/{id}`

**Response:**
```json
{
  "id": "user-001",
  "name": "Ankit Kumar",
  "email": "ankit.kumar@email.com",
  "phone": "+91-9876543210",
  "role": "CUSTOMER",
  "totalOrders": 23,
  "totalSpent": 145600,
  "stateId": "ACTIVE",
  "lastLogin": "2026-03-28T09:15:00Z",
  "createdTime": "2025-08-12T00:00:00Z",
  "addresses": [
    {
      "id": "addr-001",
      "line1": "456 Park Street",
      "city": "Delhi",
      "state": "Delhi",
      "pincode": "110001",
      "isDefault": true
    }
  ],
  "recentOrders": 5,
  "averageOrderValue": 6330
}
```

### Bulk Action
**API:** `POST /api/admin/users/bulk-action`

**Request:**
```json
{
  "userIds": ["user-042", "user-043", "user-044"],
  "action": "SUSPEND",
  "reason": "Spam accounts detected"
}
```

**Response:**
```json
{
  "processed": 3,
  "failed": 0,
  "results": [
    { "id": "user-042", "stateId": "SUSPENDED" },
    { "id": "user-043", "stateId": "SUSPENDED" },
    { "id": "user-044", "stateId": "SUSPENDED" }
  ]
}
```

---

## Summary

| # | Section | API Endpoint | Method | Cache |
|---|---------|-------------|--------|-------|
| 1 | Page Header | None (static) | — | — |
| 2 | Stats Cards | `/api/admin/users/stats` | GET | 30s |
| 3 | Users Table | `/api/query/admin-users` | POST (Chenile Query) | 30s |
| 4a | Suspend User | `/api/user/{id}/suspend` | PATCH (STM Event) | — |
| 4b | Reactivate User | `/api/user/{id}/reactivate` | PATCH (STM Event) | — |
| 4c | User Detail | `/api/user/{id}` | GET (Command Retrieve) | 30s |
| 4d | Bulk Action | `/api/admin/users/bulk-action` | POST | — |

**Total API calls on page load: 2 (parallel)**
**Total admin action endpoints: 3**

---

## Frontend Integration Pattern

```typescript
export default async function AdminUsers() {
  const [stats, users] = await Promise.allSettled([
    adminApi.userStats(),
    adminApi.users({ pageSize: 8, sortBy: 'createdTime', sortOrder: 'desc' }),
  ]);

  return (
    <>
      <PageHeader />
      <StatsCards data={stats} />
      <FiltersBar />
      <UsersTable data={users} />
    </>
  );
}
```

---

## New Endpoints Needed

1. `GET /api/admin/users/stats` — user status and growth stats
2. `POST /api/query/admin-users` — paginated user listing (Chenile query)
3. `GET /api/user/{id}` — single user detail (Command Retrieve)
4. `PATCH /api/user/{id}/suspend` — suspend user account (STM event)
5. `PATCH /api/user/{id}/reactivate` — reactivate user account (STM event)
6. `POST /api/admin/users/bulk-action` — bulk suspend/reactivate

---

## Allowed Actions -> UI Mapping

The backend returns `allowedActions` per row based on the entity's current state (STM).
The frontend reads these and renders only the allowed buttons.

**STM Source:** `user-states.xml` (user-flow)
**Admin ACL filter:** Events with `ADMIN` in `meta-acls`.

### State -> Allowed Actions -> UI Buttons

| State | allowedActions (admin-visible) | UI Button | Icon | Color | Event ID |
|-------|------------------------------|-----------|------|-------|----------|
| REGISTERED | deactivate | Deactivate | UserX | red | deactivate |
| EMAIL_VERIFIED | activate | Activate | Power | green | activate |
| EMAIL_VERIFIED | deactivate | Deactivate | UserX | red | deactivate |
| ACTIVE | suspend | Suspend | PauseCircle | red | suspend |
| ACTIVE | deactivate | Deactivate | UserX | red | deactivate |
| KYC_PENDING | verifyKyc | Verify KYC | ShieldCheck | green | verifyKyc |
| KYC_PENDING | suspend | Suspend | PauseCircle | red | suspend |
| KYC_PENDING | deactivate | Deactivate | UserX | red | deactivate |
| KYC_VERIFIED | suspend | Suspend | PauseCircle | red | suspend |
| KYC_VERIFIED | deactivate | Deactivate | UserX | red | deactivate |
| LOCKED | unlockAccount | Unlock Account | Unlock | green | unlockAccount |
| LOCKED | deactivate | Deactivate | UserX | red | deactivate |
| SUSPENDED | reinstateUser | Reinstate | PlayCircle | green | reinstateUser |
| SUSPENDED | deactivate | Deactivate | UserX | red | deactivate |
| DEACTIVATED | -- | (read-only, terminal) | -- | -- | -- |

### Frontend Pattern

```typescript
const ADMIN_USER_ACTION_CONFIG: Record<string, ActionButtonConfig> = {
  suspend: { label: 'Suspend', icon: 'PauseCircle', color: 'red' },
  deactivate: { label: 'Deactivate', icon: 'UserX', color: 'red' },
  reinstateUser: { label: 'Reinstate', icon: 'PlayCircle', color: 'green' },
  unlockAccount: { label: 'Unlock Account', icon: 'Unlock', color: 'green' },
  verifyKyc: { label: 'Verify KYC', icon: 'ShieldCheck', color: 'green' },
  activate: { label: 'Activate', icon: 'Power', color: 'green' },
};

// Render only allowed actions
{allowedActions.map(a => {
  const config = ADMIN_USER_ACTION_CONFIG[a.allowedAction];
  return config ? <ActionButton {...config} onClick={() => triggerEvent(id, a.allowedAction)} /> : null;
})}
```
