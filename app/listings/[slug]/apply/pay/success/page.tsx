import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getListingBySlug } from "@/lib/listings";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ applicationId?: string }>;
};

export const metadata: Metadata = {
  title: "Payment successful",
};

export default async function PaymentSuccessPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { applicationId } = await searchParams;

  const listing = await getListingBySlug(slug);
  if (!listing) notFound();

  const isForLease = listing.listingType === "For Lease" || listing.listingType === "Sale/Lease";
  if (!isForLease) notFound();

  let paid = false;
  if (applicationId) {
    const app = await prisma.leaseApplication.findFirst({
      where: { id: applicationId, listingSlug: slug },
    });
    paid = app?.paymentStatus === "paid";
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center dark:border-green-900/50 dark:bg-green-950/30">
        <p className="text-lg font-semibold text-green-800 dark:text-green-200">
          {paid ? "Payment received." : "Thank you."}
        </p>
        <p className="mt-2 text-sm text-green-700 dark:text-green-300">
          {paid
            ? "Your application fee has been paid. Best Corporate Real Estate will review your application and contact you shortly."
            : "Your payment is being processed. You will receive a confirmation email shortly."}
        </p>
        <Link
          href={`/listings/${slug}`}
          className="mt-6 inline-block rounded-lg bg-[var(--navy)] px-6 py-2.5 text-sm font-semibold text-white opacity-90 hover:opacity-100"
        >
          Back to property
        </Link>
      </div>
    </div>
  );
}
