import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SERVICES, getServiceBySlug } from "@/lib/services";
import ServiceIcon from "@/components/ServiceIcon";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Service" };
  return {
    title: `${service.title} | Best Corporate Real Estate`,
    description: service.description.slice(0, 160),
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const otherServices = SERVICES.filter((s) => s.slug !== slug);

  return (
    <div className="pb-16">
      <div className="border-b border-[var(--border)] bg-[var(--surface)] py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--navy)]">
            <Link href="/services" className="hover:underline">Services</Link>
            <span aria-hidden>›</span>
            <span className="text-[var(--charcoal-light)]">{service.title}</span>
          </nav>
          <div className="flex items-start gap-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[var(--navy)]/10 text-[var(--navy)]">
              <ServiceIcon slug={service.slug} className="h-10 w-10" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--charcoal)] sm:text-4xl">
                {service.title}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-[var(--charcoal-light)]">
                {service.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-8">
          <h2 className="font-display text-xl font-bold text-[var(--charcoal)]">
            Ready to get started?
          </h2>
          <p className="mt-2 text-[var(--charcoal-light)]">
            Our team would be glad to discuss how we can help with your {service.title.toLowerCase()} needs.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-lg bg-[var(--navy)] px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90"
          >
            Contact Us
          </Link>
        </div>

        {otherServices.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display text-xl font-bold text-[var(--charcoal)]">
              Other Services
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {otherServices.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="group flex items-center gap-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:border-[var(--navy)]/30 hover:bg-[var(--surface-muted)]/50"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--navy)]/10 text-[var(--navy)]">
                      <ServiceIcon slug={s.slug} className="h-6 w-6" />
                    </div>
                    <span className="font-semibold text-[var(--charcoal)] group-hover:text-[var(--navy)]">
                      {s.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
