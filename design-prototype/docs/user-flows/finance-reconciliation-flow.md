# Finance Reconciliation Flow

End-to-end flow from order payment through gateway collection, commission deduction, settlement batching, seller payout, and reconciliation.

---

## Flow Overview

```
+--------+     +---------+     +------------+     +-----------+
| Orders |---->| Gateway |---->| Commission |---->| Settlement|
| Come In|     | Collects|     | Deducted   |     | Batch     |
+--------+     +---------+     +------------+     +-----------+
                                                        |
                                                        v
                                              +-----------+     +---------------+
                                              | Seller    |---->| Reconciliation|
                                              | Payout    |     |               |
                                              +-----------+     +---------------+
```

---

## Detailed Flow Diagram

```
    [START]
       |
       v
+===========================+
| PHASE 1: ORDER PAYMENT    |
| (Customer checkout)       |
+===========================+
       |
       v
+----------------------------+
| Customer Places Order       |
|                             |
| Order ID:    {{orderId}}    |
| Amount:      {{totalAmount}}|
| Payment:     {{method}}     |
|                             |
| Payment gateway processes   |
| the transaction.            |
+----------------------------+
       |
       v
+----------------------------+
| GATEWAY COLLECTS PAYMENT    |
| (State: PAYMENT_CAPTURED)   |
|                             |
| Transaction ID: {{txnId}}   |
| Gateway:    {{gatewayName}} |
| Amount:     {{totalAmount}} |
| Fee:        {{gatewayFee}}  |
| Net:        {{netAmount}}   |
|                             |
| Funds held in gateway       |
| escrow account.             |
+----------------------------+
       |
       v
+===========================+
| PHASE 2: COMMISSION CALC  |
| (Automated, per order)    |
+===========================+
       |
       v
+----------------------------+
| PLATFORM DEDUCTS COMMISSION |
|                             |
| Order Amount:  {{total}}    |
| Gateway Fee:   -{{gwFee}}   |
| Platform       -{{commAmt}} |
|   Commission:  ({{rate}}%)  |
| Tax on Comm:   -{{taxAmt}}  |
| TCS/TDS:       -{{tds}}     |
| -------------------------   |
| Seller Net:    {{sellerNet}} |
|                             |
| Breakdown logged to         |
| finance ledger.             |
+----------------------------+
       |
       v
+----------------------------+
| LEDGER ENTRY CREATED        |
| (State: COMMISSION_APPLIED) |
|                             |
| Debit:  Platform Commission |
| Debit:  Gateway Fee         |
| Debit:  Tax / TCS / TDS    |
| Credit: Seller Balance      |
|                             |
| Entry per order line item   |
| (multi-seller orders split) |
+----------------------------+
       |
       v
+===========================+
| PHASE 3: SETTLEMENT BATCH |
| (Scheduled or manual)     |
| admin-finance.html        |
+===========================+
       |
       v
+----------------------------+
| SETTLEMENT BATCH CREATION   |
|                             |
| Batch ID:    {{batchId}}    |
| Period:      {{startDate}}  |
|              to {{endDate}} |
| Sellers:     {{count}}      |
| Total Payout:{{totalPayout}}|
|                             |
| Batch includes all seller   |
| balances for the period.    |
|                             |
| Frequency:                  |
| ( ) Daily                   |
| ( ) Weekly                  |
| ( ) Bi-weekly               |
| ( ) Monthly                 |
|                             |
| [Process Batch]             |
+----------------------------+
       |
       v
+----------------------------+
| BATCH VALIDATION            |
| (State: BATCH_PENDING)      |
|                             |
| For each seller in batch:   |
|                             |
| 1. Verify seller bank       |
|    details are active        |
| 2. Check minimum payout     |
|    threshold ({{minPayout}}) |
| 3. Deduct any pending       |
|    adjustments (refunds,    |
|    penalties)               |
| 4. Calculate final payout   |
|                             |
| Sellers below threshold     |
| roll over to next batch.    |
+----------------------------+
       |
       v
+----------------------------+
| BATCH SUMMARY               |
|                             |
| Batch ID:      {{batchId}}  |
| Eligible:      {{eligible}} |
| Deferred:      {{deferred}} |
| Total Amount:  {{amount}}   |
|                             |
| Adjustments:                |
| - Refunds:     -{{refunds}} |
| - Penalties:   -{{penalty}} |
| - Carry-over:  +{{carry}}   |
|                             |
| Net Payout:    {{netPayout}}|
|                             |
| [Approve & Send to Bank]    |
| [Hold Batch]                |
+----------------------------+
       |
       v
+===========================+
| PHASE 4: SELLER PAYOUT    |
| (Bank transfer initiated) |
+===========================+
       |
       v
+----------------------------+
| PAYOUT INITIATED            |
| (State: PAYOUT_PROCESSING)  |
|                             |
| For each seller:            |
|                             |
| Seller:      {{sellerName}} |
| Amount:      {{payoutAmt}}  |
| Bank:        {{bankName}}   |
| Account:     ****{{last4}}  |
| IFSC:        {{ifsc}}       |
| UTR:         (pending)      |
|                             |
| Bank transfer file          |
| (NEFT/RTGS/IMPS) submitted |
| to payment partner.         |
+----------------------------+
       |
       +-------+--------+
       |                |
       v                v
+-----------+    +-----------+
| PAYOUT    |    | PAYOUT    |
| SUCCESS   |    | FAILED    |
| (State:   |    | (State:   |
| PAID)     |    | FAILED)   |
+-----------+    +-----------+
       |                |
       |                v
       |         +-----------+
       |         | Retry     |
       |         | Logic:    |
       |         | - Auto    |
       |         |   retry   |
       |         |   x3      |
       |         | - Then    |
       |         |   manual  |
       |         |   review  |
       |         +-----------+
       |                |
       |                v
       |         +-----------+
       |         | Admin     |
       |         | reviews   |
       |         | failure.  |
       |         | Update    |
       |         | bank info |
       |         | or manual |
       |         | transfer. |
       |         +-----------+
       |                |
       +--------+-------+
                |
                v
+===========================+
| PHASE 5: RECONCILIATION  |
| admin-finance.html        |
+===========================+
       |
       v
+----------------------------+
| RECONCILIATION PROCESS      |
|                             |
| 1. Gateway Reconciliation   |
|    Match gateway txns       |
|    against order records.   |
|                             |
|    Gateway Total: {{gwTot}} |
|    Orders Total:  {{orTot}} |
|    Matched:       {{match}} |
|    Mismatched:    {{miss}}  |
|                             |
| 2. Payout Reconciliation    |
|    Match bank UTRs against  |
|    payout records.          |
|                             |
|    Payouts Sent:  {{sent}}  |
|    Confirmed:     {{conf}}  |
|    Pending:       {{pend}}  |
|    Failed:        {{fail}}  |
|                             |
| 3. Commission Reconciliation|
|    Verify commission totals |
|    match ledger entries.    |
|                             |
|    Expected:   {{expected}} |
|    Actual:     {{actual}}   |
|    Variance:   {{variance}} |
+----------------------------+
       |
       v
+----------------------------+
| RECONCILIATION RESULT       |
| (State: RECONCILED or       |
|  RECONCILIATION_MISMATCH)   |
|                             |
| All Matched:                |
|   Status: RECONCILED        |
|   "Reconciliation complete" |
|                             |
| Mismatches Found:           |
|   Status: MISMATCH          |
|   Admin must resolve each   |
|   discrepancy manually.     |
|                             |
| [Export Reconciliation      |
|  Report]                    |
| [Mark Resolved]             |
+----------------------------+
       |
       v
    [END]
```

---

## Settlement State Machine (STM)

```
ORDER_PAID
    |
    v
COMMISSION_APPLIED
    |
    v
SETTLEMENT_QUEUED
    |
    v
BATCH_PENDING
    |
    v
BATCH_APPROVED
    |
    v
PAYOUT_PROCESSING
    |
    +------+--------+
    |               |
    v               v
  PAID           FAILED
    |               |
    |          +----+----+
    |          |         |
    |          v         v
    |       RETRYING   MANUAL_REVIEW
    |          |         |
    |          v         |
    |       PAID/FAILED  |
    |          |         |
    +----------+---------+
               |
               v
         RECONCILED  or  RECONCILIATION_MISMATCH
               |                   |
               v                   v
            CLOSED            UNDER_REVIEW
                                   |
                                   v
                                CLOSED
```

---

## Financial Calculations

| Component | Formula | Example (Order = 1000) |
|-----------|---------|----------------------|
| Order Amount | Customer payment | 1000.00 |
| Gateway Fee | Order x gateway rate (2%) | -20.00 |
| Platform Commission | (Order - gateway fee) x commission rate (15%) | -147.00 |
| GST on Commission | Commission x GST rate (18%) | -26.46 |
| TCS (Tax Collected at Source) | Order x TCS rate (1%) | -10.00 |
| **Seller Net Payout** | **Order - all deductions** | **796.54** |

---

## Page References

| Step | Prototype Page | URL Path |
|------|---------------|----------|
| Finance Dashboard | `admin/admin-finance.html` | `/admin/finance` |
| Settlement Batches | `admin/admin-settlements.html` | `/admin/finance/settlements` |
| Batch Detail | `admin/admin-settlement-detail.html` | `/admin/finance/settlements/{{batchId}}` |
| Reconciliation | `admin/admin-reconciliation.html` | `/admin/finance/reconciliation` |
| Seller Earnings | `seller/seller-earnings.html` | `/seller/earnings` |
| Seller Payout History | `seller/seller-payouts.html` | `/seller/payouts` |

---

## API Calls at Each Step

| Step | API Endpoint | Method | Trigger |
|------|-------------|--------|---------|
| **Order Payment** | | | |
| Capture payment | `POST /api/payment/capture` | POST | Order confirmed |
| Record gateway txn | `POST /api/finance/transaction` | POST | Payment callback |
| **Commission** | | | |
| Calculate commission | `POST /api/finance/commission/calculate` | POST | Order paid |
| Create ledger entry | `POST /api/finance/ledger` | POST | Automatic |
| **Settlement** | | | |
| Create batch | `POST /api/finance/settlement/batch` | POST | Scheduled / manual |
| Validate batch | `POST /api/finance/settlement/batch/{{batchId}}/validate` | POST | Batch created |
| Approve batch | `PATCH /api/finance/settlement/batch/{{batchId}}/approve` | PATCH | Admin approval |
| **Payout** | | | |
| Initiate payouts | `POST /api/finance/payout/initiate` | POST | Batch approved |
| Check payout status | `GET /api/finance/payout/{{payoutId}}/status` | GET | Polling / webhook |
| Retry failed payout | `PATCH /api/finance/payout/{{payoutId}}/retry` | PATCH | Manual retry |
| **Reconciliation** | | | |
| Sync gateway balance | `POST /api/finance/reconciliation/sync-gateway` | POST | Manual / scheduled |
| Run reconciliation | `POST /api/finance/reconciliation/run` | POST | Manual / scheduled |
| Export recon report | `GET /api/finance/reconciliation/{{reconId}}/export` | GET | Export click |
| Resolve mismatch | `PATCH /api/finance/reconciliation/{{reconId}}/resolve` | PATCH | Admin action |

---

## Decision Points

| Decision | Condition | Path A | Path B |
|----------|-----------|--------|--------|
| Multi-seller order? | Order items from multiple sellers | Split ledger entries per seller | Single seller entry |
| Payout above threshold? | Seller balance >= minimum payout | Include in batch | Defer to next batch |
| Pending adjustments? | Refunds or penalties outstanding | Deduct from payout | Standard payout |
| Payout succeeded? | Bank confirms transfer | Mark PAID | Retry (up to 3 times) |
| Reconciliation matches? | All amounts align | RECONCILED | MISMATCH (manual review) |
| Gateway fee mismatch? | Gateway report differs from records | Flag for review | Auto-reconcile |

---

## Reconciliation Schedule

| Type | Frequency | Scope |
|------|-----------|-------|
| Gateway Reconciliation | Daily (automated) | Match all gateway transactions from previous day |
| Payout Reconciliation | After each batch | Confirm all payouts in the batch |
| Commission Reconciliation | Weekly | Verify commission totals for the week |
| Full Reconciliation | Monthly | Complete end-to-end audit for the month |

---

## Error Paths

| Error | Trigger | User Experience | Recovery |
|-------|---------|----------------|----------|
| Gateway timeout | Payment capture fails | Order stays pending, customer notified | Auto-retry, then manual check |
| Commission calculation error | Missing rate config | Batch halted, alert sent | Admin configures rate, re-run |
| Bank details invalid | Seller changed bank | Payout fails, FAILED state | Seller updates bank, admin retries |
| Insufficient gateway balance | Withdrawal exceeds collected | Batch partially processed | Wait for gateway settlement cycle |
| Reconciliation mismatch | Amounts do not align | Admin review dashboard flag | Manual investigation and adjustment |
| Duplicate transaction | Gateway sends duplicate webhook | Idempotency check catches it | No action needed, auto-deduplicated |
