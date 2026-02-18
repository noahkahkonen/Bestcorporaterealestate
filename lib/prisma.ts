import path from "node:path";
import { PrismaClient } from "@prisma/client";

// Resolve relative DATABASE_URL to absolute path (fixes cwd issues in dev/build)
const url = process.env.DATABASE_URL;
if (url?.startsWith("file:./")) {
  const rel = url.replace("file:./", "");
  const absolute = path.resolve(process.cwd(), "prisma", rel);
  process.env.DATABASE_URL = `file:${absolute}`;
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
