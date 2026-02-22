import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { listingSlug, listingTitle, firstName, lastName, email, phone, company, signatureName, acknowledged } = body;

    if (!listingSlug || !listingTitle || !firstName?.trim() || !lastName?.trim() || !email?.trim() || !signatureName?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!acknowledged) {
      return NextResponse.json({ error: "You must acknowledge the confidentiality agreement" }, { status: 400 });
    }

    const submission = await prisma.ndaSubmission.create({
      data: {
        listingSlug: String(listingSlug).trim(),
        listingTitle: String(listingTitle).trim(),
        firstName: String(firstName).trim(),
        lastName: String(lastName).trim(),
        email: String(email).trim().toLowerCase(),
        phone: phone?.trim() || null,
        company: company?.trim() || null,
        signatureName: String(signatureName).trim(),
      },
    });

    return NextResponse.json({ success: true, id: submission.id });
  } catch (err) {
    console.error("NDA submission error:", err);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}

