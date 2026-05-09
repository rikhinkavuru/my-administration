export type MediaOutlet = {
  name: string;
  format: string;
  rationale: string;
};

export const outlets: MediaOutlet[] = [
  {
    name: "The Wall Street Journal Editorial Page",
    format: "Print / Digital Op-Ed",
    rationale:
      "The Journal's editorial page is the single most influential platform for the fiscally conservative, free-market right and is read by the donor and business community. A long-form op-ed from the President places our tax, trade, and entitlement-reform agenda in front of decision-makers who shape downstream coverage.",
  },
  {
    name: "The Ben Shapiro Show / Daily Wire",
    format: "Podcast & Digital Video",
    rationale:
      "Daily Wire properties reach a younger conservative audience that broadcast cable cannot, with engagement rates broadcast networks would envy. Long-form interview format lets the President speak past the soundbite and make the substantive case for the platform.",
  },
  {
    name: "Fox News Sunday",
    format: "Broadcast Television",
    rationale:
      "Sunday-show legitimacy still moves Beltway opinion and reaches both the GOP base and persuadable older voters in battleground states. The format rewards prepared, substantive answers — exactly the contrast this campaign wants to draw.",
  },
];

export type InterestGroup = {
  name: string;
  alignment: string;
  electoralValue: string;
};

export const interestGroups: InterestGroup[] = [
  {
    name: "U.S. Chamber of Commerce",
    alignment:
      "Direct alignment on the pro-business tax and regulatory agenda — corporate rate reduction, permitting reform, capital-formation incentives, and trade policy that unlocks American exports.",
    electoralValue:
      "Major fundraising network and an organized small-business coalition in every congressional district that we can activate for both presidential and down-ballot turnout.",
  },
  {
    name: "National Rifle Association",
    alignment:
      "Direct alignment on Second Amendment platform — defense of the individual right confirmed in Heller and Bruen, opposition to new bans, and due-process protections in any red-flag legislation.",
    electoralValue:
      "Activates rural and suburban gun-owner voters at high turnout rates, particularly in Pennsylvania, Wisconsin, and Michigan, where the NRA's voter-contact program has historically moved margins.",
  },
  {
    name: "Susan B. Anthony Pro-Life America",
    alignment:
      "Alignment on a federalist, life-affirming approach post-Dobbs — protecting state-level pro-life laws and supporting families through expanded child-care and adoption policy.",
    electoralValue:
      "Mobilizes evangelical and Catholic voters who are essential to the path to 270, with a sophisticated door-knocking and mail program in suburban battleground counties.",
  },
];
