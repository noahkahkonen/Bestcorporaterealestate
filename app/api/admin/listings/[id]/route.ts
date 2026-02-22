import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: rawId } = await params;
  const id = resolveListingId(rawId);
  if (!id) return NextResponse.json({ error: "Invalid listing ID" }, { status: 400 });
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { brokers: { include: { agent: true } } },
  });
  if (!listing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(listing);
}

/** CUIDs are ~25 alphanumeric chars. Reject invalid formats; fix "listingId|agentId" composite key leak. */
function resolveListingId(raw: string): string | null {
  if (typeof raw !== "string" || !raw.trim()) return null;
  // If pipe-separated (e.g. ListingBroker composite key), use the listingId part
  const id = raw.includes("|") ? raw.split("|")[0]!.trim() : raw.trim();
  if (id.length >= 15 && id.length <= 30 && /^[a-z0-9]+$/i.test(id)) return id;
  return null;
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: rawId } = await params;
  const id = resolveListingId(rawId);
  if (!id) {
    return NextResponse.json({ error: "Invalid listing ID" }, { status: 400 });
  }

  const existing = await prisma.listing.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (Object.keys(body).length === 1) {
    if (typeof body.published === "boolean") {
      const listing = await prisma.listing.update({
        where: { id },
        data: { published: body.published },
      });
      return NextResponse.json(listing);
    }
    if (typeof body.featured === "boolean") {
      const listing = await prisma.listing.update({
        where: { id },
        data: { featured: body.featured },
      });
      return NextResponse.json(listing);
    }
  }

  try {
    const brokerIds = Array.isArray(body.brokerIds) ? (body.brokerIds as string[]) : undefined;

    const data: Record<string, unknown> = {};

    if ("title" in body && body.title != null) data.title = String(body.title);
    if ("slug" in body && body.slug != null) data.slug = String(body.slug);
    if ("nickname" in body) data.nickname = body.nickname != null && body.nickname !== "" ? String(body.nickname) : null;
    if ("address" in body && body.address != null) data.address = String(body.address);
    if ("city" in body && body.city != null) data.city = String(body.city);
    if ("state" in body && body.state != null) data.state = String(body.state);
    if ("zipCode" in body) data.zipCode = body.zipCode != null && body.zipCode !== "" ? String(body.zipCode) : null;

    if ("latitude" in body && body.latitude != null && body.latitude !== "") {
      const n = parseFloat(String(body.latitude));
      data.latitude = Number.isFinite(n) ? n : existing.latitude;
    }
    if ("longitude" in body && body.longitude != null && body.longitude !== "") {
      const n = parseFloat(String(body.longitude));
      data.longitude = Number.isFinite(n) ? n : existing.longitude;
    }

    if ("listingType" in body) {
      const lt = body.listingType != null && String(body.listingType).trim();
      data.listingType = lt ? String(body.listingType).trim() : "For Sale";
    }
    if ("propertyType" in body && body.propertyType != null) data.propertyType = String(body.propertyType);
    if ("landSubcategory" in body) data.landSubcategory = body.landSubcategory != null && body.landSubcategory !== "" ? String(body.landSubcategory) : null;

    if ("squareFeet" in body) {
      const v = body.squareFeet;
      const n = v != null && v !== "" ? parseInt(String(v), 10) : NaN;
      data.squareFeet = Number.isFinite(n) ? n : null;
    }
    if ("acreage" in body) {
      const v = body.acreage;
      const n = v != null && v !== "" ? parseFloat(String(v)) : NaN;
      data.acreage = Number.isFinite(n) ? n : null;
    }
    if ("isMultiTenant" in body) data.isMultiTenant = Boolean(body.isMultiTenant);
    if ("unitCount" in body) {
      const v = body.unitCount;
      const n = v != null && v !== "" ? parseInt(String(v), 10) : NaN;
      data.unitCount = Number.isFinite(n) ? n : null;
    }
    if ("unitsJson" in body) data.unitsJson = body.unitsJson != null && body.unitsJson !== "" ? String(body.unitsJson) : null;

    if ("description" in body && body.description != null) data.description = String(body.description);

    if ("featuresJson" in body) {
      const raw = body.featuresJson;
      const arr = Array.isArray(raw) ? raw : typeof raw === "string" ? (() => { try { return JSON.parse(raw) as unknown[]; } catch { return []; } })() : [];
      data.featuresJson = JSON.stringify(Array.isArray(arr) ? arr : []);
    }

    if ("heroImage" in body) data.heroImage = body.heroImage != null && body.heroImage !== "" ? String(body.heroImage) : null;
    if ("galleryImagesJson" in body) {
      const g = body.galleryImagesJson;
      data.galleryImagesJson = g != null && g !== "" ? (typeof g === "string" ? g : JSON.stringify(g)) : null;
    }

    if ("floorPlan" in body) data.floorPlan = body.floorPlan != null && body.floorPlan !== "" ? String(body.floorPlan) : null;
    if ("sitePlan" in body) data.sitePlan = body.sitePlan != null && body.sitePlan !== "" ? String(body.sitePlan) : null;
    if ("brochure" in body) data.brochure = body.brochure != null && body.brochure !== "" ? String(body.brochure) : null;
    if ("youtubeLink" in body) data.youtubeLink = body.youtubeLink != null && body.youtubeLink !== "" ? String(body.youtubeLink) : null;

    if ("noi" in body) {
      const v = body.noi;
      const n = v != null && v !== "" ? parseFloat(String(v)) : NaN;
      data.noi = Number.isFinite(n) ? n : null;
    }
    if ("priceNegotiable" in body) data.priceNegotiable = Boolean(body.priceNegotiable);
    if (data.priceNegotiable === true) {
      data.price = null;
    } else if ("price" in body) {
      const v = body.price;
      const n = v != null && v !== "" ? parseFloat(String(v)) : NaN;
      data.price = Number.isFinite(n) ? n : null;
    }
    if ("leaseType" in body) data.leaseType = body.leaseType != null && String(body.leaseType).trim() ? String(body.leaseType).trim() : null;
    if ("leasePricePerSf" in body) {
      const v = body.leasePricePerSf;
      const n = v != null && v !== "" ? parseFloat(String(v)) : NaN;
      data.leasePricePerSf = Number.isFinite(n) ? n : null;
    }
    if ("leaseNnnCharges" in body) {
      const v = body.leaseNnnCharges;
      const n = v != null && v !== "" ? parseFloat(String(v)) : NaN;
      data.leaseNnnCharges = Number.isFinite(n) ? n : null;
    }
    if ("capRate" in body) {
      const v = body.capRate;
      const n = v != null && v !== "" ? parseFloat(String(v)) : NaN;
      data.capRate = Number.isFinite(n) ? n : null;
    }
    if ("occupancy" in body) data.occupancy = body.occupancy != null && String(body.occupancy).trim() ? String(body.occupancy).trim() : null;
    if ("published" in body && typeof body.published === "boolean") data.published = body.published;
    if ("featured" in body && typeof body.featured === "boolean") data.featured = body.featured;

    if ("status" in body && body.status != null) {
      const s = String(body.status).trim();
      if (["Active", "Pending", "Sold"].includes(s)) data.status = s;
    }
    if ("soldPrice" in body) {
      const v = body.soldPrice;
      let n = NaN;
      if (v != null && v !== "") {
        const str = String(v).replace(/,/g, "");
        n = parseFloat(str);
      }
      data.soldPrice = Number.isFinite(n) ? n : null;
    }
    if ("soldDate" in body) {
      const v = body.soldDate;
      data.soldDate = v != null && String(v).trim() ? new Date(String(v).trim()) : null;
    }
    if ("soldNotes" in body) {
      const v = body.soldNotes;
      data.soldNotes = v != null && String(v).trim() ? String(v).trim() : null;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(existing);
    }

    await prisma.listing.update({
      where: { id },
      data: data as Parameters<typeof prisma.listing.update>[0]["data"],
    });

    if (brokerIds !== undefined) {
      await prisma.listingBroker.deleteMany({ where: { listingId: id } });
      for (const agentId of brokerIds) {
        if (typeof agentId === "string") {
          await prisma.listingBroker.create({ data: { listingId: id, agentId } });
        }
      }
    }

    const updated = await prisma.listing.findUnique({
      where: { id },
      include: { brokers: { include: { agent: true } } },
    });
    return NextResponse.json(updated ?? existing);
  } catch (err) {
    console.error("Listing update error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: rawId } = await params;
  const id = resolveListingId(rawId);
  if (!id) return NextResponse.json({ error: "Invalid listing ID" }, { status: 400 });
  try {
    await prisma.listing.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete listing" }, { status: 500 });
  }
}
