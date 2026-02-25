-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL,
    "slug" TEXT,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "ext" TEXT,
    "credentials" TEXT,
    "website" TEXT,
    "linkedIn" TEXT,
    "description" TEXT,
    "notableDealsJson" TEXT,
    "headshot" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "service" TEXT,
    "message" TEXT NOT NULL,
    "listingSlug" TEXT,
    "listingTitle" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureOption" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "FeatureOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "nickname" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'OH',
    "zipCode" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "listingType" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "landSubcategory" TEXT,
    "squareFeet" INTEGER,
    "acreage" DOUBLE PRECISION,
    "isMultiTenant" BOOLEAN NOT NULL DEFAULT false,
    "unitCount" INTEGER,
    "unitsJson" TEXT,
    "description" TEXT NOT NULL,
    "featuresJson" TEXT NOT NULL,
    "heroImage" TEXT,
    "galleryImagesJson" TEXT,
    "floorPlan" TEXT,
    "sitePlan" TEXT,
    "brochure" TEXT,
    "youtubeLink" TEXT,
    "noi" DOUBLE PRECISION,
    "price" DOUBLE PRECISION,
    "priceNegotiable" BOOLEAN NOT NULL DEFAULT false,
    "leaseType" TEXT,
    "leasePricePerSf" DOUBLE PRECISION,
    "leaseNnnCharges" DOUBLE PRECISION,
    "capRate" DOUBLE PRECISION,
    "occupancy" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "transactionOutcome" TEXT,
    "soldPrice" DOUBLE PRECISION,
    "soldDate" TIMESTAMP(3),
    "soldNotes" TEXT,
    "financialDocPath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingBroker" (
    "listingId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,

    CONSTRAINT "ListingBroker_pkey" PRIMARY KEY ("listingId","agentId")
);

-- CreateTable
CREATE TABLE "News" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL DEFAULT '',
    "imageUrl" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsLink" (
    "id" TEXT NOT NULL,
    "newsId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "NewsLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NdaSubmission" (
    "id" TEXT NOT NULL,
    "listingSlug" TEXT NOT NULL,
    "listingTitle" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "signatureName" TEXT NOT NULL,
    "acknowledgedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "approvalToken" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NdaSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaseApplication" (
    "id" TEXT NOT NULL,
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
    "applicationFeeCents" INTEGER,
    "stripePaymentIntentId" TEXT,
    "paymentStatus" TEXT,
    "received" BOOLEAN NOT NULL DEFAULT false,
    "coApplicantDataJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeaseApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Agent_slug_key" ON "Agent"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "FeatureOption_label_key" ON "FeatureOption"("label");

-- CreateIndex
CREATE UNIQUE INDEX "Listing_slug_key" ON "Listing"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "News_slug_key" ON "News"("slug");

-- CreateIndex
CREATE INDEX "NewsLink_newsId_idx" ON "NewsLink"("newsId");

-- CreateIndex
CREATE UNIQUE INDEX "NdaSubmission_approvalToken_key" ON "NdaSubmission"("approvalToken");

-- AddForeignKey
ALTER TABLE "ListingBroker" ADD CONSTRAINT "ListingBroker_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingBroker" ADD CONSTRAINT "ListingBroker_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsLink" ADD CONSTRAINT "NewsLink_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News"("id") ON DELETE CASCADE ON UPDATE CASCADE;
