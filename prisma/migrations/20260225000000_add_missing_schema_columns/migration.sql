-- Add missing columns to Agent
ALTER TABLE "Agent" ADD COLUMN "slug" TEXT;
ALTER TABLE "Agent" ADD COLUMN "notableDealsJson" TEXT;
ALTER TABLE "Agent" ADD COLUMN "description" TEXT;
ALTER TABLE "Agent" ADD COLUMN "linkedIn" TEXT;

-- Add missing columns to Listing
ALTER TABLE "Listing" ADD COLUMN "occupancy" TEXT;
ALTER TABLE "Listing" ADD COLUMN "status" TEXT DEFAULT 'Active';
ALTER TABLE "Listing" ADD COLUMN "transactionOutcome" TEXT;
ALTER TABLE "Listing" ADD COLUMN "soldPrice" REAL;
ALTER TABLE "Listing" ADD COLUMN "soldDate" DATETIME;
ALTER TABLE "Listing" ADD COLUMN "soldNotes" TEXT;
ALTER TABLE "Listing" ADD COLUMN "financialDocPath" TEXT;
