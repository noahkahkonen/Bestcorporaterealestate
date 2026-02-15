import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Commercial real estate advisory and brokerage services in Columbus, Ohio. Seller, landlord, buyer, and tenant representation.",
};

const SERVICES = [
  {
    title: "Seller Representation",
    slug: "seller-representation",
    icon: (
      <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    description:
      "We advise property owners through every step of the disposition process. From valuation and marketing strategy to negotiation and closing, our team delivers institutional-quality execution and maximum value for your asset.",
  },
  {
    title: "Landlord Representation",
    slug: "landlord-representation",
    icon: (
      <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    description:
      "Full-service leasing and asset management for office, retail, and industrial properties. We develop and execute leasing strategy, negotiate terms, and maintain strong tenant relationships to optimize occupancy and income.",
  },
  {
    title: "Buyer Representation",
    slug: "buyer-representation",
    icon: (
      <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    description:
      "Dedicated advisory for investors and owner-users acquiring commercial real estate. We provide market intelligence, underwriting support, and disciplined negotiation to secure the right asset on the right terms.",
  },
  {
    title: "Tenant Representation",
    slug: "tenant-representation",
    icon: (
      <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    description:
      "We represent tenants in lease negotiations across office, retail, and industrial product types. Our advisory ensures you secure favorable economics, flexibility, and space that supports your business objectives.",
  },
];

export default function ServicesPage() {
  return (
    <div className="pb-16">
      <div className="border-b border-[var(--border)] bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--charcoal)] sm:text-4xl">
            Services
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--charcoal-light)]">
            Full-service commercial real estate advisory and brokerage in Central Ohio. We represent owners, investors, landlords, tenants, and buyers with a focus on transparency and results.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2">
          {SERVICES.map((service) => (
            <article
              key={service.slug}
              id={service.slug}
              className="rounded-lg border border-[var(--border)] bg-white p-8 shadow-sm transition-shadow hover:shadow-md scroll-mt-24"
            >
              <div className="text-[var(--navy)]">{service.icon}</div>
              <h2 className="mt-4 text-xl font-semibold text-[var(--charcoal)]">
                {service.title}
              </h2>
              <p className="mt-3 leading-relaxed text-[var(--charcoal-light)]">
                {service.description}
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-block text-sm font-semibold text-[var(--navy)] hover:underline"
              >
                Discuss your needs →
              </Link>
            </article>
          ))}
        </div>
        <div className="mt-16 rounded-lg bg-gray-50 p-8 text-center">
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
