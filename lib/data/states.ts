export type Classification =
  | "safe-r"
  | "lean-r"
  | "battleground"
  | "safe-d";

export type StateInfo = {
  id: string; // 2-letter
  name: string;
  ev: number;
  classification: Classification;
  reasoning?: string;
};

export const states: StateInfo[] = [
  // Safe Republican
  { id: "AL", name: "Alabama", ev: 9, classification: "safe-r" },
  { id: "AK", name: "Alaska", ev: 3, classification: "safe-r" },
  { id: "AR", name: "Arkansas", ev: 6, classification: "safe-r" },
  { id: "FL", name: "Florida", ev: 30, classification: "safe-r" },
  { id: "ID", name: "Idaho", ev: 4, classification: "safe-r" },
  { id: "IN", name: "Indiana", ev: 11, classification: "safe-r" },
  { id: "IA", name: "Iowa", ev: 6, classification: "safe-r" },
  { id: "KS", name: "Kansas", ev: 6, classification: "safe-r" },
  { id: "KY", name: "Kentucky", ev: 8, classification: "safe-r" },
  { id: "LA", name: "Louisiana", ev: 8, classification: "safe-r" },
  { id: "MS", name: "Mississippi", ev: 6, classification: "safe-r" },
  { id: "MO", name: "Missouri", ev: 10, classification: "safe-r" },
  { id: "MT", name: "Montana", ev: 4, classification: "safe-r" },
  { id: "NE", name: "Nebraska", ev: 5, classification: "safe-r" },
  { id: "ND", name: "North Dakota", ev: 3, classification: "safe-r" },
  { id: "OK", name: "Oklahoma", ev: 7, classification: "safe-r" },
  { id: "SC", name: "South Carolina", ev: 9, classification: "safe-r" },
  { id: "SD", name: "South Dakota", ev: 3, classification: "safe-r" },
  { id: "TN", name: "Tennessee", ev: 11, classification: "safe-r" },
  { id: "TX", name: "Texas", ev: 40, classification: "safe-r" },
  { id: "UT", name: "Utah", ev: 6, classification: "safe-r" },
  { id: "WV", name: "West Virginia", ev: 4, classification: "safe-r" },
  { id: "WY", name: "Wyoming", ev: 3, classification: "safe-r" },
  { id: "OH", name: "Ohio", ev: 17, classification: "safe-r" },

  // Lean Republican
  {
    id: "GA",
    name: "Georgia",
    ev: 16,
    classification: "lean-r",
    reasoning:
      "Atlanta-suburb voters who left the GOP in 2020 respond to fiscally conservative, institutionally serious messaging without populist edges.",
  },
  {
    id: "NC",
    name: "North Carolina",
    ev: 16,
    classification: "lean-r",
    reasoning:
      "Research Triangle professionals and Charlotte business voters align with a pro-growth, pro-trade Republican platform.",
  },
  {
    id: "AZ",
    name: "Arizona",
    ev: 11,
    classification: "lean-r",
    reasoning:
      "Maricopa County moderates who broke for Democrats over tone return to a serious-minded ticket emphasizing border security and fiscal discipline.",
  },

  // Battlegrounds (must-win path)
  {
    id: "PA",
    name: "Pennsylvania",
    ev: 19,
    classification: "battleground",
    reasoning:
      "Suburban Philadelphia moderates respond to fiscal-conservative-but-socially-moderate messaging; Kavuru's tech and education focus appeals to college-educated voters who left the GOP in 2020.",
  },
  {
    id: "WI",
    name: "Wisconsin",
    ev: 10,
    classification: "battleground",
    reasoning:
      "WOW counties around Milwaukee are recoverable for a Republican who emphasizes governance over grievance; manufacturing and energy policy resonate.",
  },
  {
    id: "NV",
    name: "Nevada",
    ev: 6,
    classification: "battleground",
    reasoning:
      "Hospitality and small-business voters in Clark County are receptive to a pro-growth tax message; Latino working-class voters trending right are persuadable.",
  },
  {
    id: "MI",
    name: "Michigan",
    ev: 15,
    classification: "battleground",
    reasoning:
      "Oakland County professionals and Macomb County working-class voters can both be assembled with a serious economic-competitiveness message.",
  },

  // Safe Democrat
  { id: "CA", name: "California", ev: 54, classification: "safe-d" },
  { id: "NY", name: "New York", ev: 28, classification: "safe-d" },
  { id: "IL", name: "Illinois", ev: 19, classification: "safe-d" },
  { id: "MA", name: "Massachusetts", ev: 11, classification: "safe-d" },
  { id: "MD", name: "Maryland", ev: 10, classification: "safe-d" },
  { id: "NJ", name: "New Jersey", ev: 14, classification: "safe-d" },
  { id: "CT", name: "Connecticut", ev: 7, classification: "safe-d" },
  { id: "RI", name: "Rhode Island", ev: 4, classification: "safe-d" },
  { id: "VT", name: "Vermont", ev: 3, classification: "safe-d" },
  { id: "DE", name: "Delaware", ev: 3, classification: "safe-d" },
  { id: "HI", name: "Hawaii", ev: 4, classification: "safe-d" },
  { id: "WA", name: "Washington", ev: 12, classification: "safe-d" },
  { id: "OR", name: "Oregon", ev: 8, classification: "safe-d" },
  { id: "CO", name: "Colorado", ev: 10, classification: "safe-d" },
  { id: "NM", name: "New Mexico", ev: 5, classification: "safe-d" },
  { id: "MN", name: "Minnesota", ev: 10, classification: "safe-d" },
  { id: "VA", name: "Virginia", ev: 13, classification: "safe-d" },
  { id: "ME", name: "Maine", ev: 4, classification: "safe-d" },
  { id: "NH", name: "New Hampshire", ev: 4, classification: "safe-d" },
  { id: "DC", name: "District of Columbia", ev: 3, classification: "safe-d" },
];

export const stateById = Object.fromEntries(states.map((s) => [s.id, s]));

export const evByClass = states.reduce(
  (acc, s) => {
    acc[s.classification] += s.ev;
    return acc;
  },
  { "safe-r": 0, "lean-r": 0, battleground: 0, "safe-d": 0 } as Record<
    Classification,
    number
  >
);

export const classificationMeta: Record<
  Classification,
  { label: string; color: string }
> = {
  "safe-r": { label: "Safe Republican", color: "#FFFFFF" },
  "lean-r": { label: "Lean Republican", color: "#9A9A9A" },
  battleground: { label: "Battleground (Target)", color: "#D63D44" },
  "safe-d": { label: "Safe Democrat (Concede)", color: "#262626" },
};
