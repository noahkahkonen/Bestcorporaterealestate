import Link from "next/link";
import HomeHero from "@/components/home/HomeHero";
import FeaturedListings from "@/components/home/FeaturedListings";
import NewsPreview from "@/components/home/NewsPreview";
import SoldDealsCarousel from "@/components/home/SoldDealsCarousel";
import EmailSignup from "@/components/home/EmailSignup";
import { getFeaturedListings, getListings, getSoldListings } from "@/lib/listings";

export default async function HomePage() {
  const [featuredListings, allListings, soldListings] = await Promise.all([
    getFeaturedListings(),
    getListings(),
    getSoldListings(),
  ]);
  const listingsToShow = featuredListings.length > 0 ? featuredListings : allListings.slice(0, 6);
  return (
    <>
      <HomeHero />
      <FeaturedListings listings={listingsToShow} />
      <NewsPreview />
      <section className="border-b border-[var(--border)] bg-[var(--surface)] py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
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
      <EmailSignup />
      <SoldDealsCarousel listings={soldListings} />
    </>
  );
}
