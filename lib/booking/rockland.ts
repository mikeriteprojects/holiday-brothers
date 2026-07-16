/**
 * Rockland County, NY zip codes — used as a fallback service-area check when
 * a picked address (or manually typed one) doesn't carry a county name from
 * the lookup provider. Not exhaustive of every PO-box-only code, but covers
 * every residential/delivery zip in the county.
 */
export const ROCKLAND_ZIPS = new Set([
  "10901", "10902", "10913", "10920", "10923", "10925", "10927", "10928",
  "10930", "10931", "10932", "10933", "10940", "10952", "10954", "10956",
  "10960", "10962", "10963", "10964", "10965", "10968", "10970", "10974",
  "10975", "10976", "10977", "10980", "10983", "10984", "10986", "10989",
  "10993", "10994", "10998",
]);

export function isRocklandZip(zip: string): boolean {
  return ROCKLAND_ZIPS.has(zip.trim().slice(0, 5));
}

/** True if a Nominatim `address.county` string names Rockland County, NY. */
export function isRocklandCountyName(county: string | undefined | null): boolean {
  return !!county && county.trim().toLowerCase() === "rockland county";
}

/**
 * Whether an address is in the service area: a county name from a lookup
 * provider is authoritative when present, since it reflects the actual
 * picked address rather than a possibly-stale/hand-typed zip.
 */
export function isInServiceArea(county: string | null, zip: string): boolean | null {
  if (county) return isRocklandCountyName(county);
  if (zip.trim().length === 5) return isRocklandZip(zip);
  return null;
}
