export type BudgetSlice = {
  category: string;
  value: number;
  color: string;
};

// Pure-black/white grayscale palette with one warm-cream accent for emphasis
const PAL = {
  emphasis: "#FFFCF2",
  s1: "#FFFFFF",
  s2: "#D5D5D5",
  s3: "#A8A8A8",
  s4: "#7E7E7E",
  s5: "#5A5A5A",
  s6: "#3F3F3F",
  s7: "#2A2A2A",
  s8: "#1A1A1A",
};

export const currentBudget: BudgetSlice[] = [
  { category: "Social Security", value: 21, color: PAL.s1 },
  { category: "Medicare", value: 15, color: PAL.s2 },
  { category: "Medicaid & Health", value: 14, color: PAL.s3 },
  { category: "Defense", value: 13, color: PAL.s4 },
  { category: "Income Security", value: 9, color: PAL.s5 },
  { category: "Net Interest", value: 13, color: PAL.s6 },
  { category: "Veterans & Federal Retirement", value: 7, color: PAL.s7 },
  { category: "Other Discretionary", value: 8, color: PAL.s8 },
];

export const proposedBudget: BudgetSlice[] = [
  { category: "Social Security", value: 20, color: PAL.s2 },
  { category: "Medicare", value: 14, color: PAL.s3 },
  { category: "Medicaid & Health", value: 12, color: PAL.s4 },
  { category: "Defense", value: 15, color: PAL.s1 },
  { category: "Income Security", value: 7, color: PAL.s5 },
  { category: "Net Interest", value: 13, color: PAL.s6 },
  { category: "Veterans & Federal Retirement", value: 8, color: PAL.s7 },
  { category: "Other Discretionary", value: 7, color: PAL.s8 },
  { category: "Debt Reduction Set-Aside", value: 4, color: PAL.emphasis },
];

export const budgetCommentary =
  "Three priorities define this budget. First, reinvest in defense toward a 4% of GDP target to deter great-power adversaries and recapitalize a hollowed-out force. Second, begin honest entitlement reform for Americans under 50 — protecting current retirees while preserving Medicare and Social Security for the next generation. Third, dedicate a 4% set-aside specifically to accelerated debt reduction, signaling to markets and to our successors that the era of treating the debt as somebody else's problem is over.";
