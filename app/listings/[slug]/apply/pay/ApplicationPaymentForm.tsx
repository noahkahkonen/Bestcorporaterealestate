"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Link from "next/link";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

interface ApplicationPaymentFormProps {
  applicationId: string;
  amount: number;
  listingSlug: string;
}

function PaymentFormInner({ applicationId, listingSlug }: Omit<ApplicationPaymentFormProps, "amount">) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setError("");
    setSubmitting(true);

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/listings/${listingSlug}/apply/pay/success?applicationId=${applicationId}`,
          receipt_email: undefined,
        },
      });

      if (submitError) {
        setError(submitError.message ?? "Payment failed.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <PaymentElement options={{ layout: "tabs" }} />
      {error && (
        <p className="mt-4 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-800 dark:bg-red-950/50 dark:text-red-200">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={!stripe || !elements || submitting}
        className="mt-6 w-full rounded-lg bg-[var(--navy)] py-3.5 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? "Processing..." : "Pay now"}
      </button>
    </form>
  );
}

export default function ApplicationPaymentForm({ applicationId, amount, listingSlug }: ApplicationPaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/api/lease-application/payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setErr(data.error ?? "Failed to initialize payment.");
        }
      })
      .catch(() => setErr("Failed to load payment form."))
      .finally(() => setLoading(false));
  }, [applicationId]);

  if (!stripePromise) {
    return (
      <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-8 text-center dark:border-amber-900/50 dark:bg-amber-950/30">
        <p className="text-amber-800 dark:text-amber-200">
          Payments are not configured. Please contact support.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mt-8 flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--navy)] border-t-transparent" />
      </div>
    );
  }

  if (err) {
    return (
      <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/50 dark:bg-red-950/30">
        <p className="text-red-800 dark:text-red-200">{err}</p>
        <Link
          href={`/listings/${listingSlug}/apply`}
          className="mt-4 inline-block text-sm font-medium text-[var(--navy)] hover:underline"
        >
          Back to application
        </Link>
      </div>
    );
  }

  if (!clientSecret) {
    return null;
  }

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
      variables: {
        colorPrimary: "#047857",
        borderRadius: "8px",
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentFormInner applicationId={applicationId} listingSlug={listingSlug} />
    </Elements>
  );
}
