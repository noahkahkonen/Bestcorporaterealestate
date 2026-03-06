import type { Metadata } from "next";
import Link from "next/link";
import { SERVICES } from "@/lib/services";
import ServiceIcon from "@/components/ServiceIcon";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Commercial and residential real estate services in Columbus, Ohio. Brokerage, property management, business advisory, and tenant representation.",
};

export default function ServicesPage() {
  return (
    <div className="pb-16">
      <div className="border-b border-[var(--border)] bg-[var(--surface)] py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--charcoal)] sm:text-4xl">
            Services
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--charcoal-light)]">
            Full-service commercial and residential real estate in Central Ohio. Commercial services, property management, business brokerage, and residential advisory—all with a focus on transparency and results.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2">
          {SERVICES.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group block rounded-lg border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm transition-all hover:border-[var(--navy)]/20 hover:shadow-md"
            >
              <div className="text-[var(--navy)]">
                <ServiceIcon slug={service.slug} />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-[var(--charcoal)] group-hover:text-[var(--navy)]">
                {service.title}
              </h2>
              <p className="mt-3 line-clamp-3 leading-relaxed text-[var(--charcoal-light)]">
                {service.description}
              </p>
              <span className="mt-4 inline-block text-sm font-semibold text-[var(--navy)] group-hover:underline">
                Learn more →
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-16 rounded-lg bg-[var(--surface-muted)] p-8 text-center">
          <p className="text-[var(--charcoal)]">
            Ready to discuss your next transaction? Our team is here to help.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-block rounded-md bg-[var(--navy)] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
