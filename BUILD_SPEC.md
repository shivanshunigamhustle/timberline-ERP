# Timberline ERP — Build Spec

## Concept
Timberline ERP is a demo management system for a Kenyan trading business running three product lines — timber, gas (LPG, delivered by a 3-truck fleet), and bio-products. It gives the owner a single, honest view of profit per product line instead of one blended number, keeps stock and the delivery fleet visible before they become a crisis, makes cash handling traceable from till to bank, and hands the outsourced accountant clean, KRA-compliant books and statements through their own login — no more emailing spreadsheets back and forth.

## Build constraints
- Framework: Next.js (App Router)
- All data is static/mock, defined in the frontend (e.g. `lib/mock-data.ts`) — no real backend, database, or API integration
- Interactions against the mock data fully function: filtering, sorting, status changes, opening/closing modals and side sheets, numbers recalculating — "static data" means no real persistence across a reload, not an inert UI
- No real authentication — a role-picker screen (one card per role) logs straight in on click; no password fields anywhere, including for the Accountant's "dedicated login" (that's a distinct role card, not a credential form)
- Currency throughout is KES (e.g. `KES 128,400`); dates, names, place names (Nakuru, Eldoret, Nairobi's Industrial Area, Mombasa Road) and payment methods (M-Pesa, cash, bank transfer) read as authentically Kenyan
- Styling reads as a polished, production-grade business system — dense data tables, clear status badges, no wireframe placeholders

## Roles

### Owner / Admin
- **Mandate:** See the whole business at a glance — profit by product line, cash position, stock health, fleet status — and manage everything underneath (products, pricing, users, trucks).
- **Access pattern:** Role-picker card "Owner / Admin" → lands on Dashboard.

### Accountant (external, dedicated login)
- **Mandate:** Pull clean, KRA-compliant financial statements and transaction detail directly from the system — no file exchange with the owner needed.
- **Access pattern:** Role-picker card "Accountant" → lands on Financial Dashboard. Framed in the UI as their own portal ("You're viewing Timberline's books as their Accountant").

### Cashier / Till Clerk
- **Mandate:** Record every cash and M-Pesa sale as it happens, and reconcile the till against what's actually banked.
- **Access pattern:** Role-picker card "Cashier" → lands on Till.

### Warehouse / Inventory Clerk
- **Mandate:** Know what's in stock across all three product lines, and get ahead of reorders before anything runs out.
- **Access pattern:** Role-picker card "Warehouse" → lands on Stock Overview.

### Driver / Dispatch
- **Mandate:** See today's deliveries truck-by-truck, update job status on the road, and log fuel/running costs against the right truck.
- **Access pattern:** Role-picker card "Driver / Dispatch" → lands on Today's Deliveries.

## Screens & pages

```
Owner / Admin
├── Dashboard
├── Sales & Invoicing
│   ├── Invoices
│   ├── Invoice detail
│   └── New invoice
├── Product Lines
│   ├── Timber
│   ├── Gas
│   └── Bio-products
├── Inventory
│   ├── Stock overview
│   └── Item detail
├── Fleet & Equipment
│   ├── Fleet register
│   ├── Truck detail
│   └── Equipment register
├── Cash & Banking
│   ├── Till summary
│   └── Bank reconciliation
├── Reports
│   ├── Profit by product line
│   ├── Cash flow
│   └── Financial statements
├── Users & Roles
└── Settings

Accountant
├── Financial Dashboard
├── Financial Statements
│   ├── Profit & Loss
│   ├── Balance Sheet
│   └── Cash Flow Statement
├── Transactions Ledger
├── Invoices (read-only)
└── Export Center

Cashier / Till Clerk
├── Till
├── New Sale
├── Till History
└── Bank Deposit Log

Warehouse / Inventory Clerk
├── Stock Overview
├── Item detail
├── Reorder Queue
└── Stock Intake

Driver / Dispatch
├── Today's Deliveries
├── Delivery detail
├── Truck Log
└── My Truck
```

## Page specs

### Owner / Admin → Dashboard

**Layout regions:** header with business name, date, and a global product-line filter pill row (All / Timber / Gas / Bio-products); a row of 4 stat cards; a profit-by-product-line bar chart; a two-column lower section (low-stock alerts panel + fleet status panel).

**Components:**
- **Product-line filter pills** (All, Timber, Gas, Bio-products) — clicking one re-filters every stat card and chart on the page to that line only; "All" resets to the blended-but-broken-out view.
- **Stat card: "Revenue (this month)"** — shows total and a small per-line breakdown underneath (3 lines of text with amounts); clicking navigates to Reports → Profit by product line.
- **Stat card: "Net profit (this month)"** — shows total with a green/red delta badge vs. last month; clicking navigates to Reports → Profit by product line.
- **Stat card: "Cash in till (today)"** — shows current till float; clicking navigates to Cash & Banking → Till summary.
- **Stat card: "Low-stock items"** — shows a count; red badge if count > 0; clicking navigates to Inventory → Stock overview filtered to Status = Low/Reorder.
- **Profit by product line chart** (grouped bar chart, one bar per line per month, last 6 months) — hovering a bar shows a tooltip with exact revenue, cost, and profit for that line/month.
- **Low-stock alerts panel** — list of items below reorder point, each row showing item name, product line badge, qty remaining, and a "Reorder" button that opens a confirmation modal titled "Create purchase order for [Item]" with fields: Supplier (dropdown), Quantity (number, pre-filled with suggested reorder qty), Expected delivery date (date). "Create PO" button closes the modal, moves the item's status badge to "On order", and shows a toast "Purchase order created".
- **Fleet status panel** — 3 truck cards (KBZ 221A, KCF 408D, KDG 552H), each showing truck name, today's assigned driver, status badge (On route / At depot / In service), and today's delivery count. Clicking a card navigates to Fleet & Equipment → Truck detail.

### Owner / Admin → Sales & Invoicing → Invoices

**Layout regions:** header with "New Invoice" primary button; filter bar; invoices table.

**Components:**
- **"New Invoice" button** (primary, top right) — navigates to Sales & Invoicing → New invoice.
- **Filter: Product line** (dropdown: All / Timber / Gas / Bio-products) — filters the table.
- **Filter: Status** (dropdown: All / Draft / Sent / Paid / Overdue) — filters the table.
- **Filter: Date range** (date range picker) — filters the table by invoice date.
- **Search bar** — filters by customer name or invoice number, live as you type.
- **Invoices table** — columns: Invoice # (e.g. `TL-2026-0412`), Customer, Product line (badge), Amount (KES), KRA eTIMS status (badge: Submitted / Pending), Status (badge: Draft / Sent / Paid / Overdue), Date. Row click navigates to Invoice detail.
- **Row action: "Mark as paid"** (icon button, visible on Sent/Overdue rows) — inline state change: status badge flips to "Paid", shows toast "Invoice TL-2026-0412 marked paid".

### Owner / Admin → Sales & Invoicing → Invoice detail

**Layout regions:** header with invoice number, status badge, and action buttons; two-column body (invoice preview on the left, activity/payment panel on the right).

**Components:**
- **"Download PDF" button** (secondary) — inline state change: shows toast "Invoice PDF ready" (no real file generated in the demo).
- **"Send to customer" button** (primary, visible if Draft) — opens a modal titled "Send invoice" with fields: Email (pre-filled), Message (textarea, pre-filled with a template). "Send" button closes the modal, flips status to "Sent", shows toast "Invoice sent".
- **"Record payment" button** (primary, visible if Sent/Overdue) — opens a modal titled "Record payment" with fields: Amount (pre-filled with balance due), Method (dropdown: M-Pesa / Cash / Bank transfer), Date (date, defaults today), Reference (text). "Record" button closes the modal, flips status to "Paid", adds a row to the Activity panel, shows toast "Payment recorded".
- **Invoice preview panel** — shows business letterhead, customer details, KRA PIN and eTIMS invoice number, line items table (Description, Qty, Unit price, Total), subtotal, VAT (16%), total. Purely display, no interactive elements.
- **Activity panel** — timeline of events (Created, Sent, Payment received), each with a timestamp and actor name. Display-only.

### Owner / Admin → Sales & Invoicing → New invoice

**Layout regions:** single-column form with a running total on the right rail.

**Components:**
- **Customer** (dropdown with "+ Add new customer" option) — selecting "+ Add new customer" opens an inline mini-form (Name, Phone, KRA PIN) that collapses back into the dropdown once filled.
- **Product line** (dropdown: Timber / Gas / Bio-products) — determines which items appear in the line-item picker below.
- **Line items table** (editable rows) — each row: Item (dropdown, filtered by product line chosen above), Quantity (number), Unit price (auto-filled from item master, editable), Line total (computed, read-only).
- **"+ Add line item" button** — adds a new empty row to the line items table.
- **Row action: remove line item** (trash icon) — removes that row, recalculates totals.
- **Right rail: totals summary** — Subtotal, VAT (16%, auto-computed), Total (all read-only, recompute live as line items change).
- **"Save as draft" button** (secondary) — navigates to Invoices list, new row appears with Status = Draft, toast "Draft saved".
- **"Save and send" button** (primary) — navigates to Invoices list, new row appears with Status = Sent, toast "Invoice created and sent".

### Owner / Admin → Product Lines → Timber (pattern repeats for Gas, Bio-products)

**Layout regions:** header with line-specific stat row; revenue/cost/profit trend chart; items table for that line.

**Components:**
- **Stat row:** Revenue (this month), Cost of goods, Gross profit, Margin % — four small cards, display-only, scoped to Timber only.
- **Trend chart** (line chart, revenue vs. cost, last 6 months, Timber only) — hovering a point shows exact figures for that month.
- **Items table** (Timber-specific items — e.g. "6x2 Cypress timber", "Treated fence posts", "Sawdust offcuts") — columns: Item name, Unit (e.g. per piece, per bundle), Stock on hand, Reorder point, Unit price (KES), Status badge (In stock / Low / Reorder). Row click navigates to Inventory → Item detail.
- **"Manage items" button** (secondary, top right) — navigates to Inventory → Stock overview, pre-filtered to Timber.

*(Gas page shows gas-specific items — "13kg LPG cylinder refill", "6kg LPG cylinder refill", "New cylinder deposit" — and an additional stat card "Cylinders in circulation". Bio-products page shows items like "Briquettes (25kg bag)", "Charcoal dust bales", "Compost (50kg bag)".)*

### Owner / Admin → Inventory → Stock overview

**Layout regions:** filter bar; stock table; side panel summarizing reorder queue.

**Components:**
- **Filter: Product line** (All / Timber / Gas / Bio-products).
- **Filter: Status** (All / In stock / Low / Reorder / On order).
- **Search bar** — filters by item name.
- **Stock table** — columns: Item, Product line (badge), Stock on hand, Reorder point, Status (badge, color-coded red/amber/green), Last restocked (date). Row click navigates to Item detail.
- **Row action: "Reorder"** (button, visible when Status = Low or Reorder) — opens the same "Create purchase order" modal described on the Dashboard; on confirm, status flips to "On order".
- **Side panel: Reorder queue** — list of items currently "On order" with expected delivery date; each has a "Mark received" button — inline state change: removes it from the queue, flips the item's Stock status back to "In stock", bumps Stock on hand by the ordered quantity, toast "Stock received: [Item]".

### Owner / Admin → Inventory → Item detail

**Layout regions:** header with item name, product line badge, status badge; stat row; stock movement history table.

**Components:**
- **"Edit item" button** (secondary) — opens a side sheet titled "Edit item" with fields: Name, Unit, Reorder point (number), Unit price (currency), Supplier (dropdown). "Save" button closes the sheet, updates the header and stat row, toast "Item updated".
- **"Reorder now" button** (primary) — opens the "Create purchase order" modal (same as above).
- **Stat row:** Stock on hand, Reorder point, Avg. monthly usage, Days of stock remaining (computed) — display-only.
- **Stock movement table** — columns: Date, Type (badge: Intake / Sale / Adjustment), Quantity (+/-), Balance after, Note. Display-only, newest first.

### Owner / Admin → Fleet & Equipment → Fleet register

**Layout regions:** header with "Add truck" button; truck cards grid.

**Components:**
- **"Add truck" button** (primary) — opens a modal titled "Add truck" with fields: Registration number, Make/model, Year, Assigned driver (dropdown). "Add" button closes the modal, adds a new card to the grid, toast "Truck added".
- **Truck card** (one per truck: KBZ 221A, KCF 408D, KDG 552H) — shows registration, make/model, status badge (On route / At depot / In service), assigned driver, this month's running cost total. Clicking the card navigates to Truck detail.

### Owner / Admin → Fleet & Equipment → Truck detail

**Layout regions:** header with registration + status badge; stat row; two tabs (Delivery history / Running costs).

**Components:**
- **Status dropdown** (On route / At depot / In service) — inline state change: updates the badge immediately, toast "Status updated".
- **"Log a cost" button** (primary) — opens a modal titled "Log running cost" with fields: Type (dropdown: Fuel / Service / Repair / Insurance / Other), Amount (currency), Date (defaults today), Note (text). "Log" button closes the modal, adds a row to the Running costs tab, updates the truck's running-cost stat, toast "Cost logged".
- **Stat row:** This month's running cost, Deliveries this month, Fuel cost (this month), Last service date.
- **Tab: Delivery history** — table of past deliveries (Date, Customer, Product line, Status). Display-only.
- **Tab: Running costs** — table of logged costs (Date, Type badge, Amount, Note). Display-only once logged.

### Owner / Admin → Fleet & Equipment → Equipment register

**Layout regions:** simple table page, no charts.

**Components:**
- **"Add equipment" button** (primary) — opens a modal titled "Add equipment" with fields: Name, Category (dropdown: Loading equipment / Workshop tools / Office equipment / Other), Purchase date, Purchase value (currency). "Add" button adds a row to the table, toast "Equipment added".
- **Equipment table** — columns: Name (e.g. "Forklift — Toyota 2.5T", "Cylinder trolley set", "Chainsaw — Stihl MS 362"), Category (badge), Purchase date, Purchase value, Condition (badge: Good / Needs attention / Out of service). Row action "Edit" (icon button) opens an inline edit mode for that row's Condition field only — a dropdown appears in place, selecting a value and clicking a checkmark icon saves it inline.

### Owner / Admin → Cash & Banking → Till summary

**Layout regions:** stat row; tills table (if more than one till — demo has "Main till" and "Gas depot till"); recent transactions feed.

**Components:**
- **Stat row:** Total cash collected (today), Total M-Pesa collected (today), Expected bank deposit, Variance (computed, green if 0, red otherwise).
- **Tills table** — columns: Till name, Cashier on duty, Opening float, Cash collected, M-Pesa collected, Status (badge: Open / Closed / Reconciled). Row click expands inline (accordion) to show that till's transaction list for the day.
- **"Reconcile" button** (per till row, visible when Status = Closed) — opens a modal titled "Reconcile [Till name]" showing expected vs. counted cash fields (Counted amount — number input) and a computed Variance line that updates live as the number is typed. "Confirm reconciliation" button closes the modal, flips Status to "Reconciled", toast "Till reconciled".

### Owner / Admin → Cash & Banking → Bank reconciliation

**Layout regions:** filter bar (date range); deposits table.

**Components:**
- **"Log bank deposit" button** (primary) — opens a modal titled "Log bank deposit" with fields: Amount, Bank (dropdown: Equity Bank / KCB / Co-operative Bank), Date, Reference/slip number. "Log" button adds a row to the table, toast "Deposit logged".
- **Deposits table** — columns: Date, Amount, Bank (badge), Reference, Matched till total (computed), Status (badge: Matched / Mismatch). Display-only; Status badge is computed by comparing the logged amount against that day's till total.

### Owner / Admin → Reports → Profit by product line

**Layout regions:** date range selector; side-by-side comparison cards (one per line); stacked bar chart; detail table.

**Components:**
- **Date range selector** (dropdown: This month / Last month / This quarter / Year to date) — recalculates every number on the page.
- **Comparison card ×3** (Timber / Gas / Bio-products) — each shows Revenue, Cost of goods sold, Gross profit, Margin %. Clicking a card filters the detail table below to that line only.
- **Stacked bar chart** (revenue, split by product line, per month) — hovering shows exact per-line figures for that month.
- **Detail table** — columns: Product line, Revenue, COGS, Gross profit, Operating costs (allocated), Net profit, Margin %. Display-only.
- **"Export" button** (secondary, top right) — inline state change: toast "Report exported" (no real file in the demo).

### Owner / Admin → Reports → Cash flow

**Layout regions:** stat row; cash flow chart (in vs. out, monthly); transactions table.

**Components:**
- **Stat row:** Cash in (this month), Cash out (this month), Net cash flow.
- **Cash flow chart** (dual-line or bar, Inflow vs. Outflow, last 6 months) — hover tooltip shows exact figures.
- **Transactions table** — columns: Date, Description, Type (badge: Inflow / Outflow), Category, Amount. Filterable by Type and by Category (dropdown: Sales / Supplier payment / Fuel / Payroll / Other).

### Owner / Admin → Reports → Financial statements

**Layout regions:** tab row (Profit & Loss / Balance Sheet / Cash Flow Statement); statement display.

**Components:**
- **Tabs** — switch which statement renders below; each is a clean, standard-format statement (P&L: Revenue → COGS → Gross profit → Operating expenses → Net profit, broken out by product line in a sub-table; Balance Sheet: Assets / Liabilities / Equity; Cash Flow Statement: Operating / Investing / Financing activities).
- **"Export for accountant" button** (primary, top right) — inline state change: toast "Statement sent to Accountant portal" (reinforces that the Accountant role sees this live, not via email).

### Owner / Admin → Users & Roles

**Layout regions:** simple table page.

**Components:**
- **"Invite user" button** (primary) — opens a modal titled "Invite user" with fields: Name, Role (dropdown: Owner/Admin / Accountant / Cashier / Warehouse / Driver), Email. "Send invite" button adds a row to the table with Status = "Invited", toast "Invite sent".
- **Users table** — columns: Name, Role (badge), Status (badge: Active / Invited), Last active. Row action "Deactivate" (icon button, confirm via a small inline confirmation popover: "Deactivate this user? [Cancel] [Deactivate]") — inline state change flips Status to "Deactivated".

### Owner / Admin → Settings

**Layout regions:** simple form sections.

**Components:**
- **Business profile section** — fields: Business name, KRA PIN, Address, Phone (all pre-filled, editable inline, "Save" button per section shows toast "Settings saved").
- **Invoicing section** — fields: Default VAT rate (pre-filled 16%), Invoice number prefix (e.g. "TL-"), KRA eTIMS device status (badge: Connected). "Reconnect eTIMS device" button — inline state change: badge flashes "Reconnecting..." then returns to "Connected", toast "eTIMS device reconnected".
- **Logout control** (header, all pages) — returns to the role-picker screen.

---

### Accountant → Financial Dashboard

**Layout regions:** banner confirming portal identity; stat row; two charts (P&L trend, cash position).

**Components:**
- **Portal banner** (display-only) — "You're viewing Timberline Traders' books — read access as Accountant."
- **Stat row:** Revenue (YTD), Net profit (YTD), Outstanding invoices (count + amount), Cash position (today).
- **"Go to Financial Statements" button** (primary) — navigates to Financial Statements → Profit & Loss.
- **P&L trend chart** (revenue vs. expenses, last 12 months) — hover tooltip with exact figures.
- **Cash position chart** (line, last 30 days) — hover tooltip with exact daily balance.

### Accountant → Financial Statements → Profit & Loss / Balance Sheet / Cash Flow Statement

**Layout regions:** identical structure to Owner's Reports → Financial statements, read-only.

**Components:**
- **Period selector** (dropdown: This month / Last month / This quarter / This year) — recalculates the statement shown.
- **Statement table** — same standard format as the Owner view, including the per-product-line P&L breakdown. No edit controls anywhere on this page — this role is read + export only.
- **"Download as PDF" / "Download as Excel" buttons** (secondary, side by side) — each triggers toast "Download ready" (no real file in the demo).

### Accountant → Transactions Ledger

**Layout regions:** filter bar; ledger table.

**Components:**
- **Filter: Date range**, **Filter: Product line**, **Filter: Type** (dropdown: Sale / Purchase / Expense / Payment) — all filter the table.
- **Search bar** — filters by description/reference.
- **Ledger table** — columns: Date, Reference, Description, Product line (badge), Debit, Credit, Running balance. Display-only, double-entry style.
- **"Export filtered view" button** (secondary) — toast "Export ready".

### Accountant → Invoices (read-only)

**Layout regions:** same table as Owner's Invoices list, with all editing controls removed.

**Components:**
- **Filter: Status, Filter: Product line, Search bar** — same as Owner view.
- **Invoices table** — same columns as Owner view, including KRA eTIMS status; row click opens Invoice detail in a read-only layout (no Send/Record payment buttons — just the preview and activity timeline).

### Accountant → Export Center

**Layout regions:** a simple list of export-ready packages.

**Components:**
- **Export card ×4** ("Monthly P&L pack", "VAT return support pack", "Full ledger export", "Fixed asset register") — each has a period dropdown and a "Generate" button. Clicking "Generate" shows a short inline loading state ("Preparing export...") then flips to a "Download" button, toast "Export ready".

---

### Cashier / Till Clerk → Till

**Layout regions:** large till status header; stat row; "New Sale" call to action; today's transaction feed.

**Components:**
- **Till status header** — shows till name ("Main till"), status badge (Open/Closed), opening float amount, and an "Open till" / "Close till" button depending on state.
  - **"Open till" button** — opens a modal "Open till" with field Opening float (number, defaults to yesterday's closing float). "Open" button flips status to Open, toast "Till opened".
  - **"Close till" button** — opens a modal "Close till" showing computed totals (Cash collected, M-Pesa collected) and a Counted cash field (number). "Close till" button flips status to Closed, toast "Till closed — ready for reconciliation".
- **Stat row:** Cash collected (today), M-Pesa collected (today), Transactions count (today).
- **"New Sale" button** (large, primary) — navigates to New Sale.
- **Today's transactions feed** — list of sale rows (Time, Customer/Walk-in, Product line badge, Amount, Payment method badge). Newest first, read-only.

### Cashier / Till Clerk → New Sale

**Layout regions:** product line tabs; item picker grid; order summary rail.

**Components:**
- **Product line tabs** (Timber / Gas / Bio-products) — switches which items show in the picker grid below.
- **Item picker grid** (tiles, one per item, showing name + unit price) — clicking a tile adds it to the order summary rail (or increments quantity if already added).
- **Order summary rail** — list of added items with quantity steppers (+/- icon buttons) and a remove (×) icon per line; computed Subtotal, VAT, Total at the bottom.
- **Payment method selector** (segmented control: Cash / M-Pesa / Bank transfer).
- **"Complete sale" button** (primary, bottom of rail) — inline state change: clears the order, navigates back to Till, adds a new row to today's transaction feed, toast "Sale recorded — KES [total]".

### Cashier / Till Clerk → Till History

**Layout regions:** date filter; history table.

**Components:**
- **Date range filter** — filters the table.
- **History table** — columns: Date, Opening float, Cash collected, M-Pesa collected, Counted cash, Variance (badge: Balanced / Over / Short), Status (badge: Closed / Reconciled). Row click expands inline to show that day's full transaction list.

### Cashier / Till Clerk → Bank Deposit Log

**Layout regions:** simple log table with an add action.

**Components:**
- **"Log deposit" button** (primary) — opens a modal "Log bank deposit" with fields: Amount, Bank (dropdown), Date, Slip number/reference. "Log" button adds a row, toast "Deposit logged".
- **Deposit log table** — columns: Date, Amount, Bank (badge), Reference, Logged by. Display-only.

---

### Warehouse / Inventory Clerk → Stock Overview

**Layout regions:** identical structure to Owner's Inventory → Stock overview, with the same filters and table, scoped to this role's working view (no cross-navigation to Reports).

**Components:**
- **Filter: Product line, Filter: Status, Search bar** — same behavior as the Owner view.
- **Stock table** — same columns (Item, Product line badge, Stock on hand, Reorder point, Status badge, Last restocked). Row click navigates to Item detail.
- **Row action: "Flag for reorder"** (button, visible on Low/In-stock rows) — inline state change: flips Status badge to "Reorder", adds the item to the Reorder Queue, toast "Flagged for reorder".

### Warehouse / Inventory Clerk → Item detail

**Layout regions:** same as Owner's Item detail, minus pricing edit controls.

**Components:**
- **Stat row:** Stock on hand, Reorder point, Avg. monthly usage, Days of stock remaining.
- **"Adjust stock" button** (primary) — opens a modal "Adjust stock" with fields: Adjustment type (dropdown: Damage / Count correction / Internal use), Quantity (number, can be negative), Note (text). "Save adjustment" button adds a row to the stock movement table below, updates Stock on hand, toast "Stock adjusted".
- **Stock movement table** — same as Owner's view: Date, Type badge, Quantity, Balance after, Note.

### Warehouse / Inventory Clerk → Reorder Queue

**Layout regions:** single table, no filters needed given scope.

**Components:**
- **Reorder queue table** — columns: Item, Product line (badge), Qty to order (pre-filled, editable inline number field), Preferred supplier (dropdown), Status (badge: Flagged / Ordered / Received).
- **Row action: "Submit order"** (button, visible when Status = Flagged) — inline state change: flips Status to "Ordered", toast "Order submitted to [Supplier]".
- **Row action: "Mark received"** (button, visible when Status = Ordered) — inline state change: flips Status to "Received", updates the item's Stock on hand on the Stock Overview page, toast "Stock received".

### Warehouse / Inventory Clerk → Stock Intake

**Layout regions:** a form for logging new stock arriving (e.g. a timber delivery, a gas cylinder refill batch) outside the reorder flow.

**Components:**
- **Intake form** — fields: Item (dropdown), Quantity received (number), Supplier (dropdown), Date (defaults today), Delivery note number (text).
- **"Log intake" button** (primary) — inline state change: adds a row to a "Recent intakes" table below, bumps the item's Stock on hand, toast "Intake logged".
- **Recent intakes table** — columns: Date, Item, Quantity, Supplier, Delivery note #. Display-only, newest first.

---

### Driver / Dispatch → Today's Deliveries

**Layout regions:** truck selector tabs (if the logged-in driver can see all 3, otherwise pre-filtered to their assigned truck); delivery list.

**Components:**
- **Truck tabs** (KBZ 221A / KCF 408D / KDG 552H) — switches which truck's delivery list shows below.
- **Delivery card list** — each card shows Customer name, Address/area, Product line (badge), Items summary, Status badge (Pending / En route / Delivered / Failed).
- **Card action: "Start delivery"** (button, visible when Status = Pending) — inline state change: flips badge to "En route", toast "Delivery started".
- **Card action: "Mark delivered"** (button, visible when Status = En route) — opens a modal "Confirm delivery" with fields: Received by (text), Notes (text, optional). "Confirm" button closes the modal, flips badge to "Delivered", toast "Delivery completed".
- **Card action: "Mark failed"** (secondary button, visible when Status = En route) — opens a modal "Delivery issue" with field Reason (dropdown: Customer unavailable / Access issue / Wrong address / Other). "Save" button flips badge to "Failed", toast "Delivery marked failed".
- **Card click (not on a button)** — navigates to Delivery detail.

### Driver / Dispatch → Delivery detail

**Layout regions:** header with customer and status; order details; map placeholder area.

**Components:**
- **Status badge** (display, matches Today's Deliveries).
- **Order details table** — Item, Quantity, Unit — display-only.
- **Customer contact row** — Name, Phone, Address — display-only (no real dialer integration in the demo; phone number shown as plain text).
- **Status action buttons** — the same Start/Mark delivered/Mark failed actions as the card view, available here too, with identical behavior.

### Driver / Dispatch → Truck Log

**Layout regions:** header naming the truck; "Log a cost" button; costs table.

**Components:**
- **"Log a cost" button** (primary) — opens the same "Log running cost" modal as the Owner's Truck detail page (Type: Fuel/Service/Repair/Insurance/Other, Amount, Date, Note). "Log" button adds a row to the table, toast "Cost logged".
- **Costs table** — columns: Date, Type (badge), Amount, Note. Display-only, newest first, scoped to this driver's truck.

### Driver / Dispatch → My Truck

**Layout regions:** a condensed version of the Owner's Truck detail page, scoped to the driver's own assigned truck.

**Components:**
- **Stat row:** Deliveries today, Deliveries this month, This month's running cost, Last service date.
- **Status dropdown** (On route / At depot / In service) — inline state change, same as Owner's Truck detail, toast "Status updated".
- **Delivery history table** (this truck only) — Date, Customer, Product line (badge), Status (badge). Display-only.

## Data model

### Invoice
- **Fields:** id, invoiceNumber (text, e.g. `TL-2026-0412`), customerName (text), productLine (enum: Timber / Gas / Bio-products), amount (currency), vatAmount (currency), etimsStatus (enum: Submitted / Pending), status (enum: Draft / Sent / Paid / Overdue), issueDate (date), dueDate (date)
- **Example rows:**
  | invoiceNumber | customer | productLine | amount | status |
  |---|---|---|---|---|
  | TL-2026-0398 | Rift Valley Hardware Ltd | Timber | KES 184,500 | Paid |
  | TL-2026-0405 | Mama Njeri Eatery | Gas | KES 12,600 | Sent |
  | TL-2026-0409 | Equator Builders | Timber | KES 326,000 | Overdue |
  | TL-2026-0411 | GreenGrow Farms | Bio-products | KES 48,200 | Paid |
  | TL-2026-0412 | Nakuru Steel Works | Gas | KES 76,800 | Draft |
  | TL-2026-0413 | Cherengany Timber Yard | Timber | KES 212,900 | Sent |
- **Filters/sorts:** filter by Product line, filter by Status, filter by Date range; sort by Date, sort by Amount
- **Relationships:** has many InvoiceLineItem (→ Item); references Customer

### Item (inventory master)
- **Fields:** id, name (text), productLine (enum: Timber / Gas / Bio-products), unit (text, e.g. "per piece", "per 13kg cylinder", "per 50kg bag"), stockOnHand (number), reorderPoint (number), unitPrice (currency), status (enum: In stock / Low / Reorder / On order), lastRestocked (date)
- **Example rows:**
  | name | productLine | stockOnHand | reorderPoint | status |
  |---|---|---|---|---|
  | 6x2 Cypress timber | Timber | 420 pieces | 150 | In stock |
  | Treated fence posts | Timber | 38 pieces | 50 | Reorder |
  | 13kg LPG cylinder refill | Gas | 64 cylinders | 40 | In stock |
  | 6kg LPG cylinder refill | Gas | 22 cylinders | 30 | Low |
  | Briquettes (25kg bag) | Bio-products | 310 bags | 100 | In stock |
  | Compost (50kg bag) | Bio-products | 18 bags | 40 | Reorder |
- **Filters/sorts:** filter by Product line, filter by Status; sort by Name, sort by Stock on hand
- **Relationships:** referenced by InvoiceLineItem, StockMovement, ReorderQueue entry

### StockMovement
- **Fields:** id, itemId (ref), date (date), type (enum: Intake / Sale / Adjustment), quantity (number, signed), balanceAfter (number), note (text)
- **Example rows:**
  | item | type | quantity | balanceAfter |
  |---|---|---|---|
  | 6x2 Cypress timber | Intake | +200 | 420 |
  | 13kg LPG cylinder refill | Sale | -12 | 64 |
  | Compost (50kg bag) | Adjustment | -3 | 18 |
- **Relationships:** references Item

### Truck
- **Fields:** id, registration (text, e.g. `KBZ 221A`), makeModel (text), year (number), assignedDriver (text), status (enum: On route / At depot / In service), monthlyRunningCost (currency)
- **Example rows:**
  | registration | makeModel | assignedDriver | status |
  |---|---|---|---|
  | KBZ 221A | Isuzu NQR 71 | Samuel Kiptoo | On route |
  | KCF 408D | Isuzu NPR 400 | Brian Otieno | At depot |
  | KDG 552H | Mitsubishi Canter | Dennis Mwangi | In service |
- **Filters/sorts:** none on the register (3 trucks only); detail view filters costs/deliveries by date
- **Relationships:** has many RunningCost, has many Delivery

### RunningCost
- **Fields:** id, truckId (ref), type (enum: Fuel / Service / Repair / Insurance / Other), amount (currency), date (date), note (text)
- **Example rows:**
  | truck | type | amount | date |
  |---|---|---|---|
  | KBZ 221A | Fuel | KES 8,400 | 2026-10-06 |
  | KCF 408D | Service | KES 14,200 | 2026-10-02 |
  | KDG 552H | Repair | KES 31,500 | 2026-10-08 |
- **Relationships:** references Truck

### Delivery
- **Fields:** id, truckId (ref), customerName (text), area (text), productLine (enum: Timber / Gas / Bio-products), itemsSummary (text), status (enum: Pending / En route / Delivered / Failed), date (date)
- **Example rows:**
  | customer | area | productLine | status |
  |---|---|---|---|
  | Mama Njeri Eatery | Nakuru Town | Gas | Pending |
  | Equator Builders | Industrial Area, Nairobi | Timber | En route |
  | GreenGrow Farms | Naivasha Road | Bio-products | Delivered |
  | Cherengany Timber Yard | Eldoret | Timber | Pending |
- **Relationships:** references Truck, references Item (via line items)

### Equipment
- **Fields:** id, name (text), category (enum: Loading equipment / Workshop tools / Office equipment / Other), purchaseDate (date), purchaseValue (currency), condition (enum: Good / Needs attention / Out of service)
- **Example rows:**
  | name | category | purchaseValue | condition |
  |---|---|---|---|
  | Forklift — Toyota 2.5T | Loading equipment | KES 1,850,000 | Good |
  | Cylinder trolley set | Loading equipment | KES 42,000 | Good |
  | Chainsaw — Stihl MS 362 | Workshop tools | KES 128,000 | Needs attention |
  | Office photocopier | Office equipment | KES 95,000 | Good |
- **Relationships:** none (standalone register)

### TillTransaction
- **Fields:** id, tillName (text), time (datetime), customerName (text, or "Walk-in"), productLine (enum), amount (currency), paymentMethod (enum: Cash / M-Pesa / Bank transfer)
- **Example rows:**
  | time | customer | productLine | amount | method |
  |---|---|---|---|---|
  | 08:42 | Walk-in | Gas | KES 2,800 | Cash |
  | 09:15 | Peter Kamau | Timber | KES 15,600 | M-Pesa |
  | 10:03 | Walk-in | Bio-products | KES 1,200 | Cash |
- **Relationships:** references Item (via line items), belongs to a Till

### Till
- **Fields:** id, name (text, e.g. "Main till", "Gas depot till"), cashierOnDuty (text), openingFloat (currency), status (enum: Open / Closed / Reconciled), countedCash (currency, set on close), variance (currency, computed)
- **Example rows:**
  | name | cashierOnDuty | openingFloat | status |
  |---|---|---|---|
  | Main till | Grace Wanjiru | KES 5,000 | Open |
  | Gas depot till | John Mutua | KES 3,000 | Closed |
- **Relationships:** has many TillTransaction

### BankDeposit
- **Fields:** id, date (date), amount (currency), bank (enum: Equity Bank / KCB / Co-operative Bank), reference (text), matchedTillTotal (currency, computed), status (enum: Matched / Mismatch)
- **Example rows:**
  | date | amount | bank | status |
  |---|---|---|---|
  | 2026-10-07 | KES 142,300 | Equity Bank | Matched |
  | 2026-10-08 | KES 98,000 | KCB | Mismatch |
- **Relationships:** references Till (by date)

### LedgerEntry
- **Fields:** id, date (date), reference (text), description (text), productLine (enum, nullable), debit (currency), credit (currency), runningBalance (currency)
- **Example rows:**
  | date | reference | description | debit | credit |
  |---|---|---|---|---|
  | 2026-10-05 | TL-2026-0398 | Sale — Rift Valley Hardware | — | KES 184,500 |
  | 2026-10-06 | PO-1182 | Supplier payment — cypress timber | KES 96,000 | — |
  | 2026-10-08 | EXP-204 | Fuel — KBZ 221A | KES 8,400 | — |
- **Relationships:** references Invoice, RunningCost, or standalone expense entries

## Flows

- **Create and send an invoice:** client-side only — adds an Invoice record in memory, computes VAT and totals from line items, appears in the Invoices table and in the Accountant's read-only Invoices view (shared mock state). No real eTIMS submission occurs; the KRA eTIMS status badge is set to "Submitted" automatically for demo purposes.
- **Record a payment:** client-side only — flips the Invoice's status, adds an entry to its Activity timeline and to the Transactions Ledger. No real payment gateway involved.
- **Reorder an item:** client-side only — flips the Item's status badge and adds/updates a row in the Reorder Queue shared across Owner and Warehouse roles. "Mark received" bumps Stock on hand and clears the queue row.
- **Log a running cost:** client-side only — adds a RunningCost row visible on both the Owner's Truck detail and the Driver's Truck Log (shared mock state), and updates the truck's monthly running-cost total.
- **Complete a sale (Cashier):** client-side only — adds a TillTransaction, updates the Till's running totals, decrements the relevant Item's Stock on hand (visible on the Warehouse's Stock Overview).
- **Open/close/reconcile a till:** client-side only — changes the Till's status and computed variance; reconciliation has no effect outside the Till History and Bank reconciliation pages.
- **Log a bank deposit:** client-side only — adds a BankDeposit row and computes Matched/Mismatch against that day's till total.
- **Update delivery status (Driver):** client-side only — flips the Delivery's status badge, visible identically from the card list and the detail page (shared state), and reflects in the Truck's "Deliveries today" count.
- **Adjust or intake stock (Warehouse):** client-side only — adds a StockMovement row and updates the Item's Stock on hand, visible everywhere that item's stock is shown (Dashboard low-stock alerts, Product Line pages, Stock Overview).
- **Export a report or statement:** client-side only — shows a toast confirming the export; no real file is generated or downloaded in the demo.
