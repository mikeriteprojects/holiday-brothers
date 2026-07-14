export type PamphletSlug = "vision" | "mission" | "story";

export interface Pamphlet {
  slug: PamphletSlug;
  label: string;
  rotate: number;
  short: string;
  long: string[];
}

/** Placeholder copy — swap for real brand copy whenever it's ready. */
export const PAMPHLETS: Pamphlet[] = [
  {
    slug: "vision",
    label: "Vision",
    rotate: -3,
    short:
      "A Rockland County where every family can bring their sukkah to life — however much time, space, or help they've got.",
    long: [
      "We want every family in Rockland County to be able to build a sukkah that actually fits their life — whether that means a full custom build, a simple canvas frame, or just an extra pair of hands on erev Yom Tov.",
      "That means no single \"right way\" to do it: flexible pricing by size, type, and speed, materials sourced through vendors we actually trust, and a crew who show up knowing the neighborhood, not just the job site.",
      "Longer term, that same idea extends past Sukkot — the same crew, the same trust, helping with more of the holidays that make up a full Jewish year.",
    ],
  },
  {
    slug: "mission",
    label: "Mission",
    rotate: 2,
    short:
      "We handle it end-to-end: sourcing, delivery, building, and teardown — so the only thing you have to do is enjoy the holiday.",
    long: [
      "Sukkah building has a lot of moving parts — sourcing the right materials, getting them delivered on time, actually building the thing correctly, and then taking it all down again after. We handle the whole chain, not just one piece of it.",
      "That starts with a real price, not a guess: labor is priced by size, type, and speed tier, and materials are estimated honestly until we've confirmed exact measurements.",
      "And it means treating the people who build it right — fair, flat pay per job, a rewards system for the crew who show up and do good work, and a policy of routing every hard call (a backout, a bad-weather day, a late cancellation) through a real person, not an automatic penalty.",
    ],
  },
  {
    slug: "story",
    label: "Story",
    rotate: -1,
    short:
      "Started by the Kurkus family with a simple idea — your neighbors should be the ones building your sukkah. What began as a handful of local jobs has grown into a crew families across the county actually trust.",
    long: [
      "Holiday Brothers started with a simple idea from the Kurkus family: the people building your sukkah should be your neighbors, not a random crew from out of the area.",
      "What began as a handful of local jobs — friends helping friends get their sukkah up before Yom Tov — grew into something families across Rockland County started asking for by name.",
      "We're still building that the same way: hire locally, train the crew well, treat every job like it's for family, and keep growing only as fast as we can keep that promise.",
    ],
  },
];

export function getPamphlet(slug: string): Pamphlet | undefined {
  return PAMPHLETS.find((p) => p.slug === slug);
}
