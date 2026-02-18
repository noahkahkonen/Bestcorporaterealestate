import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getListingBySlug } from "@/lib/listings";
import LeaseApplicationForm from "./LeaseApplicationForm";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) return { title: "Apply" };
  return {
    title: `Lease Application – ${listing.title}`,
  };
}

export default async function LeaseApplicationPage({ params }: Props) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) notFound();

  const isForLease =
    listing.listingType === "For Lease" || listing.listingType === "Sale/Lease";
  if (!isForLease) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href={`/listings/${slug}`}
        className="mb-6 inline-block text-sm font-medium text-[var(--navy)] hover:underline"
      >
        ← Back to {listing.title}
      </Link>
      <h1 className="text-2xl font-bold tracking-tight text-[var(--charcoal)] sm:text-3xl">
        Lease Application
      </h1>
      <p className="mt-1 text-[var(--charcoal-light)]">
        {listing.title} • {listing.address}, {listing.city}
      </p>
      <LeaseApplicationForm listing={listing} />
    </div>
  );
}
