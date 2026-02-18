"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

export default function AdminNavWithCounts() {
  const [counts, setCounts] = useState<{ unreadMessages: number; applications: number } | null>(null);

  async function fetchCounts() {
    try {
      const res = await fetch("/api/admin/notification-counts");
      if (res.ok) {
        const data = await res.json();
        setCounts({ unreadMessages: data.unreadMessages ?? 0, applications: data.applications ?? 0 });
      }
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    fetchCounts();
    const interval = setInterval(fetchCounts, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="hidden gap-4 sm:flex">
      <Link href="/admin" className="text-sm text-[var(--charcoal-light)] hover:text-[var(--navy)]">
        Dashboard
      </Link>
      <Link href="/admin/listings" className="text-sm text-[var(--charcoal-light)] hover:text-[var(--navy)]">
        Listings
      </Link>
      <Link href="/admin/agents" className="text-sm text-[var(--charcoal-light)] hover:text-[var(--navy)]">
        Agents
      </Link>
      <Link href="/admin/inbox" className="relative inline-flex text-sm text-[var(--charcoal-light)] hover:text-[var(--navy)]">
        Inbox
        {counts != null && counts.unreadMessages > 0 && (
          <span className="absolute -right-3 -top-2 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-amber-500 px-1.5 text-[10px] font-bold text-white">
            {counts.unreadMessages > 99 ? "99+" : counts.unreadMessages}
          </span>
        )}
      </Link>
      <Link href="/admin/applications" className="relative inline-flex text-sm text-[var(--charcoal-light)] hover:text-[var(--navy)]">
        Applications
        {counts != null && counts.applications > 0 && (
          <span className="absolute -right-3 -top-2 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-amber-500 px-1.5 text-[10px] font-bold text-white">
            {counts.applications > 99 ? "99+" : counts.applications}
          </span>
        )}
      </Link>
    </nav>
  );
}
