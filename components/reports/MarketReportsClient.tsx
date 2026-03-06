"use client";

import Link from "next/link";
import type { MarketReport } from "@/lib/market-reports";

const CIRCUMFERENCE = 2 * Math.PI * 28;

interface OccupancyItem {
  label: string;
  pct: number;
  sub: string;
  color: string;
}

interface MarketReportsClientProps {
  reports: MarketReport[];
  occupancyData: readonly OccupancyItem[];
}

export default function MarketReportsClient({ reports, occupancyData }: MarketReportsClientProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Rent Growth Chart Card */}
        <div className="insight-card insight-accent lg:col-span-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition-all hover:shadow-lg">
          <div className="mb-6 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-[var(--navy)]/10">
                <svg className="h-6 w-6 text-[var(--navy)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-[var(--charcoal)]">5-Year Rent Growth Trends</h3>
                <p className="text-sm text-[var(--charcoal-light)]">Average price per square foot</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-[var(--navy)]">$18.50/SF</span>
              <div className="mt-1 flex items-center justify-end gap-1 text-xs font-bold text-[var(--navy)]">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                +12.4% vs 2019
              </div>
            </div>
          </div>
          <div className="relative h-48 w-full overflow-hidden rounded-xl bg-[var(--surface-muted)] p-4">
            <svg className="h-full w-full" viewBox="0 0 500 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="insightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--navy)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--navy)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <path
                d="M0,100 C50,90 100,70 150,75 C200,80 250,40 300,35 C350,30 400,15 450,10 L500,5 L500,120 L0,120 Z"
                fill="url(#insightGrad)"
              />
              <path
                d="M0,100 C50,90 100,70 150,75 C200,80 250,40 300,35 C350,30 400,15 450,10 L500,5"
                fill="none"
                stroke="var(--navy)"
                strokeWidth={3}
                strokeLinecap="round"
              />
            </svg>
            <div className="mt-2 flex justify-between text-[10px] font-bold uppercase tracking-widest text-[var(--charcoal-light)]">
              <span>2019</span>
              <span>2020</span>
              <span>2021</span>
              <span>2022</span>
              <span>2023</span>
              <span>2024</span>
            </div>
          </div>
        </div>

        {/* Occupancy Rates */}
        <div className="insight-card insight-accent rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition-all hover:shadow-lg">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-[var(--navy)]/10">
              <svg className="h-6 w-6 text-[var(--navy)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              </svg>
            </div>
            <h3 className="font-display text-lg font-bold text-[var(--charcoal)]">Occupancy Rates</h3>
          </div>
          <div className="space-y-6">
            {occupancyData.map((o) => {
              const offset = CIRCUMFERENCE - (o.pct / 100) * CIRCUMFERENCE;
              return (
                <div
                  key={o.label}
                  className="flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-[var(--surface-muted)]"
                >
                  <div className="relative size-16 shrink-0 flex items-center justify-center">
                    <svg className="size-full -rotate-90">
                      <circle
                        className="text-[var(--border)]"
                        cx="32"
                        cy="32"
                        fill="transparent"
                        r="28"
                        stroke="currentColor"
                        strokeWidth={6}
                      />
                      <circle
                        className={o.color}
                        cx="32"
                        cy="32"
                        fill="transparent"
                        r="28"
                        stroke="currentColor"
                        strokeDasharray={CIRCUMFERENCE}
                        strokeDashoffset={offset}
                        strokeWidth={6}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-xs font-black text-[var(--charcoal)]">{o.pct}%</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--charcoal)]">{o.label}</p>
                    <p className="text-xs text-[var(--charcoal-light)]">{o.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Submarket Reports Table */}
      <div className="insight-card insight-accent overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm transition-all hover:shadow-lg">
        <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface-muted)]/50 px-6 py-5">
          <div className="flex items-center gap-3">
            <svg className="h-5 w-5 text-[var(--navy)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <h3 className="font-display font-bold text-[var(--charcoal)]">Submarket Reports</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[var(--surface-muted)]/50 text-xs font-bold uppercase text-[var(--charcoal-light)]">
              <tr>
                <th className="px-6 py-4">Submarket</th>
                <th className="px-6 py-4">Sector</th>
                <th className="px-6 py-4">Vacancy</th>
                <th className="px-6 py-4">Absorption</th>
                <th className="px-6 py-4">Under Const.</th>
                <th className="px-6 py-4">Period</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[var(--charcoal-light)]">
                    No reports yet.
                  </td>
                </tr>
              ) : (
                reports.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-[var(--border)] transition-colors hover:bg-[var(--navy)]/5"
                  >
                    <td className="px-6 py-4 font-bold text-[var(--charcoal)]">{r.submarket}</td>
                    <td className="px-6 py-4 text-[var(--charcoal-light)]">{r.sector}</td>
                    <td className="px-6 py-4">{r.vacancy}%</td>
                    <td className="px-6 py-4">
                      {r.absorption > 0 ? "+" : ""}
                      {r.absorption}M SF
                    </td>
                    <td className="px-6 py-4 font-bold text-[var(--navy)]">{r.underConstruction}M SF</td>
                    <td className="px-6 py-4 text-[var(--charcoal-light)]">
                      {r.year} {r.quarter}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
