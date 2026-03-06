import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Investor Portal",
  description:
    "Access market reports, interactive property maps, and exclusive investment opportunities. Best Corporate Real Estate investor resources for Central Ohio CRE.",
};

const PORTAL_ITEMS = [
  {
    title: "Interactive Map",
    description:
      "Explore commercial properties across Columbus and Central Ohio. Filter by sector and view listings geographically.",
    href: "/map",
    icon: "map",
  },
  {
    title: "Market Reports",
    description:
      "Quarterly market dashboard with vacancy, absorption, and construction data by submarket.",
    href: "/reports",
    icon: "chart",
  },
  {
    title: "Premium Listings",
    description:
      "Exclusive commercial opportunities selected for performance and investment potential.",
    href: "/listings",
    icon: "building",
  },
  {
    title: "Sold Transactions",
    description:
      "Recent sold and leased deals showcasing our track record across Central Ohio.",
    href: "/deals",
    icon: "check",
  },
  {
    title: "Contact Our Team",
    description:
      "Connect with our advisors for confidential discussions on acquisition, disposition, or leasing.",
    href: "/contact",
    icon: "mail",
  },
] as const;

const iconPaths: Record<string, ReactNode> = {
  map: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
    />
  ),
  chart: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  ),
  building: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    />
  ),
  check: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  ),
  mail: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  ),
};

export default function InvestorPortalPage() {
  return (
    <div className="pb-16">
      <div className="border-b border-[var(--border)] bg-gradient-to-b from-[var(--navy)]/5 to-transparent py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <span className="mb-4 block text-xs font-black uppercase tracking-[0.4em] text-[var(--accent)]">
            Resources
          </span>
          <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--charcoal)] sm:text-5xl">
            Investor Portal
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[var(--charcoal-light)]">
            Access market intelligence, property maps, and exclusive opportunities.
            Our investor portal provides the tools you need to evaluate Central Ohio CRE.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {PORTAL_ITEMS.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm transition-all hover:border-[var(--navy)]/30 hover:shadow-lg hover:shadow-[var(--navy)]/5"
            >
              <div className="mb-6 flex size-14 items-center justify-center rounded-xl bg-[var(--navy)]/10 text-[var(--navy)] transition-colors group-hover:bg-[var(--navy)] group-hover:text-white">
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {iconPaths[item.icon] ?? iconPaths.building}
                </svg>
              </div>
              <h2 className="font-display text-xl font-bold text-[var(--charcoal)] group-hover:text-[var(--navy)]">
                {item.title}
              </h2>
              <p className="mt-2 flex-1 text-[var(--charcoal-light)]">
                {item.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--navy)]">
                Explore
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)]/50 p-8 md:p-12">
          <h3 className="font-display text-2xl font-bold text-[var(--charcoal)]">
            Need confidential access?
          </h3>
          <p className="mt-4 max-w-2xl text-[var(--charcoal-light)]">
            Investment properties with financial documentation require an NDA.
            Contact our team to discuss your investment criteria and we&apos;ll provide
            access to exclusive deal flow and financials.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--navy)] px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
          >
            Get in Touch
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
