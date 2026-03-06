import type { Metadata } from "next";
import Link from "next/link";
import { getMarketReports, OCCUPANCY_DATA } from "@/lib/market-reports";
import MarketReportsClient from "@/components/reports/MarketReportsClient";

export const metadata: Metadata = {
  title: "Market Reports",
  description:
    "Quarterly market dashboard and CRE insights for Central Ohio. Submarket vacancy, absorption, and construction data.",
};

export default function ReportsPage() {
  const reports = getMarketReports();
  return (
    <div className="min-h-screen pb-16">
      <div
        className="-mx-4 -mt-4 mb-12 bg-gradient-to-br from-[var(--navy)] via-[#064e3b] to-emerald-700 px-6 py-16 md:-mx-8 md:-mt-8 md:px-12 md:py-20"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)" }}
      >
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
              Quarterly Dashboard
            </span>
            <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
              Q4 2023 Market Dashboard
            </h1>
            <p className="mt-2 text-lg font-medium text-emerald-100/90">
              Comprehensive CRE insights for Central Ohio
            </p>
          </div>
          <Link
            href="/map"
            className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 font-bold text-[var(--navy)] shadow-xl transition-all hover:bg-emerald-50"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            View on Map
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <MarketReportsClient reports={reports} occupancyData={OCCUPANCY_DATA} />
      </div>
    </div>
  );
}
