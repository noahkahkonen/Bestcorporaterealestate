import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Best Corporate Real Estate for commercial real estate advisory in Columbus, Ohio.",
};

type Props = { searchParams: Promise<{ listingSlug?: string; listingTitle?: string }> };

export default async function ContactPage({ searchParams }: Props) {
  const params = await searchParams;
  const listingSlug = params.listingSlug ?? undefined;
  const listingTitle = params.listingTitle ?? undefined;
  return (
    <div className="pb-20">
      <div className="border-b border-[var(--border)] bg-[#065f46] py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Contact Us
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/90">
            Tell us about your commercial real estate needs. We’ll respond promptly.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
          <aside className="lg:col-span-2">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
              <h2 className="text-lg font-semibold text-[var(--charcoal)]">
                Get in touch
              </h2>
              <p className="mt-3 text-sm text-[var(--charcoal-light)]">
                Reach out for acquisitions, dispositions, leasing, or general advisory. We serve clients across Central Ohio.
              </p>
              <dl className="mt-8 space-y-5">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                    Office
                  </dt>
                  <dd className="mt-1.5 text-[var(--charcoal)]">
                    <p>4608 Sawmill Road</p>
                    <p>Columbus, OH 43220</p>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                    Phone
                  </dt>
                  <dd className="mt-1.5">
                    <a
                      href="tel:+16145593350"
                      className="font-medium text-[var(--navy)] hover:underline"
                    >
                      (614) 559-3350
                    </a>
                  </dd>
                </div>
              </dl>
              <Link
                href="/listings"
                className="mt-8 inline-block text-sm font-semibold text-[var(--navy)] hover:underline"
              >
                View listings →
              </Link>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm sm:p-10">
              <h2 className="text-xl font-semibold text-[var(--charcoal)]">
                Send a message
              </h2>
              <p className="mt-2 text-sm text-[var(--charcoal-light)]">
                Fill out the form below and we’ll get back to you shortly.
              </p>
              <div className="mt-8">
                <ContactForm listingSlug={listingSlug} listingTitle={listingTitle} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
