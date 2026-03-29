/** Allow only #RGB or #RRGGBB for safe inline styles (zoning highlight). */
export function sanitizeListingTextColor(input: unknown): string | null {
  if (input == null) return null;
  const s = String(input).trim();
  if (s === "") return null;
  if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(s)) return s;
  return null;
}
