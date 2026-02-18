"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { computeInvestmentSummary } from "@/lib/investment-metrics";

const inputClass =
  "w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--charcoal)] focus:border-[var(--navy)] focus:outline-none focus:ring-1 focus:ring-[var(--navy)]";

function stringifyNum(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function parseNum(raw: string, min: number, max: number, fallback: number): number {
  const cleaned = raw.replace(/[^0-9.]/g, "");
  const n = parseFloat(cleaned);
  if (Number.isNaN(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

interface CashOnCashCalculatorProps {
  listingPrice: number;
  noi: number; // Net Operating Income (annual)
}

export default function CashOnCashCalculator({ listingPrice, noi }: CashOnCashCalculatorProps) {
  const [price, setPrice] = useState(stringifyNum(listingPrice));
  const defaultDown = Math.round(listingPrice * 0.3);
  const [downPayment, setDownPayment] = useState(stringifyNum(defaultDown));
  const [interestRate, setInterestRate] = useState("7");

  const priceNum = parseNum(price, 1, 1e9, listingPrice);
  const downNum = parseNum(downPayment, 0, priceNum, defaultDown);
  const rateNum = parseNum(interestRate, 0, 20, 7);

  const capRate = noi / priceNum;

  const summary = useMemo(
    () => computeInvestmentSummary(noi, priceNum, capRate, downNum, rateNum),
    [noi, priceNum, capRate, downNum, rateNum]
  );

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-8 shadow-sm">
      <h3 className="text-lg font-semibold uppercase tracking-wider text-[var(--muted)]">
        Investment calculator
      </h3>
      <p className="mt-1 text-xs text-[var(--charcoal-light)]">
        Estimate Cash on Cash return. Based on 25-year amortization.
      </p>

      <div className="mt-4 flex flex-wrap gap-4">
        <div className="min-w-0 flex-1 basis-[140px]">
          <label className="block text-sm font-medium text-[var(--charcoal)]">Purchase price</label>
          <div className="relative mt-0.5">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--muted)]">$</span>
            <input
              type="text"
              inputMode="numeric"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={`${inputClass} pl-7`}
            />
          </div>
        </div>
        <div className="min-w-0 flex-1 basis-[140px]">
          <label className="block text-sm font-medium text-[var(--charcoal)]">Down payment</label>
          <div className="relative mt-0.5">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--muted)]">$</span>
            <input
              type="text"
              inputMode="numeric"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              className={`${inputClass} pl-7`}
            />
          </div>
        </div>
        <div className="min-w-0 flex-[0_0_80px]">
          <label className="block text-sm font-medium text-[var(--charcoal)]">Interest rate</label>
          <div className="relative mt-0.5">
            <input
              type="text"
              inputMode="decimal"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className={`${inputClass} pr-8`}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--muted)]">%</span>
          </div>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[var(--border)] pt-4">
        <div className="flex justify-between gap-2 text-sm">
          <dt className="text-[var(--muted)]">NOI (annual)</dt>
          <dd className="font-semibold text-[var(--charcoal)]">
            ${summary.noi.toLocaleString()}
          </dd>
        </div>
        <div className="flex justify-between gap-2 text-sm">
          <dt className="text-[var(--muted)]">Cap rate</dt>
          <dd className="font-semibold text-[var(--charcoal)]">
            {summary.capRatePercent.toFixed(1)}%
          </dd>
        </div>
        <div className="flex justify-between gap-2 text-sm">
          <dt className="text-[var(--muted)]">Loan amount</dt>
          <dd className="font-semibold text-[var(--charcoal)]">
            ${summary.loanAmount.toLocaleString()}
          </dd>
        </div>
        <div className="mt-4 flex justify-between gap-2 text-sm col-span-2 border-t border-[var(--border)] pt-4">
          <dt className="text-[var(--muted)]">Cash on Cash return</dt>
          <dd className="font-bold text-[var(--navy)] text-lg">
            {summary.cocReturnPercent.toFixed(1)}%
          </dd>
        </div>
      </dl>
      <p className="mt-5 border-t border-[var(--border)] pt-4 text-sm text-[var(--charcoal-light)]">
        <Link href="/like-kind-exchange" className="text-[var(--navy)] hover:underline">
          What is a 1031 Like-Kind Exchange?
        </Link>
      </p>
    </div>
  );
}
