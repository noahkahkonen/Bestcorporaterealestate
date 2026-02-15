"use client";

import { useMemo, useState } from "react";
import { computeInvestmentSummary } from "@/lib/investment-metrics";
import type { InvestmentMetrics } from "@/types/listing";

interface InvestmentMetricsSectionProps {
  metrics: InvestmentMetrics;
}

const inputClass =
  "w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--charcoal)] focus:border-[var(--navy)] focus:outline-none focus:ring-1 focus:ring-[var(--navy)]";

export default function InvestmentMetricsSection({ metrics }: InvestmentMetricsSectionProps) {
  const [price, setPrice] = useState(stringifyNum(metrics.price));
  const defaultDown = Math.round(metrics.price * 0.3);
  const [downPayment, setDownPayment] = useState(stringifyNum(defaultDown));
  const [interestRate, setInterestRate] = useState("7");

  const priceNum = parseNum(price, 1, 1e9, metrics.price);
  const downNum = parseNum(downPayment, 0, priceNum, Math.round(priceNum * 0.3));
  const rateNum = parseNum(interestRate, 0, 20, 7);

  const capRate = metrics.noi / priceNum;

  const summary = useMemo(
    () =>
      computeInvestmentSummary(
        metrics.noi,
        priceNum,
        capRate,
        downNum,
        rateNum
      ),
    [metrics.noi, priceNum, capRate, downNum, rateNum]
  );

  return (
    <div className="rounded-lg border border-[var(--border)] bg-white p-6 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
        Investment calculator
      </h3>
      <p className="mt-1 text-xs text-[var(--charcoal-light)]">
        Adjust price, down payment, and rate. Cap rate = NOI ÷ price. 25-year amortization.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="inv-price" className="block text-xs font-medium text-[var(--charcoal)]">
            Price ($)
          </label>
          <input
            id="inv-price"
            type="text"
            inputMode="numeric"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder={metrics.price.toLocaleString()}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="inv-down" className="block text-xs font-medium text-[var(--charcoal)]">
            Down payment ($)
          </label>
          <input
            id="inv-down"
            type="text"
            inputMode="numeric"
            value={downPayment}
            onChange={(e) => setDownPayment(e.target.value)}
            placeholder={defaultDown.toLocaleString()}
            className={inputClass}
          />
        </div>
        <div className="col-span-2">
          <label htmlFor="inv-rate" className="block text-xs font-medium text-[var(--charcoal)]">
            Interest rate (%)
          </label>
          <input
            id="inv-rate"
            type="text"
            inputMode="decimal"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="7"
            className={inputClass}
          />
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
            {(summary.capRatePercent).toFixed(1)}%
          </dd>
        </div>
        <div className="flex justify-between gap-2 text-sm">
          <dt className="text-[var(--muted)]">Loan amount</dt>
          <dd className="font-semibold text-[var(--charcoal)]">
            ${summary.loanAmount.toLocaleString()}
          </dd>
        </div>
        <div className="flex justify-between gap-2 text-sm">
          <dt className="text-[var(--muted)]">DSCR</dt>
          <dd className="font-semibold text-[var(--charcoal)]">
            {summary.dscr.toFixed(2)}
          </dd>
        </div>
        <div className="flex justify-between gap-2 text-sm">
          <dt className="text-[var(--muted)]">CoC return</dt>
          <dd className="font-semibold text-[var(--navy)]">
            {summary.cocReturnPercent.toFixed(1)}%
          </dd>
        </div>
        <div className="flex justify-between gap-2 text-sm">
          <dt className="text-[var(--muted)]">ROI (cap)</dt>
          <dd className="font-semibold text-[var(--charcoal)]">
            {summary.roiPercent.toFixed(1)}%
          </dd>
        </div>
      </dl>
    </div>
  );
}

function stringifyNum(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function parseNum(
  raw: string,
  min: number,
  max: number,
  fallback: number
): number {
  const cleaned = raw.replace(/[^0-9.]/g, "");
  const n = parseFloat(cleaned);
  if (Number.isNaN(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}
