import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const checks: Record<string, unknown> = {};
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = "ok";
  } catch (err) {
    checks.database = `error: ${err instanceof Error ? err.message : String(err)}`;
  }
  checks.env = {
    DATABASE_URL: process.env.DATABASE_URL ? "set" : "missing",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "set" : "missing",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "missing",
  };
  return NextResponse.json({
    ok: checks.database === "ok",
    checks,
  });
}
