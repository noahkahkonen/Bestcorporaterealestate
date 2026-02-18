/**
 * One-time fix: Update South High Street Retail coordinates.
 * Run: npx tsx scripts/fix-south-high-coords.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.listing.updateMany({
    where: { slug: "south-high-street-retail" },
    data: { latitude: 39.92996, longitude: -82.99527 },
  });
  console.log(`Updated ${result.count} listing(s) for South High Street coordinates.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
