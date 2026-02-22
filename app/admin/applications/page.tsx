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
  received: boolean;
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

function matchesSearch(app: LeaseApplication, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  const fields = [
    app.firstName,
    app.lastName,
    app.email,
    app.businessName,
    app.listingTitle,
    app.use,
    app.signatureName,
    app.phone,
  ]
    .filter(Boolean)
    .map((s) => String(s).toLowerCase());
  return fields.some((f) => f.includes(q));
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<LeaseApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/lease-applications")
      .then((r) => r.json())
      .then((data) => {
        setApplications(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function markReceived(id: string) {
    const res = await fetch("/api/admin/lease-applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, received: true }),
    });
    if (res.ok) {
      setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, received: true } : a)));
      window.dispatchEvent(new CustomEvent("admin-counts-refresh"));
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-[var(--charcoal)]">Lease Applications</h1>
        <p className="mt-4 text-[var(--charcoal-light)]">Loading...</p>
      </div>
    );
  }

  const filtered = applications.filter((app) => matchesSearch(app, search));

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--charcoal)]">Lease Applications</h1>
      <p className="mt-1 text-[var(--charcoal-light)]">
        {applications.length} application{applications.length !== 1 ? "s" : ""} received.
      </p>

      <div className="mt-4">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, property, business..."
          className="w-full max-w-md rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm placeholder:text-[var(--charcoal-light)] focus:border-[var(--navy)] focus:outline-none focus:ring-1 focus:ring-[var(--navy)]"
          aria-label="Search applications"
        />
        {search.trim() && (
          <p className="mt-2 text-sm text-[var(--charcoal-light)]">
            {filtered.length} of {applications.length} match
          </p>
        )}
      </div>

      <div className="mt-6 space-y-6">
        {filtered.length === 0 ? (
          <p className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-[var(--charcoal-light)]">
            {search.trim() ? "No applications match your search." : "No lease applications yet."}
          </p>
        ) : (
          filtered.map((app) => {
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
                  <button
                    type="button"
                    onClick={() => {
                      if (!app.received) markReceived(app.id);
                    }}
                    className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      app.received
                        ? "bg-[var(--navy)] text-white cursor-default"
                        : "bg-[var(--surface-muted)] text-[var(--navy)] hover:bg-[var(--surface-hover)] cursor-pointer"
                    }`}
                  >
                    {app.received ? (
                      <>
                        Received
                        <svg className="ml-1.5 inline-block h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </>
                    ) : (
                      "Received"
                    )}
                  </button>
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
