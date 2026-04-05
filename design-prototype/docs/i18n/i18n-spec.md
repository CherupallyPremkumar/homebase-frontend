# HomeBase Internationalization (i18n) Specification

> Complete specification for multi-language support across all HomeBase applications.
> Covers locale management, translation key structure, formatting rules, RTL support,
> pluralization, dynamic content boundaries, and next-intl implementation.

---

## Table of Contents

1. [Supported Locales](#1-supported-locales)
2. [Translation Key Structure](#2-translation-key-structure)
3. [Date/Time/Number/Currency Formatting](#3-datetimenumbercurrency-formatting)
4. [RTL Support](#4-rtl-support)
5. [Pluralization Rules](#5-pluralization-rules)
6. [Dynamic Content Boundaries](#6-dynamic-content-boundaries)
7. [Implementation with next-intl](#7-implementation-with-next-intl)
8. [Testing and QA](#8-testing-and-qa)

---

## 1. Supported Locales

### Initial Launch

| Locale Code | Language       | Script     | Direction | Status    |
|-------------|----------------|------------|-----------|-----------|
| `en-IN`     | English (India)| Latin      | LTR       | Primary   |
| `hi-IN`     | Hindi          | Devanagari | LTR       | Secondary |

### Future Expansion (Phase 2+)

| Locale Code | Language  | Script     | Direction | Target Phase |
|-------------|-----------|------------|-----------|--------------|
| `ta-IN`     | Tamil     | Tamil      | LTR       | Phase 2      |
| `te-IN`     | Telugu    | Telugu     | LTR       | Phase 2      |
| `kn-IN`     | Kannada   | Kannada    | LTR       | Phase 3      |
| `bn-IN`     | Bengali   | Bengali    | LTR       | Phase 3      |
| `mr-IN`     | Marathi   | Devanagari | LTR       | Phase 3      |
| `ar-AE`     | Arabic    | Arabic     | RTL       | Phase 4      |

### Locale Detection Priority

1. URL path prefix (`/hi/products`, `/en/products`)
2. User profile preference (stored in database)
3. `Accept-Language` HTTP header
4. Browser `navigator.language`
5. Default: `en-IN`

### Locale Persistence

- Authenticated users: locale saved in user profile via API
- Anonymous users: locale stored in a cookie named `NEXT_LOCALE` (max-age: 1 year)
- URL always reflects the active locale as a path prefix

---

## 2. Translation Key Structure

### Naming Convention

Keys follow a **dot-separated hierarchy** using `camelCase` for leaf nodes:

```
{namespace}.{section}.{subsection}.{key}
```

Rules:
- Namespaces: `common`, `storefront`, `seller`, `admin`, `warehouse`
- Section names match page or component names
- Keys describe the content purpose, not the visual location
- Maximum nesting depth: 4 levels
- No abbreviations in key names
- Placeholders use double-brace ICU format: `{{variableName}}`

### Complete Translation Keys

#### 2.1 Common (Shared Across All Apps)

```json
{
  "common": {
    "appName": "HomeBase",
    "tagline": "India's #1 Online Marketplace",

    "actions": {
      "save": "Save",
      "cancel": "Cancel",
      "delete": "Delete",
      "edit": "Edit",
      "view": "View",
      "search": "Search",
      "filter": "Filter",
      "export": "Export",
      "import": "Import",
      "refresh": "Refresh",
      "retry": "Retry",
      "tryAgain": "Try Again",
      "submit": "Submit",
      "confirm": "Confirm",
      "close": "Close",
      "back": "Back",
      "next": "Next",
      "previous": "Previous",
      "apply": "Apply",
      "clear": "Clear",
      "clearAll": "Clear All",
      "clearSearch": "Clear Search",
      "clearFilter": "Clear Filter",
      "reset": "Reset",
      "viewAll": "View All",
      "viewMore": "View More",
      "viewDetails": "View Details",
      "showMore": "Show More",
      "showLess": "Show Less",
      "loadMore": "Load More",
      "download": "Download",
      "upload": "Upload",
      "print": "Print",
      "copy": "Copy",
      "share": "Share",
      "compare": "Compare",
      "selectAll": "Select All",
      "deselectAll": "Deselect All",
      "addToCart": "Add to Cart",
      "buyNow": "Buy Now",
      "placeOrder": "Place Order",
      "trackOrder": "Track Order",
      "addToWishlist": "Add to Wishlist",
      "removeFromWishlist": "Remove from Wishlist",
      "continueShopping": "Continue Shopping",
      "goHome": "Go to Home",
      "signIn": "Sign In",
      "signOut": "Sign Out",
      "createAccount": "Create Account",
      "shopNow": "Shop Now"
    },

    "status": {
      "active": "Active",
      "inactive": "Inactive",
      "pending": "Pending",
      "processing": "Processing",
      "confirmed": "Confirmed",
      "shipped": "Shipped",
      "delivered": "Delivered",
      "cancelled": "Cancelled",
      "returned": "Returned",
      "refunded": "Refunded",
      "inStock": "In Stock",
      "outOfStock": "Out of Stock",
      "lowStock": "Low Stock",
      "draft": "Draft",
      "published": "Published",
      "archived": "Archived",
      "approved": "Approved",
      "rejected": "Rejected",
      "flagged": "Flagged",
      "suspended": "Suspended",
      "verified": "Verified",
      "unverified": "Unverified",
      "online": "Online",
      "offline": "Offline",
      "open": "Open",
      "closed": "Closed",
      "resolved": "Resolved",
      "inProgress": "In Progress",
      "onHold": "On Hold",
      "completed": "Completed"
    },

    "labels": {
      "home": "Home",
      "search": "Search",
      "cart": "Cart",
      "wishlist": "Wishlist",
      "account": "Account",
      "profile": "Profile",
      "settings": "Settings",
      "notifications": "Notifications",
      "help": "Help",
      "orders": "Orders",
      "products": "Products",
      "returns": "Returns",
      "reviews": "Reviews",
      "messages": "Messages",
      "payments": "Payments",
      "dashboard": "Dashboard",
      "total": "Total",
      "subtotal": "Subtotal",
      "discount": "Discount",
      "tax": "Tax",
      "shipping": "Shipping",
      "grandTotal": "Grand Total",
      "quantity": "Quantity",
      "price": "Price",
      "amount": "Amount",
      "date": "Date",
      "name": "Name",
      "email": "Email",
      "phone": "Phone",
      "address": "Address",
      "description": "Description",
      "category": "Category",
      "all": "All",
      "allCategories": "All Categories",
      "allSellers": "All Sellers",
      "product": "Product",
      "seller": "Seller",
      "customer": "Customer",
      "user": "User",
      "role": "Role",
      "location": "Location"
    },

    "nav": {
      "home": "Home",
      "electronics": "Electronics",
      "fashion": "Fashion",
      "homeLiving": "Home & Living",
      "sports": "Sports",
      "groceries": "Groceries",
      "beauty": "Beauty"
    },

    "topBar": {
      "hotline": "Hotline 24/7:",
      "sellOnHomeBase": "Sell on HomeBase",
      "orderTracking": "Order Tracking",
      "language": "Language",
      "currency": "Currency"
    },

    "search": {
      "placeholder": "Search for products, brands and more...",
      "sellerPlaceholder": "Search orders, products, customers...",
      "adminPlaceholder": "Search sellers, orders, users, products...",
      "warehousePlaceholder": "Search inventory, orders, shipments..."
    },

    "pagination": {
      "page": "Page",
      "of": "of",
      "showing": "Showing",
      "to": "to",
      "entries": "entries",
      "itemsPerPage": "Items per page",
      "firstPage": "First page",
      "lastPage": "Last page",
      "nextPage": "Next page",
      "previousPage": "Previous page"
    },

    "table": {
      "noData": "No data available",
      "loading": "Loading...",
      "sortAsc": "Sort ascending",
      "sortDesc": "Sort descending",
      "actions": "Actions",
      "remove": "Remove"
    },

    "time": {
      "justNow": "Just now",
      "minutesAgo": "{count, plural, one {# minute ago} other {# minutes ago}}",
      "hoursAgo": "{count, plural, one {# hour ago} other {# hours ago}}",
      "daysAgo": "{count, plural, one {# day ago} other {# days ago}}",
      "today": "Today",
      "yesterday": "Yesterday",
      "days": "Days",
      "hours": "Hours",
      "mins": "Mins",
      "secs": "Secs"
    },

    "trust": {
      "freeShipping": "Free Shipping",
      "freeShippingDesc": "On orders over {amount}",
      "securePayment": "Secure Payment",
      "securePaymentDesc": "100% protected",
      "easyReturns": "30-Day Returns",
      "easyReturnsDesc": "Money back guarantee",
      "support247": "24/7 Support",
      "support247Desc": "Live chat & phone"
    },

    "footer": {
      "aboutUs": "About Us",
      "contactUs": "Contact Us",
      "careers": "Careers",
      "privacyPolicy": "Privacy Policy",
      "termsOfService": "Terms of Service",
      "refundPolicy": "Refund Policy",
      "shippingPolicy": "Shipping Policy",
      "faq": "FAQ",
      "helpCenter": "Help Center",
      "sitemap": "Sitemap",
      "copyright": "All rights reserved.",
      "newsletter": "Subscribe to our newsletter",
      "newsletterPlaceholder": "Enter your email",
      "subscribe": "Subscribe"
    },

    "confirmation": {
      "title": "Are you sure?",
      "deleteMessage": "This action cannot be undone.",
      "cancelMessage": "You have unsaved changes. Discard them?",
      "yes": "Yes",
      "no": "No"
    }
  }
}
```

#### 2.2 Storefront (Customer-Facing)

```json
{
  "storefront": {
    "hero": {
      "badge": "SALE {percent}% OFF",
      "title": "Discover the Best Deals on Top Products",
      "subtitle": "Shop from thousands of sellers. Free shipping on orders over {amount}. 30-day easy returns.",
      "newArrival": "New Arrival",
      "bestSeller": "Best Seller"
    },

    "categories": {
      "title": "Shop by Category",
      "viewAll": "View All",
      "laptops": "Laptops",
      "smartphones": "Smartphones",
      "headphones": "Headphones",
      "cameras": "Cameras",
      "gaming": "Gaming",
      "fashion": "Fashion",
      "home": "Home",
      "sports": "Sports",
      "itemCount": "{count, plural, one {# item} other {# items}}"
    },

    "deals": {
      "title": "Deal of the Day",
      "flashSale": "Flash Sale!",
      "description": "Grab the best deals before they're gone. Limited stock available.",
      "viewAllDeals": "View All Deals",
      "endsIn": "Ends in",
      "discount": "-{percent}%"
    },

    "products": {
      "title": "Trending Products",
      "newArrivals": "New Arrivals",
      "featured": "Featured Products",
      "bestsellers": "Bestsellers",
      "soldCount": "{count, plural, one {# Sold} other {# Sold}}",
      "reviewCount": "({count, plural, one {# Review} other {# Reviews}})",
      "addToCart": "Add to Cart",
      "quickView": "Quick View",
      "save": "Save {percent}%",
      "emiStartsAt": "EMI starts at {amount}/month",
      "inclusiveOfTax": "Inclusive of all taxes.",
      "onlyLeftOrder": "Only {count} left - order soon!",
      "freeDelivery": "Free Delivery",
      "estimatedDelivery": "Estimated delivery: {dateRange}",
      "easyReturns": "Easy Returns",
      "returnPolicy": "30-day return & exchange policy",
      "warranty": "{duration} Warranty",
      "warrantyDesc": "Official {brand} manufacturer warranty"
    },

    "productDetail": {
      "breadcrumbHome": "Home",
      "sku": "SKU: {sku}",
      "soldBy": "Sold by",
      "color": "Color: {colorName}",
      "variant": "Variant",
      "quantity": "Quantity",
      "hoverToZoom": "Hover to zoom",
      "description": "Description",
      "specifications": "Specifications",
      "reviews": "Reviews ({count})",
      "relatedProducts": "You may also like",
      "recentlyViewed": "Recently Viewed"
    },

    "cart": {
      "title": "Shopping Cart",
      "itemCount": "({count, plural, one {# item} other {# items}})",
      "product": "Product",
      "price": "Price",
      "quantity": "Quantity",
      "subtotal": "Subtotal",
      "continueShopping": "Continue Shopping",
      "clearCart": "Clear Cart",
      "orderSummary": "Order Summary",
      "itemsSubtotal": "Items ({count})",
      "shippingEstimate": "Shipping (estimated)",
      "free": "Free",
      "taxEstimate": "Tax (estimated)",
      "total": "Total",
      "savings": "You save {amount} on this order!",
      "applyCoupon": "Apply Coupon",
      "couponPlaceholder": "Enter coupon code",
      "couponApply": "Apply",
      "couponRemove": "Remove",
      "moveToWishlist": "Move to Wishlist",
      "remove": "Remove",
      "proceedToCheckout": "Proceed to Checkout",
      "youMayAlsoLike": "You may also like",
      "emptyTitle": "Your cart is empty",
      "emptyDescription": "Looks like you haven't added anything to your cart yet. Browse our collection to find something you'll love.",
      "emptyAction": "Continue Shopping",
      "emptySecondary": "View your wishlist"
    },

    "checkout": {
      "title": "Checkout",
      "secureCheckout": "Secure Checkout",
      "step1": "Shipping",
      "step2": "Payment",
      "step3": "Review",

      "shippingAddress": "Shipping Address",
      "savedAddresses": "Saved Addresses",
      "addNewAddress": "or add new address",
      "addressLabels": {
        "home": "Home",
        "office": "Office",
        "other": "Other"
      },
      "fullName": "Full Name",
      "phoneNumber": "Phone Number",
      "pincode": "PIN Code",
      "addressLine1": "Address Line 1",
      "addressLine2": "Address Line 2 (Optional)",
      "city": "City",
      "state": "State",
      "saveAsDefault": "Save as default address",
      "deliverHere": "Deliver Here",

      "deliveryMethod": "Delivery Method",
      "standardDelivery": "Standard Delivery",
      "standardDeliveryDesc": "5-7 business days",
      "expressDelivery": "Express Delivery",
      "expressDeliveryDesc": "2-3 business days",
      "sameDayDelivery": "Same Day Delivery",
      "sameDayDeliveryDesc": "Order before 12 PM",

      "payment": "Payment Method",
      "creditDebitCard": "Credit / Debit Card",
      "cardNumber": "Card Number",
      "cardExpiry": "Expiry (MM/YY)",
      "cardCvv": "CVV",
      "nameOnCard": "Name on Card",
      "upi": "UPI",
      "upiId": "UPI ID",
      "upiPlaceholder": "yourname@bankname",
      "netBanking": "Net Banking",
      "selectBank": "Select Bank",
      "cashOnDelivery": "Cash on Delivery",
      "cashOnDeliveryDesc": "Pay when you receive your order",
      "wallet": "Wallet",

      "reviewOrder": "Review Your Order",
      "placeOrder": "Place Order",
      "orderPlacedTitle": "Order Placed Successfully!",
      "orderPlacedMessage": "Thank you for your order. Your order ID is {orderId}.",
      "orderConfirmationEmail": "A confirmation email has been sent to {email}.",

      "priceDetails": "Price Details",
      "totalItems": "Total Items",
      "deliveryCharges": "Delivery Charges",
      "totalPayable": "Total Payable"
    },

    "orders": {
      "title": "My Orders",
      "orderNumber": "Order #{orderId}",
      "placedOn": "Placed on {date}",
      "all": "All",
      "processing": "Processing",
      "shipped": "Shipped",
      "delivered": "Delivered",
      "cancelled": "Cancelled",
      "returned": "Returned",
      "viewDetails": "View Details",
      "trackPackage": "Track Package",
      "cancelOrder": "Cancel Order",
      "returnItem": "Return Item",
      "reorder": "Reorder",
      "writeReview": "Write a Review",
      "downloadInvoice": "Download Invoice",
      "emptyTitle": "No orders yet",
      "emptyDescription": "You haven't placed any orders yet. When you do, they'll appear here for you to track.",
      "emptyAction": "Start Shopping",
      "emptySecondary": "Browse deals and offers"
    },

    "orderTracking": {
      "title": "Track Your Order",
      "orderPlaced": "Order Placed",
      "orderConfirmed": "Order Confirmed",
      "packed": "Packed",
      "shipped": "Shipped",
      "outForDelivery": "Out for Delivery",
      "delivered": "Delivered",
      "trackingId": "Tracking ID",
      "estimatedDelivery": "Estimated Delivery",
      "currentStatus": "Current Status",
      "deliveryPartner": "Delivery Partner",
      "shippingAddress": "Shipping Address"
    },

    "returns": {
      "title": "Returns",
      "requestReturn": "Request Return",
      "selectReason": "Select Reason",
      "reasons": {
        "wrongItem": "Wrong item received",
        "damaged": "Product damaged",
        "notAsDescribed": "Not as described",
        "sizeIssue": "Size/fit issue",
        "qualityIssue": "Quality not as expected",
        "changedMind": "Changed my mind",
        "other": "Other"
      },
      "additionalComments": "Additional Comments (Optional)",
      "submitReturn": "Submit Return Request",
      "returnStatus": "Return Status",
      "emptyTitle": "No returns",
      "emptyDescription": "You don't have any return requests. If you need to return an item, you can start from your order details page.",
      "emptyAction": "View Orders"
    },

    "wishlist": {
      "title": "My Wishlist",
      "moveToCart": "Move to Cart",
      "removeItem": "Remove",
      "emptyTitle": "Nothing saved yet",
      "emptyDescription": "Save items you love by tapping the heart icon on any product. They'll show up here so you can find them easily.",
      "emptyAction": "Browse Products"
    },

    "searchResults": {
      "title": "Search Results",
      "resultsFor": "Results for \"{query}\"",
      "resultCount": "{count, plural, =0 {No results} one {# result} other {# results}}",
      "sortBy": "Sort by",
      "sortOptions": {
        "relevance": "Relevance",
        "priceLowHigh": "Price: Low to High",
        "priceHighLow": "Price: High to Low",
        "newest": "Newest First",
        "rating": "Customer Rating",
        "popularity": "Popularity"
      },
      "filters": "Filters",
      "priceRange": "Price Range",
      "brand": "Brand",
      "rating": "Rating",
      "discount": "Discount",
      "availability": "Availability",
      "emptyTitle": "No results for \"{query}\"",
      "emptyDescription": "We couldn't find anything matching your search. Try different keywords or check for typos.",
      "emptyAction": "Clear Search",
      "suggestions": {
        "title": "Suggestions:",
        "checkSpelling": "Check spelling",
        "generalTerms": "Use more general terms",
        "fewerFilters": "Try fewer filters"
      }
    },

    "account": {
      "title": "My Account",
      "personalInfo": "Personal Information",
      "firstName": "First Name",
      "lastName": "Last Name",
      "email": "Email Address",
      "phone": "Phone Number",
      "gender": "Gender",
      "dateOfBirth": "Date of Birth",
      "changePassword": "Change Password",
      "currentPassword": "Current Password",
      "newPassword": "New Password",
      "confirmPassword": "Confirm Password",
      "savedAddresses": "Saved Addresses",
      "paymentMethods": "Payment Methods",
      "orderHistory": "Order History",
      "accountSettings": "Account Settings",
      "deleteAccount": "Delete Account"
    },

    "auth": {
      "signInTitle": "Welcome back",
      "signInSubtitle": "Sign in to your HomeBase account",
      "registerTitle": "Create your account",
      "registerSubtitle": "Join HomeBase and start shopping",
      "emailLabel": "Email Address",
      "emailPlaceholder": "you@example.com",
      "passwordLabel": "Password",
      "passwordPlaceholder": "Enter your password",
      "confirmPasswordLabel": "Confirm Password",
      "confirmPasswordPlaceholder": "Re-enter your password",
      "fullNameLabel": "Full Name",
      "fullNamePlaceholder": "Enter your full name",
      "phoneLabel": "Phone Number",
      "phonePlaceholder": "+91 98765 43210",
      "rememberMe": "Remember me",
      "forgotPassword": "Forgot password?",
      "signIn": "Sign In",
      "createAccount": "Create Account",
      "orDivider": "or",
      "continueWithGoogle": "Continue with Google",
      "signInWithOtp": "Sign in with OTP",
      "agreeToTerms": "I agree to the {termsLink} and {privacyLink}",
      "termsOfService": "Terms of Service",
      "privacyPolicy": "Privacy Policy",
      "alreadyHaveAccount": "Already have an account? {signInLink}",
      "dontHaveAccount": "Don't have an account? {registerLink}",
      "passwordStrength": {
        "weak": "Weak",
        "fair": "Fair",
        "good": "Good",
        "strong": "Strong"
      },
      "trustPoints": {
        "millionsOfProducts": "Millions of Products",
        "millionsOfProductsDesc": "From trusted sellers nationwide",
        "securePayments": "Secure Payments",
        "securePaymentsDesc": "256-bit SSL encryption",
        "easyReturns": "Easy Returns",
        "easyReturnsDesc": "30-day money back guarantee"
      }
    },

    "reviews": {
      "title": "Customer Reviews",
      "writeReview": "Write a Review",
      "ratingDistribution": "Rating Distribution",
      "sortBy": "Sort by",
      "helpful": "Helpful ({count})",
      "report": "Report",
      "verifiedPurchase": "Verified Purchase",
      "ratingLabel": "Your Rating",
      "reviewTitle": "Review Title",
      "reviewBody": "Your Review",
      "submitReview": "Submit Review",
      "emptyTitle": "No reviews yet",
      "emptyDescription": "You haven't reviewed any products yet. Share your experience to help other shoppers make better decisions.",
      "emptyAction": "Review Past Purchases"
    }
  }
}
```

#### 2.3 Seller Hub

```json
{
  "seller": {
    "hub": "Seller Hub",
    "addProduct": "Add Product",
    "premiumSeller": "Premium Seller",
    "sellerScore": "Seller Score",

    "dashboard": {
      "welcome": "Good {timeOfDay}, {name}!",
      "timeOfDay": {
        "morning": "Morning",
        "afternoon": "Afternoon",
        "evening": "Evening"
      },
      "overview": "Overview",
      "todaysSales": "Today's Sales",
      "totalRevenue": "Total Revenue",
      "totalOrders": "Total Orders",
      "totalProducts": "Total Products",
      "conversionRate": "Conversion Rate",
      "averageOrderValue": "Average Order Value",
      "pendingOrders": "Pending Orders",
      "newOrders": "New Orders",
      "salesChart": "Sales Chart",
      "revenueChart": "Revenue Over Time",
      "recentOrders": "Recent Orders",
      "topProducts": "Top Selling Products",
      "quickActions": "Quick Actions",
      "period": {
        "today": "Today",
        "thisWeek": "This Week",
        "thisMonth": "This Month",
        "thisYear": "This Year",
        "custom": "Custom Range"
      },
      "vsLastPeriod": "vs last {period}"
    },

    "products": {
      "title": "Products",
      "addProduct": "Add Product",
      "allProducts": "All Products",
      "active": "Active",
      "draft": "Draft",
      "outOfStock": "Out of Stock",
      "archived": "Archived",
      "productName": "Product Name",
      "sku": "SKU",
      "price": "Price",
      "stock": "Stock",
      "status": "Status",
      "category": "Category",
      "lastUpdated": "Last Updated",
      "bulkActions": "Bulk Actions",
      "bulkActivate": "Activate Selected",
      "bulkDeactivate": "Deactivate Selected",
      "bulkDelete": "Delete Selected",
      "importProducts": "Import Products",
      "exportProducts": "Export Products",
      "emptyTitle": "No products yet",
      "emptyDescription": "Your store is empty. Add your first product to start selling on HomeBase.",
      "emptyAction": "Add Your First Product",
      "emptySecondary": "Learn about listing best practices"
    },

    "addProduct": {
      "title": "Add New Product",
      "editTitle": "Edit Product",
      "basicInfo": "Basic Information",
      "productTitle": "Product Title",
      "productDescription": "Product Description",
      "category": "Category",
      "subcategory": "Subcategory",
      "brand": "Brand",
      "pricing": "Pricing",
      "mrp": "MRP",
      "sellingPrice": "Selling Price",
      "costPrice": "Cost Price (Internal)",
      "gstRate": "GST Rate",
      "hsnCode": "HSN Code",
      "inventory": "Inventory",
      "sku": "SKU",
      "stockQuantity": "Stock Quantity",
      "lowStockThreshold": "Low Stock Threshold",
      "images": "Product Images",
      "uploadImages": "Upload Images",
      "maxImages": "Maximum {count} images. First image is the primary image.",
      "variants": "Variants",
      "addVariant": "Add Variant",
      "shipping": "Shipping",
      "weight": "Weight (g)",
      "dimensions": "Dimensions (L x W x H cm)",
      "seo": "SEO",
      "metaTitle": "Meta Title",
      "metaDescription": "Meta Description",
      "tags": "Tags",
      "saveAsDraft": "Save as Draft",
      "publish": "Publish"
    },

    "orders": {
      "title": "Orders",
      "allOrders": "All Orders",
      "newOrders": "New",
      "processing": "Processing",
      "shipped": "Shipped",
      "delivered": "Delivered",
      "cancelled": "Cancelled",
      "returned": "Returned",
      "orderId": "Order ID",
      "customer": "Customer",
      "items": "Items",
      "total": "Total",
      "date": "Date",
      "status": "Status",
      "confirmOrder": "Confirm Order",
      "markShipped": "Mark as Shipped",
      "trackingNumber": "Tracking Number",
      "shippingCarrier": "Shipping Carrier",
      "printLabel": "Print Label",
      "printInvoice": "Print Invoice",
      "emptyTitle": "No orders yet",
      "emptyDescription": "When customers place orders, they'll appear here.",
      "emptyAction": "View Products"
    },

    "inventory": {
      "title": "Inventory",
      "stockOverview": "Stock Overview",
      "totalSKUs": "Total SKUs",
      "inStock": "In Stock",
      "lowStock": "Low Stock",
      "outOfStock": "Out of Stock",
      "updateStock": "Update Stock",
      "stockHistory": "Stock History",
      "bulkUpdate": "Bulk Update",
      "downloadTemplate": "Download Template"
    },

    "returns": {
      "title": "Returns",
      "pendingReturns": "Pending Returns",
      "approvedReturns": "Approved",
      "rejectedReturns": "Rejected",
      "approveReturn": "Approve Return",
      "rejectReturn": "Reject Return",
      "returnReason": "Return Reason",
      "customerNote": "Customer Note",
      "emptyTitle": "No return requests",
      "emptyDescription": "Return requests from customers will appear here.",
      "emptyAction": "View Orders"
    },

    "payments": {
      "title": "Payments",
      "totalEarnings": "Total Earnings",
      "pendingPayout": "Pending Payout",
      "lastPayout": "Last Payout",
      "payoutHistory": "Payout History",
      "requestPayout": "Request Payout",
      "payoutDate": "Payout Date",
      "payoutAmount": "Amount",
      "payoutStatus": "Status",
      "transactionId": "Transaction ID",
      "bankDetails": "Bank Details",
      "accountNumber": "Account Number",
      "ifscCode": "IFSC Code",
      "accountHolder": "Account Holder"
    },

    "settlements": {
      "title": "Settlements",
      "settlementSummary": "Settlement Summary",
      "settlementHistory": "Settlement History",
      "settlementDate": "Settlement Date",
      "settlementAmount": "Amount",
      "orderCount": "Orders",
      "commission": "Commission",
      "netPayable": "Net Payable"
    },

    "reviews": {
      "title": "Reviews",
      "averageRating": "Average Rating",
      "totalReviews": "Total Reviews",
      "respondToReview": "Respond",
      "reportReview": "Report",
      "emptyTitle": "No reviews yet",
      "emptyDescription": "Customer reviews will appear here once they start coming in.",
      "emptyAction": "View Products"
    },

    "messages": {
      "title": "Messages",
      "inbox": "Inbox",
      "sent": "Sent",
      "compose": "Compose",
      "replyPlaceholder": "Type your reply...",
      "send": "Send",
      "emptyTitle": "No messages",
      "emptyDescription": "Customer messages will appear here."
    },

    "performance": {
      "title": "Performance",
      "overallScore": "Overall Score",
      "orderFulfillment": "Order Fulfillment Rate",
      "onTimeDelivery": "On-Time Delivery",
      "returnRate": "Return Rate",
      "customerSatisfaction": "Customer Satisfaction",
      "responseTime": "Average Response Time",
      "cancellationRate": "Cancellation Rate"
    },

    "support": {
      "title": "Support",
      "createTicket": "Create Ticket",
      "ticketId": "Ticket ID",
      "subject": "Subject",
      "priority": "Priority",
      "priorities": {
        "low": "Low",
        "medium": "Medium",
        "high": "High",
        "urgent": "Urgent"
      },
      "emptyTitle": "No support tickets",
      "emptyDescription": "Need help? Create a support ticket and our team will assist you.",
      "emptyAction": "Create Ticket"
    },

    "documents": {
      "title": "Documents",
      "uploadDocument": "Upload Document",
      "documentType": "Document Type",
      "uploadDate": "Upload Date",
      "verificationStatus": "Status",
      "types": {
        "gstCertificate": "GST Certificate",
        "panCard": "PAN Card",
        "bankStatement": "Bank Statement",
        "businessLicense": "Business License",
        "addressProof": "Address Proof"
      },
      "emptyTitle": "No documents uploaded",
      "emptyDescription": "Upload your business documents for verification.",
      "emptyAction": "Upload Document"
    },

    "storeSettings": {
      "title": "Store Settings",
      "storeName": "Store Name",
      "storeDescription": "Store Description",
      "storeLogo": "Store Logo",
      "storeBanner": "Store Banner",
      "businessAddress": "Business Address",
      "shippingSettings": "Shipping Settings",
      "returnPolicy": "Return Policy",
      "paymentSettings": "Payment Settings"
    },

    "profile": {
      "title": "My Profile",
      "myProfile": "My Profile",
      "storeSettings": "Store Settings",
      "memberSince": "Member since {year}"
    },

    "sidebar": {
      "mainMenu": "Main Menu",
      "products": "Products",
      "orders": "Orders",
      "inventory": "Inventory",
      "returns": "Returns",
      "reviews": "Reviews",
      "messages": "Messages",
      "performance": "Performance",
      "tools": "Tools",
      "payments": "Payments",
      "settlements": "Settlements",
      "documents": "Documents",
      "support": "Support",
      "settings": "Settings"
    }
  }
}
```

#### 2.4 Admin (Platform Management)

```json
{
  "admin": {
    "platform": "PLATFORM",
    "platformAdmin": "Platform Admin",
    "auditLog": "Audit Log",

    "dashboard": {
      "title": "Platform Overview",
      "totalRevenue": "Total Revenue",
      "totalOrders": "Total Orders",
      "activeSellers": "Active Sellers",
      "registeredUsers": "Registered Users",
      "pendingApprovals": "Pending Approvals",
      "systemHealth": "System Health",
      "recentActivity": "Recent Activity",
      "platformGrowth": "Platform Growth",
      "topSellers": "Top Sellers",
      "flaggedItems": "Flagged Items",
      "revenueByCategory": "Revenue by Category",
      "orderVolume": "Order Volume"
    },

    "orders": {
      "title": "Order Management",
      "allOrders": "All Orders",
      "escalatedOrders": "Escalated",
      "disputedOrders": "Disputed",
      "orderOverride": "Override Order Status",
      "issueRefund": "Issue Refund",
      "contactSeller": "Contact Seller",
      "contactBuyer": "Contact Buyer"
    },

    "products": {
      "title": "Product Moderation",
      "pendingReview": "Pending Review",
      "approved": "Approved",
      "flagged": "Flagged",
      "removed": "Removed",
      "approveProduct": "Approve",
      "rejectProduct": "Reject",
      "flagProduct": "Flag for Review",
      "removeProduct": "Remove from Marketplace",
      "bulkApprove": "Bulk Approve",
      "bulkReject": "Bulk Reject"
    },

    "sellers": {
      "title": "Seller Management",
      "allSellers": "All Sellers",
      "pendingApproval": "Pending Approval",
      "activeSellers": "Active",
      "suspendedSellers": "Suspended",
      "approveSeller": "Approve Seller",
      "suspendSeller": "Suspend Seller",
      "reactivateSeller": "Reactivate Seller",
      "viewStore": "View Store",
      "sellerDetails": "Seller Details",
      "documentVerification": "Document Verification",
      "commissionRate": "Commission Rate"
    },

    "users": {
      "title": "User Management",
      "allUsers": "All Users",
      "activeUsers": "Active",
      "suspendedUsers": "Suspended",
      "userDetails": "User Details",
      "suspendUser": "Suspend User",
      "reactivateUser": "Reactivate User",
      "updateRole": "Update Role",
      "roles": {
        "admin": "Admin",
        "moderator": "Moderator",
        "support": "Support Agent",
        "viewer": "Viewer"
      }
    },

    "reviews": {
      "title": "Review Moderation",
      "pendingReview": "Pending",
      "approvedReviews": "Approved",
      "flaggedReviews": "Flagged",
      "removedReviews": "Removed",
      "approveReview": "Approve",
      "flagReview": "Flag",
      "removeReview": "Remove"
    },

    "returns": {
      "title": "Return Management",
      "allReturns": "All Returns",
      "escalated": "Escalated",
      "overrideDecision": "Override Decision"
    },

    "promotions": {
      "title": "Promotions",
      "createPromotion": "Create Promotion",
      "activePromotions": "Active",
      "scheduledPromotions": "Scheduled",
      "expiredPromotions": "Expired",
      "promotionName": "Promotion Name",
      "discountType": "Discount Type",
      "discountValue": "Discount Value",
      "startDate": "Start Date",
      "endDate": "End Date",
      "applicableCategories": "Applicable Categories",
      "minimumOrderValue": "Minimum Order Value",
      "usageLimit": "Usage Limit",
      "activate": "Activate",
      "pause": "Pause",
      "deletePromotion": "Delete"
    },

    "compliance": {
      "title": "Compliance",
      "pendingReview": "Pending Review",
      "approved": "Approved",
      "rejected": "Rejected",
      "documentReview": "Document Review",
      "gstVerification": "GST Verification",
      "fssaiVerification": "FSSAI Verification",
      "approve": "Approve",
      "reject": "Reject",
      "requestResubmission": "Request Resubmission"
    },

    "cms": {
      "title": "CMS",
      "pages": "Pages",
      "banners": "Banners",
      "createPage": "Create Page",
      "editPage": "Edit Page",
      "pageTitle": "Page Title",
      "pageSlug": "URL Slug",
      "pageContent": "Content",
      "publish": "Publish",
      "unpublish": "Unpublish",
      "saveDraft": "Save as Draft"
    },

    "analytics": {
      "title": "Analytics",
      "salesAnalytics": "Sales Analytics",
      "userAnalytics": "User Analytics",
      "sellerAnalytics": "Seller Analytics",
      "productAnalytics": "Product Analytics",
      "dateRange": "Date Range",
      "exportReport": "Export Report",
      "compareWith": "Compare with",
      "metrics": {
        "gmv": "GMV (Gross Merchandise Value)",
        "aov": "AOV (Average Order Value)",
        "conversionRate": "Conversion Rate",
        "cartAbandonmentRate": "Cart Abandonment Rate",
        "repeatCustomerRate": "Repeat Customer Rate",
        "nps": "Net Promoter Score"
      }
    },

    "sidebar": {
      "mainMenu": "Main Menu",
      "dashboard": "Dashboard",
      "orders": "Orders",
      "returns": "Returns",
      "products": "Products",
      "sellers": "Sellers",
      "users": "Users",
      "reviews": "Reviews",
      "management": "Management",
      "promotions": "Promotions",
      "compliance": "Compliance",
      "cms": "CMS",
      "analytics": "Analytics",
      "settings": "Settings"
    }
  }
}
```

#### 2.5 Warehouse

```json
{
  "warehouse": {
    "hub": "WAREHOUSE",
    "warehouseManager": "Warehouse Manager",

    "dashboard": {
      "title": "Warehouse Dashboard",
      "pendingPickup": "Pending Pickup",
      "inTransit": "In Transit",
      "todaysDispatches": "Today's Dispatches",
      "capacityUtilization": "Capacity Utilization",
      "ordersToFulfill": "Orders to Fulfill",
      "activeShipments": "Active Shipments",
      "storageCapacity": "Storage Capacity",
      "zoneStatus": "Zone Status",
      "recentActivity": "Recent Activity"
    },

    "inbound": {
      "title": "Inbound",
      "expectedShipments": "Expected Shipments",
      "receiving": "Receiving",
      "qualityCheck": "Quality Check",
      "putAway": "Put Away",
      "receiveShipment": "Receive Shipment",
      "logDiscrepancy": "Log Discrepancy",
      "expectedQuantity": "Expected Qty",
      "receivedQuantity": "Received Qty",
      "discrepancy": "Discrepancy"
    },

    "inventory": {
      "title": "Inventory",
      "totalItems": "Total Items",
      "binLocations": "Bin Locations",
      "stockAdjustment": "Stock Adjustment",
      "cycleCount": "Cycle Count",
      "damageWriteOff": "Damage Write-off",
      "stockTransfer": "Stock Transfer",
      "from": "From",
      "to": "To",
      "zone": "Zone",
      "aisle": "Aisle",
      "rack": "Rack",
      "bin": "Bin",
      "currentQty": "Current Qty",
      "adjustedQty": "Adjusted Qty",
      "reason": "Reason"
    },

    "orders": {
      "title": "Orders",
      "pendingPick": "Pending Pick",
      "picking": "Picking",
      "packing": "Packing",
      "readyToShip": "Ready to Ship",
      "generatePickList": "Generate Pick List",
      "markAsPicked": "Mark as Picked",
      "markAsPacked": "Mark as Packed",
      "printPackingSlip": "Print Packing Slip"
    },

    "shipments": {
      "title": "Shipments",
      "pendingDispatch": "Pending Dispatch",
      "dispatched": "Dispatched",
      "inTransit": "In Transit",
      "delivered": "Delivered",
      "dispatch": "Dispatch",
      "generateLabel": "Generate Label",
      "bulkLabels": "Bulk Labels",
      "carrier": "Carrier",
      "trackingId": "Tracking ID",
      "shipmentId": "Shipment ID",
      "weight": "Weight",
      "destination": "Destination"
    },

    "sidebar": {
      "operations": "Operations",
      "dashboard": "Dashboard",
      "inbound": "Inbound",
      "inventory": "Inventory",
      "orders": "Orders",
      "shipments": "Shipments"
    }
  }
}
```

#### 2.6 Toast Messages (All Apps)

```json
{
  "toast": {
    "cart": {
      "addedToCart": "Item added to your cart.",
      "outOfStock": "This item is currently out of stock.",
      "quantityLimit": "Maximum quantity limit reached for this item.",
      "removedFromCart": "Item removed from your cart.",
      "cartUpdated": "Cart updated.",
      "stockExceeded": "Only {count} items available in stock.",
      "cartCleared": "Your cart has been cleared."
    },
    "coupon": {
      "applied": "Coupon \"{code}\" applied. You saved {amount}!",
      "invalid": "Invalid coupon code. Please check and try again.",
      "expired": "This coupon has expired.",
      "minimumNotMet": "Minimum order amount of {amount} required for this coupon.",
      "removed": "Coupon removed from your order."
    },
    "order": {
      "placed": "Order placed successfully! Your order ID is {orderId}.",
      "placementFailed": "We could not place your order. Please try again.",
      "paymentFailed": "Payment failed. Please check your payment details and try again.",
      "cancelled": "Your order has been cancelled. Refund will be processed shortly.",
      "cancellationFailed": "Unable to cancel this order. Please contact support.",
      "confirmed": "Order {orderId} confirmed.",
      "shipped": "Order {orderId} marked as shipped.",
      "newOrderReceived": "New order received: {orderId}."
    },
    "auth": {
      "loginSuccess": "Welcome back, {name}!",
      "loginFailed": "Invalid email or password. Please try again.",
      "accountLocked": "Your account has been locked. Please contact support.",
      "accountSuspended": "Your account has been suspended. Please contact support.",
      "logoutSuccess": "You have been logged out.",
      "sessionExpired": "Your session has expired. Please log in again.",
      "registerSuccess": "Account created successfully! Welcome to HomeBase.",
      "emailExists": "An account with this email already exists.",
      "validationError": "Please correct the highlighted fields and try again.",
      "verificationSent": "A verification email has been sent to {email}.",
      "emailVerified": "Your email has been verified.",
      "passwordResetSent": "Password reset link sent to {email}. Check your inbox.",
      "passwordResetFailed": "Unable to send reset link. Please verify your email address.",
      "passwordChanged": "Your password has been updated.",
      "passwordChangeFailed": "Current password is incorrect."
    },
    "address": {
      "added": "Address added successfully.",
      "updated": "Address updated successfully.",
      "deleted": "Address removed.",
      "setDefault": "Default address updated.",
      "saveFailed": "Unable to save address. Please check the details and try again."
    },
    "wishlist": {
      "added": "Item added to your wishlist.",
      "removed": "Item removed from your wishlist.",
      "movedToCart": "Item moved to your cart.",
      "addFailed": "Unable to add item to wishlist. Please try again."
    },
    "review": {
      "submitted": "Thank you! Your review has been submitted.",
      "submitFailed": "Unable to submit your review. Please try again.",
      "updated": "Your review has been updated.",
      "deleted": "Your review has been removed."
    },
    "profile": {
      "updated": "Profile updated successfully.",
      "updateFailed": "Unable to update profile. Please try again.",
      "avatarUploaded": "Profile photo updated.",
      "avatarFailed": "Unable to upload photo. Maximum file size is 5MB."
    },
    "product": {
      "created": "Product \"{name}\" created as draft.",
      "createFailed": "Unable to create product. Please check all required fields.",
      "updated": "Product \"{name}\" updated successfully.",
      "updateFailed": "Unable to update product. Please try again.",
      "deleted": "Product \"{name}\" has been deleted.",
      "deleteFailed": "Unable to delete product. It may have active orders.",
      "published": "Product \"{name}\" is now live on the marketplace.",
      "publishFailed": "Unable to publish product. Please ensure all required fields are filled.",
      "deactivated": "Product \"{name}\" has been deactivated.",
      "imageUploaded": "Image uploaded successfully.",
      "imageFailed": "Image upload failed. Maximum file size is 10MB.",
      "importStarted": "Import started. You will be notified when complete.",
      "importComplete": "{count} products imported successfully.",
      "importFailed": "Import failed. Please check the file format and try again."
    },
    "inventory": {
      "stockUpdated": "Stock for \"{productName}\" updated to {quantity}.",
      "stockUpdateFailed": "Unable to update stock. Please try again.",
      "lowStockAlert": "\"{productName}\" is running low ({quantity} remaining).",
      "outOfStockAlert": "\"{productName}\" is now out of stock."
    },
    "settings": {
      "saved": "Settings saved successfully.",
      "saveFailed": "Unable to save settings. Please try again.",
      "logoUploaded": "Store logo updated.",
      "bannerUploaded": "Store banner updated."
    },
    "document": {
      "uploaded": "Document \"{fileName}\" uploaded successfully.",
      "uploadFailed": "Unable to upload document. Maximum file size is 20MB.",
      "verified": "Your document \"{fileName}\" has been verified.",
      "rejected": "Your document \"{fileName}\" was rejected. Please re-upload."
    },
    "payout": {
      "requested": "Payout request submitted. Processing may take 3-5 business days.",
      "requestFailed": "Unable to submit payout request. Please try again.",
      "processed": "Payout of {amount} has been deposited to your account."
    },
    "shared": {
      "networkError": "Connection lost. Please check your internet and try again.",
      "networkRestored": "Connection restored.",
      "serverError": "Something went wrong on our end. Please try again later.",
      "forbidden": "You do not have permission to perform this action.",
      "notFound": "The requested resource was not found.",
      "validationError": "Please correct the highlighted fields.",
      "fileTooLarge": "File exceeds the maximum allowed size.",
      "unsupportedFile": "This file type is not supported.",
      "copiedToClipboard": "Copied to clipboard.",
      "exportStarted": "Export started. You will be notified when the file is ready.",
      "exportReady": "Your export is ready for download.",
      "exportFailed": "Export failed. Please try again.",
      "maintenanceWarning": "Platform maintenance scheduled for {datetime}."
    },
    "admin": {
      "productApproved": "Product \"{name}\" approved and published.",
      "productFlagged": "Product \"{name}\" flagged for review.",
      "productRemoved": "Product \"{name}\" removed from marketplace.",
      "bulkProductsApproved": "{count} products approved.",
      "bulkProductsRejected": "{count} products rejected.",
      "sellerApproved": "Seller \"{name}\" approved and activated.",
      "sellerSuspended": "Seller \"{name}\" has been suspended.",
      "sellerReactivated": "Seller \"{name}\" has been reactivated.",
      "userSuspended": "User \"{name}\" has been suspended.",
      "userReactivated": "User \"{name}\" has been reactivated.",
      "userRoleUpdated": "Role updated for user \"{name}\".",
      "promotionCreated": "Promotion \"{name}\" created.",
      "promotionActivated": "Promotion \"{name}\" is now active.",
      "promotionPaused": "Promotion \"{name}\" paused.",
      "promotionDeleted": "Promotion \"{name}\" deleted.",
      "complianceApproved": "Compliance review approved for \"{entity}\".",
      "complianceRejected": "Compliance review rejected for \"{entity}\". Seller notified.",
      "pagePublished": "Page \"{title}\" published.",
      "pageUnpublished": "Page \"{title}\" unpublished.",
      "pageSavedAsDraft": "Page \"{title}\" saved as draft.",
      "platformSettingsSaved": "Platform settings updated.",
      "feeStructureUpdated": "Fee structure updated. Changes take effect immediately."
    },
    "warehouse": {
      "shipmentReceived": "Shipment {shipmentId} received and logged.",
      "shipmentDiscrepancy": "Shipment {shipmentId} received. {count} items have discrepancies.",
      "itemsPicked": "All items picked for order {orderId}.",
      "pickListGenerated": "Pick list generated for {count} orders.",
      "pickFailed": "Item \"{sku}\" not found at expected location.",
      "orderPacked": "Order {orderId} packed and ready for dispatch.",
      "packingSlipPrinted": "Packing slip printed for order {orderId}.",
      "shipmentDispatched": "Shipment {shipmentId} dispatched. Tracking: {trackingId}.",
      "labelGenerated": "Shipping label generated for order {orderId}.",
      "bulkLabelsGenerated": "{count} shipping labels generated.",
      "stockAdjusted": "Stock adjusted for \"{sku}\". New quantity: {quantity}.",
      "stockTransferCompleted": "Stock transfer from {from} to {to} completed.",
      "damageWriteOff": "Damage write-off recorded for {count} items.",
      "cycleCountCompleted": "Cycle count completed for zone {zone}.",
      "binAssignmentUpdated": "Bin assignment updated for \"{sku}\"."
    }
  }
}
```

#### 2.7 Error States

```json
{
  "errors": {
    "fullPage": {
      "title": "Something went wrong",
      "description": "We're having trouble loading this page. Our team has been notified. Please try again in a moment.",
      "primaryAction": "Try Again",
      "secondaryAction": "Go back to Dashboard",
      "errorId": "Error ID: {requestId}"
    },
    "inline": {
      "failedToLoad": "Failed to load {section}.",
      "retry": "Retry"
    },
    "notFound": {
      "title": "Page not found",
      "description": "The page you're looking for doesn't exist or has been moved.",
      "primaryAction": "Go Home",
      "secondaryAction": "Go back"
    },
    "forbidden": {
      "title": "Access denied",
      "description": "You don't have permission to view this page. Contact your administrator if you think this is a mistake.",
      "primaryAction": "Go to Dashboard"
    },
    "networkError": {
      "title": "No internet connection",
      "description": "Please check your internet connection and try again.",
      "primaryAction": "Try Again"
    },
    "sessionExpired": {
      "title": "Session expired",
      "description": "Your session has expired. Please sign in again to continue.",
      "primaryAction": "Sign In"
    },
    "sections": {
      "statistics": "statistics",
      "recentOrders": "recent orders",
      "salesData": "sales data",
      "products": "products",
      "orders": "orders",
      "cart": "your cart",
      "checkoutDetails": "checkout details",
      "reviews": "reviews",
      "inventory": "inventory",
      "shipments": "shipments"
    }
  }
}
```

---

## 3. Date/Time/Number/Currency Formatting

### 3.1 Currency

| Property | en-IN | hi-IN |
|----------|-------|-------|
| Currency code | INR | INR |
| Symbol | ₹ | ₹ |
| Position | Before number | Before number |
| Grouping | Indian system (1,23,456) | Indian system (1,23,456) |
| Decimal places | 2 (for display), 0 (when .00) | 2 (for display), 0 (when .00) |

```typescript
// Formatter configuration
const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

// Examples:
// 22490    -> "₹22,490"
// 1500.50  -> "₹1,500.50"
// 100000   -> "₹1,00,000"
// 1234567  -> "₹12,34,567"
```

### 3.2 Dates

| Format | Usage | en-IN Example | hi-IN Example |
|--------|-------|---------------|---------------|
| Display (short) | Tables, lists | 27 Mar 2026 | 27 मार्च 2026 |
| Display (long) | Order confirmation | 27 March 2026 | 27 मार्च 2026 |
| Display (relative) | Activity feeds | 2 hours ago | 2 घंटे पहले |
| API format | All API requests/responses | 2026-03-27T10:30:00Z (ISO 8601) | 2026-03-27T10:30:00Z (ISO 8601) |
| Input format | Date pickers | DD/MM/YYYY | DD/MM/YYYY |

```typescript
// Date formatter configuration
const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});
// Output: "27 Mar 2026"

const longDateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
// Output: "27 March 2026"

// Relative time
const relativeFormatter = new Intl.RelativeTimeFormat('en-IN', {
  numeric: 'auto',
});
// Output: "2 hours ago", "yesterday", "3 days ago"
```

### 3.3 Time

| Format | Usage | en-IN Example | hi-IN Example |
|--------|-------|---------------|---------------|
| Display | Timestamps, logs | 2:30 PM | दोपहर 2:30 |
| Display (with date) | Order details | 27 Mar 2026, 2:30 PM | 27 मार्च 2026, दोपहर 2:30 |
| API format | All API requests/responses | ISO 8601 with timezone | ISO 8601 with timezone |

```typescript
const timeFormatter = new Intl.DateTimeFormat('en-IN', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});
// Output: "2:30 PM"
```

### 3.4 Numbers

| Format | Usage | en-IN Example | hi-IN Example |
|--------|-------|---------------|---------------|
| Integer | Counts, quantities | 12,34,567 | 12,34,567 |
| Decimal | Ratings, percentages | 4.8 | 4.8 |
| Percentage | Stats, analytics | 12.5% | 12.5% |
| Compact | Large numbers in cards | 1.2L (1.2 lakh) | 1.2 लाख |

```typescript
const numberFormatter = new Intl.NumberFormat('en-IN');
// 1234567 -> "12,34,567"

const percentFormatter = new Intl.NumberFormat('en-IN', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
// 0.125 -> "12.5%"

const compactFormatter = new Intl.NumberFormat('en-IN', {
  notation: 'compact',
  compactDisplay: 'long',
});
// 100000  -> "1 lakh"
// 1000000 -> "10 lakh"
// 10000000 -> "1 crore"
```

### 3.5 Utility Wrapper

```typescript
// src/lib/formatters.ts
import { useLocale } from 'next-intl';

export function useFormatters() {
  const locale = useLocale();

  return {
    currency: (value: number) =>
      new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(value),

    date: (value: Date | string, style: 'short' | 'long' = 'short') =>
      new Intl.DateTimeFormat(locale, {
        day: '2-digit',
        month: style === 'short' ? 'short' : 'long',
        year: 'numeric',
      }).format(new Date(value)),

    time: (value: Date | string) =>
      new Intl.DateTimeFormat(locale, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(new Date(value)),

    number: (value: number) =>
      new Intl.NumberFormat(locale).format(value),

    percent: (value: number) =>
      new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(value),

    compact: (value: number) =>
      new Intl.NumberFormat(locale, {
        notation: 'compact',
        compactDisplay: 'long',
      }).format(value),
  };
}
```

---

## 4. RTL Support

### 4.1 CSS Logical Properties Mapping

While Hindi (LTR) does not require RTL, the architecture must support future Arabic (RTL) locale. Use CSS logical properties from the start.

| Physical Property | Logical Equivalent | Tailwind Physical | Tailwind Logical |
|---|---|---|---|
| `margin-left` | `margin-inline-start` | `ml-4` | `ms-4` |
| `margin-right` | `margin-inline-end` | `mr-4` | `me-4` |
| `padding-left` | `padding-inline-start` | `pl-4` | `ps-4` |
| `padding-right` | `padding-inline-end` | `pr-4` | `pe-4` |
| `left` | `inset-inline-start` | `left-0` | `start-0` |
| `right` | `inset-inline-end` | `right-0` | `end-0` |
| `text-align: left` | `text-align: start` | `text-left` | `text-start` |
| `text-align: right` | `text-align: end` | `text-right` | `text-end` |
| `border-left` | `border-inline-start` | `border-l` | `border-s` |
| `border-right` | `border-inline-end` | `border-r` | `border-e` |
| `float: left` | `float: inline-start` | `float-left` | `float-start` |
| `float: right` | `float: inline-end` | `float-right` | `float-end` |
| `border-radius (left)` | `border-start-start-radius` | `rounded-l` | `rounded-s` |
| `border-radius (right)` | `border-start-end-radius` | `rounded-r` | `rounded-e` |

### 4.2 Icon Mirroring Rules

| Icon | Mirrors in RTL? | Reason |
|------|-----------------|--------|
| Back arrow (←) | Yes | Directional navigation |
| Forward arrow (→) | Yes | Directional navigation |
| Chevron left (<) | Yes | Pagination, breadcrumb |
| Chevron right (>) | Yes | Pagination, breadcrumb |
| List/menu indent | Yes | Structural alignment |
| Checkmark | No | Universal symbol |
| Star / rating | No | Universal symbol |
| Heart / wishlist | No | Universal symbol |
| Search magnifier | No | Universal symbol |
| Shopping cart | No | Universal symbol |
| User/profile | No | Universal symbol |
| Notification bell | No | Universal symbol |
| Close (X) | No | Universal symbol |
| Plus / minus | No | Mathematical symbol |
| Upload / download | No | Vertical direction |
| Sort arrows | No | Vertical direction |

### 4.3 Layout Direction Changes

```html
<!-- Root layout applies dir attribute based on locale -->
<html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
```

Components that require direction-aware layout:

| Component | LTR Layout | RTL Layout |
|-----------|-----------|------------|
| Sidebar | Fixed left | Fixed right |
| Breadcrumb separator | `>` pointing right | `<` pointing left |
| Progress steps | Left to right | Right to left |
| Toast position | `top-right` | `top-left` |
| Search icon | Left side of input | Right side of input |
| Dropdown arrow | Right side | Left side |
| Cart badge position | Top-right of icon | Top-left of icon |
| Slider/carousel | Swipe left for next | Swipe right for next |

### 4.4 Tailwind RTL Configuration

```javascript
// tailwind.config.js
module.exports = {
  // Tailwind v3.3+ supports logical properties natively
  // Use ms-*, me-*, ps-*, pe-*, start-*, end-* utilities
  corePlugins: {
    // Keep physical property classes available for non-directional use
  },
};
```

```css
/* Global RTL overrides for third-party components */
[dir="rtl"] .sidebar {
  left: auto;
  right: 0;
}

[dir="rtl"] .main-content {
  margin-left: 0;
  margin-right: 15rem; /* sidebar width */
}
```

---

## 5. Pluralization Rules

Use ICU MessageFormat syntax for all pluralized strings. This handles the different pluralization rules across languages (English: one/other, Hindi: one/other, Arabic: zero/one/two/few/many/other).

### 5.1 ICU Message Format Patterns

```
// English
{count, plural,
  =0 {No items}
  one {# item}
  other {# items}
}

// Hindi
{count, plural,
  =0 {कोई वस्तु नहीं}
  one {# वस्तु}
  other {# वस्तुएँ}
}
```

### 5.2 All Pluralized Strings in HomeBase

| Key | zero | one | other |
|-----|------|-----|-------|
| `storefront.cart.itemCount` | (0 items) | (1 item) | ({count} items) |
| `storefront.categories.itemCount` | - | 1 item | {count} items |
| `storefront.searchResults.resultCount` | No results | 1 result | {count} results |
| `storefront.products.reviewCount` | (No Reviews) | (1 Review) | ({count} Reviews) |
| `storefront.products.soldCount` | - | 1 Sold | {count} Sold |
| `common.time.minutesAgo` | - | 1 minute ago | {count} minutes ago |
| `common.time.hoursAgo` | - | 1 hour ago | {count} hours ago |
| `common.time.daysAgo` | - | 1 day ago | {count} days ago |
| `storefront.reviews.helpful` | - | Helpful (1) | Helpful ({count}) |
| `toast.inventory.stockExceeded` | - | Only 1 item available in stock. | Only {count} items available in stock. |
| `toast.product.importComplete` | - | 1 product imported successfully. | {count} products imported successfully. |
| `toast.admin.bulkProductsApproved` | - | 1 product approved. | {count} products approved. |
| `toast.warehouse.pickListGenerated` | - | Pick list generated for 1 order. | Pick list generated for {count} orders. |
| `toast.warehouse.bulkLabelsGenerated` | - | 1 shipping label generated. | {count} shipping labels generated. |
| `common.pagination.showing` | Showing 0 entries | Showing 1 entry | Showing {count} entries |

### 5.3 Translation File Example

```json
{
  "storefront.cart.itemCount": "({count, plural, =0 {0 items} one {# item} other {# items}})",
  "storefront.searchResults.resultCount": "{count, plural, =0 {No results} one {# result} other {# results}}",
  "storefront.products.reviewCount": "({count, plural, =0 {No Reviews} one {# Review} other {# Reviews}})"
}
```

---

## 6. Dynamic Content Boundaries

### 6.1 What Gets Translated

| Content Type | Translate? | Owner | Source |
|---|---|---|---|
| Navigation labels | Yes | Platform | Translation files |
| Category names | Yes | Platform | Translation files |
| Status labels | Yes | Platform | Translation files |
| Button labels | Yes | Platform | Translation files |
| Error messages | Yes | Platform | Translation files |
| Toast messages | Yes | Platform | Translation files |
| Empty state messages | Yes | Platform | Translation files |
| Form labels & placeholders | Yes | Platform | Translation files |
| Tooltip text | Yes | Platform | Translation files |
| Footer content | Yes | Platform | Translation files |
| CMS pages | Yes | Admin | CMS with locale variants |
| Promotional banners | Yes | Admin | CMS with locale variants |
| Email templates | Yes | Platform | Translation files (backend) |
| Push notification text | Yes | Platform | Translation files (backend) |

### 6.2 What Does NOT Get Translated

| Content Type | Translate? | Reason |
|---|---|---|
| Product names | No | Seller-entered content in their chosen language |
| Product descriptions | No | Seller-entered content |
| Seller store names | No | Business identity |
| User names | No | Personal identity |
| Customer reviews | No | User-generated content |
| Customer messages | No | User-generated content |
| Seller messages | No | User-generated content |
| SKU codes | No | System identifiers |
| Order IDs | No | System identifiers |
| Tracking IDs | No | External system identifiers |
| Phone numbers | No | Standard format |
| Email addresses | No | Standard format |
| URLs | No | Technical identifiers |
| Brand names | No | Proper nouns |

### 6.3 Mixed-Language Display Strategy

When translated UI wraps untranslated content, maintain clear visual separation:

```
// Hindi UI with English product name
[हिंदी लेबल]: Sony WH-1000XM5 Wireless Headphones
[हिंदी बटन]: कार्ट में डालें

// Hindi status badge around English order ID
ऑर्डर #HB-2026-00145 — शिप किया गया
```

Rules:
- Product names render in their original language regardless of UI locale
- Status labels always render in the active UI locale
- Numbers follow the active locale formatting (Indian number system in both en-IN and hi-IN)
- Dates follow the active locale formatting

---

## 7. Implementation with next-intl

### 7.1 Directory Structure

```
homebase-frontend/
├── apps/
│   ├── storefront/
│   │   ├── messages/
│   │   │   ├── en-IN.json          # English translations
│   │   │   └── hi-IN.json          # Hindi translations
│   │   ├── src/
│   │   │   ├── i18n/
│   │   │   │   ├── request.ts      # Server-side i18n config
│   │   │   │   └── routing.ts      # Locale routing config
│   │   │   └── middleware.ts        # Locale detection middleware
│   │   └── app/
│   │       └── [locale]/           # Locale-prefixed routes
│   │           ├── layout.tsx
│   │           ├── page.tsx
│   │           ├── products/
│   │           │   ├── page.tsx
│   │           │   └── [id]/
│   │           │       └── page.tsx
│   │           ├── cart/
│   │           │   └── page.tsx
│   │           ├── checkout/
│   │           │   └── page.tsx
│   │           └── ...
│   ├── seller/
│   │   ├── messages/
│   │   │   ├── en-IN.json
│   │   │   └── hi-IN.json
│   │   └── ...
│   ├── admin/
│   │   ├── messages/
│   │   │   ├── en-IN.json
│   │   │   └── hi-IN.json
│   │   └── ...
│   └── warehouse/
│       ├── messages/
│       │   ├── en-IN.json
│       │   └── hi-IN.json
│       └── ...
└── packages/
    └── shared/
        └── messages/
            ├── en-IN.json           # Shared translations (common namespace)
            └── hi-IN.json
```

### 7.2 Routing Configuration

```typescript
// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en-IN', 'hi-IN'],
  defaultLocale: 'en-IN',
  localePrefix: 'as-needed', // Only prefix non-default locales
  pathnames: {
    '/': '/',
    '/products': {
      'en-IN': '/products',
      'hi-IN': '/products',    // Keep URL paths in English for SEO
    },
    '/products/[id]': {
      'en-IN': '/products/[id]',
      'hi-IN': '/products/[id]',
    },
    '/cart': '/cart',
    '/checkout': '/checkout',
    '/orders': '/orders',
    '/wishlist': '/wishlist',
    '/account': '/account',
  },
});

export type Locale = (typeof routing.locales)[number];
```

### 7.3 Middleware

```typescript
// src/middleware.ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing, {
  // Detect locale from cookie first, then Accept-Language header
  localeDetection: true,
});

export const config = {
  // Match all pathnames except API routes, static files, etc.
  matcher: [
    '/',
    '/(en-IN|hi-IN)/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
```

### 7.4 Server-Side Configuration

```typescript
// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Validate that the incoming locale is supported
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  // Load app-specific messages and merge with shared common messages
  const [appMessages, commonMessages] = await Promise.all([
    import(`../../messages/${locale}.json`),
    import(`@homebase/shared/messages/${locale}.json`),
  ]);

  return {
    locale,
    messages: {
      ...commonMessages.default,
      ...appMessages.default,
    },
    // Configure formatters for Indian locale
    formats: {
      dateTime: {
        short: {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        },
        long: {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        },
        withTime: {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        },
      },
      number: {
        currency: {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        },
        percent: {
          style: 'percent',
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        },
      },
    },
    // Global timezone for India
    timeZone: 'Asia/Kolkata',
    // Global "now" for relative time calculations
    now: new Date(),
  };
});
```

### 7.5 Root Layout

```typescript
// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';

// RTL locale list (for future use)
const RTL_LOCALES = ['ar-AE'];

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });
  return {
    title: t('appName'),
    description: t('tagline'),
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### 7.6 Server Component Usage

```typescript
// app/[locale]/products/page.tsx
import { getTranslations } from 'next-intl/server';

export default async function ProductListingPage() {
  const t = await getTranslations('storefront');

  return (
    <main>
      <h1>{t('categories.title')}</h1>
      {/* Shop by Category */}

      <section>
        <div className="flex items-center justify-between">
          <h2>{t('products.title')}</h2>
          <a href="/products">{t('categories.viewAll')}</a>
        </div>
        {/* Product grid */}
      </section>
    </main>
  );
}
```

### 7.7 Client Component Usage

```typescript
// components/AddToCartButton.tsx
'use client';

import { useTranslations } from 'next-intl';

export function AddToCartButton({ productId }: { productId: string }) {
  const t = useTranslations('common.actions');

  return (
    <button onClick={() => addToCart(productId)}>
      {t('addToCart')}
    </button>
  );
}
```

### 7.8 Pluralization Usage

```typescript
// components/CartHeader.tsx
'use client';

import { useTranslations } from 'next-intl';

export function CartHeader({ itemCount }: { itemCount: number }) {
  const t = useTranslations('storefront.cart');

  return (
    <h1>
      {t('title')} {t('itemCount', { count: itemCount })}
    </h1>
  );
  // Output: "Shopping Cart (3 items)"
}
```

### 7.9 Interpolation and Rich Text

```typescript
// components/WelcomeBanner.tsx
'use client';

import { useTranslations } from 'next-intl';

export function WelcomeBanner({ sellerName }: { sellerName: string }) {
  const t = useTranslations('seller.dashboard');

  return (
    <h1>{t('welcome', { timeOfDay: t('timeOfDay.morning'), name: sellerName })}</h1>
  );
  // Output: "Good Morning, Rajesh Store!"
}
```

### 7.10 Number and Date Formatting

```typescript
// components/PriceDisplay.tsx
'use client';

import { useFormatter } from 'next-intl';

export function PriceDisplay({ price, originalPrice }: { price: number; originalPrice?: number }) {
  const format = useFormatter();

  return (
    <div>
      <span className="text-brand-600 font-bold">
        {format.number(price, { style: 'currency', currency: 'INR' })}
      </span>
      {originalPrice && (
        <span className="text-gray-400 line-through">
          {format.number(originalPrice, { style: 'currency', currency: 'INR' })}
        </span>
      )}
    </div>
  );
  // Output: "₹22,490" and "₹29,990"
}
```

```typescript
// components/OrderDate.tsx
'use client';

import { useFormatter } from 'next-intl';

export function OrderDate({ date }: { date: string }) {
  const format = useFormatter();

  return (
    <span>
      {format.dateTime(new Date(date), {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })}
    </span>
  );
  // Output: "27 Mar 2026"
}
```

### 7.11 Locale Switcher Component

```typescript
// components/LocaleSwitcher.tsx
'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';

const LOCALE_LABELS: Record<string, string> = {
  'en-IN': 'English',
  'hi-IN': 'हिन्दी',
};

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function handleChange(newLocale: string) {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <select
      value={locale}
      onChange={(e) => handleChange(e.target.value)}
      className="bg-transparent text-gray-300 text-xs border-none outline-none cursor-pointer"
    >
      {Object.entries(LOCALE_LABELS).map(([code, label]) => (
        <option key={code} value={code}>
          {label}
        </option>
      ))}
    </select>
  );
}
```

### 7.12 Link Component Integration

```typescript
// Use next-intl's Link for automatic locale prefixing
import { Link } from '@/i18n/routing';

// In components:
<Link href="/products">
  {t('common.labels.products')}
</Link>
// Renders as /products (en-IN, default) or /hi/products (hi-IN)
```

---

## 8. Testing and QA

### 8.1 Translation Completeness Checks

Run at build time to ensure no missing keys:

```typescript
// scripts/check-translations.ts
import enIN from '../messages/en-IN.json';
import hiIN from '../messages/hi-IN.json';

function getKeys(obj: Record<string, any>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      return getKeys(value, fullKey);
    }
    return [fullKey];
  });
}

const enKeys = new Set(getKeys(enIN));
const hiKeys = new Set(getKeys(hiIN));

const missingInHi = [...enKeys].filter((k) => !hiKeys.has(k));
const extraInHi = [...hiKeys].filter((k) => !enKeys.has(k));

if (missingInHi.length > 0) {
  console.error('Missing in hi-IN:', missingInHi);
  process.exit(1);
}
if (extraInHi.length > 0) {
  console.warn('Extra keys in hi-IN (not in en-IN):', extraInHi);
}

console.log('All translation keys are in sync.');
```

### 8.2 Visual Regression

- Hindi text is typically 20-40% longer than English
- Test all components with Hindi translations for overflow and truncation
- Verify that buttons, badges, and table columns accommodate longer text
- Test right-to-left layout with a temporary RTL locale override

### 8.3 Pseudo-Localization

During development, use pseudo-localization to catch hardcoded strings:

```typescript
// Use next-intl's built-in onError handler to catch missing translations
// In request.ts:
export default getRequestConfig(async ({ requestLocale }) => {
  // ...
  return {
    // ...
    onError(error) {
      // In development: throw to catch hardcoded strings
      if (process.env.NODE_ENV === 'development') {
        console.error('[i18n]', error.message);
      }
    },
    getMessageFallback({ namespace, key }) {
      // Show key path in development for easy identification
      return `[MISSING: ${namespace}.${key}]`;
    },
  };
});
```

### 8.4 Font Considerations

| Script | Font Stack | Notes |
|--------|-----------|-------|
| Latin (en-IN) | Inter, system-ui, sans-serif | Primary font |
| Devanagari (hi-IN) | Noto Sans Devanagari, system-ui | Load via Google Fonts |
| Tamil (ta-IN) | Noto Sans Tamil, system-ui | Future: Phase 2 |
| Telugu (te-IN) | Noto Sans Telugu, system-ui | Future: Phase 2 |
| Kannada (kn-IN) | Noto Sans Kannada, system-ui | Future: Phase 3 |
| Bengali (bn-IN) | Noto Sans Bengali, system-ui | Future: Phase 3 |
| Arabic (ar-AE) | Noto Sans Arabic, system-ui | Future: Phase 4 |

```typescript
// app/[locale]/layout.tsx
import { Inter } from 'next/font/google';
import { Noto_Sans_Devanagari } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-devanagari',
});

// Apply font based on locale
const fontClass = locale === 'hi-IN'
  ? `${inter.className} ${notoDevanagari.variable}`
  : inter.className;
```

### 8.5 Checklist Before Locale Launch

- [ ] All translation keys present in the new locale file
- [ ] Build-time translation check passes with zero missing keys
- [ ] Currency formatting uses Indian number system (1,00,000)
- [ ] Date formatting matches locale conventions
- [ ] Pluralization rules tested with 0, 1, 2, and large numbers
- [ ] All toast messages translated and tested
- [ ] All error states translated and tested
- [ ] All empty states translated and tested
- [ ] Form validation messages translated
- [ ] Font for the script loads correctly and renders all characters
- [ ] Text overflow tested on buttons, badges, table headers, and cards
- [ ] Locale switcher works from every page without losing state
- [ ] URL prefix applied correctly for non-default locale
- [ ] Meta tags (title, description) render in correct language
- [ ] API requests send `Accept-Language` header matching UI locale
- [ ] User locale preference persists across sessions
