# RBAC Permissions Matrix

Complete role-based access control matrix for the HomeBase platform.

## Roles

| Role | Code | Description |
|------|------|-------------|
| Customer | `CUSTOMER` | End user who browses, purchases, and manages their own orders |
| Supplier (Seller) | `SUPPLIER` | Merchant who lists products, manages inventory, and fulfils orders |
| Admin | `ADMIN` | Platform moderator who reviews content, manages sellers, and handles escalations |
| Warehouse Manager | `WAREHOUSE` | Warehouse operator who handles receiving, picking, packing, and shipping |
| Platform Admin | `PLATFORM_ADMIN` | Super-admin with full platform access including system settings and compliance |

## Legend

| Symbol | Meaning |
|--------|---------|
| Y | Full access |
| O | Own data only (scoped to the user or their tenant) |
| N | No access |
| -- | Not applicable to this role |

---

## 1. Products

| Resource | Action | CUSTOMER | SUPPLIER | ADMIN | WAREHOUSE | PLATFORM_ADMIN |
|----------|--------|----------|----------|-------|-----------|----------------|
| Products | View (published) | Y | Y | Y | Y | Y |
| Products | View (draft / unpublished) | N | O | Y | N | Y |
| Products | Create | N | Y | N | N | Y |
| Products | Edit | N | O | N | N | Y |
| Products | Delete | N | O | N | N | Y |
| Products | Publish / Unpublish | N | O | N | N | Y |
| Products | Approve | N | N | Y | N | Y |
| Products | Flag for review | N | N | Y | N | Y |
| Products | Moderate (remove / restore) | N | N | Y | N | Y |
| Products | Bulk import | N | Y | N | N | Y |
| Products | View all (cross-seller) | N | N | Y | N | Y |

## 2. Orders

| Resource | Action | CUSTOMER | SUPPLIER | ADMIN | WAREHOUSE | PLATFORM_ADMIN |
|----------|--------|----------|----------|-------|-----------|----------------|
| Orders | View own | O | O | -- | -- | Y |
| Orders | View all | N | N | Y | Y | Y |
| Orders | Create (place order) | Y | N | N | N | Y |
| Orders | Confirm | N | O | Y | N | Y |
| Orders | Ship | N | O | Y | Y | Y |
| Orders | Cancel (own) | O | O | -- | -- | Y |
| Orders | Cancel (any) | N | N | Y | N | Y |
| Orders | Refund | N | N | Y | N | Y |
| Orders | View order history | O | O | Y | Y | Y |
| Orders | Download invoice | O | O | Y | N | Y |

## 3. Returns

| Resource | Action | CUSTOMER | SUPPLIER | ADMIN | WAREHOUSE | PLATFORM_ADMIN |
|----------|--------|----------|----------|-------|-----------|----------------|
| Returns | Request | O | N | N | N | Y |
| Returns | View own | O | O | -- | -- | Y |
| Returns | View all | N | N | Y | Y | Y |
| Returns | Approve | N | O | Y | N | Y |
| Returns | Reject | N | O | Y | N | Y |
| Returns | Process refund | N | N | Y | N | Y |
| Returns | Receive returned item | N | N | N | Y | Y |

## 4. Users

| Resource | Action | CUSTOMER | SUPPLIER | ADMIN | WAREHOUSE | PLATFORM_ADMIN |
|----------|--------|----------|----------|-------|-----------|----------------|
| Users | View own profile | O | O | O | O | O |
| Users | Edit own profile | O | O | O | O | O |
| Users | View all users | N | N | Y | N | Y |
| Users | Create user | N | N | Y | N | Y |
| Users | Suspend user | N | N | Y | N | Y |
| Users | Reactivate user | N | N | Y | N | Y |
| Users | Delete user | N | N | N | N | Y |
| Users | Manage roles | N | N | N | N | Y |
| Users | Assign role | N | N | Y | N | Y |
| Users | View audit log | N | N | Y | N | Y |

## 5. Sellers

| Resource | Action | CUSTOMER | SUPPLIER | ADMIN | WAREHOUSE | PLATFORM_ADMIN |
|----------|--------|----------|----------|-------|-----------|----------------|
| Sellers | Register | N | Y | N | N | Y |
| Sellers | Manage own store | N | O | N | N | Y |
| Sellers | View storefront (public) | Y | Y | Y | N | Y |
| Sellers | View all sellers | N | N | Y | N | Y |
| Sellers | Approve | N | N | Y | N | Y |
| Sellers | Suspend | N | N | Y | N | Y |
| Sellers | Reactivate | N | N | Y | N | Y |
| Sellers | View seller analytics | N | O | Y | N | Y |
| Sellers | Edit seller details (admin) | N | N | Y | N | Y |

## 6. Inventory

| Resource | Action | CUSTOMER | SUPPLIER | ADMIN | WAREHOUSE | PLATFORM_ADMIN |
|----------|--------|----------|----------|-------|-----------|----------------|
| Inventory | View own stock | N | O | -- | -- | Y |
| Inventory | View all stock | N | N | Y | Y | Y |
| Inventory | Update stock (own) | N | O | N | Y | Y |
| Inventory | Update stock (any) | N | N | Y | Y | Y |
| Inventory | Transfer stock | N | N | N | Y | Y |
| Inventory | Damage write-off | N | N | N | Y | Y |
| Inventory | View stock history | N | O | Y | Y | Y |
| Inventory | Set reorder threshold | N | O | N | Y | Y |
| Inventory | View low-stock alerts | N | O | Y | Y | Y |

## 7. Reviews

| Resource | Action | CUSTOMER | SUPPLIER | ADMIN | WAREHOUSE | PLATFORM_ADMIN |
|----------|--------|----------|----------|-------|-----------|----------------|
| Reviews | Write | O | N | N | N | N |
| Reviews | Edit own | O | N | N | N | N |
| Reviews | Delete own | O | N | N | N | Y |
| Reviews | Reply (as seller) | N | O | N | N | Y |
| Reviews | View (public) | Y | Y | Y | N | Y |
| Reviews | Moderate (approve) | N | N | Y | N | Y |
| Reviews | Moderate (flag) | N | N | Y | N | Y |
| Reviews | Moderate (remove) | N | N | Y | N | Y |
| Reviews | View flagged | N | N | Y | N | Y |

## 8. Promotions

| Resource | Action | CUSTOMER | SUPPLIER | ADMIN | WAREHOUSE | PLATFORM_ADMIN |
|----------|--------|----------|----------|-------|-----------|----------------|
| Promotions | View active (public) | Y | Y | Y | N | Y |
| Promotions | View all | N | N | Y | N | Y |
| Promotions | Create (seller-level) | N | O | N | N | Y |
| Promotions | Create (platform-wide) | N | N | Y | N | Y |
| Promotions | Edit own | N | O | N | N | Y |
| Promotions | Edit any | N | N | Y | N | Y |
| Promotions | Activate / Pause | N | O | Y | N | Y |
| Promotions | Delete | N | O | Y | N | Y |
| Promotions | View performance metrics | N | O | Y | N | Y |

## 9. Analytics

| Resource | Action | CUSTOMER | SUPPLIER | ADMIN | WAREHOUSE | PLATFORM_ADMIN |
|----------|--------|----------|----------|-------|-----------|----------------|
| Analytics | View own order history | O | -- | -- | -- | Y |
| Analytics | View own store analytics | N | O | -- | -- | Y |
| Analytics | View warehouse metrics | N | N | N | O | Y |
| Analytics | View platform-wide analytics | N | N | Y | N | Y |
| Analytics | Export reports (own) | N | O | -- | O | Y |
| Analytics | Export reports (platform) | N | N | Y | N | Y |
| Analytics | View revenue dashboard | N | O | Y | N | Y |
| Analytics | View customer insights | N | N | Y | N | Y |

## 10. Settings

| Resource | Action | CUSTOMER | SUPPLIER | ADMIN | WAREHOUSE | PLATFORM_ADMIN |
|----------|--------|----------|----------|-------|-----------|----------------|
| Settings | Manage own settings | O | O | O | O | O |
| Settings | Manage notification preferences | O | O | O | O | O |
| Settings | Manage store settings | N | O | N | N | Y |
| Settings | Manage platform settings | N | N | N | N | Y |
| Settings | Manage fee structure | N | N | N | N | Y |
| Settings | Manage email templates | N | N | Y | N | Y |
| Settings | Manage payment gateways | N | N | N | N | Y |
| Settings | Manage shipping providers | N | N | Y | N | Y |

## 11. Warehouse Operations

| Resource | Action | CUSTOMER | SUPPLIER | ADMIN | WAREHOUSE | PLATFORM_ADMIN |
|----------|--------|----------|----------|-------|-----------|----------------|
| Warehouse | Receive shipment | N | N | N | Y | Y |
| Warehouse | Pick items | N | N | N | Y | Y |
| Warehouse | Pack order | N | N | N | Y | Y |
| Warehouse | Ship / Dispatch | N | N | N | Y | Y |
| Warehouse | Generate labels | N | N | N | Y | Y |
| Warehouse | Manage bins / locations | N | N | N | Y | Y |
| Warehouse | View warehouse dashboard | N | N | Y | Y | Y |
| Warehouse | Manage warehouse staff | N | N | N | N | Y |
| Warehouse | Cycle count | N | N | N | Y | Y |
| Warehouse | View dispatch history | N | N | Y | Y | Y |

## 12. CMS (Content Management)

| Resource | Action | CUSTOMER | SUPPLIER | ADMIN | WAREHOUSE | PLATFORM_ADMIN |
|----------|--------|----------|----------|-------|-----------|----------------|
| CMS | View published pages | Y | Y | Y | Y | Y |
| CMS | View all pages (including drafts) | N | N | Y | N | Y |
| CMS | Create page | N | N | Y | N | Y |
| CMS | Edit page | N | N | Y | N | Y |
| CMS | Publish / Unpublish | N | N | Y | N | Y |
| CMS | Delete page | N | N | N | N | Y |
| CMS | Manage banners | N | N | Y | N | Y |
| CMS | Manage categories | N | N | Y | N | Y |

## 13. Support

| Resource | Action | CUSTOMER | SUPPLIER | ADMIN | WAREHOUSE | PLATFORM_ADMIN |
|----------|--------|----------|----------|-------|-----------|----------------|
| Support | Create ticket | O | O | O | O | O |
| Support | View own tickets | O | O | O | O | O |
| Support | View all tickets | N | N | Y | N | Y |
| Support | Respond to own ticket | O | O | O | O | O |
| Support | Respond to any ticket | N | N | Y | N | Y |
| Support | Assign ticket | N | N | Y | N | Y |
| Support | Close ticket | O | O | Y | O | Y |
| Support | Escalate ticket | N | N | Y | N | Y |
| Support | View support analytics | N | N | Y | N | Y |

## 14. Settlements / Payouts

| Resource | Action | CUSTOMER | SUPPLIER | ADMIN | WAREHOUSE | PLATFORM_ADMIN |
|----------|--------|----------|----------|-------|-----------|----------------|
| Settlements | View own | N | O | -- | -- | Y |
| Settlements | View all | N | N | Y | N | Y |
| Settlements | Request payout | N | O | N | N | Y |
| Settlements | Process payout | N | N | Y | N | Y |
| Settlements | View payout history (own) | N | O | -- | -- | Y |
| Settlements | View payout history (all) | N | N | Y | N | Y |
| Settlements | Configure payout schedule | N | N | N | N | Y |
| Settlements | View commission reports | N | O | Y | N | Y |

## 15. Documents

| Resource | Action | CUSTOMER | SUPPLIER | ADMIN | WAREHOUSE | PLATFORM_ADMIN |
|----------|--------|----------|----------|-------|-----------|----------------|
| Documents | Upload own | N | O | N | N | Y |
| Documents | View own | N | O | O | N | O |
| Documents | View all | N | N | Y | N | Y |
| Documents | Verify | N | N | Y | N | Y |
| Documents | Approve | N | N | Y | N | Y |
| Documents | Reject | N | N | Y | N | Y |
| Documents | Delete own | N | O | N | N | Y |
| Documents | Delete any | N | N | N | N | Y |

## 16. Compliance

| Resource | Action | CUSTOMER | SUPPLIER | ADMIN | WAREHOUSE | PLATFORM_ADMIN |
|----------|--------|----------|----------|-------|-----------|----------------|
| Compliance | View own status | N | O | -- | -- | Y |
| Compliance | View all | N | N | Y | N | Y |
| Compliance | Review submission | N | N | Y | N | Y |
| Compliance | Approve | N | N | Y | N | Y |
| Compliance | Reject | N | N | Y | N | Y |
| Compliance | Request re-submission | N | N | Y | N | Y |
| Compliance | Configure rules | N | N | N | N | Y |
| Compliance | View compliance audit log | N | N | Y | N | Y |

## 17. Categories

| Resource | Action | CUSTOMER | SUPPLIER | ADMIN | WAREHOUSE | PLATFORM_ADMIN |
|----------|--------|----------|----------|-------|-----------|----------------|
| Categories | View | Y | Y | Y | N | Y |
| Categories | Create | N | N | Y | N | Y |
| Categories | Edit | N | N | Y | N | Y |
| Categories | Delete | N | N | Y | N | Y |
| Categories | Reorder / Nest | N | N | Y | N | Y |

## 18. Tax and GST

| Resource | Action | CUSTOMER | SUPPLIER | ADMIN | WAREHOUSE | PLATFORM_ADMIN |
|----------|--------|----------|----------|-------|-----------|----------------|
| Tax & GST | View tax rules | N | O | Y | N | Y |
| Tax & GST | Create tax rule | N | N | Y | N | Y |
| Tax & GST | Edit tax rule | N | N | Y | N | Y |
| Tax & GST | Delete tax rule | N | N | Y | N | Y |
| Tax & GST | Update GST rates | N | N | Y | N | Y |
| Tax & GST | Generate GST report | N | N | Y | N | Y |

## 19. Shipping

| Resource | Action | CUSTOMER | SUPPLIER | ADMIN | WAREHOUSE | PLATFORM_ADMIN |
|----------|--------|----------|----------|-------|-----------|----------------|
| Shipping | View carriers | N | Y | Y | Y | Y |
| Shipping | Add carrier | N | N | Y | N | Y |
| Shipping | Edit carrier | N | N | Y | N | Y |
| Shipping | Deactivate carrier | N | N | Y | N | Y |
| Shipping | Manage zones | N | N | Y | N | Y |
| Shipping | Update SLAs | N | N | Y | N | Y |

## 20. Reports

| Resource | Action | CUSTOMER | SUPPLIER | ADMIN | WAREHOUSE | PLATFORM_ADMIN |
|----------|--------|----------|----------|-------|-----------|----------------|
| Reports | View own reports | N | O | -- | -- | Y |
| Reports | View all reports | N | N | Y | N | Y |
| Reports | Generate report | N | N | Y | N | Y |
| Reports | Schedule report | N | N | Y | N | Y |
| Reports | Download report | N | O | Y | N | Y |
| Reports | Delete report | N | N | N | N | Y |

## 21. Configuration

| Resource | Action | CUSTOMER | SUPPLIER | ADMIN | WAREHOUSE | PLATFORM_ADMIN |
|----------|--------|----------|----------|-------|-----------|----------------|
| Configuration | View configuration | N | N | N | N | Y |
| Configuration | Update configuration | N | N | N | N | Y |
| Configuration | Toggle feature flags | N | N | N | N | Y |
| Configuration | Manage templates | N | N | N | N | Y |

## 22. Disputes

| Resource | Action | CUSTOMER | SUPPLIER | ADMIN | WAREHOUSE | PLATFORM_ADMIN |
|----------|--------|----------|----------|-------|-----------|----------------|
| Disputes | File dispute | O | N | N | N | Y |
| Disputes | View own disputes | O | O | -- | -- | Y |
| Disputes | View all disputes | N | N | Y | N | Y |
| Disputes | Respond to dispute | N | O | Y | N | Y |
| Disputes | Resolve dispute | N | N | Y | N | Y |
| Disputes | Escalate dispute | N | N | Y | N | Y |
| Disputes | Assign dispute | N | N | Y | N | Y |

## 23. Audit Log

| Resource | Action | CUSTOMER | SUPPLIER | ADMIN | WAREHOUSE | PLATFORM_ADMIN |
|----------|--------|----------|----------|-------|-----------|----------------|
| Audit Log | View audit log | N | N | Y | N | Y |
| Audit Log | Export audit log | N | N | Y | N | Y |
| Audit Log | Filter / Search | N | N | Y | N | Y |

## 24. Refunds

| Resource | Action | CUSTOMER | SUPPLIER | ADMIN | WAREHOUSE | PLATFORM_ADMIN |
|----------|--------|----------|----------|-------|-----------|----------------|
| Refunds | View own refunds | O | O | -- | -- | Y |
| Refunds | View all refunds | N | N | Y | N | Y |
| Refunds | Process refund | N | N | Y | N | Y |
| Refunds | Retry failed refund | N | N | Y | N | Y |
| Refunds | Cancel pending refund | N | N | Y | N | Y |

## 25. Onboarding

| Resource | Action | CUSTOMER | SUPPLIER | ADMIN | WAREHOUSE | PLATFORM_ADMIN |
|----------|--------|----------|----------|-------|-----------|----------------|
| Onboarding | Submit application | N | O | N | N | Y |
| Onboarding | View own application | N | O | -- | -- | Y |
| Onboarding | View all applications | N | N | Y | N | Y |
| Onboarding | Approve application | N | N | Y | N | Y |
| Onboarding | Reject application | N | N | Y | N | Y |
| Onboarding | Request documents | N | N | Y | N | Y |
| Onboarding | Send reminder | N | N | Y | N | Y |

## 26. Seller Coupons

| Resource | Action | CUSTOMER | SUPPLIER | ADMIN | WAREHOUSE | PLATFORM_ADMIN |
|----------|--------|----------|----------|-------|-----------|----------------|
| Seller Coupons | View own coupons | N | O | -- | -- | Y |
| Seller Coupons | View all coupons | N | N | Y | N | Y |
| Seller Coupons | Create coupon | N | O | Y | N | Y |
| Seller Coupons | Edit own coupon | N | O | -- | N | Y |
| Seller Coupons | Edit any coupon | N | N | Y | N | Y |
| Seller Coupons | Activate / Deactivate (own) | N | O | -- | N | Y |
| Seller Coupons | Activate / Deactivate (any) | N | N | Y | N | Y |
| Seller Coupons | Delete own coupon | N | O | -- | N | Y |
| Seller Coupons | Delete any coupon | N | N | Y | N | Y |

## 27. Seller Earnings

| Resource | Action | CUSTOMER | SUPPLIER | ADMIN | WAREHOUSE | PLATFORM_ADMIN |
|----------|--------|----------|----------|-------|-----------|----------------|
| Seller Earnings | View own earnings | N | O | -- | -- | Y |
| Seller Earnings | View all earnings | N | N | Y | N | Y |
| Seller Earnings | Export own earnings | N | O | -- | -- | Y |
| Seller Earnings | Export all earnings | N | N | Y | N | Y |

---

## Data Visibility Rules

These rules govern what data each role can see, independent of individual action permissions.

| Rule | Description |
|------|-------------|
| Customer isolation | Customers see only their own orders, addresses, reviews, tickets, and payment methods. They never see another customer's data. |
| Supplier isolation | Suppliers see only their own products, orders (containing their items), inventory, settlements, and analytics. They cannot see other suppliers' data. |
| Admin cross-tenant visibility | Admins see all customers, suppliers, products, orders, and reviews. They can filter by supplier or customer. |
| Warehouse scoped visibility | Warehouse managers see all orders in fulfilment-related states (confirmed, picking, packing, shipped). They see full inventory but not financial data such as settlements or revenue. |
| Platform Admin full visibility | Platform Admins have unrestricted access to all data across all tenants, including system settings and audit logs. |
| Public data | Published product listings, active promotions, and published CMS pages are visible to all roles including unauthenticated visitors. |
| Sensitive field masking | Even when a role has view access, certain fields are masked: customer payment details (visible only to the customer), supplier bank details (visible only to the supplier and Platform Admin), full tax IDs (masked for Admin, full for Platform Admin). |

---

## Multi-Tenant Filtering Rules

HomeBase is multi-tenant at the supplier level. The following rules ensure data isolation.

| Rule | Implementation |
|------|----------------|
| Supplier tenant ID | Every supplier-owned entity (product, order item, inventory record, settlement) carries a `tenantId` matching the supplier's ID. |
| Automatic query filter | All queries from a `SUPPLIER` session inject `WHERE tenant_id = :currentTenantId` automatically via the Chenile query service filter enhancement layer. |
| Admin bypass | `ADMIN` and `PLATFORM_ADMIN` roles bypass the tenant filter. They may optionally filter by tenant via a query parameter. |
| Customer tenant-agnostic | Customers are not scoped to a supplier tenant. Their data is isolated by `customerId`, not `tenantId`. |
| Warehouse cross-tenant | Warehouse managers operate across supplier tenants since fulfilment may span multiple sellers. Tenant context is attached to each order line item, not the warehouse session. |
| Tenant ID in JWT | The authenticated user's `tenantId` is carried in the Keycloak JWT token and extracted by the Chenile `ContextContainer` at request entry. |
| Tenant ID immutability | A request can never override the `tenantId` extracted from the JWT. Attempts return HTTP 403. |

---

## Chenile ACL Mapping

Mapping between HomeBase RBAC roles and Chenile framework ACL identifiers.

| HomeBase Role | Chenile ACL | Scope | Notes |
|---------------|-------------|-------|-------|
| CUSTOMER | `ROLE_CUSTOMER` | Own data (`ownerId` match) | Enforced via Chenile interceptor checking `entity.ownerId == currentUser.id` |
| SUPPLIER | `ROLE_SUPPLIER` | Own tenant (`tenantId` match) | Enforced via Chenile multi-tenant filter in query service |
| ADMIN | `ROLE_ADMIN` | Cross-tenant read/write for moderation | Cannot modify platform settings or manage roles |
| WAREHOUSE | `ROLE_WAREHOUSE` | Cross-tenant read for fulfilment entities only | No access to financial or user management resources |
| PLATFORM_ADMIN | `ROLE_PLATFORM_ADMIN` | Unrestricted | Full access to all Chenile services including system configuration |

### Chenile Interceptor Chain for RBAC

1. **AuthenticationInterceptor** -- Validates JWT from Keycloak, extracts user identity and roles.
2. **TenantInterceptor** -- Reads `tenantId` from JWT claims, injects into `ContextContainer`.
3. **AuthorizationInterceptor** -- Checks requested action against the ACL for the user's role. Returns 403 if denied.
4. **OwnershipInterceptor** -- For `O` (own-data) permissions, verifies the entity's `ownerId` or `tenantId` matches the current user. Returns 403 on mismatch.
5. **QueryFilterInterceptor** -- For list/search operations, automatically injects tenant or owner filters into the `SearchRequest` before it reaches the MyBatis query layer.

### ACL Definition Structure

Each Chenile service operation declares its required ACL:

```
operation:
  name: createProduct
  acl:
    - ROLE_SUPPLIER
    - ROLE_PLATFORM_ADMIN
  ownershipCheck: tenantId
```

This means only `SUPPLIER` and `PLATFORM_ADMIN` can invoke `createProduct`, and the `SUPPLIER` must own the entity's tenant.

---

## Role Hierarchy

Roles inherit permissions upward. Higher roles include all permissions of lower roles where explicitly noted.

```
PLATFORM_ADMIN
  └── ADMIN
        └── (no automatic inheritance from SUPPLIER, CUSTOMER, or WAREHOUSE)

SUPPLIER   (independent branch)
CUSTOMER   (independent branch)
WAREHOUSE  (independent branch)
```

- `PLATFORM_ADMIN` inherits all `ADMIN` permissions plus system configuration.
- `ADMIN` does NOT inherit `SUPPLIER`, `CUSTOMER`, or `WAREHOUSE` permissions. These are separate branches.
- If a user holds multiple roles (e.g., an admin who is also a customer), permissions are the union of both roles.
