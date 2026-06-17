export const FLOWS = [
  // ─── Sales ERP ─────────────────────────────────────────────────
  {
    id: "auth",
    name: "Authentication",
    erp: "sales",
    description: "User login and password recovery",
    steps: [
      { screen: "W-01", label: "Login", role: "All Users", desc: "Sign in with email and password" },
      { screen: "W-02", label: "Forgot Password", role: "All Users", desc: "Reset password via email link" },
    ],
  },
  {
    id: "order-retail",
    name: "Order Lifecycle (Retail)",
    erp: "sales",
    description: "End-to-end retail order from creation to reconciliation",
    steps: [
      { screen: "W-03", label: "Dashboard", role: "Sales Team", desc: "Navigate to orders section" },
      { screen: "W-16R", label: "Create Order (Retail)", role: "Salesperson", desc: "Fill customer details and items" },
      { screen: "W-14", label: "Order List", role: "Salesperson", desc: "Review and manage all orders" },
      { screen: "W-15", label: "Order Detail", role: "Salesperson/Accounts", desc: "View items, record payments, manage status" },
      { screen: "W-36", label: "Daily Reconciliation", role: "Admin/Accounts", desc: "End-of-day reconciliation" },
    ],
  },
  {
    id: "order-wholesale",
    name: "Order Lifecycle (Wholesale)",
    erp: "sales",
    description: "End-to-end wholesale order with approval queue",
    steps: [
      { screen: "W-03", label: "Dashboard", role: "Sales Team", desc: "Navigate to wholesale orders" },
      { screen: "W-16W", label: "Create Order (Wholesale)", role: "Salesperson", desc: "Create bulk wholesale order" },
      { screen: "W-34", label: "Wholesale Queue", role: "Manager", desc: "Approve/reject queued orders" },
      { screen: "W-14", label: "Order List", role: "Salesperson", desc: "Review approved orders" },
      { screen: "W-15", label: "Order Detail", role: "Salesperson/Accounts", desc: "Manage order and payments" },
      { screen: "W-17", label: "LR Console", role: "Godown Staff", desc: "Generate dispatch LR" },
      { screen: "W-18", label: "LR Detail", role: "Godown Staff", desc: "Confirm dispatch" },
      { screen: "W-36", label: "Daily Reconciliation", role: "Admin", desc: "Reconcile daily transactions" },
    ],
  },
  {
    id: "sku-management",
    name: "SKU Management",
    erp: "sales",
    description: "Create, price, and manage product SKUs",
    steps: [
      { screen: "W-03", label: "Dashboard", role: "Sales Team", desc: "Navigate to products" },
      { screen: "W-04", label: "SKU List", role: "Sales Team", desc: "Browse all SKUs with GMMS/External filter" },
      { screen: "W-05", label: "Create / Edit SKU", role: "Manager/Admin", desc: "Create new SKU or set pricing" },
      { screen: "W-06", label: "SKU Detail", role: "Sales Team", desc: "View full SKU with GMMS origin card" },
      { screen: "W-07", label: "Label & Barcode Print", role: "Godown Staff", desc: "Print labels and barcodes" },
    ],
  },
  {
    id: "inventory",
    name: "Inventory Management",
    erp: "sales",
    description: "Monitor stock levels and alerts",
    steps: [
      { screen: "W-03", label: "Dashboard", role: "All", desc: "Navigate to inventory" },
      { screen: "W-09", label: "Live Inventory", role: "Godown Staff", desc: "View real-time stock levels" },
      { screen: "W-13", label: "Stock Alert Center", role: "Manager/Admin", desc: "Handle low-stock alerts" },
    ],
  },
  {
    id: "customer",
    name: "Customer Management",
    erp: "sales",
    description: "Manage customer master data",
    steps: [
      { screen: "W-31", label: "Customer Master", role: "Sales Team", desc: "Browse and search customers" },
      { screen: "W-35", label: "Create / Edit Customer", role: "Salesperson/Admin", desc: "Add or update customer details" },
    ],
  },
  {
    id: "admin-setup",
    name: "Admin & Security",
    erp: "sales",
    description: "User roles, permissions, and system configuration",
    steps: [
      { screen: "W-30", label: "User Management", role: "Super Admin", desc: "Manage users and cross-ERP access" },
      { screen: "W-30A", label: "Role Permissions", role: "Super Admin", desc: "Configure role-based access" },
      { screen: "W-32", label: "System Settings", role: "Super Admin", desc: "Configure system preferences" },
      { screen: "W-33", label: "Audit Trail", role: "Super Admin", desc: "Review system activity logs" },
    ],
  },
  {
    id: "reports",
    name: "Reports & Analytics",
    erp: "sales",
    description: "Generate and review business reports",
    steps: [
      { screen: "W-23", label: "Reports Hub", role: "Manager/Admin", desc: "Select report type" },
      { screen: "W-24", label: "Sales Report", role: "Manager", desc: "View sales performance" },
      { screen: "W-25", label: "Ageing Report", role: "Accounts", desc: "View outstanding ageing" },
      { screen: "W-26", label: "Top Designs", role: "Manager", desc: "Best-selling designs" },
      { screen: "W-27", label: "Customer History", role: "Sales Team", desc: "Customer purchase history" },
    ],
  },
  {
    id: "sms",
    name: "SMS Communication",
    erp: "sales",
    description: "Send and track SMS communications",
    steps: [
      { screen: "W-28", label: "SMS Log", role: "Sales Team", desc: "View sent SMS history" },
      { screen: "W-29", label: "SMS Templates", role: "Manager/Admin", desc: "Manage SMS message templates" },
    ],
  },
  {
    id: "cctv",
    name: "CCTV Monitoring",
    erp: "sales",
    description: "Monitor and review CCTV footage",
    steps: [
      { screen: "W-21", label: "CCTV Console", role: "Godown Staff/Admin", desc: "View live feeds and recordings" },
      { screen: "W-22", label: "Video Playback", role: "Admin", desc: "Playback recorded footage" },
    ],
  },

  // ─── Manufacturing ERP ──────────────────────────────────────────
  {
    id: "mfg-challan",
    name: "Challan Lifecycle",
    erp: "mfg",
    description: "End-to-end challan from creation to payment",
    steps: [
      { screen: "G-12", label: "Production Dashboard", role: "Owner/Manager", desc: "Overview of all production activity" },
      { screen: "G-23", label: "Traditional Challan Entry", role: "Production Manager", desc: "Issue new job challan to contractor (paper challan style)" },
      { screen: "G-01", label: "Challan List", role: "All", desc: "View all active challans" },
      { screen: "G-03", label: "Challan Tracking", role: "All", desc: "Track challan progress by design" },
      { screen: "G-06", label: "Ready Piece Count", role: "Production Staff", desc: "Record completed pieces" },
      { screen: "G-07", label: "Payment & Checking", role: "Owner/Accounts", desc: "QC check and process payment" },
    ],
  },
  {
    id: "mfg-reprocess",
    name: "Reprocess",
    erp: "mfg",
    description: "Start a new process for returned material — change job type & contractor, carry over items",
    steps: [
      { screen: "G-12", label: "Production Dashboard", role: "Manager", desc: "Navigate to reprocess" },
      { screen: "G-13", label: "Reprocess Challan", role: "Production Manager", desc: "Carry over items, change job type & contractor" },
    ],
  },
  {
    id: "mfg-rf",
    name: "RF / Returns",
    erp: "mfg",
    description: "Mark received short/defect pieces — raise and track rejection/return to fabric mill",
    steps: [
      { screen: "G-12", label: "Production Dashboard", role: "Manager", desc: "Navigate to RF" },
      { screen: "G-20", label: "Create RF Entry", role: "Production Manager", desc: "Log rejection/return to fabric mill" },
      { screen: "G-08", label: "RF Management", role: "Production Manager", desc: "Track all rejection/return requests" },
    ],
  },
  {
    id: "mfg-contractor",
    name: "Contractor Management",
    erp: "mfg",
    description: "Manage contractors and their payments",
    steps: [
      { screen: "G-04", label: "Contractor List", role: "Production Manager", desc: "View all contractors" },
      { screen: "G-05", label: "Contractor Detail", role: "Production Manager", desc: "Detailed contractor ledger and history" },
      { screen: "G-07", label: "Payment & Checking", role: "Owner/Accounts", desc: "Process contractor payments" },
    ],
  },
  {
    id: "mfg-sku-outward",
    name: "SKU Outward to Sales (Cross-ERP)",
    erp: "cross",
    description: "Manufactured SKU flows into Sales ERP inventory",
    steps: [
      { screen: "G-21", label: "SKU Outward", role: "GMMS Staff", desc: "Push finished goods as SKUs to Sales", crossErp: "mfg" },
      { screen: "W-04", label: "SKU List (CMS)", role: "Sales Staff", desc: "GMMS-sourced SKUs appear with orange tag", crossErp: "sales" },
      { screen: "W-05", label: "SKU Detail / Rate", role: "Sales Staff", desc: "Pricing-only mode for GMMS SKUs", crossErp: "sales" },
    ],
  },
  {
    id: "mfg-masters",
    name: "Master Data Setup",
    erp: "mfg",
    description: "Configure manufacturing master data",
    steps: [
      { screen: "G-14", label: "Design Master", role: "Manager/Admin", desc: "Manage design catalog" },
      { screen: "G-15", label: "Job Work Types", role: "Manager/Admin", desc: "Define embroidery, stitching, etc." },
      { screen: "G-16", label: "Color Master", role: "Manager/Admin", desc: "Manage color catalog" },
      { screen: "G-17", label: "Contractor Registry", role: "Manager/Admin", desc: "Register and manage contractors" },
    ],
  },
  {
    id: "mfg-fabric",
    name: "Fabric / Mill Management",
    erp: "mfg",
    description: "Manage fabric inventory from mill to challan",
    steps: [
      { screen: "G-09", label: "Mill / Fabric Management", role: "Production Manager", desc: "Track fabric stock and mill orders" },
      { screen: "G-23", label: "Traditional Challan Entry", role: "Production Manager", desc: "Issue fabric to contractor via challan" },
    ],
  },
  {
    id: "mfg-dashboard-ops",
    name: "Daily Production Ops",
    erp: "mfg",
    description: "Daily production operations from dashboard",
    steps: [
      { screen: "G-12", label: "Production Dashboard", role: "Owner/Manager", desc: "KPI tiles, overdue challans, leaderboard" },
      { screen: "G-23", label: "Traditional Challan Entry", role: "Production Manager", desc: "Quick-create challan from dashboard" },
      { screen: "G-18", label: "Notifications Center", role: "All", desc: "View production alerts and updates" },
      { screen: "G-22", label: "Live Inventory (GMMS)", role: "Production Manager", desc: "Monitor GMMS stock levels" },
      { screen: "G-19", label: "Reports Hub (GMMS)", role: "Owner/Manager", desc: "Generate manufacturing reports" },
    ],
  },
  {
    id: "mfg-admin",
    name: "Admin & Security (GMMS)",
    erp: "mfg",
    description: "User management, role permissions, and system configuration for manufacturing",
    steps: [
      { screen: "G-30", label: "User Management (GMMS)", role: "Owner/Admin", desc: "Manage manufacturing users and roles" },
      { screen: "G-30A", label: "Role Permissions (GMMS)", role: "Owner/Admin", desc: "Configure GMMS role-based access" },
    ],
  },

  // ─── Mobile App ─────────────────────────────────────────────────
  {
    id: "mobile-picking",
    name: "Mobile Order Picking & Dispatch",
    erp: "sales",
    description: "Godown app flow for picking, dispatch, and LR",
    steps: [
      { screen: "M-01", label: "Login", role: "Godown Staff", desc: "Sign into godown mobile app" },
      { screen: "M-02", label: "Home Dashboard", role: "Godown Staff", desc: "View pending tasks" },
      { screen: "M-07", label: "Order Picking List", role: "Godown Staff", desc: "Select orders to pick" },
      { screen: "M-08", label: "Order Detail", role: "Godown Staff", desc: "View items to pick for selected order" },
      { screen: "M-09", label: "Picking Execution", role: "Godown Staff", desc: "Scan and confirm picked items" },
      { screen: "M-10", label: "Dispatch Confirmation", role: "Godown Staff", desc: "Confirm dispatch" },
      { screen: "M-11", label: "LR Upload", role: "Godown Staff", desc: "Upload LR document" },
      { screen: "M-12", label: "LR Confirmation", role: "Godown Staff", desc: "Final LR confirmation" },
    ],
  },
  {
    id: "mobile-stock",
    name: "Mobile Stock Operations",
    erp: "sales",
    description: "Barcode scanning and stock management on mobile",
    steps: [
      { screen: "M-01", label: "Login", role: "Godown Staff", desc: "Sign into godown mobile app" },
      { screen: "M-02", label: "Home Dashboard", role: "Godown Staff", desc: "Navigate to scan or stock" },
      { screen: "M-03", label: "Barcode Scanner", role: "Godown Staff", desc: "Scan barcode for item lookup" },
      { screen: "M-04", label: "Scan Result", role: "Godown Staff", desc: "View scanned item details" },
      { screen: "M-05", label: "Stock In", role: "Godown Staff", desc: "Receive and record incoming stock" },
      { screen: "M-06", label: "Stock Lookup", role: "Godown Staff", desc: "Look up stock by design/SKU" },
    ],
  },
  {
    id: "mobile-order-create",
    name: "Mobile Order Creation",
    erp: "sales",
    description: "Create orders from the godown mobile app",
    steps: [
      { screen: "M-01", label: "Login", role: "Salesperson", desc: "Sign into godown app" },
      { screen: "M-02", label: "Home Dashboard", role: "Salesperson", desc: "Navigate to create order" },
      { screen: "M-15R", label: "Create Order (Mobile Retail)", role: "Salesperson", desc: "Create retail order on mobile" },
      { screen: "M-15W", label: "Create Order (Mobile Wholesale)", role: "Salesperson", desc: "Create wholesale order on mobile" },
      { screen: "M-16", label: "Wholesale Approvals", role: "Manager", desc: "Approve wholesale orders" },
    ],
  },
  {
    id: "mobile-contractor",
    name: "Contractor Mobile App",
    erp: "mfg",
    description: "Contractor-facing mobile app flow",
    steps: [
      { screen: "M-G01", label: "Contractor Login", role: "Contractor", desc: "Sign into contractor app" },
      { screen: "M-G02", label: "My Challans", role: "Contractor", desc: "View assigned challans" },
      { screen: "M-G03", label: "Challan Detail", role: "Contractor", desc: "View challan items and status" },
      { screen: "M-G04", label: "Confirm Pieces Sent", role: "Contractor", desc: "Confirm completed pieces" },
      { screen: "M-G05", label: "My Payment Ledger", role: "Contractor", desc: "View payment history" },
      { screen: "M-G06", label: "My Profile", role: "Contractor", desc: "Manage contractor profile" },
    ],
  },

  // ─── Public ─────────────────────────────────────────────────────
  {
    id: "public-tracking",
    name: "Customer LR Tracking (Public)",
    erp: "sales",
    description: "Public-facing LR tracking page",
    steps: [
      { screen: "P-01", label: "Customer LR View", role: "Customer (Public)", desc: "Track shipment by LR number" },
    ],
  },
];

// ─── Role Color Map ──────────────────────────────────────────────
export const ROLE_COLORS = {
  "All Users":        { bg: "#e8e8e8", fg: "#444" },
  "Sales Team":       { bg: "#dbeafe", fg: "#1e40af" },
  "Salesperson":      { bg: "#dbeafe", fg: "#1e40af" },
  "Salesperson/Accounts": { bg: "#dbeafe", fg: "#1e40af" },
  "Manager":          { bg: "#fef3c7", fg: "#92400e" },
  "Manager/Admin":    { bg: "#fef3c7", fg: "#92400e" },
  "Owner/Manager":    { bg: "#fed7aa", fg: "#9a3412" },
  "Super Admin":      { bg: "#fce4ec", fg: "#b91c1c" },
  "Admin":            { bg: "#fce4ec", fg: "#b91c1c" },
  "Admin/Accounts":   { bg: "#fce4ec", fg: "#b91c1c" },
  "Accounts":         { bg: "#e0f2fe", fg: "#0369a1" },
  "Godown Staff":     { bg: "#dcfce7", fg: "#166534" },
  "GMMS Staff":       { bg: "#ffedd5", fg: "#c2410c" },
  "Production Manager": { bg: "#ffedd5", fg: "#c2410c" },
  "Production Staff": { bg: "#fef3c7", fg: "#92400e" },
  "Owner/Admin":      { bg: "#fed7aa", fg: "#9a3412" },
  "Sales Staff":      { bg: "#dbeafe", fg: "#1e40af" },
  "Contractor":       { bg: "#f3e8ff", fg: "#7c3aed" },
  "Supervisor":       { bg: "#d1fae5", fg: "#065f46" },
  "Customer (Public)": { bg: "#f5f5f4", fg: "#444" },
  "All":              { bg: "#e8e8e8", fg: "#444" },
};

// ─── Flow Colors ─────────────────────────────────────────────────
export const ERP_COLORS = {
  sales: { accent: "#c0392b", light: "#fdf0ef", border: "#e8b4b0" },
  mfg:   { accent: "#e67e22", light: "#fef3e2", border: "#f5cba7" },
  cross: { accent: "#8e44ad", light: "#f3e8ff", border: "#d8b4fe" },
};

// ─── Helpers ─────────────────────────────────────────────────────
export function getFlowById(id) {
  return FLOWS.find(f => f.id === id) || null;
}

export function getFlowsForScreen(screenId) {
  return FLOWS.filter(f => f.steps.some(s => s.screen === screenId));
}

export function getFlowNavigation(flowId, currentStepIndex) {
  const flow = getFlowById(flowId);
  if (!flow) return { prev: null, next: null };
  const steps = flow.steps;
  return {
    prev: currentStepIndex > 0 ? steps[currentStepIndex - 1] : null,
    next: currentStepIndex < steps.length - 1 ? steps[currentStepIndex + 1] : null,
    total: steps.length,
    current: currentStepIndex + 1,
    flow,
  };
}

export function getStepIndexByScreen(flowId, screenId) {
  const flow = getFlowById(flowId);
  if (!flow) return -1;
  return flow.steps.findIndex(s => s.screen === screenId);
}

export function getScreenRole(screenId) {
  const roles = FLOWS
    .filter(f => f.steps.some(s => s.screen === screenId))
    .flatMap(f => f.steps.filter(s => s.screen === screenId).map(s => s.role));
  const unique = [...new Set(roles)];
  return unique.length > 0 ? unique : null;
}

export function getScreenFlows(screenId) {
  return FLOWS
    .filter(f => f.steps.some(s => s.screen === screenId))
    .map(f => ({ id: f.id, name: f.name, erp: f.erp }));
}
