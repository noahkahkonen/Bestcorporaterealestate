"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { formatPhoneInput, parseFormattedPhone } from "@/lib/format-admin-inputs";

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", title: "", email: "", phone: "", ext: "", credentials: "", website: "", linkedIn: "", description: "", notableDeals: "", headshot: "" });

  useEffect(() => {
    fetch("/api/admin/agents")
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        return r.ok && Array.isArray(data) ? data : [];
      })
      .then(setAgents)
      .finally(() => setLoading(false));
  }, []);

  const emptyForm = () => ({ name: "", slug: "", title: "", email: "", phone: "", ext: "", credentials: "", website: "", linkedIn: "", description: "", notableDeals: "", headshot: "" });

  async function handleHeadshotUpload(file: File) {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file (JPEG, PNG, etc.).");
      return;
    }
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "agents");
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) setForm((f) => ({ ...f, headshot: data.url }));
    else alert("Upload failed.");
  }

  async function handleCreate() {
    if (!form.name.trim() || !form.email.trim()) {
      alert("Name and email are required.");
      return;
    }
    const notableDealsJson = form.notableDeals.trim()
      ? JSON.stringify(form.notableDeals.trim().split("\n").filter(Boolean))
      : null;
    const payload = { ...form, phone: parseFormattedPhone(form.phone) || form.phone || null, notableDealsJson };
    const res = await fetch("/api/admin/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const agent = await res.json();
      setAgents((prev) => [...prev, agent].sort((a, b) => a.order - b.order));
      setForm(emptyForm());
      setAdding(false);
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err.error || "Failed to create agent");
    }
  }

  async function handleSave(id: string) {
    const notableDealsJson = form.notableDeals.trim()
      ? JSON.stringify(form.notableDeals.trim().split("\n").filter(Boolean))
      : null;
    const payload = { ...form, phone: parseFormattedPhone(form.phone) || form.phone, notableDealsJson };
    const res = await fetch(`/api/admin/agents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const updated = await res.json();
      setAgents((prev) => prev.map((a) => (a.id === id ? updated : a)));
      setEditing(null);
    }
  }

  async function handleReorder(fromIndex: number, direction: "up" | "down") {
    const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= agents.length) return;
    const reordered = [...agents];
    [reordered[fromIndex], reordered[toIndex]] = [reordered[toIndex]!, reordered[fromIndex]!];
    const agentIds = reordered.map((a) => a.id);
    const res = await fetch("/api/admin/agents/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentIds }),
    });
    if (res.ok) {
      const data = await res.json();
      setAgents(data);
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-[var(--charcoal)]">Agents</h1>
        <p className="mt-4 text-[var(--charcoal-light)]">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--charcoal)]">Agents</h1>
          <p className="mt-1 text-[var(--charcoal-light)]">
            {agents.length} team members. Order matches the public Team page.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setAdding(true); setEditing(null); setForm(emptyForm()); }}
          className="rounded-lg bg-[var(--navy)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          New Agent
        </button>
      </div>

      {adding && (
        <div className="mt-6 rounded-lg border border-[var(--border)] border-dashed bg-[var(--surface-muted)] p-4">
          <p className="mb-3 text-sm font-medium text-[var(--charcoal)]">Add new agent</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Name *" className="rounded border px-3 py-2 text-sm" />
            <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="URL slug (e.g. james-smith)" className="rounded border px-3 py-2 text-sm" />
            <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Title" className="rounded border px-3 py-2 text-sm" />
            <input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="Email *" type="email" className="rounded border px-3 py-2 text-sm" />
            <div className="flex gap-2">
              <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: formatPhoneInput(e.target.value) }))} placeholder="(614) 559-3350" className="flex-1 rounded border px-3 py-2 text-sm" />
              <input value={form.ext} onChange={(e) => setForm((f) => ({ ...f, ext: e.target.value.replace(/\D/g, "") }))} placeholder="Ext" className="w-20 rounded border px-3 py-2 text-sm" />
            </div>
            <input value={form.credentials} onChange={(e) => setForm((f) => ({ ...f, credentials: e.target.value }))} placeholder="Credentials (e.g. CCIM)" className="rounded border px-3 py-2 text-sm" />
            <input value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} placeholder="Website URL" type="url" className="rounded border px-3 py-2 text-sm" />
            <input value={form.linkedIn} onChange={(e) => setForm((f) => ({ ...f, linkedIn: e.target.value }))} placeholder="LinkedIn URL" type="url" className="rounded border px-3 py-2 text-sm" />
            <div className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-xs font-medium text-[var(--charcoal-light)]">Description (for landing page)</span>
              <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Bio/overview..." rows={3} className="rounded border px-3 py-2 text-sm" />
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-xs font-medium text-[var(--charcoal-light)]">Notable deals (one per line)</span>
              <textarea value={form.notableDeals} onChange={(e) => setForm((f) => ({ ...f, notableDeals: e.target.value }))} placeholder="Deal 1&#10;Deal 2&#10;Deal 3" rows={3} className="rounded border px-3 py-2 text-sm" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-[var(--charcoal-light)]">Headshot</span>
              <label className="flex cursor-pointer items-center gap-2 rounded border border-dashed border-[var(--border)] px-3 py-2 text-sm hover:border-[var(--navy)] hover:bg-[var(--surface-muted)]">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleHeadshotUpload(f); e.target.value = ""; }} />
                {form.headshot ? (
                  <span className="flex items-center gap-2">
                    <img src={form.headshot} alt="" className="h-10 w-10 rounded object-cover" />
                    <span className="truncate text-[var(--charcoal-light)]">{form.headshot.split("/").pop()}</span>
                    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setForm((f) => ({ ...f, headshot: "" })); }} className="ml-1 rounded px-1.5 py-0.5 text-xs text-red-600 hover:bg-red-50">Remove</button>
                  </span>
                ) : (
                  <span className="text-[var(--charcoal-light)]">Click to select image</span>
                )}
              </label>
            </div>
            <div className="flex gap-2 sm:col-span-2">
              <button onClick={handleCreate} className="rounded-lg bg-[var(--navy)] px-4 py-2 text-sm font-semibold text-white">Create Agent</button>
              <button onClick={() => { setAdding(false); setForm(emptyForm()); }} className="rounded-lg border px-4 py-2 text-sm font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((a, i) => (
            <div key={a.id} className="group relative flex flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm">
              <div className="absolute right-2 top-2 z-10 flex flex-col gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => handleReorder(i, "up")}
                  disabled={i === 0}
                  className="rounded bg-white/90 p-1 shadow hover:bg-white disabled:opacity-30"
                  aria-label="Move up"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                </button>
                <button
                  type="button"
                  onClick={() => handleReorder(i, "down")}
                  disabled={i === agents.length - 1}
                  className="rounded bg-white/90 p-1 shadow hover:bg-white disabled:opacity-30"
                  aria-label="Move down"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
              </div>
              <div className="relative aspect-square w-full overflow-hidden bg-[var(--surface-muted)]">
                {a.headshot ? (
                  <Image src={a.headshot} alt={a.name} fill className="object-cover object-top" sizes="400px" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl font-semibold text-[var(--muted)]">{a.name.charAt(0)}</div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="font-semibold text-[var(--charcoal)]">{a.name}</p>
                <p className="text-sm text-[var(--charcoal-light)]">{a.title || a.email}</p>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(a.id);
                    setForm({
                      name: a.name,
                      slug: a.slug || "",
                      title: a.title || "",
                      email: a.email,
                      phone: a.phone ? formatPhoneInput(a.phone) : "",
                      ext: a.ext || "",
                      credentials: a.credentials || "",
                      website: a.website || "",
                      linkedIn: a.linkedIn || "",
                      description: a.description || "",
                      notableDeals: (() => { try { return a.notableDealsJson ? (JSON.parse(a.notableDealsJson) as string[]).join("\n") : ""; } catch { return ""; } })(),
                      headshot: a.headshot || "",
                    });
                  }}
                  className="mt-2 text-sm font-medium text-[var(--navy)] hover:underline"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-[var(--charcoal)]">Edit Agent</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Name" className="rounded border px-3 py-2 text-sm" />
              <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="URL slug" className="rounded border px-3 py-2 text-sm" />
              <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Title" className="rounded border px-3 py-2 text-sm" />
              <input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="Email" type="email" className="rounded border px-3 py-2 text-sm" />
              <div className="flex gap-2">
                <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: formatPhoneInput(e.target.value) }))} placeholder="(614) 559-3350" className="flex-1 rounded border px-3 py-2 text-sm" />
                <input value={form.ext} onChange={(e) => setForm((f) => ({ ...f, ext: e.target.value.replace(/\D/g, "") }))} placeholder="Ext" className="w-20 rounded border px-3 py-2 text-sm" />
              </div>
              <input value={form.credentials} onChange={(e) => setForm((f) => ({ ...f, credentials: e.target.value }))} placeholder="Credentials" className="rounded border px-3 py-2 text-sm" />
              <input value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} placeholder="Website" type="url" className="rounded border px-3 py-2 text-sm" />
              <input value={form.linkedIn} onChange={(e) => setForm((f) => ({ ...f, linkedIn: e.target.value }))} placeholder="LinkedIn" type="url" className="rounded border px-3 py-2 text-sm" />
              <div className="sm:col-span-2">
                <span className="text-xs font-medium text-[var(--charcoal-light)]">Description</span>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Bio/overview" rows={3} className="mt-1 w-full rounded border px-3 py-2 text-sm" />
              </div>
              <div className="sm:col-span-2">
                <span className="text-xs font-medium text-[var(--charcoal-light)]">Notable deals (one per line)</span>
                <textarea value={form.notableDeals} onChange={(e) => setForm((f) => ({ ...f, notableDeals: e.target.value }))} placeholder="Deal 1&#10;Deal 2" rows={3} className="mt-1 w-full rounded border px-3 py-2 text-sm" />
              </div>
              <div className="sm:col-span-2">
                <span className="text-xs font-medium text-[var(--charcoal-light)]">Headshot</span>
                <label className="mt-1 flex cursor-pointer items-center gap-2 rounded border border-dashed border-[var(--border)] px-3 py-2 text-sm hover:border-[var(--navy)] hover:bg-[var(--surface-muted)]">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleHeadshotUpload(f); e.target.value = ""; }} />
                  {form.headshot ? (
                    <span className="flex items-center gap-2">
                      <img src={form.headshot} alt="" className="h-10 w-10 rounded object-cover" />
                      <span className="truncate text-[var(--charcoal-light)]">{form.headshot.split("/").pop()}</span>
                      <button type="button" onClick={(e) => { e.preventDefault(); setForm((f) => ({ ...f, headshot: "" })); }} className="rounded px-1.5 py-0.5 text-xs text-red-600 hover:bg-red-50">Remove</button>
                    </span>
                  ) : (
                    <span className="text-[var(--charcoal-light)]">Click to select image</span>
                  )}
                </label>
              </div>
              <div className="flex gap-2 sm:col-span-2">
                <button onClick={() => editing && handleSave(editing)} className="rounded-lg bg-[var(--navy)] px-4 py-2 text-sm font-semibold text-white">Save</button>
                <button onClick={() => setEditing(null)} className="rounded-lg border px-4 py-2 text-sm font-medium">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
