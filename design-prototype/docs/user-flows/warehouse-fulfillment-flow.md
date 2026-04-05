# Warehouse Fulfillment Flow

Complete warehouse operations covering inbound receiving, QC, put-away, and outbound pick-pack-ship.

---

## Flow Overview

### Inbound Flow
```
+-----------+     +---------+     +---------+     +-----------+     +-----------+
| Seller    |---->| Receive |---->| QC      |---->| Put Away  |---->| Available |
| Ships to  |     | at Dock |     | Inspect |     | to Bin    |     | in Stock  |
| Warehouse |     |         |     |         |     |           |     |           |
+-----------+     +---------+     +---------+     +-----------+     +-----------+
```

### Outbound Flow
```
+---------+     +---------+     +------+     +-------+     +----------+     +----------+
| Order   |---->| Pick    |---->| Pick |---->| Pack  |---->| Label &  |---->| Carrier  |
| Received|     | List    |     |      |     |       |     | Dispatch |     | Pickup   |
+---------+     +---------+     +------+     +-------+     +----------+     +----------+
```

---

## Inbound Flow: Detailed Diagram

```
    [START: SELLER SHIPS INVENTORY]
       |
       v
+===========================+
| SHIPMENT SCHEDULED        |
| warehouse-inbound.html    |
|                           |
| State: SCHEDULED          |
| Seller: TechMart India    |
| Expected: 2026-03-28      |
| Items: 12 products        |
| ETA: 2:00 PM              |
+===========================+
       |
       v (Shipment arrives at dock)
+----------------------------+
| SHIPMENT ARRIVAL            |
| State: ARRIVED              |
|                             |
| Dock worker scans barcode:  |
| GET /api/warehouse/inbound/ |
|     scan/{barcode}          |
|                             |
| Match: SHIPMENT             |
| ID: INB-20260328-001        |
| Seller: TechMart India      |
+----------------------------+
       |
       v
+----------------------------+
| ASSIGN RECEIVING STAFF      |
|                             |
| PUT /api/warehouse/inbound/ |
|     {shipmentId}/assign     |
|                             |
| Assigned to: Rajesh S.      |
+----------------------------+
       |
       v
+===========================+
| RECEIVING PROCESS          |
| State: IN_PROGRESS         |
| warehouse-inbound.html     |
+===========================+
       |
       v
+----------------------------+
| FOR EACH ITEM IN SHIPMENT   |
|                             |
| SKU: HB-EL-4521             |
| Product: Samsung Galaxy S24 |
| Expected Qty: 50            |
|                             |
| Scan or manually count:     |
|                             |
| Received Qty: [48]          |
| Condition:                   |
| (x) GOOD (48 units)         |
| ( ) DAMAGED (2 units)       |
| ( ) MISSING                 |
| ( ) WRONG_ITEM              |
|                             |
| Damage Notes:                |
| "Packaging dented on 2      |
|  units"                     |
|                             |
| Bin Location: [A3-R2-S5]    |
+----------------------------+
       |
       v
+----------------------------+
| QC INSPECTION               |
| (Per batch/item)            |
|                             |
| State: STOCK_PENDING ->     |
|        STOCK_INSPECTION     |
|                             |
| PATCH /api/warehouseinbound/|
|       {id}/inspectStock     |
+----------------------------+
       |
       +------+--------+--------+
       |               |        |
       v               v        v
+-----------+   +---------+ +----------+
| QC PASS   |   | PARTIAL | | QC FAIL  |
|           |   | DAMAGE  | |          |
| approve   |   |         | | reject   |
| Stock     |   | damage  | | Stock    |
|           |   | Found   | |          |
| 48 units  |   | 2 units | | Return   |
| approved  |   | damaged | | to       |
+-----------+   +---------+ | supplier |
       |           |        +----------+
       |           |             |
       |           +------+------+
       |           |      |      |
       |           v      v      v
       |        Repair  Discard Return
       |        & Appr  Damaged to
       |        ove             Seller
       |
       v
+----------------------------+
| PUT AWAY                    |
| State: STOCK_APPROVED ->    |
|        IN_WAREHOUSE         |
|                             |
| PATCH /api/warehouseinbound/|
|       {id}/                 |
|       allocateToWarehouse   |
|                             |
| Assign bin locations:       |
|                             |
| SKU: HB-EL-4521             |
| Bin: A3-R2-S5               |
| Qty: 48                     |
|                             |
| SKU: HB-EL-4522             |
| Bin: A3-R2-S6               |
| Qty: 30                     |
+----------------------------+
       |
       v
+----------------------------+
| COMPLETE RECEIVING          |
|                             |
| PATCH /api/warehouseinbound/|
|       {shipmentId}/complete |
|                             |
| {                           |
|   completedBy: "staff-001", |
|   signatureUrl: "...",      |
|   notes: "All items         |
|    verified and shelved"    |
| }                           |
+----------------------------+
       |
       v
+----------------------------+
| RECEIVING SUMMARY           |
| State: COMPLETED            |
|                             |
| Total Expected: 80          |
| Total Received: 78          |
| Total Damaged:  2           |
| Completion: 97.5%           |
|                             |
| Inventory updated           |
| automatically               |
+----------------------------+
       |
       v
+=========================+
| STOCK AVAILABLE         |
| warehouse-inventory.html|
|                         |
| Items now searchable    |
| and allocatable for     |
| customer orders         |
+=========================+
       |
       v
    [END: INBOUND]
```

---

## Outbound Flow: Detailed Diagram

```
    [START: CUSTOMER ORDER PLACED]
       |
       v
+=========================+
| ORDER RECEIVED          |
| warehouse-orders.html   |
|                         |
| State: PENDING_PICK     |
| Order: ORD-7841         |
| Customer: Priya Sharma  |
| Items: 3                |
| Priority: Same Day      |
| Zone: A-1               |
| Due: 11:30 AM           |
+=========================+
       |
       v
+----------------------------+
| PICK LIST GENERATED         |
|                             |
| GET /api/warehouse/orders/  |
|     {orderId}/pick-list     |
|                             |
| Items to pick:              |
|                             |
| [ ] WBH-2204               |
|     Wireless Headphones     |
|     Bin: A-1-04-B           |
|     Qty: 1                  |
|                             |
| [ ] PPC-1190                |
|     Phone Case (Black)      |
|     Bin: A-1-07-C           |
|     Qty: 1                  |
|                             |
| [ ] UST-3301                |
|     USB-C Charger 65W       |
|     Bin: A-1-02-A           |
|     Qty: 1                  |
+----------------------------+
       |
       v
+----------------------------+
| ASSIGN PICKER               |
|                             |
| PATCH /api/warehouseorder/  |
|       {orderId}/assign      |
|                             |
| Picker: Rajesh K.           |
| State: PENDING_PICK ->      |
|        PICKING              |
+----------------------------+
       |
       v
+===========================+
| PICKING PROCESS            |
| State: PICKING             |
| warehouse-orders.html      |
+===========================+
       |
       v
+----------------------------+
| PICK EACH ITEM              |
|                             |
| Picker walks to bin         |
| location, scans item:      |
|                             |
| Bin: A-1-02-A               |
| Scan: [UST-3301]            |
| Qty picked: 1               |
|                             |
| PATCH /api/warehouseorder/  |
|       {orderId}/pickItem    |
| {                           |
|   sku: "UST-3301",          |
|   pickedQty: 1,             |
|   pickedBy: "staff-001",    |
|   binLocation: "A-1-02-A"  |
| }                           |
|                             |
| Remaining items: 2          |
+----------------------------+
       |
       | (Repeat for each item)
       v
+----------------------------+
| ALL ITEMS PICKED            |
|                             |
| PATCH /api/warehouseorder/  |
|       {orderId}/markPicked  |
|                             |
| State: PICKING -> PACKING   |
| All 3 items picked          |
+----------------------------+
       |
       v
+===========================+
| PACKING PROCESS            |
| State: PACKING             |
| warehouse-orders.html      |
+===========================+
       |
       v
+----------------------------+
| PACKING CHECKLIST           |
|                             |
| GET /api/warehouse/orders/  |
|     {orderId}/              |
|     packing-checklist       |
|                             |
| Customer: Priya Sharma      |
| Address: 42 MG Road,        |
|   Mumbai 400001             |
|                             |
| Items:                      |
| [x] Wireless Headphones     |
| [x] Phone Case (Black)      |
| [x] USB-C Charger 65W       |
|                             |
| Packaging: BOX_MEDIUM       |
| Include Invoice: YES         |
| Fragile: NO                 |
| Gift Wrap: NO               |
+----------------------------+
       |
       v
+----------------------------+
| PACK & WEIGH                |
|                             |
| PATCH /api/warehouseorder/  |
|       {orderId}/markPacked  |
|                             |
| {                           |
|   packedBy: "staff-002",    |
|   packagingType:            |
|     "BOX_MEDIUM",           |
|   weight: 0.85,             |
|   dimensions: {             |
|     length: 30,             |
|     width: 20,              |
|     height: 12,             |
|     unit: "cm"              |
|   }                         |
| }                           |
|                             |
| State: PACKING ->           |
|        READY_TO_SHIP        |
+----------------------------+
       |
       v
+===========================+
| LABEL GENERATION           |
| State: READY_TO_SHIP      |
+===========================+
       |
       v
+----------------------------+
| GENERATE SHIPPING LABEL     |
|                             |
| POST /api/warehouse/orders/ |
|      {orderId}/             |
|      generate-label         |
|                             |
| {                           |
|   carrier: "Delhivery",     |
|   weight: 0.85,             |
|   dimensions: {...}         |
| }                           |
|                             |
| Response:                   |
| AWB: DL284719500IN          |
| Label: /labels/ORD-7841.pdf |
| Barcode: DL284719500IN      |
+----------------------------+
       |
       v
+----------------------------+
| PRINT & AFFIX LABEL         |
|                             |
| Print label (PDF or ZPL)    |
| Affix to package            |
| Scan to verify              |
+----------------------------+
       |
       v
+===========================+
| DISPATCH                   |
| warehouse-shipments.html   |
+===========================+
       |
       v
+----------------------------+
| DISPATCH SHIPMENT           |
|                             |
| PATCH /api/warehouseorder/  |
|       {orderId}/dispatch    |
|                             |
| {                           |
|   carrier: "Delhivery",     |
|   awbNumber:                |
|     "DL284719500IN",        |
|   dispatchedBy:             |
|     "staff-001"             |
| }                           |
|                             |
| State: READY_TO_SHIP ->     |
|        READY_FOR_PICKUP     |
+----------------------------+
       |
       v
+----------------------------+
| CARRIER PICKUP              |
| warehouse-shipments.html    |
|                             |
| Pickup Schedule:            |
| Delhivery: 2:00-3:00 PM    |
| Parcels ready: 18/22        |
|                             |
| Driver arrives, scans       |
| each parcel                 |
|                             |
| State: READY_FOR_PICKUP ->  |
|        PICKED_UP            |
+----------------------------+
       |
       v
+----------------------------+
| IN TRANSIT                   |
| (Carrier tracking)           |
|                             |
| GET /api/warehouse/          |
|     shipments/{awb}/track   |
|                             |
| Events:                     |
| - Picked up (Mumbai Hub)    |
| - In transit                |
| - Arrived at dest hub       |
| - Out for delivery           |
+----------------------------+
       |
       v
+----------------------------+
| DELIVERED                    |
|                             |
| POD (Proof of Delivery)     |
| confirmed by carrier        |
|                             |
| Order State: DELIVERED       |
| Shipment State: DELIVERED    |
+----------------------------+
       |
       v
    [END: OUTBOUND]
```

---

## Exception Flows

### Delivery Failed
```
+----------------------------+
| DELIVERY FAILED             |
| (Customer not home,         |
|  wrong address, refused)    |
|                             |
| State: DELIVERY_FAILED      |
+----------------------------+
       |
       +------+--------+
       |               |
       v               v
+-----------+   +-----------+
| RETRY     |   | RETURN    |
| DELIVERY  |   | TO        |
|           |   | WAREHOUSE |
| retry     |   |           |
| Delivery  |   | return    |
|           |   | Shipment  |
| Schedule  |   |           |
| re-attempt|   | RTO       |
+-----------+   | (Return   |
       |        | to Origin)|
       v        +-----------+
  IN_TRANSIT         |
  (2nd attempt)      v
       |        RETURNED
       v        (Inventory
  DELIVERED     updated)
  or FAILED
  again
```

### Item Not Found During Picking
```
+----------------------------+
| PICK ISSUE                  |
|                             |
| SKU: WBH-2204 not found    |
| at Bin A-1-04-B             |
|                             |
| Options:                    |
| 1. Check alternate bins     |
| 2. Mark as short-picked     |
| 3. Cancel item              |
|                             |
| Short pick -> Partial Ship  |
| or hold order for restock   |
+----------------------------+
```

### Damaged During Packing
```
+----------------------------+
| DAMAGE DURING PACKING       |
|                             |
| Item found damaged during   |
| packing inspection          |
|                             |
| Options:                    |
| 1. Replace from stock       |
| 2. Partial ship (skip item) |
| 3. Hold entire order        |
|                             |
| Inventory: mark item as     |
| DAMAGED_AT_WAREHOUSE        |
+----------------------------+
```

---

## Inbound Inventory State Machine

```
STOCK_PENDING --> STOCK_INSPECTION
                     |      |       |
                     v      v       v
             STOCK_APPROVED  |  STOCK_REJECTED
                  |     PARTIAL_DAMAGE  |
                  |       |   |   |     v
                  v       v   v   v  RETURN_TO_SUPPLIER
             IN_WAREHOUSE Repair Discard Return    |
                  |        |     |      |          v
                  |        v     v      v    RETURNED_TO_
                  | IN_WARE- DISCARDED RET_  SUPPLIER
                  | HOUSE              TO_
                  |                    SUPP
                  +------+------+
                         |      |
                         v      v
                   returnDamaged discardDamaged
                         |           |
                         v           v
                  DAMAGED_AT_    DISCARDED
                  WAREHOUSE
                     |   |
                     v   v
                  Repair Discard
```

---

## Outbound Order State Machine (Warehouse View)

```
PAID --> PROCESSING (startProcessing)
              |
        +-----+-------+
        |             |
        v             v
    SHIPPED    PARTIALLY_SHIPPED
        |             |
        v             v
    DELIVERED   Ship remaining
        |        or cancel rest
        v
    COMPLETED
```

Fulfillment saga states:

```
INITIATED --> INVENTORY_RESERVED --> SHIPMENT_CREATED --> SHIPPED --> COMPLETED
```

---

## Page References

| Step | Prototype Page | URL Path |
|------|---------------|----------|
| Inbound Dashboard | `warehouse/warehouse-inbound.html` | `/warehouse/inbound` |
| Pick & Pack Queue | `warehouse/warehouse-orders.html` | `/warehouse/orders` |
| Shipments Dashboard | `warehouse/warehouse-shipments.html` | `/warehouse/shipments` |
| Inventory | `warehouse/warehouse-inventory.html` | `/warehouse/inventory` |
| Warehouse Dashboard | `warehouse/warehouse-dashboard.html` | `/warehouse/dashboard` |

---

## API Calls at Each Step

| Step | API Endpoint | Method | Trigger |
|------|-------------|--------|---------|
| **Inbound** | | | |
| Load inbound stats | `GET /api/warehouse/inbound/stats` | GET | Page load |
| Load inbound list | `POST /api/query/warehouse-inbound` | POST | Page load |
| Scan barcode (inbound) | `GET /api/warehouse/inbound/scan/{barcode}` | GET | Scan |
| View shipment detail | `GET /api/warehouse/inbound/{shipmentId}` | GET | Row click |
| Receive items | `PATCH /api/warehouseinbound/{id}/receive` | PATCH | Receive click |
| Inspect stock (QC) | `PATCH /api/warehouseinbound/{id}/inspectStock` | PATCH | Start QC |
| Approve stock | `PATCH /api/warehouseinbound/{id}/approveStock` | PATCH | Pass QC |
| Reject stock | `PATCH /api/warehouseinbound/{id}/rejectStock` | PATCH | Fail QC |
| Report damage | `PATCH /api/warehouseinbound/{id}/damageFound` | PATCH | Damage report |
| Put away | `PATCH /api/warehouseinbound/{id}/allocateToWarehouse` | PATCH | Put Away click |
| Complete receiving | `PATCH /api/warehouseinbound/{id}/complete` | PATCH | Complete click |
| **Outbound - Pick** | | | |
| Load pick queue stats | `GET /api/warehouse/orders/stats` | GET | Page load |
| Load pick queue | `POST /api/query/warehouse-orders` | POST | Page load |
| Get pick list | `GET /api/warehouse/orders/{orderId}/pick-list` | GET | Row expand |
| Assign picker | `PATCH /api/warehouseorder/{orderId}/assign` | PATCH | Assign click |
| Pick item | `PATCH /api/warehouseorder/{orderId}/pickItem` | PATCH | Checkbox |
| Mark all picked | `PATCH /api/warehouseorder/{orderId}/markPicked` | PATCH | Complete pick |
| Scan barcode (order) | `GET /api/warehouse/orders/scan/{barcode}` | GET | Scan |
| Print pick list | `GET /api/warehouse/orders/pick-list/print` | GET | Print click |
| **Outbound - Pack** | | | |
| Get packing checklist | `GET /api/warehouse/orders/{orderId}/packing-checklist` | GET | Start pack |
| Mark packed | `PATCH /api/warehouseorder/{orderId}/markPacked` | PATCH | Pack complete |
| Generate label | `POST /api/warehouse/orders/{orderId}/generate-label` | POST | Auto/Manual |
| **Outbound - Ship** | | | |
| Load shipment stats | `GET /api/warehouse/shipments/stats` | GET | Page load |
| Load shipments | `POST /api/query/warehouse-shipments` | POST | Page load |
| Dispatch shipment | `PATCH /api/warehouseorder/{orderId}/dispatch` | PATCH | Dispatch click |
| Track shipment | `GET /api/warehouse/shipments/{awb}/track` | GET | Track click |
| Carrier performance | `GET /api/warehouse/shipments/carrier-performance` | GET | Page load |
| Pickup schedule | `GET /api/warehouse/shipments/pickup-schedule` | GET | Page load |
| Schedule pickup | `POST /api/warehouse/shipments/pickup-schedule` | POST | Schedule click |
| Reprint label | `GET /api/warehouse/shipments/{awb}/label` | GET | Label click |
| Scan barcode (shipment) | `GET /api/warehouse/shipments/scan/{barcode}` | GET | Scan |

---

## Decision Points

| Decision | Condition | Path A | Path B |
|----------|-----------|--------|--------|
| **Inbound** | | | |
| Qty matches expected? | receivedQty == expectedQty | Full receipt | Discrepancy noted |
| Item condition? | QC inspection | GOOD (approve) | DAMAGED (quarantine) |
| Damaged items? | damageQty > 0 | Repair/Discard/Return | N/A |
| **Outbound** | | | |
| Priority order? | Same Day or Express | Process first (sort by due) | Standard queue |
| Item in stock at bin? | Physical verification | Pick item | Short pick (exception) |
| All items picked? | Checklist complete | Move to packing | Hold for missing items |
| Fragile item? | Product flag | Special packaging | Standard box |
| Carrier available? | Pickup schedule | Dispatch to carrier | Hold for next pickup |
| Delivery failed? | Carrier feedback | Retry or RTO | N/A |

---

## Error Paths

| Error | Trigger | User Experience | Recovery |
|-------|---------|----------------|----------|
| Barcode not recognized | Scan unknown barcode | "No matching shipment or order" | Manual lookup |
| Item not at bin location | Pick miss | "Item not found at A-1-04-B" | Check alternate bins |
| Short shipment | Received < expected | Discrepancy report to seller | Seller ships remaining |
| Damaged in transit | QC inspection fail | Quarantine + damage report | Return to supplier or discard |
| Label generation failed | Carrier API error | "Label generation failed. Retry" | Retry or manual label |
| Carrier missed pickup | No show | "Pickup missed. Reschedule" | Schedule next available |
| Weight discrepancy | Actual vs declared | "Weight mismatch. Re-weigh" | Update weight, regenerate label |

---

## Time Estimates

| Step | Warehouse Action | Estimated Time |
|------|-----------------|---------------|
| **Inbound (per shipment)** | | |
| Dock arrival + scan | Unload and scan | 5-10 minutes |
| Receive + count items | Count each SKU | 15-30 minutes |
| QC inspection | Visual + functional check | 10-20 minutes |
| Put away to bins | Carry + shelve | 10-20 minutes |
| **Total per inbound** | | **40-80 minutes** |
| | | |
| **Outbound (per order)** | | |
| Generate pick list | System generates | 5 seconds |
| Walk + pick items | Physical collection | 3-10 minutes |
| Pack items | Box + wrap + invoice | 3-5 minutes |
| Generate + print label | System + printer | 30 seconds |
| Stage for pickup | Move to dispatch area | 1-2 minutes |
| **Total per outbound** | | **7-18 minutes** |
| | | |
| **Daily throughput** | | |
| Inbound: 8 shipments | | ~5-10 hours |
| Outbound: 89 orders | | ~10-26 hours |
| (Assumes parallel staff) | | |
