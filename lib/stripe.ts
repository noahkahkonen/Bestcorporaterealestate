import Stripe from "stripe";

const secret = process.env.STRIPE_SECRET_KEY;
if (!secret) {
  console.warn("STRIPE_SECRET_KEY is not set. Payment features will not work.");
}

export const stripe = secret ? new Stripe(secret) : null;

export const APPLICATION_FEE_CENTS = Number(process.env.APPLICATION_FEE_CENTS) || 5000; // $50 default
