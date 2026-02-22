import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [unreadMessages, applications] = await Promise.all([
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.leaseApplication.count({ where: { received: false } }),
  ]);

  return NextResponse.json({ unreadMessages, applications });
}
