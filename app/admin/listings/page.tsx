"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [soldModal, setSoldModal] = useState<{ id: string; title: string } | null>(null);
  const [soldForm, setSoldForm] = useState({ soldPrice: "", soldDate: "", soldNotes: "" });
  const [savingSold, setSavingSold] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/listings").then(async (r) => {
        const data = await r.json().catch(() => ({}));
        return r.ok && Array.isArray(data) ? data : [];
      }),
      fetch("/api/admin/agents").then(async (r) => {
        const data = await r.json().catch(() => ({}));
        return r.ok && Array.isArray(data) ? data : [];
      }),
    ]).then(([listingsData, agentsData]) => {
      setListings(listingsData);
      setAgents(agentsData);
      setLoading(false);
    });
  }, []);

  async function togglePublished(id: string, published: boolean) {
    await fetch(`/api/admin/listings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published }),
    });
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, published } : l)));
  }

  async function toggleFeatured(id: string, featured: boolean) {
    await fetch(`/api/admin/listings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured }),
    });
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, featured } : l)));
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const res = await fetch(`/api/admin/listings/${deleteTarget.id}`, { method: "DELETE" });
    if (res.ok) {
      setListings((prev) => prev.filter((l) => l.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  }

  async function handleMarkSold() {
    if (!soldModal) return;
    setSavingSold(true);
    try {
      const soldPriceNum = soldForm.soldPrice.trim()
        ? parseFloat(soldForm.soldPrice.replace(/,/g, ""))
        : null;
      const payload = {
        status: "Sold" as const,
        soldPrice: soldPriceNum != null && !Number.isNaN(soldPriceNum) ? soldPriceNum : null,
        soldDate: soldForm.soldDate.trim() || null,
        soldNotes: soldForm.soldNotes.trim() || null,
      };
      const res = await fetch(`/api/admin/listings/${soldModal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setListings((prev) => prev.map((l) => (l.id === soldModal.id ? data : l)));
        setSoldModal(null);
        setSoldForm({ soldPrice: "", soldDate: "", soldNotes: "" });
      } else {
        alert(data.error || "Failed to save. Please try again.");
      }
    } finally {
      setSavingSold(false);
    }
  }

  function openSoldModal(l: { id: string; title: string }) {
    setSoldModal(l);
    setSoldForm({ soldPrice: "", soldDate: "", soldNotes: "" });
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-[var(--charcoal)]">Listings</h1>
        <p className="mt-4 text-[var(--charcoal-light)]">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--charcoal)]">Listings</h1>
        <Link
          href="/admin/listings/new"
          className="rounded-lg bg-[var(--navy)] px-4 py-2 text-sm font-semibold text-white opacity-90 hover:opacity-100"
        >
          Add Listing
        </Link>
      </div>
      <p className="mt-1 text-[var(--charcoal-light)]">
        {listings.length} listing{listings.length !== 1 ? "s" : ""} in database.
      </p>

      <div className="mt-6 space-y-2">
        {listings.length === 0 ? (
          <p className="text-[var(--charcoal-light)]">No listings yet. Add one to get started.</p>
        ) : (
          listings.map((l) => (
            <div
              key={l.id}
              className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <button
                type="button"
                onClick={() => toggleFeatured(l.id, !l.featured)}
                className="mr-3 shrink-0 rounded p-1 transition-colors hover:opacity-80"
                aria-label={l.featured ? "Remove from featured" : "Add to featured"}
              >
                {l.featured ? (
                  <svg className="h-6 w-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                )}
              </button>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[var(--charcoal)]">{l.title}</p>
                <p className="text-sm text-[var(--charcoal-light)]">
                  {l.address}, {l.city}, {l.state} {l.zipCode}
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  {l.propertyType} • {l.listingType}
                  {l.status === "Sold" && <span className="ml-2 font-medium text-[var(--navy)]">• Sold</span>}
                  {l.status === "Pending" && <span className="ml-2 text-amber-600">• Pending</span>}
                  {l.published && l.status !== "Sold" && <span className="ml-2 text-green-600">• Live</span>}
                  {!l.published && <span className="ml-2 text-amber-600">• Draft</span>}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {l.status !== "Sold" && (
                  <button
                    type="button"
                    onClick={() => openSoldModal({ id: l.id, title: l.title })}
                    className="rounded px-3 py-1 text-sm font-medium bg-[var(--navy)]/10 text-[var(--navy)] hover:bg-[var(--navy)]/20"
                  >
                    Mark Sold
                  </button>
                )}
                <Link
                  href={`/admin/listings/${l.id}/edit`}
                  className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm font-medium text-[var(--charcoal)] hover:bg-[var(--surface-muted)]"
                >
                  Edit
                </Link>
                <Link href={`/listings/${l.slug}`} target="_blank" className="text-sm text-[var(--navy)] hover:underline">
                  View
                </Link>
                <button
                  type="button"
                  onClick={() => togglePublished(l.id, !l.published)}
                  className={`rounded px-3 py-1 text-sm font-medium ${
                    l.published
                      ? "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-200"
                      : "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-200"
                  }`}
                >
                  {l.published ? "Unpublish" : "Publish"}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget({ id: l.id, title: l.title })}
                  className="rounded p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                  aria-label="Delete listing"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-w-md rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-[var(--charcoal)]">Delete listing</h3>
            <p className="mt-2 text-sm text-[var(--charcoal-light)]">
              Delete &quot;{deleteTarget.title}&quot;? This cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {soldModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-w-md rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-[var(--charcoal)]">Mark as Sold</h3>
            <p className="mt-2 text-sm text-[var(--charcoal-light)]">
              Add transaction data for &quot;{soldModal.title}&quot;. This listing will appear in the Sold Deals section on the homepage.
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--charcoal)]">Sale/Lease Price ($)</label>
                <input
                  type="text"
                  value={soldForm.soldPrice}
                  onChange={(e) => setSoldForm((f) => ({ ...f, soldPrice: e.target.value }))}
                  placeholder="e.g. 1250000"
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--charcoal)]">Closing Date</label>
                <input
                  type="date"
                  value={soldForm.soldDate}
                  onChange={(e) => setSoldForm((f) => ({ ...f, soldDate: e.target.value }))}
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--charcoal)]">Notes (optional)</label>
                <textarea
                  value={soldForm.soldNotes}
                  onChange={(e) => setSoldForm((f) => ({ ...f, soldNotes: e.target.value }))}
                  placeholder="Transaction details, buyer/tenant info..."
                  rows={3}
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => { setSoldModal(null); setSoldForm({ soldPrice: "", soldDate: "", soldNotes: "" }); }}
                className="flex-1 rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleMarkSold}
                disabled={savingSold}
                className="flex-1 rounded-lg bg-[var(--navy)] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                {savingSold ? "Saving..." : "Mark Sold"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4">
        <p className="text-sm text-[var(--charcoal-light)]">
          <span className="font-medium text-[var(--charcoal)]">Star</span> — Featured listings appear on the homepage.
        </p>
      </div>
    </div>
  );
}
