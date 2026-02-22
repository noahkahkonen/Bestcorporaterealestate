"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminNewsPage() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/news")
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        return r.ok && Array.isArray(data) ? data : [];
      })
      .then(setStories)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    const res = await fetch(`/api/admin/news/${deleteTarget.id}`, { method: "DELETE" });
    if (res.ok) {
      setStories((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-[var(--charcoal)]">News</h1>
        <p className="mt-4 text-[var(--charcoal-light)]">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--charcoal)]">News</h1>
        <Link
          href="/admin/news/new"
          className="rounded-lg bg-[var(--navy)] px-4 py-2 text-sm font-semibold text-white opacity-90 hover:opacity-100"
        >
          Add new story
        </Link>
      </div>
      <p className="mt-1 text-[var(--charcoal-light)]">
        {stories.length} story{stories.length !== 1 ? "ies" : ""} in database.
      </p>

      <div className="mt-6 space-y-2">
        {stories.length === 0 ? (
          <p className="text-[var(--charcoal-light)]">No news stories yet. Add one to get started.</p>
        ) : (
          stories.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <div>
                <p className="font-semibold text-[var(--charcoal)]">{s.title}</p>
                <p className="text-sm text-[var(--charcoal-light)]">
                  {s.publishedAt
                    ? new Date(s.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "Draft"}
                  {s.links?.length > 0 && (
                    <span className="ml-2 text-[var(--muted)]">
                      • {s.links.length} link{s.links.length !== 1 ? "s" : ""} to other sites
                    </span>
                  )}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/admin/news/${s.id}/edit`}
                  className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm font-medium text-[var(--charcoal)] hover:bg-[var(--surface-muted)]"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => setDeleteTarget({ id: s.id, title: s.title })}
                  className="rounded p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                  aria-label="Delete story"
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
            <h3 className="text-lg font-semibold text-[var(--charcoal)]">Delete story</h3>
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
    </div>
  );
}
