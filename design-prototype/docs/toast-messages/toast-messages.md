# Toast / Notification Messages

All toast messages used across HomeBase applications. Every user-facing action that triggers feedback is listed below, grouped by app.

## Global Configuration

| Property         | Value                                                        |
|------------------|--------------------------------------------------------------|
| Default Position | `top-right`                                                  |
| Success Duration | 3 seconds                                                    |
| Error Duration   | 5 seconds                                                    |
| Warning Duration | 5 seconds                                                    |
| Info Duration    | 3 seconds                                                    |
| Critical         | Persistent (user must dismiss)                               |
| Max Visible      | 3 toasts stacked                                             |
| Animation        | Slide in from right, fade out                                |
| Dismissible      | All toasts can be manually dismissed via close icon           |

---

## 1. Customer App

### 1.1 Cart

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Add to cart | success | Item added to your cart. | 3s | top-right |
| Add to cart (out of stock) | error | This item is currently out of stock. | 5s | top-right |
| Add to cart (quantity limit reached) | warning | Maximum quantity limit reached for this item. | 5s | top-right |
| Remove from cart | success | Item removed from your cart. | 3s | top-right |
| Update cart quantity | success | Cart updated. | 3s | top-right |
| Update cart quantity (exceeds stock) | error | Only {{count}} items available in stock. | 5s | top-right |
| Cart cleared | success | Your cart has been cleared. | 3s | top-right |

### 1.2 Coupons and Discounts

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Coupon applied | success | Coupon "{{code}}" applied. You saved {{amount}}! | 3s | top-right |
| Coupon failed (invalid) | error | Invalid coupon code. Please check and try again. | 5s | top-right |
| Coupon failed (expired) | error | This coupon has expired. | 5s | top-right |
| Coupon failed (minimum not met) | error | Minimum order amount of {{amount}} required for this coupon. | 5s | top-right |
| Coupon removed | info | Coupon removed from your order. | 3s | top-right |

### 1.3 Orders

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Order placed | success | Order placed successfully! Your order ID is {{orderId}}. | 3s | top-right |
| Order placement failed | error | We could not place your order. Please try again. | 5s | top-right |
| Order placement failed (payment) | error | Payment failed. Please check your payment details and try again. | 5s | top-right |
| Order cancelled by customer | success | Your order has been cancelled. Refund will be processed shortly. | 3s | top-right |
| Order cancellation failed | error | Unable to cancel this order. Please contact support. | 5s | top-right |

### 1.4 Authentication

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Login success | success | Welcome back, {{name}}! | 3s | top-right |
| Login failed (invalid credentials) | error | Invalid email or password. Please try again. | 5s | top-right |
| Login failed (account locked) | error | Your account has been locked. Please contact support. | persistent | top-right |
| Login failed (account suspended) | error | Your account has been suspended. Please contact support. | persistent | top-right |
| Logout success | info | You have been logged out. | 3s | top-right |
| Session expired | warning | Your session has expired. Please log in again. | 5s | top-right |

### 1.5 Registration

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Register success | success | Account created successfully! Welcome to HomeBase. | 3s | top-right |
| Register failed (email exists) | error | An account with this email already exists. | 5s | top-right |
| Register failed (validation) | error | Please correct the highlighted fields and try again. | 5s | top-right |
| Email verification sent | info | A verification email has been sent to {{email}}. | 3s | top-right |
| Email verified | success | Your email has been verified. | 3s | top-right |

### 1.6 Password

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Password reset link sent | success | Password reset link sent to {{email}}. Check your inbox. | 3s | top-right |
| Password reset failed | error | Unable to send reset link. Please verify your email address. | 5s | top-right |
| Password changed | success | Your password has been updated. | 3s | top-right |
| Password change failed | error | Current password is incorrect. | 5s | top-right |

### 1.7 Addresses

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Address added | success | Address added successfully. | 3s | top-right |
| Address updated | success | Address updated successfully. | 3s | top-right |
| Address deleted | success | Address removed. | 3s | top-right |
| Address set as default | success | Default address updated. | 3s | top-right |
| Address add/update failed | error | Unable to save address. Please check the details and try again. | 5s | top-right |

### 1.8 Payment Methods

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Payment method added | success | Payment method added successfully. | 3s | top-right |
| Payment method removed | success | Payment method removed. | 3s | top-right |
| Payment method set as default | success | Default payment method updated. | 3s | top-right |
| Payment method add failed | error | Unable to add payment method. Please check the details. | 5s | top-right |

### 1.9 Wishlist

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Added to wishlist | success | Item added to your wishlist. | 3s | top-right |
| Removed from wishlist | success | Item removed from your wishlist. | 3s | top-right |
| Wishlist item moved to cart | success | Item moved to your cart. | 3s | top-right |
| Wishlist add failed | error | Unable to add item to wishlist. Please try again. | 5s | top-right |

### 1.10 Returns

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Return submitted | success | Return request submitted. We will review it shortly. | 3s | top-right |
| Return submission failed | error | Unable to submit return request. Please try again. | 5s | top-right |
| Return approved (notification) | info | Your return for order {{orderId}} has been approved. | 3s | top-right |
| Return rejected (notification) | warning | Your return for order {{orderId}} has been rejected. | 5s | top-right |

### 1.11 Reviews

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Review submitted | success | Thank you! Your review has been submitted. | 3s | top-right |
| Review submission failed | error | Unable to submit your review. Please try again. | 5s | top-right |
| Review updated | success | Your review has been updated. | 3s | top-right |
| Review deleted | success | Your review has been removed. | 3s | top-right |

### 1.12 Profile

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Profile updated | success | Profile updated successfully. | 3s | top-right |
| Profile update failed | error | Unable to update profile. Please try again. | 5s | top-right |
| Avatar uploaded | success | Profile photo updated. | 3s | top-right |
| Avatar upload failed | error | Unable to upload photo. Maximum file size is 5MB. | 5s | top-right |

---

## 2. Seller App

### 2.1 Products

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Product created | success | Product "{{name}}" created as draft. | 3s | top-right |
| Product creation failed | error | Unable to create product. Please check all required fields. | 5s | top-right |
| Product updated | success | Product "{{name}}" updated successfully. | 3s | top-right |
| Product update failed | error | Unable to update product. Please try again. | 5s | top-right |
| Product deleted | success | Product "{{name}}" has been deleted. | 3s | top-right |
| Product delete failed | error | Unable to delete product. It may have active orders. | 5s | top-right |
| Product published | success | Product "{{name}}" is now live on the marketplace. | 3s | top-right |
| Product publish failed | error | Unable to publish product. Please ensure all required fields are filled. | 5s | top-right |
| Product deactivated | success | Product "{{name}}" has been deactivated. | 3s | top-right |
| Product deactivation failed | error | Unable to deactivate product. Please try again. | 5s | top-right |
| Product image uploaded | success | Image uploaded successfully. | 3s | top-right |
| Product image upload failed | error | Image upload failed. Maximum file size is 10MB. | 5s | top-right |
| Bulk product import started | info | Import started. You will be notified when complete. | 3s | top-right |
| Bulk product import complete | success | {{count}} products imported successfully. | 3s | top-right |
| Bulk product import failed | error | Import failed. Please check the file format and try again. | 5s | top-right |

### 2.2 Orders

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Order confirmed | success | Order {{orderId}} confirmed. | 3s | top-right |
| Order confirmation failed | error | Unable to confirm order {{orderId}}. Please try again. | 5s | top-right |
| Order shipped | success | Order {{orderId}} marked as shipped. | 3s | top-right |
| Order shipment failed | error | Unable to update shipment status. Please try again. | 5s | top-right |
| Order cancelled | success | Order {{orderId}} has been cancelled. | 3s | top-right |
| Order cancellation failed | error | Unable to cancel order {{orderId}}. Please try again. | 5s | top-right |
| New order received (notification) | info | New order received: {{orderId}}. | 3s | top-right |

### 2.3 Returns

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Return approved | success | Return for order {{orderId}} approved. | 3s | top-right |
| Return approval failed | error | Unable to approve return. Please try again. | 5s | top-right |
| Return rejected | success | Return for order {{orderId}} rejected. | 3s | top-right |
| Return rejection failed | error | Unable to reject return. Please try again. | 5s | top-right |
| New return request (notification) | info | New return request for order {{orderId}}. | 3s | top-right |

### 2.4 Inventory

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Stock updated | success | Stock for "{{productName}}" updated to {{quantity}}. | 3s | top-right |
| Stock update failed | error | Unable to update stock. Please try again. | 5s | top-right |
| Low stock alert (notification) | warning | "{{productName}}" is running low ({{quantity}} remaining). | 5s | top-right |
| Out of stock alert (notification) | error | "{{productName}}" is now out of stock. | persistent | top-right |

### 2.5 Settings and Profile

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Settings saved | success | Settings saved successfully. | 3s | top-right |
| Settings save failed | error | Unable to save settings. Please try again. | 5s | top-right |
| Profile updated | success | Seller profile updated. | 3s | top-right |
| Profile update failed | error | Unable to update profile. Please try again. | 5s | top-right |
| Store logo uploaded | success | Store logo updated. | 3s | top-right |
| Store banner uploaded | success | Store banner updated. | 3s | top-right |

### 2.6 Documents

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Document uploaded | success | Document "{{fileName}}" uploaded successfully. | 3s | top-right |
| Document upload failed | error | Unable to upload document. Maximum file size is 20MB. | 5s | top-right |
| Document verified (notification) | success | Your document "{{fileName}}" has been verified. | 3s | top-right |
| Document rejected (notification) | warning | Your document "{{fileName}}" was rejected. Please re-upload. | 5s | top-right |

### 2.7 Support and Messaging

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Ticket created | success | Support ticket {{ticketId}} created. | 3s | top-right |
| Ticket creation failed | error | Unable to create support ticket. Please try again. | 5s | top-right |
| Message sent | success | Message sent. | 3s | top-right |
| Message send failed | error | Unable to send message. Please try again. | 5s | top-right |

### 2.8 Payouts

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Payout requested | success | Payout request submitted. Processing may take 3-5 business days. | 3s | top-right |
| Payout request failed | error | Unable to submit payout request. Please try again. | 5s | top-right |
| Payout processed (notification) | success | Payout of {{amount}} has been deposited to your account. | 3s | top-right |

---

## 3. Admin App

### 3.1 Product Moderation

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Product approved | success | Product "{{name}}" approved and published. | 3s | top-right |
| Product approval failed | error | Unable to approve product. Please try again. | 5s | top-right |
| Product flagged | warning | Product "{{name}}" flagged for review. | 3s | top-right |
| Product flag failed | error | Unable to flag product. Please try again. | 5s | top-right |
| Product removed | success | Product "{{name}}" removed from marketplace. | 3s | top-right |
| Product removal failed | error | Unable to remove product. Please try again. | 5s | top-right |
| Bulk products approved | success | {{count}} products approved. | 3s | top-right |
| Bulk products rejected | success | {{count}} products rejected. | 3s | top-right |

### 3.2 Seller Management

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Seller approved | success | Seller "{{name}}" approved and activated. | 3s | top-right |
| Seller approval failed | error | Unable to approve seller. Please try again. | 5s | top-right |
| Seller suspended | success | Seller "{{name}}" has been suspended. | 3s | top-right |
| Seller suspension failed | error | Unable to suspend seller. Please try again. | 5s | top-right |
| Seller reactivated | success | Seller "{{name}}" has been reactivated. | 3s | top-right |
| Seller reactivation failed | error | Unable to reactivate seller. Please try again. | 5s | top-right |

### 3.3 User Management

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| User suspended | success | User "{{name}}" has been suspended. | 3s | top-right |
| User suspension failed | error | Unable to suspend user. Please try again. | 5s | top-right |
| User reactivated | success | User "{{name}}" has been reactivated. | 3s | top-right |
| User reactivation failed | error | Unable to reactivate user. Please try again. | 5s | top-right |
| User role updated | success | Role updated for user "{{name}}". | 3s | top-right |
| User role update failed | error | Unable to update user role. Please try again. | 5s | top-right |

### 3.4 Review Moderation

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Review approved | success | Review approved and published. | 3s | top-right |
| Review approval failed | error | Unable to approve review. Please try again. | 5s | top-right |
| Review flagged | warning | Review flagged for further inspection. | 3s | top-right |
| Review flag failed | error | Unable to flag review. Please try again. | 5s | top-right |
| Review removed | success | Review removed from marketplace. | 3s | top-right |
| Review removal failed | error | Unable to remove review. Please try again. | 5s | top-right |

### 3.5 Promotions

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Promotion created | success | Promotion "{{name}}" created. | 3s | top-right |
| Promotion creation failed | error | Unable to create promotion. Please check all fields. | 5s | top-right |
| Promotion activated | success | Promotion "{{name}}" is now active. | 3s | top-right |
| Promotion paused | success | Promotion "{{name}}" paused. | 3s | top-right |
| Promotion deleted | success | Promotion "{{name}}" deleted. | 3s | top-right |
| Promotion update failed | error | Unable to update promotion. Please try again. | 5s | top-right |

### 3.6 Compliance

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Compliance approved | success | Compliance review approved for "{{entity}}". | 3s | top-right |
| Compliance approval failed | error | Unable to approve compliance. Please try again. | 5s | top-right |
| Compliance rejected | success | Compliance review rejected for "{{entity}}". Seller notified. | 3s | top-right |
| Compliance rejection failed | error | Unable to reject compliance. Please try again. | 5s | top-right |

### 3.7 CMS

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| CMS page published | success | Page "{{title}}" published. | 3s | top-right |
| CMS publish failed | error | Unable to publish page. Please try again. | 5s | top-right |
| CMS page unpublished | success | Page "{{title}}" unpublished. | 3s | top-right |
| CMS unpublish failed | error | Unable to unpublish page. Please try again. | 5s | top-right |
| CMS page saved as draft | success | Page "{{title}}" saved as draft. | 3s | top-right |
| CMS save failed | error | Unable to save page. Please try again. | 5s | top-right |

### 3.8 Platform Settings

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Platform settings saved | success | Platform settings updated. | 3s | top-right |
| Platform settings save failed | error | Unable to save platform settings. Please try again. | 5s | top-right |
| Fee structure updated | success | Fee structure updated. Changes take effect immediately. | 3s | top-right |
| Fee structure update failed | error | Unable to update fee structure. Please try again. | 5s | top-right |

### 3.9 Finance

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Settlement batch processed | success | Settlement batch processed. {{count}} payouts queued. | 3s | top-right |
| Settlement batch failed | error | Unable to process settlement batch. Please try again. | 5s | top-right |
| Reconciliation complete | success | Reconciliation complete. All transactions matched. | 3s | top-right |
| Reconciliation failed | error | Reconciliation failed. {{count}} mismatches found. | 5s | top-right |
| Gateway balance synced | success | Gateway balance synced successfully. | 3s | top-right |
| Gateway balance sync failed | error | Unable to sync gateway balance. Please try again. | 5s | top-right |

### 3.10 Refunds

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Refund initiated | success | Refund of {{amount}} initiated for order {{orderId}}. | 3s | top-right |
| Refund initiation failed | error | Unable to initiate refund. Please try again. | 5s | top-right |
| Refund completed | success | Refund of {{amount}} completed for order {{orderId}}. | 3s | top-right |
| Refund retry scheduled | info | Refund retry scheduled for order {{orderId}}. Next attempt at {{datetime}}. | 3s | top-right |
| Refund failed -- bank rejected | error | Refund failed for order {{orderId}} -- bank rejected the transaction. | persistent | top-right |

### 3.11 Disputes

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Dispute resolved -- refund issued | success | Dispute {{disputeId}} resolved. Refund issued to customer. | 3s | top-right |
| Dispute resolution failed | error | Unable to resolve dispute. Please try again. | 5s | top-right |
| Dispute escalated | warning | Dispute {{disputeId}} escalated for further review. | 5s | top-right |
| Dispute escalation failed | error | Unable to escalate dispute. Please try again. | 5s | top-right |
| Dispute assigned to agent | success | Dispute {{disputeId}} assigned to {{agentName}}. | 3s | top-right |
| Dispute assignment failed | error | Unable to assign dispute. Please try again. | 5s | top-right |

### 3.12 Audit

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Audit log exported | success | Audit log exported. Download will begin shortly. | 3s | top-right |
| Audit log export failed | error | Unable to export audit log. Please try again. | 5s | top-right |

### 3.13 Categories

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Category created | success | Category "{{name}}" created. | 3s | top-right |
| Category creation failed | error | Unable to create category. Please try again. | 5s | top-right |
| Category updated | success | Category "{{name}}" updated. | 3s | top-right |
| Category update failed | error | Unable to update category. Please try again. | 5s | top-right |
| Category deleted | success | Category "{{name}}" deleted. | 3s | top-right |
| Category deletion failed | error | Unable to delete category. It may have associated products. | 5s | top-right |

### 3.14 Tax and GST

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Tax rule added | success | Tax rule "{{name}}" added. | 3s | top-right |
| Tax rule add failed | error | Unable to add tax rule. Please try again. | 5s | top-right |
| GST rate updated | success | GST rate updated to {{rate}}% for {{category}}. | 3s | top-right |
| GST rate update failed | error | Unable to update GST rate. Please try again. | 5s | top-right |
| GST report generated | success | GST report generated for {{period}}. | 3s | top-right |
| GST report generation failed | error | Unable to generate GST report. Please try again. | 5s | top-right |

### 3.15 Shipping

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Carrier added | success | Carrier "{{name}}" added. | 3s | top-right |
| Carrier add failed | error | Unable to add carrier. Please try again. | 5s | top-right |
| Carrier deactivated | success | Carrier "{{name}}" deactivated. | 3s | top-right |
| Carrier deactivation failed | error | Unable to deactivate carrier. Please try again. | 5s | top-right |
| Shipping zone updated | success | Shipping zone "{{zone}}" updated. | 3s | top-right |
| Shipping zone update failed | error | Unable to update shipping zone. Please try again. | 5s | top-right |
| SLA updated | success | Shipping SLA updated for {{carrier}}. | 3s | top-right |
| SLA update failed | error | Unable to update SLA. Please try again. | 5s | top-right |

### 3.16 Reports

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Report generated | success | Report "{{name}}" generated. | 3s | top-right |
| Report generation failed | error | Unable to generate report. Please try again. | 5s | top-right |
| Report scheduled | success | Report "{{name}}" scheduled for {{frequency}} delivery. | 3s | top-right |
| Report schedule failed | error | Unable to schedule report. Please try again. | 5s | top-right |
| Report downloaded | success | Report downloaded. | 3s | top-right |
| Report download failed | error | Unable to download report. Please try again. | 5s | top-right |

### 3.17 Configuration

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Configuration saved | success | Configuration saved. Changes take effect immediately. | 3s | top-right |
| Configuration save failed | error | Unable to save configuration. Please try again. | 5s | top-right |
| Feature flag toggled | success | Feature "{{feature}}" {{state}}. | 3s | top-right |
| Feature flag toggle failed | error | Unable to toggle feature flag. Please try again. | 5s | top-right |
| Template updated | success | Template "{{name}}" updated. | 3s | top-right |
| Template update failed | error | Unable to update template. Please try again. | 5s | top-right |

### 3.18 Onboarding

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Seller approved | success | Seller "{{name}}" approved and activated. | 3s | top-right |
| Seller approval failed | error | Unable to approve seller. Please try again. | 5s | top-right |
| Seller rejected | success | Seller "{{name}}" rejected. Notification sent. | 3s | top-right |
| Seller rejection failed | error | Unable to reject seller. Please try again. | 5s | top-right |
| Document reminder sent | success | Document reminder sent to "{{name}}". | 3s | top-right |
| Document reminder failed | error | Unable to send document reminder. Please try again. | 5s | top-right |

---

## 4. Seller App (Additional)

### 4A.1 Seller Coupons

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Coupon created | success | Coupon "{{code}}" created. | 3s | top-right |
| Coupon creation failed | error | Unable to create coupon. Please try again. | 5s | top-right |
| Coupon activated | success | Coupon "{{code}}" activated. | 3s | top-right |
| Coupon activation failed | error | Unable to activate coupon. Please try again. | 5s | top-right |
| Coupon deactivated | success | Coupon "{{code}}" deactivated. | 3s | top-right |
| Coupon deactivation failed | error | Unable to deactivate coupon. Please try again. | 5s | top-right |
| Coupon deleted | success | Coupon "{{code}}" deleted. | 3s | top-right |
| Coupon deletion failed | error | Unable to delete coupon. Please try again. | 5s | top-right |

---

## 5. Warehouse App

### 5.1 Receiving

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Shipment received | success | Shipment {{shipmentId}} received and logged. | 3s | top-right |
| Shipment receive failed | error | Unable to log shipment. Please try again. | 5s | top-right |
| Shipment received with discrepancy | warning | Shipment {{shipmentId}} received. {{count}} items have discrepancies. | 5s | top-right |

### 5.2 Picking

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Items picked | success | All items picked for order {{orderId}}. | 3s | top-right |
| Pick list generated | success | Pick list generated for {{count}} orders. | 3s | top-right |
| Pick failed (item not found) | error | Item "{{sku}}" not found at expected location. | 5s | top-right |
| Pick completed with substitution | warning | Order {{orderId}} picked with substitutions. Review required. | 5s | top-right |

### 5.3 Packing

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Order packed | success | Order {{orderId}} packed and ready for dispatch. | 3s | top-right |
| Order pack failed | error | Unable to mark order as packed. Please try again. | 5s | top-right |
| Packing slip printed | success | Packing slip printed for order {{orderId}}. | 3s | top-right |

### 5.4 Shipping

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Shipment dispatched | success | Shipment {{shipmentId}} dispatched. Tracking: {{trackingId}}. | 3s | top-right |
| Shipment dispatch failed | error | Unable to dispatch shipment. Please try again. | 5s | top-right |
| Label generated | success | Shipping label generated for order {{orderId}}. | 3s | top-right |
| Label generation failed | error | Unable to generate shipping label. Please try again. | 5s | top-right |
| Bulk labels generated | success | {{count}} shipping labels generated. | 3s | top-right |

### 5.5 Inventory

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Stock adjusted | success | Stock adjusted for "{{sku}}". New quantity: {{quantity}}. | 3s | top-right |
| Stock adjustment failed | error | Unable to adjust stock. Please try again. | 5s | top-right |
| Stock transfer completed | success | Stock transfer from {{from}} to {{to}} completed. | 3s | top-right |
| Stock transfer failed | error | Unable to complete stock transfer. Please try again. | 5s | top-right |
| Damage write-off recorded | success | Damage write-off recorded for {{count}} items. | 3s | top-right |
| Cycle count completed | success | Cycle count completed for zone {{zone}}. | 3s | top-right |
| Bin assignment updated | success | Bin assignment updated for "{{sku}}". | 3s | top-right |

---

## 6. Shared / Cross-App Toasts

These toasts appear across all apps.

| Action | Type | Message | Duration | Position |
|--------|------|---------|----------|----------|
| Network error | error | Connection lost. Please check your internet and try again. | persistent | top-right |
| Network restored | success | Connection restored. | 3s | top-right |
| Server error (500) | error | Something went wrong on our end. Please try again later. | 5s | top-right |
| Forbidden (403) | error | You do not have permission to perform this action. | 5s | top-right |
| Not found (404) | error | The requested resource was not found. | 5s | top-right |
| Validation error | error | Please correct the highlighted fields. | 5s | top-right |
| File too large | error | File exceeds the maximum allowed size. | 5s | top-right |
| Unsupported file type | error | This file type is not supported. | 5s | top-right |
| Clipboard copy | success | Copied to clipboard. | 3s | top-right |
| Data export started | info | Export started. You will be notified when the file is ready. | 3s | top-right |
| Data export ready | success | Your export is ready for download. | 3s | top-right |
| Data export failed | error | Export failed. Please try again. | 5s | top-right |
| Maintenance mode (notification) | warning | Platform maintenance scheduled for {{datetime}}. | persistent | top-right |

---

## Implementation Notes

- Use `{{variable}}` placeholders in messages. The UI layer substitutes these at render time.
- Every toast must include an accessible `role="alert"` attribute for screen readers.
- Persistent toasts must include a visible dismiss button and must not auto-dismiss.
- Toast stacking: newest on top, older toasts shift down. Maximum 3 visible; excess toasts queue.
- On mobile: toasts render `top-center` instead of `top-right` with full-width styling.
- Toasts must never block interactive page elements.
