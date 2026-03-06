"use client";

import type { ReactNode } from "react";
import Link from "next/link";

const SECTORS = [
  { name: "Retail", href: "/map?sector=retail", icon: "storefront" },
  { name: "Office", href: "/map?sector=office", icon: "corporate_fare" },
  { name: "Industrial", href: "/map?sector=industrial", icon: "factory" },
  { name: "Land", href: "/map?sector=land", icon: "landscape" },
  { name: "Multifamily", href: "/map?sector=multifamily", icon: "apartment" },
] as const;

export default function MarketSectors() {
  return (
    <section className="relative z-10 border-b border-[var(--border)] bg-[var(--surface)] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-end justify-between gap-6 md:flex-row">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-[var(--charcoal)] sm:text-4xl">
              Market Sectors
            </h2>
            <p className="mt-4 max-w-xl text-[var(--charcoal-light)]">
              Our specialized teams provide deep-domain expertise across all major property types in the region.
            </p>
          </div>
          <Link
            href="/map"
            className="group inline-flex items-center gap-2 text-sm font-bold text-[var(--navy)] transition-all hover:gap-3"
          >
            Explore All Verticals
            <svg
              className="h-5 w-5 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {SECTORS.map((sector) => (
            <Link
              key={sector.name}
              href={sector.href}
              className="group flex cursor-pointer flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-8 shadow-sm transition-all duration-300 hover:border-[var(--navy)]/30 hover:bg-[var(--navy)] hover:shadow-lg hover:shadow-[var(--navy)]/10"
            >
              <SectorIcon name={sector.icon} className="mb-6 h-10 w-10 text-[var(--navy)] transition-colors group-hover:text-white" />
              <h3 className="font-display text-xl font-bold text-[var(--charcoal)] transition-colors group-hover:text-white">
                {sector.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectorIcon({ name, className }: { name: string; className?: string }) {
  const icons: Record<string, ReactNode> = {
    storefront: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 001-1V9a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 001 1h1m-4-1a1 1 0 001-1v-4a1 1 0 00-1-1h-2a1 1 0 00-1 1v4a1 1 0 001 1h2z" />
      </svg>
    ),
    corporate_fare: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    factory: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
      </svg>
    ),
    landscape: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    apartment: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  };
  return icons[name] ?? icons.storefront;
}
