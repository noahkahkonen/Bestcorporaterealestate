"use client";

import { useState } from "react";
import { CONFIDENTIALITY_AGREEMENT } from "@/lib/nda-agreement";

interface NdaFormModalProps {
  listingSlug: string;
  listingTitle: string;
  onClose: () => void;
}

export default function NdaFormModal({ listingSlug, listingTitle, onClose }: NdaFormModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    signatureName: "",
    acknowledged: false,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/nda-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingSlug,
          listingTitle,
          ...form,
        }),
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

  const inputBase =
    "w-full rounded-lg border border-[var(--border)] px-4 py-2.5 text-[var(--charcoal)] focus:border-[var(--navy)] focus:outline-none focus:ring-2 focus:ring-[var(--navy)]/20";
  const labelBase = "mb-1.5 block text-sm font-medium text-[var(--charcoal)]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-6 py-4">
          <h2 className="text-lg font-semibold text-[var(--charcoal)]">Request access to financial documents</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-2 text-[var(--charcoal-light)] hover:bg-[var(--surface-muted)] hover:text-[var(--charcoal)]"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center dark:border-green-900/50 dark:bg-green-950/30">
              <p className="text-lg font-semibold text-green-800 dark:text-green-200">
                Agreement submitted successfully.
              </p>
              <p className="mt-3 text-sm text-green-700 dark:text-green-300">
                Our team will review your agreement and send you a notification if you are approved to view the financials.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 rounded-lg bg-[var(--navy)] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="mb-2 text-sm font-semibold text-[var(--charcoal)]">Confidentiality agreement</h3>
                <div className="max-h-48 overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-sm text-[var(--charcoal-light)] whitespace-pre-wrap">
                  {CONFIDENTIALITY_AGREEMENT}
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={form.acknowledged}
                  onChange={(e) => setForm((f) => ({ ...f, acknowledged: e.target.checked }))}
                  className="mt-1 rounded"
                />
                <span className="text-sm text-[var(--charcoal)]">
                  I acknowledge that this information is proprietary and cannot be disseminated to the public. I agree to the terms of the confidentiality agreement above.
                </span>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelBase}>First name</label>
                  <input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                    className={inputBase}
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label className={labelBase}>Last name</label>
                  <input
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
                <label className={labelBase}>Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className={inputBase}
                  autoComplete="email"
                />
              </div>

              <div>
                <label className={labelBase}>Phone (optional)</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className={inputBase}
                  autoComplete="tel"
                />
              </div>

              <div>
                <label className={labelBase}>Company (optional)</label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                  className={inputBase}
                  autoComplete="organization"
                />
              </div>

              <div>
                <label className={labelBase}>Digital signature (type your full legal name)</label>
                <input
                  type="text"
                  required
                  value={form.signatureName}
                  onChange={(e) => setForm((f) => ({ ...f, signatureName: e.target.value }))}
                  className={inputBase}
                  placeholder="John Smith"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 p-4 text-sm font-medium text-red-800 dark:bg-red-950/50 dark:text-red-200">
                  {error}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting || !form.acknowledged}
                  className="rounded-lg bg-[var(--navy)] px-6 py-2.5 font-semibold text-white disabled:opacity-50 hover:opacity-90"
                >
                  {submitting ? "Submitting..." : "Submit agreement"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-[var(--border)] px-6 py-2.5 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
