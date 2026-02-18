-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Listing" (
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
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Listing" ("acreage", "address", "brochure", "capRate", "city", "createdAt", "description", "featuresJson", "floorPlan", "galleryImagesJson", "heroImage", "id", "isMultiTenant", "latitude", "listingType", "longitude", "nickname", "noi", "price", "propertyType", "published", "sitePlan", "slug", "squareFeet", "state", "title", "unitCount", "unitsJson", "updatedAt", "youtubeLink", "zipCode") SELECT "acreage", "address", "brochure", "capRate", "city", "createdAt", "description", "featuresJson", "floorPlan", "galleryImagesJson", "heroImage", "id", "isMultiTenant", "latitude", "listingType", "longitude", "nickname", "noi", "price", "propertyType", "published", "sitePlan", "slug", "squareFeet", "state", "title", "unitCount", "unitsJson", "updatedAt", "youtubeLink", "zipCode" FROM "Listing";
DROP TABLE "Listing";
ALTER TABLE "new_Listing" RENAME TO "Listing";
CREATE UNIQUE INDEX "Listing_slug_key" ON "Listing"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
