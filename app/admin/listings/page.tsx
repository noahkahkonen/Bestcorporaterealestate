import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import AdminListingsClient from "@/components/admin/AdminListingsClient";

export const dynamic = "force-dynamic";

export default async function AdminListingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  let initialListings: Awaited<ReturnType<typeof prisma.listing.findMany>> = [];
  let loadError: string | null = null;

  try {
    initialListings = await prisma.listing.findMany({
      include: { brokers: { include: { agent: true } } },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    });
  } catch (err) {
    console.error("Admin listings page Prisma error:", err);
    loadError = err instanceof Error ? err.message : "Database error while loading listings.";
  }

  /* Serialize for client (Dates → strings); same query shape as dashboard count's DB. */
  const serialized = JSON.parse(JSON.stringify(initialListings)) as any[];

  return <AdminListingsClient initialListings={serialized} loadError={loadError} />;
}
