import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceGroupItemBySlug } from "@/lib/service-groups";
import { getServiceLocalCopy } from "@/lib/service-detail-content";
import { SERVICES, getServiceBySlug } from "@/lib/services";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Service" };
  const local = getServiceLocalCopy(slug);
  const desc =
    local[0] ?? service.description;
  return {
    title: `${service.title} | Best Corporate Real Estate`,
    description: desc.slice(0, 158) + (desc.length > 158 ? "…" : ""),
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const visual = getServiceGroupItemBySlug(slug);
  const localParagraphs = getServiceLocalCopy(slug);
  const otherServices = SERVICES.filter((s) => s.slug !== slug);

  return (
    <div className="pb-20">
      {/* Hero — large photography */}
      <section className="relative border-b border-[var(--border)] bg-[var(--charcoal)]">
        <div className="relative mx-auto max-w-[1400px]">
          <div className="relative aspect-[21/10] min-h-[280px] max-h-[640px] w-full md:aspect-[2.2/1] md:min-h-[360px]">
            {visual ? (
              <Image
                src={visual.item.image}
                alt={visual.item.imageAlt}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1400px) 100vw, 1400px"
                quality={90}
              />
            ) : (
              <div className="h-full min-h-[280px] bg-gradient-to-br from-[var(--navy)]/40 via-[var(--charcoal)] to-[var(--navy)]/60" aria-hidden />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25" aria-hidden />
            <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-10 pt-24 sm:px-8 sm:pb-12 lg:px-12">
              <nav className="mb-5 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white/80">
                <Link href="/services" className="transition-colors hover:text-white">
                  Services
                </Link>
                <span aria-hidden className="text-white/50">
                  ›
                </span>
                {visual && (
                  <>
                    <span className="text-white/60">{visual.group.label}</span>
                    <span aria-hidden className="text-white/50">
                      ›
                    </span>
                  </>
                )}
                <span className="text-white">{service.title}</span>
              </nav>
              <div className="max-w-3xl">
                {visual && (
                  <p className="mb-2 text-[10px] font-black uppercase tracking-[0.35em] text-[var(--accent)]">
                    {visual.group.label}
                  </p>
                )}
                <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                  {service.title}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <p className="text-xl font-medium leading-relaxed text-[var(--charcoal)]">{service.description}</p>

        {localParagraphs.length > 0 && (
          <div className="mt-12 border-t border-[var(--border)] pt-12">
            <h2 className="font-display text-2xl font-bold text-[var(--charcoal)] sm:text-3xl">
              Local knowledge that moves your position
            </h2>
            <p className="mt-3 text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">
              Columbus &amp; Central Ohio
            </p>
            <div className="mt-8 space-y-6 text-base leading-relaxed text-[var(--charcoal-light)] sm:text-lg">
              {localParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        )}

        <div className="mt-14 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-8 sm:p-10">
          <h2 className="font-display text-xl font-bold text-[var(--charcoal)]">Discuss your objectives</h2>
          <p className="mt-2 text-[var(--charcoal-light)]">
            Tell us about the asset, timeline, and outcomes you are targeting—we will respond with clear next steps.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-lg border-2 border-[var(--navy)] bg-transparent px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-[var(--navy)] transition-colors hover:bg-[var(--navy)] hover:text-white"
          >
            Get in touch
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {otherServices.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-xl font-bold text-[var(--charcoal)]">Related services</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {otherServices.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="group flex items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 transition-colors hover:border-[var(--navy)]/30 hover:bg-[var(--surface-muted)]/50"
                  >
                    <span className="font-semibold text-[var(--charcoal)] group-hover:text-[var(--navy)]">{s.title}</span>
                    <span className="text-[var(--accent)] transition-transform group-hover:translate-x-0.5" aria-hidden>
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </div>
  );
}
