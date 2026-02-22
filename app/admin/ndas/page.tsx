"use client";

import { useEffect, useState } from "react";

export default function AdminNdasPage() {
  const [ndas, setNdas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  useEffect(() => {
    fetch("/api/admin/ndas")
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        return r.ok && Array.isArray(data) ? data : [];
      })
      .then(setNdas)
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: "approved" | "rejected") {
    const res = await fetch(`/api/admin/ndas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setNdas((prev) => prev.map((n) => (n.id === id ? updated : n)));
    }
  }

  function copyFinancialsLink(slug: string, token: string) {
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/api/listings/${slug}/financials?token=${token}`;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard. Send this to the approved party.");
  }

  const filtered = ndas.filter((n) => {
    if (filter === "all") return true;
    return n.status === filter;
  });

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-[var(--charcoal)]">NDAs</h1>
        <p className="mt-4 text-[var(--charcoal-light)]">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--charcoal)]">NDAs</h1>
      <p className="mt-1 text-[var(--charcoal-light)]">
        Review and approve requests for access to financial documents.
      </p>

      <div className="mt-4 flex gap-2">
        {(["pending", "approved", "rejected", "all"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-lg px-4 py-2 text-sm font-medium capitalize ${
              filter === f
                ? "bg-[var(--navy)] text-white"
                : "border border-[var(--border)] bg-[var(--surface)] text-[var(--charcoal-light)] hover:bg-[var(--surface-muted)]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {filtered.length === 0 ? (
          <p className="text-[var(--charcoal-light)]">
            {filter === "pending" ? "No pending NDAs." : `No ${filter} NDAs.`}
          </p>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-[var(--charcoal)]">
                    {n.firstName} {n.lastName}
                  </p>
                  <p className="text-sm text-[var(--charcoal-light)]">{n.email}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {n.listingTitle} ({n.listingSlug})
                  </p>
                  {n.company && (
                    <p className="text-sm text-[var(--charcoal-light)]">{n.company}</p>
                  )}
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Submitted {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-semibold ${
                      n.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : n.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {n.status}
                  </span>
                  {n.status === "pending" && (
                    <>
                      <button
                        type="button"
                        onClick={() => updateStatus(n.id, "approved")}
                        className="rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStatus(n.id, "rejected")}
                        className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {n.status === "approved" && n.approvalToken && (
                    <button
                      type="button"
                      onClick={() => copyFinancialsLink(n.listingSlug, n.approvalToken)}
                      className="rounded border border-[var(--navy)] px-3 py-1.5 text-sm font-medium text-[var(--navy)] hover:bg-[var(--navy)] hover:text-white"
                    >
                      Copy financials link
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
