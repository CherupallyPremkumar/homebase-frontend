# Checkout Payment Flow

Detailed payment processing flow covering all payment methods, verification, failure handling, and order placement.

---

## Flow Overview

```
+---------+     +---------+     +---------+     +---------+     +---------+
| Select  |---->| Select  |---->| Select  |---->| Verify  |---->| Place   |
| Address |     | Shipping|     | Payment |     | Payment |     | Order   |
|         |     |         |     |         |     |         |     |         |
+---------+     +---------+     +---------+     +---------+     +---------+
                                                                     |
                                                                     v
                                                               +---------+
                                                               | Confirm |
                                                               | ation   |
                                                               +---------+
```

---

## Detailed Flow Diagram

```
    [START: Cart -> Checkout]
       |
       | (Must be authenticated)
       | If not: redirect to /login?redirect=/checkout
       v
+=========================+
| CHECKOUT PAGE           |
| checkout.html           |
|                         |
| Multi-step form:        |
| Step 1: Shipping        |
| Step 2: Payment         |
| Step 3: Review & Place  |
+=========================+


=============================
  STEP 1: SHIPPING ADDRESS
=============================
       |
       v
+----------------------------+
| LOAD SAVED ADDRESSES        |
| GET /api/account/addresses  |
+----------------------------+
       |
       +------+--------+
       |               |
       v               v
  Has saved       No saved
  addresses       addresses
       |               |
       v               v
+-------------------+  +-------------------+
| SELECT ADDRESS    |  | ADD NEW ADDRESS    |
|                   |  |                    |
| (x) Home          |  | Full Name: [____] |
|   Flat 402,       |  | Phone:     [____] |
|   Sunshine Towers |  | Line 1:    [____] |
|   Bengaluru       |  | Line 2:    [____] |
|   560034          |  | City:      [____] |
|                   |  | State:     [____] |
| ( ) Office        |  | Pincode:   [____] |
|   3rd Floor,      |  | Type: Home/Office |
|   WeWork Galaxy   |  |                    |
|                   |  | POST /api/account/ |
| [+ Add New]       |  | addresses          |
+-------------------+  +-------------------+
       |                       |
       +-------+---------------+
               |
               v
+----------------------------+
| LOAD SHIPPING METHODS       |
| GET /api/checkout/          |
|     shipping-methods        |
|     ?addressId={id}         |
+----------------------------+
               |
               v
+----------------------------+
| SELECT SHIPPING METHOD      |
|                             |
| ( ) Standard Delivery       |
|     Free, 5-7 business days |
|     Est: Apr 2 - Apr 4      |
|                             |
| (x) Express Delivery        |
|     INR 149, 2-3 days       |
|     Est: Mar 30 - Mar 31    |
|                             |
| ( ) Same Day Delivery       |
|     INR 299, today          |
|     Est: Today before 9 PM  |
|                             |
| [Continue to Payment]       |
+----------------------------+
               |
               v

=============================
  STEP 2: PAYMENT METHOD
=============================
               |
               v
+----------------------------+
| LOAD PAYMENT OPTIONS        |
| GET /api/checkout/          |
|     payment-methods         |
+----------------------------+
               |
               v
+----------------------------+
| PAYMENT METHOD SELECTION    |
|                             |
| == Saved Cards ==           |
| (x) Visa ****4242          |
|     Exp: 12/2027           |
|     (Default)               |
|                             |
| == UPI ==                   |
| ( ) Google Pay              |
| ( ) PhonePe                |
| ( ) Paytm                  |
| ( ) Enter UPI ID:          |
|     [____________@gpay]     |
|                             |
| == Credit/Debit Card ==     |
| ( ) Add New Card            |
|     Number: [____________]  |
|     Expiry: [__/__]         |
|     CVV:    [___]           |
|     Name:   [____________]  |
|                             |
| == Net Banking ==           |
| ( ) SBI                     |
| ( ) HDFC                    |
| ( ) ICICI                   |
| ( ) Axis                    |
|                             |
| == Wallet ==                |
| ( ) Paytm Wallet (INR 1250)|
| ( ) Amazon Pay (INR 500)    |
|                             |
| == Cash on Delivery ==      |
| ( ) Pay on delivery          |
|     (Available for orders   |
|      under INR 50,000)      |
|                             |
| [Continue to Review]        |
+----------------------------+
               |
               v

=============================
  STEP 3: REVIEW & PLACE
=============================
               |
               v
+----------------------------+
| ORDER REVIEW                |
|                             |
| == Shipping To ==           |
| Flat 402, Sunshine Towers   |
| Bengaluru 560034 [Change]   |
|                             |
| == Shipping ==              |
| Express (INR 149) [Change]  |
| Est: Mar 30 - Mar 31        |
|                             |
| == Payment ==               |
| Visa ****4242 [Change]      |
|                             |
| == Items (3) ==             |
| Sony WH-1000XM5   INR 22490|
| boAt Rockerz 450  INR  1299|
| AirPods Pro 2     INR 20990|
|                             |
| == Order Summary ==         |
| Subtotal:     INR 44,779    |
| Shipping:     INR    149    |
| Coupon(SAVE10):INR -4,478   |
| Tax (GST):    INR  2,150    |
| ========================    |
| Total:        INR 42,600    |
|                             |
| [Place Order]               |
+----------------------------+
               |
               v

=================================
  PAYMENT PROCESSING
=================================
               |
               v
+----------------------------+
| PLACE ORDER API CALL        |
|                             |
| POST /api/order             |
| {                           |
|   addressId: "addr-001",    |
|   shippingMethodId:         |
|     "ship-express",         |
|   paymentMethod: {          |
|     type: "saved_card",     |
|     paymentMethodId:        |
|       "pm-001",             |
|     cvv: "***"              |
|   },                        |
|   couponCode: "SAVE10"      |
| }                           |
+----------------------------+
               |
               v
```

---

## Payment Method Flows

### Saved Card Payment
```
+----------------------------+
| SAVED CARD SELECTED         |
| Visa ****4242               |
+----------------------------+
       |
       v
+----------------------------+
| ENTER CVV                   |
| CVV: [___]                  |
|                             |
| [Pay INR 42,600]            |
+----------------------------+
       |
       v
+----------------------------+
| 3D SECURE CHECK             |
|                             |
| Does card require 3DS?      |
+----------------------------+
       |
       +------+--------+
       |               |
      YES             NO
       |               |
       v               v
+-------------------+  Direct
| 3DS VERIFICATION  |  charge
|                   |     |
| Bank OTP/         |     |
| Authentication    |     |
| page opens        |     |
| (redirect or      |     |
|  popup)           |     |
|                   |     |
| Enter OTP: [____] |    |
|                   |     |
| [Verify]          |     |
+-------------------+     |
       |                  |
       +------+-----------+
              |
              v
       +-----------+
       | Gateway   |
       | Response  |
       +-----------+
          |      |
          v      v
      SUCCESS  FAILED
```

### UPI Payment
```
+----------------------------+
| UPI METHOD SELECTED         |
|                             |
| ( ) Google Pay              |
| ( ) PhonePe                |
| (x) Enter UPI ID           |
|     [rahul@gpay]            |
+----------------------------+
       |
       v
+----------------------------+
| INITIATE UPI PAYMENT        |
|                             |
| POST /api/checkout/         |
|      place-order            |
| {                           |
|   paymentMethod: {          |
|     type: "upi",            |
|     upiId: "rahul@gpay"    |
|   }                         |
| }                           |
+----------------------------+
       |
       v
+----------------------------+
| UPI COLLECT REQUEST SENT    |
|                             |
| "Payment request sent to    |
|  your UPI app"              |
|                             |
| Open Google Pay / PhonePe   |
| to approve payment          |
|                             |
| [Waiting...] (polling)      |
|                             |
| Timeout: 5 minutes          |
+----------------------------+
       |
       +------+--------+
       |               |
       v               v
   APPROVED        DECLINED/
   (UPI PIN         TIMEOUT
    entered)
       |               |
       v               v
   SUCCESS          FAILED
```

### New Card Payment
```
+----------------------------+
| NEW CARD FORM               |
|                             |
| Card Number:                |
| [4242 4242 4242 4242]       |
|                             |
| Expiry:  CVV:               |
| [12/28]  [___]              |
|                             |
| Name on Card:               |
| [Premkumar]                 |
|                             |
| [x] Save card for future    |
|                             |
| [Pay INR 42,600]            |
+----------------------------+
       |
       v
+----------------------------+
| CARD VALIDATION             |
|                             |
| - Luhn check (client)      |
| - Expiry valid              |
| - CVV length (3 or 4)      |
+----------------------------+
       |
       v
   3DS Flow (same as above)
```

### Net Banking
```
+----------------------------+
| NET BANKING SELECTED        |
| Bank: HDFC                  |
+----------------------------+
       |
       v
+----------------------------+
| REDIRECT TO BANK            |
|                             |
| User redirected to HDFC     |
| net banking login page      |
|                             |
| 1. Enter user ID            |
| 2. Enter password            |
| 3. Confirm amount            |
| 4. Enter OTP                |
+----------------------------+
       |
       v
+----------------------------+
| BANK CALLBACK               |
|                             |
| Bank redirects back to      |
| HomeBase callback URL       |
| with transaction status     |
+----------------------------+
       |
       +------+--------+
       |               |
       v               v
   SUCCESS          FAILED
```

### Cash on Delivery (COD)
```
+----------------------------+
| COD SELECTED                |
+----------------------------+
       |
       v
  +----------+
  | Order    |--NO--> "COD not available
  | total <= |        for orders above
  | 50,000?  |        INR 50,000"
  +----------+
       |
      YES
       |
       v
  +----------+
  | COD      |--NO--> "COD not available
  | available|        for this pincode"
  | for      |
  | pincode? |
  +----------+
       |
      YES
       |
       v
+----------------------------+
| COD ORDER PLACED            |
|                             |
| POST /api/checkout/         |
|      place-order            |
| {                           |
|   paymentMethod: {          |
|     type: "cod"             |
|   }                         |
| }                           |
|                             |
| No payment verification     |
| needed                      |
|                             |
| Order Status: PLACED        |
| Payment Status:             |
|   PENDING_COD               |
+----------------------------+
       |
       v
   Order Confirmed
   (Payment collected
    at delivery)
```

---

## Payment Result Handling

```
+================================+
| PAYMENT RESULT                  |
+================================+
       |
       +------+--------+--------+
       |               |        |
       v               v        v
+-----------+   +---------+ +----------+
| SUCCESS   |   | FAILED  | | PENDING  |
|           |   |         | |          |
| Payment   |   | Card    | | UPI wait |
| confirmed |   | declined| | Bank     |
|           |   | Timeout | | redirect |
|           |   | Insuff. | | pending  |
|           |   | funds   | |          |
+-----------+   +---------+ +----------+
       |              |            |
       v              v            v
+-----------+   +-----------+ +-----------+
| ORDER     |   | PAYMENT   | | POLL FOR  |
| CONFIRMED |   | FAILED    | | STATUS    |
|           |   | PAGE      | |           |
| orderId:  |   |           | | Check     |
| HB-20260  |   | Error:    | | every 3s  |
| 328-6201  |   | "Payment  | | for 5 min |
|           |   | failed.   | |           |
| Status:   |   | Your card | | Timeout:  |
| PLACED    |   | was       | | treat as  |
|           |   | declined" | | FAILED    |
+-----------+   +-----------+ +-----------+
       |              |
       |         +----+-----+
       |         |          |
       |         v          v
       |   +---------+ +---------+
       |   | RETRY   | | CHANGE  |
       |   | SAME    | | METHOD  |
       |   | METHOD  | |         |
       |   |         | | Go back |
       |   | Re-enter| | to Step |
       |   | CVV or  | | 2       |
       |   | re-      | |        |
       |   | attempt | |         |
       |   +---------+ +---------+
       |        |           |
       |        +-----+-----+
       |              |
       |              v
       |        Payment
       |        Processing
       |        (repeat)
       |
       v
+=========================+
| ORDER CONFIRMATION      |
| order-detail.html       |
+=========================+
       |
       v
+----------------------------+
| CONFIRMATION PAGE           |
|                             |
| +------------------------+ |
| | Order Placed            | |
| | Successfully!           | |
| +------------------------+ |
|                             |
| Order: HB-20260328-6201    |
| Date: Mar 28, 2026         |
|                             |
| Items:                      |
| - Sony WH-1000XM5          |
| - boAt Rockerz 450         |
| - AirPods Pro 2            |
|                             |
| Delivery: Mar 30 - Mar 31  |
| Address: Flat 402,          |
|   Sunshine Towers           |
|                             |
| Payment: Visa ****4242      |
| Total: INR 42,600           |
|                             |
| [Track Order]               |
| [Continue Shopping]         |
+----------------------------+
       |
       v
     [END]
```

---

## Checkout State Machine

```
INITIATED --> AWAITING_PAYMENT --> COMPLETED
                   |                    |
                   v                    v
            PAYMENT_FAILED         (order created,
                   |                redirect to
                   +--+             confirmation)
                   |  |
                   v  v
              retryPayment  cancel
                   |          |
                   v          v
           AWAITING_      CANCELLED
           PAYMENT

Also: INITIATED can go to CANCELLED
Also: EXPIRED (timeout after 30 min)
```

Customer-visible STM actions:

| State | Actions Available |
|-------|-----------------|
| INITIATED | Cancel Checkout |
| AWAITING_PAYMENT | Cancel Checkout |
| PAYMENT_FAILED | Retry Payment, Cancel Checkout |
| COMPLETED | (terminal, order confirmed) |
| CANCELLED | (terminal) |
| EXPIRED | (terminal) |

---

## Page References

| Step | Prototype Page | URL Path |
|------|---------------|----------|
| Checkout | `customer/checkout.html` | `/checkout` |
| Order Confirmation | `customer/order-detail.html` | `/orders/{orderId}` |
| Order Tracking | `customer/order-tracking.html` | `/order-tracking?orderId={id}` |

---

## API Calls at Each Step

| Step | API Endpoint | Method | Trigger |
|------|-------------|--------|---------|
| **Page Load (parallel)** | | | |
| Load addresses | `GET /api/account/addresses` | GET | Page load |
| Load cart | `GET /api/cart` | GET | Page load |
| Load payment methods | `GET /api/checkout/payment-methods` | GET | Page load |
| **Step 1: Shipping** | | | |
| Add new address | `POST /api/account/addresses` | POST | Form submit |
| Load shipping methods | `GET /api/checkout/shipping-methods?addressId={id}` | GET | Address select |
| **Step 2: Payment** | | | |
| Apply coupon | `POST /api/cart/coupon` | POST | Apply click |
| Remove coupon | `DELETE /api/cart/coupon` | DELETE | Remove click |
| **Step 3: Place Order** | | | |
| Place order (card) | `POST /api/order` | POST | Place Order click |
| Place order (UPI) | `POST /api/checkout/place-order` | POST | Place Order click |
| Place order (COD) | `POST /api/checkout/place-order` | POST | Place Order click |
| **Post-Payment** | | | |
| Poll payment status | `GET /api/checkout/payment-status/{txnId}` | GET | Auto-poll (3s) |
| Retry payment | `PATCH /api/checkout/{id}/retryPayment` | PATCH | Retry click |
| Cancel checkout | `PATCH /api/checkout/{id}/cancel` | PATCH | Cancel click |

---

## Decision Points

| Decision | Condition | Path A | Path B |
|----------|-----------|--------|--------|
| Authenticated? | JWT token valid | Continue | Redirect to login |
| Has addresses? | `addresses.length > 0` | Show list | Show add form |
| Shipping to serviceable area? | Pincode check | Show methods | "Delivery not available" |
| Same day available? | Time of day + pincode | Show option | Hide same day |
| COD eligible? | `codAvailable && total <= codLimit` | Show COD | Hide or disable COD |
| Card requires 3DS? | Card issuer policy | Show 3DS verification | Direct charge |
| Wallet sufficient? | `wallet.balance >= total` | Full wallet pay | Show remaining via card |
| Payment succeeded? | Gateway response | Order confirmation | Failure + retry |
| Order total changed? | Cart modified during checkout | Refresh totals, re-confirm | Continue |

---

## Error Paths

| Error | Trigger | User Experience | Recovery |
|-------|---------|----------------|----------|
| Cart empty | Navigate to /checkout with empty cart | Redirect to /cart | Add items |
| Not authenticated | No JWT | Redirect to /login?redirect=/checkout | Login then return |
| Address validation fail | Invalid pincode | "Invalid pincode" inline error | Correct pincode |
| Shipping unavailable | Remote area | "Delivery not available to this pincode" | Change address |
| Card declined | Insufficient funds | "Card declined. Please try another" | Change card or method |
| 3DS verification fail | Wrong OTP | "3D Secure verification failed" | Retry or change card |
| UPI timeout | No response in 5 min | "Payment request timed out" | Retry or change method |
| UPI declined | User rejected | "Payment declined by UPI app" | Retry or change method |
| Net banking fail | Session timeout at bank | "Bank session expired" | Retry |
| COD not available | Amount exceeds limit | "COD unavailable for this order" | Choose online payment |
| Coupon expired | Applied during checkout | "Coupon SAVE10 has expired" | Remove coupon |
| Item out of stock | During checkout | "1 item went out of stock" | Remove item, recalculate |
| Payment gateway down | System error | "Payment service temporarily unavailable" | Retry after 30s |
| Duplicate order | Double-click | Idempotency key prevents duplicate | Show existing order |
| Checkout expired | 30 min timeout | "Checkout session expired" | Restart checkout |

---

## Time Estimates

| Step | User Action | Estimated Time |
|------|------------|---------------|
| **Step 1: Address & Shipping** | | |
| Select saved address | Click radio | 3-5 seconds |
| Add new address | Fill form | 30-60 seconds |
| Select shipping method | Click radio | 3-5 seconds |
| **Step 2: Payment** | | |
| Select saved card + CVV | Click + type 3 digits | 5-10 seconds |
| Enter new card details | Full card form | 30-45 seconds |
| Enter UPI ID | Type ID | 10-15 seconds |
| Select net banking | Click bank | 3-5 seconds |
| Select COD | Click radio | 3 seconds |
| **Step 3: Review & Place** | | |
| Review order | Scan summary | 15-30 seconds |
| Click Place Order | Button click | 2 seconds |
| **Payment Processing** | | |
| 3DS OTP (card) | Enter bank OTP | 15-30 seconds |
| UPI approval | Open app, enter PIN | 15-30 seconds |
| Net banking login | Login + OTP at bank | 30-60 seconds |
| COD (no verification) | N/A | 0 seconds |
| Payment gateway processing | Wait | 3-10 seconds |
| **Total (saved card, saved address)** | | **30-60 seconds** |
| **Total (new card, new address)** | | **2-4 minutes** |
| **Total (UPI)** | | **1-2 minutes** |
| **Total (net banking)** | | **2-3 minutes** |
| **Total (COD)** | | **30-45 seconds** |

---

## Security Considerations

| Measure | Implementation |
|---------|---------------|
| CVV never stored | Client-side only, sent once per transaction |
| PCI DSS compliance | Card tokenization via payment gateway |
| 3D Secure | Mandatory for cards above INR 2,000 (RBI mandate) |
| UPI limits | Per-transaction limit per UPI provider |
| COD verification | Phone OTP for COD orders above INR 10,000 |
| Idempotency | Unique key per checkout to prevent double charge |
| HTTPS only | All payment API calls over TLS 1.3 |
| Checkout timeout | Session expires after 30 minutes of inactivity |
