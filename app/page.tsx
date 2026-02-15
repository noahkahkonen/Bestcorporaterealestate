import Link from "next/link";
import FeaturedListings from "@/components/home/FeaturedListings";
import NewsPreview from "@/components/home/NewsPreview";
import Testimonials from "@/components/home/Testimonials";
import EmailSignup from "@/components/home/EmailSignup";

export default function HomePage() {
  return (
    <>
      <section className="relative flex min-h-[42vh] flex-col justify-end bg-[#065f46] text-white sm:min-h-[38vh] lg:min-h-[44vh]">
        <div className="placeholder-img absolute inset-0 opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#065f46] via-transparent to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 pt-20 sm:px-6 sm:pb-14 sm:pt-24 lg:px-8 lg:pb-16 lg:pt-28">
          <p className="text-base font-medium uppercase tracking-widest text-white/80 lg:text-lg">
            Columbus, Ohio
          </p>
          <h1 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Commercial Real Estate Advisory in Central Ohio
          </h1>
          <p className="mt-4 max-w-xl text-base text-white/90 sm:mt-5 lg:text-lg">
            Full-service brokerage and advisory for office, retail, industrial, multifamily, and land. Your partner in Central Ohio commercial real estate.
          </p>
          <div className="mt-8">
            <Link
              href="/listings"
              className="inline-flex items-center rounded-md bg-white px-6 py-3 text-base font-semibold text-[#065f46] transition-opacity hover:opacity-90"
            >
              View Listings
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border)] bg-white py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--charcoal)] sm:text-3xl lg:text-4xl">
              About Us
            </h2>
            <p className="mt-4 text-base text-[var(--charcoal-light)] lg:text-lg">
              Best Corporate Real Estate provides institutional-quality advisory and brokerage services across Central Ohio. We represent owners, investors, tenants, and buyers with a focus on transparency, market expertise, and results.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-block text-sm font-semibold text-[var(--navy)] hover:underline"
            >
              Get in touch →
            </Link>
          </div>
        </div>
      </section>

      <FeaturedListings />

      <NewsPreview />

      <Testimonials />

      <EmailSignup />
    </>
  );
}
