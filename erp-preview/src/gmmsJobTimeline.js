export const jobTimelineDefaults = [
  {
    code: "EMB",
    jobType: "Embroidery",
    owner: "Ramesh Kadkiya",
    targetDays: 10,
    startTrigger: "Challan confirmed",
    escalation: "Owner alert after day 8",
  },
  {
    code: "STH",
    jobType: "Stitching",
    owner: "Suresh Bhai",
    targetDays: 6,
    startTrigger: "Embroidery inward accepted",
    escalation: "Supervisor alert after day 5",
  },
  {
    code: "DIA",
    jobType: "Diamond Work",
    owner: "Select contractor",
    targetDays: 4,
    startTrigger: "Stitching completed",
    escalation: "Reminder after day 3",
  },
  {
    code: "LAC",
    jobType: "Lace Work",
    owner: "Mohan Das",
    targetDays: 2,
    startTrigger: "Diamond QC passed",
    escalation: "Same-day escalation",
  },
];
