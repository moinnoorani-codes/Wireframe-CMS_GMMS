# Combined ERP v7 — Design Spec
**Date:** 2026-05-08  
**Author:** Moin Noorani  
**File to modify:** `combined_erp_wireframes_v6.jsx` → `combined_erp_wireframes_v7.jsx`  
**Status:** Approved by client — ready for implementation

---

## 1. Overview

Two previously separate systems are merged into one JSX wireframe file with a toggle:
- **Sales ERP (Hoor Tex)** — Abdul Kadir's side: orders, SKUs, dispatch, payments, customers
- **Manufacturing ERP (GMMS)** — Mohammad Ali's side: challan tracking, job work, contractors, fabric, production

Both owners are Super Admins and can toggle freely. Staff only see what their role allows.

### Change Summary
| Type | Count | IDs |
|------|-------|-----|
| New screens | 15 | G-13–G-21, M-G01–M-G06 |
| Modified screens | 10 | W-03, W-04, W-05, W-06, W-30, W-30A, G-12, G-02, G-03, G-04 |
| Removed screens | 1 | G-11 (content folded into G-14) |
| Total screens (v7) | ~64 | — |

---

## 2. Core Business Logic Rules

These rules apply across multiple screens and must be reflected in the wireframe UI.

### 2.1 Challan Number = Lot Number
- Every production run has one **Challan No** (= Lot No). It is assigned at challan creation.
- All Reprocess stages (EMB → STH → DIA → …) share the **same Challan No**.
- Only a brand-new production run generates a new Challan No.
- G-01 Challan List shows the flow column (`EMB→STH→DIA`) tracking stages within one Challan No.
- G-13 Reprocess explicitly shows "Challan No: [same]" as a read-only field.

### 2.2 Design Number Pre-fill
- On G-02 Create Challan, when operator selects/types a Design No. from the dropdown:
  - All form fields auto-fill from the most recent production run of that design (colour breakdown, qty, fabric consumption, job work flow, contractor assignments).
  - A **mandatory acknowledgment popup** fires immediately showing all historical notes and problems from prior runs of that design. Operator must click "Understood — Proceed" before the form becomes editable.
  - Operator can update any pre-filled field before confirming.
- New Design No. (first time) → no pre-fill, no popup, clean form.

### 2.3 Reprocess = Next Stage, Same Lot
- Reprocess creates a new **stage record** under the same Challan No.
- Pre-fills: same Design No., same colour breakdown, same qty.
- Operator changes: Job Work Type (dropdown), Contractor/Party (dropdown), Date (date picker), Remarks.
- Nothing else changes.

### 2.4 RF = Return Fabric / Re-finish
- RF is created via G-20 RF Creation.
- Looked up by Invoice No. OR Design No.
- G-08 RF Management shows the list + KPIs. G-20 is the creation form.

### 2.5 SKU Flow: GMMS → Sales ERP
```
Ready Piece Count (G-06) confirmed
    → G-21 SKU Outward: GMMS team creates SKUs (design, colour, size, qty, barcode)
    → Auto-appears in Sales ERP W-04 SKU List with Source = "GMMS"
    → W-05 opens in Price Tag Entry mode: all fields pre-filled, only Retail + Wholesale price editable
    → W-06 SKU Detail shows GMMS origin: Design No. + Challan No.
```

### 2.6 External Stock (Sales ERP — Manual SKU)
- If Sales team procures from outside (not GMMS), they can create SKUs manually from W-05.
- W-05 detects mode: GMMS-sourced (pre-filled, locked fields) vs External (full editable form).
- W-04 shows Source = "External" for manually created SKUs.
- This is an admin-level feature that can be role-locked via W-30A permissions.

---

## 3. Modified Sales ERP Screens

### W-03 — Main Dashboard (Modified)
**Change:** When ERP Mode toggle is set to "Manufacturing ERP", replace Sales widgets with GMMS production widgets.

**Manufacturing ERP widget row (5 KPI tiles):**
- Active Challans (count)
- Overdue Challans (count, red alert if >0)
- Pieces in Production (total qty across all active challans)
- Pending Contractor Payments (₹ amount)
- RF Alerts (count of challans in RF state, orange)

**Below KPIs (Manufacturing mode):**
- Overdue Challan table: Challan No | Design | Stage | Contractor | Days Overdue | Action (Track)
- Contractor Leaderboard: Top 5 contractors by completion rate this month
- Stage Distribution chips: count of challans at each stage (EMB: 12, STH: 8, DIA: 6, …)
- Live ERP toggle pill (already exists ✅)

**Sales ERP widgets remain unchanged** when toggle is on Sales ERP.

---

### W-04 — SKU List (Modified)
**Change:** Add **Source** column between SKU Code and SKU Count.

- Source values: `GMMS` (orange tag) or `External` (gray tag)
- GMMS-sourced rows: clicking "View" on W-06 shows GMMS origin card
- Filter bar: add "Source ▾" dropdown filter (All / GMMS / External)

---

### W-05 — Create / Price SKU — Dual Mode (Modified)
**This screen now has two distinct modes:**

#### Mode A: Price Tag Entry (GMMS-sourced)
Triggered when: user opens a pending SKU that came in from G-21 SKU Outward.

- Header badge: `GMMS — Price Tag Entry` (orange)
- Info banner: "This SKU was created by the manufacturing team. You can only set pricing — all other fields are locked."
- Pre-filled & locked fields: Design Name, SKU Code, Variants (colours × sizes), Stock quantities, Barcode
- Editable fields: **Retail Price (₹)** and **Wholesale Price (₹)** only
- GMMS Origin card (read-only): Design No. | Challan No. | Production Date | Total Pieces
- Action buttons: **Save Pricing** | **Save & Print Labels** | Cancel

#### Mode B: Create SKU (External/Manual)
Triggered when: user clicks "+ Add SKU" and selects "External / Market Purchase".

- Full form exactly as current W-05 (Design Name, SKU Code, Pricing, Stock Entry grid, Images, Videos, Barcode, Print Options)
- Header badge: `External Stock — Manual Entry` (gray)
- No GMMS origin card
- Action buttons: **Save SKU** | **Save & Print Labels** | Cancel

**Mode selector on W-04 "+ Add SKU" button:**
- Clicking "+ Add SKU" shows a small inline picker: `From GMMS (pending SKUs)` | `External / Market Purchase`

---

### W-06 — SKU Detail (Modified)
**Change:** Add a **GMMS Origin** card in the right sidebar for GMMS-sourced SKUs.

GMMS Origin card contains:
- Design No. (linked → opens G-14 Design Master entry)
- Challan No. (linked → opens G-03 Challan Tracking for that challan)
- Production Date
- Total Pieces Outward'd
- Job Work Stages completed (e.g., EMB → STH → DIA → Ready)

For External SKUs: no GMMS Origin card shown.

---

### W-30 — User Management (Modified)
**Change:** Role list now includes Super Admin with cross-ERP toggle.

In the Add/Edit User modal Role selector:
- **Super Admin** row: description = "Full access to both Sales ERP and Manufacturing ERP. Reserved for owners (Kadir Bhai, Ali Bhai)."
- **Cross-ERP Visibility Toggle** per user: shown only if role allows partial cross-ERP access. Toggle: "Can view Manufacturing ERP" / "Can view Sales ERP" — off by default for staff.

---

### W-30A — Role Permissions (Modified)
**Change:** "ERP Cross-Access" module already exists. Update text:

- "Access Manufacturing ERP (GMMS)" — off for Office Staff / Godown Staff by default
- "Access Sales ERP (Hoor Tex)" — off for GMMS staff by default
- Super Admin: this section is greyed out with note "Super Admin always has full cross-ERP access"

---

## 4. Modified GMMS Screens

### G-12 — Production Dashboard (Modified)
**Add Quick-Action Cards** (like SR Surat reference software, client explicitly liked this):

Four teal/orange quick-action cards in a row at the top of the content area:
| Card | Action | Links to |
|------|--------|----------|
| New | Create New Challan → | G-02 |
| Reprocess | Reprocess Challan → | G-13 |
| RF / Alter | Create RF Entry → | G-20 |
| Remarks | Remark List → | Notifications / G-18 |

Below quick-action cards: existing KPI row + overdue table + contractor leaderboard + RF alert card + stage distribution chips + live ERP toggle (all as previously designed).

---

### G-02 — Create Challan (Modified)
**Add Design No. pre-fill + history popup + fabric/qty columns + inline quick-adds.**

This form is the digital equivalent of the physical A5 challan book (3-counter carbon copy). Every field maps to something the operator writes by hand today.

#### Header Section
| Field | Type | Notes |
|-------|------|-------|
| Challan No. | Auto (read-only) | System-assigned, sequential |
| Date | Date picker | Default: today |
| Party Name | Dropdown (searchable) | Contractor receiving this challan |
| Design No. (D.No) | Dropdown (searchable, required) | Triggers pre-fill + history popup |
| Design Name | Text (auto-filled, editable) | From Design Master |

#### Design History Popup (fires on Design No. selection)
- Title: "Design [D.No] — Production History Alert"
- Body: all notes/problems from every prior run, most recent first
- Each note row: Challan No. | Date | Note text | Added by
- **Cannot be dismissed with X or outside click** — only button: "Understood — Proceed to Edit"
- For new Design No. (first-ever use): no popup fires, clean form

#### Colour & Fabric Breakdown Table
This is the core of the challan. One row per colour. Operator adds rows with "+ Add Colour" button.

**Columns per row:**
| Column | Type | Notes |
|--------|------|-------|
| Colour Name | Dropdown + quick-add | Linked to G-16 Color Master for this design |
| Component | Checkboxes | □ Top □ Bottom □ Dupatta □ Others (per physical challan) |
| Pieces (Pcs) | Number input | Qty for this colour |
| Fabric Type | Dropdown + quick-add | e.g., Japan Satin, Georgette (linked to G-09) |
| Mtrs / Piece | Decimal input | e.g., 0.80, 2.16 — fabric consumption per piece |
| Total Mtrs | Auto-calc (read-only) | Pieces × Mtrs/Piece |
| Roll No. | Text input | e.g., L-108 (fabric roll identifier from G-09) |
| Roll Length (m) | Number input | Length of that roll, e.g., 60m |
| Process Note | Text input | e.g., FRONT, SIVE, FARSHI PARO WORK (work description for this colour) |
| Remarks | Text input | Any additional note for this row |
| Actions | — | Delete row icon |

**Below the table:**
- "+ Add Colour" button → adds a new empty row
- "＋ Add new colour" inline quick-add link → adds to G-16 for this design
- **Total LOT** (auto-calc, bold): sum of all Pieces across all colour rows

#### Sample Section (bottom of form)
Checkboxes matching the physical challan:
- □ Sample Top  □ Sample Bottom  □ Sample Dupatta  □ Sample Others
- Note: checked = sample piece included with this challan

#### Job Work Flow Builder
- Drag-reorder list of job work stages for this challan (existing feature)
- Parallel flow toggle (existing feature)
- "＋ Add new job work type" inline quick-add → adds to G-15 Job Work Types

#### Confirm Summary Card
Before submit: shows a read-only preview:
- Challan No. | Party | Design No. | Total LOT | Stages | Date
- CTA: **Confirm & Create Challan** | Save Draft | Cancel

#### UX notes (operator works at speed — 30–40 challans/day peak)
- Tab key moves through fields left-to-right, row by row
- Pieces field: numeric keyboard only
- Mtrs/Piece: decimal input, 2 decimal places
- All dropdowns have keyboard search
- On Design No. selection: cursor moves to Party Name after popup is dismissed

---

### G-03 — Challan Tracking (Modified)
**Add Reprocess action:**

- In the stage tracker, each completed stage (green state) shows a **"Reprocess →"** action button
- Clicking "Reprocess →" on a completed stage navigates to G-13 Reprocess Challan, pre-filling this challan's details
- Also add a top-bar action button: **"Reprocess Challan"** (primary, orange)

---

### G-04 — Contractor List (Modified)
**Add "Add Contractor" dialog:**

Show "+ Add Contractor" button in top bar. Clicking opens a modal with fields:
- Party/Contractor Name (required)
- Type (dropdown → Job Work Types from G-15: EMB, STH, etc.) — required
- Address (text)
- Mobile No. (required, used for SMS + login)
- GSTIN (optional)
- Login Name (required — auto-suggested from name)
- Login Password (required — show/hide toggle)
- Status: Active / Inactive toggle
- CTA: **Create Contractor + Send Login SMS**

Note: This duplicates G-17 Contractor Registry for quick inline add. G-17 is the full management screen.

---

## 5. New GMMS Screens

### G-13 — Reprocess Challan (New)
**Purpose:** Advance an existing challan to its next job-work stage — same lot number, same items and qty, operator only changes job type + party + date.

**Layout:** Two-column form. Left = challan details (read-only). Right = new stage fields (editable).

#### Header banner (prominent, orange)
> "Continuing Challan #[X] — Stage [N] of [Total Stages]"
> Challan No. stays the same through all reprocesses.

#### Left column — Challan Details (all read-only, auto-filled on Challan No. selection)
| Field | Value shown |
|-------|-------------|
| Challan No. | Read-only, bold |
| Design No. | Read-only |
| Design Name | Read-only |
| Party (previous stage) | Read-only — who did the last stage |
| Last Job Type | Read-only chip (e.g., EMB — Completed) |
| Date Sent | Read-only |

**Colour & Fabric table (read-only mirror of G-02):**
| Colour | Component | Pcs | Fabric Type | Mtrs/Pc | Total Mtrs | Roll No. | Process Note |
|--------|-----------|-----|-------------|---------|------------|----------|--------------|
All rows read-only. Qty and fabric don't change between stages.

**Total LOT** (read-only): same as original.

**Sample checkboxes** (read-only): same as original.

#### Right column — New Stage (editable)
| Field | Type | Notes |
|-------|------|-------|
| Next Job Work Type | Dropdown (required) | From G-15 — this is the key change |
| Assign Contractor / Party | Dropdown (required) | Filtered by selected job type |
| Date | Date picker | Default: today |
| Remarks | Textarea | Instructions for this stage |

#### Confirm Summary card (bottom, full width)
> "Reprocess: Challan #[X] · [Design No.] · [Total LOT] pcs · [Last Type] → [Next Type] · [Contractor] · [Date]"
- CTA: **Confirm Reprocess** | Cancel

**Post-confirm:** G-01 Challan List updates the flow column (e.g., `EMB→STH` becomes `EMB→STH→DIA`). G-03 Challan Tracking shows the new stage added.

---

### G-14 — Design Master (New, replaces G-11)
**Purpose:** Central management for all design records + design security (absorbs G-11 content).

**Layout:** Add form + list table (like reference software pattern).

**Add New Design form (collapsible):**
- Design No. (D.No) — required, unique
- Design Name — required
- Product HSN Code — required
- Sample pieces: Top ☐ Bottom ☐ Dupatta ☐ Others ☐
- DST File Upload — drag-and-drop, DST/EMB format only
- IP Restriction — on/off toggle + IP address input (office network only)
- Stitch Count — number field + Lock toggle (owner only)

**Design List table columns:**
- D.No | Design Name | HSN | Colours | Last Produced | Status | Actions

**Per-row actions:** View | Edit | Approve | Reject | View Access Log

**Security sub-section** (tab within Design Master, replaces G-11):
- Tab: "Security & Access"
- IP restriction status per design
- Stitch count lock status
- Access attempt log: Timestamp | User | Action | IP | Result (Allowed/Blocked)

---

### G-15 — Job Work Types Master (New)
**Purpose:** Manage the 13 job work categories used across challan creation and reprocessing.

**Layout:** Simple add + list (like Type Master from reference software).

**Add New Type form:**
- Type Name (required) — e.g., EMB, STITCHING, DIAMOND, HANDWORK, MOTI, etc.
- Short Code (required) — used in flow column display (e.g., EMB, STH, DIA)
- Description (optional)
- Rate per piece (₹) — default rate for payment calculation
- Status: Active / Inactive

**List table columns:**
- Short Code | Type Name | Rate/Piece | Active Challans (count) | Status | Actions (Edit)

**Pre-loaded with 13 types from BRD:**
EMB, STITCHING, DIAMOND, HANDWORK, MOTI, CUT WORK, PRINTING, BUTTON, PACKING, CHECKING, FINISHING, THREAD CUTTING, TAGGING

---

### G-16 — Color Master (New)
**Purpose:** Manage colour variants per design.

**Layout:** Add form + list table.

**Add New Color form:**
- Color Name (required)
- Design No. (dropdown, linked to G-14) — required
- Hex/swatch (optional color picker)

**List table columns:**
- Design No. | Color Name | Swatch | Date Added | Actions (Edit)

**Filter:** Dropdown to filter by Design No.

---

### G-17 — Contractor Registry (New)
**Purpose:** Full contractor registration and management (bulk view — complements G-04 operational view).

**Layout:** Add form + list table (like User Master from reference software).

**Add New Contractor form:**
- Party Name (required)
- Address (required)
- Mobile No. (required)
- GSTIN (optional)
- Type (dropdown → G-15 Job Work Types) — required
- Login Name (required)
- Login Password (required, show/hide)
- Status: Active / Inactive

**List table columns:**
- Party Name | Address | Mobile | GSTIN | Type | Login Name | Status | Actions (Edit)

**Table controls:** Search | Export | Bulk Delete | Add New

---

### G-18 — Notifications Center (New)
**Purpose:** System notifications for challan lifecycle events (accept/reject/sent by contractors).

**Layout:** Table with export + search.

**Table columns:**
- SR. | Action button (Detail) | Notification message | From (user) | Time

**Notification types:**
- "Challan No. [X] Accepted By [contractor]"
- "Challan No. [X] Rejected By [contractor]"
- "Challan No. [X] — [N] Pieces Sent By [contractor]"

**Detail button** → navigates to G-03 Challan Tracking for that challan.

**Bell icon** in top nav shows unread count (badge).

---

### G-19 — GMMS Reports Hub (New)
**Purpose:** Production reports for GMMS side.

**Layout:** Report cards grid (like W-23 Sales Reports Hub).

**Report cards (6):**
| Report | Description |
|--------|-------------|
| Challan Status Report | By date, design, stage, contractor — with PDF export |
| Contractor Performance | Completion rate, avg days, rejection rate per contractor |
| Design Cost History | Cost per piece per design over time (owner only) |
| RF / Returns Summary | RF count by design, contractor, date range |
| Stage Throughput | Avg time per stage across all challans |
| Production vs Target | Pieces planned vs completed by month |

---

### G-20 — RF Creation (New)
**Purpose:** Create a new RF (Return Fabric / Re-finish) entry. Accessible from G-08 and G-12 quick-action.

**Layout:** Single lookup + form.

**Step 1 — Lookup:**
- Search by: **Invoice No.** OR **Design No.** (two radio options, one search box)
- On match: auto-fills all details (challan info, contractor, design, colours, qty)
- Shows a preview card of the matched challan

**Step 2 — RF Details form (shown after lookup match):**
| Field | Type | Notes |
|-------|------|-------|
| Challan No. | Read-only | From lookup |
| Design No. | Read-only | From lookup |
| Contractor | Read-only | From lookup |
| RF Type | Dropdown | Return Fabric / Re-finish / Rejection |
| Quantity | Number | Pieces being returned/re-finished |
| Reason | Textarea | Required — quality issue description |
| Responsible Party | Dropdown | Who is responsible (contractor/admin) |
| Date | Date picker | Default: today |
| SMS Notify Contractor | Toggle | Default: on |

**CTA:** Create RF Entry | Cancel

**Post-creation:** G-08 RF Management list updates. SMS sent to contractor if toggle on.

---

### G-21 — SKU Outward (New)
**Purpose:** GMMS team creates SKUs from finished/counted pieces and dispatches them to Sales ERP inventory.

**Layout:** Two-step screen — Select Challan → Define SKUs.

**Step 1 — Select Challan:**
- Dropdown: select a challan with status "Ready" (Ready Piece Count confirmed in G-06)
- Shows challan summary: Design No. | Total Pieces | Colours × Components

**Step 2 — Define SKUs:**

Parent SKU section:
- Design Name (pre-filled from design master, editable)
- SKU Code (auto-generated: e.g., GMMS-001, editable)
- HSN Code (pre-filled from G-14)
- Barcode preview (auto-generated)

Child SKU grid (colour × size matrix):
- Rows: one per colour (from G-06 ready count)
- Columns: component types (Top, Bottom, Dupatta, Others) + Size
- Qty per cell: auto-filled from G-06 counts, editable
- Each row has: SKU Code (auto), Qty, Rate/Piece (cost price from G-10 if owner)

**Print Labels toggle:** Print child labels after outward (default: on)

**Outward Summary card:**
- Total SKUs creating: [N]
- Total pieces: [N]
- Will appear in Sales ERP SKU List as: Source = GMMS, Status = "Pending Pricing"

**CTA:** **Confirm Outward + Push to Sales ERP** | Save Draft | Cancel

**Post-outward:** SKUs auto-appear in W-04 SKU List with Source=GMMS, Status=Pending Pricing. W-05 shows them in Price Tag Entry mode for Sales team.

---

## 6. Contractor Mobile Screens

All contractor mobile screens use the existing `MobileFrame` component (300px width, black top bar).
Orange accent color (`#e67e22`) throughout to match GMMS Manufacturing ERP.

### M-G01 — Contractor Login (New)
- Logo: GMMS Manufacturing · Contractor Portal
- Fields: Mobile No. + Password
- "Forgot Password?" link (SMS OTP reset)
- Info text: "Login with your registered mobile number"
- No registration (accounts created by admin via G-04 / G-17)

### M-G02 — My Challans (New)
**Top:** KPI row (2 tiles): Pending (need action) | Active (in progress)

**Filter tabs:** All | Pending | Active | Completed

**Challan list rows:**
- Challan No. | Design No. | Pieces | Job Type badge (EMB/STH/etc.) | Days since received | Status badge
- Status: Pending Accept (orange) | Accepted | Sent Back | Rejected

**Per-row actions:** Tap to open M-G03

**Bottom nav:** Challans (active) | Payments | Profile

### M-G03 — Challan Detail (New)
**Top:** MNav with back arrow + "Challan #[X]"

**Info card:** Design No. | Date Sent | Job Type | Pieces | Colour breakdown table | Notes from admin

**Accept / Reject section:**
- Two large buttons: **Accept ✓** (green) | **Reject ✗** (red)
- Reject requires reason dropdown: Quality Issue / Capacity Issue / Wrong Design / Other + text box
- Once accepted: buttons replaced by "Accepted on [date]" confirmation + "Confirm Pieces Sent →" button

**Notes history panel:** Admin remarks + contractor responses, chronological

### M-G04 — Confirm Pieces Sent (New)
**Purpose:** Contractor confirms how many pieces they're sending back.

**Form:**
- Challan No. (read-only)
- Component breakdown table: Top | Bottom | Dupatta | Others — qty input per row
- Total auto-calculates
- Shortage alert: if total < challan qty → red warning "X pieces short — reason required"
- Shortage reason (required if short): Damage | Lost | Pending work | Other + text
- Remarks (optional)
- **CTA:** Confirm & Send (triggers admin notification)

### M-G05 — My Payment Ledger (New)
**Top KPI tiles (3):**
- Pending (eligible but not yet paid)
- Eligible for payment (work confirmed by admin)
- Total Paid (lifetime)

**Ledger table:**
- Date | Challan No. | Design | Pieces | Rate | Amount | Type (Credit/Debit) | Balance
- Rows: payment received (green) + work done entries

**Filter:** Date range picker | Status (All / Pending / Paid)

### M-G06 — My Profile (New)
**Sections:**
- Avatar + Name + Type badge (EMB / STH / etc.)
- Contact: Mobile | Address | GSTIN
- Login: Change Password (current + new + confirm)
- Notifications: SMS on/off toggle for new challan, payment alerts
- App info: version number

---

## 7. Updated GMMS Sidebar Navigation

```
⊞  Dashboard          → G-12
📋 Challans           → G-01 (List), G-02 (Create), G-03 (Track), G-13 (Reprocess)
👷 Contractors        → G-04 (List), G-05 (Detail)
✔  Production         → G-06 (Ready Count), G-07 (Payment Check), G-21 (SKU Outward)
↩  RF / Returns       → G-08 (Management), G-20 (Create RF)
🧵 Fabric / Mill      → G-09
₹  Costing            → G-10  [Owner Only badge]
🗂  Masters            → G-14 (Design), G-15 (Job Types), G-16 (Colors), G-17 (Contractors)
🔔 Notifications      → G-18
📊 Reports            → G-19
📱 Contractor Mobile  → M-G01–M-G06  [Preview / Demo section]
⚙  Admin (Shared)     → W-30, W-32, W-33
```

---

## 8. File Structure

Single file: `combined_erp_wireframes_v7.jsx`

Estimated size: ~7,500–8,000 lines (was 4,331 lines).

All new screen functions follow existing naming and style conventions:
- Use existing components: `C`, `CO`, `Card`, `Btn`, `Input`, `FR`, `TH`, `TR`, `Tag`, `Metric`, `Modal`, `Toggle`, `Tabs`, `SectionLabel`, `MobileFrame`, `MNav`, `MBottomNav`
- Orange accent (`CO.accent`, `CO.accentLight`, `CO.accentBorder`) for all GMMS screens
- `WebLayout mode="mfg"` wrapper for all G-* screens
- `MobileFrame` wrapper for all M-G* screens
- Update `MFG_MENU` array to add Masters, Notifications, Reports, RF Creation, SKU Outward, Contractor Mobile sections
- Update `screens` object with all new screen IDs
- Update `screenNames` lookup with all new IDs
- Update `navTree` with new sections

---

## 9. Screen Deletion

**G-11 is removed.** Its content is redistributed:
- Design table + DST upload + approve/reject flow → G-14 Design Master (main content)
- IP restriction + stitch count lock + access attempt log → G-14 "Security & Access" tab
- No screen should reference G-11 after v7.
