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
    <section className="relative overflow-hidden bg-[#003627] py-32">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')",
        }}
      />
      <div className="relative z-10 mx-auto max-w-[1600px] px-8">
        <div className="mb-24 text-center">
          <span className="mb-4 block text-xs font-black uppercase tracking-[0.5em] text-[var(--accent)]">
            End-to-End Excellence
          </span>
          <h2 className="mb-8 font-display text-5xl font-bold text-white sm:text-6xl md:text-7xl">
            Comprehensive Solutions
          </h2>
          <p className="mx-auto max-w-3xl text-xl font-light leading-relaxed text-slate-400">
            Integrated advisory services for institutional and private investors across the Central Ohio property lifecycle.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          {SOLUTIONS.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group relative flex h-[500px] flex-col overflow-hidden rounded-sm shadow-2xl sm:h-[550px] lg:h-[650px]"
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                className="object-cover opacity-50 transition-all duration-700 group-hover:scale-110 group-hover:opacity-80"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#003627] via-[#003627]/60 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full translate-y-12 p-12 transition-all duration-700 group-hover:translate-y-0">
                <div className="mb-8 h-1.5 w-16 shrink-0 bg-[var(--accent)]" />
                <div className="mb-6 flex h-[5.75rem] items-end sm:h-[6.75rem]">
                  <h3 className="font-display text-3xl font-bold leading-snug text-white sm:text-4xl">
                    {item.title}
                  </h3>
                </div>
                <p className="mb-10 text-lg leading-relaxed text-slate-300 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
                  {item.description}
                </p>
                <span className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-[var(--accent)] transition-all group-hover:gap-5">
                  {item.cta}
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
