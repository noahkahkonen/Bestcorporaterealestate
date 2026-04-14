import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const listings = await prisma.listing.findMany({
      include: { brokers: { include: { agent: true } } },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(listings);
  } catch (err) {
    console.error("GET /api/admin/listings:", err);
    const msg = err instanceof Error ? err.message : "Database error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const {
      nickname,
      address,
      city,
      state,
      zipCode,
      latitude,
      longitude,
      listingType,
      propertyType,
      landSubcategory,
      zoning,
      squareFeet,
      acreage,
      isMultiTenant,
      unitCount,
      unitsJson,
      description,
      featuresJson,
      heroImage,
      galleryImagesJson,
      floorPlan,
      sitePlan,
      brochure,
      youtubeLink,
      noi,
      price,
      priceNegotiable,
      leaseType,
      leasePricePerSf,
      leaseNnnCharges,
      capRate,
      capRatePricingCall,
      brokerIds,
      published: publishedBody,
    } = body;

    const title = body.title || nickname || address || "New Listing";
    const slug = body.slug || slugify(title);
    /** Omitting `published` defaults to live (matches Prisma schema). Set `published: false` for drafts. */
    const published = typeof publishedBody === "boolean" ? publishedBody : true;

    const listing = await prisma.listing.create({
      data: {
        slug,
        title,
        nickname: nickname || null,
        address: address || "",
        city: city || "",
        state: state || "OH",
        zipCode: zipCode || null,
        latitude: parseFloat(latitude) || 39.9612,
        longitude: parseFloat(longitude) || -83.0007,
        listingType: listingType || "For Sale",
        propertyType: propertyType || "Retail",
        landSubcategory: landSubcategory || null,
        zoning: zoning != null && String(zoning).trim() ? String(zoning).trim() : null,
        squareFeet: squareFeet ? parseInt(squareFeet, 10) : null,
        acreage: acreage ? parseFloat(acreage) : null,
        isMultiTenant: !!isMultiTenant,
        unitCount: unitCount ? parseInt(unitCount, 10) : null,
        unitsJson: unitsJson || null,
        description: description || "",
        featuresJson: JSON.stringify(Array.isArray(featuresJson) ? featuresJson : featuresJson ? JSON.parse(featuresJson) : []),
        heroImage: heroImage || null,
        galleryImagesJson: galleryImagesJson || null,
        floorPlan: floorPlan || null,
        sitePlan: sitePlan || null,
        brochure: brochure || null,
        youtubeLink: youtubeLink || null,
        noi: capRatePricingCall ? null : noi ? parseFloat(noi) : null,
        price: price && !priceNegotiable ? parseFloat(price) : null,
        priceNegotiable: !!priceNegotiable,
        leaseType: leaseType || null,
        leasePricePerSf: leasePricePerSf ? parseFloat(leasePricePerSf) : null,
        leaseNnnCharges: leaseNnnCharges ? parseFloat(leaseNnnCharges) : null,
        capRate: capRatePricingCall ? null : capRate ? parseFloat(capRate) : null,
        capRatePricingCall: !!capRatePricingCall,
        published,
        featured: false,
      },
    });

    if (Array.isArray(brokerIds) && brokerIds.length) {
      for (const agentId of brokerIds) {
        await prisma.listingBroker.create({ data: { listingId: listing.id, agentId } });
      }
    }

    return NextResponse.json(listing);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}
