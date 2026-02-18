/**
 * Format admin form inputs as the user types.
 * Use for display; parse* functions for submit.
 */

/** Format number with commas: 1500000 -> "1,500,000" */
export function formatNumberWithCommas(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits === "") return "";
  const num = parseInt(digits, 10);
  if (Number.isNaN(num)) return value;
  return num.toLocaleString("en-US");
}

/** Parse formatted number: "1,500,000" -> 1500000 */
export function parseFormattedNumber(value: string): number {
  const n = parseInt(value.replace(/\D/g, ""), 10);
  return Number.isNaN(n) ? 0 : n;
}

/** Format price as $1,500,000 (commas as you type) */
export function formatPriceInput(value: string): string {
  return formatNumberWithCommas(value);
}

/** Format lease rate as 10.50 (2 decimals, for $/SF display) */
export function formatLeaseRateInput(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length > 2) return value;
  let result = parts[0]!.replace(/\D/g, "") || "";
  if (parts[1] !== undefined) {
    result += "." + parts[1]!.slice(0, 2).replace(/\D/g, "");
  }
  return result;
}

/** Format phone as (614) 555-1234 as you type */
export function formatPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) {
    return digits === "" ? "" : `(${digits}`;
  }
  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/** Parse formatted phone to digits: "(614) 555-1234" -> "6145551234" */
export function parseFormattedPhone(value: string): string {
  return value.replace(/\D/g, "").slice(-10);
}
