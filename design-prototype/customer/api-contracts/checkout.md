# Checkout — API Contract

## Page: checkout.html

**Note:** Checkout uses standard REST GET for loading addresses, shipping methods, and payment methods. Place order uses Chenile Command POST pattern with `GenericResponse<StateEntityServiceResponse<Order>>` response.

---

## Section 1: Saved Addresses

**Data needed:** User's saved shipping addresses
**API:** `GET /api/account/addresses`

**Response:**
```json
{
  "addresses": [
    {
      "id": "addr-001",
      "fullName": "Rahul Sharma",
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
      "fullName": "Rahul Sharma",
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

## Section 2: Shipping Methods

**Data needed:** Available shipping options for selected address
**API:** `GET /api/checkout/shipping-methods?addressId={addressId}`

**Query Params:**
- `addressId` — selected delivery address ID

**Response:**
```json
{
  "methods": [
    {
      "id": "ship-standard",
      "name": "Standard Delivery",
      "description": "Delivered in 5-7 business days",
      "estimatedDelivery": { "from": "2026-04-02", "to": "2026-04-04" },
      "cost": 0,
      "isFree": true
    },
    {
      "id": "ship-express",
      "name": "Express Delivery",
      "description": "Delivered in 2-3 business days",
      "estimatedDelivery": { "from": "2026-03-30", "to": "2026-03-31" },
      "cost": 149,
      "isFree": false
    },
    {
      "id": "ship-sameday",
      "name": "Same Day Delivery",
      "description": "Delivered today before 9 PM",
      "estimatedDelivery": { "from": "2026-03-28", "to": "2026-03-28" },
      "cost": 299,
      "isFree": false
    }
  ]
}
```

---

## Section 3: Order Summary (Right Sidebar)

**Data needed:** Cart items and pricing for checkout review
**API:** `GET /api/cart` (same as cart page)

**Note:** Reuses cart API. Summary includes applied coupon, shipping cost based on selected method.

---

## Section 4: Payment Methods

**Data needed:** Available payment options and saved payment methods
**API:** `GET /api/checkout/payment-methods`

**Response:**
```json
{
  "savedCards": [
    {
      "id": "pm-001",
      "type": "credit_card",
      "brand": "Visa",
      "last4": "4242",
      "expiryMonth": 12,
      "expiryYear": 2027,
      "holderName": "Rahul Sharma",
      "isDefault": true
    }
  ],
  "upiOptions": [
    { "id": "upi-gpay", "name": "Google Pay", "icon": "gpay" },
    { "id": "upi-phonepe", "name": "PhonePe", "icon": "phonepe" },
    { "id": "upi-paytm", "name": "Paytm", "icon": "paytm" }
  ],
  "netBanking": [
    { "id": "nb-sbi", "name": "State Bank of India", "code": "SBI" },
    { "id": "nb-hdfc", "name": "HDFC Bank", "code": "HDFC" },
    { "id": "nb-icici", "name": "ICICI Bank", "code": "ICICI" },
    { "id": "nb-axis", "name": "Axis Bank", "code": "AXIS" }
  ],
  "wallets": [
    { "id": "wallet-paytm", "name": "Paytm Wallet", "balance": 1250 },
    { "id": "wallet-amazon", "name": "Amazon Pay", "balance": 500 }
  ],
  "codAvailable": true,
  "codLimit": 50000
}
```

---

## Summary

| # | Section | API Endpoint | Method | Cache |
|---|---------|-------------|--------|-------|
| 1 | Saved Addresses | `/api/account/addresses` | GET | No |
| 2 | Shipping Methods | `/api/checkout/shipping-methods?addressId={id}` | GET | 30s |
| 3 | Cart / Order Summary | `/api/cart` | GET | No |
| 4 | Payment Methods | `/api/checkout/payment-methods` | GET | No |

**Total API calls on page load: 4 (parallel, except shipping methods which depends on address selection)**

---

## User Actions

### Action: Add New Address
**Trigger:** User fills out the new address form and submits
**API:** `POST /api/account/addresses`
```json
{
  "fullName": "Rahul Sharma",
  "phone": "+91 98765 43210",
  "addressLine1": "New Building, 5th Floor",
  "addressLine2": "New Street",
  "city": "Bengaluru",
  "state": "Karnataka",
  "postalCode": "560001",
  "country": "IN",
  "type": "Home"
}
```
**Response:** `201 Created`
```json
{ "id": "addr-003", "fullName": "Rahul Sharma", "...": "..." }
```

### Action: Select Shipping Method
**Trigger:** User selects a shipping radio card
**API:** No separate API call — updates order summary calculation client-side

### Action: Place Order (Command Create)
**Trigger:** User clicks "Place Order" button in the review step
**API:** `POST /api/order`
**Fetch/XHR name:** `order`

**Request:**
```json
{
  "addressId": "addr-001",
  "shippingMethodId": "ship-standard",
  "paymentMethod": {
    "type": "saved_card",
    "paymentMethodId": "pm-001",
    "cvv": "***"
  },
  "couponCode": "SAVE10",
  "orderNotes": ""
}
```

**Response:** `201 Created`
```json
{
  "orderId": "HB-20260328-6201",
  "status": "PLACED",
  "total": 46929,
  "paymentStatus": "PAID",
  "estimatedDelivery": { "from": "2026-04-02", "to": "2026-04-04" },
  "redirectUrl": "/orders/HB-20260328-6201"
}
```

### Action: Validate Coupon (at checkout)
**API:** `POST /api/cart/coupon`
```json
{ "code": "SAVE10" }
```

### Action: Pay with UPI
**API:** `POST /api/checkout/place-order`
```json
{
  "addressId": "addr-001",
  "shippingMethodId": "ship-standard",
  "paymentMethod": {
    "type": "upi",
    "upiId": "rahul@gpay"
  }
}
```

### Action: Cash on Delivery
**API:** `POST /api/checkout/place-order`
```json
{
  "addressId": "addr-001",
  "shippingMethodId": "ship-standard",
  "paymentMethod": {
    "type": "cod"
  }
}
```

---

## Frontend Integration Pattern

```typescript
// In Next.js page (client component for multi-step form)
'use client';
export default function CheckoutPage() {
  const [step, setStep] = useState(1); // 1=Shipping, 2=Payment, 3=Review

  const { data: addresses } = useSWR('/api/account/addresses', accountApi.addresses);
  const { data: cart } = useSWR('/api/cart', cartApi.get);
  const { data: paymentMethods } = useSWR('/api/checkout/payment-methods', checkoutApi.paymentMethods);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const { data: shippingMethods } = useSWR(
    selectedAddress ? `/api/checkout/shipping-methods?addressId=${selectedAddress}` : null,
    checkoutApi.shippingMethods
  );

  const placeOrder = async (orderData) => {
    const result = await checkoutApi.placeOrder(orderData);
    router.push(`/orders/${result.orderId}`);
  };

  return (
    <>
      <CheckoutSteps current={step} />
      {step === 1 && <ShippingStep addresses={addresses} shippingMethods={shippingMethods} />}
      {step === 2 && <PaymentStep methods={paymentMethods} />}
      {step === 3 && <ReviewStep cart={cart} onPlaceOrder={placeOrder} />}
      <OrderSummary cart={cart} />
    </>
  );
}
```

---

## Allowed Actions -> UI Mapping

The backend returns `allowedActions` on the checkout entity based on its current state (STM).
The frontend reads these and renders only the allowed buttons.

**STM Source:** `checkout-states.xml` (checkout-flow)
**Customer ACL filter:** Only events with `CUSTOMER` in `meta-acls` are shown.

### State -> Allowed Actions -> UI Buttons

| State | allowedActions (customer-visible) | UI Button | Icon | Color | Event ID |
|-------|----------------------------------|-----------|------|-------|----------|
| INITIATED | cancel | Cancel Checkout | XCircle | red | cancel |
| AWAITING_PAYMENT | cancel | Cancel Checkout | XCircle | red | cancel |
| PAYMENT_FAILED | retryPayment | Retry Payment | RefreshCw | blue | retryPayment |
| PAYMENT_FAILED | cancel | Cancel Checkout | XCircle | red | cancel |
| COMPLETED | -- | (read-only, order confirmed) | -- | -- | -- |
| CANCELLED | -- | (read-only, terminal) | -- | -- | -- |
| EXPIRED | -- | (read-only, terminal) | -- | -- | -- |
| COMPENSATED | -- | (read-only, terminal) | -- | -- | -- |

### Frontend Pattern

```typescript
const CHECKOUT_ACTION_CONFIG: Record<string, ActionButtonConfig> = {
  retryPayment: { label: 'Retry Payment', icon: 'RefreshCw', color: 'blue' },
  cancel: { label: 'Cancel Checkout', icon: 'XCircle', color: 'red' },
};

// Render only allowed actions
{allowedActions.map(a => {
  const config = CHECKOUT_ACTION_CONFIG[a.allowedAction];
  return config ? <ActionButton {...config} onClick={() => triggerEvent(checkoutId, a.allowedAction)} /> : null;
})}
```
