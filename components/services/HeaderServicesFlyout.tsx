"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SERVICE_GROUPS } from "@/lib/service-groups";
import { getServiceBySlug } from "@/lib/services";

/**
 * Rich services mega-menu panel; mount inside a header hover wrapper.
 */
export default function HeaderServicesFlyout() {
  const [activeGroupId, setActiveGroupId] = useState<string>(SERVICE_GROUPS[0]!.id);
  const activeGroup = SERVICE_GROUPS.find((g) => g.id === activeGroupId) ?? SERVICE_GROUPS[0]!;

  return (
    <div className="w-full overflow-hidden border-b border-[var(--border)] bg-[var(--surface)] shadow-xl shadow-[var(--navy)]/10">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-stretch gap-0 border-b border-[var(--border)] bg-[var(--surface-muted)]/40">
          {SERVICE_GROUPS.map((g) => {
            const on = activeGroupId === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onMouseEnter={() => setActiveGroupId(g.id)}
                className={`border-b-2 px-3 py-3 text-left text-[10px] font-black uppercase tracking-[0.14em] transition-colors sm:px-4 ${
                  on
                    ? "border-[var(--accent)] bg-white text-[var(--navy)]"
                    : "border-transparent text-[var(--charcoal-light)] hover:bg-white/60 hover:text-[var(--charcoal)]"
                }`}
              >
                <span className="line-clamp-2 sm:line-clamp-1">{g.label}</span>
              </button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-[minmax(0,240px)_1fr]">
          <div className="border-b border-[var(--border)] bg-[var(--surface-muted)]/30 p-5 lg:border-b-0 lg:border-r">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent)]">{activeGroup.label}</p>
            <p className="mt-3 font-display text-lg font-bold leading-snug text-[var(--charcoal)]">{activeGroup.tagline}</p>
            <div className="mt-4 hidden overflow-hidden rounded-lg md:block">
              <Image
                src={activeGroup.coverImage}
                alt={activeGroup.coverAlt}
                width={480}
                height={288}
                className="h-36 w-full object-cover"
                sizes="240px"
              />
            </div>
        </div>

          <div className="p-4 sm:p-5">
            <ul className="grid grid-cols-2 gap-3">
              {activeGroup.items.map((item) => {
                const svc = getServiceBySlug(item.slug);
                if (!svc) return null;
                return (
                  <li key={item.slug}>
                    <Link
                      href={`/services/${item.slug}`}
                      className="group flex gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2.5 transition-all hover:border-[var(--navy)]/20 hover:shadow-md sm:gap-3.5 sm:p-3"
                    >
                      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-md sm:h-[5.5rem] sm:w-28">
                        <Image
                          src={item.image}
                          alt={item.imageAlt}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="112px"
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-center">
                        <h3 className="font-display text-sm font-bold text-[var(--charcoal)] group-hover:text-[var(--navy)] sm:text-base">
                          {svc.title}
                        </h3>
                        <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-[var(--charcoal-light)] sm:text-[13px]">
                          {item.cardSummary}
                        </p>
                        <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">
                          Learn more
                          <svg
                            className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      <div className="h-1 w-full bg-gradient-to-r from-[var(--navy)] via-[var(--accent)] to-[var(--navy)]" />
    </div>
  );
}
