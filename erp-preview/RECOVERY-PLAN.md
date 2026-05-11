# ERP v7 Wireframe - Recovery Plan

**Created:** 2026-05-11
**Problem:** App.jsx was corrupted during an infrastructure splice. A bad regex matched "Manufacturing ERP" inside G-12's JSX content instead of the screenGroups config, deleting ~870 lines (G-01 through G-11 + part of G-12 + part of screenGroups).

---

## Current File State

| Metric | Value |
|--------|-------|
| Total lines | 3,466 |
| Screens present | 61 (all W-*, M-*, P-01, partial G-12) |
| Screens missing | G-01 through G-11 (11 screens) |
| G-12 | TRUNCATED at line 3315 (only header/toggle, rest gone) |
| screenGroups | MISSING (`const screenGroups` not found - orphaned lines exist inline) |
| Rebrand | Mostly done (1 leftover HOOR TEX reference) |
| Encoding fixes | Mostly done (17 lines still have broken patterns) |

---

## What Exists and What's Lost

### SURVIVED (61 screens)
All Sales ERP (W-01 through W-39), all Sales Mobile (M-01 through M-20), P-01.
These are the ORIGINAL versions - not yet modified for tasks 3-9.

### LOST - Have Temp Files (can splice back)
| Screen | Temp File | Lines | Status |
|--------|-----------|-------|--------|
| G-02 (Create Challan MOD) | `_g02.txt` | 171 | Task 10 complete |
| G-03 (Challan Tracking MOD) | `_g03.txt` | 72 | Task 11 complete |
| G-04 (Contractor List MOD) | `_g04.txt` | 84 | Task 12 complete |
| G-13 through G-21 + M-G01 through M-G06 | `_new_screens.txt` | 861 | Tasks 14-23 complete |

### LOST - Have Spec (must recreate from spec)
| Screen | Spec Section | What was in it |
|--------|-------------|----------------|
| G-01 (Challan List) | Original wireframe | Table of challans with flow column, filters, actions |
| G-05 (Contractor Detail) | Original wireframe | Single contractor view with stats, active challans |
| G-06 (Ready Piece Count) | Original wireframe | Piece confirmation per challan stage |
| G-07 (Payment & Checking) | Original wireframe | Payment records for contractors |
| G-08 (RF Management) | Original wireframe | Return fabric list with filters |
| G-09 (Mill / Fabric Management) | Original wireframe | Fabric roll inventory, mill tracking |
| G-10 (Design Costing) | Original wireframe | Owner-only costing with BOM, margins |
| G-12 (Production Dashboard) | Spec section 4 (G-12) | Quick-action cards + KPIs + overdue table + leaderboard |

### LOST - Trivial (stub only)
| Screen | What's needed |
|--------|--------------|
| G-11 | 7-line stub: "Content moved to G-14" message |

### NOT YET APPLIED (modifications to surviving screens)
These tasks modified W-* screens that survived but are still in ORIGINAL form:

| Task | Screen | What to do | Temp File? |
|------|--------|-----------|------------|
| Task 4 | W-03 Main Dashboard | Add MFG toggle + manufacturing widgets | `_mfg_widgets.txt` (117 lines) |
| Task 5 | W-04 SKU List | Add Source column + GMMS/External tabs | `_w04.txt` (39 lines) |
| Task 6 | W-05 Create/Price SKU | Add GMMS/External mode toggle | `_w05.txt` (134 lines) |
| Task 7 | W-06 SKU Detail | Add GMMS Origin card in sidebar | NO temp file |
| Task 8 | W-30 User Management | Add Super Admin row + Cross-ERP column | NO temp file |

### INFRASTRUCTURE (partially done, needs cleanup)
| Item | Status |
|------|--------|
| Rebrand (HOOR TEX -> CMS) | 99% done (1 leftover) |
| Encoding fixes | 95% done (17 lines remain) |
| MFG_MENU | Rewritten (in file now) |
| SALES_MENU Orders line fix | Done |
| screenGroups | BROKEN - orphaned lines inside G-12, `const screenGroups` missing |
| screenLabels | Partially updated (has new G/M-G labels) |
| GMMS_IDS | Updated |
| MBottomNav contractor fix | Not yet applied |

---

## Recovery Steps (in order)

### Phase 1: Fix File Structure (Critical)
**Goal:** Get the file building again with correct structure.

**Step 1.1 - Fix G-12 + screenGroups corruption**
- Line 3315 onward: G-12 is truncated, followed by orphaned screenGroups data
- DELETE lines 3316 through the orphaned `];` (around line 3354)
- REBUILD complete G-12 screen from spec (quick-action cards + KPIs + toggle)
- REBUILD `const screenGroups = [...]` as a proper standalone block
- Insert both BEFORE screenLabels (currently at line 3356)

**Step 1.2 - Fix remaining encoding + rebrand**
- Fix last HOOR TEX reference
- Fix remaining 17 lines with broken encoding patterns

**Step 1.3 - Verify build**
- Run `npx vite build --mode development`
- Must pass before continuing

---

### Phase 2: Recreate Lost GMMS Screens (G-01, G-05 through G-10)
**Goal:** Rebuild the 8 original GMMS screens that have no temp files.

Each screen should follow the existing wireframe patterns (GTopBar header, WebLayout wrapper, mock data tables).

**Step 2.1 - G-01 Challan List**
- Table: Challan No, Design No, Design Name, Party, Total Pcs, Flow (stage chips), Status, Date, Actions
- Filters: search, status dropdown, date range
- GTopBar with "Create Challan" primary action

**Step 2.2 - G-05 Contractor Detail**
- Single contractor view: header with name/code/type
- Stats row: Active Challans, Avg Turnaround, Rejection Rate
- Active Challans table
- Payment History section
- Notes section

**Step 2.3 - G-06 Ready Piece Count**
- Table of challans at final stage pending piece count
- Per-challan: colour breakdown with expected vs actual count inputs
- Confirm & close challan action

**Step 2.4 - G-07 Payment & Checking**
- Payment records table: Challan, Contractor, Amount, Status, Date
- Summary: total paid, pending, disputed
- Create Payment button + modal

**Step 2.5 - G-08 RF Management**
- RF (Return Fabric) list table: RF No, Challan, Design, Type, Status, Date
- Filters: RF type, status, date range

**Step 2.6 - G-09 Mill / Fabric Management**
- Fabric inventory table: Roll No, Fabric Type, Width, GSM, Length, Mill, Status
- Add Roll button + modal
- Mill summary sidebar

**Step 2.7 - G-10 Design Costing (Owner Only)**
- Design selector
- BOM (Bill of Materials) table: fabric, job work stages, overheads
- Cost summary: total cost, margin %, selling price
- OWNER ONLY badge in header

**Step 2.8 - G-11 Stub**
- 7 lines: just a message "Content moved to G-14 Design Master"

**Step 2.9 - Write all 8 screens to `_g_originals.txt` temp file, splice into App.jsx**
- Insert after G-12 (which should end around line 3400ish after Phase 1 fix)
- Verify build

---

### Phase 3: Splice Back Temp Files
**Goal:** Re-insert all the modified/new screens from existing temp files.

**Step 3.1 - Replace G-02 with `_g02.txt`** (171 lines)
- Find current G-02 location (currently MISSING - was deleted)
- Actually G-02 was part of the deleted block, so INSERT after G-01

**Step 3.2 - Replace G-03 with `_g03.txt`** (72 lines)

**Step 3.3 - Replace G-04 with `_g04.txt`** (84 lines)

**Step 3.4 - Insert `_new_screens.txt`** (861 lines)
- Contains G-13 through G-21 + M-G01 through M-G06
- Insert before the closing `};` of the screens object

**Step 3.5 - Verify build**

---

### Phase 4: Apply W-Screen Modifications
**Goal:** Apply the pending modifications to Sales ERP screens.

**Step 4.1 - W-03 Main Dashboard (Task 4)**
- Replace W-03 with version that has ERP mode toggle
- Manufacturing mode: use `_mfg_widgets.txt` content (KPI tiles, stage chips, overdue table, leaderboard)

**Step 4.2 - W-04 SKU List (Task 5)**
- Replace W-04 with `_w04.txt` (39 lines)
- Adds Source column (GMMS/External tags) + filter tabs

**Step 4.3 - W-05 Create/Price SKU (Task 6)**
- Replace W-05 with `_w05.txt` (134 lines)
- Adds GMMS/External mode toggle

**Step 4.4 - W-06 SKU Detail (Task 7)**
- Modify W-06: add `isGmms` state + GMMS Origin card in sidebar
- No temp file - must recreate from CLAUDE.md task description

**Step 4.5 - W-30 User Management (Task 8)**
- Modify W-30: add Super Admin role, Cross-ERP column
- No temp file - must recreate from CLAUDE.md task description

**Step 4.6 - Verify build**

---

### Phase 5: Polish
**Goal:** Final fixes and verification.

**Step 5.1 - MBottomNav fix for contractor mobile screens**
- Add `type` prop to MBottomNav
- GMMS type shows: Challans / Payments / Profile (3 tabs)
- Default shows: Home / Scan / Orders / Menu / Profile (5 tabs)
- M-G01 (Login): no bottom nav
- M-G02: active="Challans" type="gmms"
- M-G05: active="Payments" type="gmms"
- M-G06: active="Profile" type="gmms"

**Step 5.2 - Final encoding sweep**
- Check for any remaining broken encoding patterns
- Fix any leftover `\uXXXX` in JSX text content (replace with actual Unicode)

**Step 5.3 - Full build + visual verification**
- `npx vite build --mode development`
- Check every mobile screen (M-G01 through M-G06)
- Check G-12 dashboard, G-01 list, G-02 create
- Check W-03 with MFG toggle

**Step 5.4 - Update CLAUDE.md**
- Record the recovery and current file state

---

## Critical Rules (from CLAUDE.md)

1. **Never use the Edit tool** on App.jsx - converts quotes to Unicode curly quotes
2. **Always use PowerShell WriteAllLines** with `New-Object System.Text.UTF8Encoding $false`
3. **Always use ReadAllLines** (not `-split "\n"`) to avoid \r\n doubling
4. Write new screen content to temp `.txt` files, then splice with PowerShell array logic
5. After any splice, run `npx vite build --mode development` to verify
6. **When splicing**: `$before` must end at the line BEFORE the first line of the new block
7. **When searching for splice targets**: use EXACT line matching, never regex on screen content that could match multiple places

## Lesson Learned
The corruption happened because a regex search for `Manufacturing ERP` matched inside G-12's JSX content (the ERP toggle label) instead of the screenGroups config section. **Always search by structural markers** (like `const screenGroups`, exact line content with `===`) rather than content strings that could appear anywhere in JSX.

---

## Estimated Effort
| Phase | Effort |
|-------|--------|
| Phase 1: Fix structure | ~15 min |
| Phase 2: Recreate 8 screens | ~30 min |
| Phase 3: Splice temp files | ~10 min |
| Phase 4: W-screen mods | ~20 min |
| Phase 5: Polish | ~10 min |
| **Total** | **~85 min** |
