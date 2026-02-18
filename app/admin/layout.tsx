import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import AdminProvider from "@/components/AdminProvider";
import AdminNavWithCounts from "@/components/AdminNavWithCounts";
import SignOutButton from "@/components/SignOutButton";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (err) {
    console.error("Admin layout getServerSession error:", err);
  }

  return (
    <AdminProvider>
      <div className="min-h-screen bg-[var(--surface-muted)]">
        {session ? (
          <>
            <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--surface)]">
              <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                <div className="flex items-center gap-6">
                  <Link href="/admin" className="font-semibold text-[var(--charcoal)]">
                    Best CRE Admin
                  </Link>
                  <AdminNavWithCounts />
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <Link href="/" className="text-sm text-[var(--charcoal-light)] hover:text-[var(--navy)]" target="_blank">
                    View site
                  </Link>
                  <SignOutButton />
                </div>
              </div>
            </header>
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
          </>
        ) : (
          children
        )}
      </div>
    </AdminProvider>
  );
}
