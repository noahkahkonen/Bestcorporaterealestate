"use client";

import { useMemo, useState } from "react";

const inputClass =
  "w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--charcoal)] focus:border-[var(--navy)] focus:outline-none focus:ring-1 focus:ring-[var(--navy)]";

function parseNum(raw: string, min: number, max: number, fallback: number): number {
  const cleaned = raw.replace(/[^0-9.]/g, "");
  const n = parseFloat(cleaned);
  if (Number.isNaN(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

interface MonthlyRentCalculatorProps {
  baseRentPerSf: number;  // $/SF/year (editable)
  camPerSf: number;       // $/SF/year (fixed, from NNN charges)
  squareFeet: number;
}

export default function MonthlyRentCalculator({
  baseRentPerSf,
  camPerSf,
  squareFeet,
}: MonthlyRentCalculatorProps) {
  const [baseRent, setBaseRent] = useState(
    baseRentPerSf > 0 ? baseRentPerSf.toFixed(2) : ""
  );
  const [sqft, setSqft] = useState(
    squareFeet > 0 ? squareFeet.toLocaleString() : ""
  );

  const baseNum = parseNum(baseRent, 0, 1000, baseRentPerSf);
  const sqftNum = parseNum(sqft.replace(/,/g, ""), 1, 1e9, squareFeet);

  const monthlyRent = useMemo(() => {
    const totalPerSfPerYear = baseNum + camPerSf;
    return (totalPerSfPerYear * sqftNum) / 12;
  }, [baseNum, camPerSf, sqftNum]);

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-6 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
        Monthly rent calculator
      </h3>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div>
          <label className="block text-xs font-medium text-[var(--charcoal)]">Base rent</label>
          <div className="mt-1 flex items-center rounded-lg border border-[var(--border)] bg-[var(--surface)]">
            <span className="pl-3 text-[var(--muted)]">$</span>
            <input
              type="text"
              inputMode="decimal"
              value={baseRent}
              onChange={(e) => setBaseRent(e.target.value)}
              className="w-full border-0 bg-transparent py-2 pr-3 focus:ring-0"
              placeholder="10.00"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--charcoal)]">NNN charges</label>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--charcoal)]">
            ${camPerSf.toFixed(2)}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--charcoal)]">SF</label>
          <input
            type="text"
            inputMode="numeric"
            value={sqft}
            onChange={(e) => setSqft(e.target.value.replace(/[^0-9,]/g, ""))}
            className={inputClass}
            placeholder="6,500"
          />
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
        <p className="text-xs font-medium text-[var(--muted)]">Estimated monthly rent</p>
        <p className="mt-0.5 text-xl font-bold text-[var(--navy)]">
          ${monthlyRent.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
}
