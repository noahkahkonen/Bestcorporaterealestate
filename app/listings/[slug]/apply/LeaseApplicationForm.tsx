"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import type { Listing } from "@/types/listing";

interface LeaseApplicationFormProps {
  listing: Listing;
}

export default function LeaseApplicationForm({ listing }: LeaseApplicationFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    businessName: "",
    use: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    ssn: "",
    creditCheckAcknowledged: false,
    signatureName: "",
  });

  const inputBase =
    "w-full rounded-lg border border-[var(--border)] px-4 py-2.5 text-[var(--charcoal)] focus:border-[var(--navy)] focus:outline-none focus:ring-2 focus:ring-[var(--navy)]/20";
  const labelBase = "mb-1.5 block text-sm font-medium text-[var(--charcoal)]";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const formData = new FormData(formRef.current!);
      formData.set("listingSlug", listing.slug);
      formData.set("listingTitle", listing.title);
      formData.set("creditCheckAcknowledged", String(form.creditCheckAcknowledged));
      const res = await fetch("/api/lease-application", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to submit.");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-8 text-center dark:border-green-900/50 dark:bg-green-950/30">
        <p className="text-lg font-semibold text-green-800 dark:text-green-200">
          Application submitted successfully.
        </p>
        <p className="mt-2 text-sm text-green-700 dark:text-green-300">
          Best Corporate Real Estate will review your application and contact you shortly.
        </p>
        <Link
          href={`/listings/${listing.slug}`}
          className="mt-6 inline-block rounded-lg bg-[var(--navy)] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          Back to property
        </Link>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mt-8 space-y-6">
      <input type="hidden" name="listingSlug" value={listing.slug} />
      <input type="hidden" name="listingTitle" value={listing.title} />

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className={labelBase}>
            First name (legal)
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            value={form.firstName}
            onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
            className={inputBase}
            autoComplete="given-name"
          />
        </div>
        <div>
          <label htmlFor="lastName" className={labelBase}>
            Last name (legal)
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            value={form.lastName}
            onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
            className={inputBase}
            autoComplete="family-name"
          />
        </div>
      </div>

      <div>
        <label htmlFor="businessName" className={labelBase}>
          Business name
        </label>
        <input
          id="businessName"
          name="businessName"
          type="text"
          value={form.businessName}
          onChange={(e) => setForm((f) => ({ ...f, businessName: e.target.value }))}
          className={inputBase}
          autoComplete="organization"
        />
      </div>

      <div>
        <label htmlFor="use" className={labelBase}>
          Intended use
        </label>
        <input
          id="use"
          name="use"
          type="text"
          placeholder="e.g. Retail, Restaurant, Office"
          value={form.use}
          onChange={(e) => setForm((f) => ({ ...f, use: e.target.value }))}
          className={inputBase}
        />
      </div>

      <div>
        <label htmlFor="dateOfBirth" className={labelBase}>
          Date of birth
        </label>
        <input
          id="dateOfBirth"
          name="dateOfBirth"
          type="date"
          value={form.dateOfBirth}
          onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))}
          className={inputBase}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className={labelBase}>
            Phone number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className={inputBase}
            autoComplete="tel"
          />
        </div>
        <div>
          <label htmlFor="email" className={labelBase}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className={inputBase}
            autoComplete="email"
          />
        </div>
      </div>

      <div>
        <label htmlFor="ssn" className={labelBase}>
          Social Security Number
        </label>
        <input
          id="ssn"
          name="ssn"
          type="password"
          inputMode="numeric"
          autoComplete="off"
          maxLength={11}
          placeholder="•••-••-••••"
          value={form.ssn}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "").slice(0, 9);
            setForm((f) => ({ ...f, ssn: v }));
          }}
          className={`${inputBase} font-mono tracking-widest`}
        />
        <p className="mt-1 text-xs text-[var(--charcoal-light)]">
          Enter 9 digits; displayed as masked for your security.
        </p>
      </div>

      <div className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-6">
        <h3 className="font-semibold text-[var(--charcoal)]">Documents</h3>
        <div>
          <label htmlFor="businessPlan" className={labelBase}>
            Business Plan (PDF, DOC, etc.)
          </label>
          <input
            id="businessPlan"
            name="businessPlan"
            type="file"
            accept=".pdf,.doc,.docx"
            className="block w-full text-sm text-[var(--charcoal-light)] file:mr-4 file:rounded file:border-0 file:bg-[var(--navy)] file:px-4 file:py-2 file:text-white"
          />
        </div>
        <div>
          <label htmlFor="financials" className={labelBase}>
            Financials (multiple documents)
          </label>
          <input
            id="financials"
            name="financials"
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            multiple
            className="block w-full text-sm text-[var(--charcoal-light)] file:mr-4 file:rounded file:border-0 file:bg-[var(--navy)] file:px-4 file:py-2 file:text-white"
          />
          <p className="mt-1 text-xs text-[var(--charcoal-light)]">
            Upload as many documents as needed.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-6">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="creditCheckAcknowledged"
            checked={form.creditCheckAcknowledged}
            onChange={(e) => setForm((f) => ({ ...f, creditCheckAcknowledged: e.target.checked }))}
            className="mt-1 h-4 w-4 rounded border-[var(--border)]"
          />
          <span className="text-sm text-[var(--charcoal)]">
            I understand and give Best Corporate Real Estate, Inc. permission to pull a background
            and credit check. I acknowledge that this may affect my credit score adversely.
          </span>
        </label>
      </div>

      <div>
        <label htmlFor="signatureName" className={labelBase}>
          Signature (type your full legal name)
        </label>
        <input
          id="signatureName"
          name="signatureName"
          type="text"
          required
          value={form.signatureName}
          onChange={(e) => setForm((f) => ({ ...f, signatureName: e.target.value }))}
          className={`${inputBase} text-2xl`}
          style={{ fontFamily: "cursive" }}
          placeholder="Your full name"
        />
        {form.signatureName && (
          <p className="mt-2 text-2xl italic text-[var(--charcoal)]" style={{ fontFamily: "cursive" }}>
            {form.signatureName}
          </p>
        )}
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-4 text-sm font-medium text-red-800 dark:bg-red-950/50 dark:text-red-200">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-[var(--navy)] py-3.5 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}
