import { useState, useMemo } from "react";
import { jobTimelineDefaults } from "./gmmsJobTimeline";
import { FLOWS, ROLE_COLORS, ERP_COLORS, getFlowsForScreen, getFlowById, getFlowNavigation, getStepIndexByScreen, getScreenRole, getScreenFlows } from "./flows-data";
import { RoleBadge, FlowTag, FlowBar, FlowDiagram, FlowNavButtons } from "./flows-ui";

const C = {
  bgSoft: "#f5f5f5", text: "#111111", textMuted: "#666666", textLight: "#999999",
  border: "#e0e0e0", red: "#c0392b", redLight: "#fdf0ef", redBorder: "#e8b4b0",
  black: "#111111", white: "#ffffff", green: "#1a7a4a", greenLight: "#edf7f1", greenBorder: "#a8d5bc", tealLight: "#CCFBF1", amber: "#d97706", amberLight: "#fef3c7",
};

const Tag = ({ children, color }) => (
  <span style={{
    display:"inline-block",fontSize:10,fontWeight:600,letterSpacing:"0.05em",padding:"2px 7px",borderRadius:3,
    background:color==="red"?C.redLight:color==="black"?C.black:color==="green"?C.greenLight:C.bgSoft,
    color:color==="red"?C.red:color==="black"?C.white:color==="green"?C.green:C.textMuted,
    border:`0.5px solid ${color==="red"?C.redBorder:color==="green"?C.greenBorder:C.border}`,
    textTransform:"uppercase",whiteSpace:"nowrap",
  }}>{children}</span>
);

const Divider = ({label}) => (
  <div style={{display:"flex",alignItems:"center",gap:8,margin:"12px 0"}}>
    {label && <span style={{fontSize:10,color:C.textMuted,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",whiteSpace:"nowrap"}}>{label}</span>}
    <div style={{flex:1,borderTop:`0.5px solid ${C.border}`}}/>
  </div>
);

const FR = ({label,value,accent,bold}) => (
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:`0.5px solid ${C.border}`}}>
    <span style={{fontSize:11,color:C.textMuted}}>{label}</span>
    <span style={{fontSize:12,fontWeight:bold?700:500,color:accent?C.red:C.text}}>{value}</span>
  </div>
);

const Input = ({label,placeholder,required,wide,mono,note}) => (
  <div style={{marginBottom:9}}>
    {label&&<div style={{fontSize:11,color:C.textMuted,marginBottom:3,fontWeight:500}}>{label}{required&&<span style={{color:C.red}}> *</span>}</div>}
    <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,padding:"7px 10px",fontSize:12,color:C.textLight,background:C.white,fontFamily:mono?"monospace":"inherit"}}>{placeholder||""}</div>
    {note&&<div style={{fontSize:10,color:C.textMuted,marginTop:2}}>{note}</div>}
  </div>
);

const Btn = ({children,primary,danger,success,small,full,outline}) => (
  <button style={{
    padding:small?"5px 12px":"8px 16px",borderRadius:4,fontSize:small?11:12,fontWeight:600,
    width:full?"100%":"auto",
    border:`0.5px solid ${danger?C.red:primary?C.black:success?C.green:C.border}`,
    background:primary?C.black:danger?C.red:success?C.green:C.white,
    color:primary||danger||success?C.white:C.text,cursor:"pointer",letterSpacing:"0.02em",
  }}>{children}</button>
);

const Card = ({children,style,red}) => (
  <div style={{border:`0.5px solid ${red?C.redBorder:C.border}`,borderRadius:6,padding:"12px 14px",background:red?C.redLight:C.white,marginBottom:10,...style}}>{children}</div>
);

const Metric = ({label,value,sub,alert,green}) => (
  <div style={{border:`0.5px solid ${alert?C.redBorder:green?C.greenBorder:C.border}`,borderRadius:6,padding:"10px 12px",background:alert?C.redLight:green?C.greenLight:C.bgSoft,flex:1}}>
    <div style={{fontSize:10,color:alert?C.red:green?C.green:C.textMuted,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em"}}>{label}</div>
    <div style={{fontSize:20,fontWeight:700,color:alert?C.red:green?C.green:C.text}}>{value}</div>
    {sub&&<div style={{fontSize:10,color:C.textMuted,marginTop:2}}>{sub}</div>}
  </div>
);

const TH = ({cols}) => (
  <div style={{display:"flex",gap:6,padding:"6px 10px",background:C.bgSoft,borderBottom:`0.5px solid ${C.border}`}}>
    {cols.map((c,i)=><div key={i} style={{flex:c.w||1,fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.04em",overflow:"hidden",whiteSpace:"nowrap"}}>{c.v}</div>)}
  </div>
);

const TR = ({cols,alert,green,muted}) => (
  <div style={{display:"flex",gap:6,padding:"7px 10px",borderBottom:`0.5px solid ${C.border}`,background:alert?C.redLight:green?C.greenLight:C.white}}>
    {cols.map((c,i)=><div key={i} style={{flex:c.w||1,fontSize:12,color:muted?C.textMuted:c.red?C.red:c.green?C.green:c.mono?C.textMuted:C.text,fontFamily:c.mono?"monospace":"inherit",fontWeight:c.bold?600:400,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{c.v}</div>)}
  </div>
);

const Toggle = ({options,active}) => (
  <div style={{display:"flex",border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden",width:"fit-content"}}>
    {options.map((o,i)=>(
      <div key={i} style={{padding:"6px 16px",fontSize:12,fontWeight:600,background:active===o?C.black:C.white,color:active===o?C.white:C.textMuted,cursor:"pointer",borderRight:i<options.length-1?`0.5px solid ${C.border}`:"none"}}>{o}</div>
    ))}
  </div>
);

const Tabs = ({tabs,active,onChange}) => (
  <div style={{display:"flex",borderBottom:`0.5px solid ${C.border}`,marginBottom:14,background:C.white}}>
    {tabs.map((t,i)=>(
      <div key={i} onClick={()=>onChange&&onChange(t)} style={{padding:"10px 16px",fontSize:12,fontWeight:600,color:active===t?C.black:C.textMuted,borderBottom:active===t?`2px solid ${C.black}`:"2px solid transparent",cursor:"pointer"}}>{t}</div>
    ))}
  </div>
);

const SectionLabel = ({children}) => (
  <div style={{fontSize:10,fontWeight:700,color:C.textMuted,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:8,marginTop:4}}>{children}</div>
);

const MobileFrame = ({children,menuOpen}) => (
  <div style={{width:300,margin:"0 auto",border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden",background:C.bgSoft,boxShadow:"0 2px 12px rgba(0,0,0,0.08)",position:"relative"}}>
    <div style={{background:C.black,color:C.white,padding:"8px 16px",display:"flex",justifyContent:"space-between",fontSize:10}}>
      <span>9:41</span><span>●●●</span>
    </div>
    <div style={{background:C.white,minHeight:520,overflowY:"auto"}}>{children}</div>
    {menuOpen&&<MSlideMenu/>}
  </div>
);

const MNav = ({label,action}) => (
  <div style={{background:C.black,color:C.white,padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
    <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:16}}>←</span><span style={{fontSize:13,fontWeight:600}}>{label}</span></div>
    {action&&<span style={{fontSize:11,color:"#aaa"}}>{action}</span>}
  </div>
);

const MBottomNav = ({active,type}) => {
  const gmmsItems=[{icon:"📋",label:"Challans"},{icon:"💰",label:"Payments"},{icon:"👤",label:"Profile"}];
  const items=type==="gmms"?gmmsItems:[{icon:"🏠",label:"Home"},{icon:"⛶",label:"Scan"},{icon:"📦",label:"Orders"},{icon:"☰",label:"Menu"},{icon:"👤",label:"Profile"}];
  return(
    <div style={{display:"flex",borderTop:`0.5px solid ${C.border}`,background:C.white}}>
      {items.map((item,i)=>(
        <div key={i} style={{flex:1,textAlign:"center",padding:"8px 0",fontSize:9,color:active===item.label?C.black:C.textMuted}}>
          <div style={{fontSize:16,marginBottom:2}}>{item.icon}</div>{item.label}
        </div>
      ))}
    </div>
  );
};

// Sliding drawer menu shown when ☰ Menu is tapped
const MSlideMenu = ({active}) => {
  const sections = [
    {label:"Main",items:[{icon:"⊞",label:"Home"},{icon:"⊙",label:"Scan"},{icon:"◉",label:"Orders"}]},
    {label:"Create Order",items:[{icon:"🏪",label:"New Retail Order"},{icon:"🏭",label:"New Wholesale Order"}]},
    {label:"Dispatch",items:[{icon:"⊏",label:"Picking List"},{icon:"✔",label:"Dispatch Confirm"},{icon:"📄",label:"LR Upload"}]},
    {label:"Inventory",items:[{icon:"☰",label:"Stock Lookup"},{icon:"+",label:"Stock In"}]},
    {label:"CCTV",items:[{icon:"●",label:"CCTV Recording"}]},
    {label:"Other",items:[{icon:"🔔",label:"Notifications"},{icon:"👤",label:"Profile & Settings"}]},
  ];
  return(
    <div style={{position:"absolute",top:0,right:0,bottom:0,width:"75%",background:C.white,borderLeft:`0.5px solid ${C.border}`,zIndex:10,overflowY:"auto"}}>
      <div style={{background:C.black,padding:"16px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style={{color:C.white,fontSize:13,fontWeight:700}}>CMS</div><div style={{color:"#888",fontSize:10,marginTop:2}}>Godown App</div></div>
        <span style={{color:"#888",fontSize:18}}>✔</span>
      </div>
      {sections.map((sec,si)=>(
        <div key={si}>
          <div style={{padding:"8px 14px 3px",fontSize:9,fontWeight:700,color:C.textLight,letterSpacing:"0.08em",textTransform:"uppercase"}}>{sec.label}</div>
          {sec.items.map((item,ii)=>(
            <div key={ii} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderBottom:`0.5px solid ${C.border}`,background:active===item.label?C.bgSoft:C.white}}>
              <span style={{fontSize:15,width:20,textAlign:"center"}}>{item.icon}</span>
              <span style={{fontSize:12,fontWeight:active===item.label?600:400,color:active===item.label?C.black:C.text}}>{item.label}</span>
              {active===item.label&&<span style={{marginLeft:"auto",width:4,height:4,borderRadius:"50%",background:C.red,display:"inline-block"}}/>}
            </div>
          ))}
        </div>
      ))}
      <div style={{padding:"12px 14px",borderTop:`0.5px solid ${C.border}`,marginTop:8,display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:32,height:32,borderRadius:"50%",background:C.black,display:"flex",alignItems:"center",justifyContent:"center",color:C.white,fontSize:13,fontWeight:700,flexShrink:0}}>R</div>
        <div><div style={{fontSize:12,fontWeight:600}}>Raju Singh</div><div style={{fontSize:10,color:C.textMuted}}>Godown Staff</div></div>
        <span style={{marginLeft:"auto",fontSize:11,color:C.red,cursor:"pointer"}}>Sign out</span>
      </div>
    </div>
  );
};

// ─── Sales ERP sidebar (CMS) ───────────────────────────────────────────
const SALES_MENU=[
  {icon:"⊞",label:"Dashboard",screens:[{id:"W-03",label:"Main Dashboard"}]},
  {icon:"□",label:"Products",screens:[{id:"W-04",label:"SKU List"},{id:"W-05",label:"Create / Edit SKU"},{id:"W-06",label:"SKU Detail"},{id:"W-07",label:"Label & Barcode Print"}]},
  {icon:"☰",label:"Inventory",screens:[{id:"W-09",label:"Live Inventory"},{id:"W-13",label:"Stock Alert Center"}]},
  {icon:"◉",label:"Orders",screens:[{id:"W-14",label:"Order List"},{id:"W-15",label:"Order Detail"},{id:"W-16R",label:"Create Order - Retail"},{id:"W-16W",label:"Create Order - Wholesale"},{id:"W-34",label:"Wholesale Queue"}]},
  {icon:"⊏",label:"Dispatch",screens:[{id:"W-17",label:"LR Console"},{id:"W-18",label:"LR Detail"}]},
  {icon:"\u20B9",label:"Payments",screens:[{id:"W-20",label:"Payment Records"},{id:"W-12",label:"Credit Control Dashboard"}]},
  {icon:"●",label:"CCTV",screens:[{id:"W-21",label:"CCTV Console"},{id:"W-22",label:"Video Playback"}]},
  {icon:"⊡",label:"Reports",screens:[{id:"W-23",label:"Reports Hub"},{id:"W-24",label:"Sales Report"},{id:"W-25",label:"Ageing Report"},{id:"W-26",label:"Top Designs"},{id:"W-27",label:"Customer History"}]},
  {icon:"✉",label:"SMS",screens:[{id:"W-28",label:"SMS Log"},{id:"W-29",label:"SMS Templates"}]},
  {icon:"📊",label:"Daily Ops",screens:[{id:"W-36",label:"Daily Reconciliation"},{id:"W-39",label:"Challan Print Preview"}]},
  {icon:"\u2699",label:"Admin",screens:[{id:"W-30",label:"User Management"},{id:"W-30A",label:"Role Permissions"},{id:"W-31",label:"Customer Master"},{id:"W-35",label:"Edit Customer"},{id:"W-32",label:"System Settings"},{id:"W-33",label:"Audit Trail"}]},
];

// ─── Manufacturing ERP sidebar (GMMS) ───────────────────────────────────────
const MFG_MENU=[
  {icon:"⊞",label:"Dashboard",screens:[{id:"G-12",label:"Production Dashboard"}]},
  {icon:"📋",label:"Challans",screens:[{id:"G-01",label:"Challan List"},{id:"G-02",label:"Create Challan"},{id:"G-03",label:"Challan Tracking"},{id:"G-13",label:"Reprocess Challan"}]},
  {icon:"👷",label:"Contractors",screens:[{id:"G-04",label:"Contractor List"},{id:"G-05",label:"Contractor Detail"}]},
  {icon:"✔",label:"Production",screens:[{id:"G-06",label:"Ready Piece Count"},{id:"G-07",label:"Payment & Checking"},{id:"G-21",label:"SKU Outward"}]},
  {icon:"☰",label:"Inventory",screens:[{id:"G-22",label:"Live Inventory"}]},
  {icon:"↩",label:"RF / Returns",screens:[{id:"G-08",label:"RF Management"},{id:"G-20",label:"Create RF Entry"}]},
  {icon:"🧵",label:"Fabric / Mill",screens:[{id:"G-09",label:"Mill / Fabric Management"}]},
  {icon:"₹",label:"Costing (Owner Only)",screens:[{id:"G-10",label:"Design Costing [OWNER ONLY]"}]},
  {icon:"🎨",label:"Masters",screens:[{id:"G-14",label:"Design Master"},{id:"G-15",label:"Job Work Types"},{id:"G-16",label:"Color Master"},{id:"G-17",label:"Contractor Registry"}]},
  {icon:"🔔",label:"Notifications",screens:[{id:"G-18",label:"Notifications Center"}]},
  {icon:"📊",label:"Reports",screens:[{id:"G-19",label:"GMMS Reports Hub"}]},
  {icon:"\u2699",label:"Admin",screens:[{id:"G-30",label:"User Management (GMMS)"},{id:"G-30A",label:"Role Permissions (GMMS)"},{id:"W-32",label:"System Settings"},{id:"W-33",label:"Audit Trail"}]},
];

const SidebarMenu = ({menu,activeMenu,accentColor,logo,subtitle,user}) => {
  return(
    <div style={{width:190,background:C.black,flexShrink:0,overflowY:"auto",maxHeight:540,display:"flex",flexDirection:"column"}}>
      <div style={{color:C.white,fontSize:13,fontWeight:700,padding:"10px 12px 10px",borderBottom:"0.5px solid #222",flexShrink:0}}>
        <span style={{color:accentColor||C.red}}>{logo}</span>
        <div style={{fontSize:9,color:"#555",marginTop:2,fontWeight:400}}>{subtitle}</div>
      </div>
      <div style={{flex:1,overflowY:"auto"}}>
        {menu.map((m,mi)=>{
          const isActive=activeMenu===m.label;
          return(
            <div key={mi}>
              <div style={{display:"flex",alignItems:"center",gap:8,padding:"7px 12px",background:isActive?"#ffffff18":"transparent",color:isActive?C.white:"#888",fontSize:11,cursor:"pointer",borderLeft:isActive?`2px solid ${accentColor||C.red}`:"2px solid transparent"}}>
                <span style={{fontSize:12}}>{m.icon}</span>
                <span style={{fontWeight:isActive?700:400}}>{m.label}</span>
                {m.screens&&<span style={{marginLeft:"auto",fontSize:9,color:"#444"}}>{isActive?"▾":"▸"}</span>}
              </div>
              {isActive&&m.screens&&m.screens.map((s,si)=>(
                <div key={si} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 10px 5px 28px",color:"#777",fontSize:10,cursor:"pointer"}}>
                  <span style={{color:"#333",fontSize:8}}>•</span>
                  <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.label}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <div style={{padding:"8px 12px",color:"#444",fontSize:10,borderTop:"0.5px solid #222",flexShrink:0}}>
        <span style={{color:"#666"}}>{user}</span> · Super Admin
      </div>
    </div>
  );
};

const WebLayout = ({children,activeMenu,mode}) => {
  const isMfg = mode==="mfg";
  const menu = isMfg ? MFG_MENU : SALES_MENU;
  return(
    <div style={{display:"flex",border:`0.5px solid ${C.border}`,borderRadius:6,overflow:"hidden",background:C.bgSoft,minHeight:540}}>
      <SidebarMenu
        menu={menu}
        activeMenu={activeMenu}
        accentColor={isMfg?"#e67e22":C.red}
        logo={isMfg?"GMMS":"CMS"}
        subtitle={isMfg?"Manufacturing ERP · Mohammad Ali":"Sales ERP · Abdul Kadir"}
        user={isMfg?"Mohammad Ali":"Abdul Kadir"}
      />
      <div style={{flex:1,overflow:"hidden"}}>{children}</div>
    </div>
  );
};

// Orange accent for Manufacturing ERP
const CO = { accent:"#e67e22", accentLight:"#fef3e2", accentBorder:"#f5cba7" };

const TopBar = ({title,actions,sub}) => (
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 16px",borderBottom:`0.5px solid ${C.border}`,background:C.white}}>
    <div><div style={{fontSize:14,fontWeight:600}}>{title}</div>{sub&&<div style={{fontSize:10,color:C.textMuted,marginTop:1}}>{sub}</div>}</div>
    <div style={{display:"flex",gap:8}}>{actions && actions.map((a,i)=><Btn key={i} primary={a.primary} danger={a.danger} small>{a.label}</Btn>)}</div>
  </div>
);

// Manufacturing ERP TopBar  -  orange accent
const GTopBar = ({title,sub,actions,ownerOnly}) => (
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 16px",borderBottom:`0.5px solid ${CO.accentBorder}`,background:CO.accentLight}}>
    <div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{fontSize:14,fontWeight:600}}>{title}</div>
        {ownerOnly&&<span style={{fontSize:9,fontWeight:700,background:C.black,color:C.white,padding:"2px 6px",borderRadius:3,letterSpacing:"0.06em"}}>OWNER ONLY</span>}
      </div>
      {sub&&<div style={{fontSize:10,color:CO.accent,marginTop:1,fontWeight:500}}>{sub}</div>}
    </div>
    <div style={{display:"flex",gap:8}}>{actions && actions.map((a,i)=>(
      <button key={i} style={{padding:"5px 12px",borderRadius:4,fontSize:11,fontWeight:600,border:`0.5px solid ${a.primary?CO.accent:C.border}`,background:a.primary?CO.accent:C.white,color:a.primary?C.white:C.text,cursor:"pointer"}}>{a.label}</button>
    ))}</div>
  </div>
);

const Content = ({children,pad}) => (
  <div style={{padding:pad===false?0:16,background:C.bgSoft,minHeight:460}}>{children}</div>
);

const Modal = ({title,onClose,width,children}) => (
  <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:20}}>
    <div style={{width:width||460,background:C.white,borderRadius:8,boxShadow:"0 8px 32px rgba(0,0,0,0.18)",overflow:"hidden",maxHeight:"90%",display:"flex",flexDirection:"column"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 18px",borderBottom:`0.5px solid ${C.border}`,background:C.white,flexShrink:0}}>
        <div style={{fontSize:14,fontWeight:700}}>{title}</div>
        <span style={{fontSize:18,color:C.textMuted,cursor:"pointer",lineHeight:1}}>✔</span>
      </div>
      <div style={{padding:"16px 18px",overflowY:"auto"}}>{children}</div>
    </div>
  </div>
);



// ------------------------------------------------------------------------
// AUTH
// ------------------------------------------------------------------------

const screens = {

"W-01": () => (
  <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:540,background:C.bgSoft}}>
    <div style={{width:320,background:C.white,border:`0.5px solid ${C.border}`,borderRadius:8,padding:32}}>
      <div style={{textAlign:"center",marginBottom:24}}>
        <div style={{fontSize:26,fontWeight:700,letterSpacing:2}}>CMS</div>
        <div style={{fontSize:11,color:C.textMuted,marginTop:4}}>Wholesale Garment Distribution  -  Surat</div>
      </div>
      <Input label="Email / Username" placeholder="admin@cms.com" required />
      <Input label="Password" placeholder="••••••••" required />
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <label style={{fontSize:11,color:C.textMuted,display:"flex",alignItems:"center",gap:5}}><input type="checkbox"/> Remember me</label>
        <span style={{fontSize:11,color:C.red,cursor:"pointer"}}>Forgot password?</span>
      </div>
      <Btn primary full>Sign In</Btn>
      <Divider/>
      <div style={{fontSize:10,color:C.textMuted,background:C.bgSoft,padding:"8px 10px",borderRadius:4,border:`0.5px solid ${C.border}`}}>
        Roles: Admin · Manager · Office Staff · Godown Staff
      </div>
    </div>
  </div>
),

"W-02": () => (
  <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:540,background:C.bgSoft}}>
    <div style={{width:320,background:C.white,border:`0.5px solid ${C.border}`,borderRadius:8,padding:32}}>
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{fontSize:22,fontWeight:700}}>CMS</div>
        <div style={{fontSize:13,fontWeight:600,marginTop:10}}>Reset Password</div>
        <div style={{fontSize:11,color:C.textMuted,marginTop:4}}>Enter your registered email to receive a reset link</div>
      </div>
      <Input label="Registered Email" placeholder="admin@cms.com" required />
      <Btn primary full>Send Reset Link</Btn>
      <div style={{textAlign:"center",marginTop:12,fontSize:11}}>
        <span style={{color:C.textMuted}}>← Back to </span><span style={{color:C.red,cursor:"pointer"}}>Sign In</span>
      </div>
      <Card red style={{marginTop:14}}>
        <div style={{fontSize:11,color:C.red,fontWeight:600}}>Reset link valid for 30 minutes</div>
        <div style={{fontSize:10,color:C.textMuted,marginTop:2}}>Check your spam folder if not received</div>
      </Card>
    </div>
  </div>
),

// ------------------------------------------------------------------------
// DASHBOARD
// ------------------------------------------------------------------------

"W-03": () => {
  const [erpMode, setErpMode] = useState("Sales ERP");
  return (
  <WebLayout activeMenu="Dashboard">
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 16px",borderBottom:`0.5px solid ${C.border}`,background:C.white}}>
      <div><div style={{fontSize:14,fontWeight:600}}>Main Dashboard</div><div style={{fontSize:10,color:C.textMuted,marginTop:1}}>04 Apr 2026 · Live</div></div>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        {/* ERP Mode Switch */}
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"5px 10px",background:C.bgSoft,border:`0.5px solid ${C.border}`,borderRadius:20}}>
          <span style={{fontSize:10,fontWeight:600,color:erpMode==="Sales ERP"?C.black:C.textMuted}}>Sales ERP</span>
          <div
            onClick={()=>setErpMode(erpMode==="Sales ERP"?"Manufacturing ERP":"Sales ERP")}
            style={{width:36,height:20,borderRadius:10,background:erpMode==="Manufacturing ERP"?C.black:C.border,cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0}}
          >
            <div style={{position:"absolute",top:3,left:erpMode==="Manufacturing ERP"?17:3,width:14,height:14,borderRadius:"50%",background:C.white,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.25)"}}/>
          </div>
          <span style={{fontSize:10,fontWeight:600,color:erpMode==="Manufacturing ERP"?C.black:C.textMuted}}>Manufacturing ERP</span>
        </div>
        <div style={{display:"flex",gap:8}}>
          <Btn small>Refresh</Btn><Btn small primary>Export</Btn>
        </div>
      </div>
    </div>
    {erpMode==="Manufacturing ERP"&&(
      <div style={{padding:"8px 16px",background:"#fff8e1",border:`0.5px solid #ffe082`,borderBottom:`0.5px solid ${C.border}`,fontSize:11,color:"#b45309",fontWeight:500}}>
        ⚙ Manufacturing ERP mode  -  showing production, BOM, and work order dashboards
      </div>
    )}
    <Content>
      {erpMode==="Sales ERP"?(
      <>
      <div style={{display:"flex",gap:10,marginBottom:14}}>
        <Metric label="Pending Orders" value="24" sub="3 wholesale pending approval" alert/>
        <Metric label="Today Dispatches" value="18" sub="↑ 12% vs yesterday"/>
        <Metric label="Low Stock SKUs" value="7" sub="Below threshold" alert/>
        <Metric label="Unconfirmed Payments" value="₹1.2L" sub="6 orders unpaid" alert/>
        <Metric label="Today Collections" value="₹84,200" sub="Cash ₹32k · UPI ₹52k" green/>
      </div>
      <div style={{display:"flex",gap:12,marginBottom:12}}>
        <div style={{flex:2}}>
          <Card>
            <div style={{fontSize:12,fontWeight:600,marginBottom:10}}>Top-Selling Designs - April 2026</div>
            {[["Floral Anarkali",340,"₹1.36L"],["Solid Kurti",280,"₹84k"],["Block Print Salwar",210,"₹63k"],["Embr. Dupatta",190,"₹95k"]].map(([name,units,rev],i)=>(
              <div key={i} style={{marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:3}}><span><strong>#{i+1}</strong> {name}</span><span style={{color:C.textMuted}}>{units} pcs · {rev}</span></div>
                <div style={{height:6,background:C.bgSoft,borderRadius:3}}><div style={{height:6,background:C.black,borderRadius:3,width:`${(units/340)*100}%`,opacity:0.9-i*0.15}}/></div>
              </div>
            ))}
          </Card>
        </div>
        <div style={{flex:1}}>
          <Card>
            <div style={{fontSize:12,fontWeight:600,marginBottom:8}}>Recent Activity</div>
            {[
              {t:"Order #1042 dispatched - Suresh Fabrics",time:"2m ago"},
              {t:"LR uploaded - Challan CH-881",time:"15m ago"},
              {t:"Payment ₹7,800 confirmed #1039",time:"32m ago"},
              {t:"Low stock: HT-001-RED-M (4 pcs)",time:"1h ago",alert:true},
              {t:"Wholesale order #W-1008 pending approval",time:"1h ago",alert:true},
              {t:"New retail order #1043 created",time:"2h ago"},
            ].map((a,i)=>(
              <div key={i} style={{fontSize:11,color:a.alert?C.red:C.text,padding:"5px 0",borderBottom:`0.5px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}>
                <span style={{flex:1,marginRight:8}}>{a.t}</span><span style={{color:C.textLight,fontSize:10,whiteSpace:"nowrap"}}>{a.time}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
      <div style={{display:"flex",gap:10}}>
        <Card red style={{flex:1}}>
          <div style={{fontSize:11,fontWeight:600,color:C.red,marginBottom:6}}>{"⚠"} Stock Alerts</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {["HT-002-BLU-L (4 pcs)","HT-005-GRN-M (2 pcs)","HT-007-PNK-XL (1 pc)"].map((s,i)=>(
              <span key={i} style={{fontSize:11,color:C.red,background:C.white,border:`0.5px solid ${C.redBorder}`,padding:"2px 8px",borderRadius:3}}>{s}</span>
            ))}
          </div>
        </Card>
        <Card red style={{flex:1}}>
          <div style={{fontSize:11,fontWeight:600,color:C.red,marginBottom:6}}>{"⚠"} Credit Due - Outstanding Payments</div>
          {[["Deepak Wholesale","₹32,800","Overdue 3 days - limit exceeded"],["Ramesh Traders","₹8,400","Due tomorrow"]].map(([name,amt,status],i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:11,padding:"4px 0",borderBottom:`0.5px solid ${C.redBorder}`}}>
              <span>{name}</span><span style={{color:C.red,fontWeight:600,fontSize:10}}>{amt} · {status}</span>
            </div>
          ))}
          <div style={{marginTop:6,fontSize:10,color:C.textMuted}}>Click to open Payment Records {"→"}</div>
        </Card>
      </div>
      </>
      ):(
      <>
      <div style={{display:"flex",gap:10,marginBottom:14}}>
        <Metric label="Active Challans" value="42" sub="12 started today"/>
        <Metric label="Overdue Challans" value="7" sub="Needs attention" alert/>
        <Metric label="Pieces in Production" value="3,840" sub="Across 42 challans"/>
        <Metric label="Pending Payments" value={"₹18.5L"} sub="12 contractors" alert/>
        <Metric label="RF Alerts" value="3" sub="Challans in RF state" alert/>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
        {[["EMB",12,"#e67e22"],["STH",8,"#2980b9"],["DIA",6,"#8e44ad"],["WASH",4,"#1abc9c"],["CUT",3,"#95a5a6"],["FIN",2,"#27ae60"]].map(([stage,count,color],i)=>(
          <div key={i} style={{padding:"4px 12px",borderRadius:16,fontSize:11,fontWeight:600,background:color+"18",color,border:`1px solid ${color}40`}}>{stage}: {count}</div>
        ))}
      </div>
      <div style={{display:"flex",gap:12,marginBottom:12}}>
        <div style={{flex:2}}>
          <Card>
            <div style={{fontSize:12,fontWeight:600,marginBottom:10}}>Overdue Challans</div>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden"}}>
              <TH cols={[{v:"C.No",w:0.6},{v:"Design"},{v:"Stage"},{v:"Contractor"},{v:"Days Over",w:0.7},{v:"Action",w:0.6}]}/>
              {[
                {cn:"3202",design:"D-710",stage:"Stitching",contractor:"Raju Tailor",days:4},
                {cn:"3198",design:"D-688",stage:"Embroidery",contractor:"Salim Works",days:3},
                {cn:"3195",design:"D-695",stage:"Diamond",contractor:"Hari Gems",days:2},
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 10px",borderBottom:`0.5px solid ${C.border}`,fontSize:11}}>
                  <div style={{flex:0.6,fontFamily:"monospace",fontWeight:600}}>{r.cn}</div>
                  <div style={{flex:1,fontWeight:500}}>{r.design}</div>
                  <div style={{flex:1}}><span style={{background:"#fff3e0",color:"#e65100",padding:"2px 8px",borderRadius:3,fontSize:10,fontWeight:600}}>{r.stage}</span></div>
                  <div style={{flex:1,color:C.textMuted}}>{r.contractor}</div>
                  <div style={{flex:0.7,color:C.red,fontWeight:600}}>{r.days}d</div>
                  <div style={{flex:0.6}}><Btn small>Track</Btn></div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div style={{flex:1}}>
          <Card>
            <div style={{fontSize:12,fontWeight:600,marginBottom:8}}>Contractor Leaderboard</div>
            <div style={{fontSize:10,color:C.textMuted,marginBottom:8}}>Top 5 by completion rate this month</div>
            {[
              {name:"Raju Tailor",rate:96,jobs:24},
              {name:"Salim Works",rate:92,jobs:18},
              {name:"Hari Gems",rate:88,jobs:15},
              {name:"Priya Emb.",rate:85,jobs:12},
              {name:"Suresh Cut",rate:82,jobs:10},
            ].map((c,i)=>(
              <div key={i} style={{marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:3}}><span><strong>#{i+1}</strong> {c.name}</span><span style={{color:C.textMuted}}>{c.rate}% {"·"} {c.jobs} jobs</span></div>
                <div style={{height:6,background:C.bgSoft,borderRadius:3}}><div style={{height:6,background:"#e67e22",borderRadius:3,width:`${c.rate}%`,opacity:0.9-i*0.1}}/></div>
              </div>
            ))}
          </Card>
        </div>
      </div>
      </>
      )}
    </Content>
  </WebLayout>
  );
},

// ------------------------------------------------------------------------
// PRODUCTS & SKU
// ------------------------------------------------------------------------

"W-04": () => (
  <WebLayout activeMenu="Products">
    <TopBar title="SKU List" actions={[{label:"+ Add SKU",primary:true},{label:"Print Labels"}]}/>
    <Content>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <div style={{flex:1,border:`0.5px solid ${C.border}`,borderRadius:4,padding:"7px 10px",fontSize:12,color:C.textLight,background:C.white}}>Search by design name, SKU code...</div>
        <Btn small>Category ▾</Btn><Btn small>Stock Status ▾</Btn><Btn small>Source ▾</Btn>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:8}}>
        {["All","GMMS","External"].map((f,i)=>(
          <div key={i} style={{padding:"3px 10px",borderRadius:12,fontSize:10,fontWeight:600,cursor:"pointer",background:i===0?"#111":"#f5f5f5",color:i===0?"#fff":"#555",border:`0.5px solid ${i===0?"#111":"#ddd"}`}}>{f}</div>
        ))}
      </div>
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,overflow:"hidden",background:C.white}}>
        <TH cols={[{v:"Thumb",w:0.4},{v:"Design Name"},{v:"SKU Code"},{v:"Source",w:0.7},{v:"SKU Count"},{v:"Retail ₹"},{v:"Wholesale ₹"},{v:"Stock Qty"},{v:"Media"},{v:"Actions",w:1.4}]}/>
        {[
          {name:"Floral Anarkali",sku:"HT-001",var:20,ret:"₹850",ws:"₹720",stock:184,imgs:3,vids:1,out:false,src:"GMMS",design:"D-710",challan:"3202"},
          {name:"Solid Kurti",sku:"HT-002",var:12,ret:"₹420",ws:"₹350",stock:62,imgs:2,vids:0,out:false,src:"External"},
          {name:"Block Print Salwar",sku:"HT-003",var:16,ret:"₹680",ws:"₹580",stock:0,imgs:4,vids:2,out:true,src:"GMMS",design:"D-688",challan:"3198"},
        ].map((r,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 10px",borderBottom:`0.5px solid ${C.border}`,background:r.out?C.redLight:C.white}}>
            <div style={{flex:0.4,width:32,height:32,background:C.bgSoft,borderRadius:3,border:`0.5px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:C.textLight}}>IMG</div>
            <div style={{flex:1,fontSize:12,fontWeight:500}}>{r.name}</div>
            <div style={{flex:1,fontSize:11,color:C.textMuted,fontFamily:"monospace"}}>{r.sku}</div>
            <div style={{flex:0.7}}>
              <span style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:3,background:r.src==="GMMS"?"#fff3e0":"#f5f5f5",color:r.src==="GMMS"?"#e65100":"#555",border:`0.5px solid ${r.src==="GMMS"?"#ffcc80":"#ddd"}`}}>{r.src}</span>
            </div>
            <div style={{flex:1,fontSize:11,color:C.textMuted}}>{r.var} SKUs</div>
            <div style={{flex:0.8,fontSize:12,fontWeight:500}}>{r.ret}</div>
            <div style={{flex:0.8,fontSize:12,fontWeight:500,color:C.textMuted}}>{r.ws}</div>
            <div style={{flex:0.8,fontSize:12,fontWeight:600,color:r.out?C.red:C.text}}>{r.out?"Out":r.stock+" pcs"}</div>
            <div style={{flex:0.8,fontSize:11,color:C.textMuted}}>{"📷"}{r.imgs} {"🎥"}{r.vids}</div>
            <div style={{flex:1.4,display:"flex",gap:5}}><Btn small>View</Btn><Btn small>Edit</Btn><Btn small>Print</Btn></div>
          </div>
        ))}
      </div>
    </Content>
  </WebLayout>
),

"W-05": () => {
  const [mode, setMode] = useState("gmms");
  return (
  <WebLayout activeMenu="Products">
    <div style={{padding:"10px 16px",borderBottom:`0.5px solid ${C.border}`,background:C.white,display:"flex",alignItems:"center",gap:10}}>
      <div style={{fontSize:14,fontWeight:600,flex:1}}>Create / Price SKU</div>
      <div style={{display:"flex",gap:6}}>
        <div onClick={()=>setMode("gmms")} style={{padding:"4px 12px",borderRadius:12,fontSize:10,fontWeight:700,cursor:"pointer",background:mode==="gmms"?"#e65100":"#f5f5f5",color:mode==="gmms"?"#fff":"#555",border:`0.5px solid ${mode==="gmms"?"#e65100":"#ddd"}`}}>GMMS — Price Tag Entry</div>
        <div onClick={()=>setMode("ext")} style={{padding:"4px 12px",borderRadius:12,fontSize:10,fontWeight:700,cursor:"pointer",background:mode==="ext"?"#555":"#f5f5f5",color:mode==="ext"?"#fff":"#555",border:`0.5px solid ${mode==="ext"?"#555":"#ddd"}`}}>External Stock — Manual Entry</div>
      </div>
    </div>
    {mode==="gmms"&&(
      <div style={{padding:"8px 16px",background:"#fff3e0",borderBottom:`0.5px solid ${C.border}`,fontSize:11,color:"#e65100"}}>
        This SKU was created by the manufacturing team. You can only set pricing — all other fields are locked.
      </div>
    )}
    <Content>
      {mode==="gmms"?(
        <div style={{display:"flex",gap:12}}>
          <div style={{flex:2}}>
            <Card>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <SectionLabel>GMMS Origin (Read-only)</SectionLabel>
                <span style={{fontSize:9,fontWeight:700,padding:"2px 8px",background:"#fff3e0",color:"#e65100",borderRadius:3}}>LOCKED</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                {[["Design No.","D-710"],["Challan No.","3202"],["Production Date","05 May 2026"],["Total Pieces","240 pcs"]].map(([lbl,val],i)=>(
                  <div key={i} style={{background:C.bgSoft,border:`0.5px solid ${C.border}`,borderRadius:4,padding:"8px 10px"}}>
                    <div style={{fontSize:9,color:C.textMuted,marginBottom:3}}>{lbl}</div>
                    <div style={{fontSize:12,fontWeight:600,color:C.text}}>{val}</div>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <SectionLabel>Pre-filled Fields (Locked)</SectionLabel>
              <div style={{display:"flex",gap:10,marginBottom:8}}>
                <div style={{flex:1,background:C.bgSoft,border:`0.5px solid ${C.border}`,borderRadius:4,padding:"8px 10px"}}>
                  <div style={{fontSize:9,color:C.textMuted,marginBottom:2}}>Design Name</div>
                  <div style={{fontSize:12,fontWeight:500}}>Floral Anarkali</div>
                </div>
                <div style={{flex:1,background:C.bgSoft,border:`0.5px solid ${C.border}`,borderRadius:4,padding:"8px 10px"}}>
                  <div style={{fontSize:9,color:C.textMuted,marginBottom:2}}>SKU Code</div>
                  <div style={{fontSize:12,fontWeight:500,fontFamily:"monospace"}}>HT-001</div>
                </div>
              </div>
              <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden"}}>
                <div style={{display:"flex",background:C.bgSoft,padding:"6px 10px",fontSize:10,fontWeight:700,color:C.textMuted,gap:6}}>
                  <div style={{flex:1.2}}>SKU</div><div style={{flex:0.8}}>Colour</div><div style={{flex:0.5}}>Size</div><div style={{flex:0.6}}>Qty</div>
                </div>
                {[{sku:"HT-001-RED-M",col:"Red",sz:"M",qty:60},{sku:"HT-001-RED-L",col:"Red",sz:"L",qty:48},{sku:"HT-001-BLU-M",col:"Blue",sz:"M",qty:72},{sku:"HT-001-BLU-L",col:"Blue",sz:"L",qty:60}].map((r,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",borderTop:`0.5px solid ${C.border}`,fontSize:11,background:C.bgSoft,color:C.textMuted}}>
                    <div style={{flex:1.2,fontFamily:"monospace",fontSize:10}}>{r.sku}</div>
                    <div style={{flex:0.8}}>{r.col}</div>
                    <div style={{flex:0.5}}>{r.sz}</div>
                    <div style={{flex:0.6,fontWeight:600}}>{r.qty}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <div style={{flex:1}}>
            <Card>
              <SectionLabel>Set Pricing</SectionLabel>
              <Input label={"Retail Price (₹)"} placeholder="850.00" required note="Required to activate SKU"/>
              <Input label={"Wholesale Price (₹)"} placeholder="720.00" required note="Shown on wholesale orders"/>
              <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:6}}>
                <Btn primary full>Save Pricing</Btn>
                <Btn full>Save &amp; Print Labels</Btn>
                <Btn full>Cancel</Btn>
              </div>
            </Card>
          </div>
        </div>
      ):(
        <div style={{display:"flex",gap:12}}>
          <div style={{flex:2}}>
            <Card>
              <SectionLabel>Design Information</SectionLabel>
              <Input label="Design Name" placeholder="e.g. Floral Anarkali Set" required/>
              <Input label="SKU Code (auto)" placeholder="HT-001" mono/>
            </Card>
            <Card>
              <SectionLabel>Pricing</SectionLabel>
              <div style={{display:"flex",gap:10}}>
                <div style={{flex:1}}><Input label={"Retail Price (₹)"} placeholder="850.00" required note="Shown on retail orders"/></div>
                <div style={{flex:1}}><Input label={"Wholesale Price (₹)"} placeholder="720.00" required note="Shown on wholesale orders"/></div>
              </div>
            </Card>
            <Card>
              <SectionLabel>Stock Entry</SectionLabel>
              <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden"}}>
                <div style={{display:"flex",background:C.bgSoft,padding:"6px 10px",fontSize:10,fontWeight:700,color:C.textMuted,gap:6}}>
                  <div style={{flex:1.2}}>SKU</div><div style={{flex:0.8}}>Colour</div><div style={{flex:0.5}}>Size</div><div style={{flex:0.6}}>Qty</div><div style={{flex:0.9}}>Rate ₹</div>
                </div>
                {[{sku:"HT-001-RED-M",col:"Red",sz:"M",qty:24,rate:"850"},{sku:"HT-001-BLU-M",col:"Blue",sz:"M",qty:12,rate:"790"}].map((r,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",borderTop:`0.5px solid ${C.border}`,fontSize:11}}>
                    <div style={{flex:1.2,fontFamily:"monospace",fontSize:10,color:C.textMuted}}>{r.sku}</div>
                    <div style={{flex:0.8}}>{r.col}</div>
                    <div style={{flex:0.5}}>{r.sz}</div>
                    <div style={{flex:0.6,border:`0.5px solid ${C.border}`,borderRadius:3,padding:"3px 6px"}}>{r.qty}</div>
                    <div style={{flex:0.9,border:`0.5px solid ${C.border}`,borderRadius:3,padding:"3px 6px",fontWeight:600}}>{r.rate}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <div style={{flex:1}}>
            <Card>
              <SectionLabel>Design Images</SectionLabel>
              <div style={{height:90,border:`1.5px dashed ${C.border}`,borderRadius:6,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:C.textLight,fontSize:11,marginBottom:8}}>
                <div style={{fontSize:20,marginBottom:4}}>{"↑"}</div>Upload images (multiple)
              </div>
            </Card>
            <Card>
              <SectionLabel>Barcode Preview</SectionLabel>
              <div style={{height:50,background:C.bgSoft,borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:6}}>
                <span style={{fontSize:9,color:C.textMuted,letterSpacing:2}}>||||| HT-001 |||||</span>
              </div>
            </Card>
            <Card>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                <Btn primary full>Save SKU</Btn>
                <Btn full>Save &amp; Print Labels</Btn>
                <Btn full>Cancel</Btn>
              </div>
            </Card>
          </div>
        </div>
      )}
    </Content>
  </WebLayout>
  );
},

"W-06": () => {
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [printSelections, setPrintSelections] = useState({
    "HT-001-RED-M":{color:"Red",size:"M",qty:5,selected:true},
    "HT-001-RED-L":{color:"Red",size:"L",qty:3,selected:true},
    "HT-001-BLU-M":{color:"Blue",size:"M",qty:8,selected:false},
    "HT-001-BLU-L":{color:"Blue",size:"L",qty:0,selected:false},
    "HT-001-BLK-S":{color:"Black",size:"S",qty:12,selected:true},
  });
  const totalLabels = Object.values(printSelections).filter(r=>r.selected).reduce((s,r)=>s+r.qty,0);
  const [isGmms,setIsGmms]=useState(true);
  return (
  <WebLayout activeMenu="Products">
    <TopBar title="SKU Detail  -  Floral Anarkali" actions={[{label:"Edit SKU"}]}/>
    {/* Print Labels button wired to open dialog */}
    <div style={{position:"relative"}}>
      <div style={{padding:"8px 16px",borderBottom:`0.5px solid ${C.border}`,background:C.white,display:"flex",justifyContent:"flex-end"}}>
        <button onClick={()=>setShowPrintDialog(true)} style={{padding:"8px 16px",borderRadius:4,fontSize:12,fontWeight:600,border:`0.5px solid ${C.black}`,background:C.black,color:C.white,cursor:"pointer"}}>🏷 Print Labels</button>
      </div>
      {showPrintDialog&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50}}>
          <div style={{width:500,background:C.white,borderRadius:8,boxShadow:"0 8px 32px rgba(0,0,0,0.2)",overflow:"hidden",maxHeight:"80vh",display:"flex",flexDirection:"column"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 18px",borderBottom:`0.5px solid ${C.border}`,background:C.white,flexShrink:0}}>
              <div style={{fontSize:14,fontWeight:700}}>🏷 Print Labels  -  Select SKUs</div>
              <span onClick={()=>setShowPrintDialog(false)} style={{fontSize:18,color:C.textMuted,cursor:"pointer",lineHeight:1}}>✔</span>
            </div>
            <div style={{padding:"14px 18px",overflowY:"auto",flex:1}}>
              <div style={{fontSize:11,color:C.textMuted,marginBottom:10}}>Select which colour/size SKUs to print labels for, and set quantity per SKU.</div>
              <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden",marginBottom:12}}>
                <div style={{display:"flex",background:C.bgSoft,padding:"6px 10px",fontSize:10,fontWeight:700,color:C.textMuted,gap:8}}>
                  <div style={{width:20}}/>
                  <div style={{flex:1.2}}>SKU</div>
                  <div style={{flex:0.8}}>Colour</div>
                  <div style={{flex:0.6}}>Size</div>
                  <div style={{flex:0.7,textAlign:"right"}}>Qty to Print</div>
                </div>
                {Object.entries(printSelections).map(([sku,r],i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderTop:`0.5px solid ${C.border}`,fontSize:11,background:r.selected?C.white:C.bgSoft}}>
                    <input type="checkbox" checked={r.selected} onChange={e=>setPrintSelections(p=>({...p,[sku]:{...p[sku],selected:e.target.checked}}))} style={{width:14,height:14,flexShrink:0}}/>
                    <div style={{flex:1.2,fontFamily:"monospace",fontSize:10,color:C.textMuted}}>{sku}</div>
                    <div style={{flex:0.8,display:"flex",alignItems:"center",gap:5}}>
                      <span style={{width:10,height:10,borderRadius:"50%",background:r.color==="Red"?"#e53e3e":r.color==="Blue"?"#3182ce":r.color==="Black"?"#1a202c":"#a0aec0",display:"inline-block",flexShrink:0}}/>
                      {r.color}
                    </div>
                    <div style={{flex:0.6,fontWeight:600}}>{r.size}</div>
                    <div style={{flex:0.7,display:"flex",justifyContent:"flex-end"}}>
                      <div style={{border:`0.5px solid ${r.selected?C.border:"transparent"}`,borderRadius:3,padding:"3px 8px",background:r.selected?C.white:"transparent",fontSize:11,fontWeight:600,color:r.selected?C.text:C.textLight,minWidth:40,textAlign:"center"}}>{r.qty}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 10px",background:C.bgSoft,borderRadius:4,border:`0.5px solid ${C.border}`,marginBottom:12,fontSize:11}}>
                <span style={{color:C.textMuted}}>{Object.values(printSelections).filter(r=>r.selected).length} SKUs selected</span>
                <span style={{fontWeight:700}}>Total labels: <span style={{color:C.black}}>{totalLabels}</span></span>
              </div>
              <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                <Btn onClick={()=>setShowPrintDialog(false)}>Cancel</Btn>
                <Btn primary>🖨 Print {totalLabels} Labels</Btn>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    <Content>
      <div style={{display:"flex",gap:12}}>
        <div style={{width:140,flexShrink:0}}>
          <Card>
            <div style={{height:110,background:C.bgSoft,borderRadius:4,marginBottom:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:C.textLight}}>Design Preview</div>
            <div style={{display:"flex",gap:4,marginBottom:6}}>
              {[1,2,3].map(n=><div key={n} style={{flex:1,height:36,background:C.bgSoft,borderRadius:3,border:`0.5px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:C.textLight}}>IMG{n}</div>)}
            </div>
            <div style={{height:36,background:C.black,borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:9,color:"#888"}}>▶ Video 1</span>
            </div>
          </Card>
          <Card>
            <FR label="SKU" value="HT-001" bold/>
            <FR label="Retail" value="₹850" bold/>
            <FR label="Wholesale" value="₹720"/>
            <FR label="Total Stock" value="184 pcs"/>
          </Card>
          {isGmms&&(
            <Card>
              <div style={{fontSize:10,fontWeight:700,color:CO.accent,marginBottom:6,letterSpacing:"0.05em",textTransform:"uppercase"}}>GMMS Origin</div>
              <FR label="Design No." value="D-730"/>
              <FR label="Challan No." value="CH-3221"/>
              <FR label="Prod. Date" value="07 May 2026"/>
              <FR label="Pcs Outward" value="600"/>
              <FR label="Stages" value="EMB → STH"/>
            </Card>
          )}
        </div>
        <div style={{flex:1}}>
          <Card>
            <div style={{fontSize:12,fontWeight:600,marginBottom:10}}>Stock Matrix  -  Colour × Size</div>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden"}}>
              <div style={{display:"flex",background:C.bgSoft,padding:"5px 8px",fontSize:10,fontWeight:700,color:C.textMuted,gap:8}}>
                {["COLOUR","S","M","L","XL","XXL","TOTAL"].map((h,i)=><div key={i} style={{flex:1}}>{h}</div>)}
              </div>
              {[{col:"Red",vals:[8,12,10,6,4,40]},{col:"Blue",vals:[5,9,11,7,3,35]},{col:"Black",vals:[10,14,12,8,5,49]},{col:"White",vals:[6,8,10,4,2,30]}].map((r,i)=>(
                <div key={i} style={{display:"flex",gap:8,padding:"6px 8px",borderTop:`0.5px solid ${C.border}`,fontSize:11}}>
                  {[r.col,...r.vals].map((v,j)=><div key={j} style={{flex:1,color:j===0?C.text:C.textMuted}}>{v}</div>)}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Content>
  </WebLayout>
  );
},

"W-07": () => (
  <WebLayout activeMenu="Products">
    <TopBar title="Label & Barcode Print Center" actions={[{label:"Print",primary:true}]}/>
    <Content pad={false}>
      <Tabs tabs={["Parent SKU Labels","Child SKU Labels (Bulk)"]} active="Parent SKU Labels"/>
      <div style={{padding:16}}>
        <div style={{display:"flex",gap:12}}>
          <div style={{flex:1}}>
            <Card>
              <SectionLabel>Select SKU</SectionLabel>
              <Input label="Search or scan design" placeholder="Type design name or scan Parent SKU..."/>
              <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,padding:"10px 12px",background:C.bgSoft,marginBottom:10}}>
                <div style={{fontSize:12,fontWeight:500}}>HT-001  -  Floral Anarkali</div>
                <div style={{fontSize:11,color:C.textMuted}}>Georgette | Anarkali | 20 variants</div>
              </div>
              <div style={{fontSize:11,color:C.textMuted,padding:"6px 8px",background:C.bgSoft,borderRadius:4}}>
                ℹ Parent label: 1 per design · hangs in showroom for scanning reference
              </div>
            </Card>
            <Card>
              <SectionLabel>For Child SKU Bulk Print</SectionLabel>
              <div style={{display:"flex",gap:10}}>
                <div style={{flex:1}}><Input label="Colour" placeholder="Select..."/></div>
                <div style={{flex:1}}><Input label="Size" placeholder="Select..."/></div>
              </div>
              <Input label="Quantity to Print" placeholder="Enter number of pieces..."/>
              <div style={{padding:"8px 10px",background:C.bgSoft,borderRadius:4,border:`0.5px solid ${C.border}`}}>
                <div style={{fontSize:11,fontWeight:600}}>Will generate: <span style={{color:C.red}}>48 labels</span></div>
                <div style={{fontSize:10,color:C.textMuted}}>HT-001-RED-M × 48 pieces | Size: 38×22mm</div>
              </div>
            </Card>
          </div>
          <div style={{flex:1}}>
            <Card>
              <SectionLabel>Label Preview  -  Parent (50×30mm)</SectionLabel>
              <div style={{border:`1.5px dashed ${C.border}`,borderRadius:6,padding:16,textAlign:"center",background:C.bgSoft,marginBottom:10}}>
                <div style={{fontSize:14,fontWeight:700,letterSpacing:"0.1em"}}>FLORAL ANARKALI</div>
                <div style={{fontSize:11,color:C.textMuted,marginBottom:8}}>Georgette | Anarkali | HT-001</div>
                <div style={{height:45,background:C.white,border:`0.5px solid ${C.border}`,borderRadius:3,margin:"0 20px",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontSize:8,color:C.textLight,letterSpacing:3}}>||||||||||| HT-001 |||||||||||</span>
                </div>
                <div style={{fontSize:10,fontWeight:600,marginTop:6,fontFamily:"monospace"}}>HT-001</div>
                <div style={{fontSize:9,color:C.textMuted}}>CMS · Surat</div>
              </div>
              <SectionLabel>Label Preview  -  Child (38×22mm)</SectionLabel>
              <div style={{border:`1.5px dashed ${C.border}`,borderRadius:6,padding:12,textAlign:"center",background:C.bgSoft}}>
                <div style={{fontSize:11,fontWeight:700}}>FLORAL ANARKALI</div>
                <div style={{fontSize:10,color:C.textMuted}}>Red | M</div>
                <div style={{height:30,background:C.white,border:`0.5px solid ${C.border}`,borderRadius:3,margin:"4px 10px",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontSize:8,color:C.textLight,letterSpacing:2}}>|||| HT-001-RED-M ||||</span>
                </div>
                <div style={{fontSize:9,fontWeight:600,fontFamily:"monospace"}}>HT-001-RED-M</div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Content>
  </WebLayout>
),

// ------------------------------------------------------------------------
// INVENTORY
// ------------------------------------------------------------------------

"W-09": () => (
  <WebLayout activeMenu="Inventory">
    <TopBar title="Live Inventory" sub="Last sync: just now ●" actions={[{label:"+ Add Stock (→ Create SKU)",primary:true},{label:"Export"}]}/>
    <Content>
      {/* Search bar - primary way to find SKUs by design code */}
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <div style={{flex:1,border:`0.5px solid ${C.border}`,borderRadius:4,padding:"7px 10px",fontSize:12,color:C.textLight,background:C.white}}>Search by design code, e.g. HT-001 to see all colours/sizes for that design...</div>
        <Btn small>⊙ Search</Btn>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
        <Btn small>All Locations ▾</Btn><Btn small>All Categories ▾</Btn><Btn small>Colour ▾</Btn><Btn small>Size ▾</Btn>
        <div style={{display:"flex",gap:5}}>
          {["All","Available","Low Stock","Out of Stock"].map((s,i)=>(
            <span key={i} style={{fontSize:11,padding:"4px 10px",borderRadius:3,border:`0.5px solid ${i===0?C.black:C.border}`,background:i===0?C.black:C.white,color:i===0?C.white:C.textMuted,cursor:"pointer"}}>{s}</span>
          ))}
        </div>
      </div>
      {/* Search result example - design code filtered */}
      <div style={{padding:"7px 10px",background:C.bgSoft,borderRadius:4,border:`0.5px solid ${C.border}`,marginBottom:8,fontSize:11,color:C.textMuted}}>
        Showing: <strong style={{color:C.text}}>HT-001</strong>  -  Floral Anarkali · 4 variants · 140 pcs total
      </div>
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,overflow:"hidden",background:C.white}}>
        <TH cols={[{v:"",w:0.4},{v:"Design"},{v:"SKU",w:1.2},{v:"Colour"},{v:"Size",w:0.5},{v:"Godown",w:0.7},{v:"Office",w:0.7},{v:"Total",w:0.7},{v:"Status",w:0.8},{v:"",w:0.5}]}/>
        {[
          {name:"Floral Anarkali",sku:"HT-001-RED-M",col:"Red",sz:"M",gd:24,off:8,total:32,status:"Available"},
          {name:"Floral Anarkali",sku:"HT-001-BLU-L",col:"Blue",sz:"L",gd:4,off:2,total:6,status:"Low"},
          {name:"Floral Anarkali",sku:"HT-001-BLK-S",col:"Black",sz:"S",gd:0,off:0,total:0,status:"Out of Stock"},
          {name:"Floral Anarkali",sku:"HT-001-WHT-XL",col:"White",sz:"XL",gd:18,off:5,total:23,status:"Available"},
        ].map((r,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 10px",borderBottom:`0.5px solid ${C.border}`,background:r.total===0?C.redLight:C.white}}>
            <div style={{flex:0.4,width:26,height:26,background:C.bgSoft,borderRadius:3,border:`0.5px solid ${C.border}`}}/>
            <div style={{flex:1,fontSize:12,fontWeight:500}}>{r.name}</div>
            <div style={{flex:1.2,fontSize:10,color:C.textMuted,fontFamily:"monospace"}}>{r.sku}</div>
            <div style={{flex:1,fontSize:11}}>{r.col}</div>
            <div style={{flex:0.5,fontSize:11}}>{r.sz}</div>
            <div style={{flex:0.7,fontSize:11,textAlign:"center"}}>{r.gd}</div>
            <div style={{flex:0.7,fontSize:11,textAlign:"center"}}>{r.off}</div>
            <div style={{flex:0.7,fontSize:12,fontWeight:600,color:r.total===0?C.red:C.text}}>{r.total}</div>
            <div style={{flex:0.8}}><Tag color={r.status==="Out of Stock"||r.status==="Low"?"red":"black"}>{r.status}</Tag></div>
            <div style={{flex:0.5}}><Btn small>Edit</Btn></div>
          </div>
        ))}
      </div>
      <div style={{marginTop:8,padding:"7px 10px",background:C.bgSoft,borderRadius:4,border:`0.5px solid ${C.border}`,fontSize:11,color:C.textMuted}}>
        ℹ To add new stock for an existing SKU  -  go to <strong>Create / Edit SKU</strong> and update quantities in the variant grid. The "Add Stock" button above redirects there.
      </div>
    </Content>
  </WebLayout>
),

"W-10": () => (
  <WebLayout activeMenu="Inventory">
    <TopBar title="Add Stock  -  MERGED INTO CREATE/EDIT SKU"/>
    <Content>
      <Card red>
        <div style={{fontSize:13,fontWeight:600,color:C.red,marginBottom:8}}>⚠ This screen has been merged</div>
        <div style={{fontSize:11,color:C.textMuted}}>
          The separate "Add Stock / Goods Receipt" screen is no longer needed.<br/><br/>
          <strong>To add stock for a new design:</strong> Go to Products → Create/Edit SKU (W-05)  -  the stock entry grid is now at the bottom of that screen.<br/><br/>
          <strong>To add more stock for an existing SKU:</strong> Go to Products → Product List → Edit the SKU  -  scroll to the stock grid and update quantities there.
        </div>
      </Card>
    </Content>
  </WebLayout>
),

"W-11": () => (
  <WebLayout activeMenu="Inventory">
    <TopBar title="Manual Stock Adjustment  -  REMOVED"/>
    <Content>
      <Card red>
        <div style={{fontSize:13,fontWeight:600,color:C.red,marginBottom:8}}>⚠ This screen has been removed</div>
        <div style={{fontSize:11,color:C.textMuted}}>
          The separate "Manual Stock Adjustment" screen is not needed in the current scope.<br/><br/>
          Stock corrections can be handled by editing the SKU directly (Products → Edit SKU → stock grid). The audit trail automatically logs all changes made by admin users.
        </div>
      </Card>
    </Content>
  </WebLayout>
),

"W-12": ({ onNavigate }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Customers");
  const [dateRange, setDateRange] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [confirmCustomer, setConfirmCustomer] = useState(null);
  const [holdOverrides, setHoldOverrides] = useState({});

  const customers = [
    {
      name: "Neha Garments", phone: "+91 98765 43210",
      creditLimit: 50000, outstandingBalance: 18500,
      oldestUnpaid: "12 Mar 2026", daysOverdue: 0, onHold: false,
      orders: [
        { id: "#W-1007", date: "12 Mar 2026", amount: 32800, paid: 14300, balance: 18500, status: "Partial" },
        { id: "#W-1003", date: "28 Feb 2026", amount: 22400, paid: 22400, balance: 0, status: "Paid" },
        { id: "#W-1001", date: "15 Jan 2026", amount: 18900, paid: 18900, balance: 0, status: "Paid" },
        { id: "#W-0995", date: "02 Jan 2026", amount: 15000, paid: 15000, balance: 0, status: "Paid" },
        { id: "#W-0988", date: "18 Dec 2025", amount: 27500, paid: 27500, balance: 0, status: "Paid" },
        { id: "#W-0980", date: "05 Dec 2025", amount: 12000, paid: 12000, balance: 0, status: "Paid" },
        { id: "#W-0972", date: "22 Nov 2025", amount: 31000, paid: 31000, balance: 0, status: "Paid" },
        { id: "#W-0965", date: "10 Nov 2025", amount: 8500, paid: 8500, balance: 0, status: "Paid" },
        { id: "#W-0958", date: "28 Oct 2025", amount: 22000, paid: 22000, balance: 0, status: "Paid" },
        { id: "#W-0950", date: "15 Oct 2025", amount: 16800, paid: 16800, balance: 0, status: "Paid" },
      ]
    },
    {
      name: "Ramesh Traders", phone: "+91 98765 43211",
      creditLimit: 30000, outstandingBalance: 26400,
      oldestUnpaid: "28 Feb 2026", daysOverdue: 0, onHold: false,
      orders: [
        { id: "#W-1004", date: "28 Feb 2026", amount: 18400, paid: 10000, balance: 8400, status: "Partial" },
        { id: "#W-0998", date: "10 Feb 2026", amount: 12000, paid: 12000, balance: 0, status: "Paid" },
        { id: "#W-0990", date: "22 Jan 2026", amount: 21000, paid: 21000, balance: 0, status: "Paid" },
        { id: "#W-0983", date: "05 Jan 2026", amount: 16000, paid: 16000, balance: 0, status: "Paid" },
        { id: "#W-0975", date: "15 Dec 2025", amount: 18500, paid: 18500, balance: 0, status: "Paid" },
        { id: "#W-0968", date: "28 Nov 2025", amount: 9500, paid: 9500, balance: 0, status: "Paid" },
        { id: "#W-0960", date: "10 Nov 2025", amount: 22000, paid: 22000, balance: 0, status: "Paid" },
        { id: "#W-0952", date: "25 Oct 2025", amount: 14000, paid: 14000, balance: 0, status: "Paid" },
        { id: "#W-0945", date: "08 Oct 2025", amount: 11000, paid: 11000, balance: 0, status: "Paid" },
        { id: "#W-0938", date: "20 Sep 2025", amount: 26000, paid: 26000, balance: 0, status: "Paid" },
      ]
    },
    {
      name: "Deepak Wholesale", phone: "+91 98765 43212",
      creditLimit: 30000, outstandingBalance: 32800,
      oldestUnpaid: "15 Feb 2026", daysOverdue: 5, onHold: false,
      orders: [
        { id: "#W-1006", date: "15 Feb 2026", amount: 32800, paid: 0, balance: 32800, status: "Unpaid" },
        { id: "#W-1000", date: "28 Jan 2026", amount: 15600, paid: 15600, balance: 0, status: "Paid" },
        { id: "#W-0992", date: "12 Jan 2026", amount: 19800, paid: 19800, balance: 0, status: "Paid" },
        { id: "#W-0985", date: "20 Dec 2025", amount: 24200, paid: 24200, balance: 0, status: "Paid" },
        { id: "#W-0977", date: "05 Dec 2025", amount: 12000, paid: 12000, balance: 0, status: "Paid" },
        { id: "#W-0970", date: "18 Nov 2025", amount: 28000, paid: 28000, balance: 0, status: "Paid" },
        { id: "#W-0962", date: "02 Nov 2025", amount: 8500, paid: 8500, balance: 0, status: "Paid" },
        { id: "#W-0955", date: "15 Oct 2025", amount: 19500, paid: 19500, balance: 0, status: "Paid" },
        { id: "#W-0948", date: "28 Sep 2025", amount: 16000, paid: 16000, balance: 0, status: "Paid" },
        { id: "#W-0940", date: "10 Sep 2025", amount: 22500, paid: 22500, balance: 0, status: "Paid" },
      ]
    },
    {
      name: "Suresh Fabrics", phone: "+91 98765 43213",
      creditLimit: 50000, outstandingBalance: 6200,
      oldestUnpaid: "05 Jan 2026", daysOverdue: 12, onHold: false,
      orders: [
        { id: "#W-1002", date: "05 Jan 2026", amount: 11200, paid: 5000, balance: 6200, status: "Partial" },
        { id: "#W-0997", date: "18 Dec 2025", amount: 8500, paid: 8500, balance: 0, status: "Paid" },
        { id: "#W-0989", date: "30 Nov 2025", amount: 19000, paid: 19000, balance: 0, status: "Paid" },
        { id: "#W-0982", date: "12 Nov 2025", amount: 14500, paid: 14500, balance: 0, status: "Paid" },
        { id: "#W-0974", date: "28 Oct 2025", amount: 7200, paid: 7200, balance: 0, status: "Paid" },
        { id: "#W-0967", date: "10 Oct 2025", amount: 21000, paid: 21000, balance: 0, status: "Paid" },
        { id: "#W-0959", date: "22 Sep 2025", amount: 16800, paid: 16800, balance: 0, status: "Paid" },
        { id: "#W-0951", date: "05 Sep 2025", amount: 9500, paid: 9500, balance: 0, status: "Paid" },
        { id: "#W-0943", date: "18 Aug 2025", amount: 24000, paid: 24000, balance: 0, status: "Paid" },
        { id: "#W-0935", date: "01 Aug 2025", amount: 13000, paid: 13000, balance: 0, status: "Paid" },
      ]
    },
    {
      name: "Priya Garments", phone: "+91 98765 43214",
      creditLimit: 40000, outstandingBalance: 44000,
      oldestUnpaid: "20 Jan 2026", daysOverdue: 15, onHold: true,
      orders: [
        { id: "#W-1005", date: "20 Jan 2026", amount: 32000, paid: 0, balance: 32000, status: "Unpaid" },
        { id: "#W-0999", date: "05 Jan 2026", amount: 12000, paid: 0, balance: 12000, status: "Unpaid" },
        { id: "#W-0991", date: "15 Dec 2025", amount: 18500, paid: 18500, balance: 0, status: "Paid" },
        { id: "#W-0984", date: "28 Nov 2025", amount: 22000, paid: 22000, balance: 0, status: "Paid" },
        { id: "#W-0976", date: "10 Nov 2025", amount: 9500, paid: 9500, balance: 0, status: "Paid" },
        { id: "#W-0969", date: "25 Oct 2025", amount: 16800, paid: 16800, balance: 0, status: "Paid" },
        { id: "#W-0961", date: "08 Oct 2025", amount: 14000, paid: 14000, balance: 0, status: "Paid" },
        { id: "#W-0954", date: "20 Sep 2025", amount: 21000, paid: 21000, balance: 0, status: "Paid" },
        { id: "#W-0947", date: "02 Sep 2025", amount: 12500, paid: 12500, balance: 0, status: "Paid" },
        { id: "#W-0939", date: "15 Aug 2025", amount: 27500, paid: 27500, balance: 0, status: "Paid" },
      ]
    },
  ];

  const totalOutstanding = customers.reduce((sum, c) => sum + c.outstandingBalance, 0);
  const overdueCount = customers.filter(c => c.daysOverdue > 0).length;
  const onHoldCount = customers.filter(c => c.onHold || holdOverrides[c.name]).length;

  const filtered = customers.filter(c => {
    const matchName = c.name.toLowerCase().includes(search.toLowerCase());
    const pct = (c.outstandingBalance / c.creditLimit) * 100;
    const matchFilter =
      filter === "All Customers" ? true :
      filter === "Overdue Only" ? c.daysOverdue > 0 :
      filter === "On Credit Hold" ? (c.onHold || holdOverrides[c.name]) :
      filter === "Within Limit" ? c.daysOverdue <= 0 && !c.onHold && pct < 80 :
      true;
    return matchName && matchFilter;
  });

  const sorted = [...filtered].sort((a, b) => b.daysOverdue - a.daysOverdue);

  const handleToggleHold = (customerName) => { setConfirmCustomer(customerName); };
  const handleConfirmHold = () => { setHoldOverrides(prev=>({...prev,[confirmCustomer]:true})); setConfirmCustomer(null); };
  const handleCancelHold = () => { setConfirmCustomer(null); };
  const handleRowClick = (customer) => { setSelectedCustomer(customer); };
  const handleCloseDrawer = () => { setSelectedCustomer(null); };

  const getStatus = (c) => {
    const pct = (c.outstandingBalance / c.creditLimit) * 100;
    if (c.onHold || holdOverrides[c.name]) return { label: "Credit Hold", bg: C.red, text: C.white, solid: true };
    if (c.daysOverdue > 0) return { label: "Overdue", bg: C.redLight, text: C.red, solid: false };
    if (pct >= 80) return { label: "Approaching Limit", bg: C.amberLight, text: C.amber, solid: false };
    return { label: "Within Limit", bg: C.greenLight, text: C.green, solid: false };
  };

  return (
    <WebLayout activeMenu="Payments">
      <TopBar title="Credit Control Dashboard" sub="Monitor wholesale customer credit limits, overdue payments & credit holds"/>
      <div style={{position:"relative",flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <Content>
          {/* Stat Cards */}
          <div style={{display:"flex",gap:16,marginBottom:16}}>
            <div style={{flex:1,border:"0.5px solid "+C.border,borderRadius:8,padding:"16px 20px",background:C.white}}>
              <div style={{fontSize:10,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:4}}>Total Outstanding</div>
              <div style={{fontSize:24,fontWeight:700}}>{"\u20B9"}{totalOutstanding.toLocaleString("en-IN")}</div>
            </div>
            <div style={{flex:1,border:"0.5px solid "+(overdueCount>0?C.redBorder:C.border),borderRadius:8,padding:"16px 20px",background:overdueCount>0?C.redLight:C.white}}>
              <div style={{fontSize:10,color:overdueCount>0?C.red:C.textMuted,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:4}}>Customers Overdue</div>
              <div style={{fontSize:24,fontWeight:700,color:overdueCount>0?C.red:C.text}}>{overdueCount}</div>
            </div>
            <div style={{flex:1,border:"0.5px solid "+(onHoldCount>0?C.redBorder:C.border),borderRadius:8,padding:"16px 20px",background:onHoldCount>0?C.redLight:C.white}}>
              <div style={{fontSize:10,color:onHoldCount>0?C.red:C.textMuted,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:4}}>Customers on Credit Hold</div>
              <div style={{fontSize:24,fontWeight:700,color:onHoldCount>0?C.red:C.text}}>{onHoldCount}</div>
            </div>
          </div>
          {/* Filter Bar */}
          <div style={{display:"flex",gap:12,marginBottom:16,alignItems:"center"}}>
            <input
              type="text" placeholder="Search customer name..."
              value={search} onChange={e=>setSearch(e.target.value)}
              style={{flex:1,border:"0.5px solid "+C.border,borderRadius:6,padding:"8px 12px",fontSize:12,color:C.text,background:C.white,outline:"none",fontFamily:"inherit"}}
            />
            <select
              value={filter} onChange={e=>setFilter(e.target.value)}
              style={{border:"0.5px solid "+C.border,borderRadius:6,padding:"8px 12px",fontSize:11,color:C.text,background:C.white,outline:"none",fontFamily:"inherit",cursor:"pointer"}}
            >
              <option>All Customers</option>
              <option>Overdue Only</option>
              <option>On Credit Hold</option>
              <option>Within Limit</option>
            </select>
            <input
              type="date" value={dateRange} onChange={e=>setDateRange(e.target.value)}
              style={{border:"0.5px solid "+C.border,borderRadius:6,padding:"8px 12px",fontSize:11,color:C.textMuted,background:C.white,outline:"none",fontFamily:"inherit",cursor:"pointer",minWidth:150}}
            />
          </div>
          {/* Table */}
          {sorted.length > 0 ? (
            <div style={{border:"0.5px solid "+C.border,borderRadius:8,overflow:"hidden",background:C.white}}>
              {/* Header */}
              <div style={{display:"flex",gap:8,padding:"8px 10px",background:C.bgSoft,borderBottom:"0.5px solid "+C.border}}>
                <div style={{flex:1.2,fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.04em"}}>Customer Name</div>
                <div style={{flex:0.8,fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.04em"}}>Credit Limit</div>
                <div style={{flex:0.9,fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.04em"}}>Outstanding</div>
                <div style={{flex:1.1,fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.04em"}}>Limit Used</div>
                <div style={{flex:1,fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.04em"}}>Oldest Unpaid</div>
                <div style={{flex:0.7,fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.04em"}}>Days Overdue</div>
                <div style={{flex:1,fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.04em"}}>Status</div>
                <div style={{flex:0.5,fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.04em",textAlign:"center"}}>Hold</div>
              </div>
              {/* Rows */}
              {sorted.map((c,i)=>{
                const pct = (c.outstandingBalance / c.creditLimit) * 100;
                const barColor = pct <= 60 ? C.green : pct <= 80 ? C.amber : C.red;
                const overLimit = pct > 100;
                const status = getStatus(c);
                const dayColor = c.daysOverdue <= 0 ? C.textMuted : c.daysOverdue <= 7 ? C.amber : C.red;
                return (
                  <div
                    key={i}
                    onClick={()=>handleRowClick(c)}
                    onMouseEnter={e=>e.currentTarget.style.background=C.tealLight}
                    onMouseLeave={e=>e.currentTarget.style.background=C.white}
                    style={{display:"flex",gap:8,padding:"8px 10px",borderTop:"0.5px solid "+C.border,minHeight:48,alignItems:"center",cursor:"pointer",background:C.white,transition:"background 0.15s"}}
                  >
                    <div style={{flex:1.2,fontSize:12,fontWeight:500,color:C.text,textDecoration:"underline",cursor:"pointer"}}>{c.name}</div>
                    <div style={{flex:0.8,fontSize:12,fontWeight:500}}>{"\u20B9"}{c.creditLimit.toLocaleString("en-IN")}</div>
                    <div style={{flex:0.9,fontSize:12,fontWeight:600,color:C.red}}>{"\u20B9"}{c.outstandingBalance.toLocaleString("en-IN")}</div>
                    <div style={{flex:1.1,display:"flex",alignItems:"center",gap:6}}>
                      <div style={{flex:1,height:8,background:C.bgSoft,borderRadius:4,overflow:"hidden"}}>
                        <div style={{width:Math.min(pct,100)+"%",height:"100%",background:barColor,borderRadius:4,transition:"width 0.3s"}}/>
                      </div>
                      <span style={{fontSize:11,fontWeight:600,color:barColor,whiteSpace:"nowrap"}}>{overLimit?"Over Limit":Math.round(pct)+"%"}</span>
                    </div>
                    <div style={{flex:1,fontSize:11,color:C.textMuted}}>{c.oldestUnpaid}</div>
                    <div style={{flex:0.7,fontSize:12,fontWeight:c.daysOverdue>7?600:400,color:dayColor}}>{c.daysOverdue>0?c.daysOverdue+" days":"-"}</div>
                    <div style={{flex:1}}>
                      {status.solid ? (
                        <span style={{display:"inline-block",fontSize:10,fontWeight:600,letterSpacing:"0.05em",padding:"3px 8px",borderRadius:3,background:status.bg,color:status.text,textTransform:"uppercase",whiteSpace:"nowrap"}}>{status.label}</span>
                      ) : (
                        <span style={{display:"inline-block",fontSize:10,fontWeight:600,letterSpacing:"0.05em",padding:"3px 8px",borderRadius:3,background:status.bg,color:status.text,border:"0.5px solid "+(status.label==="Overdue"?C.redBorder:status.label==="Approaching Limit"?C.amberBorder:C.greenBorder),textTransform:"uppercase",whiteSpace:"nowrap"}}>{status.label}</span>
                      )}
                    </div>
                    <div style={{flex:0.5,display:"flex",justifyContent:"center"}}>
                      <div
                        onClick={e=>{e.stopPropagation();handleToggleHold(c.name);}}
                        style={{width:36,height:20,borderRadius:10,background:c.onHold||holdOverrides[c.name]?C.red:C.border,padding:2,display:"flex",alignItems:"center",justifyContent:c.onHold||holdOverrides[c.name]?"flex-end":"flex-start",cursor:"pointer",transition:"all 0.2s"}}
                      >
                        <div style={{width:16,height:16,borderRadius:"50%",background:C.white,boxShadow:"0 1px 2px rgba(0,0,0,0.15)"}}/>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"48px 0",gap:16}}>
              <div style={{fontSize:48,color:C.textLight}}>{"\u26E8"}</div>
              <div style={{fontSize:13,color:C.textMuted}}>No customers match this filter</div>
            </div>
          )}
        </Content>
        {/* Drawer */}
        {selectedCustomer && (
          <>
            <div onClick={handleCloseDrawer} style={{position:"absolute",inset:0,background:"transparent",zIndex:15}}/>
            <div style={{position:"absolute",right:0,top:0,bottom:0,width:480,background:C.white,borderLeft:"1px solid "+C.border,zIndex:16,display:"flex",flexDirection:"column",boxShadow:"-4px 0 16px rgba(0,0,0,0.06)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px",borderBottom:"0.5px solid "+C.border,flexShrink:0}}>
                <div>
                  <div style={{fontSize:14,fontWeight:700}}>{selectedCustomer.name}</div>
                  <div style={{fontSize:11,color:C.textMuted,marginTop:2}}>{selectedCustomer.phone}</div>
                </div>
                <span onClick={handleCloseDrawer} style={{fontSize:18,color:C.textLight,cursor:"pointer",lineHeight:1}}>{"\u2715"}</span>
              </div>
              <div style={{display:"flex",gap:16,padding:"16px 20px",borderBottom:"0.5px solid "+C.border}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:10,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:4}}>Credit Limit</div>
                  <div style={{fontSize:20,fontWeight:700}}>{"\u20B9"}{selectedCustomer.creditLimit.toLocaleString("en-IN")}</div>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:10,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:4}}>Outstanding Balance</div>
                  <div style={{fontSize:20,fontWeight:700,color:C.red}}>{"\u20B9"}{selectedCustomer.outstandingBalance.toLocaleString("en-IN")}</div>
                </div>
              </div>
              <div style={{flex:1,overflowY:"auto",padding:"12px 20px"}}>
                <div style={{fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:10}}>Last 10 Orders</div>
                <div style={{display:"flex",gap:6,padding:"6px 0",borderBottom:"0.5px solid "+C.border,marginBottom:4}}>
                  {["Order ID","Date","Amount","Paid","Balance","Status"].map((h,hi)=>(
                    <div key={hi} style={{flex:1,fontSize:9,fontWeight:700,color:C.textLight,textTransform:"uppercase",letterSpacing:"0.04em"}}>{h}</div>
                  ))}
                </div>
                {selectedCustomer.orders.map((o,oi)=>(
                  <div key={oi} style={{display:"flex",gap:6,padding:"7px 0",borderBottom:"0.5px solid "+C.border,alignItems:"center"}}>
                    <div style={{flex:1,fontSize:11,fontFamily:"monospace",color:C.text}}>{o.id}</div>
                    <div style={{flex:1,fontSize:10,color:C.textMuted}}>{o.date}</div>
                    <div style={{flex:1,fontSize:11,fontWeight:500}}>{"\u20B9"}{o.amount.toLocaleString("en-IN")}</div>
                    <div style={{flex:1,fontSize:11,color:C.green,fontWeight:500}}>{"\u20B9"}{o.paid.toLocaleString("en-IN")}</div>
                    <div style={{flex:1,fontSize:11,fontWeight:600,color:o.balance>0?C.red:C.green}}>{"\u20B9"}{o.balance.toLocaleString("en-IN")}</div>
                    <div style={{flex:1}}>
                      <span style={{fontSize:9,fontWeight:600,padding:"2px 6px",borderRadius:2,background:o.status==="Paid"?C.greenLight:C.redLight,color:o.status==="Paid"?C.green:C.red,border:"0.5px solid "+(o.status==="Paid"?C.greenBorder:C.redBorder),textTransform:"uppercase",letterSpacing:"0.04em",whiteSpace:"nowrap"}}>{o.status}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{padding:"14px 20px",borderTop:"0.5px solid "+C.border,flexShrink:0}}>
                <button onClick={()=>onNavigate&&onNavigate("W-10")} style={{width:"100%",padding:"9px 0",borderRadius:6,border:"0.5px solid "+C.border,background:C.white,color:C.text,fontSize:12,fontWeight:600,cursor:"pointer"}}>View Full History {"\u2197"}</button>
              </div>
            </div>
          </>
        )}
        {/* Confirmation Modal */}
        {confirmCustomer && (
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:25}}>
            <div style={{width:480,background:C.white,borderRadius:10,boxShadow:"0 8px 32px rgba(0,0,0,0.18)",overflow:"hidden"}}>
              <div style={{padding:"20px 24px"}}>
                <div style={{fontSize:15,fontWeight:700,marginBottom:12}}>Put {confirmCustomer} on Credit Hold?</div>
                <div style={{fontSize:12,color:C.textMuted,lineHeight:1.6}}>No new orders can be created for this customer until the hold is lifted. This action is logged.</div>
              </div>
              <div style={{display:"flex",gap:10,justifyContent:"flex-end",padding:"14px 24px",borderTop:"0.5px solid "+C.border,background:C.bgSoft}}>
                <button onClick={handleCancelHold} style={{padding:"8px 20px",borderRadius:6,border:"0.5px solid "+C.border,background:C.white,color:C.text,fontSize:12,fontWeight:600,cursor:"pointer"}}>Cancel</button>
                <button onClick={handleConfirmHold} style={{padding:"8px 20px",borderRadius:6,border:"0.5px solid "+C.red,background:C.red,color:C.white,fontSize:12,fontWeight:600,cursor:"pointer"}}>Confirm Hold</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </WebLayout>
  );
},

"W-13": () => (
  <WebLayout activeMenu="Inventory">
    <TopBar title="Stock Alert Center" sub="Low stock & ageing alerts  -  thresholds configured in System Settings"/>
    <Content>
      <div style={{display:"flex",gap:12,marginBottom:14}}>
        <div style={{flex:1}}>
          <Card red>
            <div style={{fontSize:11,fontWeight:700,color:C.red,marginBottom:8}}>⚠ Low Stock  -  7 SKUs</div>
            <div style={{fontSize:10,color:C.textMuted,marginBottom:8}}>Below threshold of 10 pcs · Click an SKU to go to inventory</div>
            {["HT-002-BLU-L (4 pcs)","HT-005-GRN-M (2 pcs)","HT-007-PNK-XL (1 pc)","HT-009-RED-S (3 pcs)"].map((s,i)=>(
              <div key={i} style={{fontSize:11,padding:"6px 0",borderBottom:`0.5px solid ${C.redBorder}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{color:C.red,cursor:"pointer",textDecoration:"underline"}}>{s}</span>
              </div>
            ))}
            <div style={{marginTop:10,fontSize:10,color:C.textMuted}}>Low stock threshold: 10 pcs  -  change in System Settings → Inventory Thresholds</div>
          </Card>
        </div>
        <div style={{flex:1}}>
          <Card>
            <div style={{fontSize:11,fontWeight:700,marginBottom:8}}>Ageing Stock Report</div>
            <div style={{fontSize:10,color:C.textMuted,marginBottom:8}}>Stock sitting unsold by age bracket</div>
            {[["0 - 30 days","234 SKUs",false],["31 - 60 days","56 SKUs",false],["61 - 90 days","23 SKUs",true],["90+ days","12 SKUs",true]].map(([bracket,count,alert],i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:11,padding:"7px 0",borderBottom:`0.5px solid ${C.border}`}}>
                <span>{bracket}</span>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <span style={{fontWeight:600,color:alert?C.red:C.text}}>{count}</span>
                  {alert&&<Tag color="red">Alert</Tag>}
                </div>
              </div>
            ))}
            <div style={{marginTop:10,fontSize:10,color:C.textMuted}}>Ageing brackets: 30 / 60 / 90 days  -  change in System Settings → Inventory Thresholds</div>
          </Card>
        </div>
      </div>
      <div style={{padding:"8px 12px",background:C.bgSoft,borderRadius:4,border:`0.5px solid ${C.border}`,fontSize:11,color:C.textMuted}}>
        ℹ Credit due alerts are managed separately in the Payments module. Threshold configuration (low stock level, ageing brackets) is in Admin → System Settings.
      </div>
    </Content>
  </WebLayout>
),

// ------------------------------------------------------------------------
// ORDERS
// ------------------------------------------------------------------------

"W-14": () => (
  <WebLayout activeMenu="Orders">
    <TopBar title="Order List" actions={[{label:"+ New Order",primary:true},{label:"Export"}]}/>
    <Content>
      <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
        {["All","Pending Approval","Approved","Dispatched","Rejected","Cancelled"].map((s,i)=>(
          <span key={i} style={{fontSize:11,padding:"4px 10px",borderRadius:3,border:`0.5px solid ${i===0?C.black:C.border}`,background:i===0?C.black:C.white,color:i===0?C.white:C.textMuted,cursor:"pointer"}}>{s}</span>
        ))}
        <div style={{flex:1}}/>
        <Toggle options={["All","Retail","Wholesale"]} active="All"/>
      </div>
      {/* Status flow note */}
      <div style={{padding:"7px 12px",background:C.bgSoft,border:`0.5px solid ${C.border}`,borderRadius:4,fontSize:11,color:C.textMuted,marginBottom:12}}>
        <strong style={{color:C.text}}>Wholesale flow:</strong> Pending Approval → Approved (stock deducted) → Dispatched  -  or → Rejected (before approval) / Cancelled (after dispatch) &nbsp;|&nbsp;
        <strong style={{color:C.text}}>Retail flow:</strong> Created → Dispatched (no approval needed)  -  or → Cancelled
      </div>
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,overflow:"hidden",background:C.white}}>
        <TH cols={[{v:"Order ID",w:0.8},{v:"Type",w:0.6},{v:"Customer"},{v:"Items",w:0.5},{v:"Value",w:0.8},{v:"Status"},{v:"Payment"},{v:"Date",w:0.6},{v:"",w:0.5}]}/>
        {[
          {id:"#1043",type:"Retail",cust:"Ramesh Traders",items:4,val:"₹3,400",status:"Dispatched",pay:"Paid",date:"04 Apr"},
          {id:"#W-1008",type:"Wholesale",cust:"Suresh Fabrics",items:12,val:"₹18,400",status:"Pending Approval",pay:"Partial Paid",date:"04 Apr"},
          {id:"#1042",type:"Retail",cust:"Deepak & Sons",items:8,val:"₹6,720",status:"Dispatched",pay:"Paid",date:"04 Apr"},
          {id:"#W-1007",type:"Wholesale",cust:"Neha Garments",items:24,val:"₹32,800",status:"Approved",pay:"Partial Paid",date:"03 Apr"},
          {id:"#W-1005",type:"Wholesale",cust:"Asha Fabrics",items:6,val:"₹9,600",status:"Rejected",pay:" - ",date:"02 Apr"},
        ].map((r,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 10px",borderBottom:`0.5px solid ${C.border}`,background:r.status==="Rejected"||r.status==="Cancelled"?C.redLight:C.white}}>
            <div style={{flex:0.8,fontSize:12,fontWeight:600,fontFamily:"monospace"}}>{r.id}</div>
            <div style={{flex:0.6}}><Tag color={r.type==="Retail"?"black":""}>{r.type}</Tag></div>
            <div style={{flex:1,fontSize:12}}>{r.cust}</div>
            <div style={{flex:0.5,fontSize:11,textAlign:"center"}}>{r.items}</div>
            <div style={{flex:0.8,fontSize:12,fontWeight:500}}>{r.val}</div>
            <div style={{flex:1}}><Tag color={r.status==="Pending Approval"?"red":r.status==="Rejected"||r.status==="Cancelled"?"red":r.status==="Approved"||r.status==="Dispatched"?"black":""}>{r.status}</Tag></div>
            <div style={{flex:1}}><Tag color={r.pay.includes("Partial")||r.pay===" - "?"red":r.pay==="Paid"?"black":""}>{r.pay}</Tag></div>
            <div style={{flex:0.6,fontSize:11,color:C.textMuted}}>{r.date}</div>
            <div style={{flex:0.5}}><Btn small>View</Btn></div>
          </div>
        ))}
      </div>
    </Content>
  </WebLayout>
),

"W-15": () => (
  <WebLayout activeMenu="Orders">
    <TopBar title="Order #W-1007  -  Neha Garments" actions={[{label:"Resend LR SMS"},{label:"Record Payment",primary:true},{label:"Print Challan"}]}/>
    <Content>
      <div style={{display:"flex",gap:12}}>
        <div style={{flex:2}}>
          <Card>
            <div style={{display:"flex",gap:14,marginBottom:10,flexWrap:"wrap"}}>
              <div><div style={{fontSize:10,color:C.textMuted,marginBottom:3}}>TYPE</div><Tag>Wholesale</Tag></div>
              <div><div style={{fontSize:10,color:C.textMuted,marginBottom:3}}>STATUS</div><Tag color="black">Approved</Tag></div>
              <div><div style={{fontSize:10,color:C.textMuted,marginBottom:3}}>PAYMENT</div><Tag color="red">Partial Paid</Tag></div>
              <div><div style={{fontSize:10,color:C.textMuted,marginBottom:3}}>DATE</div><span style={{fontSize:12}}>03 Apr 2026</span></div>
              <div><div style={{fontSize:10,color:C.textMuted,marginBottom:3}}>CHALLAN</div><span style={{fontSize:12,fontFamily:"monospace"}}>CH-880</span></div>
            </div>
            {/* Edit lock notice after approval */}
            <div style={{padding:"7px 10px",background:C.bgSoft,borderRadius:4,border:`0.5px solid ${C.border}`,marginBottom:10,fontSize:11,color:C.textMuted}}>
              {"🔒"} Order approved  -  editing is locked. Contact admin to modify if needed. You can still record payments and upload LR.
            </div>
            <Divider label="Line Items"/>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden",marginBottom:10}}>
              <TH cols={[{v:"",w:0.3},{v:"Design"},{v:"SKU",w:1.1},{v:"Clr/Sz",w:0.7},{v:"Qty",w:0.4},{v:"Rate",w:0.7},{v:"Amount",w:0.8}]}/>
              {[
                {name:"Floral Anarkali",sku:"HT-001-RED-M",cs:"Red/M",qty:12,rate:"₹580",amt:"₹6,960"},
                {name:"Solid Kurti",sku:"HT-002-BLU-L",cs:"Blue/L",qty:12,rate:"₹350",amt:"₹4,200"},
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 10px",borderTop:`0.5px solid ${C.border}`,fontSize:11}}>
                  <div style={{flex:0.3,width:22,height:22,background:C.bgSoft,borderRadius:3,border:`0.5px solid ${C.border}`}}/>
                  <div style={{flex:1,fontWeight:500}}>{r.name}</div>
                  <div style={{flex:1.1,fontFamily:"monospace",fontSize:10,color:C.textMuted}}>{r.sku}</div>
                  <div style={{flex:0.7}}>{r.cs}</div>
                  <div style={{flex:0.4,textAlign:"center"}}>{r.qty}</div>
                  <div style={{flex:0.7}}>{r.rate}</div>
                  <div style={{flex:0.8,fontWeight:600}}>{r.amt}</div>
                </div>
              ))}
              <div style={{display:"flex",justifyContent:"flex-end",padding:"7px 10px",borderTop:`0.5px solid ${C.border}`,fontSize:12,fontWeight:700}}>
                Total: ₹32,800
              </div>
            </div>
            <Divider label="LR & CCTV"/>
            <div style={{display:"flex",gap:8,alignItems:"center",padding:"8px 0"}}>
              <div style={{height:52,width:80,background:C.bgSoft,border:`0.5px solid ${C.border}`,borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:C.textLight}}>LR Photo</div>
              <div style={{flex:1}}>
                <div style={{fontSize:11,fontWeight:500}}>LR_CH-880_Neha.jpg</div>
                <div style={{fontSize:10,color:C.textMuted}}>Uploaded 03 Apr · BlueDart</div>
              </div>
              <div style={{display:"flex",gap:6}}><Btn small>View LR ↗</Btn><Btn small>View CCTV ↗</Btn></div>
            </div>
          </Card>
        </div>
        <div style={{flex:1}}>
          <Card>
            <SectionLabel>Customer</SectionLabel>
            <FR label="Business" value="Neha Garments"/>
            <FR label="Contact" value="Neha Shah"/>
            <FR label="Mobile" value="+91 98765 00011"/>
            <FR label="City" value="Surat"/>
            <FR label="Credit Limit" value="₹50,000"/>
            <FR label="Cr. Days" value="30 days"/>
          </Card>
          {/* Payment tracker with grid showing installment history */}
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <SectionLabel>Payment Tracker</SectionLabel>
              <Btn primary small>+ Record Payment</Btn>
            </div>
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              <Metric label="Order Value" value="₹32,800"/>
              <Metric label="Paid" value="₹10,000" green/>
              <Metric label="Balance" value="₹22,800" alert/>
            </div>
            {/* Payment history grid - showing all installments */}
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden",marginBottom:10}}>
              <TH cols={[{v:"Date",w:0.8},{v:"Amount",w:0.8},{v:"Mode"},{v:"Ref",w:0.8},{v:"",w:0.4}]}/>
              {[
                {date:"03 Apr",amt:"₹10,000",mode:"Bank Transfer",ref:"NEFT-001"},
              ].map((p,i)=>(
                <TR key={i} cols={[{v:p.date,w:0.8},{v:p.amt,w:0.8,bold:true,green:true},{v:p.mode},{v:p.ref,w:0.8,mono:true},{v:"✔",w:0.4,red:true}]}/>
              ))}
              <div style={{padding:"6px 10px",background:C.bgSoft,fontSize:11,color:C.textMuted,textAlign:"right",borderTop:`0.5px solid ${C.border}`}}>
                Total paid: <strong>₹10,000</strong> · Balance: <strong style={{color:C.red}}>₹22,800</strong>
              </div>
            </div>
            {/* Record payment inline dialog */}
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,padding:"10px 12px",background:C.bgSoft}}>
              <div style={{fontSize:11,fontWeight:600,marginBottom:8}}>Record Payment</div>
              <Input label="Amount (₹)" placeholder="Enter amount received"/>
              <div style={{display:"flex",gap:10,marginBottom:9}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,color:C.textMuted,marginBottom:3}}>Mode</div>
                  <div style={{display:"flex",gap:5}}>
                    {["Cash","UPI","Bank"].map((m,i)=>(<span key={i} style={{fontSize:10,padding:"3px 8px",border:`0.5px solid ${i===1?C.black:C.border}`,borderRadius:3,background:i===1?C.black:C.white,color:i===1?C.white:C.textMuted,cursor:"pointer"}}>{m}</span>))}
                  </div>
                </div>
              </div>
              {/* Adjustment amount  -  positive (charge extra) or negative (give discount/waive) */}
              <div style={{marginBottom:9}}>
                <div style={{fontSize:11,color:C.textMuted,marginBottom:3,fontWeight:500}}>Adjustment Amount (₹) <span style={{fontWeight:400,fontSize:10}}>(optional)</span></div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <div style={{display:"flex",gap:5,marginBottom:0}}>
                    {["− Deduct","+ Add"].map((t,i)=>(
                      <span key={i} style={{fontSize:10,padding:"3px 10px",border:`0.5px solid ${i===0?C.black:C.border}`,borderRadius:3,background:i===0?C.black:C.white,color:i===0?C.white:C.textMuted,cursor:"pointer"}}>{t}</span>
                    ))}
                  </div>
                  <div style={{flex:1,border:`0.5px solid ${C.border}`,borderRadius:4,padding:"5px 8px",fontSize:12,color:C.textLight,background:C.white}}>0.00</div>
                </div>
                <div style={{fontSize:10,color:C.textMuted,marginTop:3}}>Use to waive small amounts, apply extra charges, or record adjustments. Deducted from / added to balance.</div>
              </div>
              <Input label="Reference / UTR (optional)" placeholder="Transaction ID"/>
              <div style={{marginBottom:9}}>
                <div style={{fontSize:11,color:C.textMuted,marginBottom:3}}>Attachment (optional)</div>
                <div style={{border:`1px dashed ${C.border}`,borderRadius:4,padding:"7px",textAlign:"center",fontSize:11,color:C.textLight}}>Upload screenshot / receipt</div>
              </div>
              <Input label="Remarks" placeholder="e.g. 2nd installment / ₹50 adjusted"/>
              {/* Live balance preview */}
              <div style={{padding:"7px 10px",background:C.white,borderRadius:4,border:`0.5px solid ${C.border}`,marginBottom:8,fontSize:11}}>
                <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:C.textMuted}}>Balance before</span><span>₹22,800</span></div>
                <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:C.textMuted}}>This payment</span><span style={{color:C.green}}>− ₹5,000</span></div>
                <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:C.textMuted}}>Adjustment</span><span style={{color:C.textMuted}}>− ₹0</span></div>
                <div style={{display:"flex",justifyContent:"space-between",fontWeight:700,borderTop:`0.5px solid ${C.border}`,marginTop:4,paddingTop:4}}><span>Remaining balance</span><span style={{color:C.red}}>₹17,800</span></div>
              </div>
              <Btn primary full>Save Payment Record</Btn>
            </div>
          </Card>
        </div>
      </div>
    </Content>
  </WebLayout>
),

// ── RETAIL ORDER ──────────────────────────────
"W-16R": () => (
  <WebLayout activeMenu="Orders" activeScreen="W-16R">
    <TopBar title="Create Retail Order" sub="Walk-in / counter sale  -  no approval needed" actions={[{label:"Save as Draft"},{label:"Submit + Print Challan",primary:true}]}/>
    <Content>
      <div style={{display:"flex",gap:12}}>
        <div style={{flex:2}}>

          {/* Retail: Customer is optional / minimal */}
          <Card>
            <SectionLabel>Step 1  -  Customer (optional for retail)</SectionLabel>
            <div style={{padding:"6px 10px",background:C.bgSoft,borderRadius:4,border:`0.5px solid ${C.border}`,fontSize:11,color:C.textMuted,marginBottom:10}}>
              ℹ Retail customers can walk in without a prior account. Search existing or add name + phone quickly  -  no credit/GST fields needed.
            </div>
            <Input label="Search by name or phone (optional)" placeholder="Type to search existing customers... or leave blank for anonymous sale"/>
            {/* Quick add inline for new retail customer */}
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,padding:"10px 12px",background:C.bgSoft,marginBottom:8}}>
              <div style={{fontSize:11,fontWeight:600,marginBottom:8}}>+ Add New Retail Customer (Quick)</div>
              <div style={{display:"flex",gap:10}}>
                <div style={{flex:1}}><Input label="Customer Name" placeholder="e.g. Ramesh Traders" required/></div>
                <div style={{flex:1}}><Input label="Phone Number" placeholder="+91 98765 43210" required note="For LR SMS"/></div>
              </div>
              <div style={{display:"flex",gap:10}}>
                <div style={{flex:1}}><Input label="City" placeholder="Ahmedabad"/></div>
                <div style={{flex:1.5}}><Input label="Address (optional)" placeholder="Shop / area address"/></div>
              </div>
            </div>
            {/* Confirmed retail customer */}
            <div style={{padding:"10px 12px",background:C.greenLight,border:`0.5px solid ${C.greenBorder}`,borderRadius:6}}>
              <div style={{fontSize:12,fontWeight:600,color:C.green}}>✔ Ramesh Traders  -  +91 76543 21098</div>
              <div style={{fontSize:11,color:C.textMuted}}>Retail Customer · Ahmedabad</div>
            </div>
          </Card>

          {/* Item scanning  -  retail uses retail price */}
          <Card>
            <SectionLabel>Step 2  -  Scan / Add Items</SectionLabel>
            <div style={{padding:"7px 10px",background:C.bgSoft,borderRadius:4,border:`0.5px solid ${C.border}`,fontSize:11,color:C.textMuted,marginBottom:10}}>
              Items priced at <strong>Retail Price</strong>. Manual discount per item available below.
            </div>
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              <div style={{flex:1,border:`0.5px solid ${C.border}`,borderRadius:4,padding:"7px 10px",fontSize:12,color:C.textLight,background:C.white}}>Scan child SKU barcode or search design name...</div>
              <Btn>⊙ Scan</Btn>
            </div>
            {/* Scanned item */}
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,padding:"10px 12px",background:C.bgSoft,marginBottom:10}}>
              <div style={{display:"flex",gap:12}}>
                <div style={{width:52,height:60,background:C.white,borderRadius:4,border:`0.5px solid ${C.border}`,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:C.textLight}}>IMG</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600}}>Floral Anarkali</div>
                  <div style={{fontSize:11,color:C.textMuted}}>HT-001 · Georgette</div>
                  <div style={{fontSize:12,marginTop:2}}>Retail Price: <strong>₹850</strong></div>
                  <div style={{display:"flex",gap:4,marginTop:5}}>
                    {["Red ●","Blue","Black"].map((c,i)=>(<span key={i} style={{fontSize:10,padding:"2px 7px",border:`0.5px solid ${i===0?C.black:C.border}`,borderRadius:3,background:i===0?C.black:C.white,color:i===0?C.white:C.textMuted}}>{c}</span>))}
                  </div>
                  <div style={{display:"flex",gap:4,marginTop:4}}>
                    {["S","M ●","L","XL"].map((s,i)=>(<span key={i} style={{fontSize:10,padding:"2px 7px",border:`0.5px solid ${i===1?C.black:C.border}`,borderRadius:3,background:i===1?C.black:C.white,color:i===1?C.white:C.textMuted}}>{s}</span>))}
                  </div>
                  <div style={{fontSize:11,marginTop:4}}>Stock Red/M: <strong>24 pcs</strong> ✔</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}>
                  <Input label="Qty" placeholder="1"/>
                  <Input label="Disc %" placeholder="0"/>
                  <Btn primary small>+ Add</Btn>
                </div>
              </div>
            </div>
            {/* Line items  -  retail has per-item manual discount */}
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden"}}>
              <TH cols={[{v:"Design"},{v:"SKU",w:1},{v:"Var",w:0.7},{v:"Qty",w:0.4},{v:"Retail ₹",w:0.7},{v:"Disc%",w:0.5},{v:"Amount",w:0.8},{v:"",w:0.3}]}/>
              {[
                {n:"Floral Anarkali",sku:"HT-001-RED-M",v:"Red/M",q:1,r:"₹850",d:"0%",a:"₹850"},
                {n:"Solid Kurti",sku:"HT-002-BLU-L",v:"Blue/L",q:2,r:"₹490",d:"0%",a:"₹980"},
              ].map((r,i)=>(
                <TR key={i} cols={[{v:r.n},{v:r.sku,w:1,mono:true},{v:r.v,w:0.7},{v:r.q,w:0.4,bold:true},{v:r.r,w:0.7},{v:r.d,w:0.5},{v:r.a,w:0.8,bold:true},{v:"✔",w:0.3,red:true}]}/>
              ))}
            </div>
          </Card>

          {/* Payment  -  retail is typically paid immediately */}
          <Card>
            <SectionLabel>Step 3  -  Payment</SectionLabel>
            <div style={{padding:"10px 12px",background:C.bgSoft,borderRadius:6,border:`0.5px solid ${C.border}`,marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}><span>Order Total</span><strong>₹1,830</strong></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.textMuted}}><span>Manual Discounts</span><span style={{color:C.green}}>−₹0</span></div>
            </div>
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              {["Cash ●","UPI","Bank Transfer"].map((m,i)=>(<span key={i} style={{fontSize:11,padding:"6px 12px",border:`0.5px solid ${i===0?C.black:C.border}`,borderRadius:4,background:i===0?C.black:C.white,color:i===0?C.white:C.textMuted,cursor:"pointer"}}>{m}</span>))}
            </div>
            <div style={{display:"flex",gap:10}}>
              <div style={{flex:1}}><Input label="Amount Received (₹)" placeholder="₹1,830" note="Full amount typical for retail"/></div>
              <div style={{flex:1}}><Input label="Reference (optional)" placeholder="UPI / Cash  -  leave blank if cash"/></div>
            </div>
            <div style={{padding:"7px 10px",background:C.bgSoft,border:`0.5px solid ${C.border}`,borderRadius:4,fontSize:11,color:C.textMuted}}>
              ℹ Retail orders do <strong>not</strong> require approval  -  submitted order is immediately dispatched. Challan printed on submit.
            </div>
          </Card>

        </div>
        <div style={{flex:1}}>
          <Card>
            <SectionLabel>Order Summary  -  Retail</SectionLabel>
            <FR label="Type" value="Retail"/><FR label="Customer" value="Ramesh Traders"/><FR label="Total Items" value="3 pcs"/>
            <FR label="Order Total" value="₹1,830" bold/><FR label="Paid Now" value="₹1,830"/><FR label="Balance" value="₹0"/>
            <Divider/>
            <Btn primary full>Submit + Print Challan →</Btn>
            <div style={{marginTop:6}}><Btn full>Save as Draft</Btn></div>
          </Card>
          <Card>
            <SectionLabel>Retail Flow  -  What Happens</SectionLabel>
            <div style={{fontSize:11}}>
              {[
                {step:"Order Created",note:"Challan printed immediately",done:true},
                {step:"No Approval Needed",note:"Retail goes straight to dispatch",done:true},
                {step:"Stock Deducted",note:"On order creation",done:true},
                {step:"Dispatched",note:"Staff dispatches & uploads LR",done:false},
              ].map((f,i)=>(
                <div key={i} style={{display:"flex",gap:8,padding:"5px 0",borderBottom:`0.5px solid ${C.border}`}}>
                  <span style={{color:f.done?C.green:C.textMuted}}>{f.done?"✔":"◷"}</span>
                  <div><div style={{fontWeight:500}}>{f.step}</div><div style={{fontSize:10,color:C.textMuted}}>{f.note}</div></div>
                </div>
              ))}
            </div>
          </Card>
          <Card style={{border:`0.5px solid ${C.border}`,background:C.bgSoft}}>
            <div style={{fontSize:10,fontWeight:700,color:C.textMuted,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.06em"}}>Fields unique to Retail</div>
            <div style={{fontSize:11,color:C.text}}>
              <div style={{padding:"3px 0",borderBottom:`0.5px solid ${C.border}`}}>✔ Customer is optional (anonymous ok)</div>
              <div style={{padding:"3px 0",borderBottom:`0.5px solid ${C.border}`}}>✔ Retail price applied automatically</div>
              <div style={{padding:"3px 0",borderBottom:`0.5px solid ${C.border}`}}>✔ Per-item manual discount</div>
              <div style={{padding:"3px 0",borderBottom:`0.5px solid ${C.border}`}}>✔ Payment expected at counter</div>
              <div style={{padding:"3px 0"}}>✗ No credit terms / credit limit check</div>
            </div>
          </Card>
        </div>
      </div>
    </Content>
  </WebLayout>
),

// ── WHOLESALE ORDER ──────────────────────────────
"W-16W": () => (
  <WebLayout activeMenu="Orders" activeScreen="W-16W">
    <TopBar title="Create Wholesale Order" sub="Registered dealer  -  goes to approval queue" actions={[{label:"Save as Draft"},{label:"Submit Order + Print Challan",primary:true}]}/>
    <Content>
      <div style={{display:"flex",gap:12}}>
        <div style={{flex:2}}>

          {/* Wholesale: Customer must be pre-registered with full profile */}
          <Card>
            <SectionLabel>Step 1  -  Select Wholesale Customer</SectionLabel>
            <div style={{padding:"6px 10px",background:C.bgSoft,borderRadius:4,border:`0.5px solid ${C.border}`,fontSize:11,color:C.textMuted,marginBottom:10}}>
              ℹ Wholesale customer must be registered with full business profile, credit limit, and GST. New customers → Admin → Create Customer (W-35) first.
            </div>
            <Input label="Search by business name or phone" placeholder="Type to search registered wholesale dealers..." required note="Only pre-registered wholesale accounts appear here"/>
            {/* Dropdown */}
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,background:C.white,marginBottom:8,overflow:"hidden"}}>
              {[
                {name:"Neha Garments",contact:"Neha Shah",phone:"+91 98765 00011",city:"Ahmedabad",bal:"₹22,800",limit:"₹50,000"},
                {name:"Neha Textiles",contact:"Neha Patel",phone:"+91 91234 99999",city:"Surat",bal:"₹0",limit:"₹30,000"},
              ].map((c,i)=>(
                <div key={i} style={{padding:"8px 12px",borderBottom:`0.5px solid ${C.border}`,cursor:"pointer",background:i===0?C.bgSoft:C.white}}>
                  <div style={{fontSize:12,fontWeight:i===0?600:400}}>{c.name} <span style={{fontSize:10,color:C.textMuted}}>· {c.phone} · {c.city}</span></div>
                  <div style={{fontSize:11,color:C.textMuted}}>{c.contact} · Balance: <span style={{color:c.bal!=="₹0"?C.red:C.text}}>{c.bal}</span> · Limit: {c.limit}</div>
                </div>
              ))}
              <div style={{padding:"8px 12px",background:"#1a1a1a",display:"flex",alignItems:"center",gap:8}}>
                <span style={{color:C.white,fontSize:12,fontWeight:600}}>+ Register New Wholesale Customer →</span>
                <span style={{fontSize:10,color:"#aaa"}}>Redirects to W-35 with name pre-filled</span>
              </div>
            </div>
            {/* Selected  -  shows full account info including credit standing */}
            <div style={{padding:"10px 12px",background:C.greenLight,border:`0.5px solid ${C.greenBorder}`,borderRadius:6}}>
              <div style={{fontSize:12,fontWeight:600,color:C.green}}>✔ Neha Garments  -  Neha Shah</div>
              <div style={{display:"flex",gap:14,marginTop:6,flexWrap:"wrap"}}>
                <span style={{fontSize:11,color:C.textMuted}}>City: Ahmedabad</span>
                <span style={{fontSize:11,color:C.textMuted}}>GST: 22XXXXX001</span>
                <span style={{fontSize:11,color:C.textMuted}}>Credit: 30 days</span>
                <span style={{fontSize:11,color:C.textMuted}}>Limit: ₹50,000</span>
                <span style={{fontSize:11,color:C.red,fontWeight:600}}>Balance Due: ₹22,800</span>
                <span style={{fontSize:11,color:C.green,fontWeight:600}}>Discount: 5%</span>
              </div>
            </div>
          </Card>

          {/* Item scanning  -  wholesale uses wholesale price + customer discount */}
          <Card>
            <SectionLabel>Step 2  -  Scan / Add Items</SectionLabel>
            <div style={{padding:"7px 10px",background:C.bgSoft,borderRadius:4,border:`0.5px solid ${C.border}`,fontSize:11,color:C.textMuted,marginBottom:10}}>
              Items priced at <strong>Wholesale Price</strong>. Customer's 5% discount auto-applied to all items.
            </div>
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              <div style={{flex:1,border:`0.5px solid ${C.border}`,borderRadius:4,padding:"7px 10px",fontSize:12,color:C.textLight,background:C.white}}>Scan child SKU barcode or search design name...</div>
              <Btn>⊙ Scan</Btn>
            </div>
            {/* Scanned preview  -  shows wholesale price + auto discount */}
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,padding:"10px 12px",background:C.bgSoft,marginBottom:10}}>
              <div style={{display:"flex",gap:12}}>
                <div style={{width:52,height:60,background:C.white,borderRadius:4,border:`0.5px solid ${C.border}`,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:C.textLight}}>IMG</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600}}>Floral Anarkali</div>
                  <div style={{fontSize:11,color:C.textMuted}}>HT-001 · Georgette</div>
                  <div style={{fontSize:12,marginTop:2}}>Wholesale: <strong>₹580</strong> · After 5% discount: <strong style={{color:C.green}}>₹551</strong></div>
                  <div style={{display:"flex",gap:4,marginTop:5}}>
                    {["Red ●","Blue","Black"].map((c,i)=>(<span key={i} style={{fontSize:10,padding:"2px 7px",border:`0.5px solid ${i===0?C.black:C.border}`,borderRadius:3,background:i===0?C.black:C.white,color:i===0?C.white:C.textMuted}}>{c}</span>))}
                  </div>
                  <div style={{display:"flex",gap:4,marginTop:4}}>
                    {["S","M ●","L","XL"].map((s,i)=>(<span key={i} style={{fontSize:10,padding:"2px 7px",border:`0.5px solid ${i===1?C.black:C.border}`,borderRadius:3,background:i===1?C.black:C.white,color:i===1?C.white:C.textMuted}}>{s}</span>))}
                  </div>
                  <div style={{fontSize:11,marginTop:4}}>Stock Red/M: <strong>24 pcs</strong> ✔</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}>
                  <Input label="Qty" placeholder="6"/>
                  <Btn primary small>+ Add</Btn>
                </div>
              </div>
            </div>
            {/* Line items  -  wholesale shows wholesale price + auto customer discount */}
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden"}}>
              <TH cols={[{v:"Design"},{v:"SKU",w:1},{v:"Var",w:0.7},{v:"Qty",w:0.4},{v:"W/S ₹",w:0.7},{v:"Disc%",w:0.5},{v:"Net ₹",w:0.8},{v:"Amount",w:0.8},{v:"",w:0.3}]}/>
              {[
                {n:"Floral Anarkali",sku:"HT-001-RED-M",v:"Red/M",q:6,ws:"₹580",d:"5%",net:"₹551",a:"₹3,306"},
                {n:"Solid Kurti",sku:"HT-002-BLU-L",v:"Blue/L",q:4,ws:"₹350",d:"5%",net:"₹332.50",a:"₹1,330"},
              ].map((r,i)=>(
                <TR key={i} cols={[{v:r.n},{v:r.sku,w:1,mono:true},{v:r.v,w:0.7},{v:r.q,w:0.4,bold:true},{v:r.ws,w:0.7},{v:r.d,w:0.5,green:true},{v:r.net,w:0.8},{v:r.a,w:0.8,bold:true},{v:"✔",w:0.3,red:true}]}/>
              ))}
            </div>
          </Card>

          {/* Payment  -  wholesale may be credit / partial */}
          <Card>
            <SectionLabel>Step 3  -  Payment Terms</SectionLabel>
            <div style={{padding:"10px 12px",background:C.bgSoft,borderRadius:6,border:`0.5px solid ${C.border}`,marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}><span>Gross Total</span><strong>₹4,880</strong></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3,color:C.textMuted}}><span>Customer Discount (5%)</span><span style={{color:C.green}}>−₹244</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}><span style={{fontWeight:600}}>Net Order Value</span><strong>₹4,636</strong></div>
              <div style={{borderTop:`0.5px solid ${C.border}`,marginTop:6,paddingTop:6,display:"flex",justifyContent:"space-between",fontSize:12,color:C.textMuted}}><span>Existing Balance Due</span><span style={{color:C.red,fontWeight:600}}>₹22,800</span></div>
            </div>
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              {["Bank Transfer ●","UPI","Cash","Credit (No payment now)"].map((m,i)=>(<span key={i} style={{fontSize:10,padding:"5px 10px",border:`0.5px solid ${i===0?C.black:C.border}`,borderRadius:4,background:i===0?C.black:C.white,color:i===0?C.white:C.textMuted,cursor:"pointer"}}>{m}</span>))}
            </div>
            <div style={{display:"flex",gap:10}}>
              <div style={{flex:1}}><Input label="Amount Paid Now (₹)" placeholder="₹ 0  -  full credit allowed" note="0 = Unpaid · Partial = Partial Paid · Full = Paid"/></div>
              <div style={{flex:1}}><Input label="Payment Reference" placeholder="UTR / Cheque no. (optional)"/></div>
            </div>
            <div style={{padding:"7px 10px",background:"#fff8e1",border:`0.5px solid #f5c842`,borderRadius:4,fontSize:11,color:"#7a5c00"}}>
              ⚠ This order goes to <strong>Approval Queue</strong> after submission. Stock is reserved but <strong>not deducted</strong> until approved by admin/manager.
            </div>
          </Card>

          {/* Wholesale-only: Challan & Logistics */}
          <Card>
            <SectionLabel>Step 4  -  Challan & Logistics (Wholesale only)</SectionLabel>
            <div style={{display:"flex",gap:10}}>
              <div style={{flex:1}}><Input label="Broker Name" placeholder="Broker (if applicable)"/></div>
              <div style={{flex:1}}><Input label="Transport / Carrier" placeholder="Customer's preferred transport"/></div>
            </div>
            <Input label="Special Instructions (optional)" placeholder="e.g. dispatch only after full payment, fragile items..."/>
          </Card>

        </div>
        <div style={{flex:1}}>
          <Card>
            <SectionLabel>Order Summary  -  Wholesale</SectionLabel>
            <FR label="Type" value="Wholesale"/><FR label="Customer" value="Neha Garments"/>
            <FR label="City" value="Ahmedabad"/><FR label="GST" value="22XXXXX001"/>
            <FR label="Total Items" value="10 pcs"/>
            <FR label="Gross Value" value="₹4,880"/>
            <FR label="Discount (5%)" value="−₹244" bold/>
            <FR label="Net Order Value" value="₹4,636" bold/>
            <FR label="Paid Now" value="₹0"/><FR label="Balance This Order" value="₹4,636" accent/>
            <Divider/>
            <Btn primary full>Submit Order + Print Challan →</Btn>
            <div style={{marginTop:6}}><Btn full>Save as Draft</Btn></div>
          </Card>
          <Card>
            <SectionLabel>Wholesale Flow  -  What Happens</SectionLabel>
            <div style={{fontSize:11}}>
              {[
                {step:"Order Submitted",note:"Draft challan created, order ID assigned",done:true},
                {step:"Approval Queue",note:"Admin / manager reviews & approves",done:false},
                {step:"Stock Deducted",note:"Only after approval",done:false},
                {step:"Picking & Dispatch",note:"Godown staff picks, CCTV records",done:false},
                {step:"LR Uploaded",note:"Auto SMS to customer with LR link",done:false},
              ].map((f,i)=>(
                <div key={i} style={{display:"flex",gap:8,padding:"5px 0",borderBottom:`0.5px solid ${C.border}`}}>
                  <span style={{color:f.done?C.green:C.textMuted}}>{f.done?"✔":"◷"}</span>
                  <div><div style={{fontWeight:500}}>{f.step}</div><div style={{fontSize:10,color:C.textMuted}}>{f.note}</div></div>
                </div>
              ))}
            </div>
          </Card>
          <Card style={{background:C.bgSoft}}>
            <div style={{fontSize:10,fontWeight:700,color:C.textMuted,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.06em"}}>Fields unique to Wholesale</div>
            <div style={{fontSize:11,color:C.text}}>
              <div style={{padding:"3px 0",borderBottom:`0.5px solid ${C.border}`}}>✔ Pre-registered customer mandatory</div>
              <div style={{padding:"3px 0",borderBottom:`0.5px solid ${C.border}`}}>✔ Wholesale price + auto discount</div>
              <div style={{padding:"3px 0",borderBottom:`0.5px solid ${C.border}`}}>✔ Credit terms, limit & balance check</div>
              <div style={{padding:"3px 0",borderBottom:`0.5px solid ${C.border}`}}>✔ GST visible on challan</div>
              <div style={{padding:"3px 0",borderBottom:`0.5px solid ${C.border}`}}>✔ Broker & transport fields</div>
              <div style={{padding:"3px 0",borderBottom:`0.5px solid ${C.border}`}}>✔ Credit / partial payment option</div>
              <div style={{padding:"3px 0"}}>✔ Requires admin approval before dispatch</div>
            </div>
          </Card>
        </div>
      </div>
    </Content>
  </WebLayout>
),

"W-34": () => (
  <WebLayout activeMenu="Orders">
    <TopBar title="Wholesale Approval Queue" actions={[{label:"Approve Selected",primary:true}]}/>
    <Content>
      <div style={{display:"flex",gap:10,marginBottom:14}}>
        <Metric label="Pending Approval" value="4" alert/>
        <Metric label="Approved Today" value="11"/>
        <Metric label="Pending Value" value="₹74,200" alert/>
        <Metric label="Avg Approval Time" value="18 min"/>
      </div>
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,overflow:"hidden",background:C.white,marginBottom:14}}>
        <TH cols={[{v:"",w:0.2},{v:"Order",w:0.8},{v:"Customer"},{v:"Items",w:0.5},{v:"Value",w:0.8},{v:"Submitted By"},{v:"Stock Status"},{v:"Actions",w:1.4}]}/>
        {[
          {id:"#W-1008",cust:"Ramesh Traders",items:12,val:"₹18,400",by:"Priya (Office)",stock:"All available",urgent:true},
          {id:"#W-1007",cust:"Suresh Fabrics",items:8,val:"₹11,200",by:"Raju (Mobile)",stock:"All available",urgent:false},
          {id:"#W-1006",cust:"Deepak Wholesale",items:24,val:"₹32,800",by:"Priya (Office)",stock:"2 SKUs low",urgent:false},
        ].map((r,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 10px",borderTop:`0.5px solid ${C.border}`,background:r.urgent?C.redLight:C.white}}>
            <input type="checkbox" style={{flex:"0 0 auto"}}/>
            <div style={{flex:0.8,fontSize:12,fontWeight:600,fontFamily:"monospace"}}>{r.id}{r.urgent&&<span style={{marginLeft:6}}><Tag color="red">Urgent</Tag></span>}</div>
            <div style={{flex:1,fontSize:12}}>{r.cust}</div>
            <div style={{flex:0.5,fontSize:12,textAlign:"center"}}>{r.items}</div>
            <div style={{flex:0.8,fontSize:12,fontWeight:600}}>{r.val}</div>
            <div style={{flex:1,fontSize:11,color:C.textMuted}}>{r.by}</div>
            <div style={{flex:1}}><Tag color={r.stock.includes("low")?"red":"black"}>{r.stock}</Tag></div>
            <div style={{flex:1.4,display:"flex",gap:5}}>
              <Btn small>View Items</Btn>
              <Btn primary small>✔ Approve</Btn>
              <Btn danger small>✔</Btn>
            </div>
          </div>
        ))}
      </div>
    </Content>
  </WebLayout>
),

// ------------------------------------------------------------------------
// DISPATCH & LOGISTICS
// ------------------------------------------------------------------------

"W-17": () => (
  <WebLayout activeMenu="Dispatch">
    <TopBar title="LR Management Console" actions={[{label:"Resend Selected",primary:true},{label:"Export"}]}/>
    <Content>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <div style={{flex:1,border:`0.5px solid ${C.border}`,borderRadius:4,padding:"7px 10px",fontSize:12,color:C.textLight,background:C.white}}>Search by Order ID / Challan number / Customer name...</div>
        <Btn small>SMS Status ▾</Btn><Btn small>Date ▾</Btn>
      </div>
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,overflow:"hidden",background:C.white}}>
        <TH cols={[{v:"Order",w:0.8},{v:"Challan",w:0.8},{v:"Customer"},{v:"LR Doc",w:0.6},{v:"SMS Status",w:0.9},{v:"Actions",w:1.4}]}/>
        {[
          {order:"#1042",ch:"CH-881",cust:"Suresh Fabrics",doc:"Photo",sms:"Delivered"},
          {order:"#1041",ch:"CH-880",cust:"Deepak & Sons",doc:"PDF",sms:"Sent"},
          {order:"#1040",ch:"CH-879",cust:"Neha Garments",doc:" - ",sms:"Not sent"},
        ].map((r,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 10px",borderTop:`0.5px solid ${C.border}`,background:r.sms==="Not sent"?C.redLight:C.white}}>
            <div style={{flex:0.8,fontWeight:600,fontFamily:"monospace",fontSize:12}}>{r.order}</div>
            <div style={{flex:0.8,fontFamily:"monospace",fontSize:11,color:C.textMuted}}>{r.ch}</div>
            <div style={{flex:1,fontSize:12}}>{r.cust}</div>
            <div style={{flex:0.6}}><Tag color={r.doc===" - "?"red":""}>{r.doc}</Tag></div>
            <div style={{flex:0.9}}><Tag color={r.sms==="Not sent"?"red":r.sms==="Delivered"?"black":""}>{r.sms}</Tag></div>
            <div style={{flex:1.4,display:"flex",gap:5}}>
              <Btn small>View LR</Btn>
              <Btn small>Order Detail</Btn>
              {r.sms!=="Delivered"&&<Btn danger small>Resend SMS</Btn>}
            </div>
          </div>
        ))}
      </div>
    </Content>
  </WebLayout>
),

"W-18": () => (
  <WebLayout activeMenu="Dispatch">
    <TopBar title="LR Detail  -  Order #1042" actions={[{label:"Resend SMS"},{label:"Download LR",primary:true}]}/>
    <Content>
      <div style={{display:"flex",gap:12}}>
        <div style={{flex:1.4}}>
          <Card>
            <div style={{height:220,background:C.bgSoft,borderRadius:6,border:`0.5px solid ${C.border}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",marginBottom:8}}>
              <div style={{fontSize:24}}>{"📄"}</div>
              <div style={{fontSize:12,color:C.textMuted,marginTop:6}}>LR_CH-881_Suresh_Fabrics.jpg</div>
              <div style={{fontSize:10,color:C.textLight}}>Uploaded 04 Apr 09:45 · 2.3 MB</div>
            </div>
          </Card>
        </div>
        <div style={{flex:1}}>
          <Card>
            <SectionLabel>LR Details</SectionLabel>
            <FR label="Order ID" value="#1042"/><FR label="Challan No." value="CH-881"/>
            <FR label="LR Ref." value="BD-2026-4458812" bold/><FR label="Dispatched By" value="Raju"/><FR label="Time" value="04 Apr 09:45"/>
          </Card>
          <Card>
            <SectionLabel>SMS Delivery Log</SectionLabel>
            {[{e:"SMS Generated",t:"09:45:03"},{e:"Sent to Gateway",t:"09:45:05"},{e:"Delivered",t:"09:45:18"}].map((e,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:11,padding:"5px 0",borderBottom:`0.5px solid ${C.border}`}}>
                <span>{e.e}</span><span style={{color:C.textMuted}}>{e.t}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </Content>
  </WebLayout>
),

"W-19": () => (
  <WebLayout activeMenu="Dispatch">
    <TopBar title="Logistics Status Tracker  -  REMOVED"/>
    <Content>
      <Card red>
        <div style={{fontSize:13,fontWeight:600,color:C.red,marginBottom:8}}>⚠ This screen has been removed</div>
        <div style={{fontSize:11,color:C.textMuted}}>
          The separate Logistics Tracker module has been discontinued per the updated spec.<br/><br/>
          Order dispatch status is now tracked via:<br/>
          • <strong>Order List (W-14)</strong>  -  status column shows Approved / Dispatched / Cancelled / Rejected<br/>
          • <strong>Order Detail (W-15)</strong>  -  full order status and LR upload<br/>
          • <strong>LR Console (W-17)</strong>  -  upload and resend LR SMS per dispatch
        </div>
      </Card>
    </Content>
  </WebLayout>
),

// ------------------------------------------------------------------------
// PAYMENTS
// ------------------------------------------------------------------------

"W-20": () => (
  <WebLayout activeMenu="Payments">
    <TopBar title="Payment Records" sub="Outstanding balances prioritised by credit limit usage"/>
    <Content>
      <div style={{display:"flex",gap:10,marginBottom:14}}>
        <Metric label="Total Outstanding" value="₹1.2L" alert/>
        <Metric label="Credit Limit Breached" value="2" alert/>
        <Metric label="Due This Week" value="₹44,200" alert/>
        <Metric label="Today Collections" value="₹32,000" green/>
        <Metric label="Today UPI" value="₹52,200" green/>
      </div>
      {/* Search */}
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <div style={{flex:1,border:`0.5px solid ${C.border}`,borderRadius:4,padding:"7px 10px",fontSize:12,color:C.textLight,background:C.white}}>Search by customer name or order ID...</div>
        <Btn small>All Status ▾</Btn><Btn small>Date ▾</Btn>
      </div>
      {/* Explanation note */}
      <div style={{padding:"7px 12px",background:C.bgSoft,border:`0.5px solid ${C.border}`,borderRadius:4,fontSize:11,color:C.textMuted,marginBottom:12}}>
        ℹ Customers with credit limit almost exhausted or overdue appear at top. Click <strong>Add Payment</strong> to record a payment  -  or open Order Detail to view full history.
      </div>
      {/* Payment records list - prioritised */}
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,overflow:"hidden",background:C.white}}>
        <TH cols={[{v:"Customer"},{v:"Order",w:0.8},{v:"Order Value",w:0.9},{v:"Paid",w:0.8},{v:"Balance",w:0.8},{v:"Credit Limit",w:0.9},{v:"Days Outstanding",w:1},{v:"Actions",w:1.2}]}/>
        {[
          {cust:"Deepak Wholesale",order:"#W-1006",val:"₹32,800",paid:"₹0",bal:"₹32,800",limit:"₹30,000",days:"Overdue 3d",breach:true},
          {cust:"Ramesh Traders",order:"#W-1004",val:"₹18,400",paid:"₹10,000",bal:"₹8,400",limit:"₹30,000",days:"Due tomorrow",breach:false},
          {cust:"Neha Garments",order:"#W-1007",val:"₹32,800",paid:"₹10,000",bal:"₹22,800",limit:"₹50,000",days:"12 days",breach:false},
          {cust:"Suresh Fabrics",order:"#W-1002",val:"₹11,200",paid:"₹5,000",bal:"₹6,200",limit:"₹50,000",days:"8 days",breach:false},
        ].map((r,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 10px",borderTop:`0.5px solid ${C.border}`,background:r.breach?C.redLight:C.white}}>
            <div style={{flex:1,fontSize:12,fontWeight:500}}>{r.cust}{r.breach&&<span style={{marginLeft:6}}><Tag color="red">Limit Exceeded</Tag></span>}</div>
            <div style={{flex:0.8,fontFamily:"monospace",fontSize:11,color:C.textMuted}}>{r.order}</div>
            <div style={{flex:0.9,fontSize:12}}>{r.val}</div>
            <div style={{flex:0.8,fontSize:12,color:C.green,fontWeight:500}}>{r.paid}</div>
            <div style={{flex:0.8,fontSize:12,color:C.red,fontWeight:700}}>{r.bal}</div>
            <div style={{flex:0.9,fontSize:11,color:C.textMuted}}>{r.limit}</div>
            <div style={{flex:1}}><Tag color={r.breach||r.days.includes("tomorrow")?"red":""}>{r.days}</Tag></div>
            <div style={{flex:1.2,display:"flex",gap:5}}>
              <Btn small>Order Detail ↗</Btn>
            </div>
          </div>
        ))}
      </div>
      <div style={{marginTop:8,fontSize:11,color:C.textMuted}}>
        To record a payment: open Order Detail → click <strong>Record Payment</strong>. Payments recorded there auto-update this list.
      </div>
    </Content>
  </WebLayout>
),

// ------------------------------------------------------------------------
// CCTV
// ------------------------------------------------------------------------

"W-21": ({ onNavigate }) => {
  const [tab, setTab] = useState("Record New Dispatch");
  return (
    <WebLayout activeMenu="CCTV">
      <TopBar title="CCTV Console" sub="Dispatch video recording & footage library"/>
      <Content pad={false}>
        <Tabs tabs={["Record New Dispatch","Footage Library"]} active={tab} onChange={setTab}/>
        {tab === "Record New Dispatch" ? (
          <div style={{padding:16}}>
            <div style={{display:"flex",gap:12}}>
              <div style={{flex:1}}>
                <Card>
                  <SectionLabel>Step 1  -  Identify Order</SectionLabel>
                  <div style={{display:"flex",gap:8,marginBottom:10}}>
                    <div style={{flex:1}}><Input label="Order ID / Challan Number" placeholder="Scan label or type Order ID..." mono note="Scan the printed Order ID label at dispatch station"/></div>
                    <div style={{paddingTop:18}}><Btn>⊙ Scan</Btn></div>
                  </div>
                  <div style={{padding:"10px 12px",background:C.greenLight,border:`0.5px solid ${C.greenBorder}`,borderRadius:6,marginBottom:8}}>
                    <div style={{fontSize:12,fontWeight:600,color:C.green}}>✔ Order Found  -  #1043</div>
                    <div style={{fontSize:12,marginTop:2}}>Ramesh Traders · 4 items · ₹3,400</div>
                    <div style={{fontSize:11,color:C.textMuted}}>Challan: CH-882 · Dispatching to Mumbai</div>
                  </div>
                  <div style={{display:"flex",gap:8,marginBottom:12}}>
                    <Btn small>🖨 Print Label</Btn>
                    <span style={{fontSize:10,color:C.textMuted,alignSelf:"center"}}>Prints order ID label for dispatch station scanning</span>
                  </div>
                  <SectionLabel>Step 2  -  Camera</SectionLabel>
                  <div style={{display:"flex",gap:8,marginBottom:12}}>
                    {["CAM-1 (Dispatch A) ●","CAM-2 (Dispatch B)"].map((c,i)=>(
                      <div key={i} style={{flex:1,padding:"8px 12px",border:`0.5px solid ${i===0?C.black:C.border}`,borderRadius:4,background:i===0?C.black:C.white,color:i===0?C.white:C.textMuted,fontSize:11,textAlign:"center",cursor:"pointer"}}>{c}</div>
                    ))}
                  </div>
                  <SectionLabel>Step 3  -  Recording Controls</SectionLabel>
                  <div style={{padding:"14px",background:C.bgSoft,borderRadius:6,border:`0.5px solid ${C.border}`,textAlign:"center",marginBottom:10}}>
                    <div style={{fontSize:11,color:C.textMuted,marginBottom:10}}>Ready to record · CAM-1 live</div>
                    <Btn success>▶ Start Recording</Btn>
                  </div>
                  <div style={{padding:"14px",background:C.black,borderRadius:6,textAlign:"center"}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:8}}>
                      <div style={{width:10,height:10,borderRadius:"50%",background:C.red}}/>
                      <span style={{color:C.white,fontSize:12,fontWeight:600}}>RECORDING · 01:24</span>
                    </div>
                    <div style={{fontSize:11,color:"#888",marginBottom:10}}>Order #1043 · CAM-1 · 04 Apr 09:45</div>
                    <Btn danger>◼ Stop & Save Recording</Btn>
                  </div>
                  <div style={{marginTop:8,fontSize:10,color:C.textMuted}}>On stop: clip is saved and automatically linked to Order #1043 · Challan CH-882</div>
                </Card>
              </div>
              <div style={{flex:1}}>
                <Card>
                  <SectionLabel>Recently Recorded</SectionLabel>
                  {[
                    {order:"#1042",ch:"CH-881",cust:"Suresh Fabrics",time:"09:45",dur:"3m 22s",cam:"CAM-1"},
                    {order:"#1041",ch:"CH-880",cust:"Deepak & Sons",time:"11:20",dur:"2m 48s",cam:"CAM-2"},
                  ].map((v,i)=>(
                    <div key={i} style={{border:`0.5px solid ${C.border}`,borderRadius:6,overflow:"hidden",marginBottom:10}}>
                      <div style={{height:70,background:C.black,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <div style={{textAlign:"center",color:"#666"}}>
                          <div style={{fontSize:16}}>▶</div>
                          <div style={{fontSize:9,marginTop:2}}>{v.cam} · 04 Apr {v.time} · {v.dur}</div>
                        </div>
                      </div>
                      <div style={{padding:"8px 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div>
                          <div style={{fontSize:12,fontWeight:600,fontFamily:"monospace"}}>{v.order}</div>
                          <div style={{fontSize:11,color:C.textMuted}}>{v.cust} · {v.ch}</div>
                        </div>
                        <Btn small onClick={()=>onNavigate&&onNavigate("W-22")}>View →</Btn>
                      </div>
                    </div>
                  ))}
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <div style={{padding:16}}>
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              <Input label="Search by Order / Challan" placeholder="Type Order ID or Challan..." mono wide/>
              <div style={{paddingTop:18}}><Btn small>Filter</Btn></div>
            </div>
            <Card>
              <SectionLabel>Footage Library</SectionLabel>
              <TH cols={[{v:"Preview"},{v:"Order ID"},{v:"Customer"},{v:"Date"},{v:"Duration"},{v:"Camera"},{v:""}]}/>
              {[
                {order:"#1042",ch:"CH-881",cust:"Suresh Fabrics",date:"04 Apr 09:45",dur:"3m 22s",cam:"CAM-1"},
                {order:"#1041",ch:"CH-880",cust:"Deepak & Sons",date:"04 Apr 11:20",dur:"2m 48s",cam:"CAM-2"},
                {order:"#1039",ch:"CH-877",cust:"Rajesh Garments",date:"03 Apr 16:10",dur:"4m 05s",cam:"CAM-1"},
                {order:"#1037",ch:"CH-875",cust:"Mohan Textiles",date:"03 Apr 14:30",dur:"2m 12s",cam:"CAM-2"},
                {order:"#1035",ch:"CH-873",cust:"Priya Fashion",date:"02 Apr 12:00",dur:"3m 40s",cam:"CAM-1"},
                {order:"#1033",ch:"CH-870",cust:"Om Traders",date:"02 Apr 10:15",dur:"1m 55s",cam:"CAM-2"},
              ].map((v,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",borderBottom:`0.5px solid ${C.border}`}}>
                  <div style={{width:48,height:32,background:C.black,borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{fontSize:10,color:"#555"}}>▶</span>
                  </div>
                  <div style={{flex:1,fontSize:12,fontWeight:600,fontFamily:"monospace"}}>{v.order}</div>
                  <div style={{flex:1.5,fontSize:11,color:C.text}}>{v.cust}</div>
                  <div style={{flex:1.5,fontSize:10,color:C.textMuted}}>{v.date}</div>
                  <div style={{flex:0.6,fontSize:10,color:C.textMuted}}>{v.dur}</div>
                  <div style={{flex:0.8,fontSize:10,color:C.textMuted}}>{v.cam}</div>
                  <div><Btn small onClick={()=>onNavigate&&onNavigate("W-22")}>▶ Play</Btn></div>
                </div>
              ))}
            </Card>
          </div>
        )}
      </Content>
    </WebLayout>
  );
},

"W-22": () => (
  <WebLayout activeMenu="CCTV">
    <TopBar title="Video Playback  -  Order #1042" actions={[{label:"Download Clip",primary:true}]}/>
    <Content>
      <div style={{display:"flex",gap:12}}>
        <div style={{flex:2}}>
          <div style={{background:C.black,borderRadius:6,height:240,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:8}}>
            <div style={{textAlign:"center",color:"#888"}}>
              <div style={{fontSize:36}}>▶</div>
              <div style={{fontSize:12,marginTop:8}}>CAM-1 · 04 Apr 2026 · 09:45:03</div>
            </div>
          </div>
          <div style={{background:C.bgSoft,borderRadius:4,padding:"8px 12px",display:"flex",alignItems:"center",gap:10}}>
            <Btn small>⏮</Btn><Btn small>▶</Btn><Btn small>⏭</Btn>
            <div style={{flex:1,height:4,background:C.border,borderRadius:2}}>
              <div style={{width:"35%",height:4,background:C.black,borderRadius:2}}/>
            </div>
            <span style={{fontSize:11,color:C.textMuted}}>01:23 / 03:45</span>
          </div>
        </div>
        <div style={{flex:1}}>
          <Card>
            <SectionLabel>Clip Metadata</SectionLabel>
            <FR label="Order ID" value="#1042"/><FR label="Challan" value="CH-881"/><FR label="Customer" value="Suresh Fabrics"/>
            <FR label="Camera" value="CAM-1 (Dispatch A)"/><FR label="Start" value="09:45:03"/>
            <FR label="Duration" value="3m 45s"/><FR label="Triggered By" value="Manual  -  CCTV Console"/>
          </Card>
        </div>
      </div>
    </Content>
  </WebLayout>
),

// ------------------------------------------------------------------------
// REPORTS
// ------------------------------------------------------------------------

"W-23": () => (
  <WebLayout activeMenu="Reports">
    <TopBar title="Reports Hub"/>
    <Content>
      <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
        {[
          {title:"Sales Report",desc:"By date, channel, customer & product",icon:"⊞"},
          {title:"Inventory Ageing",desc:"0 - 30, 31 - 60, 61 - 90, 90+ day brackets",icon:"◷"},
          {title:"Top-Selling Designs",desc:"Ranked by units & revenue",icon:"↑"},
          {title:"Customer Order History",desc:"Per-customer view, PDF export",icon:"◉"},
          {title:"Daily Statement",desc:"End-of-day reconciliation & collections",icon:"📊"},
          {title:"Payment Status",desc:"By date, mode & status",icon:"₹"},
        ].map((r,i)=>(
          <div key={i} style={{width:"calc(33.3% - 8px)",border:`0.5px solid ${C.border}`,borderRadius:8,padding:"16px 14px",background:C.white,cursor:"pointer"}}>
            <div style={{fontSize:22,marginBottom:8}}>{r.icon}</div>
            <div style={{fontSize:13,fontWeight:600,marginBottom:4}}>{r.title}</div>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:12}}>{r.desc}</div>
            <Btn small>Open Report →</Btn>
          </div>
        ))}
      </div>
    </Content>
  </WebLayout>
),

"W-24": () => (
  <WebLayout activeMenu="Reports">
    <TopBar title="Sales Report" actions={[{label:"Export Excel"},{label:"Export PDF",primary:true}]}/>
    <Content>
      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
        <Btn small>Date Range ▾</Btn><Btn small>Channel ▾</Btn><Btn small>Customer ▾</Btn><Btn small>Product ▾</Btn>
        <Toggle options={["All","Retail","Wholesale"]} active="All"/>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:14}}>
        <Metric label="Total Orders" value="284"/><Metric label="Units Sold" value="1,842"/><Metric label="Revenue" value="₹18.4L"/><Metric label="Avg Order" value="₹6,478"/>
      </div>
      <Card>
        <div style={{fontSize:12,fontWeight:600,marginBottom:8}}>Revenue Trend  -  April 2026</div>
        <div style={{height:80,display:"flex",alignItems:"flex-end",gap:4}}>
          {[30,55,40,70,60,80,95,65,75,85,70,90].map((v,i)=>(
            <div key={i} style={{flex:1,height:`${v}%`,background:C.black,borderRadius:"2px 2px 0 0",opacity:0.2+i*0.06}}/>
          ))}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:C.textMuted,marginTop:4}}>
          <span>01 Apr</span><span>15 Apr</span><span>30 Apr</span>
        </div>
      </Card>
    </Content>
  </WebLayout>
),

"W-25": () => (
  <WebLayout activeMenu="Reports">
    <TopBar title="Inventory Ageing Report" actions={[{label:"Export",primary:true}]}/>
    <Content>
      <div style={{display:"flex",gap:10,marginBottom:14}}>
        {[["0 - 30 Days","234 SKUs",false],["31 - 60 Days","56 SKUs",false],["61 - 90 Days","23 SKUs",true],["90+ Days","12 SKUs",true]].map(([l,v,a],i)=>(
          <Metric key={i} label={l} value={v} alert={a}/>
        ))}
      </div>
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,overflow:"hidden",background:C.white}}>
        <TH cols={[{v:"Design"},{v:"SKU",w:1.2},{v:"Clr/Sz",w:0.7},{v:"Stock",w:0.5},{v:"Days",w:0.6},{v:"Location",w:0.7},{v:"Action",w:0.8}]}/>
        {[
          {name:"Block Print Salwar",sku:"HT-003-BLK-XL",cs:"Black/XL",stock:8,days:94,loc:"Godown"},
          {name:"Old Design Kurti",sku:"HT-008-RED-M",cs:"Red/M",stock:3,days:112,loc:"Godown"},
        ].map((r,i)=>(
          <TR key={i} alert cols={[{v:r.name},{v:r.sku,w:1.2,mono:true},{v:r.cs,w:0.7},{v:r.stock,w:0.5},{v:r.days+"d",w:0.6,red:true},{v:r.loc,w:0.7},{v:"Mark",w:0.8}]}/>
        ))}
      </div>
    </Content>
  </WebLayout>
),

"W-26": () => (
  <WebLayout activeMenu="Reports">
    <TopBar title="Top-Selling Designs" actions={[{label:"Export Excel",primary:true}]}/>
    <Content>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <Btn small>This Month ▾</Btn><Toggle options={["By Units","By Revenue"]} active="By Units"/>
      </div>
      <Card>
        {[{name:"Floral Anarkali",units:340,rev:"₹1.36L"},{name:"Solid Kurti",units:280,rev:"₹84k"},{name:"Block Print Salwar",units:210,rev:"₹63k"},{name:"Embr. Dupatta",units:190,rev:"₹95k"}].map((d,i)=>(
          <div key={i} style={{marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:3}}>
              <span><strong>#{i+1}</strong> {d.name}</span><span style={{color:C.textMuted}}>{d.units} pcs · {d.rev}</span>
            </div>
            <div style={{height:8,background:C.bgSoft,borderRadius:4}}><div style={{height:8,background:C.black,borderRadius:4,width:`${(d.units/340)*100}%`,opacity:0.9-i*0.15}}/></div>
          </div>
        ))}
      </Card>
      <Card>
        <div style={{fontSize:12,fontWeight:600,color:C.red,marginBottom:8}}>Slow-Moving Designs</div>
        {["Old Pattern Set (12 units)","Seasonal Dupatta (8 units)","Classic Anarkali v1 (5 units)"].map((d,i)=>(
          <div key={i} style={{fontSize:11,padding:"5px 0",borderBottom:`0.5px solid ${C.border}`,color:C.textMuted}}>{d}</div>
        ))}
      </Card>
    </Content>
  </WebLayout>
),

"W-27": () => (
  <WebLayout activeMenu="Reports">
    <TopBar title="Customer Order History" actions={[{label:"PDF Statement",primary:true}]}/>
    <Content>
      <div style={{display:"flex",gap:12}}>
        <div style={{width:160,border:`0.5px solid ${C.border}`,borderRadius:6,padding:10,background:C.white}}>
          <div style={{fontSize:11,fontWeight:600,marginBottom:8}}>Customers</div>
          {["Suresh Fabrics","Deepak & Sons","Neha Garments","Ramesh Traders"].map((c,i)=>(
            <div key={i} style={{fontSize:11,padding:"6px 8px",borderRadius:3,background:i===0?C.black:"transparent",color:i===0?C.white:C.textMuted,cursor:"pointer",marginBottom:2}}>{c}</div>
          ))}
        </div>
        <div style={{flex:1}}>
          <Card>
            <div style={{fontSize:13,fontWeight:600}}>Suresh Fabrics</div>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:10}}>+91 98765 43210 · Surat · Since Jan 2026</div>
            <div style={{display:"flex",gap:10,marginBottom:12}}>
              <Metric label="Total Orders" value="28"/><Metric label="Total Value" value="₹2.1L"/><Metric label="Outstanding" value="₹7,800" alert/>
            </div>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden"}}>
              <TH cols={[{v:"Order",w:0.7},{v:"Date",w:0.7},{v:"Items",w:0.5},{v:"Value",w:0.8},{v:"Payment"},{v:"LR",w:0.5}]}/>
              {[{id:"#1042",date:"04 Apr",items:8,val:"₹7,800",pay:"Unpaid"},{id:"#1032",date:"28 Mar",items:6,val:"₹5,400",pay:"Paid"}].map((r,i)=>(
                <TR key={i} cols={[{v:r.id,w:0.7,mono:true,bold:true},{v:r.date,w:0.7},{v:r.items,w:0.5},{v:r.val,w:0.8,bold:true},{v:r.pay,red:r.pay==="Unpaid"},{v:"↗",w:0.5}]}/>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Content>
  </WebLayout>
),

// ------------------------------------------------------------------------
// SMS
// ------------------------------------------------------------------------

"W-28": () => (
  <WebLayout activeMenu="SMS">
    <TopBar title="SMS Log"/>
    <Content>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <Btn small>All Templates ▾</Btn><Btn small>All Status ▾</Btn><Btn small>Date ▾</Btn>
      </div>
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,overflow:"hidden",background:C.white}}>
        <TH cols={[{v:"Recipient"},{v:"Mobile",w:1.1},{v:"Template",w:0.8},{v:"Timestamp"},{v:"Status",w:0.8}]}/>
        {[
          {name:"Suresh Fabrics",mob:"+91 98765 43210",tpl:"LR Link",ts:"04 Apr 09:45",status:"Delivered"},
          {name:"Deepak & Sons",mob:"+91 91234 56789",tpl:"LR Link",ts:"04 Apr 11:20",status:"Sent"},
          {name:"Ramesh Traders",mob:"+91 87654 32109",tpl:"Payment Alert",ts:"04 Apr 08:15",status:"Failed"},
        ].map((r,i)=>(
          <TR key={i} alert={r.status==="Failed"} cols={[{v:r.name},{v:r.mob,w:1.1,mono:true},{v:r.tpl,w:0.8},{v:r.ts},{v:r.status,w:0.8,red:r.status==="Failed"}]}/>
        ))}
      </div>
    </Content>
  </WebLayout>
),

"W-29": () => (
  <WebLayout activeMenu="SMS">
    <TopBar title="SMS Template Management" actions={[{label:"+ New Template",primary:true}]}/>
    <Content>
      {[
        {name:"LR Link Delivery",active:true,tpl:"Dear {Name}, Order {ID} has been dispatched. Track LR: {Link}  -  CMS"},
        {name:"Payment Alert",active:true,tpl:"Dear {Name}, ₹{Amount} for Order {ID} confirmed. Thank you!  -  CMS"},
        {name:"Credit Due Reminder",active:true,tpl:"Dear {Name}, your balance ₹{Amount} for Order {ID} is due on {Date}.  -  CMS"},
        {name:"Low Stock Alert",active:false,tpl:"Low stock: SKU {Code} only {Qty} pcs remaining.  -  CMS"},
      ].map((t,i)=>(
        <Card key={i}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
            <div><div style={{fontSize:12,fontWeight:600,marginBottom:4}}>{t.name}</div><Tag color={t.active?"black":""}>{t.active?"Active":"Inactive"}</Tag></div>
            <div style={{display:"flex",gap:6}}><Btn small>Edit</Btn><Btn small>Test SMS</Btn></div>
          </div>
          <div style={{fontSize:11,color:C.textMuted,background:C.bgSoft,padding:"8px 10px",borderRadius:4,fontFamily:"monospace"}}>{t.tpl}</div>
        </Card>
      ))}
    </Content>
  </WebLayout>
),

// ------------------------------------------------------------------------
// DAILY OPS
// ------------------------------------------------------------------------

"W-36": () => (
  <WebLayout activeMenu="Daily Ops">
    <TopBar title="Daily Reconciliation" sub="04 Apr 2026" actions={[{label:"Export Statement"},{label:"Close Day",primary:true}]}/>
    <Content>
      <div style={{display:"flex",gap:10,marginBottom:14}}>
        <Metric label="Total Collections" value="₹84,200" green/>
        <Metric label="Retail Orders" value="18" sub="₹28,800"/>
        <Metric label="Wholesale Collections" value="₹55,400" green/>
        <Metric label="Pending Verifications" value="3" alert/>
      </div>
      <div style={{display:"flex",gap:12}}>
        <div style={{flex:1}}>
          <Card>
            <SectionLabel>Collections by Mode</SectionLabel>
            {[
              {mode:"Cash",retail:"₹12,000",ws:"₹8,000",total:"₹20,000"},
              {mode:"UPI",retail:"₹16,800",ws:"₹22,400",total:"₹39,200"},
              {mode:"Bank Transfer",retail:"₹0",ws:"₹25,000",total:"₹25,000"},
            ].map((r,i)=>(
              <div key={i} style={{display:"flex",gap:6,padding:"8px 0",borderBottom:`0.5px solid ${C.border}`,fontSize:12}}>
                <div style={{flex:1,fontWeight:500}}>{r.mode}</div>
                <div style={{flex:1,color:C.textMuted}}>Retail: {r.retail}</div>
                <div style={{flex:1,color:C.textMuted}}>WS: {r.ws}</div>
                <div style={{flex:0.8,fontWeight:700,color:C.green}}>{r.total}</div>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"flex-end",marginTop:8,fontSize:13,fontWeight:700,color:C.green}}>
              Grand Total: ₹84,200
            </div>
          </Card>
          <Card>
            <SectionLabel>Order Summary</SectionLabel>
            {[
              {type:"Retail Orders",count:18,val:"₹28,800"},
              {type:"Wholesale Dispatched",count:4,val:"₹55,400"},
              {type:"Wholesale Pending Approval",count:2,val:"₹31,200"},
              {type:"Returned Orders",count:1,val:"₹4,200"},
            ].map((r,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`0.5px solid ${C.border}`,fontSize:12}}>
                <span>{r.type}</span>
                <span style={{color:C.textMuted}}>{r.count} orders · <strong>{r.val}</strong></span>
              </div>
            ))}
          </Card>
        </div>
        <div style={{flex:1}}>
          <Card>
            <SectionLabel>Transaction-wise Log</SectionLabel>
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              <Btn small>All Modes ▾</Btn><Btn small>All Types ▾</Btn>
            </div>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden"}}>
              <TH cols={[{v:"Time",w:0.7},{v:"Order",w:0.7},{v:"Customer"},{v:"Mode",w:0.8},{v:"Amount",w:0.8}]}/>
              {[
                {time:"09:30",order:"#1043",cust:"Ramesh Traders",mode:"UPI",amt:"₹3,400"},
                {time:"10:15",order:"#W-1007",cust:"Neha Garments",mode:"Bank",amt:"₹10,000"},
                {time:"11:00",order:"#1044",cust:"Ahmed Fabrics",mode:"Cash",amt:"₹2,100"},
                {time:"14:20",order:"#W-1006",cust:"Deepak Wholesale",mode:"Bank",amt:"₹25,000"},
              ].map((r,i)=>(
                <TR key={i} cols={[{v:r.time,w:0.7},{v:r.order,w:0.7,mono:true},{v:r.cust},{v:r.mode,w:0.8},{v:r.amt,w:0.8,bold:true,green:true}]}/>
              ))}
            </div>
          </Card>
          <Card>
            <SectionLabel>Admin Notes</SectionLabel>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,padding:"8px 10px",height:60,fontSize:12,color:C.textLight,background:C.white}}>Add reconciliation notes for the day...</div>
            <div style={{marginTop:8}}><Btn primary>Save Notes</Btn></div>
          </Card>
        </div>
      </div>
    </Content>
  </WebLayout>
),

// ------------------------------------------------------------------------
// ADMIN
// ------------------------------------------------------------------------

"W-30": () => (
  <WebLayout activeMenu="Admin" activeScreen="W-30">
    <TopBar title="User Management" actions={[{label:"+ Add User",primary:true}]}/>
    <Content>
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,overflow:"hidden",background:C.white,marginBottom:16}}>
        <TH cols={[{v:"Name"},{v:"Email",w:1.4},{v:"Role"},{v:"Mobile",w:0.9},{v:"Cross-ERP",w:0.7},{v:"Status",w:0.6},{v:"Last Login"},{v:"Actions",w:0.8}]}/>
        <div style={{fontSize:10,color:C.textMuted,padding:"6px 10px",background:CO.accentLight,borderTop:`0.5px solid ${CO.accentBorder}`}}>{"🔒"} <strong style={{color:CO.accent}}>Super Admin</strong>: Full access to both Sales ERP and Manufacturing ERP. Reserved for owners (Kadir Bhai, Ali Bhai).</div>
        {[
          {name:"Abdul Kadir",email:"admin@cms.com",role:"Super Admin",mob:"+91 91046 70469",status:"Active",login:"04 Apr 09:00",crossErp:"Both"},
          {name:"Mohammad Ali",email:"ali@cms.com",role:"Super Admin",mob:"+91 79905 01710",status:"Active",login:"04 Apr 09:15",crossErp:"Both"},
          {name:"Raju Singh",email:"raju@cms.com",role:"Godown Staff",mob:"+91 98765 43210",status:"Active",login:"04 Apr 08:45",crossErp:"Sales"},
          {name:"Priya Sharma",email:"priya@cms.com",role:"Office Staff",mob:"+91 87654 32109",status:"Active",login:"04 Apr 09:15",crossErp:"Sales"},
          {name:"Vikram Singh",email:"vikram@cms.com",role:"Production Manager",mob:"+91 98765 43211",status:"Active",login:"04 Apr 09:30",crossErp:"Manufacturing"},
          {name:"Suresh Patel",email:"suresh@cms.com",role:"Production Staff",mob:"+91 87654 32110",status:"Active",login:"04 Apr 08:50",crossErp:"Manufacturing"},
          {name:"Amit Shah",email:"amit@cms.com",role:"Accounts",mob:"+91 76543 21099",status:"Active",login:"04 Apr 09:10",crossErp:"Manufacturing"},
          {name:"Mohan Das",email:"mohan@cms.com",role:"Manager",mob:"+91 76543 21098",status:"Inactive",login:"28 Mar 17:00",crossErp:"Sales"},
        ].map((u,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 10px",borderTop:`0.5px solid ${C.border}`,background:u.status==="Inactive"?C.bgSoft:C.white}}>
            <div style={{flex:1,display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:C.black,display:"flex",alignItems:"center",justifyContent:"center",color:C.white,fontSize:11,fontWeight:700,flexShrink:0}}>{u.name[0]}</div>
              <span style={{fontSize:12,fontWeight:500}}>{u.name}</span>
            </div>
            <div style={{flex:1.4,fontSize:11,color:C.textMuted}}>{u.email}</div>
            <div style={{flex:1}}><Tag>{u.role}</Tag></div>
            <div style={{flex:0.7}}><span style={{fontSize:10,padding:"2px 6px",borderRadius:3,fontWeight:600,background:u.crossErp!=="Sales"?CO.accentLight:C.bgSoft,color:u.crossErp!=="Sales"?CO.accent:C.textMuted,border:`0.5px solid ${u.crossErp!=="Sales"?CO.accentBorder:C.border}`}}>{u.crossErp}</span></div>
            <div style={{flex:0.9,fontSize:11,color:C.textMuted,fontFamily:"monospace"}}>{u.mob}</div>
            <div style={{flex:0.6}}><Tag color={u.status==="Inactive"?"red":"black"}>{u.status}</Tag></div>
            <div style={{flex:1,fontSize:11,color:C.textMuted}}>{u.login}</div>
            <div style={{flex:0.8,display:"flex",gap:5}}><Btn small>Edit</Btn><Btn danger small>Deactivate</Btn></div>
          </div>
        ))}
      </div>

      {/* ── DIALOG STATE 1: + Add User ────────────────────── */}
      <div style={{fontSize:11,fontWeight:700,color:C.textMuted,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:10}}>
        ↓ Dialog shown when "+ Add User" is clicked
      </div>
      <div style={{position:"relative",minHeight:460,border:`1.5px dashed ${C.border}`,borderRadius:8,background:C.bgSoft,marginBottom:16}}>
        {/* Dimmed background hint */}
        <div style={{padding:16,opacity:0.25,fontSize:11,color:C.textMuted,textAlign:"center"}}>[ User list in background ]</div>
        <Modal title="Add New User">
          <div style={{marginBottom:14,padding:"8px 10px",background:C.bgSoft,borderRadius:4,fontSize:11,color:C.textMuted,border:`0.5px solid ${C.border}`}}>
            A login account will be created and a temporary password emailed to the user.
          </div>
          <div style={{display:"flex",gap:10}}>
            <div style={{flex:1}}><Input label="Full Name" placeholder="e.g. Raju Singh" required/></div>
            <div style={{flex:1}}><Input label="Mobile Number" placeholder="+91 98765 43210" required note="Used for account identification"/></div>
          </div>
          <Input label="Email Address" placeholder="raju@cms.com" required note="Login credential + password reset link sent here"/>
          <div style={{marginBottom:9}}>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:3,fontWeight:500}}>Role <span style={{color:C.red}}>*</span></div>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden",background:C.white}}>
              {[
                {role:"Super Admin",desc:"Full access cross-ERP for owners (Kadir Bhai, Ali Bhai)",icon:"⚙"},
                {role:"Production Manager",desc:"Full GMMS access  -  challans, production, contractors, fabric",icon:"▣"},
                {role:"Production Staff",desc:"Floor production  -  update piece counts, track challans",icon:"◈"},
                {role:"Accounts",desc:"Payments, reconciliation, reports (GMMS finance)",icon:"₹"},
                {role:"Manager",desc:"Sales ERP  -  orders, approvals, reports, payments",icon:"◉"},
                {role:"Office Staff",desc:"Sales ERP  -  orders, inventory, customers",icon:"□"},
                {role:"Godown Staff",desc:"Mobile only  -  scanning, picking, dispatch, LR upload",icon:"⊏"}
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"9px 12px",borderTop:i>0?`0.5px solid ${C.border}`:"none",background:i===6?C.bgSoft:C.white,cursor:"pointer"}}>
                  <div style={{width:16,height:16,borderRadius:"50%",border:`0.5px solid ${i===6?C.black:C.border}`,background:i===6?C.black:C.white,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                    {i===6&&<div style={{width:6,height:6,borderRadius:"50%",background:C.white}}/>}
                  </div>
                  <div>
                    <div style={{fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:6}}><span>{r.icon}</span>{r.role}</div>
                    <div style={{fontSize:10,color:C.textMuted,marginTop:1}}>{r.desc}</div>
                  </div>
                  <div style={{marginLeft:"auto"}}><span style={{fontSize:10,color:C.red,cursor:"pointer"}}>View permissions ↗</span></div>
                </div>
              ))}
            </div>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:3,fontWeight:500}}>Account Status</div>
            <div style={{display:"flex",gap:8}}>
              {["Active ●","Inactive"].map((s,i)=>(
                <span key={i} style={{fontSize:11,padding:"5px 14px",border:`0.5px solid ${i===0?C.black:C.border}`,borderRadius:4,background:i===0?C.black:C.white,color:i===0?C.white:C.textMuted,cursor:"pointer"}}>{s}</span>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",paddingTop:10,borderTop:`0.5px solid ${C.border}`}}>
            <Btn>Cancel</Btn>
            <Btn primary>Create User + Send Invite</Btn>
          </div>
        </Modal>
      </div>

      {/* ── DIALOG STATE 2: Edit User ────────────────────── */}
      <div style={{fontSize:11,fontWeight:700,color:C.textMuted,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:10}}>
        ↓ Dialog shown when "Edit" is clicked on a user row
      </div>
      <div style={{position:"relative",minHeight:440,border:`1.5px dashed ${C.border}`,borderRadius:8,background:C.bgSoft}}>
        <div style={{padding:16,opacity:0.25,fontSize:11,color:C.textMuted,textAlign:"center"}}>[ User list in background ]</div>
        <Modal title="Edit User  -  Raju Singh">
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",background:C.bgSoft,borderRadius:6,marginBottom:14,border:`0.5px solid ${C.border}`}}>
            <div style={{width:40,height:40,borderRadius:"50%",background:C.black,display:"flex",alignItems:"center",justifyContent:"center",color:C.white,fontSize:16,fontWeight:700,flexShrink:0}}>R</div>
            <div>
              <div style={{fontSize:13,fontWeight:600}}>Raju Singh</div>
              <div style={{fontSize:11,color:C.textMuted}}>raju@cms.com · Last login: 04 Apr 08:45</div>
            </div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <div style={{flex:1}}><Input label="Full Name" placeholder="Raju Singh"/></div>
            <div style={{flex:1}}><Input label="Mobile" placeholder="+91 98765 43210"/></div>
          </div>
          <Input label="Email" placeholder="raju@cms.com" note="Changing email will require re-verification"/>
          <div style={{marginBottom:9}}>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:3,fontWeight:500}}>Change Role</div>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden"}}>
              {[
                {role:"Super Admin",desc:"Full cross-ERP access",icon:"⚙",sel:false},
                {role:"Production Manager",desc:"Full GMMS access  -  challans, production, contractors",icon:"▣",sel:false},
                {role:"Production Staff",desc:"Floor production  -  view challans, update piece counts",icon:"◈",sel:false},
                {role:"Accounts",desc:"Payments, reconciliation, reports (GMMS)",icon:"₹",sel:false},
                {role:"Manager",desc:"Sales ERP  -  orders, approvals, reports",icon:"◉",sel:false},
                {role:"Office Staff",desc:"Sales ERP  -  orders, inventory, customers",icon:"□",sel:false},
                {role:"Godown Staff",desc:"Mobile  -  scan, pick, dispatch",icon:"⊏",sel:true}
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderTop:i>0?`0.5px solid ${C.border}`:"none",background:r.sel?C.bgSoft:C.white,cursor:"pointer"}}>
                  <div style={{width:16,height:16,borderRadius:"50%",border:`0.5px solid ${r.sel?C.black:C.border}`,background:r.sel?C.black:C.white,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {r.sel&&<div style={{width:6,height:6,borderRadius:"50%",background:C.white}}/>}
                  </div>
                  <span style={{fontSize:11}}>{r.icon} {r.role}</span>
                  <span style={{fontSize:10,color:C.textMuted}}> -  {r.desc}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{marginBottom:10}}>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:3,fontWeight:500}}>Status</div>
            <div style={{display:"flex",gap:8}}>
              {["Active ●","Inactive"].map((s,i)=>(
                <span key={i} style={{fontSize:11,padding:"5px 14px",border:`0.5px solid ${i===0?C.black:C.border}`,borderRadius:4,background:i===0?C.black:C.white,color:i===0?C.white:C.textMuted,cursor:"pointer"}}>{s}</span>
              ))}
            </div>
          </div>
          <div style={{padding:"8px 10px",background:"#fff8e1",border:`0.5px solid #f5c842`,borderRadius:4,fontSize:11,color:"#7a5c00",marginBottom:12}}>
            ⚠ Changing this user's role will take effect on their next login.
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"space-between",paddingTop:10,borderTop:`0.5px solid ${C.border}`}}>
            <Btn danger>Deactivate Account</Btn>
            <div style={{display:"flex",gap:8}}>
              <Btn>Cancel</Btn>
              <Btn primary>Save Changes</Btn>
            </div>
          </div>
        </Modal>
      </div>
    </Content>
  </WebLayout>
),

"W-30A": () => (
  <WebLayout activeMenu="Admin" activeScreen="W-30A">
    <TopBar title="Role-Based Permissions" sub="Configure what each role can access and do" actions={[{label:"Save All Permissions",primary:true}]}/>
    <Content>
      {/* Role selector tabs */}
      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
        {["Super Admin","Production Manager","Production Staff","Accounts","Manager","Office Staff","Godown Staff"].map((role,i)=>(
          <span key={i} style={{fontSize:11,padding:"5px 14px",borderRadius:3,border:`0.5px solid ${i===5?C.black:C.border}`,background:i===5?C.black:C.white,color:i===5?C.white:C.textMuted,cursor:"pointer",fontWeight:i===5?600:400}}>{role}</span>
        ))}
        <Btn small>+ Add Role</Btn>
        <div style={{marginLeft:"auto",display:"flex",gap:6}}>
          <Btn small>Duplicate Role</Btn>
          <Btn danger small>Delete Role</Btn>
        </div>
      </div>
      <div style={{fontSize:11,color:C.textMuted,marginBottom:12,padding:"7px 10px",background:C.bgSoft,borderRadius:4,border:`0.5px solid ${C.border}`}}>
        Showing permissions for: <strong>Office Staff</strong>  -  Super Admin role always has full cross-ERP access and cannot be edited. Changes take effect on next login.
      </div>
      {/* Permission matrix */}
      {[
        {module:"Dashboard",perms:[{label:"View dashboard & metrics",checked:true},{label:"Export dashboard data",checked:false}]},
        {module:"Products & SKU",perms:[{label:"View product list",checked:true},{label:"Create / edit SKU",checked:true},{label:"Add stock (via SKU edit)",checked:true},{label:"Print labels & barcodes",checked:true},{label:"Delete SKU",checked:false}]},
        {module:"Inventory",perms:[{label:"View live inventory",checked:true},{label:"View stock alerts",checked:true}]},
        {module:"Orders",perms:[{label:"View order list",checked:true},{label:"Create retail order",checked:true},{label:"Create wholesale order",checked:true},{label:"Approve wholesale orders",checked:false},{label:"Reject / cancel orders",checked:false},{label:"Edit order before approval",checked:true},{label:"Record payment",checked:true},{label:"Print challan",checked:true}]},
        {module:"Dispatch & LR",perms:[{label:"View LR console",checked:true},{label:"Upload LR document",checked:true},{label:"Resend LR SMS",checked:true}]},
        {module:"Payments",perms:[{label:"View payment records",checked:true},{label:"Record installment payments",checked:true},{label:"Delete payment records",checked:false}]},
        {module:"CCTV",perms:[{label:"View CCTV console",checked:false},{label:"Start/stop recording",checked:false},{label:"View footage library",checked:false}]},
        {module:"Reports",perms:[{label:"View reports",checked:true},{label:"Export reports",checked:false}]},
        {module:"Admin",perms:[{label:"User management",checked:false},{label:"Role permissions",checked:false},{label:"Customer master",checked:true},{label:"System settings",checked:false},{label:"Audit trail",checked:false}]},
        {module:"Mfg — Challans",perms:[{label:"View challan list & details",checked:true},{label:"Create new challans",checked:true},{label:"Edit existing challans",checked:false},{label:"Track challan progress",checked:true},{label:"Close / complete challans",checked:false}]},
        {module:"Mfg — Production",perms:[{label:"View production status",checked:true},{label:"Update ready piece counts",checked:true},{label:"Process SKU outward",checked:false},{label:"Payment & piece verification",checked:false}]},
        {module:"Mfg — Contractors",perms:[{label:"View contractor list",checked:true},{label:"Register new contractors",checked:true},{label:"Edit contractor details",checked:false},{label:"Delete contractor records",checked:false}]},
        {module:"Mfg — Fabric / Mill",perms:[{label:"View fabric inventory & mill data",checked:true},{label:"Add new fabric rolls",checked:true},{label:"Edit fabric roll details",checked:false}]},
        {module:"Mfg — RF / Returns",perms:[{label:"View RF / return entries",checked:true},{label:"Create RF entries",checked:true},{label:"Edit existing RF entries",checked:false}]},
        {module:"Mfg — Masters",perms:[{label:"Manage design master (DST files)",checked:false},{label:"Configure job work types & rates",checked:false},{label:"Manage color master per design",checked:false},{label:"Contractor registry management",checked:false}]},
        {module:"Mfg — Costing (Owner)",perms:[{label:"View design BOM & cost breakdown",checked:false},{label:"Edit cost data",checked:false}]},
        {module:"Mfg — Notifications",perms:[{label:"View notification center",checked:true}]},
        {module:"ERP Cross-Access",perms:[{label:"Access Manufacturing ERP (GMMS)",checked:false},{label:"Access Sales ERP (CMS)",checked:true}]},
      ].map((section,si)=>(
        <Card key={si} style={{marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{fontSize:12,fontWeight:600}}>{section.module}</div>
            <div style={{display:"flex",gap:6}}>
              <span style={{fontSize:10,color:C.textMuted,cursor:"pointer",textDecoration:"underline"}}>All</span>
              <span style={{fontSize:10,color:C.textMuted,cursor:"pointer",textDecoration:"underline"}}>None</span>
            </div>
          </div>
          <div>
            {section.perms.map((perm,pi)=>(
              <div key={pi} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:`0.5px solid ${C.border}`}}>
                <div style={{width:16,height:16,borderRadius:3,border:`0.5px solid ${perm.checked?C.black:C.border}`,background:perm.checked?C.black:C.white,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {perm.checked&&<span style={{color:C.white,fontSize:10,lineHeight:1}}>✔</span>}
                </div>
                <span style={{fontSize:12,color:perm.checked?C.text:C.textMuted,flex:1}}>{perm.label}</span>
                {!perm.checked&&<Tag color="red">Denied</Tag>}
              </div>
            ))}
          </div>
        </Card>
      ))}

      {/* ── DIALOG STATE 1: + Add Role ────────────────────── */}
      <div style={{fontSize:11,fontWeight:700,color:C.textMuted,letterSpacing:"0.06em",textTransform:"uppercase",margin:"20px 0 10px"}}>
        ↓ Dialog shown when "+ Add Role" is clicked
      </div>
      <div style={{position:"relative",minHeight:500,border:`1.5px dashed ${C.border}`,borderRadius:8,background:C.bgSoft,marginBottom:20}}>
        <div style={{padding:16,opacity:0.25,fontSize:11,color:C.textMuted,textAlign:"center"}}>[ Permission matrix in background ]</div>
        <Modal title="Create New Role" width={500}>
          <div style={{padding:"8px 10px",background:C.bgSoft,borderRadius:4,fontSize:11,color:C.textMuted,border:`0.5px solid ${C.border}`,marginBottom:14}}>
            Define a new role name and optionally copy permissions from an existing role as a starting point.
          </div>
          <Input label="Role Name" placeholder="e.g. Accountant / Supervisor / Sales Rep" required note="This name will appear in user assignment and audit logs"/>
          <Input label="Description (optional)" placeholder="e.g. Can view orders and record payments  -  no stock access"/>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:6,fontWeight:500}}>Copy Permissions From (optional)</div>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden",background:C.white}}>
              {[
                {role:"Start with blank / no permissions",desc:"All permissions off by default",icon:"•",sel:false},
                {role:"Copy from: Production Manager",desc:"Full GMMS  -  challans, production, contractors, fabric",icon:"▣",sel:false},
                {role:"Copy from: Production Staff",desc:"Floor production  -  challan view, piece counts",icon:"◈",sel:false},
                {role:"Copy from: Manager",desc:"Orders, approvals, reports, payments",icon:"◉",sel:false},
                {role:"Copy from: Office Staff",desc:"Orders, inventory, customers  -  no approvals",icon:"□",sel:true},
                {role:"Copy from: Godown Staff",desc:"Mobile only  -  scan, pick, dispatch",icon:"⊏",sel:false}
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"9px 12px",borderTop:i>0?`0.5px solid ${C.border}`:"none",background:r.sel?C.bgSoft:C.white,cursor:"pointer"}}>
                  <div style={{width:16,height:16,borderRadius:"50%",border:`0.5px solid ${r.sel?C.black:C.border}`,background:r.sel?C.black:C.white,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>
                    {r.sel&&<div style={{width:6,height:6,borderRadius:"50%",background:C.white}}/>}
                  </div>
                  <div>
                    <div style={{fontSize:12,fontWeight:r.sel?600:400}}>{r.role}</div>
                    <div style={{fontSize:10,color:C.textMuted,marginTop:1}}>{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{padding:"8px 10px",background:C.greenLight,border:`0.5px solid ${C.greenBorder}`,borderRadius:4,fontSize:11,color:C.green,marginBottom:14}}>
            ✔ Copying from "Office Staff"  -  you can fine-tune individual permissions after creation on the main screen.
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",paddingTop:10,borderTop:`0.5px solid ${C.border}`}}>
            <Btn>Cancel</Btn>
            <Btn primary>Create Role →</Btn>
          </div>
        </Modal>
      </div>

      {/* ── DIALOG STATE 2: Delete Role confirmation ────────────────────── */}
      <div style={{fontSize:11,fontWeight:700,color:C.textMuted,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:10}}>
        ↓ Dialog shown when "Delete Role" is clicked
      </div>
      <div style={{position:"relative",minHeight:280,border:`1.5px dashed ${C.border}`,borderRadius:8,background:C.bgSoft,marginBottom:20}}>
        <div style={{padding:16,opacity:0.25,fontSize:11,color:C.textMuted,textAlign:"center"}}>[ Permission matrix in background ]</div>
        <Modal title="Delete Role  -  Office Staff" width={420}>
          <div style={{padding:"12px 14px",background:C.redLight,border:`0.5px solid ${C.redBorder}`,borderRadius:6,marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:700,color:C.red,marginBottom:6}}>⚠ This action cannot be undone</div>
            <div style={{fontSize:11,color:C.text}}>
              <strong>2 users</strong> are currently assigned to "Office Staff":
            </div>
            <div style={{marginTop:8}}>
              {["Priya Sharma · priya@cms.com","Sunita Patel · sunita@cms.com"].map((u,i)=>(
                <div key={i} style={{fontSize:11,padding:"4px 0",borderBottom:`0.5px solid ${C.redBorder}`,color:C.text}}>{u}</div>
              ))}
            </div>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:6,fontWeight:500}}>Reassign affected users to:</div>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden",background:C.white}}>
              {["Production Manager","Production Staff","Manager","Godown Staff"].map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderTop:i>0?`0.5px solid ${C.border}`:"none",cursor:"pointer",background:i===0?C.bgSoft:C.white}}>
                  <div style={{width:16,height:16,borderRadius:"50%",border:`0.5px solid ${i===0?C.black:C.border}`,background:i===0?C.black:C.white,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {i===0&&<div style={{width:6,height:6,borderRadius:"50%",background:C.white}}/>}
                  </div>
                  <span style={{fontSize:12}}>{r}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",paddingTop:10,borderTop:`0.5px solid ${C.border}`}}>
            <Btn>Cancel</Btn>
            <Btn danger>Reassign + Delete Role</Btn>
          </div>
        </Modal>
      </div>
    </Content>
  </WebLayout>
),

"W-31": () => (
  <WebLayout activeMenu="Admin">
    <TopBar title="Customer Master" actions={[{label:"+ Add Customer",primary:true},{label:"Import CSV"}]}/>
    <Content>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <div style={{flex:1,border:`0.5px solid ${C.border}`,borderRadius:4,padding:"7px 10px",fontSize:12,color:C.textLight,background:C.white}}>Search customers by name, mobile, city...</div>
        <Btn small>City ▾</Btn><Btn small>Outstanding ▾</Btn>
      </div>
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,overflow:"hidden",background:C.white}}>
        <TH cols={[{v:"Business Name"},{v:"Contact"},{v:"Mobile",w:1},{v:"City",w:0.7},{v:"Cr Limit",w:0.8},{v:"Cr Days",w:0.7},{v:"Outstanding",w:0.9},{v:"",w:0.6}]}/>
        {[
          {biz:"Suresh Fabrics",contact:"Suresh Shah",mob:"+91 98765 43210",city:"Surat",limit:"₹50k",days:"30",outstanding:"₹7,800"},
          {biz:"Deepak & Sons",contact:"Deepak Mehta",mob:"+91 91234 56789",city:"Mumbai",limit:"₹1L",days:"15",outstanding:"₹0"},
          {biz:"Neha Garments",contact:"Neha Shah",mob:"+91 87654 32109",city:"Delhi",limit:"₹75k",days:"30",outstanding:"₹22,800"},
          {biz:"Ramesh Traders",contact:"Ramesh Gupta",mob:"+91 76543 21098",city:"Ahmedabad",limit:"₹30k",days:"7",outstanding:"₹0"},
        ].map((c,i)=>(
          <TR key={i} cols={[{v:c.biz,bold:true},{v:c.contact},{v:c.mob,w:1,mono:true},{v:c.city,w:0.7},{v:c.limit,w:0.8},{v:c.days+"d",w:0.7},{v:c.outstanding,w:0.9,red:c.outstanding!=="₹0",bold:c.outstanding!=="₹0"},{v:"Edit ↗",w:0.6}]}/>
        ))}
      </div>
    </Content>
  </WebLayout>
),

"W-35": () => (
  <WebLayout activeMenu="Admin">
    <TopBar title="Create Wholesale Customer" actions={[{label:"Save Customer",primary:true},{label:"Cancel"}]}/>
    <Content>
      <div style={{display:"flex",gap:12}}>
        <div style={{flex:2}}>
          <Card>
            <SectionLabel>Business & Identity</SectionLabel>
            <div style={{display:"flex",gap:10}}>
              <div style={{flex:1.5}}><Input label="Name (Business / Shop Name)" placeholder="e.g. Ramesh Traders" required/></div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <div style={{flex:1}}><Input label="Address" placeholder="Shop / warehouse address" required/></div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <div style={{flex:1}}><Input label="Area" placeholder="Area / locality"/></div>
              <div style={{flex:1}}><Input label="City" placeholder="Surat / Mumbai..." required/></div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <div style={{flex:1}}><Input label="State" placeholder="Gujarat / Maharashtra..."/></div>
              <div style={{flex:1}}><Input label="Pincode" placeholder="395001"/></div>
            </div>
          </Card>
          <Card>
            <SectionLabel>Contact Details</SectionLabel>
            <div style={{display:"flex",gap:10}}>
              <div style={{flex:1}}><Input label="WhatsApp Mobile" placeholder="+91 98765 43210" required note="Used for LR SMS delivery"/></div>
              <div style={{flex:1}}><Input label="Phone No." placeholder="+91 alternate number"/></div>
            </div>
            <Input label="Email" placeholder="customer@example.com (optional)"/>
          </Card>
          <Card>
            <SectionLabel>Financial & Account</SectionLabel>
            <div style={{display:"flex",gap:10}}>
              <div style={{flex:1}}><Input label="Cr Day (Credit Days)" placeholder="e.g. 30" note="No. of days credit extended"/></div>
              <div style={{flex:1}}><Input label="Cr Limit (Credit Limit ₹)" placeholder="e.g. 50,000"/></div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <div style={{flex:1}}><Input label="Discount %" placeholder="e.g. 5" note="Applied automatically on all orders for this customer"/></div>
              <div style={{flex:1}}><Input label="GST No." placeholder="22AAAAA0000A1Z5 (optional)"/></div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <div style={{flex:1}}><Input label="Broker" placeholder="Broker name if applicable"/></div>
            </div>
          </Card>
          <Card>
            <SectionLabel>Logistics & Notes</SectionLabel>
            <Input label="Transport Name" placeholder="Preferred transport / carrier (optional)"/>
            <Input label="Remarks" placeholder="Any notes about this customer..."/>
          </Card>
        </div>
        <div style={{flex:1}}>
          <Card>
            <SectionLabel>Account Preview</SectionLabel>
            <div style={{textAlign:"center",padding:"12px 0"}}>
              <div style={{width:48,height:48,borderRadius:"50%",background:C.black,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 8px",fontSize:18,color:C.white}}>R</div>
              <div style={{fontSize:13,fontWeight:700}}>Ramesh Traders</div>
              <div style={{fontSize:11,color:C.textMuted}}>Ahmedabad · Gujarat</div>
            </div>
            <Divider/>
            <FR label="WhatsApp" value="+91 76543 21098"/><FR label="Cr. Days" value="30 days"/><FR label="Cr. Limit" value="₹50,000"/>
            <FR label="Discount" value="5%"/><FR label="Transport" value="BlueDart"/><FR label="GST No." value="22XXXXX001A1Z5"/>
          </Card>
          <Card red>
            <div style={{fontSize:11,fontWeight:600,color:C.red}}>Required before first order</div>
            <div style={{fontSize:11,color:C.textMuted,marginTop:4}}>WhatsApp Mobile is mandatory  -  used for LR SMS on every dispatch</div>
          </Card>
          <Card>
            <SectionLabel>Welcome SMS</SectionLabel>
            <div style={{fontSize:11,color:C.textMuted,fontFamily:"monospace",background:C.bgSoft,padding:"8px 10px",borderRadius:4,marginBottom:8}}>
              "Welcome to CMS! Your wholesale account is active. Contact: 9104670469"
            </div>
            <label style={{display:"flex",alignItems:"center",gap:8,fontSize:12}}><input type="checkbox" defaultChecked/> Send on save</label>
          </Card>
        </div>
      </div>
    </Content>
  </WebLayout>
),

"W-32": () => (
  <WebLayout activeMenu="Admin">
    <TopBar title="System Settings" actions={[{label:"Save Settings",primary:true}]}/>
    <Content>
      {[
        {section:"Company Info",fields:[["Company Name","SIMNANI TEXTILE"],["Contact 1","9104670469"],["Contact 2","7990501710"],["Challan Terms Line 1","We check and pack goods carefully before dispatch"],["Challan Terms Line 2","Cheque Return Charge 500 rs compulsory"],["Jurisdiction","Subject to SURAT Jurisdiction only"]]},
        {section:"LR & SMS",fields:[["LR Link Expiry (days)","90"],["SMS Sender Name","CMS"],["Authkey.io API Key","••••••••••••"]]},
        {section:"Inventory Thresholds",fields:[["Low Stock Threshold (pcs)","10"],["Ageing Alert Day 1 (days)","30"],["Ageing Alert Day 2 (days)","60"],["Ageing Alert Day 3 (days)","90"]]},
        {section:"Credit Control",fields:[["Credit Alert Admin (days before due)","3"],["Credit Reminder Email","accountant@cms.com"]]},
      ].map((s,i)=>(
        <Card key={i}>
          <SectionLabel>{s.section}</SectionLabel>
          {i===2&&<div style={{fontSize:11,color:C.textMuted,marginBottom:8,padding:"5px 8px",background:C.bgSoft,borderRadius:4}}>ℹ Low stock threshold and ageing brackets configured here apply to Stock Alert Center (Inventory → Alerts)</div>}
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            {s.fields.map(([label,val],j)=>(
              <div key={j} style={{flex:"1 1 calc(50% - 5px)",minWidth:180}}>
                <Input label={label} placeholder={val}/>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </Content>
  </WebLayout>
),

"W-33": () => (
  <WebLayout activeMenu="Admin">
    <TopBar title="Audit Trail" actions={[{label:"Export"}]}/>
    <Content>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <Btn small>All Modules ▾</Btn><Btn small>All Users ▾</Btn><Btn small>Date Range ▾</Btn>
      </div>
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,overflow:"hidden",background:C.white}}>
        <TH cols={[{v:"Timestamp"},{v:"User",w:0.7},{v:"Module",w:0.8},{v:"Action"},{v:"Details",w:1.4}]}/>
        {[
          {ts:"04 Apr 09:45",user:"Raju",module:"LR",action:"LR Uploaded",detail:"Order #1042, CH-881"},
          {ts:"04 Apr 09:43",user:"Raju",module:"Dispatch",action:"Stock Deducted",detail:"HT-001-RED-M × 4"},
          {ts:"04 Apr 09:15",user:"Priya",module:"Payment",action:"Payment Confirmed",detail:"Order #1040, ₹11,400"},
          {ts:"04 Apr 08:45",user:"Admin",module:"Stock",action:"Adjustment",detail:"HT-003, -2 pcs, damaged"},
        ].map((r,i)=>(
          <TR key={i} cols={[{v:r.ts},{v:r.user,w:0.7,bold:true},{v:r.module,w:0.8},{v:r.action},{v:r.detail,w:1.4}]}/>
        ))}
      </div>
    </Content>
  </WebLayout>
),

// ------------------------------------------------------------------------
// CHALLAN PRINT
// ------------------------------------------------------------------------

"W-39": () => (
  <WebLayout activeMenu="Orders">
    <TopBar title="Challan Print Preview" actions={[{label:"← Back"},{label:"Print Challan",primary:true}]}/>
    <Content>
      <div style={{display:"flex",gap:16,justifyContent:"center"}}>
        {/* A5 challan preview */}
        <div style={{width:460,background:C.white,border:`1px solid ${C.border}`,borderRadius:4,padding:24,fontSize:11}}>
          {/* Header */}
          <div style={{borderBottom:`2px solid ${C.black}`,paddingBottom:10,marginBottom:10}}>
            <div style={{fontSize:18,fontWeight:700,letterSpacing:1}}>SIMNANI TEXTILE</div>
            <div style={{fontSize:11,color:C.textMuted}}>Contact: 9104670469 / 7990501710</div>
          </div>
          {/* Party */}
          <div style={{display:"flex",gap:16,marginBottom:10}}>
            <div style={{flex:1}}>
              <div style={{fontSize:10,color:C.textMuted,fontWeight:700,marginBottom:2}}>PARTY NAME</div>
              <div style={{fontWeight:600}}>M/s. A R GARMENTS</div>
              <div style={{color:C.textMuted,fontSize:10}}>1ST FLOOR, N2-95, NEW MARKET,<br/>LINDSEY STREET, KOLKATA</div>
              <div style={{marginTop:4}}>Mobile: 7044910075</div>
            </div>
            <div style={{flex:0,textAlign:"right",flexShrink:0}}>
              <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,padding:"6px 12px",display:"inline-block"}}>
                <div style={{fontSize:10,color:C.textMuted}}>Challan No.</div>
                <div style={{fontSize:18,fontWeight:700}}>39</div>
                <div style={{fontSize:10,color:C.textMuted,marginTop:2}}>Date: 07/04/2026</div>
              </div>
            </div>
          </div>
          {/* Items table */}
          <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden",marginBottom:10}}>
            <div style={{display:"flex",background:C.bgSoft,padding:"5px 8px",fontSize:10,fontWeight:700,color:C.textMuted,borderBottom:`0.5px solid ${C.border}`}}>
              {["No","Description","PCS","Rate","Amount"].map((h,i)=><div key={i} style={{flex:[0.4,1.5,0.5,0.7,0.8][i]}}>{h}</div>)}
            </div>
            <div style={{display:"flex",padding:"6px 8px",fontSize:11}}>
              {["1","HF-786","72","1400.00","100800.00"].map((v,i)=><div key={i} style={{flex:[0.4,1.5,0.5,0.7,0.8][i],fontFamily:i>=2?"monospace":"inherit"}}>{v}</div>)}
            </div>
          </div>
          {/* Add/Less/Summary */}
          <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden",marginBottom:10}}>
            <div style={{display:"flex",background:C.bgSoft,padding:"5px 8px",fontSize:10,fontWeight:700,color:C.textMuted,borderBottom:`0.5px solid ${C.border}`}}>
              {["Type","Percentage","Amount"].map((h,i)=><div key={i} style={{flex:1}}>{h}</div>)}
            </div>
            {[["Add","0.00%","1800.00"],["Less","0.00%","15120.00"]].map(([type,pct,amt],i)=>(
              <div key={i} style={{display:"flex",padding:"5px 8px",fontSize:11,borderTop:`0.5px solid ${C.border}`}}>
                {[type,pct,amt].map((v,j)=><div key={j} style={{flex:1,fontFamily:j===2?"monospace":"inherit"}}>{v}</div>)}
              </div>
            ))}
          </div>
          {/* Totals */}
          <div style={{border:`0.5px solid ${C.black}`,borderRadius:4,overflow:"hidden",marginBottom:12}}>
            <div style={{display:"flex",background:C.black,padding:"6px 8px"}}>
              {["Total PCS","Final Amount"].map((h,i)=><div key={i} style={{flex:1,fontSize:10,fontWeight:700,color:C.white}}>{h}</div>)}
            </div>
            <div style={{display:"flex",padding:"8px 8px",fontSize:13,fontWeight:700}}>
              {["72.000","₹87,480.00"].map((v,i)=><div key={i} style={{flex:1}}>{v}</div>)}
            </div>
          </div>
          {/* Terms */}
          <div style={{borderTop:`0.5px solid ${C.border}`,paddingTop:8,marginBottom:10}}>
            <div style={{fontSize:10,fontWeight:700,color:C.textMuted,marginBottom:4}}>Terms & Conditions</div>
            {["We check and pack the goods carefully before dispatch","Cheque Return Charge 500 rs compulsory","Subject to SURAT Jurisdiction only"].map((t,i)=>(
              <div key={i} style={{fontSize:10,color:C.textMuted,marginBottom:2}}>• {t}</div>
            ))}
          </div>
          {/* Signature */}
          <div style={{textAlign:"right",borderTop:`0.5px solid ${C.border}`,paddingTop:10}}>
            <div style={{fontSize:10,color:C.textMuted,marginBottom:20}}>Authorised Signatory</div>
            <div style={{borderTop:`0.5px solid ${C.black}`,paddingTop:4,width:120,marginLeft:"auto",fontSize:10}}>SIMNANI TEXTILE</div>
          </div>
        </div>
        {/* Controls */}
        <div style={{width:180}}>
          <Card>
            <SectionLabel>Print Options</SectionLabel>
            <Input label="Copies" placeholder="1"/>
            <Input label="Paper Size" placeholder="A5 / A4"/>
            <label style={{display:"flex",alignItems:"center",gap:8,fontSize:12,marginBottom:10}}><input type="checkbox" defaultChecked/> Include company logo</label>
            <label style={{display:"flex",alignItems:"center",gap:8,fontSize:12}}><input type="checkbox" defaultChecked/> Include terms</label>
          </Card>
          <Card>
            <SectionLabel>Order</SectionLabel>
            <FR label="Order ID" value="#1042"/><FR label="Challan No." value="CH-881"/><FR label="Customer" value="A R Garments"/>
            <FR label="Items" value="72 pcs"/><FR label="Total" value="₹87,480" bold/>
          </Card>
        </div>
      </div>
    </Content>
  </WebLayout>
),

// ------------------------------------------------------------------------
// MOBILE SCREENS
// ------------------------------------------------------------------------

"M-01": () => (
  <MobileFrame>
    <div style={{background:C.black,padding:"32px 24px 24px",textAlign:"center"}}>
      <div style={{fontSize:26,fontWeight:700,color:C.white,letterSpacing:2}}>CMS</div>
      <div style={{fontSize:11,color:"#888",marginTop:4}}>CMS  -  Godown App</div>
    </div>
    <div style={{padding:20}}>
      <Input label="Username" placeholder="Enter username" required/>
      <Input label="PIN / Password" placeholder="••••••" required/>
      <div style={{marginTop:4}}><Btn primary full>Sign In</Btn></div>
      <div style={{marginTop:16,padding:"10px 12px",background:C.bgSoft,borderRadius:6,border:`0.5px solid ${C.border}`}}>
        <div style={{fontSize:11,color:C.textMuted}}>PIN login available for quick access</div>
      </div>
    </div>
  </MobileFrame>
),

"M-02": () => (
  <MobileFrame>
    <div style={{background:C.black,padding:"16px 16px 20px"}}>
      <div style={{color:C.white,fontSize:13,fontWeight:700}}>Welcome, Raju</div>
      <div style={{color:"#888",fontSize:11,marginTop:2}}>Godown Staff · 04 Apr 2026</div>
    </div>
    <div style={{padding:14}}>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <div style={{flex:1,background:C.black,color:C.white,borderRadius:6,padding:"14px 10px",textAlign:"center"}}>
          <div style={{fontSize:22,marginBottom:4}}>⊙</div><div style={{fontSize:11,fontWeight:600}}>Scan</div>
        </div>
        <div style={{flex:1,border:`0.5px solid ${C.border}`,borderRadius:6,padding:"14px 10px",textAlign:"center",background:C.white}}>
          <div style={{fontSize:22,marginBottom:4}}>+</div><div style={{fontSize:11,fontWeight:600}}>New Order</div>
        </div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <div style={{flex:1,border:`0.5px solid ${C.border}`,borderRadius:6,padding:"12px 10px",textAlign:"center",background:C.white}}>
          <div style={{fontSize:22,marginBottom:4}}>◉</div><div style={{fontSize:11,fontWeight:600}}>Orders</div>
          <div style={{fontSize:9,color:C.red}}>3 pending</div>
        </div>
        <div style={{flex:1,border:`0.5px solid ${C.border}`,borderRadius:6,padding:"12px 10px",textAlign:"center",background:C.white}}>
          <div style={{fontSize:22,marginBottom:4}}>⊏</div><div style={{fontSize:11,fontWeight:600}}>Dispatch</div>
          <div style={{fontSize:9,color:C.textMuted}}>Picking & LR</div>
        </div>
      </div>
      <Card red>
        <div style={{fontSize:11,fontWeight:600,color:C.red,marginBottom:4}}>⚠ Stock Alert</div>
        <div style={{fontSize:11,color:C.textMuted}}>HT-002-BLU-L  -  only 4 pcs left</div>
      </Card>
      <div style={{padding:"7px 10px",background:C.bgSoft,borderRadius:4,border:`0.5px solid ${C.border}`,fontSize:10,color:C.textMuted,textAlign:"center"}}>
        Tap ☰ Menu in bottom nav for all sections
      </div>
    </div>
    <MBottomNav active="Home"/>
  </MobileFrame>
),

"M-03": () => (
  <MobileFrame>
    <MNav label="Barcode Scanner"/>
    <div style={{background:C.black,height:200,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
      <div style={{border:"2px solid #ffffff44",width:140,height:100,borderRadius:4,position:"relative"}}>
        <div style={{position:"absolute",top:"50%",left:0,right:0,height:1,background:C.red}}/>
      </div>
      <div style={{position:"absolute",bottom:10,right:10,background:"#ffffff22",borderRadius:4,padding:"4px 8px"}}>
        <span style={{color:C.white,fontSize:10}}>Torch ☀</span>
      </div>
    </div>
    <div style={{padding:16}}>
      <div style={{textAlign:"center",fontSize:12,color:C.textMuted,marginBottom:12}}>Point camera at barcode</div>
      <SectionLabel>Scan Mode</SectionLabel>
      <div style={{display:"flex",gap:6,marginBottom:14}}>
        {["Dispatch","Lookup","Order Create"].map((m,i)=>(
          <div key={i} style={{flex:1,textAlign:"center",padding:"7px 4px",borderRadius:4,border:`0.5px solid ${i===0?C.black:C.border}`,background:i===0?C.black:C.white,color:i===0?C.white:C.textMuted,fontSize:10,cursor:"pointer"}}>{m}</div>
        ))}
      </div>
      <Divider label="Or enter manually"/>
      <Input placeholder="Type SKU code..."/>
      <Btn full>Submit</Btn>
    </div>
  </MobileFrame>
),

"M-04": () => (
  <MobileFrame>
    <MNav label="Scan Result"/>
    <div style={{padding:16}}>
      <div style={{textAlign:"center",padding:16,background:C.bgSoft,borderRadius:6,border:`0.5px solid ${C.border}`,marginBottom:14}}>
        <div style={{width:80,height:90,background:C.white,border:`0.5px solid ${C.border}`,borderRadius:4,margin:"0 auto 10px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:C.textLight}}>Design Preview</div>
        <div style={{fontSize:14,fontWeight:700}}>Floral Anarkali</div>
        <div style={{fontSize:11,color:C.textMuted}}>Red / M</div>
        <div style={{fontSize:10,fontFamily:"monospace",color:C.textLight,marginTop:4}}>HT-001-RED-M</div>
      </div>
      <Card>
        <FR label="Mode" value="Dispatch"/><FR label="Stock Updated" value="24 → 20 pcs"/><FR label="CCTV Trigger" value="Recording started ✔"/><FR label="Order" value="#1042"/>
      </Card>
      <div style={{display:"flex",gap:8,marginTop:10}}>
        <Btn primary>Confirm ✔</Btn><Btn>Scan Next</Btn>
      </div>
    </div>
  </MobileFrame>
),

"M-05": () => (
  <MobileFrame>
    <MNav label="Stock In"/>
    <div style={{padding:14}}>
      <div style={{padding:"10px 12px",background:C.black,borderRadius:6,marginBottom:12,display:"flex",gap:10,alignItems:"center"}}>
        <div style={{fontSize:16,color:C.white}}>⊙</div>
        <div><div style={{fontSize:12,fontWeight:600,color:C.white}}>Scan to Add</div><div style={{fontSize:10,color:"#888"}}>Scan or search child SKU</div></div>
      </div>
      <div style={{textAlign:"center",marginBottom:12}}>
        <div style={{width:70,height:80,background:C.bgSoft,border:`0.5px solid ${C.border}`,borderRadius:4,margin:"0 auto 8px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:C.textLight}}>Preview</div>
        <div style={{fontSize:13,fontWeight:700}}>Solid Kurti</div>
        <div style={{fontSize:11,color:C.textMuted}}>HT-002-BLU-L</div>
      </div>
      <Input label="Quantity Received" placeholder="Enter pieces..." required/>
      <Input label="Received Date" placeholder="04 Apr 2026"/>
      <Btn primary full>Confirm Stock In ✔</Btn>
    </div>
  </MobileFrame>
),

"M-06": () => (
  <MobileFrame>
    <MNav label="Stock Lookup"/>
    <div style={{padding:14}}>
      <div style={{padding:"10px 12px",background:C.black,borderRadius:6,marginBottom:12,display:"flex",gap:10,alignItems:"center"}}>
        <div style={{fontSize:14,color:C.white}}>⊙</div>
        <div><div style={{fontSize:12,fontWeight:600,color:C.white}}>Scan Parent SKU</div><div style={{fontSize:10,color:"#888"}}>or search design</div></div>
      </div>
      <div style={{textAlign:"center",marginBottom:10}}>
        <div style={{width:70,height:80,background:C.bgSoft,border:`0.5px solid ${C.border}`,borderRadius:4,margin:"0 auto 8px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:C.textLight}}>Preview</div>
        <div style={{fontSize:13,fontWeight:700}}>Floral Anarkali</div>
        <div style={{fontSize:11,color:C.textMuted}}>HT-001</div>
      </div>
      <div style={{display:"flex",gap:5,marginBottom:8,flexWrap:"wrap"}}>
        {["Red ●","Blue","Black","White"].map((c,i)=>(
          <span key={i} style={{fontSize:10,padding:"3px 8px",border:`0.5px solid ${i===0?C.black:C.border}`,borderRadius:3,background:i===0?C.black:C.white,color:i===0?C.white:C.textMuted}}>{c}</span>
        ))}
      </div>
      <div style={{display:"flex",gap:5,marginBottom:14}}>
        {["S","M ●","L","XL"].map((s,i)=>(
          <span key={i} style={{fontSize:10,padding:"3px 8px",border:`0.5px solid ${i===1?C.black:C.border}`,borderRadius:3,background:i===1?C.black:C.white,color:i===1?C.white:C.textMuted}}>{s}</span>
        ))}
      </div>
      <div style={{background:C.bgSoft,borderRadius:6,padding:14,textAlign:"center",border:`0.5px solid ${C.border}`}}>
        <div style={{fontSize:28,fontWeight:700}}>24</div>
        <div style={{fontSize:11,color:C.textMuted}}>pieces available</div>
        <div style={{fontSize:10,color:C.textLight,marginTop:2}}>Red / M  -  HT-001-RED-M</div>
      </div>
    </div>
  </MobileFrame>
),

"M-07": () => (
  <MobileFrame>
    <MNav label="Order Picking List"/>
    <div style={{padding:14}}>
      <div style={{display:"flex",gap:6,marginBottom:12}}>
        {["Pending (3)","In Progress (1)"].map((s,i)=>(
          <span key={i} style={{flex:1,textAlign:"center",fontSize:12,padding:"7px",border:`0.5px solid ${i===0?C.black:C.border}`,borderRadius:4,background:i===0?C.black:C.white,color:i===0?C.white:C.textMuted}}>{s}</span>
        ))}
      </div>
      {[
        {id:"#1043",cust:"Ramesh Traders",items:4,type:"Retail",urgent:true},
        {id:"#1044",cust:"Suresh Fabrics",items:8,type:"Wholesale",urgent:false},
        {id:"#1045",cust:"Neha Garments",items:3,type:"Retail",urgent:false},
      ].map((o,i)=>(
        <div key={i} style={{border:`0.5px solid ${o.urgent?C.redBorder:C.border}`,borderRadius:6,padding:"12px",marginBottom:10,background:o.urgent?C.redLight:C.white}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <span style={{fontWeight:600,fontSize:13,fontFamily:"monospace"}}>{o.id}</span>
            <div style={{display:"flex",gap:5}}>{o.urgent&&<Tag color="red">Urgent</Tag>}<Tag color={o.type==="Retail"?"black":""}>{o.type}</Tag></div>
          </div>
          <div style={{fontSize:11,color:C.textMuted,marginBottom:8}}>{o.cust} · {o.items} items</div>
          <Btn primary small>Start Picking →</Btn>
        </div>
      ))}
    </div>
    <MBottomNav active="Orders"/>
  </MobileFrame>
),

"M-08": () => (
  <MobileFrame>
    <MNav label="Order #1043" action="Print Challan"/>
    <div style={{padding:14}}>
      <Card>
        <FR label="Customer" value="Ramesh Traders"/><FR label="Type" value="Retail"/><FR label="Destination" value="Mumbai, MH"/><FR label="Items" value="4 pieces"/><FR label="Value" value="₹3,400"/>
      </Card>
      <SectionLabel>Items to Pick</SectionLabel>
      {[{name:"Floral Anarkali",cs:"Red / M",qty:2},{name:"Solid Kurti",cs:"Blue / L",qty:2}].map((item,i)=>(
        <div key={i} style={{border:`0.5px solid ${C.border}`,borderRadius:6,padding:"10px 12px",marginBottom:8,display:"flex",gap:10}}>
          <div style={{width:36,height:40,background:C.bgSoft,borderRadius:3,border:`0.5px solid ${C.border}`,flexShrink:0}}/>
          <div>
            <div style={{fontSize:12,fontWeight:500}}>{item.name}</div>
            <div style={{fontSize:11,color:C.textMuted}}>{item.cs} · Qty: {item.qty}</div>
          </div>
        </div>
      ))}
      {/* Payment section */}
      <Divider label="Payment"/>
      <div style={{background:C.bgSoft,borderRadius:6,padding:"10px 12px",border:`0.5px solid ${C.border}`,marginBottom:10}}>
        <FR label="Order Value" value="₹3,400"/><FR label="Paid" value="₹3,400"/><FR label="Balance" value="₹0"/>
      </div>
      {/* Record payment with adjustment */}
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,padding:"10px 12px",background:C.white,marginBottom:12}}>
        <div style={{fontSize:11,fontWeight:600,marginBottom:8}}>Record Payment</div>
        <Input label="Amount Received (₹)" placeholder="Enter amount..."/>
        <div style={{display:"flex",gap:6,marginBottom:8}}>
          {["Cash","UPI","Bank"].map((m,i)=>(
            <div key={i} style={{flex:1,textAlign:"center",padding:"6px",border:`0.5px solid ${i===1?C.black:C.border}`,borderRadius:4,background:i===1?C.black:C.white,color:i===1?C.white:C.textMuted,fontSize:10}}>{m}</div>
          ))}
        </div>
        {/* Adjustment amount */}
        <div style={{marginBottom:8}}>
          <div style={{fontSize:11,color:C.textMuted,marginBottom:4,fontWeight:500}}>Adjustment (₹) <span style={{fontWeight:400,fontSize:10}}>(optional)</span></div>
          <div style={{display:"flex",gap:6,marginBottom:4}}>
            {["− Deduct","+ Add"].map((t,i)=>(
              <span key={i} style={{fontSize:10,padding:"3px 10px",border:`0.5px solid ${i===0?C.black:C.border}`,borderRadius:3,background:i===0?C.black:C.white,color:i===0?C.white:C.textMuted}}>{t}</span>
            ))}
          </div>
          <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,padding:"6px 8px",fontSize:12,color:C.textLight,background:C.white}}>0.00</div>
          <div style={{fontSize:10,color:C.textMuted,marginTop:3}}>e.g. waive ₹50 rounding, add charge</div>
        </div>
        <Input label="Remarks" placeholder="e.g. 2nd installment"/>
        <Btn primary full>Save Payment ✔</Btn>
      </div>
      <Btn primary full>Begin Picking →</Btn>
    </div>
  </MobileFrame>
),

"M-09": () => (
  <MobileFrame>
    <MNav label="Pick Items  -  #1043"/>
    <div style={{padding:14}}>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        {[["Scanned","2","green"],["Total","4",""],["Left","2","red"]].map(([l,v,color],i)=>(
          <div key={i} style={{flex:1,textAlign:"center",background:C.bgSoft,borderRadius:6,padding:10}}>
            <div style={{fontSize:18,fontWeight:700,color:color==="red"?C.red:color==="green"?C.green:C.text}}>{v}</div>
            <div style={{fontSize:10,color:C.textMuted}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,overflow:"hidden",marginBottom:14}}>
        {[{name:"Floral Anarkali Red/M",done:true},{name:"Floral Anarkali Red/M",done:true},{name:"Solid Kurti Blue/L",done:false},{name:"Solid Kurti Blue/L",done:false}].map((item,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderBottom:`0.5px solid ${C.border}`,background:item.done?"#f0fff0":C.white}}>
            <div style={{width:18,height:18,borderRadius:"50%",background:item.done?C.green:C.bgSoft,border:`0.5px solid ${item.done?C.green:C.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              {item.done&&<span style={{color:C.white,fontSize:10}}>✔</span>}
            </div>
            <span style={{fontSize:11,color:item.done?C.textMuted:C.text}}>{item.name}</span>
          </div>
        ))}
      </div>
      <div style={{textAlign:"center",padding:14,background:C.black,borderRadius:6,color:C.white,fontSize:12}}>⊙ Scan next item...</div>
    </div>
  </MobileFrame>
),

"M-10": () => (
  <MobileFrame>
    <MNav label="Dispatch Confirmation"/>
    <div style={{padding:14}}>
      <div style={{padding:"10px 12px",background:C.greenLight,border:`0.5px solid ${C.greenBorder}`,borderRadius:6,marginBottom:12}}>
        <div style={{fontSize:12,fontWeight:600,color:C.green}}>All 4 items picked ✔</div>
        <div style={{fontSize:11,color:C.textMuted,marginTop:2}}>All items verified  -  ready to dispatch</div>
      </div>
      <Card>
        <SectionLabel>Dispatch Summary</SectionLabel>
        <FR label="Order" value="#1043"/><FR label="Customer" value="Ramesh Traders"/><FR label="Items" value="4 pieces"/><FR label="Value" value="₹3,400"/>
      </Card>
      <div style={{padding:"10px 12px",background:C.black,borderRadius:6,color:C.white,fontSize:11,marginBottom:14}}>
        <div style={{fontWeight:600,marginBottom:4}}>On confirming dispatch:</div>
        <div style={{marginBottom:2}}>• Stock deducted from inventory</div>
        <div>• Order status → Dispatched</div>
      </div>
      {/* Two buttons as per spec */}
      <Btn primary full>Confirm Dispatch ✔</Btn>
      <div style={{height:8}}/>
      <Btn success full>Confirm Dispatch + Print Challan 🖨</Btn>
      <div style={{marginTop:10,padding:"7px 10px",background:C.bgSoft,borderRadius:4,border:`0.5px solid ${C.border}`,fontSize:10,color:C.textMuted,textAlign:"center"}}>
        "Print Challan" connects to paired Bluetooth printer
      </div>
    </div>
  </MobileFrame>
),

"M-11": () => (
  <MobileFrame>
    <MNav label="LR Upload"/>
    <div style={{padding:14}}>
      {/* Step 1: Search order */}
      <SectionLabel>Step 1  -  Find Order</SectionLabel>
      <div style={{display:"flex",gap:8,marginBottom:8}}>
        <div style={{flex:1}}><Input placeholder="Search order no. e.g. #1043..." mono/></div>
        <div style={{paddingTop:0}}><Btn small>⊙ Scan</Btn></div>
      </div>
      {/* Found state */}
      <div style={{padding:"8px 12px",background:C.greenLight,border:`0.5px solid ${C.greenBorder}`,borderRadius:6,marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:600,color:C.green}}>✔ Order #1043 Found</div>
        <div style={{fontSize:11,color:C.textMuted,marginTop:2}}>Ramesh Traders · 4 items · Dispatched</div>
        <div style={{fontSize:11,color:C.textMuted}}>Challan: CH-882</div>
      </div>
      {/* Step 2: Upload LR */}
      <SectionLabel>Step 2  -  Upload LR Document</SectionLabel>
      <div style={{display:"flex",gap:8,marginBottom:8}}>
        <div style={{flex:1,border:`1.5px dashed ${C.border}`,borderRadius:6,padding:14,textAlign:"center",color:C.textMuted,background:C.white}}>
          <div style={{fontSize:20,marginBottom:4}}>{"📷"}</div><div style={{fontSize:11}}>Take Photo</div>
        </div>
        <div style={{flex:1,border:`1.5px dashed ${C.border}`,borderRadius:6,padding:14,textAlign:"center",color:C.textMuted,background:C.white}}>
          <div style={{fontSize:20,marginBottom:4}}>{"📄"}</div><div style={{fontSize:11}}>Upload PDF</div>
        </div>
      </div>
      {/* Uploaded state */}
      <div style={{padding:"8px 12px",background:C.bgSoft,border:`0.5px solid ${C.border}`,borderRadius:6,marginBottom:12,display:"flex",gap:10,alignItems:"center"}}>
        <div style={{fontSize:18}}>{"📄"}</div>
        <div>
          <div style={{fontSize:11,fontWeight:600}}>LR_CH-882.jpg</div>
          <div style={{fontSize:10,color:C.textMuted}}>2.1 MB · Ready to upload</div>
        </div>
        <span style={{marginLeft:"auto",fontSize:11,color:C.red}}>✔</span>
      </div>
      <Btn primary full>Upload LR + Auto Send SMS →</Btn>
      <div style={{marginTop:8,padding:"6px 10px",background:C.bgSoft,borderRadius:4,border:`0.5px solid ${C.border}`,fontSize:10,color:C.textMuted,textAlign:"center"}}>
        SMS with LR tracking link is auto-sent to customer on upload
      </div>
      {/* Resend SMS option (shown after upload) */}
      <Divider label="After Upload"/>
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,padding:"10px 12px",background:C.white}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
          <div style={{fontSize:11,fontWeight:600}}>SMS Status</div>
          <Tag color="black">Delivered ✔</Tag>
        </div>
        <div style={{fontSize:11,color:C.textMuted,marginBottom:8}}>Sent to +91 76543 21098 at 09:48</div>
        <Btn small>Resend SMS</Btn>
      </div>
    </div>
  </MobileFrame>
),

"M-12": () => (
  <MobileFrame>
    <MNav label="LR Submitted"/>
    <div style={{padding:24,textAlign:"center"}}>
      <div style={{width:60,height:60,background:C.greenLight,border:`0.5px solid ${C.greenBorder}`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:24}}>✔</div>
      <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>LR Uploaded Successfully</div>
      <div style={{fontSize:11,color:C.textMuted,marginBottom:20}}>Order #1043 · Challan CH-882</div>
      <Card>
        <FR label="LR Document" value="Uploaded ✔"/><FR label="SMS to Customer" value="Delivered ✔"/><FR label="Mobile" value="+91 76543 21098"/><FR label="Sent At" value="09:48:22"/>
      </Card>
      <div style={{marginTop:14}}><Btn primary full>← Back to Orders</Btn></div>
    </div>
  </MobileFrame>
),

// ------------------------------------------------------------------------
// MOBILE  -  CREATE ORDER
// ------------------------------------------------------------------------

// ── RETAIL ORDER (MOBILE) ──────────────────────
"M-15R": () => (
  <MobileFrame>
    <MNav label="New Retail Order"/>
    <div style={{padding:14,paddingBottom:80}}>
      {/* Type indicator */}
      <div style={{display:"flex",gap:6,marginBottom:14}}>
        <div style={{flex:1,textAlign:"center",padding:"8px",background:C.black,color:C.white,borderRadius:4,fontSize:12,fontWeight:600}}>Retail ✔</div>
        <div style={{flex:1,textAlign:"center",padding:"8px",border:`0.5px solid ${C.border}`,borderRadius:4,fontSize:12,color:C.textMuted}}>Wholesale</div>
      </div>

      {/* Customer  -  optional for retail, quick add */}
      <SectionLabel>Customer (optional)</SectionLabel>
      <div style={{fontSize:10,color:C.textMuted,marginBottom:8,padding:"5px 8px",background:C.bgSoft,borderRadius:4}}>
        Can proceed without a customer. Walk-in / anonymous sale allowed.
      </div>
      <Input placeholder="Search by name or phone..." note="Or add new below"/>
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,padding:"8px 10px",background:C.bgSoft,marginBottom:10}}>
        <div style={{fontSize:10,fontWeight:600,color:C.textMuted,marginBottom:6,textTransform:"uppercase"}}>Quick Add</div>
        <Input label="Name *" placeholder="Customer name"/>
        <Input label="Phone *" placeholder="+91 98765 43210" note="For LR SMS"/>
      </div>
      <div style={{padding:"7px 10px",background:C.greenLight,border:`0.5px solid ${C.greenBorder}`,borderRadius:6,marginBottom:12,fontSize:11}}>
        <div style={{fontWeight:600,color:C.green}}>✔ Ramesh Traders</div>
        <div style={{color:C.textMuted}}>+91 76543 21098 · Retail</div>
      </div>

      {/* Scan items  -  retail price */}
      <SectionLabel>Scan Items  -  Retail Price</SectionLabel>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <div style={{flex:1,border:`0.5px solid ${C.border}`,borderRadius:4,padding:"7px 10px",fontSize:12,color:C.textLight,background:C.white}}>Search SKU...</div>
        <div style={{background:C.black,color:C.white,borderRadius:4,padding:"7px 10px",fontSize:11,fontWeight:600}}>⊙</div>
      </div>
      {/* Item card  -  shows retail price, per-item discount */}
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,padding:"10px 12px",marginBottom:10}}>
        <div style={{display:"flex",gap:8,marginBottom:8}}>
          <div style={{width:38,height:44,background:C.bgSoft,borderRadius:3,border:`0.5px solid ${C.border}`,flexShrink:0}}/>
          <div style={{flex:1}}>
            <div style={{fontSize:12,fontWeight:600}}>Floral Anarkali</div>
            <div style={{fontSize:11,color:C.textMuted}}>HT-001-RED-M</div>
            <div style={{fontSize:12,fontWeight:600,color:C.text}}>₹850 <span style={{fontSize:10,fontWeight:400,color:C.textMuted}}>(retail)</span></div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:24,height:24,border:`0.5px solid ${C.border}`,borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>−</div>
              <span style={{fontSize:14,fontWeight:700}}>2</span>
              <div style={{width:24,height:24,border:`0.5px solid ${C.border}`,borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>+</div>
            </div>
            <Input label="Disc %" placeholder="0"/>
          </div>
        </div>
        <Btn primary small>+ Add to Order</Btn>
      </div>
      {/* Order list */}
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,overflow:"hidden",marginBottom:12}}>
        <div style={{display:"flex",padding:"5px 10px",background:C.bgSoft,fontSize:9,fontWeight:700,color:C.textMuted,textTransform:"uppercase"}}>
          <div style={{flex:1.5}}>Item</div><div style={{flex:0.4}}>Qty</div><div style={{flex:0.5}}>Disc</div><div style={{flex:0.7,textAlign:"right"}}>Amt</div><div style={{flex:0.3}}/>
        </div>
        {[{n:"Floral Red/M",q:2,d:"0%",a:"₹1,700"},{n:"Solid Blue/L",q:1,d:"0%",a:"₹490"}].map((item,i)=>(
          <div key={i} style={{display:"flex",gap:4,padding:"6px 10px",borderTop:`0.5px solid ${C.border}`,fontSize:11}}>
            <div style={{flex:1.5,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{item.n}</div><div style={{flex:0.4}}>{item.q}</div><div style={{flex:0.5,color:C.textMuted}}>{item.d}</div>
            <div style={{flex:0.7,fontWeight:600,textAlign:"right"}}>{item.a}</div><div style={{flex:0.3,color:C.red}}>✔</div>
          </div>
        ))}
        <div style={{display:"flex",justifyContent:"space-between",padding:"6px 10px",background:C.bgSoft,fontSize:12,fontWeight:700,borderTop:`0.5px solid ${C.border}`}}>
          <span>Total</span><span>₹2,190</span>
        </div>
      </div>

      {/* Payment  -  typically immediate for retail */}
      <SectionLabel>Payment</SectionLabel>
      <div style={{display:"flex",gap:6,marginBottom:8}}>
        {["Cash ●","UPI","Bank"].map((m,i)=>(
          <div key={i} style={{flex:1,textAlign:"center",padding:"7px",border:`0.5px solid ${i===0?C.black:C.border}`,borderRadius:4,background:i===0?C.black:C.white,color:i===0?C.white:C.textMuted,fontSize:10}}>{m}</div>
        ))}
      </div>
      <Input label="Amount Received (₹)" placeholder="₹2,190" note="Full payment typical at counter"/>
      <div style={{padding:"6px 8px",background:"#edf7f1",border:`0.5px solid ${C.greenBorder}`,borderRadius:4,fontSize:10,color:C.green,marginBottom:12}}>
        ✔ Retail: No approval needed  -  submits directly to dispatch
      </div>
      <Btn primary full>Submit + Print Challan →</Btn>
    </div>
  </MobileFrame>
),

// ── WHOLESALE ORDER (MOBILE) ──────────────────────
"M-15W": () => (
  <MobileFrame>
    <MNav label="New Wholesale Order"/>
    <div style={{padding:14,paddingBottom:80}}>
      {/* Type indicator */}
      <div style={{display:"flex",gap:6,marginBottom:14}}>
        <div style={{flex:1,textAlign:"center",padding:"8px",border:`0.5px solid ${C.border}`,borderRadius:4,fontSize:12,color:C.textMuted}}>Retail</div>
        <div style={{flex:1,textAlign:"center",padding:"8px",background:C.black,color:C.white,borderRadius:4,fontSize:12,fontWeight:600}}>Wholesale ✔</div>
      </div>

      {/* Customer  -  must be pre-registered */}
      <SectionLabel>Wholesale Customer *</SectionLabel>
      <div style={{fontSize:10,color:C.textMuted,marginBottom:8,padding:"5px 8px",background:C.bgSoft,borderRadius:4}}>
        Must be a registered wholesale account with credit limit set.
      </div>
      <Input placeholder="Search registered dealers by name or phone..." required/>
      {/* Dropdown */}
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,background:C.white,marginBottom:8,overflow:"hidden"}}>
        {[
          {name:"Neha Garments",phone:"+91 98765 00011",bal:"₹22,800",limit:"₹50k",disc:"5%"},
          {name:"Ramesh Wholesale",phone:"+91 99876 00011",bal:"₹0",limit:"₹30k",disc:"0%"},
        ].map((c,i)=>(
          <div key={i} style={{padding:"8px 10px",borderBottom:`0.5px solid ${C.border}`,background:i===0?C.bgSoft:C.white}}>
            <div style={{fontSize:12,fontWeight:i===0?600:400}}>{c.name}</div>
            <div style={{fontSize:10,color:C.textMuted}}>{"📞"} {c.phone} · Bal: <span style={{color:c.bal!=="₹0"?C.red:C.text}}>{c.bal}</span> · Disc: {c.disc}</div>
          </div>
        ))}
        <div style={{padding:"8px 10px",background:C.black,fontSize:11,color:C.white,fontWeight:600}}>+ Register New Wholesale Customer →</div>
      </div>
      {/* Selected  -  shows credit details */}
      <div style={{padding:"8px 10px",background:C.greenLight,border:`0.5px solid ${C.greenBorder}`,borderRadius:6,marginBottom:12}}>
        <div style={{fontSize:12,fontWeight:600,color:C.green}}>✔ Neha Garments</div>
        <div style={{display:"flex",gap:10,marginTop:4,flexWrap:"wrap"}}>
          <span style={{fontSize:10,color:C.textMuted}}>Credit: 30d</span>
          <span style={{fontSize:10,color:C.textMuted}}>Limit: ₹50,000</span>
          <span style={{fontSize:10,color:C.red,fontWeight:600}}>Due: ₹22,800</span>
          <span style={{fontSize:10,color:C.green,fontWeight:600}}>Disc: 5%</span>
        </div>
      </div>

      {/* Scan items  -  wholesale price + auto discount */}
      <SectionLabel>Scan Items  -  Wholesale Price + 5% Discount</SectionLabel>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <div style={{flex:1,border:`0.5px solid ${C.border}`,borderRadius:4,padding:"7px 10px",fontSize:12,color:C.textLight,background:C.white}}>Search SKU...</div>
        <div style={{background:C.black,color:C.white,borderRadius:4,padding:"7px 10px",fontSize:11,fontWeight:600}}>⊙</div>
      </div>
      {/* Item card  -  shows wholesale price + customer discount applied */}
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,padding:"10px 12px",marginBottom:10}}>
        <div style={{display:"flex",gap:8,marginBottom:8}}>
          <div style={{width:38,height:44,background:C.bgSoft,borderRadius:3,border:`0.5px solid ${C.border}`,flexShrink:0}}/>
          <div style={{flex:1}}>
            <div style={{fontSize:12,fontWeight:600}}>Floral Anarkali</div>
            <div style={{fontSize:11,color:C.textMuted}}>HT-001-RED-M</div>
            <div style={{fontSize:11}}>W/S: ₹580 → <strong style={{color:C.green}}>₹551</strong> <span style={{fontSize:10,color:C.textMuted}}>(−5%)</span></div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:24,height:24,border:`0.5px solid ${C.border}`,borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>−</div>
            <span style={{fontSize:14,fontWeight:700}}>6</span>
            <div style={{width:24,height:24,border:`0.5px solid ${C.border}`,borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>+</div>
          </div>
        </div>
        <Btn primary small>+ Add to Order</Btn>
      </div>
      {/* Order list  -  shows net price after discount */}
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,overflow:"hidden",marginBottom:12}}>
        <div style={{display:"flex",padding:"5px 10px",background:C.bgSoft,fontSize:9,fontWeight:700,color:C.textMuted,textTransform:"uppercase"}}>
          <div style={{flex:1.5}}>Item</div><div style={{flex:0.4}}>Qty</div><div style={{flex:0.7}}>Net ₹</div><div style={{flex:0.7,textAlign:"right"}}>Amt</div><div style={{flex:0.3}}/>
        </div>
        {[{n:"Floral Red/M",q:6,net:"₹551",a:"₹3,306"},{n:"Solid Blue/L",q:4,net:"₹332",a:"₹1,330"}].map((item,i)=>(
          <div key={i} style={{display:"flex",gap:4,padding:"6px 10px",borderTop:`0.5px solid ${C.border}`,fontSize:11}}>
            <div style={{flex:1.5,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{item.n}</div><div style={{flex:0.4}}>{item.q}</div><div style={{flex:0.7,color:C.green}}>{item.net}</div>
            <div style={{flex:0.7,fontWeight:600,textAlign:"right"}}>{item.a}</div><div style={{flex:0.3,color:C.red}}>✔</div>
          </div>
        ))}
        <div style={{padding:"5px 10px",background:C.bgSoft,borderTop:`0.5px solid ${C.border}`,fontSize:11}}>
          <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:C.textMuted}}>Gross</span><span>₹4,880</span></div>
          <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:C.green}}>Discount (5%)</span><span style={{color:C.green}}>−₹244</span></div>
          <div style={{display:"flex",justifyContent:"space-between",fontWeight:700,marginTop:2}}><span>Net Total</span><span>₹4,636</span></div>
        </div>
      </div>

      {/* Payment  -  credit option for wholesale */}
      <SectionLabel>Payment</SectionLabel>
      <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>
        {["Bank ●","UPI","Cash","Credit"].map((m,i)=>(
          <div key={i} style={{padding:"6px 10px",border:`0.5px solid ${i===0?C.black:C.border}`,borderRadius:4,background:i===0?C.black:C.white,color:i===0?C.white:C.textMuted,fontSize:10}}>{m}</div>
        ))}
      </div>
      <Input label="Amount Paid Now (₹)" placeholder="₹0  -  credit allowed" note="0 = Unpaid · Partial = Partial Paid"/>
      <Input label="Reference no. (optional)" placeholder="UTR / Cheque no."/>

      {/* Wholesale-only fields */}
      <SectionLabel>Logistics (Wholesale Only)</SectionLabel>
      <Input label="Broker" placeholder="Broker name (if applicable)"/>
      <Input label="Transport / Carrier" placeholder="Customer's preferred transport"/>

      <div style={{padding:"6px 8px",background:"#fff8e1",border:`0.5px solid #f5c842`,borderRadius:4,fontSize:10,color:"#7a5c00",marginBottom:12}}>
        ⚠ Goes to Approval Queue  -  stock not deducted until admin approves
      </div>
      <Btn primary full>Submit Order + Print Challan →</Btn>
    </div>
  </MobileFrame>
),

// ------------------------------------------------------------------------
// MOBILE  -  WHOLESALE APPROVAL
// ------------------------------------------------------------------------

"M-16": () => (
  <MobileFrame>
    <MNav label="Wholesale Approvals"/>
    <div style={{padding:14}}>
      <div style={{display:"flex",gap:6,marginBottom:12}}>
        {["Pending (4)","Approved","Rejected"].map((s,i)=>(
          <span key={i} style={{flex:1,textAlign:"center",fontSize:11,padding:"6px 4px",border:`0.5px solid ${i===0?C.black:C.border}`,borderRadius:4,background:i===0?C.black:C.white,color:i===0?C.white:C.textMuted}}>{s}</span>
        ))}
      </div>
      {[
        {id:"#W-1008",cust:"Ramesh Traders",items:12,val:"₹18,400",time:"10 min ago",urgent:true},
        {id:"#W-1007",cust:"Suresh Fabrics",items:8,val:"₹11,200",time:"1h ago",urgent:false},
      ].map((o,i)=>(
        <div key={i} style={{border:`0.5px solid ${o.urgent?C.redBorder:C.border}`,borderRadius:8,padding:12,marginBottom:10,background:o.urgent?C.redLight:C.white}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
            <div><div style={{fontSize:13,fontWeight:700,fontFamily:"monospace"}}>{o.id}</div><div style={{fontSize:11,color:C.textMuted}}>{o.cust}</div></div>
            <div style={{textAlign:"right"}}>{o.urgent&&<Tag color="red">Urgent</Tag>}<div style={{fontSize:10,color:C.textMuted,marginTop:3}}>{o.time}</div></div>
          </div>
          <div style={{display:"flex",gap:10,marginBottom:10,padding:"6px 0",borderTop:`0.5px solid ${o.urgent?C.redBorder:C.border}`,borderBottom:`0.5px solid ${o.urgent?C.redBorder:C.border}`}}>
            <div style={{textAlign:"center"}}><div style={{fontSize:14,fontWeight:700}}>{o.items}</div><div style={{fontSize:9,color:C.textMuted}}>ITEMS</div></div>
            <div style={{textAlign:"center"}}><div style={{fontSize:14,fontWeight:700}}>{o.val}</div><div style={{fontSize:9,color:C.textMuted}}>VALUE</div></div>
            <div style={{marginLeft:"auto",display:"flex",alignItems:"center"}}><span style={{fontSize:11,color:C.red,cursor:"pointer"}}>View items →</span></div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <div style={{flex:1,background:C.black,color:C.white,borderRadius:4,padding:"8px",textAlign:"center",fontSize:12,fontWeight:600}}>✔ Approve</div>
            <div style={{flex:1,background:C.white,color:C.red,border:`0.5px solid ${C.redBorder}`,borderRadius:4,padding:"8px",textAlign:"center",fontSize:12,fontWeight:600}}>✔ Reject</div>
          </div>
        </div>
      ))}
    </div>
    <MBottomNav active="Orders"/>
  </MobileFrame>
),

// ------------------------------------------------------------------------
// MOBILE  -  CUSTOMER CREATE
// ------------------------------------------------------------------------

"M-17": () => (
  <MobileFrame>
    <MNav label="New Customer"/>
    <div style={{padding:14,paddingBottom:80}}>
      <div style={{padding:"8px 12px",background:C.black,borderRadius:6,marginBottom:14,display:"flex",gap:10,alignItems:"center"}}>
        <div style={{fontSize:14,color:C.white}}>+</div>
        <div><div style={{fontSize:12,fontWeight:600,color:C.white}}>Register New Customer</div><div style={{fontSize:10,color:"#888"}}>Wholesale account · Admin only</div></div>
      </div>
      <SectionLabel>Business Info</SectionLabel>
      <Input label="Name *" placeholder="Business / shop name" required/>
      <Input label="Address *" placeholder="Full address" required/>
      <div style={{display:"flex",gap:8}}>
        <div style={{flex:1}}><Input label="Area" placeholder="Locality / area"/></div>
        <div style={{flex:1}}><Input label="City *" placeholder="City" required/></div>
      </div>
      <div style={{display:"flex",gap:8}}>
        <div style={{flex:1}}><Input label="State" placeholder="State"/></div>
        <div style={{flex:1}}><Input label="Pincode" placeholder="395001"/></div>
      </div>
      <SectionLabel>Contact</SectionLabel>
      <Input label="WhatsApp Mobile *" placeholder="+91 98765 43210" required note="For LR SMS delivery"/>
      <Input label="Phone No." placeholder="+91 alternate"/>
      <Input label="Email" placeholder="email@example.com (optional)"/>
      <SectionLabel>Financial</SectionLabel>
      <div style={{display:"flex",gap:8}}>
        <div style={{flex:1}}><Input label="Cr Day" placeholder="30"/></div>
        <div style={{flex:1}}><Input label="Cr Limit (₹)" placeholder="50,000"/></div>
      </div>
      <div style={{display:"flex",gap:8}}>
        <div style={{flex:1}}><Input label="Discount %" placeholder="e.g. 5" note="Auto-applied on orders"/></div>
        <div style={{flex:1}}><Input label="GST No." placeholder="(optional)"/></div>
      </div>
      <SectionLabel>Other</SectionLabel>
      <Input label="Transport Name" placeholder="Preferred transport / carrier"/>
      <Input label="Broker" placeholder="Broker name if applicable"/>
      <Input label="Remarks" placeholder="Any notes about this customer"/>
      <Card red>
        <div style={{fontSize:11,fontWeight:600,color:C.red}}>WhatsApp Mobile required</div>
        <div style={{fontSize:10,color:C.textMuted,marginTop:2}}>Used for LR SMS on every dispatch</div>
      </Card>
      <label style={{display:"flex",alignItems:"center",gap:8,fontSize:12,marginBottom:14}}><input type="checkbox" defaultChecked/> Send welcome SMS on save</label>
      <Btn primary full>Save Customer →</Btn>
    </div>
  </MobileFrame>
),

// ------------------------------------------------------------------------
// MOBILE  -  CCTV RECORDING
// ------------------------------------------------------------------------

"M-19": () => (
  <MobileFrame>
    <MNav label="CCTV Recording"/>
    <div style={{padding:14}}>
      <SectionLabel>Step 1  -  Scan or Enter Order ID</SectionLabel>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <div style={{flex:1}}><Input placeholder="Scan Order ID label or type..." mono/></div>
        <Btn small>⊙</Btn>
      </div>
      {/* Found state */}
      <div style={{padding:"10px 12px",background:C.greenLight,border:`0.5px solid ${C.greenBorder}`,borderRadius:6,marginBottom:8}}>
        <div style={{fontSize:12,fontWeight:600,color:C.green}}>✔ Order #1043 Found</div>
        <div style={{fontSize:11,marginTop:2}}>Ramesh Traders · 4 items</div>
        <div style={{fontSize:11,color:C.textMuted}}>Challan: CH-882</div>
      </div>
      {/* Print Label button */}
      <div style={{display:"flex",gap:8,alignItems:"center",padding:"8px 0",marginBottom:6}}>
        <Btn small>🖨 Print Label</Btn>
        <span style={{fontSize:10,color:C.textMuted}}>Prints order ID label for scanning</span>
      </div>
      <SectionLabel>Step 2  -  Camera</SectionLabel>
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        {["CAM-1 (Dispatch A) ●","CAM-2 (Dispatch B)"].map((c,i)=>(
          <div key={i} style={{flex:1,padding:"8px",border:`0.5px solid ${i===0?C.black:C.border}`,borderRadius:4,background:i===0?C.black:C.white,color:i===0?C.white:C.textMuted,fontSize:10,textAlign:"center"}}>{c}</div>
        ))}
      </div>
      <SectionLabel>Step 3  -  Record</SectionLabel>
      {/* Ready state */}
      <div style={{padding:16,background:C.bgSoft,borderRadius:6,border:`0.5px solid ${C.border}`,textAlign:"center",marginBottom:10}}>
        <div style={{fontSize:11,color:C.textMuted,marginBottom:10}}>Ready · CAM-1 connected</div>
        <Btn success full>▶ Start Recording</Btn>
      </div>
      {/* Recording state */}
      <div style={{padding:16,background:C.black,borderRadius:6,textAlign:"center"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:6}}>
          <div style={{width:10,height:10,borderRadius:"50%",background:C.red}}/>
          <span style={{color:C.white,fontSize:13,fontWeight:700}}>RECORDING</span>
        </div>
        <div style={{fontSize:20,fontWeight:700,color:C.white,marginBottom:4}}>01:24</div>
        <div style={{fontSize:10,color:"#888",marginBottom:12}}>Order #1043 · CAM-1</div>
        <Btn danger full>◼ Stop & Save</Btn>
      </div>
      <div style={{marginTop:8,fontSize:10,color:C.textMuted,textAlign:"center"}}>Clip auto-linked to Order #1043 on save</div>
    </div>
  </MobileFrame>
),

// ------------------------------------------------------------------------
// MOBILE  -  CHALLAN PRINT
// ------------------------------------------------------------------------

"M-18": () => (
  <MobileFrame>
    <MNav label="Challan Print"/>
    <div style={{padding:14}}>
      <div style={{fontSize:11,color:C.textMuted,marginBottom:12}}>Order #1043 · Ramesh Traders</div>
      {/* Challan preview scaled to mobile */}
      <div style={{background:C.white,border:`0.5px solid ${C.border}`,borderRadius:6,padding:14,marginBottom:14,fontSize:10}}>
        <div style={{borderBottom:`1.5px solid ${C.black}`,paddingBottom:8,marginBottom:8}}>
          <div style={{fontSize:14,fontWeight:700}}>SIMNANI TEXTILE</div>
          <div style={{color:C.textMuted}}>9104670469 / 7990501710</div>
        </div>
        <div style={{marginBottom:8}}>
          <div style={{fontWeight:600}}>M/s. RAMESH TRADERS</div>
          <div style={{color:C.textMuted}}>AHMEDABAD, GUJARAT</div>
          <div>Mob: +91 76543 21098</div>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
          <div><div style={{color:C.textMuted}}>Challan No.</div><div style={{fontWeight:700,fontSize:14}}>CH-882</div></div>
          <div style={{textAlign:"right"}}><div style={{color:C.textMuted}}>Date</div><div style={{fontWeight:600}}>04/04/2026</div></div>
        </div>
        <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden",marginBottom:8}}>
          <div style={{display:"flex",background:C.bgSoft,padding:"4px 6px",fontWeight:700,color:C.textMuted,gap:4}}>
            {["#","Description","PCS","Rate","Amt"].map((h,i)=><div key={i} style={{flex:[0.3,1.2,0.4,0.6,0.7][i]}}>{h}</div>)}
          </div>
          {[["1","HT-001-RED-M","4","850","3400"],["2","HT-002-BLU-L","2","840","1680"]].map((row,i)=>(
            <div key={i} style={{display:"flex",padding:"4px 6px",borderTop:`0.5px solid ${C.border}`,gap:4}}>
              {row.map((v,j)=><div key={j} style={{flex:[0.3,1.2,0.4,0.6,0.7][j],fontFamily:j>=2?"monospace":"inherit"}}>{v}</div>)}
            </div>
          ))}
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",fontSize:12,fontWeight:700,borderTop:`1px solid ${C.black}`,paddingTop:6}}>
          Total: ₹5,080.00
        </div>
        <div style={{marginTop:8,color:C.textMuted,fontSize:9}}>
          • Goods checked carefully before dispatch<br/>
          • Subject to SURAT Jurisdiction
        </div>
        <div style={{textAlign:"right",marginTop:8,fontSize:9}}>Authorised Signatory ___________</div>
      </div>
      <div style={{display:"flex",gap:8}}>
        <Btn primary full>🖨 Print Challan</Btn>
      </div>
      <div style={{marginTop:8,textAlign:"center",fontSize:11,color:C.textMuted}}>Connects to paired Bluetooth printer</div>
    </div>
  </MobileFrame>
),

// ------------------------------------------------------------------------
// MOBILE  -  GENERAL
// ------------------------------------------------------------------------

"M-13": () => (
  <MobileFrame>
    <MNav label="Notifications"/>
    <div style={{padding:14}}>
      <div style={{display:"flex",gap:6,marginBottom:12}}>
        {["All","Orders","Alerts","Sync"].map((s,i)=>(
          <span key={i} style={{flex:1,textAlign:"center",fontSize:10,padding:"5px 4px",border:`0.5px solid ${i===0?C.black:C.border}`,borderRadius:3,background:i===0?C.black:C.white,color:i===0?C.white:C.textMuted}}>{s}</span>
        ))}
      </div>
      {[
        {title:"New order #1045 received",time:"Just now",type:"order"},
        {title:"Low stock: HT-002-BLU-L (4 pcs)",time:"2m ago",type:"alert"},
        {title:"Sync completed  -  3 items updated",time:"15m ago",type:"sync"},
        {title:"Wholesale #W-1008 approved",time:"30m ago",type:"order"},
        {title:"Payment confirmed  -  #1040",time:"1h ago",type:"order"},
      ].map((n,i)=>(
        <div key={i} style={{border:`0.5px solid ${n.type==="alert"?C.redBorder:C.border}`,borderRadius:6,padding:"10px 12px",marginBottom:8,background:n.type==="alert"?C.redLight:C.white}}>
          <div style={{fontSize:12,fontWeight:500,color:n.type==="alert"?C.red:C.text,marginBottom:2}}>{n.title}</div>
          <div style={{fontSize:10,color:C.textMuted}}>{n.time}</div>
        </div>
      ))}
    </div>
  </MobileFrame>
),

"M-14": () => (
  <MobileFrame>
    <MNav label="Profile & Settings"/>
    <div style={{padding:14}}>
      <div style={{textAlign:"center",padding:"16px 0 20px"}}>
        <div style={{width:56,height:56,borderRadius:"50%",background:C.black,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",fontSize:18,color:C.white}}>R</div>
        <div style={{fontSize:14,fontWeight:700}}>Raju Singh</div>
        <div style={{fontSize:11,color:C.textMuted}}>Godown Staff</div>
      </div>
      <Card>
        <FR label="Username" value="raju.singh"/><FR label="Role" value="Godown Staff"/><FR label="App Version" value="v2.0.0"/>
      </Card>
      <Card>
        <SectionLabel>Settings</SectionLabel>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:`0.5px solid ${C.border}`}}>
          <span style={{fontSize:12}}>Push Notifications</span><span style={{fontSize:11,color:C.textMuted}}>ON</span>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:`0.5px solid ${C.border}`}}>
          <span style={{fontSize:12}}>Auto-sync Interval</span><span style={{fontSize:11,color:C.textMuted}}>30s</span>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0"}}>
          <span style={{fontSize:12}}>Paired Printer</span><span style={{fontSize:11,color:C.textMuted}}>BT-POS-58</span>
        </div>
      </Card>
      <Btn danger full>Sign Out</Btn>
    </div>
  </MobileFrame>
),

// ------------------------------------------------------------------------
// MOBILE  -  SLIDE MENU
// ------------------------------------------------------------------------

"M-20": () => (
  <MobileFrame menuOpen={true}>
    <MNav label="Home Dashboard"/>
    <div style={{padding:14}}>
      <div style={{padding:"20px",textAlign:"center",color:C.textMuted,fontSize:12}}>← Tap ☰ Menu to open drawer</div>
    </div>
    <MBottomNav active="Menu"/>
  </MobileFrame>
),

// ------------------------------------------------------------------------
// PUBLIC
// ------------------------------------------------------------------------

"P-01": () => (
  <div style={{maxWidth:420,margin:"0 auto",background:C.white,borderRadius:8,border:`0.5px solid ${C.border}`,overflow:"hidden"}}>
    <div style={{background:C.black,padding:"16px 20px"}}>
      <div style={{fontSize:16,fontWeight:700,color:C.white,letterSpacing:1}}>CMS</div>
      <div style={{fontSize:11,color:"#888",marginTop:2}}>Logistics Receipt</div>
    </div>
    <div style={{padding:20}}>
      <div style={{display:"flex",gap:10,marginBottom:16}}>
        <div><div style={{fontSize:10,color:C.textMuted}}>ORDER ID</div><div style={{fontSize:14,fontWeight:700}}>#1042</div></div>
        <div style={{marginLeft:"auto",textAlign:"right"}}><div style={{fontSize:10,color:C.textMuted}}>CHALLAN</div><div style={{fontSize:14,fontWeight:700}}>CH-881</div></div>
      </div>
      <Card>
        <FR label="LR Number" value="BD-2026-4458812"/><FR label="Dispatched" value="04 Apr 2026, 09:45"/>
      </Card>
      <div style={{height:180,background:C.bgSoft,border:`0.5px solid ${C.border}`,borderRadius:6,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",marginBottom:14}}>
        <div style={{fontSize:24,marginBottom:6}}>{"📄"}</div>
        <div style={{fontSize:12,color:C.textMuted}}>LR Document</div>
        <div style={{fontSize:10,color:C.textLight}}>Tap to view full size</div>
      </div>
      <div style={{textAlign:"center",padding:"8px 12px",background:C.bgSoft,borderRadius:4,fontSize:10,color:C.textMuted,border:`0.5px solid ${C.border}`}}>
        No login required · Link valid for 90 days
      </div>
    </div>
  </div>
),
// ------------------------------------------------------------------------
// GMMS  -  MANUFACTURING ERP SCREENS
// ------------------------------------------------------------------------

// G-12: Production Dashboard
"G-12": () => {
  const [erpMode,setErpMode]=useState("Manufacturing ERP");
  return(
  <WebLayout activeMenu="Dashboard" mode="mfg">
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 16px",borderBottom:`0.5px solid ${CO.accentBorder}`,background:CO.accentLight}}>
      <div><div style={{fontSize:14,fontWeight:600}}>Production Dashboard</div><div style={{fontSize:10,color:CO.accent,marginTop:1,fontWeight:500}}>07 May 2026 · Live</div></div>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"5px 10px",background:C.white,border:`0.5px solid ${CO.accentBorder}`,borderRadius:20}}>
          <span style={{fontSize:10,fontWeight:600,color:erpMode==="Sales ERP"?C.black:C.textMuted}}>Sales ERP</span>
          <div onClick={()=>setErpMode(erpMode==="Sales ERP"?"Manufacturing ERP":"Sales ERP")} style={{width:36,height:20,borderRadius:10,background:erpMode==="Manufacturing ERP"?CO.accent:C.border,cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0}}>
            <div style={{position:"absolute",top:3,left:erpMode==="Manufacturing ERP"?17:3,width:14,height:14,borderRadius:"50%",background:C.white,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.25)"}}/>
          </div>
          <span style={{fontSize:10,fontWeight:600,color:erpMode==="Manufacturing ERP"?C.black:C.textMuted}}>Manufacturing ERP</span>
        </div>
        <div style={{display:"flex",gap:6}}>
          {[
            {label:"New Challan",nav:"G-02",col:CO.accent},
            {label:"Reprocess",nav:"G-13",col:"#8e44ad"},
            {label:"RF / Alter",nav:"G-20",col:"#e67e22"},
            {label:"Remarks",nav:"G-18",col:"#2980b9"},
          ].map((a,i)=>(
            <div key={i} style={{padding:"4px 10px",background:a.col+"18",border:`0.5px solid ${a.col}40`,borderRadius:4,fontSize:10,fontWeight:600,color:a.col,cursor:"pointer"}}>{a.label}</div>
          ))}
        </div>
      </div>
    </div>
    <Content>
      <div style={{display:"flex",gap:10,marginBottom:14}}>
        <Metric label="Active Challans" value="42" sub="12 started today"/>
        <Metric label="Overdue Challans" value="7" sub="Needs attention" alert/>
        <Metric label="Pieces in Production" value="3,840" sub="Across 42 challans"/>
        <Metric label="Pending Payments" value={"₹18.5L"} sub="12 contractors" alert/>
        <Metric label="RF Alerts" value="3" sub="Challans in RF state" alert/>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
        {[["EMB",12,"#e67e22"],["STH",8,"#2980b9"],["DIA",6,"#8e44ad"],["WASH",4,"#1abc9c"],["CUT",3,"#95a5a6"],["FIN",2,"#27ae60"]].map(([stage,cnt,color],i)=>(
          <div key={i} style={{padding:"4px 12px",borderRadius:16,fontSize:11,fontWeight:600,background:color+"18",color,border:`1px solid ${color}40`}}>{stage}: {cnt}</div>
        ))}
      </div>
      <div style={{display:"flex",gap:12}}>
        <div style={{flex:2}}>
          <Card>
            <div style={{fontSize:12,fontWeight:600,marginBottom:10}}>Overdue Challans</div>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden"}}>
              <TH cols={[{v:"C.No",w:0.6},{v:"Design"},{v:"Stage"},{v:"Contractor"},{v:"Days Over",w:0.7},{v:"Action",w:0.6}]}/>
              {[
                {cn:"3202",design:"D-710",stage:"Stitching",contractor:"Raju Tailor",days:4},
                {cn:"3198",design:"D-688",stage:"Embroidery",contractor:"Salim Works",days:3},
                {cn:"3195",design:"D-695",stage:"Diamond",contractor:"Hari Gems",days:2},
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 10px",borderBottom:`0.5px solid ${C.border}`,fontSize:11}}>
                  <div style={{flex:0.6,fontFamily:"monospace",fontWeight:600}}>{r.cn}</div>
                  <div style={{flex:1,fontWeight:500}}>{r.design}</div>
                  <div style={{flex:1}}><span style={{background:"#fff3e0",color:"#e65100",padding:"2px 8px",borderRadius:3,fontSize:10,fontWeight:600}}>{r.stage}</span></div>
                  <div style={{flex:1,color:C.textMuted}}>{r.contractor}</div>
                  <div style={{flex:0.7,color:C.red,fontWeight:600}}>{r.days}d</div>
                  <div style={{flex:0.6}}><Btn small>Track</Btn></div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div style={{flex:1}}>
          <Card>
            <div style={{fontSize:12,fontWeight:600,marginBottom:8}}>Contractor Leaderboard</div>
            <div style={{fontSize:10,color:C.textMuted,marginBottom:8}}>Top 5 by completion rate this month</div>
            {[
              {name:"Raju Tailor",rate:96,jobs:24},
              {name:"Salim Works",rate:92,jobs:18},
              {name:"Hari Gems",rate:88,jobs:15},
              {name:"Priya Emb.",rate:85,jobs:12},
              {name:"Suresh Cut",rate:82,jobs:10},
            ].map((c,i)=>(
              <div key={i} style={{marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:3}}><span><strong>#{i+1}</strong> {c.name}</span><span style={{color:C.textMuted}}>{c.rate}% {"·"} {c.jobs} jobs</span></div>
                <div style={{height:6,background:C.bgSoft,borderRadius:3}}><div style={{height:6,background:"#e67e22",borderRadius:3,width:`${c.rate}%`,opacity:0.9-i*0.1}}/></div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </Content>
  </WebLayout>
  );
},
"G-01": () => {
  const [statusFilter,setStatusFilter]=useState("All");
  return(
  <WebLayout activeMenu="Challans" mode="mfg">
    <GTopBar title="Challan List" sub="All production challans" actions={[{label:"New Challan",primary:true}]}/>
    <Content>
      <div style={{display:"flex",gap:8,marginBottom:12,alignItems:"center"}}>
        <input placeholder="Search challan / design..." style={{flex:1,padding:"6px 10px",border:`0.5px solid ${C.border}`,borderRadius:4,fontSize:11,outline:"none"}}/>
        {["All","Active","Completed","Overdue","On Hold"].map(s=>(
          <div key={s} onClick={()=>setStatusFilter(s)} style={{padding:"4px 10px",fontSize:10,borderRadius:4,cursor:"pointer",fontWeight:600,background:statusFilter===s?CO.accent:C.bgSoft,color:statusFilter===s?C.white:C.textMuted,border:`0.5px solid ${statusFilter===s?CO.accentBorder:C.border}`}}>{s}</div>
        ))}
      </div>
      <Card>
        <TH cols={[{v:"Challan No",w:0.8},{v:"Design No",w:0.6},{v:"Design Name",w:1.4},{v:"Party"},{v:"Pcs",w:0.4},{v:"Flow"},{v:"Status",w:0.7},{v:"Date",w:0.6},{v:"Action",w:0.5}]}/>
        {[
          {cn:"CH-3221",dn:"D-730",name:"Floral Embroidery Set",party:"M/s Rajan Fabrics",pcs:600,flow:["EMB","STH","DIA"],status:"Active",date:"07 May"},
          {cn:"CH-3210",dn:"D-710",name:"Silk Anarkali Premium",party:"M/s Sharma Exports",pcs:450,flow:["EMB","LAC"],status:"Overdue",date:"04 May"},
          {cn:"CH-3200",dn:"D-695",name:"Chikankari Kurta",party:"M/s Patel Traders",pcs:300,flow:["EMB","WASH"],status:"Active",date:"02 May"},
          {cn:"CH-3189",dn:"D-688",name:"Block Print Dupatta",party:"M/s Ali Brothers",pcs:800,flow:["PRN","FIN"],status:"Completed",date:"28 Apr"},
          {cn:"CH-3175",dn:"D-672",name:"Zardozi Lehenga",party:"M/s Kumar Textiles",pcs:200,flow:["EMB","ZAR"],status:"Active",date:"25 Apr"},
          {cn:"CH-3160",dn:"D-655",name:"Cotton Salwar Set",party:"M/s National Cloth",pcs:1200,flow:["CUT","STH"],status:"On Hold",date:"20 Apr"},
        ].map((r,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 10px",borderBottom:`0.5px solid ${C.border}`,fontSize:11}}>
            <div style={{flex:0.8,fontFamily:"monospace",fontWeight:600,color:CO.accent}}>{r.cn}</div>
            <div style={{flex:0.6,fontFamily:"monospace",color:C.textMuted}}>{r.dn}</div>
            <div style={{flex:1.4,fontWeight:500}}>{r.name}</div>
            <div style={{flex:1,color:C.textMuted,fontSize:10}}>{r.party}</div>
            <div style={{flex:0.4,fontWeight:600}}>{r.pcs}</div>
            <div style={{flex:1}}>{r.flow.map((s,j)=><span key={j} style={{marginRight:3,background:CO.accentLight,color:CO.accent,padding:"1px 6px",borderRadius:3,fontSize:9,fontWeight:600,border:`0.5px solid ${CO.accentBorder}`}}>{s}</span>)}</div>
            <div style={{flex:0.7}}><span style={{fontSize:10,padding:"2px 7px",borderRadius:3,fontWeight:600,background:r.status==="Active"?"#e8f5e9":r.status==="Completed"?"#e3f2fd":r.status==="Overdue"?"#ffebee":"#fff8e1",color:r.status==="Active"?"#2e7d32":r.status==="Completed"?"#1565c0":r.status==="Overdue"?"#c62828":"#f57f17"}}>{r.status}</span></div>
            <div style={{flex:0.6,color:C.textMuted}}>{r.date}</div>
            <div style={{flex:0.5}}><Btn small>View</Btn></div>
          </div>
        ))}
      </Card>
    </Content>
  </WebLayout>
  );
},

"G-05": () => (
  <WebLayout activeMenu="Contractors" mode="mfg">
    <GTopBar title="Contractor Detail" sub="Ramesh Kadkiya · EMB-001 · Embroidery Specialist"/>
    <Content>
      <div style={{display:"flex",gap:12}}>
        <div style={{flex:2}}>
          <Card>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14,paddingBottom:12,borderBottom:`0.5px solid ${C.border}`}}>
              <div style={{width:44,height:44,borderRadius:"50%",background:CO.accentLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,color:CO.accent,border:`0.5px solid ${CO.accentBorder}`}}>R</div>
              <div>
                <div style={{fontSize:14,fontWeight:700}}>Ramesh Kadkiya</div>
                <div style={{fontSize:11,color:C.textMuted,marginTop:2}}>Code: EMB-001 · Type: Embroidery · Mobile: +91 98765 43210</div>
                <div style={{marginTop:6,display:"flex",gap:6}}>
                  <span style={{background:"#e8f5e9",color:"#2e7d32",padding:"2px 8px",borderRadius:3,fontSize:10,fontWeight:600}}>Active</span>
                  <span style={{background:CO.accentLight,color:CO.accent,padding:"2px 8px",borderRadius:3,fontSize:10}}>Mobile Login: Enabled</span>
                </div>
              </div>
            </div>
            <div style={{display:"flex",gap:10,marginBottom:14}}>
              <Metric label="Active Challans" value="4" sub="Currently running"/>
              <Metric label="Avg Turnaround" value="8.2d" sub="Last 30 challans"/>
              <Metric label="Rejection Rate" value="1.4%" sub="Last 60 days" green/>
              <Metric label="Total Earned" value={"₹3.2L"} sub="This FY"/>
            </div>
            <div style={{fontSize:12,fontWeight:600,marginBottom:8}}>Active Challans</div>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden"}}>
              <TH cols={[{v:"Challan No",w:0.8},{v:"Design"},{v:"Stage"},{v:"Pieces",w:0.6},{v:"Deadline",w:0.7},{v:"Status",w:0.7}]}/>
              {[
                {cn:"CH-3221",design:"D-730",stage:"Embroidery",pcs:600,deadline:"17 May",late:false},
                {cn:"CH-3215",design:"D-718",stage:"Embroidery",pcs:450,deadline:"15 May",late:true},
                {cn:"CH-3208",design:"D-705",stage:"Embroidery",pcs:300,deadline:"18 May",late:false},
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",borderBottom:`0.5px solid ${C.border}`,fontSize:11}}>
                  <div style={{flex:0.8,fontFamily:"monospace",color:CO.accent,fontWeight:600}}>{r.cn}</div>
                  <div style={{flex:1,fontWeight:500}}>{r.design}</div>
                  <div style={{flex:1}}><span style={{background:CO.accentLight,color:CO.accent,padding:"2px 7px",borderRadius:3,fontSize:10}}>{r.stage}</span></div>
                  <div style={{flex:0.6}}>{r.pcs}</div>
                  <div style={{flex:0.7,color:r.late?C.red:C.textMuted,fontWeight:r.late?600:400}}>{r.deadline}{r.late?" (!)" :""}</div>
                  <div style={{flex:0.7}}><span style={{background:r.late?"#ffebee":"#e8f5e9",color:r.late?C.red:"#2e7d32",padding:"2px 6px",borderRadius:3,fontSize:10,fontWeight:600}}>{r.late?"Overdue":"On Track"}</span></div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div style={{flex:1}}>
          <Card>
            <div style={{fontSize:12,fontWeight:600,marginBottom:10}}>Payment History</div>
            {[
              {ref:"PAY-1042",ch:"CH-3200",amount:"₹24,000",date:"30 Apr",status:"Paid"},
              {ref:"PAY-1038",ch:"CH-3185",amount:"₹18,500",date:"25 Apr",status:"Paid"},
              {ref:"PAY-1025",ch:"CH-3155",amount:"₹15,000",date:"10 Apr",status:"Pending"},
            ].map((p,i)=>(
              <div key={i} style={{padding:"7px 0",borderBottom:`0.5px solid ${C.border}`,fontSize:11}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                  <span style={{fontFamily:"monospace",color:CO.accent,fontSize:10}}>{p.ref}</span>
                  <span style={{fontWeight:600,color:p.status==="Paid"?"#2e7d32":CO.accent}}>{p.amount}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",color:C.textMuted,fontSize:10}}>
                  <span>{p.ch} · {p.date}</span>
                  <span style={{background:p.status==="Paid"?"#e8f5e9":"#fff3e0",color:p.status==="Paid"?"#2e7d32":"#e65100",padding:"1px 6px",borderRadius:3}}>{p.status}</span>
                </div>
              </div>
            ))}
          </Card>
          <Card>
            <div style={{fontSize:12,fontWeight:600,marginBottom:8}}>Notes</div>
            <div style={{fontSize:11,color:C.textMuted,lineHeight:1.5}}>Reliable contractor for EMB work. Specialized in heavy embroidery. Has own 12-machine unit at Surat.</div>
          </Card>
        </div>
      </div>
    </Content>
  </WebLayout>
),

"G-06": () => {
  const challans = [
    {cn:"CH-3189",dn:"D-688",name:"Block Print Dupatta",colours:[{col:"Red",exp:400,act:null},{col:"Blue",exp:400,act:null}]},
    {cn:"CH-3175",dn:"D-672",name:"Zardozi Lehenga",colours:[{col:"Gold",exp:100,act:null},{col:"Silver",exp:100,act:null}]},
  ];
  return(
  <WebLayout activeMenu="Production" mode="mfg">
    <GTopBar title="Ready Piece Count" sub="Confirm pieces received at final stage before closing challan" actions={[{label:"Confirm & Close Selected",primary:true}]}/>
    <Content>
      {challans.map((ch,ci)=>(
        <Card key={ci}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,paddingBottom:8,borderBottom:`0.5px solid ${C.border}`}}>
            <div>
              <span style={{fontFamily:"monospace",fontWeight:700,color:CO.accent,marginRight:8}}>{ch.cn}</span>
              <span style={{fontWeight:600}}>{ch.dn} - {ch.name}</span>
            </div>
            <Btn small primary>Confirm & Close Challan</Btn>
          </div>
          <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden"}}>
            <TH cols={[{v:"Colour"},{v:"Expected Pcs",w:0.8},{v:"Actual Count",w:0.8},{v:"Difference",w:0.6},{v:"Remark"}]}/>
            {ch.colours.map((c,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 10px",borderBottom:`0.5px solid ${C.border}`,fontSize:11}}>
                <div style={{flex:1,fontWeight:500}}>{c.col}</div>
                <div style={{flex:0.8,color:C.textMuted}}>{c.exp} pcs</div>
                <div style={{flex:0.8}}><input type="number" defaultValue={c.exp} style={{width:70,padding:"3px 6px",border:`0.5px solid ${CO.accentBorder}`,borderRadius:3,fontSize:11,textAlign:"right"}}/></div>
                <div style={{flex:0.6,color:C.textMuted}}>-</div>
                <div style={{flex:1}}><input placeholder="Optional note..." style={{width:"100%",padding:"3px 6px",border:`0.5px solid ${C.border}`,borderRadius:3,fontSize:10}}/></div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </Content>
  </WebLayout>
  );
},

"G-07": () => {
  const [tab,setTab]=useState("Pending");
  return(
  <WebLayout activeMenu="Production" mode="mfg">
    <GTopBar title="Payment & Checking" sub="Contractor payments and piece verification" actions={[{label:"Create Payment",primary:true}]}/>
    <Content>
      <div style={{display:"flex",gap:10,marginBottom:12}}>
        <Metric label="Total Paid (Apr)" value={"₹1.8L"} sub="22 transactions" green/>
        <Metric label="Pending Payments" value={"₹54,200"} sub="8 challans" alert/>
        <Metric label="Disputed" value={"₹8,400"} sub="2 issues" alert/>
        <Metric label="Avg Payment Days" value="6.2d" sub="After challan close"/>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:10}}>
        {["Pending","Paid","All"].map(t=>(
          <div key={t} onClick={()=>setTab(t)} style={{padding:"4px 12px",fontSize:11,borderRadius:4,cursor:"pointer",fontWeight:600,background:tab===t?CO.accent:C.bgSoft,color:tab===t?C.white:C.textMuted,border:`0.5px solid ${tab===t?CO.accentBorder:C.border}`}}>{t}</div>
        ))}
      </div>
      <Card>
        <TH cols={[{v:"Ref No",w:0.8},{v:"Challan"},{v:"Contractor"},{v:"Amount",w:0.7},{v:"Pieces",w:0.6},{v:"Date",w:0.6},{v:"Status",w:0.7},{v:"Action",w:0.6}]}/>
        {[
          {ref:"PAY-1050",ch:"CH-3200",cont:"Ramesh Kadkiya",amt:"₹24,000",pcs:300,date:"07 May",status:"Pending"},
          {ref:"PAY-1049",ch:"CH-3198",cont:"Suresh Bhai",amt:"₹18,000",pcs:450,date:"06 May",status:"Pending"},
          {ref:"PAY-1045",ch:"CH-3185",cont:"Hari Gems",amt:"₹30,000",pcs:600,date:"04 May",status:"Paid"},
          {ref:"PAY-1042",ch:"CH-3175",cont:"Priya Emb.",amt:"₹21,000",pcs:200,date:"02 May",status:"Paid"},
        ].filter(r=>tab==="All"||r.status===tab).map((r,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 10px",borderBottom:`0.5px solid ${C.border}`,fontSize:11}}>
            <div style={{flex:0.8,fontFamily:"monospace",color:CO.accent,fontSize:10}}>{r.ref}</div>
            <div style={{flex:1,fontFamily:"monospace"}}>{r.ch}</div>
            <div style={{flex:1,fontWeight:500}}>{r.cont}</div>
            <div style={{flex:0.7,fontWeight:600}}>{r.amt}</div>
            <div style={{flex:0.6,color:C.textMuted}}>{r.pcs}</div>
            <div style={{flex:0.6,color:C.textMuted}}>{r.date}</div>
            <div style={{flex:0.7}}><span style={{fontSize:10,padding:"2px 7px",borderRadius:3,fontWeight:600,background:r.status==="Pending"?"#fff3e0":"#e8f5e9",color:r.status==="Pending"?"#e65100":"#2e7d32"}}>{r.status}</span></div>
            <div style={{flex:0.6}}>{r.status==="Pending"&&<Btn small primary>Pay</Btn>}</div>
          </div>
        ))}
      </Card>
    </Content>
  </WebLayout>
  );
},

"G-08": () => {
  const [typeFilter,setTypeFilter]=useState("All");
  return(
  <WebLayout activeMenu="RF / Returns" mode="mfg">
    <GTopBar title="RF Management" sub="Return Fabric entries and tracking" actions={[{label:"Create RF Entry"},{label:"Create RF → G-20",primary:true}]}/>
    <Content>
      <div style={{display:"flex",gap:6,marginBottom:10,alignItems:"center"}}>
        <input placeholder="Search RF no / challan..." style={{flex:1,padding:"5px 10px",border:`0.5px solid ${C.border}`,borderRadius:4,fontSize:11,outline:"none"}}/>
        {["All","Excess","Damage","Sample","Shortage"].map(t=>(
          <div key={t} onClick={()=>setTypeFilter(t)} style={{padding:"3px 9px",fontSize:10,borderRadius:3,cursor:"pointer",fontWeight:600,background:typeFilter===t?CO.accent:C.bgSoft,color:typeFilter===t?C.white:C.textMuted,border:`0.5px solid ${typeFilter===t?CO.accentBorder:C.border}`}}>{t}</div>
        ))}
      </div>
      <Card>
        <TH cols={[{v:"RF No",w:0.7},{v:"Challan",w:0.8},{v:"Design"},{v:"Type",w:0.7},{v:"Pieces",w:0.5},{v:"Contractor"},{v:"Status",w:0.7},{v:"Date",w:0.6},{v:"Action",w:0.5}]}/>
        {[
          {rf:"RF-2031",ch:"CH-3210",design:"D-710",type:"Excess",pcs:12,cont:"Salim Works",status:"Received",date:"06 May"},
          {rf:"RF-2028",ch:"CH-3200",design:"D-695",type:"Damage",pcs:5,cont:"Mohan Stitching",status:"Pending",date:"05 May"},
          {rf:"RF-2024",ch:"CH-3189",design:"D-688",type:"Sample",pcs:8,cont:"In-house",status:"Received",date:"03 May"},
          {rf:"RF-2020",ch:"CH-3175",design:"D-672",type:"Shortage",pcs:3,cont:"Hari Gems",status:"Disputed",date:"01 May"},
        ].filter(r=>typeFilter==="All"||r.type===typeFilter).map((r,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 10px",borderBottom:`0.5px solid ${C.border}`,fontSize:11}}>
            <div style={{flex:0.7,fontFamily:"monospace",color:CO.accent,fontWeight:600}}>{r.rf}</div>
            <div style={{flex:0.8,fontFamily:"monospace"}}>{r.ch}</div>
            <div style={{flex:1,fontWeight:500}}>{r.design}</div>
            <div style={{flex:0.7}}><span style={{background:CO.accentLight,color:CO.accent,padding:"2px 6px",borderRadius:3,fontSize:10}}>{r.type}</span></div>
            <div style={{flex:0.5,fontWeight:600}}>{r.pcs}</div>
            <div style={{flex:1,color:C.textMuted}}>{r.cont}</div>
            <div style={{flex:0.7}}><span style={{fontSize:10,padding:"2px 6px",borderRadius:3,fontWeight:600,background:r.status==="Received"?"#e8f5e9":r.status==="Disputed"?"#ffebee":"#fff8e1",color:r.status==="Received"?"#2e7d32":r.status==="Disputed"?C.red:"#f57f17"}}>{r.status}</span></div>
            <div style={{flex:0.6,color:C.textMuted}}>{r.date}</div>
            <div style={{flex:0.5}}><Btn small>View</Btn></div>
          </div>
        ))}
      </Card>
    </Content>
  </WebLayout>
  );
},

"G-09": () => (
  <WebLayout activeMenu="Fabric / Mill" mode="mfg">
    <GTopBar title="Mill / Fabric Management" sub="Fabric roll inventory and mill tracking" actions={[{label:"Add Roll"},{label:"Add Mill",primary:true}]}/>
    <Content>
      <div style={{display:"flex",gap:12,marginBottom:12}}>
        <Metric label="Total Rolls" value="142" sub="In stock"/>
        <Metric label="In Use" value="38" sub="Issued to challans"/>
        <Metric label="Low Stock Alerts" value="5" sub="Below minimum" alert/>
        <Metric label="Mills Registered" value="12" sub="Active suppliers"/>
      </div>
      <div style={{display:"flex",gap:12}}>
        <div style={{flex:2}}>
          <Card>
            <div style={{fontSize:12,fontWeight:600,marginBottom:10}}>Fabric Roll Inventory</div>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden"}}>
              <TH cols={[{v:"Roll No",w:0.7},{v:"Fabric Type"},{v:"Width",w:0.5},{v:"GSM",w:0.4},{v:"Length (m)",w:0.6},{v:"Mill"},{v:"Status",w:0.7},{v:"Action",w:0.5}]}/>
              {[
                {roll:"RL-0421",type:"Pure Silk",width:'44"',gsm:80,len:50,mill:"Varanasi Mills",status:"Available"},
                {roll:"RL-0420",type:"Cotton Voile",width:'58"',gsm:60,len:100,mill:"Surat Fabrics",status:"In Use"},
                {roll:"RL-0419",type:"Georgette",width:'44"',gsm:70,len:45,mill:"Bhiwandi Co.",status:"Available"},
                {roll:"RL-0418",type:"Rayon",width:'58"',gsm:110,len:80,mill:"Surat Fabrics",status:"Available"},
                {roll:"RL-0415",type:"Net",width:'54"',gsm:30,len:20,mill:"Mumbai Nets",status:"Low"},
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",borderBottom:`0.5px solid ${C.border}`,fontSize:11}}>
                  <div style={{flex:0.7,fontFamily:"monospace",color:CO.accent,fontWeight:600}}>{r.roll}</div>
                  <div style={{flex:1,fontWeight:500}}>{r.type}</div>
                  <div style={{flex:0.5,color:C.textMuted}}>{r.width}</div>
                  <div style={{flex:0.4,color:C.textMuted}}>{r.gsm}</div>
                  <div style={{flex:0.6,fontWeight:600}}>{r.len}</div>
                  <div style={{flex:1,color:C.textMuted,fontSize:10}}>{r.mill}</div>
                  <div style={{flex:0.7}}><span style={{fontSize:10,padding:"2px 6px",borderRadius:3,fontWeight:600,background:r.status==="Available"?"#e8f5e9":r.status==="In Use"?"#e3f2fd":"#ffebee",color:r.status==="Available"?"#2e7d32":r.status==="In Use"?"#1565c0":C.red}}>{r.status}</span></div>
                  <div style={{flex:0.5}}><Btn small>Edit</Btn></div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div style={{flex:1}}>
          <Card>
            <div style={{fontSize:12,fontWeight:600,marginBottom:10}}>Mill Summary</div>
            {[
              {mill:"Surat Fabrics",rolls:42,active:14},
              {mill:"Varanasi Mills",rolls:28,active:8},
              {mill:"Bhiwandi Co.",rolls:35,active:10},
              {mill:"Mumbai Nets",rolls:18,active:4},
            ].map((m,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:`0.5px solid ${C.border}`,fontSize:11}}>
                <span style={{fontWeight:500}}>{m.mill}</span>
                <span style={{color:C.textMuted,fontSize:10}}>{m.rolls} rolls · {m.active} active</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </Content>
  </WebLayout>
),

"G-10": () => {
  const [design,setDesign]=useState("D-730");
  return(
  <WebLayout activeMenu="Costing (Owner Only)" mode="mfg">
    <GTopBar title="Design Costing" sub="Full BOM, job costs, and margin analysis" ownerOnly/>
    <Content>
      <div style={{display:"flex",gap:12}}>
        <div style={{flex:2}}>
          <Card>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:600}}>Design:</div>
              {["D-730","D-710","D-695","D-688"].map(d=>(
                <div key={d} onClick={()=>setDesign(d)} style={{padding:"4px 10px",fontSize:11,borderRadius:4,cursor:"pointer",fontWeight:600,background:design===d?CO.accent:C.bgSoft,color:design===d?C.white:C.textMuted,border:`0.5px solid ${design===d?CO.accentBorder:C.border}`}}>{d}</div>
              ))}
            </div>
            <div style={{fontSize:12,fontWeight:600,marginBottom:8}}>Bill of Materials - {design}</div>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden",marginBottom:12}}>
              <TH cols={[{v:"Item"},{v:"Category",w:0.8},{v:"Qty",w:0.5},{v:"Unit",w:0.5},{v:"Rate",w:0.6},{v:"Amount",w:0.7}]}/>
              {[
                {item:"Pure Silk Fabric",cat:"Fabric",qty:"2.5m",unit:"per m",rate:"₹850",amt:"₹2,125"},
                {item:"Zari Thread (Gold)",cat:"Material",qty:"200g",unit:"per 100g",rate:"₹320",amt:"₹640"},
                {item:"Embroidery Work",cat:"Job Work",qty:"1 challan",unit:"per pc",rate:"₹380",amt:"₹380"},
                {item:"Stitching",cat:"Job Work",qty:"1 pc",unit:"per pc",rate:"₹120",amt:"₹120"},
                {item:"Finishing",cat:"Job Work",qty:"1 pc",unit:"per pc",rate:"₹45",amt:"₹45"},
                {item:"Packaging",cat:"Overhead",qty:"1 set",unit:"per set",rate:"₹35",amt:"₹35"},
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",borderBottom:`0.5px solid ${C.border}`,fontSize:11}}>
                  <div style={{flex:1,fontWeight:500}}>{r.item}</div>
                  <div style={{flex:0.8}}><span style={{background:C.bgSoft,padding:"2px 6px",borderRadius:3,fontSize:10}}>{r.cat}</span></div>
                  <div style={{flex:0.5,color:C.textMuted}}>{r.qty}</div>
                  <div style={{flex:0.5,color:C.textMuted,fontSize:10}}>{r.unit}</div>
                  <div style={{flex:0.6}}>{r.rate}</div>
                  <div style={{flex:0.7,fontWeight:600,color:CO.accent}}>{r.amt}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div style={{flex:1}}>
          <Card>
            <div style={{fontSize:12,fontWeight:600,marginBottom:10}}>Cost Summary</div>
            {[
              {label:"Raw Material",val:"₹2,765",pct:"70%"},
              {label:"Job Work",val:"₹545",pct:"14%"},
              {label:"Overhead",val:"₹185",pct:"5%"},
              {label:"Total Cost",val:"₹3,495",pct:"89%",bold:true},
              {label:"Target Margin",val:"25%",pct:""},
              {label:"Selling Price",val:"₹4,370",pct:"",bold:true,accent:true},
            ].map((r,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`0.5px solid ${C.border}`,fontSize:r.bold?12:11,fontWeight:r.bold?700:400,color:r.accent?CO.accent:C.text}}>
                <span>{r.label}</span>
                <span>{r.val}{r.pct&&<span style={{fontSize:10,color:C.textMuted,marginLeft:6}}>{r.pct}</span>}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </Content>
  </WebLayout>
  );
},

"G-11": () => (
  <WebLayout activeMenu="Masters" mode="mfg">
    <Content>
      <div style={{padding:40,textAlign:"center",color:C.textMuted}}>
        <div style={{fontSize:22,marginBottom:8}}>{"→"}</div>
        <div style={{fontSize:14,fontWeight:600,marginBottom:6}}>Content moved to G-14 Design Master</div>
        <div style={{fontSize:11,marginBottom:16}}>This screen has been consolidated into the Design Master module.</div>
        <Btn primary>Open G-14 Design Master</Btn>
      </div>
    </Content>
  </WebLayout>
),

"G-02": () => {
  const [showDesignHistory, setShowDesignHistory] = useState(false);
  const createdAt = "11 May 2026, 15:42";
  const totalTimelineDays = jobTimelineDefaults.reduce((sum, job) => sum + job.targetDays, 0);
  return (
  <WebLayout activeMenu="Challans" mode="mfg">
    <GTopBar title="Create New Challan" sub="Define job work flow, assign contractors, set timelines" actions={[{label:"Confirm & Notify",primary:true},{label:"Save Draft"},{label:"Cancel"}]}/>
    <div style={{padding:16,background:C.bgSoft,minHeight:460}}>
      {showDesignHistory&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowDesignHistory(false)}>
          <div style={{background:C.white,borderRadius:8,padding:20,width:420,maxHeight:"70vh",overflow:"auto"}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
              <div style={{fontSize:13,fontWeight:700}}>Design History - D-730</div>
              <span onClick={()=>setShowDesignHistory(false)} style={{cursor:"pointer",fontSize:16,color:C.textMuted}}>×</span>
            </div>
            {[
              {challan:"3209",date:"06 May",pcs:600,note:"2 dupattas missing lace. Lace contractor 3 days late."},
              {challan:"3198",date:"28 Apr",pcs:500,note:"Fabric overconsumption at embroidery - 6 pieces short."},
              {challan:"3185",date:"12 Apr",pcs:600,note:"Completed on time. No issues."},
            ].map((r,i)=>(
              <div key={i} style={{border:`0.5px solid ${C.border}`,borderRadius:4,padding:"8px 10px",marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:11,fontWeight:700,fontFamily:"monospace"}}>#{r.challan}</span>
                  <span style={{fontSize:10,color:C.textMuted}}>{r.date} · {r.pcs} pcs</span>
                </div>
                <div style={{fontSize:11,color:C.text}}>{r.note}</div>
                <button style={{marginTop:6,fontSize:10,padding:"3px 8px",background:CO.accentLight,border:`0.5px solid ${CO.accentBorder}`,borderRadius:3,color:CO.accent,cursor:"pointer"}}>Prefill from this run</button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{display:"flex",gap:12}}>
        <div style={{flex:2}}>
          <Card>
            <SectionLabel>Challan Header</SectionLabel>
            <div style={{display:"flex",gap:10,marginBottom:4}}>
              <div style={{flex:1}}><Input label="Challan No (Auto)" placeholder="3211" mono/></div>
              <div style={{flex:1}}><Input label="Date" placeholder="07 May 2026"/></div>
            </div>
            <div style={{display:"flex",gap:10,marginBottom:4}}>
              <div style={{flex:1}}><Input label="Created Timestamp (Auto)" placeholder={createdAt} mono note="Recorded when the user creates the challan"/></div>
              <div style={{flex:1}}><Input label="Created By" placeholder="Moin Noorani" note="Stored in challan audit trail"/></div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
              <div style={{flex:1}}><Input label="Design Number (D.No)" placeholder="D-730" required note="Auto-fills from last run"/></div>
              <button onClick={()=>setShowDesignHistory(true)} style={{padding:"6px 12px",background:"#f5f5f5",border:`0.5px solid ${C.border}`,borderRadius:4,fontSize:11,color:C.text,cursor:"pointer",marginBottom:10,whiteSpace:"nowrap"}}>History ▾</button>
            </div>
            <div style={{border:`1px solid ${C.redBorder}`,borderRadius:6,padding:"10px 12px",background:C.redLight,marginTop:4}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <div style={{fontSize:11,fontWeight:700,color:C.red}}>Repeat Design Alert - D-730</div>
                <span style={{fontSize:9,color:C.textMuted}}>2 prior runs</span>
              </div>
              <div style={{fontSize:11,color:C.text,marginBottom:4}}><strong>Run #3209 (06 May):</strong> 2 dupattas missing lace. Lace contractor 3 days late.</div>
              <div style={{fontSize:11,color:C.text,marginBottom:8}}><strong>Run #3198 (28 Apr):</strong> Fabric overconsumption at embroidery - 6 pieces short.</div>
              <button style={{padding:"5px 14px",background:C.red,color:C.white,border:"none",borderRadius:4,fontSize:11,fontWeight:600,cursor:"pointer",width:"100%"}}>Acknowledged - Open Form</button>
            </div>
          </Card>
          <Card>
            <SectionLabel>Fabric Table</SectionLabel>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden",marginBottom:8}}>
              <div style={{display:"flex",background:C.bgSoft,padding:"5px 6px",fontSize:9,fontWeight:700,color:C.textMuted,gap:4}}>
                <div style={{flex:1.2}}>Fabric Type</div><div style={{flex:0.7}}>Width</div><div style={{flex:0.8}}>Colour</div><div style={{flex:0.5}}>GSM</div><div style={{flex:0.6}}>Qty (m)</div><div style={{flex:0.6}}>Rate</div><div style={{flex:0.7}}>Total</div><div style={{flex:0.8}}>Contractor</div><div style={{flex:0.5,textAlign:"center"}}>Sample</div><div style={{flex:0.3}}/>
              </div>
              {[
                {type:"Georgette",width:'44"',colour:"Pink",gsm:60,qty:"300m",rate:"85",total:"₹25,500",cont:"Ramesh",sample:true},
                {type:"Net Fabric",width:'54"',colour:"Blue",gsm:40,qty:"180m",rate:"120",total:"₹21,600",cont:"Suresh",sample:false},
                {type:"Cotton Lawn",width:'44"',colour:"Cream",gsm:80,qty:"240m",rate:"95",total:"₹22,800",cont:"Mohan",sample:true},
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:4,padding:"5px 6px",borderTop:`0.5px solid ${C.border}`,fontSize:10}}>
                  <div style={{flex:1.2,fontWeight:500}}>{r.type}</div>
                  <div style={{flex:0.7,color:C.textMuted}}>{r.width}</div>
                  <div style={{flex:0.8}}>{r.colour}</div>
                  <div style={{flex:0.5,color:C.textMuted}}>{r.gsm}</div>
                  <div style={{flex:0.6,border:`0.5px solid ${C.border}`,borderRadius:3,padding:"2px 4px",background:C.white}}>{r.qty}</div>
                  <div style={{flex:0.6,border:`0.5px solid ${C.border}`,borderRadius:3,padding:"2px 4px",background:C.white}}>{r.rate}</div>
                  <div style={{flex:0.7,fontWeight:600}}>{r.total}</div>
                  <div style={{flex:0.8,fontSize:9,color:CO.accent}}>{r.cont}</div>
                  <div style={{flex:0.5,textAlign:"center"}}><input type="checkbox" defaultChecked={r.sample} style={{cursor:"pointer"}}/></div>
                  <div style={{flex:0.3,color:C.red,cursor:"pointer",textAlign:"center",fontSize:12}}>×</div>
                </div>
              ))}
            </div>
            <button style={{padding:"5px 12px",border:`0.5px solid ${CO.accentBorder}`,background:CO.accentLight,borderRadius:4,fontSize:11,color:CO.accent,fontWeight:600,cursor:"pointer"}}>+ Add Fabric Row</button>
          </Card>
          <Card>
            <SectionLabel>Lot Details - Colour Breakdown</SectionLabel>
            <div style={{display:"flex",gap:10,marginBottom:8}}>
              <div style={{flex:1}}><Input label="Total Pieces" placeholder="600" required/></div>
              <div style={{flex:1}}><Input label="Fabric Consumption / Piece" placeholder="50 points" required note="Contractor must not exceed"/></div>
            </div>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden",marginBottom:8}}>
              <div style={{display:"flex",background:C.bgSoft,padding:"5px 8px",fontSize:10,fontWeight:700,color:C.textMuted,gap:8}}>
                <div style={{flex:2}}>COLOUR</div><div style={{flex:1}}>PIECES</div><div style={{flex:0.5}}/>
              </div>
              {[{col:"Pink",pcs:200},{col:"Blue",pcs:200},{col:"Cream",pcs:200}].map((r,i)=>(
                <div key={i} style={{display:"flex",gap:8,padding:"5px 8px",borderTop:`0.5px solid ${C.border}`,fontSize:11,alignItems:"center"}}>
                  <div style={{flex:2}}>{r.col}</div>
                  <div style={{flex:1,border:`0.5px solid ${C.border}`,borderRadius:3,padding:"3px 6px",background:C.white,fontWeight:600}}>{r.pcs}</div>
                  <div style={{flex:0.5,color:C.red,cursor:"pointer",textAlign:"center"}}>×</div>
                </div>
              ))}
            </div>
            <button style={{padding:"5px 12px",border:`0.5px solid ${CO.accentBorder}`,background:CO.accentLight,borderRadius:4,fontSize:11,color:CO.accent,fontWeight:600,cursor:"pointer"}}>+ Add Colour</button>
          </Card>
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <SectionLabel>Job Timeline Setup</SectionLabel>
              <div style={{fontSize:10,color:CO.accent,fontWeight:700}}>Template: GMMS-JOB-TIMELINE-v1</div>
            </div>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:8}}>
              Default days come from the timeline config file and can be adjusted per challan before confirmation.
            </div>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden",background:C.white,marginBottom:8}}>
              <div style={{display:"flex",background:C.bgSoft,padding:"5px 8px",fontSize:9,fontWeight:700,color:C.textMuted,gap:6}}>
                <div style={{flex:0.7}}>CODE</div><div style={{flex:1.2}}>JOB</div><div style={{flex:1.2}}>CONTRACTOR</div><div style={{flex:0.8}}>DAYS</div><div style={{flex:1.5}}>STARTS AFTER</div><div style={{flex:1.4}}>ESCALATION</div>
              </div>
              {jobTimelineDefaults.map((job,i)=>(
                <div key={job.code} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 8px",borderTop:`0.5px solid ${C.border}`,fontSize:10,background:i===1?CO.accentLight:C.white}}>
                  <div style={{flex:0.7,fontFamily:"monospace",fontWeight:700,color:CO.accent}}>{job.code}</div>
                  <div style={{flex:1.2,fontWeight:600}}>{job.jobType}</div>
                  <div style={{flex:1.2,color:C.textMuted}}>{job.owner}</div>
                  <div style={{flex:0.8}}>
                    <div style={{border:`0.5px solid ${C.border}`,borderRadius:3,padding:"2px 6px",background:C.white,fontWeight:700,width:"fit-content"}}>{job.targetDays} days</div>
                  </div>
                  <div style={{flex:1.5,color:C.textMuted}}>{job.startTrigger}</div>
                  <div style={{flex:1.4,color:i===1?CO.accent:C.textMuted,fontWeight:i===1?600:400}}>{job.escalation}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <div style={{fontSize:11,color:C.textMuted,flex:1}}>Expected completion: <strong style={{color:C.text}}>{totalTimelineDays} days from confirmation</strong></div>
              <button style={{padding:"6px 12px",border:`0.5px solid ${CO.accentBorder}`,background:CO.accentLight,borderRadius:4,fontSize:11,color:CO.accent,fontWeight:600,cursor:"pointer"}}>Edit Timeline</button>
            </div>
          </Card>
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <SectionLabel>Job Work Flow</SectionLabel>
              <div style={{fontSize:10,color:C.textMuted}}>Min 3 · Max 13 · drag to reorder</div>
            </div>
            {[
              {step:1,type:"Embroidery",code:"EMB",cont:"Ramesh Kadkiya",days:10,ok:true},
              {step:2,type:"Stitching",code:"STH",cont:"Suresh Bhai",days:6,ok:true},
              {step:3,type:"Diamond",code:"DIA",cont:"Select contractor...",days:4,ok:false},
              {step:4,type:"Lace Work",code:"LAC",cont:"Mohan Das",days:2,ok:true},
            ].map((s,i)=>(
              <div key={i} style={{border:`0.5px solid ${s.ok?CO.accentBorder:C.border}`,borderRadius:4,padding:"8px 10px",marginBottom:6,background:s.ok?CO.accentLight:C.bgSoft,display:"flex",alignItems:"center",gap:8}}>
                <span style={{color:C.textMuted,cursor:"grab",fontSize:12,flexShrink:0}}>⋮⋮</span>
                <div style={{width:20,height:20,borderRadius:"50%",background:s.ok?CO.accent:C.border,color:C.white,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0}}>{s.step}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,fontWeight:600}}>{s.type} <span style={{fontFamily:"monospace",fontSize:9,color:CO.accent}}>/{s.code}</span></div>
                  <div style={{fontSize:10,color:s.ok?C.textMuted:C.textLight}}>{s.cont}</div>
                </div>
                <div style={{fontSize:11,color:C.textMuted,flexShrink:0}}>{s.days}d</div>
                <span style={{fontSize:14,color:C.red,cursor:"pointer"}}>×</span>
              </div>
            ))}
            <div style={{display:"flex",gap:6}}>
              <button style={{flex:1,padding:"7px",border:`1.5px dashed ${CO.accentBorder}`,background:CO.accentLight,borderRadius:4,fontSize:11,color:CO.accent,fontWeight:600,cursor:"pointer"}}>+ Add Stage</button>
              <button style={{flex:1,padding:"7px",border:`1.5px dashed ${C.border}`,background:C.bgSoft,borderRadius:4,fontSize:11,color:C.textMuted,fontWeight:600,cursor:"pointer"}}>+ Quick-add Job Type</button>
            </div>
          </Card>
        </div>
        <div style={{flex:1}}>
          <Card>
            <SectionLabel>Quick-add Contractor</SectionLabel>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:8}}>Add a new contractor without leaving this form</div>
            <Input label="Contractor Name" placeholder="e.g. Ahmed Embroidery Works"/>
            <Input label="Job Type" placeholder="EMB / STH / DIA..."/>
            <Input label="Mobile" placeholder="+91 98765 XXXXX"/>
            <button style={{width:"100%",padding:"6px",background:CO.accentLight,border:`0.5px solid ${CO.accentBorder}`,borderRadius:4,fontSize:11,color:CO.accent,fontWeight:600,cursor:"pointer"}}>Save & Use in Flow</button>
          </Card>
          <Card>
            <SectionLabel>Sample Provided</SectionLabel>
            {["Top (with sleeves & daman)","Bottom","Dupatta"].map((s,i)=>(
              <label key={i} style={{display:"flex",alignItems:"center",gap:8,fontSize:12,marginBottom:6,cursor:"pointer"}}>
                <input type="checkbox" defaultChecked={i<2}/>{s}
              </label>
            ))}
          </Card>
          <Card>
            <SectionLabel>Parallel Flows</SectionLabel>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:8}}>Split lot across multiple contractor chains. Max 10 parallel flows.</div>
            <div style={{padding:"6px 10px",background:CO.accentLight,border:`0.5px solid ${CO.accentBorder}`,borderRadius:4,marginBottom:8}}>
              <div style={{fontSize:11,fontWeight:600,color:CO.accent}}>1 flow active - 600 pcs</div>
            </div>
            <button style={{width:"100%",padding:"6px",border:`0.5px solid ${CO.accentBorder}`,background:C.white,borderRadius:4,fontSize:11,color:CO.accent,fontWeight:600,cursor:"pointer"}}>+ Split into Parallel Flow</button>
          </Card>
          <Card>
            <SectionLabel>Notes / Remarks</SectionLabel>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,padding:"8px 10px",fontSize:12,color:C.textLight,background:C.white,minHeight:60}}>Add specific instructions for this production run...</div>
            <div style={{fontSize:10,color:C.textMuted,marginTop:4}}>Notes stored against D.No - appear on all future runs.</div>
          </Card>
          <Card style={{background:CO.accentLight,border:`0.5px solid ${CO.accentBorder}`}}>
            <SectionLabel>On Confirm</SectionLabel>
            {["Generate Challan No 3211",`Record created timestamp: ${createdAt}`,"Apply job timeline defaults from GMMS-JOB-TIMELINE-v1","SMS + push to Ramesh Kadkiya (EMB)","Challan print-ready","Logged in audit trail"].map((a,i)=>(
              <div key={i} style={{fontSize:11,color:C.text,padding:"3px 0",display:"flex",alignItems:"center",gap:6}}>
                <span style={{color:C.green,fontWeight:700}}>✔</span>{a}
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  </WebLayout>
  );
},
"G-03": () => (
  <WebLayout activeMenu="Challans" mode="mfg">
    <GTopBar title="Challan Tracking - #3210" sub="D-730 · Floral Embroidery Set · 600 pcs · Started 07 May 2026" actions={[{label:"Add Note"},{label:"Reprocess → G-13"},{label:"Print Challan",primary:true}]}/>
    <div style={{padding:16,background:C.bgSoft,minHeight:460}}>
      <div style={{display:"flex",gap:12}}>
        <div style={{flex:2}}>
          <Card>
            <div style={{fontSize:12,fontWeight:600,marginBottom:14}}>Production Progress Tracker</div>
            {[
              {step:1,code:"EMB",label:"Embroidery",cont:"Ramesh Kadkiya",sent:600,conf:600,start:"07 May",deadline:"17 May",status:"completed"},
              {step:2,code:"STH",label:"Stitching",cont:"Suresh Bhai",sent:600,conf:598,start:"18 May",deadline:"24 May",status:"inprogress"},
              {step:3,code:"DIA",label:"Diamond Work",cont:"Anil Thakkar",sent:null,deadline:"28 May",status:"pending"},
              {step:4,code:"LAC",label:"Lace Work",cont:"Mohan Das",sent:null,deadline:"30 May",status:"pending"},
              {step:5,code:"PKG",label:"Ready Count",cont:"In-house Staff",sent:null,deadline:"01 Jun",status:"pending"},
            ].map((s,i)=>(
              <div key={i} style={{display:"flex",gap:0,marginBottom:0}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:28,flexShrink:0}}>
                  <div style={{width:18,height:18,borderRadius:"50%",background:s.status==="completed"?C.green:s.status==="inprogress"?CO.accent:C.border,display:"flex",alignItems:"center",justifyContent:"center",zIndex:1,flexShrink:0}}>
                    {s.status==="completed"&&<span style={{color:C.white,fontSize:9,fontWeight:700}}>✔</span>}
                    {s.status==="inprogress"&&<div style={{width:6,height:6,borderRadius:"50%",background:C.white}}/>}
                  </div>
                  {i<4&&<div style={{width:1.5,flex:1,minHeight:20,background:s.status==="completed"?C.green:C.border,margin:"2px 0"}}/>}
                </div>
                <div style={{flex:1,paddingBottom:10,paddingLeft:8}}>
                  <div style={{border:`0.5px solid ${s.status==="completed"?C.greenBorder:s.status==="inprogress"?CO.accentBorder:C.border}`,borderRadius:4,padding:"8px 10px",background:s.status==="completed"?C.greenLight:s.status==="inprogress"?CO.accentLight:C.white}}>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <div><span style={{fontSize:10,fontFamily:"monospace",color:s.status==="completed"?C.green:s.status==="inprogress"?CO.accent:C.textLight,fontWeight:600}}>/{s.code}</span><span style={{fontSize:12,fontWeight:600,marginLeft:6}}>{s.label}</span></div>
                      <span style={{fontSize:10,fontWeight:600,color:s.status==="completed"?C.green:s.status==="inprogress"?CO.accent:C.textLight,textTransform:"uppercase"}}>{s.status==="inprogress"?"In Progress":s.status==="completed"?"Completed":"Pending"}</span>
                    </div>
                    <div style={{fontSize:11,color:C.textMuted,marginTop:4}}>{s.cont}</div>
                    {s.sent&&<div style={{display:"flex",gap:12,marginTop:6,fontSize:11}}>
                      <span>Sent: <strong>{s.sent}</strong></span>
                      {s.conf&&<span style={{color:s.conf<s.sent?C.red:C.green}}>Confirmed: <strong>{s.conf}</strong>{s.conf<s.sent&&<span style={{color:C.red}}> (-{s.sent-s.conf} dispute)</span>}</span>}
                      <span style={{color:C.textMuted}}>Deadline: {s.deadline}</span>
                    </div>}
                    {s.status==="pending"&&<div style={{fontSize:10,color:C.textMuted,marginTop:4}}>Deadline: {s.deadline}</div>}
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </div>
        <div style={{flex:1}}>
          <Card>
            <SectionLabel>Challan Summary</SectionLabel>
            {[["Challan No","3210"],["Design No","D-730"],["Total Pieces","600"],["Colours","Pink/Blue/Cream × 200 each"],["Flow","4 stages + Ready Count"],["Started","07 May 2026"],["Expected Completion","01 Jun 2026"]].map(([l,v],i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`0.5px solid ${C.border}`,fontSize:11}}>
                <span style={{color:C.textMuted}}>{l}</span><span style={{fontWeight:500,textAlign:"right",maxWidth:"55%"}}>{v}</span>
              </div>
            ))}
          </Card>
          <Card>
            <SectionLabel>Notes History</SectionLabel>
            {[
              {author:"Moin N.",stage:"EMB",time:"07 May 09:30",cat:"Quality",note:"Ensure stitch count matches approved 82,400."},
              {author:"Raju S.",stage:"STH",time:"18 May 11:00",cat:"Shortage",note:"2 pieces short on confirmation. Dispute raised."},
            ].map((n,i)=>(
              <div key={i} style={{padding:"6px 0",borderBottom:`0.5px solid ${C.border}`}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:C.textMuted,marginBottom:2}}>
                  <span>{n.author} · {n.stage}</span><span>{n.time}</span>
                </div>
                <div style={{fontSize:10,color:CO.accent,marginBottom:2}}>[{n.cat}]</div>
                <div style={{fontSize:11}}>{n.note}</div>
              </div>
            ))}
            <button style={{marginTop:6,width:"100%",padding:"5px",border:`0.5px solid ${C.border}`,borderRadius:4,fontSize:11,background:C.white,cursor:"pointer",color:C.textMuted}}>+ Add Note</button>
          </Card>
        </div>
      </div>
    </div>
  </WebLayout>
),
"G-04": () => {
  const [showAdd, setShowAdd] = useState(false);
  return (
  <WebLayout activeMenu="Contractors" mode="mfg">
    <GTopBar title="Contractor List" sub="~1,300 registered · sorted by workload" actions={[{label:"+ Add Contractor",primary:true},{label:"Export"}]}/>
    {showAdd&&(
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowAdd(false)}>
        <div style={{background:C.white,borderRadius:8,padding:24,width:420,maxHeight:"80vh",overflow:"auto"}} onClick={e=>e.stopPropagation()}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
            <div style={{fontSize:14,fontWeight:700}}>Add New Contractor</div>
            <span onClick={()=>setShowAdd(false)} style={{cursor:"pointer",fontSize:18,color:C.textMuted,lineHeight:1}}>×</span>
          </div>
          <Input label="Full Name" placeholder="e.g. Ahmed Embroidery Works" required/>
          <div style={{display:"flex",gap:10}}>
            <div style={{flex:1}}><Input label="Mobile" placeholder="+91 98765 XXXXX" required/></div>
            <div style={{flex:1}}><Input label="WhatsApp" placeholder="+91 98765 XXXXX"/></div>
          </div>
          <div style={{marginBottom:10}}>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:4}}>Primary Job Work Type <span style={{color:C.red}}>*</span></div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {["EMB","STH","DIA","LAC","WASH","CUT","FIN","HND"].map((t,i)=>(
                <div key={i} style={{padding:"4px 10px",border:`0.5px solid ${i===0?CO.accentBorder:C.border}`,borderRadius:3,fontSize:10,fontWeight:600,cursor:"pointer",background:i===0?CO.accentLight:"#fafafa",color:i===0?CO.accent:C.textMuted}}>{t}</div>
              ))}
            </div>
          </div>
          <Input label="Address" placeholder="City / Area"/>
          <div style={{display:"flex",gap:10}}>
            <div style={{flex:1}}><Input label="GSTIN" placeholder="Optional"/></div>
            <div style={{flex:1}}><Input label="Bank Account (last 4)" placeholder="XXXX"/></div>
          </div>
          <div style={{marginBottom:10}}>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:4}}>Create Mobile Login?</div>
            <div style={{display:"flex",gap:6}}>
              {["Yes - SMS credentials","No - Skip for now"].map((opt,i)=>(
                <div key={i} style={{padding:"4px 12px",border:`0.5px solid ${i===0?CO.accentBorder:C.border}`,borderRadius:3,fontSize:11,cursor:"pointer",background:i===0?CO.accentLight:"#fafafa",color:i===0?CO.accent:C.textMuted}}>{opt}</div>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:8,marginTop:16}}>
            <button style={{flex:1,padding:"8px",background:CO.accent,color:C.white,border:"none",borderRadius:4,fontSize:12,fontWeight:600,cursor:"pointer"}}>Save Contractor</button>
            <button onClick={()=>setShowAdd(false)} style={{flex:1,padding:"8px",background:"#f5f5f5",border:`0.5px solid ${C.border}`,borderRadius:4,fontSize:12,cursor:"pointer"}}>Cancel</button>
          </div>
        </div>
      </div>
    )}
    <div style={{padding:16,background:C.bgSoft,minHeight:460}}>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <div style={{flex:1,border:`0.5px solid ${C.border}`,borderRadius:4,padding:"7px 10px",fontSize:12,color:C.textLight,background:C.white}}>Search by name, code, job work type...</div>
        <button style={{padding:"6px 12px",border:`0.5px solid ${C.border}`,borderRadius:4,fontSize:11,background:C.white,cursor:"pointer"}}>Job Work Type ▾</button>
        <button style={{padding:"6px 12px",border:`0.5px solid ${C.border}`,borderRadius:4,fontSize:11,background:C.white,cursor:"pointer"}}>Status ▾</button>
        <button onClick={()=>setShowAdd(true)} style={{padding:"6px 14px",border:`0.5px solid ${CO.accentBorder}`,borderRadius:4,fontSize:11,background:CO.accent,color:C.white,fontWeight:600,cursor:"pointer"}}>+ Add Contractor</button>
      </div>
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,overflow:"hidden",background:C.white}}>
        <div style={{display:"flex",background:C.bgSoft,padding:"6px 10px",fontSize:10,fontWeight:700,color:C.textMuted,gap:6}}>
          {["CODE","NAME","JOB WORK TYPE","PENDING","AVG TIME","REJECTION %","CHALLANS","STATUS","ACTIONS"].map((h,i)=><div key={i} style={{flex:i===8?1.2:1}}>{h}</div>)}
        </div>
        {[
          {code:"C-006",name:"Ramesh Kadkiya",type:"Embroidery",pending:8,avg:"9.2d",rej:"1.2%",active:3,status:"Active"},
          {code:"C-011",name:"Suresh Bhai",type:"Stitching",pending:14,avg:"5.8d",rej:"2.1%",active:5,status:"Active",warn:true},
          {code:"C-023",name:"Anil Thakkar",type:"Diamond",pending:3,avg:"3.9d",rej:"0.8%",active:2,status:"Active"},
          {code:"C-045",name:"Mohan Das",type:"Hand Work",pending:0,avg:"2.8d",rej:"0.5%",active:0,status:"Available",green:true},
          {code:"C-078",name:"Priya Sharma",type:"Lace Work",pending:6,avg:"1.9d",rej:"1.5%",active:4,status:"Active"},
          {code:"C-102",name:"Deepak Bhai",type:"Stitching",pending:22,avg:"6.1d",rej:"4.2%",active:7,status:"Overloaded",alert:true},
        ].map((r,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 10px",borderTop:`0.5px solid ${C.border}`,fontSize:11,background:r.alert?C.redLight:C.white}}>
            <div style={{flex:1,fontFamily:"monospace",fontSize:10,color:CO.accent,fontWeight:600}}>{r.code}</div>
            <div style={{flex:1,fontWeight:500}}>{r.name}</div>
            <div style={{flex:1,color:C.textMuted}}>{r.type}</div>
            <div style={{flex:1,fontWeight:600,color:r.alert||r.warn?C.red:r.pending>10?"#b45309":C.green}}>{r.pending}d</div>
            <div style={{flex:1,color:C.textMuted}}>{r.avg}</div>
            <div style={{flex:1,color:parseFloat(r.rej)>3?C.red:C.text}}>{r.rej}</div>
            <div style={{flex:1}}>{r.active}</div>
            <div style={{flex:1}}><span style={{fontSize:10,fontWeight:600,color:r.alert?C.red:r.green?C.green:r.warn?"#b45309":CO.accent,background:r.alert?C.redLight:r.green?C.greenLight:CO.accentLight,padding:"2px 6px",borderRadius:3}}>{r.status}</span></div>
            <div style={{flex:1.2,display:"flex",gap:4}}>
              <button style={{padding:"3px 8px",fontSize:10,border:`0.5px solid ${C.border}`,borderRadius:3,background:C.white,cursor:"pointer"}}>View</button>
              <button style={{padding:"3px 8px",fontSize:10,border:`0.5px solid ${C.border}`,borderRadius:3,background:C.white,cursor:"pointer"}}>Ledger</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </WebLayout>
  );
},
// G-13: Reprocess Challan
"G-13": () => {
  const [jobType, setJobType] = useState("Embroidery");
  return (
  <WebLayout activeMenu="Challans" mode="mfg">
    <GTopBar title="Reprocess Challan" sub="Same design, same items · change job type, party, and date" actions={[{label:"Confirm Reprocess",primary:true},{label:"Cancel"}]}/>
    <div style={{padding:16,background:C.bgSoft,minHeight:460}}>
      <div style={{padding:"8px 12px",background:"#fff3e0",border:`0.5px solid #ffcc80`,borderRadius:4,marginBottom:12,fontSize:11,color:"#e65100"}}>
        Reprocessing Challan #3202 · Design D-710 · Same pieces and quantities will be carried over.
      </div>
      <div style={{display:"flex",gap:12}}>
        <div style={{flex:2}}>
          <Card>
            <SectionLabel>Carry-Over Details (Locked)</SectionLabel>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
              {[["Original Challan","#3202"],["Design No.","D-710"],["Design Name","Floral Anarkali"],["Total Pieces","240 pcs"],["Colours","Pink × 80, Blue × 80, Cream × 80"],["Original Job Type","Stitching (STH)"]].map(([l,v],i)=>(
                <div key={i} style={{background:C.bgSoft,border:`0.5px solid ${C.border}`,borderRadius:4,padding:"7px 10px"}}>
                  <div style={{fontSize:9,color:C.textMuted,marginBottom:2}}>{l}</div>
                  <div style={{fontSize:12,fontWeight:600,color:C.text}}>{v}</div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <SectionLabel>New Job Parameters</SectionLabel>
            <div style={{marginBottom:10}}>
              <div style={{fontSize:11,color:C.textMuted,marginBottom:6}}>New Job Work Type <span style={{color:C.red}}>*</span></div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {["Embroidery","Stitching","Diamond","Lace Work","Washing","Cutting","Finishing"].map((t,i)=>(
                  <div key={i} onClick={()=>setJobType(t)} style={{padding:"4px 12px",border:`0.5px solid ${jobType===t?CO.accentBorder:C.border}`,borderRadius:3,fontSize:11,fontWeight:600,cursor:"pointer",background:jobType===t?CO.accentLight:"#fafafa",color:jobType===t?CO.accent:C.textMuted}}>{t}</div>
                ))}
              </div>
            </div>
            <Input label="New Contractor" placeholder="Search or select contractor..." required/>
            <div style={{display:"flex",gap:10}}>
              <div style={{flex:1}}><Input label="New Date" placeholder="09 May 2026" required/></div>
              <div style={{flex:1}}><Input label="Expected Return (days)" placeholder="7" required/></div>
            </div>
            <Input label="Reason for Reprocess" placeholder="e.g. Previous work rejected, quality issue" required/>
          </Card>
        </div>
        <div style={{flex:1}}>
          <Card>
            <SectionLabel>Piece Summary</SectionLabel>
            {[{col:"Pink",pcs:80},{col:"Blue",pcs:80},{col:"Cream",pcs:80}].map((r,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`0.5px solid ${C.border}`,fontSize:11}}>
                <span>{r.col}</span><span style={{fontWeight:600}}>{r.pcs} pcs</span>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",fontSize:12,fontWeight:700}}>
              <span>Total</span><span>240 pcs</span>
            </div>
          </Card>
          <Card style={{background:CO.accentLight,border:`0.5px solid ${CO.accentBorder}`}}>
            <SectionLabel>On Confirm</SectionLabel>
            {["New Challan #3211 created","Linked to original #3202","SMS to new contractor","Audit trail updated","G-12 dashboard refreshed"].map((a,i)=>(
              <div key={i} style={{fontSize:11,color:C.text,padding:"3px 0",display:"flex",alignItems:"center",gap:6}}>
                <span style={{color:C.green,fontWeight:700}}>✔</span>{a}
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  </WebLayout>
  );
},
// G-14: Design Master
"G-14": () => {
  const [showUpload, setShowUpload] = useState(false);
  return (
  <WebLayout activeMenu="Designs" mode="mfg">
    <GTopBar title="Design Master" sub="DST upload · IP-restricted · Stitch lock · Owner approval" ownerOnly actions={[{label:"Upload Design",primary:true}]}/>
    <div style={{padding:16,background:C.bgSoft,minHeight:460}}>
      <div style={{padding:"8px 12px",background:"#111",borderRadius:4,marginBottom:12,display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:11,color:"#888"}}>🔒 Designer workstations have internet blocked at IP level. Only this portal URL is whitelisted. Telegram disabled on all designer machines.</span>
      </div>
      {showUpload&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowUpload(false)}>
          <div style={{background:C.white,borderRadius:8,padding:24,width:400}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
              <div style={{fontSize:14,fontWeight:700}}>Upload New Design</div>
              <span onClick={()=>setShowUpload(false)} style={{cursor:"pointer",fontSize:18,color:C.textMuted}}>×</span>
            </div>
            <div style={{border:`1.5px dashed ${CO.accentBorder}`,borderRadius:6,padding:16,textAlign:"center",background:CO.accentLight,marginBottom:12,cursor:"pointer"}}>
              <div style={{fontSize:24,marginBottom:4}}>↑</div>
              <div style={{fontSize:12,fontWeight:600}}>Upload DST File Only</div>
              <div style={{fontSize:10,color:C.textMuted,marginTop:4}}>EMB files are rejected. Only machine-compatible DST.</div>
            </div>
            <Input label="Design Name" placeholder="e.g. Floral Embroidery Set" required/>
            <div style={{display:"flex",gap:10}}>
              <div style={{flex:1}}><Input label="HSN Code" placeholder="6303" required/></div>
              <div style={{flex:1}}><Input label="Design No." placeholder="Auto-assigned" mono/></div>
            </div>
            <div style={{padding:"6px 8px",background:C.redLight,border:`0.5px solid ${C.redBorder}`,borderRadius:4,fontSize:11,color:C.red,marginBottom:12}}>EMB files are blocked. All upload attempts are logged.</div>
            <div style={{display:"flex",gap:8}}>
              <button style={{flex:1,padding:"8px",background:CO.accent,color:C.white,border:"none",borderRadius:4,fontSize:12,fontWeight:600,cursor:"pointer"}}>Submit for Approval</button>
              <button onClick={()=>setShowUpload(false)} style={{flex:1,padding:"8px",background:"#f5f5f5",border:`0.5px solid ${C.border}`,borderRadius:4,fontSize:12,cursor:"pointer"}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <div style={{display:"flex",gap:12}}>
        <div style={{flex:2}}>
          <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,overflow:"hidden",background:C.white}}>
            <div style={{display:"flex",background:C.bgSoft,padding:"6px 10px",fontSize:10,fontWeight:700,color:C.textMuted,gap:6}}>
              {["D.NO","DESIGN NAME","HSN","UPLOADED","STITCH CT","STATUS","STITCH LOCK","ACTIONS"].map((h,i)=><div key={i} style={{flex:1}}>{h}</div>)}
            </div>
            {[
              {dno:"D-730",name:"Floral Embr. Set",hsn:"6303",by:"Designer 1",stitch:"82,400",status:"Approved",locked:true},
              {dno:"D-731",name:"Geometric Border",hsn:"6303",by:"Designer 2",stitch:"Pending",status:"Pending",locked:false,pending:true},
              {dno:"D-732",name:"Mirror Work Suit",hsn:"6301",by:"Designer 1",stitch:" - ",status:"Rejected",locked:false,rejected:true},
              {dno:"D-728",name:"Solid Embr. Top",hsn:"6303",by:"Designer 3",stitch:"68,200",status:"Approved",locked:true},
            ].map((r,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 10px",borderTop:`0.5px solid ${C.border}`,fontSize:11,background:r.pending?CO.accentLight:C.white}}>
                <div style={{flex:1,fontFamily:"monospace",color:CO.accent,fontWeight:600}}>{r.dno}</div>
                <div style={{flex:1,fontWeight:500}}>{r.name}</div>
                <div style={{flex:1,color:C.textMuted,fontFamily:"monospace"}}>{r.hsn}</div>
                <div style={{flex:1,color:C.textMuted}}>{r.by}</div>
                <div style={{flex:1,fontFamily:"monospace",fontWeight:r.locked?600:400}}>{r.stitch}</div>
                <div style={{flex:1}}><span style={{fontSize:10,fontWeight:600,color:r.status==="Approved"?C.green:r.pending?CO.accent:C.red,background:r.status==="Approved"?C.greenLight:r.pending?CO.accentLight:C.redLight,padding:"2px 5px",borderRadius:3}}>{r.status}</span></div>
                <div style={{flex:1}}>{r.locked?<span style={{fontSize:10,color:C.green,fontWeight:600}}>✔ Locked</span>:r.pending?<button style={{padding:"3px 8px",fontSize:10,background:CO.accent,color:C.white,border:"none",borderRadius:3,cursor:"pointer"}}>Lock Now</button>:<span style={{fontSize:10,color:C.textMuted}}>N/A</span>}</div>
                <div style={{flex:1,display:"flex",gap:4}}>
                  <button style={{padding:"3px 6px",fontSize:10,border:`0.5px solid ${C.border}`,borderRadius:3,background:C.white,cursor:"pointer"}}>View</button>
                  {r.rejected&&<button style={{padding:"3px 6px",fontSize:10,border:`0.5px solid ${C.border}`,borderRadius:3,background:C.white,cursor:"pointer"}}>Re-upload</button>}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{flex:1}}>
          <Card>
            <SectionLabel>Upload New Design</SectionLabel>
            <button onClick={()=>setShowUpload(true)} style={{width:"100%",padding:"40px 16px",border:`1.5px dashed ${CO.accentBorder}`,borderRadius:6,background:CO.accentLight,color:CO.accent,fontSize:12,fontWeight:600,cursor:"pointer",textAlign:"center"}}>
              ↑ Upload DST File
            </button>
          </Card>
          <Card>
            <SectionLabel>IP Restriction Log</SectionLabel>
            {[["Designer 1","D-730","View","07 May 09:12",true],["Designer 2","D-731","Upload","07 May 10:44",true],["Unknown IP","D-728","Attempt","06 May 22:10",false]].map(([u,d,act,t,ok],i)=>(
              <div key={i} style={{fontSize:10,padding:"4px 0",borderBottom:`0.5px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}>
                <span style={{color:ok?C.text:C.red}}>{u} · {d} · {act}</span>
                <span style={{color:ok?C.textMuted:C.red,fontWeight:ok?400:700}}>{ok?t:"⚠ Flagged"}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  </WebLayout>
  );
},
// G-15: Job Work Types
"G-15": () => {
  const [showAdd, setShowAdd] = useState(false);
  const types = [
    {code:"EMB",name:"Embroidery",unit:"Per Stitch",rate:"0.18",active:true},
    {code:"STH",name:"Stitching",unit:"Per Piece",rate:"45.00",active:true},
    {code:"DIA",name:"Diamond Work",unit:"Per Piece",rate:"28.00",active:true},
    {code:"LAC",name:"Lace Work",unit:"Per Meter",rate:"12.00",active:true},
    {code:"WASH",name:"Washing",unit:"Per Piece",rate:"8.00",active:true},
    {code:"CUT",name:"Cutting",unit:"Per Piece",rate:"15.00",active:true},
    {code:"FIN",name:"Finishing",unit:"Per Piece",rate:"10.00",active:true},
    {code:"HND",name:"Hand Work",unit:"Per Piece",rate:"35.00",active:true},
    {code:"PRT",name:"Printing",unit:"Per Meter",rate:"22.00",active:true},
    {code:"EMB2",name:"Machine Embr.",unit:"Per Stitch",rate:"0.12",active:true},
    {code:"BTN",name:"Button Work",unit:"Per Piece",rate:"6.00",active:false},
    {code:"ZAR",name:"Zardozi",unit:"Per Piece",rate:"85.00",active:true},
    {code:"SEQ",name:"Sequin Work",unit:"Per Piece",rate:"30.00",active:false},
  ];
  return (
  <WebLayout activeMenu="Masters" mode="mfg">
    <GTopBar title="Job Work Types" sub="13 types configured · manage rates and availability" actions={[{label:"+ Add Type",primary:true}]}/>
    {showAdd&&(
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowAdd(false)}>
        <div style={{background:C.white,borderRadius:8,padding:24,width:380}} onClick={e=>e.stopPropagation()}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
            <div style={{fontSize:14,fontWeight:700}}>Add Job Work Type</div>
            <span onClick={()=>setShowAdd(false)} style={{cursor:"pointer",fontSize:18,color:C.textMuted}}>×</span>
          </div>
          <Input label="Type Code (e.g. EMB)" placeholder="3-5 chars" required mono/>
          <Input label="Type Name" placeholder="e.g. Embroidery" required/>
          <div style={{display:"flex",gap:10}}>
            <div style={{flex:1}}>
              <div style={{fontSize:11,color:C.textMuted,marginBottom:4}}>Unit <span style={{color:C.red}}>*</span></div>
              <select style={{width:"100%",padding:"7px 8px",border:`0.5px solid ${C.border}`,borderRadius:4,fontSize:12,background:C.white}}>
                <option>Per Piece</option><option>Per Meter</option><option>Per Stitch</option>
              </select>
            </div>
            <div style={{flex:1}}><Input label="Default Rate (₹)" placeholder="0.00" required/></div>
          </div>
          <div style={{display:"flex",gap:8,marginTop:16}}>
            <button style={{flex:1,padding:"8px",background:CO.accent,color:C.white,border:"none",borderRadius:4,fontSize:12,fontWeight:600,cursor:"pointer"}}>Save</button>
            <button onClick={()=>setShowAdd(false)} style={{flex:1,padding:"8px",background:"#f5f5f5",border:`0.5px solid ${C.border}`,borderRadius:4,fontSize:12,cursor:"pointer"}}>Cancel</button>
          </div>
        </div>
      </div>
    )}
    <div style={{padding:16,background:C.bgSoft,minHeight:460}}>
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,overflow:"hidden",background:C.white}}>
        <div style={{display:"flex",background:C.bgSoft,padding:"6px 10px",fontSize:10,fontWeight:700,color:C.textMuted,gap:6}}>
          {["CODE","NAME","BILLING UNIT","DEFAULT RATE","STATUS","ACTIONS"].map((h,i)=><div key={i} style={{flex:i===5?1.5:1}}>{h}</div>)}
        </div>
        {types.map((r,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 10px",borderTop:`0.5px solid ${C.border}`,fontSize:11,background:r.active?C.white:"#fafafa",opacity:r.active?1:0.6}}>
            <div style={{flex:1,fontFamily:"monospace",fontWeight:700,color:CO.accent}}>{r.code}</div>
            <div style={{flex:1,fontWeight:500}}>{r.name}</div>
            <div style={{flex:1,color:C.textMuted}}>{r.unit}</div>
            <div style={{flex:1,fontFamily:"monospace",fontWeight:600}}>₹{r.rate}</div>
            <div style={{flex:1}}><span style={{fontSize:10,fontWeight:600,color:r.active?C.green:C.textMuted,background:r.active?C.greenLight:"#f5f5f5",padding:"2px 6px",borderRadius:3}}>{r.active?"Active":"Inactive"}</span></div>
            <div style={{flex:1.5,display:"flex",gap:4}}>
              <button style={{padding:"3px 8px",fontSize:10,border:`0.5px solid ${C.border}`,borderRadius:3,background:C.white,cursor:"pointer"}}>Edit</button>
              <button style={{padding:"3px 8px",fontSize:10,border:`0.5px solid ${r.active?C.redBorder:C.border}`,borderRadius:3,background:r.active?C.redLight:C.greenLight,color:r.active?C.red:C.green,cursor:"pointer"}}>{r.active?"Deactivate":"Activate"}</button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={()=>setShowAdd(true)} style={{marginTop:12,padding:"8px 20px",background:CO.accent,color:C.white,border:"none",borderRadius:4,fontSize:12,fontWeight:600,cursor:"pointer"}}>+ Add Job Work Type</button>
    </div>
  </WebLayout>
  );
},
// G-16: Color Master
"G-16": () => {
  const [selectedDesign, setSelectedDesign] = useState("D-730");
  return (
  <WebLayout activeMenu="Masters" mode="mfg">
    <GTopBar title="Colour Master" sub="Colours per design · used across challans and SKU creation" actions={[{label:"+ Add Colour",primary:true}]}/>
    <div style={{padding:16,background:C.bgSoft,minHeight:460}}>
      <div style={{display:"flex",gap:12}}>
        <div style={{width:200,flexShrink:0}}>
          <Card>
            <SectionLabel>Select Design</SectionLabel>
            {[
              {dno:"D-730",name:"Floral Anarkali",colors:5},
              {dno:"D-710",name:"Georgette Set",colors:4},
              {dno:"D-688",name:"Block Print",colors:6},
              {dno:"D-731",name:"Geometric Border",colors:3},
            ].map((d,i)=>(
              <div key={i} onClick={()=>setSelectedDesign(d.dno)} style={{padding:"8px 10px",borderRadius:4,marginBottom:4,cursor:"pointer",background:selectedDesign===d.dno?CO.accentLight:"#fafafa",border:`0.5px solid ${selectedDesign===d.dno?CO.accentBorder:C.border}`}}>
                <div style={{fontSize:11,fontWeight:700,color:selectedDesign===d.dno?CO.accent:C.text,fontFamily:"monospace"}}>{d.dno}</div>
                <div style={{fontSize:10,color:C.textMuted}}>{d.name}</div>
                <div style={{fontSize:9,color:C.textMuted}}>{d.colors} colours</div>
              </div>
            ))}
          </Card>
        </div>
        <div style={{flex:1}}>
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:700}}>{selectedDesign} · Colour List</div>
              <button style={{padding:"5px 12px",background:CO.accent,color:C.white,border:"none",borderRadius:4,fontSize:11,fontWeight:600,cursor:"pointer"}}>+ Add</button>
            </div>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden"}}>
              <div style={{display:"flex",background:C.bgSoft,padding:"6px 10px",fontSize:10,fontWeight:700,color:C.textMuted,gap:6}}>
                {["#","COLOUR NAME","HEX / SHADE CODE","PIECES (LAST RUN)","ACTIVE","ACTIONS"].map((h,i)=><div key={i} style={{flex:i===5?1.2:i===0?0.4:1}}>{h}</div>)}
              </div>
              {[
                {id:1,name:"Deep Pink",hex:"#e91e63",shade:"DP-01",pcs:200,active:true},
                {id:2,name:"Royal Blue",hex:"#1565c0",shade:"RB-02",pcs:200,active:true},
                {id:3,name:"Cream White",hex:"#fff8e1",shade:"CW-03",pcs:200,active:true},
                {id:4,name:"Mint Green",hex:"#4caf50",shade:"MG-04",pcs:0,active:false},
                {id:5,name:"Gold",hex:"#ffc107",shade:"GD-05",pcs:120,active:true},
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 10px",borderTop:`0.5px solid ${C.border}`,fontSize:11,opacity:r.active?1:0.55}}>
                  <div style={{flex:0.4,color:C.textMuted}}>{r.id}</div>
                  <div style={{flex:1,display:"flex",alignItems:"center",gap:6}}><div style={{width:14,height:14,borderRadius:3,background:r.hex,border:`0.5px solid ${C.border}`,flexShrink:0}}/>{r.name}</div>
                  <div style={{flex:1,fontFamily:"monospace",fontSize:10,color:C.textMuted}}>{r.shade}</div>
                  <div style={{flex:1,fontWeight:r.pcs>0?600:400,color:r.pcs>0?C.text:C.textMuted}}>{r.pcs>0?`${r.pcs} pcs`:"N/A"}</div>
                  <div style={{flex:1}}><span style={{fontSize:10,fontWeight:600,color:r.active?C.green:C.textMuted}}>{r.active?"Yes":"No"}</span></div>
                  <div style={{flex:1.2,display:"flex",gap:4}}>
                    <button style={{padding:"3px 6px",fontSize:10,border:`0.5px solid ${C.border}`,borderRadius:3,background:C.white,cursor:"pointer"}}>Edit</button>
                    <button style={{padding:"3px 6px",fontSize:10,border:`0.5px solid ${r.active?C.redBorder:C.border}`,borderRadius:3,background:r.active?C.redLight:C.greenLight,color:r.active?C.red:C.green,cursor:"pointer"}}>{r.active?"Hide":"Show"}</button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  </WebLayout>
  );
},
// G-17: Contractor Registry
"G-17": () => {
  const [tab, setTab] = useState("list");
  return (
  <WebLayout activeMenu="Contractors" mode="mfg">
    <GTopBar title="Contractor Registry" sub="Full registration · GSTIN · bank details · mobile login" actions={[{label:"Register Contractor",primary:true},{label:"Export"}]}/>
    <div style={{padding:16,background:C.bgSoft,minHeight:460}}>
      <div style={{display:"flex",gap:6,marginBottom:12}}>
        {[["list","All Contractors"],["pending","Pending Verification"],["inactive","Inactive"]].map(([v,l],i)=>(
          <div key={i} onClick={()=>setTab(v)} style={{padding:"5px 14px",borderRadius:3,fontSize:11,fontWeight:600,cursor:"pointer",background:tab===v?CO.accent:"#f5f5f5",color:tab===v?C.white:C.textMuted,border:`0.5px solid ${tab===v?CO.accent:C.border}`}}>{l}</div>
        ))}
      </div>
      <div style={{display:"flex",gap:12}}>
        <div style={{flex:2}}>
          <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,overflow:"hidden",background:C.white}}>
            <div style={{display:"flex",background:C.bgSoft,padding:"6px 10px",fontSize:10,fontWeight:700,color:C.textMuted,gap:6}}>
              {["CODE","NAME","TYPE","MOBILE","GSTIN","BANK","LOGIN","STATUS","ACTION"].map((h,i)=><div key={i} style={{flex:1}}>{h}</div>)}
            </div>
            {[
              {code:"C-006",name:"Ramesh Kadkiya",type:"EMB",mobile:"98250-XXXXX",gstin:"27ABCDE",bank:"HDFC •••−4521",login:true,status:"Active"},
              {code:"C-011",name:"Suresh Bhai",type:"STH",mobile:"94260-XXXXX",gstin:" - ",bank:"SBI •••−8832",login:true,status:"Active"},
              {code:"C-023",name:"Anil Thakkar",type:"DIA",mobile:"99250-XXXXX",gstin:"27XYZAA",bank:"ICICI •••−3310",login:false,status:"Pending"},
              {code:"C-045",name:"Mohan Das",type:"HND",mobile:"98250-XXXXX",gstin:" - ",bank:"BOI •••−6640",login:true,status:"Active"},
            ].map((r,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 10px",borderTop:`0.5px solid ${C.border}`,fontSize:11}}>
                <div style={{flex:1,fontFamily:"monospace",fontSize:10,color:CO.accent,fontWeight:600}}>{r.code}</div>
                <div style={{flex:1,fontWeight:500}}>{r.name}</div>
                <div style={{flex:1}}><span style={{fontSize:9,fontWeight:700,background:CO.accentLight,color:CO.accent,padding:"2px 5px",borderRadius:3}}>{r.type}</span></div>
                <div style={{flex:1,color:C.textMuted,fontSize:10}}>{r.mobile}</div>
                <div style={{flex:1,color:C.textMuted,fontSize:10}}>{r.gstin}</div>
                <div style={{flex:1,color:C.textMuted,fontSize:10}}>{r.bank}</div>
                <div style={{flex:1}}><span style={{fontSize:9,fontWeight:600,color:r.login?C.green:C.textMuted}}>{r.login?"✔ Active":"No login"}</span></div>
                <div style={{flex:1}}><span style={{fontSize:10,fontWeight:600,color:r.status==="Active"?C.green:CO.accent}}>{r.status}</span></div>
                <div style={{flex:1,display:"flex",gap:3}}>
                  <button style={{padding:"3px 6px",fontSize:10,border:`0.5px solid ${C.border}`,borderRadius:3,background:C.white,cursor:"pointer"}}>Edit</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{flex:1}}>
          <Card>
            <SectionLabel>Quick Register</SectionLabel>
            <Input label="Full Name" placeholder="Contractor name" required/>
            <div style={{display:"flex",gap:10}}>
              <div style={{flex:1}}><Input label="Mobile" placeholder="+91 XXXXX" required/></div>
              <div style={{flex:1}}><Input label="Job Type" placeholder="EMB/STH..."/></div>
            </div>
            <Input label="Address / City" placeholder="Surat / Ahmedabad"/>
            <Input label="GSTIN" placeholder="Optional"/>
            <Input label="Bank Account No." placeholder="For payments"/>
            <div style={{marginBottom:8}}>
              <div style={{fontSize:11,color:C.textMuted,marginBottom:4}}>Mobile Login</div>
              <div style={{display:"flex",gap:6}}>
                {["Create login (SMS PIN)","Skip for now"].map((opt,i)=>(
                  <div key={i} style={{padding:"4px 10px",border:`0.5px solid ${i===0?CO.accentBorder:C.border}`,borderRadius:3,fontSize:10,cursor:"pointer",background:i===0?CO.accentLight:"#fafafa",color:i===0?CO.accent:C.textMuted}}>{opt}</div>
                ))}
              </div>
            </div>
            <Btn primary full>Register Contractor</Btn>
          </Card>
        </div>
      </div>
    </div>
  </WebLayout>
  );
},
// G-18: Notifications Center
"G-18": () => {
  const [filter, setFilter] = useState("all");
  const events = [
    {type:"accepted",challan:"3210",design:"D-730",contractor:"Ramesh Kadkiya",stage:"EMB",time:"07 May 09:14",msg:"Challan accepted by Ramesh"},
    {type:"rejected",challan:"3208",design:"D-728",contractor:"Suresh Bhai",stage:"STH",time:"06 May 17:22",msg:"Rejection: Not enough capacity this week"},
    {type:"sent",challan:"3211",design:"D-710",contractor:"Anil Thakkar",stage:"DIA",time:"07 May 11:00",msg:"Challan sent to Anil for Diamond work"},
    {type:"accepted",challan:"3205",design:"D-715",contractor:"Mohan Das",stage:"HND",time:"05 May 15:30",msg:"Accepted"},
    {type:"sent",challan:"3209",design:"D-718",contractor:"Priya Sharma",stage:"LAC",time:"06 May 10:00",msg:"Sent to Priya for Lace Work"},
    {type:"rejected",challan:"3207",design:"D-712",contractor:"Deepak Bhai",stage:"STH",time:"05 May 18:45",msg:"Rejected: Already has 22 pending challans"},
  ];
  const filtered = filter==="all"?events:events.filter(e=>e.type===filter);
  const typeColor = {accepted:C.green,rejected:C.red,sent:CO.accent};
  const typeBg = {accepted:C.greenLight,rejected:C.redLight,sent:CO.accentLight};
  return (
  <WebLayout activeMenu="Notifications" mode="mfg">
    <GTopBar title="Notifications Centre" sub="Challan events · accept / reject / sent tracking" actions={[{label:"Mark All Read"},{label:"Settings"}]}/>
    <div style={{padding:16,background:C.bgSoft,minHeight:460}}>
      <div style={{display:"flex",gap:6,marginBottom:12}}>
        {[["all","All Events"],["accepted","Accepted"],["rejected","Rejected"],["sent","Sent"]].map(([v,l],i)=>(
          <div key={i} onClick={()=>setFilter(v)} style={{padding:"5px 14px",borderRadius:3,fontSize:11,fontWeight:600,cursor:"pointer",background:filter===v?CO.accent:"#f5f5f5",color:filter===v?C.white:C.textMuted,border:`0.5px solid ${filter===v?CO.accent:C.border}`}}>{l}</div>
        ))}
      </div>
      {filtered.map((ev,i)=>(
        <div key={i} style={{background:C.white,border:`0.5px solid ${C.border}`,borderRadius:6,padding:"10px 14px",marginBottom:8,display:"flex",alignItems:"flex-start",gap:10}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:typeColor[ev.type],marginTop:4,flexShrink:0}}/>
          <div style={{flex:1}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:10,fontWeight:700,padding:"2px 6px",borderRadius:3,background:typeBg[ev.type],color:typeColor[ev.type],textTransform:"uppercase"}}>{ev.type}</span>
                <span style={{fontSize:11,fontWeight:600,fontFamily:"monospace"}}>#{ev.challan}</span>
                <span style={{fontSize:10,color:C.textMuted}}>{ev.design} · {ev.stage}</span>
              </div>
              <span style={{fontSize:10,color:C.textMuted}}>{ev.time}</span>
            </div>
            <div style={{fontSize:11,color:C.text}}>{ev.msg}</div>
            <div style={{fontSize:10,color:C.textMuted,marginTop:2}}>{ev.contractor}</div>
          </div>
          <button style={{padding:"4px 10px",fontSize:10,border:`0.5px solid ${CO.accentBorder}`,borderRadius:3,background:CO.accentLight,color:CO.accent,cursor:"pointer",flexShrink:0}}>View Challan</button>
        </div>
      ))}
    </div>
  </WebLayout>
  );
},
// G-19: GMMS Reports Hub
"G-19": () => {
  const [report, setReport] = useState("challan");
  return (
  <WebLayout activeMenu="Reports" mode="mfg">
    <GTopBar title="GMMS Reports Hub" sub="Challan status · contractor performance · design cost history" actions={[{label:"Export PDF"},{label:"Export CSV",primary:true}]}/>
    <div style={{padding:16,background:C.bgSoft,minHeight:460}}>
      <div style={{display:"flex",gap:6,marginBottom:16}}>
        {[["challan","Challan Status"],["contractor","Contractor Performance"],["design","Design Cost History"]].map(([v,l],i)=>(
          <div key={i} onClick={()=>setReport(v)} style={{padding:"6px 16px",borderRadius:3,fontSize:11,fontWeight:600,cursor:"pointer",background:report===v?CO.accent:"#f5f5f5",color:report===v?C.white:C.textMuted,border:`0.5px solid ${report===v?CO.accent:C.border}`}}>{l}</div>
        ))}
      </div>
      {report==="challan"&&(
        <div style={{display:"flex",gap:12}}>
          <div style={{flex:2}}>
            <Card>
              <div style={{fontSize:12,fontWeight:700,marginBottom:10}}>Challan Status Overview · May 2026</div>
              <div style={{display:"flex",gap:8,marginBottom:14}}>
                {[["Total Issued","127",""],["Completed","98",C.green],["In Progress","22",CO.accent],["Overdue","7",C.red]].map(([l,v,c],i)=>(
                  <div key={i} style={{flex:1,textAlign:"center",padding:"10px 6px",background:C.bgSoft,borderRadius:4,border:`0.5px solid ${C.border}`}}>
                    <div style={{fontSize:20,fontWeight:700,color:c||C.text}}>{v}</div>
                    <div style={{fontSize:10,color:C.textMuted}}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden"}}>
                <TH cols={[{v:"Challan",w:0.8},{v:"Design"},{v:"Contractor"},{v:"Stage"},{v:"Days Used",w:0.8},{v:"Status"}]}/>
                {[["3210","D-730","Ramesh K.","STH","18d","In Progress"],["3208","D-728","Suresh B.","STH","22d","Overdue"],["3205","D-715","Mohan D.","HND","12d","Completed"],["3203","D-712","Priya S.","LAC","9d","Completed"]].map((r,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",borderTop:`0.5px solid ${C.border}`,fontSize:11}}>
                    {r.map((v,j)=><div key={j} style={{flex:j===0?0.8:j===4?0.8:1,fontFamily:j===0?"monospace":"inherit",color:j===5?(v==="Overdue"?C.red:v==="In Progress"?CO.accent:C.green):j===0?CO.accent:j===4?(parseInt(v)>20?C.red:C.text):C.text,fontWeight:j===0||j===5?600:400,fontSize:j===0?10:11}}>{v}</div>)}
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <div style={{flex:1}}>
            <Card>
              <div style={{fontSize:12,fontWeight:700,marginBottom:10}}>Date Range</div>
              <div style={{display:"flex",gap:8}}>
                <div style={{flex:1}}><Input label="From" placeholder="01 May 2026"/></div>
                <div style={{flex:1}}><Input label="To" placeholder="31 May 2026"/></div>
              </div>
              <div style={{marginBottom:8}}>
                <div style={{fontSize:11,color:C.textMuted,marginBottom:4}}>Filter by Stage</div>
                <select style={{width:"100%",padding:"7px 8px",border:`0.5px solid ${C.border}`,borderRadius:4,fontSize:12,background:C.white}}>
                  <option>All Stages</option><option>EMB</option><option>STH</option><option>DIA</option>
                </select>
              </div>
              <Btn primary full>Generate Report</Btn>
            </Card>
          </div>
        </div>
      )}
      {report==="contractor"&&(
        <Card>
          <div style={{fontSize:12,fontWeight:700,marginBottom:10}}>Contractor Performance · May 2026</div>
          <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden"}}>
            <TH cols={[{v:"Contractor"},{v:"Type"},{v:"Challans"},{v:"Completed"},{v:"Avg Days"},{v:"Rejection %"},{v:"Score"}]}/>
            {[["Ramesh Kadkiya","EMB","24","24","9.1d","1.2%","98"],["Suresh Bhai","STH","18","16","5.8d","2.1%","92"],["Anil Thakkar","DIA","15","14","3.9d","0.8%","94"],["Priya Sharma","LAC","12","11","2.1d","1.5%","88"],["Deepak Bhai","STH","10","7","6.1d","4.2%","71"]].map((r,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",borderTop:`0.5px solid ${C.border}`,fontSize:11}}>
                {r.map((v,j)=><div key={j} style={{flex:1,color:j===6?(parseInt(v)>=90?C.green:parseInt(v)>=80?CO.accent:C.red):j===5?(parseFloat(v)>3?C.red:C.text):C.text,fontWeight:j===6?700:400}}>{v}</div>)}
              </div>
            ))}
          </div>
        </Card>
      )}
      {report==="design"&&(
        <Card>
          <div style={{fontSize:12,fontWeight:700,marginBottom:10}}>Design Cost History</div>
          <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden"}}>
            <TH cols={[{v:"Design"},{v:"Name"},{v:"Runs"},{v:"Avg Cost/Pc"},{v:"Total Spend"},{v:"Last Run"}]}/>
            {[["D-730","Floral Anarkali","3","₹ 142","₹ 2.56L","07 May"],["D-710","Georgette Set","5","₹ 98","₹ 1.88L","02 May"],["D-688","Block Print","2","₹ 76","₹ 0.91L","28 Apr"],["D-715","Embr. Dupatta","4","₹ 55","₹ 1.32L","05 May"]].map((r,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",borderTop:`0.5px solid ${C.border}`,fontSize:11}}>
                {r.map((v,j)=><div key={j} style={{flex:1,fontFamily:j===0?"monospace":"inherit",color:j===0?CO.accent:j===4?"#b45309":C.text,fontWeight:j===0||j===4?600:400}}>{v}</div>)}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  </WebLayout>
  );
},
// G-20: RF Creation
"G-20": () => {
  const [lookupBy, setLookupBy] = useState("invoice");
  const [found, setFound] = useState(true);
  const rfCreatedAt = "11 May 2026, 15:44";
  return (
  <WebLayout activeMenu="RF" mode="mfg">
    <GTopBar title="RF / Alteration Creation" sub="Lookup by Invoice No. or Design No. · raise alteration request" actions={[{label:"Submit RF",primary:true},{label:"Cancel"}]}/>
    <div style={{padding:16,background:C.bgSoft,minHeight:460}}>
      <div style={{display:"flex",gap:12}}>
        <div style={{flex:2}}>
          <Card>
            <SectionLabel>Lookup</SectionLabel>
            <div style={{display:"flex",gap:6,marginBottom:10}}>
              {[["invoice","Invoice No."],["design","Design No."]].map(([v,l],i)=>(
                <div key={i} onClick={()=>setLookupBy(v)} style={{padding:"5px 16px",borderRadius:3,fontSize:11,fontWeight:600,cursor:"pointer",background:lookupBy===v?CO.accent:"#f5f5f5",color:lookupBy===v?C.white:C.textMuted,border:`0.5px solid ${lookupBy===v?CO.accent:C.border}`}}>{l}</div>
              ))}
            </div>
            <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
              <div style={{flex:1}}><Input label={lookupBy==="invoice"?"Invoice No.":"Design No."} placeholder={lookupBy==="invoice"?"e.g. INV-2024-1042":"e.g. D-710"} required/></div>
              <button onClick={()=>setFound(true)} style={{padding:"7px 16px",background:CO.accent,color:C.white,border:"none",borderRadius:4,fontSize:11,fontWeight:600,cursor:"pointer",marginBottom:10}}>Search</button>
            </div>
            {found&&(
              <div style={{border:`0.5px solid ${CO.accentBorder}`,borderRadius:6,padding:"10px 14px",background:CO.accentLight,marginTop:4}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <div style={{fontSize:12,fontWeight:700}}>Challan #3202 · D-710 Floral Anarkali</div>
                  <span style={{fontSize:10,padding:"2px 8px",background:C.greenLight,color:C.green,borderRadius:3,fontWeight:600}}>Found</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {[["Design","D-710"],["Pieces","240 pcs"],["Contractor","Ramesh Kadkiya"],["Stage","STH · Completed"],["Invoice","INV-2024-1042"],["Date","03 May 2026"]].map(([l,v],i)=>(
                    <div key={i} style={{fontSize:11}}>
                      <span style={{color:C.textMuted}}>{l}: </span><span style={{fontWeight:600}}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
          <Card>
            <SectionLabel>RF / Alteration Details</SectionLabel>
            <div style={{marginBottom:10}}>
              <div style={{fontSize:11,color:C.textMuted,marginBottom:4}}>RF Type <span style={{color:C.red}}>*</span></div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {["Fabric Short","Quality Reject","Stitching Error","Missing Pieces","Late Delivery","Other"].map((t,i)=>(
                  <div key={i} style={{padding:"4px 10px",border:`0.5px solid ${i===5?C.redBorder:C.border}`,borderRadius:3,fontSize:11,cursor:"pointer",background:i===5?C.redLight:"#fafafa",color:i===5?C.red:C.textMuted,fontWeight:i===5?600:400}}>{t}</div>
                ))}
              </div>
            </div>
            <Input label="Pieces Affected" placeholder="e.g. 24" required/>
            <Input label="Description" placeholder="Describe the issue in detail" required/>
            <div style={{display:"flex",gap:10}}>
              <div style={{flex:1}}><Input label="RF Created Timestamp (Auto)" placeholder={rfCreatedAt} mono note="Recorded when the user submits RF"/></div>
              <div style={{flex:1}}><Input label="Created By" placeholder="Moin Noorani" note="Stored in RF audit trail"/></div>
            </div>
            <div style={{marginBottom:8}}>
              <div style={{fontSize:11,color:C.textMuted,marginBottom:4}}>Assign to Contractor?</div>
              <div style={{display:"flex",gap:6}}>
                {["Yes — Raise against Ramesh","No — Internal only"].map((opt,i)=>(
                  <div key={i} style={{padding:"4px 12px",border:`0.5px solid ${i===0?C.redBorder:C.border}`,borderRadius:3,fontSize:11,cursor:"pointer",background:i===0?C.redLight:"#fafafa",color:i===0?C.red:C.textMuted,fontWeight:i===0?600:400}}>{opt}</div>
                ))}
              </div>
            </div>
          </Card>
        </div>
        <div style={{flex:1}}>
          <Card style={{background:C.redLight,border:`0.5px solid ${C.redBorder}`}}>
            <SectionLabel>RF Summary</SectionLabel>
            {[["Challan","#3202"],["Design","D-710"],["Type","Stitching Error"],["Pieces","24"],["Created At",rfCreatedAt],["Created By","Moin Noorani"],["Assigned to","Ramesh Kadkiya"],["Status","Pending"]].map(([l,v],i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`0.5px solid ${C.redBorder}`,fontSize:11}}>
                <span style={{color:C.textMuted}}>{l}</span><span style={{fontWeight:500}}>{v}</span>
              </div>
            ))}
            <div style={{marginTop:10}}>
              <Btn primary full>Submit RF</Btn>
            </div>
          </Card>
          <Card>
            <SectionLabel>Recent RFs</SectionLabel>
            {[["#RF-441","D-688","STH Error","Resolved"],["#RF-440","D-730","Fabric Short","Open"],["#RF-439","D-710","Late Delivery","Closed"]].map(([id,d,t,st],i)=>(
              <div key={i} style={{padding:"5px 0",borderBottom:`0.5px solid ${C.border}`,fontSize:11}}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontFamily:"monospace",color:CO.accent,fontWeight:600}}>{id}</span>
                  <span style={{fontSize:10,color:st==="Open"?C.red:st==="Resolved"?C.green:C.textMuted,fontWeight:600}}>{st}</span>
                </div>
                <div style={{fontSize:10,color:C.textMuted}}>{d} · {t}</div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  </WebLayout>
  );
},
// G-21: SKU Outward
"G-21": () => {
  const [step, setStep] = useState(1);
  return (
  <WebLayout activeMenu="SKU Outward" mode="mfg">
    <GTopBar title="SKU Outward" sub="GMMS creates SKUs from finished pieces · auto-stocks GMMS + CMS inventories" actions={[{label:"Confirm & Stock",primary:true},{label:"Save Draft"},{label:"Cancel"}]}/>
    <div style={{padding:16,background:C.bgSoft,minHeight:460}}>
      <div style={{display:"flex",gap:6,marginBottom:16}}>
        {["1. Select Challan","2. Map to SKU","3. Set Pricing","4. Confirm"].map((s,i)=>(
          <div key={i} style={{flex:1,textAlign:"center",padding:"6px",borderRadius:3,fontSize:11,fontWeight:600,background:step===i+1?CO.accent:step>i+1?C.green:"#f5f5f5",color:step>=i+1?C.white:C.textMuted,border:`0.5px solid ${step===i+1?CO.accent:step>i+1?C.green:C.border}`,cursor:"pointer"}} onClick={()=>setStep(i+1)}>{s}</div>
        ))}
      </div>
      <div style={{display:"flex",gap:12}}>
        <div style={{flex:2}}>
          {step===1&&(
            <Card>
              <SectionLabel>Select Completed Challan</SectionLabel>
              <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden"}}>
                <TH cols={[{v:"Challan",w:0.8},{v:"Design"},{v:"Name"},{v:"Pieces"},{v:"Completed"},{v:"Select",w:0.7}]}/>
                {[["3202","D-710","Floral Anarkali","240","03 May"],["3198","D-688","Block Print Salwar","180","28 Apr"],["3195","D-715","Embr. Dupatta","120","25 Apr"]].map((r,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 10px",borderTop:`0.5px solid ${C.border}`,fontSize:11,background:i===0?CO.accentLight:C.white}}>
                    <div style={{flex:0.8,fontFamily:"monospace",color:CO.accent,fontWeight:600}}>#{r[0]}</div>
                    <div style={{flex:1,fontFamily:"monospace",fontSize:10}}>{r[1]}</div>
                    <div style={{flex:1,fontWeight:500}}>{r[2]}</div>
                    <div style={{flex:1}}>{r[3]} pcs</div>
                    <div style={{flex:1,color:C.textMuted}}>{r[4]}</div>
                    <div style={{flex:0.7}}><input type="radio" name="challan" defaultChecked={i===0} style={{cursor:"pointer"}}/></div>
                  </div>
                ))}
              </div>
              <div style={{marginTop:10}}><Btn primary full onClick={()=>setStep(2)}>Next: Map to SKU</Btn></div>
            </Card>
          )}
          {step===2&&(
            <Card>
              <SectionLabel>Map Pieces to SKU Variants</SectionLabel>
              <div style={{padding:"8px 10px",background:CO.accentLight,border:`0.5px solid ${CO.accentBorder}`,borderRadius:4,marginBottom:10,fontSize:11}}>
                Challan #3202 · D-710 Floral Anarkali · 240 pcs ready
              </div>
              <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden"}}>
                <div style={{display:"flex",background:C.bgSoft,padding:"5px 10px",fontSize:10,fontWeight:700,color:C.textMuted,gap:6}}>
                  <div style={{flex:1.2}}>Colour</div><div style={{flex:0.8}}>Size</div><div style={{flex:1}}>SKU Code</div><div style={{flex:0.8}}>Pieces</div><div style={{flex:0.8}}>To Stock</div>
                </div>
                {[{col:"Pink",sz:"M",sku:"HT-001-PNK-M",pcs:40,stock:40},{col:"Pink",sz:"L",sku:"HT-001-PNK-L",pcs:40,stock:40},{col:"Blue",sz:"M",sku:"HT-001-BLU-M",pcs:40,stock:40},{col:"Blue",sz:"L",sku:"HT-001-BLU-L",pcs:40,stock:40},{col:"Cream",sz:"M",sku:"HT-001-CRM-M",pcs:40,stock:40},{col:"Cream",sz:"L",sku:"HT-001-CRM-L",pcs:40,stock:40}].map((r,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",borderTop:`0.5px solid ${C.border}`,fontSize:11}}>
                    <div style={{flex:1.2}}>{r.col}</div>
                    <div style={{flex:0.8}}>{r.sz}</div>
                    <div style={{flex:1,fontFamily:"monospace",fontSize:10,color:CO.accent}}>{r.sku}</div>
                    <div style={{flex:0.8}}>{r.pcs}</div>
                    <div style={{flex:0.8,border:`0.5px solid ${C.border}`,borderRadius:3,padding:"2px 6px",background:C.white,fontWeight:600}}>{r.stock}</div>
                  </div>
                ))}
              </div>
              <div style={{marginTop:10,display:"flex",gap:6}}>
                <Btn full>Back</Btn>
                <Btn primary full>Next: Set Pricing</Btn>
              </div>
            </Card>
          )}
          {(step===3||step===4)&&(
            <Card>
              <SectionLabel>{step===3?"Set Pricing":"Confirm & Stock"}</SectionLabel>
              {step===3&&<>
                <div style={{display:"flex",gap:10}}>
                  <div style={{flex:1}}><Input label={"Retail Price (₹)"} placeholder="850.00" required note="Applied to all variants"/></div>
                  <div style={{flex:1}}><Input label={"Wholesale Price (₹)"} placeholder="720.00" required/></div>
                </div>
                <div style={{padding:"8px 10px",background:C.bgSoft,borderRadius:4,fontSize:11,color:C.textMuted,marginBottom:8}}>
                  240 pieces × ₹850 retail = <strong style={{color:C.text}}>₹ 2,04,000 retail value</strong>
                </div>
                <div style={{display:"flex",gap:6}}>
                  <Btn full>Back</Btn>
                  <Btn primary full>Next: Confirm</Btn>
                </div>
              </>}
              {step===4&&<>
                {["240 pieces stocked in GMMS inventory","240 pieces stocked in CMS inventory","6 SKU variants created / updated","Price ₹850 retail set for HT-001","Audit trail logged"].map((a,i)=>(
                  <div key={i} style={{fontSize:11,color:C.text,padding:"5px 0",borderBottom:`0.5px solid ${C.border}`,display:"flex",alignItems:"center",gap:6}}>
                    <span style={{color:C.green,fontWeight:700}}>✔</span>{a}
                  </div>
                ))}
                <div style={{marginTop:12}}><Btn primary full>Confirm & Stock Now</Btn></div>
              </>}
            </Card>
          )}
        </div>
        <div style={{flex:1}}>
          <Card>
            <SectionLabel>Outward Summary</SectionLabel>
            {[["Challan","#3202"],["Design","D-710"],["Name","Floral Anarkali"],["Total Pieces","240"],["SKU Variants","6"],["Retail Price","₹ 850"],["Wholesale","₹ 720"],["Stock Target","GMMS + CMS Inventories"]].map(([l,v],i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`0.5px solid ${C.border}`,fontSize:11}}>
                <span style={{color:C.textMuted}}>{l}</span><span style={{fontWeight:500}}>{v}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  </WebLayout>
  );
},
// G-22: Live Inventory (GMMS)
"G-22": () => (
  <WebLayout activeMenu="Inventory" mode="mfg">
    <GTopBar title="Live Inventory" sub="GMMS manufacturing inventory from SKU Outward · sync with CMS inventory" actions={[{label:"+ Sync from CMS",primary:true},{label:"Export"}]}/>
    <div style={{padding:16,background:C.bgSoft,minHeight:460}}>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <div style={{flex:1,border:`0.5px solid ${C.border}`,borderRadius:4,padding:"7px 10px",fontSize:12,color:C.textLight,background:C.white}}>Search by design code, challan, contractor...</div>
        <Btn small>Search</Btn>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
        <Btn small>All Stages ▾</Btn><Btn small>All Contractors ▾</Btn><Btn small>Colour ▾</Btn><Btn small>Size ▾</Btn>
        <div style={{display:"flex",gap:5}}>
          {["All","In Stock","Low Stock","Out of Stock"].map((s,i)=>(
            <span key={i} style={{fontSize:11,padding:"4px 10px",borderRadius:3,border:`0.5px solid ${i===0?CO.accent:C.border}`,background:i===0?CO.accent:C.white,color:i===0?C.white:C.textMuted,cursor:"pointer"}}>{s}</span>
          ))}
        </div>
      </div>
      <Card>
        <div style={{display:"flex",gap:12,marginBottom:12}}>
          <div style={{flex:1,background:CO.accentLight,border:`0.5px solid ${CO.accentBorder}`,borderRadius:6,padding:"12px",textAlign:"center"}}>
            <div style={{fontSize:22,fontWeight:700,color:CO.accent}}>1,420</div>
            <div style={{fontSize:10,color:C.textMuted}}>Total Pieces in GMMS</div>
          </div>
          <div style={{flex:1,background:"#e8f5e9",border:`0.5px solid #c8e6c9`,borderRadius:6,padding:"12px",textAlign:"center"}}>
            <div style={{fontSize:22,fontWeight:700,color:C.green}}>940</div>
            <div style={{fontSize:10,color:C.textMuted}}>Stocked in CMS</div>
          </div>
          <div style={{flex:1,background:"#fff3e0",border:`0.5px solid #ffe0b2`,borderRadius:6,padding:"12px",textAlign:"center"}}>
            <div style={{fontSize:22,fontWeight:700,color:"#e65100"}}>480</div>
            <div style={{fontSize:10,color:C.textMuted}}>Awaiting SKU Outward</div>
          </div>
        </div>
        <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,overflow:"hidden",background:C.white}}>
          <TH cols={[{v:"Design",w:1},{v:"SKU",w:1.2},{v:"Colour",w:0.8},{v:"Size",w:0.5},{v:"Pcs",w:0.5},{v:"Challan",w:0.7},{v:"Contractor",w:0.8},{v:"Status",w:0.8}]}/>
          {[
            {des:"D-710 Floral Anarkali",sku:"HT-001-PNK-M",col:"Pink",sz:"M",pcs:40,cno:"#3202",con:"Ramesh K.",status:"In Stock"},
            {des:"D-710 Floral Anarkali",sku:"HT-001-PNK-L",col:"Pink",sz:"L",pcs:40,cno:"#3202",con:"Ramesh K.",status:"In Stock"},
            {des:"D-710 Floral Anarkali",sku:"HT-001-BLU-M",col:"Blue",sz:"M",pcs:40,cno:"#3202",con:"Ramesh K.",status:"In Stock"},
            {des:"D-710 Floral Anarkali",sku:"HT-001-BLU-L",col:"Blue",sz:"L",pcs:40,cno:"#3202",con:"Ramesh K.",status:"In Stock"},
            {des:"D-710 Floral Anarkali",sku:"HT-001-CRM-M",col:"Cream",sz:"M",pcs:40,cno:"#3202",con:"Ramesh K.",status:"In Stock"},
            {des:"D-710 Floral Anarkali",sku:"HT-001-CRM-L",col:"Cream",sz:"L",pcs:40,cno:"#3202",con:"Ramesh K.",status:"In Stock"},
            {des:"D-688 Block Print Salwar",sku:"HT-002-BLU-M",col:"Blue",sz:"M",pcs:30,cno:"#3198",con:"Farid M.",status:"Low Stock"},
            {des:"D-688 Block Print Salwar",sku:"HT-002-BLU-L",col:"Blue",sz:"L",pcs:30,cno:"#3198",con:"Farid M.",status:"Low Stock"},
            {des:"D-715 Embr. Dupatta",sku:"HT-003-RED-M",col:"Red",sz:"M",pcs:0,cno:"#3195",con:"Suresh T.",status:"Out of Stock"},
          ].map((r,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 10px",borderTop:`0.5px solid ${C.border}`,fontSize:11,background:r.pcs===0?"#ffebee":r.status==="Low Stock"?"#fff8e1":C.white}}>
              <div style={{flex:1,fontWeight:500}}>{r.des}</div>
              <div style={{flex:1.2,fontFamily:"monospace",fontSize:10,color:CO.accent}}>{r.sku}</div>
              <div style={{flex:0.8}}>{r.col}</div>
              <div style={{flex:0.5}}>{r.sz}</div>
              <div style={{flex:0.5,fontWeight:600,textAlign:"center"}}>{r.pcs}</div>
              <div style={{flex:0.7,fontFamily:"monospace",fontSize:10}}>{r.cno}</div>
              <div style={{flex:0.8,fontSize:10}}>{r.con}</div>
              <div style={{flex:0.8}}><Tag color={r.status==="Out of Stock"||r.status==="Low Stock"?"red":"black"}>{r.status}</Tag></div>
            </div>
          ))}
        </div>
        <div style={{marginTop:8,padding:"7px 10px",background:C.bgSoft,borderRadius:4,border:`0.5px solid ${C.border}`,fontSize:11,color:C.textMuted}}>
          GMMS inventory auto-populated from SKU Outward (G-21). Use "Sync from CMS" to pull latest stock data from CMS inventory (W-09).
        </div>
      </Card>
    </div>
  </WebLayout>
),

// G-30: User Management (GMMS)
"G-30": () => (
  <WebLayout activeMenu="Admin" mode="mfg">
    <GTopBar title="User Management (GMMS)" actions={[{label:"+ Add User",primary:true}]}/>
    <Content>
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,overflow:"hidden",background:C.white,marginBottom:16}}>
        <TH cols={[{v:"Name"},{v:"Email",w:1.4},{v:"Role"},{v:"Mobile",w:0.9},{v:"Cross-ERP",w:0.7},{v:"Status",w:0.6},{v:"Last Login"},{v:"Actions",w:0.8}]}/>
        <div style={{fontSize:10,color:C.textMuted,padding:"6px 10px",background:CO.accentLight,borderTop:`0.5px solid ${CO.accentBorder}`}}>{"🔒"} <strong style={{color:CO.accent}}>Super Admin</strong>: Full access to both Sales ERP and Manufacturing ERP. Reserved for owners (Kadir Bhai, Ali Bhai).</div>
        {[
          {name:"Abdul Kadir",email:"admin@cms.com",role:"Super Admin",mob:"+91 91046 70469",status:"Active",login:"04 Apr 09:00",crossErp:"Both"},
          {name:"Mohammad Ali",email:"ali@cms.com",role:"Super Admin",mob:"+91 79905 01710",status:"Active",login:"04 Apr 09:15",crossErp:"Both"},
          {name:"Raju Singh",email:"raju@cms.com",role:"Godown Staff",mob:"+91 98765 43210",status:"Active",login:"04 Apr 08:45",crossErp:"Sales"},
          {name:"Priya Sharma",email:"priya@cms.com",role:"Office Staff",mob:"+91 87654 32109",status:"Active",login:"04 Apr 09:15",crossErp:"Sales"},
          {name:"Vikram Singh",email:"vikram@cms.com",role:"Production Manager",mob:"+91 98765 43211",status:"Active",login:"04 Apr 09:30",crossErp:"Manufacturing"},
          {name:"Suresh Patel",email:"suresh@cms.com",role:"Production Staff",mob:"+91 87654 32110",status:"Active",login:"04 Apr 08:50",crossErp:"Manufacturing"},
          {name:"Amit Shah",email:"amit@cms.com",role:"Accounts",mob:"+91 76543 21099",status:"Active",login:"04 Apr 09:10",crossErp:"Manufacturing"},
          {name:"Mohan Das",email:"mohan@cms.com",role:"Manager",mob:"+91 76543 21098",status:"Inactive",login:"28 Mar 17:00",crossErp:"Sales"},
        ].map((u,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 10px",borderTop:`0.5px solid ${C.border}`,background:u.status==="Inactive"?C.bgSoft:C.white}}>
            <div style={{flex:1,display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:C.black,display:"flex",alignItems:"center",justifyContent:"center",color:C.white,fontSize:11,fontWeight:700,flexShrink:0}}>{u.name[0]}</div>
              <span style={{fontSize:12,fontWeight:500}}>{u.name}</span>
            </div>
            <div style={{flex:1.4,fontSize:11,color:C.textMuted}}>{u.email}</div>
            <div style={{flex:1}}><Tag>{u.role}</Tag></div>
            <div style={{flex:0.7}}><span style={{fontSize:10,padding:"2px 6px",borderRadius:3,fontWeight:600,background:u.crossErp!=="Sales"?CO.accentLight:C.bgSoft,color:u.crossErp!=="Sales"?CO.accent:C.textMuted,border:`0.5px solid ${u.crossErp!=="Sales"?CO.accentBorder:C.border}`}}>{u.crossErp}</span></div>
            <div style={{flex:0.9,fontSize:11,color:C.textMuted,fontFamily:"monospace"}}>{u.mob}</div>
            <div style={{flex:0.6}}><Tag color={u.status==="Inactive"?"red":"black"}>{u.status}</Tag></div>
            <div style={{flex:1,fontSize:11,color:C.textMuted}}>{u.login}</div>
            <div style={{flex:0.8,display:"flex",gap:5}}><Btn small>Edit</Btn><Btn danger small>Deactivate</Btn></div>
          </div>
        ))}
      </div>

      {/* ── DIALOG STATE 1: + Add User ────────────────────── */}
      <div style={{fontSize:11,fontWeight:700,color:C.textMuted,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:10}}>
        ↓ Dialog shown when "+ Add User" is clicked
      </div>
      <div style={{position:"relative",minHeight:460,border:`1.5px dashed ${C.border}`,borderRadius:8,background:C.bgSoft,marginBottom:16}}>
        {/* Dimmed background hint */}
        <div style={{padding:16,opacity:0.25,fontSize:11,color:C.textMuted,textAlign:"center"}}>[ User list in background ]</div>
        <Modal title="Add New User">
          <div style={{marginBottom:14,padding:"8px 10px",background:C.bgSoft,borderRadius:4,fontSize:11,color:C.textMuted,border:`0.5px solid ${C.border}`}}>
            A login account will be created and a temporary password emailed to the user.
          </div>
          <div style={{display:"flex",gap:10}}>
            <div style={{flex:1}}><Input label="Full Name" placeholder="e.g. Raju Singh" required/></div>
            <div style={{flex:1}}><Input label="Mobile Number" placeholder="+91 98765 43210" required note="Used for account identification"/></div>
          </div>
          <Input label="Email Address" placeholder="raju@cms.com" required note="Login credential + password reset link sent here"/>
          <div style={{marginBottom:9}}>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:3,fontWeight:500}}>Role <span style={{color:C.red}}>*</span></div>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden",background:C.white}}>
              {[
                {role:"Super Admin",desc:"Full access cross-ERP for owners (Kadir Bhai, Ali Bhai)",icon:"⚙"},
                {role:"Production Manager",desc:"Full GMMS access  -  challans, production, contractors, fabric",icon:"▣"},
                {role:"Production Staff",desc:"Floor production  -  update piece counts, track challans",icon:"◈"},
                {role:"Accounts",desc:"Payments, reconciliation, reports (GMMS finance)",icon:"₹"},
                {role:"Manager",desc:"Sales ERP  -  orders, approvals, reports, payments",icon:"◉"},
                {role:"Office Staff",desc:"Sales ERP  -  orders, inventory, customers",icon:"□"},
                {role:"Godown Staff",desc:"Mobile only  -  scanning, picking, dispatch, LR upload",icon:"⊏"}
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"9px 12px",borderTop:i>0?`0.5px solid ${C.border}`:"none",background:i===6?C.bgSoft:C.white,cursor:"pointer"}}>
                  <div style={{width:16,height:16,borderRadius:"50%",border:`0.5px solid ${i===6?C.black:C.border}`,background:i===6?C.black:C.white,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                    {i===6&&<div style={{width:6,height:6,borderRadius:"50%",background:C.white}}/>}
                  </div>
                  <div>
                    <div style={{fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:6}}><span>{r.icon}</span>{r.role}</div>
                    <div style={{fontSize:10,color:C.textMuted,marginTop:1}}>{r.desc}</div>
                  </div>
                  <div style={{marginLeft:"auto"}}><span style={{fontSize:10,color:C.red,cursor:"pointer"}}>View permissions ↗</span></div>
                </div>
              ))}
            </div>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:3,fontWeight:500}}>Account Status</div>
            <div style={{display:"flex",gap:8}}>
              {["Active ●","Inactive"].map((s,i)=>(
                <span key={i} style={{fontSize:11,padding:"5px 14px",border:`0.5px solid ${i===0?C.black:C.border}`,borderRadius:4,background:i===0?C.black:C.white,color:i===0?C.white:C.textMuted,cursor:"pointer"}}>{s}</span>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",paddingTop:10,borderTop:`0.5px solid ${C.border}`}}>
            <Btn>Cancel</Btn>
            <Btn primary>Create User + Send Invite</Btn>
          </div>
        </Modal>
      </div>

      {/* ── DIALOG STATE 2: Edit User ────────────────────── */}
      <div style={{fontSize:11,fontWeight:700,color:C.textMuted,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:10}}>
        ↓ Dialog shown when "Edit" is clicked on a user row
      </div>
      <div style={{position:"relative",minHeight:440,border:`1.5px dashed ${C.border}`,borderRadius:8,background:C.bgSoft}}>
        <div style={{padding:16,opacity:0.25,fontSize:11,color:C.textMuted,textAlign:"center"}}>[ User list in background ]</div>
        <Modal title="Edit User  -  Raju Singh">
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",background:C.bgSoft,borderRadius:6,marginBottom:14,border:`0.5px solid ${C.border}`}}>
            <div style={{width:40,height:40,borderRadius:"50%",background:C.black,display:"flex",alignItems:"center",justifyContent:"center",color:C.white,fontSize:16,fontWeight:700,flexShrink:0}}>R</div>
            <div>
              <div style={{fontSize:13,fontWeight:600}}>Raju Singh</div>
              <div style={{fontSize:11,color:C.textMuted}}>raju@cms.com · Last login: 04 Apr 08:45</div>
            </div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <div style={{flex:1}}><Input label="Full Name" placeholder="Raju Singh"/></div>
            <div style={{flex:1}}><Input label="Mobile" placeholder="+91 98765 43210"/></div>
          </div>
          <Input label="Email" placeholder="raju@cms.com" note="Changing email will require re-verification"/>
          <div style={{marginBottom:9}}>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:3,fontWeight:500}}>Change Role</div>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden"}}>
              {[
                {role:"Super Admin",desc:"Full cross-ERP access",icon:"⚙",sel:false},
                {role:"Production Manager",desc:"Full GMMS access  -  challans, production, contractors",icon:"▣",sel:false},
                {role:"Production Staff",desc:"Floor production  -  challan view, update piece counts",icon:"◈",sel:false},
                {role:"Accounts",desc:"Payments, reconciliation, reports (GMMS)",icon:"₹",sel:false},
                {role:"Manager",desc:"Sales ERP  -  orders, approvals, reports",icon:"◉",sel:false},
                {role:"Office Staff",desc:"Sales ERP  -  orders, inventory, customers",icon:"□",sel:false},
                {role:"Godown Staff",desc:"Mobile  -  scan, pick, dispatch",icon:"⊏",sel:true}
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderTop:i>0?`0.5px solid ${C.border}`:"none",background:r.sel?C.bgSoft:C.white,cursor:"pointer"}}>
                  <div style={{width:16,height:16,borderRadius:"50%",border:`0.5px solid ${r.sel?C.black:C.border}`,background:r.sel?C.black:C.white,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {r.sel&&<div style={{width:6,height:6,borderRadius:"50%",background:C.white}}/>}
                  </div>
                  <span style={{fontSize:11}}>{r.icon} {r.role}</span>
                  <span style={{fontSize:10,color:C.textMuted}}> -  {r.desc}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{marginBottom:10}}>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:3,fontWeight:500}}>Status</div>
            <div style={{display:"flex",gap:8}}>
              {["Active ●","Inactive"].map((s,i)=>(
                <span key={i} style={{fontSize:11,padding:"5px 14px",border:`0.5px solid ${i===0?C.black:C.border}`,borderRadius:4,background:i===0?C.black:C.white,color:i===0?C.white:C.textMuted,cursor:"pointer"}}>{s}</span>
              ))}
            </div>
          </div>
          <div style={{padding:"8px 10px",background:"#fff8e1",border:`0.5px solid #f5c842`,borderRadius:4,fontSize:11,color:"#7a5c00",marginBottom:12}}>
            ⚠ Changing this user's role will take effect on their next login.
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"space-between",paddingTop:10,borderTop:`0.5px solid ${C.border}`}}>
            <Btn danger>Deactivate Account</Btn>
            <div style={{display:"flex",gap:8}}>
              <Btn>Cancel</Btn>
              <Btn primary>Save Changes</Btn>
            </div>
          </div>
        </Modal>
      </div>
    </Content>
  </WebLayout>
),

// G-30A: Role Permissions (GMMS)
"G-30A": () => {
  const [activeRole, setActiveRole] = useState(0);
  const roles = [
    "Super Admin",
    "Production Manager",
    "Production Staff",
    "Accounts",
    "Manager",
    "Office Staff",
    "Godown Staff",
  ];
  const roleDesc = [
    "Full unrestricted access to all modules. Reserved for owners (Kadir Bhai, Ali Bhai). Cannot be edited.",
    "Full GMMS access — challans, contractors, production, fabric, RF, masters, notifications. Read-only Sales ERP.",
    "Manufacturing floor — view challans, update piece counts. No create/delete on masters.",
    "GMMS finance — payments, reconciliation, reports, SMS. No production module access.",
    "Sales ERP operational control — orders, approvals, reports, payments, CRM. Limited GMMS read-only.",
    "General office — order processing, payment recording, dispatch tracking, basic CRM.",
    "Warehouse operations — picking, dispatch, LR upload, mobile scanning. No sales or finance access.",
  ];
  const T=true,F=false;
  const permsData = [
    [[T,T],[T,T,T,T,T],[T,T],[T,T,T,T,T,T,T,T],[T,T,T],[T,T,T],[T,T,T],[T,T],[T,T,T,T,T],[T,T,T,T,T],[T,T,T,T],[T,T,T,T],[T,T,T],[T,T,T],[T,T,T,T],[T,T],[T],[T,T]],
    [[T,F],[T,F,F,F,F],[T,F],[T,F,F,F,F,F,F,F],[F,F,F],[F,F,F],[F,F,F],[T,F],[F,F,F,F,F],[T,T,T,T,T],[T,T,T,T],[T,T,T,T],[T,T,T],[T,T,T],[T,T,T,T],[F,F],[T],[T,F]],
    [[T,F],[T,F,F,F,F],[T,F],[F,F,F,F,F,F,F,F],[F,F,F],[F,F,F],[F,F,F],[F,F],[F,F,F,F,F],[T,F,F,F,F],[T,T,F,F],[T,F,F,F],[T,F,F],[T,F,F],[F,F,F,F],[F,F],[T],[T,F]],
    [[T,F],[T,F,F,F,F],[F,F],[T,F,F,F,F,F,F,F],[F,F,F],[T,T,F],[F,F,F],[T,T],[F,F,F,F,F],[F,F,F,F,F],[F,F,F,F],[F,F,F,F],[F,F,F],[F,F,F],[F,F,F,F],[F,F],[F],[T,F]],
    [[T,T],[T,T,T,T,T],[T,T,T],[T,T,T,T,T,T,T,T],[T,T,T],[T,T,T],[T,T,T],[T,T],[T,F,T,F,T],[T,T,T,T,T],[T,T,F,F],[T,T,F,F],[T,T,F],[T,T,F],[T,T,T,T],[F,F],[T],[T,T]],
    [[T,F],[T,F,F,F,F],[T,F],[T,T,T,F,F,T,T,T],[T,F,F],[T,T,F],[F,F,F],[T,F],[F,F,T,F,F],[F,F,F,F,F],[F,F,F,F],[F,F,F,F],[F,F,F],[F,F,F],[F,F,F,F],[F,F],[F],[F,T]],
    [[T,F],[T,F,F,T,F],[T,F,T],[T,F,F,F,F,F,F,T],[T,T,F],[F,F,F],[T,T,F],[F,F],[F,F,F,F,F],[F,F,F,F,F],[F,F,F,F],[F,F,F,F],[F,F,F],[F,F,F],[F,F,F,F],[F,F],[F],[T,F]],
  ];
  const modules = [
    {name:"Dashboard",perms:["View dashboard & metrics","Export dashboard data"]},
    {name:"Products & SKU",perms:["View product list","Create / edit SKU","Add stock (via SKU edit)","Print labels & barcodes","Delete SKU"]},
    {name:"Inventory",perms:["View live inventory","View stock alerts"]},
    {name:"Orders",perms:["View order list","Create retail order","Create wholesale order","Approve wholesale orders","Reject / cancel orders","Edit order before approval","Record payment","Print challan"]},
    {name:"Dispatch & LR",perms:["View LR console","Upload LR document","Resend LR SMS"]},
    {name:"Payments",perms:["View payment records","Record installment payments","Delete payment records"]},
    {name:"CCTV",perms:["View footage library","Record dispatch video","Download footage clips"]},
    {name:"Reports",perms:["View reports","Export reports"]},
    {name:"Admin",perms:["User management","Role permissions","Customer master","System settings","Audit trail"]},
    {name:"Mfg — Challans",perms:["View challan list & details","Create new challans","Edit existing challans","Track challan progress","Close / complete challans"]},
    {name:"Mfg — Production",perms:["View production status","Update ready piece counts","Process SKU outward","Payment & piece verification"]},
    {name:"Mfg — Contractors",perms:["View contractor list","Register new contractors","Edit contractor details","Delete contractor records"]},
    {name:"Mfg — Fabric / Mill",perms:["View fabric inventory & mill data","Add new fabric rolls","Edit fabric roll details"]},
    {name:"Mfg — RF / Returns",perms:["View RF / return entries","Create RF entries","Edit existing RF entries"]},
    {name:"Mfg — Masters",perms:["Manage design master (DST files)","Configure job work types & rates","Manage color master per design","Contractor registry management"]},
    {name:"Mfg — Costing (Owner only)",perms:["View design BOM & cost breakdown","Edit cost data"]},
    {name:"Mfg — Notifications",perms:["View notification center"]},
    {name:"ERP Cross-Access",perms:["Access Manufacturing ERP (GMMS)","Access Sales ERP (CMS)"]},
  ];
  const rp = permsData[activeRole];
  const isSuperAdmin = activeRole === 0;
  return (
  <WebLayout activeMenu="Admin" mode="mfg">
    <GTopBar title="Role Permissions (GMMS)" sub="Configure what each role can access and do" actions={[{label:"Save All Permissions",primary:true}]}/>
    <Content>
      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
        {roles.map((role,i)=>(
          <span key={i} onClick={()=>setActiveRole(i)} style={{fontSize:11,padding:"5px 14px",borderRadius:3,border:`0.5px solid ${i===activeRole?CO.accent:C.border}`,background:i===activeRole?CO.accent:C.white,color:i===activeRole?C.white:C.textMuted,cursor:"pointer",fontWeight:i===activeRole?600:400}}>{role}</span>
        ))}
        <Btn small>{"+ Add Role"}</Btn>
        <div style={{marginLeft:"auto",display:"flex",gap:6}}>
          <Btn small>Duplicate Role</Btn>
          {!isSuperAdmin&&<Btn danger small>Delete Role</Btn>}
        </div>
      </div>
      <div style={{fontSize:11,color:isSuperAdmin?"#7a5c00":C.textMuted,marginBottom:12,padding:"7px 10px",background:isSuperAdmin?"#fff8e1":C.bgSoft,borderRadius:4,border:`0.5px solid ${isSuperAdmin?"#f5c842":C.border}`}}>
        {isSuperAdmin&&<span style={{fontWeight:700,color:"#7a5c00"}}>{"🔒"} Locked — </span>}
        <strong>{roles[activeRole]}</strong>: {roleDesc[activeRole]}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {modules.map((section,si)=>{
          const rowPerms = rp[si]||[];
          const checkedCount = isSuperAdmin ? section.perms.length : rowPerms.filter(Boolean).length;
          const total = section.perms.length;
          return (
          <Card key={si} style={{marginBottom:0}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{fontSize:12,fontWeight:600}}>{section.name}</div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:10,color:checkedCount===total?C.green:checkedCount===0?C.red:CO.accent,fontWeight:600}}>{checkedCount}/{total}</span>
                {!isSuperAdmin&&<div style={{display:"flex",gap:4}}>
                  <span style={{fontSize:10,color:CO.accent,cursor:"pointer",textDecoration:"underline"}}>All</span>
                  <span style={{fontSize:10,color:C.textMuted,cursor:"pointer",textDecoration:"underline"}}>None</span>
                </div>}
              </div>
            </div>
            <div>
              {section.perms.map((perm,pi)=>{
                const checked = isSuperAdmin ? true : (rowPerms[pi]||false);
                return (
                <div key={pi} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:pi<section.perms.length-1?`0.5px solid ${C.border}`:"none"}}>
                  <div style={{width:16,height:16,borderRadius:3,border:`0.5px solid ${checked?(isSuperAdmin?"#2e7d32":C.black):C.border}`,background:checked?(isSuperAdmin?"#2e7d32":C.black):C.white,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {checked&&<span style={{color:C.white,fontSize:10,lineHeight:1}}>{"✔"}</span>}
                  </div>
                  <span style={{fontSize:11,color:checked?C.text:C.textMuted,flex:1}}>{perm}</span>
                  {!checked&&<Tag color="red">Denied</Tag>}
                </div>
                );
              })}
            </div>
          </Card>
          );
        })}
      </div>

      <div style={{fontSize:11,fontWeight:700,color:C.textMuted,letterSpacing:"0.06em",textTransform:"uppercase",margin:"20px 0 10px"}}>
        {"↓"} Dialog shown when "+ Add Role" is clicked
      </div>
      <div style={{position:"relative",minHeight:500,border:`1.5px dashed ${C.border}`,borderRadius:8,background:C.bgSoft,marginBottom:20}}>
        <div style={{padding:16,opacity:0.25,fontSize:11,color:C.textMuted,textAlign:"center"}}>[ Permission matrix in background ]</div>
        <Modal title="Create New Role" width={500}>
          <div style={{padding:"8px 10px",background:C.bgSoft,borderRadius:4,fontSize:11,color:C.textMuted,border:`0.5px solid ${C.border}`,marginBottom:14}}>
            Define a new role name and optionally copy permissions from an existing role as a starting point.
          </div>
          <Input label="Role Name" placeholder="e.g. Accountant / Supervisor / Sales Rep" required note="This name will appear in user assignment and audit logs"/>
          <Input label="Description (optional)" placeholder="e.g. Can view orders and record payments  -  no stock access"/>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:6,fontWeight:500}}>Copy Permissions From (optional)</div>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden",background:C.white}}>
              {[
                {role:"Start with blank / no permissions",desc:"All permissions off by default",sel:false},
                {role:"Copy from: Production Manager",desc:"Full GMMS — challans, production, contractors, fabric",sel:false},
                {role:"Copy from: Production Staff",desc:"Floor production — challan view, piece counts",sel:false},
                {role:"Copy from: Manager",desc:"Orders, approvals, reports, payments",sel:false},
                {role:"Copy from: Office Staff",desc:"Orders, inventory, customers — no approvals",sel:true},
                {role:"Copy from: Godown Staff",desc:"Mobile only — scan, pick, dispatch",sel:false},
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"9px 12px",borderTop:i>0?`0.5px solid ${C.border}`:"none",background:r.sel?C.bgSoft:C.white,cursor:"pointer"}}>
                  <div style={{width:16,height:16,borderRadius:"50%",border:`0.5px solid ${r.sel?C.black:C.border}`,background:r.sel?C.black:C.white,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>
                    {r.sel&&<div style={{width:6,height:6,borderRadius:"50%",background:C.white}}/>}
                  </div>
                  <div>
                    <div style={{fontSize:12,fontWeight:r.sel?600:400}}>{r.role}</div>
                    <div style={{fontSize:10,color:C.textMuted,marginTop:1}}>{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{padding:"8px 10px",background:C.greenLight,border:`0.5px solid ${C.greenBorder}`,borderRadius:4,fontSize:11,color:C.green,marginBottom:14}}>
            {"✔"} Copying from "Office Staff" — you can fine-tune individual permissions after creation.
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",paddingTop:10,borderTop:`0.5px solid ${C.border}`}}>
            <Btn>Cancel</Btn>
            <Btn primary>{"Create Role →"}</Btn>
          </div>
        </Modal>
      </div>

      <div style={{fontSize:11,fontWeight:700,color:C.textMuted,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:10}}>
        {"↓"} Dialog shown when "Delete Role" is clicked
      </div>
      <div style={{position:"relative",minHeight:280,border:`1.5px dashed ${C.border}`,borderRadius:8,background:C.bgSoft,marginBottom:20}}>
        <div style={{padding:16,opacity:0.25,fontSize:11,color:C.textMuted,textAlign:"center"}}>[ Permission matrix in background ]</div>
        <Modal title="Delete Role — Office Staff" width={420}>
          <div style={{padding:"12px 14px",background:C.redLight,border:`0.5px solid ${C.redBorder}`,borderRadius:6,marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:700,color:C.red,marginBottom:6}}>{"⚠"} This action cannot be undone</div>
            <div style={{fontSize:11,color:C.text}}><strong>2 users</strong> are currently assigned to "Office Staff":</div>
            <div style={{marginTop:8}}>
              {["Priya Sharma · priya@cms.com","Sunita Patel · sunita@cms.com"].map((u,i)=>(
                <div key={i} style={{fontSize:11,padding:"4px 0",borderBottom:`0.5px solid ${C.redBorder}`,color:C.text}}>{u}</div>
              ))}
            </div>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:6,fontWeight:500}}>Reassign affected users to:</div>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden",background:C.white}}>
              {["Production Manager","Production Staff","Manager","Godown Staff"].map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderTop:i>0?`0.5px solid ${C.border}`:"none",cursor:"pointer",background:i===0?C.bgSoft:C.white}}>
                  <div style={{width:16,height:16,borderRadius:"50%",border:`0.5px solid ${i===0?C.black:C.border}`,background:i===0?C.black:C.white,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {i===0&&<div style={{width:6,height:6,borderRadius:"50%",background:C.white}}/>}
                  </div>
                  <span style={{fontSize:12}}>{r}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",paddingTop:10,borderTop:`0.5px solid ${C.border}`}}>
            <Btn>Cancel</Btn>
            <Btn danger>Reassign + Delete Role</Btn>
          </div>
        </Modal>
      </div>
    </Content>
  </WebLayout>
  );
},
// M-G01: Contractor Mobile Login
"M-G01": () => (
  <MobileFrame>
    <div style={{background:"#e65100",padding:"40px 24px 28px",textAlign:"center"}}>
      <div style={{fontSize:26,fontWeight:700,color:"#fff",letterSpacing:2}}>GMMS</div>
      <div style={{fontSize:11,color:"#ffcc80",marginTop:4}}>Contractor Portal</div>
    </div>
    <div style={{padding:20}}>
      <Input label="Mobile Number" placeholder="+91 98250 XXXXX" required/>
      <Input label="PIN" placeholder="••••••" required/>
      <div style={{marginTop:8}}><Btn primary full>Sign In</Btn></div>
      <div style={{textAlign:"center",marginTop:12,fontSize:11,color:C.textMuted}}>PIN sent by CMS admin via SMS</div>
      <div style={{marginTop:16,padding:"10px 12px",background:C.bgSoft,borderRadius:6,border:`0.5px solid ${C.border}`}}>
        <div style={{fontSize:11,color:C.textMuted}}>New contractor? Contact your CMS representative to get access.</div>
      </div>
    </div>
  </MobileFrame>
),
// M-G02: My Challans
"M-G02": () => (
  <MobileFrame>
    <MNav label="My Challans" action="Ramesh K."/>
    <div style={{padding:14}}>
      <div style={{display:"flex",gap:4,marginBottom:12}}>
        {["Pending","Active","Done"].map((t,i)=>(
          <div key={i} style={{flex:1,textAlign:"center",padding:"6px 0",borderRadius:3,fontSize:11,fontWeight:600,background:i===1?"#e65100":"#f5f5f5",color:i===1?"#fff":"#888",border:`0.5px solid ${i===1?"#e65100":"#ddd"}`}}>{t}</div>
        ))}
      </div>
      {[
        {cno:"3210",design:"D-730",name:"Floral Anarkali",pcs:600,stage:"STH",due:"24 May",status:"Active",urgent:true},
        {cno:"3205",design:"D-715",name:"Embr. Dupatta",pcs:200,stage:"EMB",due:"28 May",status:"Active",urgent:false},
        {cno:"3201",design:"D-708",name:"Georgette Suit",pcs:400,stage:"EMB",due:"30 May",status:"Active",urgent:false},
      ].map((r,i)=>(
        <div key={i} style={{background:C.white,border:`0.5px solid ${r.urgent?C.redBorder:C.border}`,borderRadius:6,padding:"10px 12px",marginBottom:8}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <span style={{fontSize:12,fontWeight:700,fontFamily:"monospace",color:"#e65100"}}>#{r.cno}</span>
            {r.urgent&&<span style={{fontSize:9,fontWeight:700,background:C.redLight,color:C.red,padding:"2px 6px",borderRadius:3}}>OVERDUE</span>}
          </div>
          <div style={{fontSize:11,fontWeight:600,marginBottom:2}}>{r.name}</div>
          <div style={{fontSize:10,color:C.textMuted}}>{r.design} · {r.pcs} pcs · {r.stage}</div>
          <div style={{fontSize:10,color:r.urgent?C.red:C.textMuted,marginTop:4}}>Due: {r.due}</div>
          <div style={{marginTop:8,display:"flex",gap:6}}>
            <button style={{flex:1,padding:"6px",background:"#e65100",color:"#fff",border:"none",borderRadius:4,fontSize:11,fontWeight:600,cursor:"pointer"}}>View Details</button>
          </div>
        </div>
      ))}
    </div>
    <MBottomNav active="Challans" type="gmms"/>
  </MobileFrame>
),
// M-G03: Challan Detail (Accept / Reject)
"M-G03": () => (
  <MobileFrame>
    <MNav label="Challan #3210"/>
    <div style={{background:"#e65100",padding:"10px 14px"}}>
      <div style={{fontSize:12,fontWeight:700,color:"#fff"}}>D-730 · Floral Anarkali</div>
      <div style={{fontSize:10,color:"#ffcc80"}}>600 pcs · Stitching · Due 24 May</div>
    </div>
    <div style={{padding:14}}>
      <div style={{background:"#fff3e0",border:`0.5px solid #ffcc80`,borderRadius:6,padding:"8px 12px",marginBottom:10,fontSize:11,color:"#e65100",fontWeight:600}}>
        ⚠ New challan awaiting your acceptance
      </div>
      <Card>
        <SectionLabel>Challan Details</SectionLabel>
        {[["Challan No","#3210"],["Design","D-730"],["Job Type","Stitching"],["Pieces","600"],["Date Issued","07 May 2026"],["Return By","24 May 2026"],["Rate","₹ 45 / piece"]].map(([l,v],i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`0.5px solid ${C.border}`,fontSize:11}}>
            <span style={{color:C.textMuted}}>{l}</span><span style={{fontWeight:500}}>{v}</span>
          </div>
        ))}
      </Card>
      <Card>
        <SectionLabel>Colour Breakdown</SectionLabel>
        {[["Pink",200],["Blue",200],["Cream",200]].map(([c,p],i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:11}}>
            <span>{c}</span><span style={{fontWeight:600}}>{p} pcs</span>
          </div>
        ))}
      </Card>
      <div style={{display:"flex",gap:8,marginTop:4}}>
        <button style={{flex:1,padding:"10px",background:C.green,color:C.white,border:"none",borderRadius:4,fontSize:12,fontWeight:700,cursor:"pointer"}}>✔ Accept</button>
        <button style={{flex:1,padding:"10px",background:C.red,color:C.white,border:"none",borderRadius:4,fontSize:12,fontWeight:700,cursor:"pointer"}}>× Reject</button>
      </div>
    </div>
  </MobileFrame>
),
// M-G04: Confirm Pieces Sent
"M-G04": () => (
  <MobileFrame>
    <MNav label="Confirm Pieces Sent"/>
    <div style={{padding:14}}>
      <div style={{background:"#e65100",borderRadius:6,padding:"10px 14px",marginBottom:12}}>
        <div style={{fontSize:12,fontWeight:700,color:"#fff"}}>Challan #3210</div>
        <div style={{fontSize:10,color:"#ffcc80"}}>D-730 · Stitching · 600 pieces issued</div>
      </div>
      <Card>
        <SectionLabel>Enter Pieces Returned</SectionLabel>
        <div style={{fontSize:11,color:C.textMuted,marginBottom:10}}>Enter count of finished pieces being sent back. Any discrepancy will trigger a dispute.</div>
        {[{col:"Pink",issued:200},{col:"Blue",issued:200},{col:"Cream",issued:200}].map((r,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <div style={{flex:1,fontSize:12}}>{r.col}</div>
            <div style={{fontSize:11,color:C.textMuted}}>of {r.issued}</div>
            <div style={{width:70,border:`0.5px solid ${C.border}`,borderRadius:4,padding:"6px 8px",fontSize:14,fontWeight:700,textAlign:"center",background:C.white}}>{r.issued}</div>
          </div>
        ))}
        <div style={{marginTop:4,padding:"8px 10px",background:C.bgSoft,borderRadius:4,fontSize:11,color:C.textMuted}}>
          Total: <strong>600 / 600 pieces</strong>
        </div>
      </Card>
      <Card>
        <SectionLabel>Notes (Optional)</SectionLabel>
        <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,padding:"8px 10px",fontSize:12,color:C.textLight,minHeight:60}}>Any notes about quality or count...</div>
      </Card>
      <div style={{marginTop:4}}>
        <button style={{width:"100%",padding:"12px",background:"#e65100",color:"#fff",border:"none",borderRadius:6,fontSize:13,fontWeight:700,cursor:"pointer"}}>Confirm & Submit</button>
      </div>
    </div>
  </MobileFrame>
),
// M-G05: My Payment Ledger
"M-G05": () => (
  <MobileFrame>
    <MNav label="My Payment Ledger"/>
    <div style={{background:"#e65100",padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div>
        <div style={{fontSize:11,color:"#ffcc80"}}>Total Earned (May)</div>
        <div style={{fontSize:20,fontWeight:700,color:"#fff"}}>₹ 28,400</div>
      </div>
      <div style={{textAlign:"right"}}>
        <div style={{fontSize:10,color:"#ffcc80"}}>Pending</div>
        <div style={{fontSize:15,fontWeight:600,color:"#fff"}}>₹ 9,200</div>
      </div>
    </div>
    <div style={{padding:14}}>
      {[
        {challan:"3205",design:"D-715",stage:"EMB",pcs:200,amount:"₹ 9,200",date:"12 May",status:"Pending"},
        {challan:"3198",design:"D-688",stage:"EMB",pcs:600,amount:"₹ 19,200",date:"04 May",status:"Paid"},
        {challan:"3185",design:"D-712",stage:"EMB",pcs:600,amount:"₹ 18,000",date:"18 Apr",status:"Paid"},
        {challan:"3171",design:"D-708",stage:"EMB",pcs:400,amount:"₹ 12,400",date:"02 Apr",status:"Paid"},
      ].map((r,i)=>(
        <div key={i} style={{background:C.white,border:`0.5px solid ${C.border}`,borderRadius:6,padding:"10px 12px",marginBottom:8}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <span style={{fontSize:11,fontFamily:"monospace",color:"#e65100",fontWeight:700}}>#{r.challan}</span>
            <span style={{fontSize:12,fontWeight:700,color:r.status==="Paid"?C.green:"#b45309"}}>{r.amount}</span>
          </div>
          <div style={{fontSize:10,color:C.textMuted}}>{r.design} · {r.stage} · {r.pcs} pcs</div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
            <span style={{fontSize:10,color:C.textMuted}}>{r.date}</span>
            <span style={{fontSize:10,fontWeight:600,color:r.status==="Paid"?C.green:"#b45309",background:r.status==="Paid"?C.greenLight:"#fff8e1",padding:"2px 6px",borderRadius:3}}>{r.status}</span>
          </div>
        </div>
      ))}
    </div>
    <MBottomNav active="Payments" type="gmms"/>
  </MobileFrame>
),
"M-G06": () => (
  <MobileFrame>
    <MNav label="My Profile"/>
    <div style={{background:"#e65100",padding:"24px 16px",textAlign:"center"}}>
      <div style={{width:52,height:52,borderRadius:"50%",background:"rgba(255,255,255,0.2)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:700,margin:"0 auto 8px"}}>R</div>
      <div style={{fontSize:14,fontWeight:700,color:"#fff"}}>Ramesh Kadkiya</div>
      <div style={{fontSize:10,color:"#ffcc80"}}>Embroidery · Code C-006</div>
    </div>
    <div style={{padding:14}}>
      <Card>
        <SectionLabel>Personal Details</SectionLabel>
        {[["Mobile","+91 98250-XXXXX"],["City","Surat"],["Joined","12 Jan 2025"],["GSTIN","27ABCDE1234F1Z5"]].map(([l,v],i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`0.5px solid ${C.border}`,fontSize:11}}>
            <span style={{color:C.textMuted}}>{l}</span><span style={{fontWeight:500}}>{v}</span>
          </div>
        ))}
      </Card>
      <Card>
        <SectionLabel>Performance</SectionLabel>
        {[["This Month Jobs","12"],["Completion Rate","96%"],["Avg Turnaround","9.1 days"],["Rejection Rate","1.2%"]].map(([l,v],i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`0.5px solid ${C.border}`,fontSize:11}}>
            <span style={{color:C.textMuted}}>{l}</span><span style={{fontWeight:600,color:l.includes("Rejection")?C.green:l.includes("Rate")&&v==="96%"?C.green:C.text}}>{v}</span>
          </div>
        ))}
      </Card>
      <Card>
        <SectionLabel>Bank Details</SectionLabel>
        <div style={{fontSize:11,color:C.text,marginBottom:4}}>HDFC Bank · Savings</div>
        <div style={{fontSize:11,color:C.textMuted}}>Account: •••• 4521</div>
        <div style={{fontSize:10,color:C.textMuted,marginTop:6}}>Payments credited within 2 business days of confirmation.</div>
      </Card>
      <button style={{width:"100%",padding:"10px",background:"#f5f5f5",border:`0.5px solid ${C.border}`,borderRadius:4,fontSize:12,cursor:"pointer",color:C.textMuted,marginTop:4}}>Sign Out</button>
    </div>
    <MBottomNav active="Profile" type="gmms"/>
  </MobileFrame>
),
};


const screenGroups = [
  {platform:"Sales ERP",icon:"💻",erp:"sales",groups:[
    {label:"Auth",screens:["W-01","W-02"]},
    {label:"Dashboard",screens:["W-03"]},
    {label:"Products",screens:["W-04","W-05","W-06","W-07"]},
    {label:"Inventory",screens:["W-09","W-13"]},
    {label:"Orders",screens:["W-14","W-15","W-16R","W-16W","W-34"]},
    {label:"Dispatch",screens:["W-17","W-18"]},
    {label:"Payments",screens:["W-20","W-12","W-36"]},
    {label:"Reports",screens:["W-23","W-24","W-25","W-26","W-27"]},
    {label:"CCTV",screens:["W-21","W-22"]},
    {label:"SMS",screens:["W-28","W-29"]},
    {label:"Admin",screens:["W-30","W-30A","W-31","W-35","W-32","W-33"]},
    {label:"Challan Print",screens:["W-39"]},
    {label:"Deprecated",screens:["W-10","W-11","W-19"]},
  ]},
  {platform:"Manufacturing ERP - GMMS",icon:"🏭",erp:"mfg",groups:[
    {label:"Dashboard",screens:["G-12"]},
    {label:"Challans",screens:["G-01","G-02","G-03","G-13"]},
    {label:"Contractors",screens:["G-04","G-05"]},
    {label:"Production",screens:["G-06","G-07","G-21"]},
    {label:"RF / Returns",screens:["G-08","G-20"]},
    {label:"Inventory",screens:["G-22"]},
    {label:"Fabric / Mill",screens:["G-09"]},
    {label:"Costing (Owner Only)",screens:["G-10"]},
    {label:"Masters",screens:["G-11","G-14","G-15","G-16","G-17"]},
    {label:"Notifications",screens:["G-18"]},
    {label:"Reports",screens:["G-19"]},
    {label:"Contractor Mobile",screens:["M-G01","M-G02","M-G03","M-G04","M-G05","M-G06"]},
    {label:"Admin",screens:["G-30","G-30A","W-32","W-33"]},
  ]},
  {platform:"Mobile App - Godown (CMS)",icon:"📱",erp:"sales",groups:[
    {label:"Auth & Home",screens:["M-01","M-02"]},
    {label:"Navigation",screens:["M-20"]},
    {label:"Scanning & Inventory",screens:["M-03","M-04","M-05","M-06"]},
    {label:"Order Picking & Dispatch",screens:["M-07","M-08","M-09","M-10","M-11","M-12"]},
    {label:"Create Order",screens:["M-15R","M-15W"]},
    {label:"Wholesale Approvals",screens:["M-16"]},
    {label:"Customer",screens:["M-17"]},
    {label:"CCTV Recording",screens:["M-19"]},
    {label:"Challan Print",screens:["M-18"]},
    {label:"General",screens:["M-13","M-14"]},
  ]},
  {platform:"Public-Facing",icon:"🔗",erp:"sales",groups:[
    {label:"Customer LR View",screens:["P-01"]},
  ]},
];

const screenLabels = {
  "W-01":"Login","W-02":"Forgot Password","W-03":"Main Dashboard",
  "W-04":"SKU List","W-05":"Create / Edit SKU + Rate Entry","W-06":"SKU Detail","W-07":"Label & Barcode Print",
  "W-09":"Live Inventory","W-13":"Stock Alert Center",
  "W-10":"[MERGED] Add Stock \u2192 W-05","W-11":"[REMOVED] Stock Adjustment","W-12":"Credit Control Dashboard",
  "W-14":"Order List","W-15":"Order Detail + Payments",
  "W-16R":"Create Order  -  Retail","W-16W":"Create Order  -  Wholesale",
  "W-34":"Wholesale Approval Queue",
  "W-17":"LR Console","W-18":"LR Detail","W-19":"[REMOVED] Logistics Tracker",
  "W-20":"Payment Records",
  "W-21":"CCTV Console (Record + Library)","W-22":"Video Playback",
  "W-23":"Reports Hub","W-24":"Sales Report","W-25":"Ageing Report","W-26":"Top Designs","W-27":"Customer History",
  "W-28":"SMS Log","W-29":"SMS Templates",
  "W-36":"Daily Reconciliation","W-39":"Challan Print Preview",
  "W-30":"User Management","W-30A":"Role-Based Permissions","W-31":"Customer Master","W-35":"Create / Edit Customer","W-32":"System Settings","W-33":"Audit Trail",
  "M-01":"Login","M-02":"Home Dashboard","M-03":"Barcode Scanner","M-04":"Scan Result","M-05":"Stock In","M-06":"Stock Lookup",
  "M-07":"Order Picking List","M-08":"Order Detail","M-09":"Picking Execution","M-10":"Dispatch Confirmation","M-11":"LR Upload","M-12":"LR Confirmation",
  "M-15R":"Create Order  -  Retail","M-15W":"Create Order  -  Wholesale",
  "M-16":"Wholesale Approvals","M-17":"Create / Edit Customer",
  "M-19":"CCTV Recording","M-18":"Challan Print",
  "M-20":"Slide Navigation Menu",
  "M-13":"Notifications","M-14":"Profile & Settings",
  "P-01":"Customer LR View",
  // GMMS Manufacturing ERP
  "G-12":"Production Dashboard","G-01":"Challan List","G-02":"Create Challan","G-03":"Challan Tracking",
  "G-04":"Contractor List","G-05":"Contractor Detail",
  "G-06":"Ready Piece Count","G-07":"Payment & Checking",
  "G-08":"RF Management","G-09":"Mill / Fabric Management",
  "G-11":"[MOVED] Content moved to G-14",
  "G-13":"Reprocess Challan","G-14":"Design Master","G-15":"Job Work Types","G-16":"Color Master",
  "G-17":"Contractor Registry","G-18":"Notifications Center","G-19":"GMMS Reports Hub",
  "G-20":"Create RF Entry","G-21":"SKU Outward","G-22":"Live Inventory",
  "M-G01":"Contractor Login","M-G02":"My Challans","M-G03":"Challan Detail",
  "M-G04":"Confirm Pieces Sent","M-G05":"My Payment Ledger","M-G06":"My Profile",
  "G-30":"User Management (GMMS)","G-30A":"Role Permissions (GMMS)",
};

const GMMS_IDS = new Set(["G-12","G-01","G-02","G-03","G-13","G-04","G-05","G-06","G-07","G-08","G-09","G-10","G-14","G-15","G-16","G-17","G-18","G-19","G-20","G-21","G-22","G-30","G-30A","M-G01","M-G02","M-G03","M-G04","M-G05","M-G06"]);

export default function App() {
  const [active, setActive] = useState("W-03");
  const [sidebarErp, setSidebarErp] = useState("both"); // "both" | "sales" | "mfg"
  const Screen = screens[active];
  const totalScreens = Object.keys(screens).length;
  const isMfgScreen = GMMS_IDS.has(active);

  const [flowMode, setFlowMode] = useState(false);
  const [activeFlowId, setActiveFlowId] = useState(null);
  const [activeFlowStep, setActiveFlowStep] = useState(0);
  const [showFlowsList, setShowFlowsList] = useState(false);
  const [showFlowDiagram, setShowFlowDiagram] = useState(false);

  const activeFlow = useMemo(() => activeFlowId ? getFlowById(activeFlowId) : null, [activeFlowId]);
  const nav = useMemo(() => activeFlow ? getFlowNavigation(activeFlowId, activeFlowStep) : { prev: null, next: null }, [activeFlowId, activeFlowStep]);
  const screenFlowsList = useMemo(() => getScreenFlows(active), [active]);
  const primaryRole = useMemo(() => { const r = getScreenRole(active); return r ? r[0] : null; }, [active]);

  function handleFlowNavigate(id) { setActive(id); const idx = getStepIndexByScreen(activeFlowId, id); if (idx >= 0) setActiveFlowStep(idx); }
  function handleFlowPrev() { if (nav.prev) handleFlowNavigate(nav.prev.screen); }
  function handleFlowNext() { if (nav.next) handleFlowNavigate(nav.next.screen); }
  function handleStartFlow(fid, sid) { setActiveFlowId(fid); const idx = getStepIndexByScreen(fid, sid); setActiveFlowStep(idx >= 0 ? idx : 0); setFlowMode(true); }

  const visibleGroups = screenGroups.filter(p =>
    sidebarErp === "both" || p.erp === sidebarErp
  );

  return (
    <div style={{fontFamily:"system-ui,-apple-system,sans-serif",display:"flex",height:"100vh",background:C.bgSoft,overflow:"hidden"}}>
      {/* Sidebar */}
      <div style={{width:230,background:C.white,borderRight:`0.5px solid ${C.border}`,overflowY:"auto",flexShrink:0,paddingBottom:20,display:"flex",flexDirection:"column"}}>
        {/* Header with ERP filter + Screens/Flows toggle */}
        <div style={{padding:"12px 14px 10px",borderBottom:`0.5px solid ${C.border}`,flexShrink:0}}>
          <div style={{fontSize:14,fontWeight:700,letterSpacing:0.5,marginBottom:6}}>
            CMS <span style={{color:"#888",fontWeight:400,fontSize:11}}>{"\u00d7"}</span> <span style={{color:CO.accent,fontSize:13}}>GMMS</span>
          </div>
          <div style={{fontSize:9,color:C.textMuted,marginBottom:8}}>Wireframe Explorer {"\u00b7"} {totalScreens} screens</div>
          {/* Views Toggle: Screens | Flows */}
          <div style={{display:"flex",gap:0,marginBottom:6}}>
            {[["screens","Screens"],["flows","Flows"]].map(([v,l],i)=>(
              <div key={i} onClick={()=>setShowFlowsList(v==="flows")} style={{flex:1,textAlign:"center",padding:"4px 0",fontSize:10,fontWeight:600,cursor:"pointer",background:(v==="screens"?true:showFlowsList)?C.black:C.white,color:(v==="screens"?true:showFlowsList)?C.white:C.textMuted,border:`0.5px solid ${C.border}`,borderRight:i===0?0:"none",borderRadius:v==="screens"?"4px 0 0 4px":"0 4px 4px 0"}}>{l}</div>
            ))}
          </div>
          {/* ERP Toggle Filter (Screens view only) */}
          {!showFlowsList && (
            <div style={{display:"flex",border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden"}}>
              {[["both","All"],["sales","Sales"],["mfg","Mfg"]].map(([v,l],i)=>(
                <div key={i} onClick={()=>setSidebarErp(v)} style={{flex:1,textAlign:"center",padding:"4px 0",fontSize:10,fontWeight:600,cursor:"pointer",background:sidebarErp===v?C.black:C.white,color:sidebarErp===v?C.white:C.textMuted,borderRight:i<2?`0.5px solid ${C.border}`:"none"}}>{l}</div>
              ))}
            </div>
          )}
        </div>
        {/* Screens or Flows view */}
        {!showFlowsList ? (
          /* Screens view */
          <div style={{flex:1,overflowY:"auto"}}>
            {visibleGroups.map((platform,pi)=>(
              <div key={pi}>
                <div style={{padding:"8px 14px 3px",fontSize:9,fontWeight:700,color:platform.erp==="mfg"?CO.accent:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",borderBottom:`0.5px solid ${C.border}`,background:platform.erp==="mfg"?"#fef9f5":C.white}}>
                  {platform.icon} {platform.platform}
                </div>
                {platform.groups.map((group,gi)=>(
                  <div key={gi}>
                    <div style={{padding:"5px 14px 2px",fontSize:9,fontWeight:700,color:group.label.includes("Deprecated")?C.red:group.label.includes("Owner")?CO.accent:C.textLight,letterSpacing:"0.05em",textTransform:"uppercase"}}>{group.label}</div>
                    {group.screens.map((id)=>{
                      const isDeprecated = (screenLabels[id] || "").startsWith("[");
                      const isOwnerOnly = id==="G-10";
                      const isMfg = GMMS_IDS.has(id);
                      return (
                        <div key={id} onClick={()=>setActive(id)} style={{display:"flex",alignItems:"center",gap:7,padding:"5px 14px",cursor:"pointer",background:active===id?(isMfg?CO.accent:C.black):"transparent",color:active===id?C.white:isDeprecated?C.red:isOwnerOnly?CO.accent:C.textMuted,fontSize:11,borderLeft:active===id?`2px solid ${isMfg?CO.accentBorder:C.red}`:"2px solid transparent",transition:"background 0.1s",opacity:isDeprecated&&active!==id?0.55:1}}>
                          <span style={{fontSize:9,opacity:0.6,fontFamily:"monospace",flexShrink:0}}>{id}</span>
                          <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{screenLabels[id]}</span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          /* Flows view */
          <div style={{flex:1,overflowY:"auto"}}>
            {[["sales","Sales ERP"],["mfg","Manufacturing ERP"],["cross","Cross-ERP"]].map(([erp,label])=> {
              const ef = FLOWS.filter(f => f.erp === erp);
              const ec = ERP_COLORS[erp] || { accent: C.textMuted, light: C.bgSoft, border: C.border };
              if (ef.length === 0) return null;
              return (
                <div key={erp}>
                  <div style={{padding:"8px 14px 3px",fontSize:9,fontWeight:700,color:ec.accent,letterSpacing:"0.08em",textTransform:"uppercase",borderBottom:`0.5px solid ${C.border}`,background:erp==="mfg"?"#fef9f5":ec.light}}>
                    {label}
                  </div>
                  {ef.map((flow)=>(
                    <div key={flow.id} onClick={()=>{ setActiveFlowId(flow.id); setActiveFlowStep(0); setFlowMode(true); setActive(flow.steps[0].screen); setShowFlowsList(false); }} style={{display:"flex",flexDirection:"column",gap:2,padding:"7px 14px",cursor:"pointer",background:activeFlowId===flow.id&&flowMode?ec.light:"transparent",borderLeft:activeFlowId===flow.id&&flowMode?`2px solid ${ec.accent}`:"2px solid transparent"}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <span style={{fontSize:12,fontWeight:600,color:flowMode&&activeFlowId===flow.id?ec.accent:C.text,flex:1}}>{flow.name}</span>
                        <span style={{fontSize:9,color:C.textMuted,fontFamily:"monospace"}}>{flow.steps.length} steps</span>
                      </div>
                      <div style={{fontSize:9,color:C.textMuted}}>{flow.description}</div>
                      <div style={{display:"flex",gap:3,marginTop:2,flexWrap:"wrap"}}>
                        {[...new Set(flow.steps.filter(s=>s.screen).map(s=>s.screen))].slice(0,5).map(sid=>(
                          <span key={sid} style={{fontSize:8,fontFamily:"monospace",color:C.textMuted,padding:"1px 4px",background:C.bgSoft,borderRadius:2,border:`0.5px solid ${C.border}`}}>{sid}</span>
                        ))}
                        {flow.steps.length > 5 && <span style={{fontSize:8,color:C.textMuted}}>+{flow.steps.length-5}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{flex:1,overflowY:"auto",padding:24}}>
        {flowMode && activeFlow && (
          <FlowBar flow={activeFlow} currentStep={activeFlow.steps[activeFlowStep]} stepIndex={activeFlowStep} totalSteps={activeFlow.steps.length} onPrev={handleFlowPrev} onNext={handleFlowNext} onDiagram={()=>setShowFlowDiagram(true)} onExit={()=>{ setFlowMode(false); setShowFlowsList(true); }} />
        )}
        <div style={{marginBottom:14,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
          <div style={{fontSize:11,fontFamily:"monospace",fontWeight:700,padding:"2px 8px",borderRadius:3,background:isMfgScreen?CO.accentLight:C.redLight,color:isMfgScreen?CO.accent:C.red,border:`0.5px solid ${isMfgScreen?CO.accentBorder:C.redBorder}`}}>{active}</div>
          <div style={{fontSize:15,fontWeight:600}}>{screenLabels[active]}</div>
          {primaryRole && <RoleBadge role={primaryRole} />}
          {screenFlowsList.slice(0,3).map(f => (
            <FlowTag key={f.id} flowId={f.id} flowName={f.name} erp={f.erp} active={flowMode && activeFlowId===f.id} onClick={()=>handleStartFlow(f.id, active)} />
          ))}
          <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
            <span style={{fontSize:10,padding:"2px 8px",borderRadius:3,fontWeight:600,border:`0.5px solid ${isMfgScreen?CO.accentBorder:C.border}`,color:isMfgScreen?CO.accent:C.textMuted,background:isMfgScreen?CO.accentLight:C.bgSoft}}>
              {isMfgScreen?"Manufacturing ERP":active.startsWith("M")?"Mobile App":active.startsWith("P")?"Public":"Sales ERP"}
            </span>
            <span style={{fontSize:10,color:C.textMuted}}>v4.0 {"\u00b7"} {totalScreens} screens</span>
          </div>
        </div>
        {Screen ? <Screen onNavigate={setActive}/> : <div style={{padding:40,textAlign:"center",color:C.textMuted}}>Screen not found</div>}
        {flowMode && activeFlow && (
          <FlowNavButtons screenId={active} prevStep={nav?.prev} nextStep={nav?.next} onNavigate={(id)=>{ handleFlowNavigate(id); }} onStartFlow={(fid, sid)=>{ handleStartFlow(fid, sid); }} />
        )}
      </div>
      {showFlowDiagram && activeFlow && (
        <FlowDiagram flow={activeFlow} currentStepIndex={activeFlowStep} onNavigate={(id)=>{ handleFlowNavigate(id); }} onClose={()=>setShowFlowDiagram(false)} />
      )}
    </div>
  );
}
