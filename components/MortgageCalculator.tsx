"use client";

import { useMemo, useState } from "react";

const inputClass =
  "w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--charcoal)] focus:border-[var(--navy)] focus:outline-none focus:ring-1 focus:ring-[var(--navy)]";

function monthlyPayment(principal: number, annualRatePercent: number, years: number): number {
  if (principal <= 0) return 0;
  const monthlyRate = annualRatePercent / 100 / 12;
  const numPayments = years * 12;
  if (monthlyRate === 0) return principal / numPayments;
  return (
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
    (Math.pow(1 + monthlyRate, numPayments) - 1)
  );
}

function stringifyNum(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function parseNum(raw: string, min: number, max: number, fallback: number): number {
  const cleaned = raw.replace(/[^0-9.]/g, "");
  const n = parseFloat(cleaned);
  if (Number.isNaN(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

interface MortgageCalculatorProps {
  purchasePrice: number; // Listing price as default
}

export default function MortgageCalculator({ purchasePrice }: MortgageCalculatorProps) {
  const [price, setPrice] = useState(stringifyNum(purchasePrice));
  const defaultDown = Math.round(purchasePrice * 0.2);
  const [downPayment, setDownPayment] = useState(stringifyNum(defaultDown));
  const [interestRate, setInterestRate] = useState("7");

  const priceNum = parseNum(price, 1, 1e9, purchasePrice);
  const downNum = parseNum(downPayment, 0, priceNum, defaultDown);
  const rateNum = parseNum(interestRate, 0, 20, 7);

  const principal = Math.max(0, priceNum - downNum);
  const monthly = useMemo(
    () => monthlyPayment(principal, rateNum, 30),
    [principal, rateNum]
  );

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-8 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
        Mortgage calculator
      </h3>
      <p className="mt-1 text-xs text-[var(--charcoal-light)]">
        Estimate your monthly payment. 30-year amortization assumed.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-xs font-medium text-[var(--charcoal)]">Purchase price ($)</label>
          <input
            type="text"
            inputMode="numeric"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--charcoal)]">Down payment ($)</label>
          <input
            type="text"
            inputMode="numeric"
            value={downPayment}
            onChange={(e) => setDownPayment(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--charcoal)]">Interest rate (%)</label>
          <input
            type="text"
            inputMode="decimal"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
        <p className="text-xs font-medium text-[var(--muted)]">Estimated monthly payment</p>
        <p className="mt-1 text-2xl font-bold text-[var(--navy)]">
          ${monthly.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
}
