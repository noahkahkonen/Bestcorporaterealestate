"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [story, setStory] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    imageUrl: "",
    publishedAt: "",
    links: [{ label: "", url: "" }] as { label: string; url: string }[],
  });

  useEffect(() => {
    fetch(`/api/admin/news/${id}`)
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        return r.ok && data && !data.error ? data : null;
      })
      .then((s) => {
        setStory(s);
        if (s) {
          setForm({
            title: s.title || "",
            excerpt: s.excerpt || "",
            content: s.content || "",
            imageUrl: s.imageUrl || "",
            publishedAt: s.publishedAt ? String(s.publishedAt).slice(0, 10) : "",
            links:
              s.links?.length > 0
                ? s.links.map((l: { label: string; url: string }) => ({ label: l.label || "", url: l.url || "" }))
                : [{ label: "", url: "" }],
          });
        }
      });
  }, [id]);

  function addLink() {
    setForm((f) => ({ ...f, links: [...f.links, { label: "", url: "" }] }));
  }

  function removeLink(i: number) {
    setForm((f) => ({ ...f, links: f.links.filter((_, idx) => idx !== i) }));
  }

  function updateLink(i: number, field: "label" | "url", value: string) {
    setForm((f) => ({
      ...f,
      links: f.links.map((l, idx) => (idx === i ? { ...l, [field]: value } : l)),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/news/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          excerpt: form.excerpt || null,
          content: form.content,
          imageUrl: form.imageUrl || null,
          publishedAt: form.publishedAt || null,
          links: form.links.filter((l) => l.label.trim() && l.url.trim()),
        }),
      });
      if (res.ok) {
        router.push("/admin/news");
        router.refresh();
      } else {
        const err = await res.json().catch(() => ({ error: "Failed to update" }));
        alert(err.error || "Failed to update story");
      }
    } finally {
      setSaving(false);
    }
  }

  if (!story) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-[var(--charcoal)]">Edit story</h1>
        <p className="mt-4 text-[var(--charcoal-light)]">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/news" className="text-sm text-[var(--navy)] hover:underline">
          ← News
        </Link>
        <h1 className="text-2xl font-bold text-[var(--charcoal)]">Edit: {story.title}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--charcoal)]">Story</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
                className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Excerpt (optional)</label>
              <input
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Content</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                rows={6}
                className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Image (optional)</label>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const fd = new FormData();
                      fd.append("file", file);
                      fd.append("folder", "news");
                      fetch("/api/upload", { method: "POST", body: fd })
                        .then((r) => r.json())
                        .then((d) => d.url && setForm((f) => ({ ...f, imageUrl: d.url })));
                    }
                  }}
                  className="text-sm"
                />
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                  className="flex-1 min-w-[200px] rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
                  placeholder="Or paste image URL"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">Published date (optional)</label>
              <input
                type="date"
                value={form.publishedAt}
                onChange={(e) => setForm((f) => ({ ...f, publishedAt: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--charcoal)]">Links to other sites</h2>
          <p className="mt-1 text-sm text-[var(--charcoal-light)]">
            Add links to other sites that cover this news (e.g. Columbus Business First, Business Journal).
          </p>
          <div className="mt-4 space-y-4">
            {form.links.map((link, i) => (
              <div key={i} className="flex gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-4">
                <div className="flex-1 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-[var(--charcoal-light)]">Site name</label>
                    <input
                      value={link.label}
                      onChange={(e) => updateLink(i, "label", e.target.value)}
                      className="mt-1 w-full rounded border border-[var(--border)] px-3 py-2 text-sm"
                      placeholder="e.g. Columbus Business First"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--charcoal-light)]">URL</label>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateLink(i, "url", e.target.value)}
                      className="mt-1 w-full rounded border border-[var(--border)] px-3 py-2 text-sm"
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div className="flex shrink-0 items-end">
                  <button
                    type="button"
                    onClick={() => removeLink(i)}
                    disabled={form.links.length === 1}
                    className="rounded p-2 text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:hover:bg-transparent"
                    aria-label="Remove link"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addLink}
              className="flex items-center gap-2 rounded-lg border-2 border-dashed border-[var(--border)] px-4 py-3 text-sm font-medium text-[var(--charcoal-light)] hover:border-[var(--navy)] hover:text-[var(--navy)]"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add another link
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[var(--navy)] px-6 py-2.5 font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
          <Link href="/admin/news" className="rounded-lg border px-6 py-2.5 font-medium">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
