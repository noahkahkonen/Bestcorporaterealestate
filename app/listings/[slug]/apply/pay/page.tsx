import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getListingBySlug } from "@/lib/listings";
import ApplicationPaymentForm from "./ApplicationPaymentForm";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ applicationId?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) return { title: "Payment" };
  return { title: `Application Fee – ${listing.title}` };
}

export default async function ApplicationPaymentPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { applicationId } = await searchParams;

  const listing = await getListingBySlug(slug);
  if (!listing) notFound();

  const isForLease = listing.listingType === "For Lease" || listing.listingType === "Sale/Lease";
  if (!isForLease) notFound();

  if (!applicationId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-8 text-center dark:border-amber-900/50 dark:bg-amber-950/30">
          <p className="text-lg font-semibold text-amber-800 dark:text-amber-200">
            Invalid or missing application.
          </p>
          <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
            Please submit your lease application first, then you will be redirected to pay the application fee.
          </p>
          <Link
            href={`/listings/${slug}/apply`}
            className="mt-6 inline-block rounded-lg bg-[var(--navy)] px-6 py-2.5 text-sm font-semibold text-white opacity-90 hover:opacity-100"
          >
            Go to application
          </Link>
        </div>
      </div>
    );
  }

  const application = await prisma.leaseApplication.findFirst({
    where: { id: applicationId, listingSlug: slug },
  });

  if (!application) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-8 text-center dark:border-amber-900/50 dark:bg-amber-950/30">
          <p className="text-lg font-semibold text-amber-800 dark:text-amber-200">
            Application not found.
          </p>
          <Link
            href={`/listings/${slug}/apply`}
            className="mt-6 inline-block rounded-lg bg-[var(--navy)] px-6 py-2.5 text-sm font-semibold text-white opacity-90 hover:opacity-100"
          >
            Back to application
          </Link>
        </div>
      </div>
    );
  }

  if (application.paymentStatus === "paid") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center dark:border-green-900/50 dark:bg-green-950/30">
          <p className="text-lg font-semibold text-green-800 dark:text-green-200">
            Payment already received.
          </p>
          <p className="mt-2 text-sm text-green-700 dark:text-green-300">
            Your application fee has been paid. Best Corporate Real Estate will review your application.
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

  const feeCents = application.applicationFeeCents ?? 5000;
  const feeDisplay = `$${(feeCents / 100).toFixed(2)}`;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href={`/listings/${slug}/apply`}
        className="mb-6 inline-block text-sm font-medium text-[var(--navy)] hover:underline"
      >
        ← Back to application
      </Link>
      <h1 className="text-2xl font-bold tracking-tight text-[var(--charcoal)] sm:text-3xl">
        Application Fee
      </h1>
      <p className="mt-1 text-[var(--charcoal-light)]">
        {listing.title} • {feeDisplay}
      </p>
      <p className="mt-4 text-sm text-[var(--charcoal-light)]">
        Pay securely with card, Apple Pay, or Google Pay.
      </p>
      <ApplicationPaymentForm
        applicationId={application.id}
        amount={feeCents}
        listingSlug={slug}
      />
    </div>
  );
}
