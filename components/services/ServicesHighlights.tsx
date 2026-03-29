import Image from "next/image";
import Link from "next/link";
import { SERVICE_GROUPS } from "@/lib/service-groups";
import { getServiceBySlug } from "@/lib/services";

/** First three groups align with homepage “Comprehensive Solutions” pillars. */
const HIGHLIGHT_GROUPS = SERVICE_GROUPS.slice(0, 3);

export default function ServicesHighlights() {
  return (
    <section className="relative overflow-hidden bg-[#003627] py-20 sm:py-28">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')",
        }}
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center sm:mb-20">
          <span className="mb-3 block text-[10px] font-black uppercase tracking-[0.45em] text-[var(--accent)] sm:mb-4">
            How we help
          </span>
          <h2 className="font-display text-4xl font-bold text-white sm:text-5xl md:text-6xl">
            Built for every stage of the asset
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-light leading-relaxed text-slate-400 sm:mt-6 sm:text-xl">
            Deep coverage across investment sales, leasing, and operations—each led by specialists aligned with your objectives.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {HIGHLIGHT_GROUPS.map((group) => {
            const primaryHref = `/services/${group.items[0]!.slug}`;
            return (
              <Link
                key={group.id}
                href={primaryHref}
                className="group relative flex min-h-[420px] flex-col overflow-hidden rounded-sm shadow-2xl sm:min-h-[460px] lg:min-h-[520px]"
              >
                <Image
                  src={group.coverImage}
                  alt={group.coverAlt}
                  fill
                  className="object-cover opacity-55 transition-all duration-700 group-hover:scale-110 group-hover:opacity-80"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#003627] via-[#003627]/55 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full translate-y-10 p-8 transition-all duration-700 group-hover:translate-y-0 sm:p-10">
                  <div className="mb-5 h-1.5 w-14 shrink-0 bg-[var(--accent)]" />
                  <h3 className="font-display text-2xl font-bold leading-snug text-white sm:text-3xl">{group.label}</h3>
                  <p className="mt-3 text-base leading-relaxed text-slate-300 opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:text-lg">
                    {group.tagline}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 opacity-0 transition-opacity delay-75 duration-500 group-hover:opacity-100">
                    {group.items.map((item) => {
                      const s = getServiceBySlug(item.slug);
                      return (
                        <span
                          key={item.slug}
                          className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]"
                        >
                          {s?.title ?? item.slug}
                        </span>
                      );
                    })}
                  </div>
                  <span className="mt-8 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent)] sm:text-xs">
                    Explore
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
