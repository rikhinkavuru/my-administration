export type BudgetSlice = {
  category: string;
  value: number;
  color: string;
};

export const currentBudget: BudgetSlice[] = [
  { category: "Social Security", value: 21, color: "#D4AF37" },
  { category: "Medicare", value: 15, color: "#B8902F" },
  { category: "Medicaid & Health", value: 14, color: "#9C7B28" },
  { category: "Defense", value: 13, color: "#4F5BD5" },
  { category: "Income Security", value: 9, color: "#3D4796" },
  { category: "Net Interest", value: 13, color: "#8B1A1A" },
  { category: "Veterans & Federal Retirement", value: 7, color: "#2A6F4D" },
  { category: "Other Discretionary", value: 8, color: "#5C6470" },
];

export const proposedBudget: BudgetSlice[] = [
  { category: "Social Security", value: 20, color: "#D4AF37" },
  { category: "Medicare", value: 14, color: "#B8902F" },
  { category: "Medicaid & Health", value: 12, color: "#9C7B28" },
  { category: "Defense", value: 15, color: "#4F5BD5" },
  { category: "Income Security", value: 7, color: "#3D4796" },
  { category: "Net Interest", value: 13, color: "#8B1A1A" },
  { category: "Veterans & Federal Retirement", value: 8, color: "#2A6F4D" },
  { category: "Other Discretionary", value: 7, color: "#5C6470" },
  { category: "Debt Reduction Set-Aside", value: 4, color: "#0E7C5A" },
];

export const budgetCommentary =
  "Three priorities define this budget. First, reinvest in defense toward a 4% of GDP target to deter great-power adversaries and recapitalize a hollowed-out force. Second, begin honest entitlement reform for Americans under 50 — protecting current retirees while preserving Medicare and Social Security for the next generation. Third, dedicate a 4% set-aside specifically to accelerated debt reduction, signaling to markets and to our successors that the era of treating the debt as somebody else's problem is over.";
