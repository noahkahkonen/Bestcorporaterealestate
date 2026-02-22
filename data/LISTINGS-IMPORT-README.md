# Listings Bulk Import Template

Use `listings-import-template.csv` to bulk add listings. Open in Excel, fill in your data, then run the import script.

## How to Import

1. Copy `listings-import-template.csv` and rename (e.g. `my-listings.csv`)
2. Fill in your listing data (delete the example rows first)
3. Run: `npm run db:import-listings -- data/my-listings.csv`
   - Or: `npx tsx scripts/bulk-import-listings.ts data/my-listings.csv`

## Column Reference

| Column | Required | Format | Valid Values / Notes |
|--------|----------|--------|----------------------|
| **title** | Yes | Text | Display name of the property |
| **slug** | No | Text | URL-friendly (e.g. `high-street-retail`). Auto-generated from title if blank |
| **nickname** | No | Text | Short name |
| **address** | Yes | Text | Street address |
| **city** | Yes | Text | City |
| **state** | Yes | Text | State (default: OH) |
| **zipCode** | No | Text | Zip code |
| **latitude** | Yes | Number | e.g. 39.9612 |
| **longitude** | Yes | Number | e.g. -83.0007 |
| **listingType** | Yes | Text | `For Sale` \| `For Lease` \| `Sale/Lease` |
| **propertyType** | Yes | Text | `Retail` \| `Industrial` \| `Office` \| `Multifamily` \| `Land` \| `Specialty` \| `Residential` \| `Business` |
| **landSubcategory** | No | Text | When propertyType=Land: `Retail` \| `Office` \| `Industrial` \| `Specialty` \| `Residential` |
| **squareFeet** | No | Integer | Square footage |
| **acreage** | No | Number | Acres (for land) |
| **isMultiTenant** | No | Boolean | `true` \| `false` |
| **unitCount** | No | Integer | Number of units (multi-tenant) |
| **description** | Yes | Text | Full property description |
| **features** | No | Pipe-separated | e.g. `Dock High|Parking|Build-Out Ready` |
| **price** | No | Number | Sale price (no commas) |
| **priceNegotiable** | No | Boolean | `true` \| `false` |
| **leaseType** | No | Text | For lease: `NNN` \| `MG` \| `FSG` \| `Modified` |
| **leasePricePerSf** | No | Number | $/SF/year for lease |
| **leaseNnnCharges** | No | Number | $/SF NNN charges (when leaseType=NNN) |
| **noi** | No | Number | Net Operating Income |
| **capRate** | No | Number | Cap rate as decimal (e.g. 0.08 for 8%) |
| **occupancy** | No | Text | `Owner User` \| `Investment` \| `Owner User/Investment` |
| **heroImage** | No | Text | Path e.g. `/images/listings/hero.jpg` |
| **galleryImages** | No | Pipe-separated | e.g. `/img/1.jpg|/img/2.jpg` |
| **floorPlan** | No | Text | Path to floor plan |
| **sitePlan** | No | Text | Path to site plan |
| **brochure** | No | Text | Path to brochure PDF |
| **youtubeLink** | No | Text | Full YouTube URL |
| **brokerEmails** | No | Pipe-separated | Agent emails (agents must exist). e.g. `john@firm.com|jane@firm.com` |
| **status** | No | Text | `Active` \| `Pending` \| `Sold` (default: Active) |
| **transactionOutcome** | No | Text | When status=Sold: `Sold` \| `Leased` (for Sale/Lease) |
| **soldPrice** | No | Number | Final sale/lease price when sold |
| **soldDate** | No | Date | ISO date e.g. 2024-01-15 |
| **soldNotes** | No | Text | Transaction notes |

## Tips

- **Coordinates**: Use [Google Maps](https://www.google.com/maps) – right-click a location → "What's here" to get lat/long
- **Features**: Separate with pipe `|` (no spaces around pipe)
- **brokerEmails**: Agents must already exist in the system. Use exact email addresses.
- **Images**: Paths are relative to `public/` (e.g. `/images/listings/photo.jpg` → `public/images/listings/photo.jpg`)
