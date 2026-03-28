/** Map `propertyType` filter values to `/map?sector=` (lowercase, as MapPageClient expects). */
export function propertyTypeToMapSector(propertyType: string): string | null {
  const key = propertyType.trim().toLowerCase();
  const map: Record<string, string> = {
    retail: "retail",
    office: "office",
    industrial: "industrial",
    land: "land",
    multifamily: "multifamily",
  };
  return map[key] ?? null;
}
