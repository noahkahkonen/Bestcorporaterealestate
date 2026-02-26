"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { upload as blobUpload } from "@vercel/blob/client";
import {
  formatPriceInput,
  formatLeaseRateInput,
  formatNumberWithCommas,
  parseFormattedNumber,
} from "@/lib/format-admin-inputs";

const LISTING_TYPES = ["For Sale", "For Lease", "Sale/Lease"];
const OCCUPANCY_OPTIONS = ["Owner User", "Investment", "Owner User/Investment"];
const LEASE_TYPES = ["NNN", "MG", "FSG", "Modified"];
const PROPERTY_TYPES = ["Retail", "Industrial", "Office", "Multifamily", "Land", "Specialty", "Residential", "Business"];
const LAND_SUBCATEGORIES = ["Retail", "Office", "Industrial", "Specialty", "Residential"];

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function NewListingPage() {
  const router = useRouter();
  const [agents, setAgents] = useState<any[]>([]);
  const [features, setFeatures] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploadingBrochure, setUploadingBrochure] = useState(false);
  const brochureInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: "",
    address: "",
    city: "Columbus",
    state: "OH",
    zipCode: "",
    latitude: "39.9612",
    longitude: "-83.0007",
    listingType: "For Sale",
    propertyType: "Retail",
    landSubcategory: "",
    squareFeet: "",
    acreage: "",
    description: "",
    featuresJson: [] as string[],
    heroImage: "",
    galleryImagesJson: [] as string[],
    brochure: "",
    price: "",
    priceNegotiable: false,
    leaseType: "",
    leasePricePerSf: "",
    leaseNnnCharges: "",
    noi: "",
    capRate: "",
    occupancy: "",
    brokerIds: [] as string[],
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/agents").then(async (r) => {
        const data = await r.json().catch(() => ({}));
        return r.ok && Array.isArray(data) ? data : [];
      }),
      fetch("/api/admin/features").then(async (r) => {
        const data = await r.json().catch(() => ({}));
        return r.ok && Array.isArray(data) ? data : [];
      }),
    ]).then(([a, f]) => {
      setAgents(a);
      setFeatures(f);
    });
  }, []);

  function handleTitleChange(title: string) {
    setForm((f) => ({ ...f, title }));
  }

  async function handleFileUpload(file: File, field: "heroImage" | "galleryImagesJson" | "brochure") {
    if (field === "brochure") setUploadingBrochure(true);
    try {
      // Brochures > 4MB use client upload (bypasses 4.5MB server limit, supports up to 50MB)
      const useClientUpload = field === "brochure" && file.size > 4 * 1024 * 1024;
      if (useClientUpload) {
        const name = `listings/${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`;
        const blob = await blobUpload(name, file, {
          access: "public",
          handleUploadUrl: "/api/upload/blob-handler",
        });
        setForm((f) => ({ ...f, brochure: blob.url }));
        return;
      }
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "listings");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      let data: { url?: string; error?: string; detail?: string } = {};
      try {
        data = await res.json();
      } catch {
        alert(`Upload failed: server returned ${res.status} (not JSON)`);
        return;
      }
      if (data.url) {
        if (field === "heroImage") setForm((f) => ({ ...f, heroImage: data.url! }));
        else if (field === "galleryImagesJson") setForm((f) => ({ ...f, galleryImagesJson: [...f.galleryImagesJson, data.url!] }));
        else if (field === "brochure") setForm((f) => ({ ...f, brochure: data.url! }));
      } else {
        const msg = data.detail || data.error || "Upload failed.";
        alert(`Upload failed: ${msg}`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed.";
      alert(`Upload failed: ${msg}`);
      console.error("Brochure upload error:", err);
    } finally {
      if (field === "brochure") setUploadingBrochure(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          slug: slugify(form.title),
          address: form.address,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode || null,
          latitude: parseFloat(form.latitude) || 39.9612,
          longitude: parseFloat(form.longitude) || -83.0007,
          listingType: form.listingType,
          propertyType: form.propertyType,
          landSubcategory: form.propertyType === "Land" && form.landSubcategory ? form.landSubcategory : null,
          squareFeet: form.squareFeet ? parseFormattedNumber(form.squareFeet) || null : null,
          acreage: form.acreage ? parseFloat(form.acreage) : null,
          description: form.description,
          featuresJson: form.featuresJson,
          heroImage: form.heroImage || null,
          galleryImagesJson: form.galleryImagesJson.length ? JSON.stringify(form.galleryImagesJson) : null,
          brochure: form.brochure || null,
          price: form.priceNegotiable ? null : (form.price ? parseFormattedNumber(form.price) || null : null),
          priceNegotiable: form.priceNegotiable,
          leaseType: form.leaseType || null,
          leasePricePerSf: form.leasePricePerSf ? parseFloat(form.leasePricePerSf.replace(/,/g, "")) : null,
          leaseNnnCharges: form.leaseNnnCharges ? parseFloat(form.leaseNnnCharges) : null,
          noi: form.noi ? parseFormattedNumber(form.noi) || null : null,
          capRate: form.capRate ? parseFloat(form.capRate) / 100 : null,
          occupancy: form.occupancy || null,
          brokerIds: form.brokerIds,
        }),
      });
      if (res.ok) {
        const listing = await res.json();
        router.push(`/admin/listings/${listing.id}/edit`);
        router.refresh();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/listings" className="text-sm text-[var(--navy)] hover:underline">
          ← Listings
        </Link>
        <h1 className="text-2xl font-bold text-[var(--charcoal)]">New Listing</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--charcoal)]">Basics</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium">Title</label>
              <input
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Address</label>
              <input
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                required
                className="mt-1 w-full rounded-lg border px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">City</label>
              <input value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">State</label>
              <input value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">ZIP</label>
              <input value={form.zipCode} onChange={(e) => setForm((f) => ({ ...f, zipCode: e.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Latitude</label>
              <input value={form.latitude} onChange={(e) => setForm((f) => ({ ...f, latitude: e.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Longitude</label>
              <input value={form.longitude} onChange={(e) => setForm((f) => ({ ...f, longitude: e.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--charcoal)]">Property</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Listing Type</label>
              <select value={form.listingType} onChange={(e) => setForm((f) => ({ ...f, listingType: e.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2">
                {LISTING_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Property Type</label>
              <select value={form.propertyType} onChange={(e) => setForm((f) => ({ ...f, propertyType: e.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2">
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            {form.propertyType === "Land" && (
              <div>
                <label className="block text-sm font-medium">Land Subcategory</label>
                <select value={form.landSubcategory} onChange={(e) => setForm((f) => ({ ...f, landSubcategory: e.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2">
                  <option value="">—</option>
                  {LAND_SUBCATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium">Square Feet</label>
              <input
                type="text"
                inputMode="numeric"
                value={form.squareFeet}
                onChange={(e) => setForm((f) => ({ ...f, squareFeet: formatNumberWithCommas(e.target.value) }))}
                placeholder="6,500"
                className="mt-1 w-full rounded-lg border px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Acreage</label>
              <input type="number" step="0.1" value={form.acreage} onChange={(e) => setForm((f) => ({ ...f, acreage: e.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--charcoal)]">Description</h2>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={4}
            className="mt-4 w-full rounded-lg border px-3 py-2"
            placeholder="Property description..."
          />
          <div className="mt-4">
            <label className="block text-sm font-medium">Features (from options)</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {features.map((opt) => (
                <label key={opt.id} className="flex cursor-pointer items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={form.featuresJson.includes(opt.label)}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        featuresJson: e.target.checked ? [...f.featuresJson, opt.label] : f.featuresJson.filter((x) => x !== opt.label),
                      }))
                    }
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--charcoal)]">Images</h2>
          <div className="mt-4">
            <label className="block text-sm font-medium">Hero Image</label>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              {form.heroImage && (
                <div className="group relative">
                  <div className="relative h-20 w-28 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface-muted)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.heroImage} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, heroImage: "" }))}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-90 hover:opacity-100"
                      aria-label="Remove hero image"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileUpload(f, "heroImage");
                }}
                className="text-sm"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium">Gallery</label>
            <p className="mt-0.5 text-xs text-[var(--charcoal-light)]">Select multiple images at once (Ctrl/Cmd+click or drag to select)</p>
            <div className="mt-2 flex flex-wrap gap-3">
              {form.galleryImagesJson.map((url, i) => (
                <div key={`${url}-${i}`} className="group relative">
                  <div className="relative h-20 w-28 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface-muted)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, galleryImagesJson: f.galleryImagesJson.filter((_, idx) => idx !== i) }))}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-90 hover:opacity-100"
                      aria-label="Remove image"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={async (e) => {
                const files = e.target.files;
                if (files?.length) {
                  for (let i = 0; i < files.length; i++) {
                    await handleFileUpload(files[i]!, "galleryImagesJson");
                  }
                }
                e.target.value = "";
              }}
              className="mt-2 text-sm"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium">Brochure (PDF)</label>
            <div
              className="mt-1 flex min-h-[100px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-[var(--border)] bg-[var(--surface-muted)] p-4 transition-colors hover:border-[var(--navy)]"
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("border-[var(--navy)]", "bg-[var(--surface-hover)]"); }}
              onDragLeave={(e) => { e.currentTarget.classList.remove("border-[var(--navy)]", "bg-[var(--surface-hover)]"); }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove("border-[var(--navy)]", "bg-[var(--surface-hover)]");
                const f = e.dataTransfer.files?.[0];
                if (f?.type === "application/pdf") handleFileUpload(f, "brochure");
                else alert("Please drop a PDF file.");
              }}
              onClick={() => brochureInputRef.current?.click()}
            >
              <input
                ref={brochureInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileUpload(f, "brochure");
                  e.target.value = "";
                }}
              />
              {uploadingBrochure ? (
                <span className="text-sm text-[var(--charcoal-light)]">Uploading…</span>
              ) : form.brochure ? (
                <div className="group relative" onClick={(e) => e.stopPropagation()}>
                  <div className="relative flex h-20 w-28 flex-col items-center justify-center overflow-hidden rounded-lg border border-[var(--border)] bg-red-50/50 px-2">
                    <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span className="mt-1 truncate text-center text-xs text-[var(--charcoal-light)] max-w-full">{form.brochure.split("/").pop()}</span>
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, brochure: "" }))}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-90 hover:opacity-100"
                      aria-label="Remove brochure"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <span className="cursor-pointer text-center text-sm text-[var(--charcoal-light)] hover:text-[var(--navy)]">
                  Drop PDF here or click to browse
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--charcoal)]">Pricing</h2>

          {/* Occupancy: For Sale and Sale/Lease only */}
          {(form.listingType === "For Sale" || form.listingType === "Sale/Lease") && (
            <div className="mt-4">
              <label className="block text-sm font-medium">Occupancy</label>
              <select
                value={form.occupancy}
                onChange={(e) => setForm((f) => ({ ...f, occupancy: e.target.value }))}
                className="mt-1 w-full max-w-xs rounded-lg border px-3 py-2"
              >
                <option value="">—</option>
                {OCCUPANCY_OPTIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          )}

          {/* For Sale: Price box only */}
          {form.listingType === "For Sale" && (
            <>
              <div className="mt-4 flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.priceNegotiable} onChange={(e) => setForm((f) => ({ ...f, priceNegotiable: e.target.checked }))} />
                  Negotiable
                </label>
              </div>
              {!form.priceNegotiable && (
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium">Price</label>
                    <div className="mt-1 flex items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--navy)] focus-within:ring-inset">
                      <span className="pl-3 text-[var(--muted)]">$</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={form.price}
                        onChange={(e) => {
                          const price = formatPriceInput(e.target.value);
                          setForm((f) => {
                            const next = { ...f, price };
                            const p = parseFormattedNumber(price);
                            const n = parseFormattedNumber(f.noi);
                            if (p > 0 && !Number.isNaN(p) && n > 0 && !Number.isNaN(n)) {
                              next.capRate = ((n / p) * 100).toFixed(2).replace(/\.?0+$/, "");
                            }
                            return next;
                          });
                        }}
                        placeholder="1,500,000"
                        className="w-full border-0 bg-transparent py-2 pr-2 focus:outline-none focus:ring-0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">NOI</label>
                    <div className="mt-1 flex items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--navy)] focus-within:ring-inset">
                      <span className="pl-3 text-[var(--muted)]">$</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={form.noi}
                        onChange={(e) => {
                          const noi = formatNumberWithCommas(e.target.value);
                          setForm((f) => {
                            const next = { ...f, noi };
                            const p = parseFormattedNumber(f.price);
                            const n = parseFormattedNumber(noi);
                            if (p > 0 && !Number.isNaN(p) && n > 0 && !Number.isNaN(n)) {
                              next.capRate = ((n / p) * 100).toFixed(2).replace(/\.?0+$/, "");
                            }
                            return next;
                          });
                        }}
                        placeholder="120,000"
                        className="w-full border-0 bg-transparent py-2 pr-2 focus:outline-none focus:ring-0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Cap Rate (%)</label>
                    <input type="number" step="0.01" value={form.capRate} onChange={(e) => setForm((f) => ({ ...f, capRate: e.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2 bg-[var(--surface-muted)]" placeholder="Auto (NOI ÷ Price)" />
                  </div>
                </div>
              )}
            </>
          )}

          {/* For Lease: Lease Price box only */}
          {form.listingType === "For Lease" && (
            <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-4">
              <p className="mb-3 text-sm text-[var(--charcoal-light)]">This is price on a $/SF/Y basis</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium">Lease Type</label>
                  <select
                    value={form.leaseType}
                    onChange={(e) => setForm((f) => ({ ...f, leaseType: e.target.value }))}
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  >
                    <option value="">—</option>
                    {LEASE_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                {form.leaseType && (
                  <div>
                    <label className="block text-sm font-medium">Lease Price ($/SF/Y)</label>
                    <div className="mt-1 flex items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--navy)] focus-within:ring-inset">
                      <span className="pl-3 text-[var(--muted)]">$</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={form.leasePricePerSf}
                        onChange={(e) => setForm((f) => ({ ...f, leasePricePerSf: formatLeaseRateInput(e.target.value) }))}
                        placeholder="10.00"
                        className="w-full border-0 bg-transparent py-2 pr-2 focus:outline-none focus:ring-0"
                      />
                      <span className="pr-3 text-[var(--muted)]">/SF</span>
                    </div>
                  </div>
                )}
                {form.leaseType === "NNN" && (
                  <div>
                    <label className="block text-sm font-medium">NNN charges</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.leaseNnnCharges}
                      onChange={(e) => setForm((f) => ({ ...f, leaseNnnCharges: e.target.value }))}
                      className="mt-1 w-full rounded-lg border px-3 py-2"
                      placeholder="3"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* For Sale/Lease: both Price and Lease Price */}
          {form.listingType === "Sale/Lease" && (
            <>
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-[var(--charcoal)]">Price</p>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={form.priceNegotiable} onChange={(e) => setForm((f) => ({ ...f, priceNegotiable: e.target.checked }))} />
                    Negotiable
                  </label>
                </div>
                {!form.priceNegotiable && (
                  <div className="mt-3 grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-medium text-[var(--charcoal-light)]">Sale Price</label>
                      <div className="mt-1 flex items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--navy)] focus-within:ring-inset">
                        <span className="pl-3 text-xs text-[var(--muted)]">$</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={form.price}
                          onChange={(e) => {
                            const price = formatPriceInput(e.target.value);
                            setForm((f) => {
                              const next = { ...f, price };
                              const p = parseFormattedNumber(price);
                              const n = parseFormattedNumber(f.noi);
                              if (p > 0 && !Number.isNaN(p) && n > 0 && !Number.isNaN(n)) {
                                next.capRate = ((n / p) * 100).toFixed(2).replace(/\.?0+$/, "");
                              }
                              return next;
                            });
                          }}
                          placeholder="1,500,000"
                          className="w-full border-0 bg-transparent py-2 pr-2 text-sm focus:outline-none focus:ring-0"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--charcoal-light)]">NOI</label>
                      <div className="mt-1 flex items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--navy)] focus-within:ring-inset">
                        <span className="pl-3 text-xs text-[var(--muted)]">$</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={form.noi}
                          onChange={(e) => {
                            const noi = formatNumberWithCommas(e.target.value);
                            setForm((f) => {
                              const next = { ...f, noi };
                              const p = parseFormattedNumber(f.price);
                              const n = parseFormattedNumber(noi);
                              if (p > 0 && !Number.isNaN(p) && n > 0 && !Number.isNaN(n)) {
                                next.capRate = ((n / p) * 100).toFixed(2).replace(/\.?0+$/, "");
                              }
                              return next;
                            });
                          }}
                          placeholder="120,000"
                          className="w-full border-0 bg-transparent py-2 pr-2 text-sm focus:outline-none focus:ring-0"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--charcoal-light)]">Cap Rate (%)</label>
                      <input type="number" step="0.01" value={form.capRate} onChange={(e) => setForm((f) => ({ ...f, capRate: e.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2 bg-[var(--surface-muted)]" placeholder="Auto (NOI ÷ Price)" />
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-4">
                <p className="mb-3 text-sm font-medium text-[var(--charcoal)]">Lease Price</p>
                <p className="mb-3 text-xs text-[var(--charcoal-light)]">This is price on a $/SF/Y basis</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium">Lease Type</label>
                    <select
                      value={form.leaseType}
                      onChange={(e) => setForm((f) => ({ ...f, leaseType: e.target.value }))}
                      className="mt-1 w-full rounded-lg border px-3 py-2"
                    >
                      <option value="">—</option>
                      {LEASE_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  {form.leaseType && (
                    <div>
                      <label className="block text-sm font-medium">Lease Price ($/SF/Y)</label>
                      <div className="mt-1 flex items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--navy)] focus-within:ring-inset">
                        <span className="pl-3 text-[var(--muted)]">$</span>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={form.leasePricePerSf}
                          onChange={(e) => setForm((f) => ({ ...f, leasePricePerSf: formatLeaseRateInput(e.target.value) }))}
                          placeholder="10.00"
                          className="w-full border-0 bg-transparent py-2 pr-2 focus:outline-none focus:ring-0"
                        />
                        <span className="pr-3 text-[var(--muted)]">/SF</span>
                      </div>
                    </div>
                  )}
                  {form.leaseType === "NNN" && (
                    <div>
                      <label className="block text-sm font-medium">NNN charges</label>
                      <input
                        type="number"
                        step="0.01"
                        value={form.leaseNnnCharges}
                        onChange={(e) => setForm((f) => ({ ...f, leaseNnnCharges: e.target.value }))}
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                        placeholder="3"
                      />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--charcoal)]">Brokers</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {agents.map((a) => (
              <label key={a.id} className="flex cursor-pointer items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={form.brokerIds.includes(a.id)}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      brokerIds: e.target.checked ? [...f.brokerIds, a.id] : f.brokerIds.filter((x) => x !== a.id),
                    }))
                  }
                />
                {a.name}
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="rounded-lg bg-[var(--navy)] px-6 py-2.5 font-semibold text-white disabled:opacity-50">
            {saving ? "Saving..." : "Create Listing"}
          </button>
          <Link href="/admin/listings" className="rounded-lg border px-6 py-2.5 font-medium">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
