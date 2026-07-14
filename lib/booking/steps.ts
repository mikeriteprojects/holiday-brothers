/**
 * The stepper flow itself (which questions, in what order, with which exact
 * option values) is implemented per Holiday-Brothers-UX-Summary.md §2 rather
 * than fetched from the Questions sheet: size/type/speed values are load-
 * bearing for pricing (they must match the Pricing sheet's
 * sukkah_type_or_tier keys and the backend's calculatePrice_ exactly), so
 * they're structural, not admin-editable copy. Dollar amounts and content
 * text ARE fetched live (see lib/api/pricing.ts, getContent()).
 */

export type StepId = "supplies" | "size" | "type" | "speed" | "delivery" | "address" | "account";

export const STEP_ORDER: StepId[] = ["supplies", "size", "type", "speed", "delivery", "address", "account"];

export const STEP_LABELS: Record<StepId, string> = {
  supplies: "Do you already have supplies?",
  size: "What size sukkah?",
  type: "What type of sukkah?",
  speed: "How soon do you need it?",
  delivery: "Delivery & pickup",
  address: "Where's the job?",
  account: "Let's lock it in",
};

export const SIZE_OPTIONS = ["Small", "Medium", "Large"] as const;
export const TYPE_OPTIONS = ["Canvas", "Modular", "Construction"] as const;
export const SPEED_OPTIONS = ["Patient", "Regular", "Express"] as const;

export const TYPE_DESCRIPTIONS: Record<(typeof TYPE_OPTIONS)[number], string> = {
  Canvas: "Fabric walls over a frame — fastest, most affordable.",
  Modular: "Interlocking wood panels, including Puzzle-style builds.",
  Construction: "Full nail-wood build — most durable, most involved.",
};

export const SPEED_DESCRIPTIONS: Record<(typeof SPEED_OPTIONS)[number], string> = {
  Patient: "Flexible timing — the most budget-friendly.",
  Regular: "Standard turnaround.",
  Express: "Rushed to the front of the line.",
};

export function visibleSteps(hasSupplies: boolean | null): StepId[] {
  if (hasSupplies === true) return STEP_ORDER.filter((s) => s !== "delivery");
  return STEP_ORDER;
}

/**
 * Maps the current step to one of 5 build stages driving
 * SukkahBuildVisual: 0 bare frame, 1 walls, 2 roof, 3 interior, 4 lit/reveal.
 */
export function stageForStep(step: StepId): 0 | 1 | 2 | 3 | 4 {
  switch (step) {
    case "supplies":
    case "size":
      return 0;
    case "type":
      return 1;
    case "speed":
      return 2;
    case "delivery":
    case "address":
      return 3;
    case "account":
      return 4;
  }
}
