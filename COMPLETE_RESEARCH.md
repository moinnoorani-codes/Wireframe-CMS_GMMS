# SR Surat — ERP Demo Software Research

**URL:** https://new.srsurat.in/demo_software/index.php/Admin/Login  
**Credentials:** admin / 123456  
**Framework:** AdminLTE (Bootstrap-based admin panel)  
**Backend:** CodeIgniter (PHP)  
**Copyright:** Fepic © 2014-2019 | Developed by Siliconleaf  

---

## Application Overview

This is a **Garment/Textile Manufacturing ERP** system focused on managing the **job work (challan) lifecycle** — tracking fabric/garment pieces as they move through various manufacturing processes (embroidery, stitching, handwork, etc.) across multiple contractors/parties.

### Core Business Flow
```
Lot Creation → Challan Generation → Send to Party (Contractor) → 
Party Accepts/Rejects → Work Done → Stock In → Order Fulfillment
```

---

## Complete Page Directory

| # | Page | URL Path | Category |
|---|------|----------|----------|
| 1 | Dashboard | `/Admin/Dashboard` | Home |
| 2 | Type Master | `/Admin/type` | All Master |
| 3 | User Master | `/Admin/user` | All Master |
| 4 | Product Master | `/Admin/product` | All Master |
| 5 | Sub Product Master | `/Admin/sub_product` | All Master |
| 6 | Color Master | `/Admin/color` | All Master |
| 7 | Party Master | `/Admin/Party` | All Master |
| 8 | Media Master | `/Admin/Media` | All Master |
| 9 | Lot Master | `/Admin/lot` | Operations |
| 10 | Chalan Master | `/Admin/report` | Operations |
| 11 | Alter List | `/Admin/alter/alterList` | Operations |
| 12 | Notifications | `/Admin/notification/showAllNotification` | System |
| 13 | Stock Master | `/Admin/Stock/` | Inventory |
| 14 | Order Master | `/Admin/Order/` | Sales |
| 15 | Generate New Chalan | `/Admin/New_chalan` | Quick Action |
| 16 | Reprocess Chalan | `/Admin/New_chalan/Reprocess` | Quick Action |
| 17 | Remark List | `/Admin/Remark_list` | Communication |

See individual page documentation files in this folder for detailed breakdowns.


---

# Login Page

**URL:** `https://new.srsurat.in/demo_software/index.php/Admin/Login`  

## Purpose
Authentication page for the ERP system.

## Form Fields
| Field | Type | Description |
|-------|------|-------------|
| Username | Text Input | Login username |
| Password | Password Input | Login password |

## Buttons
- **Login** / **Sign In** button

## Credentials (Demo)
| Username | Password | Role |
|----------|----------|------|
| admin | 123456 | Admin (full access) |
| richa | 12345678 | STITCHING contractor |
| mehul | 123456 | EMB contractor |
| ashish | 123456 | MOTI contractor |

## Notes
- Built on AdminLTE template
- Displays "AdminLTE Logo" placeholder
- Single-page login (no registration, no forgot password)
- All users log in through the same URL
- Different roles see different interfaces after login


---

# Navigation & Sidebar Structure

## Sidebar Menu (Left Panel)

The application uses **AdminLTE** framework with a collapsible sidebar. All menu items use grid icons (⊞).

```
├── Dashboard                    [NEW badge]
├── All Master                   [▼ Expandable]
│   ├── Type Master
│   ├── User Master
│   ├── Product Master
│   ├── Sub Product Master
│   ├── Color Master
│   ├── Party Master
│   └── Media Master
├── Lot Master
├── Chalan Master
├── Alter List
├── Notifications
├── Stock Master
├── Order Master
├── LogOut
└── LogOut All
```

## Top Bar
- **Left:** AdminLTE Logo + "AdminLTE" text + hamburger menu toggle (☰)
- **Right:** Bell/notification icon
- **User Panel (Sidebar top):** User avatar placeholder + "admin" label

## Financial Year Selector
- Dropdown on Dashboard: Shows `2026-2027 ×` (removable tag)
- Used to filter data by financial year


---

# Dashboard

**URL:** `/Admin/Dashboard`  
**Page Title:** Dashboard1  
**Breadcrumb:** Home / Starter Page  

## Layout

The dashboard is a simple landing page with 4 quick-action cards arranged in a single row.

## Financial Year Selector
- Tag/chip selector at top: `2026-2027 ×`
- Allows filtering data by financial year
- Tag is removable (× button)

## Quick Action Cards (4 Teal/Cyan Cards)

| Card | Title | Action Label | Link Target |
|------|-------|-------------|-------------|
| 1 | **New** | Generate New ➔ | `/Admin/New_chalan` |
| 2 | **Reprocess** | Reprocess ➔ | `/Admin/New_chalan/Reprocess` |
| 3 | **Alter** | Alter ➔ | Alter form/page |
| 4 | **Remark** | Remark List ➔ | `/Admin/Remark_list` |

### Card Design
- Background: Teal/cyan (`#17a2b8` or similar)
- Text: White
- Header shows card title
- Footer shows action link with arrow icon (➔)
- All cards are equal width (4 columns)

## Notes
- No dashboard analytics/charts/metrics visible
- No summary counts (orders, challans, stock, etc.)
- Very minimal — primarily serves as a navigation hub
- Footer: "Copyright © 2014-2019 Fepic. All rights reserved." + "Developed By Siliconleaf"


---

# Type Master

**URL:** `/Admin/type`  
**Page Title:** Type  
**Breadcrumb:** Dashboard / Type  

## Purpose
Manages **user/party types** — defines the categories of users/contractors in the system (e.g., what kind of job work they do).

## Add New Type Form (Collapsible Section)
- **Header:** "Add New Type" (Blue bar with + icon to expand/collapse)
- **Fields:**
  - `Type Name` — Text input
- **Button:** Submit (implied)

## Type List Table

### Table Controls
- **Delete** button (Red) — bulk delete selected rows
- **Export** button — export data
- **Search** field (top right) — real-time filter

### Table Columns
| Column | Description |
|--------|-------------|
| Checkbox | Row selection for bulk actions |
| Actions | Edit button (✏️ icon) |
| User Type | The type/category name |

### Sample Data (5 entries visible)
| User Type |
|-----------|
| EMB |
| test 1 |
| STITCHING |
| HANDWORK |
| Sub Admin |

## Notes
- Types likely represent **job work categories**: EMB (Embroidery), STITCHING, HANDWORK
- "Sub Admin" suggests role-based types as well
- These types are referenced in the User Master when creating users


---

# User Master

**URL:** `/Admin/user`  
**Page Title:** User  
**Breadcrumb:** Dashboard / User  

## Purpose
Manages all **system users** — including admin, contractors (parties who receive job work), and staff.

## Add New User Form (Collapsible Section)
- **Header:** "Add New User" (Blue bar with + icon)
- **Fields:**
  - `Party Name` — Text input
  - `Address` — Text input
  - `Mobile No.` — Text/number input
  - `GSTIN` — Text input (GST identification number)
  - `Type` — Dropdown (linked to Type Master — EMB, STITCHING, HANDWORK, etc.)
  - `Login Name` — Text input (username for login)
  - `Login Password` — Text input (password for login)
- **Button:** Submit

## User List Table

### Table Controls
- **Delete** button (Red) — bulk delete
- **Export** button
- **Search** field

### Table Columns
| Column | Description |
|--------|-------------|
| Checkbox | Row selection |
| Actions | Edit button (✏️) |
| Party Name | Name of the user/party |
| Address | Location |
| Mobile No. | Phone number |
| GSTIN | GST number |
| Type | User type category |
| Login Name | Username |
| Login Password | Password (displayed in plain text!) |

### Sample Data (4 entries)
| Party Name | Address | Mobile No. | GSTIN | Type | Login Name | Login Password |
|-----------|---------|-----------|-------|------|-----------|---------------|
| job | surat | 7777994699 | xxxx | EMB | admin | 123456 |
| Richa Sanghvi | Adajan | 7485962015 | DFGH7452RR | STITCHING | richa | 12345678 |
| Mehul | aa | 7779049787 | sasa | EMB | mehul | 123456 |
| ASHISH | amroli | 9638265612 | dmlkasnl | MOTI | ashish | 123456 |

## Notes
- **SECURITY ISSUE:** Passwords are stored and displayed in plain text
- User types link to Type Master (EMB, STITCHING, MOTI are job work types)
- Each user has login credentials — these are the contractor logins
- "job" user appears to be the main admin with type "EMB"
- GSTIN field suggests these are business entities/contractors


---

# Product Master

**URL:** `/Admin/product`  
**Page Title:** Product  
**Breadcrumb:** Dashboard / Product  

## Purpose
Manages **product/design records** — the garment products being manufactured. Each product has a unique name, HSN code, and design number.

## Add New Product Form (Collapsible Section)
- **Header:** "Add New Product" (Blue bar with +)
- **Fields:**
  - `Product Name` — Text input (e.g., ABC001)
  - `Product HSN Code` — Text input (Harmonized System Nomenclature code for taxation)
  - `Design No.` — Text input (design number reference)
- **Button:** Submit

## Product List Table

### Table Controls
- **Delete** button (Red)
- **Export** button
- **Search** field

### Table Columns
| Column | Description |
|--------|-------------|
| Checkbox | Row selection |
| Actions | Edit button (✏️) |
| Product Name | Product identifier/code |
| Product HSN Code | Tax classification code |
| Design No. | Design reference number |

### Sample Data (2 entries)
| Product Name | Product HSN Code | Design No. |
|-------------|-----------------|-----------|
| ABC001 | abc | abc |
| dfb | 465 | 56 |

## Notes
- Product Name appears to be a code/identifier (e.g., ABC001), not a descriptive name
- HSN Code is for GST/tax purposes in India
- Design No. is the internal design reference
- Products are referenced in Chalan Master, Lot Master, and Color Master
- Each product can have multiple colors (linked via Color Master)
- Each product can have sub-products (linked via Sub Product Master)


---

# Sub Product Master

**URL:** `/Admin/sub_product`  
**Page Title:** Sub_Product  
**Breadcrumb:** Dashboard / Sub_Product  

## Purpose
Manages **sub-products** — component parts of a main product. For example, a garment set might have a "dupatta" as a sub-product.

## Add New Sub Product Form (Collapsible Section)
- **Header:** "Add New Sub_Product" (Blue bar with +)
- **Fields:**
  - `Sub Product Name` — Text input
  - `Product Name` — Dropdown (linked to Product Master)
- **Button:** Submit

## Sub Product List Table

### Table Controls
- **Delete** button (Red)
- **Export** button
- **Search** field

### Table Columns
| Column | Description |
|--------|-------------|
| Checkbox | Row selection |
| Actions | Edit button (✏️) |
| Sub Product Name | Name of the sub-component |
| Product Name | Parent product (linked to Product Master) |

### Sample Data (1 entry)
| Sub Product Name | Product Name |
|-----------------|-------------|
| dupatta | dfb |

## Notes
- Sub-products represent individual components of a garment set
- Common sub-products in textile: dupatta, top, bottom, salwar, kurta, etc.
- Linked to the parent Product Master entry
- Referenced in Chalan Master (Sub Product Name column)


---

# Color Master

**URL:** `/Admin/color`  
**Page Title:** Color  
**Breadcrumb:** Dashboard / Color  

## Purpose
Manages **color variants** for each product. Each product can have multiple color entries.

## Add New Color Form (Collapsible Section)
- **Header:** "Add New Color" (Blue bar with +)
- **Fields:**
  - `Color Name` — Text input (e.g., Red, Pink, Green)
  - `Product` — Dropdown (linked to Product Master)
- **Button:** Submit

## Color List Table

### Table Controls
- **Delete** button (Red)
- **Export** button
- **Search** field

### Table Columns
| Column | Description |
|--------|-------------|
| Checkbox | Row selection |
| Actions | Edit button (✏️) |
| Product | Parent product name |
| Color | Color name |
| Date | When the color entry was created |

### Sample Data (5 entries)
| Product | Color | Date |
|---------|-------|------|
| ABC001 | Red | 2026-01-05 15:22:48 |
| ABC001 | Pink | 2026-01-05 15:22:56 |
| ABC001 | wehite | 2026-01-13 14:36:39 |
| dfb | Green | 2026-04-30 13:01:31 |
| dfb | red | 2026-05-07 15:28:28 |

## Notes
- Colors are product-specific (each color is linked to a product)
- Product ABC001 has 3 colors: Red, Pink, White (misspelled as "wehite")
- Product dfb has 2 colors: Green, red
- Colors are referenced in Chalan Master and Lot creation
- Timestamp shows when each color was added


---

# Party Master

**URL:** `/Admin/Party`  
**Page Title:** Party  
**Breadcrumb:** Dashboard / Party  

## Purpose
Manages **parties** — external business entities/dealers who buy finished products. Different from User Master (which tracks contractors who do job work).

## Add New Party Form (Collapsible Section)
- **Header:** "Add New Party" (Blue bar with +)
- **Fields:**
  - `Party Name` — Text input (business name)
- **Button:** Submit

## Party List Table

### Table Controls
- **Delete** button (Red)
- **Export** button
- **Search** field

### Table Columns
| Column | Description |
|--------|-------------|
| Checkbox | Row selection |
| Actions | Edit button (✏️) |
| Party Name | Name of the party/dealer |

### Sample Data (1 entry)
| Party Name |
|-----------|
| TEST PARTY |

## Notes
- Party Master is very minimal — just a name field
- Parties are referenced in Chalan Master (Party Name column)
- Represents contractors/job workers who receive challans
- Different from User Master which has full credentials and GSTIN
- Only 1 party currently exists: "TEST PARTY"


---

# Media Master

**URL:** `/Admin/Media`  
**Page Title:** Media  
**Breadcrumb:** Dashboard / Media  

## Purpose
Manages **media files** (images) — likely product photos, design references, or documentation images.

## Add New Media Form (Expanded by Default)
- **Header:** "Add New Media" (Blue bar with − icon = already expanded)
- **Fields:**
  - `Select Image` — Drag-and-drop file upload zone
    - Text: "Drop files here to upload"
    - Supports image file uploads
- **Button:** "Add Media" (Green button)

## Media List Table

### Table Controls
- **Delete** button (Red)
- **Export** button
- **Search** field

### Table Columns
| Column | Description |
|--------|-------------|
| Checkbox | Row selection (implied) |
| Image | Uploaded image preview |
| Copy | Copy link/action |

### Sample Data
- "No data Found" — currently empty

## Notes
- Uses drag-and-drop file upload (Dropzone.js likely)
- The form is expanded by default (unlike other master pages)
- Currently has no media uploaded
- Likely used for uploading product/design images
- The "Copy" column suggests ability to copy image URLs


---

# Lot Master

**URL:** `/Admin/lot`  
**Page Title:** Lot  
**Breadcrumb:** Dashboard / Lot  

## Purpose
Manages **production lots** — batches of garments grouped together for manufacturing. A lot represents a specific production run with a defined quantity of pieces that will go through job work processes.

## Layout
- **NO "Add" form** — Lots are created via the "Generate New" flow from Dashboard
- Only shows the Lot List table

## Lot List Table Header
- **Header:** "Lot List" (Blue bar)

### Table Controls
- **Export** button only (no Delete or PDF)
- **Search** field

### Table Columns
| Column | Description |
|--------|-------------|
| Action | Buttons: `Detail`, `ALTER` (yellow), `Complete` (green), `Order` (teal) |
| Lot No | Unique lot identifier (auto-incremented) |
| User Name | User who created the lot (shows "-" if admin) |
| Total Chalan | Number of challans generated for this lot |
| Design No | Design reference |
| Process Quantity | Total pieces in the lot |
| Order Quantity | Pieces ordered from this lot |
| Remain Quantity | Pieces remaining (Process Qty - Order Qty) |
| Date | Creation date and time |

### Action Buttons (Per Row)
| Button | Color | Purpose |
|--------|-------|---------|
| Detail | Default/Gray | View lot details |
| ALTER | Yellow/Warning | Send pieces for alteration |
| Complete | Green/Success | Mark lot as complete |
| Order | Teal/Info | Create order from this lot |

**Note:** Not all rows have all buttons. The "ALTER" and "Complete" buttons only appear on lots that qualify.

### Sample Data (4 entries)
| Lot No | User Name | Total Chalan | Design No | Process Qty | Order Qty | Remain Qty | Date |
|--------|-----------|-------------|-----------|-------------|-----------|------------|------|
| 4 | - | 1 | abc | 2 | 0 | 2 | 2026-05-06 05:17:40 |
| 3 | - | 2 | abc | 5 | 5 | 0 | 2026-04-30 03:30:34 |
| 2 | - | 1 | abc | 250 | 0 | 250 | 2026-04-30 03:18:54 |
| 1 | - | 1 | abc | 100 | 0 | 100 | 2026-04-30 03:18:25 |

## Business Logic
- **Process Quantity** = Total pieces put into production
- **Order Quantity** = Pieces that have been ordered/sold
- **Remain Quantity** = Process Qty - Order Qty (available stock)
- **Total Chalan** = Number of challans (job work dispatches) for this lot
- When Remain Quantity = 0, the lot is fully consumed
- Lot #3 has ALTER and Complete buttons because it has been fully ordered (5 of 5 pieces)


---

# Chalan Master

**URL:** `/Admin/report`  
**Page Title:** Chalan  
**Breadcrumb:** Dashboard / Chalan  

## Purpose
This is the **core operational page** — manages all challans (job work dispatches). A challan represents sending a batch of garment pieces to a contractor for a specific job work process.

## Filter Section (Collapsible)
- **Header:** "Filter" (Blue bar with +)
- Likely contains date range, party, and product filters

## Chalan List Table Header
- **Header:** "Chalan List" (Blue bar)

### Table Controls
- **Show entries** dropdown: 10 entries per page
- **Delete** button (Red) — bulk delete
- **PDF** button — generate PDF report
- **Export** button — export data
- **Search** field (top right)

### Inline Filters (Below Header Row)
- **Chalan No** — Dropdown filter ("All")
- **Lot No** — Dropdown filter
- **Party Name** — Dropdown filter ("All")
- **Product Name** — Dropdown filter ("All")

### Table Columns
| Column | Width | Description |
|--------|-------|-------------|
| Checkbox | Narrow | Row selection |
| Action | Wide | Multiple action buttons per row |
| Chalan No | Medium | Unique challan number |
| Lot No | Medium | Associated lot number |
| Date | Medium | Challan date |
| Chalan Generated By | Medium | User who created the challan |
| Party Name | Medium | Contractor/party receiving the pieces |
| Product Name | Medium | Product being processed |
| Sub Product Name | Medium | Sub-component (if applicable) |
| Color Name | Medium | Color of the garment |
| Quantity | Narrow | Number of pieces sent |
| Rem... (truncated) | Narrow | Likely "Remaining Quantity" |

### Action Buttons (Per Row)
| Button | Color | Purpose |
|--------|-------|---------|
| View Detail | Gray/Default | View challan details |
| Remark | Brown/Warning | Add remark/note to challan |
| Edit | Blue/Info | Edit challan details |
| R.P | Blue/Info | Reprocess — send back for rework |

### Sample Data (3 visible rows)
| Chalan No | Lot No | Date | Generated By | Party Name | Product Name | Color Name | Quantity |
|-----------|--------|------|-------------|-----------|-------------|-----------|----------|
| 5 | 4 | 2026-05-06 | admin | richa | ABC001 | Red | 2 |
| 4 | 3 | 2026-04-30 | mehul | ashish | ABC001 | Red | 5 |
| 3 | 3 | 2026-04-30 | admin | mehul | ABC001 | Red | 10 |

## Business Flow
```
Admin creates Challan → Selects Lot → Assigns Party → 
Specifies Product/Color/Quantity → Party receives notification →
Party Accepts/Rejects → Work done → Remark/Reprocess if needed
```

## Notes
- Most active page in the system
- Challan numbers are auto-incremented
- Each challan links to a Lot, Party, Product, and Color
- "Chalan Generated By" shows who created it
- R.P (Reprocess) button allows sending pieces back for rework
- Remark button for adding notes about the challan
- The table is scrollable horizontally (column "Rem..." is truncated)


---

# Alter List

**URL:** `/Admin/alter/alterList`  
**Page Title:** Alter  
**Breadcrumb:** Dashboard / Alter  

## Purpose
Manages **alteration requests** — when garment pieces need rework or modification after the initial job work. Tracks which pieces are sent back for fixes.

## Layout
- Shows the Alter list table with tabs/filters

## Alter List Table

### Table Controls
- **Export** button
- **Search** field

### Expected Table Columns
| Column | Description |
|--------|-------------|
| Action | View/Edit buttons |
| Alter No / ID | Unique identifier |
| Lot No | Associated lot |
| Chalan No | Associated challan |
| Party Name | Contractor handling the alteration |
| Product Name | Product being altered |
| Color Name | Color variant |
| Quantity | Number of pieces to alter |
| Status | Current status of alteration |
| Date | When alteration was created |

## Notes
- Alterations are created from Lot Master (ALTER button)
- Represents the rework/modification flow
- Links back to the original lot and challan
- Different from "Reprocess" which creates a new challan for rework


---

# Notifications

**URL:** `/Admin/notification/showAllNotification`  
**Page Title:** Notification  
**Breadcrumb:** Dashboard / Notification  

## Purpose
Shows **system notifications** — events triggered when challans are sent, accepted, or rejected by parties/contractors.

## Notification List Table

### Table Controls
- **Export** button
- **Search** field
- NO Delete button

### Table Columns
| Column | Description |
|--------|-------------|
| SR. | Serial number (#1, #2, #3...) |
| Action | "Detail" button (gray/teal) |
| Notification | Notification message text |
| From | User who triggered the notification |
| Time | Exact timestamp |

### Sample Data (3 entries)
| SR. | Notification | From | Time |
|-----|-------------|------|------|
| #1 | Chalan No. 5 And Lot No. 4 Rejected By job | job | 2026-05-07 05:46:23 |
| #2 | Chalan No. 4 And Lot No. 3 Sent By job (5 Pieces) | job | 2026-04-30 03:35:18 |
| #3 | Chalan No. 3 And Lot No. 3 Accepted By Mehul | Mehul | 2026-04-30 03:32:05 |

## Notification Types Observed
1. **Rejected** — "Chalan No. X And Lot No. Y Rejected By [user]"
2. **Sent** — "Chalan No. X And Lot No. Y Sent By [user] (N Pieces)"
3. **Accepted** — "Chalan No. X And Lot No. Y Accepted By [user]"

## Notes
- Notifications are system-generated, not user-created
- Triggered by challan lifecycle events (accept/reject/send)
- "Detail" button likely navigates to the relevant challan
- Bell icon in top-right navbar also shows notification count
- Notifications flow both ways: admin sees contractor actions, contractors see admin actions


---

# Stock Master

**URL:** `/Admin/Stock/`  
**Page Title:** Stock  
**Breadcrumb:** Dashboard / Stock  

## Purpose
Tracks **finished stock** — garment pieces that have completed all job work processes and are ready for orders/dispatch.

## Stock List Table

### Table Controls
- **Export** button only
- **Search** field
- NO Add/Delete buttons (stock is generated automatically when lots complete)

### Table Columns
| Column | Description |
|--------|-------------|
| Lot No | Which lot the stock came from |
| Stock Quantity | Number of pieces available |
| Date | When stock was recorded |

### Sample Data (1 entry)
| Lot No | Stock Quantity | Date |
|--------|--------------|------|
| 3 | 5 | 2026-04-30 03:35:48 |

## Notes
- Stock is **auto-generated** when a lot's challan work is completed
- Only 1 stock entry exists — from Lot #3 with 5 pieces
- No manual stock entry — stock comes from completing challans
- Stock is consumed when Orders are created
- Very simple table — just lot reference, quantity, and date
- Lot #3 had Process Qty = 5, Order Qty = 5, Remain = 0 (fully consumed)


---

# Order Master

**URL:** `/Admin/Order/`  
**Page Title:** Order (likely)  
**Breadcrumb:** Dashboard / Order  

## Purpose
Manages **sales orders** — orders placed against available stock. Consumes stock from completed lots.

## Add New Order Form (Collapsible Section)
- **Header:** "Add New Order" (Blue bar with +)
- **Expected Fields:**
  - `Lot No` — Dropdown (select from available lots with remaining quantity)
  - `Order Quantity` — Number input
  - `Party / Customer` — Text or dropdown
  - `Date` — Date picker
- **Button:** Submit

## Order List Table

### Table Controls
- **Export** button
- **Search** field

### Expected Table Columns
| Column | Description |
|--------|-------------|
| Action | View/Edit buttons |
| Order No | Unique order identifier |
| Lot No | Which lot the order draws from |
| Product Name | Product being ordered |
| Color Name | Color variant |
| Quantity | Number of pieces ordered |
| Date | Order date |
| Status | Order status |

## Notes
- Orders are created from Lot Master (Order button) or from this page
- Creates orders against available stock (Remain Quantity in Lot Master)
- When an order is created, it reduces the "Remain Quantity" in Lot Master
- Stock Master quantity is also affected
- Links to Lot Master for inventory tracking


---

# Generate New Chalan (Dashboard Quick Action)

**URL:** `/Admin/New_chalan`  
**Page Title:** New Chalan / Generate New  
**Breadcrumb:** Home / Generate New  

## Purpose
The primary workflow for creating new challans — generates a new production lot and its first challan simultaneously. This is the main entry point for starting new production.

## Form Fields

### Step 1 — Lot & Product Selection
| Field | Type | Description |
|-------|------|-------------|
| Product Name | Dropdown | Select product from Product Master |
| Color Name | Dropdown | Select color (filtered by selected product) |
| Sub Product Name | Dropdown | Select sub-product (if applicable) |
| Process Quantity | Number Input | Total pieces to manufacture |

### Step 2 — Challan Details
| Field | Type | Description |
|-------|------|-------------|
| Party Name | Dropdown | Select contractor to send pieces to |
| Quantity | Number Input | Number of pieces to send in this challan |
| Remark | Text Area | Notes/instructions for the contractor |

### Buttons
- **Generate** / **Submit** — Creates the lot + challan
- **Cancel** — Go back

## Flow
```
Select Product → Select Color → Enter Quantity → 
Select Party → Enter Send Quantity → Submit →
Creates: Lot (new) + Challan (linked to lot)
```

## Notes
- This is the **"New"** card from the Dashboard
- Creates BOTH a new lot AND a challan in one flow
- The lot gets a new Lot No (auto-increment)
- The challan gets a new Chalan No (auto-increment)
- Quantity in challan can be less than lot's total quantity
- Remaining quantity can be sent via additional challans later


---

# Reprocess Chalan (Dashboard Quick Action)

**URL:** `/Admin/New_chalan/Reprocess`  
**Page Title:** Reprocess  
**Breadcrumb:** Home / Reprocess  

## Purpose
Creates a **reprocess challan** — sends pieces back for rework when the initial job work didn't meet quality standards. This creates a new challan linked to an existing lot.

## Form Fields

### Reprocess Form
| Field | Type | Description |
|-------|------|-------------|
| Lot No | Dropdown | Select existing lot to reprocess |
| Party Name | Dropdown | Select contractor for rework |
| Product Name | Auto-filled | Based on selected lot |
| Color Name | Auto-filled | Based on selected lot |
| Quantity | Number Input | Number of pieces to reprocess |
| Remark | Text Area | Reason for reprocessing / instructions |

### Buttons
- **Submit** / **Reprocess** — Creates the reprocess challan
- **Cancel** — Go back

## Flow
```
Select Lot → System shows lot details →
Select Party → Enter Reprocess Quantity → Add Remark →
Submit → Creates new challan marked as "Reprocess"
```

## Notes
- This is the **"Reprocess"** card from the Dashboard
- Does NOT create a new lot — links to an existing one
- Creates a new challan with reprocess flag
- Used when pieces come back defective or incomplete
- The "R.P" button on Chalan Master rows may also link here
- Reprocess quantity should not exceed lot's process quantity


---

# Remark List (Dashboard Quick Action)

**URL:** `/Admin/Remark_list`  
**Page Title:** Remark List  
**Breadcrumb:** Dashboard / Remark List  

## Purpose
Shows all **remarks/notes** added to challans. Provides a centralized view of all communications and notes attached to production challans.

## Remark List Table

### Table Controls
- **Export** button
- **Search** field

### Expected Table Columns
| Column | Description |
|--------|-------------|
| SR. | Serial number |
| Chalan No | Which challan the remark belongs to |
| Lot No | Associated lot |
| Remark | The remark text |
| Added By | User who added the remark |
| Date/Time | When the remark was added |

## Notes
- This is the **"Remark"** card from the Dashboard
- Remarks are added via the "Remark" button on Chalan Master rows
- Provides a consolidated view across all challans
- Useful for tracking quality issues, special instructions, and communication


---

# Data Model & Entity Relationships

## Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│  Type Master │       │ Product      │       │ Color Master │
│──────────────│       │ Master       │       │──────────────│
│ type_name    │       │──────────────│   ┌──▶│ color_name   │
│              │       │ product_name │───┘   │ product_id   │
│              │       │ hsn_code     │       │ date         │
│              │       │ design_no    │       └──────────────┘
└──────┬───────┘       └──────┬───────┘
       │                      │
       │                      ▼
       │               ┌──────────────┐
       │               │ Sub Product  │
       │               │ Master       │
       │               │──────────────│
       │               │ sub_product  │
       │               │ product_id   │
       │               └──────────────┘
       │
       ▼
┌──────────────┐       ┌──────────────┐
│ User Master  │       │ Party Master │
│──────────────│       │──────────────│
│ party_name   │       │ party_name   │
│ address      │       └──────┬───────┘
│ mobile_no    │              │
│ gstin        │              │
│ type_id  ────┘              │
│ login_name   │              │
│ login_pass   │              │
└──────────────┘              │
                              │
       ┌──────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────┐
│                   LOT MASTER                      │
│──────────────────────────────────────────────────│
│ lot_no (PK, auto)                                │
│ user_name          (who created)                 │
│ total_chalan       (count of challans)           │
│ design_no          (FK → Product)                │
│ process_quantity   (total pieces)                │
│ order_quantity     (pieces ordered)              │
│ remain_quantity    (process - order)             │
│ date                                             │
└───────────────────────┬──────────────────────────┘
                        │
                        │ 1:N
                        ▼
┌──────────────────────────────────────────────────┐
│                  CHALAN MASTER                    │
│──────────────────────────────────────────────────│
│ chalan_no (PK, auto)                             │
│ lot_no           (FK → Lot)                      │
│ date                                             │
│ generated_by     (user who created)              │
│ party_name       (FK → Party/User)               │
│ product_name     (FK → Product)                  │
│ sub_product_name (FK → Sub Product, optional)    │
│ color_name       (FK → Color)                    │
│ quantity         (pieces sent)                   │
│ remain_quantity                                  │
│ type             (new / reprocess / alter)       │
└───────────────────────┬──────────────────────────┘
                        │
              ┌─────────┼─────────┐
              │         │         │
              ▼         ▼         ▼
        ┌──────────┐ ┌──────┐ ┌──────────────┐
        │ Remark   │ │Stock │ │ Notification │
        │ List     │ │Master│ │──────────────│
        │──────────│ │──────│ │ sr_no        │
        │chalan_no │ │lot_no│ │ notification │
        │ remark   │ │qty   │ │ from_user    │
        │ user     │ │date  │ │ time         │
        │ date     │ └──────┘ └──────────────┘
        └──────────┘
                              
              ┌──────────────┐
              │ Alter List   │
              │──────────────│
              │ alter details│
              │ lot_no       │
              │ chalan_no    │
              │ quantity     │
              │ status       │
              └──────────────┘

              ┌──────────────┐
              │ Order Master │
              │──────────────│
              │ order_no     │
              │ lot_no       │
              │ quantity     │
              │ date         │
              └──────────────┘

              ┌──────────────┐
              │ Media Master │
              │──────────────│
              │ image        │
              │ copy_link    │
              └──────────────┘
```

## Key Relationships

| From | To | Relationship | Description |
|------|----|-------------|-------------|
| Type Master | User Master | 1:N | One type can have many users |
| Product Master | Color Master | 1:N | One product has many colors |
| Product Master | Sub Product Master | 1:N | One product has many sub-products |
| Lot Master | Chalan Master | 1:N | One lot has many challans |
| Chalan Master | Remark List | 1:N | One challan has many remarks |
| Chalan Master | Notification | 1:N | One challan generates many notifications |
| Lot Master | Stock Master | 1:1 | One lot produces one stock entry |
| Lot Master | Order Master | 1:N | One lot can have many orders |
| Lot Master | Alter List | 1:N | One lot can have many alterations |


---

# Business Flow & Process Lifecycle

## Complete Manufacturing Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    MASTER DATA SETUP                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │  Types   │ │ Products │ │  Colors  │ │ Parties  │          │
│  │(EMB,STH) │ │(ABC001)  │ │(Red,Blue)│ │(Contrac.)│          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: CREATE LOT (via Dashboard → Generate New)             │
│                                                                 │
│  Admin selects: Product + Color + Total Quantity                │
│  System creates: Lot #4 with Process Qty = 100                  │
│                                                                 │
│  Example: Lot #4, Product ABC001, Red, 100 pieces              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 2: GENERATE CHALLAN (same flow)                           │
│                                                                 │
│  Admin selects: Party + Quantity to send                        │
│  System creates: Challan #5 linked to Lot #4                    │
│                                                                 │
│  Example: Send 50 pcs to "richa" (Embroidery)                  │
│  → Notification sent to richa                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 3: PARTY RECEIVES CHALLAN                                 │
│                                                                 │
│  Party logs in → sees challan → ACCEPTS or REJECTS              │
│                                                                 │
│  Accept: "Chalan No. 5 And Lot No. 4 Accepted By richa"       │
│  Reject: "Chalan No. 5 And Lot No. 4 Rejected By richa"       │
│  → Notification sent to admin                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┼─────────┐
                    ▼                   ▼
            ┌──────────────┐    ┌──────────────┐
            │  ACCEPTED    │    │  REJECTED    │
            │              │    │              │
            │ Party does   │    │ Admin can:   │
            │ the work     │    │ - Remark     │
            │              │    │ - Edit       │
            │ Sends back   │    │ - Resend     │
            │ completed    │    │              │
            │ pieces       │    └──────────────┘
            └──────┬───────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 4: WORK COMPLETION                                        │
│                                                                 │
│  Party sends back pieces: "Sent By job (50 Pieces)"            │
│  → Notification sent to admin                                   │
│  → Stock Master updated (50 pieces available)                   │
│                                                                 │
│  If quality issues: REPROCESS (send back for rework)            │
│  If modifications needed: ALTER                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┼─────────┐
                    ▼         ▼         ▼
            ┌──────────┐ ┌────────┐ ┌────────┐
            │ COMPLETE │ │REPROCESS│ │ ALTER │
            │          │ │         │ │        │
            │Stock +=50│ │New chalan│ │Alter  │
            │          │ │for rework│ │request│
            └──────┬───┘ └─────────┘ └────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 5: ORDER FULFILLMENT                                      │
│                                                                 │
│  From Lot Master → Order button                                 │
│  Or from Order Master → Add New Order                           │
│                                                                 │
│  Select lot → Enter order quantity                              │
│  Lot.remain_quantity -= order_qty                               │
│  Lot.order_quantity += order_qty                                │
│                                                                 │
│  Example: Lot #3, ordered 5 of 5 → Remain = 0                 │
└─────────────────────────────────────────────────────────────────┘
```

## Challan States / Lifecycle

```
NEW → SENT TO PARTY → ACCEPTED/REJECTED → 
WORK IN PROGRESS → PIECES SENT BACK → 
STOCK CREATED → ORDER → COMPLETE
                    └→ REPROCESS → RE-SENT
                    └→ ALTER → ALTERED
```

## User Roles

| Role | Can Do | Login |
|------|--------|-------|
| **Admin** | Everything — create lots, challans, manage all masters, view reports | Yes (admin/123456) |
| **EMB (Embroidery)** | Receive challans, accept/reject, send back pieces | Yes (own credentials) |
| **STITCHING** | Receive challans, accept/reject, send back pieces | Yes (own credentials) |
| **HANDWORK** | Receive challans, accept/reject, send back pieces | Yes (own credentials) |
| **MOTI** | Receive challans, accept/reject, send back pieces | Yes (own credentials) |
| **Sub Admin** | Likely limited admin capabilities | Yes (own credentials) |

## LogOut vs LogOut All
- **LogOut** — Logs out current session only
- **LogOut All** — Logs out ALL sessions (force disconnect all users)


---

# UI/UX & Technical Notes

## Framework & Technology
- **Frontend Template:** AdminLTE (Bootstrap 3/4 based admin template)
- **Backend:** CodeIgniter (PHP MVC framework)
- **Database:** Likely MySQL
- **Copyright:** Fepic © 2014-2019
- **Developer:** Siliconleaf

## Common UI Patterns Across All Pages

### Page Layout Template
```
┌──────────────────────────────────────────────────────┐
│ Top Navbar: AdminLTE Logo | ☰ Toggle | 🔔 Bell      │
├──────────┬───────────────────────────────────────────┤
│          │  Page Title           Breadcrumb ▸ Path   │
│  Sidebar │  ┌────────────────────────────────────┐   │
│          │  │ Add New [Entity]         [+]       │   │
│ Dashboard│  │ (Collapsible Blue Bar)             │   │
│ All Master│ │ Form Fields (when expanded)        │   │
│ Lot Master│ └────────────────────────────────────┘   │
│ Chalan   │  ┌────────────────────────────────────┐   │
│ Alter    │  │ [Entity] List                      │   │
│ Notif    │  │ (Blue Bar Header)                  │   │
│ Stock    │  │ [Delete] [PDF] [Export]  Search:□  │   │
│ Order    │  │ ┌─────────────────────────────┐    │   │
│ LogOut   │  │ │ Table with data             │    │   │
│ LogOut All│ │ │ ...                         │    │   │
│          │  │ │ Showing 1 to N of N entries │    │   │
│          │  │ └─────────────────────────────┘    │   │
│          │  │ [Previous] [1] [Next]              │   │
│          │  └────────────────────────────────────┘   │
│  user    │                                           │
├──────────┴───────────────────────────────────────────┤
│ Footer: Copyright © 2014-2019 Fepic.      Siliconleaf│
└──────────────────────────────────────────────────────┘
```

### Consistent Elements
1. **Collapsible Add Form** — Blue header bar with + icon, click to expand/collapse
2. **Data Table** — Blue header bar, Delete (red), Export buttons, Search box
3. **Action Buttons per Row** — Edit (✏️ icon), sometimes View/Remark/R.P
4. **Pagination** — "Showing X to Y of Z entries" + Previous/Next buttons
5. **Checkbox Column** — First column for bulk selection → bulk delete
6. **Breadcrumbs** — Top right corner showing navigation path

### Color Scheme
| Element | Color | Hex (approx) |
|---------|-------|------|
| Primary / Headers | Blue | `#007bff` |
| Success / Accept | Green/Teal | `#28a745` / `#17a2b8` |
| Danger / Delete | Red | `#dc3545` |
| Warning / Alter | Yellow/Amber | `#ffc107` |
| Dashboard Cards | Teal/Cyan | `#17a2b8` |
| Sidebar Active | Blue | `#007bff` |
| Sidebar Background | Dark Gray | `#343a40` |

### Button Styles
| Button | Background | Text | Used For |
|--------|-----------|------|----------|
| Delete | Red (#dc3545) | White | Bulk delete selected rows |
| Export | White/Default | Dark | Export table data |
| PDF | White/Default | Dark | Generate PDF |
| Edit (✏️) | Light Blue outline | Blue icon | Edit single row |
| View Detail | Gray | Dark | View details |
| Remark | Brown/Warning | White | Add remark |
| R.P | Blue/Info | White | Reprocess |
| ALTER | Yellow | Dark | Create alteration |
| Complete | Green | White | Mark as complete |
| Order | Teal | White | Create order |

## Observations
- No responsive design considerations visible
- Tables are horizontally scrollable when content overflows
- No dark mode option
- No multi-language support
- Financial year filter (2026-2027) only on Dashboard
- Passwords stored in plain text (security concern)
- No user profile editing page visible


---

