"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LoadScriptNext, GoogleMap, useGoogleMap } from "@react-google-maps/api";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Listing } from "@/types/listing";

const DEFAULT_CENTER = { lat: 39.9612, lng: -83.0007 };
const DEFAULT_ZOOM = 10;
const MAP_CONTAINER_STYLE = { width: "100%", height: "100%" };

function MapMarkers({
  listings,
  onSelectListing,
}: {
  listings: Listing[];
  onSelectListing: (listing: Listing) => void;
}) {
  const map = useGoogleMap();
  const markersRef = useRef<google.maps.Marker[]>([]);
  const clustererRef = useRef<MarkerClusterer | null>(null);

  useEffect(() => {
    if (!map || !listings.length) return;
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    clustererRef.current?.clearMarkers();
    clustererRef.current = null;

    const bounds = new google.maps.LatLngBounds();
    const markers: google.maps.Marker[] = [];
    listings.forEach((listing) => {
      const position = { lat: listing.latitude, lng: listing.longitude };
      bounds.extend(position);
      const marker = new google.maps.Marker({
        map,
        position,
        title: listing.title,
      });
      marker.addListener("click", () => onSelectListing(listing));
      markers.push(marker);
    });
    markersRef.current = markers;

    if (markers.length > 1) {
      try {
        clustererRef.current = new MarkerClusterer({ map, markers });
      } catch {
        // ignore
      }
    }
    if (listings.length === 1) {
      map.setCenter({ lat: listings[0].latitude, lng: listings[0].longitude });
      map.setZoom(14);
    } else {
      map.fitBounds(bounds, { top: 48, right: 48, bottom: 48, left: 48 });
    }
    return () => {
      markers.forEach((m) => m.setMap(null));
      clustererRef.current?.clearMarkers();
    };
  }, [map, listings, onSelectListing]);

  return null;
}

function MapWithMarkers({
  listings,
  selectedListing,
  onSelectListing,
}: {
  listings: Listing[];
  selectedListing: Listing | null;
  onSelectListing: (listing: Listing | null) => void;
}) {
  const handleSelect = useCallback(
    (listing: Listing) => onSelectListing(listing),
    [onSelectListing]
  );

  return (
    <div className="relative h-full min-h-[400px] w-full">
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        options={{
          zoomControl: true,
          mapTypeControl: true,
          fullscreenControl: true,
          streetViewControl: false,
          styles: [
            { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
          ],
        }}
      >
        <MapMarkers listings={listings} onSelectListing={handleSelect} />
      </GoogleMap>
      {selectedListing && (
        <div
          className="absolute bottom-4 left-4 right-4 z-10 max-w-md rounded-lg border border-gray-200 bg-white p-4 shadow-lg sm:left-6"
          role="dialog"
          aria-label="Listing info"
        >
          <div className="flex gap-3">
            <div className="h-20 w-24 flex-shrink-0 overflow-hidden rounded bg-gray-100">
              <div className="placeholder-img h-full w-full" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[var(--charcoal)]">
                {selectedListing.title}
              </p>
              <p className="text-sm text-[var(--charcoal-light)]">
                {selectedListing.address}, {selectedListing.city},{" "}
                {selectedListing.state}
              </p>
              <a
                href={`/listings/${selectedListing.slug}`}
                className="mt-2 inline-block text-sm font-semibold text-[var(--navy)] hover:underline"
              >
                View property →
              </a>
            </div>
          </div>
          <button
            type="button"
            className="absolute right-2 top-2 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
            onClick={() => onSelectListing(null)}
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default function ListingsMap({
  listings,
  selectedListing,
  onSelectListing,
}: {
  listings: Listing[];
  selectedListing: Listing | null;
  onSelectListing: (listing: Listing | null) => void;
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey || apiKey === "your_google_maps_api_key_here") {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center bg-gray-100 text-[var(--charcoal-light)]">
        <p className="px-4 text-center text-sm">
          Map placeholder. Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local to show the map.
        </p>
      </div>
    );
  }

  return (
    <LoadScriptNext googleMapsApiKey={apiKey}>
      <MapWithMarkers
        listings={listings}
        selectedListing={selectedListing}
        onSelectListing={onSelectListing}
      />
    </LoadScriptNext>
  );
}
