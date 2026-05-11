const fs = require('fs');
let f = fs.readFileSync('d:\\Wireframe CMS_GMMS\\combined_erp_wireframes_v6.jsx', 'utf8');
f = f.replace(/<GTopBar title="RF [^"]+" sub="Auto-deduction on Day 10 if not returned"/, '<GTopBar title="RF (Alter \\/ Refinish) — Return \\/ Rejected Fabric" sub="Auto-deduction on Day 10 if not returned"');
fs.writeFileSync('d:\\Wireframe CMS_GMMS\\combined_erp_wireframes_v6.jsx', f);
console.log("Done");
