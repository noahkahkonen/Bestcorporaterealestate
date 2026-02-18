"use client";

import { useEffect, useState } from "react";
import { formatPhoneInput, parseFormattedPhone } from "@/lib/format-admin-inputs";

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", title: "", email: "", phone: "", ext: "", credentials: "", website: "", headshot: "" });

  useEffect(() => {
    fetch("/api/admin/agents")
      .then((r) => r.json())
      .then(setAgents)
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(id: string) {
    const payload = { ...form, phone: parseFormattedPhone(form.phone) || form.phone };
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
      <h1 className="text-2xl font-bold text-[var(--charcoal)]">Agents</h1>
      <p className="mt-1 text-[var(--charcoal-light)]">{agents.length} team members.</p>
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
                <input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: formatPhoneInput(e.target.value) }))}
                  placeholder="(614) 555-0000"
                  className="rounded border px-3 py-2 text-sm"
                />
                <input
                  value={form.credentials}
                  onChange={(e) => setForm((f) => ({ ...f, credentials: e.target.value }))}
                  placeholder="Credentials (e.g. CCIM)"
                  className="rounded border px-3 py-2 text-sm"
                />
                <input
                  value={form.headshot}
                  onChange={(e) => setForm((f) => ({ ...f, headshot: e.target.value }))}
                  placeholder="Headshot URL"
                  className="rounded border px-3 py-2 text-sm"
                />
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
                      title: a.title || "",
                      email: a.email,
                      phone: a.phone ? formatPhoneInput(a.phone) : "",
                      ext: a.ext || "",
                      credentials: a.credentials || "",
                      website: a.website || "",
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
