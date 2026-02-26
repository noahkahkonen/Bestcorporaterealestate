import path from "path";
import { PrismaClient } from "@prisma/client";

// Resolve relative DATABASE_URL to absolute path (fixes cwd issues in dev/build)
let url = process.env.DATABASE_URL;
if (url?.startsWith("file:./")) {
  const rel = url.replace("file:./", "");
  const absolute = path.resolve(process.cwd(), "prisma", rel);
  process.env.DATABASE_URL = `file:${absolute}`;
  url = process.env.DATABASE_URL;
}

// Neon pooled connection requires pgbouncer=true for Prisma (serverless/Vercel)
if (url && url.includes("pooler") && !url.includes("pgbouncer=true")) {
  const separator = url.includes("?") ? "&" : "?";
  process.env.DATABASE_URL = `${url}${separator}pgbouncer=true`;
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
