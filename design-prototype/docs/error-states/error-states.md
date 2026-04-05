# Error States - Error Handling Definitions

> Every API call and user action in HomeBase has a defined error handling path.
> Errors are categorized by HTTP status code and network condition.
> Each error state specifies exact message text, icon, available actions, and retry behavior.

---

## Global Error Rules

| Rule | Value |
|---|---|
| Error icon library | Lucide React |
| Error container | Centered card, `max-w-md`, `p-8`, white background |
| Icon size | `w-12 h-12` (48px) |
| Icon color | Varies by severity (see below) |
| Title font | `text-xl font-semibold text-gray-900` |
| Description font | `text-sm text-gray-500` |
| Primary action button | `bg-indigo-600 text-white px-6 py-2 rounded-lg` |
| Secondary action link | `text-indigo-600 underline text-sm` |
| Error logging | All errors sent to monitoring service with request ID |
| Toast vs. full-page | Inline errors for partial failures; full-page for complete page load failures |

### Severity Colors

| Severity | Icon Color | Background Tint |
|---|---|---|
| Critical (500, network down) | `text-red-500` | `bg-red-50` |
| Warning (timeout, rate limit) | `text-amber-500` | `bg-amber-50` |
| Informational (404, empty) | `text-gray-400` | `bg-gray-50` |
| Access (403, 401) | `text-red-600` | `bg-red-50` |

---

## Error Type 1: Server Error (HTTP 500)

**Trigger:** API returns status code 500, 502, 503, or any unhandled server error.

### Full-Page Error (when entire page fails to load)

```
+-----------------------------------------------+
|                                               |
|            [AlertTriangle icon]               |
|              (red-500, 48px)                  |
|                                               |
|         Something went wrong                  |
|                                               |
|    We're having trouble loading this page.    |
|    Our team has been notified. Please try     |
|    again in a moment.                         |
|                                               |
|           [ Try Again ]                       |
|                                               |
|         Go back to Dashboard                  |
|                                               |
|    Error ID: ERR-xxxxxx                       |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Icon | `AlertTriangle` (Lucide) |
| Icon color | `text-red-500` |
| Title | "Something went wrong" |
| Description | "We're having trouble loading this page. Our team has been notified. Please try again in a moment." |
| Primary button | "Try Again" -- calls `window.location.reload()` |
| Secondary link | "Go back to Dashboard" -- navigates to `/dashboard` |
| Error reference | "Error ID: ERR-{requestId}" displayed in `text-xs text-gray-400` |
| Retry logic | Manual retry only. No auto-retry for 500 errors. |

### Inline Error (when a section of the page fails)

```
+-----------------------------------------------+
| [AlertCircle] Failed to load orders.  [Retry] |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Layout | Horizontal banner inside the failed section |
| Icon | `AlertCircle` (Lucide), `w-5 h-5`, `text-red-500` |
| Message | "Failed to load {section name}." |
| Action | "Retry" text button, `text-indigo-600` |
| Retry logic | Retries the specific failed API call, up to 3 attempts |

### Per-Page 500 Error Messages

| Page | Section | Message |
|---|---|---|
| Dashboard | Stats cards | "Failed to load statistics." |
| Dashboard | Recent orders table | "Failed to load recent orders." |
| Dashboard | Chart | "Failed to load sales data." |
| Product list | Table | "Failed to load products." |
| Order list | Table | "Failed to load orders." |
| Order detail | Full page | "Something went wrong loading this order." |
| Product detail | Full page | "Something went wrong loading this product." |
| Cart | Cart items | "Failed to load your cart." |
| Checkout | Address/payment | "Failed to load checkout details." |
| Chat | Message list | "Failed to load messages." |
| Inventory | Table | "Failed to load inventory." |
| Returns | Table | "Failed to load returns." |
| Reviews | Table | "Failed to load reviews." |
| User management | Table | "Failed to load users." |
| Profile | Full page | "Failed to load your profile." |

---

## Error Type 2: Not Found (HTTP 404)

**Trigger:** API returns status code 404 or requested resource does not exist.

### Full-Page 404

```
+-----------------------------------------------+
|                                               |
|              [FileQuestion icon]              |
|              (gray-400, 48px)                 |
|                                               |
|             Page not found                    |
|                                               |
|    The page you're looking for doesn't        |
|    exist or has been removed.                 |
|                                               |
|           [ Go to Dashboard ]                 |
|                                               |
|           Go back                             |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Icon | `FileQuestion` (Lucide) |
| Icon color | `text-gray-400` |
| Title | "Page not found" |
| Description | "The page you're looking for doesn't exist or has been removed." |
| Primary button | "Go to Dashboard" -- navigates to `/dashboard` |
| Secondary link | "Go back" -- calls `router.back()` |

### Resource-Specific 404 Messages

| Resource | Title | Description | Back Link |
|---|---|---|---|
| Order | "Order not found" | "This order doesn't exist or you don't have access to it." | "Back to Orders" -> `/orders` |
| Product | "Product not found" | "This product may have been removed or is no longer available." | "Back to Products" -> `/products` |
| User profile | "User not found" | "This user profile doesn't exist." | "Back to Users" -> `/admin/users` |
| Return request | "Return not found" | "This return request doesn't exist or has been removed." | "Back to Returns" -> `/returns` |
| Chat conversation | "Conversation not found" | "This conversation doesn't exist or has been deleted." | "Back to Messages" -> `/messages` |
| Review | "Review not found" | "This review doesn't exist or has been removed." | "Back to Reviews" -> `/reviews` |
| Inventory item | "Item not found" | "This inventory item doesn't exist." | "Back to Inventory" -> `/inventory` |

---

## Error Type 3: Access Denied (HTTP 403)

**Trigger:** API returns status code 403 or user lacks permissions for the resource.

```
+-----------------------------------------------+
|                                               |
|              [ShieldAlert icon]               |
|              (red-600, 48px)                  |
|                                               |
|            Access denied                      |
|                                               |
|    You don't have permission to view this     |
|    page. If you think this is an error,       |
|    contact your administrator.                |
|                                               |
|           [ Go to Dashboard ]                 |
|                                               |
|           Sign in with a different account    |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Icon | `ShieldAlert` (Lucide) |
| Icon color | `text-red-600` |
| Title | "Access denied" |
| Description | "You don't have permission to view this page. If you think this is an error, contact your administrator." |
| Primary button | "Go to Dashboard" -- navigates to role-appropriate dashboard |
| Secondary link | "Sign in with a different account" -- redirects to `/auth/login` |
| Auto-redirect | If token is expired (401 behind the scenes), redirect to `/auth/login` after 3 seconds with message "Your session has expired. Please sign in again." |

### Role-Specific 403 Scenarios

| Scenario | Message |
|---|---|
| Buyer accessing seller dashboard | "This area is for sellers only. Switch to your seller account or apply to become a seller." |
| Seller accessing admin panel | "This area is restricted to administrators." |
| Buyer accessing another buyer's order | "You don't have access to this order." |
| Seller accessing another seller's products | "You can only manage your own products." |
| Deactivated account | "Your account has been deactivated. Contact support for assistance." |

---

## Error Type 4: Authentication Required (HTTP 401)

**Trigger:** API returns status code 401 or session/token is invalid.

```
+-----------------------------------------------+
|                                               |
|              [LogIn icon]                     |
|              (gray-500, 48px)                 |
|                                               |
|          Session expired                      |
|                                               |
|    Your session has expired. Please sign      |
|    in again to continue.                      |
|                                               |
|           [ Sign In ]                         |
|                                               |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Icon | `LogIn` (Lucide) |
| Icon color | `text-gray-500` |
| Title | "Session expired" |
| Description | "Your session has expired. Please sign in again to continue." |
| Primary button | "Sign In" -- redirects to `/auth/login?redirect={currentPath}` |
| Behavior | Auto-redirect to login after 5 seconds. Store current URL for post-login redirect. |
| Toast (if inline) | "Your session has expired. Redirecting to sign in..." (warning toast, 5s) |

---

## Error Type 5: Request Timeout

**Trigger:** API call exceeds 8 seconds without response, or server returns 408/504.

```
+-----------------------------------------------+
|                                               |
|              [Clock icon]                     |
|              (amber-500, 48px)                |
|                                               |
|       Taking longer than expected             |
|                                               |
|    The server is taking too long to           |
|    respond. This might be a temporary         |
|    issue.                                     |
|                                               |
|           [ Try Again ]                       |
|                                               |
|         Go back to Dashboard                  |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Icon | `Clock` (Lucide) |
| Icon color | `text-amber-500` |
| Title | "Taking longer than expected" |
| Description | "The server is taking too long to respond. This might be a temporary issue." |
| Primary button | "Try Again" -- retries the failed request |
| Secondary link | "Go back to Dashboard" -- navigates to `/dashboard` |
| Retry logic | Auto-retry once after 3 seconds. If second attempt also times out, show this error with manual retry only. |
| Inline variant | Replace skeleton with: `[Clock icon] This is taking a while... [Retry]` |

---

## Error Type 6: Network Offline

**Trigger:** `navigator.onLine === false` or fetch fails with `TypeError: Failed to fetch`.

### Persistent Top Banner

```
+-------------------------------------------------------+
| [WifiOff icon] You're offline. Checking connection... |
+-------------------------------------------------------+
|                                                       |
|   (rest of page content, dimmed with opacity-50)      |
|                                                       |
+-------------------------------------------------------+
```

| Element | Value |
|---|---|
| Banner position | Fixed top, below navbar, full width |
| Banner background | `bg-gray-900` |
| Banner text color | `text-white` |
| Icon | `WifiOff` (Lucide), `w-4 h-4` |
| Message (checking) | "You're offline. Checking connection..." |
| Message (confirmed offline) | "You're offline. Changes will sync when you're back online." |
| Message (reconnected) | "You're back online!" (green background, auto-dismisses after 3s) |
| Auto-retry | Ping server every 5 seconds. On success, auto-refresh failed data and dismiss banner. |
| Behavior | Disable all form submissions and action buttons. Show tooltip "You're offline" on hover. |
| Queue actions | Store pending actions (add to cart, form submissions) in localStorage. Execute on reconnect. |

### Full-Page Offline (if page has no cached content)

```
+-----------------------------------------------+
|                                               |
|              [WifiOff icon]                   |
|              (gray-500, 48px)                 |
|                                               |
|           You're offline                      |
|                                               |
|    Check your internet connection and         |
|    try again.                                 |
|                                               |
|           [ Try Again ]                       |
|                                               |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Icon | `WifiOff` (Lucide) |
| Icon color | `text-gray-500` |
| Title | "You're offline" |
| Description | "Check your internet connection and try again." |
| Primary button | "Try Again" -- checks `navigator.onLine` then retries |
| Auto-retry | Background check every 5 seconds. Auto-reload on reconnect. |

---

## Error Type 7: Rate Limited (HTTP 429)

**Trigger:** API returns status code 429 with `Retry-After` header.

```
+-----------------------------------------------+
|                                               |
|              [Timer icon]                     |
|              (amber-500, 48px)                |
|                                               |
|          Too many requests                    |
|                                               |
|    You've made too many requests. Please      |
|    wait before trying again.                  |
|                                               |
|       Retry available in: 00:27               |
|                                               |
|         [ Retry ] (disabled, grayed out)      |
|                                               |
+-----------------------------------------------+
```

| Element | Value |
|---|---|
| Icon | `Timer` (Lucide) |
| Icon color | `text-amber-500` |
| Title | "Too many requests" |
| Description | "You've made too many requests. Please wait before trying again." |
| Countdown | "Retry available in: {MM:SS}" -- reads from `Retry-After` header, defaults to 60s |
| Countdown format | `MM:SS`, updates every second, `text-lg font-mono text-amber-600` |
| Primary button | "Retry" -- disabled and grayed out until countdown reaches 0 |
| Button when ready | Becomes active: `bg-indigo-600 text-white` with text "Try Again" |
| Auto-retry | Automatically retries the request when countdown hits 0 |

### Inline Rate Limit (for actions like adding to cart, sending messages)

```
+----------------------------------------------------------+
| [Timer] Please wait 27 seconds before trying again.     |
+----------------------------------------------------------+
```

| Element | Value |
|---|---|
| Layout | Toast notification, bottom-right, `bg-amber-50 border-amber-200` |
| Icon | `Timer` (Lucide), `w-4 h-4`, `text-amber-500` |
| Message | "Please wait {seconds} seconds before trying again." |
| Duration | Stays visible for full countdown, then auto-dismisses |

---

## Error Type 8: Validation Error (HTTP 422)

**Trigger:** API returns status code 422 with field-level error details.

This error is handled inline on forms, not as a full-page error.

| Element | Value |
|---|---|
| Field border | `border-red-500` on the invalid field |
| Field message | Below the field: `text-sm text-red-500` with specific error |
| Form banner | Top of form: `bg-red-50 border-red-200 p-4 rounded-lg` |
| Banner icon | `AlertCircle` (Lucide), `w-5 h-5`, `text-red-500` |
| Banner message | "Please fix the errors below before submitting." |
| Scroll behavior | Auto-scroll to first invalid field |

### Common Validation Messages

| Field | Error | Message |
|---|---|---|
| Email | Invalid format | "Please enter a valid email address." |
| Password | Too short | "Password must be at least 8 characters." |
| Price | Negative value | "Price must be a positive number." |
| Quantity | Exceeds stock | "Only {available} items available." |
| Image | File too large | "Image must be less than 5MB." |
| Image | Wrong format | "Only JPG, PNG, and WebP images are accepted." |
| Product name | Too long | "Product name must be under 200 characters." |
| Address | Missing required | "This field is required." |
| Phone | Invalid format | "Please enter a valid phone number." |

---

## Error Type 9: Conflict (HTTP 409)

**Trigger:** API returns status code 409, typically for concurrent edits or duplicate actions.

| Scenario | Message | Action |
|---|---|---|
| Product already in cart | "This product is already in your cart." | "Go to Cart" button |
| Duplicate order submission | "This order has already been placed." | "View Order" button |
| Concurrent product edit | "This product was updated by someone else. Please refresh to see the latest version." | "Refresh" button |
| Duplicate return request | "A return request already exists for this order." | "View Return" button |
| Email already registered | "An account with this email already exists." | "Sign In" link |

---

## Error Handling by Page

### Dashboard (Buyer/Seller/Admin)

| Section Failure | Behavior |
|---|---|
| All sections fail | Full-page 500 error |
| Stats cards fail | Inline error replacing stats row: "Failed to load statistics. [Retry]" |
| Chart fails | Inline error replacing chart: "Failed to load chart data. [Retry]" |
| Table fails | Inline error replacing table: "Failed to load recent orders. [Retry]" |
| Partial success | Show loaded sections normally, show inline error only on failed sections |

### Product List / Order List / Any Table Page

| Failure | Behavior |
|---|---|
| Initial load fails | Full-page 500 error |
| Search/filter fails | Inline error above table: "Search failed. [Retry]" |
| Pagination fails | Inline error below table: "Failed to load more results. [Retry]" |
| Delete action fails | Toast: "Failed to delete {item}. Please try again." (error toast, 5s) |
| Bulk action fails | Toast: "Some actions failed. {n} of {total} completed." (warning toast, 8s) |

### Detail Pages (Order, Product, User)

| Failure | Behavior |
|---|---|
| Full page load fails | Full-page 500 or 404 error |
| Tab content fails | Inline error in tab panel: "Failed to load {tab name}. [Retry]" |
| Action fails (approve, reject, etc.) | Toast: "Failed to {action}. Please try again." (error toast, 5s) |
| Image fails to load | Show broken image placeholder with `ImageOff` icon |

### Forms (Add/Edit Product, Checkout, Profile)

| Failure | Behavior |
|---|---|
| Form data fails to load (edit mode) | Full-page 500 error |
| Submission fails (500) | Toast: "Failed to save. Please try again." + re-enable submit button |
| Submission fails (422) | Inline validation errors on fields |
| File upload fails | Error below upload zone: "Upload failed. Please try again." |
| Save draft fails | Toast: "Failed to save draft." (warning toast, 5s) |

### Chat

| Failure | Behavior |
|---|---|
| Conversation list fails | Inline error in sidebar: "Failed to load conversations. [Retry]" |
| Messages fail to load | Inline error in chat window: "Failed to load messages. [Retry]" |
| Send message fails | Red border on message bubble + "Failed to send. [Tap to retry]" below it |
| WebSocket disconnected | Banner in chat: "Reconnecting..." with auto-retry every 3s |
