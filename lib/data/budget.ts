export type BudgetSlice = {
  category: string;
  value: number;
  color: string;
};

// Editorial palette: oxblood, ink, parchment, plus muted neutrals.
const PAL = {
  oxblood: "#7B1E2B",
  oxbloodLight: "#A04654",
  ink: "#2A2620",
  ink2: "#4A4339",
  parchment: "#C9BFA8",
  parchment2: "#D8CFB6",
  bronze: "#8B6F3D",
  bronze2: "#A8884D",
  forest: "#3F5942",
};

export const currentBudget: BudgetSlice[] = [
  { category: "Social Security", value: 21, color: PAL.oxblood },
  { category: "Medicare", value: 15, color: PAL.oxbloodLight },
  { category: "Medicaid & Health", value: 14, color: PAL.bronze },
  { category: "Defense", value: 13, color: PAL.ink },
  { category: "Income Security", value: 9, color: PAL.bronze2 },
  { category: "Net Interest", value: 13, color: PAL.ink2 },
  { category: "Veterans & Federal Retirement", value: 7, color: PAL.parchment },
  { category: "Other Discretionary", value: 8, color: PAL.parchment2 },
];

export const proposedBudget: BudgetSlice[] = [
  { category: "Social Security", value: 20, color: PAL.oxblood },
  { category: "Medicare", value: 14, color: PAL.oxbloodLight },
  { category: "Medicaid & Health", value: 12, color: PAL.bronze },
  { category: "Defense", value: 15, color: PAL.ink },
  { category: "Income Security", value: 7, color: PAL.bronze2 },
  { category: "Net Interest", value: 13, color: PAL.ink2 },
  { category: "Veterans & Federal Retirement", value: 8, color: PAL.parchment },
  { category: "Other Discretionary", value: 7, color: PAL.parchment2 },
  { category: "Debt Reduction Set-Aside", value: 4, color: PAL.forest },
];

export const budgetCommentary =
  "Three priorities define this budget. First, reinvest in defense toward a 4% of GDP target to deter great-power adversaries and recapitalize a hollowed-out force. Second, begin honest entitlement reform for Americans under 50 — protecting current retirees while preserving Medicare and Social Security for the next generation. Third, dedicate a 4% set-aside specifically to accelerated debt reduction, signaling to markets and to our successors that the era of treating the debt as somebody else's problem is over.";
