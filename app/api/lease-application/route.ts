import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

const UPLOAD_BASE = path.join(process.cwd(), "public", "uploads", "lease-applications");

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9.-]/g, "_").slice(0, 100);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const listingSlug = String(formData.get("listingSlug") ?? "");
    const listingTitle = String(formData.get("listingTitle") ?? "");
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const businessName = String(formData.get("businessName") ?? "").trim() || null;
    const use = String(formData.get("use") ?? "").trim() || null;
    const dateOfBirth = String(formData.get("dateOfBirth") ?? "").trim() || null;
    const phone = String(formData.get("phone") ?? "").trim() || null;
    const email = String(formData.get("email") ?? "").trim();
    const ssn = String(formData.get("ssn") ?? "").trim().replace(/\D/g, "") || null;
    const creditCheckAcknowledged = formData.get("creditCheckAcknowledged") === "true";
    const signatureName = String(formData.get("signatureName") ?? "").trim();

    const coApplicantFirstName = String(formData.get("coApplicantFirstName") ?? "").trim();
    const coApplicantLastName = String(formData.get("coApplicantLastName") ?? "").trim();
    const coApplicantSignatureName = String(formData.get("coApplicantSignatureName") ?? "").trim();
    const hasCoApplicant = !!(coApplicantFirstName || coApplicantLastName);
    const coApplicantDataJson = hasCoApplicant
      ? JSON.stringify({
          firstName: coApplicantFirstName,
          lastName: coApplicantLastName,
          dateOfBirth: String(formData.get("coApplicantDateOfBirth") ?? "").trim() || null,
          phone: String(formData.get("coApplicantPhone") ?? "").trim() || null,
          email: String(formData.get("coApplicantEmail") ?? "").trim() || null,
          ssn: String(formData.get("coApplicantSsn") ?? "").trim().replace(/\D/g, "") || null,
          signatureName: coApplicantSignatureName || null,
        })
      : null;

    if (!firstName || !lastName || !email || !signatureName) {
      return NextResponse.json(
        { error: "First name, last name, email, and signature are required." },
        { status: 400 }
      );
    }
    if (!creditCheckAcknowledged) {
      return NextResponse.json(
        { error: "You must acknowledge the background and credit check permission." },
        { status: 400 }
      );
    }
    if (hasCoApplicant && !coApplicantSignatureName) {
      return NextResponse.json(
        { error: "Co-applicant signature is required when a co-applicant is added." },
        { status: 400 }
      );
    }
    if (!listingSlug || !listingTitle) {
      return NextResponse.json({ error: "Invalid listing." }, { status: 400 });
    }

    const appId = `app-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const appDir = path.join(UPLOAD_BASE, appId);
    await mkdir(appDir, { recursive: true });

    let businessPlanPath: string | null = null;
    const businessPlanFile = formData.get("businessPlan") as File | null;
    if (businessPlanFile && businessPlanFile.size > 0) {
      const ext = path.extname(businessPlanFile.name) || ".pdf";
      const name = `business-plan-${sanitizeFilename(businessPlanFile.name)}${ext}`;
      const filePath = path.join(appDir, name);
      await writeFile(filePath, Buffer.from(await businessPlanFile.arrayBuffer()));
      businessPlanPath = `/uploads/lease-applications/${appId}/${name}`;
    }

    const financialPaths: string[] = [];
    const financialFiles = formData.getAll("financials") as File[];
    for (let i = 0; i < financialFiles.length; i++) {
      const f = financialFiles[i];
      if (f && f.size > 0) {
        const ext = path.extname(f.name) || ".pdf";
        const name = `financial-${i + 1}-${sanitizeFilename(f.name)}${ext}`;
        const filePath = path.join(appDir, name);
        await writeFile(filePath, Buffer.from(await f.arrayBuffer()));
        financialPaths.push(`/uploads/lease-applications/${appId}/${name}`);
      }
    }

    const APPLICATION_FEE_CENTS = Number(process.env.APPLICATION_FEE_CENTS) || 5000;

    const application = await prisma.leaseApplication.create({
      data: {
        listingSlug,
        listingTitle,
        firstName,
        lastName,
        businessName,
        use,
        dateOfBirth,
        phone,
        email,
        ssn: ssn || null,
        businessPlanPath,
        financialsPathsJson: financialPaths.length ? JSON.stringify(financialPaths) : null,
        creditCheckAcknowledged,
        signatureName,
        coApplicantDataJson,
        applicationFeeCents: APPLICATION_FEE_CENTS,
        paymentStatus: "pending",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully.",
      applicationId: application.id,
      paymentRequired: true,
    });
  } catch (err) {
    console.error("Lease application error:", err);
    return NextResponse.json({ error: "Failed to submit application." }, { status: 500 });
  }
}
