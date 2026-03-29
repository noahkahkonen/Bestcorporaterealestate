import type { Metadata } from "next";
import Link from "next/link";
import ServicesHighlights from "@/components/services/ServicesHighlights";
import { SERVICES } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Investment sales, leasing and tenant advisory, property management, business advisory, and residential services in Columbus and Central Ohio.",
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[var(--surface-muted)]">
      {/* Hero — matches Comprehensive Solutions palette */}
      <div className="relative overflow-hidden bg-[#003627] pb-8 pt-20 sm:pb-10 sm:pt-28">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')",
          }}
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-[1600px] px-4 text-center sm:px-6 lg:px-8">
          <span className="mb-4 block text-[10px] font-black uppercase tracking-[0.45em] text-[var(--accent)] sm:text-xs">
            Best Corporate Real Estate
          </span>
          <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Services
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg font-light leading-relaxed text-slate-400 sm:text-xl">
            Integrated advisory across the ownership lifecycle—transactions, leasing, operations, and specialized
            mandates—delivered with transparency and institutional rigor.
          </p>
        </div>
      </div>

      <ServicesHighlights />

      <section className="border-b border-[var(--border)] bg-[var(--surface)] py-14 sm:py-16">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 text-center sm:text-left">
            <h2 className="font-display text-2xl font-bold text-[var(--charcoal)] sm:text-3xl">
              Full service list
            </h2>
            <p className="max-w-2xl text-[var(--charcoal-light)]">
              Every offering below is staffed by specialists; use the menu above for a visual overview, or jump
              directly to a service detail page.
            </p>
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/40 p-6 transition-all hover:border-[var(--navy)]/25 hover:bg-[var(--surface)] hover:shadow-md"
                >
                  <h3 className="font-display text-lg font-bold text-[var(--charcoal)] group-hover:text-[var(--navy)]">
                    {service.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--charcoal-light)] line-clamp-3">
                    {service.description}
                  </p>
                  <span className="mt-4 text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                    View detail →
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-14 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-8 py-10 text-center sm:px-12">
            <p className="text-lg text-[var(--charcoal)]">
              Ready to discuss strategy, a specific asset, or a market you are tracking?
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center justify-center rounded-md bg-[var(--navy)] px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
