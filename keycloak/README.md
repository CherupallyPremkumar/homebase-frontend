# HomeBase Keycloak Setup

## Quick Start

```bash
docker compose up -d
```

Keycloak Admin: http://localhost:8180/admin
- Username: admin
- Password: admin

## Test Users

| User | Password | App | Roles |
|------|----------|-----|-------|
| customer@test.com | Test@1234 | Storefront | CUSTOMER |
| seller@test.com | Test@1234 | Seller Central | SELLER |
| warehouse@test.com | Test@1234 | WMS | WAREHOUSE_STAFF |
| ops@test.com | Test@1234 | OMS | OPS_AGENT, OPS_MANAGER |
| finance@test.com | Test@1234 | Finance | FINANCE_ANALYST, FINANCE_MANAGER |
| admin@test.com | Test@1234 | Platform | PLATFORM_ADMIN, SUPER_ADMIN |

## Realm: homebase

6 frontend clients (PKCE, public) + 1 backend client (confidential)
10 realm roles, 6 groups with default role assignments

## Clients

| Client ID | Port | Type |
|-----------|------|------|
| storefront-web | 3000 | Public (PKCE) |
| seller-web | 3002 | Public (PKCE) |
| warehouse-web | 3003 | Public (PKCE) |
| oms-web | 3004 | Public (PKCE) |
| finance-web | 3005 | Public (PKCE) |
| platform-web | 3006 | Public (PKCE) |
| homebase-backend | N/A | Confidential (service account) |

## Custom Theme

The `homebase` login theme is mounted at `keycloak/themes/homebase/`.
It provides branded login, registration, password reset, and email templates.

## Security Settings

- PKCE (S256) required for all frontend clients
- Brute force protection: 5 failures, 60s incremental lockout, max 15 min
- Access token: 5 min TTL
- SSO session: 30 min idle, 10 hr max
- Refresh token: single-use (rotation enabled)
- Password policy: 8+ chars, upper, lower, digit, special char
