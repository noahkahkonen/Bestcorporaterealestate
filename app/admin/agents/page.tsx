"use client";

import { useEffect, useState } from "react";
import { formatPhoneInput, parseFormattedPhone } from "@/lib/format-admin-inputs";

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", title: "", email: "", phone: "", ext: "", credentials: "", website: "", linkedIn: "", description: "", notableDeals: "", headshot: "" });

  useEffect(() => {
    fetch("/api/admin/agents")
      .then((r) => r.json())
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
      setAgents((prev) => [...prev, agent]);
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
    await fetch(`/api/admin/agents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, ...form } : a)));
    setEditing(null);
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
          <p className="mt-1 text-[var(--charcoal-light)]">{agents.length} team members.</p>
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
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Name *"
              className="rounded border px-3 py-2 text-sm"
            />
            <input
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="URL slug (e.g. james-smith)"
              className="rounded border px-3 py-2 text-sm"
            />
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Title"
              className="rounded border px-3 py-2 text-sm"
            />
            <input
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="Email *"
              type="email"
              className="rounded border px-3 py-2 text-sm"
            />
            <div className="flex gap-2">
              <input
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: formatPhoneInput(e.target.value) }))}
                placeholder="(614) 559-3350"
                className="flex-1 rounded border px-3 py-2 text-sm"
              />
              <input
                value={form.ext}
                onChange={(e) => setForm((f) => ({ ...f, ext: e.target.value.replace(/\D/g, "") }))}
                placeholder="Ext"
                className="w-20 rounded border px-3 py-2 text-sm"
              />
            </div>
            <input
              value={form.credentials}
              onChange={(e) => setForm((f) => ({ ...f, credentials: e.target.value }))}
              placeholder="Credentials (e.g. CCIM)"
              className="rounded border px-3 py-2 text-sm"
            />
            <input
              value={form.website}
              onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
              placeholder="Website URL"
              type="url"
              className="rounded border px-3 py-2 text-sm"
            />
            <input
              value={form.linkedIn}
              onChange={(e) => setForm((f) => ({ ...f, linkedIn: e.target.value }))}
              placeholder="LinkedIn URL"
              type="url"
              className="rounded border px-3 py-2 text-sm"
            />
            <div className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-xs font-medium text-[var(--charcoal-light)]">Description (for landing page)</span>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Bio/overview..."
                rows={3}
                className="rounded border px-3 py-2 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-xs font-medium text-[var(--charcoal-light)]">Notable deals (one per line)</span>
              <textarea
                value={form.notableDeals}
                onChange={(e) => setForm((f) => ({ ...f, notableDeals: e.target.value }))}
                placeholder="Deal 1&#10;Deal 2&#10;Deal 3"
                rows={3}
                className="rounded border px-3 py-2 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-[var(--charcoal-light)]">Headshot</span>
              <label className="flex cursor-pointer items-center gap-2 rounded border border-dashed border-[var(--border)] px-3 py-2 text-sm hover:border-[var(--navy)] hover:bg-[var(--surface-muted)]">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleHeadshotUpload(f);
                    e.target.value = "";
                  }}
                />
                {form.headshot ? (
                  <span className="flex items-center gap-2">
                    <img src={form.headshot} alt="" className="h-10 w-10 rounded object-cover" />
                    <span className="truncate text-[var(--charcoal-light)]">{form.headshot.split("/").pop()}</span>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setForm((f) => ({ ...f, headshot: "" })); }}
                      className="ml-1 rounded px-1.5 py-0.5 text-xs text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </span>
                ) : (
                  <span className="text-[var(--charcoal-light)]">Click to select image</span>
                )}
              </label>
            </div>
            <div className="flex gap-2 sm:col-span-2">
              <button
                onClick={handleCreate}
                className="rounded-lg bg-[var(--navy)] px-4 py-2 text-sm font-semibold text-white"
              >
                Create Agent
              </button>
              <button
                onClick={() => { setAdding(false); setForm(emptyForm()); }}
                className="rounded-lg border px-4 py-2 text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {agents.map((a) => (
          <div key={a.id} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
            {editing === a.id ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Name"
                  className="rounded border px-3 py-2 text-sm"
                />
                <input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="URL slug (e.g. james-smith)"
                  className="rounded border px-3 py-2 text-sm"
                />
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Title"
                  className="rounded border px-3 py-2 text-sm"
                />
                <input
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="Email"
                  type="email"
                  className="rounded border px-3 py-2 text-sm"
                />
                <div className="flex gap-2">
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: formatPhoneInput(e.target.value) }))}
                    placeholder="(614) 559-3350"
                    className="flex-1 rounded border px-3 py-2 text-sm"
                  />
                  <input
                    value={form.ext}
                    onChange={(e) => setForm((f) => ({ ...f, ext: e.target.value.replace(/\D/g, "") }))}
                    placeholder="Ext"
                    className="w-20 rounded border px-3 py-2 text-sm"
                  />
                </div>
                <input
                  value={form.credentials}
                  onChange={(e) => setForm((f) => ({ ...f, credentials: e.target.value }))}
                  placeholder="Credentials (e.g. CCIM)"
                  className="rounded border px-3 py-2 text-sm"
                />
                <input
                  value={form.website}
                  onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                  placeholder="Website URL"
                  type="url"
                  className="rounded border px-3 py-2 text-sm"
                />
                <input
                  value={form.linkedIn}
                  onChange={(e) => setForm((f) => ({ ...f, linkedIn: e.target.value }))}
                  placeholder="LinkedIn URL"
                  type="url"
                  className="rounded border px-3 py-2 text-sm"
                />
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <span className="text-xs font-medium text-[var(--charcoal-light)]">Description</span>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Bio/overview for landing page"
                    rows={3}
                    className="rounded border px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <span className="text-xs font-medium text-[var(--charcoal-light)]">Notable deals (one per line)</span>
                  <textarea
                    value={form.notableDeals}
                    onChange={(e) => setForm((f) => ({ ...f, notableDeals: e.target.value }))}
                    placeholder="Deal 1&#10;Deal 2"
                    rows={3}
                    className="rounded border px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-[var(--charcoal-light)]">Headshot</span>
                  <label className="flex cursor-pointer items-center gap-2 rounded border border-dashed border-[var(--border)] px-3 py-2 text-sm hover:border-[var(--navy)] hover:bg-[var(--surface-muted)]">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleHeadshotUpload(f);
                        e.target.value = "";
                      }}
                    />
                    {form.headshot ? (
                      <span className="flex items-center gap-2">
                        <img src={form.headshot} alt="" className="h-10 w-10 rounded object-cover" />
                        <span className="truncate text-[var(--charcoal-light)]">{form.headshot.split("/").pop()}</span>
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setForm((f) => ({ ...f, headshot: "" })); }}
                          className="ml-1 rounded px-1.5 py-0.5 text-xs text-red-600 hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </span>
                    ) : (
                      <span className="text-[var(--charcoal-light)]">Click to select image</span>
                    )}
                  </label>
                </div>
                <div className="flex gap-2 sm:col-span-2">
                  <button
                    onClick={() => handleSave(a.id)}
                    className="rounded-lg bg-[var(--navy)] px-4 py-2 text-sm font-semibold text-white"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="rounded-lg border px-4 py-2 text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {a.headshot && (
                    <img src={a.headshot} alt="" className="h-14 w-14 rounded-lg object-cover" />
                  )}
                  <div>
                    <p className="font-semibold text-[var(--charcoal)]">{a.name}</p>
                    <p className="text-sm text-[var(--charcoal-light)]">{a.title || a.email}</p>
                  </div>
                </div>
                <button
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
                      notableDeals: a.notableDealsJson ? (JSON.parse(a.notableDealsJson) as string[]).join("\n") : "",
                      headshot: a.headshot || "",
                    });
                  }}
                  className="rounded-lg border px-3 py-1.5 text-sm font-medium"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
