-- Idempotent: fixes prod if a prior migrate ran against the wrong DB (DIRECT_URL vs DATABASE_URL mismatch).
ALTER TABLE "Listing" ADD COLUMN IF NOT EXISTS "capRatePricingCall" BOOLEAN NOT NULL DEFAULT false;
