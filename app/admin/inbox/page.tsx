"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPhone } from "@/lib/format-phone";

export default function AdminInboxPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/contact")
      .then(async (r) => {
        const text = await r.text();
        if (!text.trim()) return [];
        try {
          return JSON.parse(text);
        } catch {
          return [];
        }
      })
      .then(setMessages)
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, []);

  async function markRead(id: string, read: boolean) {
    await fetch("/api/admin/contact", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read }),
    });
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read } : m)));
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-[var(--charcoal)]">Inbox</h1>
        <p className="mt-4 text-[var(--charcoal-light)]">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--charcoal)]">Inbox</h1>
      <p className="mt-1 text-[var(--charcoal-light)]">
        {messages.filter((m) => !m.read).length} unread of {messages.length} messages.
      </p>
      <div className="mt-6 space-y-4">
        {messages.length === 0 ? (
          <p className="text-[var(--charcoal-light)]">No messages yet.</p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 ${!m.read ? "border-l-4 border-l-[var(--navy)]" : ""}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-[var(--charcoal)]">{m.name}</p>
                  <p className="text-sm text-[var(--charcoal-light)]">{m.email}</p>
                  {m.phone && <p className="text-sm text-[var(--charcoal-light)]">{formatPhone(m.phone)}</p>}
                  {m.listingTitle && (
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      Property:{" "}
                      {m.listingSlug ? (
                        <Link href={`/listings/${m.listingSlug}`} target="_blank" className="font-medium text-[var(--navy)] hover:underline">
                          {m.listingTitle}
                        </Link>
                      ) : (
                        m.listingTitle
                      )}
                    </p>
                  )}
                  {m.service && <p className="mt-1 text-xs text-[var(--muted)]">Service: {m.service}</p>}
                  <p className="mt-2 text-sm text-[var(--charcoal)]">{m.message}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {new Date(m.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => markRead(m.id, !m.read)}
                  className={`shrink-0 rounded px-2 py-1 text-xs font-medium ${m.read ? "bg-[var(--surface-muted)]" : "bg-[var(--navy)] text-white"}`}
                >
                  {m.read ? "Unread" : "Read"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
