/** Parse currency-like user input or plain numeric URL params (strips $ and commas). */
export function parseCurrencyInput(s: string): number | null {
  const cleaned = String(s ?? "")
    .replace(/\$/g, "")
    .replace(/,/g, "")
    .trim();
  if (cleaned === "") return null;
  const n = parseFloat(cleaned);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

export function formatUsdFilterDisplay(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

/** Map URL/query value -> input display string */
export function displayUsdFromParam(raw: string | null | undefined): string {
  if (raw == null || String(raw).trim() === "") return "";
  const n = parseCurrencyInput(String(raw));
  return n != null ? formatUsdFilterDisplay(n) : "";
}

/** Persist to URL: fixed 2 decimals, no $ */
export function currencyInputToParam(s: string): string {
  const n = parseCurrencyInput(s);
  return n != null ? n.toFixed(2) : "";
}
