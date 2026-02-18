"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPhone } from "@/lib/format-phone";

interface LeaseApplication {
  id: string;
  listingSlug: string;
  listingTitle: string;
  firstName: string;
  lastName: string;
  businessName: string | null;
  use: string | null;
  dateOfBirth: string | null;
  phone: string | null;
  email: string;
  ssn: string | null;
  businessPlanPath: string | null;
  financialsPathsJson: string | null;
  creditCheckAcknowledged: boolean;
  signatureName: string;
  createdAt: string;
}

function parseFinancialPaths(json: string | null): string[] {
  if (!json) return [];
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<LeaseApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/lease-applications")
      .then((r) => r.json())
      .then((data) => {
        setApplications(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-[var(--charcoal)]">Lease Applications</h1>
        <p className="mt-4 text-[var(--charcoal-light)]">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--charcoal)]">Lease Applications</h1>
      <p className="mt-1 text-[var(--charcoal-light)]">
        {applications.length} application{applications.length !== 1 ? "s" : ""} received.
      </p>

      <div className="mt-6 space-y-6">
        {applications.length === 0 ? (
          <p className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-[var(--charcoal-light)]">
            No lease applications yet.
          </p>
        ) : (
          applications.map((app) => {
            const financialPaths = parseFinancialPaths(app.financialsPathsJson);
            return (
              <div
                key={app.id}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-[var(--charcoal)]">
                      {app.firstName} {app.lastName}
                    </h2>
                    <p className="mt-1 text-sm text-[var(--charcoal-light)]">
                      Submitted {new Date(app.createdAt).toLocaleDateString()} at{" "}
                      {new Date(app.createdAt).toLocaleTimeString()}
                    </p>
                    <Link
                      href={`/listings/${app.listingSlug}`}
                      target="_blank"
                      className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[var(--navy)] hover:underline"
                    >
                      <span>Property: {app.listingTitle}</span>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Link>
                  </div>
                </div>

                <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Email</dt>
                    <dd>
                      <a href={`mailto:${app.email}`} className="text-[var(--navy)] hover:underline">
                        {app.email}
                      </a>
                    </dd>
                  </div>
                  {app.phone && (
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Phone</dt>
                      <dd>
                        <a href={`tel:+1${app.phone.replace(/\D/g, "").slice(-10)}`} className="text-[var(--charcoal)] hover:text-[var(--navy)]">
                          {formatPhone(app.phone)}
                        </a>
                      </dd>
                    </div>
                  )}
                  {app.businessName && (
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Business Name</dt>
                      <dd className="text-[var(--charcoal)]">{app.businessName}</dd>
                    </div>
                  )}
                  {app.use && (
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Intended Use</dt>
                      <dd className="text-[var(--charcoal)]">{app.use}</dd>
                    </div>
                  )}
                  {app.dateOfBirth && (
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Date of Birth</dt>
                      <dd className="text-[var(--charcoal)]">{app.dateOfBirth}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Signature</dt>
                    <dd className="italic text-[var(--charcoal)]" style={{ fontFamily: "cursive" }}>
                      {app.signatureName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Credit Check</dt>
                    <dd className="text-[var(--charcoal)]">
                      {app.creditCheckAcknowledged ? "Acknowledged" : "—"}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 border-t border-[var(--border)] pt-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
                    Documents
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {app.businessPlanPath && (
                      <a
                        href={app.businessPlanPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2 text-sm font-medium text-[var(--charcoal)] hover:bg-[var(--border)]"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Business Plan
                      </a>
                    )}
                    {financialPaths.map((path, i) => (
                      <a
                        key={path}
                        href={path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2 text-sm font-medium text-[var(--charcoal)] hover:bg-[var(--border)]"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Financial {financialPaths.length > 1 ? i + 1 : ""}
                      </a>
                    ))}
                    {!app.businessPlanPath && financialPaths.length === 0 && (
                      <p className="text-sm text-[var(--charcoal-light)]">No documents submitted</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
