-- CreateTable
CREATE TABLE "LeaseApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listingSlug" TEXT NOT NULL,
    "listingTitle" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "businessName" TEXT,
    "use" TEXT,
    "dateOfBirth" TEXT,
    "phone" TEXT,
    "email" TEXT NOT NULL,
    "ssn" TEXT,
    "businessPlanPath" TEXT,
    "financialsPathsJson" TEXT,
    "creditCheckAcknowledged" BOOLEAN NOT NULL DEFAULT false,
    "signatureName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
