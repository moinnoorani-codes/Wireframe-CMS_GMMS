# ERP v7 Wireframe — Session Context

## Project
Single-file JSX wireframe at `src/App.jsx` served by Vite at port 5173.
Spec: `docs/superpowers/specs/2026-05-08-combined-erp-v7-design.md`
Screen map: `.superpowers/brainstorm/21-1778255257/content/screen-map-v2.html`

## Critical File Notes
- **Never use the Edit tool** on App.jsx — it converts ASCII quotes to Unicode curly quotes (U+201C/U+201D) which break OXC parsing.
- **Always use PowerShell WriteAllLines** with `New-Object System.Text.UTF8Encoding $false` (no BOM).
- **Always use ReadAllLines** (not `-split "\n"`) to avoid \r\n doubling.
- Write new screen content to temp `.txt` files, then splice with PowerShell array logic.
- After any splice, run `npx vite build --mode development` to verify compilation.
- **When splicing a replacement**: `$before` must end at the line BEFORE the first line of the existing block.
- **Never search by content strings that appear in JSX** (e.g. ERP names, screen titles) — always search by structural markers (`const screenGroups`, exact comment lines, `"SCREEN-ID":` keys).

## Encoding Context
The original file uses "doubly-encoded cp1252" — emoji/symbols stored as individual cp1252 Unicode chars. The remaining doubly-encoded chars (like `â—‰`, `â†"`, `â—‹`) in navigation and UI labels are original content — do NOT attempt to mass-replace them.
- Always use `\uXXXX` or `{"\u{XXXXX}"}` escapes for any non-ASCII in new code.
- Use `{"\u{XXXXX}"}` wrapper when placing supplementary-plane emoji in JSX text context.

## Recovery History (2026-05-11)
App.jsx was corrupted (3,466 lines) due to a bad regex deleting G-01 through G-11 + truncating G-12 + orphaning screenGroups. Full 5-phase recovery completed same day. File restored to ~5,205 lines, building cleanly.

## All Tasks Complete + Recovery Complete ✅

### Task 1 — Rebrand ✅
- All `HOOR TEX` / `Hoor Tex` / `hoortex` → `CMS`
- Emails `@hoortex.com` → `@cms.com`

### Task 2 — Infrastructure ✅
- `MFG_MENU` fully rewritten with Masters, Notifications, Reports, Contractor Mobile sections
- `screenGroups` rebuilt with all 4 platforms and correct screen IDs
- `screenLabels` updated (added G-13–G-21, M-G01–M-G06; removed G-11)
- `GMMS_IDS` expanded
- `SALES_MENU` Orders line fixed (Create Order - Retail / Wholesale)

### Task 3 — G-12 Production Dashboard ✅
- Quick-action cards added: New (→G-02), Reprocess (→G-13), RF/Alter (→G-20), Remarks (→G-18)

### Task 4 — W-03 Main Dashboard ✅
- ERP mode toggle conditionally renders Sales OR Manufacturing widgets
- Manufacturing mode: 5 KPI tiles, Stage Distribution chips, Overdue Challan table, Contractor Leaderboard

### Task 5 — W-04 SKU List ✅
- Added Source column (GMMS orange tag / External gray tag)
- Added Source filter tabs (All / GMMS / External)

### Task 6 — W-05 Create/Price SKU — Dual Mode ✅
- Mode A (GMMS): locked pre-filled fields, pricing-only entry, GMMS Origin read-only card
- Mode B (External): full manual form unchanged

### Task 7 — W-06 SKU Detail ✅
- `isGmms` state (default true for demo)
- GMMS Origin card in left sidebar: Design No., Challan No., Production Date, Pieces Outward, Stages

### Task 8 — W-30 User Management ✅
- Super Admin note banner added above user rows
- Cross-ERP column added to user table
- `crossErp` field: "Both" for Abdul Kadir / Mohammad Ali; "Sales" for others

### Task 9 — W-30A Role Permissions ✅
- ERP Cross-Access module already present and correct

### Task 10 — G-02 Create Challan (MOD) ✅
- Design No. prefill + History popup + Prefill button
- Fabric Table with 10 columns; Quick-add Contractor sidebar; Quick-add Job Type button

### Task 11 — G-03 Challan Tracking (MOD) ✅
- "Reprocess → G-13" added to GTopBar actions; encoding fixes applied

### Task 12 — G-04 Contractor List (MOD) ✅
- Add Contractor modal with all fields; "+ Add Contractor" button in filter bar

### Task 13 — Remove G-11 ✅
- G-11 stubbed with "Content moved to G-14" message

### Task 14 — G-13 Reprocess Challan (NEW) ✅
### Task 15 — G-14 Design Master (NEW) ✅
### Task 16 — G-15 Job Work Types (NEW) ✅
### Task 17 — G-16 Color Master (NEW) ✅
### Task 18 — G-17 Contractor Registry (NEW) ✅
### Task 19 — G-18 Notifications Center (NEW) ✅
### Task 20 — G-19 GMMS Reports Hub (NEW) ✅
### Task 21 — G-20 RF Creation (NEW) ✅
### Task 22 — G-21 SKU Outward (NEW) ✅
### Task 23 — M-G01 through M-G06 Contractor Mobile (NEW × 6) ✅
- MBottomNav updated with `type` prop: `type="gmms"` shows Challans/Payments/Profile (3 tabs)
- M-G02: `active="Challans" type="gmms"` | M-G05: `active="Payments" type="gmms"` | M-G06: `active="Profile" type="gmms"`
- M-G01 (Login): no bottom nav

### Recovered Screens (Phase 2) ✅
- G-01 Challan List, G-05 Contractor Detail, G-06 Ready Piece Count, G-07 Payment & Checking
- G-08 RF Management, G-09 Mill / Fabric Management, G-10 Design Costing (Owner Only), G-11 Stub

---

## File State (2026-05-11)
- App.jsx: ~5,205 lines, building cleanly
- All 23 tasks + recovery complete
- Temp files in src/: _g02.txt, _g03.txt, _g04.txt, _new_screens.txt, _mfg_widgets.txt, _w04.txt, _w05.txt, _g12_fix.txt, _g_originals.txt (safe to delete)

---

## PowerShell Splice Pattern (use every time)
```powershell
$path = "D:\Wireframe CMS_GMMS\erp-preview\src\App.jsx"
$lines = [System.IO.File]::ReadAllLines($path, [System.Text.Encoding]::UTF8)
$new = [System.IO.File]::ReadAllLines("D:\...\src\_tempfile.txt", [System.Text.Encoding]::UTF8)
$before = $lines[0..<startIndex-1>]
$after = $lines[<endIndex+1>..($lines.Length-1)]
$result = [System.Collections.Generic.List[string]]::new()
$result.AddRange([string[]]$before)
$result.AddRange([string[]]$new)
$result.AddRange([string[]]$after)
[System.IO.File]::WriteAllLines($path, $result.ToArray(), (New-Object System.Text.UTF8Encoding $false))
```
