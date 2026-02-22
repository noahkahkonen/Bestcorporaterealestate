import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe, APPLICATION_FEE_CENTS } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: "Payments are not configured." }, { status: 503 });
  }

  try {
    const { applicationId } = await request.json();
    if (!applicationId || typeof applicationId !== "string") {
      return NextResponse.json({ error: "Application ID is required." }, { status: 400 });
    }

    const application = await prisma.leaseApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found." }, { status: 404 });
    }

    if (application.paymentStatus === "paid") {
      return NextResponse.json({ error: "Application has already been paid." }, { status: 400 });
    }

    const amount = application.applicationFeeCents ?? APPLICATION_FEE_CENTS;
    if (amount < 50) {
      return NextResponse.json({ error: "Invalid payment amount." }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        applicationId: application.id,
        listingSlug: application.listingSlug,
        email: application.email,
      },
    });

    await prisma.leaseApplication.update({
      where: { id: applicationId },
      data: {
        stripePaymentIntentId: paymentIntent.id,
        applicationFeeCents: amount,
        paymentStatus: "pending",
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    });
  } catch (err) {
    console.error("Payment intent error:", err);
    return NextResponse.json({ error: "Failed to create payment." }, { status: 500 });
  }
}
