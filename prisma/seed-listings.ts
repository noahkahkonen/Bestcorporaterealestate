import { PrismaClient } from "@prisma/client";
import listingsData from "../data/listings.json";

const prisma = new PrismaClient();

async function main() {
  for (const l of listingsData as any[]) {
    const existing = await prisma.listing.findUnique({ where: { slug: l.slug } });
    if (existing) continue;

    const features = Array.isArray(l.features) ? l.features : [];
    const galleryImages = Array.isArray(l.galleryImages) ? l.galleryImages : [l.heroImage];

    await prisma.listing.create({
      data: {
        slug: l.slug,
        title: l.title,
        nickname: l.title,
        address: l.address,
        city: l.city,
        state: l.state || "OH",
        zipCode: l.zipCode || null,
        latitude: l.latitude ?? 39.96,
        longitude: l.longitude ?? -83,
        listingType: l.listingType || "For Sale",
        propertyType: l.propertyType || "Retail",
        squareFeet: l.squareFeet ?? null,
        acreage: l.acreage ?? null,
        description: l.description || "",
        featuresJson: JSON.stringify(features),
        heroImage: l.heroImage || null,
        galleryImagesJson: JSON.stringify(galleryImages),
        noi: l.investmentMetrics?.noi ?? null,
        price: l.investmentMetrics?.price ?? l.price ?? null,
        priceNegotiable: l.priceNegotiable ?? false,
        leaseType: l.leaseType ?? null,
        leasePricePerSf: l.leasePricePerSf ?? null,
        capRate: l.investmentMetrics?.capRate ?? l.capRate ?? null,
        published: true,
      },
    });
    console.log("Imported:", l.title);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
