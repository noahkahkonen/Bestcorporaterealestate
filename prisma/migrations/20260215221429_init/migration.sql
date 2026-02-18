-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "ext" TEXT,
    "credentials" TEXT,
    "website" TEXT,
    "headshot" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "service" TEXT,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "FeatureOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "nickname" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'OH',
    "zipCode" TEXT,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "listingType" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "squareFeet" INTEGER,
    "acreage" REAL,
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
    "noi" REAL,
    "price" REAL,
    "capRate" REAL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ListingBroker" (
    "listingId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,

    PRIMARY KEY ("listingId", "agentId"),
    CONSTRAINT "ListingBroker_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ListingBroker_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "FeatureOption_label_key" ON "FeatureOption"("label");

-- CreateIndex
CREATE UNIQUE INDEX "Listing_slug_key" ON "Listing"("slug");
