import { useState } from "react";

const C = {
  bgSoft: "#f5f5f5", text: "#111111", textMuted: "#666666", textLight: "#999999",
  border: "#e0e0e0", red: "#c0392b", redLight: "#fdf0ef", redBorder: "#e8b4b0",
  black: "#111111", white: "#ffffff", green: "#1a7a4a", greenLight: "#edf7f1", greenBorder: "#a8d5bc",
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

const Tabs = ({tabs,active}) => (
  <div style={{display:"flex",borderBottom:`0.5px solid ${C.border}`,marginBottom:14,background:C.white}}>
    {tabs.map((t,i)=>(
      <div key={i} style={{padding:"10px 16px",fontSize:12,fontWeight:600,color:active===t?C.black:C.textMuted,borderBottom:active===t?`2px solid ${C.black}`:"2px solid transparent",cursor:"pointer"}}>{t}</div>
    ))}
  </div>
);

const SectionLabel = ({children}) => (
  <div style={{fontSize:10,fontWeight:700,color:C.textMuted,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:8,marginTop:4}}>{children}</div>
);

const MobileFrame = ({children,menuOpen}) => (
  <div style={{width:300,margin:"0 auto",border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden",background:C.bgSoft,boxShadow:"0 2px 12px rgba(0,0,0,0.08)",position:"relative"}}>
    <div style={{background:C.black,color:C.white,padding:"8px 16px",display:"flex",justifyContent:"space-between",fontSize:10}}>
      <span>9:41</span><span>â—â—â—</span>
    </div>
    <div style={{background:C.white,minHeight:520,overflowY:"auto"}}>{children}</div>
    {menuOpen&&<MSlideMenu/>}
  </div>
);

const MNav = ({label,action}) => (
  <div style={{background:C.black,color:C.white,padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
    <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:16}}>â†</span><span style={{fontSize:13,fontWeight:600}}>{label}</span></div>
    {action&&<span style={{fontSize:11,color:"#aaa"}}>{action}</span>}
  </div>
);

const MBottomNav = ({active}) => {
  const items=[{icon:"âŠž",label:"Home"},{icon:"âŠ™",label:"Scan"},{icon:"â—‰",label:"Orders"},{icon:"â˜°",label:"Menu"},{icon:"ðŸ‘¤",label:"Profile"}];
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

// Sliding drawer menu shown when â˜° Menu is tapped
const MSlideMenu = ({active}) => {
  const sections = [
    {label:"Main",items:[{icon:"âŠž",label:"Home"},{icon:"âŠ™",label:"Scan"},{icon:"â—‰",label:"Orders"}]},
    {label:"Create Order",items:[{icon:"ðŸª",label:"New Retail Order"},{icon:"ðŸ­",label:"New Wholesale Order"}]},
    {label:"Dispatch",items:[{icon:"âŠ",label:"Picking List"},{icon:"âœ“",label:"Dispatch Confirm"},{icon:"ðŸ“„",label:"LR Upload"}]},
    {label:"Inventory",items:[{icon:"â˜°",label:"Stock Lookup"},{icon:"+",label:"Stock In"}]},
    {label:"CCTV",items:[{icon:"â—ˆ",label:"CCTV Recording"}]},
    {label:"Other",items:[{icon:"ðŸ””",label:"Notifications"},{icon:"ðŸ‘¤",label:"Profile & Settings"}]},
  ];
  return(
    <div style={{position:"absolute",top:0,right:0,bottom:0,width:"75%",background:C.white,borderLeft:`0.5px solid ${C.border}`,zIndex:10,overflowY:"auto"}}>
      <div style={{background:C.black,padding:"16px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style={{color:C.white,fontSize:13,fontWeight:700}}><span style={{color:C.red}}>HOOR</span> TEX</div><div style={{color:"#888",fontSize:10,marginTop:2}}>Godown App</div></div>
        <span style={{color:"#888",fontSize:18}}>âœ•</span>
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

// â”€â”€â”€ Sales ERP sidebar (Hoor Tex) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SALES_MENU=[
  {icon:"âŠž",label:"Dashboard",screens:[{id:"W-03",label:"Main Dashboard"}]},
  {icon:"â—«",label:"Products",screens:[{id:"W-04",label:"SKU List"},{id:"W-05",label:"Create / Edit SKU"},{id:"W-06",label:"SKU Detail"},{id:"W-07",label:"Label & Barcode Print"}]},
  {icon:"â˜°",label:"Inventory",screens:[{id:"W-09",label:"Live Inventory"},{id:"W-13",label:"Stock Alert Center"}]},
  {icon:"â—‰",label:"Orders",screens:[{id:"W-14",label:"Order List"},{id:"W-15",label:"Order Detail"},{id:"W-16R",label:"Create Order â€” Retail"},{id:"W-16W",label:"Create Order â€” Wholesale"},{id:"W-34",label:"Wholesale Queue"}]},
  {icon:"âŠ",label:"Dispatch",screens:[{id:"W-17",label:"LR Console"},{id:"W-18",label:"LR Detail"}]},
  {icon:"â‚¹",label:"Payments",screens:[{id:"W-20",label:"Payment Records"}]},
  {icon:"â—ˆ",label:"CCTV",screens:[{id:"W-21",label:"CCTV Console"},{id:"W-22",label:"Video Playback"}]},
  {icon:"âŠ¡",label:"Reports",screens:[{id:"W-23",label:"Reports Hub"},{id:"W-24",label:"Sales Report"},{id:"W-25",label:"Ageing Report"},{id:"W-26",label:"Top Designs"},{id:"W-27",label:"Customer History"}]},
  {icon:"âœ‰",label:"SMS",screens:[{id:"W-28",label:"SMS Log"},{id:"W-29",label:"SMS Templates"}]},
  {icon:"ðŸ“Š",label:"Daily Ops",screens:[{id:"W-36",label:"Daily Reconciliation"},{id:"W-39",label:"Challan Print Preview"}]},
  {icon:"âš™",label:"Admin",screens:[{id:"W-30",label:"User Management"},{id:"W-30A",label:"Role Permissions"},{id:"W-31",label:"Customer Master"},{id:"W-35",label:"Edit Customer"},{id:"W-32",label:"System Settings"},{id:"W-33",label:"Audit Trail"}]},
];

// â”€â”€â”€ Manufacturing ERP sidebar (GMMS) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const MFG_MENU=[
  {icon:"âŠž",label:"Dashboard",screens:[{id:"G-12",label:"Production Dashboard"}]},
  {icon:"ðŸ“‹",label:"Challans",screens:[{id:"G-01",label:"Challan List"},{id:"G-02",label:"Create Challan"},{id:"G-03",label:"Challan Tracking"}]},
  {icon:"ðŸ‘·",label:"Contractors",screens:[{id:"G-04",label:"Contractor List"},{id:"G-05",label:"Contractor Detail"}]},
  {icon:"âœ“",label:"Production",screens:[{id:"G-06",label:"Ready Piece Count"},{id:"G-07",label:"Payment & Checking"}]},
  {icon:"â†©",label:"RF / Returns",screens:[{id:"G-08",label:"RF Management"}]},
  {icon:"ðŸ§µ",label:"Fabric / Mill",screens:[{id:"G-09",label:"Mill Fabric Tracking"}]},
  {icon:"â‚¹",label:"Costing",screens:[{id:"G-10",label:"Design Costing (Owner Only)"}]},
  {icon:"ðŸŽ¨",label:"Designs",screens:[{id:"G-11",label:"Design Management"}]},
  {icon:"âš™",label:"Admin",screens:[{id:"W-30",label:"User Management"},{id:"W-32",label:"System Settings"},{id:"W-33",label:"Audit Trail"}]},
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
                {m.screens&&<span style={{marginLeft:"auto",fontSize:9,color:"#444"}}>{isActive?"â–¾":"â–¸"}</span>}
              </div>
              {isActive&&m.screens&&m.screens.map((s,si)=>(
                <div key={si} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 10px 5px 28px",color:"#777",fontSize:10,cursor:"pointer"}}>
                  <span style={{color:"#333",fontSize:8}}>â—‹</span>
                  <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.label}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <div style={{padding:"8px 12px",color:"#444",fontSize:10,borderTop:"0.5px solid #222",flexShrink:0}}>
        <span style={{color:"#666"}}>{user}</span> Â· Super Admin
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
        logo={isMfg?"GMMS":"HOOR TEX"}
        subtitle={isMfg?"Manufacturing ERP Â· Mohammad Ali":"Sales ERP Â· Abdul Kadir"}
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

// Manufacturing ERP TopBar â€” orange accent
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
        <span style={{fontSize:18,color:C.textMuted,cursor:"pointer",lineHeight:1}}>âœ•</span>
      </div>
      <div style={{padding:"16px 18px",overflowY:"auto"}}>{children}</div>
    </div>
  </div>
);



// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// AUTH
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

const screens = {

"W-01": () => (
  <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:540,background:C.bgSoft}}>
    <div style={{width:320,background:C.white,border:`0.5px solid ${C.border}`,borderRadius:8,padding:32}}>
      <div style={{textAlign:"center",marginBottom:24}}>
        <div style={{fontSize:26,fontWeight:700,letterSpacing:2}}><span style={{color:C.red}}>HOOR</span> TEX</div>
        <div style={{fontSize:11,color:C.textMuted,marginTop:4}}>Wholesale Garment Distribution â€” Surat</div>
      </div>
      <Input label="Email / Username" placeholder="admin@hoortex.com" required />
      <Input label="Password" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" required />
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <label style={{fontSize:11,color:C.textMuted,display:"flex",alignItems:"center",gap:5}}><input type="checkbox"/> Remember me</label>
        <span style={{fontSize:11,color:C.red,cursor:"pointer"}}>Forgot password?</span>
      </div>
      <Btn primary full>Sign In</Btn>
      <Divider/>
      <div style={{fontSize:10,color:C.textMuted,background:C.bgSoft,padding:"8px 10px",borderRadius:4,border:`0.5px solid ${C.border}`}}>
        Roles: Admin Â· Manager Â· Office Staff Â· Godown Staff
      </div>
    </div>
  </div>
),

"W-02": () => (
  <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:540,background:C.bgSoft}}>
    <div style={{width:320,background:C.white,border:`0.5px solid ${C.border}`,borderRadius:8,padding:32}}>
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{fontSize:22,fontWeight:700}}><span style={{color:C.red}}>HOOR</span> TEX</div>
        <div style={{fontSize:13,fontWeight:600,marginTop:10}}>Reset Password</div>
        <div style={{fontSize:11,color:C.textMuted,marginTop:4}}>Enter your registered email to receive a reset link</div>
      </div>
      <Input label="Registered Email" placeholder="admin@hoortex.com" required />
      <Btn primary full>Send Reset Link</Btn>
      <div style={{textAlign:"center",marginTop:12,fontSize:11}}>
        <span style={{color:C.textMuted}}>â† Back to </span><span style={{color:C.red,cursor:"pointer"}}>Sign In</span>
      </div>
      <Card red style={{marginTop:14}}>
        <div style={{fontSize:11,color:C.red,fontWeight:600}}>Reset link valid for 30 minutes</div>
        <div style={{fontSize:10,color:C.textMuted,marginTop:2}}>Check your spam folder if not received</div>
      </Card>
    </div>
  </div>
),

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// DASHBOARD
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

"W-03": () => {
  const [erpMode, setErpMode] = useState("Sales ERP");
  return (
  <WebLayout activeMenu="Dashboard">
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 16px",borderBottom:`0.5px solid ${C.border}`,background:C.white}}>
      <div><div style={{fontSize:14,fontWeight:600}}>Main Dashboard</div><div style={{fontSize:10,color:C.textMuted,marginTop:1}}>04 Apr 2026 Â· Live</div></div>
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
        âš™ Manufacturing ERP mode â€” showing production, BOM, and work order dashboards
      </div>
    )}
    <Content>
      <div style={{display:"flex",gap:10,marginBottom:14}}>
        <Metric label="Pending Orders" value="24" sub="3 wholesale pending approval" alert/>
        <Metric label="Today Dispatches" value="18" sub="â†‘ 12% vs yesterday"/>
        <Metric label="Low Stock SKUs" value="7" sub="Below threshold" alert/>
        <Metric label="Unconfirmed Payments" value="â‚¹1.2L" sub="6 orders unpaid" alert/>
        <Metric label="Today Collections" value="â‚¹84,200" sub="Cash â‚¹32k Â· UPI â‚¹52k" green/>
      </div>
      <div style={{display:"flex",gap:12,marginBottom:12}}>
        <div style={{flex:2}}>
          <Card>
            <div style={{fontSize:12,fontWeight:600,marginBottom:10}}>Top-Selling Designs â€” April 2026</div>
            {[["Floral Anarkali",340,"â‚¹1.36L"],["Solid Kurti",280,"â‚¹84k"],["Block Print Salwar",210,"â‚¹63k"],["Embr. Dupatta",190,"â‚¹95k"]].map(([name,units,rev],i)=>(
              <div key={i} style={{marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:3}}><span><strong>#{i+1}</strong> {name}</span><span style={{color:C.textMuted}}>{units} pcs Â· {rev}</span></div>
                <div style={{height:6,background:C.bgSoft,borderRadius:3}}><div style={{height:6,background:C.black,borderRadius:3,width:`${(units/340)*100}%`,opacity:0.9-i*0.15}}/></div>
              </div>
            ))}
          </Card>
        </div>
        <div style={{flex:1}}>
          <Card>
            <div style={{fontSize:12,fontWeight:600,marginBottom:8}}>Recent Activity</div>
            {[
              {t:"Order #1042 dispatched â€” Suresh Fabrics",time:"2m ago"},
              {t:"LR uploaded â€” Challan CH-881",time:"15m ago"},
              {t:"Payment â‚¹7,800 confirmed #1039",time:"32m ago"},
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
          <div style={{fontSize:11,fontWeight:600,color:C.red,marginBottom:6}}>âš  Stock Alerts</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {["HT-002-BLU-L (4 pcs)","HT-005-GRN-M (2 pcs)","HT-007-PNK-XL (1 pc)"].map((s,i)=>(
              <span key={i} style={{fontSize:11,color:C.red,background:C.white,border:`0.5px solid ${C.redBorder}`,padding:"2px 8px",borderRadius:3}}>{s}</span>
            ))}
          </div>
        </Card>
        <Card red style={{flex:1}}>
          <div style={{fontSize:11,fontWeight:600,color:C.red,marginBottom:6}}>âš  Credit Due â€” Outstanding Payments</div>
          {[["Deepak Wholesale","â‚¹32,800","Overdue 3 days â€” limit exceeded"],["Ramesh Traders","â‚¹8,400","Due tomorrow"]].map(([name,amt,status],i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:11,padding:"4px 0",borderBottom:`0.5px solid ${C.redBorder}`}}>
              <span>{name}</span><span style={{color:C.red,fontWeight:600,fontSize:10}}>{amt} Â· {status}</span>
            </div>
          ))}
          <div style={{marginTop:6,fontSize:10,color:C.textMuted}}>Click to open Payment Records â†’</div>
        </Card>
      </div>
    </Content>
  </WebLayout>
  );
},

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// PRODUCTS & SKU
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

"W-04": () => (
  <WebLayout activeMenu="Products">
    <TopBar title="SKU List" actions={[{label:"+ Add SKU",primary:true},{label:"Print Labels"}]}/>
    <Content>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <div style={{flex:1,border:`0.5px solid ${C.border}`,borderRadius:4,padding:"7px 10px",fontSize:12,color:C.textLight,background:C.white}}>Search by design name, SKU code...</div>
        <Btn small>Category â–¾</Btn><Btn small>Stock Status â–¾</Btn>
      </div>
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,overflow:"hidden",background:C.white}}>
        <TH cols={[{v:"Thumb",w:0.4},{v:"Design Name"},{v:"SKU Code"},{v:"SKU Count"},{v:"Retail â‚¹"},{v:"Wholesale â‚¹"},{v:"Stock Qty"},{v:"Media"},{v:"Actions",w:1.4}]}/>
        {[
          {name:"Floral Anarkali",sku:"HT-001",var:20,ret:"â‚¹850",ws:"â‚¹720",stock:184,imgs:3,vids:1,out:false},
          {name:"Solid Kurti",sku:"HT-002",var:12,ret:"â‚¹420",ws:"â‚¹350",stock:62,imgs:2,vids:0,out:false},
          {name:"Block Print Salwar",sku:"HT-003",var:16,ret:"â‚¹680",ws:"â‚¹580",stock:0,imgs:4,vids:2,out:true},
        ].map((r,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 10px",borderBottom:`0.5px solid ${C.border}`,background:r.out?C.redLight:C.white}}>
            <div style={{flex:0.4,width:32,height:32,background:C.bgSoft,borderRadius:3,border:`0.5px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:C.textLight}}>IMG</div>
            <div style={{flex:1,fontSize:12,fontWeight:500}}>{r.name}</div>
            <div style={{flex:1,fontSize:11,color:C.textMuted,fontFamily:"monospace"}}>{r.sku}</div>
            <div style={{flex:1,fontSize:11,color:C.textMuted}}>{r.var} SKUs</div>
            <div style={{flex:0.8,fontSize:12,fontWeight:500}}>{r.ret}</div>
            <div style={{flex:0.8,fontSize:12,fontWeight:500,color:C.textMuted}}>{r.ws}</div>
            <div style={{flex:0.8,fontSize:12,fontWeight:600,color:r.out?C.red:C.text}}>{r.out?"Out":r.stock+" pcs"}</div>
            <div style={{flex:0.8,fontSize:11,color:C.textMuted}}>ðŸ“·{r.imgs} ðŸŽ¥{r.vids}</div>
            <div style={{flex:1.4,display:"flex",gap:5}}><Btn small>View</Btn><Btn small>Edit</Btn><Btn small>Print</Btn></div>
          </div>
        ))}
      </div>
    </Content>
  </WebLayout>
),

"W-05": () => (
  <WebLayout activeMenu="Products">
    <TopBar title="Create / Edit SKU" sub="Creating new SKU and stock in one flow" actions={[{label:"Save SKU",primary:true},{label:"Save & Print Labels"},{label:"Cancel"}]}/>
    <Content>
      <div style={{display:"flex",gap:12}}>
        <div style={{flex:2}}>
          <Card>
            <SectionLabel>Design Information</SectionLabel>
            <Input label="Design Name" placeholder="e.g. Floral Anarkali Set" required/>
            <div style={{display:"flex",gap:10}}>
              <div style={{flex:1}}><Input label="SKU Code (auto)" placeholder="HT-001" mono/></div>
            </div>
          </Card>
          <Card>
            <SectionLabel>Pricing</SectionLabel>
            <div style={{display:"flex",gap:10}}>
              <div style={{flex:1}}>
                <Input label="Retail Price (â‚¹)" placeholder="850.00" required note="Shown on retail orders"/>
              </div>
              <div style={{flex:1}}>
                <Input label="Wholesale Price (â‚¹)" placeholder="720.00" required note="Shown on wholesale orders"/>
              </div>
            </div>
          </Card>
          {/* MERGED: Stock entry grid â€” price-tag style with editable rate per row */}
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <SectionLabel>Stock Entry â€” Add Quantities & Rate per SKU</SectionLabel>
              <div style={{fontSize:10,color:C.textMuted}}>Enter qty 0 to skip</div>
            </div>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden",marginBottom:10}}>
              <div style={{display:"flex",background:C.bgSoft,padding:"6px 10px",fontSize:10,fontWeight:700,color:C.textMuted,gap:6}}>
                <div style={{flex:0.4,width:28}}>IMG</div>
                <div style={{flex:1.2}}>SKU</div>
                <div style={{flex:0.8}}>Colour</div>
                <div style={{flex:0.5}}>Size</div>
                <div style={{flex:0.6}}>Qty</div>
                <div style={{flex:0.9}}>Rate â‚¹</div>
              </div>
              {[
                {sku:"HT-001-RED-M",col:"Red",sz:"M",qty:24,rate:"850"},
                {sku:"HT-001-RED-L",col:"Red",sz:"L",qty:18,rate:"850"},
                {sku:"HT-001-BLU-M",col:"Blue",sz:"M",qty:12,rate:"790"},
                {sku:"HT-001-BLU-L",col:"Blue",sz:"L",qty:0,rate:"790"},
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",borderTop:`0.5px solid ${C.border}`,fontSize:11,background:r.qty===0?C.bgSoft:C.white}}>
                  <div style={{flex:0.4,width:28,height:28,background:C.bgSoft,borderRadius:3,border:`0.5px solid ${C.border}`,flexShrink:0}}/>
                  <div style={{flex:1.2,fontFamily:"monospace",fontSize:10,color:C.textMuted}}>{r.sku}</div>
                  <div style={{flex:0.8}}>{r.col}</div>
                  <div style={{flex:0.5}}>{r.sz}</div>
                  <div style={{flex:0.6,border:`0.5px solid ${C.border}`,borderRadius:3,padding:"3px 6px",background:C.white,fontWeight:r.qty>0?600:400,color:r.qty>0?C.text:C.textLight}}>{r.qty>0?r.qty:"0"}</div>
                  {/* Editable rate cell â€” price-tag style */}
                  <div style={{flex:0.9,display:"flex",alignItems:"center",gap:3}}>
                    <span style={{fontSize:10,color:C.textMuted,flexShrink:0}}>â‚¹</span>
                    <div style={{flex:1,border:`0.5px solid ${C.border}`,borderRadius:3,padding:"3px 6px",background:C.white,fontSize:11,fontWeight:600,color:C.text,display:"flex",alignItems:"center",gap:4}}>
                      {r.rate}
                      <span style={{fontSize:9,color:C.textLight,marginLeft:"auto"}}>âœŽ</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{padding:"8px 10px",background:C.bgSoft,borderRadius:4,border:`0.5px solid ${C.border}`,fontSize:11,color:C.textMuted}}>
              â„¹ Rate can be set per SKU row. Click the rate cell to change the cost price for that colour/size.
            </div>
          </Card>
        </div>
        <div style={{flex:1}}>
          <Card>
            <SectionLabel>Design Images</SectionLabel>
            <div style={{height:90,border:`1.5px dashed ${C.border}`,borderRadius:6,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:C.textLight,fontSize:11,marginBottom:8}}>
              <div style={{fontSize:20,marginBottom:4}}>â†‘</div>Upload images (multiple)
            </div>
            <div style={{display:"flex",gap:6,marginBottom:6}}>
              {[1,2,3].map(n=>(
                <div key={n} style={{width:52,height:52,background:C.bgSoft,borderRadius:4,border:`0.5px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:C.textLight,position:"relative"}}>
                  IMG {n}
                  <span style={{position:"absolute",top:-4,right:-4,width:14,height:14,background:C.red,color:C.white,borderRadius:"50%",fontSize:9,display:"flex",alignItems:"center",justifyContent:"center"}}>âœ•</span>
                </div>
              ))}
              <div style={{width:52,height:52,border:`1.5px dashed ${C.border}`,borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:C.textLight}}>+</div>
            </div>
          </Card>
          <Card>
            <SectionLabel>Product Videos</SectionLabel>
            <div style={{height:70,border:`1.5px dashed ${C.border}`,borderRadius:6,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:C.textLight,fontSize:11,marginBottom:8}}>
              <div style={{fontSize:18,marginBottom:4}}>ðŸŽ¥</div>Upload videos (MP4, max 50MB)
            </div>
          </Card>
          <Card>
            <SectionLabel>Barcode Preview</SectionLabel>
            <div style={{height:50,background:C.bgSoft,borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:6}}>
              <span style={{fontSize:9,color:C.textMuted,letterSpacing:2}}>||||| HT-001 |||||</span>
            </div>
            <div style={{fontSize:10,color:C.textMuted}}>Parent SKU label â€” 1 per design</div>
          </Card>
          <Card>
            <SectionLabel>Print Options</SectionLabel>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:8}}>After saving, you can print child SKU labels for stock just entered.</div>
            <label style={{display:"flex",alignItems:"center",gap:8,fontSize:12,marginBottom:6}}><input type="checkbox" defaultChecked/> Print Child SKU labels after save</label>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,padding:"8px 10px",background:C.bgSoft,fontSize:11,marginBottom:8}}>
              <div>Will print: <strong>54 labels</strong> (qty-wise)</div>
              <div style={{color:C.textMuted,fontSize:10}}>Prints in proportion to qty entered</div>
            </div>
            <Btn primary full>Save SKU + Print Labels</Btn>
            <div style={{marginTop:6}}><Btn full>Save Only</Btn></div>
          </Card>
        </div>
      </div>
    </Content>
  </WebLayout>
),

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
  return (
  <WebLayout activeMenu="Products">
    <TopBar title="SKU Detail â€” Floral Anarkali" actions={[{label:"Edit SKU"}]}/>
    {/* Print Labels button wired to open dialog */}
    <div style={{position:"relative"}}>
      <div style={{padding:"8px 16px",borderBottom:`0.5px solid ${C.border}`,background:C.white,display:"flex",justifyContent:"flex-end"}}>
        <button onClick={()=>setShowPrintDialog(true)} style={{padding:"8px 16px",borderRadius:4,fontSize:12,fontWeight:600,border:`0.5px solid ${C.black}`,background:C.black,color:C.white,cursor:"pointer"}}>ðŸ· Print Labels</button>
      </div>
      {showPrintDialog&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50}}>
          <div style={{width:500,background:C.white,borderRadius:8,boxShadow:"0 8px 32px rgba(0,0,0,0.2)",overflow:"hidden",maxHeight:"80vh",display:"flex",flexDirection:"column"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 18px",borderBottom:`0.5px solid ${C.border}`,background:C.white,flexShrink:0}}>
              <div style={{fontSize:14,fontWeight:700}}>ðŸ· Print Labels â€” Select SKUs</div>
              <span onClick={()=>setShowPrintDialog(false)} style={{fontSize:18,color:C.textMuted,cursor:"pointer",lineHeight:1}}>âœ•</span>
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
                <Btn primary>ðŸ–¨ Print {totalLabels} Labels</Btn>
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
              <span style={{fontSize:9,color:"#888"}}>â–¶ Video 1</span>
            </div>
          </Card>
          <Card>
            <FR label="SKU" value="HT-001" bold/>
            <FR label="Retail" value="â‚¹850" bold/>
            <FR label="Wholesale" value="â‚¹720"/>
            <FR label="Total Stock" value="184 pcs"/>
          </Card>
        </div>
        <div style={{flex:1}}>
          <Card>
            <div style={{fontSize:12,fontWeight:600,marginBottom:10}}>Stock Matrix â€” Colour Ã— Size</div>
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
                <div style={{fontSize:12,fontWeight:500}}>HT-001 â€” Floral Anarkali</div>
                <div style={{fontSize:11,color:C.textMuted}}>Georgette | Anarkali | 20 variants</div>
              </div>
              <div style={{fontSize:11,color:C.textMuted,padding:"6px 8px",background:C.bgSoft,borderRadius:4}}>
                â„¹ Parent label: 1 per design Â· hangs in showroom for scanning reference
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
                <div style={{fontSize:10,color:C.textMuted}}>HT-001-RED-M Ã— 48 pieces | Size: 38Ã—22mm</div>
              </div>
            </Card>
          </div>
          <div style={{flex:1}}>
            <Card>
              <SectionLabel>Label Preview â€” Parent (50Ã—30mm)</SectionLabel>
              <div style={{border:`1.5px dashed ${C.border}`,borderRadius:6,padding:16,textAlign:"center",background:C.bgSoft,marginBottom:10}}>
                <div style={{fontSize:14,fontWeight:700,letterSpacing:"0.1em"}}>FLORAL ANARKALI</div>
                <div style={{fontSize:11,color:C.textMuted,marginBottom:8}}>Georgette | Anarkali | HT-001</div>
                <div style={{height:45,background:C.white,border:`0.5px solid ${C.border}`,borderRadius:3,margin:"0 20px",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontSize:8,color:C.textLight,letterSpacing:3}}>||||||||||| HT-001 |||||||||||</span>
                </div>
                <div style={{fontSize:10,fontWeight:600,marginTop:6,fontFamily:"monospace"}}>HT-001</div>
                <div style={{fontSize:9,color:C.textMuted}}>Hoor Tex Â· Surat</div>
              </div>
              <SectionLabel>Label Preview â€” Child (38Ã—22mm)</SectionLabel>
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

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// INVENTORY
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

"W-09": () => (
  <WebLayout activeMenu="Inventory">
    <TopBar title="Live Inventory" sub="Last sync: just now â—" actions={[{label:"+ Add Stock (â†’ Create SKU)",primary:true},{label:"Export"}]}/>
    <Content>
      {/* Search bar - primary way to find SKUs by design code */}
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <div style={{flex:1,border:`0.5px solid ${C.border}`,borderRadius:4,padding:"7px 10px",fontSize:12,color:C.textLight,background:C.white}}>Search by design code, e.g. HT-001 to see all colours/sizes for that design...</div>
        <Btn small>âŠ™ Search</Btn>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
        <Btn small>All Locations â–¾</Btn><Btn small>All Categories â–¾</Btn><Btn small>Colour â–¾</Btn><Btn small>Size â–¾</Btn>
        <div style={{display:"flex",gap:5}}>
          {["All","Available","Low Stock","Out of Stock"].map((s,i)=>(
            <span key={i} style={{fontSize:11,padding:"4px 10px",borderRadius:3,border:`0.5px solid ${i===0?C.black:C.border}`,background:i===0?C.black:C.white,color:i===0?C.white:C.textMuted,cursor:"pointer"}}>{s}</span>
          ))}
        </div>
      </div>
      {/* Search result example - design code filtered */}
      <div style={{padding:"7px 10px",background:C.bgSoft,borderRadius:4,border:`0.5px solid ${C.border}`,marginBottom:8,fontSize:11,color:C.textMuted}}>
        Showing: <strong style={{color:C.text}}>HT-001</strong> â€” Floral Anarkali Â· 4 variants Â· 140 pcs total
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
        â„¹ To add new stock for an existing SKU â€” go to <strong>Create / Edit SKU</strong> and update quantities in the variant grid. The "Add Stock" button above redirects there.
      </div>
    </Content>
  </WebLayout>
),

"W-10": () => (
  <WebLayout activeMenu="Inventory">
    <TopBar title="Add Stock â€” MERGED INTO CREATE/EDIT SKU"/>
    <Content>
      <Card red>
        <div style={{fontSize:13,fontWeight:600,color:C.red,marginBottom:8}}>âš  This screen has been merged</div>
        <div style={{fontSize:11,color:C.textMuted}}>
          The separate "Add Stock / Goods Receipt" screen is no longer needed.<br/><br/>
          <strong>To add stock for a new design:</strong> Go to Products â†’ Create/Edit SKU (W-05) â€” the stock entry grid is now at the bottom of that screen.<br/><br/>
          <strong>To add more stock for an existing SKU:</strong> Go to Products â†’ Product List â†’ Edit the SKU â€” scroll to the stock grid and update quantities there.
        </div>
      </Card>
    </Content>
  </WebLayout>
),

"W-11": () => (
  <WebLayout activeMenu="Inventory">
    <TopBar title="Manual Stock Adjustment â€” REMOVED"/>
    <Content>
      <Card red>
        <div style={{fontSize:13,fontWeight:600,color:C.red,marginBottom:8}}>âš  This screen has been removed</div>
        <div style={{fontSize:11,color:C.textMuted}}>
          The separate "Manual Stock Adjustment" screen is not needed in the current scope.<br/><br/>
          Stock corrections can be handled by editing the SKU directly (Products â†’ Edit SKU â†’ stock grid). The audit trail automatically logs all changes made by admin users.
        </div>
      </Card>
    </Content>
  </WebLayout>
),

"W-12": () => (
  <WebLayout activeMenu="Inventory">
    <TopBar title="Stock Movement Log â€” REMOVED"/>
    <Content>
      <Card red>
        <div style={{fontSize:13,fontWeight:600,color:C.red,marginBottom:8}}>âš  This screen has been removed</div>
        <div style={{fontSize:11,color:C.textMuted}}>
          The Stock Movement Log has been removed from the current scope.<br/><br/>
          Stock history is available via <strong>Admin â†’ Audit Trail (W-33)</strong> which logs all stock changes with timestamps, user, and reference.
        </div>
      </Card>
    </Content>
  </WebLayout>
),

"W-13": () => (
  <WebLayout activeMenu="Inventory">
    <TopBar title="Stock Alert Center" sub="Low stock & ageing alerts â€” thresholds configured in System Settings"/>
    <Content>
      <div style={{display:"flex",gap:12,marginBottom:14}}>
        <div style={{flex:1}}>
          <Card red>
            <div style={{fontSize:11,fontWeight:700,color:C.red,marginBottom:8}}>âš  Low Stock â€” 7 SKUs</div>
            <div style={{fontSize:10,color:C.textMuted,marginBottom:8}}>Below threshold of 10 pcs Â· Click an SKU to go to inventory</div>
            {["HT-002-BLU-L (4 pcs)","HT-005-GRN-M (2 pcs)","HT-007-PNK-XL (1 pc)","HT-009-RED-S (3 pcs)"].map((s,i)=>(
              <div key={i} style={{fontSize:11,padding:"6px 0",borderBottom:`0.5px solid ${C.redBorder}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{color:C.red,cursor:"pointer",textDecoration:"underline"}}>{s}</span>
              </div>
            ))}
            <div style={{marginTop:10,fontSize:10,color:C.textMuted}}>Low stock threshold: 10 pcs â€” change in System Settings â†’ Inventory Thresholds</div>
          </Card>
        </div>
        <div style={{flex:1}}>
          <Card>
            <div style={{fontSize:11,fontWeight:700,marginBottom:8}}>Ageing Stock Report</div>
            <div style={{fontSize:10,color:C.textMuted,marginBottom:8}}>Stock sitting unsold by age bracket</div>
            {[["0â€“30 days","234 SKUs",false],["31â€“60 days","56 SKUs",false],["61â€“90 days","23 SKUs",true],["90+ days","12 SKUs",true]].map(([bracket,count,alert],i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:11,padding:"7px 0",borderBottom:`0.5px solid ${C.border}`}}>
                <span>{bracket}</span>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <span style={{fontWeight:600,color:alert?C.red:C.text}}>{count}</span>
                  {alert&&<Tag color="red">Alert</Tag>}
                </div>
              </div>
            ))}
            <div style={{marginTop:10,fontSize:10,color:C.textMuted}}>Ageing brackets: 30 / 60 / 90 days â€” change in System Settings â†’ Inventory Thresholds</div>
          </Card>
        </div>
      </div>
      <div style={{padding:"8px 12px",background:C.bgSoft,borderRadius:4,border:`0.5px solid ${C.border}`,fontSize:11,color:C.textMuted}}>
        â„¹ Credit due alerts are managed separately in the Payments module. Threshold configuration (low stock level, ageing brackets) is in Admin â†’ System Settings.
      </div>
    </Content>
  </WebLayout>
),

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// ORDERS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

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
        <strong style={{color:C.text}}>Wholesale flow:</strong> Pending Approval â†’ Approved (stock deducted) â†’ Dispatched â€” or â†’ Rejected (before approval) / Cancelled (after dispatch) &nbsp;|&nbsp;
        <strong style={{color:C.text}}>Retail flow:</strong> Created â†’ Dispatched (no approval needed) â€” or â†’ Cancelled
      </div>
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,overflow:"hidden",background:C.white}}>
        <TH cols={[{v:"Order ID",w:0.8},{v:"Type",w:0.6},{v:"Customer"},{v:"Items",w:0.5},{v:"Value",w:0.8},{v:"Status"},{v:"Payment"},{v:"Date",w:0.6},{v:"",w:0.5}]}/>
        {[
          {id:"#1043",type:"Retail",cust:"Ramesh Traders",items:4,val:"â‚¹3,400",status:"Dispatched",pay:"Paid",date:"04 Apr"},
          {id:"#W-1008",type:"Wholesale",cust:"Suresh Fabrics",items:12,val:"â‚¹18,400",status:"Pending Approval",pay:"Partial Paid",date:"04 Apr"},
          {id:"#1042",type:"Retail",cust:"Deepak & Sons",items:8,val:"â‚¹6,720",status:"Dispatched",pay:"Paid",date:"04 Apr"},
          {id:"#W-1007",type:"Wholesale",cust:"Neha Garments",items:24,val:"â‚¹32,800",status:"Approved",pay:"Partial Paid",date:"03 Apr"},
          {id:"#W-1005",type:"Wholesale",cust:"Asha Fabrics",items:6,val:"â‚¹9,600",status:"Rejected",pay:"â€”",date:"02 Apr"},
        ].map((r,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 10px",borderBottom:`0.5px solid ${C.border}`,background:r.status==="Rejected"||r.status==="Cancelled"?C.redLight:C.white}}>
            <div style={{flex:0.8,fontSize:12,fontWeight:600,fontFamily:"monospace"}}>{r.id}</div>
            <div style={{flex:0.6}}><Tag color={r.type==="Retail"?"black":""}>{r.type}</Tag></div>
            <div style={{flex:1,fontSize:12}}>{r.cust}</div>
            <div style={{flex:0.5,fontSize:11,textAlign:"center"}}>{r.items}</div>
            <div style={{flex:0.8,fontSize:12,fontWeight:500}}>{r.val}</div>
            <div style={{flex:1}}><Tag color={r.status==="Pending Approval"?"red":r.status==="Rejected"||r.status==="Cancelled"?"red":r.status==="Approved"||r.status==="Dispatched"?"black":""}>{r.status}</Tag></div>
            <div style={{flex:1}}><Tag color={r.pay.includes("Partial")||r.pay==="â€”"?"red":r.pay==="Paid"?"black":""}>{r.pay}</Tag></div>
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
    <TopBar title="Order #W-1007 â€” Neha Garments" actions={[{label:"Resend LR SMS"},{label:"Record Payment",primary:true},{label:"Print Challan"}]}/>
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
              ðŸ”’ Order approved â€” editing is locked. Contact admin to modify if needed. You can still record payments and upload LR.
            </div>
            <Divider label="Line Items"/>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden",marginBottom:10}}>
              <TH cols={[{v:"",w:0.3},{v:"Design"},{v:"SKU",w:1.1},{v:"Clr/Sz",w:0.7},{v:"Qty",w:0.4},{v:"Rate",w:0.7},{v:"Amount",w:0.8}]}/>
              {[
                {name:"Floral Anarkali",sku:"HT-001-RED-M",cs:"Red/M",qty:12,rate:"â‚¹580",amt:"â‚¹6,960"},
                {name:"Solid Kurti",sku:"HT-002-BLU-L",cs:"Blue/L",qty:12,rate:"â‚¹350",amt:"â‚¹4,200"},
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
                Total: â‚¹32,800
              </div>
            </div>
            <Divider label="LR & CCTV"/>
            <div style={{display:"flex",gap:8,alignItems:"center",padding:"8px 0"}}>
              <div style={{height:52,width:80,background:C.bgSoft,border:`0.5px solid ${C.border}`,borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:C.textLight}}>LR Photo</div>
              <div style={{flex:1}}>
                <div style={{fontSize:11,fontWeight:500}}>LR_CH-880_Neha.jpg</div>
                <div style={{fontSize:10,color:C.textMuted}}>Uploaded 03 Apr Â· BlueDart</div>
              </div>
              <div style={{display:"flex",gap:6}}><Btn small>View LR â†—</Btn><Btn small>View CCTV â†—</Btn></div>
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
            <FR label="Credit Limit" value="â‚¹50,000"/>
            <FR label="Cr. Days" value="30 days"/>
          </Card>
          {/* Payment tracker with grid showing installment history */}
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <SectionLabel>Payment Tracker</SectionLabel>
              <Btn primary small>+ Record Payment</Btn>
            </div>
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              <Metric label="Order Value" value="â‚¹32,800"/>
              <Metric label="Paid" value="â‚¹10,000" green/>
              <Metric label="Balance" value="â‚¹22,800" alert/>
            </div>
            {/* Payment history grid - showing all installments */}
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden",marginBottom:10}}>
              <TH cols={[{v:"Date",w:0.8},{v:"Amount",w:0.8},{v:"Mode"},{v:"Ref",w:0.8},{v:"",w:0.4}]}/>
              {[
                {date:"03 Apr",amt:"â‚¹10,000",mode:"Bank Transfer",ref:"NEFT-001"},
              ].map((p,i)=>(
                <TR key={i} cols={[{v:p.date,w:0.8},{v:p.amt,w:0.8,bold:true,green:true},{v:p.mode},{v:p.ref,w:0.8,mono:true},{v:"âœ•",w:0.4,red:true}]}/>
              ))}
              <div style={{padding:"6px 10px",background:C.bgSoft,fontSize:11,color:C.textMuted,textAlign:"right",borderTop:`0.5px solid ${C.border}`}}>
                Total paid: <strong>â‚¹10,000</strong> Â· Balance: <strong style={{color:C.red}}>â‚¹22,800</strong>
              </div>
            </div>
            {/* Record payment inline dialog */}
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,padding:"10px 12px",background:C.bgSoft}}>
              <div style={{fontSize:11,fontWeight:600,marginBottom:8}}>Record Payment</div>
              <Input label="Amount (â‚¹)" placeholder="Enter amount received"/>
              <div style={{display:"flex",gap:10,marginBottom:9}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,color:C.textMuted,marginBottom:3}}>Mode</div>
                  <div style={{display:"flex",gap:5}}>
                    {["Cash","UPI","Bank"].map((m,i)=>(<span key={i} style={{fontSize:10,padding:"3px 8px",border:`0.5px solid ${i===1?C.black:C.border}`,borderRadius:3,background:i===1?C.black:C.white,color:i===1?C.white:C.textMuted,cursor:"pointer"}}>{m}</span>))}
                  </div>
                </div>
              </div>
              {/* Adjustment amount â€” positive (charge extra) or negative (give discount/waive) */}
              <div style={{marginBottom:9}}>
                <div style={{fontSize:11,color:C.textMuted,marginBottom:3,fontWeight:500}}>Adjustment Amount (â‚¹) <span style={{fontWeight:400,fontSize:10}}>(optional)</span></div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <div style={{display:"flex",gap:5,marginBottom:0}}>
                    {["âˆ’ Deduct","+ Add"].map((t,i)=>(
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
              <Input label="Remarks" placeholder="e.g. 2nd installment / â‚¹50 adjusted"/>
              {/* Live balance preview */}
              <div style={{padding:"7px 10px",background:C.white,borderRadius:4,border:`0.5px solid ${C.border}`,marginBottom:8,fontSize:11}}>
                <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:C.textMuted}}>Balance before</span><span>â‚¹22,800</span></div>
                <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:C.textMuted}}>This payment</span><span style={{color:C.green}}>âˆ’ â‚¹5,000</span></div>
                <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:C.textMuted}}>Adjustment</span><span style={{color:C.textMuted}}>âˆ’ â‚¹0</span></div>
                <div style={{display:"flex",justifyContent:"space-between",fontWeight:700,borderTop:`0.5px solid ${C.border}`,marginTop:4,paddingTop:4}}><span>Remaining balance</span><span style={{color:C.red}}>â‚¹17,800</span></div>
              </div>
              <Btn primary full>Save Payment Record</Btn>
            </div>
          </Card>
        </div>
      </div>
    </Content>
  </WebLayout>
),

// â”€â”€ RETAIL ORDER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
"W-16R": () => (
  <WebLayout activeMenu="Orders" activeScreen="W-16R">
    <TopBar title="Create Retail Order" sub="Walk-in / counter sale â€” no approval needed" actions={[{label:"Save as Draft"},{label:"Submit + Print Challan",primary:true}]}/>
    <Content>
      <div style={{display:"flex",gap:12}}>
        <div style={{flex:2}}>

          {/* Retail: Customer is optional / minimal */}
          <Card>
            <SectionLabel>Step 1 â€” Customer (optional for retail)</SectionLabel>
            <div style={{padding:"6px 10px",background:C.bgSoft,borderRadius:4,border:`0.5px solid ${C.border}`,fontSize:11,color:C.textMuted,marginBottom:10}}>
              â„¹ Retail customers can walk in without a prior account. Search existing or add name + phone quickly â€” no credit/GST fields needed.
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
              <div style={{fontSize:12,fontWeight:600,color:C.green}}>âœ“ Ramesh Traders â€” +91 76543 21098</div>
              <div style={{fontSize:11,color:C.textMuted}}>Retail Customer Â· Ahmedabad</div>
            </div>
          </Card>

          {/* Item scanning â€” retail uses retail price */}
          <Card>
            <SectionLabel>Step 2 â€” Scan / Add Items</SectionLabel>
            <div style={{padding:"7px 10px",background:C.bgSoft,borderRadius:4,border:`0.5px solid ${C.border}`,fontSize:11,color:C.textMuted,marginBottom:10}}>
              Items priced at <strong>Retail Price</strong>. Manual discount per item available below.
            </div>
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              <div style={{flex:1,border:`0.5px solid ${C.border}`,borderRadius:4,padding:"7px 10px",fontSize:12,color:C.textLight,background:C.white}}>Scan child SKU barcode or search design name...</div>
              <Btn>âŠ™ Scan</Btn>
            </div>
            {/* Scanned item */}
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,padding:"10px 12px",background:C.bgSoft,marginBottom:10}}>
              <div style={{display:"flex",gap:12}}>
                <div style={{width:52,height:60,background:C.white,borderRadius:4,border:`0.5px solid ${C.border}`,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:C.textLight}}>IMG</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600}}>Floral Anarkali</div>
                  <div style={{fontSize:11,color:C.textMuted}}>HT-001 Â· Georgette</div>
                  <div style={{fontSize:12,marginTop:2}}>Retail Price: <strong>â‚¹850</strong></div>
                  <div style={{display:"flex",gap:4,marginTop:5}}>
                    {["Red â—","Blue","Black"].map((c,i)=>(<span key={i} style={{fontSize:10,padding:"2px 7px",border:`0.5px solid ${i===0?C.black:C.border}`,borderRadius:3,background:i===0?C.black:C.white,color:i===0?C.white:C.textMuted}}>{c}</span>))}
                  </div>
                  <div style={{display:"flex",gap:4,marginTop:4}}>
                    {["S","M â—","L","XL"].map((s,i)=>(<span key={i} style={{fontSize:10,padding:"2px 7px",border:`0.5px solid ${i===1?C.black:C.border}`,borderRadius:3,background:i===1?C.black:C.white,color:i===1?C.white:C.textMuted}}>{s}</span>))}
                  </div>
                  <div style={{fontSize:11,marginTop:4}}>Stock Red/M: <strong>24 pcs</strong> âœ“</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}>
                  <Input label="Qty" placeholder="1"/>
                  <Input label="Disc %" placeholder="0"/>
                  <Btn primary small>+ Add</Btn>
                </div>
              </div>
            </div>
            {/* Line items â€” retail has per-item manual discount */}
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden"}}>
              <TH cols={[{v:"Design"},{v:"SKU",w:1},{v:"Var",w:0.7},{v:"Qty",w:0.4},{v:"Retail â‚¹",w:0.7},{v:"Disc%",w:0.5},{v:"Amount",w:0.8},{v:"",w:0.3}]}/>
              {[
                {n:"Floral Anarkali",sku:"HT-001-RED-M",v:"Red/M",q:1,r:"â‚¹850",d:"0%",a:"â‚¹850"},
                {n:"Solid Kurti",sku:"HT-002-BLU-L",v:"Blue/L",q:2,r:"â‚¹490",d:"0%",a:"â‚¹980"},
              ].map((r,i)=>(
                <TR key={i} cols={[{v:r.n},{v:r.sku,w:1,mono:true},{v:r.v,w:0.7},{v:r.q,w:0.4,bold:true},{v:r.r,w:0.7},{v:r.d,w:0.5},{v:r.a,w:0.8,bold:true},{v:"âœ•",w:0.3,red:true}]}/>
              ))}
            </div>
          </Card>

          {/* Payment â€” retail is typically paid immediately */}
          <Card>
            <SectionLabel>Step 3 â€” Payment</SectionLabel>
            <div style={{padding:"10px 12px",background:C.bgSoft,borderRadius:6,border:`0.5px solid ${C.border}`,marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}><span>Order Total</span><strong>â‚¹1,830</strong></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.textMuted}}><span>Manual Discounts</span><span style={{color:C.green}}>âˆ’â‚¹0</span></div>
            </div>
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              {["Cash â—","UPI","Bank Transfer"].map((m,i)=>(<span key={i} style={{fontSize:11,padding:"6px 12px",border:`0.5px solid ${i===0?C.black:C.border}`,borderRadius:4,background:i===0?C.black:C.white,color:i===0?C.white:C.textMuted,cursor:"pointer"}}>{m}</span>))}
            </div>
            <div style={{display:"flex",gap:10}}>
              <div style={{flex:1}}><Input label="Amount Received (â‚¹)" placeholder="â‚¹1,830" note="Full amount typical for retail"/></div>
              <div style={{flex:1}}><Input label="Reference (optional)" placeholder="UPI / Cash â€” leave blank if cash"/></div>
            </div>
            <div style={{padding:"7px 10px",background:C.bgSoft,border:`0.5px solid ${C.border}`,borderRadius:4,fontSize:11,color:C.textMuted}}>
              â„¹ Retail orders do <strong>not</strong> require approval â€” submitted order is immediately dispatched. Challan printed on submit.
            </div>
          </Card>

        </div>
        <div style={{flex:1}}>
          <Card>
            <SectionLabel>Order Summary â€” Retail</SectionLabel>
            <FR label="Type" value="Retail"/><FR label="Customer" value="Ramesh Traders"/><FR label="Total Items" value="3 pcs"/>
            <FR label="Order Total" value="â‚¹1,830" bold/><FR label="Paid Now" value="â‚¹1,830"/><FR label="Balance" value="â‚¹0"/>
            <Divider/>
            <Btn primary full>Submit + Print Challan â†’</Btn>
            <div style={{marginTop:6}}><Btn full>Save as Draft</Btn></div>
          </Card>
          <Card>
            <SectionLabel>Retail Flow â€” What Happens</SectionLabel>
            <div style={{fontSize:11}}>
              {[
                {step:"Order Created",note:"Challan printed immediately",done:true},
                {step:"No Approval Needed",note:"Retail goes straight to dispatch",done:true},
                {step:"Stock Deducted",note:"On order creation",done:true},
                {step:"Dispatched",note:"Staff dispatches & uploads LR",done:false},
              ].map((f,i)=>(
                <div key={i} style={{display:"flex",gap:8,padding:"5px 0",borderBottom:`0.5px solid ${C.border}`}}>
                  <span style={{color:f.done?C.green:C.textMuted}}>{f.done?"âœ“":"â—·"}</span>
                  <div><div style={{fontWeight:500}}>{f.step}</div><div style={{fontSize:10,color:C.textMuted}}>{f.note}</div></div>
                </div>
              ))}
            </div>
          </Card>
          <Card style={{border:`0.5px solid ${C.border}`,background:C.bgSoft}}>
            <div style={{fontSize:10,fontWeight:700,color:C.textMuted,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.06em"}}>Fields unique to Retail</div>
            <div style={{fontSize:11,color:C.text}}>
              <div style={{padding:"3px 0",borderBottom:`0.5px solid ${C.border}`}}>âœ“ Customer is optional (anonymous ok)</div>
              <div style={{padding:"3px 0",borderBottom:`0.5px solid ${C.border}`}}>âœ“ Retail price applied automatically</div>
              <div style={{padding:"3px 0",borderBottom:`0.5px solid ${C.border}`}}>âœ“ Per-item manual discount</div>
              <div style={{padding:"3px 0",borderBottom:`0.5px solid ${C.border}`}}>âœ“ Payment expected at counter</div>
              <div style={{padding:"3px 0"}}>âœ— No credit terms / credit limit check</div>
            </div>
          </Card>
        </div>
      </div>
    </Content>
  </WebLayout>
),

// â”€â”€ WHOLESALE ORDER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
"W-16W": () => (
  <WebLayout activeMenu="Orders" activeScreen="W-16W">
    <TopBar title="Create Wholesale Order" sub="Registered dealer â€” goes to approval queue" actions={[{label:"Save as Draft"},{label:"Submit Order + Print Challan",primary:true}]}/>
    <Content>
      <div style={{display:"flex",gap:12}}>
        <div style={{flex:2}}>

          {/* Wholesale: Customer must be pre-registered with full profile */}
          <Card>
            <SectionLabel>Step 1 â€” Select Wholesale Customer</SectionLabel>
            <div style={{padding:"6px 10px",background:C.bgSoft,borderRadius:4,border:`0.5px solid ${C.border}`,fontSize:11,color:C.textMuted,marginBottom:10}}>
              â„¹ Wholesale customer must be registered with full business profile, credit limit, and GST. New customers â†’ Admin â†’ Create Customer (W-35) first.
            </div>
            <Input label="Search by business name or phone" placeholder="Type to search registered wholesale dealers..." required note="Only pre-registered wholesale accounts appear here"/>
            {/* Dropdown */}
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,background:C.white,marginBottom:8,overflow:"hidden"}}>
              {[
                {name:"Neha Garments",contact:"Neha Shah",phone:"+91 98765 00011",city:"Ahmedabad",bal:"â‚¹22,800",limit:"â‚¹50,000"},
                {name:"Neha Textiles",contact:"Neha Patel",phone:"+91 91234 99999",city:"Surat",bal:"â‚¹0",limit:"â‚¹30,000"},
              ].map((c,i)=>(
                <div key={i} style={{padding:"8px 12px",borderBottom:`0.5px solid ${C.border}`,cursor:"pointer",background:i===0?C.bgSoft:C.white}}>
                  <div style={{fontSize:12,fontWeight:i===0?600:400}}>{c.name} <span style={{fontSize:10,color:C.textMuted}}>Â· {c.phone} Â· {c.city}</span></div>
                  <div style={{fontSize:11,color:C.textMuted}}>{c.contact} Â· Balance: <span style={{color:c.bal!=="â‚¹0"?C.red:C.text}}>{c.bal}</span> Â· Limit: {c.limit}</div>
                </div>
              ))}
              <div style={{padding:"8px 12px",background:"#1a1a1a",display:"flex",alignItems:"center",gap:8}}>
                <span style={{color:C.white,fontSize:12,fontWeight:600}}>+ Register New Wholesale Customer â†’</span>
                <span style={{fontSize:10,color:"#aaa"}}>Redirects to W-35 with name pre-filled</span>
              </div>
            </div>
            {/* Selected â€” shows full account info including credit standing */}
            <div style={{padding:"10px 12px",background:C.greenLight,border:`0.5px solid ${C.greenBorder}`,borderRadius:6}}>
              <div style={{fontSize:12,fontWeight:600,color:C.green}}>âœ“ Neha Garments â€” Neha Shah</div>
              <div style={{display:"flex",gap:14,marginTop:6,flexWrap:"wrap"}}>
                <span style={{fontSize:11,color:C.textMuted}}>City: Ahmedabad</span>
                <span style={{fontSize:11,color:C.textMuted}}>GST: 22XXXXX001</span>
                <span style={{fontSize:11,color:C.textMuted}}>Credit: 30 days</span>
                <span style={{fontSize:11,color:C.textMuted}}>Limit: â‚¹50,000</span>
                <span style={{fontSize:11,color:C.red,fontWeight:600}}>Balance Due: â‚¹22,800</span>
                <span style={{fontSize:11,color:C.green,fontWeight:600}}>Discount: 5%</span>
              </div>
            </div>
          </Card>

          {/* Item scanning â€” wholesale uses wholesale price + customer discount */}
          <Card>
            <SectionLabel>Step 2 â€” Scan / Add Items</SectionLabel>
            <div style={{padding:"7px 10px",background:C.bgSoft,borderRadius:4,border:`0.5px solid ${C.border}`,fontSize:11,color:C.textMuted,marginBottom:10}}>
              Items priced at <strong>Wholesale Price</strong>. Customer's 5% discount auto-applied to all items.
            </div>
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              <div style={{flex:1,border:`0.5px solid ${C.border}`,borderRadius:4,padding:"7px 10px",fontSize:12,color:C.textLight,background:C.white}}>Scan child SKU barcode or search design name...</div>
              <Btn>âŠ™ Scan</Btn>
            </div>
            {/* Scanned preview â€” shows wholesale price + auto discount */}
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,padding:"10px 12px",background:C.bgSoft,marginBottom:10}}>
              <div style={{display:"flex",gap:12}}>
                <div style={{width:52,height:60,background:C.white,borderRadius:4,border:`0.5px solid ${C.border}`,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:C.textLight}}>IMG</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600}}>Floral Anarkali</div>
                  <div style={{fontSize:11,color:C.textMuted}}>HT-001 Â· Georgette</div>
                  <div style={{fontSize:12,marginTop:2}}>Wholesale: <strong>â‚¹580</strong> Â· After 5% discount: <strong style={{color:C.green}}>â‚¹551</strong></div>
                  <div style={{display:"flex",gap:4,marginTop:5}}>
                    {["Red â—","Blue","Black"].map((c,i)=>(<span key={i} style={{fontSize:10,padding:"2px 7px",border:`0.5px solid ${i===0?C.black:C.border}`,borderRadius:3,background:i===0?C.black:C.white,color:i===0?C.white:C.textMuted}}>{c}</span>))}
                  </div>
                  <div style={{display:"flex",gap:4,marginTop:4}}>
                    {["S","M â—","L","XL"].map((s,i)=>(<span key={i} style={{fontSize:10,padding:"2px 7px",border:`0.5px solid ${i===1?C.black:C.border}`,borderRadius:3,background:i===1?C.black:C.white,color:i===1?C.white:C.textMuted}}>{s}</span>))}
                  </div>
                  <div style={{fontSize:11,marginTop:4}}>Stock Red/M: <strong>24 pcs</strong> âœ“</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}>
                  <Input label="Qty" placeholder="6"/>
                  <Btn primary small>+ Add</Btn>
                </div>
              </div>
            </div>
            {/* Line items â€” wholesale shows wholesale price + auto customer discount */}
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden"}}>
              <TH cols={[{v:"Design"},{v:"SKU",w:1},{v:"Var",w:0.7},{v:"Qty",w:0.4},{v:"W/S â‚¹",w:0.7},{v:"Disc%",w:0.5},{v:"Net â‚¹",w:0.8},{v:"Amount",w:0.8},{v:"",w:0.3}]}/>
              {[
                {n:"Floral Anarkali",sku:"HT-001-RED-M",v:"Red/M",q:6,ws:"â‚¹580",d:"5%",net:"â‚¹551",a:"â‚¹3,306"},
                {n:"Solid Kurti",sku:"HT-002-BLU-L",v:"Blue/L",q:4,ws:"â‚¹350",d:"5%",net:"â‚¹332.50",a:"â‚¹1,330"},
              ].map((r,i)=>(
                <TR key={i} cols={[{v:r.n},{v:r.sku,w:1,mono:true},{v:r.v,w:0.7},{v:r.q,w:0.4,bold:true},{v:r.ws,w:0.7},{v:r.d,w:0.5,green:true},{v:r.net,w:0.8},{v:r.a,w:0.8,bold:true},{v:"âœ•",w:0.3,red:true}]}/>
              ))}
            </div>
          </Card>

          {/* Payment â€” wholesale may be credit / partial */}
          <Card>
            <SectionLabel>Step 3 â€” Payment Terms</SectionLabel>
            <div style={{padding:"10px 12px",background:C.bgSoft,borderRadius:6,border:`0.5px solid ${C.border}`,marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}><span>Gross Total</span><strong>â‚¹4,880</strong></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3,color:C.textMuted}}><span>Customer Discount (5%)</span><span style={{color:C.green}}>âˆ’â‚¹244</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}><span style={{fontWeight:600}}>Net Order Value</span><strong>â‚¹4,636</strong></div>
              <div style={{borderTop:`0.5px solid ${C.border}`,marginTop:6,paddingTop:6,display:"flex",justifyContent:"space-between",fontSize:12,color:C.textMuted}}><span>Existing Balance Due</span><span style={{color:C.red,fontWeight:600}}>â‚¹22,800</span></div>
            </div>
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              {["Bank Transfer â—","UPI","Cash","Credit (No payment now)"].map((m,i)=>(<span key={i} style={{fontSize:10,padding:"5px 10px",border:`0.5px solid ${i===0?C.black:C.border}`,borderRadius:4,background:i===0?C.black:C.white,color:i===0?C.white:C.textMuted,cursor:"pointer"}}>{m}</span>))}
            </div>
            <div style={{display:"flex",gap:10}}>
              <div style={{flex:1}}><Input label="Amount Paid Now (â‚¹)" placeholder="â‚¹ 0 â€” full credit allowed" note="0 = Unpaid Â· Partial = Partial Paid Â· Full = Paid"/></div>
              <div style={{flex:1}}><Input label="Payment Reference" placeholder="UTR / Cheque no. (optional)"/></div>
            </div>
            <div style={{padding:"7px 10px",background:"#fff8e1",border:`0.5px solid #f5c842`,borderRadius:4,fontSize:11,color:"#7a5c00"}}>
              âš  This order goes to <strong>Approval Queue</strong> after submission. Stock is reserved but <strong>not deducted</strong> until approved by admin/manager.
            </div>
          </Card>

          {/* Wholesale-only: Challan & Logistics */}
          <Card>
            <SectionLabel>Step 4 â€” Challan & Logistics (Wholesale only)</SectionLabel>
            <div style={{display:"flex",gap:10}}>
              <div style={{flex:1}}><Input label="Broker Name" placeholder="Broker (if applicable)"/></div>
              <div style={{flex:1}}><Input label="Transport / Carrier" placeholder="Customer's preferred transport"/></div>
            </div>
            <Input label="Special Instructions (optional)" placeholder="e.g. dispatch only after full payment, fragile items..."/>
          </Card>

        </div>
        <div style={{flex:1}}>
          <Card>
            <SectionLabel>Order Summary â€” Wholesale</SectionLabel>
            <FR label="Type" value="Wholesale"/><FR label="Customer" value="Neha Garments"/>
            <FR label="City" value="Ahmedabad"/><FR label="GST" value="22XXXXX001"/>
            <FR label="Total Items" value="10 pcs"/>
            <FR label="Gross Value" value="â‚¹4,880"/>
            <FR label="Discount (5%)" value="âˆ’â‚¹244" bold/>
            <FR label="Net Order Value" value="â‚¹4,636" bold/>
            <FR label="Paid Now" value="â‚¹0"/><FR label="Balance This Order" value="â‚¹4,636" accent/>
            <Divider/>
            <Btn primary full>Submit Order + Print Challan â†’</Btn>
            <div style={{marginTop:6}}><Btn full>Save as Draft</Btn></div>
          </Card>
          <Card>
            <SectionLabel>Wholesale Flow â€” What Happens</SectionLabel>
            <div style={{fontSize:11}}>
              {[
                {step:"Order Submitted",note:"Draft challan created, order ID assigned",done:true},
                {step:"Approval Queue",note:"Admin / manager reviews & approves",done:false},
                {step:"Stock Deducted",note:"Only after approval",done:false},
                {step:"Picking & Dispatch",note:"Godown staff picks, CCTV records",done:false},
                {step:"LR Uploaded",note:"Auto SMS to customer with LR link",done:false},
              ].map((f,i)=>(
                <div key={i} style={{display:"flex",gap:8,padding:"5px 0",borderBottom:`0.5px solid ${C.border}`}}>
                  <span style={{color:f.done?C.green:C.textMuted}}>{f.done?"âœ“":"â—·"}</span>
                  <div><div style={{fontWeight:500}}>{f.step}</div><div style={{fontSize:10,color:C.textMuted}}>{f.note}</div></div>
                </div>
              ))}
            </div>
          </Card>
          <Card style={{background:C.bgSoft}}>
            <div style={{fontSize:10,fontWeight:700,color:C.textMuted,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.06em"}}>Fields unique to Wholesale</div>
            <div style={{fontSize:11,color:C.text}}>
              <div style={{padding:"3px 0",borderBottom:`0.5px solid ${C.border}`}}>âœ“ Pre-registered customer mandatory</div>
              <div style={{padding:"3px 0",borderBottom:`0.5px solid ${C.border}`}}>âœ“ Wholesale price + auto discount</div>
              <div style={{padding:"3px 0",borderBottom:`0.5px solid ${C.border}`}}>âœ“ Credit terms, limit & balance check</div>
              <div style={{padding:"3px 0",borderBottom:`0.5px solid ${C.border}`}}>âœ“ GST visible on challan</div>
              <div style={{padding:"3px 0",borderBottom:`0.5px solid ${C.border}`}}>âœ“ Broker & transport fields</div>
              <div style={{padding:"3px 0",borderBottom:`0.5px solid ${C.border}`}}>âœ“ Credit / partial payment option</div>
              <div style={{padding:"3px 0"}}>âœ“ Requires admin approval before dispatch</div>
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
        <Metric label="Pending Value" value="â‚¹74,200" alert/>
        <Metric label="Avg Approval Time" value="18 min"/>
      </div>
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,overflow:"hidden",background:C.white,marginBottom:14}}>
        <TH cols={[{v:"",w:0.2},{v:"Order",w:0.8},{v:"Customer"},{v:"Items",w:0.5},{v:"Value",w:0.8},{v:"Submitted By"},{v:"Stock Status"},{v:"Actions",w:1.4}]}/>
        {[
          {id:"#W-1008",cust:"Ramesh Traders",items:12,val:"â‚¹18,400",by:"Priya (Office)",stock:"All available",urgent:true},
          {id:"#W-1007",cust:"Suresh Fabrics",items:8,val:"â‚¹11,200",by:"Raju (Mobile)",stock:"All available",urgent:false},
          {id:"#W-1006",cust:"Deepak Wholesale",items:24,val:"â‚¹32,800",by:"Priya (Office)",stock:"2 SKUs low",urgent:false},
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
              <Btn primary small>âœ“ Approve</Btn>
              <Btn danger small>âœ•</Btn>
            </div>
          </div>
        ))}
      </div>
    </Content>
  </WebLayout>
),

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// DISPATCH & LOGISTICS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

"W-17": () => (
  <WebLayout activeMenu="Dispatch">
    <TopBar title="LR Management Console" actions={[{label:"Resend Selected",primary:true},{label:"Export"}]}/>
    <Content>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <div style={{flex:1,border:`0.5px solid ${C.border}`,borderRadius:4,padding:"7px 10px",fontSize:12,color:C.textLight,background:C.white}}>Search by Order ID / Challan number / Customer name...</div>
        <Btn small>SMS Status â–¾</Btn><Btn small>Date â–¾</Btn>
      </div>
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,overflow:"hidden",background:C.white}}>
        <TH cols={[{v:"Order",w:0.8},{v:"Challan",w:0.8},{v:"Customer"},{v:"LR Doc",w:0.6},{v:"SMS Status",w:0.9},{v:"Actions",w:1.4}]}/>
        {[
          {order:"#1042",ch:"CH-881",cust:"Suresh Fabrics",doc:"Photo",sms:"Delivered"},
          {order:"#1041",ch:"CH-880",cust:"Deepak & Sons",doc:"PDF",sms:"Sent"},
          {order:"#1040",ch:"CH-879",cust:"Neha Garments",doc:"â€”",sms:"Not sent"},
        ].map((r,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 10px",borderTop:`0.5px solid ${C.border}`,background:r.sms==="Not sent"?C.redLight:C.white}}>
            <div style={{flex:0.8,fontWeight:600,fontFamily:"monospace",fontSize:12}}>{r.order}</div>
            <div style={{flex:0.8,fontFamily:"monospace",fontSize:11,color:C.textMuted}}>{r.ch}</div>
            <div style={{flex:1,fontSize:12}}>{r.cust}</div>
            <div style={{flex:0.6}}><Tag color={r.doc==="â€”"?"red":""}>{r.doc}</Tag></div>
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
    <TopBar title="LR Detail â€” Order #1042" actions={[{label:"Resend SMS"},{label:"Download LR",primary:true}]}/>
    <Content>
      <div style={{display:"flex",gap:12}}>
        <div style={{flex:1.4}}>
          <Card>
            <div style={{height:220,background:C.bgSoft,borderRadius:6,border:`0.5px solid ${C.border}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",marginBottom:8}}>
              <div style={{fontSize:24}}>ðŸ“„</div>
              <div style={{fontSize:12,color:C.textMuted,marginTop:6}}>LR_CH-881_Suresh_Fabrics.jpg</div>
              <div style={{fontSize:10,color:C.textLight}}>Uploaded 04 Apr 09:45 Â· 2.3 MB</div>
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
    <TopBar title="Logistics Status Tracker â€” REMOVED"/>
    <Content>
      <Card red>
        <div style={{fontSize:13,fontWeight:600,color:C.red,marginBottom:8}}>âš  This screen has been removed</div>
        <div style={{fontSize:11,color:C.textMuted}}>
          The separate Logistics Tracker module has been discontinued per the updated spec.<br/><br/>
          Order dispatch status is now tracked via:<br/>
          â€¢ <strong>Order List (W-14)</strong> â€” status column shows Approved / Dispatched / Cancelled / Rejected<br/>
          â€¢ <strong>Order Detail (W-15)</strong> â€” full order status and LR upload<br/>
          â€¢ <strong>LR Console (W-17)</strong> â€” upload and resend LR SMS per dispatch
        </div>
      </Card>
    </Content>
  </WebLayout>
),

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// PAYMENTS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

"W-20": () => (
  <WebLayout activeMenu="Payments">
    <TopBar title="Payment Records" sub="Outstanding balances prioritised by credit limit usage"/>
    <Content>
      <div style={{display:"flex",gap:10,marginBottom:14}}>
        <Metric label="Total Outstanding" value="â‚¹1.2L" alert/>
        <Metric label="Credit Limit Breached" value="2" alert/>
        <Metric label="Due This Week" value="â‚¹44,200" alert/>
        <Metric label="Today Collections" value="â‚¹32,000" green/>
        <Metric label="Today UPI" value="â‚¹52,200" green/>
      </div>
      {/* Search */}
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <div style={{flex:1,border:`0.5px solid ${C.border}`,borderRadius:4,padding:"7px 10px",fontSize:12,color:C.textLight,background:C.white}}>Search by customer name or order ID...</div>
        <Btn small>All Status â–¾</Btn><Btn small>Date â–¾</Btn>
      </div>
      {/* Explanation note */}
      <div style={{padding:"7px 12px",background:C.bgSoft,border:`0.5px solid ${C.border}`,borderRadius:4,fontSize:11,color:C.textMuted,marginBottom:12}}>
        â„¹ Customers with credit limit almost exhausted or overdue appear at top. Click <strong>Add Payment</strong> to record a payment â€” or open Order Detail to view full history.
      </div>
      {/* Payment records list - prioritised */}
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,overflow:"hidden",background:C.white}}>
        <TH cols={[{v:"Customer"},{v:"Order",w:0.8},{v:"Order Value",w:0.9},{v:"Paid",w:0.8},{v:"Balance",w:0.8},{v:"Credit Limit",w:0.9},{v:"Days Outstanding",w:1},{v:"Actions",w:1.2}]}/>
        {[
          {cust:"Deepak Wholesale",order:"#W-1006",val:"â‚¹32,800",paid:"â‚¹0",bal:"â‚¹32,800",limit:"â‚¹30,000",days:"Overdue 3d",breach:true},
          {cust:"Ramesh Traders",order:"#W-1004",val:"â‚¹18,400",paid:"â‚¹10,000",bal:"â‚¹8,400",limit:"â‚¹30,000",days:"Due tomorrow",breach:false},
          {cust:"Neha Garments",order:"#W-1007",val:"â‚¹32,800",paid:"â‚¹10,000",bal:"â‚¹22,800",limit:"â‚¹50,000",days:"12 days",breach:false},
          {cust:"Suresh Fabrics",order:"#W-1002",val:"â‚¹11,200",paid:"â‚¹5,000",bal:"â‚¹6,200",limit:"â‚¹50,000",days:"8 days",breach:false},
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
              <Btn small>Order Detail â†—</Btn>
            </div>
          </div>
        ))}
      </div>
      <div style={{marginTop:8,fontSize:11,color:C.textMuted}}>
        To record a payment: open Order Detail â†’ click <strong>Record Payment</strong>. Payments recorded there auto-update this list.
      </div>
    </Content>
  </WebLayout>
),

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// CCTV
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

"W-21": () => (
  <WebLayout activeMenu="CCTV">
    <TopBar title="CCTV Console" sub="Dispatch video recording & footage library"/>
    <Content pad={false}>
      <Tabs tabs={["Record New Dispatch","Footage Library"]} active="Record New Dispatch"/>
      <div style={{padding:16}}>
        <div style={{display:"flex",gap:12}}>
          <div style={{flex:1}}>
            <Card>
              <SectionLabel>Step 1 â€” Identify Order</SectionLabel>
              <div style={{display:"flex",gap:8,marginBottom:10}}>
                <div style={{flex:1}}><Input label="Order ID / Challan Number" placeholder="Scan label or type Order ID..." mono note="Scan the printed Order ID label at dispatch station"/></div>
                <div style={{paddingTop:18}}><Btn>âŠ™ Scan</Btn></div>
              </div>
              {/* Order found state */}
              <div style={{padding:"10px 12px",background:C.greenLight,border:`0.5px solid ${C.greenBorder}`,borderRadius:6,marginBottom:8}}>
                <div style={{fontSize:12,fontWeight:600,color:C.green}}>âœ“ Order Found â€” #1043</div>
                <div style={{fontSize:12,marginTop:2}}>Ramesh Traders Â· 4 items Â· â‚¹3,400</div>
                <div style={{fontSize:11,color:C.textMuted}}>Challan: CH-882 Â· Dispatching to Mumbai</div>
              </div>
              {/* Print Label button â€” prints dispatch label for this order ID */}
              <div style={{display:"flex",gap:8,marginBottom:12}}>
                <Btn small>ðŸ–¨ Print Label</Btn>
                <span style={{fontSize:10,color:C.textMuted,alignSelf:"center"}}>Prints order ID label for dispatch station scanning</span>
              </div>
              <SectionLabel>Step 2 â€” Camera</SectionLabel>
              <div style={{display:"flex",gap:8,marginBottom:12}}>
                {["CAM-1 (Dispatch A) â—","CAM-2 (Dispatch B)"].map((c,i)=>(
                  <div key={i} style={{flex:1,padding:"8px 12px",border:`0.5px solid ${i===0?C.black:C.border}`,borderRadius:4,background:i===0?C.black:C.white,color:i===0?C.white:C.textMuted,fontSize:11,textAlign:"center",cursor:"pointer"}}>{c}</div>
                ))}
              </div>
              <SectionLabel>Step 3 â€” Recording Controls</SectionLabel>
              <div style={{padding:"14px",background:C.bgSoft,borderRadius:6,border:`0.5px solid ${C.border}`,textAlign:"center",marginBottom:10}}>
                <div style={{fontSize:11,color:C.textMuted,marginBottom:10}}>Ready to record Â· CAM-1 live</div>
                <Btn success>â–¶ Start Recording</Btn>
              </div>
              {/* Recording in progress state */}
              <div style={{padding:"14px",background:C.black,borderRadius:6,textAlign:"center"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:8}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:C.red}}/>
                  <span style={{color:C.white,fontSize:12,fontWeight:600}}>RECORDING Â· 01:24</span>
                </div>
                <div style={{fontSize:11,color:"#888",marginBottom:10}}>Order #1043 Â· CAM-1 Â· 04 Apr 09:45</div>
                <Btn danger>â—¼ Stop & Save Recording</Btn>
              </div>
              <div style={{marginTop:8,fontSize:10,color:C.textMuted}}>On stop: clip is saved and automatically linked to Order #1043 Â· Challan CH-882</div>
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
                      <div style={{fontSize:16}}>â–¶</div>
                      <div style={{fontSize:9,marginTop:2}}>{v.cam} Â· 04 Apr {v.time} Â· {v.dur}</div>
                    </div>
                  </div>
                  <div style={{padding:"8px 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontSize:12,fontWeight:600,fontFamily:"monospace"}}>{v.order}</div>
                      <div style={{fontSize:11,color:C.textMuted}}>{v.cust} Â· {v.ch}</div>
                    </div>
                    <Btn small>View â†’</Btn>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </Content>
  </WebLayout>
),

"W-22": () => (
  <WebLayout activeMenu="CCTV">
    <TopBar title="Video Playback â€” Order #1042" actions={[{label:"Download Clip",primary:true}]}/>
    <Content>
      <div style={{display:"flex",gap:12}}>
        <div style={{flex:2}}>
          <div style={{background:C.black,borderRadius:6,height:240,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:8}}>
            <div style={{textAlign:"center",color:"#888"}}>
              <div style={{fontSize:36}}>â–¶</div>
              <div style={{fontSize:12,marginTop:8}}>CAM-1 Â· 04 Apr 2026 Â· 09:45:03</div>
            </div>
          </div>
          <div style={{background:C.bgSoft,borderRadius:4,padding:"8px 12px",display:"flex",alignItems:"center",gap:10}}>
            <Btn small>â®</Btn><Btn small>â–¶</Btn><Btn small>â­</Btn>
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
            <FR label="Duration" value="3m 45s"/><FR label="Triggered By" value="Manual â€” CCTV Console"/>
          </Card>
        </div>
      </div>
    </Content>
  </WebLayout>
),

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// REPORTS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

"W-23": () => (
  <WebLayout activeMenu="Reports">
    <TopBar title="Reports Hub"/>
    <Content>
      <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
        {[
          {title:"Sales Report",desc:"By date, channel, customer & product",icon:"âŠž"},
          {title:"Inventory Ageing",desc:"0â€“30, 31â€“60, 61â€“90, 90+ day brackets",icon:"â—·"},
          {title:"Top-Selling Designs",desc:"Ranked by units & revenue",icon:"â†‘"},
          {title:"Customer Order History",desc:"Per-customer view, PDF export",icon:"â—‰"},
          {title:"Daily Statement",desc:"End-of-day reconciliation & collections",icon:"ðŸ“Š"},
          {title:"Payment Status",desc:"By date, mode & status",icon:"â‚¹"},
        ].map((r,i)=>(
          <div key={i} style={{width:"calc(33.3% - 8px)",border:`0.5px solid ${C.border}`,borderRadius:8,padding:"16px 14px",background:C.white,cursor:"pointer"}}>
            <div style={{fontSize:22,marginBottom:8}}>{r.icon}</div>
            <div style={{fontSize:13,fontWeight:600,marginBottom:4}}>{r.title}</div>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:12}}>{r.desc}</div>
            <Btn small>Open Report â†’</Btn>
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
        <Btn small>Date Range â–¾</Btn><Btn small>Channel â–¾</Btn><Btn small>Customer â–¾</Btn><Btn small>Product â–¾</Btn>
        <Toggle options={["All","Retail","Wholesale"]} active="All"/>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:14}}>
        <Metric label="Total Orders" value="284"/><Metric label="Units Sold" value="1,842"/><Metric label="Revenue" value="â‚¹18.4L"/><Metric label="Avg Order" value="â‚¹6,478"/>
      </div>
      <Card>
        <div style={{fontSize:12,fontWeight:600,marginBottom:8}}>Revenue Trend â€” April 2026</div>
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
        {[["0â€“30 Days","234 SKUs",false],["31â€“60 Days","56 SKUs",false],["61â€“90 Days","23 SKUs",true],["90+ Days","12 SKUs",true]].map(([l,v,a],i)=>(
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
        <Btn small>This Month â–¾</Btn><Toggle options={["By Units","By Revenue"]} active="By Units"/>
      </div>
      <Card>
        {[{name:"Floral Anarkali",units:340,rev:"â‚¹1.36L"},{name:"Solid Kurti",units:280,rev:"â‚¹84k"},{name:"Block Print Salwar",units:210,rev:"â‚¹63k"},{name:"Embr. Dupatta",units:190,rev:"â‚¹95k"}].map((d,i)=>(
          <div key={i} style={{marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:3}}>
              <span><strong>#{i+1}</strong> {d.name}</span><span style={{color:C.textMuted}}>{d.units} pcs Â· {d.rev}</span>
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
            <div style={{fontSize:11,color:C.textMuted,marginBottom:10}}>+91 98765 43210 Â· Surat Â· Since Jan 2026</div>
            <div style={{display:"flex",gap:10,marginBottom:12}}>
              <Metric label="Total Orders" value="28"/><Metric label="Total Value" value="â‚¹2.1L"/><Metric label="Outstanding" value="â‚¹7,800" alert/>
            </div>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden"}}>
              <TH cols={[{v:"Order",w:0.7},{v:"Date",w:0.7},{v:"Items",w:0.5},{v:"Value",w:0.8},{v:"Payment"},{v:"LR",w:0.5}]}/>
              {[{id:"#1042",date:"04 Apr",items:8,val:"â‚¹7,800",pay:"Unpaid"},{id:"#1032",date:"28 Mar",items:6,val:"â‚¹5,400",pay:"Paid"}].map((r,i)=>(
                <TR key={i} cols={[{v:r.id,w:0.7,mono:true,bold:true},{v:r.date,w:0.7},{v:r.items,w:0.5},{v:r.val,w:0.8,bold:true},{v:r.pay,red:r.pay==="Unpaid"},{v:"â†—",w:0.5}]}/>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Content>
  </WebLayout>
),

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// SMS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

"W-28": () => (
  <WebLayout activeMenu="SMS">
    <TopBar title="SMS Log"/>
    <Content>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <Btn small>All Templates â–¾</Btn><Btn small>All Status â–¾</Btn><Btn small>Date â–¾</Btn>
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
        {name:"LR Link Delivery",active:true,tpl:"Dear {Name}, Order {ID} has been dispatched. Track LR: {Link} â€“ Hoor Tex"},
        {name:"Payment Alert",active:true,tpl:"Dear {Name}, â‚¹{Amount} for Order {ID} confirmed. Thank you! â€“ Hoor Tex"},
        {name:"Credit Due Reminder",active:true,tpl:"Dear {Name}, your balance â‚¹{Amount} for Order {ID} is due on {Date}. â€“ Hoor Tex"},
        {name:"Low Stock Alert",active:false,tpl:"Low stock: SKU {Code} only {Qty} pcs remaining. â€“ Hoor Tex"},
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

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// DAILY OPS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

"W-36": () => (
  <WebLayout activeMenu="Daily Ops">
    <TopBar title="Daily Reconciliation" sub="04 Apr 2026" actions={[{label:"Export Statement"},{label:"Close Day",primary:true}]}/>
    <Content>
      <div style={{display:"flex",gap:10,marginBottom:14}}>
        <Metric label="Total Collections" value="â‚¹84,200" green/>
        <Metric label="Retail Orders" value="18" sub="â‚¹28,800"/>
        <Metric label="Wholesale Collections" value="â‚¹55,400" green/>
        <Metric label="Pending Verifications" value="3" alert/>
      </div>
      <div style={{display:"flex",gap:12}}>
        <div style={{flex:1}}>
          <Card>
            <SectionLabel>Collections by Mode</SectionLabel>
            {[
              {mode:"Cash",retail:"â‚¹12,000",ws:"â‚¹8,000",total:"â‚¹20,000"},
              {mode:"UPI",retail:"â‚¹16,800",ws:"â‚¹22,400",total:"â‚¹39,200"},
              {mode:"Bank Transfer",retail:"â‚¹0",ws:"â‚¹25,000",total:"â‚¹25,000"},
            ].map((r,i)=>(
              <div key={i} style={{display:"flex",gap:6,padding:"8px 0",borderBottom:`0.5px solid ${C.border}`,fontSize:12}}>
                <div style={{flex:1,fontWeight:500}}>{r.mode}</div>
                <div style={{flex:1,color:C.textMuted}}>Retail: {r.retail}</div>
                <div style={{flex:1,color:C.textMuted}}>WS: {r.ws}</div>
                <div style={{flex:0.8,fontWeight:700,color:C.green}}>{r.total}</div>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"flex-end",marginTop:8,fontSize:13,fontWeight:700,color:C.green}}>
              Grand Total: â‚¹84,200
            </div>
          </Card>
          <Card>
            <SectionLabel>Order Summary</SectionLabel>
            {[
              {type:"Retail Orders",count:18,val:"â‚¹28,800"},
              {type:"Wholesale Dispatched",count:4,val:"â‚¹55,400"},
              {type:"Wholesale Pending Approval",count:2,val:"â‚¹31,200"},
              {type:"Returned Orders",count:1,val:"â‚¹4,200"},
            ].map((r,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`0.5px solid ${C.border}`,fontSize:12}}>
                <span>{r.type}</span>
                <span style={{color:C.textMuted}}>{r.count} orders Â· <strong>{r.val}</strong></span>
              </div>
            ))}
          </Card>
        </div>
        <div style={{flex:1}}>
          <Card>
            <SectionLabel>Transaction-wise Log</SectionLabel>
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              <Btn small>All Modes â–¾</Btn><Btn small>All Types â–¾</Btn>
            </div>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden"}}>
              <TH cols={[{v:"Time",w:0.7},{v:"Order",w:0.7},{v:"Customer"},{v:"Mode",w:0.8},{v:"Amount",w:0.8}]}/>
              {[
                {time:"09:30",order:"#1043",cust:"Ramesh Traders",mode:"UPI",amt:"â‚¹3,400"},
                {time:"10:15",order:"#W-1007",cust:"Neha Garments",mode:"Bank",amt:"â‚¹10,000"},
                {time:"11:00",order:"#1044",cust:"Ahmed Fabrics",mode:"Cash",amt:"â‚¹2,100"},
                {time:"14:20",order:"#W-1006",cust:"Deepak Wholesale",mode:"Bank",amt:"â‚¹25,000"},
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

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// ADMIN
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

"W-30": () => (
  <WebLayout activeMenu="Admin" activeScreen="W-30">
    <TopBar title="User Management" actions={[{label:"+ Add User",primary:true}]}/>
    <Content>
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,overflow:"hidden",background:C.white,marginBottom:16}}>
        <TH cols={[{v:"Name"},{v:"Email",w:1.4},{v:"Role"},{v:"Mobile",w:0.9},{v:"Status",w:0.6},{v:"Last Login"},{v:"Actions",w:0.8}]}/>
        {[
          {name:"Abdul Kadir",email:"admin@hoortex.com",role:"Super Admin",mob:"+91 91046 70469",status:"Active",login:"04 Apr 09:00"},
          {name:"Mohammad Ali",email:"ali@hoortex.com",role:"Super Admin",mob:"+91 79905 01710",status:"Active",login:"04 Apr 09:15"},
          {name:"Raju Singh",email:"raju@hoortex.com",role:"Godown Staff",mob:"+91 98765 43210",status:"Active",login:"04 Apr 08:45"},
          {name:"Priya Sharma",email:"priya@hoortex.com",role:"Office Staff",mob:"+91 87654 32109",status:"Active",login:"04 Apr 09:15"},
          {name:"Mohan Das",email:"mohan@hoortex.com",role:"Manager",mob:"+91 76543 21098",status:"Inactive",login:"28 Mar 17:00"},
        ].map((u,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 10px",borderTop:`0.5px solid ${C.border}`,background:u.status==="Inactive"?C.bgSoft:C.white}}>
            <div style={{flex:1,display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:C.black,display:"flex",alignItems:"center",justifyContent:"center",color:C.white,fontSize:11,fontWeight:700,flexShrink:0}}>{u.name[0]}</div>
              <span style={{fontSize:12,fontWeight:500}}>{u.name}</span>
            </div>
            <div style={{flex:1.4,fontSize:11,color:C.textMuted}}>{u.email}</div>
            <div style={{flex:1}}><Tag>{u.role}</Tag></div>
            <div style={{flex:0.9,fontSize:11,color:C.textMuted,fontFamily:"monospace"}}>{u.mob}</div>
            <div style={{flex:0.6}}><Tag color={u.status==="Inactive"?"red":"black"}>{u.status}</Tag></div>
            <div style={{flex:1,fontSize:11,color:C.textMuted}}>{u.login}</div>
            <div style={{flex:0.8,display:"flex",gap:5}}><Btn small>Edit</Btn><Btn danger small>Deactivate</Btn></div>
          </div>
        ))}
      </div>

      {/* â”€â”€ DIALOG STATE 1: + Add User â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div style={{fontSize:11,fontWeight:700,color:C.textMuted,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:10}}>
        â†“ Dialog shown when "+ Add User" is clicked
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
          <Input label="Email Address" placeholder="raju@hoortex.com" required note="Login credential + password reset link sent here"/>
          <div style={{marginBottom:9}}>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:3,fontWeight:500}}>Role <span style={{color:C.red}}>*</span></div>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden",background:C.white}}>
              {[
                {role:"Super Admin",desc:"Full access cross-ERP for owners (Kadir Bhai, Ali Bhai)",icon:"âš™"},
                {role:"Manager",desc:"Orders, approvals, reports, payments â€” no admin settings",icon:"â—‰"},
                {role:"Office Staff",desc:"Orders, inventory, customers â€” no approvals or admin",icon:"â—«"},
                {role:"Godown Staff",desc:"Mobile app only â€” scanning, picking, dispatch, LR upload",icon:"âŠ"},
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"9px 12px",borderTop:i>0?`0.5px solid ${C.border}`:"none",background:i===3?C.bgSoft:C.white,cursor:"pointer"}}>
                  <div style={{width:16,height:16,borderRadius:"50%",border:`0.5px solid ${i===3?C.black:C.border}`,background:i===3?C.black:C.white,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                    {i===3&&<div style={{width:6,height:6,borderRadius:"50%",background:C.white}}/>}
                  </div>
                  <div>
                    <div style={{fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:6}}><span>{r.icon}</span>{r.role}</div>
                    <div style={{fontSize:10,color:C.textMuted,marginTop:1}}>{r.desc}</div>
                  </div>
                  <div style={{marginLeft:"auto"}}><span style={{fontSize:10,color:C.red,cursor:"pointer"}}>View permissions â†—</span></div>
                </div>
              ))}
            </div>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:3,fontWeight:500}}>Account Status</div>
            <div style={{display:"flex",gap:8}}>
              {["Active â—","Inactive"].map((s,i)=>(
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

      {/* â”€â”€ DIALOG STATE 2: Edit User â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div style={{fontSize:11,fontWeight:700,color:C.textMuted,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:10}}>
        â†“ Dialog shown when "Edit" is clicked on a user row
      </div>
      <div style={{position:"relative",minHeight:440,border:`1.5px dashed ${C.border}`,borderRadius:8,background:C.bgSoft}}>
        <div style={{padding:16,opacity:0.25,fontSize:11,color:C.textMuted,textAlign:"center"}}>[ User list in background ]</div>
        <Modal title="Edit User â€” Raju Singh">
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",background:C.bgSoft,borderRadius:6,marginBottom:14,border:`0.5px solid ${C.border}`}}>
            <div style={{width:40,height:40,borderRadius:"50%",background:C.black,display:"flex",alignItems:"center",justifyContent:"center",color:C.white,fontSize:16,fontWeight:700,flexShrink:0}}>R</div>
            <div>
              <div style={{fontSize:13,fontWeight:600}}>Raju Singh</div>
              <div style={{fontSize:11,color:C.textMuted}}>raju@hoortex.com Â· Last login: 04 Apr 08:45</div>
            </div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <div style={{flex:1}}><Input label="Full Name" placeholder="Raju Singh"/></div>
            <div style={{flex:1}}><Input label="Mobile" placeholder="+91 98765 43210"/></div>
          </div>
          <Input label="Email" placeholder="raju@hoortex.com" note="Changing email will require re-verification"/>
          <div style={{marginBottom:9}}>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:3,fontWeight:500}}>Change Role</div>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden"}}>
              {[
                {role:"Super Admin",desc:"Full cross-ERP access",icon:"âš™",sel:false},
                {role:"Manager",desc:"Orders, approvals, reports",icon:"â—‰",sel:false},
                {role:"Office Staff",desc:"Orders, inventory, customers",icon:"â—«",sel:false},
                {role:"Godown Staff",desc:"Mobile app â€” scan, pick, dispatch",icon:"âŠ",sel:true},
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderTop:i>0?`0.5px solid ${C.border}`:"none",background:r.sel?C.bgSoft:C.white,cursor:"pointer"}}>
                  <div style={{width:16,height:16,borderRadius:"50%",border:`0.5px solid ${r.sel?C.black:C.border}`,background:r.sel?C.black:C.white,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {r.sel&&<div style={{width:6,height:6,borderRadius:"50%",background:C.white}}/>}
                  </div>
                  <span style={{fontSize:11}}>{r.icon} {r.role}</span>
                  <span style={{fontSize:10,color:C.textMuted}}>â€” {r.desc}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{marginBottom:10}}>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:3,fontWeight:500}}>Status</div>
            <div style={{display:"flex",gap:8}}>
              {["Active â—","Inactive"].map((s,i)=>(
                <span key={i} style={{fontSize:11,padding:"5px 14px",border:`0.5px solid ${i===0?C.black:C.border}`,borderRadius:4,background:i===0?C.black:C.white,color:i===0?C.white:C.textMuted,cursor:"pointer"}}>{s}</span>
              ))}
            </div>
          </div>
          <div style={{padding:"8px 10px",background:"#fff8e1",border:`0.5px solid #f5c842`,borderRadius:4,fontSize:11,color:"#7a5c00",marginBottom:12}}>
            âš  Changing this user's role will take effect on their next login.
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
        {["Super Admin","Manager","Office Staff","Godown Staff"].map((role,i)=>(
          <span key={i} style={{fontSize:11,padding:"5px 14px",borderRadius:3,border:`0.5px solid ${i===2?C.black:C.border}`,background:i===2?C.black:C.white,color:i===2?C.white:C.textMuted,cursor:"pointer",fontWeight:i===2?600:400}}>{role}</span>
        ))}
        <Btn small>+ Add Role</Btn>
        <div style={{marginLeft:"auto",display:"flex",gap:6}}>
          <Btn small>Duplicate Role</Btn>
          <Btn danger small>Delete Role</Btn>
        </div>
      </div>
      <div style={{fontSize:11,color:C.textMuted,marginBottom:12,padding:"7px 10px",background:C.bgSoft,borderRadius:4,border:`0.5px solid ${C.border}`}}>
        Showing permissions for: <strong>Office Staff</strong> â€” Super Admin role always has full cross-ERP access and cannot be edited. Changes take effect on next login.
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
        {module:"ERP Cross-Access",perms:[{label:"Access Manufacturing ERP (GMMS)",checked:false},{label:"Access Sales ERP (Hoor Tex)",checked:true}]},
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
                  {perm.checked&&<span style={{color:C.white,fontSize:10,lineHeight:1}}>âœ“</span>}
                </div>
                <span style={{fontSize:12,color:perm.checked?C.text:C.textMuted,flex:1}}>{perm.label}</span>
                {!perm.checked&&<Tag color="red">Denied</Tag>}
              </div>
            ))}
          </div>
        </Card>
      ))}

      {/* â”€â”€ DIALOG STATE 1: + Add Role â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div style={{fontSize:11,fontWeight:700,color:C.textMuted,letterSpacing:"0.06em",textTransform:"uppercase",margin:"20px 0 10px"}}>
        â†“ Dialog shown when "+ Add Role" is clicked
      </div>
      <div style={{position:"relative",minHeight:500,border:`1.5px dashed ${C.border}`,borderRadius:8,background:C.bgSoft,marginBottom:20}}>
        <div style={{padding:16,opacity:0.25,fontSize:11,color:C.textMuted,textAlign:"center"}}>[ Permission matrix in background ]</div>
        <Modal title="Create New Role" width={500}>
          <div style={{padding:"8px 10px",background:C.bgSoft,borderRadius:4,fontSize:11,color:C.textMuted,border:`0.5px solid ${C.border}`,marginBottom:14}}>
            Define a new role name and optionally copy permissions from an existing role as a starting point.
          </div>
          <Input label="Role Name" placeholder="e.g. Accountant / Supervisor / Sales Rep" required note="This name will appear in user assignment and audit logs"/>
          <Input label="Description (optional)" placeholder="e.g. Can view orders and record payments â€” no stock access"/>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:6,fontWeight:500}}>Copy Permissions From (optional)</div>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden",background:C.white}}>
              {[
                {role:"Start with blank / no permissions",desc:"All permissions off by default",icon:"â—‹",sel:false},
                {role:"Copy from: Manager",desc:"Orders, approvals, reports, payments",icon:"â—‰",sel:false},
                {role:"Copy from: Office Staff",desc:"Orders, inventory, customers â€” no approvals",icon:"â—«",sel:true},
                {role:"Copy from: Godown Staff",desc:"Mobile only â€” scan, pick, dispatch",icon:"âŠ",sel:false},
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
            âœ“ Copying from "Office Staff" â€” you can fine-tune individual permissions after creation on the main screen.
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",paddingTop:10,borderTop:`0.5px solid ${C.border}`}}>
            <Btn>Cancel</Btn>
            <Btn primary>Create Role â†’</Btn>
          </div>
        </Modal>
      </div>

      {/* â”€â”€ DIALOG STATE 2: Delete Role confirmation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div style={{fontSize:11,fontWeight:700,color:C.textMuted,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:10}}>
        â†“ Dialog shown when "Delete Role" is clicked
      </div>
      <div style={{position:"relative",minHeight:280,border:`1.5px dashed ${C.border}`,borderRadius:8,background:C.bgSoft,marginBottom:20}}>
        <div style={{padding:16,opacity:0.25,fontSize:11,color:C.textMuted,textAlign:"center"}}>[ Permission matrix in background ]</div>
        <Modal title="Delete Role â€” Office Staff" width={420}>
          <div style={{padding:"12px 14px",background:C.redLight,border:`0.5px solid ${C.redBorder}`,borderRadius:6,marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:700,color:C.red,marginBottom:6}}>âš  This action cannot be undone</div>
            <div style={{fontSize:11,color:C.text}}>
              <strong>2 users</strong> are currently assigned to "Office Staff":
            </div>
            <div style={{marginTop:8}}>
              {["Priya Sharma Â· priya@hoortex.com","Sunita Patel Â· sunita@hoortex.com"].map((u,i)=>(
                <div key={i} style={{fontSize:11,padding:"4px 0",borderBottom:`0.5px solid ${C.redBorder}`,color:C.text}}>{u}</div>
              ))}
            </div>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:6,fontWeight:500}}>Reassign affected users to:</div>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden",background:C.white}}>
              {["Manager","Godown Staff"].map((r,i)=>(
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
        <Btn small>City â–¾</Btn><Btn small>Outstanding â–¾</Btn>
      </div>
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,overflow:"hidden",background:C.white}}>
        <TH cols={[{v:"Business Name"},{v:"Contact"},{v:"Mobile",w:1},{v:"City",w:0.7},{v:"Cr Limit",w:0.8},{v:"Cr Days",w:0.7},{v:"Outstanding",w:0.9},{v:"",w:0.6}]}/>
        {[
          {biz:"Suresh Fabrics",contact:"Suresh Shah",mob:"+91 98765 43210",city:"Surat",limit:"â‚¹50k",days:"30",outstanding:"â‚¹7,800"},
          {biz:"Deepak & Sons",contact:"Deepak Mehta",mob:"+91 91234 56789",city:"Mumbai",limit:"â‚¹1L",days:"15",outstanding:"â‚¹0"},
          {biz:"Neha Garments",contact:"Neha Shah",mob:"+91 87654 32109",city:"Delhi",limit:"â‚¹75k",days:"30",outstanding:"â‚¹22,800"},
          {biz:"Ramesh Traders",contact:"Ramesh Gupta",mob:"+91 76543 21098",city:"Ahmedabad",limit:"â‚¹30k",days:"7",outstanding:"â‚¹0"},
        ].map((c,i)=>(
          <TR key={i} cols={[{v:c.biz,bold:true},{v:c.contact},{v:c.mob,w:1,mono:true},{v:c.city,w:0.7},{v:c.limit,w:0.8},{v:c.days+"d",w:0.7},{v:c.outstanding,w:0.9,red:c.outstanding!=="â‚¹0",bold:c.outstanding!=="â‚¹0"},{v:"Edit â†—",w:0.6}]}/>
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
              <div style={{flex:1}}><Input label="Cr Limit (Credit Limit â‚¹)" placeholder="e.g. 50,000"/></div>
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
              <div style={{fontSize:11,color:C.textMuted}}>Ahmedabad Â· Gujarat</div>
            </div>
            <Divider/>
            <FR label="WhatsApp" value="+91 76543 21098"/><FR label="Cr. Days" value="30 days"/><FR label="Cr. Limit" value="â‚¹50,000"/>
            <FR label="Discount" value="5%"/><FR label="Transport" value="BlueDart"/><FR label="GST No." value="22XXXXX001A1Z5"/>
          </Card>
          <Card red>
            <div style={{fontSize:11,fontWeight:600,color:C.red}}>Required before first order</div>
            <div style={{fontSize:11,color:C.textMuted,marginTop:4}}>WhatsApp Mobile is mandatory â€” used for LR SMS on every dispatch</div>
          </Card>
          <Card>
            <SectionLabel>Welcome SMS</SectionLabel>
            <div style={{fontSize:11,color:C.textMuted,fontFamily:"monospace",background:C.bgSoft,padding:"8px 10px",borderRadius:4,marginBottom:8}}>
              "Welcome to Hoor Tex! Your wholesale account is active. Contact: 9104670469"
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
        {section:"LR & SMS",fields:[["LR Link Expiry (days)","90"],["SMS Sender Name","HOORTEX"],["Authkey.io API Key","â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"]]},
        {section:"Inventory Thresholds",fields:[["Low Stock Threshold (pcs)","10"],["Ageing Alert Day 1 (days)","30"],["Ageing Alert Day 2 (days)","60"],["Ageing Alert Day 3 (days)","90"]]},
        {section:"Credit Control",fields:[["Credit Alert Admin (days before due)","3"],["Credit Reminder Email","accountant@hoortex.com"]]},
      ].map((s,i)=>(
        <Card key={i}>
          <SectionLabel>{s.section}</SectionLabel>
          {i===2&&<div style={{fontSize:11,color:C.textMuted,marginBottom:8,padding:"5px 8px",background:C.bgSoft,borderRadius:4}}>â„¹ Low stock threshold and ageing brackets configured here apply to Stock Alert Center (Inventory â†’ Alerts)</div>}
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
        <Btn small>All Modules â–¾</Btn><Btn small>All Users â–¾</Btn><Btn small>Date Range â–¾</Btn>
      </div>
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,overflow:"hidden",background:C.white}}>
        <TH cols={[{v:"Timestamp"},{v:"User",w:0.7},{v:"Module",w:0.8},{v:"Action"},{v:"Details",w:1.4}]}/>
        {[
          {ts:"04 Apr 09:45",user:"Raju",module:"LR",action:"LR Uploaded",detail:"Order #1042, CH-881"},
          {ts:"04 Apr 09:43",user:"Raju",module:"Dispatch",action:"Stock Deducted",detail:"HT-001-RED-M Ã— 4"},
          {ts:"04 Apr 09:15",user:"Priya",module:"Payment",action:"Payment Confirmed",detail:"Order #1040, â‚¹11,400"},
          {ts:"04 Apr 08:45",user:"Admin",module:"Stock",action:"Adjustment",detail:"HT-003, -2 pcs, damaged"},
        ].map((r,i)=>(
          <TR key={i} cols={[{v:r.ts},{v:r.user,w:0.7,bold:true},{v:r.module,w:0.8},{v:r.action},{v:r.detail,w:1.4}]}/>
        ))}
      </div>
    </Content>
  </WebLayout>
),

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// CHALLAN PRINT
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

"W-39": () => (
  <WebLayout activeMenu="Orders">
    <TopBar title="Challan Print Preview" actions={[{label:"â† Back"},{label:"Print Challan",primary:true}]}/>
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
              {["72.000","â‚¹87,480.00"].map((v,i)=><div key={i} style={{flex:1}}>{v}</div>)}
            </div>
          </div>
          {/* Terms */}
          <div style={{borderTop:`0.5px solid ${C.border}`,paddingTop:8,marginBottom:10}}>
            <div style={{fontSize:10,fontWeight:700,color:C.textMuted,marginBottom:4}}>Terms & Conditions</div>
            {["We check and pack the goods carefully before dispatch","Cheque Return Charge 500 rs compulsory","Subject to SURAT Jurisdiction only"].map((t,i)=>(
              <div key={i} style={{fontSize:10,color:C.textMuted,marginBottom:2}}>â€¢ {t}</div>
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
            <FR label="Items" value="72 pcs"/><FR label="Total" value="â‚¹87,480" bold/>
          </Card>
        </div>
      </div>
    </Content>
  </WebLayout>
),

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// MOBILE SCREENS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

"M-01": () => (
  <MobileFrame>
    <div style={{background:C.black,padding:"32px 24px 24px",textAlign:"center"}}>
      <div style={{fontSize:26,fontWeight:700,color:C.white,letterSpacing:2}}><span style={{color:C.red}}>HOOR</span> TEX</div>
      <div style={{fontSize:11,color:"#888",marginTop:4}}>Hoor Tex â€” Godown App</div>
    </div>
    <div style={{padding:20}}>
      <Input label="Username" placeholder="Enter username" required/>
      <Input label="PIN / Password" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢" required/>
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
      <div style={{color:"#888",fontSize:11,marginTop:2}}>Godown Staff Â· 04 Apr 2026</div>
    </div>
    <div style={{padding:14}}>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <div style={{flex:1,background:C.black,color:C.white,borderRadius:6,padding:"14px 10px",textAlign:"center"}}>
          <div style={{fontSize:22,marginBottom:4}}>âŠ™</div><div style={{fontSize:11,fontWeight:600}}>Scan</div>
        </div>
        <div style={{flex:1,border:`0.5px solid ${C.border}`,borderRadius:6,padding:"14px 10px",textAlign:"center",background:C.white}}>
          <div style={{fontSize:22,marginBottom:4}}>+</div><div style={{fontSize:11,fontWeight:600}}>New Order</div>
        </div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <div style={{flex:1,border:`0.5px solid ${C.border}`,borderRadius:6,padding:"12px 10px",textAlign:"center",background:C.white}}>
          <div style={{fontSize:22,marginBottom:4}}>â—‰</div><div style={{fontSize:11,fontWeight:600}}>Orders</div>
          <div style={{fontSize:9,color:C.red}}>3 pending</div>
        </div>
        <div style={{flex:1,border:`0.5px solid ${C.border}`,borderRadius:6,padding:"12px 10px",textAlign:"center",background:C.white}}>
          <div style={{fontSize:22,marginBottom:4}}>âŠ</div><div style={{fontSize:11,fontWeight:600}}>Dispatch</div>
          <div style={{fontSize:9,color:C.textMuted}}>Picking & LR</div>
        </div>
      </div>
      <Card red>
        <div style={{fontSize:11,fontWeight:600,color:C.red,marginBottom:4}}>âš  Stock Alert</div>
        <div style={{fontSize:11,color:C.textMuted}}>HT-002-BLU-L â€” only 4 pcs left</div>
      </Card>
      <div style={{padding:"7px 10px",background:C.bgSoft,borderRadius:4,border:`0.5px solid ${C.border}`,fontSize:10,color:C.textMuted,textAlign:"center"}}>
        Tap â˜° Menu in bottom nav for all sections
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
        <span style={{color:C.white,fontSize:10}}>Torch â˜€</span>
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
        <FR label="Mode" value="Dispatch"/><FR label="Stock Updated" value="24 â†’ 20 pcs"/><FR label="CCTV Trigger" value="Recording started âœ“"/><FR label="Order" value="#1042"/>
      </Card>
      <div style={{display:"flex",gap:8,marginTop:10}}>
        <Btn primary>Confirm âœ“</Btn><Btn>Scan Next</Btn>
      </div>
    </div>
  </MobileFrame>
),

"M-05": () => (
  <MobileFrame>
    <MNav label="Stock In"/>
    <div style={{padding:14}}>
      <div style={{padding:"10px 12px",background:C.black,borderRadius:6,marginBottom:12,display:"flex",gap:10,alignItems:"center"}}>
        <div style={{fontSize:16,color:C.white}}>âŠ™</div>
        <div><div style={{fontSize:12,fontWeight:600,color:C.white}}>Scan to Add</div><div style={{fontSize:10,color:"#888"}}>Scan or search child SKU</div></div>
      </div>
      <div style={{textAlign:"center",marginBottom:12}}>
        <div style={{width:70,height:80,background:C.bgSoft,border:`0.5px solid ${C.border}`,borderRadius:4,margin:"0 auto 8px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:C.textLight}}>Preview</div>
        <div style={{fontSize:13,fontWeight:700}}>Solid Kurti</div>
        <div style={{fontSize:11,color:C.textMuted}}>HT-002-BLU-L</div>
      </div>
      <Input label="Quantity Received" placeholder="Enter pieces..." required/>
      <Input label="Received Date" placeholder="04 Apr 2026"/>
      <Btn primary full>Confirm Stock In âœ“</Btn>
    </div>
  </MobileFrame>
),

"M-06": () => (
  <MobileFrame>
    <MNav label="Stock Lookup"/>
    <div style={{padding:14}}>
      <div style={{padding:"10px 12px",background:C.black,borderRadius:6,marginBottom:12,display:"flex",gap:10,alignItems:"center"}}>
        <div style={{fontSize:14,color:C.white}}>âŠ™</div>
        <div><div style={{fontSize:12,fontWeight:600,color:C.white}}>Scan Parent SKU</div><div style={{fontSize:10,color:"#888"}}>or search design</div></div>
      </div>
      <div style={{textAlign:"center",marginBottom:10}}>
        <div style={{width:70,height:80,background:C.bgSoft,border:`0.5px solid ${C.border}`,borderRadius:4,margin:"0 auto 8px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:C.textLight}}>Preview</div>
        <div style={{fontSize:13,fontWeight:700}}>Floral Anarkali</div>
        <div style={{fontSize:11,color:C.textMuted}}>HT-001</div>
      </div>
      <div style={{display:"flex",gap:5,marginBottom:8,flexWrap:"wrap"}}>
        {["Red â—","Blue","Black","White"].map((c,i)=>(
          <span key={i} style={{fontSize:10,padding:"3px 8px",border:`0.5px solid ${i===0?C.black:C.border}`,borderRadius:3,background:i===0?C.black:C.white,color:i===0?C.white:C.textMuted}}>{c}</span>
        ))}
      </div>
      <div style={{display:"flex",gap:5,marginBottom:14}}>
        {["S","M â—","L","XL"].map((s,i)=>(
          <span key={i} style={{fontSize:10,padding:"3px 8px",border:`0.5px solid ${i===1?C.black:C.border}`,borderRadius:3,background:i===1?C.black:C.white,color:i===1?C.white:C.textMuted}}>{s}</span>
        ))}
      </div>
      <div style={{background:C.bgSoft,borderRadius:6,padding:14,textAlign:"center",border:`0.5px solid ${C.border}`}}>
        <div style={{fontSize:28,fontWeight:700}}>24</div>
        <div style={{fontSize:11,color:C.textMuted}}>pieces available</div>
        <div style={{fontSize:10,color:C.textLight,marginTop:2}}>Red / M â€” HT-001-RED-M</div>
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
          <div style={{fontSize:11,color:C.textMuted,marginBottom:8}}>{o.cust} Â· {o.items} items</div>
          <Btn primary small>Start Picking â†’</Btn>
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
        <FR label="Customer" value="Ramesh Traders"/><FR label="Type" value="Retail"/><FR label="Destination" value="Mumbai, MH"/><FR label="Items" value="4 pieces"/><FR label="Value" value="â‚¹3,400"/>
      </Card>
      <SectionLabel>Items to Pick</SectionLabel>
      {[{name:"Floral Anarkali",cs:"Red / M",qty:2},{name:"Solid Kurti",cs:"Blue / L",qty:2}].map((item,i)=>(
        <div key={i} style={{border:`0.5px solid ${C.border}`,borderRadius:6,padding:"10px 12px",marginBottom:8,display:"flex",gap:10}}>
          <div style={{width:36,height:40,background:C.bgSoft,borderRadius:3,border:`0.5px solid ${C.border}`,flexShrink:0}}/>
          <div>
            <div style={{fontSize:12,fontWeight:500}}>{item.name}</div>
            <div style={{fontSize:11,color:C.textMuted}}>{item.cs} Â· Qty: {item.qty}</div>
          </div>
        </div>
      ))}
      {/* Payment section */}
      <Divider label="Payment"/>
      <div style={{background:C.bgSoft,borderRadius:6,padding:"10px 12px",border:`0.5px solid ${C.border}`,marginBottom:10}}>
        <FR label="Order Value" value="â‚¹3,400"/><FR label="Paid" value="â‚¹3,400"/><FR label="Balance" value="â‚¹0"/>
      </div>
      {/* Record payment with adjustment */}
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,padding:"10px 12px",background:C.white,marginBottom:12}}>
        <div style={{fontSize:11,fontWeight:600,marginBottom:8}}>Record Payment</div>
        <Input label="Amount Received (â‚¹)" placeholder="Enter amount..."/>
        <div style={{display:"flex",gap:6,marginBottom:8}}>
          {["Cash","UPI","Bank"].map((m,i)=>(
            <div key={i} style={{flex:1,textAlign:"center",padding:"6px",border:`0.5px solid ${i===1?C.black:C.border}`,borderRadius:4,background:i===1?C.black:C.white,color:i===1?C.white:C.textMuted,fontSize:10}}>{m}</div>
          ))}
        </div>
        {/* Adjustment amount */}
        <div style={{marginBottom:8}}>
          <div style={{fontSize:11,color:C.textMuted,marginBottom:4,fontWeight:500}}>Adjustment (â‚¹) <span style={{fontWeight:400,fontSize:10}}>(optional)</span></div>
          <div style={{display:"flex",gap:6,marginBottom:4}}>
            {["âˆ’ Deduct","+ Add"].map((t,i)=>(
              <span key={i} style={{fontSize:10,padding:"3px 10px",border:`0.5px solid ${i===0?C.black:C.border}`,borderRadius:3,background:i===0?C.black:C.white,color:i===0?C.white:C.textMuted}}>{t}</span>
            ))}
          </div>
          <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,padding:"6px 8px",fontSize:12,color:C.textLight,background:C.white}}>0.00</div>
          <div style={{fontSize:10,color:C.textMuted,marginTop:3}}>e.g. waive â‚¹50 rounding, add charge</div>
        </div>
        <Input label="Remarks" placeholder="e.g. 2nd installment"/>
        <Btn primary full>Save Payment âœ“</Btn>
      </div>
      <Btn primary full>Begin Picking â†’</Btn>
    </div>
  </MobileFrame>
),

"M-09": () => (
  <MobileFrame>
    <MNav label="Pick Items â€” #1043"/>
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
              {item.done&&<span style={{color:C.white,fontSize:10}}>âœ“</span>}
            </div>
            <span style={{fontSize:11,color:item.done?C.textMuted:C.text}}>{item.name}</span>
          </div>
        ))}
      </div>
      <div style={{textAlign:"center",padding:14,background:C.black,borderRadius:6,color:C.white,fontSize:12}}>âŠ™ Scan next item...</div>
    </div>
  </MobileFrame>
),

"M-10": () => (
  <MobileFrame>
    <MNav label="Dispatch Confirmation"/>
    <div style={{padding:14}}>
      <div style={{padding:"10px 12px",background:C.greenLight,border:`0.5px solid ${C.greenBorder}`,borderRadius:6,marginBottom:12}}>
        <div style={{fontSize:12,fontWeight:600,color:C.green}}>All 4 items picked âœ“</div>
        <div style={{fontSize:11,color:C.textMuted,marginTop:2}}>All items verified â€” ready to dispatch</div>
      </div>
      <Card>
        <SectionLabel>Dispatch Summary</SectionLabel>
        <FR label="Order" value="#1043"/><FR label="Customer" value="Ramesh Traders"/><FR label="Items" value="4 pieces"/><FR label="Value" value="â‚¹3,400"/>
      </Card>
      <div style={{padding:"10px 12px",background:C.black,borderRadius:6,color:C.white,fontSize:11,marginBottom:14}}>
        <div style={{fontWeight:600,marginBottom:4}}>On confirming dispatch:</div>
        <div style={{marginBottom:2}}>â€¢ Stock deducted from inventory</div>
        <div>â€¢ Order status â†’ Dispatched</div>
      </div>
      {/* Two buttons as per spec */}
      <Btn primary full>Confirm Dispatch âœ“</Btn>
      <div style={{height:8}}/>
      <Btn success full>Confirm Dispatch + Print Challan ðŸ–¨</Btn>
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
      <SectionLabel>Step 1 â€” Find Order</SectionLabel>
      <div style={{display:"flex",gap:8,marginBottom:8}}>
        <div style={{flex:1}}><Input placeholder="Search order no. e.g. #1043..." mono/></div>
        <div style={{paddingTop:0}}><Btn small>âŠ™ Scan</Btn></div>
      </div>
      {/* Found state */}
      <div style={{padding:"8px 12px",background:C.greenLight,border:`0.5px solid ${C.greenBorder}`,borderRadius:6,marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:600,color:C.green}}>âœ“ Order #1043 Found</div>
        <div style={{fontSize:11,color:C.textMuted,marginTop:2}}>Ramesh Traders Â· 4 items Â· Dispatched</div>
        <div style={{fontSize:11,color:C.textMuted}}>Challan: CH-882</div>
      </div>
      {/* Step 2: Upload LR */}
      <SectionLabel>Step 2 â€” Upload LR Document</SectionLabel>
      <div style={{display:"flex",gap:8,marginBottom:8}}>
        <div style={{flex:1,border:`1.5px dashed ${C.border}`,borderRadius:6,padding:14,textAlign:"center",color:C.textMuted,background:C.white}}>
          <div style={{fontSize:20,marginBottom:4}}>ðŸ“·</div><div style={{fontSize:11}}>Take Photo</div>
        </div>
        <div style={{flex:1,border:`1.5px dashed ${C.border}`,borderRadius:6,padding:14,textAlign:"center",color:C.textMuted,background:C.white}}>
          <div style={{fontSize:20,marginBottom:4}}>ðŸ“„</div><div style={{fontSize:11}}>Upload PDF</div>
        </div>
      </div>
      {/* Uploaded state */}
      <div style={{padding:"8px 12px",background:C.bgSoft,border:`0.5px solid ${C.border}`,borderRadius:6,marginBottom:12,display:"flex",gap:10,alignItems:"center"}}>
        <div style={{fontSize:18}}>ðŸ“„</div>
        <div>
          <div style={{fontSize:11,fontWeight:600}}>LR_CH-882.jpg</div>
          <div style={{fontSize:10,color:C.textMuted}}>2.1 MB Â· Ready to upload</div>
        </div>
        <span style={{marginLeft:"auto",fontSize:11,color:C.red}}>âœ•</span>
      </div>
      <Btn primary full>Upload LR + Auto Send SMS â†’</Btn>
      <div style={{marginTop:8,padding:"6px 10px",background:C.bgSoft,borderRadius:4,border:`0.5px solid ${C.border}`,fontSize:10,color:C.textMuted,textAlign:"center"}}>
        SMS with LR tracking link is auto-sent to customer on upload
      </div>
      {/* Resend SMS option (shown after upload) */}
      <Divider label="After Upload"/>
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,padding:"10px 12px",background:C.white}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
          <div style={{fontSize:11,fontWeight:600}}>SMS Status</div>
          <Tag color="black">Delivered âœ“</Tag>
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
      <div style={{width:60,height:60,background:C.greenLight,border:`0.5px solid ${C.greenBorder}`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:24}}>âœ“</div>
      <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>LR Uploaded Successfully</div>
      <div style={{fontSize:11,color:C.textMuted,marginBottom:20}}>Order #1043 Â· Challan CH-882</div>
      <Card>
        <FR label="LR Document" value="Uploaded âœ“"/><FR label="SMS to Customer" value="Delivered âœ“"/><FR label="Mobile" value="+91 76543 21098"/><FR label="Sent At" value="09:48:22"/>
      </Card>
      <div style={{marginTop:14}}><Btn primary full>â† Back to Orders</Btn></div>
    </div>
  </MobileFrame>
),

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// MOBILE â€” CREATE ORDER
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

// â”€â”€ RETAIL ORDER (MOBILE) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
"M-15R": () => (
  <MobileFrame>
    <MNav label="New Retail Order"/>
    <div style={{padding:14,paddingBottom:80}}>
      {/* Type indicator */}
      <div style={{display:"flex",gap:6,marginBottom:14}}>
        <div style={{flex:1,textAlign:"center",padding:"8px",background:C.black,color:C.white,borderRadius:4,fontSize:12,fontWeight:600}}>Retail âœ“</div>
        <div style={{flex:1,textAlign:"center",padding:"8px",border:`0.5px solid ${C.border}`,borderRadius:4,fontSize:12,color:C.textMuted}}>Wholesale</div>
      </div>

      {/* Customer â€” optional for retail, quick add */}
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
        <div style={{fontWeight:600,color:C.green}}>âœ“ Ramesh Traders</div>
        <div style={{color:C.textMuted}}>+91 76543 21098 Â· Retail</div>
      </div>

      {/* Scan items â€” retail price */}
      <SectionLabel>Scan Items â€” Retail Price</SectionLabel>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <div style={{flex:1,border:`0.5px solid ${C.border}`,borderRadius:4,padding:"7px 10px",fontSize:12,color:C.textLight,background:C.white}}>Search SKU...</div>
        <div style={{background:C.black,color:C.white,borderRadius:4,padding:"7px 10px",fontSize:11,fontWeight:600}}>âŠ™</div>
      </div>
      {/* Item card â€” shows retail price, per-item discount */}
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,padding:"10px 12px",marginBottom:10}}>
        <div style={{display:"flex",gap:8,marginBottom:8}}>
          <div style={{width:38,height:44,background:C.bgSoft,borderRadius:3,border:`0.5px solid ${C.border}`,flexShrink:0}}/>
          <div style={{flex:1}}>
            <div style={{fontSize:12,fontWeight:600}}>Floral Anarkali</div>
            <div style={{fontSize:11,color:C.textMuted}}>HT-001-RED-M</div>
            <div style={{fontSize:12,fontWeight:600,color:C.text}}>â‚¹850 <span style={{fontSize:10,fontWeight:400,color:C.textMuted}}>(retail)</span></div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:24,height:24,border:`0.5px solid ${C.border}`,borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>âˆ’</div>
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
        {[{n:"Floral Red/M",q:2,d:"0%",a:"â‚¹1,700"},{n:"Solid Blue/L",q:1,d:"0%",a:"â‚¹490"}].map((item,i)=>(
          <div key={i} style={{display:"flex",gap:4,padding:"6px 10px",borderTop:`0.5px solid ${C.border}`,fontSize:11}}>
            <div style={{flex:1.5,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{item.n}</div><div style={{flex:0.4}}>{item.q}</div><div style={{flex:0.5,color:C.textMuted}}>{item.d}</div>
            <div style={{flex:0.7,fontWeight:600,textAlign:"right"}}>{item.a}</div><div style={{flex:0.3,color:C.red}}>âœ•</div>
          </div>
        ))}
        <div style={{display:"flex",justifyContent:"space-between",padding:"6px 10px",background:C.bgSoft,fontSize:12,fontWeight:700,borderTop:`0.5px solid ${C.border}`}}>
          <span>Total</span><span>â‚¹2,190</span>
        </div>
      </div>

      {/* Payment â€” typically immediate for retail */}
      <SectionLabel>Payment</SectionLabel>
      <div style={{display:"flex",gap:6,marginBottom:8}}>
        {["Cash â—","UPI","Bank"].map((m,i)=>(
          <div key={i} style={{flex:1,textAlign:"center",padding:"7px",border:`0.5px solid ${i===0?C.black:C.border}`,borderRadius:4,background:i===0?C.black:C.white,color:i===0?C.white:C.textMuted,fontSize:10}}>{m}</div>
        ))}
      </div>
      <Input label="Amount Received (â‚¹)" placeholder="â‚¹2,190" note="Full payment typical at counter"/>
      <div style={{padding:"6px 8px",background:"#edf7f1",border:`0.5px solid ${C.greenBorder}`,borderRadius:4,fontSize:10,color:C.green,marginBottom:12}}>
        âœ“ Retail: No approval needed â€” submits directly to dispatch
      </div>
      <Btn primary full>Submit + Print Challan â†’</Btn>
    </div>
  </MobileFrame>
),

// â”€â”€ WHOLESALE ORDER (MOBILE) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
"M-15W": () => (
  <MobileFrame>
    <MNav label="New Wholesale Order"/>
    <div style={{padding:14,paddingBottom:80}}>
      {/* Type indicator */}
      <div style={{display:"flex",gap:6,marginBottom:14}}>
        <div style={{flex:1,textAlign:"center",padding:"8px",border:`0.5px solid ${C.border}`,borderRadius:4,fontSize:12,color:C.textMuted}}>Retail</div>
        <div style={{flex:1,textAlign:"center",padding:"8px",background:C.black,color:C.white,borderRadius:4,fontSize:12,fontWeight:600}}>Wholesale âœ“</div>
      </div>

      {/* Customer â€” must be pre-registered */}
      <SectionLabel>Wholesale Customer *</SectionLabel>
      <div style={{fontSize:10,color:C.textMuted,marginBottom:8,padding:"5px 8px",background:C.bgSoft,borderRadius:4}}>
        Must be a registered wholesale account with credit limit set.
      </div>
      <Input placeholder="Search registered dealers by name or phone..." required/>
      {/* Dropdown */}
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,background:C.white,marginBottom:8,overflow:"hidden"}}>
        {[
          {name:"Neha Garments",phone:"+91 98765 00011",bal:"â‚¹22,800",limit:"â‚¹50k",disc:"5%"},
          {name:"Ramesh Wholesale",phone:"+91 99876 00011",bal:"â‚¹0",limit:"â‚¹30k",disc:"0%"},
        ].map((c,i)=>(
          <div key={i} style={{padding:"8px 10px",borderBottom:`0.5px solid ${C.border}`,background:i===0?C.bgSoft:C.white}}>
            <div style={{fontSize:12,fontWeight:i===0?600:400}}>{c.name}</div>
            <div style={{fontSize:10,color:C.textMuted}}>ðŸ“ž {c.phone} Â· Bal: <span style={{color:c.bal!=="â‚¹0"?C.red:C.text}}>{c.bal}</span> Â· Disc: {c.disc}</div>
          </div>
        ))}
        <div style={{padding:"8px 10px",background:C.black,fontSize:11,color:C.white,fontWeight:600}}>+ Register New Wholesale Customer â†’</div>
      </div>
      {/* Selected â€” shows credit details */}
      <div style={{padding:"8px 10px",background:C.greenLight,border:`0.5px solid ${C.greenBorder}`,borderRadius:6,marginBottom:12}}>
        <div style={{fontSize:12,fontWeight:600,color:C.green}}>âœ“ Neha Garments</div>
        <div style={{display:"flex",gap:10,marginTop:4,flexWrap:"wrap"}}>
          <span style={{fontSize:10,color:C.textMuted}}>Credit: 30d</span>
          <span style={{fontSize:10,color:C.textMuted}}>Limit: â‚¹50,000</span>
          <span style={{fontSize:10,color:C.red,fontWeight:600}}>Due: â‚¹22,800</span>
          <span style={{fontSize:10,color:C.green,fontWeight:600}}>Disc: 5%</span>
        </div>
      </div>

      {/* Scan items â€” wholesale price + auto discount */}
      <SectionLabel>Scan Items â€” Wholesale Price + 5% Discount</SectionLabel>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <div style={{flex:1,border:`0.5px solid ${C.border}`,borderRadius:4,padding:"7px 10px",fontSize:12,color:C.textLight,background:C.white}}>Search SKU...</div>
        <div style={{background:C.black,color:C.white,borderRadius:4,padding:"7px 10px",fontSize:11,fontWeight:600}}>âŠ™</div>
      </div>
      {/* Item card â€” shows wholesale price + customer discount applied */}
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,padding:"10px 12px",marginBottom:10}}>
        <div style={{display:"flex",gap:8,marginBottom:8}}>
          <div style={{width:38,height:44,background:C.bgSoft,borderRadius:3,border:`0.5px solid ${C.border}`,flexShrink:0}}/>
          <div style={{flex:1}}>
            <div style={{fontSize:12,fontWeight:600}}>Floral Anarkali</div>
            <div style={{fontSize:11,color:C.textMuted}}>HT-001-RED-M</div>
            <div style={{fontSize:11}}>W/S: â‚¹580 â†’ <strong style={{color:C.green}}>â‚¹551</strong> <span style={{fontSize:10,color:C.textMuted}}>(âˆ’5%)</span></div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:24,height:24,border:`0.5px solid ${C.border}`,borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>âˆ’</div>
            <span style={{fontSize:14,fontWeight:700}}>6</span>
            <div style={{width:24,height:24,border:`0.5px solid ${C.border}`,borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>+</div>
          </div>
        </div>
        <Btn primary small>+ Add to Order</Btn>
      </div>
      {/* Order list â€” shows net price after discount */}
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,overflow:"hidden",marginBottom:12}}>
        <div style={{display:"flex",padding:"5px 10px",background:C.bgSoft,fontSize:9,fontWeight:700,color:C.textMuted,textTransform:"uppercase"}}>
          <div style={{flex:1.5}}>Item</div><div style={{flex:0.4}}>Qty</div><div style={{flex:0.7}}>Net â‚¹</div><div style={{flex:0.7,textAlign:"right"}}>Amt</div><div style={{flex:0.3}}/>
        </div>
        {[{n:"Floral Red/M",q:6,net:"â‚¹551",a:"â‚¹3,306"},{n:"Solid Blue/L",q:4,net:"â‚¹332",a:"â‚¹1,330"}].map((item,i)=>(
          <div key={i} style={{display:"flex",gap:4,padding:"6px 10px",borderTop:`0.5px solid ${C.border}`,fontSize:11}}>
            <div style={{flex:1.5,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{item.n}</div><div style={{flex:0.4}}>{item.q}</div><div style={{flex:0.7,color:C.green}}>{item.net}</div>
            <div style={{flex:0.7,fontWeight:600,textAlign:"right"}}>{item.a}</div><div style={{flex:0.3,color:C.red}}>âœ•</div>
          </div>
        ))}
        <div style={{padding:"5px 10px",background:C.bgSoft,borderTop:`0.5px solid ${C.border}`,fontSize:11}}>
          <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:C.textMuted}}>Gross</span><span>â‚¹4,880</span></div>
          <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:C.green}}>Discount (5%)</span><span style={{color:C.green}}>âˆ’â‚¹244</span></div>
          <div style={{display:"flex",justifyContent:"space-between",fontWeight:700,marginTop:2}}><span>Net Total</span><span>â‚¹4,636</span></div>
        </div>
      </div>

      {/* Payment â€” credit option for wholesale */}
      <SectionLabel>Payment</SectionLabel>
      <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>
        {["Bank â—","UPI","Cash","Credit"].map((m,i)=>(
          <div key={i} style={{padding:"6px 10px",border:`0.5px solid ${i===0?C.black:C.border}`,borderRadius:4,background:i===0?C.black:C.white,color:i===0?C.white:C.textMuted,fontSize:10}}>{m}</div>
        ))}
      </div>
      <Input label="Amount Paid Now (â‚¹)" placeholder="â‚¹0 â€” credit allowed" note="0 = Unpaid Â· Partial = Partial Paid"/>
      <Input label="Reference no. (optional)" placeholder="UTR / Cheque no."/>

      {/* Wholesale-only fields */}
      <SectionLabel>Logistics (Wholesale Only)</SectionLabel>
      <Input label="Broker" placeholder="Broker name (if applicable)"/>
      <Input label="Transport / Carrier" placeholder="Customer's preferred transport"/>

      <div style={{padding:"6px 8px",background:"#fff8e1",border:`0.5px solid #f5c842`,borderRadius:4,fontSize:10,color:"#7a5c00",marginBottom:12}}>
        âš  Goes to Approval Queue â€” stock not deducted until admin approves
      </div>
      <Btn primary full>Submit Order + Print Challan â†’</Btn>
    </div>
  </MobileFrame>
),

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// MOBILE â€” WHOLESALE APPROVAL
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

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
        {id:"#W-1008",cust:"Ramesh Traders",items:12,val:"â‚¹18,400",time:"10 min ago",urgent:true},
        {id:"#W-1007",cust:"Suresh Fabrics",items:8,val:"â‚¹11,200",time:"1h ago",urgent:false},
      ].map((o,i)=>(
        <div key={i} style={{border:`0.5px solid ${o.urgent?C.redBorder:C.border}`,borderRadius:8,padding:12,marginBottom:10,background:o.urgent?C.redLight:C.white}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
            <div><div style={{fontSize:13,fontWeight:700,fontFamily:"monospace"}}>{o.id}</div><div style={{fontSize:11,color:C.textMuted}}>{o.cust}</div></div>
            <div style={{textAlign:"right"}}>{o.urgent&&<Tag color="red">Urgent</Tag>}<div style={{fontSize:10,color:C.textMuted,marginTop:3}}>{o.time}</div></div>
          </div>
          <div style={{display:"flex",gap:10,marginBottom:10,padding:"6px 0",borderTop:`0.5px solid ${o.urgent?C.redBorder:C.border}`,borderBottom:`0.5px solid ${o.urgent?C.redBorder:C.border}`}}>
            <div style={{textAlign:"center"}}><div style={{fontSize:14,fontWeight:700}}>{o.items}</div><div style={{fontSize:9,color:C.textMuted}}>ITEMS</div></div>
            <div style={{textAlign:"center"}}><div style={{fontSize:14,fontWeight:700}}>{o.val}</div><div style={{fontSize:9,color:C.textMuted}}>VALUE</div></div>
            <div style={{marginLeft:"auto",display:"flex",alignItems:"center"}}><span style={{fontSize:11,color:C.red,cursor:"pointer"}}>View items â†’</span></div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <div style={{flex:1,background:C.black,color:C.white,borderRadius:4,padding:"8px",textAlign:"center",fontSize:12,fontWeight:600}}>âœ“ Approve</div>
            <div style={{flex:1,background:C.white,color:C.red,border:`0.5px solid ${C.redBorder}`,borderRadius:4,padding:"8px",textAlign:"center",fontSize:12,fontWeight:600}}>âœ• Reject</div>
          </div>
        </div>
      ))}
    </div>
    <MBottomNav active="Orders"/>
  </MobileFrame>
),

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// MOBILE â€” CUSTOMER CREATE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

"M-17": () => (
  <MobileFrame>
    <MNav label="New Customer"/>
    <div style={{padding:14,paddingBottom:80}}>
      <div style={{padding:"8px 12px",background:C.black,borderRadius:6,marginBottom:14,display:"flex",gap:10,alignItems:"center"}}>
        <div style={{fontSize:14,color:C.white}}>+</div>
        <div><div style={{fontSize:12,fontWeight:600,color:C.white}}>Register New Customer</div><div style={{fontSize:10,color:"#888"}}>Wholesale account Â· Admin only</div></div>
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
        <div style={{flex:1}}><Input label="Cr Limit (â‚¹)" placeholder="50,000"/></div>
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
      <Btn primary full>Save Customer â†’</Btn>
    </div>
  </MobileFrame>
),

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// MOBILE â€” CCTV RECORDING
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

"M-19": () => (
  <MobileFrame>
    <MNav label="CCTV Recording"/>
    <div style={{padding:14}}>
      <SectionLabel>Step 1 â€” Scan or Enter Order ID</SectionLabel>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <div style={{flex:1}}><Input placeholder="Scan Order ID label or type..." mono/></div>
        <Btn small>âŠ™</Btn>
      </div>
      {/* Found state */}
      <div style={{padding:"10px 12px",background:C.greenLight,border:`0.5px solid ${C.greenBorder}`,borderRadius:6,marginBottom:8}}>
        <div style={{fontSize:12,fontWeight:600,color:C.green}}>âœ“ Order #1043 Found</div>
        <div style={{fontSize:11,marginTop:2}}>Ramesh Traders Â· 4 items</div>
        <div style={{fontSize:11,color:C.textMuted}}>Challan: CH-882</div>
      </div>
      {/* Print Label button */}
      <div style={{display:"flex",gap:8,alignItems:"center",padding:"8px 0",marginBottom:6}}>
        <Btn small>ðŸ–¨ Print Label</Btn>
        <span style={{fontSize:10,color:C.textMuted}}>Prints order ID label for scanning</span>
      </div>
      <SectionLabel>Step 2 â€” Camera</SectionLabel>
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        {["CAM-1 (Dispatch A) â—","CAM-2 (Dispatch B)"].map((c,i)=>(
          <div key={i} style={{flex:1,padding:"8px",border:`0.5px solid ${i===0?C.black:C.border}`,borderRadius:4,background:i===0?C.black:C.white,color:i===0?C.white:C.textMuted,fontSize:10,textAlign:"center"}}>{c}</div>
        ))}
      </div>
      <SectionLabel>Step 3 â€” Record</SectionLabel>
      {/* Ready state */}
      <div style={{padding:16,background:C.bgSoft,borderRadius:6,border:`0.5px solid ${C.border}`,textAlign:"center",marginBottom:10}}>
        <div style={{fontSize:11,color:C.textMuted,marginBottom:10}}>Ready Â· CAM-1 connected</div>
        <Btn success full>â–¶ Start Recording</Btn>
      </div>
      {/* Recording state */}
      <div style={{padding:16,background:C.black,borderRadius:6,textAlign:"center"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:6}}>
          <div style={{width:10,height:10,borderRadius:"50%",background:C.red}}/>
          <span style={{color:C.white,fontSize:13,fontWeight:700}}>RECORDING</span>
        </div>
        <div style={{fontSize:20,fontWeight:700,color:C.white,marginBottom:4}}>01:24</div>
        <div style={{fontSize:10,color:"#888",marginBottom:12}}>Order #1043 Â· CAM-1</div>
        <Btn danger full>â—¼ Stop & Save</Btn>
      </div>
      <div style={{marginTop:8,fontSize:10,color:C.textMuted,textAlign:"center"}}>Clip auto-linked to Order #1043 on save</div>
    </div>
  </MobileFrame>
),

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// MOBILE â€” CHALLAN PRINT
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

"M-18": () => (
  <MobileFrame>
    <MNav label="Challan Print"/>
    <div style={{padding:14}}>
      <div style={{fontSize:11,color:C.textMuted,marginBottom:12}}>Order #1043 Â· Ramesh Traders</div>
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
          Total: â‚¹5,080.00
        </div>
        <div style={{marginTop:8,color:C.textMuted,fontSize:9}}>
          â€¢ Goods checked carefully before dispatch<br/>
          â€¢ Subject to SURAT Jurisdiction
        </div>
        <div style={{textAlign:"right",marginTop:8,fontSize:9}}>Authorised Signatory ___________</div>
      </div>
      <div style={{display:"flex",gap:8}}>
        <Btn primary full>ðŸ–¨ Print Challan</Btn>
      </div>
      <div style={{marginTop:8,textAlign:"center",fontSize:11,color:C.textMuted}}>Connects to paired Bluetooth printer</div>
    </div>
  </MobileFrame>
),

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// MOBILE â€” GENERAL
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

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
        {title:"Sync completed â€” 3 items updated",time:"15m ago",type:"sync"},
        {title:"Wholesale #W-1008 approved",time:"30m ago",type:"order"},
        {title:"Payment confirmed â€” #1040",time:"1h ago",type:"order"},
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

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// MOBILE â€” SLIDE MENU
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

"M-20": () => (
  <MobileFrame menuOpen={true}>
    <MNav label="Home Dashboard"/>
    <div style={{padding:14}}>
      <div style={{padding:"20px",textAlign:"center",color:C.textMuted,fontSize:12}}>â† Tap â˜° Menu to open drawer</div>
    </div>
    <MBottomNav active="Menu"/>
  </MobileFrame>
),

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// PUBLIC
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

"P-01": () => (
  <div style={{maxWidth:420,margin:"0 auto",background:C.white,borderRadius:8,border:`0.5px solid ${C.border}`,overflow:"hidden"}}>
    <div style={{background:C.black,padding:"16px 20px"}}>
      <div style={{fontSize:16,fontWeight:700,color:C.white,letterSpacing:1}}><span style={{color:C.red}}>HOOR</span> TEX</div>
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
        <div style={{fontSize:24,marginBottom:6}}>ðŸ“„</div>
        <div style={{fontSize:12,color:C.textMuted}}>LR Document</div>
        <div style={{fontSize:10,color:C.textLight}}>Tap to view full size</div>
      </div>
      <div style={{textAlign:"center",padding:"8px 12px",background:C.bgSoft,borderRadius:4,fontSize:10,color:C.textMuted,border:`0.5px solid ${C.border}`}}>
        No login required Â· Link valid for 90 days
      </div>
    </div>
  </div>
),
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// GMMS â€” MANUFACTURING ERP SCREENS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

// G-12: Production Dashboard
"G-12": () => {
  const [erpMode,setErpMode]=useState("Manufacturing ERP");
  return(
  <WebLayout activeMenu="Dashboard" mode="mfg">
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 16px",borderBottom:`0.5px solid ${CO.accentBorder}`,background:CO.accentLight}}>
      <div><div style={{fontSize:14,fontWeight:600}}>Production Dashboard</div><div style={{fontSize:10,color:CO.accent,marginTop:1,fontWeight:500}}>07 May 2026 Â· Live</div></div>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"5px 10px",background:C.white,border:`0.5px solid ${CO.accentBorder}`,borderRadius:20}}>
          <span style={{fontSize:10,fontWeight:600,color:erpMode==="Sales ERP"?C.black:C.textMuted}}>Sales ERP</span>
          <div onClick={()=>setErpMode(erpMode==="Sales ERP"?"Manufacturing ERP":"Sales ERP")} style={{width:36,height:20,borderRadius:10,background:erpMode==="Manufacturing ERP"?CO.accent:C.border,cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0}}>
            <div style={{position:"absolute",top:3,left:erpMode==="Manufacturing ERP"?17:3,width:14,height:14,borderRadius:"50%",background:C.white,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.25)"}}/>
          </div>
          <span style={{fontSize:10,fontWeight:600,color:erpMode==="Manufacturing ERP"?CO.accent:C.textMuted}}>Manufacturing ERP</span>
        </div>
        <button style={{padding:"5px 12px",borderRadius:4,fontSize:11,fontWeight:600,border:`0.5px solid ${CO.accent}`,background:CO.accent,color:C.white,cursor:"pointer"}}>Export</button>
      </div>
    </div>
    <div style={{padding:16,background:C.bgSoft,minHeight:460}}>
      <div style={{display:"flex",gap:10,marginBottom:14}}>
        {[
          {label:"Active Challans",value:"42",sub:"12 started today"},
          {label:"Overdue Stages",value:"7",sub:"Needs attention",alert:true},
          {label:"Pieces in Production",value:"18,420",sub:"Across 42 challans"},
          {label:"Ready This Week",value:"6,800",sub:"vs last week",green:true},
          {label:"Pending Payments",value:"â‚¹2.4L",sub:"38 contractors"},
        ].map((m,i)=>(
          <div key={i} style={{flex:1,border:`0.5px solid ${m.alert?C.redBorder:m.green?C.greenBorder:CO.accentBorder}`,borderRadius:6,padding:"10px 12px",background:m.alert?C.redLight:m.green?C.greenLight:C.white}}>
            <div style={{fontSize:10,color:m.alert?C.red:m.green?C.green:CO.accent,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em"}}>{m.label}</div>
            <div style={{fontSize:20,fontWeight:700,color:m.alert?C.red:m.green?C.green:C.text}}>{m.value}</div>
            <div style={{fontSize:10,color:C.textMuted,marginTop:2}}>{m.sub}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:12,marginBottom:12}}>
        <div style={{flex:2}}>
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontSize:12,fontWeight:600}}>Active Challans â€” Overdue First</div>
              <span style={{fontSize:10,color:CO.accent,cursor:"pointer"}}>View All â†’</span>
            </div>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden"}}>
              <div style={{display:"flex",background:C.bgSoft,padding:"5px 8px",fontSize:10,fontWeight:700,color:C.textMuted,gap:6}}>
                {["C.NO","DESIGN","STAGE","CONTRACTOR","STATUS","DAYS"].map((h,i)=><div key={i} style={{flex:i===5?0.6:1}}>{h}</div>)}
              </div>
              {[
                {cno:"3202",dno:"D-710",stage:"Stitching",cont:"Ramesh K.",status:"Overdue",days:"+3",alert:true},
                {cno:"3198",dno:"D-688",stage:"Embroidery",cont:"Suresh B.",status:"On Time",days:"2"},
                {cno:"3205",dno:"D-721",stage:"Diamond",cont:"Anil T.",status:"Due Today",days:"0",warn:true},
                {cno:"3190",dno:"D-652",stage:"Stitching",cont:"Mohan D.",status:"Overdue",days:"+5",alert:true},
                {cno:"3210",dno:"D-730",stage:"Hand Work",cont:"Priya S.",status:"On Time",days:"4"},
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",gap:6,padding:"6px 8px",borderTop:`0.5px solid ${C.border}`,fontSize:11,background:r.alert?C.redLight:C.white}}>
                  <div style={{flex:1,fontFamily:"monospace",color:C.textMuted}}>{r.cno}</div>
                  <div style={{flex:1,fontWeight:600}}>{r.dno}</div>
                  <div style={{flex:1}}>{r.stage}</div>
                  <div style={{flex:1,color:C.textMuted}}>{r.cont}</div>
                  <div style={{flex:1}}><span style={{fontSize:10,fontWeight:600,color:r.alert?C.red:r.warn?"#b45309":C.green}}>{r.status}</span></div>
                  <div style={{flex:0.6,fontWeight:700,color:r.alert?C.red:C.textMuted}}>{r.days}d</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div style={{flex:1}}>
          <Card>
            <div style={{fontSize:12,fontWeight:600,marginBottom:10}}>Top Contractors â€” This Month</div>
            {[
              {name:"Ramesh Kadkiya",type:"Embroidery",score:98,pcs:"4,200"},
              {name:"Suresh Bhai",type:"Stitching",score:94,pcs:"3,800"},
              {name:"Anil Thakkar",type:"Diamond",score:91,pcs:"2,100"},
              {name:"Mohan Das",type:"Hand Work",score:88,pcs:"1,900"},
            ].map((c,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:`0.5px solid ${C.border}`}}>
                <div style={{width:22,height:22,borderRadius:"50%",background:CO.accent,color:C.white,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0}}>#{i+1}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,fontWeight:500}}>{c.name}</div>
                  <div style={{fontSize:10,color:C.textMuted}}>{c.type} Â· {c.pcs} pcs</div>
                </div>
                <div style={{fontSize:12,fontWeight:700,color:C.green}}>{c.score}%</div>
              </div>
            ))}
          </Card>
          <Card red>
            <div style={{fontSize:11,fontWeight:600,color:C.red,marginBottom:8}}>RF Pending â€” 14 Items</div>
            {[["D-710 / 3202","Ramesh K.","Day 8 â€” Final Warning"],["D-688 / 3198","Priya S.","Day 5 â€” Reminder 1"]].map(([challan,cont,status],i)=>(
              <div key={i} style={{fontSize:11,padding:"4px 0",borderBottom:`0.5px solid ${C.redBorder}`}}>
                <div style={{fontWeight:500}}>{challan} Â· {cont}</div>
                <div style={{fontSize:10,color:C.red}}>{status}</div>
              </div>
            ))}
          </Card>
        </div>
      </div>
      <Card>
        <div style={{fontSize:12,fontWeight:600,marginBottom:10}}>Pieces by Job Work Stage â€” Today</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {[
            {stage:"Embroidery",pcs:4200,color:"#8e44ad"},
            {stage:"Stitching",pcs:3100,color:"#2980b9"},
            {stage:"Diamond",pcs:2800,color:"#27ae60"},
            {stage:"Cut Work",pcs:1900,color:"#e67e22"},
            {stage:"Hand Work",pcs:1600,color:"#c0392b"},
            {stage:"Dupatta",pcs:1400,color:"#16a085"},
            {stage:"Lace",pcs:900,color:"#d35400"},
            {stage:"Ready Count",pcs:2420,color:"#1a7a4a"},
          ].map((s,i)=>(
            <div key={i} style={{border:`0.5px solid ${C.border}`,borderRadius:4,padding:"6px 10px",background:C.white,display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:s.color,flexShrink:0}}/>
              <div style={{fontSize:11}}>{s.stage}</div>
              <div style={{fontSize:12,fontWeight:700,color:s.color}}>{s.pcs.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </WebLayout>
  );
},
// G-01: Challan List
"G-01": () => (
  <WebLayout activeMenu="Challans" mode="mfg">
    <GTopBar title="Challan List" sub="All production challans" actions={[{label:"+ New Challan",primary:true},{label:"Export"}]}/>
    <div style={{padding:16,background:C.bgSoft,minHeight:460}}>
      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
        <div style={{flex:1,border:`0.5px solid ${C.border}`,borderRadius:4,padding:"7px 10px",fontSize:12,color:C.textLight,background:C.white,minWidth:200}}>Search by Challan No, Design No, Contractor...</div>
        <button style={{padding:"6px 12px",border:`0.5px solid ${C.border}`,borderRadius:4,fontSize:11,background:C.white,cursor:"pointer"}}>Status â–¾</button>
        <button style={{padding:"6px 12px",border:`0.5px solid ${C.border}`,borderRadius:4,fontSize:11,background:C.white,cursor:"pointer"}}>Job Work Type â–¾</button>
        <button style={{padding:"6px 12px",border:`0.5px solid ${C.border}`,borderRadius:4,fontSize:11,background:C.white,cursor:"pointer"}}>Date Range â–¾</button>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:12}}>
        {["All (127)","In Progress (42)","Overdue (7)","Completed (68)","Cancelled (10)"].map((f,i)=>(
          <span key={i} style={{fontSize:11,padding:"4px 10px",borderRadius:3,border:`0.5px solid ${i===0?C.black:i===2?C.redBorder:C.border}`,background:i===0?C.black:i===2?C.redLight:C.white,color:i===0?C.white:i===2?C.red:C.textMuted,cursor:"pointer"}}>{f}</span>
        ))}
      </div>
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,overflow:"hidden",background:C.white}}>
        <div style={{display:"flex",background:C.bgSoft,padding:"6px 10px",fontSize:10,fontWeight:700,color:C.textMuted,gap:6}}>
          {["C.NO","DATE","D.NO","DESIGN","PIECES","FLOW","CURRENT STAGE","STATUS","ACTIONS"].map((h,i)=><div key={i} style={{flex:i===8?1.4:i===5?1.5:1}}>{h}</div>)}
        </div>
        {[
          {cno:"3210",date:"07 May",dno:"D-730",name:"Floral Embr. Set",pcs:600,flow:"EMBâ†’STHâ†’DIAâ†’PKG",stage:"Embroidery",status:"In Progress"},
          {cno:"3209",date:"06 May",dno:"D-710",name:"Solid Anarkali",pcs:480,flow:"STHâ†’CUTâ†’HND",stage:"Stitching",status:"Overdue",alert:true},
          {cno:"3208",date:"06 May",dno:"D-721",name:"Block Print Set",pcs:360,flow:"DIGâ†’STHâ†’LAC",stage:"Digital Print",status:"In Progress"},
          {cno:"3205",date:"05 May",dno:"D-688",name:"Georgette Suit",pcs:240,flow:"EMBâ†’DIAâ†’STHâ†’DUP",stage:"Diamond",status:"In Progress"},
          {cno:"3200",date:"03 May",dno:"D-652",name:"Embr. Dupatta",pcs:800,flow:"EMBâ†’STHâ†’LAT",stage:"Completed",status:"Completed",green:true},
        ].map((r,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 10px",borderTop:`0.5px solid ${C.border}`,fontSize:11,background:r.alert?C.redLight:C.white}}>
            <div style={{flex:1,fontFamily:"monospace",fontWeight:600,color:CO.accent}}>{r.cno}</div>
            <div style={{flex:1,color:C.textMuted}}>{r.date}</div>
            <div style={{flex:1,fontFamily:"monospace",fontSize:10,color:C.textMuted}}>{r.dno}</div>
            <div style={{flex:1,fontWeight:500}}>{r.name}</div>
            <div style={{flex:1,fontWeight:600}}>{r.pcs}</div>
            <div style={{flex:1.5,fontSize:9,fontFamily:"monospace",color:C.textMuted}}>{r.flow}</div>
            <div style={{flex:1}}>{r.stage}</div>
            <div style={{flex:1}}><span style={{fontSize:10,fontWeight:600,color:r.alert?C.red:r.green?C.green:CO.accent,background:r.alert?C.redLight:r.green?C.greenLight:CO.accentLight,padding:"2px 6px",borderRadius:3,border:`0.5px solid ${r.alert?C.redBorder:r.green?C.greenBorder:CO.accentBorder}`}}>{r.status}</span></div>
            <div style={{flex:1.4,display:"flex",gap:4}}>
              <button style={{padding:"3px 8px",fontSize:10,border:`0.5px solid ${C.border}`,borderRadius:3,background:C.white,cursor:"pointer"}}>Track</button>
              <button style={{padding:"3px 8px",fontSize:10,border:`0.5px solid ${C.border}`,borderRadius:3,background:C.white,cursor:"pointer"}}>Edit</button>
              <button style={{padding:"3px 8px",fontSize:10,border:`0.5px solid ${C.border}`,borderRadius:3,background:C.white,cursor:"pointer"}}>Print</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </WebLayout>
),

// G-02: Create Challan
"G-02": () => (
  <WebLayout activeMenu="Challans" mode="mfg">
    <GTopBar title="Create New Challan" sub="Define job work flow, assign contractors, set timelines" actions={[{label:"Confirm & Notify",primary:true},{label:"Save Draft"},{label:"Cancel"}]}/>
    <div style={{padding:16,background:C.bgSoft,minHeight:460}}>
      <div style={{display:"flex",gap:12}}>
        <div style={{flex:2}}>
          <Card>
            <SectionLabel>Challan Header</SectionLabel>
            <div style={{display:"flex",gap:10,marginBottom:4}}>
              <div style={{flex:1}}><Input label="Challan No (Auto)" placeholder="3211" mono/></div>
              <div style={{flex:1}}><Input label="Date" placeholder="07 May 2026"/></div>
            </div>
            <Input label="Design Number (D.No)" placeholder="e.g. D-730" required note="Auto-fills all design details on entry"/>
            <div style={{border:`1px solid ${C.redBorder}`,borderRadius:6,padding:"10px 12px",background:C.redLight,marginTop:4}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <div style={{fontSize:11,fontWeight:700,color:C.red}}>Repeat Design Alert â€” D-730</div>
                <span style={{fontSize:9,color:C.textMuted}}>2 prior runs</span>
              </div>
              <div style={{fontSize:11,color:C.text,marginBottom:4}}><strong>Run #3209 (06 May):</strong> 2 dupattas missing lace. Lace contractor 3 days late.</div>
              <div style={{fontSize:11,color:C.text,marginBottom:8}}><strong>Run #3198 (28 Apr):</strong> Fabric overconsumption at embroidery â€” 6 pieces short.</div>
              <button style={{padding:"5px 14px",background:C.red,color:C.white,border:"none",borderRadius:4,fontSize:11,fontWeight:600,cursor:"pointer",width:"100%"}}>Acknowledged â€” Open Form</button>
            </div>
          </Card>
          <Card>
            <SectionLabel>Lot Details â€” Colour Breakdown</SectionLabel>
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
                  <div style={{flex:0.5,color:C.red,cursor:"pointer",textAlign:"center"}}>âœ•</div>
                </div>
              ))}
            </div>
            <button style={{padding:"5px 12px",border:`0.5px solid ${CO.accentBorder}`,background:CO.accentLight,borderRadius:4,fontSize:11,color:CO.accent,fontWeight:600,cursor:"pointer"}}>+ Add Colour</button>
          </Card>
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <SectionLabel>Job Work Flow</SectionLabel>
              <div style={{fontSize:10,color:C.textMuted}}>Min 3 Â· Max 13 Â· drag to reorder</div>
            </div>
            {[
              {step:1,type:"Embroidery",code:"EMB",cont:"Ramesh Kadkiya",days:10,ok:true},
              {step:2,type:"Stitching",code:"STH",cont:"Suresh Bhai",days:6,ok:true},
              {step:3,type:"Diamond",code:"DIA",cont:"Select contractor...",days:4,ok:false},
              {step:4,type:"Lace Work",code:"LAC",cont:"Mohan Das",days:2,ok:true},
            ].map((s,i)=>(
              <div key={i} style={{border:`0.5px solid ${s.ok?CO.accentBorder:C.border}`,borderRadius:4,padding:"8px 10px",marginBottom:6,background:s.ok?CO.accentLight:C.bgSoft,display:"flex",alignItems:"center",gap:8}}>
                <span style={{color:C.textMuted,cursor:"grab",fontSize:12,flexShrink:0}}>â‹®â‹®</span>
                <div style={{width:20,height:20,borderRadius:"50%",background:s.ok?CO.accent:C.border,color:C.white,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0}}>{s.step}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,fontWeight:600}}>{s.type} <span style={{fontFamily:"monospace",fontSize:9,color:CO.accent}}>/{s.code}</span></div>
                  <div style={{fontSize:10,color:s.ok?C.textMuted:C.textLight}}>{s.cont}</div>
                </div>
                <div style={{fontSize:11,color:C.textMuted,flexShrink:0}}>{s.days}d</div>
                <span style={{fontSize:14,color:C.red,cursor:"pointer"}}>âœ•</span>
              </div>
            ))}
            <button style={{width:"100%",padding:"7px",border:`1.5px dashed ${CO.accentBorder}`,background:CO.accentLight,borderRadius:4,fontSize:11,color:CO.accent,fontWeight:600,cursor:"pointer"}}>+ Add Stage</button>
          </Card>
        </div>
        <div style={{flex:1}}>
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
              <div style={{fontSize:11,fontWeight:600,color:CO.accent}}>1 flow active â€” 600 pcs</div>
            </div>
            <button style={{width:"100%",padding:"6px",border:`0.5px solid ${CO.accentBorder}`,background:C.white,borderRadius:4,fontSize:11,color:CO.accent,fontWeight:600,cursor:"pointer"}}>+ Split into Parallel Flow</button>
          </Card>
          <Card>
            <SectionLabel>Notes / Remarks</SectionLabel>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,padding:"8px 10px",fontSize:12,color:C.textLight,background:C.white,minHeight:60}}>Add specific instructions for this production run...</div>
            <div style={{fontSize:10,color:C.textMuted,marginTop:4}}>Notes stored against D.No â€” appear on all future runs.</div>
          </Card>
          <Card style={{background:CO.accentLight,border:`0.5px solid ${CO.accentBorder}`}}>
            <SectionLabel>On Confirm</SectionLabel>
            {["Generate Challan No 3211","SMS + push to Ramesh Kadkiya (EMB)","Challan print-ready","Logged in audit trail"].map((a,i)=>(
              <div key={i} style={{fontSize:11,color:C.text,padding:"3px 0",display:"flex",alignItems:"center",gap:6}}>
                <span style={{color:C.green,fontWeight:700}}>âœ“</span>{a}
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  </WebLayout>
),

// G-03: Challan Tracking
"G-03": () => (
  <WebLayout activeMenu="Challans" mode="mfg">
    <GTopBar title="Challan Tracking â€” #3210" sub="D-730 Â· Floral Embroidery Set Â· 600 pcs Â· Started 07 May 2026" actions={[{label:"Add Note"},{label:"Print Challan",primary:true}]}/>
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
                    {s.status==="completed"&&<span style={{color:C.white,fontSize:9,fontWeight:700}}>âœ“</span>}
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
                      {s.conf&&<span style={{color:s.conf<s.sent?C.red:C.green}}>Confirmed: <strong>{s.conf}</strong>{s.conf<s.sent&&<span style={{color:C.red}}> (âˆ’{s.sent-s.conf} dispute)</span>}</span>}
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
            {[["Challan No","3210"],["Design No","D-730"],["Total Pieces","600"],["Colours","Pink/Blue/Cream Ã— 200 each"],["Flow","4 stages + Ready Count"],["Started","07 May 2026"],["Expected Completion","01 Jun 2026"]].map(([l,v],i)=>(
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
                  <span>{n.author} Â· {n.stage}</span><span>{n.time}</span>
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
// G-04: Contractor List
"G-04": () => (
  <WebLayout activeMenu="Contractors" mode="mfg">
    <GTopBar title="Contractor List" sub="~1,300 registered Â· sorted by workload" actions={[{label:"+ Add Contractor",primary:true},{label:"Export"}]}/>
    <div style={{padding:16,background:C.bgSoft,minHeight:460}}>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <div style={{flex:1,border:`0.5px solid ${C.border}`,borderRadius:4,padding:"7px 10px",fontSize:12,color:C.textLight,background:C.white}}>Search by name, code, job work type...</div>
        <button style={{padding:"6px 12px",border:`0.5px solid ${C.border}`,borderRadius:4,fontSize:11,background:C.white,cursor:"pointer"}}>Job Work Type â–¾</button>
        <button style={{padding:"6px 12px",border:`0.5px solid ${C.border}`,borderRadius:4,fontSize:11,background:C.white,cursor:"pointer"}}>Status â–¾</button>
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
),

// G-05: Contractor Detail
"G-05": () => (
  <WebLayout activeMenu="Contractors" mode="mfg">
    <GTopBar title="Contractor â€” Ramesh Kadkiya" sub="Code C-006 Â· Embroidery Â· Registered 12 Jan 2025" actions={[{label:"Edit"},{label:"Pay Now",primary:true}]}/>
    <div style={{padding:16,background:C.bgSoft,minHeight:460}}>
      <div style={{display:"flex",gap:12}}>
        <div style={{width:200,flexShrink:0}}>
          <Card>
            <div style={{width:48,height:48,borderRadius:"50%",background:CO.accent,color:C.white,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:700,marginBottom:8}}>R</div>
            <div style={{fontSize:13,fontWeight:700}}>Ramesh Kadkiya</div>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:8}}>Code C-006 Â· Embroidery</div>
            <div style={{padding:"4px 8px",background:C.greenLight,border:`0.5px solid ${C.greenBorder}`,borderRadius:3,fontSize:10,fontWeight:600,color:C.green,marginBottom:8}}>Active</div>
            {[["Phone","98250-XXXXX"],["Bank","HDFC â€” Savings"],["Joined","12 Jan 2025"]].map(([l,v],i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:11,padding:"4px 0",borderBottom:`0.5px solid ${C.border}`}}>
                <span style={{color:C.textMuted}}>{l}</span><span>{v}</span>
              </div>
            ))}
          </Card>
          <Card>
            <SectionLabel>Performance</SectionLabel>
            {[["Avg Turnaround","9.2 days"],["Total Pieces","48,200"],["Rejection Rate","1.2%"],["Challans Done","142"],["RF Issued","3"]].map(([l,v],i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:11,padding:"4px 0",borderBottom:`0.5px solid ${C.border}`}}>
                <span style={{color:C.textMuted}}>{l}</span><span style={{fontWeight:600}}>{v}</span>
              </div>
            ))}
          </Card>
        </div>
        <div style={{flex:1}}>
          <div style={{display:"flex",gap:10,marginBottom:12}}>
            {[["Pending Balance","â‚¹18,400",false],["Eligible Now","â‚¹12,200",true],["This Month Paid","â‚¹44,000",false]].map(([l,v,green],i)=>(
              <div key={i} style={{flex:1,border:`0.5px solid ${green?C.greenBorder:CO.accentBorder}`,borderRadius:6,padding:"10px 12px",background:green?C.greenLight:CO.accentLight}}>
                <div style={{fontSize:10,color:green?C.green:CO.accent,textTransform:"uppercase",marginBottom:4}}>{l}</div>
                <div style={{fontSize:20,fontWeight:700,color:green?C.green:CO.accent}}>{v}</div>
              </div>
            ))}
          </div>
          <Card>
            <div style={{fontSize:12,fontWeight:600,marginBottom:10}}>Ledger â€” Payment History</div>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden"}}>
              <div style={{display:"flex",background:C.bgSoft,padding:"5px 8px",fontSize:10,fontWeight:700,color:C.textMuted,gap:8}}>
                {["DATE","CHALLAN","DESCRIPTION","CREDIT","DEBIT","BALANCE"].map((h,i)=><div key={i} style={{flex:1}}>{h}</div>)}
              </div>
              {[
                {date:"05 May",ch:"3198",desc:"EMB work â€” 480 pcs",cr:"â‚¹14,400",db:"â€”",bal:"â‚¹18,400"},
                {date:"02 May",ch:"3190",desc:"Payment â€” Google Pay",cr:"â€”",db:"â‚¹20,000",bal:"â‚¹4,000",paid:true},
                {date:"28 Apr",ch:"3180",desc:"EMB work â€” 360 pcs",cr:"â‚¹10,800",db:"â€”",bal:"â‚¹24,000"},
                {date:"25 Apr",ch:"3180",desc:"RF deduction â€” 2 pcs",cr:"â€”",db:"â‚¹600",bal:"â‚¹13,200",ded:true},
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",gap:8,padding:"6px 8px",borderTop:`0.5px solid ${C.border}`,fontSize:11,background:r.paid?C.greenLight:r.ded?C.redLight:C.white}}>
                  <div style={{flex:1,color:C.textMuted}}>{r.date}</div>
                  <div style={{flex:1,fontFamily:"monospace",color:CO.accent}}>{r.ch}</div>
                  <div style={{flex:1}}>{r.desc}</div>
                  <div style={{flex:1,color:C.green,fontWeight:r.cr!=="â€”"?600:400}}>{r.cr}</div>
                  <div style={{flex:1,color:C.red,fontWeight:r.db!=="â€”"?600:400}}>{r.db}</div>
                  <div style={{flex:1,fontWeight:600}}>{r.bal}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  </WebLayout>
),

// G-06: Ready Piece Count
"G-06": () => (
  <WebLayout activeMenu="Production" mode="mfg">
    <GTopBar title="Ready Piece Count" sub="Final validation Â· Three-way match: Challan â†’ Count â†’ Packing" actions={[{label:"Submit Count",primary:true},{label:"Save Draft"}]}/>
    <div style={{padding:16,background:C.bgSoft,minHeight:460}}>
      <div style={{display:"flex",gap:12}}>
        <div style={{flex:2}}>
          <Card>
            <SectionLabel>Challan Number</SectionLabel>
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              <div style={{flex:1,border:`0.5px solid ${CO.accentBorder}`,borderRadius:4,padding:"8px 12px",fontSize:14,fontFamily:"monospace",fontWeight:700,background:CO.accentLight,color:CO.accent}}>3210</div>
              <button style={{padding:"8px 16px",background:CO.accent,color:C.white,border:"none",borderRadius:4,fontSize:12,fontWeight:600,cursor:"pointer"}}>Scan</button>
            </div>
            <div style={{padding:"8px 10px",background:CO.accentLight,border:`0.5px solid ${CO.accentBorder}`,borderRadius:4,marginBottom:12}}>
              <div style={{display:"flex",gap:16,fontSize:11}}>
                <span><strong>D.No:</strong> D-730</span>
                <span><strong>Design:</strong> Floral Embroidery Set</span>
                <span><strong>Expected:</strong> 600 pcs (200 per colour)</span>
              </div>
            </div>
          </Card>
          <Card>
            <SectionLabel>Count Entry â€” Per Component Ã— Per Colour</SectionLabel>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden"}}>
              <div style={{display:"flex",background:C.bgSoft,padding:"6px 10px",fontSize:10,fontWeight:700,color:C.textMuted,gap:6}}>
                <div style={{flex:1.5}}>COMPONENT</div>
                {["PINK","BLUE","CREAM","ROW TOTAL","EXPECTED"].map((h,i)=><div key={i} style={{flex:1,textAlign:"center"}}>{h}</div>)}
              </div>
              {[
                {comp:"Top",vals:[198,200,199],exp:[200,200,200]},
                {comp:"Bottom (Russian)",vals:[200,200,200],exp:[200,200,200]},
                {comp:"Dupatta",vals:[196,198,200],exp:[200,200,200]},
              ].map((r,i)=>{
                const total=r.vals.reduce((s,v)=>s+v,0);
                const expTotal=r.exp.reduce((a,b)=>a+b,0);
                return(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 10px",borderTop:`0.5px solid ${C.border}`,fontSize:11,background:total<expTotal?C.redLight:C.white}}>
                    <div style={{flex:1.5,fontWeight:600}}>{r.comp}</div>
                    {r.vals.map((v,j)=>(
                      <div key={j} style={{flex:1,border:`0.5px solid ${v<r.exp[j]?C.redBorder:C.border}`,borderRadius:3,padding:"4px 6px",background:v<r.exp[j]?C.redLight:C.white,fontWeight:600,textAlign:"center",color:v<r.exp[j]?C.red:C.text}}>{v}</div>
                    ))}
                    <div style={{flex:1,fontWeight:700,textAlign:"center",color:total<expTotal?C.red:C.green}}>{total}</div>
                    <div style={{flex:1,textAlign:"center",color:C.textMuted}}>{expTotal}</div>
                  </div>
                );
              })}
              <div style={{display:"flex",gap:6,padding:"7px 10px",borderTop:`1px solid ${C.border}`,fontSize:11,fontWeight:700,background:C.bgSoft}}>
                <div style={{flex:1.5}}>TOTAL</div>
                {[594,598,599].map((v,i)=><div key={i} style={{flex:1,textAlign:"center",color:v<600?C.red:C.green}}>{v}</div>)}
                <div style={{flex:1,textAlign:"center",color:C.red}}>1,791</div>
                <div style={{flex:1,textAlign:"center",color:C.textMuted}}>1,800</div>
              </div>
            </div>
            <div style={{marginTop:8,padding:"8px 10px",background:C.redLight,border:`0.5px solid ${C.redBorder}`,borderRadius:4}}>
              <div style={{fontSize:11,fontWeight:700,color:C.red,marginBottom:4}}>Shortage â€” 9 pcs short of 1,800 expected</div>
              <div style={{fontSize:11,color:C.text}}>Last stage: Lace Work â€” Mohan Das (C-045). Auto-assigned pending investigation.</div>
            </div>
          </Card>
          <Card>
            <SectionLabel>Count Remarks</SectionLabel>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,padding:"8px 10px",background:C.white,fontSize:12,color:C.textLight,minHeight:50}}>e.g. "3 Dupattas missing lace, 2 Tops wrong color stitch"</div>
          </Card>
        </div>
        <div style={{flex:1}}>
          <Card style={{background:CO.accentLight,border:`0.5px solid ${CO.accentBorder}`}}>
            <SectionLabel>Three-Way Match</SectionLabel>
            {[["Challan Outward","600 pcs","âœ“"],["Count Inward","1,791 pcs","âœ— âˆ’9"],["Packing Outward","Pending","â€”"]].map(([l,v,st],i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:`0.5px solid ${CO.accentBorder}`,fontSize:11}}>
                <span style={{color:C.textMuted}}>{l}</span>
                <span style={{fontWeight:600}}>{v}</span>
                <span style={{fontWeight:700,color:st==="âœ“"?C.green:st==="â€”"?C.textMuted:C.red}}>{st}</span>
              </div>
            ))}
          </Card>
          <Card>
            <SectionLabel>On Submission</SectionLabel>
            {["Inventory auto-updated in Hoor Tex Sales ERP","Payment eligibility triggered for last-stage contractor","Shortage flagged to Owner + Operator","RF module pre-filled","SKU barcode linking triggered"].map((a,i)=>(
              <div key={i} style={{fontSize:11,color:C.text,padding:"3px 0",display:"flex",alignItems:"center",gap:6}}>
                <span style={{color:CO.accent,fontWeight:700}}>â†’</span>{a}
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  </WebLayout>
),

// G-07: Payment & Checking
"G-07": () => (
  <WebLayout activeMenu="Production" mode="mfg">
    <GTopBar title="Payment & Checking" sub="Next-stage confirmation triggers payment eligibility" actions={[{label:"Process Payment",primary:true},{label:"Export"}]}/>
    <div style={{padding:16,background:C.bgSoft,minHeight:460}}>
      <div style={{display:"flex",gap:6,marginBottom:12}}>
        {["All Stages","Eligible Now (12)","Disputed (3)","Processing","Paid"].map((f,i)=>(
          <span key={i} style={{fontSize:11,padding:"4px 10px",borderRadius:3,border:`0.5px solid ${i===0?C.black:i===2?C.redBorder:C.border}`,background:i===0?C.black:i===2?C.redLight:C.white,color:i===0?C.white:i===2?C.red:C.textMuted,cursor:"pointer"}}>{f}</span>
        ))}
      </div>
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,overflow:"hidden",background:C.white}}>
        <div style={{display:"flex",background:C.bgSoft,padding:"6px 10px",fontSize:10,fontWeight:700,color:C.textMuted,gap:6}}>
          {["CHALLAN","CONTRACTOR","STAGE","SENT","CONFIRMED","SHORT","RATE","ELIGIBLE","STATUS","ACTION"].map((h,i)=><div key={i} style={{flex:1}}>{h}</div>)}
        </div>
        {[
          {cno:"3202",cont:"Ramesh K.",stage:"EMB",sent:600,conf:600,short:0,rate:"â‚¹30",amt:"â‚¹18,000",status:"Eligible",green:true},
          {cno:"3198",cont:"Suresh B.",stage:"STH",sent:480,conf:478,short:2,rate:"â‚¹25",amt:"â‚¹11,950",status:"Disputed",alert:true},
          {cno:"3205",cont:"Anil T.",stage:"DIA",sent:240,conf:240,short:0,rate:"â‚¹40",amt:"â‚¹9,600",status:"Processing"},
          {cno:"3190",cont:"Mohan D.",stage:"HND",sent:360,conf:360,short:0,rate:"â‚¹20",amt:"â‚¹7,200",status:"Paid",muted:true},
          {cno:"3210",cont:"Ramesh K.",stage:"EMB",sent:600,conf:null,short:null,rate:"â‚¹30",amt:"â€”",status:"Pending Conf."},
        ].map((r,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 10px",borderTop:`0.5px solid ${C.border}`,fontSize:11,background:r.alert?C.redLight:r.muted?C.bgSoft:C.white}}>
            <div style={{flex:1,fontFamily:"monospace",color:CO.accent,fontWeight:600}}>{r.cno}</div>
            <div style={{flex:1}}>{r.cont}</div>
            <div style={{flex:1,fontFamily:"monospace",fontSize:10,color:C.textMuted}}>/{r.stage}</div>
            <div style={{flex:1}}>{r.sent}</div>
            <div style={{flex:1,color:r.conf&&r.conf<r.sent?C.red:C.text}}>{r.conf!=null?r.conf:"â€”"}</div>
            <div style={{flex:1,color:r.short>0?C.red:C.textMuted,fontWeight:r.short>0?600:400}}>{r.short!=null?(r.short>0?`âˆ’${r.short}`:"âœ“"):"â€”"}</div>
            <div style={{flex:1,color:C.textMuted}}>{r.rate}</div>
            <div style={{flex:1,fontWeight:600}}>{r.amt}</div>
            <div style={{flex:1}}><span style={{fontSize:10,fontWeight:600,color:r.alert?C.red:r.green?C.green:r.muted?C.textMuted:CO.accent,background:r.alert?C.redLight:r.green?C.greenLight:r.muted?C.bgSoft:CO.accentLight,padding:"2px 5px",borderRadius:3}}>{r.status}</span></div>
            <div style={{flex:1}}>
              {r.green&&<button style={{padding:"3px 8px",fontSize:10,background:C.green,color:C.white,border:"none",borderRadius:3,cursor:"pointer"}}>Pay</button>}
              {r.alert&&<button style={{padding:"3px 8px",fontSize:10,background:"#fef08a",color:"#854d0e",border:`0.5px solid #eab308`,borderRadius:3,cursor:"pointer"}}>Send to RF</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  </WebLayout>
),
// G-08: RF Management
"G-08": () => (
  <WebLayout activeMenu="RF / Returns" mode="mfg">
    <GTopBar title="RF (Alter \/ Refinish) — Return \/ Rejected Fabric" sub="Auto-deduction on Day 10 if not returned" actions={[{label:"+ New RF Entry",primary:true}]}/>
    <div style={{padding:16,background:C.bgSoft,minHeight:460}}>
      <div style={{display:"flex",gap:10,marginBottom:12}}>
        {[{l:"Active RF",v:"14",alert:true},{l:"Returned Today",v:"3",green:true},{l:"Deducted (Month)",v:"7"},{l:"Pending > Day 8",v:"4",alert:true}].map((m,i)=>(
          <div key={i} style={{flex:1,border:`0.5px solid ${m.alert?C.redBorder:m.green?C.greenBorder:CO.accentBorder}`,borderRadius:6,padding:"10px 12px",background:m.alert?C.redLight:m.green?C.greenLight:C.white}}>
            <div style={{fontSize:10,color:m.alert?C.red:m.green?C.green:CO.accent,textTransform:"uppercase",marginBottom:4}}>{m.l}</div>
            <div style={{fontSize:20,fontWeight:700,color:m.alert?C.red:m.green?C.green:C.text}}>{m.v}</div>
          </div>
        ))}
      </div>
      <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,overflow:"hidden",background:C.white,marginBottom:12}}>
        <div style={{display:"flex",background:C.bgSoft,padding:"6px 10px",fontSize:10,fontWeight:700,color:C.textMuted,gap:6}}>
          {["RF ID","DATE","CHALLAN","CONTRACTOR","PCS","DEFECT","DAY","NEXT ACTION","STATUS"].map((h,i)=><div key={i} style={{flex:1}}>{h}</div>)}
        </div>
        {[
          {id:"RF-441",date:"29 Apr",cno:"3198",cont:"Suresh B.",pcs:"PinkÃ—2,BlueÃ—1",type:"Repairable",day:8,action:"Final Reminder",status:"Pending",alert:true},
          {id:"RF-438",date:"27 Apr",cno:"3190",cont:"Ramesh K.",pcs:"CreamÃ—3",type:"Missing",day:10,action:"Deduct â‚¹900",status:"Deducted",muted:true},
          {id:"RF-445",date:"02 May",cno:"3202",cont:"Anil T.",pcs:"BlueÃ—1",type:"Non-repairable",day:5,action:"Reminder 1",status:"Pending"},
          {id:"RF-447",date:"04 May",cno:"3205",cont:"Priya S.",pcs:"PinkÃ—2",type:"Repairable",day:3,action:"No action yet",status:"Active",green:true},
        ].map((r,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 10px",borderTop:`0.5px solid ${C.border}`,fontSize:11,background:r.alert?C.redLight:r.muted?C.bgSoft:C.white}}>
            <div style={{flex:1,fontFamily:"monospace",color:CO.accent,fontWeight:600}}>{r.id}</div>
            <div style={{flex:1,color:C.textMuted}}>{r.date}</div>
            <div style={{flex:1,fontFamily:"monospace",fontSize:10,color:C.textMuted}}>{r.cno}</div>
            <div style={{flex:1}}>{r.cont}</div>
            <div style={{flex:1,fontSize:10}}>{r.pcs}</div>
            <div style={{flex:1,color:r.type==="Missing"?C.red:C.textMuted,fontSize:10}}>{r.type}</div>
            <div style={{flex:1,fontWeight:700,color:r.day>=10?C.red:r.day>=8?"#b45309":C.text}}>Day {r.day}</div>
            <div style={{flex:1,fontSize:10,color:r.alert?C.red:C.textMuted}}>{r.action}</div>
            <div style={{flex:1}}><span style={{fontSize:10,fontWeight:600,color:r.muted?C.textMuted:r.alert?C.red:r.green?C.green:CO.accent,background:r.muted?C.bgSoft:r.alert?C.redLight:r.green?C.greenLight:CO.accentLight,padding:"2px 5px",borderRadius:3}}>{r.status}</span></div>
          </div>
        ))}
      </div>
      <Card style={{background:CO.accentLight,border:`0.5px solid ${CO.accentBorder}`}}>
        <SectionLabel>Automated SMS Schedule</SectionLabel>
        <div style={{display:"flex",gap:10}}>
          {[{day:"Day 5",msg:"RF pending. Return within 3 days.",color:C.green},{day:"Day 8",msg:"Final reminder. 2 days remaining.",color:"#b45309"},{day:"Day 10",msg:"Deadline expired. Cost deducted from payment.",color:C.red}].map((s,i)=>(
            <div key={i} style={{flex:1,border:`0.5px solid ${C.border}`,borderRadius:4,padding:"8px 10px",background:C.white}}>
              <div style={{fontSize:11,fontWeight:700,color:s.color,marginBottom:4}}>{s.day}</div>
              <div style={{fontSize:11,color:C.text}}>{s.msg}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </WebLayout>
),

// G-09: Mill / Digital Fabric
"G-09": () => (
  <WebLayout activeMenu="Fabric / Mill" mode="mfg">
    <GTopBar title="Mill / Digital Fabric Management" sub="Thaan tracking Â· print billing Â· running balance" actions={[{label:"+ New Fabric Entry",primary:true},{label:"Export"}]}/>
    <div style={{padding:16,background:C.bgSoft,minHeight:460}}>
      <div style={{display:"flex",gap:10,marginBottom:14}}>
        {[{l:"Total at Mill",v:"3,700m"},{l:"Total Printed",v:"1,100m",green:true},{l:"Balance",v:"2,600m"},{l:"Pending Program",v:"800m"}].map((m,i)=>(
          <div key={i} style={{flex:1,border:`0.5px solid ${m.green?C.greenBorder:CO.accentBorder}`,borderRadius:6,padding:"10px 12px",background:m.green?C.greenLight:CO.accentLight}}>
            <div style={{fontSize:10,color:m.green?C.green:CO.accent,textTransform:"uppercase",marginBottom:4}}>{m.l}</div>
            <div style={{fontSize:20,fontWeight:700,color:m.green?C.green:CO.accent}}>{m.v}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:12}}>
        <div style={{flex:2}}>
          <Card>
            <div style={{fontSize:12,fontWeight:600,marginBottom:10}}>Mill A â€” Surat Digital Print Â· Thaan Register</div>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden",marginBottom:10}}>
              <div style={{display:"flex",background:C.bgSoft,padding:"5px 8px",fontSize:10,fontWeight:700,color:C.textMuted,gap:8}}>
                {["THAAN #","LENGTH","DATE SENT","FABRIC TYPE","STATUS"].map((h,i)=><div key={i} style={{flex:1}}>{h}</div>)}
              </div>
              {[{th:"T-001",len:"100m",date:"01 May",type:"Georgette",done:false},{th:"T-002",len:"99m",date:"01 May",type:"Georgette",done:false},{th:"T-003",len:"25m",date:"03 May",type:"Crepe",done:true},{th:"T-004",len:"100m",date:"05 May",type:"Georgette",done:false}].map((r,i)=>(
                <div key={i} style={{display:"flex",gap:8,padding:"5px 8px",borderTop:`0.5px solid ${C.border}`,fontSize:11,background:r.done?C.greenLight:C.white}}>
                  <div style={{flex:1,fontFamily:"monospace",color:CO.accent}}>{r.th}</div>
                  <div style={{flex:1,fontWeight:600}}>{r.len}</div>
                  <div style={{flex:1,color:C.textMuted}}>{r.date}</div>
                  <div style={{flex:1}}>{r.type}</div>
                  <div style={{flex:1,color:r.done?C.green:CO.accent,fontWeight:500}}>{r.done?"Printed":"At Mill"}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:8,padding:"8px 10px",background:CO.accentLight,border:`0.5px solid ${CO.accentBorder}`,borderRadius:4,fontSize:11}}>
              <span><strong>Total Sent:</strong> 4,800m</span><span style={{color:C.textMuted}}>âˆ’</span>
              <span><strong>Printed:</strong> 1,100m</span><span style={{color:C.textMuted}}>=</span>
              <span style={{fontWeight:700,color:CO.accent}}><strong>Balance: 3,700m</strong></span>
            </div>
          </Card>
          <Card>
            <div style={{fontSize:12,fontWeight:600,marginBottom:10}}>Print Bill Entries</div>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden"}}>
              <div style={{display:"flex",background:C.bgSoft,padding:"5px 8px",fontSize:10,fontWeight:700,color:C.textMuted,gap:8}}>
                {["BILL DATE","METERS","DESIGN","BILL AMT","BALANCE AFTER"].map((h,i)=><div key={i} style={{flex:1}}>{h}</div>)}
              </div>
              {[{date:"02 May",mts:"400m",dno:"D-710",amt:"â‚¹12,000",bal:"4,400m"},{date:"05 May",mts:"700m",dno:"D-730",amt:"â‚¹21,000",bal:"3,700m"}].map((r,i)=>(
                <div key={i} style={{display:"flex",gap:8,padding:"6px 8px",borderTop:`0.5px solid ${C.border}`,fontSize:11}}>
                  <div style={{flex:1,color:C.textMuted}}>{r.date}</div>
                  <div style={{flex:1,fontWeight:600}}>{r.mts}</div>
                  <div style={{flex:1,fontFamily:"monospace",color:C.textMuted}}>{r.dno}</div>
                  <div style={{flex:1,fontWeight:600,color:CO.accent}}>{r.amt}</div>
                  <div style={{flex:1}}>{r.bal}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div style={{flex:1}}>
          <Card>
            <SectionLabel>Log New Print Bill</SectionLabel>
            <Input label="Mill" placeholder="Surat Digital Print â€” Mill A"/>
            <Input label="Meters Printed" placeholder="700m" required/>
            <Input label="Design No" placeholder="D-730"/>
            <Input label="Bill Amount (â‚¹)" placeholder="21,000"/>
            <Input label="Bill Date" placeholder="07 May 2026"/>
            <button style={{width:"100%",padding:"8px",background:CO.accent,color:C.white,border:"none",borderRadius:4,fontSize:12,fontWeight:600,cursor:"pointer",marginTop:4}}>Save Bill Entry</button>
          </Card>
          <Card red>
            <SectionLabel>Fabric Overconsumption Alerts</SectionLabel>
            {[{dno:"D-710",spec:"50 pts",actual:"58 pts",alert:true},{dno:"D-730",spec:"50 pts",actual:"49 pts",alert:false}].map((r,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`0.5px solid ${C.border}`,fontSize:11}}>
                <span style={{fontFamily:"monospace",color:CO.accent}}>{r.dno}</span>
                <span style={{color:C.textMuted}}>Spec: {r.spec}</span>
                <span style={{fontWeight:600,color:r.alert?C.red:C.green}}>{r.actual} {r.alert?"âš ":""}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  </WebLayout>
),

// G-10: Costing â€” Owner Only
"G-10": () => (
  <WebLayout activeMenu="Costing" mode="mfg">
    <GTopBar title="Design Costing" sub="Fabric + all job work costs aggregated per design" actions={[{label:"Export PDF",primary:true}]} ownerOnly/>
    <div style={{padding:16,background:C.bgSoft,minHeight:460}}>
      <div style={{padding:"6px 12px",background:"#111",borderRadius:4,marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:11,color:"#888"}}>âš¿ Secondary authentication required Â· Session timeout: 5 min</span>
        <span style={{fontSize:10,fontWeight:600,color:C.green,marginLeft:"auto",background:"#1a3d2b",padding:"2px 8px",borderRadius:3}}>âœ“ Authenticated</span>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        <div style={{flex:1,border:`0.5px solid ${CO.accentBorder}`,borderRadius:4,padding:"7px 10px",fontSize:12,color:C.textLight,background:CO.accentLight}}>Enter Design No or Challan No...</div>
        <button style={{padding:"7px 14px",background:CO.accent,color:C.white,border:"none",borderRadius:4,fontSize:12,fontWeight:600,cursor:"pointer"}}>Load Costing</button>
      </div>
      <div style={{display:"flex",gap:12}}>
        <div style={{flex:2}}>
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <div style={{fontSize:12,fontWeight:600}}>Cost Breakdown â€” D-730 Â· Floral Embroidery Set</div>
              <span style={{fontSize:11,color:CO.accent}}>Challan #3210 Â· 600 pcs</span>
            </div>
            <div style={{border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden"}}>
              <div style={{display:"flex",background:C.bgSoft,padding:"5px 8px",fontSize:10,fontWeight:700,color:C.textMuted,gap:8}}>
                {["COST ITEM","TOTAL AMT","PER PIECE","% OF TOTAL"].map((h,i)=><div key={i} style={{flex:1}}>{h}</div>)}
              </div>
              {[
                {item:"Fabric Cost (Mill A)",total:"â‚¹21,000",pp:"â‚¹35.00",pct:28},
                {item:"Embroidery â€” Ramesh K.",total:"â‚¹18,000",pp:"â‚¹30.00",pct:24},
                {item:"Stitching â€” Suresh B.",total:"â‚¹11,950",pp:"â‚¹19.92",pct:15.9},
                {item:"Diamond â€” Anil T.",total:"â‚¹9,600",pp:"â‚¹16.00",pct:12.8},
                {item:"Lace Work â€” Mohan D.",total:"â‚¹4,800",pp:"â‚¹8.00",pct:6.4},
                {item:"Packaging / Labels",total:"â‚¹1,200",pp:"â‚¹2.00",pct:1.6},
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",gap:8,padding:"6px 8px",borderTop:`0.5px solid ${C.border}`,fontSize:11}}>
                  <div style={{flex:1}}>{r.item}</div>
                  <div style={{flex:1,fontWeight:600}}>{r.total}</div>
                  <div style={{flex:1,color:C.textMuted}}>{r.pp}</div>
                  <div style={{flex:1,display:"flex",alignItems:"center",gap:6}}>
                    <div style={{height:6,background:CO.accent,borderRadius:3,width:`${r.pct*2}px`,minWidth:4,maxWidth:"60%"}}/>
                    <span style={{color:C.textMuted,fontSize:10}}>{r.pct}%</span>
                  </div>
                </div>
              ))}
              <div style={{display:"flex",gap:8,padding:"7px 8px",borderTop:`1.5px solid ${C.border}`,fontSize:12,fontWeight:700,background:CO.accentLight}}>
                <div style={{flex:1}}>TOTAL COST</div>
                <div style={{flex:1,color:CO.accent}}>â‚¹75,000</div>
                <div style={{flex:1,color:CO.accent}}>â‚¹125.00 / pc</div>
                <div style={{flex:1}}>100%</div>
              </div>
            </div>
          </Card>
          <Card>
            <div style={{fontSize:12,fontWeight:600,marginBottom:10}}>Margin Analysis</div>
            <div style={{display:"flex",gap:10,marginBottom:10}}>
              <div style={{flex:1}}><Input label="Retail Price (â‚¹)" placeholder="â‚¹850 per piece"/></div>
              <div style={{flex:1}}><Input label="Wholesale Price (â‚¹)" placeholder="â‚¹720 per piece"/></div>
            </div>
            <div style={{display:"flex",gap:10}}>
              {[["Retail Margin","â‚¹725 / pc","85.9%",true],["Wholesale Margin","â‚¹595 / pc","70.0%",false],["Total Retail Revenue","â‚¹5.1L","600 pcs",false]].map(([l,v,sub,hi],i)=>(
                <div key={i} style={{flex:1,border:`0.5px solid ${hi?C.greenBorder:CO.accentBorder}`,borderRadius:6,padding:"8px 10px",background:hi?C.greenLight:CO.accentLight}}>
                  <div style={{fontSize:10,color:hi?C.green:CO.accent,textTransform:"uppercase",marginBottom:4}}>{l}</div>
                  <div style={{fontSize:16,fontWeight:700,color:hi?C.green:CO.accent}}>{v}</div>
                  <div style={{fontSize:10,color:C.textMuted,marginTop:2}}>{sub}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div style={{flex:1}}>
          <Card>
            <SectionLabel>Batch Comparison â€” D-730</SectionLabel>
            {[{run:"Run 1 (#3198, Apr 28)",pp:"â‚¹118.50",trend:"â€”"},{run:"Run 2 (#3205, May 3)",pp:"â‚¹121.00",trend:"â†‘ +2.1%",up:true},{run:"Run 3 (#3210, May 7)",pp:"â‚¹125.00",trend:"â†‘ +3.3%",up:true}].map((r,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`0.5px solid ${C.border}`,fontSize:11}}>
                <div style={{fontWeight:500}}>{r.run}</div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontWeight:700,color:CO.accent}}>{r.pp}</div>
                  <div style={{fontSize:10,color:r.up?C.red:C.textMuted}}>{r.trend}</div>
                </div>
              </div>
            ))}
            <div style={{marginTop:8,padding:"6px 8px",background:C.redLight,border:`0.5px solid ${C.redBorder}`,borderRadius:4,fontSize:11,color:C.red}}>Cost creeping up. Review embroidery billing vs approved stitch count.</div>
          </Card>
          <Card style={{background:"#0f0f0f",border:"0.5px solid #222"}}>
            <div style={{fontSize:10,fontWeight:700,color:"#444",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>Access Log</div>
            {[["Mohammad Ali","07 May Â· 11:32","âœ“"],["Mohammad Ali","06 May Â· 09:14","âœ“"],["Mohammad Ali","05 May Â· 04:20","âœ“"]].map(([u,t,st],i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:10,padding:"4px 0",borderBottom:"0.5px solid #1a1a1a"}}>
                <span style={{color:"#555"}}>{u}</span><span style={{color:"#333"}}>{t}</span><span style={{color:"#1a7a4a"}}>{st}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  </WebLayout>
),

// G-11: Design Management
"G-11": () => (
  <WebLayout activeMenu="Designs" mode="mfg">
    <GTopBar title="Design Management & Security" sub="Secure upload Â· IP-restricted Â· DST only Â· Owner approval required" actions={[{label:"Upload Design",primary:true}]}/>
    <div style={{padding:16,background:C.bgSoft,minHeight:460}}>
      <div style={{padding:"8px 12px",background:"#111",borderRadius:4,marginBottom:12,display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:11,color:"#888"}}>ðŸ”’ Designer workstations have internet blocked at IP level. Only this portal URL is whitelisted. Telegram disabled on all designer machines.</span>
      </div>
      <div style={{display:"flex",gap:12}}>
        <div style={{flex:2}}>
          <div style={{border:`0.5px solid ${C.border}`,borderRadius:6,overflow:"hidden",background:C.white}}>
            <div style={{display:"flex",background:C.bgSoft,padding:"6px 10px",fontSize:10,fontWeight:700,color:C.textMuted,gap:6}}>
              {["D.NO","DESIGN NAME","UPLOADED BY","DATE","STITCH COUNT","STATUS","APPROVAL","ACTIONS"].map((h,i)=><div key={i} style={{flex:1}}>{h}</div>)}
            </div>
            {[
              {dno:"D-730",name:"Floral Embr. Set",by:"Designer 1",date:"07 May",stitch:"82,400",status:"Approved",approved:true},
              {dno:"D-731",name:"Geometric Border",by:"Designer 2",date:"07 May",stitch:"Pending",status:"Pending Approval",pending:true},
              {dno:"D-732",name:"Mirror Work Suit",by:"Designer 1",date:"06 May",stitch:"â€”",status:"Rejected",rejected:true},
              {dno:"D-728",name:"Solid Embr. Top",by:"Designer 3",date:"05 May",stitch:"68,200",status:"Approved",approved:true},
            ].map((r,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 10px",borderTop:`0.5px solid ${C.border}`,fontSize:11,background:r.pending?CO.accentLight:C.white}}>
                <div style={{flex:1,fontFamily:"monospace",color:CO.accent,fontWeight:600}}>{r.dno}</div>
                <div style={{flex:1,fontWeight:500}}>{r.name}</div>
                <div style={{flex:1,color:C.textMuted}}>{r.by}</div>
                <div style={{flex:1,color:C.textMuted}}>{r.date}</div>
                <div style={{flex:1,fontFamily:"monospace",fontWeight:r.approved?600:400,color:r.approved?C.black:C.textMuted}}>{r.stitch}</div>
                <div style={{flex:1}}><span style={{fontSize:10,fontWeight:600,color:r.approved?C.green:r.pending?CO.accent:C.red,background:r.approved?C.greenLight:r.pending?CO.accentLight:C.redLight,padding:"2px 5px",borderRadius:3}}>{r.status}</span></div>
                <div style={{flex:1}}>
                  {r.pending&&<div style={{display:"flex",gap:4}}><button style={{padding:"3px 6px",fontSize:10,background:C.green,color:C.white,border:"none",borderRadius:3,cursor:"pointer"}}>âœ“ Approve</button><button style={{padding:"3px 6px",fontSize:10,background:C.redLight,color:C.red,border:`0.5px solid ${C.redBorder}`,borderRadius:3,cursor:"pointer"}}>âœ•</button></div>}
                  {r.approved&&<span style={{fontSize:10,color:C.textMuted}}>Locked âš¿</span>}
                  {r.rejected&&<button style={{padding:"3px 6px",fontSize:10,border:`0.5px solid ${C.border}`,borderRadius:3,background:C.white,cursor:"pointer"}}>Re-upload</button>}
                </div>
                <div style={{flex:1}}><button style={{padding:"3px 8px",fontSize:10,border:`0.5px solid ${C.border}`,borderRadius:3,background:C.white,cursor:"pointer"}}>View DST</button></div>
              </div>
            ))}
          </div>
        </div>
        <div style={{flex:1}}>
          <Card>
            <SectionLabel>Designer Upload Portal</SectionLabel>
            <div style={{border:`1.5px dashed ${CO.accentBorder}`,borderRadius:6,padding:"16px",textAlign:"center",background:CO.accentLight,marginBottom:8}}>
              <div style={{fontSize:24,marginBottom:6}}>â†‘</div>
              <div style={{fontSize:12,fontWeight:600}}>Upload DST File Only</div>
              <div style={{fontSize:10,color:C.textMuted,marginTop:4}}>EMB files are rejected. Only machine-compatible DST accepted.</div>
            </div>
            <Input label="Design Name" placeholder="e.g. Floral Embroidery Set" required/>
            <Input label="Design Number (D.No)" placeholder="Auto-assigned" mono/>
            <div style={{padding:"6px 8px",background:C.redLight,border:`0.5px solid ${C.redBorder}`,borderRadius:4,fontSize:11,color:C.red}}>EMB files are blocked. All upload attempts are logged.</div>
          </Card>
          <Card>
            <SectionLabel>Lock Stitch Count â€” D-731</SectionLabel>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:8}}>Owner locks stitch count at approval. All billing validated against this locked value.</div>
            <div style={{border:`0.5px solid ${CO.accentBorder}`,borderRadius:3,padding:"5px 8px",background:C.white,fontFamily:"monospace",fontSize:13,fontWeight:700,marginBottom:8}}>76,800</div>
            <button style={{width:"100%",padding:"8px",background:CO.accent,color:C.white,border:"none",borderRadius:4,fontSize:12,fontWeight:600,cursor:"pointer"}}>Lock Stitch Count & Approve</button>
          </Card>
          <Card>
            <SectionLabel>Access Log</SectionLabel>
            {[["Designer 1","D-730","View","07 May 09:12","âœ“"],["Designer 2","D-731","Upload","07 May 10:44","âœ“"],["Unknown","D-728","Attempt","06 May 22:10","âš  Flagged"]].map(([u,d,act,t,st],i)=>(
              <div key={i} style={{fontSize:10,padding:"4px 0",borderBottom:`0.5px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}>
                <span>{u} Â· {d} Â· {act}</span>
                <span style={{color:st.includes("Flag")?C.red:C.textMuted}}>{st}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  </WebLayout>
),
};

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// NAVIGATION CONFIG
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

const screenGroups = [
  {platform:"Sales ERP â€” Hoor Tex",icon:"ðŸª",erp:"sales",groups:[
    {label:"Authentication",screens:["W-01","W-02"]},
    {label:"Dashboard",screens:["W-03"]},
    {label:"Product & SKU",screens:["W-04","W-05","W-06","W-07"]},
    {label:"Inventory",screens:["W-09","W-13"]},
    {label:"Orders",screens:["W-14","W-15","W-16R","W-16W","W-34"]},
    {label:"Dispatch & LR",screens:["W-17","W-18"]},
    {label:"Payments",screens:["W-20"]},
    {label:"CCTV",screens:["W-21","W-22"]},
    {label:"Reports",screens:["W-23","W-24","W-25","W-26","W-27"]},
    {label:"SMS",screens:["W-28","W-29"]},
    {label:"Daily Operations",screens:["W-36","W-39"]},
    {label:"Admin",screens:["W-30","W-30A","W-31","W-35","W-32","W-33"]},
    {label:"Deprecated / Removed",screens:["W-10","W-11","W-12","W-19"]},
  ]},
  {platform:"Manufacturing ERP â€” GMMS",icon:"ðŸ­",erp:"mfg",groups:[
    {label:"Dashboard",screens:["G-12"]},
    {label:"Challans",screens:["G-01","G-02","G-03"]},
    {label:"Contractors",screens:["G-04","G-05"]},
    {label:"Production",screens:["G-06","G-07"]},
    {label:"RF / Returns",screens:["G-08"]},
    {label:"Fabric / Mill",screens:["G-09"]},
    {label:"Costing (Owner Only)",screens:["G-10"]},
    {label:"Designs",screens:["G-11"]},
  ]},
  {platform:"Mobile App â€” Godown (Hoor Tex)",icon:"ðŸ“±",erp:"sales",groups:[
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
  {platform:"Public-Facing",icon:"ðŸ”—",erp:"sales",groups:[
    {label:"Customer LR View",screens:["P-01"]},
  ]},
];

const screenLabels = {
  "W-01":"Login","W-02":"Forgot Password","W-03":"Main Dashboard",
  "W-04":"SKU List","W-05":"Create / Edit SKU + Rate Entry","W-06":"SKU Detail","W-07":"Label & Barcode Print",
  "W-09":"Live Inventory","W-13":"Stock Alert Center",
  "W-10":"[MERGED] Add Stock â†’ W-05","W-11":"[REMOVED] Stock Adjustment","W-12":"[REMOVED] Stock Movement Log",
  "W-14":"Order List","W-15":"Order Detail + Payments",
  "W-16R":"Create Order â€” Retail","W-16W":"Create Order â€” Wholesale",
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
  "M-15R":"Create Order â€” Retail","M-15W":"Create Order â€” Wholesale",
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
  "G-10":"Design Costing [OWNER ONLY]","G-11":"Design Management & Security",
};

const GMMS_IDS = new Set(["G-12","G-01","G-02","G-03","G-04","G-05","G-06","G-07","G-08","G-09","G-10","G-11"]);

export default function App() {
  const [active, setActive] = useState("W-03");
  const [sidebarErp, setSidebarErp] = useState("both"); // "both" | "sales" | "mfg"
  const Screen = screens[active];
  const totalScreens = Object.keys(screens).length;
  const isMfgScreen = GMMS_IDS.has(active);

  const visibleGroups = screenGroups.filter(p =>
    sidebarErp === "both" || p.erp === sidebarErp
  );

  return (
    <div style={{fontFamily:"system-ui,-apple-system,sans-serif",display:"flex",height:"100vh",background:C.bgSoft,overflow:"hidden"}}>
      {/* Sidebar */}
      <div style={{width:230,background:C.white,borderRight:`0.5px solid ${C.border}`,overflowY:"auto",flexShrink:0,paddingBottom:20,display:"flex",flexDirection:"column"}}>
        {/* Header with ERP filter */}
        <div style={{padding:"12px 14px 10px",borderBottom:`0.5px solid ${C.border}`,flexShrink:0}}>
          <div style={{fontSize:14,fontWeight:700,letterSpacing:0.5,marginBottom:6}}>
            <span style={{color:C.red}}>HOOR</span> TEX <span style={{color:"#888",fontWeight:400,fontSize:11}}>Ã—</span> <span style={{color:CO.accent,fontSize:13}}>GMMS</span>
          </div>
          <div style={{fontSize:9,color:C.textMuted,marginBottom:8}}>Wireframe Explorer Â· {totalScreens} screens</div>
          {/* ERP Toggle Filter */}
          <div style={{display:"flex",border:`0.5px solid ${C.border}`,borderRadius:4,overflow:"hidden"}}>
            {[["both","All"],["sales","Sales"],["mfg","Mfg"]].map(([v,l],i)=>(
              <div key={i} onClick={()=>setSidebarErp(v)} style={{flex:1,textAlign:"center",padding:"4px 0",fontSize:10,fontWeight:600,cursor:"pointer",background:sidebarErp===v?C.black:C.white,color:sidebarErp===v?C.white:C.textMuted,borderRight:i<2?`0.5px solid ${C.border}`:"none"}}>{l}</div>
            ))}
          </div>
        </div>
        {/* Screen Groups */}
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
      </div>

      {/* Content */}
      <div style={{flex:1,overflowY:"auto",padding:24}}>
        <div style={{marginBottom:14,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
          <div style={{fontSize:11,fontFamily:"monospace",fontWeight:700,padding:"2px 8px",borderRadius:3,background:isMfgScreen?CO.accentLight:C.redLight,color:isMfgScreen?CO.accent:C.red,border:`0.5px solid ${isMfgScreen?CO.accentBorder:C.redBorder}`}}>{active}</div>
          <div style={{fontSize:15,fontWeight:600}}>{screenLabels[active]}</div>
          <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
            <span style={{fontSize:10,padding:"2px 8px",borderRadius:3,fontWeight:600,border:`0.5px solid ${isMfgScreen?CO.accentBorder:C.border}`,color:isMfgScreen?CO.accent:C.textMuted,background:isMfgScreen?CO.accentLight:C.bgSoft}}>
              {isMfgScreen?"Manufacturing ERP":active.startsWith("M")?"Mobile App":active.startsWith("P")?"Public":"Sales ERP"}
            </span>
            <span style={{fontSize:10,color:C.textMuted}}>v4.0 Â· {totalScreens} screens</span>
          </div>
        </div>
        {Screen ? <Screen/> : <div style={{padding:40,textAlign:"center",color:C.textMuted}}>Screen not found</div>}
      </div>
    </div>
  );
}
