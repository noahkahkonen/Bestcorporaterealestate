"use client";

import Link from "next/link";
import Image from "next/image";

const SOLUTIONS = [
  {
    title: "Investment Sales",
    href: "/services/seller-representation",
    description:
      "Connecting institutional capital with high-yield opportunities through sophisticated disposition and acquisition strategies across Central Ohio.",
    cta: "Explore Strategy",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
    alt: "Modern office building exterior",
  },
  {
    title: "Leasing & Tenant Advisory",
    href: "/services/tenant-representation",
    description:
      "Full-service leasing for landlords and strategic representation for tenants. We negotiate favorable terms across office, retail, and industrial product types.",
    cta: "View Leasing Services",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200",
    alt: "Professional office interior",
  },
  {
    title: "Property Management",
    href: "/services/property-management",
    description:
      "Independent rigorous analysis and full-service property management. We provide clarity on asset worth and streamline operations for commercial and multifamily investors.",
    cta: "Request Briefing",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200",
    alt: "Commercial real estate portfolio",
  },
];

export default function ComprehensiveSolutions() {
  return (
    <section className="relative overflow-hidden bg-[#003627] py-16 sm:py-20">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')",
        }}
      />
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:mb-12">
          <span className="mb-3 block text-xs font-black uppercase tracking-[0.5em] text-[var(--accent)]">
            End-to-End Excellence
          </span>
          <h2 className="mb-4 font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Comprehensive Solutions
          </h2>
          <p className="mx-auto max-w-3xl text-base font-light leading-relaxed text-slate-400 sm:text-lg">
            Integrated advisory services for institutional and private investors across the Central Ohio property lifecycle.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {SOLUTIONS.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group relative flex h-[380px] flex-col overflow-hidden rounded-sm shadow-2xl sm:h-[420px] lg:h-[460px]"
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                className="object-cover opacity-50 transition-all duration-700 group-hover:scale-110 group-hover:opacity-80"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#003627] via-[#003627]/60 to-transparent" />
              {/* Bar → title (top-aligned) → description (below title on hover) → CTA pinned low. Same bar→title gap on every card. */}
              <div className="absolute inset-0 z-10 flex flex-col justify-end px-6 pb-3 pt-6 sm:px-8 sm:pb-4 sm:pt-8 lg:px-9 lg:pb-4">
                <div className="h-1.5 w-16 shrink-0 bg-[var(--accent)]" />
                <div className="mt-4 flex min-h-[4rem] items-start sm:min-h-[4.5rem]">
                  <h3 className="text-left font-display text-2xl font-bold leading-snug text-white sm:text-3xl">
                    {item.title}
                  </h3>
                </div>
                <div className="mt-0 overflow-hidden transition-[max-height,opacity,margin-top] duration-500 ease-out max-h-0 opacity-0 group-hover:mt-4 group-hover:max-h-72 group-hover:opacity-100 sm:group-hover:max-h-80">
                  <p className="text-left text-base leading-relaxed text-slate-300 sm:text-lg">{item.description}</p>
                </div>
                <div className="mt-4 shrink-0">
                  <span className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-[var(--accent)]">
                    {item.cta}
                    <svg
                      className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
