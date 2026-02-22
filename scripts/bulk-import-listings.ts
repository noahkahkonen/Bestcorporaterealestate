/**
 * Bulk import listings from CSV.
 * Usage: npx tsx scripts/bulk-import-listings.ts data/my-listings.csv
 */
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { resolve } from "path";

const prisma = new PrismaClient();

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === '"') {
      let field = "";
      i++;
      while (i < line.length) {
        if (line[i] === '"') {
          if (line[i + 1] === '"') {
            field += '"';
            i += 2;
          } else {
            i++;
            break;
          }
        } else {
          field += line[i++];
        }
      }
      result.push(field);
      if (line[i] === ",") i++;
    } else {
      let field = "";
      while (i < line.length && line[i] !== ",") {
        field += line[i++];
      }
      result.push(field.trim());
      if (line[i] === ",") i++;
    }
  }
  return result;
}

function parseCSV(content: string): Record<string, string>[] {
  const lines = content.split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length < 2) return [];
  const headers = parseCSVLine(lines[0]);
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, j) => {
      row[h] = (values[j] ?? "").trim();
    });
    rows.push(row);
  }
  return rows;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error("Usage: npx tsx scripts/bulk-import-listings.ts <path-to-csv>");
    process.exit(1);
  }

  const absPath = resolve(process.cwd(), csvPath);
  let content: string;
  try {
    content = readFileSync(absPath, "utf-8").replace(/^\uFEFF/, "");
  } catch (e) {
    console.error("Could not read file:", csvPath, e);
    process.exit(1);
  }

  const rows = parseCSV(content);
  if (rows.length === 0) {
    console.error("No data rows found in CSV.");
    process.exit(1);
  }

  const agents = await prisma.agent.findMany({ select: { id: true, email: true } });
  const agentByEmail = new Map(agents.map((a) => [a.email.toLowerCase(), a.id]));

  let created = 0;
  let skipped = 0;

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const title = (r.title || "").trim();
    if (!title) {
      console.warn(`Row ${i + 2}: Skipping - no title`);
      skipped++;
      continue;
    }

    const slug = (r.slug || slugify(title)).trim() || slugify(title);
    const existing = await prisma.listing.findUnique({ where: { slug } });
    if (existing) {
      console.warn(`Row ${i + 2}: Skipping - slug "${slug}" already exists`);
      skipped++;
      continue;
    }

    const features = (r.features || "")
      .split("|")
      .map((f) => f.trim())
      .filter(Boolean);
    const galleryImages = (r.galleryImages || "")
      .split("|")
      .map((g) => g.trim())
      .filter(Boolean);
    const heroImage = (r.heroImage || "").trim() || null;
    if (heroImage && galleryImages.length === 0) galleryImages.push(heroImage);

    const brokerEmails = (r.brokerEmails || "")
      .split("|")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    const brokerIds = brokerEmails
      .map((e) => agentByEmail.get(e))
      .filter((id): id is string => !!id);

    const listing = await prisma.listing.create({
      data: {
        slug,
        title,
        nickname: (r.nickname || "").trim() || null,
        address: (r.address || "").trim() || "",
        city: (r.city || "").trim() || "",
        state: (r.state || "").trim() || "OH",
        zipCode: (r.zipCode || "").trim() || null,
        latitude: parseFloat(r.latitude) || 39.9612,
        longitude: parseFloat(r.longitude) || -83.0007,
        listingType: (r.listingType || "For Sale").trim(),
        propertyType: (r.propertyType || "Retail").trim(),
        landSubcategory: (r.landSubcategory || "").trim() || null,
        squareFeet: r.squareFeet ? parseInt(r.squareFeet, 10) : null,
        acreage: r.acreage ? parseFloat(r.acreage) : null,
        isMultiTenant: /^(true|1|yes)$/i.test((r.isMultiTenant || "").trim()),
        unitCount: r.unitCount ? parseInt(r.unitCount, 10) : null,
        description: (r.description || "").trim() || "",
        featuresJson: JSON.stringify(features),
        heroImage,
        galleryImagesJson: galleryImages.length ? JSON.stringify(galleryImages) : null,
        floorPlan: (r.floorPlan || "").trim() || null,
        sitePlan: (r.sitePlan || "").trim() || null,
        brochure: (r.brochure || "").trim() || null,
        youtubeLink: (r.youtubeLink || "").trim() || null,
        price: r.price ? parseFloat(r.price) : null,
        priceNegotiable: /^(true|1|yes)$/i.test((r.priceNegotiable || "").trim()),
        leaseType: (r.leaseType || "").trim() || null,
        leasePricePerSf: r.leasePricePerSf ? parseFloat(r.leasePricePerSf) : null,
        leaseNnnCharges: r.leaseNnnCharges ? parseFloat(r.leaseNnnCharges) : null,
        noi: r.noi ? parseFloat(r.noi) : null,
        capRate: r.capRate ? parseFloat(r.capRate) : null,
        occupancy: (r.occupancy || "").trim() || null,
        published: true,
        featured: false,
        status: (r.status || "Active").trim() || "Active",
        transactionOutcome: (r.transactionOutcome || "").trim() || null,
        soldPrice: r.soldPrice ? parseFloat(r.soldPrice) : null,
        soldDate: r.soldDate && !isNaN(new Date(r.soldDate).getTime()) ? new Date(r.soldDate) : null,
        soldNotes: (r.soldNotes || "").trim() || null,
      },
    });

    if (brokerIds.length) {
      for (const agentId of brokerIds) {
        await prisma.listingBroker.create({ data: { listingId: listing.id, agentId } });
      }
    }

    console.log(`Created: ${listing.title} (${listing.slug})`);
    created++;
  }

  console.log(`\nDone. Created: ${created}, Skipped: ${skipped}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
