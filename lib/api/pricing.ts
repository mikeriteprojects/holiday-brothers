import type { CalculatedPrice, PricingRow } from "./types";

/**
 * Mirrors calculatePrice_() in HolidayBrothersBackend.gs client-side, so the
 * booking stepper can show a live price as the user answers questions
 * without round-tripping to submitBooking on every step. The backend
 * recomputes the authoritative price itself on submit — this is a preview.
 *
 * Reads the same Pricing sheet rows the backend uses (formula_component +
 * sukkah_type_or_tier -> value), fetched at runtime via getPricing() — no
 * hardcoded numbers here.
 */
function modifier(rows: PricingRow[], component: string, key: string): number {
  const row = rows.find((r) => r.formula_component === component && r.sukkah_type_or_tier === key);
  return row ? Number(row.value || 0) : 0;
}

export function calculatePrice(
  rows: PricingRow[],
  size: string,
  sukkahType: string,
  speedTier: string
): CalculatedPrice {
  const base = modifier(rows, "base", "Small/Canvas/Regular");
  const sizeMod = size === "Small" ? 0 : modifier(rows, "size_mod", size);
  const speedMod = modifier(rows, "speed_mod", speedTier);
  const typeMod = modifier(rows, "type_mod", sukkahType);
  return {
    base,
    size_mod: sizeMod,
    speed_mod: speedMod,
    type_mod: typeMod,
    total: base + sizeMod + speedMod + typeMod,
  };
}

/**
 * Discount amounts are admin-configurable but the backend has no dedicated
 * public settings endpoint (Settings sheet reads are permission-gated). The
 * generic Pricing sheet schema (formula_component/sukkah_type_or_tier/value)
 * already doubles as the right home for these — same convention as
 * base/size_mod/speed_mod/type_mod, just with a flat "flat" tier key. Admin
 * panel (step 5) writes these rows the same way it writes pricing modifiers.
 */
export function getSelfDeliveryDiscount(rows: PricingRow[]): number {
  return modifier(rows, "self_delivery_discount", "flat");
}

export function getWorkerPickupDiscount(rows: PricingRow[]): number {
  return modifier(rows, "worker_pickup_discount", "flat");
}
