import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let listingCount = 0;
  let agentCount = 0;
  let unreadCount = 0;
  let applicationCount = 0;
  let dbError: string | null = null;
  try {
    [listingCount, agentCount, unreadCount, applicationCount] = await Promise.all([
      prisma.listing.count(),
      prisma.agent.count(),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.leaseApplication.count(),
    ]);
  } catch (err) {
    console.error("Admin dashboard Prisma error:", err);
    dbError = err instanceof Error ? err.message : "Database connection failed";
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--charcoal)]">Dashboard</h1>
      <p className="mt-1 text-[var(--charcoal-light)]">Welcome to Best Corporate Real Estate admin.</p>
      {dbError && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
            Could not load counts: {dbError}. Check database connection and migrations.
          </p>
          <a href="/api/health" target="_blank" rel="noopener noreferrer" className="mt-2 block text-xs underline">
            Run backend health check →
          </a>
        </div>
      )}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/listings"
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <p className="text-3xl font-bold text-[var(--navy)]">{listingCount}</p>
          <p className="mt-1 text-sm font-medium text-[var(--charcoal)]">Listings</p>
          <p className="mt-1 text-xs text-[var(--charcoal-light)]">Manage properties</p>
        </Link>
        <Link
          href="/admin/agents"
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <p className="text-3xl font-bold text-[var(--navy)]">{agentCount}</p>
          <p className="mt-1 text-sm font-medium text-[var(--charcoal)]">Agents</p>
          <p className="mt-1 text-xs text-[var(--charcoal-light)]">Team members</p>
        </Link>
        <Link
          href="/admin/inbox"
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <p className="text-3xl font-bold text-[var(--navy)]">{unreadCount}</p>
          <p className="mt-1 text-sm font-medium text-[var(--charcoal)]">Unread messages</p>
          <p className="mt-1 text-xs text-[var(--charcoal-light)]">Contact form inbox</p>
        </Link>
        <Link
          href="/admin/applications"
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <p className="text-3xl font-bold text-[var(--navy)]">{applicationCount}</p>
          <p className="mt-1 text-sm font-medium text-[var(--charcoal)]">Lease Applications</p>
          <p className="mt-1 text-xs text-[var(--charcoal-light)]">View applications & documents</p>
        </Link>
      </div>
      <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-950/30">
        <p className="text-sm font-medium text-green-800 dark:text-green-200">
          Published listings appear on the public site. Add a listing and click &quot;Publish&quot; to push it live.
        </p>
      </div>
    </div>
  );
}
